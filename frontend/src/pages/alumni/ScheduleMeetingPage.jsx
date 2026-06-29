import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Clock, MapPin, Users, FileText, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ScheduleMeetingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    agenda: "",
    date: "",
    time: "",
    durationMinutes: 60,
    location: "",
    maxAttendees: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [connectedStudentsCount, setConnectedStudentsCount] = useState(0);
  const [meetings, setMeetings] = useState([]);
  const [fetchingMeetings, setFetchingMeetings] = useState(true);

  // Fetch connected students count and existing meetings
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingMeetings(true);
        // 1. Fetch connected mentorships to get student count
        const mentorshipsRes = await fetch("http://localhost:5000/api/mentorships/incoming-requests", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        if (mentorshipsRes.ok) {
          const mentorshipsData = await mentorshipsRes.json();
          const accepted = mentorshipsData.filter(m => m.status === "accepted");
          setConnectedStudentsCount(accepted.length);
        }

        // 2. Fetch existing meetings
        const meetingsRes = await fetch("http://localhost:5000/api/meetings", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        if (meetingsRes.ok) {
          const meetingsData = await meetingsRes.json();
          setMeetings(meetingsData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setFetchingMeetings(false);
      }
    };
    
    fetchData();
  }, [user.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:5000/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setMeetings(prev => [data.meeting, ...prev]);
        setFormData({
          title: "",
          description: "",
          agenda: "",
          date: "",
          time: "",
          durationMinutes: 60,
          location: "",
          maxAttendees: 0
        });
        
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(data.message || "Failed to schedule meeting.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const isUpcoming = (dateStr) => {
    const meetingDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return meetingDate >= today;
  };

  return (
    <DashboardLayout
      title="Schedule a Meeting"
      subtitle="Host sessions for your mentees"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="platform-card">
            <h3 className="text-xl font-playfair font-bold text-primary mb-6 flex items-center gap-2">
              <Calendar className="text-secondary" /> 
              Create New Meeting
            </h3>
            
            {success && (
              <div className="mb-6 p-4 rounded-xl bg-secondary/10 border border-secondary/30 text-secondary flex items-start gap-3">
                <CheckCircle className="shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-bold">Meeting scheduled successfully!</p>
                  <p className="text-sm">Notifications have been sent to your connected mentees.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-3">
                <AlertCircle className="shrink-0" size={18} />
                <p className="font-bold text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4 rounded-xl border border-border p-5 bg-muted/5">
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Meeting Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Resume Review Session, Interview Prep"
                    className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full pl-10 p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">Time *</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                      <input
                        type="time"
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full pl-10 p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      name="durationMinutes"
                      min="15"
                      step="15"
                      value={formData.durationMinutes}
                      onChange={handleChange}
                      className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">Max Attendees (0 = Unlimited)</label>
                    <input
                      type="number"
                      name="maxAttendees"
                      min="0"
                      value={formData.maxAttendees}
                      onChange={handleChange}
                      className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Location / Link *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Google Meet Link, Zoom, Room 101"
                      className="w-full pl-10 p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-border p-5 bg-muted/5">
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Brief Description</label>
                  <textarea
                    name="description"
                    rows="2"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What is this meeting about?"
                    className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all resize-none"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Agenda (Optional)</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-muted-foreground" size={16} />
                    <textarea
                      name="agenda"
                      rows="3"
                      value={formData.agenda}
                      onChange={handleChange}
                      placeholder="List topics to be discussed..."
                      className="w-full pl-10 p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
                style={{ background: "var(--gradient-blue)" }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Calendar size={18} />}
                {loading ? "Scheduling..." : "Schedule Meeting"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Stats & History */}
        <div className="space-y-6">
          <div className="rounded-xl p-6 bg-primary text-white border-none shadow-xl relative overflow-hidden hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <h3 className="font-playfair font-bold text-lg mb-2 relative z-10">Mentees Reach</h3>
            <p className="text-sm text-white/70 mb-4 relative z-10">
              When you schedule a meeting, notifications are sent directly to your connected students.
            </p>
            <div className="flex items-center gap-4 relative z-10 p-4 rounded-xl bg-white/10 border border-white/20">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <p className="text-3xl font-black">{connectedStudentsCount}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-secondary">Active Students</p>
              </div>
            </div>
          </div>

          <div className="platform-card min-h-[400px]">
            <h3 className="font-playfair font-bold text-lg mb-4 text-primary flex items-center justify-between">
              Your Meetings
              <span className="text-xs font-bold bg-secondary/10 text-secondary px-2 py-1 rounded-md">
                {meetings.length} Total
              </span>
            </h3>

            {fetchingMeetings ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="animate-spin text-secondary mb-2" size={24} />
                <p className="text-xs text-muted-foreground">Loading meetings...</p>
              </div>
            ) : meetings.length === 0 ? (
              <div className="text-center py-10">
                <Calendar size={32} className="mx-auto text-muted mb-3 opacity-50" />
                <p className="text-sm font-bold text-primary">No meetings scheduled</p>
                <p className="text-xs text-muted-foreground mt-1">Use the form to create your first session.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {meetings.map((meeting) => (
                  <div key={meeting._id} className="p-4 rounded-xl border border-border bg-white hover:border-secondary/30 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-primary group-hover:text-secondary transition-colors line-clamp-1" title={meeting.title}>
                        {meeting.title}
                      </h4>
                      {isUpcoming(meeting.date) ? (
                        <span className="shrink-0 text-[10px] font-bold bg-[#10b981]/10 text-[#10b981] px-2 py-0.5 rounded-full border border-[#10b981]/20">Upcoming</span>
                      ) : (
                        <span className="shrink-0 text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Past</span>
                      )}
                    </div>
                    
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={12} className="text-primary/50" />
                        <span>{new Date(meeting.date).toLocaleDateString()} at {meeting.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock size={12} className="text-primary/50" />
                        <span>{meeting.durationMinutes} mins</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5 text-primary font-medium">
                        <Users size={14} className="text-secondary" />
                        <span>{meeting.registeredStudents?.length || 0} Registrations</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </DashboardLayout>
  );
};

export default ScheduleMeetingPage;
