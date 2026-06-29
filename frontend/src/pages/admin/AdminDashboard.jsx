import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Users, Briefcase, CheckCircle, XCircle, Shield, Loader2, AlertCircle, Calendar, ChevronDown, ChevronUp, Star, LayoutDashboard, TrendingUp } from "lucide-react";

/**
 * Admin Dashboard - Logic for real backend integration
 */
const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/verify')) return 'verify';
    if (path.includes('/users')) return 'users';
    if (path.includes('/meetings')) return 'meetings';
    if (path.includes('/jobs')) return 'jobs';
    if (path.includes('/reviews')) return 'reviews';
    if (path.includes('/stats')) return 'stats';
    return 'overview';
  };

  const [tab, setTab] = useState(getTabFromPath());
  
  useEffect(() => {
    setTab(getTabFromPath());
  }, [location.pathname]);

  const [pendingAlumni, setPendingAlumni] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [placementStats, setPlacementStats] = useState(null);
  const [editingStats, setEditingStats] = useState(false);
  const [statFormData, setStatFormData] = useState({});
  const [expandedMeetingId, setExpandedMeetingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // Fetch unverified alumni
  const fetchPendingAlumni = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/unverified-alumni", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPendingAlumni(data);
      } else {
        setError(data.message || "Failed to fetch pending alumni");
      }
    } catch (err) {
      setError("Connect to server failed");
    }
  };

  // Fetch all alumni (for stats/user list)
  const fetchAllAlumni = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/alumni", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setAllUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch alumni", err);
    }
  };

  // Fetch all meetings
  const fetchAllMeetings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/meetings", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (response.ok) setMeetings(await response.json());
    } catch (err) { console.error("Failed to fetch meetings", err); }
  };

  const fetchJobsAndReviews = async () => {
    try {
      const [jobsRes, reviewsRes, statsRes] = await Promise.all([
        fetch("http://localhost:5000/api/jobs", { headers: { Authorization: `Bearer ${user.token}` } }),
        fetch("http://localhost:5000/api/reviews", { headers: { Authorization: `Bearer ${user.token}` } }),
        fetch("http://localhost:5000/api/stats", { headers: { Authorization: `Bearer ${user.token}` } })
      ]);
      if (jobsRes.ok) setJobs(await jobsRes.json());
      if (reviewsRes.ok) setReviews(await reviewsRes.json());
      if (statsRes.ok) {
        const data = await statsRes.json();
        setPlacementStats(data);
        setStatFormData(data);
      }
    } catch (err) { console.error("Failed to fetch jobs/reviews/stats", err); }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPendingAlumni(), fetchAllAlumni(), fetchAllMeetings(), fetchJobsAndReviews()]);
      setLoading(false);
    };
    loadData();
  }, [user.token]);

  const handleVerify = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/verify-alumni/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (response.ok) {
        setPendingAlumni((prev) => prev.filter((a) => a._id !== id));
        fetchAllAlumni();
      } else {
        alert((await response.json()).message || "Verification failed");
      }
    } catch (err) { alert("Error connecting to server"); }
  };

  const updateReviewStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateStats = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(statFormData)
      });
      if (res.ok) {
        setPlacementStats(await res.json());
        setEditingStats(false);
      }
    } catch (err) { console.error(err); }
  };

  const stats = [
    { label: "Total Alumni", value: allUsers.length, color: "hsl(var(--accent))", icon: <Users size={20} /> },
    { label: "Pending Verifications", value: pendingAlumni.length, color: "hsl(0,72%,51%)", icon: <Shield size={20} /> },
    { label: "Platform Meetings", value: meetings.length, color: "hsl(var(--secondary))", icon: <Calendar size={20} /> },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Admin Control Panel" subtitle="Loading data...">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-secondary mb-3" size={40} />
          <p className="text-muted-foreground animate-pulse">Fetching platform data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Control Panel" subtitle="Manage the entire platform">
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 mb-6 text-destructive">
          <AlertCircle size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-border shadow-card hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-white" style={{ background: s.color }}>{s.icon}</div>
            <p className="text-3xl font-playfair font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-muted/30 p-1 rounded-xl w-fit">
        {(["overview", "verify", "users", "meetings", "jobs", "reviews", "stats"]).map((t) => (
          <button key={t} onClick={() => { setTab(t); navigate(t === 'overview' ? '/admin/dashboard' : `/admin/${t}`); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all duration-200 ${tab === t ? "bg-white text-secondary shadow-sm ring-1 ring-border" : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {t === "verify" ? "Request Panel" : t}
            {t === "verify" && pendingAlumni.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive text-white animate-pulse">{pendingAlumni.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Verify Alumni Tab */}
      {tab === "verify" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-playfair text-xl font-bold">Verification Requests</h3>
            <p className="text-sm text-muted-foreground">{pendingAlumni.length} accounts waiting</p>
          </div>
          {pendingAlumni.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-border p-16 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h4 className="text-lg font-bold text-foreground">Clean Slate!</h4>
              <p className="text-muted-foreground mt-1 max-w-xs mx-auto text-sm">Every alumni account has been processed. No new registration requests at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingAlumni.map((alumni) => (
                <div key={alumni._id} className="bg-white rounded-2xl border border-border p-6 shadow-card hover:border-secondary/30 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xl uppercase group-hover:scale-110 transition-transform">
                        {alumni.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-lg text-foreground">{alumni.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-bold text-muted-foreground uppercase">Alumni</span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Users size={14} /> {alumni.email}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs font-medium">
                          <span className="bg-muted px-2.5 py-1 rounded-lg text-foreground flex items-center gap-1.5"><Briefcase size={12} /> {alumni.company || "Company N/A"}</span>
                          <span className="bg-muted px-2.5 py-1 rounded-lg text-foreground flex items-center gap-1.5">🎓 {alumni.department}</span>
                          <span className="bg-muted px-2.5 py-1 rounded-lg text-foreground flex items-center gap-1.5">⏱ {alumni.experience || 0} yrs exp</span>
                          <span className="bg-muted px-2.5 py-1 rounded-lg text-foreground flex items-center gap-1.5">📅 Batch {alumni.batch}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                      <button onClick={() => handleVerify(alumni._id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
                        style={{ background: "var(--gradient-blue)" }}>
                        <CheckCircle size={16} /> Approve Account
                      </button>
                      <button
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold border border-destructive/30 text-destructive hover:bg-destructive/5 transition-all"
                      >
                        <XCircle size={16} /> Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/10">
            <h3 className="font-bold font-playfair">Registered Alumni Directory</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{u.name}<br /><span className="text-xs font-normal text-muted-foreground font-mono">{u.email}</span></td>
                    <td className="px-6 py-4 text-sm font-medium">{u.company || "-"}</td>
                    <td className="px-6 py-4">
                      {u.verified ? (
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[11px] font-bold border border-green-500/20">Verified</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[11px] font-bold border border-amber-500/20">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{u.department}</td>
                  </tr>
                ))}
                {allUsers.length === 0 && (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-muted-foreground italic">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Meetings Tab */}
      {tab === "meetings" && (
        <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/10">
            <h3 className="font-bold font-playfair">Platform Meetings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Host (Alumni)</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Registrations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {meetings.map((m) => (
                  <React.Fragment key={m._id}>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground">{m.title}</td>
                      <td className="px-6 py-4 text-sm font-medium">{m.alumniId?.name || "Unknown"}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {new Date(m.date).toLocaleDateString()} at {m.time}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setExpandedMeetingId(expandedMeetingId === m._id ? null : m._id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors text-sm font-bold"
                        >
                          <Users size={16} />
                          {m.registeredStudents?.length || 0} Registered
                          {expandedMeetingId === m._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded details row */}
                    {expandedMeetingId === m._id && (
                      <tr className="bg-muted/10">
                        <td colSpan="4" className="px-6 py-4">
                          <div className="p-4 rounded-xl border border-border bg-white shadow-sm">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                              <Users size={14} /> Registered Students List
                            </h4>
                            
                            {!m.registeredStudents || m.registeredStudents.length === 0 ? (
                              <p className="text-sm text-muted-foreground italic">No students have registered yet.</p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {m.registeredStudents.map(student => (
                                  <div key={student._id || student} className="flex items-center gap-3 p-2 rounded-lg border border-border bg-muted/20">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                      {student.name?.charAt(0) || "S"}
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-foreground leading-tight">{student.name || "Student"}</p>
                                      <p className="text-[10px] uppercase text-muted-foreground font-medium">{student.department || "Dept N/A"} • {student.batch || "Batch N/A"}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {meetings.length === 0 && (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-muted-foreground italic">No meetings scheduled.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-2xl border border-secondary/20 p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-playfair font-bold mb-4 flex items-center gap-2 text-secondary">
                <Shield size={28} /> System Governance
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-2xl">
                Welcome to the Alumni Connect administrative command center. You have full oversight of the platform's ecosystem. Use the quick actions below or the tabs above to manage users, moderation, and system-wide engagement.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setTab("verify")} className="px-6 py-3 bg-secondary text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Process {pendingAlumni.length} Pending Requests
                </button>
                <button onClick={() => setTab("reviews")} className="px-6 py-3 bg-white text-secondary border border-secondary/30 rounded-xl text-sm font-bold shadow-sm hover:bg-secondary/5 transition-all">
                  Moderate Reviews
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 shadow-card">
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2 border-b pb-4">
                <Calendar size={20} className="text-primary" /> Core Metrics
              </h4>
              <div className="space-y-6">
                {[
                  { label: "Verified Network", value: allUsers.length, icon: <Users size={18} />, color: "bg-green-50 text-green-600", note: "Active members" },
                  { label: "Live Job Posts", value: jobs.length, icon: <Briefcase size={18} />, color: "bg-blue-50 text-blue-600", note: "Student opportunities" },
                  { label: "Platform Meetings", value: meetings.length, icon: <Calendar size={18} />, color: "bg-purple-50 text-purple-600", note: "Total scheduled" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} flex-shrink-0 animate-pulse-slow`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">{item.label}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-foreground">{item.value}</span>
                        <span className="text-[10px] text-muted-foreground italic">{item.note}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm group hover:border-secondary/20 transition-all">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                <Star size={20} />
              </div>
              <h5 className="font-bold mb-1">Content Moderation</h5>
              <p className="text-xs text-muted-foreground"><b>{reviews.filter(r => r.status === 'Pending').length}</b> reviews awaiting approval in the moderation queue.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm group hover:border-secondary/20 transition-all">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp size={20} />
              </div>
              <h5 className="font-bold mb-1">Placement Tracking</h5>
              <p className="text-xs text-muted-foreground">Current student placement records and historical statistics are up to date.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm group hover:border-secondary/20 transition-all">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                <LayoutDashboard size={20} />
              </div>
              <h5 className="font-bold mb-1">Dashboard Config</h5>
              <p className="text-xs text-muted-foreground">Frontend components were successfully synchronized with the backend data.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm group hover:border-secondary/20 transition-all">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                <Shield size={20} />
              </div>
              <h5 className="font-bold mb-1">System Health</h5>
              <p className="text-xs text-muted-foreground">Database connectivity and API endpoints are operating with low latency.</p>
            </div>
          </div>
        </div>
      )}

      {/* Jobs Tab */}
      {tab === "jobs" && (
        <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/10 flex justify-between items-center">
            <h3 className="font-bold font-playfair">Manage Job Postings</h3>
            <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-bold">{jobs.length} Jobs</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Job Role</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Posted By</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{job.role}<br/><span className="text-xs font-normal text-muted-foreground">{job.location}</span></td>
                    <td className="px-6 py-4 text-sm font-medium">{job.company}</td>
                    <td className="px-6 py-4 text-sm font-medium">{job.postedBy?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-xs font-bold text-muted-foreground">{job.type}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold border bg-green-500/10 text-green-600 border-green-500/20">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-muted-foreground italic">No jobs posted yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {tab === "reviews" && (
        <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/10 flex justify-between items-center">
            <h3 className="font-bold font-playfair">Manage Company Reviews</h3>
            <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-bold">{reviews.length} Reviews</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(review => (
              <div key={review._id} className="p-4 border border-border rounded-xl shadow-sm hover:border-secondary/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-lg">{review.company}</h4>
                      <p className="text-xs text-muted-foreground">{review.role} • By {review.postedBy?.name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-2 py-1 rounded-lg">
                      <span>★</span> {review.rating}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 mt-3 italic line-clamp-3">"{review.content}"</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${review.status === 'Approved' ? 'bg-green-50 text-green-600' : review.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                    {review.status}
                  </span>
                  {review.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateReviewStatus(review._id, 'Approved')} className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-lg hover:bg-secondary/20 transition-colors">Approve</button>
                      <button onClick={() => updateReviewStatus(review._id, 'Rejected')} className="px-3 py-1 border border-destructive/30 text-destructive text-xs font-bold rounded-lg hover:bg-destructive/10 transition-colors">Reject</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center text-muted-foreground italic py-12">No reviews have been posted yet.</div>
            )}
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {tab === "stats" && placementStats && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-secondary to-accent text-white rounded-2xl p-8 shadow-lg flex justify-between items-center">
            <div>
              <h3 className="font-playfair text-2xl font-bold mb-2">Platform Placements & Stats</h3>
              <p className="opacity-90 max-w-lg">A comprehensive overview of platform engagement, student placement outcomes, and active mentorship sessions.</p>
            </div>
            <button 
              onClick={() => setEditingStats(!editingStats)} 
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border border-white/20"
            >
              {editingStats ? "Cancel Editing" : "Manage Statistics"}
            </button>
          </div>

          {!editingStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Placements", value: placementStats.totalPlacements, increase: placementStats.placementsIncrease },
                { label: "Active Mentorships", value: placementStats.activeMentorships, increase: placementStats.mentorshipsIncrease },
                { label: "Companies Onboarded", value: placementStats.companiesOnboarded, increase: placementStats.companiesIncrease },
                { label: "Platform Engagement", value: placementStats.platformEngagement, increase: placementStats.engagementIncrease }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md">{stat.increase}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleUpdateStats} className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h4 className="font-bold text-lg mb-4">Edit Platform Statistics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {[
                  { field: 'totalPlacements', label: 'Total Placements', incField: 'placementsIncrease' },
                  { field: 'activeMentorships', label: 'Active Mentorships', incField: 'mentorshipsIncrease' },
                  { field: 'companiesOnboarded', label: 'Companies Onboarded', incField: 'companiesIncrease' },
                  { field: 'platformEngagement', label: 'Platform Engagement', incField: 'engagementIncrease' }
                ].map((item, i) => (
                  <div key={i} className="space-y-3 p-4 bg-muted/20 rounded-xl border border-border">
                    <label className="text-sm font-bold text-foreground">{item.label}</label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <span className="text-xs text-muted-foreground mb-1 block">Value</span>
                        <input 
                          type="text" 
                          required
                          value={statFormData[item.field] || ''} 
                          onChange={(e) => setStatFormData({...statFormData, [item.field]: e.target.value})}
                          className="w-full text-sm p-2 border border-border rounded-lg"
                        />
                      </div>
                      <div className="w-1/3">
                        <span className="text-xs text-muted-foreground mb-1 block">Increase</span>
                        <input 
                          type="text" 
                          required
                          value={statFormData[item.incField] || ''} 
                          onChange={(e) => setStatFormData({...statFormData, [item.incField]: e.target.value})}
                          className="w-full text-sm p-2 border border-border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setEditingStats(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-secondary hover:bg-secondary/90 transition-colors">Save Changes</button>
              </div>
            </form>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
