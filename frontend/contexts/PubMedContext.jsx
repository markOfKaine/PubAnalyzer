"use client";
import { useContext, useState, createContext, useEffect } from "react";
import { useRouter } from "next/navigation";

const PubMedContext = createContext();

export const usePMContext = () => useContext(PubMedContext);

export const PubMedProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // TODO: TW - Replace with actual API endpoint
  

  const contextValue = {
    user,
    loading,
    register,
    checkAuth,
    logout,
    login,
    isAuthenticated: !!user,
  };

  return (
    <PubMedContext.Provider value={contextValue}>
      {children}
    </PubMedContext.Provider>
  );
};
