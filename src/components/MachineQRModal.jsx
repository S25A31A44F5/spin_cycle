import React from 'react';
import { QrCode, X, Printer, CheckCircle, Sparkles } from 'lucide-react';

export default function MachineQRModal({ machine, onClose, onQuickCheckIn }) {
  if (!machine) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center mb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
            <QrCode className="w-3.5 h-3.5 text-sky-600" />
            <span>On-Machine Plaque</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Physical Sticker Mockup */}
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 bg-gradient-to-b from-slate-50 to-white shadow-inner my-2">
          <div className="text-xs font-bold tracking-widest text-slate-500 uppercase">
            Pinecrest Laundry Lounge
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-0.5">{machine.name}</h3>
          <p className="text-xs text-slate-500">{machine.location}</p>

          {/* Render High-Contrast SVG QR Pattern */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 inline-block my-4 shadow-xs">
            <svg viewBox="0 0 100 100" className="w-36 h-36">
              {/* Corner position markers */}
              <rect x="5" y="5" width="28" height="28" rx="4" fill="#0f172a" />
              <rect x="10" y="10" width="18" height="18" rx="2" fill="white" />
              <rect x="14" y="14" width="10" height="10" rx="1.5" fill="#0284c7" />

              <rect x="67" y="5" width="28" height="28" rx="4" fill="#0f172a" />
              <rect x="72" y="10" width="18" height="18" rx="2" fill="white" />
              <rect x="76" y="14" width="10" height="10" rx="1.5" fill="#0284c7" />

              <rect x="5" y="67" width="28" height="28" rx="4" fill="#0f172a" />
              <rect x="10" y="72" width="18" height="18" rx="2" fill="white" />
              <rect x="14" y="76" width="10" height="10" rx="1.5" fill="#0284c7" />

              {/* Data matrix dots */}
              <rect x="40" y="8" width="7" height="7" fill="#0f172a" />
              <rect x="52" y="8" width="7" height="7" fill="#0f172a" />
              <rect x="40" y="20" width="7" height="7" fill="#0284c7" />
              <rect x="52" y="24" width="7" height="7" fill="#0f172a" />
              
              <rect x="8" y="42" width="7" height="7" fill="#0f172a" />
              <rect x="20" y="44" width="7" height="7" fill="#0284c7" />
              <rect x="36" y="38" width="7" height="7" fill="#0f172a" />
              <rect x="48" y="42" width="7" height="7" fill="#0f172a" />
              <rect x="62" y="40" width="7" height="7" fill="#0284c7" />
              <rect x="76" y="44" width="7" height="7" fill="#0f172a" />
              <rect x="86" y="40" width="7" height="7" fill="#0f172a" />

              <rect x="38" y="56" width="7" height="7" fill="#0284c7" />
              <rect x="50" y="54" width="7" height="7" fill="#0f172a" />
              <rect x="64" y="56" width="7" height="7" fill="#0f172a" />
              <rect x="80" y="60" width="7" height="7" fill="#0284c7" />

              <rect x="40" y="74" width="7" height="7" fill="#0f172a" />
              <rect x="54" y="72" width="7" height="7" fill="#0284c7" />
              <rect x="68" y="76" width="7" height="7" fill="#0f172a" />
              <rect x="82" y="74" width="7" height="7" fill="#0f172a" />

              <rect x="44" y="86" width="7" height="7" fill="#0f172a" />
              <rect x="60" y="86" width="7" height="7" fill="#0284c7" />
              <rect x="74" y="86" width="7" height="7" fill="#0f172a" />
            </svg>
          </div>

          <div className="bg-slate-100 rounded-lg py-1 px-3 inline-block font-mono text-xs font-bold text-slate-700 tracking-wider">
            {machine.code}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Scan with the SpinCycle mobile scanner to check in when you arrive.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col gap-2">
          {onQuickCheckIn && (
            <button
              onClick={() => onQuickCheckIn(machine.id)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>Simulate Scanning This Machine QR</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

