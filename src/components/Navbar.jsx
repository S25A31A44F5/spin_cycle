import React from 'react';
import { 
  Sparkles, 
  User, 
  Shield, 
  Smartphone, 
  Monitor, 
  QrCode, 
  Users, 
  Flag,
  ChevronDown
} from 'lucide-react';

export default function Navbar({
  currentView,
  onViewChange,
  residents,
  currentResident,
  onResidentChange,
  waitlistCount = 0,
  onOpenWaitlist,
  onOpenQRScanner,
  onOpenReport,
  isPhoneFrame,
  onTogglePhoneFrame
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 ring-2 ring-sky-100">
            {/* Animated bubble / cycle icon */}
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white fill-none stroke-2">
              <circle cx="12" cy="12" r="9" className="stroke-white/40" />
              <path d="M12 7a5 5 0 0 1 5 5" className="animate-gentle-spin origin-[12px_12px] stroke-white" />
              <circle cx="12" cy="12" r="2.5" className="fill-white stroke-none" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900">
                Spin<span className="text-sky-600">Cycle</span>
              </span>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                Lounge
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Pinecrest Hall • 6 Smart Washers
            </p>
          </div>
        </div>

        {/* Action Controls & Switchers */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Scanner & Waitlist Pills */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenQRScanner}
              title="Open QR Scanner"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>

            <button
              onClick={onOpenWaitlist}
              title="View Room Waitlist"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Waitlist</span>
              {waitlistCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {waitlistCount}
                </span>
              )}
            </button>
          </div>

          {/* Resident Identity Switcher (for testing fairness & limits!) */}
          <div className="relative">
            <select
              value={currentResident.id}
              onChange={(e) => {
                const found = residents.find(r => r.id === e.target.value);
                if (found) onResidentChange(found);
              }}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold py-1.5 pl-2.5 pr-7 rounded-xl focus:outline-sky-500 cursor-pointer appearance-none shadow-xs"
              title="Switch resident to test different fairness priority and booking limits"
            >
              {residents.map((r) => (
                <option key={r.id} value={r.id}>
                  👤 {r.name} ({r.recentBookingsThisWeek} washes this wk)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Resident / Manager View Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onViewChange("resident")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === "resident"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Resident</span>
            </button>

            <button
              onClick={() => onViewChange("manager")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === "manager"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Manager</span>
            </button>
          </div>

          {/* Mobile Phone Mockup Toggle (for demonstrating mobile-first experience) */}
          <button
            onClick={onTogglePhoneFrame}
            title={isPhoneFrame ? "Switch to Full Desktop View" : "Preview in Mobile Frame"}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer hidden lg:flex items-center"
          >
            {isPhoneFrame ? (
              <Monitor className="w-4 h-4 text-sky-600" />
            ) : (
              <Smartphone className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

