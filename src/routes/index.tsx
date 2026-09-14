import { createFileRoute, Link } from "@tanstack/react-router";
import { Blocks, GraduationCap, Briefcase, School, Compass, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

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

const ROLES = [
  {
    to: "/student" as const,
    icon: GraduationCap,
    title: "Student",
    desc: "Assess skills, bridge gaps & get placed",
  },
  {
    to: "/recruiter" as const,
    icon: Briefcase,
    title: "Recruiter",
    desc: "Post roles & hire verified talent",
  },
  {
    to: "/academician" as const,
    icon: School,
    title: "Academician",
    desc: "Track cohort readiness & update curriculum",
  },
  {
    to: "/mentor" as const,
    icon: Compass,
    title: "Mentor",
    desc: "Guide students & review industry projects",
  },
];

function Welcome() {
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

        <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Continue as
        </p>

        <div className="mt-4 grid w-full gap-4 sm:grid-cols-2">
          {ROLES.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="group rounded-2xl border border-border bg-card p-6 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <r.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold">{r.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                </div>
                <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-success" />
          Skill scores are verified through assessments and mentor-reviewed projects.
        </p>
      </div>
    </div>
  );
}
