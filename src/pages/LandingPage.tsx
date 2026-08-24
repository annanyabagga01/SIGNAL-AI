import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Ban, 
  Layers, 
  Compass, 
  Play,
  RotateCcw,
  FlaskConical,
  Award
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const { setCurrentPage, userProfile } = useSignal();

  // Interactive Funnel Demo State
  const sampleNoisePackets = [
    { id: 1, text: "🔴 DBMS Assignment due tomorrow 11:59 PM (-25% penalty)", target: "NOW", color: "rose" },
    { id: 2, text: "🔴 Hackathon registration locks tonight at midnight", target: "NOW", color: "rose" },
    { id: 3, text: "🟡 Summer SWE Internship application portal open", target: "NEXT", color: "amber" },
    { id: 4, text: "🟢 3-Hour Advanced TypeScript & Rust YouTube Deep Dive", target: "LATER", color: "emerald" },
    { id: 5, text: "⚪ Campus AI Club Newsletter #42 + Crypto Bootcamp Promo", target: "IGNORE", color: "zinc" },
    { id: 6, text: "⚪ LinkedIn: 'Learn 7 languages in 30 days or fail'", target: "IGNORE", color: "zinc" },
  ];

  const [activeStep, setActiveStep] = useState<number>(0);
  const [funnelFilterRunning, setFunnelFilterRunning] = useState(false);

  const triggerFunnelAnimation = () => {
    setFunnelFilterRunning(true);
    setActiveStep(1);
    setTimeout(() => setActiveStep(2), 700);
    setTimeout(() => setActiveStep(3), 1400);
    setTimeout(() => setFunnelFilterRunning(false), 2100);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 text-center max-w-4xl mx-auto px-4 space-y-8">
        {/* Glow backdrop */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[320px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/10 to-emerald-600/10 blur-[100px] pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 text-xs font-semibold tracking-wide shadow-inner animate-pulse">
          <Brain className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Attention Filter for College Students</span>
        </div>

        {/* Headlines */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-100 leading-[1.1]">
            Less Noise. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
              More Signal.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            AI that filters the information overload of student life and tells you exactly what deserves your attention right now.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            id="hero-build-signal-btn"
            onClick={() => setCurrentPage(userProfile.onboardingCompleted ? "dashboard" : "onboarding")}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-950/80 transition-all transform hover:-translate-y-0.5 active:scale-95 border border-indigo-400/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Build My Signal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-story-demo-btn"
            onClick={() => setCurrentPage("story")}
            className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/70 text-indigo-200 font-bold text-sm border border-indigo-700/60 transition-all shadow-lg shadow-indigo-950/50"
          >
            <Brain className="w-4 h-4 text-indigo-400" />
            <span>Interactive Story (Demo)</span>
          </button>

          <button
            id="hero-promptforge-lab-btn"
            onClick={() => setCurrentPage("lab")}
            className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-indigo-300 font-bold text-sm border border-indigo-800/60 transition-all"
          >
            <FlaskConical className="w-4 h-4 text-indigo-400" />
            <span>PromptForge Lab</span>
          </button>

          <button
            id="hero-submission-hub-btn"
            onClick={() => setCurrentPage("submission")}
            className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/70 text-amber-200 font-bold text-sm border border-amber-700/60 transition-all shadow-lg shadow-amber-950/40"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Submission Hub</span>
          </button>

          <button
            id="hero-see-how-btn"
            onClick={() => setCurrentPage("inbox")}
            className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 font-semibold text-sm border border-zinc-800 transition-all"
          >
            <Layers className="w-4 h-4 text-zinc-400" />
            <span>Explore Noise Inbox</span>
          </button>
        </div>

        {/* Philosophy Quote & Core Product Statement */}
        <div className="pt-6 max-w-2xl mx-auto space-y-3">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-indigo-500/30 text-xs sm:text-sm text-zinc-200 font-medium shadow-inner">
            <span className="text-indigo-400 font-bold">SIGNAL</span> sits between information and attention, filtering what arrives so students can focus on what actually matters.
          </div>
          <div className="text-xs text-zinc-400 italic">
            «“The world doesn't need more information. It needs better filters.”»
          </div>
        </div>
      </section>

      {/* 2. Interactive Noise-to-Signal Funnel Demo */}
      <section className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
            How SIGNAL Transforms Chaos into Clarity
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Watch raw college messages and notifications get filtered into 4 decisive action categories
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-2xl relative overflow-hidden space-y-8">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-indigo-400" />
              Interactive Funnel Simulator
            </span>

            <button
              id="run-funnel-demo-btn"
              onClick={triggerFunnelAnimation}
              disabled={funnelFilterRunning}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${funnelFilterRunning ? "animate-spin" : ""}`} />
              <span>Simulate Filter Funnel</span>
            </button>
          </div>

          {/* Funnel Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Input Noise Stream (5 cols) */}
            <div className="md:col-span-5 space-y-2.5">
              <div className="text-xs font-bold text-zinc-400 flex items-center justify-between pb-1">
                <span>INCOMING NOISE STREAM</span>
                <span className="text-[10px] text-zinc-400">6 Items</span>
              </div>

              <div className="space-y-2">
                {sampleNoisePackets.map((packet) => (
                  <div
                    key={packet.id}
                    className={`p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between transition-all duration-500 ${
                      activeStep > 0 ? "scale-95 opacity-50" : "scale-100 opacity-100"
                    }`}
                  >
                    <span className="truncate pr-2">{packet.text}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      Raw
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle: The AI Engine Funnel (2 cols) */}
            <div className="md:col-span-2 flex flex-col items-center justify-center py-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-950/60 transition-all duration-700 ${
                funnelFilterRunning ? "scale-125 rotate-12 bg-indigo-500/30" : "scale-100"
              }`}>
                <Brain className={`w-8 h-8 ${funnelFilterRunning ? "animate-pulse" : ""}`} />
              </div>
              <span className="text-[11px] font-bold text-indigo-300 mt-2">7 Dimensions</span>
              <span className="text-[10px] text-zinc-400">Goal Alignment</span>
            </div>

            {/* Right: Output Categories (5 cols) */}
            <div className="md:col-span-5 grid grid-cols-2 gap-3">
              {/* NOW */}
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                  <span>🔴 NOW (2)</span>
                  <span className="text-[10px] font-normal">Today</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-snug">
                  • DBMS Assignment
                  <br />
                  • Hackathon Registration
                </p>
              </div>

              {/* NEXT */}
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <span>🟡 NEXT (1)</span>
                  <span className="text-[10px] font-normal">This Week</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-snug">
                  • SWE Internship App
                </p>
              </div>

              {/* LATER */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span>🟢 LATER (1)</span>
                  <span className="text-[10px] font-normal">Backlog</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-snug">
                  • 3h Rust Video
                </p>
              </div>

              {/* IGNORE */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
                  <span>⚪ IGNORE (2)</span>
                  <span className="text-[10px] font-normal">Dropped</span>
                </div>
                <p className="text-[11px] text-zinc-400 line-through leading-snug">
                  • AI Newsletter #42
                  <br />
                  • Viral LinkedIn Hype
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Anti-To-Do Philosophy (Direct Comparison) */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
            Why Generic Productivity Apps Fail Students
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Traditional tools encourage you to collect more tasks. SIGNAL protects your attention by aggressively saying NO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional To-Do App */}
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
              <Ban className="w-4 h-4" />
              <span>Generic To-Do & Productivity Apps</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Treats every incoming task as equally worth doing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Creates endless 50-item backlogs that induce guilt and burnout.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>No concept of cognitive capacity or attention limits.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Never tells you what to ignore or decline.</span>
              </li>
            </ul>
          </div>

          {/* SIGNAL Attention Filter */}
          <div className="p-6 rounded-3xl bg-indigo-950/30 border border-indigo-800/50 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>SIGNAL Attention Filter Engine</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Filters everything against your personal semester goals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Enforces a daily Attention Budget to prevent cognitive saturation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Distills noise into Top 3 actionable focus items.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Comfortably says “Ignore this” so you can focus without FOMO.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <section className="max-w-3xl mx-auto px-4 text-center space-y-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-indigo-950/40 to-zinc-950 border border-indigo-800/60 shadow-2xl space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            Ready to reclaim your attention?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Set your goals once. Filter your noisy groups, emails, and alerts in seconds.
          </p>
          <button
            onClick={() => setCurrentPage("onboarding")}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-950/80 transition-all border border-indigo-400/30"
          >
            Launch Your Personal Filter
          </button>
        </div>
      </section>
    </div>
  );
};
