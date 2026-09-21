import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  Briefcase,
  School,
  Compass,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Mail,
  Lock,
  IdCard,
  Building2,
  MoreVertical,
  Globe,
  Check,
  Sparkles,
  CheckCircle2,
  BadgeCheck,
  Loader2,
  Search,
  Menu,
  X,
  ChevronDown
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
    { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
    { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
    { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
    { code: "ur", label: "Urdu", native: "اردو" },
    { code: "as", label: "Assamese", native: "অসমীয়া" },
    { code: "ne", label: "Nepali", native: "नेपाली" },
    { code: "sa", label: "Sanskrit", native: "संस्कृतम्" },
    { code: "sd", label: "Sindhi", native: "سنڌي" },
    { code: "ks", label: "Kashmiri", native: "کٲشُر" },
    { code: "mai", label: "Maithili", native: "मैथिली" },
    { code: "mni", label: "Manipuri", native: "মৈতৈলোন্" },
    { code: "brx", label: "Bodo", native: "बड़ो" },
    { code: "sat", label: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
    { code: "doi", label: "Dogri", native: "डोगरी" },
    { code: "kok", label: "Konkani", native: "कोंकणी" },
  ];

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex size-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition"
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

  const [stakeholderId, setStakeholderId] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [orgInput, setOrgInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Top-right role dropdown state
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // College Database Search State
  const [collegeSearch, setCollegeSearch] = useState("");
  const [collegeResults, setCollegeResults] = useState<{ id: string; name: string; state?: string; category?: string }[]>([]);
  const [isSearchingColleges, setIsSearchingColleges] = useState(false);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentStakeholder = STAKEHOLDERS.find((s) => s.id === selectedRole);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);

      (window as unknown as { googleTranslateElementInit: () => void }).googleTranslateElementInit = () => {
        try {
          const w = window as unknown as {
            google?: {
              translate?: {
                TranslateElement: new (options: unknown, id: string) => void;
              };
            };
          };
          if (w.google?.translate?.TranslateElement) {
            new w.google.translate.TranslateElement(
              {
                pageLanguage: "en",
                includedLanguages: "en,te,hi,ta,kn,ml,mr,bn,gu,pa,ur,or,as,ne,sd,sa,ks,mai,mni,brx,sat,doi,kok",
                autoDisplay: false,
              },
              "google_translate_element"
            );
          }
        } catch {
          // ignore
        }
      };
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCollegeDropdown(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
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
        .select("id, name, state, category")
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
          description: `A confirmation link was sent to ${emailValue}. Please verify in your inbox before signing in.`,
          duration: 9000,
        });

        setAuthMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailValue,
          password: password,
        });

        if (error) {
          if (
            error.message.toLowerCase().includes("email not confirmed") ||
            error.message.toLowerCase().includes("unconfirmed")
          ) {
            toast.error("Email Not Verified!", {
              description: "Please check your inbox and verify your email before logging in.",
              duration: 7000,
            });
          } else {
            toast.error("Authentication Failed", { description: error.message });
          }
          return;
        }

        signIn(emailValue);
        completeRegistration(selectedRole, finalOrg);

        toast.success(`Welcome back! Authenticated as ${currentStakeholder.title}`);
        navigate({ to: `/${selectedRole}` });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An authentication error occurred.";
      toast.error("Error", { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col font-sans text-[#0F172A] bg-[#F8FAFC]">
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* Subtle SaaS Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" style={{
        background: `radial-gradient(circle at 10% 10%, rgba(37, 99, 235, 0.06), transparent 30%), radial-gradient(circle at 90% 20%, rgba(6, 182, 212, 0.05), transparent 30%), #F8FAFC`
      }} />

      {/* Sticky Modern SaaS Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md px-6 sm:px-10 py-3.5 flex items-center justify-between shadow-xs transition-all">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#2563EB] text-white font-bold text-sm shadow-sm">
            SB
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight">SkillBridge</span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#64748B]">
          <a href="#" className="hover:text-[#2563EB] transition">Home</a>
          <a href="#features" className="hover:text-[#2563EB] transition">Features</a>
          <a href="#roles" className="hover:text-[#2563EB] transition">Explore Roles</a>
          <a href="#about" className="hover:text-[#2563EB] transition">About</a>
        </nav>

        {/* Top-Right Controls: Role Selector + Language + Mobile Menu */}
        <div className="flex items-center gap-3">
          
          {/* Top-Right Role Selector Dropdown as requested in Rule 3 */}
          <div className="relative" ref={roleDropdownRef}>
            <button
              type="button"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] shadow-2xs hover:border-[#2563EB] transition"
            >
              <span className="flex items-center gap-1.5">
                👤 {currentStakeholder ? currentStakeholder.title : "Select Role"}
              </span>
              <ChevronDown className="size-3.5 text-[#64748B]" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[#E2E8F0] bg-white p-1.5 shadow-2xl z-50">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                  Professional Roles
                </div>
                {STAKEHOLDERS.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition",
                        isSelected ? "bg-[#EFF6FF] text-[#2563EB] font-semibold" : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <span>{role.title}</span>
                      {isSelected && <Check className="size-3.5 text-[#2563EB] stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <LanguageMenu />
          
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex size-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-slate-700 hover:bg-slate-50 transition"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 z-40 bg-white border-b border-[#E2E8F0] p-4 shadow-xl flex flex-col gap-3">
          <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-xs font-medium text-slate-700 py-2 border-b border-slate-100">Home</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-xs font-medium text-slate-700 py-2 border-b border-slate-100">Features</a>
          <a href="#roles" onClick={() => setMobileMenuOpen(false)} className="text-xs font-medium text-slate-700 py-2 border-b border-slate-100">Explore Roles</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-xs font-medium text-slate-700 py-2">About</a>
        </div>
      )}

      {/* Main Hero & Content Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 sm:px-8 py-10 max-w-7xl mx-auto w-full">
        {!selectedRole ? (
          <div className="w-full flex flex-col items-center">
            
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#2563EB] mb-4 shadow-2xs">
                <Sparkles className="size-3.5 text-[#2563EB]" />
                Next-Gen Academic & Corporate Exchange
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0F172A] leading-tight">
                SkillBridge
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed">
                Connect students, corporate recruiters, deans, and certified industry mentors on a single verified platform.
              </p>
            </div>

            {/* Central Prominent Search Bar (Rule 4) */}
            <div className="w-full max-w-2xl mx-auto mb-14 px-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2 block">Search SkillBridge</span>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#64748B] transition group-hover:text-[#2563EB]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, skills, courses, mentors..."
                  className="w-full h-14 pl-12 pr-4 text-sm bg-white border border-[#E2E8F0] rounded-2xl shadow-sm transition-all outline-none text-[#0F172A] placeholder:text-[#64748B] hover:border-[#2563EB] hover:shadow-[0_8px_30px_rgba(37,99,235,0.10)] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
                />
              </div>
            </div>

            {/* Explore by Role Grid (Rule 5) */}
            <div id="roles" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Explore by Role</h2>
                <span className="text-xs text-[#64748B]">Select your professional workspace</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STAKEHOLDERS.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedRole(item.id)}
                      style={{ transition: "all 200ms ease" }}
                      className="group flex flex-col justify-between rounded-[20px] border border-[#E2E8F0] bg-white overflow-hidden text-left shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:-translate-y-1 hover:border-[rgba(37,99,235,0.4)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                    >
                      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

                        <div className={cn("absolute bottom-3 left-3 size-9 rounded-xl flex items-center justify-center border shadow-xs bg-white/95", item.iconColor)}>
                          <IconComponent className="size-4" />
                        </div>

                        <span className={cn("absolute top-3 right-3 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border shadow-2xs bg-white/95", item.pillBg)}>
                          {item.badge}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                        <div>
                          <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors flex items-center justify-between">
                            <span>{item.title}</span>
                            <ArrowRight className="size-4 text-[#64748B] group-hover:text-[#2563EB] group-hover:translate-x-1 transition" />
                          </h3>
                          <p className="text-xs text-[#64748B] mt-2 leading-relaxed line-clamp-2">
                            {item.tagline}
                          </p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] font-semibold text-[#2563EB]">
                          <span>Build your skills</span>
                          <span className="text-[#64748B]">{item.statNumber}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          /* Role Selected Auth Screen with selected state styling (Rule 7) */
          <div className="w-full max-w-4xl rounded-[20px] border-2 border-[#2563EB] bg-[#EFF6FF] shadow-[0_8px_24px_rgba(37,99,235,0.12)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-4">
            
            <div className="lg:col-span-5 relative flex flex-col justify-between overflow-hidden bg-[#0F172A] text-white p-6 sm:p-8 min-h-[360px]">
              <img
                src={currentStakeholder?.imageUrl}
                alt={currentStakeholder?.title}
                className="absolute inset-0 h-full w-full object-cover object-center opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-[#0F172A]/40" />

              <div className="relative z-10">
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white mb-6 transition"
                >
                  <ArrowLeft className="size-3.5" />
                  Back to Portals
                </button>

                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border backdrop-blur-md bg-white/10 text-white border-white/20">
                    {currentStakeholder?.badge}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    <Check className="size-3" /> Selected
                  </span>
                </div>

                <h2 className="text-2xl font-black tracking-tight text-white">
                  {currentStakeholder?.title} Portal
                </h2>
                <p className="mt-2 text-xs text-white/80 leading-relaxed">
                  {currentStakeholder?.description}
                </p>

                <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
                  <div className="text-2xl font-black text-white">{currentStakeholder?.statNumber}</div>
                  <div className="text-[11px] text-white/75 mt-0.5">{currentStakeholder?.statLabel}</div>
                </div>

                <div className="mt-5 space-y-2">
                  {currentStakeholder?.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/90">
                      <CheckCircle2 className="size-3.5 mt-0.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 pt-4 text-[11px] text-white/60 border-t border-white/10">
                Institutional Identity & Verification Active
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    {authMode === "signin" ? "Authorized Login" : "New Registration"}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {authMode === "signin"
                      ? "Enter your verified credentials to continue"
                      : "Register with pan-India institutional database"}
                  </p>
                </div>

                <div className="flex rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    className={cn(
                      "px-3 py-1 rounded-lg font-semibold transition",
                      authMode === "signin" ? "bg-white shadow-2xs text-[#0F172A]" : "text-[#64748B]"
                    )}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("signup")}
                    className={cn(
                      "px-3 py-1 rounded-lg font-semibold transition",
                      authMode === "signup" ? "bg-white shadow-2xs text-[#0F172A]" : "text-[#64748B]"
                    )}
                  >
                    Register
                  </button>
                </div>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <Label htmlFor="id-input" className="text-xs font-semibold text-[#0F172A]">
                    {currentStakeholder?.idFieldLabel} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#64748B]" />
                    <Input
                      id="id-input"
                      required
                      value={stakeholderId}
                      onChange={(e) => setStakeholderId(e.target.value)}
                      placeholder={currentStakeholder?.idPlaceholder}
                      className="pl-9 h-10 text-xs border-[#E2E8F0] bg-white rounded-xl focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                {authMode === "signup" && (
                  <div className="space-y-1 relative" ref={dropdownRef}>
                    <Label htmlFor="org-input" className="text-xs font-semibold text-[#0F172A]">
                      {currentStakeholder?.orgLabel} <span className="text-red-500">*</span>
                    </Label>
                    
                    {selectedRole === "student" ? (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#64748B]" />
                        <Input
                          id="org-input"
                          required
                          value={collegeSearch}
                          onChange={(e) => {
                            setCollegeSearch(e.target.value);
                            setShowCollegeDropdown(true);
                          }}
                          onFocus={() => setShowCollegeDropdown(true)}
                          placeholder="Type 2+ letters to search (e.g. IIT, JNTU, CBIT, BITS)..."
                          className="pl-9 pr-8 h-10 text-xs border-[#E2E8F0] bg-white rounded-xl focus:border-[#2563EB]"
                        />
                        {isSearchingColleges && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 animate-spin text-[#2563EB]" />
                        )}

                        {showCollegeDropdown && collegeSearch.trim().length >= 2 && (
                          <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
                            {isSearchingColleges ? (
                              <div className="p-3 text-xs text-[#64748B] text-center flex items-center justify-center gap-2">
                                <Loader2 className="size-3.5 animate-spin" /> Searching pan-India colleges...
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
                                  className="w-full text-left px-3 py-2 text-xs text-[#0F172A] hover:bg-blue-50 hover:text-blue-700 border-b border-[#E2E8F0] last:border-0 transition"
                                >
                                  <div className="font-semibold">{c.name}</div>
                                  <div className="text-[10px] text-[#64748B] flex items-center gap-2 mt-0.5">
                                    {c.state && <span>{c.state}</span>}
                                    {c.category && <span className="bg-slate-100 px-1 rounded text-[#64748B]">{c.category}</span>}
                                  </div>
                                </button>
                              ))
                            ) : (
                              <div className="p-3 text-xs text-[#64748B]">
                                <span className="font-semibold text-[#0F172A]">College not found in pre-index.</span>
                                <div className="text-[11px] text-[#64748B] mt-0.5">
                                  You can continue typing your college name manually.
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#64748B]" />
                        <Input
                          id="org-input"
                          required
                          value={orgInput}
                          onChange={(e) => setOrgInput(e.target.value)}
                          placeholder={currentStakeholder?.orgPlaceholder}
                          className="pl-9 h-10 text-xs border-[#E2E8F0] bg-white rounded-xl focus:border-[#2563EB]"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="email-input" className="text-xs font-semibold text-[#0F172A]">
                    {currentStakeholder?.emailLabel} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#64748B]" />
                    <Input
                      id="email-input"
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder={currentStakeholder?.emailPlaceholder}
                      className="pl-9 h-10 text-xs border-[#E2E8F0] bg-white rounded-xl focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="pwd-input" className="text-xs font-semibold text-[#0F172A]">
                    Password (Min. 8 characters) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#64748B]" />
                    <Input
                      id="pwd-input"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9 h-10 text-xs border-[#E2E8F0] bg-white rounded-xl focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ transition: "all 200ms ease" }}
                  className={cn("w-full h-11 text-xs font-bold transition mt-2 rounded-[12px] px-5 py-3 shadow-[0_6px_16px_rgba(37,99,235,0.20)] hover:-translate-y-[1px]", currentStakeholder?.buttonClass)}
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

                <p className="text-center text-[10px] text-[#64748B] pt-1">
                  Pan-India Institutional Directory Active • Secured by Supabase Engine
                </p>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* SaaS Footer */}
      <footer className="relative z-10 border-t border-[#E2E8F0] bg-white py-4 px-6 text-center text-xs text-[#64748B]">
        SkillBridge Unified Portal &copy; 2026. Higher Education & Industry Infrastructure Frameworks.
      </footer>
    </div>
  );
}