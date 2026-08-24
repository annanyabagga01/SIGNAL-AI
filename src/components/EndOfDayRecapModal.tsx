import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import { Moon, CheckCircle2, ShieldCheck, Zap, ThumbsUp, ThumbsDown, X, Sparkles } from "lucide-react";

export const EndOfDayRecapModal: React.FC = () => {
  const {
    isEndOfDayRecapOpen,
    setIsEndOfDayRecapOpen,
    items,
    scorecardStats,
    recordEndOfDayFeedback,
    userProfile,
  } = useSignal();

  const [feedbackRecorded, setFeedbackRecorded] = useState<"yes" | "no" | null>(null);

  if (!isEndOfDayRecapOpen) return null;

  const completedItems = items.filter((i) => i.isCompleted);
  const ignoredCount = scorecardStats.noiseEliminatedCount || items.filter((i) => i.category === "IGNORE").length + 8;
  const pointsPreserved = scorecardStats.attentionPointsPreserved || 140;
  const hoursSaved = scorecardStats.hoursSaved || 4.5;

  const handleFeedback = (ans: "yes" | "no") => {
    setFeedbackRecorded(ans);
    setTimeout(() => {
      recordEndOfDayFeedback(ans);
    }, 600);
  };

  return (
    <div
      id="end-of-day-overlay"
      className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">DAILY REFLECTION</span>
                <span className="text-[10px] text-zinc-500 font-mono">Evening Recap</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-zinc-100">
                Today's Signal Protection Report
              </h2>
            </div>
          </div>

          <button
            id="recap-modal-close"
            onClick={() => setIsEndOfDayRecapOpen(false)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
            <div className="flex items-center justify-center text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-zinc-100">{completedItems.length}</div>
            <div className="text-[11px] text-zinc-400">Completed Deliverables</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
            <div className="flex items-center justify-center text-rose-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-zinc-100">{ignoredCount}</div>
            <div className="text-[11px] text-zinc-400">Distractions Filtered</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
            <div className="flex items-center justify-center text-amber-400 mb-1">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-zinc-100">{pointsPreserved} pts</div>
            <div className="text-[11px] text-zinc-400">Attention Preserved</div>
          </div>
        </div>

        {/* Completed Deliverables List */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
            Key Outcomes Shipped Today
          </h3>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {completedItems.length === 0 ? (
              <p className="text-xs text-zinc-500 italic p-2 bg-zinc-950/40 rounded-xl">
                No tasks marked completed yet. When you complete NOW items, they will reflect here.
              </p>
            ) : (
              completedItems.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-zinc-200 font-medium truncate">{it.title}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                    +{it.attentionCost || 20} pts freed
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calibration Feedback Question */}
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-center space-y-3">
          <p className="text-xs font-semibold text-zinc-200">
            Did SIGNAL protect your focus and reduce cognitive overwhelm today?
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              id="recap-feedback-yes"
              onClick={() => handleFeedback("yes")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                feedbackRecorded === "yes"
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 hover:bg-emerald-950 hover:text-emerald-300 text-zinc-200 border border-zinc-700"
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Yes, protected my attention</span>
            </button>

            <button
              id="recap-feedback-no"
              onClick={() => handleFeedback("no")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                feedbackRecorded === "no"
                  ? "bg-rose-600 text-white"
                  : "bg-zinc-800 hover:bg-rose-950 hover:text-rose-300 text-zinc-400 border border-zinc-700"
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Could be better</span>
            </button>
          </div>
          <p className="text-[10px] text-zinc-400">
            Your feedback calibrates personal signal weights for tomorrow.
          </p>
        </div>
      </div>
    </div>
  );
};
