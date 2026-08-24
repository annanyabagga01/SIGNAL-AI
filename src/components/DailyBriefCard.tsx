import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import { 
  SunMedium, 
  RotateCw, 
  CheckCircle2, 
  ArrowRight, 
  Ban, 
  AlertOctagon, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target
} from "lucide-react";

export const DailyBriefCard: React.FC = () => {
  const { dailyBrief, generateDailyBrief, isAiLoading, userProfile } = useSignal();
  const [collapsed, setCollapsed] = useState(false);

  if (!dailyBrief) return null;

  return (
    <div 
      id="daily-brief-card"
      className="relative rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-indigo-900/40 p-5 sm:p-6 shadow-lg shadow-indigo-950/20 overflow-hidden"
    >
      {/* Glow orb */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <SunMedium className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-zinc-100">
                SIGNAL BRIEF ☀️
              </h2>
              <span className="text-xs text-zinc-400 font-mono">
                {dailyBrief.date}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {dailyBrief.greeting}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Brief */}
          <button
            id="refresh-brief-btn"
            onClick={() => generateDailyBrief()}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700/60 transition-colors disabled:opacity-50"
            title="Regenerate morning brief with AI"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAiLoading ? "animate-spin text-indigo-400" : ""}`} />
            <span className="hidden sm:inline">Refresh Brief</span>
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="pt-4 space-y-4 text-xs sm:text-sm">
          {/* Grid layout for MUST DO, SHOULD DO, IGNORE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* MUST DO (2-3 items) */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>MUST DO TODAY</span>
              </div>
              <div className="space-y-2">
                {dailyBrief.mustDo.map((item, i) => (
                  <div key={i} className="p-2 rounded-lg bg-zinc-950/70 border border-rose-950/60 space-y-0.5">
                    <div className="flex items-center justify-between text-zinc-100 font-semibold text-xs">
                      <span>{item.title}</span>
                      {item.effort && (
                        <span className="text-[10px] text-zinc-400 font-normal">{item.effort}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-tight">
                      {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* SHOULD DO */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>SHOULD DO (NEXT)</span>
              </div>
              <div className="space-y-2">
                {dailyBrief.shouldDo.map((item, i) => (
                  <div key={i} className="p-2 rounded-lg bg-zinc-950/70 border border-amber-950/60 space-y-0.5">
                    <div className="flex items-center justify-between text-zinc-100 font-semibold text-xs">
                      <span>{item.title}</span>
                      {item.effort && (
                        <span className="text-[10px] text-zinc-400 font-normal">{item.effort}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-tight">
                      {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* IGNORE (Distractions to intentionally drop) */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                <Ban className="w-3.5 h-3.5 text-zinc-400" />
                <span>CONSCIOUSLY IGNORE</span>
              </div>
              <div className="space-y-2">
                {dailyBrief.ignoreList.map((item, i) => (
                  <div key={i} className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-0.5">
                    <span className="text-zinc-300 font-medium text-xs block line-through decoration-zinc-600">
                      {item.title}
                    </span>
                    <p className="text-[11px] text-zinc-400 leading-tight">
                      {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ONE THING TO AVOID */}
          {dailyBrief.oneThingToAvoid && (
            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/30 flex items-start gap-2.5 text-xs">
              <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-300">One Thing to Avoid Today: </span>
                <span className="text-zinc-300">{dailyBrief.oneThingToAvoid}</span>
              </div>
            </div>
          )}

          {/* GOLDEN RULE (If you only accomplish one thing...) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/60 to-emerald-950/40 border border-indigo-800/50 flex items-center gap-3">
            <Target className="w-5 h-5 text-indigo-400 shrink-0" />
            <p className="text-xs sm:text-sm font-medium text-zinc-100 italic">
              «{dailyBrief.goldenRule}»
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
