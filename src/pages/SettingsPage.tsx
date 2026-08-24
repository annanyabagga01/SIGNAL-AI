import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import { 
  Settings, 
  Target, 
  Zap, 
  Sliders, 
  User, 
  RotateCcw, 
  Trash2, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Plus,
  Shield,
  Brain,
  Sparkles,
  Activity,
  Lightbulb
} from "lucide-react";
import { StudentGoal } from "../types";
import { INITIAL_GOALS } from "../data/demoData";

export const SettingsPage: React.FC = () => {
  const { 
    userProfile, 
    setUserProfile, 
    loadDemoData, 
    clearAllData, 
    setQuickToast,
    currentFocus,
    setCurrentFocus,
    workloadLevel,
    learnedPatterns,
    clearSignalMemory
  } = useSignal();

  const [name, setName] = useState(userProfile.name);
  const [major, setMajor] = useState(userProfile.major);
  const [yearOfStudy, setYearOfStudy] = useState(userProfile.yearOfStudy);
  const [dailyBudget, setDailyBudget] = useState(userProfile.dailyAttentionBudget || 70);
  const [filterAggressiveness, setFilterAggressiveness] = useState(userProfile.filterAggressiveness || "balanced");
  const [goals, setGoals] = useState<StudentGoal[]>(userProfile.goals || []);
  const [focusInput, setFocusInput] = useState(currentFocus || userProfile.currentFocus || "Finish DBMS assignment");

  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [confirmAction, setConfirmAction] = useState<"reset_signal" | "clear_memory" | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentFocus(focusInput);
    setUserProfile((prev) => ({
      ...prev,
      name,
      major,
      yearOfStudy,
      dailyAttentionBudget: dailyBudget,
      filterAggressiveness,
      goals,
      currentFocus: focusInput,
    }));
    setQuickToast({ message: "✨ Settings and My Signal profile saved successfully!", type: "success" });
  };

  const moveGoal = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= goals.length) return;
    const copy = [...goals];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setGoals(copy.map((g, idx) => ({ ...g, rank: idx + 1 })));
  };

  const removeGoal = (id: string) => {
    if (goals.length <= 1) {
      setQuickToast({ message: "You must keep at least 1 primary goal.", type: "warning" });
      return;
    }
    setGoals(goals.filter((g) => g.id !== id).map((g, idx) => ({ ...g, rank: idx + 1 })));
  };

  const addCustomGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newGoal: StudentGoal = {
      id: `custom-goal-${Date.now()}`,
      category: "other",
      title: newGoalTitle.trim(),
      rank: goals.length + 1,
      icon: "Target",
    };
    setGoals([...goals, newGoal]);
    setNewGoalTitle("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Brain className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            MY SIGNAL: Profile & Configuration
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400">
          Personalize your ranked goals, single daily focus, attention limits, and AI filtering intelligence.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* 1. Derived Workload & Today's Single Focus */}
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Current Workload & Daily Focus</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Derived Status:</span>
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                  workloadLevel === "Overloaded"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : workloadLevel === "Heavy"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                }`}
              >
                {workloadLevel}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 block">
              Current Temporary Single Focus for Today:
            </label>
            <input
              type="text"
              value={focusInput}
              onChange={(e) => setFocusInput(e.target.value)}
              placeholder="e.g. Finish DBMS assignment"
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 text-xs text-zinc-100 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-zinc-500">
              SIGNAL prioritizes inputs directly tied to this focus before promoting other opportunities.
            </p>
          </div>
        </div>

        {/* 2. Student Profile */}
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Academic Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Major / Program:</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Year of Study:</label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Freshman (1st Year)">Freshman (1st Year)</option>
                <option value="Sophomore (2nd Year)">Sophomore (2nd Year)</option>
                <option value="Junior (3rd Year)">Junior (3rd Year)</option>
                <option value="Senior (4th Year)">Senior (4th Year)</option>
                <option value="Graduate Student">Graduate Student</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Priority Goals Ranking */}
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Primary Ranked Goals (Priority Hierarchy)</span>
            </div>
            <span className="text-[11px] text-zinc-400">#1 = Highest Goal Relevance Score</span>
          </div>

          <div className="space-y-2">
            {goals.map((g, idx) => (
              <div
                key={g.id}
                className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold flex items-center justify-center text-xs">
                    #{idx + 1}
                  </span>
                  <span className="font-semibold text-zinc-200">{g.title}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveGoal(idx, "up")}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === goals.length - 1}
                    onClick={() => moveGoal(idx, "down")}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeGoal(g.id)}
                    className="p-1 rounded text-zinc-500 hover:text-rose-400 ml-1"
                    title="Remove goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add custom goal */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              placeholder="Add new custom priority goal..."
              className="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={addCustomGoal}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Goal</span>
            </button>
          </div>
        </div>

        {/* 4. Attention Budget & AI Aggressiveness */}
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Attention Budget & Noise Protection</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Daily Points */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-zinc-300">Daily Attention Budget:</span>
                <span className="font-bold text-amber-400">{dailyBudget} pts/day</span>
              </div>
              <input
                type="range"
                min={40}
                max={120}
                step={5}
                value={dailyBudget}
                onChange={(e) => setDailyBudget(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <p className="text-[11px] text-zinc-500">
                Determines how many NOW tasks SIGNAL allows before triggering overload warnings.
              </p>
            </div>

            {/* Aggressiveness */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-zinc-300 block">
                Noise Filter Strictness:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "permissive", label: "Permissive" },
                  { id: "balanced", label: "Balanced" },
                  { id: "aggressive", label: "Strict Anti-FOMO" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFilterAggressiveness(opt.id as any)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      filterAggressiveness === opt.id
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-500">
                Strict mode drops newsletters, non-urgent webinars, and unaligned hackathons into IGNORE.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Learned Signal Patterns & Adaptive AI Memory */}
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Learned Signal Patterns & Feedback Memory</span>
            </div>
            <button
              type="button"
              onClick={() => setConfirmAction("clear_memory")}
              className="text-xs text-zinc-400 hover:text-rose-400 transition-colors"
            >
              Reset Memory
            </button>
          </div>

          <div className="space-y-2">
            {learnedPatterns && learnedPatterns.length > 0 ? (
              learnedPatterns.map((pattern, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex items-start gap-2.5 text-zinc-300"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{pattern}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500">No custom patterns learned yet.</p>
            )}
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-950/80 transition-all active:scale-95"
          >
            Save All Settings
          </button>
        </div>
      </form>

      {/* 6. Danger Zone */}
      <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-900/30 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-rose-300">Data Management & Reset</h3>
          <p className="text-xs text-zinc-400">
            Safely reset sample tasks, restore default configurations, or clear your local browser persistence.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            id="btn-settings-reset-signal"
            onClick={() => setConfirmAction("reset_signal")}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>RESET SIGNAL (Defaults)</span>
          </button>

          <button
            type="button"
            id="btn-settings-clear-memory"
            onClick={() => setConfirmAction("clear_memory")}
            className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR SIGNAL MEMORY</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-zinc-100">
                  {confirmAction === "reset_signal" ? "Reset SIGNAL to Defaults?" : "Clear All SIGNAL Memory?"}
                </h4>
                <p className="text-xs text-zinc-400">Confirmation Required</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {confirmAction === "reset_signal"
                ? "This will restore the realistic student goals, attention budget (70 pts), and default sample items."
                : "This will permanently purge all local storage, items, learned AI patterns, and user preferences from your browser cache."}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-action"
                onClick={() => {
                  if (confirmAction === "reset_signal") {
                    loadDemoData();
                    setGoals(INITIAL_GOALS);
                    setDailyBudget(70);
                    setFocusInput("Finish DBMS assignment");
                  } else {
                    clearSignalMemory();
                    setGoals([]);
                    setFocusInput("");
                  }
                  setConfirmAction(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/80"
              >
                {confirmAction === "reset_signal" ? "Confirm Reset" : "Confirm Clear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
