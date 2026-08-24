import React from "react";
import { useSignal } from "../context/SignalContext";
import { Sun, Sparkles, CheckCircle2, ShieldAlert, ArrowRight, X, Zap, Target } from "lucide-react";

export const MorningSignalModal: React.FC = () => {
  const {
    isMorningBriefOpen,
    setIsMorningBriefOpen,
    dailyBrief,
    items,
    userProfile,
    startFocusSession,
  } = useSignal();

  if (!isMorningBriefOpen) return null;

  const nowItems = items.filter((i) => i.category === "NOW" && !i.isCompleted);
  const nextItems = items.filter((i) => i.category === "NEXT" && !i.isCompleted);
  const ignoreItems = items.filter((i) => i.category === "IGNORE");

  const top3 = [
    ...nowItems.map((i) => ({ title: i.title, reason: i.why, category: "NOW" as const })),
    ...nextItems.map((i) => ({ title: i.title, reason: i.why, category: "NEXT" as const })),
  ].slice(0, 3);

  const ignoredHighlight = ignoreItems[0]
    ? { title: ignoreItems[0].title, reason: ignoreItems[0].why }
    : { title: "Generic AI Webinar Spam & Discord pings", reason: "Zero alignment with today's immediate coursework or career goals." };

  const handleStartToday = () => {
    setIsMorningBriefOpen(false);
    if (nowItems.length > 0) {
      startFocusSession(nowItems[0]);
    }
  };

  return (
    <div
      id="morning-signal-overlay"
      className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">DAILY BRIEFING</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-zinc-100">
                Good morning, {userProfile.name.split(" ")[0]} 👋
              </h2>
            </div>
          </div>

          <button
            id="morning-modal-close"
            onClick={() => setIsMorningBriefOpen(false)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Attention Budget Pill */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Today's Protected Attention Budget:</span>
          </div>
          <span className="font-extrabold text-zinc-100 text-sm">
            {userProfile.dailyAttentionBudget || 70} Points Available
          </span>
        </div>

        {/* 3 Things That Actually Matter Today */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              <span>3 Deliverables That Actually Matter Today</span>
            </h3>
            <span className="text-[11px] text-zinc-500">Curated by SIGNAL</span>
          </div>

          <div className="space-y-2">
            {top3.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        item.category === "NOW"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {item.category}
                    </span>
                    <h4 className="text-xs font-semibold text-zinc-200 truncate">{item.title}</h4>
                  </div>
                  <p className="text-[11px] text-zinc-400">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1 Thing to Ignore Today */}
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/30 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>1 THING TO IGNORE TODAY</span>
          </div>
          <p className="text-xs text-zinc-200 font-medium">{ignoredHighlight.title}</p>
          <p className="text-[11px] text-zinc-400">{ignoredHighlight.reason}</p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => setIsMorningBriefOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200"
          >
            Review Later
          </button>
          <button
            id="morning-start-focus-btn"
            onClick={handleStartToday}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/50 transition-all active:scale-95"
          >
            <span>Start Today's Focus</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
