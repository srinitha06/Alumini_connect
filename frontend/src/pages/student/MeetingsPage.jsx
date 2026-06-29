import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Clock, MapPin, Users, Loader2, CheckCircle, Info, ExternalLink, XCircle } from "lucide-react";
import API_BASE_URL from "@/config";

const MeetingsPage = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // id of meeting being acted upon

  useEffect(() => {
    fetchMeetings();
  }, [user.token]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await fetch("${API_BASE_URL}/api/meetings", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMeetings(data);
      }
    } catch (err) {
      console.error("Error fetching meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (meetingId) => {
    try {
      setActionLoading(meetingId);
      const res = await fetch(`${API_BASE_URL}/api/meetings/${meetingId}/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Update local state without refetching all meetings
        setMeetings(prevMeetings => 
          prevMeetings.map(m => {
            if (m._id !== meetingId) return m;
            
            // Toggle registration in local state
            const isRegistered = m.registeredStudents.includes(user._id);
            let updatedStudents = [...m.registeredStudents];
            
            if (isRegistered) {
                updatedStudents = updatedStudents.filter(id => id !== user._id);
            } else {
                updatedStudents.push(user._id);
            }
            
            return { ...m, registeredStudents: updatedStudents };
          })
        );
      } else {
          alert(`Error: ${data.message || "Failed to register"}`);
      }
    } catch (err) {
      console.error("Error registering for meeting:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const isUpcoming = (dateStr) => {
    const meetingDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return meetingDate >= today;
  };

  const getUpcomingRegisteredMeetings = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return meetings.filter(m => {
      if (!m.registeredStudents?.includes(user._id)) return false;
      const meetingDate = new Date(m.date);
      // Check if it's coming up within the next 24 hours
      return meetingDate >= now && meetingDate <= tomorrow;
    });
  };

  const upcomingRegisteredMeetings = getUpcomingRegisteredMeetings();

  return (
    <DashboardLayout
        title="Mentor Meetings"
        subtitle="Sessions scheduled by your connected alumni"
    >
      <div className="platform-card">
        {upcomingRegisteredMeetings.length > 0 && (
          <div className="mb-6 p-5 rounded-xl border shadow-sm" style={{ background: "linear-gradient(to right, hsl(var(--secondary) / 0.1), hsl(var(--secondary) / 0.05))", borderColor: "hsl(var(--secondary) / 0.3)" }}>
            <div className="flex gap-4 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-secondary shrink-0" style={{ background: "hsl(var(--secondary) / 0.15)" }}>
                <Clock className="animate-pulse" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-secondary font-bold text-lg mb-1">You have meetings coming up soon!</h3>
                <p className="text-sm text-secondary/70 mb-4">Don't forget to join these upcoming sessions.</p>
                <div className="space-y-3">
                  {upcomingRegisteredMeetings.map(m => (
                    <div key={m._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/60 p-3.5 rounded-lg border border-secondary/20 shadow-sm">
                      <div>
                         <span className="font-bold text-foreground text-sm block mb-1">{m.title}</span> 
                         <span className="text-muted-foreground text-xs font-medium flex items-center gap-1.5"><Calendar size={12}/> {new Date(m.date).toLocaleDateString()} at {m.time}</span>
                      </div>
                      <button
                        onClick={() => handleRegister(m._id)}
                        disabled={actionLoading === m._id}
                        className="shrink-0 pl-3 pr-4 py-1.5 rounded-lg text-xs font-bold bg-white border border-secondary/30 text-secondary hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors flex items-center gap-2"
                      >
                        {actionLoading === m._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <XCircle size={14} />
                        )}
                        Cancel Registration
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border" id="meetings-list">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: "var(--gradient-blue)"}}>
            <Calendar size={20} />
            </div>
            <div>
            <h2 className="text-xl font-playfair font-black text-primary">Available Sessions</h2>
            <p className="text-sm text-muted-foreground">Register to join discussions and learning sessions</p>
            </div>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-secondary mb-4" size={40} />
              <p className="font-medium text-muted-foreground">Finding available meetings...</p>
            </div>
        ) : meetings.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
              <Calendar size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-lg font-bold text-primary">No meetings scheduled</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                Your connected alumni haven't scheduled any sessions yet. Once they do, they'll appear here.
              </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {meetings
                .filter(meeting => {
                  const isRegistered = meeting.registeredStudents?.includes(user._id);
                  const isFull = meeting.maxAttendees > 0 && meeting.registeredStudents?.length >= meeting.maxAttendees;
                  return isRegistered || !isFull;
                })
                .map((meeting) => {
                const upcoming = isUpcoming(meeting.date);
                const isRegistered = meeting.registeredStudents?.includes(user._id);
                const isFull = meeting.maxAttendees > 0 && meeting.registeredStudents?.length >= meeting.maxAttendees;
                const canRegister = upcoming && (!isFull || isRegistered);

                return (
                  <div key={meeting._id} className="rounded-xl border border-border bg-white overflow-hidden hover:border-secondary/30 transition-all hover:shadow-lg group flex flex-col h-full">
                    {/* Header */}
                    <div className="p-5 border-b border-border relative">
                        {upcoming ? (
                            <div className="absolute top-5 right-5 text-[10px] font-bold bg-[#10b981]/10 text-[#10b981] px-2.5 py-1 rounded-full border border-[#10b981]/20">Upcoming</div>
                        ) : (
                            <div className="absolute top-5 right-5 text-[10px] font-bold bg-muted text-muted-foreground px-2.5 py-1 rounded-full">Past</div>
                        )}
                        
                        <h3 className="font-playfair font-black text-lg text-primary group-hover:text-secondary transition-colors pr-20">{meeting.title}</h3>
                        
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-[10px] font-bold text-secondary uppercase">
                                {meeting.alumniId?.name?.charAt(0)}
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">
                                Hosted by <span className="text-primary font-bold">{meeting.alumniId?.name}</span>
                            </span>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1">
                        <div className="space-y-3 mb-5 bg-muted/10 p-4 rounded-lg border border-border/50">
                            <div className="flex items-start gap-3">
                                <Calendar size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-primary">{new Date(meeting.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="text-xs text-muted-foreground">at {meeting.time} ({meeting.durationMinutes} mins)</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                                <p className="text-sm text-primary font-medium break-all">{meeting.location}</p>
                            </div>
                        </div>

                        {meeting.description && (
                            <div className="mb-4">
                                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Description</p>
                                <p className="text-sm text-primary/80 leading-relaxed">{meeting.description}</p>
                            </div>
                        )}

                        {meeting.agenda && (
                            <div className="mb-4 bg-secondary/5 border border-secondary/10 p-3 rounded-lg">
                                <p className="text-xs font-bold uppercase text-secondary mb-1 flex items-center gap-1">
                                    <Info size={12} /> Agenda
                                </p>
                                <p className="text-sm text-primary/80 whitespace-pre-wrap">{meeting.agenda}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-border bg-muted/5 mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <Users size={14} className={isRegistered ? "text-secondary" : ""} />
                            <span className={isRegistered ? "text-primary font-bold" : ""}>
                                {meeting.registeredStudents?.length || 0}
                                {meeting.maxAttendees > 0 ? ` / ${meeting.maxAttendees}` : ""} Registered
                            </span>
                        </div>
                        
                        <button
                            onClick={() => handleRegister(meeting._id)}
                            disabled={actionLoading === meeting._id || (!canRegister && !isRegistered)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                                isRegistered 
                                ? "bg-secondary/10 text-secondary border border-secondary/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" 
                                : "bg-primary text-white hover:bg-secondary disabled:opacity-50 disabled:hover:bg-primary shadow-md hover:shadow-lg"
                            }`}
                        >
                            {actionLoading === meeting._id ? (
                                <Loader2 size={16} className="animate-spin mr-1" />
                            ) : isRegistered ? (
                                <CheckCircle size={16} />
                            ) : null}
                            
                            {isRegistered 
                                ? "Registered (Click to cancel)" 
                                : isFull 
                                    ? "Meeting Full" 
                                    : "Register to Join"}
                        </button>
                    </div>
                  </div>
                );
              })}
            </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MeetingsPage;
