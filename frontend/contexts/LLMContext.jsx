"use client";
import { useContext, useState, createContext } from "react";

const LLMContext = createContext();

export const useLLMContext = () => useContext(LLMContext);

export const LLMProvider = ({ children }) => {
  
    const [messages, setMessages] = useState([]);
    const [llmResponse, setLLMResponse] = useState(null);
    const [llmLoading, setLLMLoading] = useState(false);

  // TODO: TW - Add save chat endpoint and update endpoint to real endpoint
    const fetchLLMTextResponse = async (prompt) => {
        setLLMLoading(true);

        if (!prompt || prompt.trim() === "") {
        console.error("Prompt is empty");
        setLLMLoading(false);
        return { success: false, error: "Prompt is empty" };
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/llm/query/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    prompt: prompt,
                }),
                }
            );
            console.log("LLM Response status:", response.status);
            
            if (response.ok) {
                const responseData = await response.json();
                console.log("LLM response:", responseData.response);
                setLLMResponse(responseData.response);
                return { success: true, response: responseData.response };
            }

            console.error("Error fetching LLM response:", response.statusText);
            const errorData = await response.json();
            console.error("Error details for LLM Response:", errorData);
            return { success: false, error: errorData };
        } catch (error) {
            console.error("Error fetching LLM Response:", error);
            return { success: false, error: error };
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
        <LLMContext.Provider value={contextValue}>
        {children}
        </LLMContext.Provider>
    );
};
