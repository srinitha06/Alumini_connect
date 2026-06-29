// ============================================================
// SIDEBAR COMPONENT — Navigation sidebar for all dashboards
// Changes links based on user role
// ============================================================

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap, LayoutDashboard, Users, Briefcase, Star,
  MessageSquare, Settings, LogOut, Bell, Shield, BookOpen,
  TrendingUp, UserCheck, FileText, ChevronRight, Calendar
} from "lucide-react";

const studentNav = [
  { label: "Dashboard", path: "/student/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Find Mentors (AI)", path: "/student/mentors", icon: <Users size={18} /> },
  { label: "My Mentorships", path: "/student/mentorships", icon: <MessageSquare size={18} /> },
  { label: "Job Board", path: "/student/jobs", icon: <Briefcase size={18} /> },
  { label: "Placement Insights", path: "/student/insights", icon: <TrendingUp size={18} /> },
  { label: "Company Reviews", path: "/student/reviews", icon: <Star size={18} /> },
  { label: "Upcoming Meetings", path: "/student/meetings", icon: <Calendar size={18} /> },
  { label: "My Profile", path: "/student/profile", icon: <Settings size={18} /> },
];

const alumniNav = [
  { label: "Dashboard", path: "/alumni/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Mentorship Requests", path: "/alumni/mentorships", icon: <MessageSquare size={18} /> },
  { label: "Schedule Meeting", path: "/alumni/schedule-meeting", icon: <Calendar size={18} /> },
  { label: "Post Job", path: "/alumni/post-job", icon: <Briefcase size={18} /> },
  { label: "Post Review", path: "/alumni/post-review", icon: <FileText size={18} /> },
  { label: "My Profile", path: "/alumni/profile", icon: <Settings size={18} /> },
];

const adminNav = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Verify Alumni", path: "/admin/verify", icon: <UserCheck size={18} /> },
  { label: "Manage Users", path: "/admin/users", icon: <Users size={18} /> },
  { label: "Platform Meetings", path: "/admin/meetings", icon: <Calendar size={18} /> },
  { label: "Manage Jobs", path: "/admin/jobs", icon: <Briefcase size={18} /> },
  { label: "Manage Reviews", path: "/admin/reviews", icon: <Star size={18} /> },
  { label: "Platform Stats", path: "/admin/stats", icon: <TrendingUp size={18} /> },
];

const roleConfig = {
  student: { nav: studentNav, badge: "Student", color: "badge-student" },
  alumni: { nav: alumniNav, badge: "Alumni", color: "badge-alumni" },
  admin: { nav: adminNav, badge: "Administrator", color: "badge-admin" },
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const config = roleConfig[user.role];
  const initials = user.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "hsl(var(--secondary))" }}
          >
            <GraduationCap size={22} className="text-white" />
          </div>
          <div>
            <h1 className="title-premium text-white text-sm leading-tight">
              Alumni Connect
            </h1>
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "hsl(var(--secondary))" }}>
              AI Platform
            </span>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 mx-2 my-3 rounded-xl" style={{ background: "hsl(var(--sidebar-accent))" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: "hsl(var(--secondary))" }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`badge-role ${config.color} text-[10px] px-1.5 py-0`}>
                {config.badge}
              </span>
              {user.role === "alumni" && !user.verified && (
                <span className="badge-pending text-[10px]">Pending</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pb-2">
        <p
          className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "hsl(var(--sidebar-foreground) / 0.5)" }}
        >
          Navigation
        </p>
        {config.nav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-left"
          style={{ color: "hsl(0, 72%, 70%)" }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
