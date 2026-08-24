import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import { Sun, CloudSun, Sunset, Moon, CheckCircle2, Circle, ArrowRight, Sparkles, Clock } from "lucide-react";

export const SignalTimeline: React.FC = () => {
  const { items, startFocusSession } = useSignal();
  const [activeSlot, setActiveSlot] = useState<"morning" | "afternoon" | "evening" | "night">("morning");

  const nowItem = items.find((i) => i.category === "NOW" && !i.isCompleted) || items.find((i) => i.category === "NOW") || items[0];
  const nextItem = items.find((i) => i.category === "NEXT" && !i.isCompleted) || items.find((i) => i.category === "NEXT") || items[1];
  const laterItem = items.find((i) => i.category === "LATER" && !i.isCompleted) || items.find((i) => i.category === "LATER") || items[2];

  const timelineSlots = [
    {
      id: "morning" as const,
      time: "08:00 — 12:00",
      title: "Morning Deep Signal",
      icon: <Sun className="w-4 h-4 text-amber-400" />,
      focusItem: nowItem ? nowItem.title : "Finish DBMS Assignment Normalization",
      category: "NOW",
      categoryColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      description: "Highest cognitive capacity dedicated to today's urgent blocker deliverable.",
      attentionPoints: "35 pts",
      isCurrent: true,
    },
    {
      id: "afternoon" as const,
      time: "13:00 — 17:00",
      title: "Afternoon High-Value Execution",
      icon: <CloudSun className="w-4 h-4 text-orange-400" />,
      focusItem: nextItem ? nextItem.title : "Google SWE Internship Application Prep",
      category: "NEXT",
      categoryColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      description: "Shifts automatically to #1 career priority once morning urgent deliverable is cleared.",
      attentionPoints: "25 pts",
      isCurrent: false,
    },
    {
      id: "evening" as const,
      time: "18:00 — 21:00",
      title: "Evening Lightweight Review & Prep",
      icon: <Sunset className="w-4 h-4 text-indigo-400" />,
      focusItem: laterItem ? laterItem.title : "LLM Fine-Tuning Tutorial Video Series",
      category: "LATER",
      categoryColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      description: "Low-friction exploratory reading and next-day prep without taxing cognitive reserves.",
      attentionPoints: "10 pts",
      isCurrent: false,
    },
    {
      id: "night" as const,
      time: "21:30 — 22:30",
      title: "Night Reset & Noise Clearance",
      icon: <Moon className="w-4 h-4 text-emerald-400" />,
      focusItem: "Signal End-of-Day Calibration & Attention Reset",
      category: "RESET",
      categoryColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      description: "1-minute reflection on what was filtered, saving attention points for tomorrow.",
      attentionPoints: "0 pts",
      isCurrent: false,
    },
  ];

  return (
    <div id="signal-timeline-container" className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Signal Timeline: Dynamic Daily Attention</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            SIGNAL dynamically adjusts what matters as your day progresses and commitments clear.
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs text-zinc-400 bg-zinc-950/80 px-2.5 py-1 rounded-xl border border-zinc-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Window: Morning Deep Work</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {timelineSlots.map((slot) => {
          const isSelected = activeSlot === slot.id;
          return (
            <div
              key={slot.id}
              onClick={() => setActiveSlot(slot.id)}
              className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-zinc-800/90 border-indigo-500/60 shadow-sm ring-1 ring-indigo-500/30"
                  : "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="flex items-center gap-1.5 font-bold text-zinc-200">
                    {slot.icon}
                    <span>{slot.title}</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">{slot.time}</span>
                </div>

                <div className="my-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${slot.categoryColor}`}>
                      {slot.category}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">{slot.attentionPoints}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-100 line-clamp-2 leading-snug">
                    {slot.focusItem}
                  </h4>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                  {slot.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                <span className="text-[10px] text-zinc-500">
                  {slot.isCurrent ? "Current phase" : "Scheduled transition"}
                </span>
                {slot.category === "NOW" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startFocusSession(nowItem, slot.focusItem);
                    }}
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <span>Focus</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
