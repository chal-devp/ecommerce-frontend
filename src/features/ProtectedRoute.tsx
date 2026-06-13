// src/components/auth/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useStore } from "../services/useStore"; // Make sure path is correct
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = true }: Props) => {
  // Get everything directly from the store inside the guard
  const { isLoggedIn, user } = useStore();

  // 1. If not logged in at all, go to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 2. If it requires admin but the user isn't one, go to home
  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 3. Otherwise, show the protected content
  return <>{children}</>;
};
