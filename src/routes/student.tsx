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
  ArrowLeft,
  BookOpen,
  Code2,
  ShieldCheck,
  Search,
  Bug,
  Layers,
  Briefcase,
  TrendingUp,
  Loader2,
  Hand,
  UserCheck,
  FolderGit2,
  Award,
  RefreshCw,
  Compass,
  MessageSquare,
  Lock,
  Unlock,
  Target,
  CheckSquare,
  Square,
  Star,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAppState } from "@/lib/app-state";
import { LanguageSelector } from "@/components/LanguageSelector";

export const Route = createFileRoute("/student")({
  component: StudentAssessmentEngine,
});

// -------------------------------------------------------------
// 1. ALL 36 COMPREHENSIVE DOMAIN TRACKS (COMPLETE LIST)
// -------------------------------------------------------------
const DOMAIN_OPTIONS = [
  // SOFTWARE & SYSTEM ENGINEERING
  { id: "fullstack-web", title: "Full Stack Web Development", category: "Software Development", desc: "MERN/Next.js, Spring Boot, REST APIs, Microservices, System Design", badge: "Most Popular" },
  { id: "frontend-dev", title: "Frontend Engineering", category: "Software Development", desc: "React, Angular, Vue, TypeScript, Next.js, Web Performance & UI/UX", badge: "High Demand" },
  { id: "backend-dev", title: "Backend Systems Architecture", category: "Software Development", desc: "Java, Node.js, Go, Python Django, Distributed DBs, Caching, Kafka", badge: "Core Tech" },
  { id: "mobile-dev", title: "Mobile App Engineering", category: "Software Development", desc: "Flutter, React Native, Native Android (Kotlin), iOS (Swift)", badge: "Industry" },
  { id: "game-dev", title: "Game Design & Development", category: "Software Development", desc: "Unity, Unreal Engine 5, C#, C++, 3D Shaders, Physics Engines", badge: "Creative Tech" },
  { id: "software-testing", title: "QA & Test Automation Engineering", category: "Software Development", desc: "Selenium, Cypress, Playwright, API Testing, Performance (JMeter)", badge: "High Demand" },
  { id: "api-microservices", title: "API & Microservices Architecture", category: "Software Development", desc: "gRPC, GraphQL, REST, API Gateways, Event-Driven Systems", badge: "Enterprise" },

  // DATA & ARTIFICIAL INTELLIGENCE
  { id: "ai-ml", title: "Artificial Intelligence & Machine Learning", category: "Data & AI", desc: "Supervised/Unsupervised Models, Scikit-learn, Neural Networks, PyTorch", badge: "Trending" },
  { id: "gen-ai", title: "Generative AI & LLM Systems", category: "Data & AI", desc: "LangChain, RAG Pipelines, Vector DBs, Prompt Engineering, Fine-Tuning", badge: "Frontier" },
  { id: "deep-learning-cv", title: "Deep Learning & Computer Vision", category: "Data & AI", desc: "CNNs, YOLO, OpenCV, Image Segmentation, Video Analytics", badge: "Specialized" },
  { id: "nlp-speech", title: "NLP & Conversational Systems", category: "Data & AI", desc: "Transformers, BERT, Speech-to-Text, Sentiment Analysis, Tokenization", badge: "Specialized" },
  { id: "data-science", title: "Data Science & Statistical Analytics", category: "Data & AI", desc: "Python, R, Exploratory Analysis, Predictive Modeling, Hypothesis Testing", badge: "High Demand" },
  { id: "data-engineering", title: "Data Engineering & Big Data Systems", category: "Data & AI", desc: "Apache Spark, Kafka, Snowflake, Databricks, BigQuery, ETL Pipelines", badge: "Enterprise" },
  { id: "bi-analytics", title: "Business Intelligence & Data Visualization", category: "Data & AI", desc: "Power BI, Tableau, Advanced SQL, Data Warehousing, Metric Dashboards", badge: "Corporate" },

  // CLOUD & INFRASTRUCTURE
  { id: "cloud-architecture", title: "Cloud Architecture (AWS / Azure / GCP)", category: "Cloud & DevOps", desc: "VPC, IAM, Serverless (Lambda), Cloud Security, High Availability Systems", badge: "Enterprise" },
  { id: "devops-sre", title: "DevOps & Site Reliability Engineering (SRE)", category: "Cloud & DevOps", desc: "Docker, Kubernetes, CI/CD Actions, Terraform, Linux Admin, Prometheus", badge: "High Demand" },
  { id: "system-admin", title: "Linux Systems & Enterprise Networking", category: "Cloud & DevOps", desc: "Bash Scripting, DNS, TCP/IP, Active Directory, Server Hardening", badge: "Core" },

  // CYBERSECURITY
  { id: "ethical-hacking", title: "Ethical Hacking & Penetration Testing", category: "Cybersecurity", desc: "VAPT, Metasploit, Burp Suite, Network Vulnerabilities, Bug Bounty", badge: "High Demand" },
  { id: "cyber-defense", title: "SOC Operations & Threat Intelligence", category: "Cybersecurity", desc: "SIEM (Splunk), Incident Response, Log Analysis, Malware Triage", badge: "Security" },
  { id: "cloud-security", title: "Cloud Security & DevSecOps", category: "Cybersecurity", desc: "OWASP Top 10, Container Security, SonarQube, Zero Trust Architecture", badge: "Enterprise" },
  { id: "cryptography-web3", title: "Cryptography & Blockchain Engineering", category: "Cybersecurity", desc: "Solidity, Smart Contracts, Ethereum, EVM, Public-Key Infrastructure", badge: "Emerging" },

  // CORE HARDWARE & ELECTRONICS (ECE / EEE)
  { id: "embedded-systems", title: "Embedded Systems & Firmware Engineering", category: "Core Hardware", desc: "Embedded C/C++, ARM Cortex, FreeRTOS, Microcontrollers (ESP32/STM32)", badge: "Core ECE" },
  { id: "vlsi-design", title: "VLSI Design & RTL Verification", category: "Core Hardware", desc: "Verilog, SystemVerilog, UVM, FPGA Synthesis, Static Timing Analysis", badge: "High Package" },
  { id: "iot-robotics", title: "Internet of Things (IoT) & Smart Sensors", category: "Core Hardware", desc: "MQTT, Sensor Interfacing, Edge Computing, Raspberry Pi, LoRaWAN", badge: "Modern Hardware" },
  { id: "robotics-automation", title: "Robotics & Autonomous Systems", category: "Core Hardware", desc: "ROS (Robot Operating System), Kinematics, SLAM, PID Controllers", badge: "Research" },
  { id: "pcb-hardware", title: "PCB Design & Hardware Architecture", category: "Core Hardware", desc: "Altium, KiCAD, High-Speed Routing, Circuit Simulation (SPICE)", badge: "Core ECE" },
  { id: "power-systems-ev", title: "Electric Vehicles (EV) & Power Electronics", category: "Core Hardware", desc: "BMS (Battery Management), Inverters, Motor Controllers, Power Grids", badge: "Core EEE" },

  // MECHANICAL, AEROSPACE & SIMULATION
  { id: "cad-cam-design", title: "CAD / CAM & Mechanical Product Design", category: "Core Mechanical", desc: "SolidWorks, CATIA, GD&T, Rapid Prototyping, Sheet Metal Design", badge: "Core Mech" },
  { id: "fea-cfd-analysis", title: "FEA & CFD Thermal Simulation", category: "Core Mechanical", desc: "ANSYS Mechanical, Fluent, Aerodynamics, Stress Analysis, Meshing", badge: "Simulation" },
  { id: "industrial-automation", title: "Industrial Automation & PLC / SCADA", category: "Core Mechanical", desc: "Siemens PLC, Ladder Logic, Hydraulics, Pneumatics, Industry 4.0", badge: "Manufacturing" },

  // CIVIL & GEOSPATIAL
  { id: "structural-engineering", title: "Structural Analysis & BIM Design", category: "Core Civil", desc: "ETABS, STAAD Pro, Revit BIM, Concrete Design, Seismic Analysis", badge: "Core Civil" },
  { id: "gis-remote-sensing", title: "Geospatial Data Science & GIS", category: "Core Civil", desc: "ArcGIS, QGIS, Satellite Imagery Analysis, Spatial Mapping", badge: "Geospatial" },

  // DESIGN & PRODUCT
  { id: "ui-ux-design", title: "UI/UX & Digital Product Design", category: "Design & Product", desc: "Figma, User Journey Mapping, Wireframing, Design Systems, Usability", badge: "Creative" },
  { id: "product-management", title: "Technical Product Management (APM)", category: "Design & Product", desc: "PRDs, Agile/Scrum Sprints, Feature Roadmaps, Product Analytics", badge: "Management" },
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
// 2. COMPLETE 20-QUESTION POOL (TOPIC-MAPPED FOR SKILL GAPS)
// -------------------------------------------------------------
interface ProcessedQuestion {
  id: string;
  topic: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

const MASTER_QUESTION_POOL: ProcessedQuestion[] = [
  { id: "q-1", topic: "Memory Management", question: "In the JavaScript V8 engine, where are object references and execution contexts stored?", options: [{ id: "A", text: "Stack for execution context, Heap for objects" }, { id: "B", text: "Heap for all primitives and closures" }, { id: "C", text: "Stack holds all variables exclusively" }, { id: "D", text: "Directly in OS Virtual Memory" }], correctAnswer: "A" },
  { id: "q-2", topic: "Databases & Indexing", question: "What is the primary advantage of B-Tree indices over Hash indices in relational databases?", options: [{ id: "A", text: "Faster O(1) single-point lookups" }, { id: "B", text: "Efficient range scans (BETWEEN, >, <)" }, { id: "C", text: "Zero disk footprint on persistent storage" }, { id: "D", text: "Automatic table denormalization" }], correctAnswer: "B" },
  { id: "q-3", topic: "Protocols & Web APIs", question: "Which HTTP status code signifies that a client must authenticate itself to get the requested response?", options: [{ id: "A", text: "403 Forbidden" }, { id: "B", text: "401 Unauthorized" }, { id: "C", text: "400 Bad Request" }, { id: "D", text: "422 Unprocessable Entity" }], correctAnswer: "B" },
  { id: "q-4", topic: "Distributed Systems", question: "What problem does the CAP Theorem state distributed data stores cannot simultaneously achieve?", options: [{ id: "A", text: "Consistency, Availability, and Partition Tolerance" }, { id: "B", text: "Concurrency, Atomicity, and Performance" }, { id: "C", text: "Caching, Availability, and Persistence" }, { id: "D", text: "Throughput, Latency, and Scalability" }], correctAnswer: "A" },
  { id: "q-5", topic: "Data Structures & Big-O", question: "What is the time complexity to insert an element into an existing Min-Heap of size N?", options: [{ id: "A", text: "O(1)" }, { id: "B", text: "O(log N)" }, { id: "C", text: "O(N)" }, { id: "D", text: "O(N log N)" }], correctAnswer: "B" },
  { id: "q-6", topic: "Frontend Architecture", question: "In React, why must hooks only be called at the top level and not inside loops or conditions?", options: [{ id: "A", text: "To preserve call order across renders for internal linked-lists" }, { id: "B", text: "To prevent memory leaks in V8 garbage collection" }, { id: "C", text: "React compiler converts hooks to global window variables" }, { id: "D", text: "Loops force hooks to execute in parallel threads" }], correctAnswer: "A" },
  { id: "q-7", topic: "Databases & Indexing", question: "Which SQL isolation level protects against both Dirty Reads and Non-Repeatable Reads?", options: [{ id: "A", text: "Read Uncommitted" }, { id: "B", text: "Read Committed" }, { id: "C", text: "Repeatable Read" }, { id: "D", text: "Snapshot Read Only" }], correctAnswer: "C" },
  { id: "q-8", topic: "DevOps & Infrastructure", question: "What is the fundamental purpose of a Reverse Proxy (e.g., NGINX)?", options: [{ id: "A", text: "Cache client-side browser cookies" }, { id: "B", text: "Distribute incoming traffic and terminate SSL before upstream servers" }, { id: "C", text: "Compile frontend TypeScript into JavaScript" }, { id: "D", text: "Directly execute SQL stored procedures" }], correctAnswer: "B" },
  { id: "q-9", topic: "DevOps & Infrastructure", question: "In Docker containerization, how does a container differ fundamentally from a Virtual Machine (VM)?", options: [{ id: "A", text: "Containers share the host OS kernel and use cgroups/namespaces" }, { id: "B", text: "Containers emulate complete virtual hardware and BIOS" }, { id: "C", text: "Containers require a Type-1 Hypervisor on bare metal" }, { id: "D", text: "Containers cannot communicate over TCP/IP networks" }], correctAnswer: "A" },
  { id: "q-10", topic: "Application Security", question: "What security vulnerability occurs when user input is directly concatenated into a dynamic SQL query?", options: [{ id: "A", text: "Cross-Site Scripting (XSS)" }, { id: "B", text: "SQL Injection (SQLi)" }, { id: "C", text: "Cross-Site Request Forgery (CSRF)" }, { id: "D", text: "Buffer Overflow" }], correctAnswer: "B" },
  { id: "q-11", topic: "Databases & Indexing", question: "In Redis, what is the default eviction policy when maxmemory is reached without specified keys?", options: [{ id: "A", text: "noeviction (returns error on writes)" }, { id: "B", text: "allkeys-lru" }, { id: "C", text: "volatile-random" }, { id: "D", text: "volatile-ttl" }], correctAnswer: "A" },
  { id: "q-12", topic: "Distributed Systems", question: "What is the primary role of a Vector Database in Generative AI architectures?", options: [{ id: "A", text: "Indexing high-dimensional embeddings for cosine similarity retrieval" }, { id: "B", text: "Compressing LLM weights for mobile execution" }, { id: "C", text: "Executing SQL window functions on text" }, { id: "D", text: "Parsing JSON payloads from webhooks" }], correctAnswer: "A" },
  { id: "q-13", topic: "Databases & Indexing", question: "What does the ACID 'I' stand for in database transaction properties?", options: [{ id: "A", text: "Integrity" }, { id: "B", text: "Isolation" }, { id: "C", text: "Immutability" }, { id: "D", text: "Indexing" }], correctAnswer: "B" },
  { id: "q-14", topic: "Application Security", question: "Which cryptographic algorithm is based on asymmetric public-private keypairs?", options: [{ id: "A", text: "AES-256" }, { id: "B", text: "RSA" }, { id: "C", text: "DES" }, { id: "D", text: "Blowfish" }], correctAnswer: "B" },
  { id: "q-15", topic: "DevOps & Infrastructure", question: "In Git, what does 'git rebase' do compared to 'git merge'?", options: [{ id: "A", text: "Reapplies commits on top of another base tip for a linear history" }, { id: "B", text: "Creates a 3-way merge commit combining divergent trees" }, { id: "C", text: "Permanently destroys remote branches" }, { id: "D", text: "Pushes code directly to production without testing" }], correctAnswer: "A" },
  { id: "q-16", topic: "Data Structures & Big-O", question: "What is the space complexity of an in-place QuickSort algorithm on average?", options: [{ id: "A", text: "O(1)" }, { id: "B", text: "O(log N) auxiliary stack space" }, { id: "C", text: "O(N) contiguous array allocation" }, { id: "D", text: "O(N^2) recursive frames" }], correctAnswer: "B" },
  { id: "q-17", topic: "Protocols & Web APIs", question: "In RESTful API design, which method is expected to be idempotent?", options: [{ id: "A", text: "POST" }, { id: "B", text: "PUT" }, { id: "C", text: "PATCH (without precondition)" }, { id: "D", text: "CONNECT" }], correctAnswer: "B" },
  { id: "q-18", topic: "Protocols & Web APIs", question: "Which protocol operates at the Transport Layer (Layer 4) providing reliable ordered delivery?", options: [{ id: "A", text: "IP" }, { id: "B", text: "TCP" }, { id: "C", text: "HTTP" }, { id: "D", text: "DNS" }], correctAnswer: "B" },
  { id: "q-19", topic: "Memory Management", question: "What is the primary cause of a 'Race Condition' in concurrent programming?", options: [{ id: "A", text: "Multiple threads accessing shared mutable state without proper synchronization" }, { id: "B", text: "CPU clock speed running faster than RAM bus speed" }, { id: "C", text: "Garbage collection pausing the main execution thread" }, { id: "D", text: "Stack overflow due to infinite recursion" }], correctAnswer: "A" },
  { id: "q-20", topic: "Frontend Architecture", question: "What design pattern defines a one-to-many dependency so when one object changes, all dependents are updated?", options: [{ id: "A", text: "Singleton Pattern" }, { id: "B", text: "Observer Pattern" }, { id: "C", text: "Factory Pattern" }, { id: "D", text: "Adapter Pattern" }], correctAnswer: "B" },
];

const DEBUGGING_SCENARIO = {
  title: "Production Incident: Memory Leak & Unhandled Promise in Webhook Handler",
  description: `A Node.js microservice handling high-volume payment webhooks crashes every 4 hours with:
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory.

Audit the code snippet below. Identify the root cause and propose the defensive fix.`,
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
    { id: "A", text: "Global auditLogCache array grows unbounded in RAM without TTL or DB offloading, and processTransaction is unawaited, causing silent unhandled rejection crashes." },
    { id: "B", text: "The HTTP status code 200 is invalid for webhooks and should be replaced with HTTP 201." },
    { id: "C", text: "req.body should be converted to Base64 before pushing to prevent UTF-8 encoding overflow." },
    { id: "D", text: "Express does not support async route handlers without third-party Babel plugins." },
  ],
  correctAnswer: "A",
};

const CODING_DATA = {
  title: "Optimized Target Pair Finder (Two-Sum)",
  expectedComplexity: "O(N) Linear Time",
  description: `Given an array of integers 'nums' and an integer 'target', return indices of the two numbers such that they add up to target.

Requirements:
- Your solution must run in O(N) time complexity using a single traversal with a Hash Map.
- Brute-force nested loops O(N^2) will be penalized in the efficiency score.
- Must cleanly handle edge cases.`,
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
  ],
};

const SYSTEM_DESIGN_SCENARIO = {
  title: "Tier 4: Architecture Tradeoff - Live Leaderboard at Scale",
  scenario: `Your platform needs to support a real-time leaderboard for 5 million active users during a nationwide campus hiring drive. The system must support:
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
// 3. TARGETED ACTION GUIDES, CAPSTONES & MENTORS
// -------------------------------------------------------------
const TOPIC_ACTION_GUIDES: Record<string, { actionSteps: string[]; recommendedProjectTitle: string; projectDetails: string }> = {
  "Memory Management": {
    actionSteps: [
      "Deep dive into V8 Garbage Collection phases (Scavenge nursery vs Mark-Sweep-Compact tenured space)",
      "Profile real-time memory leaks using Chrome DevTools Memory Inspector & Heap Snapshots",
      "Avoid memory retention anti-patterns (unbounded global arrays, detached DOM trees, uncleared intervals)",
    ],
    recommendedProjectTitle: "Production Heap Profiler & Event Listener Leak Sentinel",
    projectDetails: "Construct an autonomous Node.js service monitoring process.memoryUsage() that dumps heap snapshots upon 85% RAM saturation.",
  },
  "Databases & Indexing": {
    actionSteps: [
      "Understand B-Tree node branching factors vs Hash index point lookup constraints",
      "Analyze query execution plans with EXPLAIN (ANALYZE, BUFFERS) to eliminate sequential table scans",
      "Design multi-column composite indexes following the Leftmost Prefix Indexing rule",
    ],
    recommendedProjectTitle: "High-Throughput Relational Query Index Optimizer",
    projectDetails: "Optimize a 2-million record PostgreSQL transactional database from 940ms query execution down to sub-10ms with composite indexes.",
  },
  "Distributed Systems": {
    actionSteps: [
      "Master CAP Theorem latency-consistency trade-offs (CP vs AP distributed configurations)",
      "Implement Redis Sorted Sets (ZSET) SkipList mechanics for O(log N) leaderboard indexing",
      "Decouple stateful operations through distributed commit logs (Apache Kafka / RabbitMQ)",
    ],
    recommendedProjectTitle: "Real-Time Distributed Leaderboard Engine with WebSockets & Redis",
    projectDetails: "Architect an in-memory ranking service supporting 100,000 active concurrent connections with sub-30ms rank retrieval latency.",
  },
  "Protocols & Web APIs": {
    actionSteps: [
      "Understand HTTP/2 multiplexed streams vs HTTP/1.1 Head-of-Line blocking",
      "Build truly idempotent REST APIs using unique client idempotency keys stored in Redis",
      "Configure Reverse Proxy SSL termination, HTTP keep-alive, and connection pooling on NGINX",
    ],
    recommendedProjectTitle: "High-Concurrency Layer-7 API Gateway & Rate Limiter",
    projectDetails: "Build an edge reverse proxy in Go or Node.js implementing Token Bucket rate limiting and upstream failover circuit breakers.",
  },
  "Data Structures & Big-O": {
    actionSteps: [
      "Master Hash Map collision resolution (Separate Chaining vs Open Addressing)",
      "Implement Priority Queues with Min-Heaps for top-K streaming elements in O(N log K)",
      "Apply Two-Pointer and Sliding Window paradigms to eliminate nested quadratic O(N^2) loops",
    ],
    recommendedProjectTitle: "In-Memory Sliding Window Log Rate Limiter",
    projectDetails: "Implement an algorithmic sliding-window rate limiter handling 30,000 requests/sec with exact time-window compliance.",
  },
  "Application Security": {
    actionSteps: [
      "Prevent SQL Injection via strict parameterized queries and ORM prepared statements",
      "Implement asymmetric RSA / ECC cryptography for digital credential verification",
      "Harden web endpoints with CSP headers, sanitized inputs, and Zero Trust Token architecture",
    ],
    recommendedProjectTitle: "Zero-Trust Web Security & Vulnerability Auditing Gateway",
    projectDetails: "Develop an automated security middleware that scans API payloads for SQLi, XSS vectors, and enforce cryptographic request signatures.",
  },
  "DevOps & Infrastructure": {
    actionSteps: [
      "Master Linux cgroups and namespaces governing Docker container process isolation",
      "Construct multi-stage Dockerfiles minimizing production container images by 70%",
      "Automate end-to-end CI/CD testing pipelines with GitHub Actions and container registries",
    ],
    recommendedProjectTitle: "Self-Healing Container Deployment Pipeline & Metrics Exporter",
    projectDetails: "Build a GitHub Actions CI/CD deployment pipeline with Docker containerization, automated testing, and Prometheus health telemetry.",
  },
  "Frontend Architecture": {
    actionSteps: [
      "Study React fiber reconciliation, render passes, and hook linked-list indices",
      "Optimize web vital metrics (LCP, FID, CLS) using code splitting and lazy asset loading",
      "Structure enterprise global state using clean unidirectional data flow patterns",
    ],
    recommendedProjectTitle: "High-Performance Interactive Virtualized Data Grid",
    projectDetails: "Develop a virtualized DOM table handling 50,000 live streaming rows with 60 FPS scrolling and zero frame drops.",
  },
};

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  specializationTopic: string;
  rating: number;
  activeMentees: number;
  matchScore: number;
  bio: string;
  availableDays: string;
}

const PLATFORM_MENTORS: Mentor[] = [
  {
    id: "m-1",
    name: "Arjun Venkat",
    role: "Staff Backend Architect",
    company: "Razorpay / ex-Amazon",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    specializationTopic: "Memory Management",
    rating: 4.9,
    activeMentees: 28,
    matchScore: 97,
    bio: "Specializes in high-throughput node runtime bottlenecks, heap dump telemetry, and async execution frames.",
    availableDays: "Tue, Thu, Sat (Evening)",
  },
  {
    id: "m-2",
    name: "Pooja Sundaram",
    role: "Principal Data Systems Architect",
    company: "Swiggy Labs",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    specializationTopic: "Databases & Indexing",
    rating: 4.95,
    activeMentees: 34,
    matchScore: 94,
    bio: "Authority on PostgreSQL query planning, LSM storage trees, partition scaling, and transaction isolation.",
    availableDays: "Mon, Wed, Fri",
  },
  {
    id: "m-3",
    name: "Siddharth Verma",
    role: "Cloud Systems Lead",
    company: "Microsoft Azure",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    specializationTopic: "Distributed Systems",
    rating: 4.88,
    activeMentees: 19,
    matchScore: 92,
    bio: "Deep expertise in consistent hashing, distributed consensus, Redis SkipLists, and event bus infrastructure.",
    availableDays: "Sat, Sun (Afternoon)",
  },
  {
    id: "m-4",
    name: "Meera Krishnan",
    role: "Lead API Infrastructure Engineer",
    company: "Razorpay",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    specializationTopic: "Protocols & Web APIs",
    rating: 4.92,
    activeMentees: 22,
    matchScore: 90,
    bio: "Specialist in idempotent payments infrastructure, HTTP/2 multiplexing, and NGINX reverse-proxy clusters.",
    availableDays: "Wed, Thu, Sat",
  },
  {
    id: "m-5",
    name: "Vikram Malhotra",
    role: "Senior Algorithms Engineer",
    company: "Google / ex-Flipkart",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    specializationTopic: "Data Structures & Big-O",
    rating: 4.96,
    activeMentees: 45,
    matchScore: 96,
    bio: "Focuses on linear algorithmic restructuring, priority heap optimization, and cache-locality data layout.",
    availableDays: "Tue, Fri, Sun",
  },
  {
    id: "m-6",
    name: "Rohan Kulkarni",
    role: "Principal DevSecOps Architect",
    company: "Palo Alto Networks",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    specializationTopic: "Application Security",
    rating: 4.91,
    activeMentees: 20,
    matchScore: 91,
    bio: "Zero Trust architecture, public-key verification algorithms, and container runtime threat analysis.",
    availableDays: "Mon, Thu, Sat",
  },
  {
    id: "m-7",
    name: "Ananya Deshmukh",
    role: "Staff SRE & Platform Architect",
    company: "PhonePe",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    specializationTopic: "DevOps & Infrastructure",
    rating: 4.89,
    activeMentees: 26,
    matchScore: 93,
    bio: "Kubernetes orchestration, automated canary releases, Linux kernel cgroups, and Prometheus alerting.",
    availableDays: "Tue, Thu, Sun",
  },
  {
    id: "m-8",
    name: "Karthik Subramanian",
    role: "Principal UI Systems Engineer",
    company: "Uber Engineering",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    specializationTopic: "Frontend Architecture",
    rating: 4.94,
    activeMentees: 38,
    matchScore: 95,
    bio: "V8 memory models, React concurrency, micro-frontend federation, and high-FPS canvas rendering.",
    availableDays: "Wed, Fri, Sat",
  },
];

interface ImprovementWeek {
  weekNumber: number;
  title: string;
  focusTopic: string;
  milestones: { id: string; text: string; done: boolean }[];
}

interface Internship {
  id: string;
  role: string;
  company: string;
  stipend: string;
  location: string;
  minCutoff: number;
  skillsNeeded: string[];
}

const INTERNSHIP_CATALOG: Internship[] = [
  { id: "int-1", role: "Junior Software Engineer Intern", company: "Zomato / Blinkit", stipend: "₹35,000 / month", location: "Hybrid (Bengaluru)", minCutoff: 65, skillsNeeded: ["JavaScript", "REST APIs", "SQL"] },
  { id: "int-2", role: "Backend Systems Trainee", company: "Razorpay", stipend: "₹45,000 / month", location: "Bengaluru", minCutoff: 75, skillsNeeded: ["Node.js / Java", "Redis", "Distributed DB"] },
  { id: "int-3", role: "Full Stack Developer Associate", company: "Swiggy Labs", stipend: "₹40,000 / month", location: "Hyderabad", minCutoff: 70, skillsNeeded: ["React", "TypeScript", "Microservices"] },
  { id: "int-4", role: "AI / Data Science Trainee", company: "Fractal Analytics", stipend: "₹32,000 / month", location: "Mumbai / Hybrid", minCutoff: 70, skillsNeeded: ["Python", "PyTorch", "Data Pipelines"] },
  { id: "int-5", role: "Cloud & DevOps Apprentice", company: "Jio Platforms", stipend: "₹28,000 / month", location: "Hyderabad", minCutoff: 60, skillsNeeded: ["Docker", "Linux", "CI/CD"] },
  { id: "int-6", role: "Core Embedded & VLSI Trainee", company: "Qualcomm / Texas Instruments", stipend: "₹50,000 / month", location: "Bengaluru", minCutoff: 80, skillsNeeded: ["Embedded C", "ARM", "Verilog"] },
];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function StudentAssessmentEngine() {
  const { userEmail } = useAppState();

  // Workflow Stages:
  // 1. Domain -> 2. Guidelines -> 3. Testing -> 4. Result/Gaps -> 5. Mentor Hub -> 6. Placements
  const [assessmentStage, setAssessmentStage] = useState<
    "domain-selection" | "guidelines" | "testing" | "result-gaps" | "mentor-hub" | "placements"
  >("domain-selection");

  const [selectedDomain, setSelectedDomain] = useState<string>("fullstack-web");
  const [customDomainText, setCustomDomainText] = useState("");
  const [domainSearch, setDomainSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [activeTab, setActiveTab] = useState<"theory" | "debugging" | "coding" | "architecture">("theory");

  // Questions and Real Answers
  const [studentQuestions, setStudentQuestions] = useState<ProcessedQuestion[]>([]);
  const [theoryAnswers, setTheoryAnswers] = useState<Record<string, string>>({});
  const [currentTheoryIndex, setCurrentTheoryIndex] = useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Other Tiers States
  const [debuggingAnswer, setDebuggingAnswer] = useState<string | null>(null);
  const [code, setCode] = useState(CODING_DATA.initialCode);
  const [systemDesignAnswer, setSystemDesignAnswer] = useState<string | null>(null);

  // Proctoring & Anti-Cheat
  const [cameraStatus, setCameraStatus] = useState<"checking" | "ready" | "denied">("checking");
  const [totalElapsed, setTotalElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [strikes, setStrikes] = useState<string[]>([]);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Vision Gaze & Hand Gesture Tracking States
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gazeStatus, setGazeStatus] = useState<"Center" | "Looking Left" | "Looking Right" | "Looking Down">("Center");
  const [handGestureDetected, setHandGestureDetected] = useState(false);
  const gazeOffscreenCount = useRef(0);
  const lastPixelData = useRef<Uint8ClampedArray | null>(null);

  // Evaluation & Gaps
  const [evaluation, setEvaluation] = useState<{
    totalMeritScore: number;
    theoryScore: number;
    debuggingScore: number;
    codingScore: number;
    designScore: number;
    speedScore: number;
    trustScore: number;
    detectedComplexity: string;
    competencyBadge: string;
    strongSkills: string[];
    weakSkills: string[];
    topicGaps: { topic: string; correct: number; total: number; percentage: number; status: "Strong" | "Average" | "Needs Improvement" }[];
  } | null>(null);

  // Mentor & Improvement Plan Gating
  const [assignedMentor, setAssignedMentor] = useState<Mentor | null>(null);
  const [mentorSessionBooked, setMentorSessionBooked] = useState(false);
  const [improvementPlan, setImprovementPlan] = useState<ImprovementWeek[]>([]);
  const [readinessScore, setReadinessScore] = useState(35); // Increases as student checks off milestones

  // Dynamic Question Retrieval & Shuffling
  const handleProceedToGuidelines = async () => {
    if (!selectedDomain) return;
    setIsLoadingQuestions(true);

    try {
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

      let query = supabase.from("assessment_questions").select("*").eq("role_id", selectedDomain);
      if (usedIds.length > 0) query = query.not("id", "in", `(${usedIds.join(",")})`);

      const { data: dbQuestions, error } = await query.limit(20);

      let poolToUse = MASTER_QUESTION_POOL;
      if (!error && dbQuestions && dbQuestions.length >= 10) {
        poolToUse = dbQuestions.map((q: any) => ({
          id: q.id,
          topic: q.topic || "Core Concepts",
          question: q.prompt,
          options: q.options || [],
          correctAnswer: q.correct_answer || "A",
        }));
      }

      const shuffled = shuffle(poolToUse).map((q) => {
        const originalCorrect = q.options.find((opt) => opt.id === q.correctAnswer);
        const shuffledOptions = shuffle(q.options);
        let newCorrectLetter = "A";

        const mappedOptions = shuffledOptions.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          if (originalCorrect && opt.text === originalCorrect.text) {
            newCorrectLetter = letter;
          }
          return { id: letter, text: opt.text };
        });

        return {
          ...q,
          options: mappedOptions,
          correctAnswer: newCorrectLetter,
        };
      });

      setStudentQuestions(shuffled);
      setTheoryAnswers({});
      setDebuggingAnswer(null);
      setSystemDesignAnswer(null);
      setTotalElapsed(0);
      setStrikes([]);
      setCurrentTheoryIndex(0);
    } catch (err) {
      setStudentQuestions(shuffle(MASTER_QUESTION_POOL));
    } finally {
      setIsLoadingQuestions(false);
      setAssessmentStage("guidelines");
    }
  };

  // Camera Activation
  useEffect(() => {
    if (assessmentStage !== "guidelines" && assessmentStage !== "testing") return;
    let stream: MediaStream | null = null;
    setCameraStatus("checking");

    navigator.mediaDevices?.getUserMedia({ video: { width: 320, height: 240 }, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
        setCameraStatus("ready");
      })
      .catch(() => {
        setCameraStatus("denied");
        toast.error("Camera Required", { description: "Camera access is compulsory for verification." });
      });

    return () => { stream?.getTracks().forEach((track) => track.stop()); };
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

  // Strike System
  const registerStrike = useCallback(
    (reason: string) => {
      if (isDisqualified || assessmentStage !== "testing") return;
      const logEntry = `${reason} — ${new Date().toLocaleTimeString()}`;

      setStrikes((prev) => {
        const next = [...prev, logEntry];
        if (next.length === 1) {
          setActiveAlert("Strike 1/2: Integrity Violation Logged. 1 chance remaining!");
          toast.warning("Warning 1/2: Rule Violated!", { description: reason });
        } else if (next.length === 2) {
          setActiveAlert("CRITICAL WARNING 2/2: Next violation will terminate your test!");
          toast.error("Critical Strike 2/2!", { description: `${reason}. Final notice!` });
        } else if (next.length >= 3) {
          setIsDisqualified(true);
          toast.error("Assessment Revoked!", { description: "Maximum policy infractions reached." });
        }
        return next;
      });
    },
    [isDisqualified, assessmentStage]
  );

  // Real-Time Eye Gaze & Hand Gesture Detection Loop
  useEffect(() => {
    if (assessmentStage !== "testing" || isDisqualified) return;

    const visionInterval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== 4) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = 160;
      canvas.height = 120;
      ctx.drawImage(video, 0, 0, 160, 120);

      const frame = ctx.getImageData(0, 0, 160, 120);
      const data = frame.data;

      let leftWeight = 0;
      let rightWeight = 0;
      let lowerWeight = 0;
      let motionDiffCount = 0;

      for (let y = 0; y < 120; y++) {
        for (let x = 0; x < 160; x++) {
          const idx = (y * 160 + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const brightness = (r + g + b) / 3;

          if (x < 50 && brightness > 80) leftWeight += brightness;
          if (x > 110 && brightness > 80) rightWeight += brightness;
          if (y > 85 && brightness > 80) lowerWeight += brightness;

          if (lastPixelData.current) {
            const diff = Math.abs(brightness - lastPixelData.current[idx]);
            if (diff > 50) motionDiffCount++;
          }
        }
      }

      lastPixelData.current = new Uint8ClampedArray(data);

      let detectedGaze: "Center" | "Looking Left" | "Looking Right" | "Looking Down" = "Center";
      if (rightWeight > leftWeight * 1.8) detectedGaze = "Looking Right";
      else if (leftWeight > rightWeight * 1.8) detectedGaze = "Looking Left";
      else if (lowerWeight > 1250000) detectedGaze = "Looking Down";

      setGazeStatus(detectedGaze);

      if (detectedGaze !== "Center") {
        gazeOffscreenCount.current += 1;
        if (gazeOffscreenCount.current >= 4) {
          registerStrike(`Frequent Eye-Gaze Drift (${detectedGaze})`);
          gazeOffscreenCount.current = 0;
        }
      } else {
        gazeOffscreenCount.current = Math.max(0, gazeOffscreenCount.current - 1);
      }

      if (motionDiffCount > 3500) {
        setHandGestureDetected(true);
        setTimeout(() => setHandGestureDetected(false), 2000);
        registerStrike("Suspicious Hand Movement / Occlusion Detected");
      }
    }, 1200);

    return () => clearInterval(visionInterval);
  }, [assessmentStage, isDisqualified, registerStrike]);

  // Full Security & Focus Listeners
  useEffect(() => {
    if (assessmentStage !== "testing" || isDisqualified) return;

    const onVisibility = () => { if (document.hidden) registerStrike("Tab switched / browser minimized"); };
    const onBlur = () => registerStrike("Focus lost (clicked outside window)");
    const onCopy = (e: ClipboardEvent) => { e.preventDefault(); registerStrike("Copy / cut attempt blocked"); };
    const onPaste = (e: ClipboardEvent) => { e.preventDefault(); registerStrike("Paste attempt blocked"); };
    const onContextMenu = (e: MouseEvent) => { e.preventDefault(); registerStrike("Right-click blocked"); };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("copy", onCopy);
    window.addEventListener("paste", onPaste);
    window.addEventListener("contextmenu", onContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("copy", onCopy);
      window.removeEventListener("paste", onPaste);
      window.removeEventListener("contextmenu", onContextMenu);
    };
  }, [assessmentStage, isDisqualified, registerStrike]);

  // -------------------------------------------------------------
  // CALCULATE SCORE & INITIALIZE MENTOR IMPROVEMENT PLAN
  // -------------------------------------------------------------
  const submitAssessmentAndEvaluate = async () => {
    const topicStats: Record<string, { correct: number; total: number }> = {};
    let correctTheoryCount = 0;

    studentQuestions.forEach((q) => {
      if (!topicStats[q.topic]) topicStats[q.topic] = { correct: 0, total: 0 };
      topicStats[q.topic].total += 1;

      if (theoryAnswers[q.id] === q.correctAnswer) {
        correctTheoryCount += 1;
        topicStats[q.topic].correct += 1;
      }
    });

    const totalCount = studentQuestions.length || 20;
    const theoryScore = Math.round((correctTheoryCount / totalCount) * 35);
    const debuggingScore = debuggingAnswer === DEBUGGING_SCENARIO.correctAnswer ? 20 : 0;

    const hasNestedLoop = /for\s*\(.*for\s*\(|while\s*\(.*while\s*\(/.test(code);
    const hasHashMap = /Map|Set|complement|diff/.test(code);
    let codingScore = 25;
    let detectedComplexity = "O(N) - Linear Time (Hash Map)";

    if (hasNestedLoop) {
      codingScore = 10;
      detectedComplexity = "O(N^2) - Brute Force";
    } else if (!hasHashMap) {
      codingScore = 16;
      detectedComplexity = "O(N log N) - Sorting / Two Pointers";
    }

    const designScore = systemDesignAnswer === SYSTEM_DESIGN_SCENARIO.correctAnswer ? 15 : 0;
    const speedScore = totalElapsed <= 720 ? 5 : totalElapsed <= 1000 ? 3 : 1;

    const totalMeritScore = theoryScore + debuggingScore + codingScore + designScore + speedScore;
    const trustScore = Math.max(0, 100 - strikes.length * 20);

    let competencyBadge = "Gold Certified (Ready-to-Hire)";
    if (totalMeritScore < 60) competencyBadge = "Bronze Assessed (Needs Mentor Guidance)";
    else if (totalMeritScore < 80) competencyBadge = "Silver Verified (Job-Ready)";

    const topicGaps = Object.entries(topicStats).map(([topic, stat]) => {
      const percentage = Math.round((stat.correct / stat.total) * 100);
      let status: "Strong" | "Average" | "Needs Improvement" = "Needs Improvement";
      if (percentage >= 75) status = "Strong";
      else if (percentage >= 50) status = "Average";

      return { topic, correct: stat.correct, total: stat.total, percentage, status };
    });

    const strongSkills = topicGaps.filter((t) => t.status === "Strong").map((t) => t.topic);
    const weakSkills = topicGaps.filter((t) => t.status !== "Strong").map((t) => t.topic);

    setEvaluation({
      totalMeritScore,
      theoryScore,
      debuggingScore,
      codingScore,
      designScore,
      speedScore,
      trustScore,
      detectedComplexity,
      competencyBadge,
      strongSkills: strongSkills.length > 0 ? strongSkills : ["Algorithmic Foundation"],
      weakSkills: weakSkills.length > 0 ? weakSkills : ["Memory Management", "Distributed Architecture"],
      topicGaps,
    });

    // Generate tailored 4-week guidance curriculum based on weak topics
    const primaryWeakness = weakSkills[0] || "Memory Management";
    const secondaryWeakness = weakSkills[1] || "Databases & Indexing";

    setImprovementPlan([
      {
        weekNumber: 1,
        title: "Deficit Root-Cause & Core Theory Repair",
        focusTopic: primaryWeakness,
        milestones: [
          { id: "m-1-1", text: `Review fundamental architecture and failure modes for ${primaryWeakness}`, done: false },
          { id: "m-1-2", text: "Complete 1:1 Diagnostic Onboarding session with matched Mentor", done: false },
        ],
      },
      {
        weekNumber: 2,
        title: "Hands-on Code Remediation & Bug Lab",
        focusTopic: secondaryWeakness,
        milestones: [
          { id: "m-2-1", text: `Solve 4 intermediate verification problems on ${secondaryWeakness}`, done: false },
          { id: "m-2-2", text: "Submit pull request for defensive code review to mentor desk", done: false },
        ],
      },
      {
        weekNumber: 3,
        title: "Production Architecture Capstone",
        focusTopic: primaryWeakness,
        milestones: [
          { id: "m-3-1", text: `Build production milestone system integrating ${primaryWeakness}`, done: false },
          { id: "m-3-2", text: "Live architectural defense with mentor", done: false },
        ],
      },
      {
        weekNumber: 4,
        title: "Placement Readiness Mock & Sign-off",
        focusTopic: "Interview Ready",
        milestones: [
          { id: "m-4-1", text: "Clear mentor-led technical mock interview (minimum 80% score)", done: false },
          { id: "m-4-2", text: "Obtain Verified Placement Endorsement Badge", done: false },
        ],
      },
    ]);

    // Save baseline score to Supabase
    try {
      const attemptedIds = studentQuestions.map((q) => q.id);
      await supabase.from("student_assessments").insert({
        student_email: userEmail || "student@institution.ac.in",
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
      console.error("Scorecard sync error:", err);
    }

    toast.success("Assessment Complete! Review your Diagnostic Gap Analysis.");
    setAssessmentStage("result-gaps");
  };

  // Toggle milestone completion & recalculate readiness score
  const toggleMilestone = (weekIdx: number, milestoneId: string) => {
    setImprovementPlan((prev) => {
      const updated = prev.map((week, idx) => {
        if (idx !== weekIdx) return week;
        return {
          ...week,
          milestones: week.milestones.map((m) => (m.id === milestoneId ? { ...m, done: !m.done } : m)),
        };
      });

      const allMilestones = updated.flatMap((w) => w.milestones);
      const completedCount = allMilestones.filter((m) => m.done).length;
      const basePercentage = 35;
      const progressBonus = Math.round((completedCount / allMilestones.length) * 65);
      const newScore = Math.min(100, basePercentage + progressBonus);
      setReadinessScore(newScore);

      if (newScore >= 75) {
        toast.success("Placement Threshold Reached! Placements Board Unlocked 🎉");
      }
      return updated;
    });
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
  // VIEW 1: DOMAIN SELECTION (ALL 36 DOMAINS + SEARCH + PILLS)
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
          {/* Top Row with 22-Language Selector */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400">Language Preference:</span>
            <LanguageSelector />
          </div>

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
                  Type your custom domain if not found in the curated list.
                </p>
                {selectedDomain === "custom-domain" && (
                  <input
                    type="text"
                    autoFocus
                    value={customDomainText}
                    onChange={(e) => setCustomDomainText(e.target.value)}
                    placeholder="e.g. Mechatronics, Bio-Informatics, Aerospace..."
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
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs px-6"
            >
              {isLoadingQuestions ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-3.5 animate-spin" /> Randomizing Unique Question Set...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Continue to Guidelines
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
  // VIEW 2: DISQUALIFIED SCREEN WITH FULL AUDIT TRAIL
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
          <h1 className="text-3xl font-black text-white">Assessment Revoked</h1>
          <p className="mt-3 text-sm text-rose-200/80 leading-relaxed">
            You exceeded the allowed policy violations (2 warnings). Your assessment has been locked and recorded in the audit trail.
          </p>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/50 p-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 mb-2">
              Violation Log History:
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
  // VIEW 3: GUIDELINES & PROCTOR CAMERA GATING
  // -------------------------------------------------------------
  if (assessmentStage === "guidelines") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
        <div className="w-full max-w-3xl rounded-2xl border border-white/15 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                SB
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  AI-Proctored Assessment & Career Lifecycle
                </h1>
                <p className="text-xs text-blue-200/70">
                  Track: <span className="font-semibold text-blue-400 uppercase">{activeDomainTitle}</span>
                </p>
              </div>
            </div>
            <LanguageSelector />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6">
            <div className="md:col-span-7 space-y-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl border border-amber-400/20 bg-amber-500/10 text-amber-200">
                <span className="font-bold flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="size-4 text-amber-400" />
                  Live Proctoring & Eye Gaze Monitoring Active
                </span>
                Camera video will float on your screen throughout the exam. Eye gaze drifts away from screen or hand gestures covering face will trigger strikes.
              </div>

              <div className="space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
                  Student Growth Lifecycle:
                </h4>
                <div className="space-y-1.5 text-slate-300">
                  <div>• <strong>1. Diagnostic Assessment:</strong> Pinpoints exact technical strengths and deficit gaps.</div>
                  <div>• <strong>2. Skill Gap Review:</strong> Immediate feedback without premature placement pressure.</div>
                  <div>• <strong>3. Mentor Guidance:</strong> Connect with dedicated staff architects on your weak topics.</div>
                  <div>• <strong>4. 4-Week Action Plan:</strong> Progress tracking milestone checklist.</div>
                  <div>• <strong>5. Unlocked Placements:</strong> Corporate hiring tracks unlock once readiness hits 75%.</div>
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
                    Camera & Vision Engine Ready
                  </>
                ) : (
                  <>
                    <ShieldAlert className="size-4" />
                    Camera Access Required
                  </>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {cameraStatus === "ready" ? "Maintain center gaze on screen." : "Allow camera in browser address bar."}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setAssessmentStage("domain-selection")}
              className="text-xs text-slate-400 hover:text-white"
            >
              Change Track
            </button>

            <Button
              disabled={cameraStatus !== "ready"}
              onClick={() => setAssessmentStage("testing")}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs px-6"
            >
              {cameraStatus === "ready" ? "Begin Assessment" : "Enable Camera First"}
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 4: ACTIVE 4-TIER ASSESSMENT (WITH FLOATING PiP VIDEO)
  // -------------------------------------------------------------
  const activeQuestions = studentQuestions.length > 0 ? studentQuestions : MASTER_QUESTION_POOL;
  const currentQ = activeQuestions[currentTheoryIndex] || activeQuestions[0];

  if (assessmentStage === "testing") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
        <canvas ref={canvasRef} className="hidden" />

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

        <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-sm text-white tracking-tight">
              SkillBridge Assessment
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
                4. Architecture
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />

            <div className="flex items-center gap-1.5 text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-200">
              <Clock className="size-3.5 text-blue-400" />
              <span>Elapsed: {formatTime(totalElapsed)}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg text-rose-300">
              <ShieldAlert className="size-3.5 text-rose-400" />
              <span>Strikes: {strikes.length} / 2</span>
            </div>

            <Button
              onClick={submitAssessmentAndEvaluate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 px-4 shadow-sm"
            >
              Submit & Analyze
            </Button>
          </div>
        </header>

        {/* Floating Picture-in-Picture (PiP) Live Camera Feed */}
        <div className="fixed bottom-5 right-5 z-50 rounded-xl overflow-hidden border-2 border-emerald-500/80 bg-slate-900 shadow-2xl w-48 sm:w-56 backdrop-blur-md">
          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            <div className="absolute top-1.5 left-2 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-white drop-shadow">REC</span>
            </div>
            {handGestureDetected && (
              <div className="absolute inset-0 bg-rose-900/70 flex items-center justify-center text-white text-[10px] font-bold animate-pulse text-center p-1">
                <Hand className="size-4 mr-1 text-rose-300" /> Hand Detected Near Face!
              </div>
            )}
          </div>
          <div className="p-2 bg-slate-900/90 flex items-center justify-between text-[10px] text-slate-300 border-t border-white/10">
            <span className="flex items-center gap-1">
              <Eye className="size-3 text-blue-400" /> Gaze: <strong>{gazeStatus}</strong>
            </span>
            <span className={cn("font-bold px-1.5 py-0.2 rounded text-[9px]", gazeStatus === "Center" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300")}>
              {gazeStatus === "Center" ? "OK" : "Drifting"}
            </span>
          </div>
        </div>

        {/* Assessment Tiers Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* TIER 1: THEORY (20 QUESTIONS) */}
          {activeTab === "theory" && (
            <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 text-xs">
                  <span className="font-bold uppercase tracking-wider text-blue-400">
                    Question {currentTheoryIndex + 1} of {activeQuestions.length} • Topic: {currentQ?.topic}
                  </span>
                  <span className="text-slate-400">
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
                        onClick={() => setTheoryAnswers((prev) => ({ ...prev, [currentQ.id]: opt.id }))}
                        className={cn(
                          "w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition flex items-center justify-between",
                          isSelected
                            ? "border-blue-500 bg-blue-500/10 text-white"
                            : "border-white/10 bg-slate-900/50 text-slate-300 hover:bg-slate-900"
                        )}
                      >
                        <span>{opt.text}</span>
                        <div
                          className={cn(
                            "size-5 rounded-full border flex items-center justify-center text-[10px] font-bold",
                            isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-white/30 text-slate-400"
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
                  className="bg-white/5 hover:bg-white/10 text-white text-xs"
                >
                  Previous
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
                    Proceed to Tier 2
                    <ChevronRight className="size-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* TIER 2: DEBUGGING */}
          {activeTab === "debugging" && (
            <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                  Tier 2 • Real-World Incident Bug Triage (20 Pts)
                </span>
                <h2 className="text-lg font-bold text-white mb-2">{DEBUGGING_SCENARIO.title}</h2>
                <p className="text-xs text-slate-300 whitespace-pre-line mb-4 leading-relaxed">
                  {DEBUGGING_SCENARIO.description}
                </p>

                <div className="p-4 rounded-xl bg-black border border-white/15 font-mono text-xs text-emerald-400 mb-6 overflow-x-auto">
                  <pre>{DEBUGGING_SCENARIO.buggyCode}</pre>
                </div>

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
                <Button onClick={() => setActiveTab("coding")} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
                  Proceed to Tier 3: Algorithmic Coding
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* TIER 3: CODING */}
          {activeTab === "coding" && (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              <div className="lg:col-span-5 border-r border-white/10 p-6 flex flex-col justify-between overflow-y-auto bg-slate-900/40">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      Target: O(N) Efficiency
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
                      <div key={idx} className="p-2.5 rounded-lg bg-black/50 border border-white/10 text-xs font-mono">
                        <div className="text-slate-400">Input: <span className="text-white">{tc.input}</span></div>
                        <div className="text-slate-400">Expected: <span className="text-emerald-400">{tc.expected}</span></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400">
                  Corner camera actively confirms single-candidate proctoring rules.
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
                  <span className="text-slate-500 text-[11px]">Clipboard locked</span>
                  <Button onClick={() => setActiveTab("architecture")} className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-4">
                    Proceed to Tier 4: Architecture
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TIER 4: SYSTEM ARCHITECTURE */}
          {activeTab === "architecture" && (
            <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-2">
                  Tier 4 • Architecture & Scale Tradeoffs (15 Pts)
                </span>
                <h2 className="text-lg font-bold text-white mb-2">{SYSTEM_DESIGN_SCENARIO.title}</h2>
                <p className="text-xs text-slate-300 whitespace-pre-line mb-6 leading-relaxed">
                  {SYSTEM_DESIGN_SCENARIO.scenario}
                </p>

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
                <Button onClick={submitAssessmentAndEvaluate} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6">
                  Submit All & View Scorecard
                  <ArrowRight className="size-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 5: SKILL ANALYSIS RESULT PAGE (NO IMMEDIATE PLACEMENTS)
  // -------------------------------------------------------------
  if (assessmentStage === "result-gaps" && evaluation) {
    return (
      <div className="min-h-screen bg-[#071224] text-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
        <div className="w-full max-w-5xl rounded-2xl border border-white/15 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="size-4" /> Assessment Verified
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Skill Analysis & Diagnostic Breakdown
              </h1>
              <p className="text-xs sm:text-sm text-blue-200/70 mt-1">
                Domain: <span className="font-semibold text-blue-400 uppercase">{activeDomainTitle}</span>
              </p>
            </div>
            <LanguageSelector />
          </div>

          {/* Overall Skill Score Header Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-400/30 text-center flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider">
                Overall Skill Score
              </span>
              <div className="text-4xl font-extrabold text-white mt-1">
                {evaluation.totalMeritScore}
                <span className="text-lg font-medium text-blue-200/70">/100</span>
              </div>
              <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {evaluation.competencyBadge}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Completion Pace</span>
                <div className="text-xl font-bold text-white mt-1">{formatTime(totalElapsed)}</div>
              </div>
              <p className="text-[11px] text-blue-200/70 mt-2">
                Pace Score: +{evaluation.speedScore} / 5 pts
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">AI Integrity Trust</span>
                <div className="text-xl font-bold text-white mt-1">{evaluation.trustScore}%</div>
              </div>
              <p className="text-[11px] text-blue-200/70 mt-2">
                {strikes.length === 0 ? "Zero violations (100% Authentic)" : `${strikes.length} strikes logged`}
              </p>
            </div>
          </div>

          {/* Strong vs Weak / Missing Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-emerald-500/25 bg-emerald-950/20 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Check className="size-4" /> Strong Skills Identified
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {evaluation.strongSkills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl border border-rose-500/25 bg-rose-950/20 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="size-4" /> Weak / Missing Skills (Identified Gaps)
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {evaluation.weakSkills.map((w) => (
                  <span key={w} className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-semibold">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Existing Skill Gap Analysis */}
          <div className="p-6 rounded-2xl border border-white/15 bg-slate-900/90 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">Diagnostic Skill Gap Analysis</h3>
            </div>
            <p className="text-xs text-slate-400">
              Granular topic accuracy based on your attempted test questions:
            </p>

            <div className="space-y-3">
              {evaluation.topicGaps.map((item) => (
                <div
                  key={item.topic}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div className="flex-1 w-full">
                    <div className="text-xs font-semibold text-white flex items-center gap-2">
                      {item.topic}
                      <span
                        className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded border",
                          item.status === "Strong"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : item.status === "Average"
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                        )}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                      <div
                        className={cn(
                          "h-1.5 rounded-full",
                          item.status === "Strong" ? "bg-emerald-500" : item.status === "Average" ? "bg-amber-500" : "bg-rose-500"
                        )}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs font-mono text-slate-300 shrink-0">
                    {item.correct} of {item.total} correct ({item.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* PROMINENT REQUIRED SECTION: NEXT STEP -> MENTOR GUIDANCE      */}
          {/* (NO IMMEDIATE PLACEMENTS DISPLAYED)                           */}
          {/* ------------------------------------------------------------- */}
          <div className="p-6 sm:p-8 rounded-2xl border-2 border-cyan-500/50 bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold">
                <Compass className="size-3.5" /> Next Career Phase
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Your Next Step: Get Guidance From a Mentor
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Your skill analysis identified specific gaps in <strong className="text-rose-400">{evaluation.weakSkills.join(", ")}</strong>. To maximize your hiring outcome, these deficits can be resolved with direct 1:1 mentor guidance and a structured milestone plan before unlocking competitive campus placements.
              </p>
            </div>

            <Button
              onClick={() => setAssessmentStage("mentor-hub")}
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black text-xs sm:text-sm h-12 px-8 shadow-xl shrink-0 transition hover:scale-105"
            >
              Find My Mentor <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 6: MENTOR RECOMMENDATION & PERSONALIZED IMPROVEMENT PLAN
  // -------------------------------------------------------------
  if (assessmentStage === "mentor-hub" && evaluation) {
    const primaryWeakness = evaluation.weakSkills[0] || "Memory Management";
    const recommendedMentors = PLATFORM_MENTORS.filter(
      (m) => m.specializationTopic === primaryWeakness || evaluation.weakSkills.includes(m.specializationTopic)
    );

    return (
      <div className="min-h-screen bg-[#071224] text-white p-6 sm:p-10 font-sans">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Step 3 of 5 • Mentorship Matching</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Matched Industry Mentors</h1>
              <p className="text-xs text-slate-400">Curated based on your test deficit in: <strong className="text-rose-400">{primaryWeakness}</strong></p>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-right">
                <span className="text-[10px] text-slate-400 block">Placement Readiness</span>
                <span className={cn("text-lg font-black", readinessScore >= 75 ? "text-emerald-400" : "text-amber-400")}>{readinessScore}%</span>
              </div>
              <Button
                disabled={readinessScore < 75}
                onClick={() => setAssessmentStage("placements")}
                className={cn(
                  "text-xs font-bold h-10 px-5",
                  readinessScore >= 75 ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-white/10 text-slate-500 cursor-not-allowed"
                )}
              >
                {readinessScore >= 75 ? (
                  <>Enter Placements <ArrowRight className="size-3.5 ml-1.5" /></>
                ) : (
                  <><Lock className="size-3.5 mr-1.5" /> Placements Locked (75% Needed)</>
                )}
              </Button>
            </div>
          </div>

          {/* MENTOR CARDS SECTION */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="size-5 text-cyan-400" /> Platform Mentors Specialized in Your Gaps
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(recommendedMentors.length > 0 ? recommendedMentors : PLATFORM_MENTORS.slice(0, 3)).map((m) => {
                const isSelected = assignedMentor?.id === m.id;
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "p-5 rounded-2xl border transition-all flex flex-col justify-between bg-slate-900/90",
                      isSelected ? "border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl" : "border-white/10 hover:border-white/20"
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img src={m.avatar} alt={m.name} className="size-12 rounded-full object-cover border-2 border-cyan-400/40" />
                        <div>
                          <h4 className="text-sm font-bold text-white">{m.name}</h4>
                          <span className="text-[11px] text-slate-400 block">{m.role}</span>
                          <span className="text-[10px] text-cyan-300 font-semibold">{m.company}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-[11px] text-slate-300 p-3 rounded-xl bg-black/40 border border-white/10 mb-4">
                        <div className="flex justify-between"><span className="text-slate-400">Match Accuracy:</span> <strong className="text-emerald-400">{m.matchScore}%</strong></div>
                        <div className="flex justify-between"><span className="text-slate-400">Specialization:</span> <strong className="text-cyan-300">{m.specializationTopic}</strong></div>
                        <div className="flex justify-between"><span className="text-slate-400">Availability:</span> <span>{m.availableDays}</span></div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{m.bio}</p>
                    </div>

                    <Button
                      onClick={() => {
                        setAssignedMentor(m);
                        setMentorSessionBooked(true);
                        toast.success(`Connected with ${m.name}! Your 4-Week Guidance Plan is activated.`);
                      }}
                      className={cn(
                        "w-full text-xs font-bold h-9",
                        isSelected ? "bg-emerald-600 text-white" : "bg-cyan-600 hover:bg-cyan-700 text-white"
                      )}
                    >
                      {isSelected ? "Active Mentor Assigned" : "Select & Connect Mentor"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PERSONALIZED IMPROVEMENT PLAN & PROGRESS TRACKER */}
          <div className="p-6 rounded-2xl border border-white/15 bg-slate-900/90 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Target className="size-5 text-amber-400" /> Personalized Improvement Plan & Milestone Progress Tracker
                </h3>
                <p className="text-xs text-slate-400">Complete milestones with your mentor to increase your readiness index and unlock placements.</p>
              </div>
              <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-cyan-300">
                Readiness: {readinessScore}% / 75% Required
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {improvementPlan.map((week, wIdx) => (
                <div key={week.weekNumber} className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Week {week.weekNumber} • {week.focusTopic}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-3">{week.title}</h4>

                    <div className="space-y-2">
                      {week.milestones.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => toggleMilestone(wIdx, m.id)}
                          className={cn(
                            "w-full p-2.5 rounded-lg border text-left text-xs transition flex items-start gap-2.5",
                            m.done ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-200 line-through" : "border-white/10 bg-slate-950/50 text-slate-300 hover:bg-slate-900"
                          )}
                        >
                          {m.done ? <CheckSquare className="size-4 text-emerald-400 shrink-0 mt-0.5" /> : <Square className="size-4 text-slate-500 shrink-0 mt-0.5" />}
                          <span className="leading-snug">{m.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {readinessScore >= 75 ? (
              <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-3 text-xs text-emerald-300">
                  <Award className="size-6 text-emerald-400 shrink-0" />
                  <span><strong>Placement Qualification Verified:</strong> You have closed key deficit topics with your mentor. Corporate placement applications are now open!</span>
                </div>
                <Button onClick={() => setAssessmentStage("placements")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-6 shrink-0">
                  Open Placements Board <ArrowRight className="size-3.5 ml-1.5" />
                </Button>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2"><Lock className="size-4 text-amber-400" /> Placements remain locked until you complete sufficient plan milestones.</span>
                <span className="text-amber-400 font-bold">{75 - readinessScore}% more needed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 7: PLACEMENTS BOARD (UNLOCKED ONLY AFTER MENTOR READINESS)
  // -------------------------------------------------------------
  if (assessmentStage === "placements" && evaluation) {
    return (
      <div className="min-h-screen bg-[#071224] text-white p-6 sm:p-10 font-sans">
        <div className="w-full max-w-5xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-slate-900/90 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
                <Unlock className="size-4" /> Mentor-Endorsed Readiness: {readinessScore}%
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Active Corporate Placement Tracks</h1>
              <p className="text-xs text-slate-400 mt-1">Unlocked after successfully completing skill remediation and mentor milestones.</p>
            </div>
            <Button onClick={() => setAssessmentStage("mentor-hub")} className="bg-white/10 text-white text-xs hover:bg-white/20">
              Return to Mentor Desk
            </Button>
          </div>

          <div className="p-6 rounded-2xl border border-white/15 bg-slate-900/90 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="size-5 text-emerald-400" /> Eligible High-Stipend Placements
            </h3>

            <div className="space-y-3">
              {INTERNSHIP_CATALOG.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-xl border border-white/10 bg-black/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/20 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{job.role}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {job.company}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {job.location} • <strong className="text-slate-200">{job.stipend}</strong>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {job.skillsNeeded.map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2">
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400">Readiness Verified</span>
                      <span className="text-[10px] text-slate-400 block">Cutoff: {job.minCutoff} pts</span>
                    </div>
                    <Button
                      onClick={() => toast.success(`Application sent to ${job.company} with verified mentor endorsement!`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-8 px-5"
                    >
                      Direct Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Link to="/">
              <Button className="bg-white/10 hover:bg-white/20 text-white text-xs">
                Back to Portal Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}