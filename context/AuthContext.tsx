"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../types";
import {
  login as apiLogin,
  register as apiRegister,
  RegisterRequest,
  SignInRequest,
} from "../services/api";

interface AuthContextType {
  user: User | null;
  login: (request: SignInRequest) => Promise<boolean>;
  register: (request: RegisterRequest) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);

  const handleLogin = async (request: SignInRequest) => {
    const loggedInUser = await apiLogin(request);
    if (loggedInUser) {
      localStorage.setItem("authToken", loggedInUser.data);
      setUser(loggedInUser.data);
      return true;
    }
    return false;
  };

  const handleRegister = async (request: RegisterRequest) => {
    try {
      await apiRegister(request);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        register: handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
