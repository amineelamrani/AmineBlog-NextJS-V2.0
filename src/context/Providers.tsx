"use client";

import { AuthProvider } from "@/context/UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
