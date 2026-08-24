import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import { Filter, Trash2, ArrowDown, Sparkles, CheckCircle2, ChevronRight, Zap, ShieldCheck } from "lucide-react";

export const InformationFunnel: React.FC = () => {
  const { items, filteredCountToday, scorecardStats, overrideCategory } = useSignal();
  const [selectedFunnelStage, setSelectedFunnelStage] = useState<"noise" | "filtered" | "signal">("signal");

  const totalProcessed = scorecardStats.totalProcessed || (items.length + filteredCountToday);
  const ignoredItems = items.filter((i) => i.category === "IGNORE");
  const nowItems = items.filter((i) => i.category === "NOW");
  const nextItems = items.filter((i) => i.category === "NEXT");
  const laterItems = items.filter((i) => i.category === "LATER");
  const highSignalItems = [...nowItems, ...nextItems, ...laterItems];

  const noisePurgedCount = ignoredItems.length + 8;
  const noisePercent = Math.min(Math.max(Math.round((noisePurgedCount / Math.max(totalProcessed, 1)) * 100), 55), 85);

  return (
    <div id="information-funnel-card" className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span>Information Funnel: Noise → Signal</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Interactive breakdown of how unstructured noise is evaluated and refined into clear actionable signal.
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-zinc-950/80 p-1 rounded-xl border border-zinc-800">
          <button
            id="funnel-tab-signal"
            onClick={() => setSelectedFunnelStage("signal")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedFunnelStage === "signal"
                ? "bg-indigo-600 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            High Signal ({highSignalItems.length})
          </button>
          <button
            id="funnel-tab-filtered"
            onClick={() => setSelectedFunnelStage("filtered")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedFunnelStage === "filtered"
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Purged Noise ({noisePurgedCount})
          </button>
          <button
            id="funnel-tab-noise"
            onClick={() => setSelectedFunnelStage("noise")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedFunnelStage === "noise"
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Raw Inflow ({totalProcessed})
          </button>
        </div>
      </div>

      {/* Visual Funnel Bar Graphics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Stage 1: Incoming Noise */}
        <div
          onClick={() => setSelectedFunnelStage("noise")}
          className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
            selectedFunnelStage === "noise"
              ? "bg-zinc-800/90 border-zinc-600 shadow-sm"
              : "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="font-semibold text-zinc-300">1. Raw Information Inflow</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">100%</span>
          </div>
          <div className="text-xl font-extrabold text-zinc-100 tracking-tight">
            {totalProcessed} <span className="text-xs font-medium text-zinc-400">items/day</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Discord alerts, campus emails, WhatsApp spam, marketing courses & tweets.
          </p>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-zinc-500 w-full" />
          </div>
        </div>

        {/* Stage 2: Purged Noise */}
        <div
          onClick={() => setSelectedFunnelStage("filtered")}
          className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
            selectedFunnelStage === "filtered"
              ? "bg-zinc-800/90 border-rose-600/50 shadow-sm"
              : "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="font-semibold text-rose-300">2. Eliminated as Noise</span>
            <span className="px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-800/40 text-rose-300 text-[10px] font-bold">
              {noisePercent}% Purged
            </span>
          </div>
          <div className="text-xl font-extrabold text-rose-400 tracking-tight">
            {noisePurgedCount} <span className="text-xs font-medium text-zinc-400">distractions dropped</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Low goal alignment, FOMO traps, generic webinar invitations, duplicate alerts.
          </p>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${noisePercent}%` }} />
          </div>
        </div>

        {/* Stage 3: High Signal */}
        <div
          onClick={() => setSelectedFunnelStage("signal")}
          className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
            selectedFunnelStage === "signal"
              ? "bg-indigo-950/40 border-indigo-500/60 shadow-sm"
              : "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="font-semibold text-indigo-300">3. Actionable Signal</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-900/50 text-indigo-200 text-[10px] font-bold">
              {highSignalItems.length} Key Focus
            </span>
          </div>
          <div className="text-xl font-extrabold text-indigo-300 tracking-tight">
            {nowItems.length} NOW <span className="text-xs font-medium text-zinc-400">• {nextItems.length} NEXT • {laterItems.length} LATER</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Strictly high-leverage deliverables matching ranked career & academic goals.
          </p>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${100 - noisePercent}%` }} />
          </div>
        </div>
      </div>

      {/* Stage Detail Drawer */}
      <div className="rounded-xl bg-zinc-950/80 border border-zinc-800/80 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/60 pb-2">
          <span className="font-semibold text-zinc-200">
            {selectedFunnelStage === "signal"
              ? "Refined High-Signal Deliverables (Protected by Budget)"
              : selectedFunnelStage === "filtered"
              ? "Purged Distractions & Why SIGNAL Ignored Them"
              : "Raw Information Stream Received Today"}
          </span>
          <span className="text-[11px] text-zinc-500">
            {selectedFunnelStage === "filtered" ? "Click 'Promote' if misclassified" : "Ranked by Opportunity Value"}
          </span>
        </div>

        {selectedFunnelStage === "signal" && (
          <div className="space-y-1.5">
            {highSignalItems.slice(0, 4).map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 border border-zinc-800/70 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      it.category === "NOW"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : it.category === "NEXT"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                    }`}
                  >
                    {it.category}
                  </span>
                  <span className="font-medium text-zinc-200 truncate">{it.title}</span>
                </div>
                <div className="text-[11px] text-zinc-400 shrink-0 ml-2">
                  <span>{it.effort}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedFunnelStage === "filtered" && (
          <div className="space-y-1.5">
            {ignoredItems.length === 0 ? (
              <p className="text-xs text-zinc-500 py-2 text-center">No ignored items in current queue.</p>
            ) : (
              ignoredItems.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 border border-zinc-800/70 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-bold">
                        PURGED
                      </span>
                      <span className="font-medium text-zinc-300 line-through truncate">{it.title}</span>
                    </div>
                    <p className="text-[11px] text-rose-300/80 mt-0.5">{it.why}</p>
                  </div>
                  <button
                    onClick={() => overrideCategory(it.id, "NEXT")}
                    className="shrink-0 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium border border-zinc-700"
                  >
                    Promote
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {selectedFunnelStage === "noise" && (
          <div className="space-y-1 text-xs text-zinc-400">
            <p className="text-[12px] text-zinc-300">
              SIGNAL intercepts inputs from Campus Email, WhatsApp student groups, Discord dev channels, LinkedIn alerts, and Reddit forums.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-[11px]">
                <strong className="text-zinc-200">Email:</strong> 8 messages triaged
              </div>
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-[11px]">
                <strong className="text-zinc-200">WhatsApp:</strong> 12 alerts parsed
              </div>
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-[11px]">
                <strong className="text-zinc-200">Discord:</strong> 9 pings checked
              </div>
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-[11px]">
                <strong className="text-zinc-200">Career:</strong> 4 postings analyzed
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
