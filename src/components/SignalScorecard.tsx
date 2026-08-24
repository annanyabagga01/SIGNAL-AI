import React from "react";
import { useSignal } from "../context/SignalContext";
import { TEST_SCENARIOS } from "../data/demoData";
import {
  ShieldCheck,
  Zap,
  Clock,
  Ban,
  Target,
  ThumbsUp,
  Play,
  Sparkles,
  BarChart3,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const SignalScorecard: React.FC = () => {
  const { 
    scorecardStats, 
    runScenarioTest, 
    isAiLoading, 
    activeAiMessage, 
    resetToDemoData, 
    clearAllData 
  } = useSignal();

  return (
    <div className="space-y-8" id="signal-scorecard-section">
      {/* Top Banner & Overview */}
      <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
                SIGNAL Intelligence Scorecard
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Real-time measurement of attention preservation, noise reduction ratio, and filtering accuracy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetToDemoData}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Reset sample data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
            <button
              onClick={clearAllData}
              className="px-3 py-1.5 rounded-xl bg-zinc-800/60 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-800/50 text-zinc-400 text-xs font-medium border border-zinc-800 transition-colors"
            >
              Clear Queue
            </button>
          </div>
        </div>

        {/* 4 Key Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Attention Hours Saved */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Hours Saved</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {scorecardStats.hoursSaved} hrs
              </span>
              <p className="text-[11px] text-zinc-400">Preserved from low-density noise & rabbit holes</p>
            </div>
          </div>

          {/* Noise Purge Ratio */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Noise Eliminated</span>
              <Ban className="w-4 h-4 text-rose-400" />
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
                {scorecardStats.noisePercentage}%
              </span>
              <p className="text-[11px] text-zinc-400">{scorecardStats.noiseEliminatedCount} distractions dropped</p>
            </div>
          </div>

          {/* Attention Points Protected */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Attention Points</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                +{scorecardStats.attentionPointsPreserved} pts
              </span>
              <p className="text-[11px] text-zinc-400">Cognitive budget conserved today</p>
            </div>
          </div>

          {/* Calibrated Model Accuracy */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Filter Accuracy</span>
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
                {scorecardStats.accuracyRate}%
              </span>
              <p className="text-[11px] text-zinc-400">Validated by student feedback loop</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown & Goal Alignment Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Category Distribution */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-3">
            <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Information Flow Distribution
            </span>
            <div className="space-y-2.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                    <span>🔴 NOW (Do Today)</span>
                  </span>
                  <span className="font-bold text-zinc-200">
                    {scorecardStats.categoryDistribution.NOW} items
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full" 
                    style={{ width: `${Math.min((scorecardStats.categoryDistribution.NOW / Math.max(scorecardStats.totalProcessed, 1)) * 100 * 3, 100)}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                    <span>🟡 NEXT (Do Soon)</span>
                  </span>
                  <span className="font-bold text-zinc-200">
                    {scorecardStats.categoryDistribution.NEXT} items
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${Math.min((scorecardStats.categoryDistribution.NEXT / Math.max(scorecardStats.totalProcessed, 1)) * 100 * 3, 100)}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span>🟢 LATER (Backlog)</span>
                  </span>
                  <span className="font-bold text-zinc-200">
                    {scorecardStats.categoryDistribution.LATER} items
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${Math.min((scorecardStats.categoryDistribution.LATER / Math.max(scorecardStats.totalProcessed, 1)) * 100 * 3, 100)}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
                    <span>⚪ IGNORE (Noise Dropped)</span>
                  </span>
                  <span className="font-bold text-zinc-200">
                    {scorecardStats.categoryDistribution.IGNORE} items
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-zinc-600 rounded-full" 
                    style={{ width: `${Math.min((scorecardStats.categoryDistribution.IGNORE / Math.max(scorecardStats.totalProcessed, 1)) * 100 * 3, 100)}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Goal Fit Performance */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-3">
            <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Goal Fit Alignment Breakdown
            </span>
            <div className="space-y-2.5">
              {scorecardStats.goalAlignmentBreakdown.map((gb, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span className="truncate max-w-[200px]">{gb.goalTitle}</span>
                    <span className="font-bold text-indigo-300">{gb.percentage}% alignment</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${gb.percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Validation Test Suite (Scenarios A - F) */}
      <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-5 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-zinc-100">
              Scenario Validation Suite (Phase 2 Intelligence)
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Click any scenario to test how the 7-dimension scoring engine, opportunity cost model, duplicate detector, and workload-aware engine handle real college inputs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEST_SCENARIOS.map((scenario) => (
            <div
              key={scenario.key}
              className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-bold text-xs flex items-center justify-center">
                    {scenario.key}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    {scenario.source || "Decision Query"}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-zinc-100 leading-snug">
                  {scenario.title}
                </h4>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {scenario.description}
                </p>

                <div className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[10px] text-zinc-300">
                  <span className="text-zinc-500 font-semibold block">Expected Output:</span>
                  <span className="text-emerald-400 font-medium">{scenario.expectedOutcome}</span>
                </div>
              </div>

              <button
                id={`run-scenario-${scenario.key}`}
                disabled={isAiLoading}
                onClick={() => runScenarioTest(scenario.key)}
                className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-indigo-600 text-zinc-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isAiLoading ? (
                  <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run Scenario {scenario.key}</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
