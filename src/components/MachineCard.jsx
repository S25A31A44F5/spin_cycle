import React from 'react';
import WasherIllustration from './WasherIllustration';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Wrench, 
  Sparkles, 
  QrCode, 
  Flag, 
  Calendar,
  Check,
  ChevronRight
} from 'lucide-react';

export default function MachineCard({
  machine,
  currentResident,
  onBook,
  onCheckIn,
  onShowQR,
  onReportIssue,
}) {
  const isReady = machine.status === "Ready";
  const isReserved = machine.status === "Reserved";
  const isInUse = machine.status === "In Use";
  const isBroken = machine.status === "Needs Repair";

  const isUserReserved = 
    machine.currentBooking && 
    machine.currentBooking.userId === currentResident.id;

  // Status Badge Config with both icons, text, and accessible colors
  const statusConfig = {
    Ready: {
      label: "Ready for Laundry",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      dotColor: "bg-emerald-500",
      icon: CheckCircle2,
      cardBorder: "border-slate-200 hover:border-emerald-400 hover:shadow-md",
    },
    Reserved: {
      label: isUserReserved ? "Your Reservation" : "Reserved by Neighbor",
      badgeColor: isUserReserved 
        ? "bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-200" 
        : "bg-amber-50 text-amber-800 border-amber-200",
      dotColor: "bg-amber-500",
      icon: Clock,
      cardBorder: isUserReserved ? "border-amber-400 bg-amber-50/20 shadow-md" : "border-slate-200",
    },
    "In Use": {
      label: "Cycle In Progress",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
      dotColor: "bg-sky-500",
      icon: Sparkles,
      cardBorder: "border-slate-200 hover:border-sky-300",
    },
    "Needs Repair": {
      label: "Out of Service",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
      dotColor: "bg-rose-500",
      icon: Wrench,
      cardBorder: "border-rose-200 bg-rose-50/20 opacity-95",
    },
  }[machine.status] || {
    label: machine.status,
    badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
    dotColor: "bg-slate-500",
    icon: AlertCircle,
    cardBorder: "border-slate-200",
  };

  const StatusIcon = statusConfig.icon;

  // Estimate finish time string
  const formatFinishTime = (dateStr) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch {
      return null;
    }
  };

  return (
    <div className={`bg-white rounded-3xl border-2 p-4 md:p-5 flex flex-col justify-between transition-all duration-200 relative ${statusConfig.cardBorder}`}>
      
      {/* Top Header: Code, Badges & QR Trigger */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {machine.code}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">{machine.type}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* QR Plaque Button */}
            <button
              onClick={() => onShowQR(machine)}
              title="View on-machine QR code"
              className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Quick Report Fault */}
            <button
              onClick={() => onReportIssue(machine)}
              title="Report issue or low supplies"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Machine Name & Status Tag */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {machine.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{machine.location}</p>
          </div>

          {/* Accessible Status Pill (Color + Text + Icon) */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusConfig.badgeColor} shrink-0`}>
            <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor} shrink-0`} />
            <StatusIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{statusConfig.label}</span>
          </div>
        </div>

        {/* Visual Illustration & Real-time State Details */}
        <div className="flex items-center gap-4 my-4 bg-slate-50/70 rounded-2xl p-3 border border-slate-100">
          <WasherIllustration
            status={machine.status}
            remainingMinutes={machine.currentBooking?.remainingMinutes}
            compact={true}
          />

          <div className="flex-1 min-w-0 space-y-1.5">
            {isReady && (
              <div className="text-xs text-slate-600">
                <span className="text-emerald-700 font-semibold block">Drum Empty & Clean</span>
                <span>Ready for an instant load or scheduled reservation.</span>
              </div>
            )}

            {isReserved && (
              <div className="space-y-1">
                <div className="text-xs font-semibold text-amber-900">
                  {isUserReserved ? "Reserved by You" : `Reserved by ${machine.currentBooking?.userName}`}
                </div>
                <div className="text-[11px] text-slate-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    Awaiting check-in • {machine.currentBooking?.remainingMinutes || 40}m slot
                  </span>
                </div>
              </div>
            )}

            {isInUse && (
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-sky-900">
                    {machine.currentBooking?.remainingMinutes || 20} min left
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Finishes ~{formatFinishTime(machine.currentBooking?.endTime)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-sky-500 h-1.5 rounded-full w-2/3 animate-pulse" />
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {machine.currentBooking?.cycleType}
                </div>
              </div>
            )}

            {isBroken && (
              <div className="space-y-1 text-xs">
                <span className="font-bold text-rose-700 block flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Maintenance In Progress
                </span>
                <p className="text-[11px] text-slate-600 leading-tight">
                  {machine.maintenanceReason || "Temporarily offline for scheduled repairs."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {machine.features.map((feat, i) => (
            <span
              key={i}
              className="text-[10px] font-medium bg-white text-slate-600 border border-slate-200/90 px-2 py-0.5 rounded-md"
            >
              {feat}
            </span>
          ))}
        </div>
      </div>

      {/* Card Actions Bottom */}
      <div className="pt-2 mt-1 border-t border-slate-100">
        {isReady && (
          <button
            onClick={() => onBook(machine)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Select Slot & Book</span>
          </button>
        )}

        {isReserved && isUserReserved && (
          <button
            onClick={() => onCheckIn(machine.id)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>I'm Here • Start Cycle</span>
          </button>
        )}

        {isReserved && !isUserReserved && (
          <button
            onClick={() => onBook(machine)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
          >
            <span>Book Future Slot</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}

        {isInUse && (
          <button
            onClick={() => onBook(machine)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
          >
            <span>Reserve Next Available Slot</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}

        {isBroken && (
          <button
            onClick={() => onReportIssue(machine)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-500 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100"
          >
            <span>View Repair Status</span>
          </button>
        )}
      </div>
    </div>
  );
}

