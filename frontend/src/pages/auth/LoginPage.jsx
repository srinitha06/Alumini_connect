// ============================================================
// LOGIN PAGE — JWT-style login with role-based redirect
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

// Demo credentials for quick access
const DEMO_ACCOUNTS = [
  { role: "Student", email: "student@alumni-connect.edu", password: "student123", color: "badge-student" },
  { role: "Alumni", email: "priya@example.com", password: "alumni123", color: "badge-alumni" },
  { role: "Admin", email: "admin@alumni-connect.edu", password: "admin123", color: "badge-admin" },
];

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Login failed");
      return;
    }

    // Role-based redirect after login
    const stored = localStorage.getItem("alumni_connect_user");
    if (stored) {
      const user = JSON.parse(stored);
      const dashMap = {
        student: "/student/dashboard",
        alumni: "/alumni/dashboard",
        admin: "/admin/dashboard",
      };
      navigate(dashMap[user.role] || "/");
    }
  };

  const fillDemo = (email, password) => {
    setEmail(email);
    setPassword(password);
    setError("");
  };

  return (
    <div className="auth-container">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: "hsl(var(--secondary))" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: "hsl(var(--secondary))" }}
        />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "hsl(var(--secondary))" }}
          >
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="title-premium text-3xl text-white">Alumni Connect AI</h1>
          <p className="text-white/60 text-sm mt-1 font-medium tracking-wide">AI-Powered Mentorship Platform</p>
        </div>

        <div className="auth-card">
          <h2 className="font-professional text-xl font-bold text-foreground mb-1">Welcome back!</h2>
          <p className="text-muted-foreground text-sm mb-6">Sign in to your account to continue</p>

          {/* Demo Quick Access */}
          <div className="mb-5 p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Quick Demo Access
            </p>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => fillDemo(acc.email, acc.password)}
                  className={`badge-role ${acc.color} cursor-pointer hover:opacity-80 transition-opacity`}
                >
                  {acc.role}
                </button>
              ))}
            </div>
          </div>

          {/* Success Message */}
          {successMessage && !error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 mb-4">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-500">{successMessage}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-4">
              <AlertCircle size={16} className="text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:border-secondary transition-all"
                  style={{ "--tw-ring-color": "hsl(var(--secondary) / 0.3)" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:border-secondary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
              style={{ background: loading ? "hsl(var(--muted))" : "var(--gradient-blue)" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold hover:underline" style={{ color: "hsl(var(--secondary))" }}>
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
