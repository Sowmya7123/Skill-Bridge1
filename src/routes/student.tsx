import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ShieldAlert,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Eye,
  Terminal,
  Check,
  ChevronRight,
  Sparkles,
  ArrowRight,
  BookOpen,
  Code2,
  ShieldCheck,
  Search,
  Bug,
  Layers,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/student")({
  component: StudentAssessmentEngine,
});

// -------------------------------------------------------------
// 36 COMPREHENSIVE DOMAIN TRACKS
// -------------------------------------------------------------
const DOMAIN_OPTIONS = [
  // 1. SOFTWARE & SYSTEM ENGINEERING
  { id: "fullstack-web", title: "Full Stack Web Development", category: "Software Development", desc: "MERN/Next.js, Spring Boot, REST APIs, Microservices, System Design", badge: "Most Popular" },
  { id: "frontend-dev", title: "Frontend Engineering", category: "Software Development", desc: "React, Angular, Vue, TypeScript, Next.js, Web Performance & UI/UX", badge: "High Demand" },
  { id: "backend-dev", title: "Backend Systems Architecture", category: "Software Development", desc: "Java, Node.js, Go, Python Django, Distributed DBs, Caching, Kafka", badge: "Core Tech" },
  { id: "mobile-dev", title: "Mobile App Engineering", category: "Software Development", desc: "Flutter, React Native, Native Android (Kotlin), iOS (Swift)", badge: "Industry" },
  { id: "game-dev", title: "Game Design & Development", category: "Software Development", desc: "Unity, Unreal Engine 5, C#, C++, 3D Shaders, Physics Engines", badge: "Creative Tech" },
  { id: "software-testing", title: "QA & Test Automation Engineering", category: "Software Development", desc: "Selenium, Cypress, Playwright, API Testing, Performance (JMeter)", badge: "High Demand" },
  { id: "api-microservices", title: "API & Microservices Architecture", category: "Software Development", desc: "gRPC, GraphQL, REST, API Gateways, Event-Driven Systems", badge: "Enterprise" },

  // 2. AI, MACHINE LEARNING & DATA SCIENCE
  { id: "ai-ml", title: "Artificial Intelligence & Machine Learning", category: "Data & AI", desc: "Supervised/Unsupervised Models, Scikit-learn, Neural Networks, PyTorch", badge: "Trending" },
  { id: "gen-ai", title: "Generative AI & LLM Systems", category: "Data & AI", desc: "LangChain, RAG Pipelines, Vector DBs, Prompt Engineering, Fine-Tuning", badge: "Frontier" },
  { id: "deep-learning-cv", title: "Deep Learning & Computer Vision", category: "Data & AI", desc: "CNNs, YOLO, OpenCV, Image Segmentation, Video Analytics", badge: "Specialized" },
  { id: "nlp-speech", title: "NLP & Conversational Systems", category: "Data & AI", desc: "Transformers, BERT, Speech-to-Text, Sentiment Analysis, Tokenization", badge: "Specialized" },
  { id: "data-science", title: "Data Science & Statistical Analytics", category: "Data & AI", desc: "Python, R, Exploratory Analysis, Predictive Modeling, Hypothesis Testing", badge: "High Demand" },
  { id: "data-engineering", title: "Data Engineering & Big Data Systems", category: "Data & AI", desc: "Apache Spark, Kafka, Snowflake, Databricks, BigQuery, ETL Pipelines", badge: "Enterprise" },
  { id: "bi-analytics", title: "Business Intelligence & Data Visualization", category: "Data & AI", desc: "Power BI, Tableau, Advanced SQL, Data Warehousing, Metric Dashboards", badge: "Corporate" },

  // 3. CLOUD, DEVOPS & INFRASTRUCTURE
  { id: "cloud-architecture", title: "Cloud Architecture (AWS / Azure / GCP)", category: "Cloud & DevOps", desc: "VPC, IAM, Serverless (Lambda), Cloud Security, High Availability Systems", badge: "Enterprise" },
  { id: "devops-sre", title: "DevOps & Site Reliability Engineering (SRE)", category: "Cloud & DevOps", desc: "Docker, Kubernetes, CI/CD Actions, Terraform, Linux Admin, Prometheus", badge: "High Demand" },
  { id: "system-admin", title: "Linux Systems & Enterprise Networking", category: "Cloud & DevOps", desc: "Bash Scripting, DNS, TCP/IP, Active Directory, Server Hardening", badge: "Core" },

  // 4. CYBERSECURITY & INFORMATION SECURITY
  { id: "ethical-hacking", title: "Ethical Hacking & Penetration Testing", category: "Cybersecurity", desc: "VAPT, Metasploit, Burp Suite, Network Vulnerabilities, Bug Bounty", badge: "High Demand" },
  { id: "cyber-defense", title: "SOC Operations & Threat Intelligence", category: "Cybersecurity", desc: "SIEM (Splunk), Incident Response, Log Analysis, Malware Triage", badge: "Security" },
  { id: "cloud-security", title: "Cloud Security & DevSecOps", category: "Cybersecurity", desc: "OWASP Top 10, Container Security, SonarQube, Zero Trust Architecture", badge: "Enterprise" },
  { id: "cryptography-web3", title: "Cryptography & Blockchain Engineering", category: "Cybersecurity", desc: "Solidity, Smart Contracts, Ethereum, EVM, Public-Key Infrastructure", badge: "Emerging" },

  // 5. ELECTRONICS, VLSI & EMBEDDED SYSTEMS (ECE / EEE)
  { id: "embedded-systems", title: "Embedded Systems & Firmware Engineering", category: "Core Hardware", desc: "Embedded C/C++, ARM Cortex, FreeRTOS, Microcontrollers (ESP32/STM32)", badge: "Core ECE" },
  { id: "vlsi-design", title: "VLSI Design & RTL Verification", category: "Core Hardware", desc: "Verilog, SystemVerilog, UVM, FPGA Synthesis, Static Timing Analysis", badge: "High Package" },
  { id: "iot-robotics", title: "Internet of Things (IoT) & Smart Sensors", category: "Core Hardware", desc: "MQTT, Sensor Interfacing, Edge Computing, Raspberry Pi, LoRaWAN", badge: "Modern Hardware" },
  { id: "robotics-automation", title: "Robotics & Autonomous Systems", category: "Core Hardware", desc: "ROS (Robot Operating System), Kinematics, SLAM, PID Controllers", badge: "Research" },
  { id: "pcb-hardware", title: "PCB Design & Hardware Architecture", category: "Core Hardware", desc: "Altium, KiCAD, High-Speed Routing, Circuit Simulation (SPICE)", badge: "Core ECE" },
  { id: "power-systems-ev", title: "Electric Vehicles (EV) & Power Electronics", category: "Core Hardware", desc: "BMS (Battery Management), Inverters, Motor Controllers, Power Grids", badge: "Core EEE" },

  // 6. MECHANICAL, AEROSPACE & MECHATRONICS
  { id: "cad-cam-design", title: "CAD / CAM & Mechanical Product Design", category: "Core Mechanical", desc: "SolidWorks, CATIA, GD&T, Rapid Prototyping, Sheet Metal Design", badge: "Core Mech" },
  { id: "fea-cfd-analysis", title: "FEA & CFD Thermal Simulation", category: "Core Mechanical", desc: "ANSYS Mechanical, Fluent, Aerodynamics, Stress Analysis, Meshing", badge: "Simulation" },
  { id: "industrial-automation", title: "Industrial Automation & PLC / SCADA", category: "Core Mechanical", desc: "Siemens PLC, Ladder Logic, Hydraulics, Pneumatics, Industry 4.0", badge: "Manufacturing" },

  // 7. CIVIL, GEOSPATIAL & STRUCTURAL
  { id: "structural-engineering", title: "Structural Analysis & BIM Design", category: "Core Civil", desc: "ETABS, STAAD Pro, Revit BIM, Concrete Design, Seismic Analysis", badge: "Core Civil" },
  { id: "gis-remote-sensing", title: "Geospatial Data Science & GIS", category: "Core Civil", desc: "ArcGIS, QGIS, Satellite Imagery Analysis, Spatial Mapping", badge: "Geospatial" },

  // 8. PRODUCT, DESIGN & TECH MANAGEMENT
  { id: "ui-ux-design", title: "UI/UX & Digital Product Design", category: "Design & Product", desc: "Figma, User Journey Mapping, Wireframing, Design Systems, Usability", badge: "Creative" },
  { id: "product-management", title: "Technical Product Management (APM)", category: "Design & Product", desc: "PRDs, Agile/Scrum Sprints, Feature Roadmaps, Product Analytics (Mixpanel)", badge: "Management" },
  { id: "business-analyst", title: "Technical Business Analyst (IT BA)", category: "Design & Product", desc: "Requirement Gathering, UML Diagrams, User Stories, Gap Analysis, Jira", badge: "Corporate" },
];

const CATEGORIES = [
  "All",
  "Software Development",
  "Data & AI",
  "Cloud & DevOps",
  "Cybersecurity",
  "Core Hardware",
  "Core Mechanical",
  "Core Civil",
  "Design & Product",
];

// -------------------------------------------------------------
// BASE QUESTION POOL FOR SAMPLING & SHUFFLING
// -------------------------------------------------------------
interface ProcessedQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

const RAW_QUESTION_POOL = [
  { id: "q-1", question: "In the JavaScript V8 engine, where are object references and execution contexts stored?", options: [{ id: "A", text: "Stack for execution context, Heap for objects" }, { id: "B", text: "Heap for all primitives and closures" }, { id: "C", text: "Stack holds all variables exclusively" }, { id: "D", text: "Directly in OS Virtual Memory" }], correctAnswer: "A" },
  { id: "q-2", question: "What is the primary advantage of B-Tree indices over Hash indices in relational databases?", options: [{ id: "A", text: "Faster O(1) single-point lookups" }, { id: "B", text: "Efficient range scans (BETWEEN, >, <)" }, { id: "C", text: "Zero disk footprint on persistent storage" }, { id: "D", text: "Automatic table denormalization" }], correctAnswer: "B" },
  { id: "q-3", question: "Which HTTP status code signifies that a client must authenticate itself to get the requested response?", options: [{ id: "A", text: "403 Forbidden" }, { id: "B", text: "401 Unauthorized" }, { id: "C", text: "400 Bad Request" }, { id: "D", text: "422 Unprocessable Entity" }], correctAnswer: "B" },
  { id: "q-4", question: "What problem does the CAP Theorem state distributed data stores cannot simultaneously achieve?", options: [{ id: "A", text: "Consistency, Availability, and Partition Tolerance" }, { id: "B", text: "Concurrency, Atomicity, and Performance" }, { id: "C", text: "Caching, Availability, and Persistence" }, { id: "D", text: "Throughput, Latency, and Scalability" }], correctAnswer: "A" },
  { id: "q-5", question: "What is the time complexity to insert an element into an existing Min-Heap of size N?", options: [{ id: "A", text: "O(1)" }, { id: "B", text: "O(log N)" }, { id: "C", text: "O(N)" }, { id: "D", text: "O(N log N)" }], correctAnswer: "B" },
  { id: "q-6", question: "In React, why must hooks only be called at the top level and not inside loops or conditions?", options: [{ id: "A", text: "To preserve call order across renders for internal linked-lists" }, { id: "B", text: "To prevent memory leaks in V8 garbage collection" }, { id: "C", text: "React compiler converts hooks to global window variables" }, { id: "D", text: "Loops force hooks to execute in parallel threads" }], correctAnswer: "A" },
  { id: "q-7", question: "Which SQL isolation level protects against both Dirty Reads and Non-Repeatable Reads?", options: [{ id: "A", text: "Read Uncommitted" }, { id: "B", text: "Read Committed" }, { id: "C", text: "Repeatable Read" }, { id: "D", text: "Snapshot Read Only" }], correctAnswer: "C" },
  { id: "q-8", question: "What is the fundamental purpose of a Reverse Proxy (e.g., NGINX)?", options: [{ id: "A", text: "Cache client-side browser cookies" }, { id: "B", text: "Distribute incoming traffic and terminate SSL before upstream servers" }, { id: "C", text: "Compile frontend TypeScript into JavaScript" }, { id: "D", text: "Directly execute SQL stored procedures" }], correctAnswer: "B" },
  { id: "q-9", question: "In Docker containerization, how does a container differ fundamentally from a Virtual Machine (VM)?", options: [{ id: "A", text: "Containers share the host OS kernel and use cgroups/namespaces" }, { id: "B", text: "Containers emulate complete virtual hardware and BIOS" }, { id: "C", text: "Containers require a Type-1 Hypervisor on bare metal" }, { id: "D", text: "Containers cannot communicate over TCP/IP networks" }], correctAnswer: "A" },
  { id: "q-10", question: "What security vulnerability occurs when user input is directly concatenated into a dynamic SQL query?", options: [{ id: "A", text: "Cross-Site Scripting (XSS)" }, { id: "B", text: "SQL Injection (SQLi)" }, { id: "C", text: "Cross-Site Request Forgery (CSRF)" }, { id: "D", text: "Buffer Overflow" }], correctAnswer: "B" },
  { id: "q-11", question: "In Redis, what is the default eviction policy when maxmemory is reached without specified keys?", options: [{ id: "A", text: "noeviction (returns error on writes)" }, { id: "B", text: "allkeys-lru" }, { id: "C", text: "volatile-random" }, { id: "D", text: "volatile-ttl" }], correctAnswer: "A" },
  { id: "q-12", question: "What is the primary role of a Vector Database in Generative AI architectures?", options: [{ id: "A", text: "Indexing high-dimensional embeddings for cosine similarity retrieval" }, { id: "B", text: "Compressing LLM weights for mobile execution" }, { id: "C", text: "Executing SQL window functions on text" }, { id: "D", text: "Parsing JSON payloads from webhooks" }], correctAnswer: "A" },
  { id: "q-13", question: "What does the ACID 'I' stand for in database transaction properties?", options: [{ id: "A", text: "Integrity" }, { id: "B", text: "Isolation" }, { id: "C", text: "Immutability" }, { id: "D", text: "Indexing" }], correctAnswer: "B" },
  { id: "q-14", question: "Which cryptographic algorithm is based on asymmetric public-private keypairs?", options: [{ id: "A", text: "AES-256" }, { id: "B", text: "RSA" }, { id: "C", text: "DES" }, { id: "D", text: "Blowfish" }], correctAnswer: "B" },
  { id: "q-15", question: "In Git, what does 'git rebase' do compared to 'git merge'?", options: [{ id: "A", text: "Reapplies commits on top of another base tip for a linear history" }, { id: "B", text: "Creates a 3-way merge commit combining divergent trees" }, { id: "C", text: "Permanently destroys remote branches" }, { id: "D", text: "Pushes code directly to production without testing" }], correctAnswer: "A" },
  { id: "q-16", question: "What is the space complexity of an in-place QuickSort algorithm on average?", options: [{ id: "A", text: "O(1)" }, { id: "B", text: "O(log N) auxiliary stack space" }, { id: "C", text: "O(N) contiguous array allocation" }, { id: "D", text: "O(N^2) recursive frames" }], correctAnswer: "B" },
  { id: "q-17", question: "In RESTful API design, which method is expected to be idempotent?", options: [{ id: "A", text: "POST" }, { id: "B", text: "PUT" }, { id: "C", text: "PATCH (without precondition)" }, { id: "D", text: "CONNECT" }], correctAnswer: "B" },
  { id: "q-18", question: "Which protocol operates at the Transport Layer (Layer 4) of the OSI model providing reliable ordered delivery?", options: [{ id: "A", text: "IP" }, { id: "B", text: "TCP" }, { id: "C", text: "HTTP" }, { id: "D", text: "DNS" }], correctAnswer: "B" },
  { id: "q-19", question: "What is the primary cause of a 'Race Condition' in concurrent programming?", options: [{ id: "A", text: "Multiple threads accessing shared mutable state without proper synchronization" }, { id: "B", text: "CPU clock speed running faster than RAM bus speed" }, { id: "C", text: "Garbage collection pausing the main execution thread" }, { id: "D", text: "Stack overflow due to infinite recursion" }], correctAnswer: "A" },
  { id: "q-20", question: "What design pattern defines a one-to-many dependency between objects so that when one changes state, all dependents are notified?", options: [{ id: "A", text: "Singleton Pattern" }, { id: "B", text: "Observer Pattern" }, { id: "C", text: "Factory Pattern" }, { id: "D", text: "Adapter Pattern" }], correctAnswer: "B" },
];

const DEBUGGING_SCENARIO = {
  title: "Production Incident: Memory Leak & Unhandled Promise in Webhook Handler",
  description: `A Node.js microservice handling high-volume payment webhooks crashes every 4 hours with:
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory.

Audit the code snippet below. Identify the root cause and propose the fix.`,
  buggyCode: `// INCIDENT SNIPPET: paymentWebhook.js
const auditLogCache = []; // Global memory array

app.post('/api/webhook', async (req, res) => {
  const payload = req.body;
  
  // Bug 1: Unbounded array growth in heap memory
  auditLogCache.push({ timestamp: Date.now(), data: payload });
  
  // Bug 2: Unhandled async error (service crashes on network failure)
  paymentService.processTransaction(payload);
  
  res.status(200).send({ received: true });
});`,
  options: [
    { id: "A", text: "Global auditLogCache array grows unbounded in RAM without TTL or DB offloading, and processTransaction is unawaited, causing silent failures." },
    { id: "B", text: "The HTTP status code 200 is invalid for webhooks and should be replaced with HTTP 201." },
    { id: "C", text: "req.body should be converted to Base64 before pushing to prevent UTF-8 encoding overflow." },
    { id: "D", text: "Express does not support async route handlers without third-party Babel plugins." },
  ],
  correctAnswer: "A",
};

const CODING_DATA = {
  title: "Optimized Target Pair Finder (Two-Sum)",
  benchmarkSeconds: 300,
  expectedComplexity: "O(N) Linear Time",
  description: `Given an array of integers 'nums' and an integer 'target', return indices of the two numbers such that they add up to target.

Requirements:
- Your solution must run in O(N) time complexity using a single traversal with a Hash Map.
- Brute-force nested loops O(N^2) will be penalized in the efficiency score.
- Must cleanly handle edge cases (empty arrays, negative numbers).`,
  initialCode: `function twoSum(nums, target) {
  // Write your O(N) optimized solution here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
  testCases: [
    { input: "[2, 7, 11, 15], target = 9", expected: "[0, 1]" },
    { input: "[3, 2, 4], target = 6", expected: "[1, 2]" },
    { input: "[3, 3], target = 6", expected: "[0, 1]" },
    { input: "[], target = 10", expected: "[]" },
  ],
};

const SYSTEM_DESIGN_SCENARIO = {
  title: "Tier 4: Architecture Tradeoff - Live Leaderboard at Scale",
  scenario: `Your platform needs to support a real-time leaderboard for 5 million active users during a campus hiring drive. The system must support:
- Top 100 ranking queries with sub-50ms latency.
- Instant score updates when an assessment completes.

Which architecture tradeoff offers the optimal scalability and lowest write latency?`,
  options: [
    { id: "A", text: "Redis Sorted Sets (ZSET): Uses SkipLists + Hash Table for O(log N) score updates and O(log N + M) range queries in memory." },
    { id: "B", text: "PostgreSQL table with ORDER BY score DESC LIMIT 100 queried directly by clients every 500ms." },
    { id: "C", text: "Store scores in MongoDB documents and run full aggregation pipelines on every user refresh." },
    { id: "D", text: "Write all events to a static JSON file on AWS S3 and synchronize via webhooks." },
  ],
  correctAnswer: "A",
};

// -------------------------------------------------------------
// FISHER-YATES ANTI-COLLISION SHUFFLE ENGINE
// -------------------------------------------------------------
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Shuffles both the questions list & internal option letters per student
function generateAntiCheatExamSet(questions: typeof RAW_QUESTION_POOL): ProcessedQuestion[] {
  const shuffledQuestions = shuffle(questions);
  return shuffledQuestions.map((q) => {
    const originalCorrectOption = q.options.find((opt) => opt.id === q.correctAnswer);
    const shuffledOptions = shuffle(q.options);

    let newCorrectLetter = "A";
    const reassignedOptions = shuffledOptions.map((opt, idx) => {
      const newLetter = String.fromCharCode(65 + idx);
      if (originalCorrectOption && opt.text === originalCorrectOption.text) {
        newCorrectLetter = newLetter;
      }
      return {
        id: newLetter,
        text: opt.text,
      };
    });

    return {
      id: q.id,
      question: q.question,
      options: reassignedOptions,
      correctAnswer: newCorrectLetter,
    };
  });
}

function StudentAssessmentEngine() {
  const { userEmail } = useAppState();

  const [assessmentStage, setAssessmentStage] = useState<
    "domain-selection" | "guidelines" | "testing" | "submitted"
  >("domain-selection");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [customDomainText, setCustomDomainText] = useState("");
  const [domainSearch, setDomainSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Multi-Tier Navigation
  const [activeTab, setActiveTab] = useState<"theory" | "debugging" | "coding" | "architecture">("theory");

  // Dynamic Randomized Exam Questions (Student-Unique)
  const [studentQuestions, setStudentQuestions] = useState<ProcessedQuestion[]>([]);
  const [theoryAnswers, setTheoryAnswers] = useState<Record<string, string>>({});
  const [currentTheoryIndex, setCurrentTheoryIndex] = useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Tier 2, 3, 4 States
  const [debuggingAnswer, setDebuggingAnswer] = useState<string | null>(null);
  const [code, setCode] = useState(CODING_DATA.initialCode);
  const [systemDesignAnswer, setSystemDesignAnswer] = useState<string | null>(null);

  // Camera & Anti-Cheat Proctoring
  const [cameraStatus, setCameraStatus] = useState<"checking" | "ready" | "denied">("checking");
  const [totalElapsed, setTotalElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [strikes, setStrikes] = useState<string[]>([]);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Holistic Evaluation Matrix
  const [evaluation, setEvaluation] = useState<{
    theoryScore: number;
    debuggingScore: number;
    codingScore: number;
    designScore: number;
    speedScore: number;
    trustScore: number;
    totalMeritScore: number;
    detectedComplexity: string;
    competencyBadge: string;
  } | null>(null);

  // Load Unique Questions dynamically per Student
  const handleProceedToGuidelines = async () => {
    if (!selectedDomain) return;

    setIsLoadingQuestions(true);
    try {
      // 1. Check for previously attempted question IDs for this student in Supabase
      const { data: pastAttempts } = await supabase
        .from("student_assessments")
        .select("attempted_question_ids")
        .eq("student_email", userEmail || "")
        .eq("role_id", selectedDomain);

      const usedIds: string[] = [];
      pastAttempts?.forEach((row: { attempted_question_ids?: string[] }) => {
        if (row.attempted_question_ids && Array.isArray(row.attempted_question_ids)) {
          usedIds.push(...row.attempted_question_ids);
        }
      });

      // 2. Fetch fresh questions from Supabase assessment_questions table
      let query = supabase
        .from("assessment_questions")
        .select("*")
        .eq("role_id", selectedDomain)
        .eq("question_type", "mcq");

      if (usedIds.length > 0) {
        query = query.not("id", "in", `(${usedIds.join(",")})`);
      }

      const { data: dbQuestions, error } = await query.limit(20);

      if (!error && dbQuestions && dbQuestions.length >= 10) {
        const formatted = dbQuestions.map((q: any) => ({
          id: q.id,
          question: q.prompt,
          options: q.options || [],
          correctAnswer: q.correct_answer || "A",
        }));
        setStudentQuestions(generateAntiCheatExamSet(formatted));
      } else {
        // Fallback to randomized local master pool
        setStudentQuestions(generateAntiCheatExamSet(RAW_QUESTION_POOL));
      }
    } catch (err) {
      console.error(err);
      setStudentQuestions(generateAntiCheatExamSet(RAW_QUESTION_POOL));
    } finally {
      setIsLoadingQuestions(false);
      setAssessmentStage("guidelines");
    }
  };

  // Camera Validation Hook
  useEffect(() => {
    if (assessmentStage !== "guidelines" && assessmentStage !== "testing") return;

    let stream: MediaStream | null = null;
    setCameraStatus("checking");

    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
        setCameraStatus("ready");
      })
      .catch((err) => {
        console.error("Camera access denied:", err);
        setCameraStatus("denied");
        toast.error("Camera Permission Required", {
          description: "Camera must be allowed to enter the verified assessment room.",
        });
      });

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [assessmentStage]);

  // Assessment Timer
  useEffect(() => {
    if (assessmentStage === "testing" && !isDisqualified) {
      timerRef.current = setInterval(() => {
        setTotalElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [assessmentStage, isDisqualified]);

  // Anti-Cheat Violation Handler (2-Strike System)
  const registerStrike = useCallback(
    (reason: string) => {
      if (isDisqualified || assessmentStage !== "testing") return;

      const time = new Date().toLocaleTimeString();
      const logEntry = `${reason} — ${time}`;

      setStrikes((prev) => {
        const next = [...prev, logEntry];
        if (next.length === 1) {
          setActiveAlert("Strike 1/2: Integrity Violation Logged. 1 chance remaining!");
          toast.warning("Warning 1/2: Rule Violated!", {
            description: `${reason}. You have only 1 chance left before permanent lockout.`,
          });
        } else if (next.length === 2) {
          setActiveAlert("CRITICAL WARNING 2/2: Next violation will terminate your test!");
          toast.error("Critical Strike 2/2!", {
            description: `${reason}. Final notice! Further infraction terminates test.`,
          });
        } else if (next.length >= 3) {
          setIsDisqualified(true);
          toast.error("Assessment Terminated!", {
            description: "Exceeded 2 chances. Session revoked under AI proctoring policy.",
          });
        }
        return next;
      });
    },
    [isDisqualified, assessmentStage]
  );

  // Security Focus Listeners
  useEffect(() => {
    if (assessmentStage !== "testing" || isDisqualified) return;

    const onVisibilityChange = () => {
      if (document.hidden) registerStrike("Tab switched or browser minimized");
    };
    const onWindowBlur = () => {
      registerStrike("Window focus lost (external click)");
    };
    const onCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      registerStrike("Clipboard copy/paste blocked");
    };
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      registerStrike("Right-click context menu blocked");
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("copy", onCopyPaste);
    window.addEventListener("paste", onCopyPaste);
    window.addEventListener("cut", onCopyPaste);
    window.addEventListener("contextmenu", onContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("copy", onCopyPaste);
      window.removeEventListener("paste", onCopyPaste);
      window.removeEventListener("cut", onCopyPaste);
      window.removeEventListener("contextmenu", onContextMenu);
    };
  }, [assessmentStage, isDisqualified, registerStrike]);

  // -------------------------------------------------------------
  // FINAL EVALUATION CALCULATION & SUPABASE SYNC
  // -------------------------------------------------------------
  const handleFinalSubmit = async () => {
    // 1. Tier 1 Theory (Max 25 pts)
    let correctTheoryCount = 0;
    studentQuestions.forEach((q) => {
      if (theoryAnswers[q.id] === q.correctAnswer) correctTheoryCount++;
    });
    const totalCount = studentQuestions.length || 20;
    const theoryScore = Math.round((correctTheoryCount / totalCount) * 25);

    // 2. Tier 2 Debugging Triage (Max 20 pts)
    const debuggingScore = debuggingAnswer === DEBUGGING_SCENARIO.correctAnswer ? 20 : 0;

    // 3. Tier 3 Algorithmic Complexity (Max 30 pts)
    const hasNestedLoop = /for\s*\(.*for\s*\(|while\s*\(.*while\s*\(/.test(code);
    const hasHashMap = /Map|Set|complement|diff/.test(code);
    let codingScore = 30;
    let detectedComplexity = "O(N) - Linear Time (Optimal Hash Map)";

    if (hasNestedLoop) {
      codingScore = 12;
      detectedComplexity = "O(N^2) - Sub-optimal Brute Force";
    } else if (!hasHashMap) {
      codingScore = 20;
      detectedComplexity = "O(N log N) - Sorting / Two-Pointer";
    }

    // 4. Tier 4 System Architecture (Max 15 pts)
    const designScore = systemDesignAnswer === SYSTEM_DESIGN_SCENARIO.correctAnswer ? 15 : 0;

    // 5. Benchmark Speed (Max 10 pts)
    const totalBenchmark = 720; // 12 minutes
    let speedScore = 10;
    if (totalElapsed <= totalBenchmark) {
      speedScore = 10;
    } else if (totalElapsed <= totalBenchmark * 1.3) {
      speedScore = 7;
    } else {
      speedScore = 5;
    }

    const trustScore = Math.max(0, 100 - strikes.length * 15);
    const totalMeritScore = theoryScore + debuggingScore + codingScore + designScore + speedScore;

    let competencyBadge = "Gold Certified (Ready-to-Hire)";
    if (totalMeritScore < 60) competencyBadge = "Bronze Assessed (Foundational)";
    else if (totalMeritScore < 80) competencyBadge = "Silver Verified (Industry Ready)";

    setEvaluation({
      theoryScore,
      debuggingScore,
      codingScore,
      designScore,
      speedScore,
      trustScore,
      totalMeritScore,
      detectedComplexity,
      competencyBadge,
    });

    // Save Scorecard and Attempted Question IDs in Supabase
    try {
      const attemptedIds = studentQuestions.map((q) => q.id);
      await supabase.from("student_assessments").insert({
        student_email: userEmail || "verified.student@portal.ac.in",
        role_id: selectedDomain === "custom-domain" ? "fullstack-web" : selectedDomain,
        total_score: totalMeritScore,
        logic_score: theoryScore + codingScore,
        speed_score: speedScore,
        trust_score: trustScore,
        competency_badge: competencyBadge,
        time_elapsed_seconds: totalElapsed,
        strikes_count: strikes.length,
        attempted_question_ids: attemptedIds,
      });
    } catch (err) {
      console.error("Failed to sync scorecard with Supabase:", err);
    }

    setAssessmentStage("submitted");
    toast.success("Comprehensive evaluation verified and stored!");
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s < 10 ? "0" : ""}${s}s`;
  };

  const activeDomainTitle =
    selectedDomain === "custom-domain"
      ? customDomainText || "Custom Track"
      : DOMAIN_OPTIONS.find((d) => d.id === selectedDomain)?.title || selectedDomain;

  // -------------------------------------------------------------
  // VIEW 1: DOMAIN SELECTION (36 DOMAINS + SEARCH)
  // -------------------------------------------------------------
  if (assessmentStage === "domain-selection") {
    const filteredDomains = DOMAIN_OPTIONS.filter((d) => {
      const matchesCategory = selectedCategory === "All" || d.category === selectedCategory;
      const matchesSearch =
        d.title.toLowerCase().includes(domainSearch.toLowerCase()) ||
        d.desc.toLowerCase().includes(domainSearch.toLowerCase()) ||
        d.category.toLowerCase().includes(domainSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-3 sm:p-6 font-sans">
        <div className="w-full max-w-6xl rounded-2xl border border-white/15 bg-slate-900/95 backdrop-blur-xl p-5 sm:p-8 shadow-2xl flex flex-col max-h-[92vh]">
          <div className="text-center max-w-2xl mx-auto mb-4 shrink-0">
            <div className="size-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-2">
              <Sparkles className="size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Choose Your Engineering Specialization
            </h1>
            <p className="text-xs text-blue-200/70 mt-1">
              Select your targeted domain. Each student receives an anti-collision randomized question set.
            </p>

            <div className="mt-3 relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={domainSearch}
                onChange={(e) => setDomainSearch(e.target.value)}
                placeholder="Search domains (e.g. AI, Full Stack, DevOps, VLSI, EV, Robotics)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-2 mt-2.5 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition border",
                    selectedCategory === cat
                      ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                      : "bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDomains.map((item) => {
              const isSelected = selectedDomain === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedDomain(item.id);
                    setCustomDomainText("");
                  }}
                  className={cn(
                    "p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between",
                    isSelected
                      ? "border-blue-500 bg-blue-600/20 ring-2 ring-blue-500/50 shadow-md shadow-blue-500/10"
                      : "border-white/10 bg-slate-900/50 hover:bg-slate-800/80 hover:border-white/20"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs sm:text-sm text-white truncate">{item.title}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-300 shrink-0">
                        {item.badge}
                      </span>
                    </div>
                    <span className="text-[10px] text-blue-300 font-medium block mt-0.5">{item.category}</span>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">{item.desc}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3 size-4 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <Check className="size-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}

            <div
              onClick={() => setSelectedDomain("custom-domain")}
              className={cn(
                "p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer",
                selectedDomain === "custom-domain"
                  ? "border-blue-500 bg-blue-600/20 ring-2 ring-blue-500/50"
                  : "border-dashed border-white/20 bg-black/30 hover:border-white/40"
              )}
            >
              <div>
                <span className="font-bold text-xs sm:text-sm text-white">Other / Custom Specialization</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Mee specialization list lo lekapothe ikkada manual ga type cheyandi.
                </p>
                {selectedDomain === "custom-domain" && (
                  <input
                    type="text"
                    autoFocus
                    value={customDomainText}
                    onChange={(e) => setCustomDomainText(e.target.value)}
                    placeholder="e.g. Bio-Informatics, Mechatronics, Aerospace..."
                    className="mt-2 w-full px-3 py-1.5 rounded-lg bg-black/70 border border-blue-400 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between shrink-0">
            <Link to="/" className="text-xs text-slate-400 hover:text-white">
              Back to Home
            </Link>
            <Button
              disabled={
                !selectedDomain ||
                (selectedDomain === "custom-domain" && !customDomainText.trim()) ||
                isLoadingQuestions
              }
              onClick={handleProceedToGuidelines}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs px-6"
            >
              {isLoadingQuestions ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-3.5 animate-spin" /> Randomizing Unique Exam Set...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Continue to Assessment Room
                  <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: DISQUALIFIED SCREEN
  // -------------------------------------------------------------
  if (isDisqualified) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-xl rounded-2xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-xl p-8 text-center shadow-2xl">
          <div className="size-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4">
            <ShieldAlert className="size-8" />
          </div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-3">
            Policy Disqualification
          </span>
          <h1 className="text-3xl font-black text-white">Assessment Terminated</h1>
          <p className="mt-3 text-sm text-rose-200/80 leading-relaxed">
            Your assessment session has been permanently revoked. You exceeded the maximum allowed policy infractions (2 chances). All inputs are locked.
          </p>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/50 p-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 mb-2">
              Violation Audit Trail:
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              {strikes.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">#{idx + 1}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <Link to="/" className="inline-block mt-8">
            <Button className="bg-white/10 hover:bg-white/20 text-white text-xs border border-white/20">
              Return to Portal Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: 5-DIMENSION MERIT SCORECARD
  // -------------------------------------------------------------
  if (assessmentStage === "submitted" && evaluation) {
    return (
      <div className="min-h-screen bg-[#071224] text-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
        <div className="w-full max-w-4xl rounded-2xl border border-white/15 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center pb-6 border-b border-white/10">
            <div className="size-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
              <CheckCircle2 className="size-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Talent Readiness Index Verified
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/70 mt-1">
              Evaluated Track: <span className="font-semibold text-blue-400 uppercase">{activeDomainTitle}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-400/30 text-center flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider">
                Total Merit Index
              </span>
              <div className="text-4xl font-extrabold text-white mt-1">
                {evaluation.totalMeritScore}
                <span className="text-lg font-medium text-blue-200/70">/100</span>
              </div>
              <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {evaluation.competencyBadge}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Speed</span>
                <div className="text-xl font-bold text-white mt-1">{formatTime(totalElapsed)}</div>
              </div>
              <p className="text-[11px] text-blue-200/70 mt-2">
                Target Benchmark: 12m 00s ({totalElapsed <= 720 ? "Optimal Speed achieved" : "Moderate Speed"})
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">AI Integrity Trust</span>
                <div className="text-xl font-bold text-white mt-1">{evaluation.trustScore}%</div>
              </div>
              <p className="text-[11px] text-blue-200/70 mt-2">
                {strikes.length === 0 ? "Zero violations (100% Authentic)" : `${strikes.length} warnings logged`}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200 flex items-center gap-2">
              <Sparkles className="size-3.5 text-blue-400" />
              Corporate Audit Breakdown (4 Dimensions):
            </h3>

            <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-black/40 overflow-hidden text-xs">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Tier 1: Core Domain Theory (20 Items)</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Architecture, Memory Models, Protocols & System Design Principles</div>
                </div>
                <div className="text-sm font-bold text-blue-400">+{evaluation.theoryScore} / 25 pts</div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Tier 2: Production Debugging & Bug Triage</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Root cause diagnosis of memory leaks & unhandled promise rejections</div>
                </div>
                <div className="text-sm font-bold text-amber-400">+{evaluation.debuggingScore} / 20 pts</div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Tier 3: Algorithmic Optimization & Complexity</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Detected Runtime: <span className="text-cyan-300 font-mono font-bold">{evaluation.detectedComplexity}</span>
                  </div>
                </div>
                <div className="text-sm font-bold text-cyan-400">+{evaluation.codingScore} / 30 pts</div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Tier 4: System Architecture & Scale Tradeoffs</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">High-concurrency data structure selection & write latency tradeoffs</div>
                </div>
                <div className="text-sm font-bold text-purple-400">+{evaluation.designScore} / 15 pts</div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Tier 5: Execution Pace & Target Benchmark Speed</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Completion within 12m enterprise timeline</div>
                </div>
                <div className="text-sm font-bold text-emerald-400">+{evaluation.speedScore} / 10 pts</div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
                Back to Dashboard
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 4: GUIDELINES & PROCTOR CAMERA GATING
  // -------------------------------------------------------------
  if (assessmentStage === "guidelines") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
        <div className="w-full max-w-3xl rounded-2xl border border-white/15 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              SB
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                AI-Proctored Holistic Talent Assessment
              </h1>
              <p className="text-xs text-blue-200/70">
                Track: <span className="font-semibold text-blue-400 uppercase">{activeDomainTitle}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6">
            <div className="md:col-span-7 space-y-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl border border-amber-400/20 bg-amber-500/10 text-amber-200">
                <span className="font-bold flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="size-4 text-amber-400" />
                  Strict 2-Chance Policy Active
                </span>
                Tab switching, minimizing browser, or copying code triggers strikes. 2 chances allowed. The 3rd strike terminates exam immediately.
              </div>

              <div className="space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
                  4-Tier Evaluation Breakdown:
                </h4>
                <div className="space-y-1.5 text-slate-300">
                  <div>• <strong>Tier 1 (25 pts):</strong> 20 Domain Theory Questions.</div>
                  <div>• <strong>Tier 2 (20 pts):</strong> Production Bug Triage & Fix.</div>
                  <div>• <strong>Tier 3 (30 pts):</strong> O(N) Code Efficiency & Tests.</div>
                  <div>• <strong>Tier 4 (15 pts):</strong> Architecture & Scale Tradeoffs.</div>
                  <div>• <strong>Tier 5 (10 pts):</strong> Target Benchmark Pace.</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-black/40 text-center">
              <div
                className={cn(
                  "relative size-32 rounded-xl overflow-hidden bg-slate-900 border-2 shadow-md mb-3 flex items-center justify-center",
                  cameraStatus === "ready" ? "border-emerald-500" : "border-rose-500"
                )}
              >
                {cameraStatus === "ready" ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                    <div className="absolute inset-1 border border-dashed border-emerald-400/80 rounded pointer-events-none" />
                  </>
                ) : cameraStatus === "denied" ? (
                  <div className="p-2 text-center text-rose-400">
                    <Camera className="size-6 mx-auto mb-1 opacity-60" />
                    <span className="text-[10px] font-bold block leading-tight">Camera Blocked</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 animate-pulse">Checking feed...</div>
                )}
              </div>

              <div
                className={cn(
                  "text-xs font-bold flex items-center gap-1.5",
                  cameraStatus === "ready" ? "text-emerald-400" : "text-rose-400"
                )}
              >
                {cameraStatus === "ready" ? (
                  <>
                    <ShieldCheck className="size-4" />
                    AI Proctor Camera Active
                  </>
                ) : (
                  <>
                    <ShieldAlert className="size-4" />
                    Camera Access Required
                  </>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {cameraStatus === "ready"
                  ? "Maintain center gaze & ensure adequate lighting."
                  : "Please grant camera permission in your browser address bar."}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setAssessmentStage("domain-selection")}
              className="text-xs text-slate-400 hover:text-white"
            >
              Change Domain
            </button>

            <Button
              disabled={cameraStatus !== "ready"}
              onClick={() => setAssessmentStage("testing")}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs px-6"
            >
              {cameraStatus === "ready" ? "Begin Assessment Now" : "Enable Camera to Begin"}
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 5: ACTIVE 4-TIER ASSESSMENT ENGINE
  // -------------------------------------------------------------
  const activeQuestions = studentQuestions.length > 0 ? studentQuestions : generateAntiCheatExamSet(RAW_QUESTION_POOL);
  const currentQ = activeQuestions[currentTheoryIndex] || activeQuestions[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {activeAlert && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 px-6 py-2.5 flex items-center justify-between text-amber-200 text-xs sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-400 shrink-0" />
            <span className="font-semibold">{activeAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveAlert(null)}
            className="text-[10px] uppercase font-bold underline hover:text-white"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* 4-Tier Navigation Header */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-sm text-white tracking-tight">
            SkillBridge 360° Assessment
          </span>

          <div className="flex rounded-lg bg-black/40 p-0.5 text-xs border border-white/10">
            <button
              onClick={() => setActiveTab("theory")}
              className={cn(
                "px-3 py-1 rounded-md font-semibold transition flex items-center gap-1.5",
                activeTab === "theory" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              <BookOpen className="size-3.5" />
              1. Theory ({Object.keys(theoryAnswers).length}/{activeQuestions.length})
            </button>
            <button
              onClick={() => setActiveTab("debugging")}
              className={cn(
                "px-3 py-1 rounded-md font-semibold transition flex items-center gap-1.5",
                activeTab === "debugging" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              <Bug className="size-3.5" />
              2. Bug Triage
            </button>
            <button
              onClick={() => setActiveTab("coding")}
              className={cn(
                "px-3 py-1 rounded-md font-semibold transition flex items-center gap-1.5",
                activeTab === "coding" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              <Code2 className="size-3.5" />
              3. Coding Challenge
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={cn(
                "px-3 py-1 rounded-md font-semibold transition flex items-center gap-1.5",
                activeTab === "architecture" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              <Layers className="size-3.5" />
              4. System Architecture
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-200">
            <Clock className="size-3.5 text-blue-400" />
            <span>Elapsed: {formatTime(totalElapsed)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg text-rose-300">
            <ShieldAlert className="size-3.5 text-rose-400" />
            <span>Strikes: {strikes.length} / 2</span>
          </div>

          <Button
            onClick={handleFinalSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 px-4 shadow-sm"
          >
            Submit All 4 Tiers
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* TIER 1: THEORY BLITZ (20 ANTI-COLLISION QUESTIONS) */}
        {activeTab === "theory" && (
          <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Tier 1 • Question {currentTheoryIndex + 1} of {activeQuestions.length} (Anti-Cheat Seed Active)
                </span>
                <span className="text-xs text-slate-400">
                  Answered: {Object.keys(theoryAnswers).length} / {activeQuestions.length}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">
                {currentQ?.question}
              </h2>

              <div className="space-y-3">
                {currentQ?.options.map((opt) => {
                  const isSelected = theoryAnswers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setTheoryAnswers((prev) => ({ ...prev, [currentQ.id]: opt.id }))
                      }
                      className={cn(
                        "w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition flex items-center justify-between",
                        isSelected
                          ? "border-blue-500 bg-blue-500/10 text-white"
                          : "border-white/10 bg-slate-900/50 text-slate-300 hover:bg-slate-900 hover:border-white/20"
                      )}
                    >
                      <span>{opt.text}</span>
                      <div
                        className={cn(
                          "size-5 rounded-full border flex items-center justify-center text-[10px] font-bold",
                          isSelected
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-white/30 text-slate-400"
                        )}
                      >
                        {opt.id}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <Button
                disabled={currentTheoryIndex === 0}
                onClick={() => setCurrentTheoryIndex((prev) => prev - 1)}
                className="bg-white/5 hover:bg-white/10 text-white text-xs disabled:opacity-30"
              >
                Previous Question
              </Button>
              {currentTheoryIndex < activeQuestions.length - 1 ? (
                <Button
                  onClick={() => setCurrentTheoryIndex((prev) => prev + 1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Next Question
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={() => setActiveTab("debugging")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Proceed to Tier 2: Bug Triage
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* TIER 2: PRODUCTION INCIDENT DEBUGGING */}
        {activeTab === "debugging" && (
          <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Tier 2 • Real-World Production Bug Triage (20 Pts)
                </span>
              </div>

              <h2 className="text-lg font-bold text-white mb-2">{DEBUGGING_SCENARIO.title}</h2>
              <p className="text-xs text-slate-300 whitespace-pre-line mb-4 leading-relaxed">
                {DEBUGGING_SCENARIO.description}
              </p>

              <div className="p-4 rounded-xl bg-black border border-white/15 font-mono text-xs text-emerald-400 mb-6 overflow-x-auto">
                <pre>{DEBUGGING_SCENARIO.buggyCode}</pre>
              </div>

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Root Cause & Defensive Fix Strategy:
              </h3>
              <div className="space-y-3">
                {DEBUGGING_SCENARIO.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDebuggingAnswer(opt.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between",
                      debuggingAnswer === opt.id
                        ? "border-amber-500 bg-amber-500/10 text-white"
                        : "border-white/10 bg-slate-900/50 text-slate-300 hover:bg-slate-900"
                    )}
                  >
                    <span>{opt.text}</span>
                    <span className="text-xs font-bold text-slate-400 ml-3">{opt.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <Button
                onClick={() => setActiveTab("coding")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Proceed to Tier 3: Algorithmic Coding
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* TIER 3: ALGORITHMIC CODING & BIG-O EVALUATION */}
        {activeTab === "coding" && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            <div className="lg:col-span-5 border-r border-white/10 p-6 flex flex-col justify-between overflow-y-auto bg-slate-900/40">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Target: O(N) Efficiency
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Zap className="size-3.5 text-amber-400" />
                    Benchmark: 5m 00s
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white mb-3">{CODING_DATA.title}</h2>
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line mb-6">
                  {CODING_DATA.description}
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Validation Test Cases:
                </h4>
                <div className="space-y-2">
                  {CODING_DATA.testCases.map((tc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-black/50 border border-white/10 text-xs font-mono"
                    >
                      <div className="text-slate-400">Input: <span className="text-white">{tc.input}</span></div>
                      <div className="text-slate-400">Expected: <span className="text-emerald-400">{tc.expected}</span></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-4">
                <div className="relative size-20 rounded-xl overflow-hidden bg-black border-2 border-emerald-500 shadow-md">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute inset-1 border border-dashed border-emerald-400/80 rounded pointer-events-none" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <Eye className="size-3.5" />
                    <span>AI Monitoring Active</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                    Tab switches & copy-paste actions are audited continuously.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col bg-black">
              <div className="px-4 py-2 border-b border-white/10 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2 font-mono">
                  <Terminal className="size-3.5 text-blue-400" />
                  <span>solution.js</span>
                </div>
                <span className="text-[11px] text-slate-500">Complexity Evaluation Engine Active</span>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 w-full bg-slate-950 p-4 font-mono text-xs text-emerald-300 focus:outline-none resize-none leading-relaxed"
              />

              <div className="p-3 border-t border-white/10 bg-slate-900/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  Clipboard locked • Right-click disabled
                </span>
                <Button
                  onClick={() => setActiveTab("architecture")}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-4"
                >
                  Proceed to Tier 4: System Architecture
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TIER 4: SYSTEM ARCHITECTURE & SCALE TRADEOFF */}
        {activeTab === "architecture" && (
          <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Tier 4 • Scalability & Distributed Systems (15 Pts)
                </span>
              </div>

              <h2 className="text-lg font-bold text-white mb-2">{SYSTEM_DESIGN_SCENARIO.title}</h2>
              <p className="text-xs text-slate-300 whitespace-pre-line mb-6 leading-relaxed">
                {SYSTEM_DESIGN_SCENARIO.scenario}
              </p>

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Architectural Evaluation:
              </h3>
              <div className="space-y-3">
                {SYSTEM_DESIGN_SCENARIO.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSystemDesignAnswer(opt.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between",
                      systemDesignAnswer === opt.id
                        ? "border-purple-500 bg-purple-500/10 text-white"
                        : "border-white/10 bg-slate-900/50 text-slate-300 hover:bg-slate-900"
                    )}
                  >
                    <span>{opt.text}</span>
                    <span className="text-xs font-bold text-slate-400 ml-3">{opt.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <Button
                onClick={handleFinalSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6"
              >
                Submit All & Generate Merit Matrix
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}