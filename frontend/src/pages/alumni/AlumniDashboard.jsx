// ============================================================
// ALUMNI DASHBOARD
// ============================================================

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare, Briefcase, CheckCircle, Clock, XCircle, AlertTriangle, ArrowRight, User, Star, Loader2, Calendar } from "lucide-react";
import ChatModal from "@/components/ChatModal";
import API_BASE_URL from "@/config";

const AlumniDashboard = () => {
  const { user } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("${API_BASE_URL}/api/mentorships/incoming-requests", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setIncomingRequests(data);
        }
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user.token]);

  const statusIcon = {
    accepted: <CheckCircle size={14} className="text-secondary" />,
    pending: <Clock size={14} className="text-warning" />,
    rejected: <XCircle size={14} className="text-destructive" />
  };

  const statusClass = {
    accepted: "bg-secondary/10 text-secondary border-secondary/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    rejected: "bg-destructive/10 text-destructive border-destructive/20"
  };

  if (loading) {
    return (
      <DashboardLayout title={`Welcome back!`} subtitle="Loading your dashboard...">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-secondary mb-3" size={40} />
          <p className="text-muted-foreground">Preparing your overview...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Welcome, ${user?.name?.split(" ")[0]}!`}
      subtitle="Manage your mentorships and contributions"
    >
      {/* Verification Warning */}
      {user && !user.verified && (
        <div className="flex items-center gap-3 p-5 rounded-xl mb-8 border animate-pulse-glow" style={{ background: "hsl(38,92%,96%)", borderColor: "hsl(38,92%,80%)" }}>
          <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-warning" />
          </div>
          <div>
            <p className="font-bold text-sm text-primary">Account Pending Verification</p>
            <p className="text-xs text-muted-foreground mt-0.5">Administrative review in progress. You'll be visible to students once approved.</p>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Mentorship Requests", value: incomingRequests.length, color: "var(--gradient-blue)", iconColor: "text-white", icon: <MessageSquare size={16} /> },
          { label: "Jobs Posted", value: 0, color: "var(--gradient-green)", iconColor: "text-white", icon: <Briefcase size={16} /> },
          { label: "Active Students", value: incomingRequests.filter((r) => r.status === "accepted").length, color: "var(--gradient-stat)", iconColor: "text-primary", icon: <User size={16} /> },
        ].map((s, i) => (
          <div key={i} className="platform-card relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-playfair font-black text-primary mb-1">{s.value}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${s.iconColor || "text-white"}`} style={{ background: s.color }}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mentorship Requests Section */}
        <div className="platform-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <MessageSquare size={18} />
              </div>
              <h3 className="font-playfair font-bold text-lg">Recent Requests</h3>
            </div>
            <Link to="/alumni/mentorships" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed border-border text-muted-foreground">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">No pending requests at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incomingRequests.slice(0, 3).map((req) => {
                const student = req.studentId;
                return (
                  <div key={req._id} className="flex items-center justify-between p-4 rounded-xl bg-white border border-border hover:border-secondary/30 transition-all hover:shadow-sm cursor-pointer"
                    onClick={() => req.status === "accepted" && setSelectedChat({ id: req._id, otherUser: student })}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner uppercase" style={{ background: "var(--gradient-blue)" }}>
                        {student?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">{student?.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">{student?.department} • {student?.batch}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight border ${statusClass[req.status]}`}>
                        {statusIcon[req.status]}
                        <span className="capitalize">{req.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Quick Actions Card */}
          <div className="platform-card">
            <h3 className="font-playfair font-bold text-lg mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Schedule Meeting", path: "/alumni/schedule-meeting", icon: <Calendar size={22} />, color: "var(--gradient-hero)" },
                { label: "Post a Job", path: "/alumni/post-job", icon: <Briefcase size={22} />, color: "var(--gradient-blue)" },
                { label: "Post Review", path: "/alumni/post-review", icon: <Star size={22} />, color: "var(--gradient-green)" },
                { label: "Manage Requests", path: "/alumni/mentorships", icon: <User size={22} />, color: "var(--gradient-stat)" },
              ].map((action, i) => (
                <Link
                  key={i}
                  to={action.path}
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-border bg-white hover:border-secondary transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform" style={{ background: action.color }}>
                    {action.icon}
                  </div>
                  <span className="text-xs font-bold text-primary">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Progress Card */}
          <div className="rounded-xl p-6 bg-primary text-white border-none shadow-xl relative overflow-hidden hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <h3 className="font-playfair font-bold text-lg mb-4 text-white relative z-10">Profile Readiness</h3>
            <div className="space-y-4 relative z-10">
              {[
                { label: "Identity Verified", done: user?.verified },
                { label: "Professional Background", done: !!user?.company },
                { label: "Mentorship Bio", done: !!user?.bio },
                { label: "Skills Endorsement", done: (user?.skills?.length ?? 0) > 0 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? 'bg-secondary' : 'bg-white/10'}`}>
                      <CheckCircle size={12} className={item.done ? "text-white" : "text-white/30"} />
                    </div>
                    <span className={item.done ? "text-white" : "text-white/50 font-medium"}>{item.label}</span>
                  </div>
                  {item.done ? (
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Complete</span>
                  ) : (
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Missing</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ChatModal
        isOpen={!!selectedChat}
        onClose={() => setSelectedChat(null)}
        mentorshipId={selectedChat?.id}
        otherUser={selectedChat?.otherUser}
      />
    </DashboardLayout>
  );
};

export default AlumniDashboard;
