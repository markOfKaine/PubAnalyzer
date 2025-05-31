"use client";
import { useContext, useState, createContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/utilities/api";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      // Transform the data to match backend api field names
      const transformedData = {
        username: userData.email,
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
      };

      const response = await apiCall("/api/register/", {
        method: "POST",
        body: JSON.stringify(transformedData),
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        setUser({
          id: user.id,
          email: user.email,
          first_name: user.first_name,
        });
        return { success: true };
      }

      const errorData = await response.json();
      
      // Handle any specific error messages from django
      const fieldError = {};
      const unknownError = {};

      if (errorData.email) {
        fieldError.email = "This email is already in use.";
      }

      if (errorData.first_name) {
        fieldError.firstName = "First name should only contain letters.";
      }

      if (errorData.last_name) {
        fieldError.lastName = "Last name should only contain letters.";
      }

      if (Object.keys(fieldError).length === 0) {
        unknownError.message = "An unknown error occurred during registration.";
      }

      return { success: false, fieldError: fieldError, unknownError: unknownError };
    } catch (error) {
      return { success: false, error: { message: "Network error occurred" } };
    }
  };

  const login = async (userData) => {
    try {
      // Transform the data to match backend API
      const loginData = {
        username: userData.email,
        password: userData.password,
      };

      const response = await apiCall("/api/login/", {
        method: "POST",
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        setUser({
          id: user.id,
          email: user.email,
          first_name: user.first_name,
        });
        return { success: true };
      }

      const errorData = await response.json();
      return { success: false, error: errorData };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false, error: { message: "Network error occurred" } };
    }
  };

  const logout = async () => {
    try {
      await apiCall("/api/logout/", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await apiCall("/api/auth/status/", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();

        setUser({
          id: data.id,
          email: data.email,
          first_name: data.first_name,
        });
        return { success: true };
      }
      setUser(null);
      return { success: false};
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      return { success: false};
    } finally {
      setLoading(false);
    }
  };

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
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
