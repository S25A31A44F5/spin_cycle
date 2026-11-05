import React, { useState } from 'react';
import { 
  Sliders, 
  Wrench, 
  Clock, 
  BarChart3, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Power, 
  RotateCcw, 
  Filter,
  Check,
  UserCheck,
  Flame,
  ChevronDown
} from 'lucide-react';
import { HOURLY_USAGE_DATA } from '../mockData';

export default function ManagerDashboard({
  roomSettings,
  onUpdateSettings,
  machines,
  onToggleMachineMaintenance,
  reports,
  onUpdateReportStatus,
  onResolveReportAndUnblock
}) {
  const [activeTab, setActiveTab] = useState("settings"); // "settings" | "machines" | "reports" | "trends"
  const [reportFilter, setReportFilter] = useState("All");

  const [localSettings, setLocalSettings] = useState({ ...roomSettings });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 2500);
  };

  const filteredReports = reports.filter((r) => {
    if (reportFilter === "All") return true;
    return r.status === reportFilter;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Manager Header & Stats Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Building Operations & Facilities</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
              {roomSettings.roomName}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Configure room policies, manage washer maintenance, and monitor fair usage.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0 text-center">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 border border-white/10">
              <div className="text-lg font-black text-emerald-400">
                {machines.filter(m => m.status === "Ready").length} / {machines.length}
              </div>
              <div className="text-[10px] text-slate-300 uppercase font-semibold">Ready Now</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 border border-white/10">
              <div className="text-lg font-black text-amber-400">
                {reports.filter(r => r.status === "Open").length}
              </div>
              <div className="text-[10px] text-slate-300 uppercase font-semibold">Open Tickets</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 border border-white/10">
              <div className="text-lg font-black text-sky-400">4.2%</div>
              <div className="text-[10px] text-slate-300 uppercase font-semibold">No-Show Rate</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "settings"
                ? "bg-white text-slate-900 shadow-md"
                : "bg-white/10 text-slate-200 hover:bg-white/20"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Room Rules & Hours</span>
          </button>

          <button
            onClick={() => setActiveTab("machines")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "machines"
                ? "bg-white text-slate-900 shadow-md"
                : "bg-white/10 text-slate-200 hover:bg-white/20"
            }`}
          >
            <Power className="w-4 h-4" />
            <span>Machine Fleet & Repairs</span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "reports"
                ? "bg-white text-slate-900 shadow-md"
                : "bg-white/10 text-slate-200 hover:bg-white/20"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Resident Reports ({reports.filter(r => r.status === 'Open').length} new)</span>
          </button>

          <button
            onClick={() => setActiveTab("trends")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "trends"
                ? "bg-white text-slate-900 shadow-md"
                : "bg-white/10 text-slate-200 hover:bg-white/20"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Usage & Peak Trends</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ROOM RULES & SETTINGS */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Room Operating Policies</h3>
              <p className="text-xs text-slate-500">Fine-tune laundry slots, grace periods, and fair share rules</p>
            </div>
            {settingsSavedToast && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Changes saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Operating Hours */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Laundry Room Operating Hours
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="24hours"
                  checked={localSettings.operatingHours.is24Hours}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      operatingHours: {
                        ...localSettings.operatingHours,
                        is24Hours: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-sky-600 cursor-pointer"
                />
                <label htmlFor="24hours" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  Open 24/7 (No overnight quiet hours)
                </label>
              </div>

              {!localSettings.operatingHours.is24Hours && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium">Opening Time</span>
                    <input
                      type="time"
                      value={localSettings.operatingHours.open}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          operatingHours: {
                            ...localSettings.operatingHours,
                            open: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium">Closing Time</span>
                    <input
                      type="time"
                      value={localSettings.operatingHours.close}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          operatingHours: {
                            ...localSettings.operatingHours,
                            close: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Slot Length */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Default Booking Slot Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[30, 45, 60].map((mins) => (
                  <button
                    type="button"
                    key={mins}
                    onClick={() => setLocalSettings({ ...localSettings, slotLengthMinutes: mins })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      localSettings.slotLengthMinutes === mins
                        ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Determines the schedule grid interval for laundry reservations.
              </p>
            </div>

            {/* Grace Period */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Check-In Grace Period Window
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((mins) => (
                  <button
                    type="button"
                    key={mins}
                    onClick={() => setLocalSettings({ ...localSettings, gracePeriodMinutes: mins })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      localSettings.gracePeriodMinutes === mins
                        ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Reservation automatically releases to waitlist if no check-in occurs within this time.
              </p>
            </div>

            {/* Booking Limits & Fairness */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Fairness & Booking Limits
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Max Active Slots / User</span>
                  <select
                    value={localSettings.maxActiveBookingsPerUser}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        maxActiveBookingsPerUser: Number(e.target.value),
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value={1}>1 Active Booking</option>
                    <option value={2}>2 Active Bookings</option>
                    <option value={3}>3 Active Bookings</option>
                  </select>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Advance Window</span>
                  <select
                    value={localSettings.advanceBookingDays}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        advanceBookingDays: Number(e.target.value),
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value={1}>1 Day (Same / Next)</option>
                    <option value={2}>2 Days</option>
                    <option value={3}>3 Days in Advance</option>
                    <option value={7}>7 Days (Full Week)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Save Policy Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: MACHINE FLEET & REPAIRS */}
      {activeTab === "machines" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Washer Fleet Status & Maintenance Block</h3>
            <p className="text-xs text-slate-500">Toggle machines offline for service or take them back online</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {machines.map((machine) => {
              const isBroken = machine.status === "Needs Repair";
              return (
                <div
                  key={machine.id}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all ${
                    isBroken
                      ? "border-rose-300 bg-rose-50/30"
                      : "border-slate-200 bg-slate-50/50"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        {machine.code}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{machine.name}</h4>
                    </div>
                    <p className="text-xs text-slate-500">{machine.location} • {machine.type}</p>
                    {isBroken && (
                      <p className="text-[11px] text-rose-700 font-medium">
                        Blocked: {machine.maintenanceReason || "Service pending"}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isBroken ? (
                      <button
                        onClick={() => onToggleMachineMaintenance(machine.id, false)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Unblock / Online</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const reason = window.prompt("Reason for blocking this washer (optional):", "Routine maintenance / filter clean");
                          onToggleMachineMaintenance(machine.id, true, reason || "Blocked by manager for maintenance");
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Block for Repair</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: RESIDENT REPORTS */}
      {activeTab === "reports" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Resident Fault & Supplies Reports</h3>
              <p className="text-xs text-slate-500">Triage incoming issues from residents</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {["All", "Open", "In Progress", "Resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setReportFilter(status)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    reportFilter === status
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredReports.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No reports found matching "{reportFilter}".
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        report.severity === "High"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}>
                        {report.severity} Severity
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{report.machineName}</h4>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-700">{report.issueType}</span>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full self-start sm:self-auto ${
                      report.status === "Open"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : report.status === "In Progress"
                        ? "bg-sky-50 text-sky-700 border border-sky-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {report.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{report.description}"
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 pt-1">
                    <div>
                      Reported by <span className="font-semibold text-slate-700">{report.reportedBy}</span> ({report.timestamp})
                    </div>

                    {/* Status Action Buttons */}
                    <div className="flex gap-2">
                      {report.status === "Open" && (
                        <button
                          onClick={() => onUpdateReportStatus(report.id, "In Progress")}
                          className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg border border-sky-200 transition-colors"
                        >
                          Mark In Progress
                        </button>
                      )}

                      {report.status !== "Resolved" && (
                        <button
                          onClick={() => onResolveReportAndUnblock(report.id, report.machineId)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Resolve & Restore Washer</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: USAGE TRENDS & PEAK TIMES */}
      {activeTab === "trends" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Room Demand & Peak Usage Trends</h3>
            <p className="text-xs text-slate-500">Hourly washer utilization based on past 30 days of data</p>
          </div>

          {/* Peak Hours Visualizer */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Peak Load Hours (High Demand: 7:00 PM – 9:30 PM)</span>
              </span>
              <span className="text-slate-400 font-normal">Capacity: 6 Washers Max</span>
            </div>

            {/* Custom Bar Visualizer */}
            <div className="grid grid-cols-6 sm:grid-cols-12 md:grid-cols-17 gap-1.5 pt-4 pb-2 items-end h-40 bg-slate-50 rounded-2xl p-4 border border-slate-200">
              {HOURLY_USAGE_DATA.map((item, idx) => {
                const heightPercent = (item.count / 6) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        item.peak
                          ? "bg-rose-500 group-hover:bg-rose-600"
                          : item.busy
                          ? "bg-amber-500 group-hover:bg-amber-600"
                          : "bg-sky-400 group-hover:bg-sky-500"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                      title={`${item.hour}: ${item.count} washers active`}
                    />
                    <span className="text-[9px] font-semibold text-slate-500 mt-1 truncate">
                      {item.hour.replace(" ", "")}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600 pt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-sky-400" />
                <span>Low / Fair Opportunity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>Busy (Suggest off-peak)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500" />
                <span>Peak Room Rush Hour</span>
              </div>
            </div>
          </div>

          {/* Missed Check-ins & Efficiency Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Missed Check-ins
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">4.2%</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Slots automatically reclaimed by grace period and given to waitlist.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Early Unload Rate
              </span>
              <div className="text-2xl font-black text-emerald-600 mt-1">38%</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Residents who clicked "Finish Early", saving 420 idle washer minutes this week.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Waitlist Match Speed
              </span>
              <div className="text-2xl font-black text-sky-600 mt-1">&lt; 8 mins</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Average wait time before a resident receives an available machine offer.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

