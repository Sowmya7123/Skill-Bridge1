import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ShieldAlert,
  Clock,
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
  Briefcase,
  TrendingUp,
  Loader2,
  Hand,
  UserCheck,
  Award,
  Compass,
  Lock,
  Unlock,
  Target,
  CheckSquare,
  Square,
  Play,
  FileText,
  Mic,
  MicOff,
  Video,
  VideoOff,
  BarChart3,
  RefreshCw,
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
// 1. ALL 36 COMPREHENSIVE DOMAIN TRACKS
// -------------------------------------------------------------
const DOMAIN_OPTIONS = [
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
// 2. COMPLETE 20-QUESTION POOL
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
  auditLogCache.push({ timestamp: Date.now(), data: payload });
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
  placeholderTemplate: `function twoSum(nums, target) {\n  // Implement O(N) Hash Map solution here\n}`,
  testCases: [
    { input: "[2, 7, 11, 15], target = 9", expected: "[0, 1]" },
    { input: "[3, 2, 4], target = 6", expected: "[1, 2]" },
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

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  specializationTopic: string;
  rating: number;
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
    matchScore: 96,
    bio: "Focuses on linear algorithmic restructuring, priority heap optimization, and cache-locality data layout.",
    availableDays: "Tue, Fri, Sun",
  },
];

interface Module {
  id: string;
  title: string;
  type: "video" | "reading" | "quiz" | "assignment";
  duration: string;
  completed: boolean;
}

interface WeekCurriculum {
  week: number;
  title: string;
  modules: Module[];
}

const INITIAL_CURRICULUM: WeekCurriculum[] = [
  {
    week: 1,
    title: "Fundamentals & Architecture Foundations",
    modules: [
      { id: "w1-m1", title: "System Architecture & Design Principles", type: "video", duration: "45 mins", completed: false },
      { id: "w1-m2", title: "Reading: Clean Code & Best Practices", type: "reading", duration: "30 mins", completed: false },
      { id: "w1-m3", title: "Week 1 Knowledge Check (Quiz)", type: "quiz", duration: "20 mins", completed: false },
    ],
  },
  {
    week: 2,
    title: "Advanced Data Structures & Algorithms",
    modules: [
      { id: "w2-m1", title: "Optimizing Search & Graph Traversals", type: "video", duration: "60 mins", completed: false },
      { id: "w2-m2", title: "Practical Coding Assignment", type: "assignment", duration: "90 mins", completed: false },
      { id: "w2-m3", title: "Algorithmic Complexity Assessment", type: "quiz", duration: "25 mins", completed: false },
    ],
  },
  {
    week: 3,
    title: "System Scalability & Cloud Deployment",
    modules: [
      { id: "w3-m1", title: "Microservices & Load Balancing", type: "video", duration: "50 mins", completed: false },
      { id: "w3-m2", title: "Case Study: Scaling to 10M Users", type: "reading", duration: "40 mins", completed: false },
      { id: "w3-m3", title: "Cloud Deployment Verification Task", type: "assignment", duration: "60 mins", completed: false },
    ],
  },
  {
    week: 4,
    title: "Capstone Project & Industry Readiness",
    modules: [
      { id: "w4-m1", title: "Building Production-Ready Endpoints", type: "video", duration: "75 mins", completed: false },
      { id: "w4-m2", title: "Final Capstone Implementation", type: "assignment", duration: "120 mins", completed: false },
      { id: "w4-m3", title: "Final Comprehensive Course Defense", type: "quiz", duration: "30 mins", completed: false },
    ],
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
  { id: "int-4", role: "Cloud & DevOps Apprentice", company: "Jio Platforms", stipend: "₹28,000 / month", location: "Hyderabad", minCutoff: 60, skillsNeeded: ["Docker", "Linux", "CI/CD"] },
  { id: "int-5", role: "Core Embedded & VLSI Trainee", company: "Qualcomm / Texas Instruments", stipend: "₹50,000 / month", location: "Bengaluru", minCutoff: 80, skillsNeeded: ["Embedded C", "ARM", "Verilog"] },
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

  const [assessmentStage, setAssessmentStage] = useState<
    | "domain-selection"
    | "guidelines"
    | "testing"
    | "result-gaps"
    | "mentor-hub"
    | "four-week-course"
    | "ai-mock-interview"
    | "interview-feedback"
    | "placements"
  >("domain-selection");

  const [selectedDomain, setSelectedDomain] = useState<string>("fullstack-web");
  const [customDomainText, setCustomDomainText] = useState("");
  const [domainSearch, setDomainSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [activeTab, setActiveTab] = useState<"theory" | "debugging" | "coding" | "architecture">("theory");

  const [studentQuestions, setStudentQuestions] = useState<ProcessedQuestion[]>([]);
  const [theoryAnswers, setTheoryAnswers] = useState<Record<string, string>>({});
  const [currentTheoryIndex, setCurrentTheoryIndex] = useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const [debuggingAnswer, setDebuggingAnswer] = useState<string | null>(null);
  const [code, setCode] = useState(CODING_DATA.placeholderTemplate);
  const [systemDesignAnswer, setSystemDesignAnswer] = useState<string | null>(null);

  const [cameraStatus, setCameraStatus] = useState<"checking" | "ready" | "denied">("checking");
  const [totalElapsed, setTotalElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [strikes, setStrikes] = useState<string[]>([]);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [gazeStatus, setGazeStatus] = useState<"Center" | "Looking Left" | "Looking Right" | "Looking Down">("Center");
  const [handGestureDetected, setHandGestureDetected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPixelData = useRef<Uint8ClampedArray | null>(null);

  const [scoreReport, setScoreReport] = useState<{
    totalQuestions: number;
    attemptedQuestions: number;
    unattemptedQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    score: number;
    percentage: number;
    theoryScore: number;
    debuggingScore: number;
    codingScore: number;
    designScore: number;
    strongSkills: string[];
    weakSkills: string[];
    topicGaps: { topic: string; correct: number; total: number; percentage: number; status: "Strong" | "Average" | "Needs Improvement" }[];
  } | null>(null);

  const [assignedMentor, setAssignedMentor] = useState<Mentor | null>(null);
  const [improvementPlan, setImprovementPlan] = useState<ImprovementWeek[]>([]);
  const [readinessScore, setReadinessScore] = useState(0);

  // New states for added features
  const [curriculum, setCurriculum] = useState<WeekCurriculum[]>(INITIAL_CURRICULUM);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [assessmentAnswer, setAssessmentAnswer] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const totalModules = curriculum.reduce((acc, w) => acc + w.modules.length, 0);
  const completedModulesCount = curriculum.reduce((acc, w) => acc + w.modules.filter(m => m.completed).length, 0);
  const isCourseComplete = completedModulesCount === totalModules;

  // AI Mock Interview States
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [interviewCameraActive, setInterviewCameraActive] = useState(false);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const interviewVideoRef = useRef<HTMLVideoElement>(null);

  const interviewQuestions = [
    "Can you explain how you would design a scalable URL shortener service handling 10,000 requests per second?",
    "What are the trade-offs between SQL and NoSQL databases in modern microservices architecture?",
    "Describe a time when you optimized a slow-running query or bottleneck in your application.",
    "How do you ensure security and token verification in RESTful APIs?"
  ];

  async function toggleInterviewCamera() {
    if (!interviewCameraActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (interviewVideoRef.current) {
          interviewVideoRef.current.srcObject = stream;
        }
        setInterviewCameraActive(true);
        toast.success("Camera & Microphone activated successfully.");
      } catch {
        toast.error("Permission Denied", { description: "Unable to access camera/microphone. Please check browser settings." });
      }
    } else {
      if (interviewVideoRef.current && interviewVideoRef.current.srcObject) {
        const stream = interviewVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      setInterviewCameraActive(false);
      toast.info("Camera deactivated.");
    }
  }

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

        return { ...q, options: mappedOptions, correctAnswer: newCorrectLetter };
      });

      setStudentQuestions(shuffled);
      setTheoryAnswers({});
      setDebuggingAnswer(null);
      setCode(CODING_DATA.placeholderTemplate);
      setSystemDesignAnswer(null);
      setTotalElapsed(0);
      setStrikes([]);
      setCurrentTheoryIndex(0);
    } catch {
      setStudentQuestions(shuffle(MASTER_QUESTION_POOL));
    } finally {
      setIsLoadingQuestions(false);
      setAssessmentStage("guidelines");
    }
  };

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
        toast.error("Camera Required", { description: "Webcam access is mandatory for proctored testing." });
      });

    return () => { stream?.getTracks().forEach((track) => track.stop()); };
  }, [assessmentStage]);

  useEffect(() => {
    if (assessmentStage === "testing" && !isDisqualified) {
      timerRef.current = setInterval(() => setTotalElapsed((prev) => prev + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [assessmentStage, isDisqualified]);

  const registerStrike = useCallback(
    (reason: string) => {
      if (isDisqualified || assessmentStage !== "testing") return;
      const logEntry = `${reason} — ${new Date().toLocaleTimeString()}`;

      setStrikes((prev) => {
        const next = [...prev, logEntry];
        if (next.length === 1) {
          setActiveAlert("Strike 1/2: Policy Infraction Recorded. 1 chance remaining!");
          toast.warning("Warning 1/2: Integrity Violation!", { description: reason });
        } else if (next.length === 2) {
          setActiveAlert("CRITICAL WARNING 2/2: Next violation will terminate your test!");
          toast.error("Critical Strike 2/2!", { description: `${reason}. Final notice!` });
        } else if (next.length >= 3) {
          setIsDisqualified(true);
          toast.error("Assessment Revoked!", { description: "Maximum infractions reached." });
        }
        return next;
      });
    },
    [isDisqualified, assessmentStage]
  );

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
          const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;

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
        registerStrike(`Frequent Eye-Gaze Drift (${detectedGaze})`);
      }

      if (motionDiffCount > 3500) {
        setHandGestureDetected(true);
        setTimeout(() => setHandGestureDetected(false), 2000);
        registerStrike("Suspicious Hand Movement / Face Occlusion Detected");
      }
    }, 1200);

    return () => clearInterval(visionInterval);
  }, [assessmentStage, isDisqualified, registerStrike]);

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

  const submitAssessmentAndEvaluate = async () => {
    const totalQuestions = (studentQuestions.length || 20) + 3;
    let attemptedQuestions = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;

    const topicStats: Record<string, { correct: number; total: number }> = {};

    studentQuestions.forEach((q) => {
      if (!topicStats[q.topic]) topicStats[q.topic] = { correct: 0, total: 0 };
      topicStats[q.topic].total += 1;

      const userChoice = theoryAnswers[q.id];
      if (userChoice) {
        attemptedQuestions += 1;
        if (userChoice === q.correctAnswer) {
          correctAnswers += 1;
          topicStats[q.topic].correct += 1;
        } else {
          wrongAnswers += 1;
        }
      }
    });

    const theoryPoints = correctAnswers * 3;

    let debugPoints = 0;
    if (debuggingAnswer !== null && debuggingAnswer !== undefined) {
      attemptedQuestions += 1;
      if (debuggingAnswer === DEBUGGING_SCENARIO.correctAnswer) {
        correctAnswers += 1;
        debugPoints = 15;
      } else {
        wrongAnswers += 1;
      }
    }

    let codingPoints = 0;
    const cleanCode = code.replace(CODING_DATA.placeholderTemplate, "").trim();
    const isCodeAttempted = cleanCode.length > 15;

    if (isCodeAttempted) {
      attemptedQuestions += 1;
      const hasOptimalMap = /Map|Set|complement|diff/i.test(cleanCode);
      const hasBruteForce = /for\s*\(.*for\s*\(|while\s*\(.*while\s*\(/i.test(cleanCode);

      if (hasOptimalMap && !hasBruteForce) {
        correctAnswers += 1;
        codingPoints = 15;
      } else if (!hasBruteForce && cleanCode.length > 25) {
        codingPoints = 8;
        wrongAnswers += 1;
      } else {
        wrongAnswers += 1;
      }
    }

    let archPoints = 0;
    if (systemDesignAnswer !== null && systemDesignAnswer !== undefined) {
      attemptedQuestions += 1;
      if (systemDesignAnswer === SYSTEM_DESIGN_SCENARIO.correctAnswer) {
        correctAnswers += 1;
        archPoints = 10;
      } else {
        wrongAnswers += 1;
      }
    }

    const unattemptedQuestions = totalQuestions - attemptedQuestions;
    const rawScore = theoryPoints + debugPoints + codingPoints + archPoints;
    const finalScore = attemptedQuestions === 0 ? 0 : Math.min(100, rawScore);
    const finalPercentage = attemptedQuestions === 0 ? 0 : Math.round((finalScore / 100) * 100);

    const topicGaps = Object.entries(topicStats).map(([topic, stat]) => {
      const percentage = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      let status: "Strong" | "Average" | "Needs Improvement" = "Needs Improvement";
      if (percentage >= 75) status = "Strong";
      else if (percentage >= 50) status = "Average";
      return { topic, correct: stat.correct, total: stat.total, percentage, status };
    });

    const strongSkills = topicGaps.filter((t) => t.status === "Strong").map((t) => t.topic);
    const weakSkills = topicGaps.filter((t) => t.status !== "Strong").map((t) => t.topic);

    setScoreReport({
      totalQuestions,
      attemptedQuestions,
      unattemptedQuestions,
      correctAnswers,
      wrongAnswers,
      score: finalScore,
      percentage: finalPercentage,
      theoryScore: theoryPoints,
      debuggingScore: debugPoints,
      codingScore: codingPoints,
      designScore: archPoints,
      strongSkills: strongSkills.length > 0 ? strongSkills : ["None verified"],
      weakSkills: weakSkills.length > 0 ? weakSkills : ["Fundamental Core Deficits"],
      topicGaps,
    });

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
          { id: "m-2-2", text: "Submit pull request for code review to mentor desk", done: false },
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

    setReadinessScore(attemptedQuestions === 0 ? 0 : Math.min(50, Math.round(finalScore * 0.5)));

    try {
      const attemptedIds = studentQuestions.map((q) => q.id);
      await supabase.from("student_assessments").insert({
        student_email: userEmail || "student@institution.ac.in",
        role_id: selectedDomain === "custom-domain" ? "fullstack-web" : selectedDomain,
        total_score: finalScore,
        logic_score: theoryPoints + codingPoints,
        speed_score: 0,
        trust_score: Math.max(0, 100 - strikes.length * 20),
        competency_badge: finalScore >= 80 ? "Gold Certified" : finalScore >= 60 ? "Silver Verified" : "Bronze Assessed",
        time_elapsed_seconds: totalElapsed,
        strikes_count: strikes.length,
        attempted_question_ids: attemptedIds,
      });
    } catch (err) {
      console.error("Scorecard sync error:", err);
    }

    toast.success("Assessment Complete! Review your Diagnostic Report.");
    setAssessmentStage("result-gaps");
  };

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
      const progressPercent = Math.round((completedCount / allMilestones.length) * 100);
      setReadinessScore(progressPercent);

      if (progressPercent >= 75) {
        toast.success("Placement Threshold Reached! Placements Board Unlocked 🎉");
      }
      return updated;
    });
  };

  const formatTime = (secs: number) => `${Math.floor(secs / 60)}m ${secs % 60 < 10 ? "0" : ""}${secs % 60}s`;

  const activeDomainTitle =
    selectedDomain === "custom-domain"
      ? customDomainText || "Custom Track"
      : DOMAIN_OPTIONS.find((d) => d.id === selectedDomain)?.title || selectedDomain;

  // -------------------------------------------------------------
  // VIEW 1: DOMAIN SELECTION
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
              Assessment scoring strictly awards marks for correct answers. Unattempted questions award 0 marks.
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
              <div className="p-3.5 rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-200">
                <span className="font-bold flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="size-4 text-blue-400" />
                  Absolute Merit Scoring Engine
                </span>
                • Correct Answer = Marks Awarded<br />
                • Wrong Answer = 0 Marks<br />
                • Unattempted Question = 0 Marks<br />
                • 0 Attempted Questions = 0/100 (0%)
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
  // VIEW 4: ACTIVE 4-TIER ASSESSMENT
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
              Submit All & View Scorecard
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
                  Tier 2 • Real-World Incident Bug Triage (15 Pts)
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
                      Target: O(N) Efficiency (15 Pts)
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-3">{CODING_DATA.title}</h2>
                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line mb-6">
                    {CODING_DATA.placeholderTemplate}
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
                  <span className="text-[11px] text-slate-500">Unattempted code earns 0 marks</span>
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
                  Tier 4 • Architecture & Scale Tradeoffs (10 Pts)
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
  // VIEW 5: SKILL ANALYSIS RESULT (STRICT 7-METRIC ACCURACY)
  // -------------------------------------------------------------
  if (assessmentStage === "result-gaps" && scoreReport) {
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

          {/* EXACT 7 REQUIRED ASSESSMENT RESULT METRICS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Questions</span>
              <div className="text-xl font-black text-white mt-1">{scoreReport.totalQuestions}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-500/30 text-center">
              <span className="text-[10px] text-blue-300 font-bold uppercase block">Attempted</span>
              <div className="text-xl font-black text-blue-400 mt-1">{scoreReport.attemptedQuestions}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-center">
              <span className="text-[10px] text-amber-300 font-bold uppercase block">Unattempted</span>
              <div className="text-xl font-black text-amber-400 mt-1">{scoreReport.unattemptedQuestions}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-center">
              <span className="text-[10px] text-emerald-300 font-bold uppercase block">Correct</span>
              <div className="text-xl font-black text-emerald-400 mt-1">{scoreReport.correctAnswers}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-500/30 text-center">
              <span className="text-[10px] text-rose-300 font-bold uppercase block">Wrong</span>
              <div className="text-xl font-black text-rose-400 mt-1">{scoreReport.wrongAnswers}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-600/20 border border-blue-400/40 text-center">
              <span className="text-[10px] text-blue-200 font-bold uppercase block">Score</span>
              <div className="text-xl font-black text-white mt-1">{scoreReport.score}/100</div>
            </div>
            <div className="p-3.5 rounded-xl bg-indigo-600/20 border border-indigo-400/40 text-center">
              <span className="text-[10px] text-indigo-200 font-bold uppercase block">Percentage</span>
              <div className="text-xl font-black text-white mt-1">{scoreReport.percentage}%</div>
            </div>
          </div>

          {/* Strong vs Weak / Missing Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-emerald-500/25 bg-emerald-950/20 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Check className="size-4" /> Strong Skills Identified
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {scoreReport.strongSkills.map((s) => (
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
                {scoreReport.weakSkills.map((w) => (
                  <span key={w} className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-semibold">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* PROMINENT NEXT STEP: MENTOR GUIDANCE FIRST */}
          <div className="p-6 sm:p-8 rounded-2xl border-2 border-cyan-500/50 bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold">
                <Compass className="size-3.5" /> Next Career Phase
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Your Next Step: Get Guidance From a Mentor & Complete Mandatory Course
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Connect with a specialized industry architect and go through the mandatory 4-week learning curriculum before unlocking placements.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 shrink-0">
              <Button
                onClick={() => setAssessmentStage("mentor-hub")}
                className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black text-xs sm:text-sm h-11 px-6 shadow-xl transition hover:scale-105"
              >
                Find My Mentor <ArrowRight className="size-4 ml-2" />
              </Button>
              <Button
                onClick={() => setAssessmentStage("four-week-course")}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm h-11 px-6 shadow-xl transition"
              >
                4-Week Learning Program <BookOpen className="size-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 6: MENTOR RECOMMENDATION & PERSONALIZED IMPROVEMENT PLAN
  // -------------------------------------------------------------
  if (assessmentStage === "mentor-hub" && scoreReport) {
    const primaryWeakness = scoreReport.weakSkills[0] || "Memory Management";
    const recommendedMentors = PLATFORM_MENTORS.filter(
      (m) => m.specializationTopic === primaryWeakness || scoreReport.weakSkills.includes(m.specializationTopic)
    );

    return (
      <div className="min-h-screen bg-[#071224] text-white p-6 sm:p-10 font-sans">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Step 3 of 5 • Mentorship Matching</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Matched Industry Mentors</h1>
              <p className="text-xs text-slate-400">Targeting your verified deficits in: <strong className="text-rose-400">{primaryWeakness}</strong></p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setAssessmentStage("four-week-course")}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold h-10 px-4"
              >
                Go to 4-Week Course ({completedModulesCount}/{totalModules})
              </Button>
              <Button
                disabled={!isCourseComplete || readinessScore < 75}
                onClick={() => setAssessmentStage("ai-mock-interview")}
                className={cn(
                  "text-xs font-bold h-10 px-5",
                  isCourseComplete && readinessScore >= 75 ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-white/10 text-slate-500 cursor-not-allowed"
                )}
              >
                {isCourseComplete && readinessScore >= 75 ? (
                  <>Start AI Mock Interview <ArrowRight className="size-3.5 ml-1.5" /></>
                ) : (
                  <><Lock className="size-3.5 mr-1.5" /> Interview Locked (Course + 75% Needed)</>
                )}
              </Button>
            </div>
          </div>

          {/* Mentor Cards Section */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="size-5 text-cyan-400" /> Platform Mentors Specialized in Your Gaps
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(recommendedMentors.length > 0 ? recommendedMentors : PLATFORM_MENTORS).slice(0, 3).map((m) => {
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
                        <div className="flex justify-between"><span className="text-slate-400">Target Deficit:</span> <strong className="text-cyan-300">{m.specializationTopic}</strong></div>
                        <div className="flex justify-between"><span className="text-slate-400">Availability:</span> <span>{m.availableDays}</span></div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{m.bio}</p>
                    </div>

                    <Button
                      onClick={() => {
                        setAssignedMentor(m);
                        toast.success(`Connected with ${m.name}! Your 4-Week Guidance Plan is activated.`);
                      }}
                      className={cn(
                        "w-full text-xs font-bold h-9",
                        isSelected ? "bg-emerald-600 text-white" : "bg-cyan-600 hover:bg-cyan-700 text-white"
                      )}
                    >
                      {isSelected ? "Active Mentor Assigned" : "Select & Connect"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button onClick={() => setAssessmentStage("result-gaps")} className="bg-white/10 text-white text-xs">
              Back to Scorecard
            </Button>
            <Button onClick={() => setAssessmentStage("four-week-course")} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold">
              Proceed to Mandatory 4-Week Course <ArrowRight className="size-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 8: MANDATORY 4-WEEK LEARNING PROGRAM & VERIFICATION
  // -------------------------------------------------------------
  if (assessmentStage === "four-week-course") {
    return (
      <div className="min-h-screen bg-[#071224] text-white p-6 sm:p-10 font-sans">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Mandatory Curriculum Gating</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">4-Week Structured Learning & Verification</h1>
              <p className="text-xs text-slate-400">Complete all modules with assessment proof before unlocking AI Mock Interviews & Placements.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setAssessmentStage("mentor-hub")} className="bg-white/10 text-white text-xs">
                Back to Mentor Hub
              </Button>
              <Button
                disabled={!isCourseComplete}
                onClick={() => setAssessmentStage("ai-mock-interview")}
                className={cn(
                  "text-xs font-bold h-10 px-5",
                  isCourseComplete ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-white/10 text-slate-500 cursor-not-allowed"
                )}
              >
                {isCourseComplete ? "Start AI Mock Interview" : <><Lock className="size-3.5 mr-1" /> Course Incomplete</>}
              </Button>
            </div>
          </div>

          {/* Progress Summary Card */}
          <div className="p-6 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/60 to-slate-900 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-bold text-white">Course Completion Status</h3>
              <p className="text-xs text-slate-300">
                {completedModulesCount} of {totalModules} modules verified successfully ({Math.round((completedModulesCount / totalModules) * 100)}%)
              </p>
            </div>
            <div className="w-full sm:w-64 bg-slate-800 rounded-full h-3 overflow-hidden border border-white/10">
              <div
                className="bg-blue-500 h-full transition-all duration-500"
                style={{ width: `${(completedModulesCount / totalModules) * 100}%` }}
              />
            </div>
          </div>

          {/* Curriculum Weeks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {curriculum.map((weekData) => {
              const weekProgress = weekData.modules.filter(m => m.completed).length;
              const weekCompleted = weekProgress === weekData.modules.length;

              return (
                <div key={weekData.week} className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        Week {weekData.week}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {weekProgress}/{weekData.modules.length} Completed {weekCompleted && "✅"}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-4">{weekData.title}</h3>

                    <div className="space-y-3">
                      {weekData.modules.map((mod) => (
                        <div
                          key={mod.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 hover:border-blue-500/40 transition"
                        >
                          <div className="flex items-center gap-3">
                            {mod.completed ? (
                              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                            ) : (
                              <div className="size-4 rounded-full border-2 border-slate-500 shrink-0" />
                            )}
                            <div>
                              <h4 className="text-xs font-semibold text-white">{mod.title}</h4>
                              <span className="text-[10px] text-slate-400 capitalize">{mod.type} • {mod.duration}</span>
                            </div>
                          </div>

                          <Button
                            onClick={() => setSelectedModule(mod)}
                            size="sm"
                            className={cn(
                              "text-xs font-bold h-8 rounded-lg",
                              mod.completed ? "bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30" : "bg-blue-600 text-white hover:bg-blue-500"
                            )}
                          >
                            {mod.completed ? "Review" : "Learn & Verify"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Module Modal */}
          {selectedModule && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in text-white">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white">{selectedModule.title}</h3>
                  <button onClick={() => setSelectedModule(null)} className="text-xs text-slate-400 hover:text-white">Close</button>
                </div>

                <div className="space-y-4 text-xs text-slate-300">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                    <span className="font-bold text-blue-400">Mandatory Learning Material</span>
                    <p className="leading-relaxed">
                      Study the concepts, video lectures, and documentation. To complete this module, provide your assessment answer or solution summary below.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-white">Assessment Proof / Solution:</label>
                    <input
                      type="text"
                      value={assessmentAnswer}
                      onChange={(e) => setAssessmentAnswer(e.target.value)}
                      placeholder="Enter your solution code or summary..."
                      className="w-full h-10 px-3 bg-black/60 border border-white/15 rounded-xl text-white outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <Button onClick={() => setSelectedModule(null)} variant="ghost" className="text-xs text-slate-300">Cancel</Button>
                  <Button
                    disabled={isVerifying || !assessmentAnswer.trim()}
                    onClick={() => {
                      setIsVerifying(true);
                      setTimeout(() => {
                        setCurriculum(prev =>
                          prev.map(week => ({
                            ...week,
                            modules: week.modules.map(m => m.id === selectedModule.id ? { ...m, completed: true } : m)
                          }))
                        );
                        setIsVerifying(false);
                        setSelectedModule(null);
                        setAssessmentAnswer("");
                        toast.success("Module Verified & Completed!");
                      }, 800);
                    }}
                    className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
                  >
                    {isVerifying ? <Loader2 className="size-4 animate-spin" /> : "Verify & Complete Module"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 9: AI MOCK INTERVIEW (VOICE & CAMERA SUPPORT)
  // -------------------------------------------------------------
  if (assessmentStage === "ai-mock-interview") {
    return (
      <div className="min-h-screen bg-[#071224] text-white p-6 sm:p-10 font-sans">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Post-Course Evaluation</span>
              <h1 className="text-2xl font-black text-white">AI Mock Interview Suite</h1>
            </div>
            <Button onClick={() => setAssessmentStage("four-week-course")} className="bg-white/10 text-white text-xs">
              Back to Course
            </Button>
          </div>

          {!interviewStarted ? (
            <div className="bg-slate-900/90 border border-white/15 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
              <div className="size-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                <Sparkles className="size-8" />
              </div>
              <h2 className="text-xl font-black text-white">Ready for Your AI Voice & Camera Mock Interview?</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                The AI will ask technical, behavioral, and architecture questions dynamically. You can use your microphone for voice answers and enable camera preview.
              </p>
              <Button
                onClick={() => setInterviewStarted(true)}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg"
              >
                Start Interview Session
              </Button>
            </div>
          ) : !interviewFinished ? (
            <div className="bg-slate-900/90 border border-white/15 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-red-500 animate-pulse" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live AI Interview Session</h3>
                </div>
                <span className="text-xs font-semibold text-slate-400">Question {currentQuestionIndex + 1} of {interviewQuestions.length}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative h-48 rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
                  <video ref={interviewVideoRef} autoPlay playsInline muted className={cn("w-full h-full object-cover", !interviewCameraActive && "hidden")} />
                  {!interviewCameraActive && (
                    <div className="text-center p-4">
                      <VideoOff className="size-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">Camera preview is inactive</p>
                    </div>
                  )}
                  <button
                    onClick={toggleInterviewCamera}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5"
                  >
                    {interviewCameraActive ? <Video className="size-3.5 text-emerald-400" /> : <VideoOff className="size-3.5 text-slate-400" />}
                    {interviewCameraActive ? "Disable Camera" : "Enable Camera"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">AI Question</span>
                    <p className="text-sm font-semibold text-white leading-relaxed">
                      {interviewQuestions[currentQuestionIndex]}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => setIsRecording(!isRecording)}
                      className={cn("flex-1 h-10 text-xs font-bold rounded-xl", isRecording ? "bg-red-600 hover:bg-red-500 text-white animate-pulse" : "bg-white/10 hover:bg-white/15 text-white")}
                    >
                      {isRecording ? <MicOff className="size-4 mr-2" /> : <Mic className="size-4 mr-2" />}
                      {isRecording ? "Stop Recording Answer" : "Start Voice Answer"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Your Answer (Voice Transcript / Text Input):</label>
                <textarea
                  rows={3}
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="Speak into microphone or type your detailed answer here..."
                  className="w-full p-3 text-xs bg-black/60 border border-white/15 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end pt-3">
                <Button
                  onClick={() => {
                    if (currentQuestionIndex < interviewQuestions.length - 1) {
                      setCurrentQuestionIndex(prev => prev + 1);
                      setStudentAnswer("");
                      toast.success("Answer recorded. Next question loaded.");
                    } else {
                      setInterviewFinished(true);
                      toast.success("Interview completed! Generating feedback report...");
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  {currentQuestionIndex < interviewQuestions.length - 1 ? "Next Question" : "Finish & View Feedback"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-white/15 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
              <div className="size-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Award className="size-8" />
              </div>
              <h2 className="text-xl font-black text-white">Interview Complete!</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your interview has been processed successfully. View your detailed AI performance report and improvement plan.
              </p>
              <Button
                onClick={() => setAssessmentStage("interview-feedback")}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                View Detailed Feedback Report
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 10: INTERVIEW FEEDBACK & READINESS REPORT
  // -------------------------------------------------------------
  if (assessmentStage === "interview-feedback") {
    return (
      <div className="min-h-screen bg-[#071224] text-white p-6 sm:p-10 font-sans">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <div className="bg-slate-900/90 border border-white/15 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">AI Mock Interview Feedback Report</h2>
                <p className="text-xs text-slate-400">Detailed analytical breakdown of your mock interview performance</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400">88 / 100</span>
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Readiness Score</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Technical Knowledge</span>
                <div className="text-lg font-bold text-white">92%</div>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Communication</span>
                <div className="text-lg font-bold text-white">85%</div>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Problem Solving</span>
                <div className="text-lg font-bold text-white">88%</div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Personalized Improvement Plan</h4>
              <ul className="space-y-2 text-xs text-slate-300 list-disc pl-4">
                <li>Revise database indexing strategies for high-throughput write operations.</li>
                <li>Incorporate more quantitative metrics when explaining past project impact.</li>
                <li>Practice system design latency estimation exercises.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 text-xs text-slate-300">
              <span className="font-semibold text-white">Note:</span> AI feedback is designed as a practice aid and constructive guide to help refine your interview presence.
            </div>

            <div className="flex justify-between pt-4 border-t border-white/10">
              <Button onClick={() => setAssessmentStage("ai-mock-interview")} className="bg-white/10 text-white text-xs">
                Retake Mock Interview
              </Button>
              <Button onClick={() => setAssessmentStage("placements")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6">
                Proceed to Placements Board <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 7: PLACEMENTS BOARD (UNLOCKED ONLY AFTER MENTOR READINESS)
  // -------------------------------------------------------------
  if (assessmentStage === "placements" && scoreReport) {
    return (
      <div className="min-h-screen bg-[#071224] text-white p-6 sm:p-10 font-sans">
        <div className="w-full max-w-5xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-slate-900/90 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
                <Unlock className="size-4" /> Mentor & Course Verified Readiness: {readinessScore}%
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Active Corporate Placement Tracks</h1>
              <p className="text-xs text-slate-400 mt-1">Unlocked after successfully completing the 4-week learning curriculum and mentor milestones.</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setAssessmentStage("ai-mock-interview")} className="bg-white/10 text-white text-xs">
                AI Mock Interview
              </Button>
              <Button onClick={() => setAssessmentStage("mentor-hub")} className="bg-white/10 text-white text-xs">
                Mentor Desk
              </Button>
            </div>
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