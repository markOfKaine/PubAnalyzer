"use client";
import { useContext, useState, createContext } from "react";
import { apiCall, apiCallWithFormData } from "@/utilities/api";

const LLMContext = createContext();

export const useLLMContext = () => useContext(LLMContext);

export const LLMProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [llmResponse, setLLMResponse] = useState(null);
  const [llmLoading, setLLMLoading] = useState(false);

  const fetchLLMTextResponse = async (prompt, image = null) => {
    setLLMLoading(true);

    if (!prompt || prompt.trim() === "") {
      console.error("Prompt is empty");
      setLLMLoading(false);
      return { success: false, error: "Prompt is empty" };
    }

    try {
      let response;

      if (image) {
        const formData = new FormData();
        formData.append("prompt", prompt);

        // Check if image is a data URL string and convert to blob
        if (typeof image === "string" && image.startsWith("data:")) {
          console.log("Image is a data URL, converting to blob");
          const response = await fetch(image);
          const imageBlob = await response.blob();
          formData.append("image", imageBlob);
        } else {
          // Assume it's already a blob/file
          formData.append("image", image);
        }

        response = await apiCallWithFormData("/llm/query/", formData);
      } else {
        response = await apiCall("/llm/query/", {
          method: "POST",
          body: JSON.stringify({ prompt: prompt }),
        });
      }

      console.log("LLM Response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("LLM response:", responseData.response);
        setLLMResponse(responseData.response);
        return { success: true, response: responseData.response };
      }

      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
    } catch (error) {
      console.error("Error fetching LLM Response:", error);
      return { success: false, error: error.message };
    } finally {
      setLLMLoading(false);
    }
  };

  const contextValue = {
    llmResponse,
    llmLoading,
    messages,
    setMessages,
    fetchLLMTextResponse,
  };

  return (
    <LLMContext.Provider value={contextValue}>{children}</LLMContext.Provider>
  );
};
