import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import { 
  HelpCircle, 
  Brain, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Ban, 
  Clock, 
  Zap,
  Target,
  Compass,
  History,
  TrendingDown
} from "lucide-react";

export const DecisionPage: React.FC = () => {
  const { 
    evaluateDecision, 
    runFomoCheck, 
    decisionHistory, 
    fomoHistory, 
    isAiLoading, 
    activeAiMessage, 
    attentionUsed,
    userProfile 
  } = useSignal();

  const [activeTab, setActiveTab] = useState<"decision" | "fomo">("decision");

  // Decision state
  const [decisionQuery, setDecisionQuery] = useState("");
  const [decisionContext, setDecisionContext] = useState("");
  const [latestDecision, setLatestDecision] = useState<any | null>(null);

  // FOMO state
  const [fomoQuery, setFomoQuery] = useState("");
  const [latestFomo, setLatestFomo] = useState<any | null>(null);

  const sampleDecisionQueries = [
    "Should I participate in this weekend's 36-hour hackathon?",
    "Should I take a 40-hour deep dive course on Web3 development?",
    "Should I apply for a freelance gig paying $200 while managing 4 coursework deadlines?",
    "Should I start rewriting my project in a new language?",
  ];

  const sampleFomoQueries = [
    "Everyone on Twitter is building in this brand new AI framework. Should I switch stacks?",
    "There is a free 3-day virtual tech summit giving away participation certificates.",
    "A senior posted about learning 5 languages in 30 days or falling behind in tech.",
    "New Discord community offering daily coding challenges and leaderboards.",
  ];

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionQuery.trim()) return;

    const res = await evaluateDecision(decisionQuery, decisionContext);
    if (res) {
      setLatestDecision(res);
      setDecisionQuery("");
      setDecisionContext("");
    }
  };

  const handleFomoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fomoQuery.trim()) return;

    const res = await runFomoCheck(fomoQuery);
    if (res) {
      setLatestFomo(res);
      setFomoQuery("");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            Decision Mode & Anti-FOMO
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400">
          Ask SIGNAL to evaluate high-stakes commitments or test whether an opportunity is real or just FOMO noise.
        </p>
      </div>

      {/* 2. Mode Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 w-fit">
        <button
          id="tab-should-i-do-this"
          onClick={() => setActiveTab("decision")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "decision"
              ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>🤔 SHOULD I DO THIS?</span>
        </button>

        <button
          id="tab-fomo-check"
          onClick={() => setActiveTab("fomo")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "fomo"
              ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Brain className="w-4 h-4 text-purple-400" />
          <span>🧠 ANTI-FOMO CHECK</span>
        </button>
      </div>

      {/* 3. TAB 1: SHOULD I DO THIS? */}
      {activeTab === "decision" && (
        <div className="space-y-8">
          {/* Input Box */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-5 shadow-xl">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-zinc-100">
                Contextual Decision Evaluator
              </h2>
              <p className="text-xs text-zinc-400">
                SIGNAL evaluates Goal Alignment, Time Commitment, Workload Saturation ({attentionUsed}% currently used), and Opportunity Cost.
              </p>
            </div>

            {/* Quick Sample Queries */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Common Student Dilemmas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleDecisionQueries.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDecisionQuery(q)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleDecisionSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  What opportunity or task are you considering?
                </label>
                <input
                  type="text"
                  value={decisionQuery}
                  onChange={(e) => setDecisionQuery(e.target.value)}
                  placeholder="e.g. 'Should I participate in this 3-day hackathon?'"
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Additional Context (optional):
                </label>
                <input
                  type="text"
                  value={decisionContext}
                  onChange={(e) => setDecisionContext(e.target.value)}
                  placeholder="e.g. 'I have a DBMS assignment due Monday and my energy is currently low.'"
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isAiLoading || !decisionQuery.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-950/60 transition-all disabled:opacity-50"
                >
                  {isAiLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>{activeAiMessage || "Evaluating..."}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Evaluate Decision</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Latest Decision Result Card */}
          {latestDecision && (
            <div className="p-6 rounded-3xl bg-zinc-900 border border-indigo-900/50 space-y-6 shadow-2xl animate-fadeIn">
              {/* Verdict Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    SIGNAL EVALUATION VERDICT:
                  </span>
                  <h3 className="text-base font-bold text-zinc-100">
                    "{latestDecision.query}"
                  </h3>
                </div>

                {/* Verdict Badge */}
                <div
                  className={`px-4 py-2 rounded-xl text-base font-extrabold flex items-center gap-2 shadow-lg ${
                    latestDecision.verdict === "YES"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : latestDecision.verdict === "MAYBE"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  }`}
                >
                  {latestDecision.verdict === "YES" && <CheckCircle2 className="w-5 h-5" />}
                  {latestDecision.verdict === "MAYBE" && <AlertTriangle className="w-5 h-5" />}
                  {latestDecision.verdict === "NO" && <Ban className="w-5 h-5" />}
                  <span>{latestDecision.verdict}</span>
                </div>
              </div>

              {/* Bottom line summary */}
              <p className="text-sm font-medium text-zinc-200 leading-relaxed">
                {latestDecision.summary}
              </p>

              {/* 4 Trade-off Metric Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase">Goal Alignment:</span>
                  <div className="flex items-center justify-between text-xs text-zinc-200">
                    <span>Fit with top goals:</span>
                    <span className="font-bold text-indigo-400">{latestDecision.goalAlignmentScore}%</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase">Estimated Time:</span>
                  <div className="text-xs font-semibold text-zinc-200">{latestDecision.timeRequired}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[11px] font-semibold text-rose-400 uppercase">True Opportunity Cost:</span>
                  <p className="text-xs text-zinc-300 leading-snug">{latestDecision.opportunityCost}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase">Workload Impact:</span>
                  <p className="text-xs text-zinc-300 leading-snug">{latestDecision.currentWorkloadImpact}</p>
                </div>
              </div>

              {/* Recommended Next Step */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-1 text-xs">
                <span className="font-bold text-indigo-300">Recommended Next Step:</span>
                <p className="text-zinc-200 font-mono">{latestDecision.recommendedNextStep}</p>
              </div>
            </div>
          )}

          {/* Past Decisions Log */}
          {decisionHistory.length > 0 && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                <History className="w-4 h-4" />
                <span>Past Decision Evaluations ({decisionHistory.length})</span>
              </div>

              <div className="space-y-3">
                {decisionHistory.map((dec) => (
                  <div key={dec.id} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-200">{dec.query}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                          dec.verdict === "YES"
                            ? "text-emerald-400 bg-emerald-950/60 border border-emerald-800/60"
                            : dec.verdict === "MAYBE"
                            ? "text-amber-400 bg-amber-950/60 border border-amber-800/60"
                            : "text-rose-400 bg-rose-950/60 border border-rose-800/60"
                        }`}
                      >
                        {dec.verdict}
                      </span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">{dec.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: ANTI-FOMO ENGINE */}
      {activeTab === "fomo" && (
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-5 shadow-xl">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-zinc-100">
                Anti-FOMO Engine 🧠
              </h2>
              <p className="text-xs text-zinc-400">
                Core question: <span className="text-zinc-200 font-semibold italic">“If you ignore this, what do you realistically lose?”</span>
              </p>
            </div>

            {/* Quick Sample FOMO Queries */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Common FOMO Traps:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleFomoQueries.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFomoQuery(q)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleFomoSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  What hype, event, or trend are you feeling pressured to join?
                </label>
                <textarea
                  value={fomoQuery}
                  onChange={(e) => setFomoQuery(e.target.value)}
                  placeholder="e.g. 'Everyone is hyping this new tool / webinar / community, should I join?'"
                  rows={3}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isAiLoading || !fomoQuery.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-950/60 transition-all disabled:opacity-50"
                >
                  {isAiLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>{activeAiMessage || "Testing FOMO..."}</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      <span>Run FOMO Check</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Latest FOMO Result */}
          {latestFomo && (
            <div className="p-6 rounded-3xl bg-zinc-900 border border-purple-900/50 space-y-6 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    FOMO EVALUATION VERDICT:
                  </span>
                  <h3 className="text-base font-bold text-zinc-100">
                    "{latestFomo.query}"
                  </h3>
                </div>

                <div
                  className={`px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-2 ${
                    latestFomo.verdict === "FOMO NOISE"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  {latestFomo.verdict === "FOMO NOISE" ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{latestFomo.verdict}</span>
                </div>
              </div>

              {/* Realistic Loss Breakdown */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  If you ignore this, what do you realistically lose?
                </span>
                <p className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed">
                  {latestFomo.realisticLoss}
                </p>
              </div>

              {/* Psychology & Trigger */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                  <span className="font-semibold text-purple-400">FOMO Trigger Identified:</span>
                  <p className="text-zinc-300">{latestFomo.fomoTrigger}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                  <span className="font-semibold text-emerald-400">Better Alternative Action:</span>
                  <p className="text-zinc-300">{latestFomo.alternativeAction}</p>
                </div>
              </div>
            </div>
          )}

          {/* Past FOMO Log */}
          {fomoHistory.length > 0 && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                <History className="w-4 h-4" />
                <span>Past FOMO Checks ({fomoHistory.length})</span>
              </div>

              <div className="space-y-3">
                {fomoHistory.map((f) => (
                  <div key={f.id} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-200">{f.query}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                          f.verdict === "FOMO NOISE"
                            ? "text-rose-400 bg-rose-950/60 border border-rose-800/60"
                            : "text-emerald-400 bg-emerald-950/60 border border-emerald-800/60"
                        }`}
                      >
                        {f.verdict}
                      </span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">{f.realisticLoss}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
