import React, { useState } from "react";
import { SignalProvider, useSignal } from "./context/SignalContext";
import { Navbar } from "./components/Navbar";
import { QuickFilterModal } from "./components/QuickFilterModal";
import { LandingPage } from "./pages/LandingPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { InboxPage } from "./pages/InboxPage";
import { DecisionPage } from "./pages/DecisionPage";
import { HistoryPage } from "./pages/HistoryPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SignalLabPage } from "./pages/SignalLabPage";
import { StoryPage } from "./pages/StoryPage";
import { SubmissionPage } from "./pages/SubmissionPage";
import { FocusSessionModal } from "./components/FocusSessionModal";
import { MorningSignalModal } from "./components/MorningSignalModal";
import { EndOfDayRecapModal } from "./components/EndOfDayRecapModal";
import { MySignalProfileModal } from "./components/MySignalProfileModal";
import { JudgeModeModal } from "./components/JudgeModeModal";
import { CompetitionPresentationModal } from "./components/CompetitionPresentationModal";
import { Brain, CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const MainContent: React.FC = () => {
  const { currentPage, quickToast, setQuickToast } = useSignal();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Navigation Header */}
      <Navbar onOpenQuickFilter={() => setIsFilterModalOpen(true)} />

      {/* Main App Page View */}
      <main className="flex-1 w-full animate-fadeIn">
        {currentPage === "landing" && <LandingPage />}
        {currentPage === "onboarding" && <OnboardingPage />}
        {currentPage === "dashboard" && <DashboardPage />}
        {currentPage === "inbox" && <InboxPage />}
        {currentPage === "decision" && <DecisionPage />}
        {currentPage === "history" && <HistoryPage />}
        {currentPage === "settings" && <SettingsPage />}
        {currentPage === "lab" && <SignalLabPage />}
        {currentPage === "story" && <StoryPage />}
        {currentPage === "submission" && <SubmissionPage />}
      </main>

      {/* Quick Filter Modal */}
      <QuickFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />

      {/* Phase 3 & 4 Interactive Modals */}
      <FocusSessionModal />
      <MorningSignalModal />
      <EndOfDayRecapModal />
      <MySignalProfileModal />
      <JudgeModeModal />
      <CompetitionPresentationModal />

      {/* Global Toast Notification */}
      {quickToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-md ${
              quickToast.type === "success"
                ? "bg-emerald-950/90 border-emerald-800 text-emerald-200"
                : quickToast.type === "warning"
                ? "bg-amber-950/90 border-amber-800 text-amber-200"
                : "bg-zinc-900/90 border-zinc-700 text-zinc-200"
            }`}
          >
            {quickToast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : quickToast.type === "warning" ? (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            )}
            <span className="text-xs font-semibold">{quickToast.message}</span>
            <button
              onClick={() => setQuickToast(null)}
              className="text-zinc-400 hover:text-zinc-100 p-0.5 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 py-8 px-4 text-center space-y-2 mt-auto">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-300">
          <Brain className="w-4 h-4 text-indigo-400" />
          <span>SIGNAL — AI-Powered Information Filter for College Students</span>
        </div>
        <p className="text-[11px] text-zinc-400 max-w-md mx-auto italic">
          «“The world doesn't need more information. It needs better filters.”»
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <SignalProvider>
      <MainContent />
    </SignalProvider>
  );
}
