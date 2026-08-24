export type SignalCategory = 'NOW' | 'NEXT' | 'LATER' | 'IGNORE';
export type ImpactLevel = 'High' | 'Medium' | 'Low';
export type EffortLevel = 'Low (<30m)' | 'Medium (1-2h)' | 'High (3h+)';
export type DecisionType = 'Do it' | 'Save it' | 'Ignore it';
export type DecayStatus = 'Fresh' | 'Active' | 'Decaying' | 'Stale' | 'Expired';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type WorkloadLevel = 'Light' | 'Moderate' | 'Heavy' | 'Overloaded';
export type SignalPulseState = 'CLEAR' | 'BUSY' | 'OVERLOADED' | 'CRITICAL';

export type GoalCategory = 
  | 'academics' 
  | 'internship' 
  | 'projects' 
  | 'hackathons' 
  | 'skills' 
  | 'freelancing' 
  | 'startup' 
  | 'exams' 
  | 'other';

export interface StudentGoal {
  id: string;
  category: GoalCategory;
  title: string;
  rank: number; // 1 = highest priority
  description?: string;
  icon: string;
}

export interface SignalDimensions {
  relevance: number; // 0-100
  urgency: number; // 0-100
  impact: number; // 0-100
  effort: number; // 0-100
  opportunityValue: number; // 0-100
  reliability: number; // 0-100
  goalAlignment: number; // 0-100
}

export interface SignalItem {
  id: string;
  title: string;
  rawContent: string;
  source: 'WhatsApp' | 'Telegram' | 'Email' | 'College Announcement' | 'Internship Portal' | 'Hackathon' | 'LinkedIn' | 'GitHub' | 'YouTube/Course' | 'Other';
  category: SignalCategory;
  decision: DecisionType;
  why: string;
  action: string;
  deadline?: string;
  daysRemaining?: number;
  effort: string;
  impact: ImpactLevel;
  attentionCost: number; // 5 to 40 points
  dimensions: SignalDimensions;
  aiReasoning: string;
  whyDidSignalChooseThis: string;
  opportunityCost?: string;
  confidence?: ConfidenceLevel;
  confidenceScore?: number; // 0-100
  isDuplicate?: boolean;
  duplicateOfTitle?: string;
  workloadContextReason?: string;
  userFeedback?: 'helpful' | 'misclassified' | null;
  feedbackAdjustedTo?: SignalCategory;
  isCompleted: boolean;
  isArchived: boolean;
  isSampleData: boolean;
  createdAt: string; // ISO string
  decayScore: number; // 0 (expired) to 100 (super fresh)
  decayStatus: DecayStatus;
}

export interface BatchFilterInputItem {
  id: string;
  text: string;
  sourceHint?: string;
}

export interface BatchFilterResult {
  top3: SignalItem[];
  defer: SignalItem[];
  ignore: SignalItem[];
  overallSummary: string;
  attentionSavedMinutes: number;
}

export interface DailyBrief {
  id: string;
  date: string;
  greeting: string;
  mustDo: { title: string; reason: string; effort: string }[];
  shouldDo: { title: string; reason: string; effort: string }[];
  ignoreList: { title: string; reason: string }[];
  oneThingToAvoid: string;
  goldenRule: string;
  generatedAt: string;
}

export interface DecisionEvaluation {
  id: string;
  query: string;
  context?: string;
  verdict: 'YES' | 'MAYBE' | 'NO';
  summary: string;
  goalAlignmentScore: number;
  timeRequired: string;
  expectedBenefit: string;
  opportunityCost: string;
  currentWorkloadImpact: string;
  recommendedNextStep: string;
  detailedAnalysis: string[];
  createdAt: string;
}

export interface FomoEvaluation {
  id: string;
  query: string;
  verdict: 'REAL OPPORTUNITY' | 'FOMO NOISE';
  realisticLoss: string;
  fomoTrigger: string;
  alternativeAction: string;
  verdictReason: string;
  opportunityCostFactor: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  major: string;
  yearOfStudy: string;
  dailyAttentionBudget: number; // default 70 or 100 points
  currentFocus: string; // e.g. "Finish DBMS assignment"
  filterAggressiveness?: 'permissive' | 'balanced' | 'aggressive';
  goals: StudentGoal[];
  decaySensitivity: 'Gentle' | 'Standard' | 'Aggressive';
  onboardingCompleted: boolean;
  soundEnabled: boolean;
  learnedPatterns?: string[];
  reflectionsHelpfulCount?: number;
}

export interface SignalPulseInfo {
  state: SignalPulseState;
  color: string;
  title: string;
  explanation: string;
  recommendation: string;
  activeCompetingCount: number;
  budgetFitCount: number;
  workloadLevel: WorkloadLevel;
}

export interface FocusSessionState {
  isActive: boolean;
  item: SignalItem | null;
  taskTitle: string;
  estimatedMinutes: number;
  secondsElapsed: number;
  isPaused: boolean;
  startedAt: number;
}

export interface EndOfDayRecap {
  id: string;
  date: string;
  completedItems: SignalItem[];
  ignoredCount: number;
  missedItems: SignalItem[];
  estimatedHoursSaved: number;
  estimatedAttentionSaved: number;
  userFeedback?: 'yes' | 'no' | null;
}

export interface SignalScorecardStats {
  totalProcessed: number;
  noiseEliminatedCount: number;
  highSignalCount: number;
  noisePercentage: number;
  hoursSaved: number;
  attentionPointsPreserved: number;
  tasksCompleted: number;
  accuracyRate: number;
  categoryDistribution: Record<SignalCategory, number>;
  goalAlignmentBreakdown: { goalTitle: string; itemCount: number; percentage: number }[];
}

export type PageView = 
  | 'landing' 
  | 'onboarding' 
  | 'dashboard' 
  | 'inbox' 
  | 'decision' 
  | 'history' 
  | 'settings'
  | 'lab'
  | 'story'
  | 'submission';

export interface TestCase {
  id: string;
  testNumber: string;
  name: string;
  description: string;
  input: string;
  sourceHint?: string;
  expectedCriteria: {
    deadline: string;
    goalAlignment: string;
    impact: string;
    effort: string;
    opportunityCost: string;
    expectedCategory: SignalCategory;
  };
  actualResult: {
    category: SignalCategory;
    decision: DecisionType;
    why: string;
    action: string;
    attentionCost: number;
    dimensions: SignalDimensions;
  };
  status: 'PASS' | 'NEEDS REVIEW';
  evalScores: {
    relevance: number; // 0-100
    urgency: number;
    actionability: number;
    attentionEfficiency: number;
    explanationClarity: number;
  };
}

export interface HumanOverrideFeedback {
  id: string;
  itemId: string;
  itemTitle: string;
  fromCategory: SignalCategory;
  toCategory: SignalCategory;
  reason: 'More important to me' | 'Deadline changed' | 'Goal changed' | 'SIGNAL misunderstood' | 'Personal preference' | 'Other';
  notes?: string;
  timestamp: string;
}

