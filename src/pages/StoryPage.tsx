import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSignal } from "../context/SignalContext";
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Ban, 
  HelpCircle, 
  Zap, 
  Clock, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  X,
  Target,
  Layers,
  Flame,
  AlertTriangle,
  FileText,
  Briefcase,
  Trophy,
  GraduationCap,
  Code,
  Compass,
  Eye,
  Check
} from "lucide-react";
import { SignalItem } from "../types";
import { STORY_TEN_ITEMS } from "../data/demoData";

type DemoMode = "manual" | "auto30" | "auto60";

export const StoryPage: React.FC = () => {
  const { setCurrentPage, loadStoryScenario } = useSignal();

  // Scene index: 0 = Scene 1 (Problem), 1 = Scene 2 (Person), 2 = Scene 3 (Noise), 3 = Scene 4 (Filter), 4 = Scene 5 (Answer), 5 = Scene 6 (Difference)
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [demoMode, setDemoMode] = useState<DemoMode>("manual");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isDistractionFree, setIsDistractionFree] = useState<boolean>(false);
  
  // Interactive sub-states for Scene 5
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);
  const [showWowMoment, setShowWowMoment] = useState<boolean>(false);
  const [filterFunnelActive, setFilterFunnelActive] = useState<boolean>(false);
  
  // Scene 1 cards animation staggered count
  const [scene1VisibleCards, setScene1VisibleCards] = useState<number>(1);

  // Timer reference for auto demos
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const rawInputCards = useMemo(() => [
    { id: 1, title: "DBMS Assignment 3", detail: "Due tomorrow 11:59 PM (-25% late penalty)", source: "Canvas", tag: "Academics", color: "rose" },
    { id: 2, title: "48h Global AI Hackathon", detail: "Registration locks tonight at midnight", source: "Devpost", tag: "Hackathon", color: "rose" },
    { id: 3, title: "SWE Internship Application", detail: "Summer 2026 portal live (5-day window)", source: "Handshake", tag: "Career", color: "amber" },
    { id: 4, title: "Advanced Deep Learning Course", detail: "30h Self-paced Transformer deep dive", source: "Coursera", tag: "Skills", color: "emerald" },
    { id: 5, title: "10 Skills for SWEs in 2027", detail: "Viral influencer carousel (12k likes)", source: "LinkedIn", tag: "Feed", color: "zinc" },
    { id: 6, title: "React 19 Server Actions Video", detail: "2.5h architecture tutorial", source: "YouTube", tag: "Video", color: "emerald" },
    { id: 7, title: "Convocation Seating Briefing", detail: "General notice for next month", source: "Campus", tag: "Memo", color: "zinc" },
    { id: 8, title: "Tech Bytes AI Newsletter #104", detail: "42 new research papers & tools", source: "Email", tag: "Newsletter", color: "zinc" },
    { id: 9, title: "Dependabot: Bump Axios", detail: "PR on stale freshman repo", source: "GitHub", tag: "Bot", color: "zinc" },
    { id: 10, title: "Trending AI Framework Hype", detail: "'Everyone is learning this new tool!'", source: "Twitter/X", tag: "FOMO", color: "zinc" },
  ], []);

  // Handle Scene 1 Staggered Overload Animation
  useEffect(() => {
    if (currentScene === 0) {
      setScene1VisibleCards(1);
      const interval = setInterval(() => {
        setScene1VisibleCards((prev) => {
          if (prev >= 10) {
            clearInterval(interval);
            return 10;
          }
          return prev + 1;
        });
      }, 350);
      return () => clearInterval(interval);
    }
  }, [currentScene]);

  // Handle Scene 4 Filter Funnel Animation
  useEffect(() => {
    if (currentScene === 3) {
      setFilterFunnelActive(true);
      const timeout = setTimeout(() => {
        setFilterFunnelActive(false);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [currentScene]);

  // 30-Second and 60-Second Auto-play Timelines
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;

        if (demoMode === "auto30") {
          // 30-sec breakdown:
          // 0-5s: Scene 0 (Problem)
          // 5-10s: Scene 1 (Person)
          // 10-15s: Scene 3 (Filter Funnel)
          // 15-25s: Scene 4 (Answer)
          // 25-30s: Scene 5 (Difference)
          if (next >= 30) {
            setIsPlaying(false);
            setCurrentScene(5);
            return 30;
          }
          if (next >= 25) setCurrentScene(5);
          else if (next >= 15) setCurrentScene(4);
          else if (next >= 10) setCurrentScene(3);
          else if (next >= 5) setCurrentScene(1);
          else setCurrentScene(0);
        } else if (demoMode === "auto60") {
          // 60-sec breakdown:
          // 0-10s: Scene 0 (Problem)
          // 10-20s: Scene 2 (The Noise & 10 items)
          // 20-30s: Scene 3 (Filter Funnel & 7 dimensions)
          // 30-40s: Scene 4 (Answer & Prioritization)
          // 40-50s: Scene 4 with WOW Moment open
          // 50-60s: Scene 5 (Difference & Before/After)
          if (next >= 60) {
            setIsPlaying(false);
            setCurrentScene(5);
            return 60;
          }
          if (next >= 50) {
            setShowWowMoment(false);
            setCurrentScene(5);
          } else if (next >= 40) {
            setCurrentScene(4);
            setShowWowMoment(true);
          } else if (next >= 30) {
            setShowWowMoment(false);
            setCurrentScene(4);
          } else if (next >= 20) {
            setCurrentScene(3);
          } else if (next >= 10) {
            setCurrentScene(2);
          } else {
            setCurrentScene(0);
          }
        }

        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, demoMode]);

  // Keyboard navigation & Accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setCurrentScene((prev) => Math.min(prev + 1, 5));
      } else if (e.key === "ArrowLeft") {
        setCurrentScene((prev) => Math.max(prev - 1, 0));
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === "Escape") {
        if (showWhyModal) setShowWhyModal(false);
        else if (showWowMoment) setShowWowMoment(false);
        else if (isDistractionFree) setIsDistractionFree(false);
        else setCurrentPage("landing");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showWhyModal, showWowMoment, isDistractionFree, setCurrentPage]);

  // Trigger 30-second Demo
  const start30SecDemo = () => {
    setDemoMode("auto30");
    setCurrentScene(0);
    setElapsedSeconds(0);
    setShowWhyModal(false);
    setShowWowMoment(false);
    setIsPlaying(true);
  };

  // Trigger 60-second Demo
  const start60SecDemo = () => {
    setDemoMode("auto60");
    setCurrentScene(0);
    setElapsedSeconds(0);
    setShowWhyModal(false);
    setShowWowMoment(false);
    setIsPlaying(true);
  };

  // Reset to Manual Step-by-Step
  const setManualScene = (idx: number) => {
    setIsPlaying(false);
    setDemoMode("manual");
    setCurrentScene(idx);
    setShowWhyModal(false);
    setShowWowMoment(false);
  };

  const scenes = [
    { id: 1, title: "1. The Problem", subtitle: "Information Overload" },
    { id: 2, title: "2. The Person", subtitle: "Meet the Student" },
    { id: 3, title: "3. The Noise", subtitle: "10 Competing Demands" },
    { id: 4, title: "4. The Filter", subtitle: "Noise In, Signal Out" },
    { id: 5, title: "5. The Answer", subtitle: "What Deserves Attention" },
    { id: 6, title: "6. The Difference", subtitle: "Attention Architecture" },
  ];

  const totalDuration = demoMode === "auto30" ? 30 : demoMode === "auto60" ? 60 : 0;
  const progressPercent = totalDuration > 0 ? Math.min((elapsedSeconds / totalDuration) * 100, 100) : 0;

  return (
    <div className={`min-h-screen bg-zinc-950 text-zinc-100 flex flex-col ${isDistractionFree ? "fixed inset-0 z-50 overflow-y-auto" : ""}`}>
      
      {/* 1. Header & Demo Control Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Mode Label */}
          <div className="flex items-center gap-3">
            <button
              id="story-exit-btn"
              onClick={() => setCurrentPage("landing")}
              className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Exit Story & Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-zinc-100 tracking-tight">SIGNAL STORY</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                    Live Demo
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 hidden sm:block">
                  The 6-Scene Journey: Why attention needs an AI filter
                </p>
              </div>
            </div>
          </div>

          {/* Preset Demo Buttons (30s & 60s) */}
          <div className="flex items-center gap-2">
            <button
              id="btn-30s-demo"
              onClick={start30SecDemo}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                demoMode === "auto30" && isPlaying
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/80 animate-pulse border border-indigo-400"
                  : "bg-zinc-900 hover:bg-zinc-800 text-indigo-300 border border-indigo-900/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>30 SEC DEMO</span>
            </button>

            <button
              id="btn-60s-demo"
              onClick={start60SecDemo}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                demoMode === "auto60" && isPlaying
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-950/80 animate-pulse border border-purple-400"
                  : "bg-zinc-900 hover:bg-zinc-800 text-purple-300 border border-purple-900/50"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>60 SEC DEEP DEMO</span>
            </button>

            {/* Play/Pause Toggle for Auto modes */}
            {demoMode !== "manual" && (
              <button
                id="btn-toggle-play"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300"
                title={isPlaying ? "Pause Demo" : "Resume Demo"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
              </button>
            )}

            {/* Replay */}
            <button
              id="btn-replay-story"
              onClick={() => {
                if (demoMode === "auto30") start30SecDemo();
                else if (demoMode === "auto60") start60SecDemo();
                else setManualScene(0);
              }}
              className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              title="Replay Story"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen / Distraction-free */}
            <button
              id="btn-distraction-free"
              onClick={() => setIsDistractionFree(!isDistractionFree)}
              className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              title={isDistractionFree ? "Exit Distraction-Free Mode" : "Distraction-Free Presentation"}
            >
              {isDistractionFree ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Try Signal Direct Action */}
            <button
              id="btn-story-try-signal-header"
              onClick={loadStoryScenario}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/60 transition-all active:scale-95"
            >
              <span>TRY SIGNAL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar for Auto Demos */}
        {demoMode !== "manual" && (
          <div className="w-full bg-zinc-900 h-1 mt-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${demoMode === "auto30" ? "bg-indigo-500" : "bg-purple-500"}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </header>

      {/* 2. Scene Timeline Navigation Pills */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2 w-full">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {scenes.map((scene, idx) => {
            const isActive = currentScene === idx;
            const isPassed = currentScene > idx;
            return (
              <button
                key={scene.id}
                id={`scene-nav-${idx}`}
                onClick={() => setManualScene(idx)}
                className={`text-left p-2.5 rounded-2xl border transition-all text-xs ${
                  isActive
                    ? "bg-indigo-950/60 border-indigo-500/80 text-white shadow-lg shadow-indigo-950/60"
                    : isPassed
                    ? "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800/60"
                    : "bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-400 hover:bg-zinc-900/40"
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>Scene {scene.id}</span>
                  {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                </div>
                <div className="text-[11px] text-zinc-400 truncate mt-0.5">{scene.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Stage Container */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-6 w-full flex flex-col justify-center">
        
        {/* ========================================================================= */}
        {/* SCENE 1 — THE PROBLEM */}
        {/* ========================================================================= */}
        {currentScene === 0 && (
          <div className="space-y-8 py-6 animate-fadeIn text-center">
            
            {/* Opening Thesis Statement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400">
              <span>«"Students don't have an information problem. They have an attention problem."»</span>
            </div>

            {/* Big Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-100">
                INFORMATION IS EVERYWHERE.
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
                Every single day, dozens of college channels, group chats, newsletters, and portals fight for your mind.
              </p>
            </div>

            {/* Rapidly Appearing Overload Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-w-4xl mx-auto pt-2 text-left">
              {rawInputCards.slice(0, scene1VisibleCards).map((card, i) => (
                <div
                  key={card.id}
                  className={`p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs shadow-md transition-all duration-300 transform ${
                    i === scene1VisibleCards - 1 ? "scale-105 border-indigo-500/60 bg-indigo-950/20" : "scale-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {card.source}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">#{card.id}</span>
                  </div>
                  <h4 className="font-bold text-zinc-200 truncate">{card.title}</h4>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">{card.detail}</p>
                </div>
              ))}
            </div>

            {/* Contrasting Reveal */}
            <div className="pt-6 max-w-xl mx-auto space-y-3">
              <div className="p-4 rounded-3xl bg-rose-950/30 border border-rose-900/40 text-center space-y-1 shadow-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-rose-400">The Biological Reality</span>
                <h2 className="text-xl sm:text-2xl font-black text-rose-200">
                  BUT ATTENTION IS LIMITED.
                </h2>
                <p className="text-xs text-zinc-300">
                  A human can only sustain high focus for 70 to 100 points of cognitive work per day.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 2 — THE PERSON */}
        {/* ========================================================================= */}
        {currentScene === 1 && (
          <div className="space-y-8 py-6 animate-fadeIn max-w-3xl mx-auto">
            
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 text-xs font-bold">
                <Target className="w-3.5 h-3.5" />
                <span>MEET THE STUDENT</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-100">
                A College Student Trying to Do Everything
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                Balancing five competing ambitions simultaneously without a filter.
              </p>
            </div>

            {/* Student Persona Grid */}
            <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-2xl space-y-6">
              
              <div className="flex items-center gap-4 pb-4 border-b border-zinc-800/80">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-lg">
                  AC
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">Alex Chen</h3>
                  <p className="text-xs text-zinc-400">Junior (3rd Year) • Computer Science & Engineering</p>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-800/50 px-2.5 py-1 rounded-xl">
                    ⚡ Budget: 70 pts/day
                  </span>
                </div>
              </div>

              {/* 5 Competing Goals */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Five Real-World Pressures:</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>🎓 Keep up with academics & GPA</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>💼 Find summer tech internships</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center gap-2.5">
                    <Code className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>💻 Build production-grade projects</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center gap-2.5">
                    <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>🏆 Participate in hackathons</span>
                  </div>

                  <div className="sm:col-span-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center gap-2.5">
                    <Brain className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>🧠 Learn new technical skills & DSA</span>
                  </div>
                </div>
              </div>

              {/* The Core Friction Quote */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-indigo-900/40 text-center space-y-1">
                <span className="text-xs text-zinc-400">The everyday feeling:</span>
                <p className="text-lg sm:text-xl font-bold text-zinc-100 italic">
                  «"Everything feels important."»
                </p>
                <p className="text-[11px] text-indigo-400 pt-1">
                  «SIGNAL is an AI filter between information and attention.»
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 3 — THE NOISE */}
        {/* ========================================================================= */}
        {currentScene === 2 && (
          <div className="space-y-6 py-6 animate-fadeIn max-w-4xl mx-auto">
            
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>10 COMPETING DEMANDS TODAY</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-100">
                A Realistic Information Inbox
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Which one deserves your attention right now?
              </p>
            </div>

            {/* 10 Items Competing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {STORY_TEN_ITEMS.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-2.5 shadow-sm"
                >
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <strong className="text-zinc-200 truncate">{item.title}</strong>
                      <span className="text-[10px] text-zinc-500 shrink-0">{item.source}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">{item.why}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dramatic Question & Pause */}
            <div className="p-5 rounded-3xl bg-indigo-950/40 border border-indigo-500/40 text-center space-y-2 shadow-2xl">
              <h3 className="text-lg sm:text-xl font-black text-indigo-200">
                WHAT SHOULD THEY DO FIRST?
              </h3>
              <p className="text-xs text-zinc-300 max-w-md mx-auto">
                Without a cognitive filter, you will either procrastinate, multitask poorly, or burn out trying to do everything.
              </p>
              <div className="pt-2">
                <button
                  id="btn-scene3-enter-signal"
                  onClick={() => setManualScene(3)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/80 transition-transform active:scale-95"
                >
                  <Brain className="w-4 h-4" />
                  <span>ENTER SIGNAL 🧠</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 4 — THE FILTER */}
        {/* ========================================================================= */}
        {currentScene === 3 && (
          <div className="space-y-8 py-6 animate-fadeIn max-w-4xl mx-auto text-center">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 text-xs font-bold">
                <Brain className="w-3.5 h-3.5" />
                <span>THE COGNITIVE FUNNEL</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-100">
                Noise Goes In. Signal Comes Out.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
                SIGNAL processes incoming requests against your semester goals, deadline urgency, and daily attention capacity.
              </p>
            </div>

            {/* Visual Funnel Representation */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-2xl relative overflow-hidden space-y-6">
              
              {/* Step 1: 10 Raw Items In */}
              <div className="flex flex-col items-center gap-2">
                <div className="px-4 py-2 rounded-2xl bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 flex items-center gap-2 shadow-md">
                  <Layers className="w-4 h-4 text-zinc-400" />
                  <span>10 RAW INCOMING ITEMS</span>
                </div>
                <div className="text-zinc-600 font-bold text-sm">↓</div>
              </div>

              {/* Step 2: The Core AI Filter Engine */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-purple-950/70 border border-indigo-500/50 shadow-xl space-y-2 relative">
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-indigo-300 ${filterFunnelActive ? "animate-spin" : ""}`}>
                    <Brain className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white">SIGNAL ENGINE</h4>
                    <p className="text-[10px] text-indigo-300">7-Dimensional Cognitive Analysis</p>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-300 leading-snug">
                  Evaluates Goal Alignment, Deadline Consequence, Cognitive Effort, Opportunity Cost, and Buffer.
                </p>
              </div>

              <div className="text-zinc-600 font-bold text-sm">↓</div>

              {/* Step 3: Categorized Output */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                
                {/* NOW */}
                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                    <span>🔴 NOW</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-900/60 text-[11px] text-rose-200">2</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-tight">• Hackathon Reg<br />• DBMS Assignment</p>
                </div>

                {/* NEXT */}
                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/60 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>🟡 NEXT</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-900/60 text-[11px] text-amber-200">2</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-tight">• SWE Internship<br />• Core DSA Viva</p>
                </div>

                {/* LATER */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>🟢 LATER</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 text-[11px] text-emerald-200">2</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-tight">• Deep Learning<br />• React 19 Video</p>
                </div>

                {/* IGNORE */}
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
                    <span>⚪ IGNORE</span>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-[11px] text-zinc-400">4</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-through leading-tight">• AI Newsletter<br />• Framework Hype</p>
                </div>

              </div>

            </div>

            <p className="text-xs text-indigo-400 font-semibold italic">
              «"It asks what deserves your attention right now."»
            </p>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 5 — THE ANSWER */}
        {/* ========================================================================= */}
        {currentScene === 4 && (
          <div className="space-y-6 py-4 animate-fadeIn max-w-4xl mx-auto">
            
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>YOUR SIGNAL TODAY</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-100">
                Clear, Prioritized Action
              </h2>
            </div>

            {/* Top 3 Prioritized Items */}
            <div className="space-y-2.5">
              
              {/* Item 1 */}
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-rose-900 text-rose-200 text-[10px] font-bold uppercase">#1 Priority</span>
                    <h3 className="text-sm sm:text-base font-bold text-rose-200">🔴 1. GLOBAL 48H HACKATHON REGISTRATION</h3>
                  </div>
                  <p className="text-xs text-zinc-300">«Closes tonight at midnight. Takes 10 mins to preserve spot.»</p>
                </div>
                <button
                  id="btn-why-item-1"
                  onClick={() => setShowWhyModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>WHY?</span>
                </button>
              </div>

              {/* Item 2 */}
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-rose-900 text-rose-200 text-[10px] font-bold uppercase">#2 Priority</span>
                    <h3 className="text-sm sm:text-base font-bold text-rose-200">🔴 2. DBMS ASSIGNMENT 3</h3>
                  </div>
                  <p className="text-xs text-zinc-300">«Due tomorrow 11:59 PM. -25% late penalty with direct GPA consequence.»</p>
                </div>
                <button
                  id="btn-why-item-2"
                  onClick={() => setShowWhyModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>WHY?</span>
                </button>
              </div>

              {/* Item 3 */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-900 text-amber-200 text-[10px] font-bold uppercase">Next Window</span>
                    <h3 className="text-sm sm:text-base font-bold text-amber-200">🟡 3. SWE INTERNSHIP APPLICATION</h3>
                  </div>
                  <p className="text-xs text-zinc-300">«Strong career alignment. Rolling review window with deadline in 5 days.»</p>
                </div>
                <button
                  id="btn-why-item-3"
                  onClick={() => setShowWhyModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>WHY?</span>
                </button>
              </div>

            </div>

            {/* Ignored List (Zero Guilt) & Wow Moment Trigger */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-zinc-400">⚪ IGNORED FOR NOW (4 Items with Zero Guilt)</span>
                <p className="text-[11px] text-zinc-500">
                  AI newsletter • Random tutorial • Trending framework • Generic LinkedIn post
                </p>
              </div>

              <button
                id="btn-trigger-wow-moment"
                onClick={() => setShowWowMoment(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 text-indigo-300 text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>See Attention Defense in Action</span>
              </button>
            </div>

            {/* Emotional Payoff Banner */}
            <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-center space-y-1">
              <p className="text-sm sm:text-base font-bold text-zinc-200">
                YOU DON'T NEED TO PROCESS EVERYTHING.
              </p>
              <p className="text-base sm:text-lg font-extrabold text-indigo-400">
                YOU ONLY NEED TO KNOW WHAT MATTERS.
              </p>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 6 — THE DIFFERENCE */}
        {/* ========================================================================= */}
        {currentScene === 5 && (
          <div className="space-y-8 py-6 animate-fadeIn max-w-4xl mx-auto text-center">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>THE PHILOSOPHICAL SHIFT</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-100">
                Traditional Tools vs. SIGNAL
              </h2>
            </div>

            {/* Direct Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              
              {/* Traditional Tool */}
              <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800/80 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <Ban className="w-4 h-4" />
                  <span>Traditional Productivity Tool</span>
                </div>
                <p className="text-xs text-zinc-400 italic">«"Here are all your tasks."»</p>
                <ul className="space-y-2 text-xs text-zinc-400">
                  <li className="flex items-center gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Accumulates 50+ backlogs that cause guilt</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Treats every incoming alert as equally worth doing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Optimizes for recording tasks, not finishing them</span>
                  </li>
                </ul>
              </div>

              {/* SIGNAL */}
              <div className="p-6 rounded-3xl bg-indigo-950/30 border border-indigo-500/50 space-y-3 shadow-xl">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span>SIGNAL Attention Engine</span>
                </div>
                <p className="text-xs text-indigo-300 font-medium italic">
                  «"Here is what actually deserves your attention."»
                </p>
                <ul className="space-y-2 text-xs text-zinc-200">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Filters 60-70% noise straight to IGNORE</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Enforces a strict 70-point cognitive budget</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Gives 1-click focus mode on your #1 deliverable</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Before vs After Pipeline */}
            <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Before vs After Workflow</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-left">
                {/* Before */}
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1.5 text-zinc-400">
                  <strong className="text-rose-400 block text-xs">BEFORE SIGNAL:</strong>
                  <div className="space-y-1 text-[11px] font-mono">
                    <div>10+ Competing Inputs</div>
                    <div>↓ Confusion & Tab-Hopping</div>
                    <div>↓ Decision Fatigue</div>
                    <div>↓ Everything feels important & unmanaged</div>
                  </div>
                </div>

                {/* After */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-1.5 text-zinc-300">
                  <strong className="text-emerald-400 block text-xs">AFTER SIGNAL:</strong>
                  <div className="space-y-1 text-[11px] font-mono">
                    <div>10+ Incoming Inputs</div>
                    <div>↓ SIGNAL Attention Filter</div>
                    <div>↓ 3 Meaningful Prioritized Actions</div>
                    <div className="text-emerald-300 font-bold">↓ Clear Next Step & Deep Work</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Product Branding & Statement */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black text-zinc-100">
                <Brain className="w-8 h-8 text-indigo-400" />
                <span>SIGNAL</span>
              </div>

              <div className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight">
                LESS NOISE. MORE SIGNAL.
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto italic">
                «An AI attention filter for information-overloaded college students.»
              </p>

              {/* Try Signal Big CTA */}
              <div className="pt-4">
                <button
                  id="btn-story-launch-product"
                  onClick={loadStoryScenario}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-950/80 transition-all transform hover:-translate-y-0.5 active:scale-95 border border-indigo-400/30"
                >
                  TRY SIGNAL WITH THIS DEMO SCENARIO
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* 4. Bottom Scene Stepper Controls */}
      <footer className="sticky bottom-0 z-30 border-t border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          <button
            id="btn-story-prev-scene"
            onClick={() => setManualScene(Math.max(0, currentScene - 1))}
            disabled={currentScene === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-zinc-300 text-xs font-semibold border border-zinc-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span className="hidden sm:inline">Previous Scene</span>
          </button>

          {/* Center Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-300">
              Scene {currentScene + 1} of 6
            </span>
            {demoMode !== "manual" && (
              <span className="text-[10px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                {elapsedSeconds}s / {totalDuration}s
              </span>
            )}
          </div>

          {currentScene < 5 ? (
            <button
              id="btn-story-next-scene"
              onClick={() => setManualScene(currentScene + 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/60 transition-transform active:scale-95"
            >
              <span>Next Scene</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-story-final-try-signal"
              onClick={loadStoryScenario}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/60 transition-transform active:scale-95"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* "WHY?" MOMENT MODAL */}
      {/* ========================================================================= */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-800 p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">Why SIGNAL Chose This #1</h4>
                  <p className="text-[10px] text-zinc-400">Deterministic Cognitive Reasoning</p>
                </div>
              </div>

              <button
                id="btn-close-why-modal"
                onClick={() => setShowWhyModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Core Reasoning */}
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Verdict Explanation</span>
              <p className="text-xs text-zinc-200 leading-relaxed">
                «"This ranks #1 because it has the closest deadline, high consequence if missed, and strong relevance to your current academic goal."»
              </p>
            </div>

            {/* 5 Factor Badges */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Decision Factors:</span>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                  <span className="text-zinc-400">Goal alignment</span>
                  <span className="font-bold text-emerald-400">High (95%)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                  <span className="text-zinc-400">Urgency</span>
                  <span className="font-bold text-rose-400">High (98%)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                  <span className="text-zinc-400">Effort</span>
                  <span className="font-bold text-amber-400">Medium (60m)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                  <span className="text-zinc-400">Opportunity cost</span>
                  <span className="font-bold text-emerald-400">Low (GPA Protected)</span>
                </div>

                <div className="col-span-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                  <span className="text-zinc-400">Confidence</span>
                  <span className="font-bold text-indigo-400">High (98% match)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowWhyModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
              >
                Got It
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* THE "WOW MOMENT" (EXPLICIT REJECTION) MODAL */}
      {/* ========================================================================= */}
      {showWowMoment && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-900 border border-purple-800/60 p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">The Wow Moment: Explicit Rejection</h4>
                  <p className="text-[10px] text-purple-300">Protecting attention over engagement</p>
                </div>
              </div>

              <button
                id="btn-close-wow-modal"
                onClick={() => setShowWowMoment(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prompt Query */}
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">User Query:</span>
              <p className="text-xs text-zinc-200 italic">
                «"Everyone is learning this new AI framework. Should I learn it?"»
              </p>
            </div>

            {/* SIGNAL Response */}
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-2">
              <div className="inline-block px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-black tracking-wide">
                NOT RIGHT NOW.
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed">
                «"It may be useful, but it does not currently support your top goals and your attention budget is already constrained."»
              </p>
              <div className="pt-2 border-t border-purple-900/60 text-xs font-bold text-purple-300">
                YOUR ATTENTION IS BETTER SPENT ON YOUR CURRENT PROJECT.
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 leading-snug">
              SIGNAL is explicitly not engineered to drive app engagement or maximize clicks. It is engineered to defend cognitive focus.
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowWowMoment(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                Continue Story
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
