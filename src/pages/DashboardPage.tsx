import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import { SignalCard } from "../components/SignalCard";
import { SignalPulseBanner } from "../components/SignalPulseBanner";
import { InformationFunnel } from "../components/InformationFunnel";
import { SignalTimeline } from "../components/SignalTimeline";
import { AttentionBudgetGauge } from "../components/AttentionBudgetGauge";
import { SignalScorecard } from "../components/SignalScorecard";
import { 
  Sparkles, 
  Filter, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  Clock, 
  EyeOff, 
  Zap,
  Target,
  Plus,
  Play,
  Scale,
  Sun,
  Moon,
  User,
  ChevronDown,
  ChevronUp,
  Layers
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { 
    items, 
    userProfile, 
    attentionUsed,
    filteredCountToday, 
    filterItem, 
    isAiLoading, 
    setCurrentPage,
    currentFocus,
    setIsMySignalModalOpen,
    setIsJudgeModeOpen,
    setIsMorningBriefOpen,
    setIsEndOfDayRecapOpen,
    loadRealisticDemoScenario
  } = useSignal();

  const [quickPasteText, setQuickPasteText] = useState("");
  const [showIgnoreSection, setShowIgnoreSection] = useState(false);

  // Section 1: RIGHT NOW (Max 1-2 items only)
  const nowItems = items.filter((i) => i.category === "NOW" && !i.isCompleted);
  const completedNowItems = items.filter((i) => i.category === "NOW" && i.isCompleted);
  
  // Section 2: AFTER THAT (2-3 items for NEXT)
  const nextItems = items.filter((i) => i.category === "NEXT" && !i.isCompleted);

  // Section 3: IGNORE FOR NOW (Deliberately filtered noise)
  const ignoreItems = items.filter((i) => i.category === "IGNORE");

  // Other Later items
  const laterItems = items.filter((i) => i.category === "LATER" && !i.isCompleted);

  const budget = userProfile.dailyAttentionBudget || 70;
  const remainingBudget = Math.max(budget - attentionUsed, 0);

  const handleQuickFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPasteText.trim()) return;
    await filterItem(quickPasteText, "Other");
    setQuickPasteText("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Information Bar & Command Center */}
      <div className="space-y-4 pb-4 border-b border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
                YOUR SIGNAL
              </h1>
              <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Filtering Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              What actually deserves your attention right now • <span className="text-zinc-300 font-medium">{remainingBudget} / {budget} pts remaining</span>
            </p>
          </div>

          {/* Quick Experience Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-quick-experience"
              onClick={loadRealisticDemoScenario}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Experience SIGNAL</span>
            </button>

            <button
              id="btn-morning-brief"
              onClick={() => setIsMorningBriefOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-colors"
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Morning Brief</span>
            </button>

            <button
              id="btn-evening-recap"
              onClick={() => setIsEndOfDayRecapOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-colors"
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Evening Recap</span>
            </button>

            <button
              id="btn-judge-mode"
              onClick={() => setIsJudgeModeOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-medium border border-amber-500/30 transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Judge Mode</span>
            </button>
          </div>
        </div>

        {/* Current Focus & Signal Pulse Banner */}
        <SignalPulseBanner />
      </div>

      {/* 2. Main Signal Stream (Left: RIGHT NOW, AFTER THAT, IGNORE; Right: Budget & Fast Filter) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Structured Signal Hierarchy */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION 1: RIGHT NOW (Max 1-2 Items Only) */}
          <div id="section-right-now" className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <h2 className="text-base sm:text-lg font-extrabold text-zinc-100 uppercase tracking-wide">
                  RIGHT NOW
                </h2>
                <span className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded-md font-semibold">
                  {nowItems.length} Urgent Focus
                </span>
              </div>
              <span className="text-xs text-zinc-500 font-medium">
                Max 1–2 high-contrast deliverables
              </span>
            </div>

            {nowItems.length > 0 ? (
              <div className="space-y-4">
                {nowItems.map((item, idx) => (
                  <SignalCard 
                    key={item.id} 
                    item={item} 
                    highlightRank={idx + 1}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-zinc-200">No urgent blocker deliverables right now!</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Your burning tasks are cleared. Check <strong className="text-zinc-200">AFTER THAT</strong> below for the next highest leverage project.
                </p>
              </div>
            )}
          </div>

          {/* SECTION 2: AFTER THAT (2-3 Items for NEXT) */}
          <div id="section-after-that" className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <h2 className="text-base sm:text-lg font-bold text-zinc-100 uppercase tracking-wide">
                  AFTER THAT
                </h2>
                <span className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-md font-semibold">
                  {nextItems.length} Queued
                </span>
              </div>
              <span className="text-xs text-zinc-500 font-medium">
                High-leverage tasks queued next
              </span>
            </div>

            {nextItems.length > 0 ? (
              <div className="space-y-3.5">
                {nextItems.slice(0, 3).map((item) => (
                  <SignalCard 
                    key={item.id} 
                    item={item} 
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 text-xs text-zinc-400 text-center">
                No items in the NEXT queue.
              </div>
            )}
          </div>

          {/* SECTION 3: IGNORE FOR NOW (Filtered Noise with Relief) */}
          <div id="section-ignore-for-now" className="space-y-3">
            <button
              id="toggle-ignore-accordion"
              onClick={() => setShowIgnoreSection(!showIgnoreSection)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <EyeOff className="w-4 h-4 text-zinc-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                      IGNORE FOR NOW
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold">
                      {ignoreItems.length} Purged Noise Items
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Items intentionally filtered out to protect your focus today.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <span>{showIgnoreSection ? "Hide Dropped Noise" : "View Filtered"}</span>
                {showIgnoreSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showIgnoreSection && (
              <div className="space-y-3 pt-1">
                {ignoreItems.length > 0 ? (
                  ignoreItems.map((item) => (
                    <SignalCard 
                      key={item.id} 
                      item={item} 
                    />
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 text-center py-2">No ignored items currently.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Attention Budget Gauge & Fast Noise Intake */}
        <div className="lg:col-span-4 space-y-6">
          {/* Attention Budget Gauge */}
          <AttentionBudgetGauge />

          {/* Fast Noise Intake Dropzone */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-100">Quick Noise Filter</h3>
                <p className="text-[10px] text-zinc-400">Paste anything to filter in 2 seconds</p>
              </div>
            </div>

            <form onSubmit={handleQuickFilter} className="space-y-2.5">
              <textarea
                value={quickPasteText}
                onChange={(e) => setQuickPasteText(e.target.value)}
                placeholder="Paste WhatsApp group alert, email, internship link, hackathon banner..."
                rows={3}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-sans"
              />

              <button
                type="submit"
                disabled={isAiLoading || !quickPasteText.trim()}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md disabled:opacity-50 transition-all"
              >
                {isAiLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Filter Through SIGNAL</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Navigation to Decision Mode */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-900/40 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
              <Zap className="w-3.5 h-3.5" />
              <span>Should I Do This? (Decision Mode)</span>
            </div>
            <p className="text-[11px] text-zinc-300">
              Contemplating an unexpected hackathon, seminar, or coffee chat? Test opportunity cost before committing.
            </p>
            <button
              onClick={() => setCurrentPage("decision")}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 pt-1"
            >
              <span>Ask Decision Engine</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Information Funnel (Interactive NOISE -> SIGNAL) */}
      <InformationFunnel />

      {/* 4. Signal Timeline (Morning -> Afternoon -> Evening -> Night) */}
      <SignalTimeline />

      {/* 5. SIGNAL Intelligence Scorecard */}
      <SignalScorecard />
    </div>
  );
};
