import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
    CheckCircle, Clock, XCircle, MessageSquare,
    MapPin, Award, Building2, Loader2, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChatModal from "@/components/ChatModal";

const MyMentorshipsPage = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);

    const fetchMyRequests = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/mentorships/my-requests", {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setRequests(data);
            }
        } catch (err) {
            console.error("Failed to fetch requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRequests();
    }, [user.token]);

    const statusIcon = {
        accepted: <CheckCircle size={16} className="text-secondary" />,
        pending: <Clock size={16} className="text-warning" />,
        rejected: <XCircle size={16} className="text-destructive" />
    };

    const statusClass = {
        accepted: "bg-secondary/10 text-secondary border-secondary/20",
        pending: "bg-warning/10 text-warning border-warning/20",
        rejected: "bg-destructive/10 text-destructive border-destructive/20"
    };

    if (loading) {
        return (
            <DashboardLayout title="My Mentorships" subtitle="Loading your connections...">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="animate-spin text-secondary mb-3" size={40} />
                    <p className="text-muted-foreground">Fetching your requests...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title="My Mentorships"
            subtitle="Track and manage your mentorship requests & connections"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {requests.length === 0 ? (
                    <div className="lg:col-span-2 text-center py-20 bg-white rounded-3xl border border-dashed border-border">
                        <MessageSquare size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
                        <h3 className="text-xl font-bold">No mentorships yet</h3>
                        <p className="text-muted-foreground mb-6">Connect with verified alumni to get started on your career path.</p>
                        <Link to="/student/mentors">
                            <button className="px-6 py-3 bg-secondary text-white rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-secondary/20">
                                Find Mentors Now
                            </button>
                        </Link>
                    </div>
                ) : (
                    requests.map((req) => {
                        const alumni = req.alumniId;
                        return (
                            <Card key={req._id} className="platform-card p-6 border-border hover:shadow-xl transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-primary font-bold text-xl uppercase">
                                            {alumni?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{alumni?.name}</h4>
                                            <p className="text-xs text-muted-foreground font-medium">{alumni?.role_title || "Professional Mentor"}</p>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-secondary mt-1">
                                                <Building2 size={12} /> {alumni?.company || "Verified Alumni"}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={`px-3 py-1 rounded-full flex items-center gap-1.5 capitalize text-[10px] font-bold ${statusClass[req.status]}`}>
                                        {statusIcon[req.status]}
                                        {req.status}
                                    </Badge>
                                </div>

                                <div className="bg-muted/30 rounded-xl p-4 mb-4">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5">My Message</p>
                                    <p className="text-xs italic text-foreground/80 leading-relaxed">
                                        "{req.message || "No message provided."}"
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                                    <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                        <Clock size={12} /> Requested on {new Date(req.createdAt).toLocaleDateString()}
                                    </span>
                                    {req.status === "accepted" ? (
                                        <button
                                            onClick={() => setSelectedChat({ id: req._id, otherUser: alumni })}
                                            className="px-4 py-2 bg-secondary text-white rounded-lg text-xs font-bold hover:bg-secondary/90 transition-colors flex items-center gap-2"
                                        >
                                            <MessageSquare size={14} /> Send Message
                                        </button>
                                    ) : (
                                        <Link to="/student/mentors" className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline">
                                            View Profile <ArrowRight size={14} />
                                        </Link>
                                    )}
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Quick Find Mentors CTA */}
            {requests.length > 0 && (
                <div className="mt-12 platform-card bg-primary text-white border-none shadow-xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-playfair font-black mb-2">Want more guidance?</h3>
                            <p className="text-white/70 text-sm max-w-md">Our AI can help you find more mentors based on your specific career goals and technical interests.</p>
                        </div>
                        <Link to="/student/mentors">
                            <button className="px-8 py-4 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-all active:scale-95 shadow-lg shadow-secondary/20">
                                Discover More
                            </button>
                        </Link>
                    </div>
                    {/* Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl" />
                </div>
            )}

            <ChatModal
                isOpen={!!selectedChat}
                onClose={() => setSelectedChat(null)}
                mentorshipId={selectedChat?.id}
                otherUser={selectedChat?.otherUser}
            />
        </DashboardLayout>
    );
};

export default MyMentorshipsPage;
