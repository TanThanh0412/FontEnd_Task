"use client";

import { createContext, useContext, ReactNode } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  RegisterRequest,
  SignInRequest,
} from "../services/api";

interface AuthContextType {
  login: (request: SignInRequest) => Promise<boolean>;
  register: (request: RegisterRequest) => Promise<boolean>;
}

export interface UserLoginResponse {
  data: string;
  isSuccess: boolean;
  message: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  //const [user, setUser] = useState(null);

  const handleLogin = async (request: SignInRequest) => {
    const loggedInUser: UserLoginResponse = await apiLogin(request);
    if (loggedInUser.isSuccess) {
      localStorage.setItem("authToken", loggedInUser.data);
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
