import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Star, Code2, Users, Inbox, MessageSquare } from "lucide-react";
import { PageShell, KpiCard } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { MENTORSHIP_REQUESTS, PROJECT_SUBMISSIONS } from "@/lib/skillbridge-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mentor")({
  head: () => ({
    meta: [
      { title: "Mentor Dashboard — SkillBridge" },
      {
        name: "description",
        content: "Accept mentorship requests and review student capstone projects with feedback ratings.",
      },
      { property: "og:title", content: "Mentor Dashboard — SkillBridge" },
      { property: "og:description", content: "Mentorship queue and capstone project reviews for industry mentors." },
    ],
  }),
  component: MentorDashboard,
});

function MentorDashboard() {
  const [decided, setDecided] = useState<Record<string, "accepted" | "declined">>({});
  const [reviewed, setReviewed] = useState<Record<string, number>>({});

  const pending = MENTORSHIP_REQUESTS.filter((r) => !decided[r.name]).length;

  return (
    <PageShell
      title="Mentor Dashboard"
      subtitle="Guide students on their target path and review the projects that prove their skills."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Pending Requests" value={String(pending)} hint="Respond within 48 hrs" icon={Inbox} tone="warning" />
        <KpiCard label="Active Mentees" value="8" hint="Across 3 career paths" icon={Users} />
        <KpiCard
          label="Reviews Awaiting"
          value={String(PROJECT_SUBMISSIONS.length - Object.keys(reviewed).length)}
          hint="Capstone submissions"
          icon={Code2}
          tone="info"
        />
        <KpiCard label="Avg. Rating Given" value="4.4" hint="Across 27 reviews" icon={Star} tone="success" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">Mentorship Requests</h2>
          <p className="mt-1 text-sm text-muted-foreground">Students asking for guidance on their roadmap.</p>
          <div className="mt-5 space-y-3">
            {MENTORSHIP_REQUESTS.map((r) => {
              const state = decided[r.name];
              return (
                <div key={r.name} className="rounded-xl border border-border p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-primary-soft text-xs font-semibold text-accent-foreground">
                        {r.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">{r.name}</p>
                        <Badge variant="secondary">{r.goal}</Badge>
                        <span className="text-xs text-muted-foreground">{r.when}</span>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground">{r.note}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {state ? (
                      <span
                        className={cn(
                          "text-sm font-medium",
                          state === "accepted" ? "text-success" : "text-muted-foreground",
                        )}
                      >
                        {state === "accepted" ? "Accepted — intro call scheduled" : "Declined"}
                      </span>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          onClick={() => {
                            setDecided((d) => ({ ...d, [r.name]: "accepted" }));
                            toast.success(`You are now mentoring ${r.name}`);
                          }}
                        >
                          <Check className="size-4" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDecided((d) => ({ ...d, [r.name]: "declined" }))}
                        >
                          <X className="size-4" />
                          Decline
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold">Project Submissions</h2>
          <p className="mt-1 text-sm text-muted-foreground">Capstone projects awaiting code review and rating.</p>
          <div className="mt-5 space-y-3">
            {PROJECT_SUBMISSIONS.map((p) => (
              <div key={p.title} className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.student} · {p.submitted} · {p.lines.toLocaleString()} lines
                    </p>
                  </div>
                  {reviewed[p.title] ? (
                    <Badge className="bg-success/12 text-success hover:bg-success/12">
                      Reviewed · {reviewed[p.title]}/5
                    </Badge>
                  ) : (
                    <Badge variant="outline">Awaiting review</Badge>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4">
                  <ReviewDialog
                    title={p.title}
                    student={p.student}
                    onSubmit={(rating) => setReviewed((r) => ({ ...r, [p.title]: rating }))}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function ReviewDialog({
  title,
  student,
  onSubmit,
}: {
  title: string;
  student: string;
  onSubmit: (rating: number) => void;
}) {
  const [rating, setRating] = useState(4);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <MessageSquare className="size-4" />
          Review & rate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review: {title}</DialogTitle>
          <DialogDescription>Submitted by {student}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Rating</p>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
                  <Star
                    className={cn(
                      "size-6",
                      n <= rating ? "fill-warning text-warning" : "text-muted-foreground",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Feedback</p>
            <Textarea className="mt-2" rows={4} placeholder="Code structure, testing, deployment readiness…" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                onSubmit(rating);
                toast.success(`Feedback sent to ${student}`);
              }}
            >
              Submit review
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
