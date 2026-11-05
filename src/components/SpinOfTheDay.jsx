import React, { useState } from 'react';
import { Sparkles, X, Lightbulb, Smile, ChevronRight } from 'lucide-react';
import { SPINS_OF_THE_DAY } from '../mockData';

export default function SpinOfTheDay() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setIsDismissed(false)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Show Spin of the Day</span>
        </button>
      </div>
    );
  }

  const current = SPINS_OF_THE_DAY[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SPINS_OF_THE_DAY.length);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-sky-50 via-indigo-50 to-amber-50 border border-sky-200/80 rounded-2xl p-4 shadow-sm mb-5 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-sky-100 flex items-center justify-center shrink-0 mt-0.5 text-sky-600">
            {current.type === "joke" ? (
              <Smile className="w-5 h-5 text-amber-500" />
            ) : (
              <Lightbulb className="w-5 h-5 text-sky-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-md">
                Spin of the Day • {current.type === "joke" ? "Laundry Humor" : "Fabric Tip"}
              </span>
              <span className="text-xs font-semibold text-slate-800">{current.title}</span>
            </div>
            <p className="text-sm text-slate-700 mt-1 leading-snug">
              {current.content}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleNext}
            title="Next tip"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white/80 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            title="Dismiss"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white/80 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

