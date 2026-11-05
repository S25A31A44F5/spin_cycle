import React from 'react';

export default function WasherIllustration({ 
  status = "Ready", 
  progressPercent = 0, 
  remainingMinutes = null,
  compact = false,
  animated = true 
}) {
  const isSpinning = status === "In Use" && animated;
  const isReserved = status === "Reserved";
  const isBroken = status === "Needs Repair";
  const isReady = status === "Ready";

  // Dynamic colors based on status
  const accentColor = isBroken 
    ? "#f43f5e" 
    : isReserved 
    ? "#f59e0b" 
    : isSpinning 
    ? "#0284c7" 
    : "#10b981";

  const statusLabel = isBroken 
    ? "OUT OF ORDER" 
    : isReserved 
    ? "RESERVED" 
    : isSpinning 
    ? `${remainingMinutes || 15}m LEFT` 
    : "READY";

  const sizeClass = compact ? "w-20 h-24" : "w-28 h-32 md:w-32 md:h-36";

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClass}`}>
      <svg
        viewBox="0 0 120 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-all duration-300"
      >
        {/* Machine Body Outer Shell */}
        <rect
          x="6"
          y="6"
          width="108"
          height="128"
          rx="14"
          fill="#FFFFFF"
          stroke={isBroken ? "#fecdd3" : isReserved ? "#fef3c7" : "#e2e8f0"}
          strokeWidth="3"
        />

        {/* Machine Top Shadow / Depth */}
        <path
          d="M6 20C6 12.268 12.268 6 20 6H100C107.732 6 114 12.268 114 20V24H6V20Z"
          fill="#f1f5f9"
        />

        {/* Detergent Drawer */}
        <rect
          x="14"
          y="10"
          width="24"
          height="10"
          rx="3"
          fill="#e2e8f0"
          stroke="#cbd5e1"
          strokeWidth="1"
        />
        <line x1="22" y1="13" x2="30" y2="13" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Digital Control Panel Display */}
        <rect
          x="44"
          y="9"
          width="44"
          height="12"
          rx="3"
          fill="#0f172a"
        />
        <text
          x="66"
          y="18"
          textAnchor="middle"
          fontSize="6.5"
          fontFamily="monospace"
          fontWeight="bold"
          fill={accentColor}
          letterSpacing="0.2"
        >
          {statusLabel}
        </text>

        {/* Control Dial Knobs */}
        <circle cx="98" cy="15" r="4.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="98" cy="15" r="2" fill="#64748b" />

        {/* Status Indicator LED light */}
        <circle 
          cx="106" 
          cy="15" 
          r="2.5" 
          fill={accentColor} 
          className={isSpinning ? "animate-ping opacity-75" : ""}
        />
        <circle cx="106" cy="15" r="2" fill={accentColor} />

        {/* Outer Door Ring */}
        <circle
          cx="60"
          cy="78"
          r="42"
          fill="#f8fafc"
          stroke={accentColor}
          strokeWidth={isSpinning ? "3" : "2"}
          strokeDasharray={isReserved ? "4 3" : undefined}
          className="transition-colors duration-500"
        />

        {/* Inner Glass Porthole */}
        <circle
          cx="60"
          cy="78"
          r="34"
          fill={isSpinning ? "#e0f2fe" : isBroken ? "#fff1f2" : "#f1f5f9"}
        />

        {/* Door Glass Reflection */}
        <path
          d="M38 58C46 50 74 50 82 58C86 62 87 66 87 70C76 60 44 60 33 70C33 66 34 62 38 58Z"
          fill="white"
          fillOpacity="0.5"
        />

        {/* Internal Drum Content */}
        {isSpinning && (
          <g className="animate-gentle-spin origin-[60px_78px]">
            {/* Spinning Clothes Shapes inside drum */}
            <circle cx="50" cy="72" r="11" fill="#38bdf8" fillOpacity="0.85" />
            <circle cx="70" cy="76" r="9" fill="#f43f5e" fillOpacity="0.75" />
            <circle cx="60" cy="88" r="12" fill="#fbbf24" fillOpacity="0.8" />
            <circle cx="58" cy="68" r="8" fill="#34d399" fillOpacity="0.85" />
            {/* Water bubbles */}
            <circle cx="48" cy="86" r="3.5" fill="white" fillOpacity="0.9" />
            <circle cx="72" cy="66" r="2.5" fill="white" fillOpacity="0.9" />
            <circle cx="62" cy="78" r="4" fill="white" fillOpacity="0.7" />
          </g>
        )}

        {isReserved && (
          <g>
            {/* Hourglass or reservation clock badge inside */}
            <circle cx="60" cy="78" r="16" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="60" cy="78" r="13" fill="#fde68a" />
            {/* Clock hands */}
            <line x1="60" y1="78" x2="60" y2="70" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
            <line x1="60" y1="78" x2="66" y2="78" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
            <circle cx="60" cy="78" r="2" fill="#78350f" />
          </g>
        )}

        {isBroken && (
          <g>
            {/* Wrench and Alert inside */}
            <circle cx="60" cy="78" r="16" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="1.5" />
            <path
              d="M55 70L65 86M57 68C54 70 54 74 57 76L61 72C60 70 59 69 57 68ZM63 88C66 86 66 82 63 80L59 84C60 86 61 87 63 88Z"
              stroke="#be123c"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {isReady && (
          <g>
            {/* Sparkling clean fresh drum */}
            <circle cx="60" cy="78" r="24" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
            {/* Sparkle stars */}
            <path
              d="M60 68L61.5 73.5L67 75L61.5 76.5L60 82L58.5 76.5L53 75L58.5 73.5L60 68Z"
              fill="#10b981"
            />
            <circle cx="48" cy="84" r="2" fill="#34d399" />
            <circle cx="72" cy="72" r="1.5" fill="#34d399" />
          </g>
        )}

        {/* Door Handle */}
        <rect
          x="96"
          y="72"
          width="4"
          height="12"
          rx="2"
          fill="#94a3b8"
        />

        {/* Machine Bottom Kickplate & Feet */}
        <line x1="12" y1="124" x2="108" y2="124" stroke="#e2e8f0" strokeWidth="1.5" />
        <rect x="18" y="132" width="10" height="4" rx="1.5" fill="#64748b" />
        <rect x="92" y="132" width="10" height="4" rx="1.5" fill="#64748b" />
      </svg>
    </div>
  );
}

