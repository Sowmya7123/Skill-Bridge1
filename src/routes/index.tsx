import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  ArrowRight,
  Sparkles,
  Cpu,
  Wrench,
  Zap,
  Globe,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/engineering")({
  head: () => ({
    meta: [
      { title: "Choose Your Engineering Specialization — SkillBridge" },
      { name: "description", content: "Explore and select your engineering domain with verified competency frameworks." },
    ],
  }),
  component: EngineeringSpecializationPage,
});

interface Specialization {
  id: string;
  title: string;
  code: string;
  category: string;
  description: string;
  skillsCount: number;
  icon: typeof Cpu;
  badgeColor: string;
}

const SPECIALIZATIONS: Specialization[] = [
  {
    id: "cse",
    title: "Computer Science & Engineering",
    code: "CSE-01",
    category: "Software & Core Computing",
    description: "Advanced algorithms, system architecture, cloud computing, and full-stack software engineering tracks.",
    skillsCount: 42,
    icon: Cpu,
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  {
    id: "ece",
    title: "Electronics & Communication",
    code: "ECE-02",
    category: "Hardware & Embedded",
    description: "VLSI design, embedded systems, IoT architectures, and wireless telecommunication networks.",
    skillsCount: 38,
    icon: Zap,
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  {
    id: "mech",
    title: "Mechanical Engineering",
    code: "MECH-03",
    category: "Core & Industrial",
    description: "Thermal engineering, robotics, CAD/CAM simulation, and advanced manufacturing systems.",
    skillsCount: 35,
    icon: Wrench,
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "civil",
    title: "Civil & Infrastructure",
    code: "CIVIL-04",
    category: "Structural & Urban",
    description: "Structural design, geotechnical engineering, sustainable urban planning, and BIM technologies.",
    skillsCount: 30,
    icon: Layers,
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "eee",
    title: "Electrical & Electronics",
    code: "EEE-05",
    category: "Power & Energy",
    description: "Smart grids, renewable energy systems, high-voltage engineering, and electric drives.",
    skillsCount: 33,
    icon: Globe,
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "ai",
    title: "Artificial Intelligence & Data Science",
    code: "AIDS-06",
    category: "Emerging Tech",
    description: "Machine learning models, neural networks, computer vision, and large-scale data analytics.",
    skillsCount: 48,
    icon: Sparkles,
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
];

function EngineeringSpecializationPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecId, setSelectedSpecId] = useState<string>("cse");
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  const filteredSpecs = SPECIALIZATIONS.filter(
    (spec) =>
      spec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSpecialization = SPECIALIZATIONS.find((s) => s.id === selectedSpecId) || SPECIALIZATIONS[0];

  function handleProceed() {
    navigate({ to: "/", search: { specialization: selectedSpecId } });
  }

  return (
    <div className="min-h-screen relative flex flex-col font-sans text-slate-100 bg-[#090D16] overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Background with Professional Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 transform scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090D16]/95 via-[#090D16]/90 to-[#090D16]/98" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090D16]/85 backdrop-blur-xl px-6 sm:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-base shadow-lg shadow-blue-500/30">
            SB
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">SkillBridge</span>
            <span className="block text-[10px] text-blue-400 font-medium tracking-wider uppercase">Engineering Specialization Desk</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobilePanelOpen(!mobilePanelOpen)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition cursor-pointer"
          >
            <Filter className="size-4 text-blue-400" />
            <span>Specializations</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Search & Results */}
        <div className="lg:col-span-8 flex flex-col space-y-8">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/35 text-xs font-semibold text-blue-400 shadow-inner">
              <Sparkles className="size-3.5 text-blue-400" />
              Academic & Industry Competency Pathways
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Choose Your Engineering Specialization
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
              Explore industry-standard branch domains, verified skill assessment rubrics, and targeted career progression tracks.
            </p>
          </div>

          {/* Prominent Search Bar */}
          <div className="relative group w-full">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 opacity-30 group-hover:opacity-70 transition duration-300 blur-sm pointer-events-none" />
            <div className="relative flex items-center bg-[#0F172A]/90 border border-white/20 rounded-2xl shadow-2xl px-4 py-2 transition-all duration-300 group-hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20">
              <Search className="size-5 text-blue-400 ml-2 mr-3 shrink-0" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your engineering specialization..."
                className="w-full h-12 bg-transparent border-0 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus-visible:ring-0 shadow-none px-0"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-white/5 border border-white/10 transition cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <span>Available Domains ({filteredSpecs.length})</span>
              <span>Click card to inspect</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredSpecs.map((spec) => {
                const IconComp = spec.icon;
                const isSelected = selectedSpecId === spec.id;

                return (
                  <div
                    key={spec.id}
                    onClick={() => setSelectedSpecId(spec.id)}
                    className={cn(
                      "group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 cursor-pointer shadow-lg",
                      isSelected
                        ? "bg-gradient-to-br from-blue-950/60 to-[#0F172A] border-blue-500 shadow-[0_10px_30px_rgba(37,99,235,0.25)] ring-2 ring-blue-500/50"
                        : "bg-[#0F172A]/70 border-white/10 hover:border-blue-500/50 hover:bg-[#1E293B]/80 hover:-translate-y-1"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={cn("size-10 rounded-xl flex items-center justify-center border shadow-sm", spec.badgeColor)}>
                          <IconComp className="size-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                          {spec.code}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                        {spec.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                        {spec.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">{spec.skillsCount} Competencies</span>
                      <span className={cn("font-bold flex items-center gap-1", isSelected ? "text-blue-400" : "text-slate-400 group-hover:text-white")}>
                        {isSelected ? "Selected" : "Select"} <ChevronRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Vertical Selection Panel */}
        <div className={cn(
          "lg:col-span-4 fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-[#0F172A] border-l border-white/15 p-6 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:inset-auto lg:w-auto lg:rounded-3xl lg:border lg:bg-[#0F172A]/90 lg:backdrop-blur-xl lg:shadow-xl lg:flex lg:flex-col lg:justify-between",
          mobilePanelOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">Specialization Panel</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobilePanelOpen(false)}
                className="lg:hidden text-xs text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 border border-white/10"
              >
                Close
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Current Selection</div>
              <h4 className="text-base font-bold text-white">{activeSpecialization.title}</h4>
              <p className="text-xs text-slate-300 line-clamp-2">{activeSpecialization.description}</p>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Quick Selection Options
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {SPECIALIZATIONS.map((spec) => {
                  const isSelected = selectedSpecId === spec.id;
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => {
                        setSelectedSpecId(spec.id);
                        setMobilePanelOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                        isSelected
                          ? "bg-blue-600 text-white border-blue-500 shadow-md font-semibold"
                          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <BookOpen className={cn("size-4 shrink-0", isSelected ? "text-white" : "text-blue-400")} />
                        <span className="text-xs truncate">{spec.title}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="size-4 shrink-0 text-white ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10">
            <Button
              type="button"
              onClick={handleProceed}
              className="w-full h-12 text-xs sm:text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Proceed with {activeSpecialization.code}</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#090D16] py-5 px-6 text-center text-xs text-slate-500">
        SkillBridge Engineering Module &copy; 2026. Unified Institutional Framework.
      </footer>
    </div>
  );
}