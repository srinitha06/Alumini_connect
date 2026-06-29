import React, { createContext, useContext, useState, useEffect } from "react";
import API_BASE_URL from "@/config";

const AuthContext = createContext(null);


// Local storage key for persisting session
const SESSION_KEY = "alumni_connect_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch { }
    }
    setIsLoading(false);
  }, []);

  /**
   * Login — validates against mock data (production: POST /api/auth/login)
   * Returns JWT in production; here we store user object
   */
  const API_URL = `${API_BASE_URL}/api/auth`;

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        return { success: false, error: data.message || "Invalid email or password" };
      }

      setUser(data);
      localStorage.setItem(SESSION_KEY, JSON.stringify(data));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: "Connect to backend failed. Is server running?" };
    }
  };

  const register = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        return { success: false, error: result.message || "Registration failed" };
      }

      // If account needs verification (e.g. Alumni), don't auto-login
      if (result.role === "alumni" && !result.verified) {
        setIsLoading(false);
        return { success: true, pendingVerification: true };
      }

      setUser(result);
      localStorage.setItem(SESSION_KEY, JSON.stringify(result));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: "Connect to backend failed. Is server running?" };
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateUser = (updates) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    // Note: In production, this should also make a PATCH/PUT request to /api/users/profile
  };


  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
