import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { getTopMentors } from "@/utils/aiRecommendation";
import {
  Users, Briefcase, MessageSquare, TrendingUp, Star,
  ArrowRight, Zap, CheckCircle, Clock, XCircle, MapPin, Award, Loader2, Sparkles, User, Calendar
} from "lucide-react";
import ChatModal from "@/components/ChatModal";
import API_BASE_URL from "@/config";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [alumniList, setAlumniList] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alumniRes, requestsRes, jobsRes, statsRes] = await Promise.all([
          fetch("${API_BASE_URL}/api/users/alumni", { headers: { Authorization: `Bearer ${user.token}` } }),
          fetch("${API_BASE_URL}/api/mentorships/my-requests", { headers: { Authorization: `Bearer ${user.token}` } }),
          fetch("${API_BASE_URL}/api/jobs", { headers: { Authorization: `Bearer ${user.token}` } }),
          fetch("${API_BASE_URL}/api/stats", { headers: { Authorization: `Bearer ${user.token}` } })
        ]);

        if (alumniRes.ok) setAlumniList(await alumniRes.json());
        if (requestsRes.ok) setMyRequests(await requestsRes.json());
        if (jobsRes.ok) setJobs(await jobsRes.json());
        if (statsRes.ok) setStatsData(await statsRes.json());
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.token]);

  // AI Mentor Recommendations
  const topMentors = useMemo(() => {
    if (!user || alumniList.length === 0) return [];
    return getTopMentors(user, alumniList, 3);
  }, [user, alumniList]);

  const recentJobs = jobs.slice(0, 3);

  const quickActions = [
    { label: "Find Mentors", path: "/student/mentors", icon: <User size={22} />, color: "var(--gradient-blue)" },
    { label: "View Jobs", path: "/student/jobs", icon: <Briefcase size={22} />, color: "var(--gradient-card)" },
    { label: "Company Reviews", path: "/student/reviews", icon: <Star size={22} />, color: "var(--gradient-green)" },
    { label: "Meetings", path: "/student/meetings", icon: <Calendar size={22} />, color: "var(--gradient-stat)" },
  ];

  const stats = [
    { label: "Verified Alumni", value: alumniList.length, icon: <Users size={22} />, color: "hsl(var(--secondary))" },
    { label: "Job Openings", value: jobs.length, icon: <Briefcase size={22} />, color: "#10b981" },
    { label: "My Mentorships", value: myRequests.length, icon: <MessageSquare size={22} />, color: "#f59e0b" },
    { label: "Placement Rate", value: statsData?.engagementIncrease || "94%", icon: <TrendingUp size={22} />, color: "#8b5cf6" },
  ];

  const statusIcon = { accepted: <CheckCircle size={14} className="text-accent" />, pending: <Clock size={14} className="text-warning" />, rejected: <XCircle size={14} className="text-destructive" /> };
  const statusClass = { accepted: "badge-verified", pending: "badge-pending", rejected: "badge-rejected" };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-primary"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.name?.split(" ")[0]}! 👋`}
      subtitle="Here's your neural-enhanced career overview"
    >
      {/* Top Row: AI Insight & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* AI Insight Card - Simplified */}
        <div className="lg:col-span-2 platform-card bg-white border-l-4 border-l-secondary relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Neural Insight</span>
            </div>
            <h2 className="text-xl font-playfair font-bold mb-3 leading-tight text-primary">
              Focus on <span className="text-secondary italic">Microservices</span> & Architecture
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-md">
              Based on recent trends from verified alumni, students with proficiency in architecture patterns are seeing higher placement success this month.
            </p>
            <div className="mt-4 flex gap-6">
              <div>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Market Demand</p>
                <p className="text-sm font-black text-secondary">High</p>
              </div>
              <div>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Avg Package</p>
                <p className="text-sm font-black text-accent">₹18-24 LPA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {stats.slice(0, 4).map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-border shadow-card flex flex-col justify-between group hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted/30" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-secondary transition-colors" />
              </div>
              <div className="mt-4 text-left">
                <p className="text-2xl font-black text-primary">{stat.value}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Mentor Recommendations */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="font-playfair font-bold text-primary">Top Neural Matches</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-black">Accuracy: 98%</p>
              </div>
            </div>
            <Link to="/student/mentors" className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline">
              View All <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topMentors.map((rec, i) => {
              return (
                <div key={rec.alumni.id || rec.alumni._id} className="p-5 rounded-xl bg-white border border-border shadow-card hover:shadow-xl transition-all group overflow-hidden relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm">
                      {rec.alumni.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate text-primary">{rec.alumni.name}</p>
                      <p className="text-[10px] text-secondary font-black uppercase truncate">{rec.alumni.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-muted-foreground italic">{rec.matchScore.overallScore}% MATCH</span>
                    <div className="h-1.5 flex-1 mx-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-secondary" style={{ width: `${rec.matchScore.overallScore}%` }} />
                    </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2 mb-4 italic">
                    "{rec.reason}"
                  </p>

                  <Link
                    to="/student/mentors"
                    className="block w-full py-2 rounded-lg bg-muted/50 text-center text-[10px] font-black uppercase tracking-widest text-primary hover:bg-secondary hover:text-white transition-all"
                  >
                    View Details
                  </Link>
                </div>
              );
            })}
          </div>

          <Link to="/student/mentors" className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border text-xs font-bold text-muted-foreground hover:border-secondary hover:text-secondary transition-all">
            <Sparkles size={14} /> Global Analysis Reveal
          </Link>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Mentorship Status */}
          <div className="platform-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair font-bold text-xs uppercase tracking-widest text-primary">Connections</h3>
              <div className="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary text-[10px] font-bold">{myRequests.length}</div>
            </div>
            {myRequests.length === 0 ? (
              <p className="text-[10px] text-muted-foreground text-center py-4">No active connections</p>
            ) : (
              <div className="space-y-3">
                {myRequests.slice(0, 4).map((req) => {
                  const alumni = req.alumniId;
                  return (
                    <div key={req._id} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer group"
                      onClick={() => req.status === "accepted" && setSelectedChat({ id: req._id, otherUser: alumni })}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-[10px] font-bold shadow-sm text-secondary">
                          {alumni?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-primary">{alumni?.name}</p>
                          <p className="text-[8px] text-muted-foreground uppercase tracking-widest">{req.status}</p>
                        </div>
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'accepted' ? 'bg-accent shadow-[0_0_8px_hsl(var(--accent)/0.5)]' : 'bg-warning'}`} />
                    </div>
                  );
                })}
              </div>
            )}
            <Link to="/student/mentorships" className="mt-4 block text-center text-[10px] font-black uppercase text-secondary tracking-[0.2em] hover:opacity-70 transition-opacity">
              Manage All
            </Link>
          </div>

          {/* Recent Jobs */}
          <div className="platform-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair font-bold text-xs uppercase tracking-widest text-primary">Open Roles</h3>
              <Briefcase size={14} className="text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {recentJobs.length === 0 ? (
                <p className="text-[10px] text-muted-foreground text-center py-4 italic font-medium">Opportunities incoming...</p>
              ) : recentJobs.map((job) => (
                <div key={job._id} className="p-4 rounded-xl bg-white border border-border hover:border-secondary/30 transition-all group">
                  <p className="text-xs font-bold mb-1 text-primary">{job.role}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[8px] font-black uppercase text-secondary tracking-widest leading-none">{job.company}</p>
                    <p className="text-[8px] font-bold text-accent leading-none">{job.salary || "Competitive"}</p>
                  </div>
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

export default StudentDashboard;
