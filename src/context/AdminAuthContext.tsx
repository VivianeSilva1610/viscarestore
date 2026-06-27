"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { account } from "../lib/appwrite";
import { Models } from "appwrite";

interface AdminAuthContextType {
  adminUser: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await account.get();
        setAdminUser(user);
      } catch {
        setAdminUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await account.deleteSession("current");
    } catch {
      // No active session to clear, safe to ignore.
    }
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    setAdminUser(user);
  };

  const logout = async () => {
    await account.deleteSession("current");
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
