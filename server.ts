import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initialize Gemini AI client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
    return null;
  }
}

// Fallback Heuristics Engine in case API Key is missing or rate-limited
function fallbackFilterItem(
  text: string, 
  source: string = "Other", 
  goals: any[] = [], 
  currentAttentionUsed: number = 40,
  existingItems: any[] = []
) {
  const lower = text.toLowerCase();
  
  // Keyword scoring
  const hasUrgentDeadline = /tomorrow|tonight|today|urgent|due in \d+ hours|24 hours|deadline tonight|11:59/i.test(lower);
  const hasNearDeadline = /friday|this week|in \d+ days|closing soon|deadline|due next/i.test(lower);
  const isAssignment = /assignment|submission|exam|dbms|os|algorithm|grade|project viva|lab/i.test(lower);
  const isInternship = /internship|application|hiring|job opening|apply now|stipend|referral|google|microsoft/i.test(lower);
  const isHackathon = /hackathon|register|prize pool|team registration|devpost|sprint/i.test(lower);
  const isNoise = /newsletter|crypto|discount|promotional|webinar on basic|50% off|motivational quote|celebrating \d+ years|random ai tool|check out this thread|masterclass.*discount/i.test(lower);
  const isTutorial = /youtube|tutorial|course|learn in \d+ hours|roadmap|video/i.test(lower);

  // Check duplicate
  let isDuplicate = false;
  let duplicateOfTitle = "";
  if (Array.isArray(existingItems) && existingItems.length > 0) {
    for (const existing of existingItems) {
      const exTitle = (existing.title || "").toLowerCase();
      const exContent = (existing.rawContent || "").toLowerCase();
      if (
        (isHackathon && (exTitle.includes("hackathon") || exContent.includes("hackathon")) && (lower.includes("hackathon") || lower.includes("devpost"))) ||
        (isAssignment && exTitle.length > 5 && lower.includes(exTitle.slice(0, 15))) ||
        (exTitle.length > 10 && lower.includes(exTitle))
      ) {
        isDuplicate = true;
        duplicateOfTitle = existing.title;
        break;
      }
    }
  }

  let category: "NOW" | "NEXT" | "LATER" | "IGNORE" = "NEXT";
  let decision: "Do it" | "Save it" | "Ignore it" = "Save it";
  let impact: "High" | "Medium" | "Low" = "Medium";
  let effort = "Medium (1-2h)";
  let attentionCost = 20;
  let deadline = "";
  let why = "";
  let action = "";
  let whyDidSignalChooseThis = "";
  let opportunityCost = "";
  let workloadContextReason = "";
  let confidence: "HIGH" | "MEDIUM" | "LOW" = "HIGH";
  let confidenceScore = 92;
  let title = text.slice(0, 50).trim();

  // Extraction of title
  const firstLine = text.split("\n")[0].trim();
  if (firstLine.length > 5 && firstLine.length < 70) {
    title = firstLine.replace(/^(subject:|re:|fwd:|\*+|#+)/i, "").trim();
  }

  if (isNoise) {
    category = "IGNORE";
    decision = "Ignore it";
    impact = "Low";
    effort = "Low (<30m)";
    attentionCost = 5;
    confidence = "HIGH";
    confidenceScore = 96;
    why = "Low signal density with high promotional or distracting hype.";
    action = "Archive or ignore with zero guilt.";
    opportunityCost = "Saves 30+ minutes of cognitive distraction.";
    whyDidSignalChooseThis = "Signal filtered this out because it consumes cognitive bandwidth without advancing your defined semester goals.";
  } else if (hasUrgentDeadline || (isAssignment && hasNearDeadline)) {
    category = "NOW";
    decision = "Do it";
    impact = "High";
    effort = "High (3h+)";
    attentionCost = 35;
    confidence = "HIGH";
    confidenceScore = 98;
    deadline = hasUrgentDeadline ? "Due in <24 hours" : "Due soon";
    why = "Direct academic or hard opportunity deadline with immediate consequence if missed.";
    action = "Block focus time today to complete and submit.";
    opportunityCost = "Requires pausing secondary project sprints to secure high-stakes course marks.";
    whyDidSignalChooseThis = "Ranked at top priority because the irreversible penalty of missing the deadline exceeds all secondary learning tasks.";
  } else if (isHackathon || isInternship) {
    // Workload context check
    if (currentAttentionUsed > 75 && !hasUrgentDeadline) {
      category = "NEXT";
      workloadContextReason = `Downgraded from NOW to NEXT because daily workload is heavily saturated (${currentAttentionUsed}% capacity).`;
    } else {
      category = hasUrgentDeadline ? "NOW" : "NEXT";
    }
    decision = "Do it";
    impact = "High";
    effort = "Medium (1-2h)";
    attentionCost = 25;
    confidence = "HIGH";
    confidenceScore = 90;
    deadline = hasNearDeadline ? "Closing this week" : "Within 5-7 days";
    why = "High career/portfolio leverage aligned with industry placement and project building.";
    action = "Prepare resume/team and complete registration before deadline.";
    opportunityCost = "Consumes attention that could go towards mid-term revision, but delivers high resume value.";
    whyDidSignalChooseThis = "High opportunity value with bounded effort that directly advances your career growth.";
  } else if (isTutorial) {
    category = "LATER";
    decision = "Save it";
    impact = "Medium";
    effort = "Medium (1-2h)";
    attentionCost = 15;
    confidence = "MEDIUM";
    confidenceScore = 84;
    why = "Good educational reference, but unprompted tutorials should not interrupt active execution.";
    action = "Save to your technical knowledge backlog for dedicated study slots.";
    opportunityCost = "Prevents context fragmentation during active deliverable cycles.";
    whyDidSignalChooseThis = "Deferred because consuming reference material without immediate project application fractures daily attention.";
  } else {
    category = "NEXT";
    decision = "Save it";
    impact = "Medium";
    effort = "Medium (1-2h)";
    attentionCost = 20;
    confidence = "MEDIUM";
    confidenceScore = 78;
    why = "Useful context that requires structured review when your immediate NOW queue is clear.";
    action = "Schedule 20 minutes to review and execute.";
    opportunityCost = "Consumes 20 attention points when scheduled.";
    whyDidSignalChooseThis = "Placed in NEXT queue to preserve focus for immediate high-stakes deliverables.";
  }

  const dimensions = {
    relevance: category === "IGNORE" ? 20 : category === "NOW" ? 95 : 75,
    urgency: hasUrgentDeadline ? 95 : hasNearDeadline ? 70 : 40,
    impact: impact === "High" ? 90 : impact === "Medium" ? 60 : 25,
    effort: effort.includes("High") ? 80 : effort.includes("Medium") ? 50 : 20,
    opportunityValue: category === "NOW" ? 90 : category === "NEXT" ? 75 : 30,
    reliability: isNoise ? 30 : 85,
    goalAlignment: category === "IGNORE" ? 25 : 85,
  };

  return {
    id: "sig-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
    title: title || "Filtered Information",
    rawContent: text,
    source,
    category,
    decision,
    why,
    action,
    deadline,
    effort,
    impact,
    attentionCost,
    dimensions,
    aiReasoning: `Evaluated across 7 dimensions against top goals. Classified as ${category} with attention weight of ${attentionCost} points.`,
    whyDidSignalChooseThis,
    opportunityCost,
    confidence,
    confidenceScore,
    isDuplicate,
    duplicateOfTitle,
    workloadContextReason,
    userFeedback: null,
    isCompleted: false,
    isArchived: false,
    isSampleData: false,
    createdAt: new Date().toISOString(),
    decayScore: 100,
    decayStatus: "Fresh" as const,
  };
}

// 1. Single Item Filter Endpoint
app.post("/api/filter", async (req: Request, res: Response) => {
  try {
    const { 
      text, 
      source = "Other", 
      userGoals = [], 
      currentAttentionUsed = 40, 
      existingItems = [] 
    } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Please provide valid text to filter." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const fallback = fallbackFilterItem(text, source, userGoals, currentAttentionUsed, existingItems);
      return res.json({ item: fallback, engine: "heuristic-fallback" });
    }

    const goalsContext = Array.isArray(userGoals) && userGoals.length > 0
      ? userGoals.map((g: any, i: number) => `${i + 1}. ${g.title} (Priority ${g.rank})`).join("\n")
      : "1. Academics & Coursework\n2. Internship & Job Preparation\n3. Portfolio Projects";

    const existingSummary = Array.isArray(existingItems) && existingItems.length > 0
      ? existingItems.slice(0, 8).map((it: any) => `- [${it.category}] ${it.title}`).join("\n")
      : "None";

    const prompt = `You are SIGNAL, an elite attention-filtering intelligence system for overloaded college students.
Core Philosophy: "The world doesn't need more information. It needs better filters."
Your job: Protect the student's finite daily attention bandwidth (100 pts max).

Student's Ranked Goals:
${goalsContext}

Current Workload State:
- Daily attention already used: ${currentAttentionUsed}/100 points
- Current Active Queue:
${existingSummary}

Input to Filter:
Source: ${source}
Content: """
${text}
"""

Evaluate this input thoroughly across:
1. 7 Dimensions (0-100 each): Relevance, Urgency, Impact, Effort, Opportunity Value, Reliability, Goal Alignment.
2. Classification rules:
   - 🔴 NOW: Imminent deadline (<48h), urgent grade/career deliverable, strictly maximum 3 items should be in NOW at any time.
   - 🟡 NEXT: Valuable, high-alignment items for this week (3-7 day deadline). If workload > 75%, non-urgent items must be placed in NEXT instead of NOW.
   - 🟢 LATER: Informational, nice-to-have tutorials, courses, low-urgency reference materials.
   - ⚪ IGNORE: Distractions, low-signal newsletters, vague motivational hype, repetitive webinars, FOMO noise. Say "Ignore this" without hesitation.
3. Trade-off & Opportunity Cost: State specifically what the student risks neglecting if they spend time on this (e.g. "Spends 2h that could be used on upcoming DBMS lab").
4. Duplicate Detection: Compare with Current Active Queue. If this is a duplicate or repost of an existing alert (e.g. same hackathon or assignment), mark isDuplicate: true and specify duplicateOfTitle.
5. Confidence: HIGH (90-99), MEDIUM (70-89), or LOW (<70).

Assign attention points: 5 (trivial) to 40 (heavy focus block).
Respond with valid JSON adhering to schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Actionable title under 8 words" },
            category: { type: Type.STRING, description: "NOW, NEXT, LATER, or IGNORE" },
            decision: { type: Type.STRING, description: "Do it, Save it, or Ignore it" },
            why: { type: Type.STRING, description: "1-2 concise sentences explaining why" },
            action: { type: Type.STRING, description: "Concrete, executable next step" },
            deadline: { type: Type.STRING, description: "Detected deadline string, or empty if none" },
            effort: { type: Type.STRING, description: "e.g. '45 mins', '90 mins', '3 hours', or 'Low (<30m)'" },
            impact: { type: Type.STRING, description: "High, Medium, or Low" },
            attentionCost: { type: Type.INTEGER, description: "Points from 5 to 40" },
            opportunityCost: { type: Type.STRING, description: "Direct statement of what time/energy is traded away" },
            whyDidSignalChooseThis: { type: Type.STRING, description: "Transparent comparison explaining why this ranked here over other things" },
            aiReasoning: { type: Type.STRING, description: "Synthesis of trade-offs evaluated" },
            confidence: { type: Type.STRING, description: "HIGH, MEDIUM, or LOW" },
            confidenceScore: { type: Type.INTEGER, description: "0-100 confidence score" },
            isDuplicate: { type: Type.BOOLEAN, description: "Whether this duplicates an existing item in the queue" },
            duplicateOfTitle: { type: Type.STRING, description: "Title of the item it duplicates, or empty" },
            workloadContextReason: { type: Type.STRING, description: "Explanation if category was modified due to current workload saturation" },
            dimensions: {
              type: Type.OBJECT,
              properties: {
                relevance: { type: Type.INTEGER },
                urgency: { type: Type.INTEGER },
                impact: { type: Type.INTEGER },
                effort: { type: Type.INTEGER },
                opportunityValue: { type: Type.INTEGER },
                reliability: { type: Type.INTEGER },
                goalAlignment: { type: Type.INTEGER },
              },
              required: ["relevance", "urgency", "impact", "effort", "opportunityValue", "reliability", "goalAlignment"],
            },
          },
          required: [
            "title", "category", "decision", "why", "action", "effort", "impact", 
            "attentionCost", "opportunityCost", "whyDidSignalChooseThis", "aiReasoning", 
            "confidence", "confidenceScore", "dimensions"
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const validCategory = ["NOW", "NEXT", "LATER", "IGNORE"].includes(parsed.category) ? parsed.category : "NEXT";
    const validDecision = ["Do it", "Save it", "Ignore it"].includes(parsed.decision) ? parsed.decision : "Save it";
    const validImpact = ["High", "Medium", "Low"].includes(parsed.impact) ? parsed.impact : "Medium";
    const validConfidence = ["HIGH", "MEDIUM", "LOW"].includes(parsed.confidence) ? parsed.confidence : "HIGH";

    const item = {
      id: "sig-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      title: parsed.title || text.slice(0, 45),
      rawContent: text,
      source,
      category: validCategory,
      decision: validDecision,
      why: parsed.why || "Filtered through SIGNAL attention engine.",
      action: parsed.action || "Review item in queue.",
      deadline: parsed.deadline || "",
      effort: parsed.effort || "Medium (1-2h)",
      impact: validImpact,
      attentionCost: Math.min(Math.max(parsed.attentionCost || 20, 5), 45),
      opportunityCost: parsed.opportunityCost || "Requires allocating daily attention from secondary priorities.",
      dimensions: parsed.dimensions || {
        relevance: 70,
        urgency: 50,
        impact: 60,
        effort: 50,
        opportunityValue: 60,
        reliability: 80,
        goalAlignment: 75,
      },
      confidence: validConfidence,
      confidenceScore: parsed.confidenceScore || 90,
      isDuplicate: !!parsed.isDuplicate,
      duplicateOfTitle: parsed.duplicateOfTitle || "",
      workloadContextReason: parsed.workloadContextReason || "",
      aiReasoning: parsed.aiReasoning || "Analyzed against current priorities and attention budget.",
      whyDidSignalChooseThis: parsed.whyDidSignalChooseThis || "Prioritized to balance urgency and academic consequence.",
      userFeedback: null,
      isCompleted: false,
      isArchived: false,
      isSampleData: false,
      createdAt: new Date().toISOString(),
      decayScore: 100,
      decayStatus: "Fresh" as const,
    };

    return res.json({ item, engine: "gemini-3.7-flash" });
  } catch (err: any) {
    console.error("Filter API error:", err);
    const fallback = fallbackFilterItem(
      req.body.text || "Sample", 
      req.body.source || "Other", 
      req.body.userGoals || [],
      req.body.currentAttentionUsed || 40,
      req.body.existingItems || []
    );
    return res.json({ item: fallback, engine: "fallback-on-error", errorNotice: err?.message });
  }
});

// 2. Batch Signal Filter Endpoint
app.post("/api/batch-filter", async (req: Request, res: Response) => {
  try {
    const { items = [], userGoals = [] } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Please provide an array of items to batch filter." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Process each via heuristic fallback
      const processed = items.map((raw: string, idx: number) => fallbackFilterItem(raw, "Other", userGoals));
      const top3 = processed.filter(i => i.category === "NOW").slice(0, 3);
      const defer = processed.filter(i => (i.category === "NEXT" || i.category === "LATER") && !top3.includes(i));
      const ignore = processed.filter(i => i.category === "IGNORE");
      
      // If top3 has less than 3, promote from NEXT
      while (top3.length < 3 && defer.length > 0) {
        const item = defer.shift()!;
        item.category = "NOW";
        top3.push(item);
      }

      return res.json({
        top3,
        defer,
        ignore,
        overallSummary: `Batch evaluated ${items.length} items. Distilled to Top ${top3.length} critical focus actions, deferred ${defer.length} items, and eliminated ${ignore.length} distractions.`,
        attentionSavedMinutes: ignore.length * 45 + defer.length * 20,
        engine: "heuristic-fallback",
      });
    }

    const prompt = `You are SIGNAL ⚡ Batch Engine for college students.
You received a noisy dump of ${items.length} raw messages, emails, announcements, and links.
Filter out the noise. Convert this chaotic batch into:
1. YOUR TOP 3: The maximum 3 things that absolutely deserve attention right now.
2. DEFER: Items to do NEXT or save for LATER.
3. IGNORE: Low-value, repetitive, distracting, or low-leverage items that the student should NOT spend cognitive effort on.

Student Goals:
${JSON.stringify(userGoals, null, 2)}

Batch Items:
${items.map((it: string, idx: number) => `[Item ${idx + 1}]:\n${it}`).join("\n\n")}

Evaluate all items comparatively. Ensure Top 3 are ranked by actual urgency & goal impact.
Assign reasonable attention points (5-40).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            top3: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  rawContent: { type: Type.STRING },
                  category: { type: Type.STRING },
                  decision: { type: Type.STRING },
                  why: { type: Type.STRING },
                  action: { type: Type.STRING },
                  deadline: { type: Type.STRING },
                  effort: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  attentionCost: { type: Type.INTEGER },
                  whyDidSignalChooseThis: { type: Type.STRING },
                  aiReasoning: { type: Type.STRING },
                },
                required: ["title", "why", "action", "effort", "impact", "attentionCost", "whyDidSignalChooseThis"],
              },
            },
            defer: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  rawContent: { type: Type.STRING },
                  category: { type: Type.STRING },
                  decision: { type: Type.STRING },
                  why: { type: Type.STRING },
                  action: { type: Type.STRING },
                  deadline: { type: Type.STRING },
                  effort: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  attentionCost: { type: Type.INTEGER },
                  whyDidSignalChooseThis: { type: Type.STRING },
                },
                required: ["title", "why", "action", "effort", "impact", "attentionCost"],
              },
            },
            ignore: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  rawContent: { type: Type.STRING },
                  why: { type: Type.STRING },
                  action: { type: Type.STRING },
                  whyDidSignalChooseThis: { type: Type.STRING },
                },
                required: ["title", "why", "action"],
              },
            },
            overallSummary: { type: Type.STRING },
            attentionSavedMinutes: { type: Type.INTEGER },
          },
          required: ["top3", "defer", "ignore", "overallSummary", "attentionSavedMinutes"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");

    // Standardize object structure
    const formatItem = (raw: any, defaultCat: "NOW" | "NEXT" | "LATER" | "IGNORE"): any => ({
      id: "sig-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      title: raw.title || "Information Item",
      rawContent: raw.rawContent || raw.title || "",
      source: "Other" as const,
      category: defaultCat,
      decision: defaultCat === "IGNORE" ? "Ignore it" : defaultCat === "NOW" ? "Do it" : "Save it",
      why: raw.why || "",
      action: raw.action || "Review item",
      deadline: raw.deadline || "",
      effort: raw.effort || (defaultCat === "IGNORE" ? "Low (<30m)" : "Medium (1-2h)"),
      impact: raw.impact || (defaultCat === "IGNORE" ? "Low" : "Medium"),
      attentionCost: raw.attentionCost || (defaultCat === "IGNORE" ? 5 : defaultCat === "NOW" ? 30 : 15),
      opportunityCost: raw.opportunityCost || (defaultCat === "NOW" ? "Requires pausing lower priority tasks to meet deadline." : defaultCat === "IGNORE" ? "Saves attention points from distraction." : "Can be scheduled without immediate pressure."),
      confidence: (defaultCat === "NOW" || defaultCat === "IGNORE" ? "HIGH" : "MEDIUM") as "HIGH" | "MEDIUM" | "LOW",
      confidenceScore: defaultCat === "NOW" ? 95 : defaultCat === "IGNORE" ? 96 : 82,
      isDuplicate: false,
      userFeedback: null,
      dimensions: {
        relevance: defaultCat === "IGNORE" ? 20 : defaultCat === "NOW" ? 90 : 70,
        urgency: defaultCat === "NOW" ? 90 : 40,
        impact: defaultCat === "NOW" ? 85 : 50,
        effort: 50,
        opportunityValue: defaultCat === "NOW" ? 85 : 35,
        reliability: 80,
        goalAlignment: defaultCat === "IGNORE" ? 20 : 80,
      },
      aiReasoning: raw.aiReasoning || "Evaluated in batch ranking.",
      whyDidSignalChooseThis: raw.whyDidSignalChooseThis || "Positioned based on relative urgency and alignment.",
      isCompleted: false,
      isArchived: false,
      isSampleData: false,
      createdAt: new Date().toISOString(),
      decayScore: 100,
      decayStatus: "Fresh" as const,
    });

    const top3 = (parsed.top3 || []).map((i: any) => formatItem(i, "NOW")).slice(0, 3);
    const defer = (parsed.defer || []).map((i: any) => formatItem(i, "NEXT"));
    const ignore = (parsed.ignore || []).map((i: any) => formatItem(i, "IGNORE"));

    return res.json({
      top3,
      defer,
      ignore,
      overallSummary: parsed.overallSummary || `Filtered ${items.length} items to your vital Top 3.`,
      attentionSavedMinutes: parsed.attentionSavedMinutes || 90,
      engine: "gemini-3.7-flash",
    });
  } catch (err: any) {
    console.error("Batch filter error:", err);
    return res.status(500).json({ error: "Failed to process batch items", details: err?.message });
  }
});

// 3. Daily Briefing Endpoint
app.post("/api/daily-brief", async (req: Request, res: Response) => {
  try {
    const { items = [], userGoals = [], userName = "Student" } = req.body;
    const ai = getGeminiClient();

    const activeNow = items.filter((i: any) => i.category === "NOW" && !i.isCompleted);
    const activeNext = items.filter((i: any) => i.category === "NEXT" && !i.isCompleted);
    const ignored = items.filter((i: any) => i.category === "IGNORE");

    if (!ai) {
      const brief = {
        id: "brief-" + Date.now(),
        date: new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
        greeting: `Good morning, ${userName}. Here's what actually deserves your attention today.`,
        mustDo: activeNow.slice(0, 3).map((i: any) => ({
          title: i.title,
          reason: i.why || "Critical time-sensitive deliverable.",
          effort: i.effort || "90 mins",
        })),
        shouldDo: activeNext.slice(0, 2).map((i: any) => ({
          title: i.title,
          reason: i.why || "High leverage for this week.",
          effort: i.effort || "45 mins",
        })),
        ignoreList: ignored.slice(0, 2).map((i: any) => ({
          title: i.title,
          reason: i.why || "Distraction that does not advance current priorities.",
        })),
        oneThingToAvoid: "Getting pulled into endless tutorial rabbits holes or unvetted hackathon hype before your primary submission is complete.",
        goldenRule: activeNow[0] ? `If you only accomplish one thing today, make it: ${activeNow[0].title}.` : "If you only accomplish one thing today, make it: Reviewing and locking in your core project architecture.",
        generatedAt: new Date().toISOString(),
      };
      return res.json({ brief, engine: "heuristic-fallback" });
    }

    const prompt = `You are SIGNAL ☀️, generating a concise, high-clarity daily morning briefing for ${userName}.
Keep it sharp, motivational, and laser-focused on reducing overwhelm.

Active NOW items:
${JSON.stringify(activeNow.map((i: any) => ({ title: i.title, why: i.why, effort: i.effort, deadline: i.deadline })), null, 2)}

Active NEXT items:
${JSON.stringify(activeNext.map((i: any) => ({ title: i.title, why: i.why })), null, 2)}

Ignored items:
${JSON.stringify(ignored.map((i: any) => ({ title: i.title, why: i.why })), null, 2)}

User Goals:
${JSON.stringify(userGoals, null, 2)}

Generate a structured daily brief following the specification:
- greeting ("Good morning, [Name]. Here's what actually matters today.")
- mustDo (2-3 items maximum)
- shouldDo (1-2 items)
- ignoreList (1-2 items to intentionally ignore)
- oneThingToAvoid (Identify the biggest likely distraction for a college student today)
- goldenRule ("If you only accomplish one thing today, make it: [X].")`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            greeting: { type: Type.STRING },
            mustDo: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  effort: { type: Type.STRING },
                },
                required: ["title", "reason", "effort"],
              },
            },
            shouldDo: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  effort: { type: Type.STRING },
                },
                required: ["title", "reason", "effort"],
              },
            },
            ignoreList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["title", "reason"],
              },
            },
            oneThingToAvoid: { type: Type.STRING },
            goldenRule: { type: Type.STRING },
          },
          required: ["greeting", "mustDo", "shouldDo", "ignoreList", "oneThingToAvoid", "goldenRule"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const brief = {
      id: "brief-" + Date.now(),
      date: new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
      greeting: parsed.greeting || `Good morning, ${userName}. Here's what actually matters today.`,
      mustDo: parsed.mustDo || [],
      shouldDo: parsed.shouldDo || [],
      ignoreList: parsed.ignoreList || [],
      oneThingToAvoid: parsed.oneThingToAvoid || "Mindless social scrolling pretending to be career networking.",
      goldenRule: parsed.goldenRule || "Focus on your primary deliverable before touching secondary tasks.",
      generatedAt: new Date().toISOString(),
    };

    return res.json({ brief, engine: "gemini-3.7-flash" });
  } catch (err: any) {
    console.error("Daily brief error:", err);
    return res.status(500).json({ error: "Failed to generate daily brief" });
  }
});

// 4. Decision Mode ("SHOULD I DO THIS?") Endpoint
app.post("/api/decision", async (req: Request, res: Response) => {
  try {
    const { query, context = "", userGoals = [], currentPointsUsed = 45 } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Please provide a question or opportunity to evaluate." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Intelligent fallback logic
      const lower = query.toLowerCase();
      let verdict: "YES" | "MAYBE" | "NO" = "MAYBE";
      let summary = "";
      if (/hackathon/i.test(lower) && currentPointsUsed > 70) {
        verdict = "NO";
        summary = "Current workload is already near saturation (70%+ attention used). Entering a 48h hackathon right now risks academic penalties on active coursework.";
      } else if (/hackathon/i.test(lower)) {
        verdict = "YES";
        summary = "Strong alignment with portfolio building and collaborative skills. You have sufficient attention capacity.";
      } else if (/random|web3 course|100 hours|side project with no scope/i.test(lower)) {
        verdict = "NO";
        summary = "High time commitment with unverified ROI. Distracts from your primary semester focus.";
      } else {
        verdict = "MAYBE";
        summary = "Valuable only if you timebox it to under 3 hours this weekend and protect your core assignment deadlines.";
      }

      return res.json({
        evaluation: {
          id: "dec-" + Date.now(),
          query,
          context,
          verdict,
          summary,
          goalAlignmentScore: verdict === "YES" ? 88 : verdict === "MAYBE" ? 65 : 30,
          timeRequired: "3-8 hours estimated",
          expectedBenefit: "Portfolio demonstration and skill enhancement.",
          opportunityCost: "Consumes 35 attention points that could solidify core exam prep.",
          currentWorkloadImpact: `Current attention load is at ${currentPointsUsed}%. Adding this will push it to ${Math.min(currentPointsUsed + 30, 100)}%.`,
          recommendedNextStep: verdict === "YES" ? "Register today and define a minimal MVP scope." : verdict === "MAYBE" ? "Defer decision until Friday after assignment submission." : "Decline or archive. Say no with confidence.",
          detailedAnalysis: [
            "Goal Alignment: Evaluated against your top semester goals.",
            "Energy Equation: High cognitive load required vs marginal incremental return.",
            "Timeline Safety: Checks for conflict with imminent deadlines.",
          ],
          createdAt: new Date().toISOString(),
        },
        engine: "heuristic-fallback",
      });
    }

    const prompt = `You are SIGNAL Decision Engine 🤔.
A college student is asking you: "${query}"
Context provided: "${context}"
Current Daily Attention Points Used: ${currentPointsUsed}/100.
Student's Ranked Goals:
${JSON.stringify(userGoals, null, 2)}

Evaluate this decision rigorously:
1. Goal alignment
2. Time & energy required
3. Deadline risks & active workload impact
4. Expected tangible benefit (grades, career, skills)
5. True Opportunity Cost (what gets neglected if they say yes?)

Return ONE verdict:
- YES (Strong alignment, realistic capacity, clear upside)
- MAYBE (Useful, but conditional on strict timeboxing or finishing pending NOW tasks first)
- NO (Not worth the attention cost right now, high distraction risk)

Be direct, honest, and protective of their time.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, description: "YES, MAYBE, or NO" },
            summary: { type: Type.STRING, description: "Direct 2-sentence bottom line verdict" },
            goalAlignmentScore: { type: Type.INTEGER, description: "0-100 score" },
            timeRequired: { type: Type.STRING },
            expectedBenefit: { type: Type.STRING },
            opportunityCost: { type: Type.STRING },
            currentWorkloadImpact: { type: Type.STRING },
            recommendedNextStep: { type: Type.STRING },
            detailedAnalysis: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 sharp bullet points analyzing trade-offs",
            },
          },
          required: ["verdict", "summary", "goalAlignmentScore", "timeRequired", "expectedBenefit", "opportunityCost", "currentWorkloadImpact", "recommendedNextStep", "detailedAnalysis"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const validVerdict = ["YES", "MAYBE", "NO"].includes(parsed.verdict) ? parsed.verdict : "MAYBE";

    const evaluation = {
      id: "dec-" + Date.now(),
      query,
      context,
      verdict: validVerdict,
      summary: parsed.summary || "Evaluation completed based on current capacity.",
      goalAlignmentScore: parsed.goalAlignmentScore || 70,
      timeRequired: parsed.timeRequired || "2-4 hours",
      expectedBenefit: parsed.expectedBenefit || "Practical skill application.",
      opportunityCost: parsed.opportunityCost || "Diverts attention from primary coursework.",
      currentWorkloadImpact: parsed.currentWorkloadImpact || `Current workload is ${currentPointsUsed}%.`,
      recommendedNextStep: parsed.recommendedNextStep || "Proceed with caution.",
      detailedAnalysis: parsed.detailedAnalysis || ["Evaluated priority trade-offs."],
      createdAt: new Date().toISOString(),
    };

    return res.json({ evaluation, engine: "gemini-3.7-flash" });
  } catch (err: any) {
    console.error("Decision API error:", err);
    return res.status(500).json({ error: "Failed to evaluate decision" });
  }
});

// 5. Anti-FOMO Engine Endpoint
app.post("/api/fomo-check", async (req: Request, res: Response) => {
  try {
    const { query, userGoals = [] } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Please provide an event, tool, or trend to FOMO-check." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const lower = query.toLowerCase();
      const isHype = /new framework|everyone is learning|viral|crypto|ai tool hype|webinar|unlimited certificate/i.test(lower);
      const verdict: "REAL OPPORTUNITY" | "FOMO NOISE" = isHype ? "FOMO NOISE" : "REAL OPPORTUNITY";

      return res.json({
        evaluation: {
          id: "fomo-" + Date.now(),
          query,
          verdict,
          realisticLoss: verdict === "FOMO NOISE" 
            ? "Zero tangible loss. In 3 months, 90% of tools or hype cycles are either superseded or easily learned in a weekend if genuinely needed." 
            : "Missing this hard application deadline means waiting an entire hiring cycle.",
          fomoTrigger: "Social proof illusion ('Everyone else is jumping on this, so I will fall behind if I don't').",
          alternativeAction: verdict === "FOMO NOISE"
            ? "Stick to your active tech stack and finish your current project demo instead of switching tools mid-way."
            : "Set a 30-minute timer and submit the baseline application today.",
          verdictReason: verdict === "FOMO NOISE"
            ? "This is hype-driven distraction masking as productivity. Your current project stack already provides sufficient leverage."
            : "This represents a genuine scarce window with high career upside.",
          opportunityCostFactor: "Shifting focus now introduces context-switching costs of at least 2 hours.",
          createdAt: new Date().toISOString(),
        },
        engine: "heuristic-fallback",
      });
    }

    const prompt = `You are the SIGNAL Anti-FOMO Engine 🧠 for college students.
Students constantly hoard opportunities, courses, and webinars because of Fear Of Missing Out (FOMO).
Evaluate this student thought/opportunity: "${query}"

Student Goals:
${JSON.stringify(userGoals, null, 2)}

Key Question to answer:
"If you ignore this, what do you realistically lose?"

Classify as:
1. REAL OPPORTUNITY: Rare, high-leverage, time-bounded, directly aligned with core goals where missing it has actual negative career/academic consequence.
2. FOMO NOISE: Generalized hype, "everyone is doing it" social pressure, redundant tutorials, low-barrier webinars, or tools that can be learned on-demand later.

Be brutally honest. Help the student feel completely at peace ignoring FOMO noise.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, description: "REAL OPPORTUNITY or FOMO NOISE" },
            realisticLoss: { type: Type.STRING, description: "Realistic assessment of what is actually lost if ignored" },
            fomoTrigger: { type: Type.STRING, description: "The psychological bias or hype trigger causing FOMO" },
            alternativeAction: { type: Type.STRING, description: "What the student should do instead with their attention" },
            verdictReason: { type: Type.STRING, description: "2 sentences explaining the decision" },
            opportunityCostFactor: { type: Type.STRING, description: "Attention cost explanation" },
          },
          required: ["verdict", "realisticLoss", "fomoTrigger", "alternativeAction", "verdictReason", "opportunityCostFactor"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const validVerdict = parsed.verdict === "REAL OPPORTUNITY" ? "REAL OPPORTUNITY" : "FOMO NOISE";

    const evaluation = {
      id: "fomo-" + Date.now(),
      query,
      verdict: validVerdict,
      realisticLoss: parsed.realisticLoss || "Realistically, you lose nothing essential.",
      fomoTrigger: parsed.fomoTrigger || "Social anxiety around emerging tech trends.",
      alternativeAction: parsed.alternativeAction || "Stay focused on your active core deliverables.",
      verdictReason: parsed.verdictReason || "Filtered through anti-FOMO criteria.",
      opportunityCostFactor: parsed.opportunityCostFactor || "Prevents attention dilution.",
      createdAt: new Date().toISOString(),
    };

    return res.json({ evaluation, engine: "gemini-3.7-flash" });
  } catch (err: any) {
    console.error("FOMO Check error:", err);
    return res.status(500).json({ error: "Failed to perform FOMO check" });
  }
});

// API health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    product: "SIGNAL 🧠",
    time: new Date().toISOString(),
    aiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🧠 SIGNAL Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
