import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Briefcase, BadgeCheck, Bookmark, CheckCircle2, Plus, Search, Users } from "lucide-react";
import { PageShell, KpiCard } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { CANDIDATES, SKILL_TAGS, addCustomJob } from "@/lib/skillbridge-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recruiter")({
  head: () => ({
    meta: [
      { title: "Recruiter Dashboard — SkillBridge" },
      {
        name: "description",
        content: "Track your hiring pipeline and shortlist verified student talent by AI match score.",
      },
      { property: "og:title", content: "Recruiter Dashboard — SkillBridge" },
      { property: "og:description", content: "Verified candidate pool, AI match scores and role posting in one place." },
    ],
  }),
  component: RecruiterDashboard,
});

function RecruiterDashboard() {
  const [query, setQuery] = useState("");
  const [pathFilter, setPathFilter] = useState("all");
  const [dbCandidates, setDbCandidates] = useState<any[]>([]);

  // Database nunchi real students data automatic ga fetch chesi CANDIDATES lo sync chese logic
  useEffect(() => {
    async function fetchStudentCandidates() {
      const { data, error } = await supabase
        .from("student_assessments")
        .select("*");

      if (!error && data && data.length > 0) {
        const formattedStudents = data.map((item, idx) => ({
          name: item.student_email ? item.student_email.split("@")[0] : `Student ${idx + 1}`,
          initials: item.student_email ? item.student_email.charAt(0).toUpperCase() : "S",
          college: "Verified Institution",
          path: item.role_id || "Full Stack Developer",
          score: item.total_score || 75,
          match: Math.min(99, (item.total_score || 70) + 10),
          status: (item.total_score || 0) >= 75 ? "Shortlisted" : "Verified",
          email: item.student_email,
        }));
        setDbCandidates(formattedStudents);
      }
    }
    fetchStudentCandidates();
  }, []);

  // Original static candidates + Database nunchi vachina real students ni combine cheyyadam
  const allCandidates = useMemo(() => {
    return [...dbCandidates, ...CANDIDATES];
  }, [dbCandidates]);

  const rows = useMemo(
    () =>
      allCandidates.filter(
        (c) =>
          (pathFilter === "all" || c.path === pathFilter) &&
          (c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.college.toLowerCase().includes(query.toLowerCase()) ||
            (c.email && c.email.toLowerCase().includes(query.toLowerCase()))),
      ),
    [allCandidates, query, pathFilter],
  );

  return (
    <PageShell
      title="Recruiter Dashboard"
      subtitle="Hire verified talent with skill scores backed by assessments and reviewed projects."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Active Openings" value="12" hint="3 closing this week" icon={Briefcase} />
        <KpiCard label="Verified Candidates" value={String(rows.length + 240)} hint="+34 this month" icon={BadgeCheck} tone="info" />
        <KpiCard label="Shortlisted" value="36" hint="18 awaiting interview" icon={Bookmark} tone="warning" />
        <KpiCard label="Placed" value="9" hint="Offer acceptance 82%" icon={CheckCircle2} tone="success" />
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card shadow-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-5">
          <div>
            <h2 className="text-lg font-semibold">Candidate Talent Pool</h2>
            <p className="text-sm text-muted-foreground">{rows.length} candidates match your filters</p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email or college"
                className="w-56 pl-9"
              />
            </div>
            <Select value={pathFilter} onValueChange={setPathFilter}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="All paths" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All career paths</SelectItem>
                <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                <SelectItem value="AI / ML Engineer">AI / ML Engineer</SelectItem>
                <SelectItem value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</SelectItem>
                <SelectItem value="Data Analyst">Data Analyst</SelectItem>
              </SelectContent>
            </Select>
            <PostOpeningDialog />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Target path</TableHead>
              <TableHead>Verified skill score</TableHead>
              <TableHead>AI match</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Portfolio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((c, i) => (
              <TableRow key={c.name + i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary-soft text-xs font-semibold text-accent-foreground">
                        {c.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.college} {c.email ? `• ${c.email}` : ""}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.path}</TableCell>
                <TableCell>
                  <div className="flex w-36 items-center gap-2">
                    <Progress value={c.score} className="h-1.5" />
                    <span className="text-sm font-medium">{c.score}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-success">{c.match}%</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      c.status === "Placed" && "border-success/40 text-success",
                      c.status === "Shortlisted" && "border-primary/40 text-primary",
                    )}
                  >
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <PortfolioSheet candidate={c} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </PageShell>
  );
}

function PortfolioSheet({ candidate }: { candidate: any }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          View Verified Portfolio
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{candidate.name}</SheetTitle>
          <SheetDescription>
            {candidate.path} · {candidate.college} {candidate.email ? `(${candidate.email})` : ""}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 px-4 pb-8">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">Verified score</p>
              <p className="mt-1 text-2xl font-bold">{candidate.score}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">AI match</p>
              <p className="mt-1 text-2xl font-bold text-success">{candidate.match}%</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Verified skills</h3>
            <div className="mt-3 space-y-3">
              {[
                { s: "Core fundamentals", v: candidate.score },
                { s: "Applied project work", v: Math.max(40, candidate.score - 9) },
                { s: "Collaboration & reviews", v: Math.min(98, candidate.score + 6) },
              ].map((r) => (
                <div key={r.s}>
                  <div className="flex justify-between text-sm">
                    <span>{r.s}</span>
                    <span className="text-muted-foreground">{r.v}%</span>
                  </div>
                  <Progress value={r.v} className="mt-1.5 h-1.5" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Mentor-reviewed projects</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="rounded-lg border border-border p-3">Capstone deployed with CI pipeline · 4.6/5</li>
              <li className="rounded-lg border border-border p-3">Open-source contribution merged · 4.2/5</li>
            </ul>
          </div>

          <Button className="w-full" onClick={() => toast.success(`${candidate.name} shortlisted`)}>
            Shortlist candidate
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PostOpeningDialog() {
  const [tags, setTags] = useState<string[]>(["React"]);
  const [title, setTitle] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Post New Opening
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Post a new opening</DialogTitle>
          <DialogDescription>
            Candidates are auto-matched by verified skill score against the tags you select.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role-title">Role title</Label>
            <Input
              id="role-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full Stack Engineering Intern"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="openings">Openings</Label>
              <Input id="openings" type="number" defaultValue={2} min={1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loc">Location</Label>
              <Input id="loc" defaultValue="Bengaluru · Hybrid" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>
              Required skills <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {SKILL_TAGS.map((t) => {
                const on = tags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTags((p) => (on ? p.filter((x) => x !== t) : [...p, t]))}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      on
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            {tags.length === 0 && <p className="text-xs text-destructive">Select at least one skill.</p>}
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <Users className="size-4 shrink-0 text-primary" />
            Estimated {18 + tags.length * 7} verified candidates match this profile today.
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel-out</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={tags.length === 0}
              onClick={() => {
                const roleTitle = title.trim() || "Full Stack Engineering Intern";
                addCustomJob({
                  role: roleTitle,
                  company: "Acme Tech (Recruiter Post)",
                  location: "Bengaluru · Hybrid",
                  stipend: "₹35,000/mo",
                });
                toast.success(`Opening published & synced: ${roleTitle}`);
                setTitle("");
              }}
            >
              Publish opening
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}