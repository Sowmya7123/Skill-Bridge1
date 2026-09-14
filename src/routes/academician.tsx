import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpenCheck, GraduationCap, Gauge, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";
import { PageShell, KpiCard } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { COMMON_GAPS, CURRICULUM_RECOMMENDATIONS } from "@/lib/skillbridge-data";

export const Route = createFileRoute("/academician")({
  head: () => ({
    meta: [
      { title: "Academician Dashboard — SkillBridge" },
      {
        name: "description",
        content: "Track cohort readiness, spot common skill gaps and align curriculum with hiring trends.",
      },
      { property: "og:title", content: "Academician Dashboard — SkillBridge" },
      { property: "og:description", content: "Cohort analytics and AI curriculum alignment recommendations." },
    ],
  }),
  component: AcademicianDashboard,
});

function AcademicianDashboard() {
  const [approved, setApproved] = useState<Record<number, boolean>>({});

  return (
    <PageShell
      title="Academician Dashboard"
      subtitle="Cohort readiness analytics and curriculum alignment against live hiring demand."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Cohort Readiness" value="71%" hint="Batch of 2027 · 184 students" icon={Gauge} />
        <KpiCard label="Placement Ready" value="96" hint="52% of the cohort" icon={GraduationCap} tone="success" />
        <KpiCard label="Top Gap" value="Cloud" hint="64% of students affected" icon={TrendingUp} tone="warning" />
        <KpiCard label="Curriculum Fit" value="78%" hint="vs partner role requirements" icon={BookOpenCheck} tone="info" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">Most Common Skill Gaps</h2>
          <p className="mt-1 text-sm text-muted-foreground">Share of the cohort below the industry benchmark.</p>
          <div className="mt-5 space-y-4">
            {COMMON_GAPS.map((g) => (
              <div key={g.skill}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{g.skill}</span>
                  <span className="text-muted-foreground">{g.pct}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${g.pct > 50 ? "bg-destructive" : "bg-warning"}`}
                    style={{ width: `${g.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-muted p-4">
            <p className="text-sm font-medium">Semester readiness trend</p>
            <div className="mt-4 flex items-end gap-2">
              {[52, 58, 61, 66, 71].map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-md bg-primary/80" style={{ height: `${v}px` }} />
                  <span className="text-[11px] text-muted-foreground">S{i + 3}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Curriculum Alignment</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                AI recommendations based on this quarter's hiring signals.
              </p>
            </div>
            <Badge variant="outline" className="text-primary">
              <Sparkles className="size-3.5" />
              AI generated
            </Badge>
          </div>

          <div className="mt-5 space-y-4">
            {CURRICULUM_RECOMMENDATIONS.map((rec, i) => (
              <div key={rec.change} className="rounded-xl border border-border p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{rec.semester}</Badge>
                  <Badge className="bg-success/12 text-success hover:bg-success/12">{rec.impact}</Badge>
                </div>
                <p className="mt-3 text-sm font-semibold">{rec.change}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{rec.reason}</p>
                <div className="mt-4">
                  {approved[i] ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-success">
                      <CheckCircle2 className="size-4" />
                      Update approved & sent to the board
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        setApproved((a) => ({ ...a, [i]: true }));
                        toast.success(`${rec.semester} curriculum update approved`);
                      }}
                    >
                      Approve Curriculum Update
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-muted p-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Projected readiness after approvals</span>
              <span className="text-muted-foreground">
                {71 + Object.values(approved).filter(Boolean).length * 9}%
              </span>
            </div>
            <Progress
              value={71 + Object.values(approved).filter(Boolean).length * 9}
              className="mt-2 h-1.5"
            />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
