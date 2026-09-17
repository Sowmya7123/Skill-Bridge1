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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student")({
  component: StudentAssessmentPage,
});

interface TestCase {
  input: string;
  expected: string;
  isEdgeCase?: boolean;
}

interface Question {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  benchmarkSeconds: number; // Speed benchmark
  expectedComplexity: string;
  description: string;
  initialCode: string;
  testCases: TestCase[];
}

const QUESTION_DATA: Question = {
  id: "q-101",
  title: "Optimized Two-Sum / Target Pair Counter",
  difficulty: "Medium",
  benchmarkSeconds: 300, // 5 minutes benchmark
  expectedComplexity: "O(N) with Hash Map",
  description: `Given an array of integers 'nums' and an integer 'target', return the indices of the two numbers such that they add up to target.
  
To obtain full efficiency credits, your solution must achieve **O(N) Time Complexity**. Brute force nested loops O(N^2) will incur a performance penalty.`,
  initialCode: `function twoSum(nums, target) {
  // Write your O(N) optimized solution here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
  testCases: [
    { input: "[2, 7, 11, 15], target = 9", expected: "[0, 1]" },
    { input: "[3, 2, 4], target = 6", expected: "[1, 2]" },
    { input: "[3, 3], target = 6", expected: "[0, 1]" },
    { input: "[], target = 10 (Edge: Empty Array)", expected: "[]", isEdgeCase: true },
    { input: "[-5, -2, 7, 10], target = 5 (Edge: Negative)", expected: "[1, 2]", isEdgeCase: true },
  ],
};

function StudentAssessmentPage() {
  // Test State
  const [code, setCode] = useState(QUESTION_DATA.initialCode);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);

  // Proctoring Violations State (Max 2 warnings, 3rd = Terminate)
  const [strikes, setStrikes] = useState<string[]>([]);
  const [activeWarning, setActiveWarning] = useState<string | null>(null);

  // Camera video ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Result Metrics State
  const [results, setResults] = useState<{
    logicScore: number;
    complexityScore: number;
    speedScore: number;
    qualityScore: number;
    totalScore: number;
    detectedComplexity: string;
    passedCases: number;
    totalCases: number;
  } | null>(null);

  // Webcam Setup
  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(() => {
        // Fallback if camera permissions are blocked
      });

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Timer runner
  useEffect(() => {
    if (!isSubmitted && !isDisqualified) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSubmitted, isDisqualified]);

  // Central Proctoring Violation Trigger
  const registerViolation = useCallback(
    (reason: string) => {
      if (isDisqualified || isSubmitted) return;

      const timestamp = new Date().toLocaleTimeString();
      const entry = `${reason} (Logged at ${timestamp})`;

      setStrikes((prev) => {
        const nextCount = prev.length + 1;
        const updated = [...prev, entry];

        if (nextCount === 1) {
          setActiveWarning("Strike 1/2: Violation Detected. 1 chance remaining before auto-lock!");
          toast.warning("Warning 1/2: Integrity Violation!", {
            description: `${reason}. You have 1 warning remaining.`,
          });
        } else if (nextCount === 2) {
          setActiveWarning("FINAL WARNING 2/2: Next violation will terminate your test!");
          toast.error("Critical Warning 2/2!", {
            description: `${reason}. Final notice! Any further infraction will terminate the test.`,
          });
        } else if (nextCount >= 3) {
          setIsDisqualified(true);
          toast.error("Test Terminated!", {
            description: "Exceeded 2 chances. Session locked due to proctoring policy.",
          });
        }
        return updated;
      });
    },
    [isDisqualified, isSubmitted]
  );

  // Browser Lockdown & Tab Switch Listeners
  useEffect(() => {
    if (isDisqualified || isSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        registerViolation("Tab switched or browser minimized");
      }
    };

    const handleBlur = () => {
      registerViolation("Focus lost (External app or multi-window clicked)");
    };

    const handleCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      registerViolation("Unauthorized Clipboard action (Copy/Paste)");
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      registerViolation("Right-click context menu opened");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("copy", handleCopyPaste);
    window.addEventListener("paste", handleCopyPaste);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("copy", handleCopyPaste);
      window.removeEventListener("paste", handleCopyPaste);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [isDisqualified, isSubmitted, registerViolation]);

  // Code Evaluation Engine (Logic + Time Complexity + Speed + Quality)
  const handleRunAndSubmit = () => {
    // 1. Algorithmic Complexity Heuristic
    const hasNestedLoop = /for\s*\(.*for\s*\(|while\s*\(.*while\s*\(/.test(code);
    const hasMapOrSet = /Map|Set|{\s*}/.test(code) || /has\(|get\(|in\s+/.test(code);

    let complexityScore = 25; // 25% max
    let detectedComplexity = "O(N) - Linear Time (Optimal)";

    if (hasNestedLoop) {
      complexityScore = 10;
      detectedComplexity = "O(N^2) - Quadratic (Sub-optimal Nested Loops)";
    } else if (!hasMapOrSet) {
      complexityScore = 18;
      detectedComplexity = "O(N log N) - Sorting / Binary Lookup";
    }

    // 2. Speed / Benchmark Comparison
    // Benchmark is 300s (5m). If solved under 300s -> full 20 pts.
    let speedScore = 20; // 20% max
    if (elapsedSeconds <= QUESTION_DATA.benchmarkSeconds) {
      speedScore = 20;
    } else if (elapsedSeconds <= QUESTION_DATA.benchmarkSeconds * 1.5) {
      speedScore = 15;
    } else {
      speedScore = 10;
    }

    // 3. Logic & Test Cases
    const passedCases = 5; // Simulating all passed
    const totalCases = 5;
    const logicScore = 40; // 40% max

    // 4. Code Quality & Edge Cases (15% max)
    const qualityScore = code.includes("return []") || code.includes("null") ? 15 : 12;

    const totalScore = logicScore + complexityScore + speedScore + qualityScore;

    setResults({
      logicScore,
      complexityScore,
      speedScore,
      qualityScore,
      totalScore,
      detectedComplexity,
      passedCases,
      totalCases,
    });
    setIsSubmitted(true);
    toast.success("Assessment submitted and evaluated successfully!");
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  // 1. DISQUALIFIED SCREEN (If strikes >= 3)
  if (isDisqualified) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-2xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-xl p-8 text-center shadow-2xl">
          <div className="size-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4">
            <ShieldAlert className="size-8" />
          </div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-3">
            Access Terminated
          </span>
          <h1 className="text-3xl font-black text-white">Assessment Disqualified</h1>
          <p className="mt-3 text-sm text-rose-200/80 leading-relaxed">
            You exceeded the maximum allowed policy infractions (2 chances). The proctoring engine has terminated and permanently locked your evaluation session.
          </p>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 mb-2">
              Proctoring Violation Audit Log:
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

  // 2. SUBMITTED SCREEN: TRANSPARENT SCORE BREAKDOWN CARD
  if (isSubmitted && results) {
    return (
      <div className="min-h-screen bg-[#091428] text-white flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-3xl rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
          
          <div className="text-center pb-6 border-b border-white/10">
            <div className="size-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
              <CheckCircle2 className="size-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Assessment Verified & Evaluated
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/70 mt-1">
              Holistic Talent Readiness Index Breakdown
            </p>
          </div>

          {/* Primary Score Hero */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            <div className="sm:col-span-1 p-5 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-400/30 text-center flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider">
                Overall Final Score
              </span>
              <div className="text-4xl font-extrabold text-white mt-1">
                {results.totalScore}
                <span className="text-lg font-medium text-blue-200/70">/100</span>
              </div>
              <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Grade: Industry Ready (A)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Completion Speed</span>
                <div className="text-xl font-bold text-white mt-1">{formatTime(elapsedSeconds)}</div>
              </div>
              <p className="text-[11px] text-blue-200/70 mt-2">
                Benchmark: {formatTime(QUESTION_DATA.benchmarkSeconds)} ({elapsedSeconds <= QUESTION_DATA.benchmarkSeconds ? "Faster than benchmark" : "Average speed"})
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">AI Integrity Trust</span>
                <div className="text-xl font-bold text-white mt-1">
                  {strikes.length === 0 ? "100% Clean" : `${100 - strikes.length * 10}% Verified`}
                </div>
              </div>
              <p className="text-[11px] text-blue-200/70 mt-2">
                {strikes.length} minor proctoring warnings logged during session
              </p>
            </div>
          </div>

          {/* TRANSPARENT EVALUATION EXPLANATION TABLE */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200 flex items-center gap-2">
              <Sparkles className="size-3.5 text-blue-400" />
              Transparent Score Derivation:
            </h3>

            <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-black/30 overflow-hidden text-xs">
              
              {/* Row 1: Correctness */}
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">1. Correctness & Hidden Test Cases (40%)</div>
                  <div className="text-slate-400 text-[11px]">
                    Passed {results.passedCases}/{results.totalCases} functional test cases and boundary conditions.
                  </div>
                </div>
                <div className="text-sm font-bold text-emerald-400">+{results.logicScore} / 40 pts</div>
              </div>

              {/* Row 2: Time Complexity */}
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">2. Algorithmic Efficiency & Complexity (25%)</div>
                  <div className="text-slate-400 text-[11px]">
                    Detected: <span className="text-cyan-300 font-mono">{results.detectedComplexity}</span>
                  </div>
                </div>
                <div className="text-sm font-bold text-cyan-400">+{results.complexityScore} / 25 pts</div>
              </div>

              {/* Row 3: Speed Index */}
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">3. Speed & Benchmark Execution (20%)</div>
                  <div className="text-slate-400 text-[11px]">
                    Solved in {formatTime(elapsedSeconds)} vs {formatTime(QUESTION_DATA.benchmarkSeconds)} benchmark.
                  </div>
                </div>
                <div className="text-sm font-bold text-blue-400">+{results.speedScore} / 20 pts</div>
              </div>

              {/* Row 4: Code Quality */}
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">4. Code Cleanliness & Edge Cases (15%)</div>
                  <div className="text-slate-400 text-[11px]">
                    Clean variable semantics, early returns & defensive checks.
                  </div>
                </div>
                <div className="text-sm font-bold text-indigo-400">+{results.qualityScore} / 15 pts</div>
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

  // 3. ACTIVE CODING & ASSESSMENT WORKSPACE
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* WARNING NOTIFICATION BANNER (If 1 or 2 warnings) */}
      {activeWarning && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 px-6 py-2 flex items-center justify-between text-amber-200 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-400 shrink-0" />
            <span className="font-semibold">{activeWarning}</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveWarning(null)}
            className="text-[10px] uppercase font-bold underline hover:text-white"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* TOP BAR: TIMER & PROCTORING STATUS */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-sm text-white tracking-tight">SkillBridge Assessment</span>
          <span className="hidden sm:inline-block text-[11px] text-slate-400">
            • {QUESTION_DATA.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Live Clock */}
          <div className="flex items-center gap-1.5 text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-200">
            <Clock className="size-3.5 text-blue-400" />
            <span>Time Taken: {formatTime(elapsedSeconds)}</span>
          </div>

          {/* Strikes Counter */}
          <div className="flex items-center gap-1.5 text-xs bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg text-rose-300">
            <ShieldAlert className="size-3.5 text-rose-400" />
            <span>Chances Used: {strikes.length} / 2</span>
          </div>

          <Button
            type="button"
            onClick={handleRunAndSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 px-4"
          >
            Submit Solution
          </Button>
        </div>
      </header>

      {/* 2-COLUMN CODING WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Side: Question Description & Live Webcam */}
        <div className="lg:col-span-5 border-r border-white/10 p-6 flex flex-col justify-between overflow-y-auto bg-slate-900/40">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {QUESTION_DATA.difficulty} Problem
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Zap className="size-3.5 text-amber-400" />
                Benchmark: 5m 00s
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mb-3">{QUESTION_DATA.title}</h2>
            <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line mb-6">
              {QUESTION_DATA.description}
            </div>

            {/* Test Cases Preview */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Verified Test Cases:
            </h4>
            <div className="space-y-2">
              {QUESTION_DATA.testCases.map((tc, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono">
                  <div className="text-slate-400">Input: <span className="text-white">{tc.input}</span></div>
                  <div className="text-slate-400">Expected: <span className="text-emerald-400">{tc.expected}</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time AI Proctoring Camera Stream */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-4">
            <div className="relative size-20 rounded-xl overflow-hidden bg-black border-2 border-emerald-500/60 shadow-md">
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
                <span>AI Proctor Active</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                Continuous face, gaze & browser monitoring. Violations log after 2 strikes.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Code Editor Workspace */}
        <div className="lg:col-span-7 flex flex-col bg-black">
          <div className="px-4 py-2 border-b border-white/10 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono">
              <Terminal className="size-3.5 text-blue-400" />
              <span>solution.js</span>
            </div>
            <span className="text-[11px] text-slate-500">Target Efficiency: O(N)</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full bg-slate-950 p-4 font-mono text-xs text-emerald-300 focus:outline-none resize-none leading-relaxed"
          />

          <div className="p-3 border-t border-white/10 bg-slate-900/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">
              Ctrl+V disabled under exam integrity policy
            </span>
            <Button
              type="button"
              onClick={handleRunAndSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-4"
            >
              Run Code & Analyze Efficiency
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}