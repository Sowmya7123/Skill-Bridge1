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
    {
    id: "student",
    badge: "Student Portal",
    title: "Student",
    tagline: "Benchmark your skills & secure verified campus job placements.",
    description: "Industry-aligned skill tests, verified project portfolios, and direct hiring tracks.",
    icon: GraduationCap,
    // Mee exact student photo from public folder
    imageUrl: "/student-hero.jpg",
    pillBg: "bg-blue-50 border-blue-200 text-blue-700",
    iconBg: "bg-blue-100/70 border-blue-200",
    iconColor: "text-blue-600",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200",
    statNumber: "88.4%",
    statLabel: "Skill-to-Role Fitment Score",
    features: [
      "Industry benchmarked skill diagnostic tests",
      "Mentor-evaluated capstone portfolios",
      "Direct verified interview shortlists",
    ],
    idFieldLabel: "University Roll Number / Hall Ticket ID",
    idPlaceholder: "e.g. 21BCE1042",
    emailLabel: "Student College Email",
    emailPlaceholder: "student@university.edu.in",
    orgLabel: "College / University Name",
    orgPlaceholder: "VIT Vellore",
  },
  {
    id: "recruiter",
    badge: "Recruitment Suite",
    title: "Recruiter",
    tagline: "Hire pre-screened talent with audited skill scores.",
    description: "Discover candidates with verified competencies and campus academic audit trails.",
    icon: Briefcase,
    // Mee exact recruiter photo from public folder
    imageUrl: "/recruiter-hero.webp",
    pillBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconBg: "bg-emerald-100/70 border-emerald-200",
    iconColor: "text-emerald-700",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200",
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
    imageUrl:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    pillBg: "bg-amber-50 border-amber-200 text-amber-800",
    iconBg: "bg-amber-100/70 border-amber-200",
    iconColor: "text-amber-700",
    buttonClass: "bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-200",
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
    imageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    pillBg: "bg-cyan-50 border-cyan-200 text-cyan-800",
    iconBg: "bg-cyan-100/70 border-cyan-200",
    iconColor: "text-cyan-700",
    buttonClass: "bg-cyan-700 hover:bg-cyan-800 text-white shadow-sm shadow-cyan-200",
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
  ];

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 transition"
        title="Language"
      >
        <MoreVertical className="size-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
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
              { pageLanguage: "en", includedLanguages: "en,te,hi", autoDisplay: false },
              "google_translate_element"
            );
          }
        } catch {
          // ignore
        }
      };
    }
  }, []);

  function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRole || !currentStakeholder) return;

    const emailValue = emailInput.trim() || `${selectedRole}@college.edu`;
    const finalOrg = orgInput.trim() || currentStakeholder.orgPlaceholder;

    signIn(emailValue);
    completeRegistration(selectedRole, finalOrg);

    toast.success(
      authMode === "signin"
        ? `Logged in as ${currentStakeholder.title}`
        : `Registered as ${currentStakeholder.title}`
    );

    navigate({ to: `/${selectedRole}` });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans relative">
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* CLEAN NAVBAR */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-xs">
            SB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight">SkillBridge</span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                <BadgeCheck className="size-3" />
                Institutional Network
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-500">
              National Talent & Higher Education Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            Verified Environment
          </span>
          <LanguageMenu />
        </div>
      </header>

      {/* MAIN VIEW */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        {!selectedRole ? (
          /* STEP 1: 4 ROLE CARDS */
          <div className="w-full max-w-6xl py-4 sm:py-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-600 mb-3">
                <Sparkles className="size-3.5 text-blue-500" />
                Stakeholder Exchange Portals
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Welcome to SkillBridge Portal
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Choose your stakeholder role to enter your customized institutional dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {STAKEHOLDERS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedRole(item.id)}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white overflow-hidden text-left shadow-xs hover:shadow-md hover:border-slate-300 transition duration-200"
                  >
                    {/* Role Image Header */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                      {/* Floating Icon inside image */}
                      <div
                        className={cn(
                          "absolute bottom-3 left-3 size-10 rounded-xl flex items-center justify-center border shadow-sm backdrop-blur-md bg-white/95",
                          item.iconColor
                        )}
                      >
                        <IconComponent className="size-5" />
                      </div>

                      <span
                        className={cn(
                          "absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shadow-2xs backdrop-blur-sm bg-white/90",
                          item.pillBg
                        )}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                          {item.tagline}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900">
                        <span>Enter Workspace</span>
                        <ArrowRight className="size-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* STEP 2: SPLIT LOGIN */
          <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left Hero Image + Stats Panel */}
            <div className="lg:col-span-5 relative flex flex-col justify-between overflow-hidden bg-slate-900 text-white min-h-[340px]">
              <img
                src={currentStakeholder?.imageUrl}
                alt={currentStakeholder?.title}
                className="absolute inset-0 h-full w-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40" />

              <div className="relative z-10 p-6 sm:p-7">
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white mb-6 transition"
                >
                  <ArrowLeft className="size-3.5" />
                  Back to Roles
                </button>

                <span className="inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border backdrop-blur-md bg-white/15 text-white border-white/20 mb-3">
                  {currentStakeholder?.badge}
                </span>

                <h2 className="text-2xl font-black tracking-tight text-white">
                  {currentStakeholder?.title} Portal
                </h2>
                <p className="mt-2 text-xs text-white/80 leading-relaxed">
                  {currentStakeholder?.description}
                </p>

                {/* Metric Card */}
                <div className="mt-5 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
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

              <div className="relative z-10 p-6 pt-0 text-[11px] text-white/60">
                Institutional SSO & Verification Active
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {authMode === "signin" ? "Authorized Login" : "New Registration"}
                  </h3>
                  <p className="text-xs text-slate-500">Fill in your official credentials</p>
                </div>

                <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    className={cn(
                      "px-3 py-1 rounded-md font-semibold transition",
                      authMode === "signin" ? "bg-white shadow-2xs text-slate-900" : "text-slate-500"
                    )}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("signup")}
                    className={cn(
                      "px-3 py-1 rounded-md font-semibold transition",
                      authMode === "signup" ? "bg-white shadow-2xs text-slate-900" : "text-slate-500"
                    )}
                  >
                    Register
                  </button>
                </div>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <Label htmlFor="id-input" className="text-xs font-semibold text-slate-700">
                    {currentStakeholder?.idFieldLabel} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="id-input"
                      value={stakeholderId}
                      onChange={(e) => setStakeholderId(e.target.value)}
                      placeholder={currentStakeholder?.idPlaceholder}
                      className="pl-9 h-10 text-xs border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {authMode === "signup" && (
                  <div className="space-y-1">
                    <Label htmlFor="org-input" className="text-xs font-semibold text-slate-700">
                      {currentStakeholder?.orgLabel} <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="org-input"
                        value={orgInput}
                        onChange={(e) => setOrgInput(e.target.value)}
                        placeholder={currentStakeholder?.orgPlaceholder}
                        className="pl-9 h-10 text-xs border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="email-input" className="text-xs font-semibold text-slate-700">
                    {currentStakeholder?.emailLabel} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="email-input"
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder={currentStakeholder?.emailPlaceholder}
                      className="pl-9 h-10 text-xs border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="pwd-input" className="text-xs font-semibold text-slate-700">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="pwd-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9 h-10 text-xs border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className={cn("w-full h-10 text-xs font-bold transition mt-2", currentStakeholder?.buttonClass)}
                >
                  {authMode === "signin"
                    ? `Enter as ${currentStakeholder?.title}`
                    : `Complete Registration`}
                  <ArrowRight className="size-4 ml-1.5" />
                </Button>

                <p className="text-center text-[10px] text-slate-400 pt-1">
                  Single-sign-on active. Instant test verification enabled for preview.
                </p>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-3.5 px-6 text-center text-xs text-slate-400">
        SkillBridge Unified Portal &copy; 2026. Higher Education & Industry Frameworks.
      </footer>
    </div>
  );
}