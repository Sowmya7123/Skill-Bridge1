import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  Brain,
  CheckCircle2,
  CircleDashed,
  Clock,
  Gauge,
  Loader2,
  MapPin,
  RotateCcw,
  Target,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { TopBar, KpiCard } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CAREER_PATHS, getPath, type CareerPathId } from "@/lib/skillbridge-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Skill Journey — SkillBridge" },
      {
        name: "description",
        content: "Pick a career path, take an AI skill assessment and get a personalized roadmap to placement.",
      },
      { property: "og:title", content: "Student Skill Journey — SkillBridge" },
      {
        property: "og:description",
        content: "AI skill gap analysis, learning roadmap and matched internships for students.",
      },
    ],
  }),
  component: StudentFlow,
});

type Stage = "path" | "quiz" | "analyzing" | "dashboard";

function StudentFlow() {
  const [stage, setStage] = useState<Stage>("path");
  const [pathId, setPathId] = useState<CareerPathId | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [qIndex, setQIndex] = useState(0);

  const path = pathId ? getPath(pathId) : null;
  const correct = path
    ? path.questions.filter((q) => answers[q.id] === q.answer).length
    : 0;

  function startQuiz() {
    setAnswers({});
    setQIndex(0);
    setStage("quiz");
  }

  function submit() {
    setStage("analyzing");
    setTimeout(() => setStage("dashboard"), 1500);
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {stage === "path" && (
          <PathStep
            selected={pathId}
            onSelect={setPathId}
            onContinue={() => pathId && startQuiz()}
          />
        )}

        {stage === "quiz" && path && (
          <QuizStep
            path={path}
            index={qIndex}
            answers={answers}
            onAnswer={(id, i) => setAnswers((a) => ({ ...a, [id]: i }))}
            onPrev={() => setQIndex((i) => Math.max(0, i - 1))}
            onNext={() => setQIndex((i) => Math.min(path.questions.length - 1, i + 1))}
            onSubmit={submit}
            onBack={() => setStage("path")}
          />
        )}

        {stage === "analyzing" && <Analyzing />}

        {stage === "dashboard" && path && (
          <StudentDashboard path={path} correct={correct} onRetake={startQuiz} onChangePath={() => setStage("path")} />
        )}
      </main>
    </div>
  );
}

function StepHeader({ step, title, sub }: { step: string; title: string; sub: string }) {
  return (
    <div className="mb-7">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">{step}</p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

function PathStep({
  selected,
  onSelect,
  onContinue,
}: {
  selected: CareerPathId | null;
  onSelect: (id: CareerPathId) => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <StepHeader
        step="Step 1 of 3"
        title="What is your target career path?"
        sub="We tailor your assessment, skill gap map and internship matches to this goal."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {CAREER_PATHS.map((p) => {
          const active = selected === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className={cn(
                "rounded-2xl border bg-card p-6 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift",
                active ? "border-primary ring-2 ring-primary/25" : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">{p.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                </div>
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border",
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  )}
                >
                  {active && <CheckCircle2 className="size-4" />}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.badges.map((b) => (
                  <Badge key={b} variant="secondary" className="font-medium">
                    {b}
                  </Badge>
                ))}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-7 flex items-center gap-3">
        <Button size="lg" disabled={!selected} onClick={onContinue}>
          Continue to Skill Assessment
          <ArrowRight className="size-4" />
        </Button>
        {!selected && <p className="text-sm text-muted-foreground">Select a path to continue.</p>}
      </div>
    </div>
  );
}

function QuizStep({
  path,
  index,
  answers,
  onAnswer,
  onPrev,
  onNext,
  onSubmit,
  onBack,
}: {
  path: ReturnType<typeof getPath>;
  index: number;
  answers: Record<string, number>;
  onAnswer: (id: string, i: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const q = path.questions[index]!;
  const total = path.questions.length;
  const answeredAll = path.questions.every((qq) => answers[qq.id] !== undefined);
  const isLast = index === total - 1;

  return (
    <div className="mx-auto max-w-3xl">
      <StepHeader
        step="Step 2 of 3"
        title="AI Skill Assessment"
        sub={`Tailored to ${path.title}. Answer honestly — the gap map depends on it.`}
      />
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            Question {index + 1} of {total}
          </p>
          <Badge variant="outline" className="text-primary">
            {q.topic}
          </Badge>
        </div>
        <Progress value={((index + 1) / total) * 100} className="mt-3 h-1.5" />

        <h2 className="mt-6 text-lg font-semibold leading-snug">{q.question}</h2>

        <div className="mt-5 grid gap-2.5">
          {q.options.map((opt, i) => {
            const active = answers[q.id] === i;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onAnswer(q.id, i)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                  active
                    ? "border-primary bg-primary-soft font-medium text-accent-foreground"
                    : "border-border bg-card hover:bg-muted",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button variant="ghost" onClick={index === 0 ? onBack : onPrev}>
            <ArrowLeft className="size-4" />
            {index === 0 ? "Change path" : "Previous"}
          </Button>
          <div className="ml-auto flex gap-2">
            {!isLast && (
              <Button onClick={onNext} disabled={answers[q.id] === undefined}>
                Next question
                <ArrowRight className="size-4" />
              </Button>
            )}
            {isLast && (
              <Button onClick={onSubmit} disabled={!answeredAll}>
                <Brain className="size-4" />
                Submit & Analyze
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Analyzing() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Loader2 className="size-7 animate-spin" />
      </span>
      <h2 className="mt-6 text-xl font-semibold">Running Sentence-Transformers & Skill Gap Mapping…</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Embedding your responses, comparing them against live job descriptions and building your
        personalized roadmap.
      </p>
      <div className="mt-6 h-1.5 w-64 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
      </div>
    </div>
  );
}

function StudentDashboard({
  path,
  correct,
  onRetake,
  onChangePath,
}: {
  path: ReturnType<typeof getPath>;
  correct: number;
  onRetake: () => void;
  onChangePath: () => void;
}) {
  const total = path.questions.length;
  const readiness = Math.round(40 + (correct / total) * 55);
  const gapsCritical = path.gaps.filter((g) => g.severity === "critical").length;
  const matchIndex = Math.min(97, readiness + 16);
  const [done, setDone] = useState<Record<number, boolean>>({});

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge className="bg-primary-soft text-accent-foreground hover:bg-primary-soft">
            <Target className="size-3.5" />
            Target: {path.title}
          </Badge>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Your skill readiness</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Scored {correct} of {total} correct · analysis refreshed just now
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onChangePath}>
            Change path
          </Button>
          <Button variant="outline" onClick={onRetake}>
            <RotateCcw className="size-4" />
            Retake Assessment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Skill Readiness Score" value={`${readiness}%`} hint="vs 71% cohort average" icon={Gauge} />
        <KpiCard
          label="Gaps Identified"
          value={`${gapsCritical} critical`}
          hint={`${path.gaps.length} total skill gaps`}
          icon={TriangleAlert}
          tone="warning"
        />
        <KpiCard label="Match Index" value={`${matchIndex}%`} hint="Against open partner roles" icon={TrendingUp} tone="success" />
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">AI Skill Gap Analysis</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your verified strengths compared against what {path.title} postings actually require.
        </p>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-success/6 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-success">
              <BadgeCheck className="size-4" />
              Mastered Skills
            </h3>
            <div className="mt-4 space-y-4">
              {path.mastered.map((s) => (
                <div key={s.skill}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{s.skill}</span>
                    <span className="text-muted-foreground">{s.level}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-success" style={{ width: `${s.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-warning/8 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-warning">
              <TriangleAlert className="size-4" />
              Missing / Gap Skills
            </h3>
            <div className="mt-4 space-y-4">
              {path.gaps.map((s) => (
                <div key={s.skill}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {s.skill}
                      {s.severity === "critical" && (
                        <span className="ml-2 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                          critical
                        </span>
                      )}
                    </span>
                    <span className="text-muted-foreground">{s.level}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        s.severity === "critical" ? "bg-destructive" : "bg-warning",
                      )}
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Personalized Learning Roadmap</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {Object.values(done).filter(Boolean).length} of {path.roadmap.length} milestones complete ·{" "}
              {path.roadmap.reduce((a, r) => a + r.hours, 0)} hrs estimated
            </p>
          </div>
          <Badge variant="outline">Auto-generated from your gaps</Badge>
        </div>

        <ol className="mt-5 space-y-3">
          {path.roadmap.map((step, i) => {
            const isDone = !!done[i];
            return (
              <li key={step.title}>
                <button
                  type="button"
                  onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
                  className={cn(
                    "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors",
                    isDone ? "border-success/40 bg-success/6" : "border-border hover:bg-muted",
                  )}
                >
                  <span className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="size-5 text-success" />
                    ) : (
                      <CircleDashed className="size-5 text-muted-foreground" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-sm font-semibold", isDone && "line-through opacity-70")}>
                      {i + 1}. {step.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{step.detail}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    {step.hours} hrs
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">Recommended Internships</h2>
          <p className="mt-1 text-sm text-muted-foreground">Ranked by verified skill fit against your profile.</p>
          <div className="mt-5 space-y-3">
            {path.internships.map((job) => (
              <div
                key={job.company}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-border p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{job.role}</p>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                  <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {job.location}
                    </span>
                    <span>{job.stipend}</span>
                  </p>
                </div>
                <Badge className="bg-success/12 text-success hover:bg-success/12">{job.fit}% Fit</Badge>
                <ApplyDialog role={job.role} company={job.company} fit={job.fit} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">Recommended Mentors</h2>
          <p className="mt-1 text-sm text-muted-foreground">Industry practitioners on your target path.</p>
          <div className="mt-5 space-y-3">
            {path.mentors.map((m) => (
              <div key={m.name} className="flex items-center gap-3 rounded-xl border border-border p-4">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary-soft text-xs font-semibold text-accent-foreground">
                    {m.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.title} · {m.company}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-success">{m.fit}%</p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs"
                    onClick={() => toast.success(`Mentorship request sent to ${m.name}`)}
                  >
                    Request
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ApplyDialog({ role, company, fit }: { role: string; company: string; fit: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Apply</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply to {role}</DialogTitle>
          <DialogDescription>
            {company} · your verified skill profile matches this role at {fit}%.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 rounded-xl border border-border bg-muted p-4 text-sm">
          <p className="font-medium">What gets shared</p>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>Verified assessment score and skill map</li>
            <li>Mentor-reviewed capstone projects</li>
            <li>Learning roadmap progress</li>
          </ul>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => toast.success(`Application sent to ${company}`)}>
              Confirm application
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
