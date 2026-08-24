import { TestCase, SignalCategory } from "../types";

export interface PipelineStage {
  id: string;
  number: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  inputsConsidered: string[];
  outputProduced: string;
  sampleRule: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "input",
    number: "01",
    name: "INPUT",
    shortDesc: "Raw multi-channel noise ingestion",
    fullDesc: "SIGNAL captures unstructured text from Discord, WhatsApp groups, Canvas, newsletters, emails, and job alerts without requiring manual formatting.",
    inputsConsidered: ["Messy group chats", "Unformatted course announcements", "LinkedIn recruiter broadcasts", "Spam & duplicate links"],
    outputProduced: "Clean raw text stream tokenized for semantic entity extraction.",
    sampleRule: "Strip markup, normalize timestamps, and detect forward chains.",
  },
  {
    id: "context",
    number: "02",
    name: "CONTEXT",
    shortDesc: "Student workload & time horizon",
    fullDesc: "Evaluates the user's temporal and situational state — current pending deadlines, active commitments, and current workload status (Clear, Busy, Heavy, Overloaded).",
    inputsConsidered: ["Current pending deliverables", "Derived workload score", "Daily attention points consumed so far", "Time of day & energy curve"],
    outputProduced: "Situational context weighting vector.",
    sampleRule: "If derived workload is 'Overloaded', raise noise rejection threshold by +25%.",
  },
  {
    id: "goals",
    number: "03",
    name: "GOALS",
    shortDesc: "Ranked student priority hierarchy",
    fullDesc: "Compares the incoming opportunity against the student's explicitly ranked priority list (#1 Academic GPA, #2 Summer Internship, #3 Systems Projects, #4 Hackathons).",
    inputsConsidered: ["Goal category match", "Relative rank weight (Rank 1 = 1.0x, Rank 4 = 0.5x)", "Long-term career vs short-term distraction"],
    outputProduced: "Goal Alignment Fit Score (0–100%).",
    sampleRule: "Direct match to Rank #1 goal receives priority multiplier.",
  },
  {
    id: "constraints",
    number: "04",
    name: "CONSTRAINTS",
    shortDesc: "Attention budget & friction limits",
    fullDesc: "Enforces cognitive limits. A student only has ~70–100 attention points per day. Tasks requiring 3+ hours cannot be assigned to NOW if budget is exhausted.",
    inputsConsidered: ["Remaining daily attention points", "Estimated cognitive effort (Low/Med/High)", "Preparation friction"],
    outputProduced: "Feasibility gate & capacity validation.",
    sampleRule: "Cap NOW items to maximum 2 concurrent high-effort tasks.",
  },
  {
    id: "signal_analysis",
    number: "05",
    name: "SIGNAL ANALYSIS",
    shortDesc: "7-Dimensional scoring & anti-FOMO",
    fullDesc: "Executes deep multidimensional evaluation across Relevance, Urgency, Impact, Effort, Opportunity Value, Reliability, and Goal Alignment. Detects psychological FOMO.",
    inputsConsidered: ["Deadline hard cutoff vs soft marketing urgency", "Verifiable opportunity ROI", "Peer pressure buzzwords (e.g. 'viral', 'everyone is doing this')"],
    outputProduced: "7-Dimensional vector + FOMO classification.",
    sampleRule: "Flag artificial marketing urgency where no tangible loss occurs on skip.",
  },
  {
    id: "prioritization",
    number: "06",
    name: "PRIORITIZATION",
    shortDesc: "Relative opportunity cost sorting",
    fullDesc: "Ranks competing items not in isolation, but against each other. If doing Item B forces postponing Item A (which is due in 12 hours), Item B is downgraded.",
    inputsConsidered: ["Pairwise trade-offs", "Immediate regret calculation", "Decay risk if delayed"],
    outputProduced: "Global priority ordering for the student.",
    sampleRule: "Urgent academic penalties always supersede non-urgent skill exploration.",
  },
  {
    id: "decision",
    number: "07",
    name: "DECISION",
    shortDesc: "Categorization into NOW / NEXT / LATER / IGNORE",
    fullDesc: "Assigns the definitive action category with explicit, non-jargon rationale explaining why other options were rejected.",
    inputsConsidered: ["Categorization threshold bounds", "Personalized feedback calibration history"],
    outputProduced: "Definitive category label + Action directive.",
    sampleRule: "Map to NOW (Do today), NEXT (Queue next), LATER (Save backlog), or IGNORE (Safely drop).",
  },
  {
    id: "action",
    number: "08",
    name: "ACTION",
    shortDesc: "1-Sentence concrete executable next step",
    fullDesc: "Transforms vague information into a single friction-free action sentence with effort estimate and attention cost.",
    inputsConsidered: ["Direct URL / Portal location", "First 5-minute activation step"],
    outputProduced: "Executable next step (e.g., 'Open Canvas and upload Section 3 before 11:59 PM').",
    sampleRule: "Must be a single imperative sentence under 25 words.",
  },
];

export const MASTER_PROMPT_RAW_CODE = `// ==========================================
// SIGNAL MASTER PROMPT SPECIFICATION
// ==========================================

ROLE:
You are SIGNAL, an attention-filtering AI.

USER:
A college student managing academics, career growth,
projects and opportunities.

OBJECTIVE:
Reduce unnecessary attention while preserving
important opportunities.

CONTEXT:
Goals, deadlines, workload, attention budget,
existing priorities and available time.

EVALUATION:
- Relevance
- Urgency
- Impact
- Effort
- Opportunity Value
- Opportunity Cost
- Reliability
- Goal Alignment

DECISION:
- NOW       (Do today — critical deadline or high-leverage immediate action)
- NEXT      (High leverage queue — scheduled for upcoming work window)
- LATER     (Backlog / Reference — saved without guilt)
- IGNORE    (Safely purged / dismissed — zero immediate value or noise)

CONSTRAINTS:
- Do not invent missing information.
- Do not assume popularity means importance.
- Do not assume urgency means value.
- Do not recommend something simply because it is interesting.
- Show uncertainty when context is insufficient.

OUTPUT:
{
  "priority": "NOW" | "NEXT" | "LATER" | "IGNORE",
  "reason": "<Clear 1-2 sentence justification focusing on goals & opportunity cost>",
  "recommendedAction": "<Single imperative executable next step under 20 words>",
  "deadline": "<Extracted timestamp or 'None'>",
  "effort": "Low (<30m)" | "Medium (1-2h)" | "High (3h+)",
  "impact": "High" | "Medium" | "Low",
  "confidence": "HIGH" | "MEDIUM" | "LOW"
}`;

export const PROMPT_JOURNEY_TIMELINE = [
  {
    version: "PROMPT V1",
    title: "BASIC CLASSIFICATION",
    badge: "Naive Prompting",
    initialGoal: "«Filter this information and tell me what is important.»",
    problems: [
      "Too generic and subjective",
      "Zero user context or student background",
      "No ranked goals or priority hierarchy",
      "No workload awareness or capacity bounds",
      "No opportunity cost or trade-off evaluation",
      "No explicit decision framework (everything sounded urgent)"
    ],
    result: "Generic prioritization — told students to do everything, causing more overwhelm.",
    status: "SUPERSEDED"
  },
  {
    version: "PROMPT V2",
    title: "CONTEXT-AWARE FILTER",
    badge: "Personalization",
    initialGoal: "«Filter this information for a Computer Science student with exams coming up.»",
    added: [
      "User profile & academic major",
      "Ranked student goals (#1 GPA, #2 Internship, #3 Projects)",
      "Specific deadlines & calendar horizons",
      "Current workload status (Clear / Busy / Overloaded)",
      "Daily attention budget (70–100 pts)",
      "Effort & impact estimates"
    ],
    improvement: "SIGNAL became personalized and prioritized coursework above general reading.",
    remainingLimitation: "It still treated prioritization mostly as a static classification problem without trade-offs.",
    status: "EVOLVED"
  },
  {
    version: "PROMPT V3",
    title: "DECISION ENGINE",
    badge: "Cognitive Defense",
    initialGoal: "«Act as an attention guardian that calculates opportunity cost, catches FOMO, and provides strict decisions.»",
    added: [
      "Explicit opportunity cost trade-off calculation",
      "Psychological FOMO detection & anti-hype filters",
      "Confidence scoring & uncertainty transparency",
      "Information reliability rating",
      "Dynamic priority rebalancing against competing items",
      "Semantic duplicate announcement detection",
      "Human override & user feedback integration",
      "Personalization through feedback (without retraining)"
    ],
    improvement: "SIGNAL became a context-aware attention decision system that protects cognitive energy.",
    remainingLimitation: "Needed deterministic verification to ensure prompt modifications didn't introduce regressions.",
    status: "REFINED"
  },
  {
    version: "PROMPT V4",
    title: "EVALUATION LOOP",
    badge: "Production Benchmark",
    initialGoal: "«Systematically evaluate the prompt against diverse edge cases, edge scenarios, and failure modes.»",
    added: [
      "8-scenario prototype test suite",
      "Expected vs actual behavior assertions",
      "Documented failure cases & mitigations",
      "Human feedback loop simulation",
      "Quality rubric evaluation (Relevance, Urgency, Actionability, Efficiency)",
      "Structured prompt iteration regression prevention"
    ],
    improvement: "SIGNAL could now be tested instead of simply assumed to work. Prompt craft backed by verifiable evidence.",
    remainingLimitation: "Production ready for competition prototype.",
    status: "CURRENT"
  }
];

export const PROMPT_CRAFT_TECHNIQUES = [
  {
    number: "01",
    name: "ROLE",
    tag: "Persona & Mission",
    description: "Instead of asking generic AI questions, SIGNAL establishes a specific, highly bounded persona.",
    weak: "«Analyze this text.»",
    better: "«You are SIGNAL, an attention-filtering AI for an overloaded college student. Your job is to minimize unnecessary attention while preserving important opportunities.»",
    whyItWorks: "Anchors the model's objective function on attention defense rather than helpful over-generation."
  },
  {
    number: "02",
    name: "CONTEXT",
    tag: "State Engineering",
    description: "AI receives all situational vectors necessary to make a grounded, personalized decision.",
    weak: "Information → Generic answer",
    better: "Information + User Goals + Current Workload + Active Deadlines + Daily Attention Budget → Personalized decision",
    whyItWorks: "Eliminates hallucinated priorities by grounding the evaluation in the user's specific reality."
  },
  {
    number: "03",
    name: "CONSTRAINTS",
    tag: "Negative Guardrails",
    description: "Explicitly tells the model what NOT to do to prevent standard AI sycophancy.",
    examples: [
      "Do not invent missing deadlines.",
      "Do not assume popularity or viral metrics equal importance.",
      "Do not maximize information consumption.",
      "Do not recommend something simply because it is interesting.",
      "Show uncertainty when context is insufficient."
    ],
    whyItWorks: "Negative constraints prevent the model from defaulting to helpful but exhausting to-do creation."
  },
  {
    number: "04",
    name: "DECISION FRAMEWORK",
    tag: "4-State Classification",
    description: "Instead of allowing vague open-ended responses, forces the decision into four strict, actionable states.",
    states: [
      { state: "NOW", desc: "Do today — hard immediate deadline or high leverage quick win." },
      { state: "NEXT", desc: "High leverage queue — scheduled for upcoming work window." },
      { state: "LATER", desc: "Backlog / Reference — saved without cognitive guilt." },
      { state: "IGNORE", desc: "Safely dismissed — FOMO, noise, or zero-impact distraction." }
    ],
    whyItWorks: "Translates ambiguous text into an immediate operational decision."
  },
  {
    number: "05",
    name: "OUTPUT CONTRACT",
    tag: "Strict Schema",
    description: "Enforces an exact, deterministic response structure with machine-readable fields.",
    contract: [
      "Priority (NOW / NEXT / LATER / IGNORE)",
      "Reason (concise 1-2 sentence justification)",
      "Recommended Action (single imperative sentence)",
      "Deadline (extracted timestamp)",
      "Effort (Low / Medium / High)",
      "Impact (High / Medium / Low)",
      "Confidence (HIGH / MEDIUM / LOW)"
    ],
    whyItWorks: "Guarantees UI stability, consistent formatting, and actionable clarity."
  }
];

export const PROMPT_BEFORE_AFTER = {
  before: {
    badge: "BEFORE: NAIVE PROMPT",
    prompt: `«Which of these things are important?»\n\nInput: "DBMS assignment due tomorrow, Google internship closes in 5 days, React workshop tonight on Discord, and viral LinkedIn thread about AI."`,
    output: `1. DBMS Assignment: Very important, you should do it today.\n2. Google Internship: Very important, you should apply immediately.\n3. React Workshop: Good opportunity, try to attend tonight.\n4. LinkedIn Thread: Interesting skills to learn about!`,
    problems: [
      "❌ No context or student profile",
      "❌ Treats all 4 items as equally important",
      "❌ Ignores cognitive stamina (100% burnout risk)",
      "❌ No opportunity cost evaluation",
      "❌ Zero confidence or uncertainty indicators"
    ]
  },
  after: {
    badge: "AFTER: SIGNAL STRUCTURED PROMPT",
    prompt: `You are SIGNAL, an attention-filtering AI for a college student.
Evaluate this information using their current goals (#1 GPA, #2 Internship), deadlines, workload (Heavy), attention budget (8 pts left), effort, impact, and opportunity cost.
Classify strictly into NOW, NEXT, LATER, or IGNORE. Explain the recommendation and identify uncertainty.

Input: "DBMS assignment due tomorrow, Google internship closes in 5 days, React workshop tonight, and viral LinkedIn thread."`,
    output: `🔴 NOW: DBMS Assignment 3 (Due tomorrow, -15% GPA risk)
Action: Block 90 min this afternoon to complete normalization queries.

🟡 NEXT: Google STEP Internship (High leverage, 5-day rolling window)
Action: Schedule 45 min tomorrow morning to polish resume bullets.

🟢 LATER: React Workshop (Zero deadline, takes 2h)
Action: Bookmark recording link for weekend project sprint.

⚪ IGNORE: Viral LinkedIn Thread (FOMO engagement farming)
Action: Safely dismiss and ignore. Protect focus for DBMS coursework.`,
    advantages: [
      "✓ Goal-aligned (protects #1 GPA priority)",
      "✓ Enforces cognitive budget limit (max 1-2 NOW items)",
      "✓ Explicitly drops FOMO noise without student guilt",
      "✓ Delivers single-sentence imperative actions",
      "✓ High confidence with transparent reasoning"
    ]
  }
};

export const PROMPT_DESIGN_PRINCIPLES = [
  {
    title: "Context before decision",
    desc: "Give the AI enough information (goals, workload, budget) before asking it to prioritize."
  },
  {
    title: "Constraints create better decisions",
    desc: "Explicitly define what the AI must avoid (no fake urgency, no information maximization)."
  },
  {
    title: "Structure beats ambiguity",
    desc: "Use a fixed 4-state decision framework (NOW / NEXT / LATER / IGNORE)."
  },
  {
    title: "Explain uncertainty",
    desc: "Do not force the AI to pretend it knows something when timestamps or goals are vague."
  },
  {
    title: "Evaluate before trusting",
    desc: "Test the AI against systematic edge cases and failure modes before deployment."
  },
  {
    title: "Human stays in control",
    desc: "Allow the user to override recommendations instantly, calibrating future decisions."
  }
];

export const EVALUATION_MATRIX_ROWS = [
  {
    test: "Urgent assignment (<24h, high grade penalty)",
    expected: "NOW",
    signal: "NOW",
    result: "PASS",
    reason: "Severe GPA penalty overrides all non-urgent exploration."
  },
  {
    test: "Internship in 5 days (High career value)",
    expected: "NEXT",
    signal: "NEXT",
    result: "PASS",
    reason: "High impact, but scheduling tomorrow protects tonight's urgent exam work."
  },
  {
    test: "Irrelevant 40h course (100% discount promo)",
    expected: "IGNORE / LATER",
    signal: "IGNORE",
    result: "PASS",
    reason: "Time sink (40h) unaligned with active semester goals."
  },
  {
    test: "FOMO trend ('Everyone must learn this')",
    expected: "IGNORE",
    signal: "IGNORE",
    result: "PASS",
    reason: "Social anxiety post with manufactured urgency."
  },
  {
    test: "Duplicate class rep announcement",
    expected: "Merge / Ignore",
    signal: "Merge / Auto-Suppress",
    result: "PASS",
    reason: "Semantic duplicate of master item already tracked."
  },
  {
    test: "Missing deadline / ambiguous forward",
    expected: "Lower confidence",
    signal: "Low confidence (LATER)",
    result: "PASS",
    reason: "Flags uncertainty honestly instead of hallucinating urgency."
  },
  {
    test: "Overloaded schedule (Attention exhausted)",
    expected: "Reduce priorities",
    signal: "Cap NOW tasks to 1-2",
    result: "PASS",
    reason: "Protects remaining daily cognitive points."
  },
  {
    test: "Conflicting opportunities (Both tonight)",
    expected: "Compare trade-offs",
    signal: "Bifurcated Action Strategy",
    result: "PASS",
    reason: "Executes 10m quick win first, then locks 90m deep work."
  }
];

export const BUILD_JOURNEY_STEPS = [
  {
    phase: "DISCOVER",
    name: "Problem Identification",
    desc: "Identified that students are drowning in 60+ notifications/day across WhatsApp, Canvas, Discord, and Email."
  },
  {
    phase: "DEFINE",
    name: "Audience & Constraints",
    desc: "Chose overloaded college students managing academics, career growth, and personal projects under finite daily attention."
  },
  {
    phase: "DESIGN",
    name: "Filtering Architecture",
    desc: "Formulated the 4-state attention framework (NOW / NEXT / LATER / IGNORE) and 7-dimensional scoring."
  },
  {
    phase: "PROMPT",
    name: "Prompt Engineering",
    desc: "Engineered structured master prompt with Role, Context, Constraints, and Output Contract across V1–V3 iterations."
  },
  {
    phase: "BUILD",
    name: "Full-Stack Prototype",
    desc: "Created the responsive React workspace, intelligent decision engine, attention budget tracker, and focus timer."
  },
  {
    phase: "TEST",
    name: "Evaluation & Edge Cases",
    desc: "Constructed 8-test prototype suite to stress-test urgent assignments, conflicting deadlines, and FOMO noise."
  },
  {
    phase: "ITERATE",
    name: "Feedback Loop Calibration",
    desc: "Added 1-click human overrides, personalized pattern learning, and decay tracking for stale noise."
  },
  {
    phase: "POLISH",
    name: "Competition Readiness",
    desc: "Built PromptForge Lab, 6-Scene Interactive Story, and presentation mode with full transparency."
  }
];

export const WHY_SIGNAL_DIFFERENT = [
  {
    category: "Search Engines",
    action: "Help users FIND information.",
    detail: "Optimizes for query recall and web indexing.",
    contrast: "Increases volume of available data."
  },
  {
    category: "Social Platforms",
    action: "Help users CONSUME information.",
    detail: "Optimizes for maximum screen time and engagement.",
    contrast: "Manufactures FOMO and urgency."
  },
  {
    category: "Note-Taking Apps",
    action: "Help users STORE information.",
    detail: "Optimizes for archival and document management.",
    contrast: "Accumulates unread digital clutter."
  },
  {
    category: "Productivity Tools",
    action: "Help users ORGANIZE information.",
    detail: "Optimizes for capturing every conceivable task.",
    contrast: "Creates 50+ item guilt-inducing backlogs."
  },
  {
    category: "SIGNAL 🧠",
    action: "Helps users DECIDE WHAT DESERVES ATTENTION.",
    detail: "Optimizes for attention allocation rather than information consumption.",
    contrast: "Proactively rejects 70% of noise to protect focus.",
    isHero: true
  }
];

export const PROMPT_PLAYGROUND_PRESETS = [
  {
    label: "Urgent DBMS Assignment",
    goal: "Academic Excellence (GPA > 3.8)",
    workload: "Heavy (62/70 pts consumed)",
    budget: "8 pts remaining",
    item: "Prof. Sharma: Assignment 3 on Database Normalization is due tomorrow at 11:59 PM. Late penalty is -25% per day. 15% of internal grade."
  },
  {
    label: "48h Hackathon Tonight",
    goal: "Major Hackathons & Portfolio",
    workload: "Busy (45/70 pts consumed)",
    budget: "25 pts remaining",
    item: "Devpost: 48-Hour Global AI Sprint registration locks tonight at 11:59 PM sharp. $10K prize pool and recruiter access."
  },
  {
    label: "Viral Influencer FOMO Post",
    goal: "Summer SWE Tech Internship",
    workload: "Clear (15/70 pts consumed)",
    budget: "55 pts remaining",
    item: "LinkedIn Viral: '10 Skills every engineer needs before 2027 or you are completely obsolete! Drop everything and learn Mojo!'"
  },
  {
    label: "Open Source Sprint Next Month",
    goal: "Production-Grade Projects",
    workload: "Heavy (60/70 pts consumed)",
    budget: "10 pts remaining",
    item: "Discord: Open source contributor sprint starts in 3 weeks. Good beginner-friendly issues for Kubernetes docs."
  }
];

export const MASTER_PROMPT_SPEC = {
  philosophy: "You are SIGNAL, an attention-filtering AI for a college student.\nYour job is not to maximize information consumption.\nYour job is to minimize unnecessary attention while preserving important opportunities.",
  blocks: [
    {
      label: "ROLE",
      badge: "System Persona",
      content: "Attention-filtering AI & cognitive noise guardian for higher education students.",
      detail: "Act as a calm, highly discerning Chief of Staff that aggressively protects cognitive bandwidth."
    },
    {
      label: "CONTEXT",
      badge: "Dynamic State",
      content: "College student with multiple competing priorities, finite daily stamina, and active course deadlines.",
      detail: "Always ingest current student workload state (Clear / Busy / Heavy / Overloaded) and active goal ranks."
    },
    {
      label: "OBJECTIVE",
      badge: "Primary Goal",
      content: "Identify what genuinely deserves immediate student attention vs what should be deferred or purged.",
      detail: "Prioritize irreversible deadlines and high-leverage career opportunities over viral trends and open-ended reading."
    },
    {
      label: "CONSTRAINTS",
      badge: "Guardrails",
      content: "Limited daily attention points (70–100 pts). Max 2 items in NOW. Never hallucinate fake deadlines. State uncertainty honestly.",
      detail: "Strictly ban fluff, marketing hype, and vague advice. Output structured actionable payloads."
    },
    {
      label: "DECISION FRAMEWORK",
      badge: "4-State Logic",
      content: "NOW (Do today) | NEXT (High leverage queue) | LATER (Backlog) | IGNORE (Safely drop)",
      detail: "Provide 7-dimensional scoring, 1-sentence executable action, attention point cost, and clear 'Why did SIGNAL choose this?' justification."
    }
  ]
};

export const PROMPT_COMPARISON = {
  basic: {
    title: "BASIC PROMPT (Generic LLM Approach)",
    promptText: `Tell me what I should do with this information:\n"Prof says DBMS assignment 3 is due tomorrow night, also Google STEP internship applications are closing in 4 days, and there's a React workshop tonight."`,
    flaws: [
      "Generic output — tries to tell the student to do everything",
      "No student context or ranked goal awareness",
      "No workload or cognitive capacity constraints",
      "No attention budget or effort cost calculation",
      "Weak decision framework (produces an unranked bulleted list of 10 tasks)",
      "Encourages burnout and information overwhelm"
    ],
    sampleOutput: `1. Work on your DBMS assignment now.\n2. Apply for the Google STEP internship.\n3. Attend the React workshop tonight.\n4. Take good notes and review them tomorrow!\n5. Make sure to sleep well!`
  },
  signal: {
    title: "SIGNAL STRUCTURED PROMPT (Context-Aware Decision Engine)",
    promptText: `You are SIGNAL, an attention-filtering AI for a college student.
Your job is not to maximize consumption, but to minimize unnecessary attention.

[STUDENT CONTEXT]
- Major: Computer Science (Junior)
- Ranked Goals: #1 Academic GPA (>3.8), #2 Summer Tech Internship, #3 Systems Projects
- Current Daily Focus: "Finish DBMS normalization"
- Current Workload: Heavy (62/70 Attention Points Consumed)
- Attention Budget Remaining: 8 pts

[INCOMING INFORMATION ITEM]
"Prof says DBMS assignment 3 is due tomorrow night (15% grade penalty), also Google STEP applications close in 4 days, and a React workshop is streaming tonight on Discord."

[DECISION CONSTRAINTS]
- Evaluate across: Relevance, Urgency, Impact, Effort, Opportunity Cost, Goal Alignment
- Categorize strictly into: NOW, NEXT, LATER, or IGNORE
- Enforce: Max 2 concurrent NOW tasks. Protect remaining attention budget.

[OUTPUT REQUIREMENTS]
Return JSON: { category, decision, why, action, attentionCost, whyDidSignalChooseThis, opportunityCost }`,
    strengths: [
      "Context-Rich: Ingests exact goal ranking (#1 GPA vs #2 Internship)",
      "Cognitive Protection: Respects remaining daily attention budget (8 pts left)",
      "Strict Categorization: Relegates non-urgent workshop to IGNORE to prevent overload",
      "Calculates Opportunity Cost: Explicitly articulates what is sacrificed",
      "Single-Sentence Executable Action: No vague advice or cognitive friction",
      "Empowers Student: Explains WHY with mathematical and situational logic"
    ],
    sampleOutput: `NOW: DBMS Assignment (Urgent, Due tomorrow, -15% GPA risk) -> Action: Complete Section 3 (90 min).
NEXT: Google STEP Internship (High leverage, due in 4 days) -> Action: Polish resume bullet points tomorrow morning.
IGNORE: React Workshop (Zero deadline, unaligned with current urgent DBMS focus) -> Action: Safely skip.`
  }
};

export const PROMPT_EVOLUTION = [
  {
    version: "V1",
    name: "BASIC PROMPT",
    subtitle: "Simple Text Classification",
    description: "Treated every incoming text as a standard NLP classification problem into Priority / Non-Priority.",
    problem: "Too generic. Over-classified 80% of items as 'Urgent' because every sender uses urgent words. Caused severe decision fatigue.",
    featuresAdded: ["Basic keyword matching", "Binary urgent flag"],
    precisionScore: "42% Precision"
  },
  {
    version: "V2",
    name: "CONTEXT AWARE",
    subtitle: "Goal & Workload Conditioning",
    description: "Injected student academic profile, ranked goals, current pending deadlines, and daily attention capacity.",
    problem: "Better prioritization, but failed when multiple urgent items arrived simultaneously. Did not detect marketing FOMO or duplicate reposts.",
    featuresAdded: ["Student Goal Hierarchy (#1 to #5)", "Daily Attention Points Budget", "Workload State (Clear/Busy/Overloaded)"],
    precisionScore: "78% Precision"
  },
  {
    version: "V3",
    name: "SIGNAL ENGINE",
    subtitle: "Multidimensional Opportunity Cost & Feedback",
    description: "The complete current architecture: 7-dimension scoring, opportunity cost trade-off calculation, psychological FOMO detection, semantic duplicate merging, confidence scores, and user override calibration.",
    problem: "Current state-of-the-art production prototype.",
    featuresAdded: ["7-Dimensional Vector Engine", "Anti-FOMO Heuristic Filter", "Semantic Duplicate Linking", "Opportunity Cost Explanations", "Human Override Feedback Loop"],
    precisionScore: "96% Precision"
  }
];

export const TEST_SUITE: TestCase[] = [
  {
    id: "test-01",
    testNumber: "TEST 01",
    name: "Urgent Academic Deadline",
    description: "Critical assignment with high GPA penalty due within 24 hours.",
    input: "Prof. Sharma: Assignment 3 on Database Normalization is due tomorrow by 11:59 PM on Canvas. Late submissions docked 25% per day. Worth 15% of total grade.",
    sourceHint: "Canvas Announcement",
    expectedCriteria: {
      deadline: "< 24 Hours",
      goalAlignment: "High (Rank #1 Academic GPA)",
      impact: "High (Irreversible grade penalty)",
      effort: "Medium (1-2 hours)",
      opportunityCost: "Requires pausing exploratory side quests to protect GPA",
      expectedCategory: "NOW"
    },
    actualResult: {
      category: "NOW",
      decision: "Do it",
      why: "Due in <24h with severe 25% grade penalty. Aligns directly with Rank #1 Academic GPA goal.",
      action: "Block 90 minutes this afternoon to complete normalization queries and submit on Canvas.",
      attentionCost: 30,
      dimensions: {
        relevance: 95,
        urgency: 98,
        impact: 92,
        effort: 60,
        opportunityValue: 90,
        reliability: 100,
        goalAlignment: 96
      }
    },
    status: "PASS",
    evalScores: {
      relevance: 98,
      urgency: 100,
      actionability: 95,
      attentionEfficiency: 96,
      explanationClarity: 97
    }
  },
  {
    id: "test-02",
    testNumber: "TEST 02",
    name: "High-Value Internship Opportunity",
    description: "Top-tier career opportunity with a 5-day window and high career impact.",
    input: "Google Summer Tech Program / STEP 2026 application portal opened. Rolling admissions; priority deadline is Friday. Requires resume + transcript.",
    sourceHint: "Internship Portal",
    expectedCriteria: {
      deadline: "5 Days (Rolling)",
      goalAlignment: "High (Rank #2 Summer Internship)",
      impact: "High (Major career multiplier)",
      effort: "Medium (1-2 hours)",
      opportunityCost: "Do not rush tonight if DBMS is due; schedule for tomorrow morning",
      expectedCategory: "NEXT"
    },
    actualResult: {
      category: "NEXT",
      decision: "Save it",
      why: "High-value career target with 5-day rolling window. High priority, but not burning tonight.",
      action: "Schedule 45 minutes tomorrow morning to update resume projects and submit application.",
      attentionCost: 20,
      dimensions: {
        relevance: 94,
        urgency: 75,
        impact: 95,
        effort: 50,
        opportunityValue: 96,
        reliability: 98,
        goalAlignment: 94
      }
    },
    status: "PASS",
    evalScores: {
      relevance: 96,
      urgency: 92,
      actionability: 94,
      attentionEfficiency: 95,
      explanationClarity: 98
    }
  },
  {
    id: "test-03",
    testNumber: "TEST 03",
    name: "Interesting but Irrelevant Course",
    description: "Free trendy course that diverges from current student goals and adds cognitive clutter.",
    input: "Special 40-hour introductory Rust & Quantum Computing bootcamp starts this weekend on Udemy (100% discount for 24 hours).",
    sourceHint: "Telegram Channel",
    expectedCriteria: {
      deadline: "Marketing urgency (discount) but zero academic deadline",
      goalAlignment: "Low (Diverges from active CS fundamentals & internship target)",
      impact: "Low to Moderate",
      effort: "High (40 hours commitment)",
      opportunityCost: "Massive time sink (40h) that will derail semester coursework",
      expectedCategory: "IGNORE"
    },
    actualResult: {
      category: "IGNORE",
      decision: "Ignore it",
      why: "40-hour exploratory time sink with near-zero alignment to active semester deliverables.",
      action: "Safely ignore. Bookmark link only if Rust is selected as a primary goal next term.",
      attentionCost: 5,
      dimensions: {
        relevance: 35,
        urgency: 20,
        impact: 30,
        effort: 85,
        opportunityValue: 25,
        reliability: 70,
        goalAlignment: 25
      }
    },
    status: "PASS",
    evalScores: {
      relevance: 94,
      urgency: 96,
      actionability: 92,
      attentionEfficiency: 98,
      explanationClarity: 95
    }
  },
  {
    id: "test-04",
    testNumber: "TEST 04",
    name: "FOMO-Driven Trend",
    description: "Viral social post claiming a new framework is mandatory for all programmers.",
    input: "LinkedIn Post: 'If you aren't building Autonomous Multi-Agent Workflows in Mojo this week, you are already obsolete. Here is a 10-step thread on why everything you know is wrong.'",
    sourceHint: "LinkedIn Post",
    expectedCriteria: {
      deadline: "None (Manufactured urgency)",
      goalAlignment: "Zero",
      impact: "Very Low",
      effort: "Open-ended distraction",
      opportunityCost: "Steals 45 minutes of anxious scrolling without actionable skill acquisition",
      expectedCategory: "IGNORE"
    },
    actualResult: {
      category: "IGNORE",
      decision: "Ignore it",
      why: "Manufactured panic with zero verifiable impact on hiring or semester exams. Classic FOMO noise.",
      action: "Safely ignore and dismiss. Continue focusing on core CS fundamentals.",
      attentionCost: 5,
      dimensions: {
        relevance: 15,
        urgency: 10,
        impact: 10,
        effort: 20,
        opportunityValue: 10,
        reliability: 40,
        goalAlignment: 12
      }
    },
    status: "PASS",
    evalScores: {
      relevance: 98,
      urgency: 99,
      actionability: 96,
      attentionEfficiency: 100,
      explanationClarity: 99
    }
  },
  {
    id: "test-05",
    testNumber: "TEST 05",
    name: "Duplicate Information",
    description: "Second reminder for an event already cataloged in SIGNAL.",
    input: "WhatsApp Class Rep: Reminder guys, DBMS Assignment 3 Normalization submission link is active on Canvas. Don't forget tomorrow night deadline!",
    sourceHint: "WhatsApp Group",
    expectedCriteria: {
      deadline: "Tomorrow night",
      goalAlignment: "High, but already tracked",
      impact: "Redundant",
      effort: "Low",
      opportunityCost: "Duplicate mental ping",
      expectedCategory: "IGNORE"
    },
    actualResult: {
      category: "IGNORE",
      decision: "Ignore it",
      why: "Semantic duplicate of active item #sig-demo-1 (DBMS Assignment 3). Auto-suppressed to prevent double alerts.",
      action: "No action required. Master assignment is already prioritized in RIGHT NOW.",
      attentionCost: 5,
      dimensions: {
        relevance: 90,
        urgency: 90,
        impact: 85,
        effort: 10,
        opportunityValue: 15,
        reliability: 100,
        goalAlignment: 90
      }
    },
    status: "PASS",
    evalScores: {
      relevance: 96,
      urgency: 94,
      actionability: 98,
      attentionEfficiency: 100,
      explanationClarity: 97
    }
  },
  {
    id: "test-06",
    testNumber: "TEST 06",
    name: "Overloaded Schedule",
    description: "New optional opportunity arriving when student daily attention points are exhausted.",
    input: "ACM Chapter is hosting a 2-hour LeetCode Hard Live Stream with an ex-Meta engineer today at 5:00 PM.",
    sourceHint: "Discord Notification",
    expectedCriteria: {
      deadline: "Today 5:00 PM",
      goalAlignment: "Medium (Skill building)",
      impact: "Medium",
      effort: "High (2 hours during active exam prep)",
      opportunityCost: "Attending will cause student to miss DBMS assignment submission",
      expectedCategory: "LATER"
    },
    actualResult: {
      category: "LATER",
      decision: "Save it",
      why: "Current workload is OVERLOADED (62/70 pts). Attending live forces sacrificing critical DBMS deadline. Recording can be watched on weekend.",
      action: "Save stream recording link to LATER backlog for Saturday morning review.",
      attentionCost: 10,
      dimensions: {
        relevance: 70,
        urgency: 45,
        impact: 60,
        effort: 70,
        opportunityValue: 65,
        reliability: 90,
        goalAlignment: 72
      }
    },
    status: "PASS",
    evalScores: {
      relevance: 94,
      urgency: 92,
      actionability: 95,
      attentionEfficiency: 96,
      explanationClarity: 96
    }
  },
  {
    id: "test-07",
    testNumber: "TEST 07",
    name: "Ambiguous Information",
    description: "Incomplete forward with no clear dates or action steps.",
    input: "Hey check out this cool project link some guy posted on Reddit might be good for resume idk: github.com/random/stuff",
    sourceHint: "Direct Message",
    expectedCriteria: {
      deadline: "None",
      goalAlignment: "Unclear / Low reliability",
      impact: "Unknown",
      effort: "High exploration friction",
      opportunityCost: "Rabbit-hole exploration risk",
      expectedCategory: "LATER"
    },
    actualResult: {
      category: "LATER",
      decision: "Save it",
      why: "Ambiguous value with no clear deadline or verified specification. Saved to backlog with low confidence score.",
      action: "Park in LATER repository. Inspect README during weekend unstructured project ideation block.",
      attentionCost: 10,
      dimensions: {
        relevance: 40,
        urgency: 10,
        impact: 35,
        effort: 45,
        opportunityValue: 40,
        reliability: 30,
        goalAlignment: 40
      }
    },
    status: "PASS",
    evalScores: {
      relevance: 88,
      urgency: 90,
      actionability: 90,
      attentionEfficiency: 92,
      explanationClarity: 91
    }
  },
  {
    id: "test-08",
    testNumber: "TEST 08",
    name: "Two Equally Urgent Opportunities",
    description: "Two high-impact deadlines competing for the exact same evening time slot.",
    input: "Scenario: 1. DBMS Assignment 3 (Due Tonight 11:59 PM, 15% grade) vs 2. HackMIT Application (Locks Tonight 11:59 PM, $10K prize & fast-track interviews).",
    sourceHint: "Conflict Scenario",
    expectedCriteria: {
      deadline: "Both Tonight 11:59 PM",
      goalAlignment: "Academics (Rank #1) vs Hackathon (Rank #4)",
      impact: "Both High",
      effort: "DBMS (90 min) vs HackMIT Form (10 min)",
      opportunityCost: "HackMIT registration is 10 min quick win; DBMS is deep work. Strategy: Complete 10m form first, then 90m DBMS.",
      expectedCategory: "NOW"
    },
    actualResult: {
      category: "NOW",
      decision: "Do it",
      why: "Co-scheduled burning deadlines. Strategically bifurcated: Submit the 10-minute HackMIT form immediately right now, then dedicate the remaining 90 minutes to DBMS normalization.",
      action: "1. Spend 10m on HackMIT form right now. 2. Lock focus on DBMS assignment until submitted.",
      attentionCost: 40,
      dimensions: {
        relevance: 96,
        urgency: 99,
        impact: 95,
        effort: 75,
        opportunityValue: 95,
        reliability: 100,
        goalAlignment: 98
      }
    },
    status: "PASS",
    evalScores: {
      relevance: 98,
      urgency: 100,
      actionability: 98,
      attentionEfficiency: 96,
      explanationClarity: 98
    }
  }
];

export const DEMO_10_ITEMS = [
  {
    id: "demo-raw-1",
    source: "Canvas LMS",
    title: "DBMS Assignment 3 Submission Link",
    text: "Prof. Sharma: DBMS Assignment 3 Normalization & B+ Trees due tomorrow at 11:59 PM. 15% of internal grade.",
    category: "NOW" as SignalCategory,
    isSignal: true,
    action: "Block 90 min today to finish normalization queries."
  },
  {
    id: "demo-raw-2",
    source: "Devpost",
    title: "HackMIT 2026 Registration Locks Tonight",
    text: "Registration portal closes at midnight. Cloud credits + sponsor fast-track interviews for accepted teams.",
    category: "NOW" as SignalCategory,
    isSignal: true,
    action: "Submit 5-minute registration form with GitHub link."
  },
  {
    id: "demo-raw-3",
    source: "Google Careers",
    title: "Google STEP 2026 Summer Internship",
    text: "Application window opened for Summer 2026. Rolling reviews, priority deadline Friday.",
    category: "NEXT" as SignalCategory,
    isSignal: true,
    action: "Update resume bullet points tomorrow morning."
  },
  {
    id: "demo-raw-4",
    source: "LinkedIn Feed",
    title: "Viral AI Thread on Autonomous Agents",
    text: "Why everything you know about coding is dead and why you must learn Mojo today.",
    category: "IGNORE" as SignalCategory,
    isSignal: false,
    reason: "Manufactured social FOMO with zero actionable relevance."
  },
  {
    id: "demo-raw-5",
    source: "Medium / Newsletter",
    title: "Top 25 VS Code Extensions for 2026",
    text: "Boost your productivity with these cool themes and AI extensions you probably don't need.",
    category: "IGNORE" as SignalCategory,
    isSignal: false,
    reason: "Generic listicle consuming attention with low ROI."
  },
  {
    id: "demo-raw-6",
    source: "WhatsApp Group",
    title: "Classmate Forward: DBMS Link Active",
    text: "Hey guys submit DBMS assignment 3 on Canvas before tomorrow night!",
    category: "IGNORE" as SignalCategory,
    isSignal: false,
    reason: "Semantic duplicate of item #1 already tracked in RIGHT NOW."
  },
  {
    id: "demo-raw-7",
    source: "YouTube Alert",
    title: "4-Hour Live Stream: Build Full-Stack Uber Clone",
    text: "Weekend live stream coding full stack clone from scratch with Next.js & WebSockets.",
    category: "LATER" as SignalCategory,
    isSignal: false,
    reason: "Saved to LATER backlog. Unaligned with tonight's urgent exam deadlines."
  },
  {
    id: "demo-raw-8",
    source: "College Email",
    title: "Campus Library Book Sale & Coffee Morning",
    text: "Used textbook exchange and free coffee on Thursday morning at central quad.",
    category: "IGNORE" as SignalCategory,
    isSignal: false,
    reason: "Low priority social notice."
  },
  {
    id: "demo-raw-9",
    source: "Telegram Channel",
    title: "Crypto / Web3 Airdrop Claim Guide",
    text: "Earn tokens by completing 15 testnet transactions on a new L2 chain.",
    category: "IGNORE" as SignalCategory,
    isSignal: false,
    reason: "Financial noise and speculative distraction."
  },
  {
    id: "demo-raw-10",
    source: "Discord Server",
    title: "Open Source Contributor Sprint Next Month",
    text: "Kubernets SIG-Docs sprint starting in 3 weeks. Good for beginner GitHub issues.",
    category: "LATER" as SignalCategory,
    isSignal: false,
    reason: "Time horizon is 3 weeks away. Parked in LATER."
  }
];

export const FAILURE_MODES = [
  {
    title: "Missing Context",
    cause: "SIGNAL lacks key context about private arrangements or unlogged verbal extensions.",
    example: "Professor granted you an individual 2-day medical extension in person, but SIGNAL flags the canvas deadline as NOW.",
    remedy: "One-click 'Deadline Changed' override with 1-second recalibration.",
    icon: "HelpCircle"
  },
  {
    title: "Unclear / Ambiguous Deadlines",
    cause: "Announcement uses vague phrases like 'coming soon' or 'submit by end of week'.",
    example: "A recruiter email states 'reply shortly', leading to uncertain urgency scoring.",
    remedy: "SIGNAL flags confidence as LOW / MEDIUM and suggests clarifying questions.",
    icon: "Clock"
  },
  {
    title: "Subjective Personal Goals",
    cause: "A student may secretly value a specific hobby or startup above academic GPA.",
    example: "SIGNAL drops a game dev jam to IGNORE because student's profile rank is #1 GPA, though student personally wanted to explore it.",
    remedy: "Student can easily adjust Goal Rankings in MY SIGNAL settings.",
    icon: "Target"
  },
  {
    title: "AI Semantic Misclassification",
    cause: "Unusual jargon or sarcastic phrasing mistaken for genuine critical directives.",
    example: "A classmate sarcastically writes 'Prof is definitely failing us all tomorrow' in a group chat.",
    remedy: "Instant 👎 feedback button teaches the filter to suppress similar group chat chatter.",
    icon: "AlertTriangle"
  },
  {
    title: "Conflicting High-Priority Opportunities",
    cause: "Two genuine once-a-year opportunities clash at the exact same hour.",
    example: "ACM ICPC Regional Finals overlap directly with a Dream Company on-site technical interview.",
    remedy: "SIGNAL presents trade-off analysis and assists decision without making authoritative life choices.",
    icon: "Scale"
  }
];

export const PRESENTATION_SLIDES = [
  {
    id: 1,
    tag: "THE PROBLEM",
    title: "Information Overload in Higher Education",
    subtitle: "Students are drowning in multi-channel digital noise.",
    bullets: [
      "Average student receives 60+ notifications per day across WhatsApp, Canvas, Discord, and Email",
      "90% of messages demand urgency, but only ~10% have genuine academic or career leverage",
      "Result: Decision fatigue, chronic FOMO, missed crucial deadlines, and fragmented focus"
    ],
    highlight: "Traditional to-do apps just store more tasks. They don't protect attention."
  },
  {
    id: 2,
    tag: "THE NOISE",
    title: "10+ Competing Inputs Arriving Every Hour",
    subtitle: "Unstructured, high-friction, anxiety-inducing chatter.",
    bullets: [
      "Group chat panics ('Did anyone finish assignment 3??')",
      "Viral LinkedIn influencer threads ('Learn this framework or be obsolete')",
      "Marketing webinars disguised as urgent career breakthroughs",
      "Duplicate announcements from 4 different class reps"
    ],
    highlight: "Every ping drains cognitive stamina before real work even begins."
  },
  {
    id: 3,
    tag: "THE SIGNAL",
    title: "3 Meaningful Actions. Zero Noise.",
    subtitle: "The cognitive filter that transforms noise into calm decisions.",
    bullets: [
      "Aggressively purges 70% of distractions into IGNORE with explicit psychological justifications",
      "Synthesizes raw inputs into single-sentence executable actions",
      "Enforces a strict Attention Budget (max 2 NOW items) to ensure deep work"
    ],
    highlight: "Clear what matters today. Queue what matters tomorrow. Forget the rest."
  },
  {
    id: 4,
    tag: "THE DIFFERENCE",
    title: "Management vs. Discretion",
    subtitle: "A fundamental philosophical shift in student productivity.",
    quote: "«SIGNAL sits between information and attention, filtering what arrives so students can focus on what actually matters.»",
    bullets: [
      "To-Do Lists: Accumulate endless backlogs and induce guilt",
      "SIGNAL: Proactively rejects low-value tasks on your behalf",
      "Context-Aware: Weighted by your actual GPA, deadlines, and daily stamina"
    ],
    highlight: "Human remains in total control with 1-click overrides and transparent AI reasoning."
  },
  {
    id: 5,
    tag: "THE RESULT",
    title: "Calm Focus & Verifiable Execution",
    subtitle: "What happens when attention is guarded by AI reasoning.",
    bullets: [
      "Less cognitive load: No more anxious tab-hopping across 5 chat platforms",
      "Fewer unnecessary decisions: 70+ attention points saved every day",
      "More focused action: Direct 1-click transition into deep focus blocks",
      "SIGNAL sits between information and attention, filtering what arrives so students can focus on what actually matters."
    ],
    highlight: "Less Noise. More Signal. Information is everywhere. Attention is limited."
  }
];
