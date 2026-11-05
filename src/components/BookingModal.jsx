import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  X, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BookingModal({
  isOpen,
  onClose,
  machine,
  allMachines = [],
  currentResident,
  userActiveBookingsCount = 0,
  roomSettings,
  onConfirmBooking
}) {
  if (!isOpen || !machine) return null;

  const [selectedDateIndex, setSelectedDateIndex] = useState(0); // 0: Today, 1: Tomorrow, 2: In 2 days
  const [selectedSlot, setSelectedSlot] = useState("11:30 AM");
  const [cycleType, setCycleType] = useState("Normal Cotton (45 min)");
  const [selectedMachineId, setSelectedMachineId] = useState(machine.id);

  // Generate readable date labels based on advance booking window
  const dates = Array.from({ length: roomSettings.advanceBookingDays }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    const fullDate = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return { index: i, label, fullDate };
  });

  // Sample schedule slots with fairness status
  // If user has low recent bookings (e.g. Alex Rivera with 0), highlight Fair Share priority slots
  const isHighFairnessPriority = currentResident.recentBookingsThisWeek <= 1;

  const candidateSlots = [
    { time: "11:30 AM", isAvailable: true, isPopular: true, fairShareRecommended: isHighFairnessPriority },
    { time: "12:15 PM", isAvailable: true, isPopular: false, fairShareRecommended: false },
    { time: "01:00 PM", isAvailable: false, takenBy: "Jordan R.", fairShareRecommended: false },
    { time: "01:45 PM", isAvailable: true, isPopular: false, fairShareRecommended: isHighFairnessPriority },
    { time: "02:30 PM", isAvailable: true, isPopular: false, fairShareRecommended: false },
    { time: "03:15 PM", isAvailable: false, takenBy: "Chloe B.", fairShareRecommended: false },
    { time: "04:00 PM", isAvailable: true, isPopular: true, fairShareRecommended: false },
    { time: "05:00 PM", isAvailable: true, isPopular: true, fairShareRecommended: isHighFairnessPriority },
    { time: "06:30 PM", isAvailable: false, takenBy: "Resident #4", fairShareRecommended: false },
    { time: "07:15 PM", isAvailable: true, isPopular: true, fairShareRecommended: false },
  ];

  const cycleOptions = [
    { name: "Eco Express (30 min)", duration: 30, desc: "Light loads, workout clothes & quick refresh" },
    { name: "Normal Cotton (45 min)", duration: 45, desc: "Standard everyday wash with balanced spin" },
    { name: "Heavy Duty & Towels (60 min)", duration: 60, desc: "Bedding, bulky jackets & thick bath sheets" },
  ];

  const isLimitReached = userActiveBookingsCount >= roomSettings.maxActiveBookingsPerUser;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (isLimitReached) return;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    onConfirmBooking({
      machineId: selectedMachineId,
      dateLabel: dates[selectedDateIndex].label,
      timeSlot: selectedSlot,
      cycleType: cycleType,
    });
    onClose();
  };

  const currentSelectedMachine = allMachines.find(m => m.id === selectedMachineId) || machine;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Reserve a Washer</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Book Slot • {currentSelectedMachine.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Booking Limit Guard Notice */}
        {isLimitReached ? (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Active Booking Limit Reached ({roomSettings.maxActiveBookingsPerUser} slots)</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              To keep laundry fair and open for all residents, each apartment may hold up to {roomSettings.maxActiveBookingsPerUser} active reservations at a time. Please complete or cancel your current reservation before creating a new one.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                Got It • Back to Room
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4">
            
            {/* Machine Selector Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Selected Washer
              </label>
              <select
                value={selectedMachineId}
                onChange={(e) => setSelectedMachineId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-sky-500"
              >
                {allMachines.map((m) => (
                  <option 
                    key={m.id} 
                    value={m.id}
                    disabled={m.status === "Needs Repair"}
                  >
                    {m.name} ({m.type}) {m.status === "Needs Repair" ? "— [Out for Repairs]" : `— ${m.status}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Advance Day Tabs */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Day (Max {roomSettings.advanceBookingDays} Days in Advance)
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {dates.map((d) => (
                  <button
                    type="button"
                    key={d.index}
                    onClick={() => setSelectedDateIndex(d.index)}
                    className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                      selectedDateIndex === d.index
                        ? "bg-sky-500 text-white border-sky-500 font-bold shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="text-xs font-bold">{d.label}</div>
                    <div className={`text-[10px] ${selectedDateIndex === d.index ? 'text-sky-100' : 'text-slate-400'}`}>
                      {d.fullDate}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fairness Recommendation Banner */}
            {isHighFairnessPriority && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-start gap-2.5 text-xs text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Fair Share Priority: </span>
                  Since you've booked only {currentResident.recentBookingsThisWeek} times this week, prime slots are tagged with <span className="font-semibold text-emerald-700">★ Fair Pick</span> to ensure equal access for all neighbors!
                </div>
              </div>
            )}

            {/* Available Time Slots Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Available Time Slots ({roomSettings.slotLengthMinutes} min each)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                {candidateSlots.map((slot, idx) => {
                  const isSelected = selectedSlot === slot.time;
                  return (
                    <button
                      type="button"
                      key={idx}
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`relative p-2.5 rounded-xl border text-left transition-all ${
                        !slot.isAvailable
                          ? "bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed"
                          : isSelected
                          ? "bg-sky-50 border-sky-400 ring-2 ring-sky-300 text-sky-950 font-bold"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{slot.time}</span>
                        {slot.fairShareRecommended && slot.isAvailable && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">
                            ★ Fair Pick
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {slot.isAvailable ? "Available" : `Booked (${slot.takenBy})`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cycle Preset Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Choose Wash Cycle
              </label>
              <div className="space-y-1.5">
                {cycleOptions.map((opt, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setCycleType(opt.name)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between ${
                      cycleType === opt.name
                        ? "bg-slate-900 text-white border-slate-900 font-medium"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <span className="font-bold block">{opt.name}</span>
                      <span className={`text-[11px] ${cycleType === opt.name ? 'text-slate-300' : 'text-slate-500'}`}>
                        {opt.desc}
                      </span>
                    </div>
                    {cycleType === opt.name && <Check className="w-4 h-4 text-sky-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Community Care Reminder */}
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                10-min grace period applies. You can check in easily via "I'm Here" or by scanning the washer's QR.
              </span>
            </div>

            {/* Submit & Cancel */}
            <div className="pt-2 flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Reservation</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

