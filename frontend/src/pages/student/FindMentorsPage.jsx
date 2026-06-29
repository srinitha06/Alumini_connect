// ============================================================
// FIND MENTORS PAGE — AI-powered mentor search & recommendation
// ============================================================

import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { getTopMentors } from "@/utils/aiRecommendation";
import {
  Zap, Search, MessageSquare, CheckCircle, Clock,
  MapPin, Briefcase, Send, X, Award, Users, Loader2, Building2,
  Sparkles, Rocket
} from "lucide-react";

const FindMentorsPage = () => {
  const { user } = useAuth();
  const [alumniList, setAlumniList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterCompany, setFilterCompany] = useState("All");
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [message, setMessage] = useState("");
  const [myRequests, setMyRequests] = useState([]);
  const [showAI, setShowAI] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAlumni = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/alumni", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await response.json();
      if (response.ok) setAlumniList(data);
    } catch (err) {
      console.error("Failed to fetch alumni", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/mentorships/my-requests", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await response.json();
      if (response.ok) setMyRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAlumni(), fetchRequests()]);
      setLoading(false);
    };
    loadData();
  }, [user.token]);

  const aiRecommendations = useMemo(() => {
    if (!user || alumniList.length === 0) return [];
    return getTopMentors(user, alumniList, 3);
  }, [user, alumniList]);

  const departments = ["All", ...Array.from(new Set(alumniList.map((a) => a.department)))];
  const companies = ["All", ...Array.from(new Set(alumniList.map((a) => a.company).filter(Boolean)))];

  const filtered = alumniList.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || a.name.toLowerCase().includes(q) || a.company?.toLowerCase().includes(q) || (a.skills || []).some((s) => s.toLowerCase().includes(q));
    const matchDept = filterDept === "All" || a.department === filterDept;
    const matchCompany = filterCompany === "All" || a.company === filterCompany;
    return matchQ && matchDept && matchCompany;
  });

  const existingRequests = myRequests.map((m) => m.alumniId._id || m.alumniId);

  const handleSendRequest = async (alumniId) => {
    if (!message.trim()) return;
    try {
      const response = await fetch("http://localhost:5000/api/mentorships/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ alumniId, message }),
      });
      if (response.ok) {
        const newRequest = await response.json();
        setMyRequests(prev => [newRequest, ...prev]);
        setSelectedAlumni(null);
        setMessage("");
      } else {
        alert("Failed to send mentorship request");
      }
    } catch (err) {
      console.error("Request error", err);
      alert("Error connecting to server");
    }
  };

  const getMatchScore = (alumni) => {
    const rec = aiRecommendations.find((r) => (r.alumni.id || r.alumni._id) === (alumni.id || alumni._id));
    return rec?.matchScore.overallScore ?? null;
  };

  if (loading) {
    return (
      <DashboardLayout title="Find Mentors" subtitle="Locating best matches...">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-secondary mb-3" size={40} />
          <p className="text-muted-foreground">Fetching verified alumni...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Find Mentors"
      subtitle="Connect with verified alumni for guidance & mentorship"
    >
      {/* Conversational AI Analysis */}
      <div className="mb-8 platform-card relative overflow-hidden bg-white border-l-4 border-l-secondary">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-playfair text-xl font-bold text-primary">Neural Mentor Discovery</h3>
              <p className="text-muted-foreground text-[10px] uppercase font-black tracking-widest">AI-Powered Optimization</p>
            </div>
          </div>

          {!showAI ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-muted-foreground text-sm max-w-xl">
                I've analyzed your <span className="text-primary font-bold">{user.skills?.length || 0} skills</span> and career interests.
                Ready to see which alumni can accelerate your trajectory?
              </p>
              <button
                onClick={() => setShowAI(true)}
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-secondary text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-secondary/10"
              >
                Analyze Network
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 mb-6 text-secondary text-xs font-bold bg-secondary/10 w-fit px-3 py-1 rounded-full border border-secondary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Optimal Match Vectors Identified
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiRecommendations.map((rec, i) => (
                  <div key={rec.alumni._id} className="p-5 rounded-xl bg-muted/20 border border-border hover:bg-muted/40 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase text-secondary tracking-widest">{Math.round(rec.matchScore.overallScore)}% Match</span>
                      <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-[10px] font-bold text-primary">#{i + 1}</div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center font-bold text-secondary uppercase shadow-sm">
                        {rec.alumni.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">{rec.alumni.name}</p>
                        <p className="text-[10px] text-muted-foreground font-bold">{rec.alumni.company || "Top Alum"}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-4 min-h-[40px] italic">
                      "{rec.reason}"
                    </p>

                    <button
                      onClick={() => setSelectedAlumni(rec.alumni)}
                      className="w-full py-2 rounded-lg bg-white border border-border text-primary text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-sm"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowAI(false)}
                className="mt-6 text-[10px] font-bold text-muted-foreground hover:text-secondary transition-colors uppercase tracking-[0.2em]"
              >
                ← Reset Analysis
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="search-bar flex-1 min-w-[200px]">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, company, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none"
        >
          {departments.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none"
        >
          {companies.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((alumni) => {
          const aid = alumni.id || alumni._id;
          const initials = alumni.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
          const matchScore = getMatchScore(alumni);
          const alreadyRequested = existingRequests.includes(aid);

          return (
            <div key={aid} className="alumni-card group animate-fade-in-up shadow-card">
              <div className="flex items-start gap-4 mb-4">
                <div className="avatar-lg text-sm flex-shrink-0 group-hover:scale-110 transition-transform">{initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-foreground truncate">{alumni.name}</h4>
                    {matchScore !== null && (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20">
                        <Zap size={10} className="text-secondary" />
                        <span className="text-[10px] font-bold text-secondary">
                          {matchScore}%
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{alumni.role_title || "Professional Mentor"}</p>
                  <p className="text-xs font-bold mt-1" style={{ color: "hsl(var(--secondary))" }}>
                    <Building2 size={10} className="inline mr-1" />{alumni.company || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Experience</p>
                  <p className="text-xs font-semibold">{alumni.experience || 0} Years</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Batch</p>
                  <p className="text-xs font-semibold">{alumni.batch || "N/A"}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {(alumni.skills || []).slice(0, 3).map((skill) => (
                  <span key={skill} className="px-2 py-0.5 rounded-md bg-secondary/5 text-secondary text-[10px] font-bold border border-secondary/10">
                    {skill}
                  </span>
                ))}
                {(alumni.skills || []).length > 3 && (
                  <span className="text-[10px] text-muted-foreground font-medium flex items-center">
                    +{(alumni.skills || []).length - 3} more
                  </span>
                )}
              </div>

              {alumni.bio && <p className="text-xs text-muted-foreground mb-4 line-clamp-2 italic">"{alumni.bio}"</p>}

              <button
                onClick={() => !alreadyRequested && setSelectedAlumni(alumni)}
                disabled={alreadyRequested}
                className="w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                style={{
                  background: alreadyRequested ? "hsl(var(--muted))" : "var(--gradient-blue)",
                  color: "white"
                }}
              >
                {alreadyRequested ? (
                  <><CheckCircle size={14} /> Request Sent</>
                ) : (
                  <><MessageSquare size={14} /> View Details & Connect</>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border mt-10">
          <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
            <Users size={32} />
          </div>
          <h4 className="font-bold text-lg">No Results Found</h4>
          <p className="text-muted-foreground text-sm">Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* Mentor Details & Request Modal */}
      {selectedAlumni && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
            {/* Decoration Background */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 rounded-full -ml-20 -mb-20 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative">
              <h3 className="font-playfair text-2xl font-black text-foreground">Mentor Full Profile</h3>
              <button
                onClick={() => setSelectedAlumni(null)}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mb-8 relative">
              {/* Profile Side */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                <div className="w-24 h-24 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary font-black text-3xl shadow-inner uppercase">
                  {selectedAlumni.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-playfair text-xl font-bold">{selectedAlumni.name}</h2>
                  <p className="text-secondary font-bold text-sm">{selectedAlumni.role_title || "Verified Mentor"}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{selectedAlumni.company || "Leading Tech Company"}</p>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-secondary" /> {selectedAlumni.location || "On-site"}</span>
                  <span className="flex items-center gap-1.5"><Award size={14} className="text-secondary" /> {selectedAlumni.experience} yrs exp</span>
                </div>
              </div>

              {/* Data Side */}
              <div className="flex-1 space-y-6">
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-3">Professional Bio</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed italic">
                    {selectedAlumni.bio || "No detailed bio provided yet. But I'm here to help you grow in your career journey!"}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-3">Core Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedAlumni.skills || []).map((skill) => (
                      <span key={skill} className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary text-xs font-bold border border-secondary/10 shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-2xl bg-muted/30 border border-border">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Department</p>
                    <p className="text-sm font-black text-foreground">{selectedAlumni.department}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/30 border border-border">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Graduation</p>
                    <p className="text-sm font-black text-foreground">Class of {selectedAlumni.batch}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8 relative">
              <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-4">Quick Connect Message</h4>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I saw your profile and would love to get your mentorship on..."
                rows={3}
                className="w-full px-5 py-4 rounded-2xl border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all bg-muted/20"
              />
              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <button
                  onClick={() => setSelectedAlumni(null)}
                  className="flex-1 py-4 rounded-2xl text-sm font-bold text-foreground border border-border hover:bg-muted transition-all active:scale-95"
                >
                  Close Profile
                </button>
                <button
                  onClick={() => handleSendRequest(selectedAlumni._id || selectedAlumni.id)}
                  disabled={!message.trim() || existingRequests.includes(selectedAlumni._id || selectedAlumni.id)}
                  className="flex-[2] py-4 rounded-2xl text-sm font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: "var(--gradient-blue)" }}
                >
                  <Send size={18} /> {existingRequests.includes(selectedAlumni._id || selectedAlumni.id) ? "Message Sent" : "Send Mentorship Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FindMentorsPage;
