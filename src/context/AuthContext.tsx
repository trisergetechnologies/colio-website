// context/AuthContext.tsx
"use client";

import { getToken, removeToken, setToken } from "@/lib/utils/tokenHelper";
import axios from "axios";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type User = {
  userId: string;
  name: string;
  email?: string; 
  phone?: string;
  role: "customer"; 
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive?: boolean;
  avatar?: string | null;
  gender?: "male" | "female" | "other" | null;
  dateOfBirth?: string | Date | null;
  languages?: string[];
  createdAt?: string;
  lastLogin?: string;
  wallet: { main: number; bonus: number };
  referralCode?: string;
  totalReferrals?: number;
  favoriteConsultants?: string[];
  accessToken?: string;
};

export type RegisterInput = {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: "customer"; 
  registrationType?: "email" | "phone" | "google";
  googleId?: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  saveAuthData: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,
  saveAuthData: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

type Props = { children: ReactNode };

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const API_BASE_URL = "https://api.colio.in/api";

  useEffect(() => {
    const initAuth = async () => {
      setIsAuthLoading(true);
      try {
        const token = await getToken();
        if (!token) {
          setUser(null);
          setIsAuthLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success && res.data.data) {
          setUser(res.data.data);
        } else {
          await removeToken();
          setUser(null);
        }
      } catch (err) {
        console.error("Init auth error:", err);
        await removeToken();
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  const saveAuthData = async (userData: any) => {
    try {
      const token = userData?.accessToken || userData?.token;
      if (token) await setToken(token);
      setUser(userData);
    } catch (err) {
      console.error("Error saving auth data:", err);
    }
  };

  const refreshUser = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await axios.get(`${API_BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success && res.data.data) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const logout = async () => {
    try {
      setIsAuthLoading(true);
      await removeToken();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAuthLoading,
    saveAuthData,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
