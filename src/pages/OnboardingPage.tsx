import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import { StudentGoal, GoalCategory } from "../types";
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Trophy, 
  Cpu, 
  DollarSign, 
  Rocket, 
  BookOpen,
  Zap,
  User
} from "lucide-react";

export const OnboardingPage: React.FC = () => {
  const { userProfile, setUserProfile, setCurrentPage, setQuickToast } = useSignal();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [name, setName] = useState(userProfile.name || "Alex");
  const [major, setMajor] = useState(userProfile.major || "Computer Science & Engineering");
  const [yearOfStudy, setYearOfStudy] = useState(userProfile.yearOfStudy || "Junior (3rd Year)");
  const [attentionBudget, setAttentionBudget] = useState(userProfile.dailyAttentionBudget || 100);

  // Available Goals Pool
  const ALL_GOALS_POOL: { category: GoalCategory; title: string; desc: string; icon: any }[] = [
    { category: "academics", title: "🎓 Academic Excellence (GPA Focus)", desc: "Maintain high GPA, coursework, lab assignments, and semester exams", icon: GraduationCap },
    { category: "internship", title: "💼 Summer Tech Internship", desc: "Applications, resume tailoring, technical interview practice, portfolio", icon: Briefcase },
    { category: "projects", title: "💻 Production-Grade Projects", desc: "Building impressive full-stack or systems software to demonstrate mastery", icon: Code },
    { category: "hackathons", title: "🏆 Hackathons & Competitions", desc: "High-visibility sprints, building MVPs, team competitions", icon: Trophy },
    { category: "skills", title: "🧠 Core CS Fundamentals & DSA", desc: "Data structures, algorithms, system design, architecture", icon: Cpu },
    { category: "freelancing", title: "💰 Freelance & Paid Client Work", desc: "Client projects, revenue generation, professional portfolio", icon: DollarSign },
    { category: "startup", title: "🚀 Startup & Venture Building", desc: "Customer validation, building an MVP, pitching to incubators", icon: Rocket },
    { category: "exams", title: "📚 Competitive Exams (GRE/GATE)", desc: "Standardized test preparation and academic entrance exams", icon: BookOpen },
  ];

  const [selectedGoals, setSelectedGoals] = useState<StudentGoal[]>(() => {
    if (userProfile.goals && userProfile.goals.length > 0) return userProfile.goals;
    return [
      { id: "g1", category: "academics", title: "🎓 Academic Excellence (GPA Focus)", rank: 1, icon: "GraduationCap" },
      { id: "g2", category: "internship", title: "💼 Summer Tech Internship", rank: 2, icon: "Briefcase" },
      { id: "g3", category: "projects", title: "💻 Production-Grade Projects", rank: 3, icon: "Code" },
    ];
  });

  const toggleGoal = (poolItem: typeof ALL_GOALS_POOL[0]) => {
    const exists = selectedGoals.find((g) => g.category === poolItem.category);
    if (exists) {
      if (selectedGoals.length <= 1) {
        setQuickToast({ message: "You need at least 1 primary goal.", type: "warning" });
        return;
      }
      const updated = selectedGoals.filter((g) => g.category !== poolItem.category).map((g, idx) => ({ ...g, rank: idx + 1 }));
      setSelectedGoals(updated);
    } else {
      const newGoal: StudentGoal = {
        id: `goal-${Date.now()}-${poolItem.category}`,
        category: poolItem.category,
        title: poolItem.title,
        description: poolItem.desc,
        rank: selectedGoals.length + 1,
        icon: poolItem.category,
      };
      setSelectedGoals([...selectedGoals, newGoal]);
    }
  };

  const moveGoal = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= selectedGoals.length) return;

    const copy = [...selectedGoals];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // re-rank
    const reRanked = copy.map((g, idx) => ({ ...g, rank: idx + 1 }));
    setSelectedGoals(reRanked);
  };

  const handleFinish = () => {
    setUserProfile((prev) => ({
      ...prev,
      name,
      major,
      yearOfStudy,
      dailyAttentionBudget: attentionBudget,
      goals: selectedGoals,
      onboardingCompleted: true,
    }));
    setQuickToast({ message: "SIGNAL Engine calibrated! Welcome to your dashboard.", type: "success" });
    setCurrentPage("dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
            {step}/3
          </div>
          <div>
            <h1 className="text-base font-bold text-zinc-100">Calibrate Your Signal Engine</h1>
            <p className="text-xs text-zinc-400">
              {step === 1 ? "Student Profile" : step === 2 ? "Goal & Priority Ranking" : "Attention Budget Calibration"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-6 h-1.5 rounded-full transition-all ${
                s === step ? "bg-indigo-500 w-8" : s < step ? "bg-emerald-500" : "bg-zinc-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: Profile */}
      {step === 1 && (
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-zinc-100">Step 1: Academic Profile</h2>
            <p className="text-xs text-zinc-400">
              SIGNAL tailors urgency and academic opportunity scoring to your stage of university.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Your First Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Major / Degree:</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. Computer Science, Electrical Engineering"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Year of Study:</label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Freshman (1st Year)">Freshman (1st Year)</option>
                <option value="Sophomore (2nd Year)">Sophomore (2nd Year)</option>
                <option value="Junior (3rd Year)">Junior (3rd Year)</option>
                <option value="Senior (4th Year)">Senior (4th Year)</option>
                <option value="Graduate Student">Graduate Student</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all"
            >
              <span>Next: Set Goals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Goal Selection & Ranking */}
      {step === 2 && (
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-zinc-100">Step 2: Define & Rank Your Priorities</h2>
            <p className="text-xs text-zinc-400">
              SIGNAL uses this strict order to filter noise. Items supporting Goal #1 automatically outrank lower goals.
            </p>
          </div>

          {/* Goal Selection Pool */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Select Current Focus Areas:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALL_GOALS_POOL.map((item) => {
                const isSelected = selectedGoals.some((g) => g.category === item.category);
                return (
                  <button
                    key={item.category}
                    type="button"
                    onClick={() => toggleGoal(item)}
                    className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                      isSelected
                        ? "bg-indigo-950/40 border-indigo-500/60 text-zinc-100"
                        : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <div className="space-y-0.5 pr-2">
                      <span className="text-xs font-semibold block">{item.title}</span>
                      <span className="text-[10px] text-zinc-400 line-clamp-1">{item.desc}</span>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ranked Order List */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Current Priority Order (Top to Bottom):
              </span>
              <span className="text-[10px] text-indigo-400 font-medium">Use arrows to reorder</span>
            </div>

            <div className="space-y-2">
              {selectedGoals.map((goal, idx) => (
                <div
                  key={goal.category}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/90 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-950 border border-indigo-800/80 text-indigo-300 font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-zinc-200">{goal.title}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveGoal(idx, "up")}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === selectedGoals.length - 1}
                      onClick={() => moveGoal(idx, "down")}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all"
            >
              <span>Next: Attention Budget</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Attention Budget Calibration */}
      {step === 3 && (
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-zinc-100">Step 3: Attention Budget Calibration</h2>
            <p className="text-xs text-zinc-400">
              Students have limited daily attention. SIGNAL will never allow more tasks into your NOW bucket than this capacity.
            </p>
          </div>

          {/* Budget Slider */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Zap className="w-4 h-4" />
                <span>Daily Attention Points</span>
              </div>
              <span className="text-xl font-extrabold text-zinc-100">{attentionBudget} Pts</span>
            </div>

            <input
              type="range"
              min={60}
              max={140}
              step={10}
              value={attentionBudget}
              onChange={(e) => setAttentionBudget(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>60 Pts (Exam / Focus Mode)</span>
              <span>100 Pts (Standard Semester)</span>
              <span>140 Pts (High-Sprint Mode)</span>
            </div>

            <div className="pt-2 text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
              <span className="font-semibold text-indigo-300">Estimated Workload Capacity: </span>
              {attentionBudget <= 70
                ? "Max 2 hard academic tasks + 1 light review. Protects against exam burnout."
                : attentionBudget <= 100
                ? "Optimal balance: 2-3 NOW priority items + 2 NEXT items."
                : "Aggressive sprint capacity: Up to 4 active deliverables per day."}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Back
            </button>
            <button
              id="finish-onboarding-btn"
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-950/60 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch SIGNAL Engine</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
