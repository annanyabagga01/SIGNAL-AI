import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import {
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  HelpCircle,
  Clock,
  Settings,
  Shield,
  Copy,
  Check,
  Zap,
  Play,
  RotateCcw,
  Scale,
  Award,
  Flame,
  Inbox,
  Filter,
  EyeOff,
  UserCheck,
  ChevronRight,
  FlaskConical,
  Compass,
  FileText,
  Video,
  Camera,
  Target,
  ListFilter,
  ExternalLink,
  Square,
  CheckSquare
} from "lucide-react";

export const SubmissionPage: React.FC = () => {
  const { 
    setCurrentPage, 
    userProfile, 
    setIsJudgeModeOpen, 
    setIsPresentationOpen,
    setQuickToast 
  } = useSignal();

  // Demo interactive state in submission page
  const [demoFiltered, setDemoFiltered] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    "prod-1": true,
    "prod-2": true,
    "prod-3": true,
    "prod-4": true,
    "prod-5": true,
    "prod-6": true,
    "pc-1": true,
    "pc-2": true,
    "pc-3": true,
    "pc-4": true,
    "pc-5": true,
    "pc-6": true,
    "sub-1": true,
    "sub-2": true,
    "sub-3": true,
    "sub-4": true,
    "sub-5": true,
    "sub-6": true,
    "sub-7": true,
    "sub-8": true,
    "claim-1": true,
    "claim-2": true,
    "claim-3": true,
    "claim-4": true,
    "claim-5": true,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setQuickToast({ message: `Copied ${sectionId} to clipboard!`, type: "success" });
    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  };

  const rawNoiseItems = [
    { id: "n1", source: "College LMS", title: "1. DBMS assignment due tomorrow", tag: "Urgent Coursework", time: "Tomorrow 11:59 PM", category: "NOW", priorityReason: "Hard deadline directly impacting GPA. Requires immediate submission." },
    { id: "n2", source: "Unstop / Devpost", title: "2. Hackathon registration closes tonight", tag: "Hackathon", time: "Tonight 11:59 PM", category: "NOW", priorityReason: "Direct goal alignment with rapid registration window. Time-sensitive." },
    { id: "n3", source: "LinkedIn Jobs", title: "3. Internship application closes in 5 days", tag: "Career Priority", time: "In 5 days", category: "NEXT", priorityReason: "High impact career goal, but 5-day window allows completing DBMS first." },
    { id: "n4", source: "Coursera", title: "4. New AI course", tag: "Learning", time: "Self-paced", category: "LATER", priorityReason: "Valuable skill development, but save for weekend when attention budget resets." },
    { id: "n5", source: "YouTube", title: "5. React tutorial (4h crash course)", tag: "Tutorial", time: "Published today", category: "LATER", priorityReason: "Useful project reference. Save link to archive rather than watching immediately." },
    { id: "n6", source: "LinkedIn Feed", title: "6. LinkedIn viral post on career advice", tag: "Social Feed", time: "2h ago", category: "IGNORE", priorityReason: "Generic opinion post without actionable value or direct relevance." },
    { id: "n7", source: "Substack", title: "7. AI newsletter digest", tag: "Newsletter", time: "This morning", category: "IGNORE", priorityReason: "Non-critical industry recap. Low impact during exam/deadline week." },
    { id: "n8", source: "Campus Portal", title: "8. College parking permit announcement", tag: "Campus Admin", time: "In 3 weeks", category: "IGNORE", priorityReason: "Campus admin notice with distant deadline. Zero immediate urgency." },
    { id: "n9", source: "GitHub", title: "9. GitHub notification on archived repository", tag: "Bot Alert", time: "Today", category: "IGNORE", priorityReason: "Dependabot ping on old toy repository. Protect attention stamina." },
    { id: "n10", source: "Twitter / X", title: "10. Trending AI framework FOMO thread", tag: "Tech FOMO", time: "Viral", category: "IGNORE", priorityReason: "Trend-driven hype. Pursuing this now will derail active semester deliverables." },
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 pb-28">
      {/* Top Competition Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-950 via-zinc-900 to-indigo-950 border-b border-indigo-800/40 px-4 py-2 text-xs sticky top-16 z-30 backdrop-blur-md bg-opacity-95">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 text-[10px] tracking-wide uppercase">
              PromptForge Challenge
            </span>
            <span className="text-zinc-300 font-medium hidden sm:inline">
              Phase 9: Final Submission Hub & Evidence Package
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsJudgeModeOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-800/60 font-semibold text-[11px] transition-colors"
            >
              <Scale className="w-3 h-3 text-amber-400" />
              <span>Judge Mode</span>
            </button>
            <button
              onClick={() => setIsPresentationOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-900/60 hover:bg-indigo-800/70 text-indigo-200 border border-indigo-700/60 font-semibold text-[11px] transition-colors"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Pitch Deck</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-16">
        
        {/* ========================================================================= */}
        {/* 1. HERO & IDENTITY SECTION */}
        {/* ========================================================================= */}
        <section id="submission-hero" className="text-center space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 shadow-sm">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-zinc-200">SIGNAL 🧠</span>
            <span className="text-zinc-500">•</span>
            <span className="text-indigo-300">Category: AI / Productivity / Student Innovation</span>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-100">
              SIGNAL <span className="text-indigo-400">🧠</span>
            </h1>
            <p className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-zinc-100 via-indigo-200 to-zinc-400 bg-clip-text text-transparent">
              Less Noise. More Signal.
            </p>
            <p className="text-base sm:text-xl text-indigo-300 font-medium pt-1 max-w-2xl mx-auto leading-relaxed">
              «SIGNAL is an AI attention filter that helps information-overloaded college students decide what actually deserves their attention.»
            </p>
          </div>

          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 text-zinc-300 text-sm sm:text-base space-y-2 leading-relaxed">
            <p className="font-bold text-zinc-100">
              «Students don't have an information problem. They have an attention problem.»
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm">
              SIGNAL sits between information and attention, filtering competing inputs and helping students decide what actually deserves their focus.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="sub-hero-try-btn"
              onClick={() => setCurrentPage(userProfile.onboardingCompleted ? "dashboard" : "onboarding")}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-950/80 transition-all transform hover:-translate-y-0.5 border border-indigo-400/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>TRY SIGNAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="sub-hero-story-btn"
              onClick={() => setCurrentPage("story")}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/70 text-indigo-200 font-bold text-sm border border-indigo-700/60 transition-all shadow-lg"
            >
              <Play className="w-4 h-4 text-indigo-400" />
              <span>WATCH DEMO</span>
            </button>

            <button
              id="sub-hero-lab-btn"
              onClick={() => setCurrentPage("lab")}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-sm border border-zinc-800 transition-all"
            >
              <FlaskConical className="w-4 h-4 text-indigo-400" />
              <span>EXPLORE PROMPTS</span>
            </button>

            <a
              href="#copy-area"
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/70 text-amber-300 font-bold text-sm border border-amber-700/60 transition-all"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>SUBMISSION COPY PACK</span>
            </a>
          </div>

          {/* Quick Anchor Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { label: "1. The Person", href: "#person" },
              { label: "2. The Noise", href: "#noise" },
              { label: "3. The Problem", href: "#problem" },
              { label: "4. The Solution", href: "#solution" },
              { label: "5. How It Works", href: "#how-it-works" },
              { label: "6. Interactive Demo", href: "#demo" },
              { label: "7. The Wow Moment", href: "#wow-moment" },
              { label: "8. Prompt Craft (40%)", href: "#promptcraft" },
              { label: "9. Time Efficiency (30%)", href: "#workflow" },
              { label: "10. Originality (10%)", href: "#originality" },
              { label: "11. Final Output (20%)", href: "#output" },
              { label: "12. Responsible AI", href: "#responsible-ai" },
              { label: "13. 60s Video Script", href: "#video-script" },
              { label: "14. Screenshots Guide", href: "#screenshots" },
              { label: "15. Submission Ready Copy", href: "#copy-area" },
              { label: "16. Final Checklist", href: "#checklist" },
            ].map((jump, idx) => (
              <a
                key={idx}
                href={jump.href}
                className="px-3 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium border border-zinc-800/80 transition-colors"
              >
                {jump.label}
              </a>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. THE PERSON (ONE TARGET PERSONA) */}
        {/* ========================================================================= */}
        <section id="person" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
              THE PERSON
            </span>
            <span className="text-xs text-zinc-400 font-mono">PromptForge Mandate: ONE Specific Target</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
                College students balancing academics, career opportunities, projects and extracurricular activities.
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                We did not build SIGNAL for "everyone". We designed it specifically for university students whose daily cognitive bandwidth is stretched thin across fragmented obligations, strict project milestones, and career pressures.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                {[
                  { label: "Academics", desc: "GPA, exams, LMS deadlines" },
                  { label: "Career", desc: "Internships, resumes, interviews" },
                  { label: "Projects", desc: "Code, builds, portfolios" },
                  { label: "Hackathons", desc: "48h sprints, competitions" },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                    <div className="font-bold text-indigo-300">{item.label}</div>
                    <div className="text-[11px] text-zinc-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 p-5 rounded-xl bg-zinc-950 border border-indigo-900/50 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                Why Specificity Matters
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Generic productivity tools fail because they assume users have infinite time and just need a better to-do list. College students have hard deadlines, finite daily stamina (attention budget), and intense FOMO.
              </p>
              <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/50 text-[11px] text-indigo-200 font-medium">
                «Targeted design creates high-accuracy context-aware decisions.»
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. THE NOISE */}
        {/* ========================================================================= */}
        <section id="noise" className="space-y-6">
          <div className="text-center space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
              THE NOISE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
              What Constantly Divides a Student's Attention
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
              «A college student's attention is constantly divided between assignments, deadlines, internships, hackathons, group chats, notifications, tutorials, courses, social media, newsletters and trending technologies.»
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {rawNoiseItems.map((item) => (
              <div 
                key={item.id}
                className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between space-y-2 text-xs hover:border-zinc-700 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-zinc-400 font-medium">{item.source}</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                      {item.tag}
                    </span>
                  </div>
                  <p className="font-semibold text-zinc-200 text-xs leading-snug">
                    {item.title}
                  </p>
                </div>
                <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-800/60">
                  <span>{item.time}</span>
                  <span className="text-amber-400/80 font-mono text-[9px]">Competes for focus</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-center space-y-1 max-w-2xl mx-auto">
            <div className="text-sm sm:text-base font-extrabold text-amber-300 tracking-wide uppercase font-mono">
              The problem isn't lack of information.
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium">
              «It's too many competing signals with too little attention.»
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. THE PROBLEM */}
        {/* ========================================================================= */}
        <section id="problem" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold border border-rose-500/30">
              THE PROBLEM
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
                Students don't have an information problem. They have an attention problem.
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                When everything arrives with equal visual urgency, students struggle to distinguish what is genuinely important from what is merely interesting, popular or distracting.
              </p>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Existing productivity tools help users store, organize or manage information. SIGNAL focuses on a completely different question:
              </p>
              <div className="p-3 rounded-xl bg-indigo-950/50 border border-indigo-700/60 text-sm sm:text-base font-bold text-indigo-200">
                «"What actually deserves my attention right now?"»
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
              <div className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Existing Tools vs. SIGNAL
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-start gap-2">
                  <div className="text-rose-400 font-bold shrink-0">Traditional Apps:</div>
                  <div className="text-zinc-400">Capture everything → make longer to-do lists → increase anxiety & decision fatigue.</div>
                </div>
                <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/60 flex items-start gap-2">
                  <div className="text-emerald-400 font-bold shrink-0">SIGNAL AI:</div>
                  <div className="text-indigo-200">Evaluates context & opportunity cost → says NO to noise → gives ONE clear next step.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. THE SOLUTION */}
        {/* ========================================================================= */}
        <section id="solution" className="space-y-6">
          <div className="text-center space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
              THE SOLUTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
              SIGNAL Sits Between Information and Attention
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
              It takes noisy inputs and evaluates them using the student's current goals, deadlines, workload, attention budget, relevance, urgency, impact, effort, reliability and opportunity cost.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-1">
              <div className="text-lg font-bold text-emerald-300">NOW</div>
              <p className="text-xs text-emerald-200/80">Immediate attention. Protects top priorities and hard non-negotiable deadlines.</p>
            </div>
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 space-y-1">
              <div className="text-lg font-bold text-indigo-300">NEXT</div>
              <p className="text-xs text-indigo-200/80">Important, but execute right after the active NOW milestone clears.</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 space-y-1">
              <div className="text-lg font-bold text-amber-300">LATER</div>
              <p className="text-xs text-amber-200/80">Valuable opportunities or courses safely stored for future downtime.</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
              <div className="text-lg font-bold text-zinc-400">IGNORE</div>
              <p className="text-xs text-zinc-400">Filtered noise, social hype, FOMO, and unaligned notifications. Zero attention consumed.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-zinc-900 to-indigo-950/80 border border-indigo-700/60 shadow-xl text-center space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">
              CORE VALUE PROPOSITION
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-zinc-100 tracking-tight">
              «Instead of asking students to process everything, SIGNAL helps them decide what deserves attention.»
            </h3>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. HOW IT WORKS (SIMPLE DIAGRAM) */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
          <div className="text-center space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
              HOW IT WORKS
            </h2>
          </div>

          {/* Simple Clean Diagram Flow */}
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
              <div className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest">INFORMATION</div>
              <p className="text-xs text-zinc-300">Raw competing inputs (LMS, chats, emails, social, portals)</p>
            </div>

            <div className="text-center text-indigo-400 font-mono text-base font-bold">↓</div>

            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-center space-y-1">
              <div className="font-mono text-xs font-bold text-indigo-300 uppercase tracking-widest">CONTEXT</div>
              <p className="text-xs text-indigo-200">Goals + Workload + Deadlines + Attention Budget</p>
            </div>

            <div className="text-center text-indigo-400 font-mono text-base font-bold">↓</div>

            <div className="p-4 rounded-xl bg-indigo-900/40 border border-indigo-700/60 text-center space-y-1">
              <div className="font-mono text-xs font-bold text-indigo-300 uppercase tracking-widest">AI FILTER</div>
              <p className="text-xs text-indigo-200">Relevance + Urgency + Impact + Effort + Opportunity Cost</p>
            </div>

            <div className="text-center text-indigo-400 font-mono text-base font-bold">↓</div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-1">
              <div className="font-mono text-xs font-bold text-emerald-300 uppercase tracking-widest">PRIORITY</div>
              <p className="text-xs text-emerald-200 font-bold">NOW / NEXT / LATER / IGNORE</p>
            </div>

            <div className="text-center text-indigo-400 font-mono text-base font-bold">↓</div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-indigo-500/40 text-center space-y-1">
              <div className="font-mono text-xs font-bold text-indigo-400 uppercase tracking-widest">ACTION</div>
              <p className="text-xs text-zinc-100 font-semibold">One clear next step.</p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. EXAMPLE DEMO (ONE CONSISTENT SCENARIO) */}
        {/* ========================================================================= */}
        <section id="demo" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                INTERACTIVE DEMO
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 pt-1">
                EXAMPLE DEMO: 10 INCOMING ITEMS
              </h2>
              <p className="text-xs text-zinc-400">Student Goals: Academics · Internship · Projects · Hackathons</p>
            </div>

            <button
              id="sub-run-signal-toggle-btn"
              onClick={() => setDemoFiltered(!demoFiltered)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg ${
                demoFiltered 
                  ? "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700" 
                  : "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 shadow-emerald-950/60"
              }`}
            >
              {demoFiltered ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>RESET TO RAW NOISE</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>RUN SIGNAL (10 Items)</span>
                </>
              )}
            </button>
          </div>

          {!demoFiltered ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                <span>BEFORE: 10 Incoming Information Items in Raw State</span>
                <span className="text-amber-400 font-mono">Status: High Noise / 0 Priorities</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {rawNoiseItems.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-medium text-zinc-200">{item.title}</div>
                      <div className="text-[10px] text-zinc-500">{item.source} • {item.time}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                <span>AFTER SIGNAL: Filtered & Evaluated Against Student Priorities</span>
                <span className="text-emerald-400 font-mono font-bold">Status: 2 NOW · 1 NEXT · 2 LATER · 5 IGNORE</span>
              </div>

              {/* Categorized Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* NOW */}
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-bold text-xs flex items-center justify-between">
                    <span>NOW (2 Items)</span>
                    <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">Action Today</span>
                  </div>
                  {rawNoiseItems.filter(i => i.category === "NOW").map(i => (
                    <div key={i.id} className="p-3 rounded-xl bg-zinc-950 border border-emerald-900/40 text-xs space-y-1">
                      <div className="font-semibold text-zinc-200">{i.title}</div>
                      <p className="text-[11px] text-emerald-400 font-medium">{i.priorityReason}</p>
                    </div>
                  ))}
                </div>

                {/* NEXT */}
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 font-bold text-xs flex items-center justify-between">
                    <span>NEXT (1 Item)</span>
                    <span className="text-[10px] bg-indigo-500/20 px-1.5 py-0.5 rounded">Do Soon</span>
                  </div>
                  {rawNoiseItems.filter(i => i.category === "NEXT").map(i => (
                    <div key={i.id} className="p-3 rounded-xl bg-zinc-950 border border-indigo-900/40 text-xs space-y-1">
                      <div className="font-semibold text-zinc-200">{i.title}</div>
                      <p className="text-[11px] text-indigo-300 font-medium">{i.priorityReason}</p>
                    </div>
                  ))}
                </div>

                {/* LATER */}
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 font-bold text-xs flex items-center justify-between">
                    <span>LATER (2 Items)</span>
                    <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">Saved for Later</span>
                  </div>
                  {rawNoiseItems.filter(i => i.category === "LATER").map(i => (
                    <div key={i.id} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                      <div className="font-semibold text-zinc-200">{i.title}</div>
                      <p className="text-[11px] text-amber-400 font-medium">{i.priorityReason}</p>
                    </div>
                  ))}
                </div>

                {/* IGNORE */}
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-xs flex items-center justify-between">
                    <span>IGNORE (5 Items)</span>
                    <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded">Filtered Noise</span>
                  </div>
                  {rawNoiseItems.filter(i => i.category === "IGNORE").map(i => (
                    <div key={i.id} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                      <div className="font-medium text-zinc-400">{i.title}</div>
                      <p className="text-[10px] text-zinc-500">{i.priorityReason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 8. THE WOW MOMENT ("SIGNAL CAN SAY NO") */}
        {/* ========================================================================= */}
        <section id="wow-moment" className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-zinc-900 to-zinc-950 border border-indigo-800/60 space-y-6">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
              THE WOW MOMENT
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
              SIGNAL Can Say No to Protect Attention
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              A demonstration of how SIGNAL protects students from FOMO and trend distraction:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Query */}
            <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800 space-y-2">
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                User:
              </div>
              <p className="text-sm sm:text-base font-bold text-zinc-100 italic">
                «"Everyone is learning this new AI framework. Should I learn it?"»
              </p>
              <div className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/60">
                Context: Active DBMS assignment due in 24h & 70pt daily attention budget already utilized.
              </div>
            </div>

            {/* Verdict */}
            <div className="p-5 rounded-2xl bg-indigo-950/60 border border-indigo-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                  SIGNAL:
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                  Not right now.
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                «"It may be useful, but it doesn't currently support your highest-priority goals and your attention budget is already constrained."»
              </p>
              <p className="text-xs text-indigo-300 font-bold">
                «"Your current project deserves the attention first."»
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/80 border border-indigo-900/60 text-center text-xs sm:text-sm text-zinc-200 font-semibold">
            Fundamental Difference: <span className="text-zinc-400 font-normal">SIGNAL doesn't maximize engagement.</span> <span className="text-emerald-400 font-bold">SIGNAL protects attention.</span>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. PROMPT CRAFT — 40% (JUDGING CRITERION #1) */}
        {/* ========================================================================= */}
        <section id="promptcraft" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                PROMPT CRAFT — 40%
              </span>
              <span className="text-xs font-semibold text-zinc-400">Primary Competition Criterion</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-100">
              PROMPT EVOLUTION & SYSTEM ARCHITECTURE
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
              We engineered the AI behavior through 4 deliberate phases of prompt refinement, explicit negative constraints, and structured output contracts.
            </p>
          </div>

          {/* 4 Iteration Stages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-zinc-950 border border-rose-900/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono font-bold text-rose-400">Initial Prompt</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300">Flawed</span>
              </div>
              <div className="p-2 rounded bg-zinc-900 font-mono text-[11px] text-zinc-300">
                «"Which of these things are important?"»
              </div>
              <div className="text-[11px] text-rose-300/80 space-y-0.5">
                <div>• No role</div>
                <div>• No user context</div>
                <div>• No constraints</div>
                <div>• No goals</div>
                <div>• No output structure</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-amber-900/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono font-bold text-amber-400">V2: Context-aware</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">Personalized</span>
              </div>
              <p className="text-zinc-300 text-[11px]">We introduced:</p>
              <div className="text-[11px] text-amber-300/80 space-y-0.5">
                <div>• User goals & major</div>
                <div>• Deadlines & workload</div>
                <div>• Attention budget</div>
                <div>• Impact & effort metrics</div>
              </div>
              <p className="text-[10px] text-zinc-500">Made output personalized to the student.</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-indigo-900/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono font-bold text-indigo-400">V3: Decision Engine</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300">Decision Support</span>
              </div>
              <p className="text-zinc-300 text-[11px]">We added:</p>
              <div className="text-[11px] text-indigo-300/80 space-y-0.5">
                <div>• Opportunity cost</div>
                <div>• FOMO detection</div>
                <div>• Reliability & confidence</div>
                <div>• Dynamic priority & duplicates</div>
              </div>
              <p className="text-[10px] text-zinc-500">Shifted from classification to decision support.</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-900/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono font-bold text-emerald-400">V4: Evaluation</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">Production</span>
              </div>
              <p className="text-zinc-300 text-[11px]">We added:</p>
              <div className="text-[11px] text-emerald-300/80 space-y-0.5">
                <div>• Test scenarios & edge cases</div>
                <div>• Failure case mitigations</div>
                <div>• Human override & feedback</div>
                <div>• Quality evaluation suite</div>
              </div>
              <p className="text-[10px] text-zinc-500">Allowed testing the prompt instead of assuming it worked.</p>
            </div>
          </div>

          {/* Master Prompt Specification */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-indigo-300 font-bold">
                Master Prompt (Designed SIGNAL Prompt Methodology)
              </span>
              <button
                onClick={() => copyToClipboard(
`ROLE:
You are SIGNAL, an attention-filtering AI.

CONTEXT:
You are helping a college student managing multiple competing priorities.

OBJECTIVE:
Reduce unnecessary attention while preserving important opportunities.

CONSIDER:
Goals
Deadlines
Workload
Attention Budget
Relevance
Urgency
Impact
Effort
Opportunity Cost
Reliability

DECIDE:
NOW
NEXT
LATER
IGNORE

CONSTRAINTS:
Do not invent missing information.
Do not confuse popularity with importance.
Do not confuse urgency with value.
Show uncertainty when context is insufficient.

OUTPUT:
Priority
Reason
Action
Deadline
Effort
Impact
Confidence`,
                  "master-prompt"
                )}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
              >
                {copiedSection === "master-prompt" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied Master Prompt</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Master Prompt</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-2 overflow-x-auto leading-relaxed">
              <p><span className="text-indigo-400 font-bold">ROLE:</span><br />You are SIGNAL, an attention-filtering AI.</p>
              <p><span className="text-indigo-400 font-bold">CONTEXT:</span><br />You are helping a college student managing multiple competing priorities.</p>
              <p><span className="text-indigo-400 font-bold">OBJECTIVE:</span><br />Reduce unnecessary attention while preserving important opportunities.</p>
              <p><span className="text-indigo-400 font-bold">CONSIDER:</span><br />Goals, Deadlines, Workload, Attention Budget, Relevance, Urgency, Impact, Effort, Opportunity Cost, Reliability</p>
              <p><span className="text-indigo-400 font-bold">DECIDE:</span><br />NOW | NEXT | LATER | IGNORE</p>
              <p><span className="text-indigo-400 font-bold">CONSTRAINTS:</span></p>
              <ul className="list-disc list-inside text-zinc-400 space-y-0.5 pl-2">
                <li>Do not invent missing information.</li>
                <li>Do not confuse popularity with importance.</li>
                <li>Do not confuse urgency with value.</li>
                <li>Show uncertainty when context is insufficient.</li>
              </ul>
              <p><span className="text-indigo-400 font-bold">OUTPUT:</span><br />Priority, Reason, Action, Deadline, Effort, Impact, Confidence</p>
            </div>
            <p className="text-[11px] text-zinc-500 italic">
              * Note: Presented as the designed SIGNAL prompt methodology / representative core prompt architecture.
            </p>
          </div>

          {/* 5 Why Prompt is Good Lines */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
              Why The Prompt is Good (5 Core Pillars)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { title: "Role", desc: "Defines what the AI is responsible for." },
                { title: "Context", desc: "Gives the AI enough information to personalize decisions." },
                { title: "Constraints", desc: "Prevents common undesirable behaviors." },
                { title: "Decision framework", desc: "Converts vague reasoning into actionable categories." },
                { title: "Output contract", desc: "Makes responses consistent and useful." },
              ].map((c, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                  <div className="font-bold text-indigo-300 text-xs">{c.title}</div>
                  <p className="text-zinc-300 text-[11px] leading-snug">{c.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-400 italic">
              «This directly demonstrates prompt craft, rather than simply saying "we used Gemini/AI."»
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. TIME EFFICIENCY — 30% (JUDGING CRITERION #2) */}
        {/* ========================================================================= */}
        <section id="workflow" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                TIME EFFICIENCY — 30%
              </span>
              <span className="text-xs font-semibold text-zinc-400">Deliberate Development Process</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
              OUR 8-STAGE DEVELOPMENT WORKFLOW
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Rather than ad-hoc trial and error, SIGNAL was developed through an organized 8-stage engineering process:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { stage: "01", name: "DISCOVER", desc: "Identify attention overload." },
              { stage: "02", name: "DEFINE", desc: "Select specific student persona." },
              { stage: "03", name: "DESIGN", desc: "Create the Signal framework." },
              { stage: "04", name: "PROMPT", desc: "Engineer AI behavior." },
              { stage: "05", name: "BUILD", desc: "Create working prototype." },
              { stage: "06", name: "TEST", desc: "Evaluate edge cases." },
              { stage: "07", name: "ITERATE", desc: "Improve prompts and UX." },
              { stage: "08", name: "POLISH", desc: "Prepare competition demo." },
            ].map((st, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                <div className="font-mono text-indigo-400 font-bold text-[11px]">{st.stage}</div>
                <div className="font-bold text-zinc-200 text-xs">{st.name}</div>
                <p className="text-[10px] text-zinc-400 leading-snug">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 11. ORIGINALITY — 10% (JUDGING CRITERION #3) */}
        {/* ========================================================================= */}
        <section id="originality" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
                ORIGINALITY — 10%
              </span>
              <span className="text-xs font-semibold text-zinc-400">Category Comparison</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
              EXISTING APPROACH VS. SIGNAL
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-mono">
                  <th className="py-3 px-4">Existing Approach</th>
                  <th className="py-3 px-4">Main Purpose</th>
                  <th className="py-3 px-4">Attention Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                <tr>
                  <td className="py-2.5 px-4 font-bold text-zinc-300">Search engines</td>
                  <td className="py-2.5 px-4 text-zinc-400">Find information</td>
                  <td className="py-2.5 px-4 text-zinc-500">Increases volume</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-zinc-300">Social platforms</td>
                  <td className="py-2.5 px-4 text-zinc-400">Surface information</td>
                  <td className="py-2.5 px-4 text-zinc-500">Maximizes engagement</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-zinc-300">Note-taking apps</td>
                  <td className="py-2.5 px-4 text-zinc-400">Store information</td>
                  <td className="py-2.5 px-4 text-zinc-500">Creates digital clutter</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-zinc-300">Productivity tools</td>
                  <td className="py-2.5 px-4 text-zinc-400">Organize information</td>
                  <td className="py-2.5 px-4 text-zinc-500">Expands to-do lists</td>
                </tr>
                <tr className="bg-indigo-950/40">
                  <td className="py-3 px-4 font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>SIGNAL</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-300">Decide what deserves attention</td>
                  <td className="py-3 px-4 font-bold text-indigo-200">Protects cognitive stamina</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-center text-sm sm:text-base font-bold text-indigo-200">
            «SIGNAL optimizes attention allocation rather than information consumption.»
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 12. FINAL OUTPUT — 20% (JUDGING CRITERION #4) */}
        {/* ========================================================================= */}
        <section id="output" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                FINAL OUTPUT — 20%
              </span>
              <span className="text-xs font-semibold text-zinc-400">Focus on Outcomes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
              CAPABILITIES & OUTCOMES
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            {[
              { feat: "Noise Inbox", solves: "Collects competing information into one place." },
              { feat: "Signal Engine", solves: "Filters and prioritizes inputs against personal context." },
              { feat: "NOW / NEXT / LATER / IGNORE", solves: "Turns raw information into four distinct decisions." },
              { feat: "Attention Budget", solves: "Makes limited cognitive stamina part of every decision." },
              { feat: "Decision Mode", solves: "Explains why something does or does not deserve attention." },
              { feat: "FOMO Detection", solves: "Reduces trend-driven decisions and shiny-object syndrome." },
              { feat: "Human Override", solves: "Keeps the student in complete control with 1-click reclassification." },
              { feat: "Signal Lab", solves: "Makes the AI prompt methodology fully transparent and testable." },
              { feat: "Judge / Story Mode", solves: "Makes the concept immediately demonstrable and evaluation-ready." },
            ].map((f, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <div className="font-bold text-indigo-300 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{f.feat}</span>
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  {f.solves}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 13. RESPONSIBLE AI & HONEST LIMITATIONS */}
        {/* ========================================================================= */}
        <section id="responsible-ai" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Responsible AI */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-zinc-100 text-base">RESPONSIBLE AI</h3>
            </div>
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-xs font-bold text-indigo-200">
              «SIGNAL assists judgment rather than replacing it.»
            </div>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Shows confidence score on decisions</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Handles missing context transparently</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Allows 100% human override on any item</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Does not invent fake deadlines</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Does not claim perfect decisions</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Uses feedback for local personalization</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Does not expose private reasoning or user data</li>
            </ul>
          </div>

          {/* Honest Limitations */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-zinc-100 text-base">LIMITATIONS & INTELLECTUAL HONESTY</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              «SIGNAL's recommendations depend on the quality and completeness of the information provided. Ambiguous goals, missing deadlines and conflicting priorities can produce uncertain decisions. SIGNAL therefore presents recommendations rather than claiming objective truth.»
            </p>
            <div className="p-3 rounded-xl bg-zinc-950 border border-amber-800/40 text-xs text-amber-300 font-bold">
              «The system should make uncertainty visible instead of hiding it.»
            </div>
            <ul className="space-y-1 text-xs text-zinc-400">
              <li>• No claim of 100% infallible AI</li>
              <li>• No fabricated usage statistics</li>
              <li>• Explicit reliance on transparent human confirmation</li>
            </ul>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 14. 60-SECOND VIDEO SCRIPT 🎬 */}
        {/* ========================================================================= */}
        <section id="video-script" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                DEMO RECORDING GUIDE
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 pt-1 flex items-center gap-2">
                <Video className="w-6 h-6 text-indigo-400" />
                <span>60-SECOND VIDEO SCRIPT 🎬</span>
              </h2>
            </div>

            <button
              onClick={() => copyToClipboard(
`0-5 sec:
Visual: Show overloaded information cards.
Voiceover: "Students don't have an information problem. They have an attention problem."

5-12 sec:
Visual: Show the student with assignments, internship, hackathon, notifications.
Voiceover: "Everything competes for attention, and everything starts looking important."

12-20 sec:
Visual: Open SIGNAL.
Voiceover: "SIGNAL is an AI attention filter designed specifically for information-overloaded college students."

20-32 sec:
Visual: Run Signal.
Voiceover: "It evaluates information against goals, deadlines, workload, impact, effort and opportunity cost."

32-42 sec:
Visual: Show NOW / NEXT / LATER / IGNORE.
Voiceover: "Instead of giving students another list, SIGNAL tells them what deserves attention."

42-50 sec:
Visual: Show "Not right now" FOMO example in Decision Mode.
Voiceover: "It can even say no to something interesting when pursuing it would cost more valuable attention."

50-57 sec:
Visual: Show PromptForge Lab.
Voiceover: "We engineered this behavior through iterative prompting, structured constraints and evaluation."

57-60 sec:
Visual: Show logo.
Voiceover: "SIGNAL. Less Noise. More Signal."`,
                "video-script"
              )}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
            >
              {copiedSection === "video-script" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Script</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy 60s Script</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              { time: "0-5 sec", visual: "Show overloaded information cards.", voice: "«Students don't have an information problem. They have an attention problem.»" },
              { time: "5-12 sec", visual: "Show student with assignments, internships, notifications.", voice: "«Everything competes for attention, and everything starts looking important.»" },
              { time: "12-20 sec", visual: "Open SIGNAL interface.", voice: "«SIGNAL is an AI attention filter designed specifically for information-overloaded college students.»" },
              { time: "20-32 sec", visual: "Click Run Signal.", voice: "«It evaluates information against goals, deadlines, workload, impact, effort and opportunity cost.»" },
              { time: "32-42 sec", visual: "Show NOW / NEXT / LATER / IGNORE.", voice: "«Instead of giving students another list, SIGNAL tells them what deserves attention.»" },
              { time: "42-50 sec", visual: "Show 'Not right now' FOMO example.", voice: "«It can even say no to something interesting when pursuing it would cost more valuable attention.»" },
              { time: "50-57 sec", visual: "Show PromptForge Lab.", voice: "«We engineered this behavior through iterative prompting, structured constraints and evaluation.»" },
              { time: "57-60 sec", visual: "Show SIGNAL logo.", voice: "«SIGNAL. Less Noise. More Signal.»" },
            ].map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="font-mono text-indigo-400 font-bold text-xs">{s.time}</div>
                <div className="text-zinc-400 text-[11px]"><strong>Visual:</strong> {s.visual}</div>
                <div className="p-2 rounded bg-zinc-900/80 text-zinc-200 text-[11px] italic border border-zinc-800/60 font-medium">
                  {s.voice}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 15. SCREENSHOTS TO CAPTURE 📸 */}
        {/* ========================================================================= */}
        <section id="screenshots" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
              SUBMISSION ASSETS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center gap-2">
              <Camera className="w-6 h-6 text-indigo-400" />
              <span>SCREENSHOTS TO CAPTURE (7 STRONG SHOTS) 📸</span>
            </h2>
            <p className="text-xs text-zinc-400">Quality &gt; Quantity: 7 high-contrast shots illustrating the entire end-to-end journey</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              { num: "Screenshot 1", name: "Landing / Hero", page: "landing", desc: "Hero title, tagline, value prop, and top CTA buttons." },
              { num: "Screenshot 2", name: "Noise Inbox", page: "inbox", desc: "Raw competing information cards before filtering." },
              { num: "Screenshot 3", name: "SIGNAL Result", page: "dashboard", desc: "NOW / NEXT / LATER / IGNORE categorized grid." },
              { num: "Screenshot 4", name: "Decision Mode + WHY", page: "decision", desc: "Should I Do This? with 'Not right now' FOMO verdict." },
              { num: "Screenshot 5", name: "Signal Lab / Architecture", page: "lab", desc: "Prompt architecture flow and test evaluation matrix." },
              { num: "Screenshot 6", name: "Prompt Iteration V1 → V4", page: "lab", desc: "Evolutionary prompt trajectory from naive to production." },
              { num: "Screenshot 7", name: "Submission Hub / Story", page: "submission", desc: "Executive case study with 1-click evidence copy blocks." },
            ].map((sc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="font-mono text-indigo-400 font-bold text-xs">{sc.num}</div>
                  <div className="font-bold text-zinc-200 text-xs">{sc.name}</div>
                  <p className="text-zinc-400 text-[11px]">{sc.desc}</p>
                </div>
                <button
                  onClick={() => setCurrentPage(sc.page as any)}
                  className="mt-2 flex items-center justify-center gap-1 p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] font-semibold border border-zinc-800 transition-colors"
                >
                  <span>Go to Page</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 16. SUBMISSION READY COPY AREA */}
        {/* ========================================================================= */}
        <section id="copy-area" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                COPY & PASTE READY
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 pt-1">
                FINAL SUBMISSION DESCRIPTION
              </h2>
            </div>
            <button
              onClick={() => copyToClipboard(
`SIGNAL is an AI attention filter built for college students overwhelmed by competing information.

Students today receive assignments, deadlines, internship opportunities, hackathons, notifications, tutorials, newsletters, social posts and endless new things to learn. The challenge isn't finding information. It's deciding what deserves attention.

SIGNAL takes these competing inputs and evaluates them against the student's goals, deadlines, workload, attention budget, relevance, urgency, impact, effort, reliability and opportunity cost. It then converts information overload into four actionable categories: NOW, NEXT, LATER and IGNORE.

What makes SIGNAL different is its attention-first philosophy. Search engines help people find information. Productivity tools help organize it. SIGNAL helps decide what deserves attention.

The AI behavior was developed iteratively through structured prompt engineering. We evolved from basic classification to context-aware prioritization, then introduced opportunity cost, FOMO detection, confidence, constraints, structured outputs and evaluation scenarios.

SIGNAL also keeps the human in control through explanations, confidence indicators, feedback and manual priority overrides.

The goal isn't to help students consume more information.

It's to help them focus on what actually matters.

SIGNAL. Less Noise. More Signal.`,
                "full-description"
              )}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 transition-colors"
            >
              {copiedSection === "full-description" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied Full Description!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-white" />
                  <span>Copy Complete Submission Text</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-mono border-zinc-800/80">
{`SIGNAL is an AI attention filter built for college students overwhelmed by competing information.

Students today receive assignments, deadlines, internship opportunities, hackathons, notifications, tutorials, newsletters, social posts and endless new things to learn. The challenge isn't finding information. It's deciding what deserves attention.

SIGNAL takes these competing inputs and evaluates them against the student's goals, deadlines, workload, attention budget, relevance, urgency, impact, effort, reliability and opportunity cost. It then converts information overload into four actionable categories: NOW, NEXT, LATER and IGNORE.

What makes SIGNAL different is its attention-first philosophy. Search engines help people find information. Productivity tools help organize it. SIGNAL helps decide what deserves attention.

The AI behavior was developed iteratively through structured prompt engineering. We evolved from basic classification to context-aware prioritization, then introduced opportunity cost, FOMO detection, confidence, constraints, structured outputs and evaluation scenarios.

SIGNAL also keeps the human in control through explanations, confidence indicators, feedback and manual priority overrides.

The goal isn't to help students consume more information.

It's to help them focus on what actually matters.

SIGNAL. Less Noise. More Signal.`}
          </div>

          {/* Quick Sub-Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {[
              {
                id: "title-pitch",
                title: "Project Title & Pitch",
                text: "SIGNAL 🧠 — Less Noise. More Signal.\n\n> SIGNAL is an AI attention filter that helps information-overloaded college students decide what actually deserves their attention."
              },
              {
                id: "target-person-sub",
                title: "The Specific Person",
                text: "College students balancing academics, career opportunities, projects and extracurricular activities."
              },
              {
                id: "differentiator-sub",
                title: "Primary Differentiator",
                text: "Search engines find information. Note apps store it. Productivity tools organize it. SIGNAL decides what actually deserves attention."
              },
              {
                id: "criteria-alignment-sub",
                title: "PromptForge Scorecard Alignment",
                text: "• Prompt Craft (40%): Master Prompt Specification (Role + Context + Constraints + Decision Framework + Output Contract) + V1→V4 evolution.\n• Time Efficiency (30%): Systematic 8-phase workflow (Discover → Define → Design → Prompt → Build → Test → Iterate → Polish).\n• Final Output (20%): Full-stack working app with Noise Inbox, Decision Mode, Attention Budget, & Lab.\n• Originality (10%): Attention-first paradigm, FOMO defense & Opportunity-cost reasoning."
              }
            ].map((box) => (
              <div key={box.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 font-mono">{box.title}</span>
                  <button
                    onClick={() => copyToClipboard(box.text, box.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] border border-zinc-800 transition-colors"
                  >
                    {copiedSection === box.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-zinc-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded bg-zinc-900/90 text-zinc-300 text-xs leading-relaxed font-mono whitespace-pre-line border border-zinc-800/60">
                  {box.text}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 17. FINAL CHECK BEFORE SUBMITTING (INTERACTIVE CHECKLIST) */}
        {/* ========================================================================= */}
        <section id="checklist" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
              VERIFICATION MATRIX
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
              FINAL CHECK BEFORE SUBMITTING
            </h2>
            <p className="text-xs text-zinc-400">Click to check/uncheck items during final pre-flight verification:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Product */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="font-bold text-indigo-300 font-mono">PRODUCT</div>
              <div className="space-y-1.5">
                {[
                  { id: "prod-1", text: "Live app works" },
                  { id: "prod-2", text: "Main demo works" },
                  { id: "prod-3", text: "Mobile works" },
                  { id: "prod-4", text: "No obvious errors" },
                  { id: "prod-5", text: "Judge Mode works" },
                  { id: "prod-6", text: "Story Mode works" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="w-full flex items-center gap-2 text-left hover:text-zinc-200 transition-colors"
                  >
                    {checkedItems[item.id] ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    )}
                    <span className={checkedItems[item.id] ? "text-zinc-300" : "text-zinc-500 line-through"}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Craft */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="font-bold text-indigo-300 font-mono">PROMPT CRAFT</div>
              <div className="space-y-1.5">
                {[
                  { id: "pc-1", text: "Initial prompt shown" },
                  { id: "pc-2", text: "Iterations shown (V1-V4)" },
                  { id: "pc-3", text: "Prompt architecture explained" },
                  { id: "pc-4", text: "Constraints explained" },
                  { id: "pc-5", text: "Evaluation shown" },
                  { id: "pc-6", text: "Human feedback shown" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="w-full flex items-center gap-2 text-left hover:text-zinc-200 transition-colors"
                  >
                    {checkedItems[item.id] ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    )}
                    <span className={checkedItems[item.id] ? "text-zinc-300" : "text-zinc-500 line-through"}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submission Pack */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="font-bold text-indigo-300 font-mono">SUBMISSION</div>
              <div className="space-y-1.5">
                {[
                  { id: "sub-1", text: "Project title" },
                  { id: "sub-2", text: "Description" },
                  { id: "sub-3", text: "Demo / video script" },
                  { id: "sub-4", text: "Screenshots" },
                  { id: "sub-5", text: "Live link" },
                  { id: "sub-6", text: "Repository link" },
                  { id: "sub-7", text: "AI tools mentioned" },
                  { id: "sub-8", text: "Important prompts included" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="w-full flex items-center gap-2 text-left hover:text-zinc-200 transition-colors"
                  >
                    {checkedItems[item.id] ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    )}
                    <span className={checkedItems[item.id] ? "text-zinc-300" : "text-zinc-500 line-through"}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Honest Claims */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="font-bold text-indigo-300 font-mono">HONEST CLAIMS</div>
              <div className="space-y-1.5">
                {[
                  { id: "claim-1", text: "No fabricated statistics" },
                  { id: "claim-2", text: "No fake user numbers" },
                  { id: "claim-3", text: "No unsupported accuracy claims" },
                  { id: "claim-4", text: "No '100% accurate AI'" },
                  { id: "claim-5", text: "No invented development time" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="w-full flex items-center gap-2 text-left hover:text-zinc-200 transition-colors"
                  >
                    {checkedItems[item.id] ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    )}
                    <span className={checkedItems[item.id] ? "text-zinc-300" : "text-zinc-500 line-through"}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 18. STRONGEST JUDGING STRATEGY SUMMARY */}
        {/* ========================================================================= */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-zinc-900 to-indigo-950/80 border border-indigo-700/60 shadow-2xl text-center space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
              CORE JUDGING STRATEGY
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-100">
              OUR FINAL STORY
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl mx-auto">
              Don't try to convince judges: <em>«"Look how many things SIGNAL can do."»</em><br />
              Instead convince them: <strong>«"We identified one specific problem, designed an AI system around it, engineered the prompt iteratively, tested its behavior, and turned the result into a usable product."»</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="font-mono text-indigo-400 font-bold text-[10px]">ONE PERSON</div>
              <div className="font-semibold text-zinc-200">College student</div>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="font-mono text-rose-400 font-bold text-[10px]">ONE PROBLEM</div>
              <div className="font-semibold text-zinc-200">Attention overload</div>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="font-mono text-indigo-400 font-bold text-[10px]">ONE IDEA</div>
              <div className="font-semibold text-zinc-200">AI attention filter</div>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="font-mono text-amber-400 font-bold text-[10px]">ONE SYSTEM</div>
              <div className="font-semibold text-zinc-200">Context + constraints</div>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="font-mono text-emerald-400 font-bold text-[10px]">ONE OUTPUT</div>
              <div className="font-semibold text-zinc-200">NOW · NEXT · LATER · IGNORE</div>
            </div>
            <div className="p-3.5 rounded-xl bg-indigo-900/60 border border-indigo-600 text-indigo-200 space-y-1">
              <div className="font-mono text-indigo-300 font-bold text-[10px]">ONE OUTCOME</div>
              <div className="font-bold text-emerald-300">Clearer attention</div>
            </div>
          </div>

          <div className="pt-2 text-center space-y-2">
            <div className="font-mono text-lg sm:text-2xl font-extrabold text-indigo-200 tracking-wider">
              SIGNAL 🧠 — LESS NOISE. MORE SIGNAL.
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
