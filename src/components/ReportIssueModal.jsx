import React, { useState } from 'react';
import { Flag, X, AlertTriangle, Send, CheckCircle2, PackageCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReportIssueModal({
  isOpen,
  onClose,
  preselectedMachine = null,
  allMachines = [],
  currentResident,
  onSubmitReport
}) {
  const [machineId, setMachineId] = useState(preselectedMachine ? preselectedMachine.id : (allMachines[0]?.id || "wm-1"));
  const [issueType, setIssueType] = useState("Door Won't Lock");
  const [severity, setSeverity] = useState("Low");
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const issueCategories = [
    "Door Won't Lock / Sensor Error",
    "Water Leaking or Pool on Floor",
    "Drum Won't Drain / Water Trapped",
    "Excessive Noise / Unbalanced Vibration",
    "Detergent Dispenser Clogged",
    "Missing Supplies (Emergency Pods / Basket)",
    "Cleanliness / Drum Needs Sanitizing",
    "Other Hardware Issue",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetMachine = allMachines.find((m) => m.id === machineId);

    onSubmitReport({
      id: `rep-${Date.now().toString().slice(-4)}`,
      machineId: machineId,
      machineName: targetMachine?.name || "Washer",
      issueType,
      severity,
      description: description || "No additional comments provided.",
      reportedBy: `${currentResident.name} (${currentResident.room})`,
      timestamp: "Just now",
      status: "Open",
      technicianAssigned: null,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDescription("");
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        
        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Report Submitted</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Facilities management has been notified. Thank you for helping keep Pinecrest laundry running smoothly!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Flag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Report Fault or Supplies</h3>
                  <p className="text-xs text-slate-500">Quick fix notification to facilities</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Machine */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Affected Washer
              </label>
              <select
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-sky-500"
              >
                {allMachines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.code}) — {m.location}
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Category
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-sky-500"
              >
                {issueCategories.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Radio */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Severity Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSeverity("Low")}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    severity === "Low"
                      ? "bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="text-xs">🟡 Low Severity</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Still safe to use; minor issue</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSeverity("High")}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    severity === "High"
                      ? "bg-rose-50 border-rose-300 text-rose-950 font-bold shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="text-xs">🔴 High / Urgent</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Machine unusable / safety hazard</div>
                </button>
              </div>
            </div>

            {/* Description Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Details & Error Codes
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe what happened, error codes on display, or what supplies are missing..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-sky-500"
              />
            </div>

            {/* User attribution info */}
            <p className="text-[11px] text-slate-400">
              Submitted as <span className="font-semibold text-slate-600">{currentResident.name} ({currentResident.room})</span>.
            </p>

            {/* Buttons */}
            <div className="pt-2 flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

