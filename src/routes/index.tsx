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
    statNumber: "88.4%",
    statLabel: "Skill-to-Role Fitment",
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
    emailPlaceholder: "talent@company.com",
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
        className="flex size-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition"
        title="Language"
      >
        <MoreVertical className="size-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-md z-50">
          <div className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
            <Globe className="size-3" />
            Language
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLanguageSelect(lang.code)}
              className="flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs font-normal text-gray-600 hover:bg-gray-50 transition"
            >
              <div className="flex flex-col text-left">
                <span>{lang.native}</span>
                <span className="text-[9px] text-gray-400">{lang.label}</span>
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
    <div className="min-h-screen bg-white text-gray-700 flex flex-col font-sans">
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* LIGHT MINIMAL NAVBAR */}
      <header className="border-b border-gray-100 bg-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded border border-gray-200 bg-gray-50 text-gray-700 font-semibold text-xs">
            SB
          </div>
          <span className="text-sm font-semibold tracking-tight text-gray-800">SkillBridge</span>
          <span className="hidden sm:inline-block text-[11px] text-gray-400 pl-2 border-l border-gray-200">
            Higher Education & Industry Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:flex items-center gap-1 text-xs text-gray-400">
            <ShieldCheck className="size-3.5 text-gray-400" />
            Verified Environment
          </span>
          <LanguageMenu />
        </div>
      </header>

      {/* MAIN VIEW */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-[#FAFAFA]">
        {!selectedRole ? (
          /* STEP 1: ROLE SELECTION CARDS */
          <div className="w-full max-w-4xl py-6">
            <div className="text-center max-w-lg mx-auto mb-8">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-gray-200 text-[11px] text-gray-500 mb-2">
                <Sparkles className="size-3 text-gray-400" />
                Select Gateway
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                Welcome to SkillBridge
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                Select your stakeholder category to continue to your dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {STAKEHOLDERS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedRole(item.id)}
                    className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 text-left hover:border-gray-300 hover:shadow-xs transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="size-8 rounded border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-600">
                          <IconComponent className="size-4" />
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {item.badge}
                        </span>
                      </div>

                      <h2 className="text-sm font-semibold text-gray-800">
                        {item.title}
                      </h2>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.tagline}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-gray-50 text-[11px] font-medium text-gray-600 w-full">
                      <span>Access Portal</span>
                      <ArrowRight className="size-3 text-gray-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* STEP 2: SPLIT LOGIN FORM */
          <div className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12">
            {/* Left Info Panel */}
            <div className="md:col-span-5 p-5 bg-gray-50/50 border-r border-gray-100 flex flex-col justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700 mb-4 transition"
                >
                  <ArrowLeft className="size-3" />
                  Switch Role
                </button>

                <div className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1">
                  {currentStakeholder?.badge}
                </div>

                <h2 className="text-base font-semibold text-gray-800">
                  {currentStakeholder?.title} Portal
                </h2>
                <p className="mt-1 text-[11px] text-gray-500 leading-relaxed">
                  {currentStakeholder?.description}
                </p>

                <div className="mt-4 p-2.5 rounded border border-gray-100 bg-white">
                  <div className="text-lg font-semibold text-gray-800">{currentStakeholder?.statNumber}</div>
                  <div className="text-[10px] text-gray-400">{currentStakeholder?.statLabel}</div>
                </div>

                <div className="mt-4 space-y-1.5">
                  {currentStakeholder?.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                      <CheckCircle2 className="size-3 mt-0.5 text-gray-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-100 text-[10px] text-gray-400">
                Single Sign-On Active
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-center bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-800">
                    {authMode === "signin" ? "Login" : "Register"}
                  </h3>
                  <p className="text-[10px] text-gray-400">Enter your credentials</p>
                </div>

                <div className="flex rounded bg-gray-100 p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    className={cn(
                      "px-2 py-0.5 rounded transition",
                      authMode === "signin" ? "bg-white text-gray-800 font-medium shadow-2xs" : "text-gray-500"
                    )}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("signup")}
                    className={cn(
                      "px-2 py-0.5 rounded transition",
                      authMode === "signup" ? "bg-white text-gray-800 font-medium shadow-2xs" : "text-gray-500"
                    )}
                  >
                    Register
                  </button>
                </div>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-2.5">
                <div className="space-y-0.5">
                  <Label htmlFor="id-input" className="text-[11px] font-medium text-gray-600">
                    {currentStakeholder?.idFieldLabel}
                  </Label>
                  <div className="relative">
                    <IdCard className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                    <Input
                      id="id-input"
                      value={stakeholderId}
                      onChange={(e) => setStakeholderId(e.target.value)}
                      placeholder={currentStakeholder?.idPlaceholder}
                      className="pl-8 h-8 text-[11px] border-gray-200 bg-white focus-visible:ring-gray-300"
                    />
                  </div>
                </div>

                {authMode === "signup" && (
                  <div className="space-y-0.5">
                    <Label htmlFor="org-input" className="text-[11px] font-medium text-gray-600">
                      {currentStakeholder?.orgLabel}
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                      <Input
                        id="org-input"
                        value={orgInput}
                        onChange={(e) => setOrgInput(e.target.value)}
                        placeholder={currentStakeholder?.orgPlaceholder}
                        className="pl-8 h-8 text-[11px] border-gray-200 bg-white focus-visible:ring-gray-300"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-0.5">
                  <Label htmlFor="email-input" className="text-[11px] font-medium text-gray-600">
                    {currentStakeholder?.emailLabel}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                    <Input
                      id="email-input"
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder={currentStakeholder?.emailPlaceholder}
                      className="pl-8 h-8 text-[11px] border-gray-200 bg-white focus-visible:ring-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <Label htmlFor="pwd-input" className="text-[11px] font-medium text-gray-600">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                    <Input
                      id="pwd-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-8 h-8 text-[11px] border-gray-200 bg-white focus-visible:ring-gray-300"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-8 text-xs font-medium transition mt-2 bg-blue-600 hover:bg-blue-700 text-white shadow-none"
                >
                  {authMode === "signin"
                    ? `Continue as ${currentStakeholder?.title}`
                    : `Register`}
                  <ArrowRight className="size-3 ml-1" />
                </Button>

                <p className="text-center text-[10px] text-gray-400 pt-0.5">
                  Demo mode active. Any credentials accepted.
                </p>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-100 bg-white py-2.5 px-6 text-center text-[10px] text-gray-400">
        SkillBridge &copy; 2026. Higher Education & Industry Frameworks.
      </footer>
    </div>
  );
}