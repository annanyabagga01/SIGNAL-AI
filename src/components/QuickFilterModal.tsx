import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Mail, 
  Award, 
  Briefcase, 
  Globe, 
  Code,
  Zap
} from "lucide-react";

interface QuickFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickFilterModal: React.FC<QuickFilterModalProps> = ({ isOpen, onClose }) => {
  const { filterItem, isAiLoading, activeAiMessage, setCurrentPage } = useSignal();
  const [text, setText] = useState("");
  const [source, setSource] = useState<string>("WhatsApp");

  if (!isOpen) return null;

  const samplePresets = [
    {
      label: "Assignment Submission",
      source: "College Announcement",
      text: "Prof. Patel: OS Lab Assignment 4 (Deadlock Banker's Algorithm) is due tomorrow at 11:59 PM on the college portal. Strictly individual submission.",
    },
    {
      label: "Internship Opportunity",
      source: "Internship Portal",
      text: "Google Summer SWE Intern 2026 applications opened today for 3rd year students. Closing in 5 days. Requires updated resume and GitHub links.",
    },
    {
      label: "Crypto / Newsletter Promo",
      source: "Email",
      text: "Special Promo: Join the Ultimate Web3 & Crypto Trading Masterclass! Get 60% discount today only and receive a certificate to share on LinkedIn.",
    },
    {
      label: "YouTube Tech Video",
      source: "YouTube/Course",
      text: "New 4-Hour Course: Building Distributed Databases in Rust from scratch with Raft consensus algorithm.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const result = await filterItem(text, source);
    if (result) {
      setText("");
      onClose();
      setCurrentPage("inbox");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-5 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">Filter Noise Through SIGNAL</h2>
              <p className="text-xs text-zinc-400">Evaluate across 7 dimensions against your personal goals</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Quick Sample Inputs:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setText(preset.text);
                  setSource(preset.source);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Source Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Information Source:</label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "WhatsApp", icon: <MessageSquare className="w-3.5 h-3.5" /> },
                { name: "Email", icon: <Mail className="w-3.5 h-3.5" /> },
                { name: "College Announcement", icon: <Globe className="w-3.5 h-3.5" /> },
                { name: "Internship Portal", icon: <Briefcase className="w-3.5 h-3.5" /> },
                { name: "Hackathon", icon: <Award className="w-3.5 h-3.5" /> },
                { name: "GitHub", icon: <Code className="w-3.5 h-3.5" /> },
                { name: "YouTube/Course", icon: <Zap className="w-3.5 h-3.5" /> },
              ].map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setSource(s.name)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    source === s.name
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {s.icon}
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Paste textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Paste Content (Message, Email, Hackathon, Assignment, etc.):
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste any overwhelming piece of information here..."
              rows={4}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-sans"
              required
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isAiLoading || !text.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-950/60 disabled:opacity-50 transition-all active:scale-95"
            >
              {isAiLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{activeAiMessage || "Evaluating..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Filter Through SIGNAL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
