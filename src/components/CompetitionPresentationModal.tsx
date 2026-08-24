import React, { useState, useEffect } from "react";
import { useSignal } from "../context/SignalContext";
import { PRESENTATION_SLIDES } from "../data/labData";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Brain, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Target,
  ArrowRight
} from "lucide-react";

export const CompetitionPresentationModal: React.FC = () => {
  const { isPresentationOpen, setIsPresentationOpen } = useSignal();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slides = PRESENTATION_SLIDES;
  const currentSlide = slides[currentSlideIndex];

  // Keyboard navigation
  useEffect(() => {
    if (!isPresentationOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPresentationOpen(false);
      } else if (e.key === "ArrowRight" || e.key === " ") {
        setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPresentationOpen, slides.length, setIsPresentationOpen]);

  if (!isPresentationOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6 md:p-10 animate-fadeIn">
      {/* Container Deck */}
      <div className="relative w-full max-w-5xl h-[90vh] max-h-[760px] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-zinc-100 tracking-tight">SIGNAL</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                  Competition Deck
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-mono hidden sm:inline-block mr-2">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
            <button
              id="close-presentation-btn"
              onClick={() => setIsPresentationOpen(false)}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              title="Close Presentation (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Content Body */}
        <div className="flex-1 p-6 sm:p-10 md:p-14 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-6">
            {/* Tag Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-indigo-400">
                {currentSlide.tag}
              </span>
            </div>

            {/* Slide Title & Subtitle */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-zinc-100 tracking-tight leading-tight">
                {currentSlide.title}
              </h2>
              <p className="text-base sm:text-xl text-zinc-400 font-normal">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Central Quote Callout (For Slide 4 / Difference) */}
            {currentSlide.quote && (
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-zinc-900/60 to-zinc-900/40 border border-indigo-500/30 text-indigo-200 shadow-inner my-6">
                <p className="text-lg sm:text-2xl font-bold italic leading-relaxed text-zinc-100">
                  {currentSlide.quote}
                </p>
              </div>
            )}

            {/* Bullets List */}
            {currentSlide.bullets && (
              <div className="grid grid-cols-1 gap-3.5 pt-2">
                {currentSlide.bullets.map((bullet, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex items-start gap-3.5"
                  >
                    <div className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      <span className="text-[11px] font-bold font-mono">{idx + 1}</span>
                    </div>
                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-medium">
                      {bullet}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Highlight Takeaway Banner */}
          {currentSlide.highlight && (
            <div className="mt-8 p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs sm:text-sm text-zinc-300">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-zinc-200">{currentSlide.highlight}</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 hidden md:inline-block">
                SIGNAL • Attention First Architecture
              </span>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
          {/* Progress Indicators */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlideIndex 
                    ? "w-8 bg-indigo-500" 
                    : "w-2.5 bg-zinc-800 hover:bg-zinc-700"
                }`}
                title={`Go to slide ${idx + 1}: ${s.tag}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="prev-slide-btn"
              disabled={currentSlideIndex === 0}
              onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-300 text-xs font-semibold border border-zinc-800 flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentSlideIndex < slides.length - 1 ? (
              <button
                id="next-slide-btn"
                onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/80 flex items-center gap-1.5 transition-all"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="finish-presentation-btn"
                onClick={() => setIsPresentationOpen(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/80 flex items-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Presentation</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
