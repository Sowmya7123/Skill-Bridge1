import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Blocks, GraduationCap, Briefcase, School, Compass, ChevronDown, LogOut, Repeat } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppState, ROLE_LABELS, type RoleId } from "@/lib/app-state";
import { cn } from "@/lib/utils";

const ROLES = [
  { to: "/student", id: "student", label: "Student", icon: GraduationCap },
  { to: "/recruiter", id: "recruiter", label: "Recruiter", icon: Briefcase },
  { to: "/academician", id: "academician", label: "Academician", icon: School },
  { to: "/mentor", id: "mentor", label: "Mentor", icon: Compass },
] as const;

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { session, switchRole, signOut } = useAppState();

  const initials = (session?.email ?? "SB").slice(0, 2).toUpperCase();

  function goToRole(role: RoleId) {
    switchRole(role);
    navigate({ to: `/${role}` });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Blocks className="size-5" />
          </span>
          <span className="font-display text-[17px] font-bold tracking-tight">SkillBridge</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 rounded-full bg-muted p-1 md:flex">
          {ROLES.map((r) => {
            const active = pathname.startsWith(r.to);
            return (
              <button
                key={r.to}
                type="button"
                onClick={() => goToRole(r.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <r.icon className="size-4" />
                {r.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto gap-2 px-2 py-1.5">
                <Avatar className="size-9 border border-border">
                  <AvatarFallback className="bg-primary-soft text-sm font-semibold text-accent-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-left sm:block">
                  <span className="block max-w-[180px] truncate text-sm font-medium leading-tight">
                    {session?.email ?? "Guest"}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5">
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-semibold">
                      {session ? ROLE_LABELS[session.role] : "Not registered"}
                    </Badge>
                  </span>
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <p className="truncate text-sm">{session?.email ?? "Guest"}</p>
                {session?.org ? (
                  <p className="truncate text-xs font-normal text-muted-foreground">{session.org}</p>
                ) : null}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Repeat className="size-3.5" />
                  Switch role
                </span>
              </DropdownMenuLabel>
              {ROLES.map((r) => (
                <DropdownMenuItem key={r.id} onSelect={() => goToRole(r.id)}>
                  <r.icon className="size-4" />
                  {r.label}
                  {session?.role === r.id && <span className="ml-auto text-xs text-primary">current</span>}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  signOut();
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="size-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
        {ROLES.map((r) => {
          const active = pathname.startsWith(r.to);
          return (
            <button
              key={r.to}
              type="button"
              onClick={() => goToRole(r.id)}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium",
                active ? "bg-primary-soft text-accent-foreground" : "text-muted-foreground",
              )}
            >
              {r.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-7">
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </main>
    </div>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "primary" | "success" | "warning" | "info";
}) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success/12 text-success",
    warning: "bg-warning/15 text-warning",
    info: "bg-info/12 text-info",
  } as const;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <span className={cn("flex size-10 items-center justify-center rounded-lg", tones[tone])}>
          <Icon className="size-5" />
        </span>
      </div>
    </div>
  );
}
