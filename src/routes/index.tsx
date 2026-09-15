import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
      { title: "SkillBridge — Connecting Academia, Industry & Talent" },
      {
        name: "description",
        content:
          "Smart automation portal connecting students, academia, and industry for personalized skill mapping and placement.",
      },
      { property: "og:title", content: "SkillBridge — Connecting Academia, Industry & Talent" },
      {
        property: "og:description",
        content: "AI skill gap mapping, guided learning roadmaps and verified talent matching in one portal.",
      },
    ],
  }),
  component: Welcome,
});

const ROLES: {
  id: RoleId;
  icon: typeof GraduationCap;
  title: string;
  desc: string;
  field: string;
  placeholder: string;
}[] = [
  {
    id: "student",
    icon: GraduationCap,
    title: "Student",
    desc: "Assess skills, bridge gaps & get placed",
    field: "College / University Name",
    placeholder: "e.g. VIT Vellore",
  },
  {
    id: "recruiter",
    icon: Briefcase,
    title: "Recruiter",
    desc: "Post roles & hire verified talent",
    field: "Company Name",
    placeholder: "e.g. Northwind Labs",
  },
  {
    id: "academician",
    icon: School,
    title: "Academician",
    desc: "Track cohort readiness & update curriculum",
    field: "College / University Name",
    placeholder: "e.g. NIT Trichy",
  },
  {
    id: "mentor",
    icon: Compass,
    title: "Mentor",
    desc: "Guide students & review industry projects",
    field: "Domain Expertise",
    placeholder: "e.g. Cloud & Platform Engineering",
  },
];

function Welcome() {
  const navigate = useNavigate();
  const { email, signIn, completeRegistration } = useAppState();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleId | null>(null);
  const [org, setOrg] = useState("");

  const step: 1 | 2 = email ? 2 : 1;
  const active = ROLES.find((r) => r.id === role);

  function handleContinue() {
    const value = emailInput.trim() || "demo@skillbridge.io";
    signIn(value);
    toast.success(mode === "signin" ? "Signed in" : "Account created");
  }

  function handleRegister() {
    if (!role) return;
    completeRegistration(role, org.trim());
    toast.success(`Profile registered as ${active?.title}`);
    navigate({ to: `/${role}` });
  }

  return (
    <div className="surface-grid min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-4 py-16 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Blocks className="size-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">SkillBridge</span>
        </div>

        <span className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          Connecting Academia, Industry & Talent
        </span>

        <h1 className="mt-5 text-center text-4xl font-bold sm:text-5xl">Welcome to SkillBridge</h1>
        <p className="mt-4 max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
          Smart automation portal connecting students, academia, and industry for personalized skill
          mapping and placement.
        </p>

        <div className="mt-8 flex items-center gap-3 text-xs font-medium">
          <StepDot n={1} label="Sign in" done={step > 1} active={step === 1} />
          <span className="h-px w-8 bg-border" />
          <StepDot n={2} label="Role setup" done={false} active={step === 2} />
        </div>

        {step === 1 ? (
          <div className="mt-6 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-card sm:p-7">
            <div className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    mode === m ? "bg-card text-primary shadow-sm" : "text-muted-foreground",
                  )}
                >
                  {m === "signin" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="you@college.edu"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                  />
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handleContinue}>
                Continue
                <ArrowRight className="size-4" />
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Demo mode — any email and password is accepted.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-card sm:p-7">
            <p className="text-sm font-semibold">Select your role to complete profile registration</p>
            <p className="mt-1 text-sm text-muted-foreground">Signed in as {email}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {ROLES.map((r) => {
                const on = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={cn(
                      "rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lift",
                      on ? "border-primary ring-2 ring-primary/25" : "border-border",
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={cn(
                          "flex size-11 shrink-0 items-center justify-center rounded-xl",
                          on ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary",
                        )}
                      >
                        <r.icon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-base font-semibold">{r.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                      </div>
                      {on && <CheckCircle2 className="ml-auto size-5 shrink-0 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {active && (
              <div className="mt-5 space-y-2">
                <Label htmlFor="org">{active.field}</Label>
                <Input
                  id="org"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder={active.placeholder}
                />
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button size="lg" disabled={!role} onClick={handleRegister}>
                Complete Registration
                <ArrowRight className="size-4" />
              </Button>
              <Button variant="ghost" onClick={() => setRole(null)}>
                <ArrowLeft className="size-4" />
                Clear selection
              </Button>
            </div>
          </div>
        )}

        <p className="mt-8 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-success" />
          Skill scores are verified through assessments and mentor-reviewed projects.
        </p>
      </div>
    </div>
  );
}

function StepDot({ n, label, done, active }: { n: number; label: string; done: boolean; active: boolean }) {
  return (
    <span className={cn("flex items-center gap-2", active || done ? "text-primary" : "text-muted-foreground")}>
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-full border text-[11px] font-semibold",
          done || active ? "border-primary bg-primary text-primary-foreground" : "border-border",
        )}
      >
        {done ? <CheckCircle2 className="size-3.5" /> : n}
      </span>
      {label}
    </span>
  );
}
