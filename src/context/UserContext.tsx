"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type User = {
  profilePicture: string;
  name: string;
  email: string;
} | null;

type UserContextType = {
  currentUser: User;
  storeUser: (user: User) => void;
  resetUser: () => void;
};

const AuthContext = createContext<UserContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(null);

  const storeUser = (user: User) => {
    // store the user in localStorage and store the user as currentUser
    localStorage.setItem("AmineBlogV2", JSON.stringify(user));
    setCurrentUser(user);
  };

  const resetUser = () => {
    localStorage.setItem("AmineBlogV2", JSON.stringify(null));
    setCurrentUser(null);
  };

  useEffect(() => {
    const json = localStorage.getItem("AmineBlogV2");
    if (json) {
      const user = JSON.parse(json);
      if (user.name && user.email && user.profilePicture) {
        setCurrentUser({ ...user });
      } else {
        if (currentUser !== null) {
          setCurrentUser(null);
        }
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, storeUser, resetUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
