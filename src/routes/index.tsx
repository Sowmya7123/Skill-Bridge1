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
  Sparkles,
  Mail,
  Lock,
  IdCard,
  Building2,
  MoreVertical,
  Globe,
  Check,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAppState, type RoleId } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillBridge — Unified Academia & Industry Talent Exchange" },
      {
        name: "description",
        content:
          "Institutional career readiness and talent verification portal connecting students, universities, and industry recruiters.",
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
  accentBg: string;
  accentBorder: string;
  accentText: string;
  heroStatNumber: string;
  heroStatLabel: string;
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
    badge: "Student Career Portal",
    title: "Student",
    tagline: "Benchmark your skills & land verified campus placements.",
    description: "AI-driven skill gap discovery, real-world project portfolios, and direct hiring matches.",
    icon: GraduationCap,
    accentBg: "bg-indigo-600",
    accentBorder: "border-indigo-500",
    accentText: "text-indigo-600 dark:text-indigo-400",
    heroStatNumber: "88.4%",
    heroStatLabel: "Placement Match Index",
    features: [
      "Dynamic skill gap mapping against 500+ job descriptions",
      "Mentor-validated capstone portfolio",
      "Direct interview shortlists with verified skill badges",
    ],
    idFieldLabel: "University Roll No / Hall Ticket ID",
    idPlaceholder: "e.g. 21BCE1042 / 2024-CSE-091",
    emailLabel: "Student College Email",
    emailPlaceholder: "student@university.edu.in",
    orgLabel: "College / University Name",
    orgPlaceholder: "e.g. VIT Vellore / JNTU Hyderabad",
  },
  {
    id: "recruiter",
    badge: "Corporate Talent Pipeline",
    title: "Recruiter",
    tagline: "Hire verified talent matched precisely to your tech stack.",
    description: "Zero-noise recruitment pipeline with proctored skill reports and candidate readiness metrics.",
    icon: Briefcase,
    accentBg: "bg-emerald-600",
    accentBorder: "border-emerald-500",
    accentText: "text-emerald-600 dark:text-emerald-400",
    heroStatNumber: "3.2x",
    heroStatLabel: "Faster Talent Screening",
    features: [
      "Access candidates with pre-verified skill benchmark scores",
      "Instant college batch filters (branch, GPA, test scores)",
      "Integrated technical assessment audit trails",
    ],
    idFieldLabel: "Corporate / Employee Work ID",
    idPlaceholder: "e.g. CORP-REC-8842",
    emailLabel: "Official Work Email",
    emailPlaceholder: "talent@microsoft.com",
    orgLabel: "Company / Enterprise Name",
    orgPlaceholder: "e.g. Google, Amazon, Infosys",
  },
  {
    id: "academician",
    badge: "Institutional Governance",
    title: "Academician / Dean",
    tagline: "Track batch competencies and align curriculum with market demand.",
    description: "Department-level skill heatmaps, industry alignment dashboards, and NAAC/NIRF accreditation analytics.",
    icon: School,
    accentBg: "bg-amber-600",
    accentBorder: "border-amber-500",
    accentText: "text-amber-600 dark:text-amber-400",
    heroStatNumber: "94%",
    heroStatLabel: "Curriculum Industry Alignment",
    features: [
      "Batch-wide skill gap reports by semester and section",
      "Accreditation data export for NIRF, NAAC & NBA reviews",
      "Industry syllabus update recommendations",
    ],
    idFieldLabel: "Faculty Institutional Employee ID",
    idPlaceholder: "e.g. FAC-CSE-2018",
    emailLabel: "University Institutional Email",
    emailPlaceholder: "hod.cse@college.ac.in",
    orgLabel: "College / Institute Name",
    orgPlaceholder: "e.g. IIT Madras, NIT Warangal",
  },
  {
    id: "mentor",
    badge: "Industry Advisory & Evaluation",
    title: "Industry Mentor",
    tagline: "Evaluate project rigor and mentor the next generation of engineers.",
    description: "Provide structured feedback on student capstone deliverables and host verified 1:1 project reviews.",
    icon: Compass,
    accentBg: "bg-cyan-700",
    accentBorder: "border-cyan-600",
    accentText: "text-cyan-700 dark:text-cyan-400",
    heroStatNumber: "4.9/5",
    heroStatLabel: "Average Mentor Engagement",
    features: [
      "One-click code repository and architecture review",
      "Standardized rubrics for industry readiness grading",
      "Direct recommendation letters for outstanding candidates",
    ],
    idFieldLabel: "Mentor / Practitioner Registration Code",
    idPlaceholder: "e.g. EXP-AI-4412",
    emailLabel: "Professional Email / Contact",
    emailPlaceholder: "expert.advisor@domain.com",
    orgLabel: "Primary Industry Domain",
    orgPlaceholder: "e.g. Distributed Systems & AI Systems",
  },
];

// Three Dots Language Dropdown
function LanguageMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
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
  ];

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex size-9 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-sm transition hover:bg-slate-100"
        title="Change Language"
      >
        <MoreVertical className="size-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1.5 shadow-xl z-50">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
            <Globe className="size-3.5" />
            Language
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLanguageSelect(lang.code)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex flex-col text-left">
                <span>{lang.native}</span>
                <span className="text-[10px] text-slate-400">{lang.label}</span>
              </div>
              {currentLang === lang.code && <Check className="size-3.5 text-blue-600" />}
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

  const currentStakeholder = STAKEHOLDERS.find((s) => s.id === selectedRole);

  useEffect(() => {
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: "en,te,hi", autoDisplay: false },
          "google_translate_element"
        );
      };
    }
  }, []);

  function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRole || !currentStakeholder) return;

    const emailValue = emailInput.trim() || `${selectedRole}.portal@skillbridge.io`;
    signIn(emailValue);
    completeRegistration(selectedRole, orgInput.trim() || currentStakeholder.orgPlaceholder);

    toast.success(`Authenticated as ${currentStakeholder.title}`);
    navigate({ to: `/${selectedRole}` });
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* ENTERPRISE TOP NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-sm">
            SB
          </div>
          <div>
            <span className="text-base font-bold tracking-tight">SkillBridge</span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-medium text-slate-500 border-l border-slate-300 dark:border-slate-700 pl-2">
              National Talent & Academia Exchange
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="size-3.5" />
            ISO 27001 & AICTE Framework Aligned
          </span>
          <LanguageMenu />
        </div>
      </header>

      {/* MAIN VIEW */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        {!selectedRole ? (
          /* STEP 1: STAKEHOLDER SELECTION SCREEN */
          <div className="w-full max-w-6xl py-6 sm:py-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 rounded-full mb-3">
                Stakeholder Portals
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Select Your Access Gateway
              </h1>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Choose your stakeholder role to enter the secure environment customized for your institution or organization.
              </p>
            </div>

            {/* 4 CARDS WITH TAILORED ENTERPRISE AESTHETICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {STAKEHOLDERS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedRole(item.id)}
                    className="group relative flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={cn("size-12 rounded-xl flex items-center justify-center text-white shadow-sm", item.accentBg)}>
                          <IconComponent className="size-6" />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Portal
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {item.tagline}
                      </p>

                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] font-medium text-slate-400 block mb-1">Key Capability:</span>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{item.features[0]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-3 text-xs font-semibold text-slate-900 dark:text-slate-100">
                      <span>Enter as {item.title}</span>
                      <ArrowRight className="size-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center text-xs text-slate-500">
              Authorized institutional authentication portal. Compliant with university skill taxonomy guidelines.
            </div>
          </div>
        ) : (
          /* STEP 2: SPLIT-SCREEN SPECIALIZED LOGIN FOR SELECTED STAKEHOLDER */
          <div className="w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            
            {/* LEFT HERO PANEL (Tailored to role colors and metrics) */}
            <div className={cn("lg:col-span-5 p-8 text-white flex flex-col justify-between relative overflow-hidden", currentStakeholder?.accentBg)}>
              <div className="relative z-10">
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white mb-8 transition"
                >
                  <ArrowLeft className="size-3.5" />
                  All Portals
                </button>

                <div className="inline-block px-2.5 py-1 rounded bg-white/20 text-[10px] font-bold uppercase tracking-wider mb-3 backdrop-blur-sm">
                  {currentStakeholder?.badge}
                </div>

                <h2 className="text-2xl font-black tracking-tight">{currentStakeholder?.title} Gateway</h2>
                <p className="mt-2 text-xs text-white/80 leading-relaxed">
                  {currentStakeholder?.description}
                </p>

                {/* Stat Box */}
                <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                  <div className="text-3xl font-black">{currentStakeholder?.heroStatNumber}</div>
                  <div className="text-[11px] text-white/80 mt-0.5">{currentStakeholder?.heroStatLabel}</div>
                </div>

                {/* Feature checklist */}
                <div className="mt-6 space-y-2.5">
                  {currentStakeholder?.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/90">
                      <CheckCircle2 className="size-3.5 mt-0.5 text-white shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-8 pt-4 border-t border-white/20 text-[10px] text-white/70 flex items-center justify-between">
                <span>Enterprise Identity v2.4</span>
                <span className="font-mono">VERIFIED SECURE</span>
              </div>
            </div>

            {/* RIGHT FORM PANEL (Specialized fields per stakeholder) */}
            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {authMode === "signin" ? "Institutional Login" : "New Account Provisioning"}
                  </h3>
                  <p className="text-xs text-slate-500">Provide official organizational credentials below.</p>
                </div>

                {/* Signin vs Signup toggle */}
                <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    className={cn(
                      "px-3 py-1 rounded-md font-medium transition",
                      authMode === "signin" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500"
                    )}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("signup")}
                    className={cn(
                      "px-3 py-1 rounded-md font-medium transition",
                      authMode === "signup" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500"
                    )}
                  >
                    Register
                  </button>
                </div>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {/* 1. STAKEHOLDER UNIQUE ID */}
                <div className="space-y-1">
                  <Label htmlFor="id-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {currentStakeholder?.idFieldLabel} <span className="text-rose-500">*</span>
                  </Label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="id-input"
                      required
                      value={stakeholderId}
                      onChange={(e) => setStakeholderId(e.target.value)}
                      placeholder={currentStakeholder?.idPlaceholder}
                      className="pl-9 h-10 text-xs border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>

                {/* 2. INSTITUTION OR COMPANY NAME */}
                <div className="space-y-1">
                  <Label htmlFor="org-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {currentStakeholder?.orgLabel} <span className="text-rose-500">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="org-input"
                      required
                      value={orgInput}
                      onChange={(e) => setOrgInput(e.target.value)}
                      placeholder={currentStakeholder?.orgPlaceholder}
                      className="pl-9 h-10 text-xs border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>

                {/* 3. EMAIL */}
                <div className="space-y-1">
                  <Label htmlFor="email-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {currentStakeholder?.emailLabel} <span className="text-rose-500">*</span>
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
                      className="pl-9 h-10 text-xs border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>

                {/* 4. PASSWORD */}
                <div className="space-y-1">
                  <Label htmlFor="pwd-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password / Passcode <span className="text-rose-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="pwd-input"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="pl-9 h-10 text-xs border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className={cn("w-full h-11 text-white font-semibold transition mt-3", currentStakeholder?.accentBg)}
                >
                  {authMode === "signin"
                    ? `Authenticate as ${currentStakeholder?.title}`
                    : `Complete Registration`}
                  <ArrowRight className="size-4 ml-1.5" />
                </Button>

                <p className="text-center text-[11px] text-slate-400 pt-2">
                  Institutional SSO & SAML ready. Single session test credentials allowed for evaluator preview.
                </p>
              </form>
            </div>

          </div>
        )}
      </main>

      {/* ENTERPRISE FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-500">
        SkillBridge Unified Portal &copy; 2026. Designed for AICTE & Corporate Industry Collaborations.
      </footer>
    </div>
  );
}