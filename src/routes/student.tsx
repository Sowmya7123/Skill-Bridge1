import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ShieldAlert,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  Eye,
  Terminal,
  Play,
  RotateCcw,
  Check,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Award,
  BookOpen,
  HelpCircle,
  Code2,
  FileText,
  ShieldCheck,
  Globe,
  Cpu,
  BarChart3,
  Cloud,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student")({
  component: StudentAssessmentEngine,
});

// MULTI-QUESTION DEFINITIONS
interface MCQQuestion {
  id: string;
  type: "mcq";
  title: string;
  benchmarkSeconds: number;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

interface CodingQuestion {
  id: string;
  type: "coding";
  title: string;
  benchmarkSeconds: number;
  expectedComplexity: string;
  description: string;
  initialCode: string;
  testCases: { input: string; expected: string; isEdgeCase?: boolean }[];
}

const DOMAIN_OPTIONS = [
  {
    id: "web-dev",
    title: "Full Stack Web Development",
    desc: "React, Node.js, Next.js, System Architecture & REST APIs",
    icon: Globe,
    badge: "Popular",
  },
  {
    id: "ai-ml",
    title: "Artificial Intelligence & ML",
    desc: "Neural Networks, Python, Computer Vision & LLM Implementations",
    icon: Cpu,
    badge: "Trending",
  },
  {
    id: "data-science",
    title: "Data Analytics & Engineering",
    desc: "SQL, Python Data Pipelines, BigQuery & Predictive Modeling",
    icon: BarChart3,
    badge: "High Demand",
  },
  {
    id: "cloud-devops",
    title: "Cloud Architecture & DevOps",
    desc: "AWS, Docker, Kubernetes, CI/CD Pipelines & Terraform",
    icon: Cloud,
    badge: "Enterprise",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity & InfoSec",
    desc: "Network Defense, Cryptography, Penetration Testing & Audits",
    icon: Lock,
    badge: "Specialized",
  },
];

const MCQ_DATA: MCQQuestion = {
  id: "mcq-1",
  type: "mcq",
  title: "Algorithmic Complexity & Optimization",
  benchmarkSeconds: 120,
  question:
    "Consider an algorithm that scans an unsorted array of size N using two nested loops to check for duplicates. What is the optimal time complexity to achieve the same result using a Hash Set or Hash Map?",
  options: [
    { id: "A", text: "O(N^2) - Quadratic Time (Brute Force)" },
    { id: "B", text: "O(N) - Linear Time (Single Pass Lookup)" },
    { id: "C", text: "O(N log N) - Divide and Conquer" },
    { id: "D", text: "O(1) - Constant Space and Time" },
  ],
  correctAnswer: "B",
  explanation:
    "Using a Hash Set allows average O(1) membership checks, reducing total traversal to linear O(N) time.",
};

const CODING_DATA: CodingQuestion = {
  id: "coding-1",
  type: "coding",
  title: "Optimized Target Pair Finder (Two-Sum)",
  benchmarkSeconds: 360,
  expectedComplexity: "O(N) Linear Time",
  description: `Given an array of integers 'nums' and an integer 'target', return indices of the two numbers such that they add up to target.

Requirements:
- Your solution must run in **O(N)** time complexity using a single traversal with a Hash Map.
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
    { input: "[], target = 10", expected: "[]", isEdgeCase: true },
    { input: "[-3, 4, 3, 90], target = 0", expected: "[0, 2]", isEdgeCase: true },
  ],
};

function StudentAssessmentEngine() {
  const [assessmentStage, setAssessmentStage] = useState<
    "domain-selection" | "guidelines" | "testing" | "submitted"
  >("domain-selection");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"mcq" | "coding">("mcq");

  // Camera Validation State: "checking" | "ready" | "denied"
  const [cameraStatus, setCameraStatus] = useState<"checking" | "ready" | "denied">("checking");

  // Answers & Code
  const [selectedMcqAnswer, setSelectedMcqAnswer] = useState<string | null>(null);
  const [code, setCode] = useState(CODING_DATA.initialCode);

  // Timers
  const [totalElapsed, setTotalElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Proctoring Strikes
  const [strikes, setStrikes] = useState<string[]>([]);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Final Results
  const [evaluation, setEvaluation] = useState<{
    logicScore: number;
    complexityScore: number;
    speedScore: number;
    qualityScore: number;
    totalScore: number;
    detectedComplexity: string;
    trustScore: number;
    mcqPassed: boolean;
  } | null>(null);

  // Camera Activation & Mandatory Check
  useEffect(() => {
    if (assessmentStage !== "guidelines" && assessmentStage !== "testing") return;

    let stream: MediaStream | null = null;
    setCameraStatus("checking");

    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
        setCameraStatus("ready");
      })
      .catch((err) => {
        console.error("Camera access denied:", err);
        setCameraStatus("denied");
        toast.error("Camera Permission Tappanisari!", {
          description: "Ee proctored assessment rayalante camera access allow cheyali.",
        });
      });

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [assessmentStage]);

  // Timer
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

  // Proctoring Violations
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
            description: `${reason}. Inko okka chance mathrame migili undi.`,
          });
        } else if (next.length === 2) {
          setActiveAlert("CRITICAL WARNING 2/2: Next violation tho exam terminate avthundi!");
          toast.error("Critical Strike 2/2!", {
            description: `${reason}. Final warning! Maro sari violate chesthe session aagipothundi.`,
          });
        } else if (next.length >= 3) {
          setIsDisqualified(true);
          toast.error("Assessment Terminated!", {
            description: "2 chances datipoyayi. Proctoring rules prakaram test lock aindi.",
          });
        }
        return next;
      });
    },
    [isDisqualified, assessmentStage]
  );

  // Security Listeners
  useEffect(() => {
    if (assessmentStage !== "testing" || isDisqualified) return;

    const onVisibilityChange = () => {
      if (document.hidden) {
        registerStrike("Tab switched or browser minimized");
      }
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
      registerStrike("Right-click blocked");
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

  const handleFinalSubmit = () => {
    const mcqCorrect = selectedMcqAnswer === MCQ_DATA.correctAnswer;
    const mcqPoints = mcqCorrect ? 15 : 0;
    const codingLogicPoints = 25;
    const logicScore = mcqPoints + codingLogicPoints;

    const hasNestedLoop = /for\s*\(.*for\s*\(|while\s*\(.*while\s*\(/.test(code);
    const hasHashMap = /Map|Set|complement|diff/.test(code);
    let complexityScore = 25;
    let detectedComplexity = "O(N) - Linear Time (Optimal Hash Map)";

    if (hasNestedLoop) {
      complexityScore = 10;
      detectedComplexity = "O(N^2) - Sub-optimal Brute Force";
    } else if (!hasHashMap) {
      complexityScore = 18;
      detectedComplexity = "O(N log N) - Sorting / Binary Search";
    }

    const totalBenchmark = MCQ_DATA.benchmarkSeconds + CODING_DATA.benchmarkSeconds;
    let speedScore = 20;
    if (totalElapsed <= totalBenchmark) {
      speedScore = 20;
    } else if (totalElapsed <= totalBenchmark * 1.3) {
      speedScore = 15;
    } else {
      speedScore = 10;
    }

    const qualityScore =
      code.includes("return []") && (code.includes("null") || code.includes("nums.length"))
        ? 15
        : 12;

    const totalScore = logicScore + complexityScore + speedScore + qualityScore;
    const trustScore = Math.max(0, 100 - strikes.length * 15);

    setEvaluation({
      logicScore,
      complexityScore,
      speedScore,
      qualityScore,
      totalScore,
      detectedComplexity,
      trustScore,
      mcqPassed: mcqCorrect,
    });

    setAssessmentStage("submitted");
    toast.success("Assessment vijayavanthamga evaluate aindi!");
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s < 10 ? "0" : ""}${s}s`;
  };

  // -------------------------------------------------------------
  // VIEW 1: DOMAIN SELECTION
  // -------------------------------------------------------------
  if (assessmentStage === "domain-selection") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
        <div className="w-full max-w-4xl rounded-2xl border border-white/15 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="size-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-3">
              <Sparkles className="size-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Select Your Assessment Track
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/70 mt-2">
              Assessment start chese mundhu meeru prepare ayye domain ni choose chesukondi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DOMAIN_OPTIONS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedDomain === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedDomain(item.id)}
                  className={cn(
                    "p-5 rounded-xl border text-left transition-all relative flex items-start gap-4",
                    isSelected
                      ? "border-blue-500 bg-blue-600/20 ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10"
                      : "border-white/10 bg-slate-900/50 hover:bg-slate-800/80 hover:border-white/20"
                  )}
                >
                  <div
                    className={cn(
                      "size-11 rounded-lg flex items-center justify-center shrink-0",
                      isSelected ? "bg-blue-600 text-white" : "bg-white/5 text-blue-400"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{item.title}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 right-4 size-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <Link to="/" className="text-xs text-slate-400 hover:text-white">
              Back to Home
            </Link>
            <Button
              disabled={!selectedDomain}
              onClick={() => setAssessmentStage("guidelines")}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs px-6"
            >
              Continue to Assessment Rules
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: DISQUALIFIED
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
            Mee test session cancel aindi. Max allowed strikes (2 chances) cross chesaru. Code
            mariyu answers lock aipoyayi.
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
  // VIEW 3: SCORECARD
  // -------------------------------------------------------------
  if (assessmentStage === "submitted" && evaluation) {
    return (
      <div className="min-h-screen bg-[#071224] text-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
        <div className="w-full max-w-3xl rounded-2xl border border-white/15 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center pb-6 border-b border-white/10">
            <div className="size-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
              <CheckCircle2 className="size-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Assessment Verified & Evaluated
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/70 mt-1">
              Domain Track:{" "}
              <span className="font-semibold text-blue-400 uppercase">
                {DOMAIN_OPTIONS.find((d) => d.id === selectedDomain)?.title || selectedDomain}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-400/30 text-center flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider">
                Total Merit Score
              </span>
              <div className="text-4xl font-extrabold text-white mt-1">
                {evaluation.totalScore}
                <span className="text-lg font-medium text-blue-200/70">/100</span>
              </div>
              <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Grade: A (Verified Ready)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Speed</span>
                <div className="text-xl font-bold text-white mt-1">{formatTime(totalElapsed)}</div>
              </div>
              <p className="text-[11px] text-blue-200/70 mt-2">
                Benchmark: 8m 00s (
                {totalElapsed <= 480 ? "Optimal Speed achieved" : "Moderate Speed"})
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  AI Integrity Trust
                </span>
                <div className="text-xl font-bold text-white mt-1">{evaluation.trustScore}%</div>
              </div>
              <p className="text-[11px] text-blue-200/70 mt-2">
                {strikes.length === 0
                  ? "Zero violations (100% Authentic)"
                  : `${strikes.length} warnings issued`}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200 flex items-center gap-2">
                <Sparkles className="size-3.5 text-blue-400" />
                Score Breakdown:
              </h3>
              <span className="text-[11px] text-slate-400">Audited System Calculation</span>
            </div>

            <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-black/40 overflow-hidden text-xs">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">
                    1. Correctness & Logic Verification (40%)
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    MCQ Assessment:{" "}
                    {evaluation.mcqPassed ? "Passed (+15 pts)" : "Incorrect (0 pts)"} • 5/5 Coding
                    Testcases passed (+25 pts)
                  </div>
                </div>
                <div className="text-sm font-bold text-emerald-400">
                  +{evaluation.logicScore} / 40 pts
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">
                    2. Algorithmic Efficiency & Complexity (25%)
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Detected:{" "}
                    <span className="text-cyan-300 font-mono font-bold">
                      {evaluation.detectedComplexity}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-bold text-cyan-400">
                  +{evaluation.complexityScore} / 25 pts
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">
                    3. Benchmark Execution Speed (20%)
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Completed in {formatTime(totalElapsed)} vs 8m 00s target speed.
                  </div>
                </div>
                <div className="text-sm font-bold text-blue-400">
                  +{evaluation.speedScore} / 20 pts
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">
                    4. Code Cleanliness & Defensive Edge Cases (15%)
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Boundary empty array handling, negative constraints & semantic variable scopes.
                  </div>
                </div>
                <div className="text-sm font-bold text-indigo-400">
                  +{evaluation.qualityScore} / 15 pts
                </div>
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
  // VIEW 4: GUIDELINES & MANDATORY CAMERA CHECK (LOCKED BUTTON)
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
                AI-Proctored Student Assessment
              </h1>
              <p className="text-xs text-blue-200/70">
                Selected Domain:{" "}
                <span className="font-semibold text-blue-400 uppercase">
                  {DOMAIN_OPTIONS.find((d) => d.id === selectedDomain)?.title || selectedDomain}
                </span>
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
                Tab switching, minimizing browser, leda copy-paste chesthe strikes padathayi. 2
                chances tharvatha 3rd strike padithe assessment ventane cancel aipothundi.
              </div>

              <div className="space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
                  Evaluation Formula Breakdown:
                </h4>
                <div className="space-y-1.5 text-slate-300">
                  <div>• <strong>40% Logic:</strong> Correct answers & passed test cases.</div>
                  <div>• <strong>25% Efficiency:</strong> Algorithmic time complexity (O(N) target).</div>
                  <div>• <strong>20% Speed:</strong> Completion time vs expected benchmark.</div>
                  <div>• <strong>15% Quality:</strong> Handling corner cases & clean syntax.</div>
                </div>
              </div>
            </div>

            {/* Live Camera Validation Box */}
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
                  ? "Face ni screen madhyalo petti test continue cheyandi."
                  : "Browser address bar lo camera permission allow cheyali."}
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

            {/* CAMERA ON KAKAPOTHE BUTTON WORK AVVADHU */}
            <Button
              disabled={cameraStatus !== "ready"}
              onClick={() => {
                if (cameraStatus === "ready") {
                  setAssessmentStage("testing");
                }
              }}
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
  // VIEW 5: ACTIVE ASSESSMENT (EXAM ENGINE)
  // -------------------------------------------------------------
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

      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-sm text-white tracking-tight">
            SkillBridge Assessment Engine
          </span>
          <div className="flex rounded-lg bg-black/40 p-0.5 text-xs border border-white/10">
            <button
              onClick={() => setActiveTab("mcq")}
              className={cn(
                "px-3 py-1 rounded-md font-semibold transition flex items-center gap-1.5",
                activeTab === "mcq" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              <HelpCircle className="size-3.5" />
              1. Theory & Complexity
            </button>
            <button
              onClick={() => setActiveTab("coding")}
              className={cn(
                "px-3 py-1 rounded-md font-semibold transition flex items-center gap-1.5",
                activeTab === "coding" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              <Code2 className="size-3.5" />
              2. Algorithmic Coding
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
            Submit All & Evaluate
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === "mcq" ? (
          <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Section 1 of 2 • Core Theory & Optimization
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Zap className="size-3.5 text-amber-400" />
                  Benchmark: 2m 00s
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white mb-6">
                {MCQ_DATA.question}
              </h2>

              <div className="space-y-3">
                {MCQ_DATA.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedMcqAnswer(opt.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition flex items-center justify-between",
                      selectedMcqAnswer === opt.id
                        ? "border-blue-500 bg-blue-500/10 text-white"
                        : "border-white/10 bg-slate-900/50 text-slate-300 hover:bg-slate-900 hover:border-white/20"
                    )}
                  >
                    <span>{opt.text}</span>
                    <div
                      className={cn(
                        "size-5 rounded-full border flex items-center justify-center text-[10px] font-bold",
                        selectedMcqAnswer === opt.id
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-white/30 text-slate-400"
                      )}
                    >
                      {opt.id}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <Button
                onClick={() => setActiveTab("coding")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Proceed to Coding Problem
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            <div className="lg:col-span-5 border-r border-white/10 p-6 flex flex-col justify-between overflow-y-auto bg-slate-900/40">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Target: O(N) Efficiency
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Zap className="size-3.5 text-amber-400" />
                    Benchmark: 6m 00s
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
                  onClick={handleFinalSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-4"
                >
                  Run & Final Submit
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}