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
  Sparkles,
  Loader2,
  Menu,
  X,
  Globe,
  MoreVertical,
  Check
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
    tagline: "Build your skills and discover opportunities.",
    description: "Industry-aligned skill tests, verified project portfolios, and direct hiring tracks.",
    icon: GraduationCap,
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
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
    document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/;`;
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
        className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
        title="Language"
      >
        <MoreVertical className="size-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl z-50">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 sticky top-0 bg-white z-10">
            <Globe className="size-3.5" />
            Select Language
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLanguageSelect(lang.code)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex flex-col text-left">
                <span className="font-semibold text-slate-900">{lang.native}</span>
                <span className="text-[10px] text-slate-400">{lang.label}</span>
              </div>
              {currentLang === lang.code && <Check className="size-3.5 text-blue-600 stroke-[2.5]" />}
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
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);

  const [stakeholderId, setStakeholderId] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [orgInput, setOrgInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // College Search Auto-complete States
  const [collegeSearch, setCollegeSearch] = useState("");
  const [collegeResults, setCollegeResults] = useState<{ id: string; name: string; state?: string }[]>([]);
  const [isSearchingColleges, setIsSearchingColleges] = useState(false);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const collegeDropdownRef = useRef<HTMLDivElement>(null);

  const rolesSectionRef = useRef<HTMLDivElement>(null);

  const scrollToRoles = () => {
    rolesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const currentStakeholder = STAKEHOLDERS.find((s) => s.id === selectedRole);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (collegeDropdownRef.current && !collegeDropdownRef.current.contains(e.target as Node)) {
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
      setShowCollegeDropdown(false);
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
        setShowCollegeDropdown(true);
      }
      setIsSearchingColleges(false);
    }, 280);

    return () => clearTimeout(delayDebounce);
  }, [collegeSearch, selectedRole]);

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRole || !currentStakeholder) return;

    const emailValue = emailInput.trim();
    const finalOrg = (selectedRole === "student" || selectedRole === "academician" 
      ? (collegeSearch.trim() || orgInput.trim()) 
      : orgInput.trim()) || currentStakeholder.orgPlaceholder;

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
    <div className="min-h-screen relative flex flex-col font-sans text-slate-900 bg-slate-50 selection:bg-blue-600 selection:text-white">
      
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 sm:px-10 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-base shadow-md">
            SB
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tight">SkillBridge</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#" className="hover:text-blue-600 transition">Home</a>
          <a href="#about" className="hover:text-blue-600 transition">About</a>
          <button onClick={scrollToRoles} className="hover:text-blue-600 transition cursor-pointer">Sign In / Register</button>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageMenu />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 z-40 bg-white border-b border-slate-200 p-4 shadow-xl flex flex-col gap-3">
          <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-xs font-medium text-slate-700 py-2 border-b border-slate-100">Home</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-xs font-medium text-slate-700 py-2 border-b border-slate-100">About</a>
          <button onClick={() => { scrollToRoles(); setMobileMenuOpen(false); }} className="text-xs font-semibold text-left text-blue-600 py-2 cursor-pointer">Sign In / Register</button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full py-24 sm:py-32 px-6 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 shadow-2xs">
            <Sparkles className="size-3.5 text-blue-600" />
            Unified Academia & Industry Exchange
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Bridging Academia & Industry Talent Platform
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            SkillBridge connects students, corporate recruiters, deans, and certified industry mentors on a single verified platform.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={scrollToRoles}
              className="px-8.5 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/25 transition cursor-pointer"
            >
              Sign In / Register
            </Button>
            <Button
              onClick={() => setShowLearnMoreModal(true)}
              variant="outline"
              className="px-8.5 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm shadow-2xs transition cursor-pointer"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">About SkillBridge</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our platform bridges the gap between academic institutions and top-tier global enterprise recruitment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="size-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900">Verified Competency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Diagnostic technical testing and proctored evaluations provide unbiased audit trails for every student.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="size-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900">Expert Mentorship</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect 1:1 with industry staff architects, close skill deficits, and complete structured guidance plans.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="size-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 font-bold">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900">Direct Placements</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlock high-stipend corporate internships and direct interview shortlists once readiness thresholds are achieved.
            </p>
          </div>
        </div>
      </section>

      {/* Role Selection & Auth Section */}
      <section ref={rolesSectionRef} className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200 bg-white">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Select Your Professional Role</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Choose your role to sign in or register with SkillBridge.
          </p>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {STAKEHOLDERS.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedRole(item.id)}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50/60 overflow-hidden text-left shadow-sm hover:-translate-y-1.5 hover:border-blue-600 hover:bg-white hover:shadow-xl transition duration-300 cursor-pointer"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-200">
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                    <span className={cn("absolute top-3 right-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border shadow-xs bg-white", item.pillBg)}>
                      {item.badge}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center justify-between">
                        <span>{item.title}</span>
                        <ArrowRight className="size-4 text-slate-400 group-hover:translate-x-1 transition" />
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{item.tagline}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto rounded-3xl border-2 border-blue-600 bg-blue-50/30 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-fade-in">
            <div className="lg:col-span-5 relative flex flex-col justify-between overflow-hidden bg-slate-900 text-white p-6 sm:p-8 min-h-[380px]">
              <img src={currentStakeholder?.imageUrl} alt={currentStakeholder?.title} className="absolute inset-0 h-full w-full object-cover opacity-35" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40" />

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

                <h2 className="text-2xl font-black text-white">{currentStakeholder?.title} Portal</h2>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">{currentStakeholder?.description}</p>
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isForgotPassword ? "Reset Password" : authMode === "signin" ? "Authorized Login" : "New Registration"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isForgotPassword ? "Enter your email to receive a password reset link" : "Enter credentials"}
                  </p>
                </div>

                {!isForgotPassword && (
                  <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setAuthMode("signin")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer",
                        authMode === "signin" 
                          ? "bg-white shadow-xs text-slate-900" 
                          : "text-slate-600 hover:text-blue-600 hover:bg-slate-200/60"
                      )}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("signup")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer",
                        authMode === "signup" 
                          ? "bg-white shadow-xs text-slate-900" 
                          : "text-slate-600 hover:text-blue-600 hover:bg-slate-200/60"
                      )}
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>

              {isForgotPassword ? (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-900">Email Address <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="pl-9 h-10 text-xs border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full h-11 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                    {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Send Password Reset Link"}
                  </Button>

                  <div className="text-center pt-2">
                    <button type="button" onClick={() => setIsForgotPassword(false)} className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
                      Back to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-900">{currentStakeholder?.idFieldLabel} <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        required
                        value={stakeholderId}
                        onChange={(e) => setStakeholderId(e.target.value)}
                        placeholder={currentStakeholder?.idPlaceholder}
                        className="pl-9 h-10 text-xs border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  {authMode === "signup" && (
                    <div className="space-y-1 relative" ref={collegeDropdownRef}>
                      <Label className="text-xs font-semibold text-slate-900">{currentStakeholder?.orgLabel} <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                          required
                          value={selectedRole === "student" || selectedRole === "academician" ? collegeSearch : orgInput}
                          onChange={(e) => {
                            if (selectedRole === "student" || selectedRole === "academician") {
                              setCollegeSearch(e.target.value);
                            } else {
                              setOrgInput(e.target.value);
                            }
                          }}
                          placeholder={currentStakeholder?.orgPlaceholder}
                          className="pl-9 h-10 text-xs border-slate-200 rounded-xl"
                        />
                        {isSearchingColleges && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 animate-spin text-slate-400" />
                        )}
                      </div>

                      {/* College Auto-Complete Dropdown */}
                      {showCollegeDropdown && collegeResults.length > 0 && (selectedRole === "student" || selectedRole === "academician") && (
                        <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl z-50 p-1">
                          {collegeResults.map((col) => (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() => {
                                setCollegeSearch(col.name);
                                setShowCollegeDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition flex items-center justify-between cursor-pointer"
                            >
                              <span>{col.name}</span>
                              {col.state && <span className="text-[10px] text-slate-400">{col.state}</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-900">{currentStakeholder?.emailLabel} <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder={currentStakeholder?.emailPlaceholder}
                        className="pl-9 h-10 text-xs border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-slate-900">Password <span className="text-red-500">*</span></Label>
                      {authMode === "signin" && (
                        <button type="button" onClick={() => setIsForgotPassword(true)} className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer">
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-9 h-10 text-xs border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className={cn("w-full h-11 text-xs font-bold rounded-xl text-white cursor-pointer", currentStakeholder?.buttonClass)}>
                    {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : authMode === "signin" ? `Sign In` : `Create Account`}
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Learn More Modal */}
      {showLearnMoreModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  SB
                </div>
                <h3 className="text-lg font-black text-slate-900">About SkillBridge Infrastructure</h3>
              </div>
              <button 
                onClick={() => setShowLearnMoreModal(false)}
                className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <p>
                <strong className="text-slate-900">SkillBridge</strong> is a comprehensive institutional career readiness and talent verification ecosystem designed to bridge the gap between academic institutions and top-tier global enterprise recruitment.
              </p>
              
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">How SkillBridge Works:</h4>
                <ul className="space-y-2 list-disc pl-4 text-xs sm:text-sm">
                  <li><strong>For Students:</strong> Take proctored domain-specific skill diagnostics, undergo a mandatory 4-week structured mentor curriculum, practice with AI voice/camera mock interviews, and unlock verified high-stipend placement drives.</li>
                  <li><strong>For Recruiters:</strong> Access pre-vetted, audited talent pools with verified competency scores, eliminating lengthy initial screening rounds and hiring 3.2x faster.</li>
                  <li><strong>For Academicians:</strong> Monitor real-time department cohort readiness metrics, export accreditation reports (NIRF & NAAC), and align syllabi with modern industry standards.</li>
                  <li><strong>For Mentors:</strong> Guide student final-year capstones, review code repositories, and endorse top-performing portfolios with official credentials.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-900 space-y-1">
                <span className="font-bold block">Secure & Transparent Ecosystem</span>
                <span>Powered by advanced proctoring analytics, encrypted session management, and role-based access control.</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button
                onClick={() => {
                  setShowLearnMoreModal(false);
                  scrollToRoles();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Get Started Now <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-4 px-6 text-center text-xs text-[#64748B]">
        SkillBridge Unified Portal &copy; 2026. Higher Education & Industry Infrastructure Frameworks.
      </footer>
    </div>
  );
}