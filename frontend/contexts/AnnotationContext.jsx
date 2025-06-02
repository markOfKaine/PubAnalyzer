"use client";
import { useContext, useState, createContext, useEffect, useRef } from "react";
import { useUserContext } from "@/contexts/UserContext";
import { usePMContext } from "@/contexts/PubMedContext";
import { apiCall } from "@/utilities/api";

const AnnotationContext = createContext();

export const useAnnotationContext = () => useContext(AnnotationContext);

export const AnnotationProvider = ({ children }) => {
    const { user } = useUserContext();
    const { selectedArticle, pdfURL } = usePMContext();
    const [annotations, setAnnotations] = useState([]);
    const [loading, setLoading] = useState(false);
    const prevPmcIDRef = useRef(null);
    const pdfLoadedRef = useRef(false);

    useEffect(() => {
      if (pdfURL) {
        pdfLoadedRef.current = true;
      }
      
      // This effect runs when the PDF URL changes, indicating that the PDF has loaded
      // Loads annotations for selected article on page refresh and initial load
      // Only proceed if:
      // 1. We have a user (needed for API call)
      // 2. We have a selected article with PMCID
      // 3. We have a PDF URL (meaning the PDF has loaded)
      // 4. This is a different PMCID than before OR we haven't loaded annotations yet
      if (
        user?.id &&
        selectedArticle?.pmcid &&
        pdfURL &&
        selectedArticle.pmcid !== prevPmcIDRef.current
      ) {
        refreshAnnotations();
        prevPmcIDRef.current = selectedArticle.pmcid;
      } else {
        console.log("url Skipping annotation load - conditions not met", {
          userID: user?.id,
          pmcID: selectedArticle?.pmcid,
          pdfURL: !!pdfURL,
          prevPmcID: prevPmcIDRef.current,
          annotationsLength: annotations.length
        });
      }
    }, [user?.id, selectedArticle?.pmcid, pdfURL]);


    const refreshAnnotations = async () => {
        if (user?.id && selectedArticle?.pmcid) {
        return await getAnnotations(selectedArticle.pmcid);
        }
        return { success: false, error: "Missing user ID or PMCID" };
    };

    const uploadAnnotation = async (annotationData) => {
        setLoading(true);

        try {
            const uploadData = {
                userID: user.id,
                pmcID: selectedArticle.pmcid,
                file_content: annotationData,
            }

            const response = await apiCall(`/s3/uploadAnnotation/`, {
                method: "POST",
                body: JSON.stringify(uploadData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Annotations Uploaded Successfully:", data);
                return { success: true };
            }

            const errorData = await response.json();
            throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
        } catch (error) {
            console.error("Error fetching annotations:", error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const getAnnotations = async (pmcID) => {
        setLoading(true);
        setAnnotations([]);
        console.log("Fetching annotations for PMC ID:", pmcID);
        try {
            const params = new URLSearchParams({
                userID: user.id,
                pmcID: pmcID,
            });

            const response = await apiCall(`/s3/getAnnotations/?${params}`, {
                method: "GET",
            });

            if (response.ok) {
                const data = await response.json();
                setAnnotations(data);
                return { success: true };
            }

            if (response.status === 404) {
                console.log("No annotations found for this article");
                setAnnotations([]);
                return { success: true, message: "No annotations found" };
            }
            
            const errorData = await response.json();
            throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
        } catch (error) {
            console.error("Error fetching annotations:", error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const deleteAnnotation = async (annotationData) => {
        setLoading(true);

        try {
            const uploadData = {
                userID: user.id,
                pmcID: selectedArticle.pmcid,
                file_content: annotationData,
            }

            const response = await apiCall(`/s3/deleteAnnotation/`, {
                method: "DELETE",
                body: JSON.stringify(uploadData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Annotations Deleted Successfully:", data.message);
                return { success: true };
            }

            const errorData = await response.json();
            throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
        } catch (error) {
            console.error("Error deleting annotation:", error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const contextValue = {
        annotations,
        uploadAnnotation,
        getAnnotations,
        deleteAnnotation,
        refreshAnnotations,
        loading,
    };

    return (
        <AnnotationContext.Provider value={contextValue}>
            {children}
        </AnnotationContext.Provider>
    );
};
