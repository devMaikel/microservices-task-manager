import { createContext, useState, useEffect } from "react";
import { login, logout, register } from "@/api/auth";
import type {
  AuthContextType,
  AuthProviderProps,
  IAuthResponse,
} from "./interfaces";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IAuthResponse | any>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      setUser({ token, ...JSON.parse(userStr) });
    }
  }, []);

  const signUp = async (email: string, name: string, password: string) => {
    const data = await register(email, name, password);
    setUser({ token: data.accessToken });
  };

  const signIn = async (email: string, password: string) => {
    const data = await login(email, password);
    setUser({ token: data.accessToken, ...data });
  };

  const signOut = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
