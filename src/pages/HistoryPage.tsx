import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import { SignalCard } from "../components/SignalCard";
import { 
  History, 
  CheckCircle2, 
  Ban, 
  Hourglass, 
  TrendingUp, 
  ShieldCheck, 
  Trash2, 
  RotateCcw,
  Sparkles,
  Zap
} from "lucide-react";

export const HistoryPage: React.FC = () => {
  const { items, clearAllData, loadDemoData } = useSignal();
  const [subTab, setSubTab] = useState<"completed" | "ignored" | "decayed">("completed");

  const completedItems = items.filter((i) => i.isCompleted);
  const ignoredItems = items.filter((i) => i.category === "IGNORE");
  const decayedItems = items.filter((i) => i.decayStatus && i.decayStatus.includes("Expired"));

  // Cognitive metrics
  const totalIgnoredCount = ignoredItems.length;
  const estimatedHoursSaved = (totalIgnoredCount * 0.75).toFixed(1); // avg 45 mins per distracting rabbit hole avoided
  const totalCompletedPoints = completedItems.reduce((acc, curr) => acc + curr.attentionCost, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
              Signal History & Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Track completed high-impact work, saved attention metrics, and expired noise.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDemoData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Analytics Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold uppercase tracking-wider">Completed Focus</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-100">{completedItems.length} Tasks</div>
          <p className="text-[11px] text-zinc-500">{totalCompletedPoints} attention points successfully executed</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold uppercase tracking-wider">Attention Saved</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-300">~{estimatedHoursSaved} Hours</div>
          <p className="text-[11px] text-zinc-500">Cognitive load spared by auto-ignoring distractions</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold uppercase tracking-wider">Filtered Distractions</span>
            <Ban className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-100">{ignoredItems.length} Dropped</div>
          <p className="text-[11px] text-zinc-500">Consciously eliminated from your mental radar</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <button
            onClick={() => setSubTab("completed")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === "completed"
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed Deliverables ({completedItems.length})</span>
          </button>

          <button
            onClick={() => setSubTab("ignored")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === "ignored"
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Ban className="w-3.5 h-3.5 text-zinc-400" />
            <span>Consciously Ignored Noise ({ignoredItems.length})</span>
          </button>
        </div>

        {/* List Content */}
        {subTab === "completed" && (
          <div className="space-y-4">
            {completedItems.length > 0 ? (
              completedItems.map((item) => <SignalCard key={item.id} item={item} />)
            ) : (
              <div className="p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center text-zinc-400 text-xs">
                No completed tasks yet. Check off items in your Dashboard or Inbox when done!
              </div>
            )}
          </div>
        )}

        {subTab === "ignored" && (
          <div className="space-y-4">
            {ignoredItems.length > 0 ? (
              ignoredItems.map((item) => <SignalCard key={item.id} item={item} />)
            ) : (
              <div className="p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center text-zinc-400 text-xs">
                No ignored items recorded yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
