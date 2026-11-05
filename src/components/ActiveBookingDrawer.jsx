import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  QrCode, 
  AlertTriangle, 
  PlusCircle, 
  Sparkles, 
  XCircle, 
  Check, 
  Timer,
  ChevronRight,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ActiveBookingDrawer({
  activeBooking,
  machine,
  roomSettings,
  onCheckIn,
  onCancel,
  onFinishEarly,
  onExtendSlot,
  onOpenQRScanner,
  onFastForwardGrace
}) {
  const [extensionNotice, setExtensionNotice] = useState(null);

  if (!activeBooking || !machine) return null;

  const isCheckedIn = activeBooking.isCheckedIn;
  const isGracePeriodActive = !isCheckedIn;

  // Calculate remaining seconds for grace period if not checked in
  const graceEndsAt = new Date(activeBooking.gracePeriodEndsAt).getTime();
  const now = Date.now();
  const graceRemainingMs = Math.max(0, graceEndsAt - now);
  const graceRemainingMins = Math.floor(graceRemainingMs / 60000);
  const graceRemainingSecs = Math.floor((graceRemainingMs % 60000) / 1000);

  const handleManualCheckIn = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 }
    });
    onCheckIn(machine.id);
  };

  const handleAttemptExtension = (minutes) => {
    const result = onExtendSlot(machine.id, minutes);
    if (!result.success) {
      setExtensionNotice({
        type: 'error',
        message: result.message || "Next slot is booked by another resident. Extensions unavailable.",
      });
    } else {
      setExtensionNotice({
        type: 'success',
        message: `Extended by ${minutes} minutes! Enjoy your wash.`,
      });
    }

    setTimeout(() => {
      setExtensionNotice(null);
    }, 4000);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-sky-400 shadow-xl overflow-hidden mb-6 transition-all duration-300 ring-4 ring-sky-50">
      {/* Top Banner Status */}
      <div className={`px-4 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider ${
        isCheckedIn 
          ? "bg-sky-600 text-white" 
          : "bg-amber-500 text-amber-950 animate-soft-pulse"
      }`}>
        <div className="flex items-center gap-1.5">
          {isCheckedIn ? (
            <>
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>Cycle Running • In Progress</span>
            </>
          ) : (
            <>
              <Timer className="w-4 h-4 text-amber-900" />
              <span>Reserved • Awaiting "I'm Here" Check-In</span>
            </>
          )}
        </div>
        <span className="text-[11px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">
          {machine.code}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Machine & Slot Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{machine.name}</h3>
              <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md">
                {activeBooking.cycleType}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{machine.location}</span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-slate-700">Resident: {activeBooking.userName}</span>
            </p>
          </div>

          {/* Time Remaining / Countdown Badge */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {isCheckedIn ? "Time Remaining" : "Grace Period"}
              </div>
              <div className="text-xl font-black font-mono text-slate-900">
                {isCheckedIn ? (
                  `${activeBooking.remainingMinutes || 25} min`
                ) : (
                  `${graceRemainingMins}:${graceRemainingSecs < 10 ? '0' : ''}${graceRemainingSecs}`
                )}
              </div>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isCheckedIn ? "bg-sky-100 text-sky-600" : "bg-amber-100 text-amber-700"
            }`}>
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Grace Period Warning & Auto-release Notice */}
        {isGracePeriodActive && (
          <div className="mt-3.5 bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Check in within {roomSettings.gracePeriodMinutes} mins: </span>
                If you haven't arrived, this slot will automatically release to the room waitlist to keep laundry fair for all neighbors.
              </div>
            </div>

            {/* Simulated Fast Forward for testing grace expiry */}
            <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-[11px]">
              <span className="text-amber-800 font-medium">Demo Tester:</span>
              <button
                type="button"
                onClick={onFastForwardGrace}
                className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer hover:bg-amber-100/60 px-2 py-0.5 rounded"
              >
                Fast-forward grace timer (simulate auto-release)
              </button>
            </div>
          </div>
        )}

        {/* Extension notification toast if triggered */}
        {extensionNotice && (
          <div className={`mt-3 p-3 rounded-2xl text-xs font-medium flex items-center gap-2 ${
            extensionNotice.type === 'error' 
              ? 'bg-rose-50 text-rose-800 border border-rose-200' 
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            {extensionNotice.type === 'error' ? (
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{extensionNotice.message}</span>
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
          {!isCheckedIn ? (
            <>
              {/* Prominent "I'm Here" check-in action */}
              <button
                type="button"
                onClick={handleManualCheckIn}
                className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>I'm Here! Check In</span>
              </button>

              {/* QR Code Scanner Trigger */}
              <button
                type="button"
                onClick={onOpenQRScanner}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold rounded-2xl transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan Washer QR</span>
              </button>

              {/* Cancel Reservation */}
              <button
                type="button"
                onClick={() => onCancel(machine.id)}
                className="px-3.5 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-2xl transition-colors cursor-pointer"
              >
                Cancel Booking
              </button>
            </>
          ) : (
            <>
              {/* Finish Early Action */}
              <button
                type="button"
                onClick={() => onFinishEarly(machine.id)}
                className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-200" />
                <span>Finished Early • Free Up Washer</span>
              </button>

              {/* Extend Slot (Only allowed if next slot is open) */}
              <button
                type="button"
                onClick={() => handleAttemptExtension(15)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                title="Extend current cycle by 15 minutes if next slot is free"
              >
                <PlusCircle className="w-4 h-4 text-slate-500" />
                <span>+15m Extension</span>
              </button>

              {/* Cancel / Abort */}
              <button
                type="button"
                onClick={() => onCancel(machine.id)}
                className="px-3 py-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-2xl transition-colors cursor-pointer"
              >
                Stop Cycle
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

