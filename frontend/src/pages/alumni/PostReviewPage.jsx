import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, Building2, Calendar, User, Save, Send, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { useAuth } from "@/context/AuthContext";
import API_BASE_URL from "@/config";

const PostReviewPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        company: "",
        role: "",
        rating: "5",
        content: "",
        pros: "",
        cons: "",
        interviewProcess: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                rating: parseInt(formData.rating, 10)
            };
            const response = await fetch("${API_BASE_URL}/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast({
                    title: "Review Shared Successfully!",
                    description: "Thanks for sharing your journey and helping fellow students.",
                });
                setFormData({ company: "", role: "", rating: "5", content: "", pros: "", cons: "", interviewProcess: "" });
            } else {
                const data = await response.json();
                toast({ title: "Error", description: data.message, variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: "Failed to connect to the server", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout
            title="Share Your Review"
            subtitle="Provide placement insights and company reviews for the juniors"
        >
            <div className="max-w-4xl mx-auto animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form Content */}
                    <Card className="lg:col-span-2 platform-card border-none overflow-hidden">
                        <CardHeader className="bg-primary text-white p-8">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                                    <Star size={24} className="text-yellow-400 fill-yellow-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-playfair">Review & Insights</CardTitle>
                                    <CardDescription className="text-blue-100">
                                        Share your experience with a company to help others prepare.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="company" className="text-sm font-semibold flex items-center gap-2">
                                            <Building2 size={16} className="text-secondary" /> Company Name
                                        </Label>
                                        <Input
                                            id="company"
                                            name="company"
                                            placeholder="e.g. Amazon, TCS, Infosys"
                                            required
                                            value={formData.company}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-sm font-semibold flex items-center gap-2">
                                            <User size={16} className="text-secondary" /> Role during Placement
                                        </Label>
                                        <Input
                                            id="role"
                                            name="role"
                                            placeholder="e.g. SDE-1, Data Analyst"
                                            required
                                            value={formData.role}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rating" className="text-sm font-semibold flex items-center gap-2">
                                        <Star size={16} className="text-yellow-500" /> Company Rating
                                    </Label>
                                    <div className="flex items-center gap-4">
                                        <select
                                            id="rating"
                                            name="rating"
                                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            value={formData.rating}
                                            onChange={handleChange}
                                        >
                                            <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
                                            <option value="4">⭐⭐⭐⭐ Very Good (4/5)</option>
                                            <option value="3">⭐⭐⭐ Good (3/5)</option>
                                            <option value="2">⭐⭐ Fair (2/5)</option>
                                            <option value="1">⭐ Poor (1/5)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content" className="text-sm font-semibold flex items-center gap-2">
                                        <MessageSquare size={16} className="text-secondary" /> Your Overall Review
                                    </Label>
                                    <Textarea
                                        id="content"
                                        name="content"
                                        placeholder="Write a brief overview of your experience at the company..."
                                        rows={3}
                                        required
                                        value={formData.content}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="pros" className="text-sm font-semibold text-green-600 flex items-center gap-2">
                                            <Save size={16} /> Pros
                                        </Label>
                                        <Textarea
                                            id="pros"
                                            name="pros"
                                            placeholder="Work culture, benefits, etc."
                                            rows={2}
                                            value={formData.pros}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cons" className="text-sm font-semibold text-red-600 flex items-center gap-2">
                                            <XCircle size={16} /> Cons
                                        </Label>
                                        <Textarea
                                            id="cons"
                                            name="cons"
                                            placeholder="Pressure, hours, etc."
                                            rows={2}
                                            value={formData.cons}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="interviewProcess" className="text-sm font-semibold flex items-center gap-2">
                                        <Calendar size={16} className="text-secondary" /> Interview Process & Tips
                                    </Label>
                                    <Textarea
                                        id="interviewProcess"
                                        name="interviewProcess"
                                        placeholder="Describe rounds, questions asked, and tips for juniors..."
                                        rows={4}
                                        required
                                        value={formData.interviewProcess}
                                        onChange={handleChange}
                                    />
                                </div>

                                <Button type="submit" disabled={loading} className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-all">
                                    {loading ? "Submitting..." : <><Send size={18} /> Submit Review & Insights</>}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Sidebar Info/Tips */}
                    <div className="space-y-6">
                        <Card className="bg-accent/10 border-accent/20 p-5 rounded-xl shadow-none">
                            <h3 className="font-playfair font-bold text-accent mb-3 flex items-center gap-2">
                                <Star size={18} /> Tips for a Great Review
                            </h3>
                            <ul className="space-y-3 text-xs text-foreground/80">
                                <li className="flex gap-2">
                                    <div className="w-4 h-4 rounded-full bg-accent text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</div>
                                    <span>Be honest but professional about your experience.</span>
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-4 h-4 rounded-full bg-accent text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</div>
                                    <span>Mention specific technical rounds for interview help.</span>
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-4 h-4 rounded-full bg-accent text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</div>
                                    <span>Include tips on which subjects to focus on for this company.</span>
                                </li>
                            </ul>
                        </Card>

                        <Card className="bg-secondary/10 border-secondary/20 p-5 rounded-xl shadow-none">
                            <h3 className="font-playfair font-bold text-secondary mb-3 flex items-center gap-2">
                                <Building2 size={18} /> Why Share?
                            </h3>
                            <p className="text-xs text-foreground/80 leading-relaxed">
                                Your insights directly impact the placement preparation of your juniors. Accurate information helps them target the right companies and prepare effectively for interviews.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PostReviewPage;
