import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare, User, Calendar, CheckCircle, XCircle, Clock, Filter, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ChatModal from "@/components/ChatModal";
import API_BASE_URL from "@/config";

const MentorshipRequestsPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedChat, setSelectedChat] = useState(null);

    const fetchRequests = async () => {
        try {
            const response = await fetch("${API_BASE_URL}/api/mentorships/incoming-requests", {
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
        fetchRequests();
    }, [user.token]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/mentorships/respond/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setRequests(prev => prev.map(req =>
                    req._id === id ? { ...req, status: newStatus } : req
                ));
                toast({
                    title: `Request ${newStatus}`,
                    description: `The mentorship request has been ${newStatus}.`,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to update request status.",
                });
            }
        } catch (err) {
            console.error("Update error", err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Connection error.",
            });
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesStatus = filter === "all" || req.status === filter;
        const matchesSearch = req.studentId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.studentId.department.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (loading) {
        return (
            <DashboardLayout title="Mentorship Requests" subtitle="Loading applications...">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="animate-spin text-secondary mb-3" size={40} />
                    <p className="text-muted-foreground">Fetching requests...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title="Mentorship Requests"
            subtitle="Review and manage student mentorship applications"
        >
            <div className="space-y-6 animate-fade-in-up">
                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input
                                placeholder="Search students..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <Filter size={16} className="text-secondary" />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-2">Status:</span>
                        {["all", "pending", "accepted", "rejected"].map((s) => (
                            <Button
                                key={s}
                                variant={filter === s ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilter(s)}
                                className={`capitalize h-8 text-xs ${filter === s ? "bg-secondary text-white" : ""}`}
                            >
                                {s}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Requests List */}
                <div className="grid grid-cols-1 gap-4">
                    {filteredRequests.length === 0 ? (
                        <Card className="p-12 text-center bg-white/50 border-dashed border-2">
                            <MessageSquare size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
                            <p className="text-lg font-playfair font-bold text-primary">No requests found</p>
                            <p className="text-sm text-muted-foreground">Try adjusting your filters or wait for new applications.</p>
                        </Card>
                    ) : (
                        filteredRequests.map((req) => {
                            const student = req.studentId;
                            return (
                                <Card key={req._id} className="platform-card flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                            {student?.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-playfair font-bold text-lg">{student?.name}</h3>
                                                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">
                                                    {student?.department}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1"><User size={14} /> Batch: {student?.batch}</span>
                                                <span className="flex items-center gap-1"><Calendar size={14} /> Requested on: {new Date(req.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-xs italic mt-2 text-primary/70 line-clamp-2 max-w-md">
                                                "{req.message || "No message provided."}"
                                            </p>
                                            {student?.skills && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {student.skills.slice(0, 3).map(skill => (
                                                        <span key={skill} className="text-[9px] px-1.5 py-0.5 bg-muted rounded border border-border">{skill}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:items-end gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-border">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-2">Status:</span>
                                            {req.status === "pending" && (
                                                <span className="badge-pending"><Clock size={12} /> Pending</span>
                                            )}
                                            {req.status === "accepted" && (
                                                <span className="badge-verified"><CheckCircle size={12} /> Accepted</span>
                                            )}
                                            {req.status === "rejected" && (
                                                <span className="badge-rejected"><XCircle size={12} /> Rejected</span>
                                            )}
                                        </div>

                                        {req.status === "pending" && (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-red-200 text-red-600 hover:bg-red-50 text-xs h-9 px-4 rounded-lg"
                                                    onClick={() => handleStatusChange(req._id, "rejected")}
                                                >
                                                    <XCircle size={14} className="mr-1.5" /> Decline
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-secondary hover:bg-secondary/90 text-white text-xs h-9 px-4 rounded-lg"
                                                    onClick={() => handleStatusChange(req._id, "accepted")}
                                                >
                                                    <CheckCircle size={14} className="mr-1.5" /> Accept
                                                </Button>
                                            </div>
                                        )}

                                        {req.status === "accepted" && (
                                            <Button
                                                onClick={() => setSelectedChat({ id: req._id, otherUser: student })}
                                                size="sm"
                                                variant="outline"
                                                className="text-secondary border-secondary/20 hover:bg-secondary/5 text-xs h-9 rounded-lg"
                                            >
                                                <MessageSquare size={14} className="mr-1.5" /> Message Student
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            );
                        })
                    )}
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

export default MentorshipRequestsPage;
