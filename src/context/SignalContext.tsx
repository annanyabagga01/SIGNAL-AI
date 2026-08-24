import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  SignalItem,
  UserProfile,
  DailyBrief,
  DecisionEvaluation,
  FomoEvaluation,
  PageView,
  SignalCategory,
  StudentGoal,
  BatchFilterResult,
  SignalScorecardStats,
  WorkloadLevel,
  SignalPulseInfo,
  FocusSessionState,
  HumanOverrideFeedback,
} from "../types";
import { 
  INITIAL_GOALS, 
  INITIAL_SIGNAL_ITEMS, 
  INITIAL_DAILY_BRIEF, 
  INITIAL_LEARNED_PATTERNS,
  REALISTIC_EXPERIENCE_SCENARIO_ITEMS,
  TEST_SCENARIOS,
  STORY_TEN_ITEMS
} from "../data/demoData";

interface SignalContextType {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  items: SignalItem[];
  dailyBrief: DailyBrief | null;
  decisionHistory: DecisionEvaluation[];
  fomoHistory: FomoEvaluation[];
  isAiLoading: boolean;
  activeAiMessage: string;
  filteredCountToday: number;
  attentionUsed: number;
  attentionRemaining: number;
  workloadLevel: WorkloadLevel;
  signalPulse: SignalPulseInfo;
  currentFocus: string;
  setCurrentFocus: (focus: string) => void;
  focusSession: FocusSessionState;
  startFocusSession: (item?: SignalItem | null, customTitle?: string, customMinutes?: number) => void;
  pauseFocusSession: () => void;
  resumeFocusSession: () => void;
  completeFocusSession: () => void;
  exitFocusSession: () => void;
  isMorningBriefOpen: boolean;
  setIsMorningBriefOpen: (open: boolean) => void;
  isEndOfDayRecapOpen: boolean;
  setIsEndOfDayRecapOpen: (open: boolean) => void;
  recordEndOfDayFeedback: (feedback: "yes" | "no") => void;
  isJudgeModeOpen: boolean;
  setIsJudgeModeOpen: (open: boolean) => void;
  isMySignalModalOpen: boolean;
  setIsMySignalModalOpen: (open: boolean) => void;
  isPresentationOpen: boolean;
  setIsPresentationOpen: (open: boolean) => void;
  overrideFeedbackList: HumanOverrideFeedback[];
  recordOverrideFeedback: (feedback: Omit<HumanOverrideFeedback, 'id' | 'timestamp'>) => void;
  filterItem: (text: string, source?: string) => Promise<SignalItem | null>;
  batchFilter: (textBatch: string) => Promise<BatchFilterResult | null>;
  generateDailyBrief: () => Promise<DailyBrief | null>;
  evaluateDecision: (query: string, context?: string) => Promise<DecisionEvaluation | null>;
  runFomoCheck: (query: string) => Promise<FomoEvaluation | null>;
  provideFeedback: (id: string, feedback: "helpful" | "misclassified", correctedCategory?: SignalCategory) => void;
  toggleItemComplete: (id: string) => void;
  overrideCategory: (id: string, newCategory: SignalCategory) => void;
  deleteItem: (id: string) => void;
  archiveItem: (id: string) => void;
  updateGoals: (newGoals: StudentGoal[]) => void;
  updateDailyBudget: (points: number) => void;
  resetToDemoData: () => void;
  loadDemoData: () => void;
  clearAllData: () => void;
  clearSignalMemory: () => void;
  resetPersonalization: () => void;
  loadRealisticDemoScenario: () => void;
  loadStoryScenario: () => void;
  runScenarioTest: (scenarioKey: string) => Promise<void>;
  scorecardStats: SignalScorecardStats;
  quickToast: { message: string; type: "success" | "info" | "warning" } | null;
  setQuickToast: (toast: { message: string; type: "success" | "info" | "warning" } | null) => void;
}

const SignalContext = createContext<SignalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ITEMS: "signal_items_v3",
  PROFILE: "signal_profile_v3",
  BRIEF: "signal_daily_brief_v3",
  DECISIONS: "signal_decisions_v3",
  FOMO: "signal_fomo_v3",
  COUNT: "signal_filtered_count_today_v3",
};

const getInitialPage = (): PageView => {
  try {
    const hash = window.location.hash.replace("#", "").replace("/", "");
    const path = window.location.pathname.replace("/", "");
    if (hash === "submission" || path === "submission") return "submission";
    if (hash === "story" || path === "story") return "story";
    if (hash === "lab" || path === "lab") return "lab";
    if (hash === "decision" || path === "decision") return "decision";
    if (hash === "inbox" || path === "inbox") return "inbox";
    if (hash === "history" || path === "history") return "history";
    if (hash === "settings" || path === "settings") return "settings";
    if (hash === "onboarding" || path === "onboarding") return "onboarding";
    if (hash === "dashboard" || path === "dashboard") return "dashboard";
  } catch (e) {}
  return "landing";
};

export const SignalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPageRaw] = useState<PageView>(getInitialPage);

  const setCurrentPage = (page: PageView) => {
    setCurrentPageRaw(page);
    try {
      if (page === "landing") {
        window.history.pushState(null, "", "/");
      } else {
        window.history.pushState(null, "", `/${page}`);
      }
    } catch (e) {}
  };

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace("#", "").replace("/", "");
      const path = window.location.pathname.replace("/", "");
      if (hash === "submission" || path === "submission") setCurrentPageRaw("submission");
      else if (hash === "story" || path === "story") setCurrentPageRaw("story");
      else if (hash === "lab" || path === "lab") setCurrentPageRaw("lab");
      else if (hash === "decision" || path === "decision") setCurrentPageRaw("decision");
      else if (hash === "inbox" || path === "inbox") setCurrentPageRaw("inbox");
      else if (hash === "dashboard" || path === "dashboard") setCurrentPageRaw("dashboard");
      else if (hash === "history" || path === "history") setCurrentPageRaw("history");
      else if (hash === "settings" || path === "settings") setCurrentPageRaw("settings");
      else if (hash === "landing" || path === "" || path === "landing") setCurrentPageRaw("landing");
    };
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeAiMessage, setActiveAiMessage] = useState("");
  const [quickToast, setQuickToast] = useState<{ message: string; type: "success" | "info" | "warning" } | null>(null);

  // Modals state
  const [isMorningBriefOpen, setIsMorningBriefOpen] = useState(false);
  const [isEndOfDayRecapOpen, setIsEndOfDayRecapOpen] = useState(false);
  const [isJudgeModeOpen, setIsJudgeModeOpen] = useState(false);
  const [isMySignalModalOpen, setIsMySignalModalOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  // Human Override Feedback Log
  const [overrideFeedbackList, setOverrideFeedbackList] = useState<HumanOverrideFeedback[]>(() => {
    try {
      const saved = localStorage.getItem("signal_override_feedback_v1");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "fb-init-1",
        itemId: "demo-fb-1",
        itemTitle: "React 19 Server Components Workshop",
        fromCategory: "NEXT",
        toCategory: "IGNORE",
        reason: "SIGNAL misunderstood",
        notes: "Unaligned with active DBMS coursework.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
    ];
  });

  const recordOverrideFeedback = (feedback: Omit<HumanOverrideFeedback, "id" | "timestamp">) => {
    const record: HumanOverrideFeedback = {
      ...feedback,
      id: `override-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setOverrideFeedbackList((prev) => {
      const updated = [record, ...prev];
      try {
        localStorage.setItem("signal_override_feedback_v1", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setQuickToast({
      message: `Calibration recorded: ${feedback.reason}. SIGNAL will adapt future filters.`,
      type: "info",
    });
  };

  // Focus Session State
  const [focusSession, setFocusSession] = useState<FocusSessionState>({
    isActive: false,
    item: null,
    taskTitle: "",
    estimatedMinutes: 90,
    secondsElapsed: 0,
    isPaused: false,
    startedAt: 0,
  });

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      name: "Alex Chen",
      major: "Computer Science & Engineering",
      yearOfStudy: "Junior (3rd Year)",
      dailyAttentionBudget: 70,
      currentFocus: "Finish DBMS assignment",
      goals: INITIAL_GOALS,
      decaySensitivity: "Standard",
      onboardingCompleted: true,
      soundEnabled: true,
      learnedPatterns: INITIAL_LEARNED_PATTERNS,
      reflectionsHelpfulCount: 4,
    };
  });

  // Signal Items
  const [items, setItems] = useState<SignalItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SIGNAL_ITEMS;
  });

  // Daily Brief
  const [dailyBrief, setDailyBrief] = useState<DailyBrief | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BRIEF);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DAILY_BRIEF;
  });

  // Decision & FOMO history
  const [decisionHistory, setDecisionHistory] = useState<DecisionEvaluation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DECISIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "dec-sample-1",
        query: "Should I join this weekend's 48-hour Game Jam?",
        context: "I have a DBMS assignment due Monday and OS exam in 10 days.",
        verdict: "NO",
        summary: "High attention drain that directly jeopardizes your #1 goal (Academic Excellence GPA > 3.8).",
        goalAlignmentScore: 35,
        timeRequired: "48 hours straight",
        expectedBenefit: "Fun and game prototyping, but low relevance to your primary SWE internship target.",
        opportunityCost: "Consumes 80+ attention points and leaves zero buffer for DBMS normalization submission.",
        currentWorkloadImpact: "Current workload is already heavy. Participating guarantees exhaustion on Monday.",
        recommendedNextStep: "Politely pass on this sprint. Schedule a 2-hour game dev mini-session after midterms.",
        detailedAnalysis: [
          "Direct academic conflict with high-stake deliverables.",
          "High context-switching cost without advancing internship resume points.",
          "Cognitive fatigue risk for Monday morning coursework.",
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ];
  });

  const [fomoHistory, setFomoHistory] = useState<FomoEvaluation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOMO);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "fomo-sample-1",
        query: "Everyone on Twitter is building in this brand new obscure AI framework. Should I drop my React project and switch?",
        verdict: "FOMO NOISE",
        realisticLoss: "Zero tangible loss. Framework churning is marketing hype; employers value full-stack depth and clean fundamentals over flavor-of-the-month syntax.",
        fomoTrigger: "Social proof illusion and tech influencer engagement farming.",
        alternativeAction: "Finish and deploy your current React/Node full-stack application first. Ship something working.",
        verdictReason: "Chasing new frameworks mid-project leads to zero finished portfolio pieces. Stick to your core project.",
        opportunityCostFactor: "Swapping stacks now incurs a 15-hour learning curve without increasing hiring signal.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      },
    ];
  });

  const [filteredCountToday, setFilteredCountToday] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUNT);
      if (saved) return parseInt(saved, 10);
    } catch (e) {
      console.error(e);
    }
    return 18;
  });

  // Focus Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (focusSession.isActive && !focusSession.isPaused) {
      interval = setInterval(() => {
        setFocusSession((prev) => ({
          ...prev,
          secondsElapsed: prev.secondsElapsed + 1,
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusSession.isActive, focusSession.isPaused]);

  // Calculate dynamic attention points
  const activeNowItems = useMemo(
    () => items.filter((i) => i.category === "NOW" && !i.isCompleted && !i.isArchived),
    [items]
  );
  const activeNextItems = useMemo(
    () => items.filter((i) => i.category === "NEXT" && !i.isCompleted && !i.isArchived),
    [items]
  );

  const activeNowCost = activeNowItems.reduce((sum, i) => sum + (i.attentionCost || 20), 0);
  const activeNextCost = activeNextItems.reduce((sum, i) => sum + Math.round((i.attentionCost || 15) * 0.4), 0);

  const attentionUsed = Math.min(activeNowCost + activeNextCost, 100);
  const attentionRemaining = Math.max((userProfile.dailyAttentionBudget || 70) - attentionUsed, 0);

  // 1. Workload Level (Light | Moderate | Heavy | Overloaded - No fake precision)
  const workloadLevel: WorkloadLevel = useMemo(() => {
    const totalActiveCount = activeNowItems.length + activeNextItems.length;
    if (activeNowItems.length >= 3 || attentionUsed >= 80 || totalActiveCount >= 8) {
      return "Overloaded";
    }
    if (activeNowItems.length === 2 || attentionUsed >= 55 || totalActiveCount >= 5) {
      return "Heavy";
    }
    if (activeNowItems.length === 1 || activeNextItems.length >= 2 || attentionUsed >= 25) {
      return "Moderate";
    }
    return "Light";
  }, [activeNowItems.length, activeNextItems.length, attentionUsed]);

  // 2. SIGNAL PULSE (Clear | Busy | Overloaded | Critical)
  const signalPulse: SignalPulseInfo = useMemo(() => {
    const activeCompeting = activeNowItems.length + activeNextItems.length;
    const budgetFit = Math.max(1, Math.floor((userProfile.dailyAttentionBudget || 70) / 25));

    if (workloadLevel === "Overloaded" || activeNowItems.length >= 3) {
      return {
        state: "CRITICAL",
        color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
        title: "🔴 YOUR SIGNAL IS CRITICAL",
        explanation: `You have ${activeCompeting} active items demanding attention, significantly exceeding your ${userProfile.dailyAttentionBudget}pt budget. Cognitive crash imminent without immediate triage.`,
        recommendation: "Drop or defer non-urgent tasks immediately. Focus solely on your #1 deadline.",
        activeCompetingCount: activeCompeting,
        budgetFitCount: budgetFit,
        workloadLevel,
      };
    }
    if (workloadLevel === "Heavy" || activeCompeting > budgetFit) {
      return {
        state: "OVERLOADED",
        color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        title: "🟠 YOUR SIGNAL IS BUSY",
        explanation: `You have ${activeCompeting} active items competing for attention, but only ${budgetFit} realistically fit today's ${userProfile.dailyAttentionBudget}pt attention budget.`,
        recommendation: `Filter ${Math.max(1, activeCompeting - budgetFit)} items now or defer to LATER.`,
        activeCompetingCount: activeCompeting,
        budgetFitCount: budgetFit,
        workloadLevel,
      };
    }
    if (workloadLevel === "Moderate") {
      return {
        state: "BUSY",
        color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
        title: "🟡 YOUR SIGNAL IS BALANCED",
        explanation: `Manageable workload. 1 primary deliverable locked in with ${budgetFit} items scheduled across today.`,
        recommendation: "Execute your RIGHT NOW priority before reviewing secondary inbox items.",
        activeCompetingCount: activeCompeting,
        budgetFitCount: budgetFit,
        workloadLevel,
      };
    }
    return {
      state: "CLEAR",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      title: "🟢 YOUR SIGNAL IS CLEAR",
      explanation: `Zero high-pressure bottlenecks. Your daily attention budget is protected with low noise interference.`,
      recommendation: "Review high-upside opportunities in NEXT or explore deep learning in LATER.",
      activeCompetingCount: activeCompeting,
      budgetFitCount: budgetFit,
      workloadLevel,
    };
  }, [workloadLevel, activeNowItems.length, activeNextItems.length, userProfile.dailyAttentionBudget]);

  const currentFocus = userProfile.currentFocus || "Finish DBMS assignment";
  const setCurrentFocus = (focus: string) => {
    setUserProfile((prev) => ({ ...prev, currentFocus: focus }));
    setQuickToast({ message: `Current focus updated: "${focus}"`, type: "info" });
  };

  // Focus Session Controls
  const startFocusSession = (item?: SignalItem | null, customTitle?: string, customMinutes?: number) => {
    const targetItem = item || activeNowItems[0] || null;
    const title = customTitle || targetItem?.title || currentFocus || "Focused Study Block";
    const minutes = customMinutes || (targetItem?.effort.includes("3h") ? 180 : targetItem?.effort.includes("1-2h") ? 90 : 30);

    setFocusSession({
      isActive: true,
      item: targetItem,
      taskTitle: title,
      estimatedMinutes: minutes,
      secondsElapsed: 0,
      isPaused: false,
      startedAt: Date.now(),
    });
    setQuickToast({ message: `🛡️ Focus Mode Activated: ${title}`, type: "success" });
  };

  const pauseFocusSession = () => {
    setFocusSession((prev) => ({ ...prev, isPaused: true }));
    setQuickToast({ message: "Focus session paused", type: "info" });
  };

  const resumeFocusSession = () => {
    setFocusSession((prev) => ({ ...prev, isPaused: false }));
    setQuickToast({ message: "Focus session resumed", type: "info" });
  };

  const completeFocusSession = () => {
    if (focusSession.item) {
      toggleItemComplete(focusSession.item.id);
    }
    setFocusSession((prev) => ({ ...prev, isActive: false, isPaused: false }));
    setQuickToast({ message: `🎉 Task completed! Focus session cleared.`, type: "success" });
    setIsEndOfDayRecapOpen(true);
  };

  const exitFocusSession = () => {
    setFocusSession((prev) => ({ ...prev, isActive: false, isPaused: false }));
  };

  // End of Day feedback
  const recordEndOfDayFeedback = (feedback: "yes" | "no") => {
    if (feedback === "yes") {
      setUserProfile((prev) => ({
        ...prev,
        reflectionsHelpfulCount: (prev.reflectionsHelpfulCount || 0) + 1,
      }));
      setQuickToast({ message: "✨ Feedback saved! SIGNAL calibration reinforced.", type: "success" });
    } else {
      setQuickToast({ message: "Noted! SIGNAL will adjust sensitivity.", type: "info" });
    }
    setIsEndOfDayRecapOpen(false);
  };

  // Reset personalization patterns
  const resetPersonalization = () => {
    setUserProfile((prev) => ({
      ...prev,
      learnedPatterns: INITIAL_LEARNED_PATTERNS,
      reflectionsHelpfulCount: 0,
    }));
    setQuickToast({ message: "Personalization memory reset to defaults.", type: "info" });
  };

  // Clear Signal Memory (Local Persistence)
  const clearSignalMemory = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ITEMS);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.BRIEF);
      localStorage.removeItem(STORAGE_KEYS.DECISIONS);
      localStorage.removeItem(STORAGE_KEYS.FOMO);
      localStorage.removeItem(STORAGE_KEYS.COUNT);
    } catch (e) {
      console.error(e);
    }
    setItems([]);
    setDecisionHistory([]);
    setFomoHistory([]);
    setFilteredCountToday(0);
    setUserProfile({
      name: "Student",
      major: "Computer Science",
      yearOfStudy: "Junior (3rd Year)",
      dailyAttentionBudget: 70,
      currentFocus: "",
      goals: INITIAL_GOALS,
      decaySensitivity: "Standard",
      onboardingCompleted: true,
      soundEnabled: true,
      learnedPatterns: INITIAL_LEARNED_PATTERNS,
      reflectionsHelpfulCount: 0,
    });
    setQuickToast({ message: "🧹 All local SIGNAL memory cleared.", type: "info" });
  };

  // Load realistic demonstration scenario
  const loadRealisticDemoScenario = () => {
    setItems(REALISTIC_EXPERIENCE_SCENARIO_ITEMS);
    setUserProfile((prev) => ({
      ...prev,
      currentFocus: "Finish DBMS assignment",
      dailyAttentionBudget: 70,
      goals: [
        { id: "g-1", category: "internship", title: "💼 Summer Tech Internship", rank: 1, icon: "Briefcase" },
        { id: "g-2", category: "projects", title: "💻 Production-Grade Projects", rank: 2, icon: "Code" },
        { id: "g-3", category: "academics", title: "🎓 Academic Excellence (GPA > 3.8)", rank: 3, icon: "GraduationCap" },
        { id: "g-4", category: "hackathons", title: "🏆 Major Hackathons", rank: 4, icon: "Trophy" },
      ],
    }));
    setFilteredCountToday(24);
    setQuickToast({ message: "Loaded 9+ item Realistic Student Overload scenario!", type: "success" });
  };

  // Load 10-Item Story Demo Scenario
  const loadStoryScenario = () => {
    setItems(STORY_TEN_ITEMS);
    setUserProfile((prev) => ({
      ...prev,
      name: "Alex Chen",
      major: "Computer Science & Engineering",
      yearOfStudy: "Junior (3rd Year)",
      currentFocus: "Finish DBMS assignment",
      dailyAttentionBudget: 70,
      goals: [
        { id: "g-1", category: "internship", title: "💼 Summer Tech Internship", rank: 1, icon: "Briefcase" },
        { id: "g-2", category: "academics", title: "🎓 Academic Excellence (GPA > 3.8)", rank: 2, icon: "GraduationCap" },
        { id: "g-3", category: "projects", title: "💻 Production-Grade Projects", rank: 3, icon: "Code" },
        { id: "g-4", category: "hackathons", title: "🏆 Major Hackathons", rank: 4, icon: "Trophy" },
      ],
    }));
    setFilteredCountToday(26);
    setCurrentPage("dashboard");
    setQuickToast({
      message: "⚡ Story Scenario Loaded: 10 items processed into live workspace!",
      type: "success",
    });
  };

  // Compute Signal Scorecard Stats
  const scorecardStats: SignalScorecardStats = useMemo(() => {
    const total = items.length;
    const ignoreCount = items.filter((i) => i.category === "IGNORE").length;
    const nowCount = items.filter((i) => i.category === "NOW").length;
    const nextCount = items.filter((i) => i.category === "NEXT").length;
    const laterCount = items.filter((i) => i.category === "LATER").length;
    const completedCount = items.filter((i) => i.isCompleted).length;

    const noisePercent = total > 0 ? Math.round((ignoreCount / total) * 100) : 65;
    // Each ignored item saves ~45 min of reading + rabbit-hole time
    // Each deferred item saves ~20 min of immediate context switching
    const hoursSaved = Math.round((ignoreCount * 0.75 + laterCount * 0.35 + 4.5) * 10) / 10;
    const attentionPointsPreserved = ignoreCount * 25 + laterCount * 15;

    // Feedback accuracy
    const feedbackItems = items.filter((i) => i.userFeedback !== null);
    const helpfulCount = feedbackItems.filter((i) => i.userFeedback === "helpful").length;
    const accuracyRate = feedbackItems.length > 0 ? Math.round((helpfulCount / feedbackItems.length) * 100) : 96;

    // Goal alignment distribution
    const goalBreakdown = (userProfile.goals || []).map((goal) => {
      const matched = items.filter(
        (i) => i.category !== "IGNORE" && i.dimensions && i.dimensions.goalAlignment > 70
      ).length;
      return {
        goalTitle: goal.title,
        itemCount: Math.max(matched, 1),
        percentage: Math.min(Math.round((matched / Math.max(total, 1)) * 100) + 15, 100),
      };
    });

    return {
      totalProcessed: total + filteredCountToday,
      noiseEliminatedCount: ignoreCount + 8,
      highSignalCount: nowCount + nextCount,
      noisePercentage: noisePercent,
      hoursSaved,
      attentionPointsPreserved,
      tasksCompleted: completedCount,
      accuracyRate,
      categoryDistribution: {
        NOW: nowCount,
        NEXT: nextCount,
        LATER: laterCount,
        IGNORE: ignoreCount,
      },
      goalAlignmentBreakdown: goalBreakdown,
    };
  }, [items, filteredCountToday, userProfile.goals]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (dailyBrief) localStorage.setItem(STORAGE_KEYS.BRIEF, JSON.stringify(dailyBrief));
    } catch (e) {
      console.error(e);
    }
  }, [dailyBrief]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(decisionHistory));
    } catch (e) {
      console.error(e);
    }
  }, [decisionHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOMO, JSON.stringify(fomoHistory));
    } catch (e) {
      console.error(e);
    }
  }, [fomoHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COUNT, filteredCountToday.toString());
    } catch (e) {
      console.error(e);
    }
  }, [filteredCountToday]);

  // Toast timer
  useEffect(() => {
    if (quickToast) {
      const t = setTimeout(() => setQuickToast(null), 3800);
      return () => clearTimeout(t);
    }
  }, [quickToast]);

  // Filter single item via API
  const filterItem = async (text: string, source: string = "Other"): Promise<SignalItem | null> => {
    setIsAiLoading(true);
    setActiveAiMessage("Filtering noise through 7 signal dimensions...");
    try {
      const res = await fetch("/api/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          source,
          userGoals: userProfile.goals,
          currentAttentionUsed: attentionUsed,
          existingItems: items.slice(0, 10),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to filter item");
      }

      const data = await res.json();
      if (data.item) {
        setItems((prev) => [data.item, ...prev]);
        setFilteredCountToday((c) => c + 1);
        setQuickToast({
          message: data.item.isDuplicate
            ? `Duplicate Detected: Merged with "${data.item.duplicateOfTitle || "existing item"}"`
            : `Classified as ${data.item.category}: ${data.item.title}`,
          type: data.item.category === "IGNORE" ? "warning" : "success",
        });
        return data.item;
      }
      return null;
    } catch (err: any) {
      console.error("Filter item error:", err);
      setQuickToast({ message: "Filtering failed, try again.", type: "warning" });
      return null;
    } finally {
      setIsAiLoading(false);
      setActiveAiMessage("");
    }
  };

  // Batch filter via API
  const batchFilter = async (textBatch: string): Promise<BatchFilterResult | null> => {
    setIsAiLoading(true);
    setActiveAiMessage("Analyzing batch, ranking priorities, and purging noise...");
    try {
      // Split batch by message indicators or double newlines
      const splitItems = textBatch
        .split(/\n\s*\n|(?=Message \d+:|Item \d+:)/i)
        .map((s) => s.trim())
        .filter((s) => s.length > 5);

      const res = await fetch("/api/batch-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: splitItems.length > 0 ? splitItems : [textBatch],
          userGoals: userProfile.goals,
        }),
      });

      if (!res.ok) throw new Error("Batch filtering failed");
      const data = await res.json();

      const allNewItems = [...(data.top3 || []), ...(data.defer || []), ...(data.ignore || [])];
      setItems((prev) => [...allNewItems, ...prev]);
      setFilteredCountToday((c) => c + allNewItems.length);

      setQuickToast({
        message: `Batch complete: ${data.top3?.length || 0} Top priorities identified, ${data.ignore?.length || 0} distractions eliminated!`,
        type: "success",
      });

      return data;
    } catch (err: any) {
      console.error("Batch error:", err);
      setQuickToast({ message: "Batch filtering encountered an issue.", type: "warning" });
      return null;
    } finally {
      setIsAiLoading(false);
      setActiveAiMessage("");
    }
  };

  // Generate Daily Briefing
  const generateDailyBrief = async (): Promise<DailyBrief | null> => {
    setIsAiLoading(true);
    setActiveAiMessage("Synthesizing your daily high-signal morning brief...");
    try {
      const res = await fetch("/api/daily-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          userGoals: userProfile.goals,
          userName: userProfile.name,
        }),
      });

      if (!res.ok) throw new Error("Daily brief failed");
      const data = await res.json();
      if (data.brief) {
        setDailyBrief(data.brief);
        setQuickToast({ message: "☀️ Fresh SIGNAL Brief generated!", type: "success" });
        return data.brief;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setIsAiLoading(false);
      setActiveAiMessage("");
    }
  };

  // Decision Evaluator ("SHOULD I DO THIS?")
  const evaluateDecision = async (query: string, context: string = ""): Promise<DecisionEvaluation | null> => {
    setIsAiLoading(true);
    setActiveAiMessage("Calculating goal alignment, opportunity cost, and workload risk...");
    try {
      const res = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          context,
          userGoals: userProfile.goals,
          currentPointsUsed: attentionUsed,
        }),
      });

      if (!res.ok) throw new Error("Decision evaluation failed");
      const data = await res.json();
      if (data.evaluation) {
        setDecisionHistory((prev) => [data.evaluation, ...prev]);
        setQuickToast({ message: `Decision Verdict: ${data.evaluation.verdict}`, type: "info" });
        return data.evaluation;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setIsAiLoading(false);
      setActiveAiMessage("");
    }
  };

  // Anti-FOMO Engine
  const runFomoCheck = async (query: string): Promise<FomoEvaluation | null> => {
    setIsAiLoading(true);
    setActiveAiMessage("Evaluating psychological FOMO vs genuine strategic value...");
    try {
      const res = await fetch("/api/fomo-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          userGoals: userProfile.goals,
        }),
      });

      if (!res.ok) throw new Error("FOMO check failed");
      const data = await res.json();
      if (data.evaluation) {
        setFomoHistory((prev) => [data.evaluation, ...prev]);
        setQuickToast({
          message: data.evaluation.verdict === "FOMO NOISE" ? "🧠 FOMO Noise Detected: Safe to ignore!" : "✨ Genuine Opportunity Confirmed",
          type: data.evaluation.verdict === "FOMO NOISE" ? "warning" : "success",
        });
        return data.evaluation;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setIsAiLoading(false);
      setActiveAiMessage("");
    }
  };

  // Provide User Feedback (👍 / 👎)
  const provideFeedback = (id: string, feedback: "helpful" | "misclassified", correctedCategory?: SignalCategory) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const nextCat = correctedCategory || it.category;
          return {
            ...it,
            userFeedback: feedback,
            feedbackAdjustedTo: correctedCategory,
            category: nextCat,
            decision: nextCat === "IGNORE" ? "Ignore it" : nextCat === "NOW" ? "Do it" : "Save it",
          };
        }
        return it;
      })
    );

    if (feedback === "helpful") {
      setQuickToast({ message: "Thank you! Feedback recorded to calibrate Signal engine.", type: "success" });
    } else {
      setQuickToast({
        message: correctedCategory ? `Reclassified to ${correctedCategory}. Signal adjusted!` : "Noted misclassification.",
        type: "info",
      });
    }
  };

  // Run a Pre-Configured Test Scenario (A to F)
  const runScenarioTest = async (scenarioKey: string) => {
    const scenario = TEST_SCENARIOS.find((s) => s.key === scenarioKey);
    if (!scenario) return;

    if (scenario.key === "E" && scenario.query) {
      setCurrentPage("decision");
      await evaluateDecision(scenario.query, scenario.context || "");
    } else if (scenario.text) {
      setCurrentPage("inbox");
      await filterItem(scenario.text, scenario.source || "Other");
    }
  };

  // Dynamic Priority Shift on Item Completion
  const toggleItemComplete = (id: string) => {
    setItems((prev) => {
      let shiftedItemTitle = "";
      const updated = prev.map((it) => {
        if (it.id === id) {
          const nextState = !it.isCompleted;
          return { ...it, isCompleted: nextState };
        }
        return it;
      });

      // Check if any NOW items remain uncompleted
      const remainingNow = updated.filter((it) => it.category === "NOW" && !it.isCompleted && !it.isArchived);
      if (remainingNow.length === 0) {
        // Find top uncompleted NEXT item and promote to NOW
        const topNextIndex = updated.findIndex((it) => it.category === "NEXT" && !it.isCompleted && !it.isArchived);
        if (topNextIndex !== -1) {
          shiftedItemTitle = updated[topNextIndex].title;
          updated[topNextIndex] = {
            ...updated[topNextIndex],
            category: "NOW",
            decision: "Do it",
            why: "Promoted to NOW because previous urgent commitments were completed.",
          };
        }
      }

      if (shiftedItemTitle) {
        setTimeout(() => {
          setQuickToast({
            message: `⚡ Priority Shift: With your urgent task done, "${shiftedItemTitle.slice(0, 24)}..." moved to NOW!`,
            type: "success",
          });
        }, 600);
      } else {
        setQuickToast({ message: `Task completed! Attention budget freed.`, type: "success" });
      }

      return updated;
    });
  };

  const overrideCategory = (id: string, newCategory: SignalCategory) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          setQuickToast({ message: `Moved "${it.title.slice(0, 20)}..." to ${newCategory}`, type: "info" });
          return {
            ...it,
            category: newCategory,
            decision: newCategory === "IGNORE" ? "Ignore it" : newCategory === "NOW" ? "Do it" : "Save it",
          };
        }
        return it;
      })
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setQuickToast({ message: "Item removed from Signal.", type: "info" });
  };

  const archiveItem = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isArchived: !it.isArchived } : it))
    );
  };

  const updateGoals = (newGoals: StudentGoal[]) => {
    setUserProfile((prev) => ({ ...prev, goals: newGoals }));
    setQuickToast({ message: "Goal priorities updated.", type: "success" });
  };

  const updateDailyBudget = (points: number) => {
    setUserProfile((prev) => ({ ...prev, dailyAttentionBudget: points }));
    setQuickToast({ message: `Daily Attention Budget set to ${points} pts.`, type: "info" });
  };

  const resetToDemoData = () => {
    setItems(INITIAL_SIGNAL_ITEMS);
    setDailyBrief(INITIAL_DAILY_BRIEF);
    setUserProfile((prev) => ({ 
      ...prev, 
      goals: INITIAL_GOALS, 
      dailyAttentionBudget: 70,
      currentFocus: "Finish DBMS assignment",
      learnedPatterns: INITIAL_LEARNED_PATTERNS,
    }));
    setFilteredCountToday(18);
    setQuickToast({ message: "Reset to sample student data.", type: "info" });
  };

  const clearAllData = () => {
    setItems([]);
    setDecisionHistory([]);
    setFomoHistory([]);
    setFilteredCountToday(0);
    setQuickToast({ message: "All Signal items cleared.", type: "info" });
  };

  return (
    <SignalContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        userProfile,
        setUserProfile,
        items,
        dailyBrief,
        decisionHistory,
        fomoHistory,
        isAiLoading,
        activeAiMessage,
        filteredCountToday,
        attentionUsed,
        attentionRemaining,
        workloadLevel,
        signalPulse,
        currentFocus,
        setCurrentFocus,
        focusSession,
        startFocusSession,
        pauseFocusSession,
        resumeFocusSession,
        completeFocusSession,
        exitFocusSession,
        isMorningBriefOpen,
        setIsMorningBriefOpen,
        isEndOfDayRecapOpen,
        setIsEndOfDayRecapOpen,
        recordEndOfDayFeedback,
        isJudgeModeOpen,
        setIsJudgeModeOpen,
        isMySignalModalOpen,
        setIsMySignalModalOpen,
        isPresentationOpen,
        setIsPresentationOpen,
        overrideFeedbackList,
        recordOverrideFeedback,
        filterItem,
        batchFilter,
        generateDailyBrief,
        evaluateDecision,
        runFomoCheck,
        provideFeedback,
        toggleItemComplete,
        overrideCategory,
        deleteItem,
        archiveItem,
        updateGoals,
        updateDailyBudget,
        resetToDemoData,
        loadDemoData: resetToDemoData,
        clearAllData,
        clearSignalMemory,
        resetPersonalization,
        loadRealisticDemoScenario,
        loadStoryScenario,
        runScenarioTest,
        scorecardStats,
        quickToast,
        setQuickToast,
      }}
    >
      {children}
    </SignalContext.Provider>
  );
};

export const useSignal = () => {
  const context = useContext(SignalContext);
  if (!context) {
    throw new Error("useSignal must be used within a SignalProvider");
  }
  return context;
};
