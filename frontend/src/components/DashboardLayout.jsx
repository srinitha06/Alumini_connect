// ============================================================
// DASHBOARD LAYOUT — Shared layout for all dashboard pages
// ============================================================

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Bell, Search, Clock, CheckCircle, MessageSquare, Trash2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const DashboardLayout = ({ children, title, subtitle }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/mark-read/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`http://localhost:5000/api/notifications/mark-all-read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "message": return <MessageSquare size={14} className="text-secondary" />;
      case "mentorship_accepted": return <CheckCircle size={14} className="text-accent" />;
      default: return <Clock size={14} className="text-warning" />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now - then;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        {/* Top Header Bar */}
        <div className="dashboard-header relative z-[100]">
          <div>
            <h2 className="text-2xl title-premium text-primary">{title}</h2>
            {subtitle && (
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className={`relative w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center hover:border-secondary transition-all shadow-card ${showNotifs ? 'border-secondary' : ''}`}
              >
                <Bell size={18} className={unreadCount > 0 ? "text-secondary animate-swing" : "text-muted-foreground"} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifs && (
                <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b flex items-center justify-between bg-muted/10">
                    <h4 className="font-bold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-[10px] font-bold text-secondary hover:underline">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center opacity-40">
                        <Bell size={32} className="mx-auto mb-2" />
                        <p className="text-xs font-medium">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif._id}
                          className={`p-4 border-b last:border-0 hover:bg-muted/30 transition-colors flex gap-3 relative ${!notif.isRead ? 'bg-secondary/5' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${!notif.isRead ? 'bg-secondary/20' : 'bg-muted'}`}>
                            {getIcon(notif.type)}
                          </div>
                          <div className="flex-1 min-w-0" onClick={() => !notif.isRead && markAsRead(notif._id)}>
                            <p className={`text-xs ${!notif.isRead ? 'font-bold' : 'text-foreground/70'}`}>{notif.content}</p>
                            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                              <Clock size={10} /> {formatTime(notif.createdAt)}
                            </p>
                          </div>
                          {!notif.isRead && (
                            <div className="w-2 h-2 rounded-full bg-secondary self-center flex-shrink-0" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 text-center border-t">
                    <button onClick={() => setShowNotifs(false)} className="text-xs font-bold text-muted-foreground hover:text-foreground">
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User avatar */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-lg"
              style={{ background: "var(--gradient-blue)" }}
            >
              {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="animate-fade-in-up text-dashboard font-medium">
          {children}
        </div>
      </main>

      {/* Overlay to close dropdowns */}
      {showNotifs && <div className="fixed inset-0 z-[90]" onClick={() => setShowNotifs(false)} />}
    </div>
  );
};

export default DashboardLayout;
