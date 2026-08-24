import React from "react";
import { useSignal } from "../context/SignalContext";
import { Zap, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";

export const AttentionBudgetGauge: React.FC = () => {
  const { attentionUsed, attentionRemaining, userProfile, items } = useSignal();
  const total = userProfile.dailyAttentionBudget || 100;
  const percentage = Math.min(Math.round((attentionUsed / total) * 100), 100);

  const activeNowCount = items.filter((i) => i.category === "NOW" && !i.isCompleted).length;
  const activeNextCount = items.filter((i) => i.category === "NEXT" && !i.isCompleted).length;

  const isOverload = percentage >= 85;
  const isHeavy = percentage >= 70 && !isOverload;

  return (
    <div 
      id="attention-budget-card"
      className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl border ${
            isOverload 
              ? "bg-rose-950/40 border-rose-800/60 text-rose-400" 
              : isHeavy 
              ? "bg-amber-950/40 border-amber-800/60 text-amber-400" 
              : "bg-emerald-950/40 border-emerald-800/60 text-emerald-400"
          }`}>
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100">Daily Attention Budget</h3>
            <p className="text-[11px] text-zinc-400">Cognitive capacity allocation</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-extrabold text-zinc-100">{attentionUsed}</span>
          <span className="text-xs text-zinc-400"> / {total} pts</span>
        </div>
      </div>

      {/* Segmented Meter Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800 flex gap-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isOverload
                ? "bg-gradient-to-r from-amber-500 to-rose-500 shadow-sm shadow-rose-500/50"
                : isHeavy
                ? "bg-gradient-to-r from-emerald-500 to-amber-500"
                : "bg-emerald-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-zinc-400 font-medium">
          <span>{percentage}% Utilized</span>
          <span>{attentionRemaining} pts Available</span>
        </div>
      </div>

      {/* Workload Breakdown */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs">
          <span className="text-zinc-400">🔴 NOW Tasks ({activeNowCount})</span>
          <span className="font-bold text-rose-300">High Load</span>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs">
          <span className="text-zinc-400">🟡 NEXT Tasks ({activeNextCount})</span>
          <span className="font-bold text-amber-300">Moderate</span>
        </div>
      </div>

      {/* Advisory Message */}
      {isOverload ? (
        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/50 flex items-start gap-2.5 text-xs text-rose-200">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p>
            <span className="font-bold">Attention Overload Warning: </span>
            You have too many high-effort NOW deliverables competing for today. Defer non-critical items to protect your completion rate.
          </p>
        </div>
      ) : isHeavy ? (
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-200">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <span className="font-bold">Dense Workload: </span>
            Attention is approaching capacity. Finish current priority before accepting new tasks.
          </p>
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 flex items-center gap-2 text-xs text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Optimal attention capacity. Ready to focus.</span>
        </div>
      )}
    </div>
  );
};
