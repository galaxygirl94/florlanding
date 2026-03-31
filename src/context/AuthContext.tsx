"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, firstName: string, lastName: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => false,
  signup: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("flor_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("flor_user");
      }
    }
  }, []);

  const signup = (email: string, password: string, firstName: string, lastName: string): boolean => {
    const accounts = JSON.parse(localStorage.getItem("flor_accounts") || "{}");
    if (accounts[email]) return false; // already exists
    accounts[email] = { password, firstName, lastName };
    localStorage.setItem("flor_accounts", JSON.stringify(accounts));
    const newUser = { email, firstName, lastName };
    setUser(newUser);
    localStorage.setItem("flor_user", JSON.stringify(newUser));
    return true;
  };

  const login = (email: string, password: string): boolean => {
    const accounts = JSON.parse(localStorage.getItem("flor_accounts") || "{}");
    const account = accounts[email];
    if (!account || account.password !== password) return false;
    const loggedInUser = { email, firstName: account.firstName, lastName: account.lastName };
    setUser(loggedInUser);
    localStorage.setItem("flor_user", JSON.stringify(loggedInUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("flor_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
