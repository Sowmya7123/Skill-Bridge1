export type CareerPathId = "fullstack" | "aiml" | "cloud" | "data";

export type QuizQuestion = {
  id: string;
  topic: string;
  question: string;
  options: string[];
  answer: number;
};

export type CareerPath = {
  id: CareerPathId;
  title: string;
  blurb: string;
  badges: string[];
  questions: QuizQuestion[];
  mastered: { skill: string; level: number }[];
  gaps: { skill: string; level: number; severity: "critical" | "moderate" }[];
  roadmap: { title: string; detail: string; hours: number }[];
  internships: { company: string; role: string; location: string; stipend: string; fit: number }[];
  mentors: { name: string; title: string; company: string; fit: number }[];
};

export const CAREER_PATHS: CareerPath[] = [
  {
    id: "fullstack",
    title: "Full Stack Developer",
    blurb: "Build and ship end-to-end product features.",
    badges: ["React", "Node.js", "SQL"],
    questions: [
      {
        id: "fs1",
        topic: "React Hooks",
        question: "Which hook should you use to run a side effect after a component renders?",
        options: ["useMemo", "useEffect", "useCallback", "useRef"],
        answer: 1,
      },
      {
        id: "fs2",
        topic: "REST APIs",
        question: "A request succeeds and creates a new resource. Which status code fits best?",
        options: ["200 OK", "201 Created", "204 No Content", "302 Found"],
        answer: 1,
      },
      {
        id: "fs3",
        topic: "SQL",
        question: "Which clause filters rows after an aggregation with GROUP BY?",
        options: ["WHERE", "HAVING", "ORDER BY", "LIMIT"],
        answer: 1,
      },
    ],
    mastered: [
      { skill: "React Basics", level: 82 },
      { skill: "JavaScript", level: 78 },
      { skill: "HTML / CSS", level: 90 },
    ],
    gaps: [
      { skill: "FastAPI", level: 24, severity: "critical" },
      { skill: "Docker", level: 31, severity: "critical" },
      { skill: "Advanced SQL", level: 46, severity: "moderate" },
    ],
    roadmap: [
      { title: "Deep dive: React state & effects", detail: "Hooks, context, data fetching patterns", hours: 12 },
      { title: "Build a REST API with FastAPI", detail: "Routing, validation, auth middleware", hours: 18 },
      { title: "Containerise with Docker", detail: "Images, compose, multi-stage builds", hours: 10 },
      { title: "Advanced SQL & indexing", detail: "Joins, window functions, query plans", hours: 14 },
      { title: "Capstone: full stack job board", detail: "Ship with CI and a live database", hours: 26 },
    ],
    internships: [
      { company: "Northwind Labs", role: "Full Stack Intern", location: "Bengaluru · Hybrid", stipend: "₹35,000/mo", fit: 92 },
      { company: "Volt Systems", role: "Frontend Engineer Intern", location: "Remote", stipend: "₹28,000/mo", fit: 87 },
      { company: "Kestrel Tech", role: "Product Engineering Intern", location: "Pune · Onsite", stipend: "₹30,000/mo", fit: 79 },
    ],
    mentors: [
      { name: "Ananya Rao", title: "Staff Engineer", company: "Northwind Labs", fit: 94 },
      { name: "Dev Menon", title: "Engineering Manager", company: "Volt Systems", fit: 88 },
    ],
  },
  {
    id: "aiml",
    title: "AI / ML Engineer",
    blurb: "Train, evaluate and deploy machine learning models.",
    badges: ["Python", "Scikit-learn", "Transformers"],
    questions: [
      {
        id: "ai1",
        topic: "Model Evaluation",
        question: "Your model scores 99% on training and 62% on test data. What is happening?",
        options: ["Underfitting", "Overfitting", "Data leakage fixed", "Class balance"],
        answer: 1,
      },
      {
        id: "ai2",
        topic: "Scikit-learn",
        question: "Which method fits a transformer and returns the transformed data in one call?",
        options: ["fit()", "transform()", "fit_transform()", "predict()"],
        answer: 2,
      },
      {
        id: "ai3",
        topic: "Transformers",
        question: "What does the attention mechanism primarily compute?",
        options: [
          "Pixel gradients",
          "Weighted relevance between tokens",
          "Learning rate decay",
          "Dropout masks",
        ],
        answer: 1,
      },
    ],
    mastered: [
      { skill: "Python", level: 85 },
      { skill: "Pandas / NumPy", level: 76 },
      { skill: "Classical ML", level: 71 },
    ],
    gaps: [
      { skill: "Transformers Fine-tuning", level: 28, severity: "critical" },
      { skill: "MLOps & Deployment", level: 22, severity: "critical" },
      { skill: "Experiment Tracking", level: 44, severity: "moderate" },
    ],
    roadmap: [
      { title: "Feature engineering foundations", detail: "Pipelines, scaling, leakage control", hours: 10 },
      { title: "Fine-tune a transformer", detail: "Hugging Face trainer, LoRA basics", hours: 20 },
      { title: "Experiment tracking", detail: "MLflow runs, metrics, model registry", hours: 8 },
      { title: "Serve a model in production", detail: "FastAPI inference + Docker", hours: 16 },
      { title: "Capstone: resume-to-role matcher", detail: "Embeddings and semantic search", hours: 24 },
    ],
    internships: [
      { company: "Cortexa AI", role: "ML Engineering Intern", location: "Hyderabad · Hybrid", stipend: "₹45,000/mo", fit: 90 },
      { company: "Lumen Health", role: "Applied Research Intern", location: "Remote", stipend: "₹38,000/mo", fit: 84 },
      { company: "Atlas Retail", role: "Data Science Intern", location: "Mumbai · Onsite", stipend: "₹32,000/mo", fit: 77 },
    ],
    mentors: [
      { name: "Priya Nair", title: "Senior ML Scientist", company: "Cortexa AI", fit: 93 },
      { name: "Rahul Bose", title: "MLOps Lead", company: "Lumen Health", fit: 86 },
    ],
  },
  {
    id: "cloud",
    title: "Cloud / DevOps Engineer",
    blurb: "Automate delivery and run reliable infrastructure.",
    badges: ["Docker", "CI/CD", "AWS"],
    questions: [
      {
        id: "cl1",
        topic: "Containers",
        question: "Which Dockerfile instruction defines the default process for the container?",
        options: ["RUN", "CMD", "COPY", "EXPOSE"],
        answer: 1,
      },
      {
        id: "cl2",
        topic: "CI/CD",
        question: "What is the main purpose of a build artifact in a pipeline?",
        options: [
          "Store secrets",
          "Pass a versioned output to later stages",
          "Lint the source",
          "Scale the cluster",
        ],
        answer: 1,
      },
      {
        id: "cl3",
        topic: "AWS",
        question: "Which AWS service provides object storage?",
        options: ["EC2", "S3", "RDS", "Route 53"],
        answer: 1,
      },
    ],
    mastered: [
      { skill: "Linux & Shell", level: 80 },
      { skill: "Git Workflows", level: 84 },
      { skill: "Networking Basics", level: 68 },
    ],
    gaps: [
      { skill: "Kubernetes", level: 21, severity: "critical" },
      { skill: "Terraform (IaC)", level: 27, severity: "critical" },
      { skill: "Observability", level: 48, severity: "moderate" },
    ],
    roadmap: [
      { title: "Docker fundamentals", detail: "Images, volumes, compose", hours: 10 },
      { title: "Pipeline automation", detail: "GitHub Actions build, test, deploy", hours: 12 },
      { title: "Infrastructure as code", detail: "Terraform modules and state", hours: 16 },
      { title: "Kubernetes essentials", detail: "Pods, services, deployments", hours: 20 },
      { title: "Capstone: zero-downtime deploy", detail: "Blue-green release on AWS", hours: 22 },
    ],
    internships: [
      { company: "Stratus Cloud", role: "DevOps Intern", location: "Bengaluru · Hybrid", stipend: "₹40,000/mo", fit: 89 },
      { company: "Northwind Labs", role: "Platform Engineering Intern", location: "Remote", stipend: "₹34,000/mo", fit: 83 },
      { company: "Orbit Payments", role: "SRE Intern", location: "Chennai · Onsite", stipend: "₹36,000/mo", fit: 76 },
    ],
    mentors: [
      { name: "Imran Sheikh", title: "Principal SRE", company: "Stratus Cloud", fit: 91 },
      { name: "Neha Kulkarni", title: "Platform Lead", company: "Orbit Payments", fit: 85 },
    ],
  },
  {
    id: "data",
    title: "Data Analyst",
    blurb: "Turn raw data into decisions leaders can act on.",
    badges: ["Python", "PowerBI", "SQL"],
    questions: [
      {
        id: "da1",
        topic: "SQL",
        question: "Which join keeps all rows from the left table regardless of matches?",
        options: ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "SELF JOIN"],
        answer: 1,
      },
      {
        id: "da2",
        topic: "Statistics",
        question: "Which measure is least affected by extreme outliers?",
        options: ["Mean", "Median", "Range", "Standard deviation"],
        answer: 1,
      },
      {
        id: "da3",
        topic: "PowerBI",
        question: "What is DAX primarily used for in Power BI?",
        options: [
          "Styling reports",
          "Writing calculations and measures",
          "Scheduling refreshes",
          "Managing user roles",
        ],
        answer: 1,
      },
    ],
    mastered: [
      { skill: "Spreadsheet Modelling", level: 88 },
      { skill: "SQL Basics", level: 74 },
      { skill: "Data Storytelling", level: 70 },
    ],
    gaps: [
      { skill: "Advanced DAX", level: 26, severity: "critical" },
      { skill: "Python for Analytics", level: 33, severity: "critical" },
      { skill: "Data Modelling", level: 49, severity: "moderate" },
    ],
    roadmap: [
      { title: "SQL for analytics", detail: "Window functions, CTEs", hours: 12 },
      { title: "Python with pandas", detail: "Cleaning, joins, aggregation", hours: 14 },
      { title: "Power BI modelling", detail: "Star schema, relationships, DAX", hours: 16 },
      { title: "Dashboard design", detail: "Metric hierarchy and clarity", hours: 8 },
      { title: "Capstone: revenue insights board", detail: "End-to-end analysis and readout", hours: 20 },
    ],
    internships: [
      { company: "Atlas Retail", role: "Business Analyst Intern", location: "Mumbai · Hybrid", stipend: "₹30,000/mo", fit: 88 },
      { company: "Lumen Health", role: "Data Analyst Intern", location: "Remote", stipend: "₹27,000/mo", fit: 82 },
      { company: "Orbit Payments", role: "Insights Intern", location: "Chennai · Onsite", stipend: "₹29,000/mo", fit: 75 },
    ],
    mentors: [
      { name: "Sara Thomas", title: "Analytics Manager", company: "Atlas Retail", fit: 90 },
      { name: "Vikram Iyer", title: "Head of Insights", company: "Orbit Payments", fit: 84 },
    ],
  },
];

export function getPath(id: CareerPathId): CareerPath {
  return CAREER_PATHS.find((p) => p.id === id) ?? CAREER_PATHS[0];
}

export const CANDIDATES = [
  { name: "Aarav Sharma", initials: "AS", path: "Full Stack Developer", score: 88, match: 94, status: "Shortlisted", college: "VIT Vellore" },
  { name: "Meera Pillai", initials: "MP", path: "AI / ML Engineer", score: 81, match: 91, status: "Screening", college: "IIIT Hyderabad" },
  { name: "Rohan Gupta", initials: "RG", path: "Cloud / DevOps Engineer", score: 76, match: 86, status: "New", college: "NIT Trichy" },
  { name: "Ishita Verma", initials: "IV", path: "Data Analyst", score: 84, match: 89, status: "Shortlisted", college: "Christ University" },
  { name: "Kabir Singh", initials: "KS", path: "Full Stack Developer", score: 69, match: 74, status: "New", college: "SRM Chennai" },
  { name: "Tanvi Desai", initials: "TD", path: "AI / ML Engineer", score: 92, match: 96, status: "Placed", college: "BITS Pilani" },
];

export const COMMON_GAPS = [
  { skill: "Cloud & System Design", pct: 64 },
  { skill: "Advanced SQL", pct: 52 },
  { skill: "Containerisation", pct: 47 },
  { skill: "Testing & CI", pct: 41 },
  { skill: "Data Modelling", pct: 33 },
];

export const CURRICULUM_RECOMMENDATIONS = [
  {
    semester: "Semester 5",
    change: "Add a 3-credit Cloud Fundamentals module",
    reason: "64% of the cohort shows a cloud gap while 3 of 5 top recruiters now require AWS basics.",
    impact: "+12% projected readiness",
  },
  {
    semester: "Semester 6",
    change: "Replace legacy J2EE lab with containerised microservices lab",
    reason: "Docker appears in 78% of entry-level backend postings this hiring cycle.",
    impact: "+9% projected readiness",
  },
  {
    semester: "Semester 7",
    change: "Introduce applied LLM elective",
    reason: "AI role postings from partner companies grew 41% year over year.",
    impact: "+7% projected readiness",
  },
];

export const MENTORSHIP_REQUESTS = [
  { name: "Aarav Sharma", initials: "AS", goal: "Full Stack Developer", note: "Needs guidance on system design for capstone.", when: "2h ago" },
  { name: "Meera Pillai", initials: "MP", goal: "AI / ML Engineer", note: "Wants a review of her fine-tuning approach.", when: "5h ago" },
  { name: "Rohan Gupta", initials: "RG", goal: "Cloud / DevOps Engineer", note: "Stuck on Kubernetes deployment strategy.", when: "1d ago" },
];

export const PROJECT_SUBMISSIONS = [
  { student: "Ishita Verma", title: "Retail Churn Dashboard", stack: ["Python", "PowerBI"], submitted: "Today", lines: 1420 },
  { student: "Kabir Singh", title: "Campus Job Board API", stack: ["Node.js", "PostgreSQL"], submitted: "Yesterday", lines: 2310 },
  { student: "Tanvi Desai", title: "Resume Semantic Matcher", stack: ["Transformers", "FastAPI"], submitted: "2 days ago", lines: 1890 },
];

export const SKILL_TAGS = [
  "React", "Node.js", "SQL", "Python", "Docker", "AWS", "Kubernetes",
  "FastAPI", "PowerBI", "Transformers", "TypeScript", "CI/CD",
];
