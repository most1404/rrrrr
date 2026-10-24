import React, { useEffect, useRef } from 'react';
import { useScan } from '../../core/state/ScanContext';
import { CyberRadar } from '../components/CyberRadar';
import { CyberWaveform } from '../components/CyberWaveform';
import { Square, ArrowRight, ShieldCheck, Terminal, AlertTriangle } from 'lucide-react';

export const LiveScanScreen: React.FC = () => {
  const { strings, progress, isScanning, stopScan, navigate } = useScan();
  const logEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [progress.logs]);

  const percent = progress.total > 0 ? Math.min(Math.round((progress.tested / progress.total) * 100), 100) : 0;

  const phaseTitle = () => {
    switch (progress.phase) {
      case 'PROBING':
        return strings.probing;
      case 'RESOLVING':
        return strings.resolvingOpenSites;
      case 'STABILITY':
        return strings.stabilityCheck;
      case 'VALIDATING':
        return strings.measuringSpeed;
      case 'DONE':
        return strings.done;
      case 'CANCELLED':
        return 'CANCELLED';
      default:
        return 'SCANNING';
    }
  };

  return (
    <div className="space-y-5 pt-3 pb-12">
      {/* Top Phase Header */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono-cyber font-bold tracking-widest text-[#00FF99] bg-[#00FF99]/10 px-2 py-0.5 rounded-full border border-[#00FF99]/30">
            {phaseTitle()}
          </span>
          <h2 className="text-base font-bold text-white font-mono-cyber mt-1">
            {strings.phaseHandshake}
          </h2>
        </div>
        <div className="text-end font-mono-cyber">
          <span className="text-xs text-[#6A8496] block">{strings.elapsed}</span>
          <span className="text-sm font-bold text-[#38B6FF]">
            {Math.round(progress.elapsedMs / 1000)}s
          </span>
        </div>
      </div>

      {/* Fallback Banner if active */}
      {progress.usingFallback && (
        <div className="bg-[#FFA500]/10 border border-[#FFA500]/40 rounded-xl p-3 flex items-center gap-2 text-xs font-mono-cyber text-[#FFA500]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{strings.fallbackBanner}</span>
        </div>
      )}

      {/* Circular Radar HUD */}
      <CyberRadar
        isScanning={isScanning}
        tested={progress.tested}
        found={progress.found}
        phase={progress.phase}
      />

      {/* Progress Bar & Numeric Counters */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-2 font-mono-cyber">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#C8D8E8]">
            {strings.tested}: <strong className="text-white">{progress.tested}</strong> / {progress.total}
          </span>
          <span className="text-[#00FF99] font-bold">{percent}%</span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#111820] overflow-hidden border border-[#1A2530]">
          <div
            className="h-full bg-gradient-to-r from-[#00CC77] to-[#00FF99] transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-[#6A8496] pt-1">
          <span>{strings.healthy}: <strong className="text-[#00FF99]">{progress.found}</strong></span>
          {progress.currentIp && (
            <span className="text-[#38B6FF] truncate max-w-[180px]">
              PROBING: {progress.currentIp}
            </span>
          )}
        </div>
      </div>

      {/* Real-Time Latency Oscilloscope */}
      <CyberWaveform latencies={progress.latencyTrace} />

      {/* Live Security Console Terminal Logs */}
      <div className="bg-[#070A0E] border border-[#1A2530] rounded-2xl p-3 font-mono-cyber text-xs">
        <div className="flex items-center gap-1.5 text-[#6A8496] text-[10px] uppercase tracking-wider pb-2 border-b border-[#1A2530] mb-2">
          <Terminal className="w-3.5 h-3.5 text-[#00FF99]" />
          <span>{strings.terminalLogs}</span>
        </div>
        <div className="h-32 overflow-y-auto space-y-1 text-[11px] text-[#C8D8E8] select-text">
          {progress.logs.map((line, idx) => (
            <div
              key={idx}
              className={`${
                line.includes('[OK]') || line.includes('[FALLBACK OK]')
                  ? 'text-[#00FF99]'
                  : line.includes('error') || line.includes('DROP')
                  ? 'text-[#E05050]'
                  : line.includes('Fallback')
                  ? 'text-[#FFA500]'
                  : 'text-[#6A8496]'
              }`}
            >
              {line}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Control Buttons: Cancel or View Results */}
      <div className="flex items-center gap-3">
        {isScanning ? (
          <button
            onClick={stopScan}
            className="flex-1 py-3.5 rounded-xl bg-[#E05050]/20 hover:bg-[#E05050]/30 border border-[#E05050]/50 text-[#E05050] font-mono-cyber font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <Square className="w-4 h-4 fill-current" />
            {strings.cancel}
          </button>
        ) : (
          <button
            onClick={() => navigate('RESULTS')}
            className="flex-1 py-4 rounded-xl bg-[#00FF99] hover:bg-[#00CC77] text-[#0A0D12] font-mono-cyber font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,153,0.3)] transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            {strings.results} ({progress.best.length})
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
