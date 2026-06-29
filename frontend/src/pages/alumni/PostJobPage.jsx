import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Building2, MapPin, DollarSign, Clock, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { useAuth } from "@/context/AuthContext";

const PostJobPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    location: "",
    salary: "",
    type: "Full-time",
    description: "",
    requirements: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Job Posted Successfully!",
          description: "Your job opening has been published to the board.",
        });
        setFormData({ role: "", company: "", location: "", salary: "", type: "Full-time", description: "", requirements: "" });
      } else {
        const data = await response.json();
        toast({ title: "Error", description: data.error || data.message || "Something went wrong", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to connect to the server", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout 
      title="Post a Job" 
      subtitle="Help students find their dream career opportunities"
    >
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <Card className="platform-card border-none overflow-hidden">
          <CardHeader className="bg-primary text-white p-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                <Briefcase size={24} className="text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-playfair">Job Opportunity Details</CardTitle>
                <CardDescription className="text-blue-100">
                  Fill in the details below to post a new job opening at your company.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-2">
                    <Briefcase size={16} className="text-secondary" /> Job Title
                  </Label>
                  <Input 
                    id="role" 
                    name="role" 
                    placeholder="e.g. Senior Software Engineer" 
                    required 
                    value={formData.role}
                    onChange={handleChange}
                    className="border-border focus:ring-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-semibold flex items-center gap-2">
                    <Building2 size={16} className="text-secondary" /> Company Name
                  </Label>
                  <Input 
                    id="company" 
                    name="company" 
                    placeholder="e.g. Google, Microsoft" 
                    required 
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-semibold flex items-center gap-2">
                    <MapPin size={16} className="text-secondary" /> Location
                  </Label>
                  <Input 
                    id="location" 
                    name="location" 
                    placeholder="e.g. Remote, Bangalore, New York" 
                    required 
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-sm font-semibold flex items-center gap-2">
                    <DollarSign size={16} className="text-secondary" /> Salary Range (Optional)
                  </Label>
                  <Input 
                    id="salary" 
                    name="salary" 
                    placeholder="e.g. ₹15L - ₹25L or $120k - $150k" 
                    value={formData.salary}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-semibold flex items-center gap-2">
                  <Clock size={16} className="text-secondary" /> Employment Type
                </Label>
                <select 
                  id="type" 
                  name="type"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
                  <span className="w-4 h-4 rounded-sm bg-secondary/20 flex items-center justify-center text-[10px] text-secondary font-bold">D</span> Job Description
                </Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Describe the role, responsibilities, and team..." 
                  rows={4} 
                  required
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-sm font-semibold flex items-center gap-2">
                  <span className="w-4 h-4 rounded-sm bg-secondary/20 flex items-center justify-center text-[10px] text-secondary font-bold">R</span> Requirements & Skills
                </Label>
                <Textarea 
                  id="requirements" 
                  name="requirements" 
                  placeholder="List required skills, experience, and qualifications..." 
                  rows={4} 
                  required
                  value={formData.requirements}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-all">
                {loading ? "Posting..." : <><Send size={18} /> Post Job Vacancy</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PostJobPage;
