// ============================================================
// REGISTER PAGE — Multi-step registration with role selection
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, User, Briefcase, ChevronRight, AlertCircle, CheckCircle } from "lucide-react";

const DEPARTMENTS = [
  "Computer Science", "Information Technology", "Electronics",
  "Mechanical", "Civil", "Chemical", "Electrical", "Biotechnology",
];

const ALL_SKILLS = [
  "React", "Node.js", "Python", "Machine Learning", "JavaScript", "Java",
  "AWS", "Docker", "MongoDB", "SQL", "TypeScript", "C++", "TensorFlow",
  "Data Analysis", "Product Management", "Agile", "Spring Boot", "CAD", "MATLAB",
];

const ALL_INTERESTS = [
  "Web Development", "Machine Learning", "Data Science", "Mobile Development",
  "Cloud Computing", "DevOps", "Embedded Systems", "IoT", "Product Management",
  "Startups", "Research", "Cybersecurity",
];

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    department: "", batch: "", company: "", experience: "",
    skills: [], interests: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const toggleSkill = (skill) => {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter((s) => s !== skill)
        : [...f.skills, skill],
    }));
  };

  const toggleInterest = (interest) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }));
  };

  const handleSubmit = async () => {
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.skills.length === 0) {
      setError("Please select at least one skill");
      return;
    }
    setLoading(true);
    const result = await register({
      name: form.name, email: form.email, password: form.password, role,
      department: form.department, batch: form.batch,
      company: form.company || undefined,
      skills: form.skills, interests: form.interests,
      experience: form.experience ? parseInt(form.experience) : undefined,
    });
    setLoading(false);
    if (!result.success) { setError(result.error || "Registration failed"); return; }

    if (result.pendingVerification) {
      // Handle pending verification — redirect to login with info
      navigate("/login", { state: { message: "Registration successful! Account pending admin verification." } });
    } else {
      navigate(role === "student" ? "/student/dashboard" : "/alumni/dashboard");
    }
  };

  return (
    <div className="auth-container min-h-screen">
      <div className="relative w-full max-w-lg mx-4 py-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3" style={{ background: "hsl(var(--secondary))" }}>
            <GraduationCap size={26} className="text-white" />
          </div>
          <h1 className="title-premium text-2xl text-white">Create Account</h1>
          <p className="text-white/60 text-sm font-medium tracking-wide">Alumni Connect AI Platform</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: s <= step ? "hsl(var(--secondary))" : "hsl(var(--primary) / 0.3)",
                  color: s <= step ? "white" : "hsl(var(--secondary))",
                }}
              >
                {s < step ? <CheckCircle size={14} /> : s}
              </div>
              {s < 3 && (
                <div className="w-12 h-0.5" style={{ background: s < step ? "hsl(var(--secondary))" : "hsl(var(--primary) / 0.3)" }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="auth-card">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-4">
              <AlertCircle size={15} className="text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* STEP 1: Role Selection */}
          {step === 1 && (
            <div>
              <h3 className="font-professional text-lg font-bold mb-1">I am a...</h3>
              <p className="text-sm text-muted-foreground mb-4">Choose your role on the platform</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {(["student", "alumni"]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${role === r ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/50"
                      }`}
                  >
                    {r === "student" ? (
                      <User className="mb-2" style={{ color: role === r ? "hsl(var(--secondary))" : "hsl(var(--muted-foreground))" }} />
                    ) : (
                      <Briefcase className="mb-2" style={{ color: role === r ? "hsl(var(--secondary))" : "hsl(var(--muted-foreground))" }} />
                    )}
                    <p className="font-semibold capitalize">{r}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r === "student" ? "Get mentorship & guidance" : "Mentor students & share experience"}
                    </p>
                    {r === "alumni" && (
                      <p className="text-xs mt-2 font-medium" style={{ color: "hsl(var(--warning))" }}>
                        ⚠ Requires admin verification
                      </p>
                    )}
                  </button>
                ))}
              </div>

              {/* Basic Info */}
              <div className="space-y-3">
                <input type="text" placeholder="Full Name *" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-secondary"
                />
                <input type="email" placeholder="Email Address *" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-secondary"
                />
                <input type="password" placeholder="Password *" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-secondary"
                />
                <input type="password" placeholder="Confirm Password *" value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <button onClick={() => {
                if (!form.name || !form.email || !form.password || !form.confirmPassword) { setError("Please fill all fields"); return; }
                if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
                setError(""); setStep(2);
              }}
                className="w-full mt-4 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: "var(--gradient-blue)" }}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2: Academic/Professional Info */}
          {step === 2 && (
            <div>
              <h3 className="font-professional text-lg font-bold mb-1">
                {role === "student" ? "Academic Details" : "Professional Details"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">Tell us about your background</p>
              <div className="space-y-3">
                <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-secondary bg-white"
                >
                  <option value="">Select Department *</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="text" placeholder={role === "student" ? "Current Year (e.g. 2024)" : "Graduation Year (e.g. 2019)"}
                  value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-secondary"
                />
                {role === "alumni" && (
                  <>
                    <input type="text" placeholder="Current Company *" value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-secondary"
                    />
                    <input type="number" placeholder="Years of Experience *" value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-secondary"
                    />
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-border hover:bg-muted transition-colors"
                >
                  Back
                </button>
                <button onClick={() => {
                  if (!form.department) { setError("Please select department"); return; }
                  setError(""); setStep(3);
                }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: "var(--gradient-blue)" }}
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Skills & Interests */}
          {step === 3 && (
            <div>
              <h3 className="font-professional text-lg font-bold mb-1">Skills & Interests</h3>
              <p className="text-sm text-muted-foreground mb-4">Used by AI for mentor matching</p>

              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">Your Skills (select all that apply)</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_SKILLS.map((skill) => (
                    <button key={skill} onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${form.skills.includes(skill) ? "text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      style={form.skills.includes(skill) ? { background: "var(--gradient-blue)" } : {}}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {role === "student" && (
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Career Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {ALL_INTERESTS.map((interest) => (
                      <button key={interest} onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${form.interests.includes(interest) ? "text-white" : "bg-muted text-muted-foreground"
                          }`}
                        style={form.interests.includes(interest) ? { background: "var(--gradient-green)" } : {}}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep(2)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-border hover:bg-muted transition-colors"
                >
                  Back
                </button>
                <button onClick={handleSubmit} disabled={loading}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
                  style={{ background: "var(--gradient-green)" }}
                >
                  {loading ? "Creating..." : "Create Account 🎓"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: "hsl(var(--secondary))" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
