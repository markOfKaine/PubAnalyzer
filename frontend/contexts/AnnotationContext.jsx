"use client";
import { useContext, useState, createContext } from "react";
import { useUserContext } from "@/contexts/UserContext";
import { usePMContext } from "./PubMedContext";

const AnnotationContext = createContext();

export const useAnnotationContext = () => useContext(AnnotationContext);

export const AnnotationProvider = ({ children }) => {
    
    const { user } = useUserContext();
    const { selectedArticle } = usePMContext();
    const [annotations, setAnnotations] = useState([]);
    const [loading, setLoading] = useState(false);

    const uploadAnnotation = async (annotationData) => {
        setLoading(true);

        try {
            const params = new URLSearchParams({
                userID: user.id,
                pmcID: selectedArticle.pmcid,
            });

            console.log("Uploading annotations with params:", params.toString());
            console.log("Annotation data:", annotationData);

            const uploadData = {
                userID: user.id,
                pmcID: selectedArticle.pmcid,
                file_content: annotationData,
            }

            console.log("Upload data prepared:", uploadData);

            const response = await fetch(`http://127.0.0.1:8000/s3/uploadAnnotation/?${params}`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(uploadData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Annotations fetched successfully:", data);
                return { success: true };
            }

            const errorData = await response.json();
            console.error("Uploading annotation returned an error:", response.status, response.statusText, errorData);
            return { success: false, error: errorData.error };
        } catch (error) {
            console.error("Error uploading annotation :", error);
            return { success: false, error: error };
        } finally {
            setLoading(false);
        }
    };

    const getAnnotations = async (pmcID) => {
        setLoading(true);
        setAnnotations([]);

        try {
            const params = new URLSearchParams({
                userID: user.id,
                pmcID: pmcID,
            });

            console.log("Fetching annotations with params:", params.toString());
            const response = await fetch(`http://127.0.0.1:8000/s3/getAnnotations/?${params}`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Annotations fetched successfully:", data);
                // TODO: TW - Uncomment when we figure out returned json structure
                // setAnnotations(data.annotations || []);
                return { success: true };
            }
            
            const errorData = await response.json();
            console.error("Error fetching annotations:", response.status, response.statusText, errorData);
            return { success: false, error: errorData.error };
        } catch (error) {
            console.error("Error fetching PDF:", error);
            return { success: false, error: error };
        } finally {
            setLoading(false);
        }
    };

    const contextValue = {
        annotations,
        uploadAnnotation,
        getAnnotations,
        loading,
    };

    return (
        <AnnotationContext.Provider value={contextValue}>
            {children}
        </AnnotationContext.Provider>
    );
};
