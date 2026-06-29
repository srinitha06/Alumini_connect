import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Search, Building2, Users, TrendingUp, Star, ArrowRight, Download, FileText, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import API_BASE_URL from "@/config";

const CompanyReviewsPage = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [alumni, setAlumni] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [alumniRes, reviewsRes, statsRes] = await Promise.all([
                    fetch("${API_BASE_URL}/api/users/alumni", { headers: { Authorization: `Bearer ${user.token}` } }),
                    fetch("${API_BASE_URL}/api/reviews", { headers: { Authorization: `Bearer ${user.token}` } }),
                    fetch("${API_BASE_URL}/api/stats", { headers: { Authorization: `Bearer ${user.token}` } })
                ]);

                if (alumniRes.ok) setAlumni(await alumniRes.json());
                if (reviewsRes.ok) setReviews(await reviewsRes.json());
                if (statsRes.ok) setStats(await statsRes.json());
            } catch (err) {
                console.error("Fetch directory error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.token]);

    const alumniCompanies = useMemo(() => {
        const companies = {};
        alumni.forEach(u => {
            if (u.company) {
                if (!companies[u.company]) {
                    companies[u.company] = {
                        name: u.company,
                        alumniCount: 0,
                        alumniList: [],
                        reviews: []
                    };
                }
                companies[u.company].alumniCount++;
                companies[u.company].alumniList.push(u);
            }
        });

        reviews.forEach(r => {
            if (r.status === 'approved' && companies[r.company]) {
                companies[r.company].reviews.push(r);
            }
        });

        if (stats?.topCompanies) {
            stats.topCompanies.forEach(s => {
                if (companies[s.company]) {
                    companies[s.company].hires = s.hires;
                    companies[s.company].avgPackage = s.avgPackage;
                }
            });
        }

        return Object.values(companies);
    }, [alumni, reviews, stats]);

    const filteredCompanies = alumniCompanies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout
            title="Alumni Company Directory"
            subtitle="Explore companies where our alumni are building impact"
        >
            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="animate-spin text-secondary mb-3" size={40} />
                    <p className="text-muted-foreground animate-pulse font-medium">Scanning alumni network...</p>
                </div>
            ) : (
            <div className="space-y-8 animate-fade-in-up">
                {/* Search and Stats Overview */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="relative w-full md:w-1/2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input
                            placeholder="Search by company name..."
                            className="pl-12 h-12 bg-white border-border shadow-sm rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="bg-white px-5 py-3 rounded-xl border border-border shadow-sm flex items-center gap-3">
                            <Building2 className="text-secondary" size={20} />
                            <div>
                                <p className="text-sm font-bold text-primary leading-none">{alumniCompanies.length}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Companies</p>
                            </div>
                        </div>
                        <div className="bg-white px-5 py-3 rounded-xl border border-border shadow-sm flex items-center gap-3">
                            <Users className="text-accent" size={20} />
                            <div>
                                <p className="text-sm font-bold text-primary leading-none">{alumni.length}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Global Alumni</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Directory */}
                <div className="grid grid-cols-1 gap-6">
                    {filteredCompanies.length === 0 ? (
                        <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-border">
                            <Building2 size={64} className="mx-auto text-muted-foreground opacity-20 mb-4" />
                            <h3 className="text-xl font-playfair font-bold text-primary">No companies found</h3>
                            <p className="text-sm text-muted-foreground">Try a different search term or check back later.</p>
                        </div>
                    ) : (
                        filteredCompanies.map((company) => (
                            <Card key={company.name} className="platform-card border-none overflow-hidden group hover:shadow-xl transition-all duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-12 shrink-0">
                                    {/* Left Panel: Compact Brochure Style */}
                                    <div className="md:col-span-4 bg-gradient-to-br from-primary to-primary/90 text-white p-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                                        <div className="relative z-10">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                                <Building2 size={24} />
                                            </div>
                                            <h3 className="text-2xl font-playfair font-bold mb-1">{company.name}</h3>
                                            <div className="flex items-center gap-1.5 mb-4">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} size={12} className={s <= (company.reviews[0]?.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-white/20"} />
                                                ))}
                                                <span className="text-[10px] font-bold text-white/70 ml-1 uppercase">
                                                    {company.reviews.length} Insights
                                                </span>
                                            </div>

                                            <div className="space-y-3 mt-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                                                        <Users size={14} className="text-secondary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-white/50 uppercase font-bold tracking-widest leading-none">Strength</p>
                                                        <p className="text-xs font-bold">{company.alumniCount} Campus Alumni</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                                                        <TrendingUp size={14} className="text-accent" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-white/50 uppercase font-bold tracking-widest leading-none">Package</p>
                                                        <p className="text-xs font-bold">₹{company.avgPackage || '12'} LPA Avg</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-9 mt-6 rounded-lg shadow-md text-xs flex items-center justify-center gap-2 border-none">
                                                <Download size={14} /> Brochure
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Right Panel: Content */}
                                    <div className="md:col-span-8 p-6 bg-white flex flex-col justify-center">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Alumni Profiles */}
                                            <div className="space-y-3">
                                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                    <Users size={12} className="text-secondary" /> Key Connections
                                                </h4>
                                                <div className="flex -space-x-2 overflow-hidden py-1">
                                                    {company.alumniList.slice(0, 5).map((alumni) => (
                                                        <div key={alumni.id} className="w-9 h-9 rounded-full ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-white shadow-md bg-gradient-to-br from-secondary to-primary transition-transform hover:-translate-y-1 cursor-help" title={alumni.name}>
                                                            {alumni.name.charAt(0)}
                                                        </div>
                                                    ))}
                                                    {company.alumniCount > 5 && (
                                                        <div className="w-9 h-9 rounded-full ring-2 ring-white bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-md">
                                                            +{company.alumniCount - 5}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-primary/70 font-semibold italic">
                                                    {company.alumniList[0]?.name} & {company.alumniCount - 1} others work here
                                                </p>
                                            </div>

                                            {/* Quick Insight */}
                                            <div className="space-y-3">
                                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                    <FileText size={12} className="text-accent" /> Placement Insight
                                                </h4>
                                                {company.hires || company.reviews.length > 0 || company.alumniCount > 0 ? (
                                                    <div>
                                                        <div className="flex flex-wrap gap-3 mb-2">
                                                            <div className="bg-secondary/5 px-2 py-1 rounded border border-secondary/10">
                                                                <p className="text-[8px] font-black text-secondary uppercase tracking-tighter">Graduates</p>
                                                                <p className="text-xs font-bold text-primary">{company.alumniCount}</p>
                                                            </div>
                                                            {company.hires && (
                                                                <div className="bg-accent/5 px-2 py-1 rounded border border-accent/10">
                                                                    <p className="text-[8px] font-black text-accent uppercase tracking-tighter">Verified Hires</p>
                                                                    <p className="text-xs font-bold text-primary">{company.hires}</p>
                                                                </div>
                                                            )}
                                                            <div className="bg-muted px-2 py-1 rounded border border-border">
                                                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">Avg LPA</p>
                                                                <p className="text-xs font-bold text-primary">₹{company.avgPackage || '12'}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-primary/80 italic leading-snug line-clamp-2 mb-2">
                                                            {company.reviews.length > 0 
                                                                ? `"${company.reviews[0].review}"` 
                                                                : `This organization has absorbed ${company.alumniCount} of our graduates, offering strong career growth in ${company.name}'s ecosystem.`}
                                                        </p>
                                                        <Link to="/student/insights" className="text-[11px] font-black text-secondary hover:underline flex items-center gap-1">
                                                            Market Analytics <ArrowRight size={12} />
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <div className="bg-muted/30 p-3 rounded-lg border border-dashed border-border text-center">
                                                        <p className="text-[10px] text-muted-foreground italic font-medium">Detailed insights coming soon via AI analysis.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {/* Bottom CTA */}
                <Card className="bg-gradient-to-r from-secondary/10 to-accent/10 border-none p-8 text-center rounded-2xl">
                    <h3 className="text-xl font-playfair font-bold text-primary mb-2">Connect with Company Insiders</h3>
                    <p className="text-xs text-muted-foreground max-w-lg mx-auto mb-5">
                        Get direct interview tips and referrals from alumni at these top organizations.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link to="/student/mentors">
                            <Button className="bg-primary text-white hover:bg-primary/90 px-6 h-10 rounded-xl font-bold text-xs shadow-lg">
                                Find Mentors
                            </Button>
                        </Link>
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 px-6 h-10 rounded-xl font-bold text-xs">
                            Placement Report
                        </Button>
                    </div>
                </Card>
            </div>
            )}
        </DashboardLayout>
    );
};

export default CompanyReviewsPage;
