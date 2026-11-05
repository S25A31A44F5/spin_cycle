import React, { useState, useEffect } from 'react';
import { Camera, X, CheckCircle2, AlertCircle, Sparkles, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QRScannerModal({ 
  isOpen, 
  onClose, 
  machines = [], 
  activeReservation = null,
  onCheckIn 
}) {
  const [selectedMachineId, setSelectedMachineId] = useState(
    activeReservation ? activeReservation.machineId : (machines[0]?.id || "")
  );
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    if (activeReservation) {
      setSelectedMachineId(activeReservation.machineId);
    }
  }, [activeReservation]);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(false);
    const targetMachine = machines.find((m) => m.id === selectedMachineId);
    
    // Check if user has a reservation on this machine or if it matches
    const isMatchingActive = activeReservation && activeReservation.machineId === selectedMachineId;

    if (isMatchingActive) {
      setScanResult({
        success: true,
        message: `Verified! Checked in to ${targetMachine?.name || "Washer"}.`,
        machine: targetMachine,
      });

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        onCheckIn(selectedMachineId);
        onClose();
      }, 1500);
    } else if (activeReservation) {
      setScanResult({
        success: false,
        message: `You scanned ${targetMachine?.name}, but your reservation is for ${activeReservation.machineName}!`,
      });
    } else {
      setScanResult({
        success: false,
        message: `Scanned ${targetMachine?.name}. You don't have an active reservation for this washer yet.`,
      });
    }
  };

  const handleReset = () => {
    setIsScanning(true);
    setScanResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 text-white shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Washer QR Check-In</h3>
              <p className="text-[11px] text-slate-400">Point at the sticker on the machine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Simulator */}
        <div className="relative aspect-square rounded-2xl bg-slate-950 border-2 border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6 my-2 shadow-inner">
          {/* Subtle background camera noise / grid */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Viewfinder Corners */}
          <div className="absolute top-4 left-4 w-7 h-7 border-t-4 border-l-4 border-sky-400 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-7 h-7 border-t-4 border-r-4 border-sky-400 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-7 h-7 border-b-4 border-l-4 border-sky-400 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-7 h-7 border-b-4 border-r-4 border-sky-400 rounded-br-lg" />

          {/* Animated Scanning Laser Line */}
          {isScanning && (
            <div className="absolute inset-x-8 top-10 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-bounce duration-1000" />
          )}

          {/* Target Center Content */}
          {isScanning ? (
            <div className="text-center z-10 space-y-2">
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-sky-400/40 mx-auto flex items-center justify-center bg-sky-950/40">
                <QrCode className="w-8 h-8 text-sky-400/80 animate-pulse" />
              </div>
              <p className="text-xs font-medium text-slate-300">
                Align machine QR inside frame
              </p>
            </div>
          ) : scanResult?.success ? (
            <div className="text-center z-10 space-y-2 animate-in zoom-in-90">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <p className="text-sm font-bold text-emerald-400">Match Found!</p>
              <p className="text-xs text-slate-300 px-3">{scanResult.message}</p>
            </div>
          ) : (
            <div className="text-center z-10 space-y-2 animate-in zoom-in-90">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 mx-auto flex items-center justify-center">
                <AlertCircle className="w-9 h-9" />
              </div>
              <p className="text-sm font-bold text-rose-400">Check-in Issue</p>
              <p className="text-xs text-slate-300 px-3">{scanResult?.message}</p>
            </div>
          )}
        </div>

        {/* Machine Simulator Selector */}
        <div className="mt-3 space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Simulate aiming camera at:
          </label>
          <select
            value={selectedMachineId}
            onChange={(e) => {
              setSelectedMachineId(e.target.value);
              handleReset();
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-sky-500"
          >
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.code}) {activeReservation?.machineId === m.id ? "★ Your Reserved Machine" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-2">
          {isScanning ? (
            <button
              onClick={handleSimulateScan}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Capture & Check In</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all"
            >
              Scan Another QR
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

