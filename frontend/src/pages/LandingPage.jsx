import { Link } from "react-router-dom";
import {
  GraduationCap, Users, Briefcase, TrendingUp, Zap, Star,
  ArrowRight, CheckCircle, ShieldCheck, MessageCircle,
  Search, BookOpen, Rocket, Award, Globe, Building2,
  ChevronRight, PlayCircle, BarChart3, BadgeCheck, Sparkles
} from "lucide-react";

const LandingPage = () => {
  // High-quality professional mentoring images
  const heroImageUrl = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200";
  const testimonialImageUrl = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200";

  const stats = [
    { label: "Verified Mentors", value: "850+", icon: <ShieldCheck className="text-accent" /> },
    { label: "Active Students", value: "2,500+", icon: <Users className="text-secondary" /> },
    { label: "Job Placements", value: "400+", icon: <Briefcase className="text-warning" /> },
    { label: "Success Rate", value: "94%", icon: <TrendingUp className="text-primary" /> }
  ];

  const studentBenefits = [
    { title: "AI Mentor Matching", desc: "Get matched with alumni who share your career goals and skillsets through our neural engine.", icon: <Zap size={20} /> },
    { title: "Placement Insights", desc: "Access real data on salaries, company trends, and required skills for top tier roles.", icon: <BarChart3 size={20} /> },
    { title: "Direct Referrals", desc: "Connect with alumni at companies like Google, Amazon, and Adobe for exclusive openings.", icon: <Rocket size={20} /> }
  ];

  const alumniBenefits = [
    { title: "Talent Discovery", desc: "Identify top-performing students from your alma mater for your team's open roles.", icon: <Search size={20} /> },
    { title: "Give Back", desc: "Guide the next generation and build your legacy within the university community.", icon: <Award size={20} /> },
    { title: "Expand Network", desc: "Connect with fellow successful alumni and maintain ties with the university.", icon: <Globe size={20} /> }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span className="font-playfair font-black text-xl tracking-tight text-primary">
              AlumniConnect<span className="text-secondary">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            {["Mentors", "Job Board", "Insights", "Success Stories"].map(item => (
              <a key={item} href="#" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">{item}</a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-primary hover:opacity-70 transition-opacity">Login</Link>
            <Link to="/register" className="px-6 py-2.5 rounded-full bg-secondary text-white text-xs font-black uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20">
              Join Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 overflow-hidden bg-slate-50">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-8 lowercase tracking-wide">
              <Sparkles size={14} /> The official alumni-mentor gateway
            </div>
            <h1 className="font-playfair text-5xl md:text-7xl font-playfair font-black text-primary leading-[1.05] mb-8">
              Empowering the next <span className="text-secondary italic">Generation</span> of Leaders.
            </h1>
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-10 max-w-xl font-medium">
              An AI-driven ecosystem where students achieve their dream careers through the structured mentorship of successful verified alumni.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-white font-black flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-xl shadow-primary/30">
                Get Started Today <ArrowRight size={18} />
              </Link>
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all">
                <PlayCircle size={18} className="text-secondary" /> Platform Tour
              </button>
            </div>

            <div className="mt-12 flex items-center gap-8 border-t border-slate-200 pt-10 opacity-70">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-300 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Trusted by <span className="text-primary font-black">2,500+</span> Academic Professionals
              </p>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-[3rem] p-4 bg-white border border-slate-200 shadow-2xl">
              <img src={heroImageUrl} alt="Mentoring" className="rounded-[2.5rem] w-full h-[500px] object-cover shadow-inner" />

              {/* Static Stats Overlay */}
              <div className="absolute top-12 -left-8 bg-primary rounded-2xl p-6 shadow-2xl border border-white/10 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <TrendingUp size={20} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-black">94%</p>
                    <p className="text-[10px] uppercase font-bold text-white/40">Placement Rate</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-12 -right-8 bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <ShieldCheck size={20} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-primary">850+</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Verified Alumni</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Buffer - Stats Bar */}
      <div className="bg-primary py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 banner-grid opacity-10" />
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center md:items-start md:flex-row md:gap-5 text-white">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-xl shadow-inner mb-4 md:mb-0">
                {stat.icon}
              </div>
              <div className="text-center md:text-left">
                <p className="text-3xl md:text-4xl font-black">{stat.value}</p>
                <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Split Section */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto lg:flex gap-12">
          {/* For Students */}
          <div className="flex-1 bg-white rounded-[3rem] p-12 mb-8 lg:mb-0 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-white shadow-lg mb-10">
              <Rocket size={32} />
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-black text-primary mb-8 leading-tight">
              Propel Your <br /> <span className="text-secondary italic">Career Journey.</span>
            </h2>
            <ul className="space-y-6 mb-12">
              {studentBenefits.map((b, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0 mt-1">
                    <CheckCircle size={14} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm mb-1">{b.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/register" className="inline-flex items-center gap-3 font-black text-xs uppercase tracking-widest text-secondary hover:translate-x-2 transition-transform">
              Join as a Student <ChevronRight size={16} />
            </Link>
          </div>

          {/* For Alumni */}
          <div className="flex-1 bg-primary rounded-[3rem] p-12 text-white border border-primary/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-secondary shadow-lg mb-10">
                <Globe size={32} />
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-black mb-8 leading-tight">
                Cultivate the <br /> <span className="italic opacity-60 font-medium">Alumni Legacy.</span>
              </h2>
              <ul className="space-y-6 mb-12">
                {alumniBenefits.map((b, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-secondary flex-shrink-0 mt-1">
                      <BadgeCheck size={14} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm mb-1">{b.title}</h4>
                      <p className="text-white/50 text-xs leading-relaxed">{b.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="inline-flex items-center gap-3 font-black text-xs uppercase tracking-widest text-secondary hover:translate-x-2 transition-transform">
                Register as Alumni <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Information Grid Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-black text-primary mb-4">Core Ecosystem Features</h2>
            <p className="text-slate-500 font-medium italic">Everything you need to orchestrate career success at scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "AI Skill Gap Analysis", desc: "Our engine detects the delta between your current skills and what target alumni possess.", icon: <TrendingUp className="text-secondary" /> },
              { title: "Verified Company Reviews", desc: "Read internal culture reviews and interview leaks from seniors inside top firms.", icon: <Building2 className="text-accent" /> },
              { title: "Internal Job Referrals", desc: "Access the 'Shadow Job Market' - roles posted by alumni before they hit LinkedIn.", icon: <Briefcase className="text-warning" /> },
              { title: "Real-time Direct Chat", desc: "Message your mentors directly through our secure, real-time messaging layer.", icon: <MessageCircle className="text-primary" /> },
              { title: "Placement Analytics", desc: "See where your peers are getting hired and what packages they are securing.", icon: <BarChart3 className="text-purple-500" /> },
              { title: "Academic Certification", desc: "Every profile is cross-verified with university enrollment databases for security.", icon: <ShieldCheck className="text-slate-500" /> }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h4 className="font-bold text-primary mb-2">{feature.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Story Section */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200">
              <img src={testimonialImageUrl} alt="Success story" className="w-full h-full object-cover grayscale transition-all hover:grayscale-0 duration-700" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-72 p-10 bg-white rounded-[2.5rem] shadow-3xl border border-slate-100">
              <Star className="text-amber-400 mb-4 fill-amber-400" size={20} />
              <p className="text-slate-600 text-sm font-bold mb-4 leading-relaxed italic">
                "The alumni network helped me secure my dream role at Amazon within 3 months of graduation."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs">RK</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Class of 2023, CSE</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-playfair text-4xl md:text-5xl font-black text-primary leading-tight mb-8">
              Bridging the gap Between <br /> <span className="text-secondary">Aspiration</span> & Achievement.
            </h2>
            <p className="text-slate-600 text-lg mb-12">
              Academic excellence alone is no longer enough. We provide the institutional knowledge and professional relationships that university textbooks simply cannot provide.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-3xl font-black text-primary mb-1">92%</p>
                <p className="text-xs font-bold text-slate-400 capitalize">Response rate for mentor requests</p>
              </div>
              <div>
                <p className="text-3xl font-black text-secondary mb-1">150+</p>
                <p className="text-xs font-bold text-slate-400 capitalize">Companies represented by alumni</p>
              </div>
            </div>
            <div className="mt-12 flex gap-4">
              <Link to="/register" className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-primary underline underline-offset-8 transition-all hover:text-secondary">
                Read More Success Stories <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Full Width Banner */}
      <section className="bg-primary py-24 px-6 overflow-hidden relative">
        <div className="absolute inset-0 banner-grid opacity-10" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-playfair text-4xl md:text-6xl font-black text-white mb-8">
            Join the <span className="text-secondary italic underline underline-offset-[12px] decoration-white/20">Elite Network</span> Today.
          </h2>
          <p className="text-white/60 text-lg md:text-xl mb-12 font-medium">
            Whether you're a student seeking guidance or an alum looking to cultivate the next wave of talent, AlumniConnect AI is your definitive platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/register" className="w-full sm:w-auto px-10 py-5 rounded-full bg-secondary text-white font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-secondary/30">
              Create Free Account
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-10 py-5 rounded-full bg-white/10 text-white border border-white/20 font-black hover:bg-white/20 transition-all backdrop-blur-sm">
              Access Your Dashboard
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-20 pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: "Student", email: "student@alumni-connect.edu", pass: "student123" },
              { role: "Alumni", email: "priya@example.com", pass: "alumni123" },
              { role: "Admin", email: "admin@alumni-connect.edu", pass: "admin123" }
            ].map(u => (
              <div key={u.role} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left transition-colors hover:bg-white/10 cursor-default">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-2">{u.role} Access</p>
                <p className="text-xs text-white/50 truncate font-medium">{u.email}</p>
                <p className="text-[10px] text-white/30 truncate mt-1">Pass: {u.pass}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-20 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 sm:items-start text-center sm:text-left">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 justify-center sm:justify-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <GraduationCap size={22} />
              </div>
              <span className="font-playfair font-black text-2xl tracking-tight text-primary">AlumniConnect<span className="text-secondary">AI</span></span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
              The premier AI-powered professional nexus for universities and established alumni networks globally.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-20">
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary mb-6">Platform</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-primary">Mentor Network</a></li>
                <li><a href="#" className="hover:text-primary">Job Board</a></li>
                <li><a href="#" className="hover:text-primary">Insights Core</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary mb-6">Security</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-primary">Verification</a></li>
                <li><a href="#" className="hover:text-primary">AI Policy</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Code</a></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary mb-6">Support</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">University API</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-200 flex flex-col sm:row-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © 2024 AlumniConnect AI Infrastructure · MERN Stack
          </p>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
            <BadgeCheck size={12} className="text-accent" /> Network Status: <span className="text-accent uppercase font-bold">Optimal</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
