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
  pillBg: string;
  pillText: string;
  iconBg: string;
  iconColor: string;
  buttonClass: string;
  glowColor: string;
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
    tagline: "Assess industry readiness and unlock verified campus interviews.",
    description: "Benchmark your skills with standardized diagnostics and showcase verified project rubrics to top recruiters.",
    icon: GraduationCap,
    pillBg: "bg-blue-50 border-blue-200 text-blue-700",
    pillText: "text-blue-700",
    iconBg: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200",
    glowColor: "from-blue-200/40 via-sky-100/30 to-transparent",
    statNumber: "88.4%",
    statLabel: "Skill-to-Role Fitment Score",
    features: [
      "Industry benchmarked skill diagnostic tests",
      "Mentor-evaluated capstone portfolios",
      "Direct verified interview shortlists",
    ],
    idFieldLabel: "University Roll Number / Hall Ticket ID",
    idPlaceholder: "e.g. 21BCE1042 or 2024-CSE-09",
    emailLabel: "Student Institutional Email",
    emailPlaceholder: "student@university.edu.in",
    orgLabel: "College / University Name",
    orgPlaceholder: "e.g. VIT Vellore / JNTU Hyderabad",
  },
  {
    id: "recruiter",
    badge: "Recruitment Suite",
    title: "Recruiter",
    tagline: "Hire verified talent based on audited assessment outcomes.",
    description: "Connect with job-ready candidates with transparent performance audit trails across multiple colleges.",
    icon: Briefcase,
    pillBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
    pillText: "text-emerald-700",
    iconBg: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200",
    glowColor: "from-emerald-200/40 via-teal-100/30 to-transparent",
    statNumber: "3.2x",
    statLabel: "Faster Candidate Filtering",
    features: [
      "Access candidates with pre-verified skill matrices",
      "Granular filters by university, batch, and test scores",
      "Proctored assessment audit verification",
    ],
    idFieldLabel: "Corporate Employee ID / Work ID",
    idPlaceholder: "e.g. CORP-REC-4821",
    emailLabel: "Work Email Address",
    emailPlaceholder: "talent@microsoft.com",
    orgLabel: "Company / Organization Name",
    orgPlaceholder: "e.g. Microsoft, Amazon, Infosys",
  },
  {
    id: "academician",
    badge: "Faculty & Dean Portal",
    title: "Academician",
    tagline: "Analyze cohort skill gaps and adapt curriculum to market trends.",
    description: "Monitor real-time cohort readiness metrics and export verified documentation for accreditation audits.",
    icon: School,
    pillBg: "bg-amber-50 border-amber-200 text-amber-800",
    pillText: "text-amber-800",
    iconBg: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-700",
    buttonClass: "bg-amber-700 hover:bg-amber-800 text-white shadow-sm shadow-amber-200",
    glowColor: "from-amber-200/40 via-orange-100/30 to-transparent",
    statNumber: "94%",
    statLabel: "Curriculum Alignment Index",
    features: [
      "Department-level skill gap visual heatmaps",
      "Accreditation export tables (NIRF, NAAC & NBA)",
      "Industry recommendation alerts for syllabus",
    ],
    idFieldLabel: "Faculty Institutional ID",
    idPlaceholder: "e.g. FAC-CSE-2018",
    emailLabel: "Institutional Faculty Email",
    emailPlaceholder: "hod.cse@college.ac.in",
    orgLabel: "College / University Name",
    orgPlaceholder: "e.g. IIT Madras / NIT Warangal",
  },
  {
    id: "mentor",
    badge: "Industry Mentor Desk",
    title: "Mentor",
    tagline: "Evaluate project rigor and coach future engineering cohorts.",
    description: "Guide student final-year capstone architectures and endorse high-potential student portfolios.",
    icon: Compass,
    pillBg: "bg-teal-50 border-teal-200 text-teal-800",
    pillText: "text-teal-800",
    iconBg: "bg-teal-50 border-teal-200",
    iconColor: "text-teal-700",
    buttonClass: "bg-teal-700 hover:bg-teal-800 text-white shadow-sm shadow-teal-200",
    glowColor: "from-teal-200/40 via-cyan-100/30 to-transparent",
    statNumber: "4.9/5",
    statLabel: "Average Mentor Engagement",
    features: [
      "Direct code repository and system design reviews",
      "Industry rubrics for skill validation badge issuance",
      "Direct recommendation letters for exceptional talent",
    ],
    idFieldLabel: "Mentor Advisory Registration ID",
    idPlaceholder: "e.g. MNT-ENG-7704",
    emailLabel: "Professional Email Address",
    emailPlaceholder: "expert.advisor@domain.com",
    orgLabel: "Primary Industry Domain",
    orgPlaceholder: "e.g. Distributed Systems & AI Platforms",
  },
];

// Three Dots Language Dropdown Menu
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
        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 transition"
        title="Change Language"
      >
        <MoreVertical className="size-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            <Globe className="size-3.5" />
            Language
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLanguageSelect(lang.code)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
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

    toast.success(`Authenticated into ${currentStakeholder.title} Portal`);
    navigate({ to: `/${selectedRole}` });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans relative overflow-x-hidden">
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* PROFESSIONAL MULTI-STAKEHOLDER AMBIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Crisp grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
            backgroundSize: "24px 24px"
          }}
        />

        {/* Dynamic ambient soft blur matching current stakeholder */}
        <div
          className={cn(
            "absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[480px] rounded-full blur-3xl opacity-60 transition-all duration-700 bg-gradient-to-b",
            currentStakeholder ? currentStakeholder.glowColor : "from-slate-200/50 via-blue-100/30 to-transparent"
          )}
        />

        {/* Subtle decorative badges floating in background */}
        <div className="hidden lg:block absolute top-28 left-12 opacity-15 rotate-[-12deg]">
          <GraduationCap className="size-28 text-slate-400" />
        </div>
        <div className="hidden lg:block absolute bottom-24 left-20 opacity-15 rotate-[8deg]">
          <School className="size-24 text-slate-400" />
        </div>
        <div className="hidden lg:block absolute top-36 right-16 opacity-15 rotate-[12deg]">
          <Briefcase className="size-24 text-slate-400" />
        </div>
        <div className="hidden lg:block absolute bottom-28 right-24 opacity-15 rotate-[-8deg]">
          <Compass className="size-28 text-slate-400" />
        </div>
      </div>

      {/* ENTERPRISE CLEAN NAVBAR */}
      <header className="relative z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-sm tracking-wide shadow-sm">
            SB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900">SkillBridge</span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50/70 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                <BadgeCheck className="size-3" />
                Verified Framework
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-500">
              National Talent & Higher Education Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <ShieldCheck className="size-3.5 text-slate-400" />
            Institutional Identity Protected
          </span>
          <LanguageMenu />
        </div>
      </header>

      {/* MAIN VIEW */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        {!selectedRole ? (
          /* STEP 1: DECENT LIGHT 4-STAKEHOLDER GATEWAY SELECTION */
          <div className="w-full max-w-6xl py-4 sm:py-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600 mb-3">
                <Sparkles className="size-3.5 text-slate-500" />
                Institutional Stakeholder Gateway
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Welcome to SkillBridge Exchange
              </h1>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                A unified ecosystem connecting students, corporate employers, academicians, and certified industry mentors.
              </p>
            </div>

            {/* 4 STAKEHOLDER CARDS WITH DECENT PASTEL HIGHLIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {STAKEHOLDERS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedRole(item.id)}
                    className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={cn("size-12 rounded-xl flex items-center justify-center border transition group-hover:scale-105", item.iconBg, item.iconColor)}>
                          <IconComponent className="size-6" />
                        </div>
                        <span className={cn("text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border", item.pillBg)}>
                          {item.badge}
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {item.tagline}
                      </p>

                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <div className="text-[10px] font-medium text-slate-400 mb-1">Key Capability</div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          <CheckCircle2 className="size-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{item.features[0]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-3 border-t border-slate-50 text-xs font-semibold text-slate-900">
                      <span>Enter Portal</span>
                      <ArrowRight className="size-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-12 text-center text-xs text-slate-400">
              Authorized access with institutionally matched roll numbers, faculty registers, and corporate IDs.
            </p>
          </div>
        ) : (
          /* STEP 2: PROFESSIONAL SPLIT AUTH PANEL */
          <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* LEFT INFORMATION PANEL (Clean, decent light-tinted styling) */}
            <div className="lg:col-span-5 p-8 bg-slate-50/80 border-r border-slate-200 flex flex-col justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition"
                >
                  <ArrowLeft className="size-3.5" />
                  All Portals
                </button>

                <span className={cn("inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border mb-3", currentStakeholder?.pillBg)}>
                  {currentStakeholder?.badge}
                </span>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {currentStakeholder?.title} Gateway
                </h2>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  {currentStakeholder?.description}
                </p>

                {/* Clean metric callout box */}
                <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-2xl font-extrabold text-slate-900">{currentStakeholder?.statNumber}</div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">{currentStakeholder?.statLabel}</div>
                </div>

                {/* Checklist */}
                <div className="mt-6 space-y-2.5">
                  {currentStakeholder?.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="size-3.5 mt-0.5 text-slate-400 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Enterprise Identity v2.4</span>
                <span className="font-medium text-slate-500">SSO Ready</span>
              </div>
            </div>

            {/* RIGHT FORM PANEL */}
            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {authMode === "signin" ? "Authorized Login" : "New Account Provisioning"}
                  </h3>
                  <p className="text-xs text-slate-500">Enter institutional credentials below.</p>
                </div>

                {/* Signin vs Signup toggle */}
                <div className="flex rounded-lg bg-slate-100 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    className={cn(
                      "px-3 py-1 rounded-md font-medium transition",
                      authMode === "signin" ? "bg-white shadow-sm text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("signup")}
                    className={cn(
                      "px-3 py-1 rounded-md font-medium transition",
                      authMode === "signup" ? "bg-white shadow-sm text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    Register
                  </button>
                </div>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {/* 1. STAKEHOLDER SPECIFIC ID */}
                <div className="space-y-1">
                  <Label htmlFor="id-input" className="text-xs font-semibold text-slate-700">
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
                      className="pl-9 h-10 text-xs border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {/* 2. INSTITUTION OR COMPANY (Signup mode) */}
                {authMode === "signup" && (
                  <div className="space-y-1">
                    <Label htmlFor="org-input" className="text-xs font-semibold text-slate-700">
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
                        className="pl-9 h-10 text-xs border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* 3. EMAIL */}
                <div className="space-y-1">
                  <Label htmlFor="email-input" className="text-xs font-semibold text-slate-700">
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
                      className="pl-9 h-10 text-xs border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {/* 4. PASSWORD */}
                <div className="space-y-1">
                  <Label htmlFor="pwd-input" className="text-xs font-semibold text-slate-700">
                    Password / Access Code <span className="text-rose-500">*</span>
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
                      className="pl-9 h-10 text-xs border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className={cn("w-full h-11 text-xs font-semibold transition mt-2", currentStakeholder?.buttonClass)}
                >
                  {authMode === "signin"
                    ? `Access ${currentStakeholder?.title} Dashboard`
                    : `Complete Registration`}
                  <ArrowRight className="size-4 ml-1.5" />
                </Button>

                <p className="text-center text-[11px] text-slate-400 pt-1">
                  Single-sign-on verification active. Any credentials accepted for demo evaluation.
                </p>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-200/80 bg-white/70 py-3.5 px-6 text-center text-xs text-slate-400">
        SkillBridge Unified Portal &copy; 2026. Aligned with National Higher Education & Industry Skill Frameworks.
      </footer>
    </div>
  );
}