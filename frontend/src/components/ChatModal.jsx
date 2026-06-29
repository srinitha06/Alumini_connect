import React, { useState, useEffect, useRef } from "react";
import { X, Send, Loader2, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ChatModal = ({ isOpen, onClose, mentorshipId, otherUser }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/messages/${mentorshipId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (response.ok) setMessages(data);
        } catch (err) {
            console.error("Failed to fetch messages", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && mentorshipId) {
            setLoading(true);
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
            return () => clearInterval(interval);
        }
    }, [isOpen, mentorshipId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const response = await fetch("http://localhost:5000/api/messages/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    mentorshipId,
                    receiverId: otherUser._id,
                    content: newMessage
                }),
            });

            if (response.ok) {
                const sentMsg = await response.json();
                setMessages([...messages, sentMsg]);
                setNewMessage("");
            }
        } catch (err) {
            console.error("Send error", err);
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[80vh] border border-border animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-primary text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                            {otherUser?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-sm">{otherUser?.name}</p>
                            <p className="text-[10px] opacity-80 uppercase tracking-widest">Active Mentorship</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Body */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10"
                >
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                            <Loader2 className="animate-spin" size={32} />
                            <p className="text-sm">Loading chat...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                            <User size={48} className="mb-2" />
                            <p className="text-sm font-medium">No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.senderId === user.id || msg.senderId === user._id;
                            return (
                                <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${isMe
                                            ? "bg-secondary text-white rounded-tr-none"
                                            : "bg-white text-foreground border border-border rounded-tl-none"
                                        }`}>
                                        <p>{msg.content}</p>
                                        <span className={`text-[9px] block mt-1 opacity-70 ${isMe ? "text-right" : "text-left"}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex gap-2 items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 bg-muted/30 rounded-full text-sm border-none focus:ring-2 focus:ring-secondary/20 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-50 transition-all hover:bg-secondary/90"
                    >
                        {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatModal;
