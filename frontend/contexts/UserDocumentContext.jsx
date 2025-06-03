"use client";
import { useContext, useState, createContext, useEffect } from "react";
import { usePMContext } from "@/contexts/PubMedContext";
import { useUserContext } from "@/contexts/UserContext";
import { apiCall } from "@/utilities/api";

const UserDocumentContext = createContext();

export const useUserDocContext = () => useContext(UserDocumentContext);

export const UserDocumentProvider = ({ children }) => {
    const { getPMCSummaries } = usePMContext();
    const { user } = useUserContext();
    const [allUserDocuments, setAllUserDocuments] = useState([]);
    const [favoriteDocuments, setFavoriteDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch user documents and favorites on login 
    useEffect(() => {
        if (user?.id && allUserDocuments.length === 0) {
            getAllUserDocuments();
            getFavoriteStudies();
        } else if (!user?.id) {
            setAllUserDocuments([]);
            setFavoriteDocuments([]);
        }
    }, [user?.id]);

    const addUserDocument = async (pmcID) => {
        try {
            const studyData = {
                study_id: pmcID, 
            }
            console.log("Adding document with data:", studyData);
            const response = await apiCall("/api/annotated_studies/", {
                method: "POST",
                body: JSON.stringify(studyData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Document added successfully:", data.message);
                // Refresh the user documents after adding a new one
                await refreshUserDocuments();
                return { success: true };
            }
            
            const errorData = await response.json();
            throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
        } catch (error) {
            console.error("Error adding document:", error);
            return { success: false, error: error.message };
        }
    };


    const getAllUserDocumentIDs = async () => {
        setLoading(true);
        try {
            console.log("Fetching all user document IDs...");
            const response = await apiCall("/api/annotated_studies/", {
                method: "GET",
            });

            if (response.ok) {
                const data = await response.json();
                console.log("User Documents retrieved:", data.annotated_studies);
                setAllUserDocuments(data.annotated_studies);
                return { success: true, documents: data.annotated_studies };
            }

            const errorData = await response.json();
            throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
        } catch (error) {
            console.error("Error getting users document:", error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };


    const getAllUserDocuments = async () => {
        setLoading(true);
        try {
            // Fetch all user documents from backend
            const userDocumentIDs = await getAllUserDocumentIDs();
            
            if (userDocumentIDs.success === false || userDocumentIDs.documents.length === 0) {
                console.log("No articles found.");
                setAllUserDocuments([]);
                return { summaries: [] };
            }

            const strippedIDs = userDocumentIDs.documents.map(id =>
                typeof id === "string" && id.startsWith("PMC") ? id.replace(/^PMC/, "") : id
            );
            
            // fetch additional info from pubmed for each PMC ID
            const summaries = await getPMCSummaries(strippedIDs);
            
            if (summaries.length === 0) {
                console.log("No summaries found.");
                setAllUserDocuments([]);
                return { summaries: [] };
            }

            // Store in context state
            setAllUserDocuments(summaries);
            return { summaries: summaries };
        } catch (error) {
            console.error("Error fetching user documents:", error);
            setAllUserDocuments([]);
            return { summaries: [] };
        } finally {
            setLoading(false);
        }
    };

    const refreshUserDocuments = async () => {
        return await getAllUserDocuments();
    };

    const getFavoriteStudies = async () => {
        try {
            console.log("Fetching favorite studies...");
            const response = await apiCall("/api/favorite_studies/", {
                method: "GET",
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Favorite studies retrieved:", data.favorite_studies); // Changed from favorited_studies
                setFavoriteDocuments(data.favorite_studies || []); // Changed from favorited_studies
                return { success: true, favorites: data.favorite_studies || [] }; // Changed from favorited_studies
            }

            const errorData = await response.json();
            throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
        } catch (error) {
            console.error("Error fetching favorite studies:", error);
            setFavoriteDocuments([]);
            return { success: false, error: error.message };
        }
    };

    const addFavoriteStudy = async (pmcID) => {
        try {
            console.log("Adding favorite study:", pmcID);
            const response = await apiCall("/api/favorite_studies/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ study_id: pmcID }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Study favorited:", data.message);
                setFavoriteDocuments(prev => [...prev, pmcID]);
                return { success: true, message: data.message };
            }

            const errorData = await response.json();
            throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
        } catch (error) {
            console.error("Error adding favorite study:", error);
            return { success: false, error: error.message };
        }
    };

    const removeFavoriteStudy = async (pmcID) => {
        try {
            console.log("Removing favorite study:", pmcID);
            const response = await apiCall("/api/favorite_studies/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ study_id: pmcID }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Study unfavorited:", data.message);
                setFavoriteDocuments(prev => prev.filter(id => id !== pmcID));
                return { success: true, message: data.message };
            }

            const errorData = await response.json();
            throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
        } catch (error) {
            console.error("Error removing favorite study:", error);
            return { success: false, error: error.message };
        }
    };

    const toggleFavorite = async (pmcID) => {
        // Check if it's currently favorited
        const isFavorited = favoriteDocuments.includes(pmcID);
        
        if (isFavorited) {
            return await removeFavoriteStudy(pmcID);
        } else {
            return await addFavoriteStudy(pmcID);
        }
    };

    const isFavorite = (pmcID) => {
        return favoriteDocuments.includes(pmcID);
    };

    const contextValue = {
        allUserDocuments,
        addUserDocument,
        getAllUserDocuments,
        getAllUserDocumentIDs,
        refreshUserDocuments,
        loading,
        favoriteDocuments,
        getFavoriteStudies,
        addFavoriteStudy,
        removeFavoriteStudy,
        toggleFavorite,
        isFavorite,
    };

    return (
        <UserDocumentContext.Provider value={contextValue}>
            {children}
        </UserDocumentContext.Provider>
    );
};
