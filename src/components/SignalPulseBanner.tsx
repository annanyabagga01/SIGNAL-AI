import React from "react";
import { useSignal } from "../context/SignalContext";
import { Activity, ShieldAlert, Sparkles, ArrowRight, Focus, ShieldCheck } from "lucide-react";

export const SignalPulseBanner: React.FC = () => {
  const { signalPulse, workloadLevel, startFocusSession, setIsMySignalModalOpen, setCurrentPage } = useSignal();

  const getStatusBadge = () => {
    switch (signalPulse.state) {
      case "CRITICAL":
        return {
          label: "CRITICAL LOAD",
          badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          pulseColor: "bg-rose-500",
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
        };
      case "OVERLOADED":
        return {
          label: "ATTENTION OVERLOAD",
          badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          pulseColor: "bg-amber-400",
          icon: <Activity className="w-4 h-4 text-amber-400" />,
        };
      case "BUSY":
        return {
          label: "BUSY SIGNAL",
          badgeBg: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
          pulseColor: "bg-yellow-400",
          icon: <Activity className="w-4 h-4 text-yellow-400" />,
        };
      default:
        return {
          label: "CLEAR FOCUS",
          badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          pulseColor: "bg-emerald-400",
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div
      id="signal-pulse-banner"
      className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
        signalPulse.state === "CRITICAL"
          ? "bg-gradient-to-r from-rose-950/40 via-zinc-900/90 to-zinc-950 border-rose-800/50"
          : signalPulse.state === "OVERLOADED"
          ? "bg-gradient-to-r from-amber-950/30 via-zinc-900/90 to-zinc-950 border-amber-800/40"
          : signalPulse.state === "BUSY"
          ? "bg-gradient-to-r from-yellow-950/20 via-zinc-900/90 to-zinc-950 border-yellow-800/30"
          : "bg-gradient-to-r from-emerald-950/25 via-zinc-900/90 to-zinc-950 border-emerald-800/40"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Status Info */}
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5 relative flex items-center justify-center">
            <div className={`w-3 h-3 rounded-full ${status.pulseColor} animate-ping absolute opacity-75`} />
            <div className={`w-3 h-3 rounded-full ${status.pulseColor} relative`} />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-zinc-100 text-sm tracking-tight">
                {signalPulse.title}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${status.badgeBg}`}
              >
                {status.icon}
                <span>{status.label}</span>
              </span>
              <span className="text-xs text-zinc-400 hidden sm:inline">
                • Workload: <strong className="text-zinc-200">{workloadLevel}</strong>
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
              {signalPulse.explanation}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400 pt-0.5">
              <span className="font-semibold text-zinc-200">Recommended Action:</span>
              <span className="text-indigo-300 font-medium">{signalPulse.recommendation}</span>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            id="pulse-focus-btn"
            onClick={() => startFocusSession()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Focus className="w-3.5 h-3.5" />
            <span>Enter Focus Mode</span>
          </button>

          <button
            id="pulse-my-signal-btn"
            onClick={() => setIsMySignalModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-colors"
          >
            <span>My Signal</span>
            <ArrowRight className="w-3 h-3 text-zinc-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
