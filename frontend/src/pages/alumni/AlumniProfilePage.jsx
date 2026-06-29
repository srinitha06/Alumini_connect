import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Building2, GraduationCap, MapPin, Camera, Save, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AlumniProfilePage = () => {
    const { user } = useAuth();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        company: user?.company || "Google",
        designation: user?.designation || "Senior Software Engineer",
        location: user?.location || "Mountain View, CA",
        skills: user?.skills || ["React", "Node.js", "Python", "Cloud Computing"],
        bio: user?.bio || "Experienced software engineer passionate about mentoring and giving back to the community.",
        newSkill: ""
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
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast({
            title: "Profile Updated",
            description: "Your professional profile has been successfully updated.",
        });
    };

    return (
        <DashboardLayout
            title="My Professional Profile"
            subtitle="Manage your identity and professional information"
        >
            <div className="max-w-5xl mx-auto animate-fade-in-up">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Side: Avatar & Basic Info */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <Card className="platform-card text-center p-8">
                            <div className="relative inline-block mb-4">
                                <div className="avatar-xl mx-auto ring-4 ring-secondary/20 ring-offset-4">
                                    {formData.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-secondary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h2 className="text-xl font-playfair font-bold text-primary">{formData.name}</h2>
                            <p className="text-sm text-muted-foreground">{formData.designation}</p>
                            <div className="flex items-center justify-center gap-1 mt-1">
                                <span className="badge-verified">Verified Alumni</span>
                            </div>
                            <div className="mt-6 pt-6 border-t border-border flex flex-col items-start gap-4">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground w-full">
                                    <Mail size={16} className="text-secondary flex-shrink-0" />
                                    <span className="truncate">{formData.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground w-full">
                                    <Building2 size={16} className="text-secondary flex-shrink-0" />
                                    <span>{formData.company}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground w-full">
                                    <MapPin size={16} className="text-secondary flex-shrink-0" />
                                    <span>{formData.location}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="platform-card p-6">
                            <h3 className="font-playfair font-bold mb-4 flex items-center gap-2">
                                <GraduationCap size={18} className="text-secondary" /> Academic Background
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Batch</p>
                                    <p className="font-semibold">{user?.batch || "2018 - 2022"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Department</p>
                                    <p className="font-semibold">{user?.department || "Computer Science Engineering"}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Side: Editable Details */}
                    <div className="w-full md:w-2/3 space-y-6">
                        <Card className="platform-card border-none">
                            <CardHeader>
                                <CardTitle className="font-playfair text-xl">Professional Information</CardTitle>
                                <CardDescription>Update your current role and work details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="designation">Current Designation</Label>
                                            <Input
                                                id="designation"
                                                name="designation"
                                                value={formData.designation}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="company">Current Company</Label>
                                            <Input
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Professional Bio</Label>
                                        <Textarea
                                            id="bio"
                                            name="bio"
                                            rows={4}
                                            value={formData.bio}
                                            onChange={handleChange}
                                            placeholder="Tell us about your professional journey..."
                                        />
                                    </div>

                                    <div className="space-y-4 pt-4 border-t">
                                        <Label className="text-base font-playfair font-bold">Skills & Expertise</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.skills.map((skill) => (
                                                <span key={skill} className="skill-tag flex items-center gap-1.5 py-1.5 pl-3 pr-2">
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSkill(skill)}
                                                        className="hover:bg-red-200 rounded-full p-0.5 transition-colors"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Add a new skill..."
                                                value={formData.newSkill}
                                                onChange={(e) => setFormData(prev => ({ ...prev, newSkill: e.target.value }))}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleAddSkill}
                                                className="border-secondary text-secondary hover:bg-secondary/10"
                                            >
                                                <Plus size={18} />
                                            </Button>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2">
                                        <Save size={18} /> Save Profile Changes
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-r from-secondary/10 to-accent/10 border-none p-6 text-center">
                            <h3 className="font-playfair font-bold text-primary mb-2">Be a Mentor!</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Your profile is visible to students. Completing your profile increases your chances of being selected as a mentor for bright young minds.
                            </p>
                            <div className="flex justify-center gap-4">
                                <div className="flex flex-col items-center">
                                    <span className="text-xl font-bold text-secondary">15</span>
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Mentees</span>
                                </div>
                                <div className="w-px h-10 bg-border"></div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xl font-bold text-accent">4.9</span>
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Rating</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AlumniProfilePage;
