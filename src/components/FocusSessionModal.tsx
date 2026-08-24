import React from "react";
import { useSignal } from "../context/SignalContext";
import { Shield, Play, Pause, CheckCircle2, X, Sparkles, Volume2, VolumeX, Clock } from "lucide-react";

export const FocusSessionModal: React.FC = () => {
  const { focusSession, pauseFocusSession, resumeFocusSession, completeFocusSession, exitFocusSession } = useSignal();

  if (!focusSession.isActive) return null;

  const totalSeconds = focusSession.estimatedMinutes * 60;
  const elapsed = focusSession.secondsElapsed;
  const percent = Math.min(Math.round((elapsed / Math.max(totalSeconds, 1)) * 100), 100);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      id="focus-session-overlay"
      className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 transition-all"
    >
      <div className="relative w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900/90 shadow-2xl p-6 sm:p-8 space-y-6 text-center">
        {/* Shield / Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-indigo-400 uppercase">
            <Shield className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>SIGNAL ATTENTION SHIELD ACTIVE</span>
          </div>

          <button
            id="focus-exit-btn"
            onClick={exitFocusSession}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
            title="Exit Focus Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Title */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-bold">
            RIGHT NOW PRIORITY
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100 leading-tight">
            {focusSession.taskTitle}
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            All other noise, feeds, and lower priority alerts are silenced. Give 100% of your cognitive capacity to this single deliverable.
          </p>
        </div>

        {/* Timer Display */}
        <div className="py-4 space-y-3">
          <div className="text-5xl sm:text-6xl font-mono font-black text-zinc-100 tracking-tight">
            {formatTime(elapsed)}
          </div>
          <div className="text-xs text-zinc-400 flex items-center justify-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Target: ~{focusSession.estimatedMinutes} mins • {percent}% completed</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(percent, 2)}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {focusSession.isPaused ? (
            <button
              id="focus-resume-btn"
              onClick={resumeFocusSession}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/50 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume Session</span>
            </button>
          ) : (
            <button
              id="focus-pause-btn"
              onClick={pauseFocusSession}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
            >
              <Pause className="w-4 h-4" />
              <span>Pause Timer</span>
            </button>
          )}

          <button
            id="focus-complete-btn"
            onClick={completeFocusSession}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete & Free Budget</span>
          </button>
        </div>

        {/* Microcopy footer */}
        <p className="text-[11px] text-zinc-400 italic">
          “The world doesn't need more information. It needs better filters.”
        </p>
      </div>
    </div>
  );
};
