import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  Briefcase,
  School,
  Compass,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  IdCard,
  Building2,
  MoreVertical,
  Globe,
  Check,
  Sparkles,
  Loader2,
  Menu,
  X,
  User,
  Info,
  ShieldCheck,
  BookOpen,
  Award,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAppState, type RoleId } from "@/lib/app-state";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillBridge — Unified Academia & Industry Exchange" },
      {
        name: "description",
        content: "Institutional career readiness and talent verification portal.",
      },
    ],
  }),
  component: Welcome,
});

interface StakeholderTheme {
  id: RoleId;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  icon: typeof GraduationCap;
  imageUrl: string;
  pillBg: string;
  iconBg: string;
  iconColor: string;
  buttonClass: string;
  statNumber: string;
  statLabel: string;
  features: string[];
  idFieldLabel: string;
  idPlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  orgLabel: string;
  orgPlaceholder: string;
}

const STAKEHOLDERS: StakeholderTheme[] = [
  {
    id: "student",
    badge: "Student Portal",
    title: "Student",
    tagline: "Build your skills and discover career opportunities.",
    description: "Industry-aligned skill tests, verified project portfolios, and direct hiring tracks.",
    icon: GraduationCap,
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    pillBg: "bg-blue-50 border-blue-200 text-blue-700",
    iconBg: "bg-blue-100/80 border-blue-200",
    iconColor: "text-blue-600",
    buttonClass: "bg-[#2563EB] hover:bg-[#1D4ED8] text-white",
    statNumber: "88.4%",
    statLabel: "Skill-to-Role Fitment Score",
    features: [
      "Industry benchmarked skill diagnostic tests",
      "Mentor-evaluated capstone portfolios",
      "Direct verified interview shortlists",
    ],
    idFieldLabel: "University Roll Number / Hall Ticket ID",
    idPlaceholder: "e.g. 21BCE1042",
    emailLabel: "Student Email",
    emailPlaceholder: "student@gmail.com",
    orgLabel: "College / University Name",
    orgPlaceholder: "Type your college name to search...",
  },
  {
    id: "recruiter",
    badge: "Recruitment Suite",
    title: "Recruiter",
    tagline: "Hire pre-screened talent with audited skill scores.",
    description: "Discover candidates with verified competencies and campus academic audit trails.",
    icon: Briefcase,
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    pillBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconBg: "bg-emerald-100/80 border-emerald-200",
    iconColor: "text-emerald-700",
    buttonClass: "bg-[#2563EB] hover:bg-[#1D4ED8] text-white",
    statNumber: "3.2x",
    statLabel: "Faster Candidate Filtering",
    features: [
      "Access pre-verified skill matrices",
      "Granular filters by university and branch",
      "Proctored assessment audit verification",
    ],
    idFieldLabel: "Corporate Employee ID / Work ID",
    idPlaceholder: "e.g. CORP-REC-4821",
    emailLabel: "Work Email Address",
    emailPlaceholder: "talent@microsoft.com",
    orgLabel: "Company Name",
    orgPlaceholder: "Northwind Labs",
  },
  {
    id: "academician",
    badge: "Faculty Portal",
    title: "Academician",
    tagline: "Track batch competencies and align syllabus to market trends.",
    description: "Monitor real-time cohort readiness metrics and export verified documentation.",
    icon: School,
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    pillBg: "bg-amber-50 border-amber-200 text-amber-800",
    iconBg: "bg-amber-100/80 border-amber-200",
    iconColor: "text-amber-700",
    buttonClass: "bg-[#2563EB] hover:bg-[#1D4ED8] text-white",
    statNumber: "94%",
    statLabel: "Curriculum Alignment Index",
    features: [
      "Department skill gap visual heatmaps",
      "Accreditation export tables (NIRF & NAAC)",
      "Industry recommendation alerts for syllabus",
    ],
    idFieldLabel: "Faculty Institutional ID",
    idPlaceholder: "e.g. FAC-CSE-2018",
    emailLabel: "Institutional Faculty Email",
    emailPlaceholder: "faculty@college.ac.in",
    orgLabel: "College / University Name",
    orgPlaceholder: "NIT Trichy",
  },
  {
    id: "mentor",
    badge: "Mentor Desk",
    title: "Mentor",
    tagline: "Review capstone projects and mentor future engineers.",
    description: "Guide student final-year capstones and endorse high-potential portfolios.",
    icon: Compass,
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    pillBg: "bg-cyan-50 border-cyan-200 text-cyan-800",
    iconBg: "bg-cyan-100/80 border-cyan-200",
    iconColor: "text-cyan-700",
    buttonClass: "bg-[#2563EB] hover:bg-[#1D4ED8] text-white",
    statNumber: "4.9/5",
    statLabel: "Average Mentor Engagement",
    features: [
      "Direct code repository and system reviews",
      "Standard rubrics for skill validation badges",
      "Letters of recommendation for talent",
    ],
    idFieldLabel: "Mentor Registration ID",
    idPlaceholder: "e.g. MNT-ENG-7704",
    emailLabel: "Professional Email Address",
    emailPlaceholder: "mentor@domain.com",
    orgLabel: "Domain Expertise",
    orgPlaceholder: "Cloud & Platform Engineering",
  },
];

function LanguageMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2,3})/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCode: string) => {
    if (typeof window === "undefined") return;
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    document.cookie = `googtrans=/en/${langCode}; domain=.${window.location.hostname}; path=/;`;
    setCurrentLang(langCode);
    setIsOpen(false);
    window.location.reload();
  };

  const languages = [
    { code: "en", label: "English", native: "English" },
    { code: "te", label: "Telugu", native: "తెలుగు" },
    { code: "hi", label: "Hindi", native: "हिंदी" },
    { code: "ta", label: "Tamil", native: "தமிழ்" },
    { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
    { code: "ml", label: "Malayalam", native: "മലയാളം" },
    { code: "mr", label: "Marathi", native: "मराठी" },
    { code: "bn", label: "Bengali", native: "বাংলা" },
  ];

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex size-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition shadow-2xs"
        title="Language"
      >
        <MoreVertical className="size-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white p-1.5 shadow-2xl z-50">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 sticky top-0 bg-white z-10">
            <Globe className="size-3.5" />
            Select Language
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLanguageSelect(lang.code)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <div className="flex flex-col text-left">
                <span className="font-semibold text-slate-900">{lang.native}</span>
                <span className="text-[10px] text-slate-400">{lang.label}</span>
              </div>
              {currentLang === lang.code && <Check className="size-3.5 text-[#2563EB] stroke-[2.5]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Welcome() {
  const navigate = useNavigate();
  const { signIn, completeRegistration } = useAppState();

  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [activeModal, setActiveModal] = useState<"none" | "about" | "profile">("none");

  const [stakeholderId, setStakeholderId] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [orgInput, setOrgInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [collegeSearch, setCollegeSearch] = useState("");
  const [collegeResults, setCollegeResults] = useState<{ id: string; name: string; state?: string }[]>([]);
  const [isSearchingColleges, setIsSearchingColleges] = useState(false);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentStakeholder = STAKEHOLDERS.find((s) => s.id === selectedRole);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCollegeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedRole !== "student" && selectedRole !== "academician") return;
    const term = collegeSearch.trim();
    if (term.length < 2) {
      setCollegeResults([]);
      setIsSearchingColleges(false);
      return;
    }

    setIsSearchingColleges(true);
    const delayDebounce = setTimeout(async () => {
      const { data, error } = await supabase
        .from("colleges")
        .select("id, name, state")
        .ilike("name", `%${term}%`)
        .limit(10);

      if (!error && data) {
        setCollegeResults(data);
      }
      setIsSearchingColleges(false);
    }, 280);

    return () => clearTimeout(delayDebounce);
  }, [collegeSearch, selectedRole]);

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRole || !currentStakeholder) return;

    const emailValue = emailInput.trim();
    const finalOrg = (selectedRole === "student" ? (collegeSearch.trim() || orgInput.trim()) : orgInput.trim()) || currentStakeholder.orgPlaceholder;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      toast.error("Invalid Email", { description: "Please enter a valid email address." });
      return;
    }

    if (password.length < 8) {
      toast.error("Weak Password", { description: "Password must be at least 8 characters long." });
      return;
    }

    setIsSubmitting(true);

    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: emailValue,
          password: password,
          options: {
            data: {
              role: selectedRole,
              stakeholder_id: stakeholderId,
              organization: finalOrg,
            },
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) {
          toast.error("Registration Failed", { description: error.message });
          return;
        }

        toast.success("Verification Email Sent! ✉️", {
          description: `A confirmation link was sent to ${emailValue}. Please verify in your inbox.`,
          duration: 9000,
        });

        setAuthMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailValue,
          password: password,
        });

        if (error) {
          toast.error("Authentication Failed", { description: error.message });
          return;
        }

        signIn(emailValue);
        completeRegistration(selectedRole, finalOrg);

        toast.success(`Welcome back! Authenticated as ${currentStakeholder.title}`);
        navigate({ to: `/${selectedRole}` });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred.";
      toast.error("Error", { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleForgotPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emailValue = emailInput.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailValue)) {
      toast.error("Invalid Email", { description: "Please enter a valid email address." });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailValue, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        toast.error("Error", { description: error.message });
      } else {
        toast.success("Password Reset Link Sent! ✉️", {
          description: `Check ${emailValue} for the password reset link.`,
          duration: 8000,
        });
        setIsForgotPassword(false);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred.";
      toast.error("Error", { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col font-sans text-[#0F172A] bg-[#090D16] overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Background Hero Image with Professional Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 transform scale-105 animate-fade-in"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090D16]/90 via-[#090D16]/85 to-[#090D16]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090D16]/80 backdrop-blur-xl px-6 sm:px-10 py-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-base shadow-lg shadow-blue-500/30">
            SB
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">SkillBridge</span>
            <span className="text-[10px] text-blue-400 font-medium tracking-wider uppercase">Academia & Industry Exchange</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <button 
            type="button" 
            onClick={() => { setSelectedRole(null); setActiveModal("none"); }}
            className="hover:text-blue-400 transition cursor-pointer"
          >
            Home
          </button>
          <button 
            type="button" 
            onClick={() => setActiveModal("about")}
            className="hover:text-blue-400 transition cursor-pointer flex items-center gap-1.5"
          >
            <Info className="size-3.5" /> About SkillBridge
          </button>
          <button 
            type="button" 
            onClick={() => setActiveModal("profile")}
            className="hover:text-blue-400 transition cursor-pointer flex items-center gap-1.5"
          >
            <User className="size-3.5" /> Profile Overview
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageMenu />
          
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-4 right-4 z-50 bg-[#0F172A] border border-white/15 p-5 rounded-2xl shadow-2xl flex flex-col gap-3 backdrop-blur-2xl">
          <button 
            type="button" 
            onClick={() => { setSelectedRole(null); setActiveModal("none"); setMobileMenuOpen(false); }}
            className="text-xs font-semibold text-left text-slate-200 py-2.5 border-b border-white/10 hover:text-blue-400"
          >
            Home
          </button>
          <button 
            type="button" 
            onClick={() => { setActiveModal("about"); setMobileMenuOpen(false); }}
            className="text-xs font-semibold text-left text-slate-200 py-2.5 border-b border-white/10 hover:text-blue-400 flex items-center gap-2"
          >
            <Info className="size-4 text-blue-400" /> About SkillBridge
          </button>
          <button 
            type="button" 
            onClick={() => { setActiveModal("profile"); setMobileMenuOpen(false); }}
            className="text-xs font-semibold text-left text-slate-200 py-2.5 hover:text-blue-400 flex items-center gap-2 text-slate-200"
          >
            <User className="size-4 text-blue-400" /> Profile Overview
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 sm:px-8 py-12 max-w-7xl mx-auto w-full">
        
        {/* About Modal View */}
        {activeModal === "about" && (
          <div className="w-full max-w-4xl bg-[#0F172A]/95 border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-2xl mb-12 animate-fade-in text-slate-200">
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Info className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">About SkillBridge</h2>
                  <p className="text-xs text-slate-400">Unified Academia & Industry Talent Exchange Platform</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveModal("none")}
                className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">SkillBridge</strong> is a next-generation career readiness and talent verification portal designed to bridge the gap between academic institutions and top-tier industry recruiters.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-bold">
                    <Target className="size-4" /> Platform Purpose
                  </div>
                  <p className="text-xs text-slate-400">
                    To establish a trusted ecosystem where student competencies are objectively benchmarked, verified by academic faculty, and directly exposed to corporate hiring partners.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <ShieldCheck className="size-4" /> Trusted Collaboration
                  </div>
                  <p className="text-xs text-slate-400">
                    Seamlessly connects students, expert mentors, corporate talent acquisition teams, and university deans on a single secure infrastructure.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <Sparkles className="size-4 text-blue-400" /> How Users Grow & Succeed
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Users can take industry-aligned diagnostic tests, develop verified project portfolios, interact with certified mentors for career guidance, and unlock direct interview shortlists with top companies.
                </p>
              </div>

              <div className="text-center pt-4">
                <Button 
                  onClick={() => setActiveModal("none")}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition cursor-pointer"
                >
                  Get Started With Role Selection
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Overview Modal View */}
        {activeModal === "profile" && (
          <div className="w-full max-w-4xl bg-[#0F172A]/95 border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-2xl mb-12 animate-fade-in text-slate-200">
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <User className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Profile Management & Audit</h2>
                  <p className="text-xs text-slate-400">Comprehensive professional identity & credential dashboard</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveModal("none")}
                className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                A complete and verified <strong className="text-white">SkillBridge Profile</strong> serves as your professional passport across academia and industry.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <BookOpen className="size-4 text-blue-400 mb-1" />
                  <h4 className="font-bold text-white text-xs">Academic Records</h4>
                  <p className="text-[11px] text-slate-400">Manage university roll numbers, branch, semester metrics, and institutional affiliation.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <Award className="size-4 text-emerald-400 mb-1" />
                  <h4 className="font-bold text-white text-xs">Skills & Badges</h4>
                  <p className="text-[11px] text-slate-400">Display verified skill diagnostic scores, proctored test badges, and certifications.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <Target className="size-4 text-cyan-400 mb-1" />
                  <h4 className="font-bold text-white text-xs">Projects & Experience</h4>
                  <p className="text-[11px] text-slate-400">Showcase mentor-evaluated capstone projects, work experience, and research papers.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
                <span className="font-semibold text-white">Why complete your profile?</span> Profiles with rigorous project verification and audited skill scores receive up to <strong className="text-blue-400">3.2x higher interview shortlists</strong> from recruiters.
              </div>

              <div className="text-center pt-4">
                <Button 
                  onClick={() => setActiveModal("none")}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                >
                  Return to Portal Selection
                </Button>
              </div>
            </div>
          </div>
        )}

        {!selectedRole ? (
          <div className="w-full flex flex-col items-center animate-fade-in">
            
            {/* Hero Heading Section */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-400 mb-5 shadow-inner">
                <Sparkles className="size-3.5 text-blue-400" />
                Next-Gen Academic & Corporate Exchange Platform
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
                Select Your Professional Role
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
                Choose your dedicated workspace below to access verified institutional credentials, mentor networks, and talent pipelines.
              </p>
            </div>

            {/* Exactly Four Prominent Role Selection Cards (No Search Bar, No Duplicate Corner Options) */}
            <div id="roles" className="w-full max-w-6xl mx-auto mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {STAKEHOLDERS.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedRole(item.id)}
                      className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl p-6 text-left shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/50 hover:bg-[#1E293B]/90 hover:shadow-[0_20px_40px_rgba(37,99,235,0.2)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#090D16]"
                    >
                      {/* Card Image Thumbnail Header */}
                      <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-slate-800 mb-5">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
                        
                        <div className={cn("absolute bottom-3 left-3 size-10 rounded-xl flex items-center justify-center border shadow-md bg-white/95 backdrop-blur-md", item.iconColor)}>
                          <IconComponent className="size-5" />
                        </div>

                        <span className={cn("absolute top-3 right-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border shadow-sm bg-white/95 backdrop-blur-md", item.pillBg)}>
                          {item.badge}
                        </span>
                      </div>

                      {/* Card Text Content */}
                      <div className="space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                              {item.title}
                            </h3>
                            <div className="size-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
                              <ArrowRight className="size-3.5" />
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                            {item.tagline}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-blue-400">
                          <span>Access Workspace</span>
                          <span className="text-slate-400">{item.statNumber}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          <div className="w-full max-w-4xl rounded-3xl border border-blue-500/30 bg-[#0F172A]/90 backdrop-blur-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-4 animate-fade-in">
            
            {/* Left Role Banner Panel */}
            <div className="lg:col-span-5 relative flex flex-col justify-between overflow-hidden bg-slate-950 text-white p-6 sm:p-8 min-h-[380px]">
              <img
                src={currentStakeholder?.imageUrl}
                alt={currentStakeholder?.title}
                className="absolute inset-0 h-full w-full object-cover object-center opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />

              <div className="relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(null);
                    setIsForgotPassword(false);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white mb-6 transition cursor-pointer"
                >
                  <ArrowLeft className="size-3.5" />
                  Back to Role Selection
                </button>

                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border backdrop-blur-md bg-white/10 text-white border-white/20">
                    {currentStakeholder?.badge}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    <Check className="size-3" /> Active
                  </span>
                </div>

                <h2 className="text-2xl font-black tracking-tight text-white">
                  {currentStakeholder?.title} Portal
                </h2>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {currentStakeholder?.description}
                </p>

                <div className="mt-6 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-sm">
                  <div className="text-2xl font-black text-white">{currentStakeholder?.statNumber}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{currentStakeholder?.statLabel}</div>
                </div>
              </div>

              <div className="relative z-10 pt-4 text-[11px] text-slate-500 border-t border-white/10">
                Institutional Identity & Verification Active
              </div>
            </div>

            {/* Right Auth / Form Panel */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-[#0F172A]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isForgotPassword ? "Reset Password" : authMode === "signin" ? "Authorized Login" : "New Registration"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isForgotPassword 
                      ? "Enter your email to receive a password reset link"
                      : authMode === "signin"
                      ? "Enter your verified credentials to continue"
                      : "Register with pan-India institutional database"}
                  </p>
                </div>

                {!isForgotPassword && (
                  <div className="flex rounded-xl bg-white/5 border border-white/10 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setAuthMode("signin")}
                      className={cn(
                        "px-3 py-1 rounded-lg font-semibold transition cursor-pointer",
                        authMode === "signin" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                      )}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("signup")}
                      className={cn(
                        "px-3 py-1 rounded-lg font-semibold transition cursor-pointer",
                        authMode === "signup" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                      )}
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>

              {isForgotPassword ? (
                /* Forgot Password Form */
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="forgot-email" className="text-xs font-semibold text-slate-200">
                      {currentStakeholder?.emailLabel} <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="forgot-email"
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder={currentStakeholder?.emailPlaceholder}
                        className="pl-9 h-10 text-xs border-white/15 bg-white/5 text-white rounded-xl focus:border-blue-500 placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 text-xs font-bold transition mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Sending Reset Link...
                      </span>
                    ) : (
                      "Send Password Reset Link"
                    )}
                  </Button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-xs font-semibold text-blue-400 hover:underline cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                /* Regular Sign In / Sign Up Form */
                <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <Label htmlFor="id-input" className="text-xs font-semibold text-slate-200">
                      {currentStakeholder?.idFieldLabel} <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="id-input"
                        required
                        value={stakeholderId}
                        onChange={(e) => setStakeholderId(e.target.value)}
                        placeholder={currentStakeholder?.idPlaceholder}
                        className="pl-9 h-10 text-xs border-white/15 bg-white/5 text-white rounded-xl focus:border-blue-500 placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  {authMode === "signup" && (
                    <div className="space-y-1 relative" ref={dropdownRef}>
                      <Label htmlFor="org-input" className="text-xs font-semibold text-slate-200">
                        {currentStakeholder?.orgLabel} <span className="text-red-400">*</span>
                      </Label>
                      
                      {selectedRole === "student" ? (
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                          <Input
                            id="org-input"
                            required
                            value={collegeSearch}
                            onChange={(e) => {
                              setCollegeSearch(e.target.value);
                              setShowCollegeDropdown(true);
                            }}
                            onFocus={() => setShowCollegeDropdown(true)}
                            placeholder="Type 2+ letters to search college..."
                            className="pl-9 pr-8 h-10 text-xs border-white/15 bg-white/5 text-white rounded-xl focus:border-blue-500 placeholder:text-slate-500"
                          />
                          {isSearchingColleges && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 animate-spin text-blue-400" />
                          )}

                          {showCollegeDropdown && collegeSearch.trim().length >= 2 && (
                            <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-2xl border border-white/15 bg-[#0F172A] shadow-2xl">
                              {isSearchingColleges ? (
                                <div className="p-3 text-xs text-slate-400 text-center flex items-center justify-center gap-2">
                                  <Loader2 className="size-3.5 animate-spin" /> Searching colleges...
                                </div>
                              ) : collegeResults.length > 0 ? (
                                collegeResults.map((c) => (
                                  <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => {
                                      setCollegeSearch(c.name);
                                      setOrgInput(c.name);
                                      setShowCollegeDropdown(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-blue-600/20 hover:text-white border-b border-white/10 last:border-0 transition cursor-pointer"
                                  >
                                    <div className="font-semibold">{c.name}</div>
                                    <div className="text-[10px] text-slate-400">{c.state}</div>
                                  </button>
                                ))
                              ) : (
                                <div className="p-3 text-xs text-slate-400">
                                  <span>College not found in pre-index.</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                          <Input
                            id="org-input"
                            required
                            value={orgInput}
                            onChange={(e) => setOrgInput(e.target.value)}
                            placeholder={currentStakeholder?.orgPlaceholder}
                            className="pl-9 h-10 text-xs border-white/15 bg-white/5 text-white rounded-xl focus:border-blue-500 placeholder:text-slate-500"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label htmlFor="email-input" className="text-xs font-semibold text-slate-200">
                      {currentStakeholder?.emailLabel} <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="email-input"
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder={currentStakeholder?.emailPlaceholder}
                        className="pl-9 h-10 text-xs border-white/15 bg-white/5 text-white rounded-xl focus:border-blue-500 placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pwd-input" className="text-xs font-semibold text-slate-200">
                        Password (Min. 8 characters) <span className="text-red-400">*</span>
                      </Label>
                      {authMode === "signin" && (
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(true)}
                          className="text-[11px] font-medium text-blue-400 hover:underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="pwd-input"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-9 h-10 text-xs border-white/15 bg-white/5 text-white rounded-xl focus:border-blue-500 placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn("w-full h-11 text-xs font-bold transition mt-2 rounded-xl text-white shadow-lg cursor-pointer", currentStakeholder?.buttonClass)}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Processing Request...
                      </span>
                    ) : authMode === "signin" ? (
                      `Sign In as ${currentStakeholder?.title}`
                    ) : (
                      `Create Account & Send Verification Email`
                    )}
                    {!isSubmitting && <ArrowRight className="size-4 ml-1.5" />}
                  </Button>

                  <p className="text-center text-[10px] text-slate-500 pt-1">
                    Pan-India Institutional Directory Active • Secured by Supabase Engine
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#090D16] py-5 px-6 text-center text-xs text-slate-500">
        SkillBridge Unified Portal &copy; 2026. Higher Education & Industry Infrastructure Frameworks.
      </footer>
    </div>
  );
}