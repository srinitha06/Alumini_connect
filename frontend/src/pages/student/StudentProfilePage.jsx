import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Mail, GraduationCap, Briefcase, Plus, X, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const StudentProfilePage = () => {
    const { user } = useAuth();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        department: user?.department || "Computer Science",
        batch: user?.batch || "2024",
        skills: user?.skills || ["JavaScript", "React", "Python", "Data Structures"],
        interests: user?.interests || ["Web Development", "Machine Learning", "Startups"],
        bio: user?.bio || "Aspiring software engineer looking to learn from industry experts.",
        newSkill: "",
        newInterest: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = () => {
        if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, formData.newSkill.trim()],
                newSkill: ""
            }));
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleAddInterest = () => {
        if (formData.newInterest.trim() && !formData.interests.includes(formData.newInterest.trim())) {
            setFormData(prev => ({
                ...prev,
                interests: [...prev.interests, formData.newInterest.trim()],
                newInterest: ""
            }));
        }
    };

    const handleRemoveInterest = (interestToRemove) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.filter(interest => interest !== interestToRemove)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast({
            title: "Profile Updated",
            description: "Your student profile has been successfully updated.",
        });
    };

    return (
        <DashboardLayout
            title="My Profile"
            subtitle="Manage your academic and professional identity"
        >
            <div className="max-w-4xl mx-auto animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="platform-card text-center overflow-hidden border-none shadow-xl">
                            <div className="h-24 bg-gradient-to-r from-primary to-secondary"></div>
                            <CardContent className="-mt-12 relative z-10">
                                <div className="w-24 h-24 rounded-full border-4 border-white bg-white mx-auto shadow-lg overflow-hidden flex items-center justify-center text-primary font-bold text-3xl font-playfair">
                                    {formData.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <h3 className="mt-4 text-xl font-playfair font-black text-primary">{formData.name}</h3>
                                <p className="text-sm text-muted-foreground font-medium">{formData.department}</p>
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground p-2 rounded-lg bg-muted/30">
                                        <Mail size={14} className="text-secondary" />
                                        <span className="truncate">{formData.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground p-2 rounded-lg bg-muted/30">
                                        <GraduationCap size={14} className="text-accent" />
                                        <span>Batch {formData.batch}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="platform-card border-none shadow-lg">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-playfair font-bold text-primary italic">Profile Strength</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full bg-muted rounded-full h-2 mb-3">
                                    <div className="bg-gradient-to-r from-secondary to-accent h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center">85% Complete</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Edit Form */}
                    <div className="lg:col-span-2">
                        <Card className="platform-card border-none shadow-xl">
                            <CardHeader className="border-b border-border/50 pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-playfair font-black text-primary">Edit Professional Profile</CardTitle>
                                        <CardDescription className="text-xs">Update your information to get better AI recommendations</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Personal Info Section */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Personal Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-xs font-bold text-primary">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="h-11 rounded-xl bg-white border-border"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-xs font-bold text-primary">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    disabled
                                                    className="h-11 rounded-xl bg-muted/50 border-border cursor-not-allowed opacity-70"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="department" className="text-xs font-bold text-primary">Department</Label>
                                                <Input
                                                    id="department"
                                                    name="department"
                                                    value={formData.department}
                                                    onChange={handleChange}
                                                    className="h-11 rounded-xl bg-white border-border"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="batch" className="text-xs font-bold text-primary">Current Batch</Label>
                                                <Input
                                                    id="batch"
                                                    name="batch"
                                                    value={formData.batch}
                                                    onChange={handleChange}
                                                    className="h-11 rounded-xl bg-white border-border"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills Section */}
                                    <div className="space-y-4 pt-4">
                                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Professional Skills</h4>
                                        <div className="flex flex-wrap gap-2 mb-4 p-4 rounded-xl bg-muted/20 border border-dashed border-border">
                                            {formData.skills.map((skill) => (
                                                <Badge key={skill} variant="secondary" className="px-3 py-1.5 rounded-lg bg-white border-border text-primary font-bold text-[10px] flex items-center gap-1.5 shadow-sm group">
                                                    {skill}
                                                    <X size={12} className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors" onClick={() => handleRemoveSkill(skill)} />
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Add a new skill (e.g., UI Design, Node.js)"
                                                name="newSkill"
                                                value={formData.newSkill}
                                                onChange={handleChange}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                                className="h-11 rounded-xl bg-white border-border"
                                            />
                                            <Button type="button" onClick={handleAddSkill} variant="outline" className="h-11 w-11 p-0 rounded-xl border-secondary text-secondary hover:bg-secondary/5">
                                                <Plus size={18} />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Interests Section */}
                                    <div className="space-y-4 pt-4">
                                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Focus Areas & Interests</h4>
                                        <div className="flex flex-wrap gap-2 mb-4 p-4 rounded-xl bg-muted/20 border border-dashed border-border">
                                            {formData.interests.map((interest) => (
                                                <Badge key={interest} variant="secondary" className="px-3 py-1.5 rounded-lg bg-white border-border text-secondary font-bold text-[10px] flex items-center gap-1.5 shadow-sm">
                                                    {interest}
                                                    <X size={12} className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors" onClick={() => handleRemoveInterest(interest)} />
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Add interest (e.g., Cloud Computing, Fintech)"
                                                name="newInterest"
                                                value={formData.newInterest}
                                                onChange={handleChange}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                                                className="h-11 rounded-xl bg-white border-border"
                                            />
                                            <Button type="button" onClick={handleAddInterest} variant="outline" className="h-11 w-11 p-0 rounded-xl border-accent text-accent hover:bg-accent/5">
                                                <Plus size={18} />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Bio Section */}
                                    <div className="space-y-4 pt-4">
                                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Professional Bio</h4>
                                        <div className="space-y-2">
                                            <Label htmlFor="bio" className="text-xs font-bold text-primary">About You</Label>
                                            <p className="text-[10px] text-muted-foreground italic mb-2">This bio will be shown to mentors when you send requests.</p>
                                            <Textarea
                                                id="bio"
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                placeholder="Write a brief professional summary..."
                                                className="min-h-[120px] rounded-xl bg-white border-border p-4 text-sm resize-none"
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01]">
                                        <Save size={18} /> Save Professional Identity
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentProfilePage;
