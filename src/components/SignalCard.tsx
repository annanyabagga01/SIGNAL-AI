import React, { useState } from "react";
import { SignalItem, SignalCategory } from "../types";
import { useSignal } from "../context/SignalContext";
import { 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Circle, 
  Trash2, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  Info,
  Calendar,
  Hourglass,
  Tag,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Scale,
  Focus,
  CornerDownRight,
  EyeOff,
  Check
} from "lucide-react";

interface SignalCardProps {
  item: SignalItem;
  compact?: boolean;
  highlightRank?: number;
}

export const SignalCard: React.FC<SignalCardProps> = ({ 
  item, 
  compact = false,
  highlightRank 
}) => {
  const { toggleItemComplete, overrideCategory, deleteItem, provideFeedback, startFocusSession } = useSignal();
  const [expanded, setExpanded] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showFeedbackReclassify, setShowFeedbackReclassify] = useState(false);

  // Category config styling
  const categoryConfig: Record<
    SignalCategory, 
    { 
      label: string; 
      badgeBg: string; 
      badgeText: string; 
      cardBorder: string; 
      glow: string; 
      icon: string;
      subtext: string;
    }
  > = {
    NOW: {
      label: "NOW",
      badgeBg: "bg-rose-500/15 border-rose-500/30",
      badgeText: "text-rose-400",
      cardBorder: item.isCompleted ? "border-zinc-800" : "border-rose-800/40 hover:border-rose-700/60",
      glow: "from-rose-500/5 via-transparent to-transparent",
      icon: "🔴",
      subtext: "Important & time-sensitive (Do today)",
    },
    NEXT: {
      label: "NEXT",
      badgeBg: "bg-amber-500/15 border-amber-500/30",
      badgeText: "text-amber-400",
      cardBorder: item.isCompleted ? "border-zinc-800" : "border-amber-800/40 hover:border-amber-700/60",
      glow: "from-amber-500/5 via-transparent to-transparent",
      icon: "🟡",
      subtext: "High leverage, execute soon",
    },
    LATER: {
      label: "LATER",
      badgeBg: "bg-emerald-500/15 border-emerald-500/30",
      badgeText: "text-emerald-400",
      cardBorder: "border-zinc-800/80 hover:border-zinc-700",
      glow: "from-emerald-500/5 via-transparent to-transparent",
      icon: "🟢",
      subtext: "Saved to knowledge backlog",
    },
    IGNORE: {
      label: "IGNORE",
      badgeBg: "bg-zinc-800/60 border-zinc-700/40",
      badgeText: "text-zinc-400",
      cardBorder: "border-zinc-800/60 opacity-80 hover:opacity-100",
      glow: "from-zinc-800/10 via-transparent to-transparent",
      icon: "⚪",
      subtext: "Low signal / distraction (Safely dropped)",
    },
  };

  const config = categoryConfig[item.category] || categoryConfig.NEXT;

  // Confidence styling
  const confidenceColor = 
    item.confidence === "HIGH" 
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-950/20" 
      : item.confidence === "LOW"
      ? "text-rose-400 border-rose-500/30 bg-rose-950/20"
      : "text-sky-400 border-sky-500/30 bg-sky-950/20";

  return (
    <div
      id={`signal-card-${item.id}`}
      className={`relative rounded-2xl bg-zinc-900/90 border transition-all duration-200 overflow-hidden ${
        config.cardBorder
      } ${item.isCompleted ? "opacity-60 bg-zinc-950/60" : "shadow-sm"}`}
    >
      {/* Background subtle gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.glow} pointer-events-none`} />

      <div className="relative p-5 sm:p-6 space-y-4">
        {/* Top Header Row: Category Badge, Rank, Attention Cost, Confidence & Source */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Optional Highlight Rank for Top 3 */}
            {highlightRank && (
              <span className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-200 text-xs font-bold flex items-center justify-center border border-zinc-700 shadow-sm">
                #{highlightRank}
              </span>
            )}

            {/* Category Dropdown Pill */}
            <div className="relative">
              <button
                id={`cat-badge-${item.id}`}
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold tracking-wide transition-colors ${config.badgeBg} ${config.badgeText}`}
                title="Click to change category"
              >
                <span>{config.icon}</span>
                <span>{config.label}</span>
                <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
              </button>

              {showCategoryMenu && (
                <div className="absolute top-full left-0 mt-1 z-30 w-44 rounded-xl bg-zinc-950 border border-zinc-800 p-1.5 shadow-xl space-y-1 backdrop-blur-md">
                  {(["NOW", "NEXT", "LATER", "IGNORE"] as SignalCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        overrideCategory(item.id, cat);
                        setShowCategoryMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors ${
                        item.category === cat ? "text-white bg-zinc-800/80 font-bold" : "text-zinc-400"
                      }`}
                    >
                      <span>{categoryConfig[cat].icon}</span>
                      <span>Move to {cat}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Confidence Badge */}
            {item.confidence && (
              <span 
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1 ${confidenceColor}`}
                title={`Filter Confidence: ${item.confidenceScore ? `${item.confidenceScore}%` : item.confidence}`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>{item.confidenceScore ? `${item.confidenceScore}% Confidence` : `${item.confidence} Signal`}</span>
              </span>
            )}

            {/* Source Tag */}
            <span className="text-[11px] font-medium text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded-md border border-zinc-800 flex items-center gap-1">
              <Tag className="w-3 h-3 text-zinc-400" />
              <span>{item.source}</span>
            </span>

            {/* Duplicate Detected Tag */}
            {item.isDuplicate && (
              <span className="text-[11px] font-medium text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-800/40 flex items-center gap-1">
                <Copy className="w-3 h-3 text-purple-400" />
                <span>Duplicate Merged</span>
              </span>
            )}

            {/* Sample Data Tag */}
            {item.isSampleData && (
              <span className="text-[10px] text-zinc-400 bg-zinc-800/30 px-1.5 py-0.5 rounded border border-zinc-800/50">
                Sample
              </span>
            )}
          </div>

          {/* Right Metrics: Attention Cost + Effort */}
          <div className="flex items-center gap-2">
            <div 
              className="flex items-center gap-1 text-xs text-amber-300/90 bg-amber-950/30 px-2 py-0.5 rounded-lg border border-amber-800/40"
              title="Cognitive Attention Cost"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="font-semibold">{item.attentionCost} pts</span>
            </div>

            {item.effort && (
              <div className="flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-800/40 px-2 py-0.5 rounded-lg border border-zinc-800">
                <Clock className="w-3 h-3 text-zinc-400" />
                <span>{item.effort}</span>
              </div>
            )}
          </div>
        </div>

        {/* Workload Context Banner (if adjusted due to heavy workload) */}
        {item.workloadContextReason && (
          <div className="p-2.5 rounded-xl bg-amber-950/25 border border-amber-800/40 text-amber-200 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-amber-300">Workload-Aware Adjustment:</span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">{item.workloadContextReason}</p>
            </div>
          </div>
        )}

        {/* Title and Completion Checkbox */}
        <div className="flex items-start gap-3">
          <button
            id={`toggle-complete-${item.id}`}
            onClick={() => toggleItemComplete(item.id)}
            className="mt-0.5 shrink-0 text-zinc-400 hover:text-emerald-400 focus:outline-none transition-colors"
            title={item.isCompleted ? "Mark incomplete" : "Mark completed"}
          >
            {item.isCompleted ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-950/60" />
            ) : (
              <Circle className="w-5 h-5 text-zinc-600 hover:border-emerald-500" />
            )}
          </button>

          <div className="space-y-1 flex-1">
            <h3 className={`text-base font-semibold text-zinc-100 leading-snug ${item.isCompleted ? "line-through text-zinc-400" : ""}`}>
              {item.title}
            </h3>

            {/* Why It Matters */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <span className="font-medium text-zinc-200">Why it matters: </span>
              {item.why}
            </p>
          </div>
        </div>

        {/* Opportunity Cost Highlight (Phase 2 Intelligence) */}
        {item.opportunityCost && (
          <div className="px-3 py-2 rounded-lg bg-zinc-950/40 border border-zinc-800/60 text-xs flex items-start gap-2 text-zinc-300">
            <Scale className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong className="text-indigo-300">Opportunity Trade-Off: </strong>
              {item.opportunityCost}
            </span>
          </div>
        )}

        {/* Action + Deadline Block */}
        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-medium text-indigo-300">
              <ArrowRight className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <span>Recommended Action:</span>
            </div>

            {item.deadline && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-300 bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-800/40">
                <Calendar className="w-3 h-3 text-rose-400" />
                <span>{item.deadline}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-zinc-200 pl-5 leading-relaxed font-mono">
            {item.action}
          </p>

          {/* Quick Decision Actions */}
          <div className="pt-2 border-t border-zinc-800/70 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {!item.isCompleted && (
                <button
                  id={`btn-focus-${item.id}`}
                  onClick={() => startFocusSession(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                >
                  <Focus className="w-3.5 h-3.5" />
                  <span>Focus on this</span>
                </button>
              )}

              <button
                id={`btn-done-${item.id}`}
                onClick={() => toggleItemComplete(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  item.isCompleted
                    ? "bg-zinc-800 text-zinc-400 border-zinc-700"
                    : "bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border-emerald-800/40"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{item.isCompleted ? "Completed" : "Done"}</span>
              </button>

              {item.category !== "LATER" && item.category !== "IGNORE" && (
                <button
                  id={`btn-defer-${item.id}`}
                  onClick={() => overrideCategory(item.id, "LATER")}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
                  title="Move to LATER"
                >
                  <CornerDownRight className="w-3 h-3 text-zinc-400" />
                  <span>Defer</span>
                </button>
              )}

              {item.category !== "IGNORE" ? (
                <button
                  id={`btn-ignore-${item.id}`}
                  onClick={() => overrideCategory(item.id, "IGNORE")}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-rose-950/40 hover:text-rose-300 text-zinc-400 text-xs font-medium border border-zinc-800 hover:border-rose-900/50 transition-colors"
                  title="Drop to IGNORE"
                >
                  <EyeOff className="w-3 h-3 text-zinc-400" />
                  <span>Ignore</span>
                </button>
              ) : (
                <button
                  id={`btn-promote-${item.id}`}
                  onClick={() => overrideCategory(item.id, "NEXT")}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/50 text-xs font-semibold border border-indigo-800/50 transition-colors"
                  title="Promote to NEXT"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>Promote to NEXT</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Feedback Loop, Expand Reason, Decay & Delete */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400 border-t border-zinc-800/60">
          {/* User Feedback Mechanism (Phase 2) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-500 font-medium">Filter feedback:</span>
            
            <button
              id={`feedback-helpful-${item.id}`}
              onClick={() => provideFeedback(item.id, "helpful")}
              className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[11px] ${
                item.userFeedback === "helpful"
                  ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-bold"
                  : "bg-zinc-800/40 border-zinc-800 text-zinc-400 hover:text-emerald-300 hover:bg-zinc-800"
              }`}
              title="Accurate categorization"
            >
              <ThumbsUp className="w-3 h-3" />
              <span>Accurate</span>
            </button>

            <div className="relative">
              <button
                id={`feedback-misclassified-${item.id}`}
                onClick={() => setShowFeedbackReclassify(!showFeedbackReclassify)}
                className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[11px] ${
                  item.userFeedback === "misclassified"
                    ? "bg-rose-950/60 border-rose-500/50 text-rose-300 font-bold"
                    : "bg-zinc-800/40 border-zinc-800 text-zinc-400 hover:text-rose-300 hover:bg-zinc-800"
                }`}
                title="Misclassified / Needs Reclassification"
              >
                <ThumbsDown className="w-3 h-3" />
                <span>Adjust</span>
              </button>

              {showFeedbackReclassify && (
                <div className="absolute bottom-full left-0 mb-1 z-30 w-48 rounded-xl bg-zinc-950 border border-zinc-800 p-2 shadow-2xl space-y-1 backdrop-blur-md">
                  <div className="text-[10px] uppercase font-bold text-zinc-400 px-1.5 py-0.5">
                    Correct Category:
                  </div>
                  {(["NOW", "NEXT", "LATER", "IGNORE"] as SignalCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        provideFeedback(item.id, "misclassified", cat);
                        setShowFeedbackReclassify(false);
                      }}
                      className="w-full text-left px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-zinc-800 text-zinc-300 transition-colors"
                    >
                      <span>{categoryConfig[cat].icon}</span>
                      <span>Change to {cat}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Expand AI Decision Transparency */}
            <button
              id={`expand-why-${item.id}`}
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors font-medium text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{expanded ? "Hide Transparency" : "Why did SIGNAL choose this?"}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Decay Status Indicator */}
            {item.decayStatus && (
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Hourglass className="w-3 h-3" />
                <span>{item.decayStatus}</span>
              </span>
            )}

            <button
              id={`delete-btn-${item.id}`}
              onClick={() => deleteItem(item.id)}
              className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
              title="Delete item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Expandable Transparency Drawer */}
        {expanded && (
          <div className="pt-3 space-y-3.5 border-t border-zinc-800 text-xs animate-fadeIn">
            {/* Comparison Reasoning */}
            <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-indigo-200 space-y-1">
              <span className="font-semibold text-indigo-300 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                AI Decision Transparency & Reasoning
              </span>
              <p className="text-zinc-300 leading-relaxed">
                {item.whyDidSignalChooseThis || item.aiReasoning}
              </p>
            </div>

            {/* 7 Dimensions Radar / Meters */}
            {item.dimensions && (
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  7-Dimension Scoring Engine
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {Object.entries(item.dimensions).map(([key, val]) => {
                    const labelMap: Record<string, string> = {
                      relevance: "Relevance",
                      urgency: "Urgency",
                      impact: "Impact",
                      effort: "Effort Cost",
                      opportunityValue: "Opp. Value",
                      reliability: "Reliability",
                      goalAlignment: "Goal Fit",
                    };
                    const numVal = typeof val === "number" ? val : 50;
                    return (
                      <div key={key} className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                          <span>{labelMap[key] || key}</span>
                          <span className="text-zinc-200 font-bold">{numVal}%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              numVal >= 80 ? "bg-emerald-400" : numVal >= 50 ? "bg-indigo-400" : "bg-zinc-600"
                            }`}
                            style={{ width: `${numVal}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Raw Input Content preview */}
            {item.rawContent && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-zinc-400">Original Raw Noise:</span>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/60 font-mono text-[11px] text-zinc-400 max-h-24 overflow-y-auto whitespace-pre-wrap">
                  {item.rawContent}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
