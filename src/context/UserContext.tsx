"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  profilePicture: string;
  name: string;
  email: string;
} | null;

type UserContextType = {
  currentUser: User;
  storeUser: (user: User) => void;
};

const AuthContext = createContext<UserContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(null);

  const storeUser = (user: User) => {
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, storeUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
