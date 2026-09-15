import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type RoleId = "student" | "recruiter" | "academician" | "mentor";

export const ROLE_LABELS: Record<RoleId, string> = {
  student: "Student",
  recruiter: "Recruiter",
  academician: "Academician",
  mentor: "Mentor",
};

export type Session = {
  email: string;
  role: RoleId;
  org: string;
};

export type PostedJob = {
  id: string;
  role: string;
  company: string;
  location: string;
  stipend: string;
  fit: number;
  tags: string[];
  openings: number;
  postedAt: string;
};

type AppState = {
  session: Session | null;
  email: string | null;
  signIn: (email: string) => void;
  completeRegistration: (role: RoleId, org: string) => void;
  switchRole: (role: RoleId) => void;
  signOut: () => void;
  jobs: PostedJob[];
  addJob: (job: Omit<PostedJob, "id" | "postedAt">) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [jobs, setJobs] = useState<PostedJob[]>([]);

  const value = useMemo<AppState>(
    () => ({
      session,
      email,
      signIn: (e) => setEmail(e),
      completeRegistration: (role, org) => {
        setSession({ email: email ?? "demo@skillbridge.io", role, org });
      },
      switchRole: (role) =>
        setSession((s) => (s ? { ...s, role } : { email: email ?? "demo@skillbridge.io", role, org: "" })),
      signOut: () => {
        setSession(null);
        setEmail(null);
      },
      addJob: (job) =>
        setJobs((prev) => [
          { ...job, id: `job-${Date.now()}`, postedAt: "Just now" },
          ...prev,
        ]),
      jobs,
    }),
    [session, email, jobs],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
