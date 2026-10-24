import React from 'react';

interface Props {
  isScanning: boolean;
  tested: number;
  found: number;
  phase: string;
}

export const CyberRadar: React.FC<Props> = ({ isScanning, tested, found, phase }) => {
  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
      {/* Outer concentric rings */}
      <div className="absolute inset-0 rounded-full border border-[#1A2530] bg-[#0A0D12]/60" />
      <div className="absolute inset-4 rounded-full border border-[#1A2530]/80" />
      <div className="absolute inset-10 rounded-full border border-[#00FF99]/20" />
      <div className="absolute inset-16 rounded-full border border-[#00FF99]/30" />

      {/* Crosshair grid lines */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-[#00FF99]/20" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-[#00FF99]/20" />

      {/* Rotating sweep */}
      {isScanning && (
        <div className="absolute inset-0 rounded-full overflow-hidden animate-radar-sweep pointer-events-none">
          <div
            className="w-1/2 h-1/2 origin-bottom-right"
            style={{
              background: 'conic-gradient(from 180deg at 100% 100%, rgba(0, 255, 153, 0.4) 0deg, transparent 60deg)',
            }}
          />
        </div>
      )}

      {/* Floating blips */}
      {isScanning && (
        <>
          <div className="absolute top-10 right-14 w-2 h-2 rounded-full bg-[#00FF99] shadow-[0_0_8px_#00FF99] animate-ping" />
          <div className="absolute bottom-12 left-12 w-1.5 h-1.5 rounded-full bg-[#38B6FF] shadow-[0_0_6px_#38B6FF] animate-pulse" />
          <div className="absolute top-16 left-16 w-1.5 h-1.5 rounded-full bg-[#00FF99] opacity-80" />
        </>
      )}

      {/* Center status core */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-3 rounded-full bg-[#0D1520]/90 border border-[#00FF99]/40 w-28 h-28 shadow-[0_0_15px_rgba(0,255,153,0.15)] font-mono-cyber">
        <span className="text-[10px] text-[#6A8496] tracking-wider uppercase font-semibold">
          {phase}
        </span>
        <span className="text-xl font-bold text-[#00FF99] tracking-tight">
          {found}
        </span>
        <span className="text-[9px] text-[#38B6FF] font-medium tracking-wide">
          CLEAN EDGES
        </span>
        <span className="text-[9px] text-[#4A6B7E] mt-0.5">
          {tested} PROBED
        </span>
      </div>
    </div>
  );
};
