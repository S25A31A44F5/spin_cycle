import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MachineCard from './components/MachineCard';
import ActiveBookingDrawer from './components/ActiveBookingDrawer';
import BookingModal from './components/BookingModal';
import QRScannerModal from './components/QRScannerModal';
import MachineQRModal from './components/MachineQRModal';
import WaitlistModal from './components/WaitlistModal';
import ReportIssueModal from './components/ReportIssueModal';
import CommunitySection from './components/CommunitySection';
import SpinOfTheDay from './components/SpinOfTheDay';
import ManagerDashboard from './components/ManagerDashboard';

import { 
  INITIAL_ROOM_SETTINGS, 
  RESIDENT_PROFILES, 
  INITIAL_MACHINES, 
  INITIAL_REPORTS, 
  INITIAL_WAITLIST,
  KUDOS_PRESETS
} from './mockData';

import { 
  Sparkles, 
  Filter, 
  PlusCircle, 
  AlertCircle, 
  Users, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Flag,
  RotateCw,
  BellRing
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // App Core State
  const [roomSettings, setRoomSettings] = useState(INITIAL_ROOM_SETTINGS);
  const [residents, setResidents] = useState(RESIDENT_PROFILES);
  const [currentResident, setCurrentResident] = useState(RESIDENT_PROFILES[0]);
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [waitlist, setWaitlist] = useState(INITIAL_WAITLIST);
  const [kudosLog, setKudosLog] = useState([
    { from: "Liam O.", to: "Maya S.", message: "✨ Left the washer drum spotless!", time: "1 hour ago" },
    { from: "Elena R.", to: "Alex R.", message: "⏰ Prompt pickup right on time!", time: "Yesterday" }
  ]);

  // View & UI Navigation
  const [currentView, setCurrentView] = useState("resident"); // "resident" | "manager"
  const [filterMode, setFilterMode] = useState("all"); // "all" | "ready" | "mine"
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  // Modals State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedMachineForBooking, setSelectedMachineForBooking] = useState(null);

  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [selectedMachineForQR, setSelectedMachineForQR] = useState(null);

  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetMachine, setReportTargetMachine] = useState(null);

  // Waitlist offered slot
  const [offeredSlot, setOfferedSlot] = useState(null);
  const [autoReleaseBanner, setAutoReleaseBanner] = useState(null);

  // Find active reservation for the currently selected resident
  const userActiveReservationMachine = machines.find(
    (m) => m.currentBooking && m.currentBooking.userId === currentResident.id
  );
  const userActiveBooking = userActiveReservationMachine?.currentBooking || null;

  // Count active reservations for current user
  const userActiveBookingsCount = machines.filter(
    (m) => m.currentBooking && m.currentBooking.userId === currentResident.id
  ).length;

  // Real-time Timer Tick (grace period and cycle countdown)
  useEffect(() => {
    const timer = setInterval(() => {
      setMachines((prevMachines) => {
        let hasChanges = false;
        const now = Date.now();

        const updated = prevMachines.map((m) => {
          if (!m.currentBooking) return m;

          // 1. Check Grace Period Auto-Release if not checked in
          if (!m.currentBooking.isCheckedIn && m.currentBooking.gracePeriodEndsAt) {
            const graceTime = new Date(m.currentBooking.gracePeriodEndsAt).getTime();
            if (now >= graceTime) {
              hasChanges = true;
              // Trigger auto-release
              setAutoReleaseBanner({
                machineName: m.name,
                message: `Reservation on ${m.name} was automatically released due to grace period expiration. Slot offered to waitlist.`,
              });

              // If there is someone on waitlist, offer the slot!
              if (waitlist.length > 0) {
                setOfferedSlot({
                  machineId: m.id,
                  machineName: m.name,
                });
              }

              return {
                ...m,
                status: "Ready",
                currentBooking: null,
              };
            }
          }

          // 2. Decrement remaining minutes for active cycles
          if (m.currentBooking.isCheckedIn && m.currentBooking.remainingMinutes > 0) {
            // Simulated slow decrement
            return m;
          }

          return m;
        });

        return hasChanges ? updated : prevMachines;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [waitlist]);

  // Handler: "I'm Here" Check In (from button or QR scan)
  const handleCheckIn = (machineId) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id === machineId && m.currentBooking) {
          return {
            ...m,
            status: "In Use",
            currentBooking: {
              ...m.currentBooking,
              isCheckedIn: true,
              remainingMinutes: 40,
            },
          };
        }
        return m;
      })
    );

    // Increase community goal on timely check in
    setRoomSettings((prev) => ({
      ...prev,
      communityGoalCurrent: Math.min(prev.communityGoalTarget, prev.communityGoalCurrent + 1),
    }));
  };

  // Handler: Fast forward grace timer to test auto-release
  const handleFastForwardGrace = () => {
    if (!userActiveReservationMachine) return;
    
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id === userActiveReservationMachine.id) {
          return {
            ...m,
            status: "Ready",
            currentBooking: null,
          };
        }
        return m;
      })
    );

    setAutoReleaseBanner({
      machineName: userActiveReservationMachine.name,
      message: `[Demo] Grace period expired! Reservation on ${userActiveReservationMachine.name} was auto-released back to community.`,
    });

    if (waitlist.length > 0) {
      setOfferedSlot({
        machineId: userActiveReservationMachine.id,
        machineName: userActiveReservationMachine.name,
      });
    }
  };

  // Handler: Cancel Booking
  const handleCancelBooking = (machineId) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id === machineId) {
          return {
            ...m,
            status: "Ready",
            currentBooking: null,
          };
        }
        return m;
      })
    );
  };

  // Handler: Finish Cycle Early
  const handleFinishEarly = (machineId) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id === machineId) {
          return {
            ...m,
            status: "Ready",
            currentBooking: null,
          };
        }
        return m;
      })
    );

    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#0284c7', '#34d399', '#f59e0b']
    });

    // Award neighbor karma
    setRoomSettings((prev) => ({
      ...prev,
      communityGoalCurrent: Math.min(prev.communityGoalTarget, prev.communityGoalCurrent + 1),
    }));

    // If waitlist exists, notify them that a slot just freed early!
    if (waitlist.length > 0) {
      const targetMachine = machines.find(m => m.id === machineId);
      setOfferedSlot({
        machineId: machineId,
        machineName: targetMachine?.name || "Washer",
      });
    }
  };

  // Handler: Extend Booking Slot (Only if next slot is open!)
  const handleExtendSlot = (machineId, additionalMinutes = 15) => {
    // In our prototype, Washer 2 has a simulated next reservation, while Washer 3 is extendable
    const target = machines.find((m) => m.id === machineId);
    if (!target || !target.currentBooking) {
      return { success: false, message: "No active cycle found." };
    }

    // Check availability rule: "Allow extensions only when the next slot is available"
    if (machineId === "wm-2") {
      return {
        success: false,
        message: "Extension denied: Washer 2 is reserved for Jordan Reed starting at 12:00 PM.",
      };
    }

    // Otherwise allow extension
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id === machineId && m.currentBooking) {
          return {
            ...m,
            currentBooking: {
              ...m.currentBooking,
              remainingMinutes: (m.currentBooking.remainingMinutes || 20) + additionalMinutes,
            },
          };
        }
        return m;
      })
    );

    return {
      success: true,
      message: `Successfully extended by ${additionalMinutes} minutes!`,
    };
  };

  // Handler: Confirm New Booking from Modal
  const handleConfirmBooking = ({ machineId, dateLabel, timeSlot, cycleType }) => {
    const graceEndsAt = new Date(Date.now() + roomSettings.gracePeriodMinutes * 60 * 1000).toISOString();

    setMachines((prev) =>
      prev.map((m) => {
        if (m.id === machineId) {
          return {
            ...m,
            status: "Reserved",
            currentBooking: {
              id: `bk-${Date.now().toString().slice(-4)}`,
              userId: currentResident.id,
              userName: `${currentResident.name} (${currentResident.room})`,
              startTime: new Date().toISOString(),
              endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
              cycleType: cycleType,
              isCheckedIn: false,
              gracePeriodEndsAt: graceEndsAt,
              remainingMinutes: 45,
            },
          };
        }
        return m;
      })
    );
  };

  // Waitlist Handlers
  const handleJoinWaitlist = (entry) => {
    setWaitlist((prev) => [...prev, { ...entry, id: `wt-${Date.now()}` }]);
  };

  const handleLeaveWaitlist = (userId) => {
    setWaitlist((prev) => prev.filter((w) => w.userId !== userId));
  };

  const handleAcceptOfferedSlot = () => {
    if (!offeredSlot) return;
    const target = machines.find(m => m.id === offeredSlot.machineId);
    
    // Automatically book the offered slot for the user
    handleConfirmBooking({
      machineId: offeredSlot.machineId,
      dateLabel: "Today",
      timeSlot: "Now",
      cycleType: "Normal Cotton (45 min)",
    });

    // Remove user from waitlist
    handleLeaveWaitlist(currentResident.id);
    setOfferedSlot(null);
  };

  const handleDeclineOfferedSlot = () => {
    setOfferedSlot(null);
  };

  // Report Submission Handler
  const handleSubmitReport = (newReport) => {
    setReports((prev) => [newReport, ...prev]);

    // If report has High severity, automatically block machine for repairs
    if (newReport.severity === "High") {
      setMachines((prev) =>
        prev.map((m) => {
          if (m.id === newReport.machineId) {
            return {
              ...m,
              status: "Needs Repair",
              maintenanceReason: `Reported issue: ${newReport.issueType}. Safety lock active.`,
            };
          }
          return m;
        })
      );
    }
  };

  // Manager Maintenance Toggle Handler
  const handleToggleMachineMaintenance = (machineId, block, reason = "") => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id === machineId) {
          return {
            ...m,
            status: block ? "Needs Repair" : "Ready",
            maintenanceReason: block ? reason : null,
            currentBooking: block ? null : m.currentBooking,
          };
        }
        return m;
      })
    );
  };

  // Manager Report Status Handler
  const handleUpdateReportStatus = (reportId, newStatus) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
    );
  };

  // Manager Resolve and Restore Washer Handler
  const handleResolveReportAndUnblock = (reportId, machineId) => {
    handleUpdateReportStatus(reportId, "Resolved");
    handleToggleMachineMaintenance(machineId, false);
  };

  // Kudos Handler
  const handleSendKudo = (kudo) => {
    setKudosLog((prev) => [kudo, ...prev]);
    // increment current resident kudos received or sent
    setResidents((prev) =>
      prev.map((r) => (r.id === currentResident.id ? { ...r, kudosReceived: r.kudosReceived + 1 } : r))
    );
  };

  // Filtered Machines
  const filteredMachines = machines.filter((m) => {
    if (filterMode === "ready") return m.status === "Ready";
    if (filterMode === "mine") return m.currentBooking?.userId === currentResident.id;
    return true;
  });

  const readyCount = machines.filter((m) => m.status === "Ready").length;
  const inUseCount = machines.filter((m) => m.status === "In Use").length;
  const reservedCount = machines.filter((m) => m.status === "Reserved").length;

  return (
    <div className={`min-h-screen bg-slate-100 flex flex-col font-sans transition-all duration-300 ${
      isPhoneFrame ? "py-6 px-2 sm:px-4 flex items-center justify-center" : ""
    }`}>
      
      {/* Container - adapts to normal responsive desktop or simulated mobile viewport frame */}
      <div className={`w-full transition-all duration-300 bg-white ${
        isPhoneFrame 
          ? "max-w-[420px] rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden min-h-[860px] relative" 
          : "max-w-6xl mx-auto shadow-xs border-x border-slate-200 min-h-screen"
      }`}>
        
        {/* Simulated Phone Notch / Speaker Bar if Phone Frame is Active */}
        {isPhoneFrame && (
          <div className="bg-slate-900 text-white pt-3 pb-1 px-7 flex items-center justify-between text-xs select-none">
            <span className="font-semibold text-[11px]">9:41</span>
            <div className="w-24 h-4 bg-slate-950 rounded-full flex items-center justify-center">
              <div className="w-10 h-1 bg-slate-800 rounded-full" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Global Navigation Bar */}
        <Navbar
          currentView={currentView}
          onViewChange={setCurrentView}
          residents={residents}
          currentResident={currentResident}
          onResidentChange={setCurrentResident}
          waitlistCount={waitlist.length}
          onOpenWaitlist={() => setIsWaitlistModalOpen(true)}
          onOpenQRScanner={() => setIsQRScannerOpen(true)}
          onOpenReport={() => {
            setReportTargetMachine(null);
            setIsReportModalOpen(true);
          }}
          isPhoneFrame={isPhoneFrame}
          onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        />

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 md:p-8">
          
          {/* Top Banner Alert if Grace Expired or Washer Freed */}
          {autoReleaseBanner && (
            <div className="mb-5 bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 flex items-start justify-between gap-3 text-xs text-amber-900 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{autoReleaseBanner.message}</span>
              </div>
              <button
                onClick={() => setAutoReleaseBanner(null)}
                className="text-amber-700 hover:text-amber-950 font-bold p-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Waitlist Offered Slot Banner */}
          {offeredSlot && currentView === "resident" && (
            <div className="mb-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-bounce-once">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <BellRing className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                    Waitlist Alert • Washer Available Now!
                  </div>
                  <div className="text-sm font-black">{offeredSlot.machineName} is free for you</div>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleAcceptOfferedSlot}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-white text-emerald-800 text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-50 transition-all cursor-pointer"
                >
                  Accept & Book
                </button>
                <button
                  onClick={handleDeclineOfferedSlot}
                  className="px-3 py-2 text-white/80 hover:text-white text-xs font-semibold rounded-xl"
                >
                  Pass
                </button>
              </div>
            </div>
          )}

          {/* VIEW: RESIDENT VIEW */}
          {currentView === "resident" && (
            <div className="space-y-6">
              
              {/* Dismissible Spin of the Day */}
              <SpinOfTheDay />

              {/* Active User Reservation Card (if exists) */}
              {userActiveBooking && (
                <ActiveBookingDrawer
                  activeBooking={userActiveBooking}
                  machine={userActiveReservationMachine}
                  roomSettings={roomSettings}
                  onCheckIn={handleCheckIn}
                  onCancel={handleCancelBooking}
                  onFinishEarly={handleFinishEarly}
                  onExtendSlot={handleExtendSlot}
                  onOpenQRScanner={() => setIsQRScannerOpen(true)}
                  onFastForwardGrace={handleFastForwardGrace}
                />
              )}

              {/* Room Overview Header & Live Status Pills */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">
                      Laundry Room Overview
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Room Status
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Operating Hours: {roomSettings.operatingHours.open} – {roomSettings.operatingHours.close} • {roomSettings.slotLengthMinutes} min cycles
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto text-xs font-bold">
                  <button
                    onClick={() => setFilterMode("all")}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      filterMode === "all"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    All ({machines.length})
                  </button>
                  <button
                    onClick={() => setFilterMode("ready")}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      filterMode === "ready"
                        ? "bg-white text-emerald-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Ready ({readyCount})
                  </button>
                  <button
                    onClick={() => setFilterMode("mine")}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      filterMode === "mine"
                        ? "bg-white text-sky-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Mine ({userActiveBookingsCount})
                  </button>
                </div>
              </div>

              {/* Machines Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMachines.map((machine) => (
                  <MachineCard
                    key={machine.id}
                    machine={machine}
                    currentResident={currentResident}
                    onBook={(m) => {
                      setSelectedMachineForBooking(m);
                      setIsBookingModalOpen(true);
                    }}
                    onCheckIn={handleCheckIn}
                    onShowQR={(m) => setSelectedMachineForQR(m)}
                    onReportIssue={(m) => {
                      setReportTargetMachine(m);
                      setIsReportModalOpen(true);
                    }}
                  />
                ))}
              </div>

              {/* Room Waitlist Callout if busy or user wants to queue */}
              <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/80 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Need a machine later or all taken?
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Join the room waitlist. We dispatch open slots fairly on a first-come basis with automatic grace-period notifications.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsWaitlistModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Join Room Waitlist</span>
                </button>
              </div>

              {/* Community, Streaks & Kudos Section */}
              <CommunitySection
                currentResident={currentResident}
                roomSettings={roomSettings}
                onSendKudo={handleSendKudo}
                kudosLog={kudosLog}
              />
            </div>
          )}

          {/* VIEW: MANAGER DASHBOARD */}
          {currentView === "manager" && (
            <ManagerDashboard
              roomSettings={roomSettings}
              onUpdateSettings={setRoomSettings}
              machines={machines}
              onToggleMachineMaintenance={handleToggleMachineMaintenance}
              reports={reports}
              onUpdateReportStatus={handleUpdateReportStatus}
              onResolveReportAndUnblock={handleResolveReportAndUnblock}
            />
          )}
        </main>

        {/* Mobile Sticky Quick Action Bar */}
        {currentView === "resident" && (
          <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center justify-around gap-2 text-xs font-bold text-slate-600">
            <button
              onClick={() => {
                setSelectedMachineForBooking(machines[0]);
                setIsBookingModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book Washer</span>
            </button>

            <button
              onClick={() => setIsQRScannerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl cursor-pointer"
            >
              <span>Scan QR Code</span>
            </button>

            <button
              onClick={() => {
                setReportTargetMachine(null);
                setIsReportModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-rose-600 rounded-xl cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report Issue</span>
            </button>
          </div>
        )}

        {/* MODALS */}
        {/* 1. Booking Modal */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          machine={selectedMachineForBooking || machines[0]}
          allMachines={machines}
          currentResident={currentResident}
          userActiveBookingsCount={userActiveBookingsCount}
          roomSettings={roomSettings}
          onConfirmBooking={handleConfirmBooking}
        />

        {/* 2. QR Scanner Modal */}
        <QRScannerModal
          isOpen={isQRScannerOpen}
          onClose={() => setIsQRScannerOpen(false)}
          machines={machines}
          activeReservation={
            userActiveReservationMachine
              ? {
                  machineId: userActiveReservationMachine.id,
                  machineName: userActiveReservationMachine.name,
                }
              : null
          }
          onCheckIn={handleCheckIn}
        />

        {/* 3. On-Machine Sticker QR Plaque Modal */}
        <MachineQRModal
          machine={selectedMachineForQR}
          onClose={() => setSelectedMachineForQR(null)}
          onQuickCheckIn={(mId) => {
            handleCheckIn(mId);
            setSelectedMachineForQR(null);
          }}
        />

        {/* 4. Room Waitlist Modal */}
        <WaitlistModal
          isOpen={isWaitlistModalOpen}
          onClose={() => setIsWaitlistModalOpen(false)}
          waitlist={waitlist}
          currentResident={currentResident}
          onJoinWaitlist={handleJoinWaitlist}
          onLeaveWaitlist={handleLeaveWaitlist}
          offeredSlot={offeredSlot}
          onAcceptOfferedSlot={handleAcceptOfferedSlot}
          onDeclineOfferedSlot={handleDeclineOfferedSlot}
        />

        {/* 5. Machine Fault & Supplies Report Modal */}
        <ReportIssueModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          preselectedMachine={reportTargetMachine}
          allMachines={machines}
          currentResident={currentResident}
          onSubmitReport={handleSubmitReport}
        />
      </div>
    </div>
  );
}
