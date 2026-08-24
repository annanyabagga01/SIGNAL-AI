import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import { SignalCard } from "../components/SignalCard";
import { SignalCategory } from "../types";
import { SAMPLE_BATCH_INPUT } from "../data/demoData";
import { 
  Inbox, 
  Sparkles, 
  Zap, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Layers, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Ban, 
  Tag, 
  FileText, 
  Copy,
  AlertCircle
} from "lucide-react";

export const InboxPage: React.FC = () => {
  const { 
    items, 
    filterItem, 
    batchFilter, 
    isAiLoading, 
    activeAiMessage, 
    setQuickToast 
  } = useSignal();

  // Mode: "single" | "batch"
  const [filterMode, setFilterMode] = useState<"single" | "batch">("single");

  // Single Input state
  const [singleText, setSingleText] = useState("");
  const [singleSource, setSingleSource] = useState("WhatsApp");

  // Batch Input state
  const [batchText, setBatchText] = useState("");
  const [batchResultView, setBatchResultView] = useState<any | null>(null);

  // Filter & Search state
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | SignalCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"urgency" | "impact" | "attention" | "newest">("urgency");

  // Handle Single submit
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleText.trim()) return;

    await filterItem(singleText, singleSource);
    setSingleText("");
  };

  // Handle Batch submit
  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchText.trim()) return;

    const result = await batchFilter(batchText);
    if (result) {
      setBatchResultView(result);
      setBatchText("");
    }
  };

  const loadSampleBatch = () => {
    setBatchText(SAMPLE_BATCH_INPUT);
    setQuickToast({ message: "Loaded 6 realistic sample college messages!", type: "info" });
  };

  // Filter items
  const filteredItems = items
    .filter((item) => {
      if (item.isArchived) return false;
      if (categoryFilter !== "ALL" && item.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesWhy = item.why.toLowerCase().includes(q);
        const matchesContent = item.rawContent.toLowerCase().includes(q);
        const matchesSource = item.source.toLowerCase().includes(q);
        if (!matchesTitle && !matchesWhy && !matchesContent && !matchesSource) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "urgency") {
        return (b.dimensions?.urgency || 50) - (a.dimensions?.urgency || 50);
      }
      if (sortBy === "impact") {
        return (b.dimensions?.impact || 50) - (a.dimensions?.impact || 50);
      }
      if (sortBy === "attention") {
        return b.attentionCost - a.attentionCost;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const counts = {
    ALL: items.filter((i) => !i.isArchived).length,
    NOW: items.filter((i) => i.category === "NOW" && !i.isArchived).length,
    NEXT: items.filter((i) => i.category === "NEXT" && !i.isArchived).length,
    LATER: items.filter((i) => i.category === "LATER" && !i.isArchived).length,
    IGNORE: items.filter((i) => i.category === "IGNORE" && !i.isArchived).length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Inbox className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            Noise Inbox & Filtering
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400">
          Paste single messages or batch dump notifications to separate high-leverage signal from cognitive spam.
        </p>
      </div>

      {/* 2. Top Input Workspace (Single vs Batch Tabs) */}
      <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              id="tab-single-filter"
              onClick={() => setFilterMode("single")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterMode === "single"
                  ? "bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Single Item Filter</span>
            </button>

            <button
              id="tab-batch-filter"
              onClick={() => setFilterMode("batch")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterMode === "batch"
                  ? "bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>⚡ Batch Signal (Multi-Paste)</span>
            </button>
          </div>

          {filterMode === "batch" && (
            <button
              onClick={loadSampleBatch}
              className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Load 6 Sample Messages</span>
            </button>
          )}
        </div>

        {/* SINGLE MODE */}
        {filterMode === "single" && (
          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Paste WhatsApp, Email, Assignment, or Article:
                </label>
                <textarea
                  value={singleText}
                  onChange={(e) => setSingleText(e.target.value)}
                  placeholder="e.g. 'Devpost Alert: Hackathon registration closes tonight at 11:59 PM...'"
                  rows={3}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-sans"
                  required
                />
              </div>

              <div className="space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Source:</label>
                  <select
                    value={singleSource}
                    onChange={(e) => setSingleSource(e.target.value)}
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Email">Email</option>
                    <option value="College Announcement">College Announcement</option>
                    <option value="Internship Portal">Internship Portal</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="GitHub">GitHub</option>
                    <option value="YouTube/Course">YouTube/Course</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isAiLoading || !singleText.trim()}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/60 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAiLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Filter Through SIGNAL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* BATCH MODE */}
        {filterMode === "batch" && (
          <form onSubmit={handleBatchSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Paste 5-10 Pieces of Noisy Information at Once:
              </label>
              <textarea
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder="Message 1: Hackathon deadline tonight...&#10;&#10;Message 2: DBMS assignment due tomorrow...&#10;&#10;Message 3: Random AI newsletter..."
                rows={5}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">
                Separate messages with double returns or "Message X:" markers
              </span>

              <button
                type="submit"
                disabled={isAiLoading || !batchText.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-950/60 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isAiLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>{activeAiMessage || "Ranking Batch..."}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Rank & Filter Batch</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. Batch Result Highlight Banner (if recently processed) */}
      {batchResultView && (
        <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-950/30 to-zinc-950 border border-purple-900/50 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>Batch Signal Breakdown</span>
            </div>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
              Saved ~{batchResultView.attentionSavedMinutes} mins of attention!
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300">
            {batchResultView.overallSummary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/40 text-xs">
              <span className="font-bold text-rose-400 block mb-1">🔴 YOUR TOP 3 ({batchResultView.top3?.length || 0})</span>
              <ul className="text-zinc-300 space-y-1">
                {batchResultView.top3?.map((i: any, idx: number) => (
                  <li key={idx} className="truncate">• {i.title}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/40 text-xs">
              <span className="font-bold text-amber-400 block mb-1">🟡 DEFER (NEXT/LATER) ({batchResultView.defer?.length || 0})</span>
              <ul className="text-zinc-300 space-y-1">
                {batchResultView.defer?.map((i: any, idx: number) => (
                  <li key={idx} className="truncate">• {i.title}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <span className="font-bold text-zinc-400 block mb-1">⚪ IGNORE ({batchResultView.ignore?.length || 0})</span>
              <ul className="text-zinc-400 space-y-1 line-through">
                {batchResultView.ignore?.map((i: any, idx: number) => (
                  <li key={idx} className="truncate">• {i.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 4. Filtered Items Stream with Tabs & Search */}
      <div className="space-y-6">
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-900/80 border border-zinc-800">
            {(
              [
                { id: "ALL", label: `All (${counts.ALL})` },
                { id: "NOW", label: `🔴 NOW (${counts.NOW})` },
                { id: "NEXT", label: `🟡 NEXT (${counts.NEXT})` },
                { id: "LATER", label: `🟢 LATER (${counts.LATER})` },
                { id: "IGNORE", label: `⚪ IGNORE (${counts.IGNORE})` },
              ] as { id: "ALL" | SignalCategory; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  categoryFilter === tab.id
                    ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search filter queue..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="urgency">Sort by Urgency</option>
              <option value="impact">Sort by Impact</option>
              <option value="attention">Sort by Attention Cost</option>
              <option value="newest">Sort by Newest</option>
            </select>
          </div>
        </div>

        {/* Cards Stream */}
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <SignalCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
            <Filter className="w-8 h-8 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-200">No items match this filter</h3>
            <p className="text-xs text-zinc-500">
              Try switching categories or paste new messages into the Noise Inbox above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
