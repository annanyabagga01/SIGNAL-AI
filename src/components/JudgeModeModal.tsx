import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import { 
  Scale, 
  Sparkles, 
  Play, 
  ShieldAlert, 
  CheckCircle2, 
  Brain, 
  X, 
  ArrowRight, 
  Layers, 
  Target, 
  Eye, 
  Filter, 
  HelpCircle,
  Clock,
  Flame,
  ChevronRight,
  ChevronLeft,
  Zap,
  TrendingUp,
  ShieldCheck
} from "lucide-react";

export const JudgeModeModal: React.FC = () => {
  const {
    isJudgeModeOpen,
    setIsJudgeModeOpen,
    loadRealisticDemoScenario,
    setCurrentPage,
    runScenarioTest,
  } = useSignal();

  const [activeTab, setActiveTab] = useState<"walkthrough" | "architecture">("walkthrough");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isJudgeModeOpen) return null;

  const handleLaunchExperience = () => {
    loadRealisticDemoScenario();
    setIsJudgeModeOpen(false);
    setCurrentPage("dashboard");
  };

  const judgeSteps = [
    {
      number: 1,
      title: "1. THE PROBLEM",
      subtitle: "The Fragmented Attention Epidemic",
      badge: "Crisis",
      badgeColor: "rose",
      content: "Students don't suffer from a lack of motivation—they suffer from cognitive overload. 50+ alerts arrive daily across WhatsApp, Discord, Slack, and Email. Every incoming ping looks deceptively urgent.",
      metric: "50+ Alerts/Day",
      metricLabel: "Constant Context Switching",
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />
    },
    {
      number: 2,
      title: "2. RAW INCOMING NOISE",
      subtitle: "Uncurated Multi-Channel Clutter",
      badge: "Ingestion",
      badgeColor: "amber",
      content: "A typical student's day: an urgent DBMS assignment submission (tomorrow), a 48h hackathon registration, a SWE internship application, a 3h tutorial video, a crypto webinar, and promotional club newsletters all competing for the same attention.",
      metric: "6+ Mixed Channels",
      metricLabel: "No Inherent Priority Structure",
      icon: <Layers className="w-5 h-5 text-amber-400" />
    },
    {
      number: 3,
      title: "3. RUN SIGNAL",
      subtitle: "AI Attention Filter Activation",
      badge: "Processing",
      badgeColor: "indigo",
      content: "Rather than asking the student to manually tag, organize, or manage backlogs, SIGNAL automatically parses incoming text, detects deadlines, calculates cognitive cost, and evaluates alignment against ranked goals.",
      metric: "<2.0s Latency",
      metricLabel: "Intelligent Ingestion & Parsing",
      icon: <Play className="w-5 h-5 text-indigo-400" />
    },
    {
      number: 4,
      title: "4. THE 7-DIMENSION FILTER",
      subtitle: "Multi-Constraint Optimization",
      badge: "Intelligence",
      badgeColor: "indigo",
      content: "SIGNAL computes 7 quantitative dimensions: Goal Alignment (0-100), Deadline Urgency, Opportunity Value, Opportunity Cost, Cognitive Effort, Source Reliability, and Active Workload Buffer.",
      metric: "7 Scoring Vectors",
      metricLabel: "Transparent Algorithmic Decisioning",
      icon: <Brain className="w-5 h-5 text-indigo-400" />
    },
    {
      number: 5,
      title: "5. ACTION PRIORITIZATION",
      subtitle: "Strict 4-Tier Categorization",
      badge: "Actionable",
      badgeColor: "emerald",
      content: "Noise is instantly sorted: 🔴 NOW (max 1-2 urgent items today), 🟡 NEXT (this week's queued deliverables), 🟢 LATER (reference backlog), and ⚪ IGNORE (dropped distractions with zero guilt).",
      metric: "Max 1-2 NOW",
      metricLabel: "Attention Bandwidth Protected",
      icon: <Target className="w-5 h-5 text-emerald-400" />
    },
    {
      number: 6,
      title: "6. TRANSPARENT EXPLANATION",
      subtitle: "Why SIGNAL Chose This",
      badge: "Explainability",
      badgeColor: "indigo",
      content: "Every decision gives clear reasoning: why it was classified, the trade-offs considered, and what you gain by ignoring low-leverage hype. Users can calibrate or override anytime.",
      metric: "100% Explainable",
      metricLabel: "Full Algorithmic Transparency",
      icon: <HelpCircle className="w-5 h-5 text-indigo-400" />
    },
    {
      number: 7,
      title: "7. THE RESULT",
      subtitle: "Mental Clarity & High Output",
      badge: "Impact",
      badgeColor: "emerald",
      content: "Students save ~4.5 hours daily of context switching and rabbit holes. By filtering what arrives, students focus purely on what actually moves the needle on their degree and career.",
      metric: "~4.5h Saved/Day",
      metricLabel: "65-70% Noise Purged",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    }
  ];

  return (
    <div
      id="judge-mode-overlay"
      className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">EVALUATION & ARCHITECTURE</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  JUDGE MODE
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-zinc-100">
                How SIGNAL Solves Information Overload
              </h2>
            </div>
          </div>

          <button
            id="judge-modal-close"
            onClick={() => setIsJudgeModeOpen(false)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab("walkthrough")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "walkthrough"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              30-60s Guided Flow
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "architecture"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Architecture & Heuristics
            </button>
          </div>

          <button
            id="judge-experience-signal-btn"
            onClick={handleLaunchExperience}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-md transition-all active:scale-95 border border-indigo-400/30"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Launch Live Demo</span>
          </button>
        </div>

        {activeTab === "walkthrough" ? (
          /* Guided 7-Step Walkthrough Flow */
          <div className="space-y-5">
            {/* Step Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {judgeSteps.map((s, idx) => (
                <button
                  key={s.number}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    currentStepIndex === idx
                      ? "bg-indigo-950 border-indigo-500 text-indigo-200 shadow-sm"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  Step {s.number}: {s.title.split(". ")[1]}
                </button>
              ))}
            </div>

            {/* Current Step Card */}
            {(() => {
              const currentStep = judgeSteps[currentStepIndex];
              return (
                <div className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
                        {currentStep.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
                            {currentStep.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-300">
                            {currentStep.badge}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-zinc-100">
                          {currentStep.subtitle}
                        </h3>
                      </div>
                    </div>

                    {/* High-impact metric box */}
                    <div className="hidden sm:block text-right p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                      <div className="text-xs font-extrabold text-emerald-400">{currentStep.metric}</div>
                      <div className="text-[10px] text-zinc-400">{currentStep.metricLabel}</div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {currentStep.content}
                  </p>

                  <div className="sm:hidden p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">{currentStep.metricLabel}</span>
                    <span className="text-xs font-extrabold text-emerald-400">{currentStep.metric}</span>
                  </div>

                  {/* Step Navigation Controls */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-900">
                    <button
                      disabled={currentStepIndex === 0}
                      onClick={() => setCurrentStepIndex((i) => Math.max(i - 1, 0))}
                      className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <span className="text-[11px] text-zinc-500 font-mono">
                      {currentStepIndex + 1} of {judgeSteps.length}
                    </span>

                    {currentStepIndex < judgeSteps.length - 1 ? (
                      <button
                        onClick={() => setCurrentStepIndex((i) => Math.min(i + 1, judgeSteps.length - 1))}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition-all"
                      >
                        <span>Next Step</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleLaunchExperience}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Experience Live</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* Architecture & Dimensions Breakdown */
          <div className="space-y-5">
            {/* Comparison: Why SIGNAL is NOT a Todo App */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
                <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Generic Productivity & Todo Apps</span>
                </h4>
                <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                  <li>Piles infinite tasks into unbounded backlogs.</li>
                  <li>Forces the overloaded student to manually organize and prioritize every item.</li>
                  <li>Treats all inputs equally, exacerbating burnout and guilt.</li>
                  <li>Acts as a passive bucket that never tells you to ignore anything.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-indigo-500/30 space-y-2">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>SIGNAL Intelligent Filtering</span>
                </h4>
                <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Protects Attention:</strong> Enforces daily cognitive attention caps (e.g. 70 pts).</li>
                  <li><strong>Calculates Tradeoffs:</strong> Balances Goal Relevance vs. Opportunity Cost vs. Workload.</li>
                  <li><strong>Aggressively Purges Noise:</strong> Automatically drops ~60-70% of distractions to IGNORE.</li>
                  <li><strong>Dynamic Prioritization:</strong> Shifts priorities continuously as urgent deadlines are cleared.</li>
                </ul>
              </div>
            </div>

            {/* The 7 Scoring Dimensions */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                <span>The 7-Dimensional Signal Scoring Formula</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                  <div className="font-bold text-zinc-200">1. Goal Alignment</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Matched to user's ranked career targets.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                  <div className="font-bold text-zinc-200">2. Deadline Proximity</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Strict urgency & delivery window penalty.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                  <div className="font-bold text-zinc-200">3. Opportunity Value</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Long-term leverage for resume & career.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                  <div className="font-bold text-zinc-200">4. Opportunity Cost</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Attention drained away from urgent goals.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                  <div className="font-bold text-zinc-200">5. Cognitive Effort</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Estimated hours & complexity to finish.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                  <div className="font-bold text-zinc-200">6. Reliability Score</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Verification of legitimacy & source.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                  <div className="font-bold text-zinc-200">7. Workload Buffer</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Current active load & remaining pts.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                  <div className="font-bold text-zinc-200">Anti-FOMO Guard</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Detects marketing hype vs genuine value.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Scenario Triggers */}
        <div className="space-y-2 border-t border-zinc-800/80 pt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-200 uppercase tracking-wider">Test Specific Intelligence Scenarios</span>
            <span className="text-[11px] text-zinc-500">Run instant AI evaluation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsJudgeModeOpen(false);
                runScenarioTest("A");
              }}
              className="text-left p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs transition-colors flex items-center justify-between"
            >
              <div>
                <strong className="text-zinc-200 block">Scenario A: DBMS vs 48h Hackathon</strong>
                <span className="text-[11px] text-zinc-400">Tests academic deadline dominance</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            <button
              onClick={() => {
                setIsJudgeModeOpen(false);
                runScenarioTest("E");
              }}
              className="text-left p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs transition-colors flex items-center justify-between"
            >
              <div>
                <strong className="text-zinc-200 block">Scenario E: Decision Engine Query</strong>
                <span className="text-[11px] text-zinc-400">"Should I join the game jam this weekend?"</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
