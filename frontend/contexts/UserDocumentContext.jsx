"use client";
import { useContext, useState, createContext, useEffect } from "react";
import { usePMContext } from "@/contexts/PubMedContext";
import { useUserContext } from "@/contexts/UserContext";

const UserDocumentContext = createContext();

export const useUserDocContext = () => useContext(UserDocumentContext);

export const UserDocumentProvider = ({ children }) => {
    const { getPMCSummaries } = usePMContext();
    const { user } = useUserContext();
    const [allUserDocuments, setAllUserDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch user documents on login 
    useEffect(() => {
        if (user?.id && allUserDocuments.length === 0) {
            getAllUserDocuments();
        } else if (!user?.id) {
            setAllUserDocuments([]);
        }
    }, [user?.id]);

    const addUserDocument = async (pmcID) => {
        try {
            const studyData = {
                study_id: pmcID, 
            }

            const response = await fetch(`http://127.0.0.1:8000/api/annotated_studies/`,{
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                 // "X-CSRFToken": "<csrftoken>", // Replace with actual token
                },
                credentials: "include",
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
            return { success: false, error: errorData.error };
        } catch (error) {
            console.error("Error adding document:", error);
            return { success: false, error: error };
        }
    };


    const getAllUserDocumentIDs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/annotated_studies/`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                console.log("User Documents retrieved:", data.annotated_studies);
                setAllUserDocuments(data.annotated_studies);
                return { success: true, documents: data.annotated_studies };
            }

            const errorData = await response.json();
            return { success: false, error: errorData.error };
        } catch (error) {
            console.error("Error getting users document:", error);
            return { success: false, error: error };
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
            
            // fetch additional info from pubmed for each PMC ID
            const summaries = await getPMCSummaries(userDocumentIDs.documents);
            
            console.log("User Article Summaries:", summaries);
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

    const contextValue = {
        allUserDocuments,
        addUserDocument,
        getAllUserDocuments,
        getAllUserDocumentIDs,
        refreshUserDocuments,
        loading,
    };

    return (
        <UserDocumentContext.Provider value={contextValue}>
            {children}
        </UserDocumentContext.Provider>
    );
};
