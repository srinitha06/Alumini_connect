// ============================================================
// JOBS PAGE — Job listings posted by alumni
// ============================================================

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Search, MapPin, Briefcase, DollarSign, Clock, ExternalLink, Filter, Loader2 } from "lucide-react";
import API_BASE_URL from "@/config";

const JobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("${API_BASE_URL}/api/jobs", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user.token]);

  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase();
    const matchQ = !q || 
      (j.role && j.role.toLowerCase().includes(q)) || 
      (j.company && j.company.toLowerCase().includes(q)) || 
      (j.skills || []).some((s) => s.toLowerCase().includes(q));
    const matchType = filterType === "All" || j.type === filterType;
    return matchQ && matchType;
  });

  const typeColors = {
    "Full-time": "badge-verified",
    "Internship": "badge-pending",
    "Part-time": "badge-rejected",
  };

  return (
    <DashboardLayout
      title="Job Feed"
      subtitle="Exclusive opportunities posted by our alumni network"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-secondary mb-3" size={40} />
          <p className="text-muted-foreground animate-pulse font-medium">Loading opportunities...</p>
        </div>
      ) : (
        <>
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Jobs", value: jobs.length, color: "hsl(var(--secondary))" },
          { label: "Internships", value: jobs.filter((j) => j.type === "Internship").length, color: "hsl(38, 92%, 50%)" },
          { label: "Full-time", value: jobs.filter((j) => j.type === "Full-time").length, color: "hsl(var(--accent))" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-border shadow-card text-center overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-12 h-12 bg-muted/20 rounded-full -mr-6 -mt-6 blur-xl group-hover:bg-secondary/10 transition-colors" />
            <p className="text-2xl font-black relative z-10" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest relative z-10">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="search-bar flex-1 min-w-[250px]">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by role, company, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-white border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-semibold"
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internships</option>
          </select>
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {filtered.map((job) => {
          const poster = job.postedBy;
          const isExpanded = expanded === job._id;

          return (
            <div key={job._id} className="bg-white rounded-xl border border-border shadow-card overflow-hidden group hover:border-secondary/30 transition-all">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Company Logo Placeholder */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 group-hover:scale-105 transition-transform"
                      style={{ background: "var(--gradient-stat)" }}
                    >
                      {job.company?.[0] || 'J'}
                    </div>
                    <div>
                      <h3 className="font-bold text-primary group-hover:text-secondary transition-colors leading-tight">{job.role}</h3>
                      <p className="text-sm font-black uppercase tracking-wider mt-1" style={{ color: "hsl(var(--secondary))" }}>{job.company}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                        {job.salary && <span className="flex items-center gap-1 font-black text-accent">{job.salary}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`${typeColors[job.type]} font-black text-[9px] uppercase tracking-widest`}>{job.type}</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {(job.skills || []).map((s) => <span key={s} className="skill-tag border border-secondary/10 bg-secondary/5 font-bold uppercase text-[9px] tracking-tighter">{s}</span>)}
                </div>

                {/* Expanded Description */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border animate-fade-in-up">
                    <p className="text-xs text-foreground/80 leading-relaxed font-medium">{job.description}</p>
                    {job.requirements && (
                      <div className="mt-3">
                        <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">Requirements</p>
                        <p className="text-xs text-foreground/70 font-medium">{job.requirements}</p>
                      </div>
                    )}
                    {poster && (
                      <div className="mt-4 p-3 bg-muted/20 rounded-lg flex items-center gap-3 border border-border">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs uppercase">
                          {poster.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-primary">Posted by <span className="text-secondary">{poster.name}</span></p>
                          <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">{poster.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3 mt-5 pt-3 border-t border-muted/30">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : job._id)}
                    className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-secondary transition-colors"
                  >
                    {isExpanded ? "Close Insight" : "View Breakdown"}
                  </button>
                  <button
                    className="ml-auto flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                    style={{ background: "var(--gradient-blue)" }}
                  >
                    <ExternalLink size={12} /> Apply Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium italic">No jobs found for your criteria</p>
        </div>
      )}
        </>
      )}
    </DashboardLayout>
  );
};

export default JobsPage;
