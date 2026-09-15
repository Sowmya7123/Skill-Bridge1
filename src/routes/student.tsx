import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
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
  Sparkles,
  BookOpen,
  PlayCircle,
  Code2,
  UserCheck,
  Trophy,
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
import {
  CAREER_PATHS,
  getPath,
  getCustomJobs,
  type CareerPathId,
  type LiveJob,
} from "@/lib/skillbridge-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Skill Journey — SkillBridge" },
      {
        name: "description",
        content:
          "Pick a career path, take an AI skill assessment and get a personalized roadmap to placement.",
      },
      { property: "og:title", content: "Student Skill Journey — SkillBridge" },
      {
        property: "og:description",
        content:
          "AI skill gap analysis, learning roadmap and matched internships for students.",
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
            onNext={() =>
              setQIndex((i) => Math.min(path.questions.length - 1, i + 1))
            }
            onSubmit={submit}
            onBack={() => setStage("path")}
          />
        )}

        {stage === "analyzing" && <Analyzing />}

        {stage === "dashboard" && path && (
          <StudentDashboard
            path={path}
            correct={correct}
            onRetake={startQuiz}
            onChangePath={() => setStage("path")}
          />
        )}
      </main>
    </div>
  );
}

function StepHeader({
  step,
  title,
  sub,
}: {
  step: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="mb-7">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        {step}
      </p>
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
                active
                  ? "border-primary ring-2 ring-primary/25"
                  : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">{p.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.blurb}
                  </p>
                </div>
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border",
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
        {!selected && (
          <p className="text-sm text-muted-foreground">
            Select a path to continue.
          </p>
        )}
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
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border",
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
      <h2 className="mt-6 text-xl font-semibold">
        Running Sentence-Transformers & Skill Gap Mapping…
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Embedding your responses, comparing them against live industry benchmarks
        and generating your personalized study plan.
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
  const [selectedModule, setSelectedModule] = useState<(typeof studyPlan)[0] | null>(null);

  const [customJobs, setCustomJobs] = useState<LiveJob[]>([]);

  useEffect(() => {
    const updateJobs = () => setCustomJobs(getCustomJobs());
    updateJobs();
    window.addEventListener("storage_job_update", updateJobs);
    window.addEventListener("storage", updateJobs);
    window.addEventListener("focus", updateJobs);
    return () => {
      window.removeEventListener("storage_job_update", updateJobs);
      window.removeEventListener("storage", updateJobs);
      window.removeEventListener("focus", updateJobs);
    };
  }, []);

  const allInternships = [...customJobs, ...path.internships];

  // Dynamic Personalized Study Plan generated from assessment gaps with Prototype details
  const studyPlan = useMemo(() => {
    const gapSkills = path.gaps.map((g) => g.skill);
    return [
      {
        week: "Week 1",
        focus: gapSkills[0] || path.badges[0] || "Core Fundamentals",
        hours: "10 hrs",
        videoTitle: `Mastering ${gapSkills[0] || "Core Fundamentals"} from Scratch`,
        project: {
          title: "Mini-Project: Syntax & Basics",
          desc: `Write foundational code implementing ${gapSkills[0] || "core concepts"}.`,
        },
        mentor: { name: "Ananya Rao", initials: "AR" },
      },
      {
        week: "Week 2",
        focus: gapSkills[1] || path.badges[1] || "System Integration",
        hours: "14 hrs",
        videoTitle: `Advanced ${gapSkills[1] || "System Integration"} & APIs`,
        project: {
          title: "Integration Assignment",
          desc: "Connect your basic logic to a live API or Database.",
        },
        mentor: { name: "Dev Menon", initials: "DM" },
      },
      {
        week: "Week 3",
        focus: gapSkills[2] || "Performance & Testing",
        hours: "12 hrs",
        videoTitle: "Debugging & Writing Tests",
        project: {
          title: "Code Review & Optimization",
          desc: "Optimize the existing codebase and achieve 80% test coverage.",
        },
        mentor: { name: "Priya Nair", initials: "PN" },
      },
      {
        week: "Week 4",
        focus: `${path.title} Capstone`,
        hours: "20 hrs",
        videoTitle: "Deploying Production-Ready Apps",
        project: {
          title: "Industry Capstone Project",
          desc: "Build an end-to-end application and submit it for recruiter matching.",
        },
        mentor: { name: "Rahul Bose", initials: "RB" },
      },
    ];
  }, [path]);

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge className="bg-primary-soft text-accent-foreground hover:bg-primary-soft">
            <Target className="size-3.5" />
            Target: {path.title}
          </Badge>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
            Your Skill Readiness
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Scored {correct} of {total} correct · Analysis refreshed just now
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onChangePath}>
            Change Path
          </Button>
          <Button variant="outline" onClick={onRetake}>
            <RotateCcw className="size-4" />
            Retake Assessment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Skill Readiness Score"
          value={`${readiness}%`}
          hint="vs 71% cohort average"
          icon={Gauge}
        />
        <KpiCard
          label="Gaps Identified"
          value={`${gapsCritical} critical`}
          hint={`${path.gaps.length} total skill gaps`}
          icon={TriangleAlert}
          tone="warning"
        />
        <KpiCard
          label="Match Index"
          value={`${matchIndex}%`}
          hint="Against open partner roles"
          icon={TrendingUp}
          tone="success"
        />
      </div>

      {/* AI Skill Gap Analysis */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">AI Skill Gap Analysis</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your verified strengths compared against what {path.title} postings
          require.
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
                    <div
                      className="h-full rounded-full bg-success"
                      style={{ width: `${s.level}%` }}
                    />
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
                        s.severity === "critical"
                          ? "bg-destructive"
                          : "bg-warning",
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

      {/* Structured 4-Week Study Plan with Prototype Modals */}
      {/* Interactive Learning Hub with State-based Modal */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              Interactive Learning Hub
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Click on any module below to start learning, work on your project, and get mentor verified.
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            <Sparkles className="mr-1 size-3" />
            AI Tailored
          </Badge>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {studyPlan.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedModule(s)}
              className="group flex flex-col text-left rounded-xl border border-border bg-background/50 p-4 transition-all hover:border-primary/50 hover:bg-primary-soft/20 hover:shadow-sm"
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {s.week}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  {s.hours}
                </span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-foreground">{s.focus}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                Learn concepts through interactive sessions, complete hands-on assignments, and get reviewed by {s.mentor.name}.
              </p>
              <div className="mt-4 flex items-center text-xs font-semibold text-primary opacity-80 group-hover:opacity-100">
                Start Learning <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Global Learning Modal */}
      <Dialog open={!!selectedModule} onOpenChange={(open) => !open && setSelectedModule(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedModule && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {selectedModule.week}: {selectedModule.focus}
                </DialogTitle>
                <DialogDescription>
                  Complete your learning modules, submit your hands-on project, and get mentor-verified to level up.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Step 1: Learn */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <PlayCircle className="size-4 text-primary" /> 
                    Step 1: Learn the Concepts
                  </h4>
                  <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted">
                    <PlayCircle className="mb-2 size-10 opacity-60 text-primary" />
                    <p className="text-sm font-medium text-foreground">Interactive Lecture: {selectedModule.videoTitle}</p>
                    <p className="text-xs text-muted-foreground">Duration: 45 mins · Interactive Sandboxes included</p>
                  </div>
                </div>

                {/* Step 2: Build Project */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <Code2 className="size-4 text-primary" /> 
                    Step 2: Hands-on Project Assignment
                  </h4>
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <p className="text-sm font-semibold text-foreground">{selectedModule.project.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedModule.project.desc}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => toast.info("Cloud Workspace spinning up...")}
                    >
                      <Code2 className="mr-2 size-3.5" />
                      Open Cloud IDE
                    </Button>
                  </div>
                </div>

                {/* Step 3: Mentor Assigned */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <UserCheck className="size-4 text-primary" /> 
                    Step 3: Mentor Verification
                  </h4>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-primary-soft text-primary font-semibold">
                        {selectedModule.mentor.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Assigned Mentor: {selectedModule.mentor.name}</p>
                      <p className="text-xs text-muted-foreground">Will review your code repository and approve your skill profile update.</p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="sm:justify-between gap-2">
                <Button variant="ghost" onClick={() => setSelectedModule(null)}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    toast.success(`Skill Verified! +20 points added to your ${selectedModule.focus} profile.`);
                    setSelectedModule(null);
                  }}
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <Trophy className="mr-2 size-4" />
                  Complete & Update Profile
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Internships & Mentors */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recommended Internships</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ranked by verified skill fit against your profile.
              </p>
            </div>
            {customJobs.length > 0 && (
              <Badge className="bg-primary-soft text-primary">
                <Sparkles className="mr-1 size-3" />
                {customJobs.length} Live Recruiter Post{customJobs.length > 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {allInternships.map((job, idx) => (
              <div
                key={`${job.company}-${idx}`}
                className={cn(
                  "flex flex-wrap items-center gap-4 rounded-xl border p-4 transition-all",
                  (job as any).isCustom
                    ? "border-primary/50 bg-primary-soft/20 shadow-sm"
                    : "border-border",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{job.role}</p>
                    {(job as any).isCustom && (
                      <Badge variant="outline" className="border-primary text-primary text-[10px] py-0 px-1.5">
                        New Post
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                  <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {job.location}
                    </span>
                    <span>{job.stipend}</span>
                  </p>
                </div>
                <Badge className="bg-success/12 text-success hover:bg-success/12">
                  {job.fit}% Fit
                </Badge>
                <ApplyDialog
                  role={job.role}
                  company={job.company}
                  fit={job.fit}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">Recommended Mentors</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Industry practitioners on your target path.
          </p>
          <div className="mt-5 space-y-3">
            {path.mentors.map((m) => (
              <div
                key={m.name}
                className="flex items-center gap-3 rounded-xl border border-border p-4"
              >
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary-soft text-xs font-semibold text-accent-foreground">
                    {m.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
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
                    onClick={() =>
                      toast.success(`Mentorship request sent to ${m.name}`)
                    }
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

function ApplyDialog({
  role,
  company,
  fit,
}: {
  role: string;
  company: string;
  fit: number;
}) {
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
            <Button
              onClick={() => toast.success(`Application sent to ${company}`)}
            >
              Confirm application
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}