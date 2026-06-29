// ============================================================
// PROTECTED ROUTE — Wraps routes that require authentication
// Redirects unauthenticated users to login
// Role-based: blocks wrong-role users with a message
// ============================================================

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap } from "lucide-react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="text-center text-white">
          <div className="flex justify-center mb-4">
            <GraduationCap className="w-12 h-12 animate-pulse" />
          </div>
          <p className="text-lg font-medium">Loading Alumni Connect AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to correct dashboard
    const dashboardMap = {
      student: "/student/dashboard",
      alumni: "/alumni/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={dashboardMap[user.role]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
