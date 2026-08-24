import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import { User, Target, Zap, Activity, ArrowUp, ArrowDown, Check, X, Sparkles, Brain, Save } from "lucide-react";
import { StudentGoal } from "../types";

export const MySignalProfileModal: React.FC = () => {
  const {
    isMySignalModalOpen,
    setIsMySignalModalOpen,
    userProfile,
    setUserProfile,
    workloadLevel,
    currentFocus,
    setCurrentFocus,
    updateDailyBudget,
    setQuickToast,
  } = useSignal();

  const [focusInput, setFocusInput] = useState(currentFocus);
  const [budgetInput, setBudgetInput] = useState(userProfile.dailyAttentionBudget || 70);
  const [goals, setGoals] = useState<StudentGoal[]>(userProfile.goals || []);
  const [nameInput, setNameInput] = useState(userProfile.name);

  if (!isMySignalModalOpen) return null;

  const moveGoal = (index: number, direction: "up" | "down") => {
    const newGoals = [...goals];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newGoals.length) return;
    const temp = newGoals[index];
    newGoals[index] = newGoals[targetIdx];
    newGoals[targetIdx] = temp;
    // reassign rank
    const reordered = newGoals.map((g, idx) => ({ ...g, rank: idx + 1 }));
    setGoals(reordered);
  };

  const handleSave = () => {
    setCurrentFocus(focusInput);
    updateDailyBudget(budgetInput);
    setUserProfile((prev) => ({
      ...prev,
      name: nameInput,
      goals,
      dailyAttentionBudget: budgetInput,
      currentFocus: focusInput,
    }));
    setQuickToast({ message: "✨ My Signal Profile updated and calibrated!", type: "success" });
    setIsMySignalModalOpen(false);
  };

  return (
    <div
      id="my-signal-overlay"
      className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">PERSONAL SIGNAL PROFILE</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-zinc-100">
                MY SIGNAL
              </h2>
            </div>
          </div>

          <button
            id="my-signal-close-btn"
            onClick={() => setIsMySignalModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workload Status Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span className="text-zinc-300 font-medium">Derived Workload Level:</span>
          </div>
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
              workloadLevel === "Overloaded"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                : workloadLevel === "Heavy"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : workloadLevel === "Moderate"
                ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
            }`}
          >
            {workloadLevel}
          </span>
        </div>

        {/* Current Focus for Today */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
            Current Focus for Today
          </label>
          <p className="text-[11px] text-zinc-400">
            One temporary single focus that takes precedence over everything else today.
          </p>
          <input
            id="input-current-focus"
            type="text"
            value={focusInput}
            onChange={(e) => setFocusInput(e.target.value)}
            placeholder="e.g. Finish DBMS assignment"
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Attention Budget */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Daily Attention Budget</span>
            </label>
            <span className="text-xs font-extrabold text-amber-400">{budgetInput} Points</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Your maximum cognitive capacity for high-effort decisions and urgent deliverables.
          </p>
          <input
            id="range-attention-budget"
            type="range"
            min="40"
            max="120"
            step="5"
            value={budgetInput}
            onChange={(e) => setBudgetInput(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>40 pts (Light Focus)</span>
            <span>70 pts (Standard)</span>
            <span>120 pts (Maximum)</span>
          </div>
        </div>

        {/* Primary Ranked Goals */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              <span>Primary Ranked Goals (Priority Hierarchy)</span>
            </label>
            <span className="text-[11px] text-zinc-500">Ranked #1 to #{goals.length}</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            SIGNAL weighs all incoming information against this hierarchy. Use arrows to re-rank.
          </p>

          <div className="space-y-2">
            {goals.map((goal, idx) => (
              <div
                key={goal.id}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-xs">
                    #{idx + 1}
                  </span>
                  <span className="font-semibold text-zinc-200">{goal.title}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveGoal(idx, "up")}
                    className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 transition-colors"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === goals.length - 1}
                    onClick={() => moveGoal(idx, "down")}
                    className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 transition-colors"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800/80">
          <button
            onClick={() => setIsMySignalModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200"
          >
            Cancel
          </button>
          <button
            id="my-signal-save-btn"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/50 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
