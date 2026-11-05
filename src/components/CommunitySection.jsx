import React, { useState } from 'react';
import { Flame, Heart, Sparkles, Send, ShieldCheck, Users, CheckCircle2 } from 'lucide-react';
import { KUDOS_PRESETS } from '../mockData';
import confetti from 'canvas-confetti';

export default function CommunitySection({ 
  currentResident, 
  roomSettings, 
  onSendKudo,
  kudosLog = []
}) {
  const [selectedPreset, setSelectedPreset] = useState(KUDOS_PRESETS[0]);
  const [customRecipient, setCustomRecipient] = useState("Maya Sharma (Apt 412)");
  const [showKudoModal, setShowKudoModal] = useState(false);
  const [kudoSentSuccess, setKudoSentSuccess] = useState(false);

  const goalPercent = Math.min(
    100,
    Math.round((roomSettings.communityGoalCurrent / roomSettings.communityGoalTarget) * 100)
  );

  const handleSendKudo = (e) => {
    e.preventDefault();
    onSendKudo({
      from: currentResident.name,
      to: customRecipient,
      message: selectedPreset,
      time: "Just now",
    });

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#38bdf8', '#34d399', '#f472b6', '#fbbf24']
    });

    setKudoSentSuccess(true);
    setTimeout(() => {
      setKudoSentSuccess(false);
      setShowKudoModal(false);
    }, 1800);
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Community Goal & Streak Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Low-pressure Streak Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                Care Streak
              </span>
              <span className="text-xs text-slate-500">• {currentResident.badge}</span>
            </div>
            <h4 className="text-base font-bold text-slate-800 mt-0.5">
              {currentResident.streakWeeks} On-Time Pickups
            </h4>
            <p className="text-xs text-slate-500">
              Low-stress habit: clothes picked up within 15 min of cycle end.
            </p>
          </div>
        </div>

        {/* Community Goal (Cooperative, Not Competitive!) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Building Team Goal
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {roomSettings.communityGoalCurrent} / {roomSettings.communityGoalTarget} completed
            </span>
          </div>

          <div className="mt-2.5">
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span className="font-medium">Weekly Smooth Cycles:</span>
              <span className="font-bold text-slate-800">{goalPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Reach 100 on-time pickups = Free eco-detergent restocked for all!</span>
            </p>
          </div>
        </div>
      </div>

      {/* Kudos Bar */}
      <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 border border-pink-200/70 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-pink-200 flex items-center justify-center text-rose-500 shrink-0">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="text-sm font-bold text-slate-800">Friendly Neighbor Kudos</h5>
              <span className="text-[11px] font-semibold text-rose-600 bg-rose-100 px-2 py-0.2 rounded-full">
                {currentResident.kudosReceived} received
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Notice a neighbor who wiped a spill or unloaded swiftly? Brighten their day!
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowKudoModal(true)}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Send Quick Kudos</span>
        </button>
      </div>

      {/* Recent Kudos Marquee / Stream */}
      {kudosLog.length > 0 && (
        <div className="bg-white/80 rounded-xl border border-slate-200 p-2.5 flex items-center gap-2 text-xs text-slate-600 overflow-x-auto">
          <span className="font-bold text-slate-800 shrink-0 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" /> Recent:
          </span>
          {kudosLog.slice(-3).map((k, i) => (
            <div key={i} className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg shrink-0">
              <span className="font-medium text-slate-800">{k.from}</span>
              <span className="text-slate-400">→</span>
              <span className="font-medium text-slate-700">{k.to}:</span>
              <span className="text-slate-600 italic">"{k.message}"</span>
            </div>
          ))}
        </div>
      )}

      {/* Send Kudos Modal */}
      {showKudoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {kudoSentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-500 animate-bounce">
                  <Heart className="w-8 h-8 fill-rose-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Kudos Delivered! 🧺✨</h3>
                <p className="text-sm text-slate-600">
                  Thank you for keeping the Pinecrest laundry lounge friendly and kind!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendKudo} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Send Neighbor Kudos</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowKudoModal(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    To Neighbor
                  </label>
                  <select
                    value={customRecipient}
                    onChange={(e) => setCustomRecipient(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:outline-sky-500"
                  >
                    <option value="Maya Sharma (Apt 412)">Maya Sharma (Apt 412) - Washer 2</option>
                    <option value="Liam O'Connor (Apt 208)">Liam O'Connor (Apt 208)</option>
                    <option value="Elena Rostova (Apt 105)">Elena Rostova (Apt 105)</option>
                    <option value="Previous Washer User (Anonymous)">To the previous washer user</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Choose Friendly Message
                  </label>
                  <div className="space-y-2">
                    {KUDOS_PRESETS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedPreset(preset)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all border flex items-center justify-between ${
                          selectedPreset === preset
                            ? "bg-rose-50 border-rose-300 text-rose-900 font-semibold shadow-xs"
                            : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{preset}</span>
                        {selectedPreset === preset && <CheckCircle2 className="w-4 h-4 text-rose-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowKudoModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Deliver Kudos</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

