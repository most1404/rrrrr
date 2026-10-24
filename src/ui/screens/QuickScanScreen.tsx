import React from 'react';
import { useScan } from '../../core/state/ScanContext';
import { ISP_PRESETS } from '../../core/data/defaultData';
import { ArrowLeft, Play, Shield, Wifi, Zap } from 'lucide-react';

export const QuickScanScreen: React.FC = () => {
  const { strings, back, scanConfig, setScanConfig, startScan } = useScan();

  const countPresets = [100, 300, 500, 1000, 5000];
  const portPresets = [443, 8443, 2053, 2083, 2087, 2096];
  const workerPresets = [20, 40, 60, 80];

  const handleSelectIsp = (ispKey: 'MCI' | 'IRANCELL' | 'MOKHABERAT' | 'RIGHTEL') => {
    const ranges = ISP_PRESETS[ispKey] || [];
    setScanConfig((prev) => ({
      ...prev,
      customV4Ranges: ranges,
      extraCidrs: ranges,
    }));
  };

  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* Top Header */}
      <div className="flex items-center gap-3 border-b border-[#1A2530] pb-3">
        <button
          onClick={back}
          className="w-9 h-9 rounded-xl bg-[#0D1520] hover:bg-[#111820] border border-[#1A2530] flex items-center justify-center text-[#6A8496] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white font-mono-cyber">
            {strings.quickScan}
          </h2>
          <p className="text-xs text-[#6A8496]">
            {strings.quickScanDesc}
          </p>
        </div>
      </div>

      {/* Target count presets */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono-cyber">
          <label className="text-[#C8D8E8] font-bold">{strings.count}</label>
          <span className="text-[#00FF99] font-bold">{scanConfig.count} IPs</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {countPresets.map((c) => (
            <button
              key={c}
              onClick={() => setScanConfig((prev) => ({ ...prev, count: c }))}
              className={`py-2 rounded-xl text-xs font-mono-cyber font-semibold transition-all ${
                scanConfig.count === c
                  ? 'bg-[#00FF99] text-[#0A0D12] shadow-[0_0_10px_rgba(0,255,153,0.3)]'
                  : 'bg-[#111820] text-[#6A8496] hover:text-[#C8D8E8] hover:bg-[#1A2530] border border-[#1A2530]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Worker concurrency */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono-cyber">
          <label className="text-[#C8D8E8] font-bold">{strings.workers}</label>
          <span className="text-[#38B6FF] font-bold">{scanConfig.concurrency} threads</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {workerPresets.map((w) => (
            <button
              key={w}
              onClick={() => setScanConfig((prev) => ({ ...prev, concurrency: w }))}
              className={`py-2 rounded-xl text-xs font-mono-cyber font-semibold transition-all ${
                scanConfig.concurrency === w
                  ? 'bg-[#38B6FF] text-[#0A0D12] shadow-[0_0_10px_rgba(56,182,255,0.3)]'
                  : 'bg-[#111820] text-[#6A8496] hover:text-[#C8D8E8] hover:bg-[#1A2530] border border-[#1A2530]'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Target port */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono-cyber">
          <label className="text-[#C8D8E8] font-bold">{strings.port}</label>
          <span className="text-[#FFA500] font-bold">Port {scanConfig.ports[0] || 443}</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {portPresets.map((p) => {
            const isSelected = scanConfig.ports.includes(p);
            return (
              <button
                key={p}
                onClick={() => setScanConfig((prev) => ({ ...prev, ports: [p] }))}
                className={`py-2 rounded-xl text-xs font-mono-cyber font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#FFA500] text-[#0A0D12] shadow-[0_0_10px_rgba(255,165,0,0.3)]'
                    : 'bg-[#111820] text-[#6A8496] hover:text-[#C8D8E8] hover:bg-[#1A2530] border border-[#1A2530]'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Handshake Mode Selection */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-3">
        <label className="text-xs font-mono-cyber font-bold text-[#C8D8E8] block">
          {strings.mode}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['http', 'tls', 'tcp'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setScanConfig((prev) => ({ ...prev, mode: m }))}
              className={`py-2.5 rounded-xl text-xs font-mono-cyber font-bold uppercase tracking-wider transition-all ${
                scanConfig.mode === m
                  ? 'bg-[#00FF99] text-[#0A0D12] shadow-[0_0_10px_rgba(0,255,153,0.3)]'
                  : 'bg-[#111820] text-[#6A8496] hover:text-[#C8D8E8] hover:bg-[#1A2530] border border-[#1A2530]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Iranian Operator Specific CIDR Presets */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-3">
        <label className="text-xs font-mono-cyber font-bold text-[#C8D8E8] flex items-center gap-1.5">
          <Wifi className="w-4 h-4 text-[#38B6FF]" />
          {strings.loadIsp}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handleSelectIsp('MCI')}
            className="py-2 px-3 rounded-xl bg-[#111820] hover:bg-[#1A2530] border border-[#1A2530] text-xs font-mono-cyber text-[#C8D8E8] text-center"
          >
            {strings.mci}
          </button>
          <button
            onClick={() => handleSelectIsp('IRANCELL')}
            className="py-2 px-3 rounded-xl bg-[#111820] hover:bg-[#1A2530] border border-[#1A2530] text-xs font-mono-cyber text-[#C8D8E8] text-center"
          >
            {strings.irancell}
          </button>
          <button
            onClick={() => handleSelectIsp('MOKHABERAT')}
            className="py-2 px-3 rounded-xl bg-[#111820] hover:bg-[#1A2530] border border-[#1A2530] text-xs font-mono-cyber text-[#C8D8E8] text-center"
          >
            {strings.mokhaberat}
          </button>
          <button
            onClick={() => handleSelectIsp('RIGHTEL')}
            className="py-2 px-3 rounded-xl bg-[#111820] hover:bg-[#1A2530] border border-[#1A2530] text-xs font-mono-cyber text-[#C8D8E8] text-center"
          >
            {strings.rightel}
          </button>
        </div>
      </div>

      {/* Advanced Toggles */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono-cyber font-bold text-[#C8D8E8]">{strings.speedTest}</div>
            <div className="text-[11px] text-[#6A8496]">Phase 2 throughput test on top candidate edges</div>
          </div>
          <input
            type="checkbox"
            checked={scanConfig.speedTest}
            onChange={(e) => setScanConfig((prev) => ({ ...prev, speedTest: e.target.checked }))}
            className="w-4 h-4 accent-[#00FF99] rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between border-t border-[#1A2530] pt-2">
          <div>
            <div className="text-xs font-mono-cyber font-bold text-[#C8D8E8]">{strings.smartStop}</div>
            <div className="text-[11px] text-[#6A8496]">{strings.smartStopDesc}</div>
          </div>
          <input
            type="checkbox"
            checked={scanConfig.smartStop}
            onChange={(e) => setScanConfig((prev) => ({ ...prev, smartStop: e.target.checked }))}
            className="w-4 h-4 accent-[#00FF99] rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between border-t border-[#1A2530] pt-2">
          <div>
            <div className="text-xs font-mono-cyber font-bold text-[#C8D8E8]">{strings.openSiteFallback}</div>
            <div className="text-[11px] text-[#6A8496]">{strings.openSiteFallbackHint}</div>
          </div>
          <input
            type="checkbox"
            checked={scanConfig.fallbackToDomains}
            onChange={(e) => setScanConfig((prev) => ({ ...prev, fallbackToDomains: e.target.checked }))}
            className="w-4 h-4 accent-[#00FF99] rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={startScan}
        className="w-full py-4 rounded-2xl bg-[#00FF99] hover:bg-[#00CC77] text-[#0A0D12] font-mono-cyber font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,153,0.35)] transition-all"
      >
        <Play className="w-5 h-5 fill-current" />
        {strings.startScan}
      </button>
    </div>
  );
};
