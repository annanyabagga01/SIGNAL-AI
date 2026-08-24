import React, { useState } from "react";
import { useSignal } from "../context/SignalContext";
import { PageView } from "../types";
import { 
  Brain, 
  Sparkles, 
  Inbox, 
  HelpCircle, 
  Clock, 
  Settings, 
  Zap, 
  Menu, 
  X,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Scale,
  User,
  FlaskConical,
  Award
} from "lucide-react";

interface NavbarProps {
  onOpenQuickFilter: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuickFilter }) => {
  const { 
    currentPage, 
    setCurrentPage, 
    attentionUsed, 
    userProfile, 
    filteredCountToday, 
    quickToast,
    setIsJudgeModeOpen,
    setIsMySignalModalOpen,
    setIsPresentationOpen
  } = useSignal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const budget = userProfile.dailyAttentionBudget || 100;
  const percentage = Math.min(Math.round((attentionUsed / budget) * 100), 100);
  const isOverloaded = percentage >= 85;

  const navItems: { id: PageView; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Signal", icon: <Sparkles className="w-4 h-4" /> },
    { id: "inbox", label: "Noise Inbox", icon: <Inbox className="w-4 h-4" /> },
    { id: "decision", label: "Should I Do This?", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "story", label: "Story", icon: <Brain className="w-4 h-4 text-emerald-400" /> },
    { id: "lab", label: "PromptForge", icon: <FlaskConical className="w-4 h-4 text-indigo-400" /> },
    { id: "submission", label: "Submission", icon: <Award className="w-4 h-4 text-amber-400" /> },
    { id: "history", label: "Archive", icon: <Clock className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      {/* Toast Notification Banner */}
      {quickToast && (
        <div 
          id="toast-notification"
          className={`py-1.5 px-4 text-xs text-center font-medium flex items-center justify-center gap-2 transition-all ${
            quickToast.type === "success" 
              ? "bg-emerald-950/90 text-emerald-300 border-b border-emerald-800/60" 
              : quickToast.type === "warning" 
              ? "bg-amber-950/90 text-amber-300 border-b border-amber-800/60"
              : "bg-indigo-950/90 text-indigo-300 border-b border-indigo-800/60"
          }`}
        >
          {quickToast.type === "success" ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{quickToast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <button
              id="nav-logo-btn"
              onClick={() => setCurrentPage("landing")}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-zinc-700/60 flex items-center justify-center text-indigo-400 group-hover:border-indigo-500/60 transition-colors shadow-inner">
                <Brain className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-tight text-zinc-100 text-lg">SIGNAL</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[11px] text-zinc-400 hidden sm:inline-block leading-tight">
                  Less Noise. More Signal.
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Attention Budget Meter & Quick Filter CTA */}
          <div className="flex items-center gap-2.5">
            {/* Present Deck CTA */}
            <button
              id="nav-present-deck-btn"
              onClick={() => setIsPresentationOpen(true)}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 text-xs font-semibold border border-indigo-800/50 transition-colors"
              title="Open Competition Presentation Deck"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Deck</span>
            </button>

            {/* Judge Mode Pill */}
            <button
              id="nav-judge-mode-btn"
              onClick={() => setIsJudgeModeOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 text-xs font-semibold border border-amber-800/50 transition-colors"
              title="Open Evaluation & Architecture Judge Mode"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Judge Mode</span>
            </button>

            {/* My Signal Profile Trigger */}
            <button
              id="nav-my-signal-btn"
              onClick={() => setIsMySignalModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
              title="Open My Signal Profile"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>My Signal</span>
            </button>

            {/* Attention Budget Pill */}
            <div 
              id="attention-budget-pill"
              onClick={() => setCurrentPage("settings")}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer transition-colors ${
                isOverloaded
                  ? "bg-rose-950/40 border-rose-800/60 text-rose-300"
                  : percentage >= 70
                  ? "bg-amber-950/30 border-amber-800/50 text-amber-300"
                  : "bg-zinc-900/80 border-zinc-800 text-zinc-300"
              }`}
              title="Daily Attention Budget: Click to adjust"
            >
              <Zap className={`w-3.5 h-3.5 ${isOverloaded ? "text-rose-400" : "text-amber-400"}`} />
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1 text-[11px] font-semibold leading-none">
                  <span>{attentionUsed}/{budget} Pts</span>
                  <span className="text-zinc-400 text-[10px]">({percentage}%)</span>
                </div>
                <div className="w-16 h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverloaded ? "bg-rose-500" : percentage >= 70 ? "bg-amber-400" : "bg-emerald-400"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Filter CTA Button */}
            <button
              id="quick-filter-cta-btn"
              onClick={onOpenQuickFilter}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-950/50 transition-all border border-indigo-400/30 active:scale-95"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Noise</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950/95 px-4 pt-3 pb-4 space-y-2">
          {/* Mobile attention bar */}
          <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium text-zinc-300">Daily Attention Budget</span>
            </div>
            <span className="text-xs font-bold text-zinc-100">{attentionUsed}/{budget} pts ({percentage}%)</span>
          </div>

          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
