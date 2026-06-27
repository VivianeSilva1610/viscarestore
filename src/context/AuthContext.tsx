"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { account, databases } from "../lib/appwrite";
import { ID, Query, OAuthProvider } from "appwrite";
import { Models } from "appwrite";

const CUSTOMERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID || "customers";
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a390e430024feb8df57";

export interface CustomerProfile {
  $id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  birth_date?: string;
  address_street?: string;
  address_number?: string;
  address_complement?: string;
  address_district?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  address_country?: string;
  newsletter?: boolean;
}

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  profile: CustomerProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Omit<CustomerProfile, "$id" | "user_id" | "email">>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const res = await databases.listDocuments(DB_ID, CUSTOMERS_COLLECTION_ID, [
        Query.equal("user_id", userId),
        Query.limit(1),
      ]);
      if (res.documents.length > 0) {
        setProfile(res.documents[0] as unknown as CustomerProfile);
      }
    } catch {
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.$id);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        // Fetch profile; if not found (first Google login), create it automatically
        const res = await databases.listDocuments(DB_ID, CUSTOMERS_COLLECTION_ID, [
          Query.equal("user_id", currentUser.$id),
          Query.limit(1),
        ]);
        if (res.documents.length > 0) {
          setProfile(res.documents[0] as unknown as CustomerProfile);
        } else {
          // First OAuth login — create profile automatically
          const newProfile = await databases.createDocument(
            DB_ID,
            CUSTOMERS_COLLECTION_ID,
            ID.unique(),
            {
              user_id: currentUser.$id,
              name: currentUser.name || "",
              email: currentUser.email,
              newsletter: false,
            }
          );
          setProfile(newProfile as unknown as CustomerProfile);
        }
      } catch {
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email: string, password: string) => {
    try {
      await account.deleteSession("current");
    } catch {
      // No active session to clear, safe to ignore.
    }
    await account.createEmailPasswordSession(email, password);
    const currentUser = await account.get();
    setUser(currentUser);
    await fetchProfile(currentUser.$id);
  };

  const loginWithGoogle = () => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://viscarestore.vercel.app";
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${origin}/conta/perfil`,
      `${origin}/conta?error=google`
    );
  };

  const register = async (name: string, email: string, password: string) => {
    const newUser = await account.create(ID.unique(), email, password, name);
    await account.createEmailPasswordSession(email, password);
    const currentUser = await account.get();
    setUser(currentUser);

    // Create customer profile document
    const profileDoc = await databases.createDocument(
      DB_ID,
      CUSTOMERS_COLLECTION_ID,
      ID.unique(),
      {
        user_id: newUser.$id,
        name,
        email,
        newsletter: false,
      }
    );
    setProfile(profileDoc as unknown as CustomerProfile);
  };

  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (data: Partial<Omit<CustomerProfile, "$id" | "user_id" | "email">>) => {
    if (!user) throw new Error("No user logged in");

    if (!profile) {
      const newProfile = await databases.createDocument(
        DB_ID,
        CUSTOMERS_COLLECTION_ID,
        ID.unique(),
        {
          ...data,
          user_id: user.$id,
          name: user.name || data.name || "",
          email: user.email,
        }
      );
      setProfile(newProfile as unknown as CustomerProfile);
      return;
    }

    const updated = await databases.updateDocument(
      DB_ID,
      CUSTOMERS_COLLECTION_ID,
      profile.$id,
      data
    );
    setProfile(updated as unknown as CustomerProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoggedIn: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
