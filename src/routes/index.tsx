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
    tagline: "Assess industry readiness and unlock verified campus interviews.",
    description: "Benchmark your skills with standardized diagnostics and showcase verified project rubrics.",
    icon: GraduationCap,
    pillBg: "bg-blue-50 border-blue-200 text-blue-700",
    iconBg: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
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
    tagline: "Hire verified talent based on audited assessment outcomes.",
    description: "Connect with job-ready candidates with transparent performance audit trails.",
    icon: Briefcase,
    pillBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconBg: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    statNumber: "3.2x",
    statLabel: "Faster Candidate Filtering",
    features: [
      "Access pre-verified skill matrices",
      "Granular filters by university and branch",
      "Proctored assessment audit verification",
    ],
    idFieldLabel: "Corporate Employee ID",
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
    tagline: "Analyze cohort skill gaps and adapt curriculum to market trends.",
    description: "Monitor real-time cohort readiness metrics and export verified documentation.",
    icon: School,
    pillBg: "bg-amber-50 border-amber-200 text-amber-800",
    iconBg: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-700",
    buttonClass: "bg-amber-700 hover:bg-amber-800 text-white",
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
    tagline: "Evaluate project rigor and coach future engineering cohorts.",
    description: "Guide student final-year capstones and endorse high-potential portfolios.",
    icon: Compass,
    pillBg: "bg-teal-50 border-teal-200 text-teal-800",
    iconBg: "bg-teal-50 border-teal-200",
    iconColor: "text-teal-700",
    buttonClass: "bg-teal-700 hover:bg-teal-800 text-white",
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
        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 transition"
        title="Language"
      >
        <MoreVertical className="size-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50">
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
          // ignore init error
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative">
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-sm">
            SB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">SkillBridge</span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                <BadgeCheck className="size-3" />
                Verified Portal
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

      {/* CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        {!selectedRole ? (
          /* ROLE SELECTION */
          <div className="w-full max-w-5xl py-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600 mb-3">
                <Sparkles className="size-3.5 text-slate-500" />
                Institutional Stakeholder Gateway
              </div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome to SkillBridge
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Select your stakeholder category to access your dedicated workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {STAKEHOLDERS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedRole(item.id)}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:shadow-md hover:border-slate-300 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={cn("size-10 rounded-lg flex items-center justify-center border", item.iconBg, item.iconColor)}>
                          <IconComponent className="size-5" />
                        </div>
                        <span className={cn("text-[10px] font-semibold uppercase px-2 py-0.5 rounded border", item.pillBg)}>
                          {item.badge}
                        </span>
                      </div>

                      <h2 className="text-base font-bold text-slate-900">
                        {item.title}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {item.tagline}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-slate-900 w-full">
                      <span>Enter</span>
                      <ArrowRight className="size-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* SPLIT AUTH CARD */
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12">
            {/* Left Info Panel */}
            <div className="md:col-span-5 p-6 bg-slate-50 border-r border-slate-200 flex flex-col justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-5"
                >
                  <ArrowLeft className="size-3.5" />
                  All Portals
                </button>

                <span className={cn("inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded border mb-2", currentStakeholder?.pillBg)}>
                  {currentStakeholder?.badge}
                </span>

                <h2 className="text-xl font-bold text-slate-900">
                  {currentStakeholder?.title} Portal
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {currentStakeholder?.description}
                </p>

                <div className="mt-5 p-3 rounded-lg bg-white border border-slate-200">
                  <div className="text-xl font-bold text-slate-900">{currentStakeholder?.statNumber}</div>
                  <div className="text-[10px] font-medium text-slate-500">{currentStakeholder?.statLabel}</div>
                </div>

                <div className="mt-5 space-y-2">
                  {currentStakeholder?.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <CheckCircle2 className="size-3.5 mt-0.5 text-slate-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200 text-[10px] text-slate-400">
                Single Sign-On (SSO) Active
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-slate-900">
                  {authMode === "signin" ? "Authorized Login" : "Registration"}
                </h3>

                <div className="flex rounded-md bg-slate-100 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    className={cn(
                      "px-2.5 py-1 rounded font-medium",
                      authMode === "signin" ? "bg-white shadow-sm text-slate-900 font-semibold" : "text-slate-500"
                    )}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("signup")}
                    className={cn(
                      "px-2.5 py-1 rounded font-medium",
                      authMode === "signup" ? "bg-white shadow-sm text-slate-900 font-semibold" : "text-slate-500"
                    )}
                  >
                    Register
                  </button>
                </div>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <Label htmlFor="id-input" className="text-xs font-semibold text-slate-700">
                    {currentStakeholder?.idFieldLabel}
                  </Label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="id-input"
                      value={stakeholderId}
                      onChange={(e) => setStakeholderId(e.target.value)}
                      placeholder={currentStakeholder?.idPlaceholder}
                      className="pl-9 h-9 text-xs border-slate-200"
                    />
                  </div>
                </div>

                {authMode === "signup" && (
                  <div className="space-y-1">
                    <Label htmlFor="org-input" className="text-xs font-semibold text-slate-700">
                      {currentStakeholder?.orgLabel}
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="org-input"
                        value={orgInput}
                        onChange={(e) => setOrgInput(e.target.value)}
                        placeholder={currentStakeholder?.orgPlaceholder}
                        className="pl-9 h-9 text-xs border-slate-200"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="email-input" className="text-xs font-semibold text-slate-700">
                    {currentStakeholder?.emailLabel}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="email-input"
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder={currentStakeholder?.emailPlaceholder}
                      className="pl-9 h-9 text-xs border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="pwd-input" className="text-xs font-semibold text-slate-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="pwd-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9 h-9 text-xs border-slate-200"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className={cn("w-full h-10 text-xs font-semibold transition mt-2", currentStakeholder?.buttonClass)}
                >
                  {authMode === "signin"
                    ? `Access ${currentStakeholder?.title} Dashboard`
                    : `Complete Registration`}
                  <ArrowRight className="size-3.5 ml-1.5" />
                </Button>

                <p className="text-center text-[10px] text-slate-400 pt-1">
                  Demo bypass active. Any test credentials accepted.
                </p>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-3 px-6 text-center text-xs text-slate-400">
        SkillBridge Unified Portal &copy; 2026. Higher Education & Industry Frameworks.
      </footer>
    </div>
  );
}