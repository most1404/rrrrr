import React, { useState } from 'react';
import { useScan } from '../../core/state/ScanContext';
import { ScanTier } from '../../core/model/types';
import { IpGenerator } from '../../core/ipsrc/ipGenerator';
import { ArrowLeft, Play, ShieldAlert, Sliders, Cpu, Sparkles } from 'lucide-react';

export const CustomScanScreen: React.FC = () => {
  const { strings, back, scanConfig, setScanConfig, startScan } = useScan();
  const [showAntiDpi, setShowAntiDpi] = useState(false);

  const applyTier = (t: ScanTier) => {
    switch (t) {
      case 'TURBO':
        setScanConfig((prev) => ({
          ...prev,
          tier: 'TURBO',
          count: 500,
          concurrency: 60,
          timeoutMs: 3000,
          mode: 'tcp',
          speedTest: false,
          stabilityCount: 1,
        }));
        break;
      case 'BALANCED':
        setScanConfig((prev) => ({
          ...prev,
          tier: 'BALANCED',
          count: 300,
          concurrency: 40,
          timeoutMs: 4000,
          mode: 'http',
          speedTest: true,
          stabilityCount: 2,
        }));
        break;
      case 'THOROUGH':
        setScanConfig((prev) => ({
          ...prev,
          tier: 'THOROUGH',
          count: 200,
          concurrency: 30,
          timeoutMs: 5000,
          mode: 'http',
          speedTest: true,
          stabilityCount: 4,
        }));
        break;
      case 'STEALTH':
        setScanConfig((prev) => ({
          ...prev,
          tier: 'STEALTH',
          count: 150,
          concurrency: 15,
          timeoutMs: 6000,
          mode: 'tls',
          gentle: true,
          speedTest: true,
          stabilityCount: 3,
        }));
        break;
      case 'IRONCLAD':
        setScanConfig((prev) => ({
          ...prev,
          tier: 'IRONCLAD',
          count: 100,
          concurrency: 20,
          timeoutMs: 6000,
          mode: 'http',
          speedTest: true,
          stabilityCount: 5,
        }));
        break;
      case 'CUSTOM':
        setScanConfig((prev) => ({ ...prev, tier: 'CUSTOM' }));
        break;
    }
  };

  const targetStats = scanConfig.pastedTargets
    ? IpGenerator.parseTargetList(scanConfig.pastedTargets)
    : null;

  return (
    <div className="space-y-6 pt-4 pb-12">
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
            {strings.customScan}
          </h2>
          <p className="text-xs text-[#6A8496]">
            {strings.customScanDesc}
          </p>
        </div>
      </div>

      {/* 01 / Preset Tiers */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-3">
        <label className="text-xs font-mono-cyber font-bold tracking-wider text-[#38B6FF] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          {strings.secProfile}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(['TURBO', 'BALANCED', 'THOROUGH', 'STEALTH', 'IRONCLAD', 'CUSTOM'] as ScanTier[]).map((t) => {
            const isSelected = scanConfig.tier === t;
            return (
              <button
                key={t}
                onClick={() => applyTier(t)}
                className={`p-3 rounded-xl text-start font-mono-cyber transition-all ${
                  isSelected
                    ? 'bg-[#00FF99]/15 text-[#00FF99] border border-[#00FF99]/40 shadow-[0_0_10px_rgba(0,255,153,0.2)]'
                    : 'bg-[#111820] text-[#6A8496] hover:text-[#C8D8E8] hover:bg-[#1A2530] border border-[#1A2530]'
                }`}
              >
                <div className="text-xs font-bold">{t}</div>
                <div className="text-[10px] text-[#4A6B7E] mt-0.5">
                  {t === 'TURBO' && strings.tierTurboDesc}
                  {t === 'BALANCED' && strings.tierBalancedDesc}
                  {t === 'THOROUGH' && strings.tierThoroughDesc}
                  {t === 'STEALTH' && strings.tierStealthDesc}
                  {t === 'IRONCLAD' && strings.tierIroncladDesc}
                  {t === 'CUSTOM' && strings.tierCustomDesc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 02 / Target Pool & Pasted Targets */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-mono-cyber font-bold tracking-wider text-[#FFA500] flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            {strings.pastedTargetsTitle}
          </label>
          {targetStats && (
            <span className="text-[10px] font-mono-cyber text-[#00FF99] bg-[#00FF99]/10 px-2 py-0.5 rounded-full border border-[#00FF99]/30">
              {targetStats.total} TARGETS READY ({targetStats.domains.length} DOMAINS)
            </span>
          )}
        </div>
        <textarea
          value={scanConfig.pastedTargets}
          onChange={(e) => setScanConfig((prev) => ({ ...prev, pastedTargets: e.target.value }))}
          placeholder={strings.pastedTargetsPlaceholder}
          rows={3}
          className="w-full bg-[#070A0E] border border-[#1A2530] focus:border-[#FFA500] rounded-xl px-3 py-2 text-xs font-mono-cyber text-[#C8D8E8] placeholder-[#4A6B7E] outline-none transition-all resize-none"
        />
      </div>

      {/* 03 / Manual Parameters */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-4">
        <label className="text-xs font-mono-cyber font-bold tracking-wider text-[#C8D8E8] flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-[#00FF99]" />
          {strings.secEssentials}
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-mono-cyber text-[#6A8496] block mb-1">
              {strings.count} ({scanConfig.count})
            </label>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={scanConfig.count}
              onChange={(e) => setScanConfig((prev) => ({ ...prev, count: Number(e.target.value) }))}
              className="w-full accent-[#00FF99]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono-cyber text-[#6A8496] block mb-1">
              {strings.workers} ({scanConfig.concurrency})
            </label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={scanConfig.concurrency}
              onChange={(e) => setScanConfig((prev) => ({ ...prev, concurrency: Number(e.target.value) }))}
              className="w-full accent-[#38B6FF]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono-cyber text-[#6A8496] block mb-1">
              {strings.timeout} ({scanConfig.timeoutMs}ms)
            </label>
            <input
              type="range"
              min="1500"
              max="10000"
              step="500"
              value={scanConfig.timeoutMs}
              onChange={(e) => setScanConfig((prev) => ({ ...prev, timeoutMs: Number(e.target.value) }))}
              className="w-full accent-[#FFA500]"
            />
          </div>
        </div>

        {/* SNI Override */}
        <div>
          <label className="text-[11px] font-mono-cyber text-[#6A8496] block mb-1">
            SNI Hostname Override
          </label>
          <input
            type="text"
            value={scanConfig.sniOverride}
            onChange={(e) => setScanConfig((prev) => ({ ...prev, sniOverride: e.target.value }))}
            placeholder="e.g. speed.cloudflare.com or your domain"
            className="w-full bg-[#070A0E] border border-[#1A2530] focus:border-[#00FF99] rounded-xl px-3 py-2 text-xs font-mono-cyber text-[#C8D8E8] placeholder-[#4A6B7E] outline-none"
          />
        </div>
      </div>

      {/* 04 / Anti-DPI & TLS Fragmentation Accordion */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#E05050]" />
            <div>
              <div className="text-xs font-mono-cyber font-bold text-white">{strings.antiDpiTitle}</div>
              <div className="text-[11px] text-[#6A8496]">{strings.antiDpiSubtitle}</div>
            </div>
          </div>
          <button
            onClick={() => setShowAntiDpi(!showAntiDpi)}
            className="text-xs font-mono-cyber text-[#38B6FF] hover:underline"
          >
            {showAntiDpi ? 'Hide' : 'Configure'}
          </button>
        </div>

        {showAntiDpi && (
          <div className="border-t border-[#1A2530] pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-cyber text-[#C8D8E8]">Enable Anti-DPI Fragmentation</span>
              <input
                type="checkbox"
                checked={scanConfig.antiDpi.enabled}
                onChange={(e) =>
                  setScanConfig((prev) => ({
                    ...prev,
                    antiDpi: { ...prev.antiDpi, enabled: e.target.checked },
                  }))
                }
                className="w-4 h-4 accent-[#00FF99] rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono-cyber">
              <div>
                <label className="text-[#6A8496] block mb-1">{strings.tlsFragmentSize}</label>
                <input
                  type="number"
                  value={scanConfig.antiDpi.fragmentSize}
                  onChange={(e) =>
                    setScanConfig((prev) => ({
                      ...prev,
                      antiDpi: { ...prev.antiDpi, fragmentSize: Number(e.target.value) },
                    }))
                  }
                  className="w-full bg-[#070A0E] border border-[#1A2530] rounded-lg px-2 py-1.5 text-[#C8D8E8]"
                />
              </div>

              <div>
                <label className="text-[#6A8496] block mb-1">{strings.tlsFragmentDelay}</label>
                <input
                  type="number"
                  value={scanConfig.antiDpi.fragmentDelayMs}
                  onChange={(e) =>
                    setScanConfig((prev) => ({
                      ...prev,
                      antiDpi: { ...prev.antiDpi, fragmentDelayMs: Number(e.target.value) },
                    }))
                  }
                  className="w-full bg-[#070A0E] border border-[#1A2530] rounded-lg px-2 py-1.5 text-[#C8D8E8]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-cyber text-[#C8D8E8]">{strings.tlsSplitSni}</span>
              <input
                type="checkbox"
                checked={scanConfig.antiDpi.splitSni}
                onChange={(e) =>
                  setScanConfig((prev) => ({
                    ...prev,
                    antiDpi: { ...prev.antiDpi, splitSni: e.target.checked },
                  }))
                }
                className="w-4 h-4 accent-[#00FF99] rounded cursor-pointer"
              />
            </div>
          </div>
        )}
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
