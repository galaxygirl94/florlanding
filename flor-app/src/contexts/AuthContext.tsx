"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole } from "@/data/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const demoUsers: Record<string, User> = {
  "nurse@flor.com": {
    id: "nurse-1",
    email: "nurse@flor.com",
    role: "nurse",
    firstName: "Maria",
    lastName: "Santos",
  },
  "employer@flor.com": {
    id: "employer-1",
    email: "employer@flor.com",
    role: "employer",
    firstName: "Helen",
    lastName: "Crawford",
    facilityId: "facility-1",
    facilityName: "Narragansett Elder Services",
    approved: true,
  },
  "employer2@flor.com": {
    id: "employer-2",
    email: "employer2@flor.com",
    role: "employer",
    firstName: "Tom",
    lastName: "Rivera",
    facilityId: "facility-2",
    facilityName: "Bay Coast Care Partners",
    approved: true,
  },
  "employer3@flor.com": {
    id: "employer-3",
    email: "employer3@flor.com",
    role: "employer",
    firstName: "Sandra",
    lastName: "Mitchell",
    facilityId: "facility-3",
    facilityName: "Providence Continuum Care",
    approved: true,
  },
  "admin@flor.com": {
    id: "admin-1",
    email: "admin@flor.com",
    role: "admin",
    firstName: "Admin",
    lastName: "Flor",
  },
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string, role: UserRole): boolean => {
    const demoUser = demoUsers[email.toLowerCase()];
    if (demoUser && demoUser.role === role) {
      setUser(demoUser);
      return true;
    }
    // Allow any email for demo - create user on the fly
    setUser({
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      role,
      firstName: email.split("@")[0],
      lastName: "",
      approved: role === "nurse" ? undefined : true,
    });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
