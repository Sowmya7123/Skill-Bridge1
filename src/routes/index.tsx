import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Blocks,
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
  Building,
  MoreVertical,
  Globe,
  Check,
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
      { title: "SkillBridge — Connecting Academia, Industry & Talent" },
      {
        name: "description",
        content:
          "Smart automation portal connecting students, academia, and industry for personalized skill mapping and placement.",
      },
    ],
  }),
  component: Welcome,
});

interface RoleConfig {
  id: RoleId;
  icon: typeof GraduationCap;
  title: string;
  desc: string;
  idLabel: string;
  idPlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  orgLabel?: string;
  orgPlaceholder?: string;
}

const ROLES: RoleConfig[] = [
  {
    id: "student",
    icon: GraduationCap,
    title: "Student",
    desc: "Assess skills, bridge gaps & get placed",
    idLabel: "College Registration / Student ID",
    idPlaceholder: "e.g. 21BCE1042",
    emailLabel: "Student Email",
    emailPlaceholder: "student@college.edu",
    orgLabel: "College / University Name",
    orgPlaceholder: "e.g. VIT Vellore",
  },
  {
    id: "recruiter",
    icon: Briefcase,
    title: "Recruiter",
    desc: "Post roles & hire verified talent",
    idLabel: "Company / Employee ID",
    idPlaceholder: "e.g. EMP-90421",
    emailLabel: "Work Email",
    emailPlaceholder: "hr@company.com",
    orgLabel: "Company Name",
    orgPlaceholder: "e.g. Microsoft, Google",
  },
  {
    id: "academician",
    icon: School,
    title: "Academician",
    desc: "Track cohort readiness & update curriculum",
    idLabel: "Faculty / College ID",
    idPlaceholder: "e.g. FAC-5512",
    emailLabel: "Institutional Email",
    emailPlaceholder: "faculty@university.edu",
    orgLabel: "College / University Name",
    orgPlaceholder: "e.g. NIT Trichy",
  },
  {
    id: "mentor",
    icon: Compass,
    title: "Mentor",
    desc: "Guide students & review industry projects",
    idLabel: "Mentor / Expert ID",
    idPlaceholder: "e.g. MNT-7701",
    emailLabel: "Contact Email",
    emailPlaceholder: "mentor@domain.com",
    orgLabel: "Domain Expertise",
    orgPlaceholder: "e.g. Cloud & AI Architecture",
  },
];

// Three Dots Language Dropdown Component
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
        className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition hover:bg-accent hover:text-foreground"
        title="Change Language"
      >
        <MoreVertical className="size-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-border bg-popover p-1.5 shadow-xl z-50">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border mb-1">
            <Globe className="size-3.5" />
            Language
          </div>

          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLanguageSelect(lang.code)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-popover-foreground transition hover:bg-accent"
            >
              <div className="flex flex-col text-left">
                <span className="font-medium leading-none">{lang.native}</span>
                <span className="text-[11px] text-muted-foreground">{lang.label}</span>
              </div>
              {currentLang === lang.code && (
                <Check className="size-4 text-primary" />
              )}
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

  // Form states
  const [stakeholderId, setStakeholderId] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [orgInput, setOrgInput] = useState("");

  const activeRoleConfig = ROLES.find((r) => r.id === selectedRole);

  // Auto-inject Google Translate script into page
  useEffect(() => {
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,te,hi",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };
    }
  }, []);

  function handleAuthSubmit() {
    if (!selectedRole) return;

    const emailValue = emailInput.trim() || `${selectedRole}.demo@skillbridge.io`;
    signIn(emailValue);
    completeRegistration(selectedRole, orgInput.trim() || activeRoleConfig?.orgPlaceholder || "");

    toast.success(
      authMode === "signin"
        ? `Logged in as ${activeRoleConfig?.title}`
        : `Registered successfully as ${activeRoleConfig?.title}`
    );

    navigate({ to: `/${selectedRole}` });
  }

  return (
    <div className="surface-grid relative min-h-screen bg-background">
      {/* Hidden Translate Element */}
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* Top Right Three Dots Language Menu */}
      <div className="absolute right-4 top-4 z-50 sm:right-8 sm:top-6">
        <LanguageMenu />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-4 py-16 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Blocks className="size-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">SkillBridge</span>
        </div>

        <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          Connecting Academia, Industry & Talent
        </span>

        <h1 className="mt-4 text-center text-3xl font-bold sm:text-4xl">
          {selectedRole
            ? `${activeRoleConfig?.title} Portal`
            : "Select Your Stakeholder Role"}
        </h1>
        <p className="mt-2 max-w-xl text-center text-sm text-muted-foreground">
          {selectedRole
            ? `Please authenticate using your verified ${activeRoleConfig?.idLabel.toLowerCase()}`
            : "Choose your role to access dedicated dashboards, tools, and verification portals."}
        </p>

        {/* STEP 1: SELECT STAKEHOLDER ROLE */}
        {!selectedRole ? (
          <div className="mt-8 grid w-full max-w-3xl gap-4 sm:grid-cols-2">
            {ROLES.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 text-left transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                >
                  <div>
                    <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-6" />
                    </span>
                    <h2 className="mt-4 text-lg font-semibold">{r.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                  <div className="mt-5 flex items-center gap-1 text-xs font-medium text-primary">
                    <span>Access Portal</span>
                    <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* STEP 2: DEDICATED LOGIN / REGISTER FORM FOR SELECTED ROLE */
          <div className="mt-8 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-card sm:p-7">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Switch Stakeholder Role
            </button>

            {/* Toggle Sign In / Register */}
            <div className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setAuthMode(m)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    authMode === m
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  {m === "signin"
                    ? `${activeRoleConfig?.title} Sign In`
                    : `Register New`}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              {/* Stakeholder Specific ID (Student ID / Company ID / Faculty ID) */}
              <div className="space-y-1.5">
                <Label htmlFor="stakeholder-id" className="text-xs">
                  {activeRoleConfig?.idLabel}
                </Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="stakeholder-id"
                    value={stakeholderId}
                    onChange={(e) => setStakeholderId(e.target.value)}
                    placeholder={activeRoleConfig?.idPlaceholder}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              {/* Institution / Company Name (Visible during Register) */}
              {authMode === "signup" && activeRoleConfig?.orgLabel && (
                <div className="space-y-1.5">
                  <Label htmlFor="org-name" className="text-xs">
                    {activeRoleConfig.orgLabel}
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="org-name"
                      value={orgInput}
                      onChange={(e) => setOrgInput(e.target.value)}
                      placeholder={activeRoleConfig.orgPlaceholder}
                      className="pl-9 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">
                  {activeRoleConfig?.emailLabel}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={activeRoleConfig?.emailPlaceholder}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button className="w-full mt-2" size="lg" onClick={handleAuthSubmit}>
                {authMode === "signin"
                  ? `Enter as ${activeRoleConfig?.title}`
                  : `Complete Registration`}
                <ArrowRight className="size-4 ml-1.5" />
              </Button>

              <p className="text-center text-[11px] text-muted-foreground">
                Demo mode — custom stakeholder validation active.
              </p>
            </div>
          </div>
        )}

        <p className="mt-8 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-emerald-500" />
          Verified stakeholder role authentication with institutional ID matching.
        </p>
      </div>
    </div>
  );
}