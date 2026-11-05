import React, { useState } from 'react';
import { Users, X, BellRing, Sparkles, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WaitlistModal({
  isOpen,
  onClose,
  waitlist = [],
  currentResident,
  onJoinWaitlist,
  onLeaveWaitlist,
  offeredSlot = null,
  onAcceptOfferedSlot,
  onDeclineOfferedSlot
}) {
  const [preferredMachineType, setPreferredMachineType] = useState("Any Washer");
  const [notifyMethod, setNotifyMethod] = useState("In-App & Push Notification");
  const [joinedSuccess, setJoinedSuccess] = useState(false);

  if (!isOpen) return null;

  const isUserOnWaitlist = waitlist.some((w) => w.userId === currentResident.id);

  const handleJoin = (e) => {
    e.preventDefault();
    onJoinWaitlist({
      userId: currentResident.id,
      userName: `${currentResident.name} (${currentResident.room})`,
      preferredMachineType,
      joinedAt: "Just now",
    });

    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.6 }
    });

    setJoinedSuccess(true);
    setTimeout(() => {
      setJoinedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Room Waitlist</h3>
              <p className="text-xs text-slate-500">Fair automatic slot dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Offered Slot Alert (if available) */}
        {offeredSlot && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400 shadow-md space-y-2.5 animate-bounce-once">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Slot Offered to You!
              </span>
              <span className="text-xs font-bold text-emerald-700">Expires in 4:45m</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              {offeredSlot.machineName} is now ready!
            </h4>
            <p className="text-xs text-slate-600">
              A neighbor finished early. You have first claim on this machine.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onAcceptOfferedSlot}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Accept Slot</span>
              </button>
              <button
                type="button"
                onClick={onDeclineOfferedSlot}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Pass to Next
              </button>
            </div>
          </div>
        )}

        {/* Current Waitlist Queue Display */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Current Queue ({waitlist.length} waiting)</span>
            <span className="text-slate-400 font-normal">FIFO Fair Turn</span>
          </div>
          
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {waitlist.length === 0 ? (
              <div className="text-center py-4 bg-slate-50 rounded-xl text-xs text-slate-500 border border-dashed border-slate-200">
                No one currently on the waitlist. Walk-in slots are readily available!
              </div>
            ) : (
              waitlist.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                    item.userId === currentResident.id
                      ? "bg-sky-50 border-sky-300 font-semibold text-sky-900"
                      : "bg-white border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] flex items-center justify-center font-bold">
                      #{idx + 1}
                    </span>
                    <span>{item.userName}</span>
                    {item.userId === currentResident.id && (
                      <span className="text-[10px] bg-sky-200 text-sky-800 px-1.5 py-0.2 rounded font-bold">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">{item.preferredMachineType}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Join / Leave Waitlist Form */}
        {isUserOnWaitlist ? (
          <div className="mt-5 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-center space-y-2">
            <div className="text-xs font-bold text-sky-900">
              You are in line! We'll alert you the second a washer frees up.
            </div>
            <p className="text-[11px] text-sky-700">
              When notified, you'll have 5 minutes to confirm before it is passed to the next neighbor.
            </p>
            <button
              type="button"
              onClick={() => onLeaveWaitlist(currentResident.id)}
              className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-all cursor-pointer"
            >
              Leave Waitlist
            </button>
          </div>
        ) : (
          <form onSubmit={handleJoin} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Washer Preference
              </label>
              <select
                value={preferredMachineType}
                onChange={(e) => setPreferredMachineType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-sky-500"
              >
                <option value="Any Washer">Any Available Washer (Fastest)</option>
                <option value="Large Capacity (9kg)">Large Capacity Only (SpeedQueen 9kg)</option>
                <option value="Gentle Care (Electrolux)">Gentle / Delicates Washer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Notification Channel
              </label>
              <select
                value={notifyMethod}
                onChange={(e) => setNotifyMethod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-sky-500"
              >
                <option value="In-App & Push Notification">In-App Banner & Mobile Notification</option>
                <option value="SMS Text Message">SMS Text to (***) ***-304</option>
              </select>
            </div>

            <div className="pt-2 flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Join Waitlist</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

