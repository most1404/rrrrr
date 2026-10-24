import React from 'react';
import { useScan } from '../../core/state/ScanContext';
import {
  Zap,
  Sliders,
  ListFilter,
  Globe,
  Shield,
  Activity,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Cpu,
  Radio,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    strings,
    navigate,
    prepareQuickScan,
    prepareDiscoverScan,
    configText,
    setConfigText,
    parsedProxy,
    vpnConnected,
    vpnConnecting,
    toggleVpn,
  } = useScan();

  const handleQuickClick = () => {
    prepareQuickScan();
    navigate('QUICK');
  };

  const handleDiscoverClick = () => {
    prepareDiscoverScan();
    navigate('DISCOVER');
  };

  return (
    <div className="space-y-6 pt-4 pb-8">
      {/* Top Banner / Cyber Terminal Header */}
      <div className="flex items-center justify-between border-b border-[#1A2530] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00FF99]/10 border border-[#00FF99]/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,255,153,0.25)]">
            <Radio className="w-5 h-5 text-[#00FF99]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-white font-mono-cyber flex items-center gap-2">
              ASHA SCANNER
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#111820] text-[#00FF99] border border-[#00FF99]/30 font-normal">
                v0.8.6
              </span>
            </h1>
            <p className="text-xs text-[#6A8496] font-mono-cyber tracking-wide">
              {strings.homeSubtitle}
            </p>
          </div>
        </div>

        {/* Network status pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1520] border border-[#1A2530] text-xs font-mono-cyber">
          <span className="w-2 h-2 rounded-full bg-[#00FF99] animate-pulse" />
          <span className="text-[#C8D8E8] hidden sm:inline">{strings.operatorDetected}:</span>
          <span className="text-[#38B6FF] font-semibold">IR-DIRECT / CF</span>
        </div>
      </div>

      {/* Optional Proxy Config Quick Paste Card */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono-cyber font-bold tracking-wider text-[#C8D8E8] flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#38B6FF]" />
            {strings.configOptional}
          </label>
          {parsedProxy ? (
            <span className="text-[10px] font-mono-cyber text-[#00FF99] bg-[#00FF99]/10 border border-[#00FF99]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {parsedProxy.protocol.toUpperCase()} ({parsedProxy.address}:{parsedProxy.port})
            </span>
          ) : configText.trim() ? (
            <span className="text-[10px] font-mono-cyber text-[#FFA500] bg-[#FFA500]/10 border border-[#FFA500]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {strings.configUnrecognized}
            </span>
          ) : null}
        </div>

        <textarea
          value={configText}
          onChange={(e) => setConfigText(e.target.value)}
          placeholder={strings.configPlaceholder}
          rows={2}
          className="w-full bg-[#070A0E] border border-[#1A2530] focus:border-[#00FF99] focus:ring-1 focus:ring-[#00FF99] rounded-xl px-3 py-2 text-xs font-mono-cyber text-[#C8D8E8] placeholder-[#4A6B7E] outline-none transition-all resize-none"
        />

        {parsedProxy && (
          <p className="text-[11px] font-mono-cyber text-[#00FF99]/80">
            ✓ {strings.configParsed}
          </p>
        )}
      </div>

      {/* Smart VPN Quick Status Card */}
      <div className="bg-gradient-to-r from-[#0D1520] to-[#111820] border border-[#1A2530] hover:border-[#00FF99]/40 rounded-2xl p-4 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${vpnConnected ? 'bg-[#00FF99]/20 text-[#00FF99]' : 'bg-[#111820] text-[#6A8496]'}`}>
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono-cyber">
                {strings.smartVpnCardTitle}
              </h3>
              <p className="text-xs text-[#6A8496]">
                {vpnConnected ? strings.connected : strings.smartVpnCardSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={toggleVpn}
            disabled={vpnConnecting}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-cyber tracking-wider transition-all ${
              vpnConnected
                ? 'bg-[#E05050]/20 text-[#E05050] border border-[#E05050]/40 hover:bg-[#E05050]/30'
                : 'bg-[#00FF99] text-[#0A0D12] hover:bg-[#00CC77] shadow-[0_0_12px_rgba(0,255,153,0.3)]'
            }`}
          >
            {vpnConnecting ? strings.connecting : vpnConnected ? strings.disconnect : strings.connect}
          </button>
        </div>
      </div>

      {/* Main Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Quick Scan */}
        <button
          onClick={handleQuickClick}
          className="text-start bg-[#0D1520] hover:bg-[#111820] border border-[#1A2530] hover:border-[#00FF99]/50 rounded-2xl p-4 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#00FF99]/10 border border-[#00FF99]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-[#00FF99]" />
            </div>
            <span className="text-[10px] font-mono-cyber text-[#6A8496] bg-[#111820] px-2 py-0.5 rounded-full border border-[#1A2530]">
              PRESET: 300 IPs
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono-cyber group-hover:text-[#00FF99] transition-colors">
              {strings.quickScan}
            </h3>
            <p className="text-xs text-[#6A8496] mt-1">
              {strings.quickScanDesc}
            </p>
          </div>
        </button>

        {/* Custom Scan */}
        <button
          onClick={() => navigate('CUSTOM')}
          className="text-start bg-[#0D1520] hover:bg-[#111820] border border-[#1A2530] hover:border-[#38B6FF]/50 rounded-2xl p-4 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#38B6FF]/10 border border-[#38B6FF]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sliders className="w-5 h-5 text-[#38B6FF]" />
            </div>
            <span className="text-[10px] font-mono-cyber text-[#38B6FF] bg-[#38B6FF]/10 px-2 py-0.5 rounded-full border border-[#38B6FF]/30">
              5 TIERS & ANTI-DPI
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono-cyber group-hover:text-[#38B6FF] transition-colors">
              {strings.customScan}
            </h3>
            <p className="text-xs text-[#6A8496] mt-1">
              {strings.customScanDesc}
            </p>
          </div>
        </button>

        {/* Test IPs */}
        <button
          onClick={() => navigate('TEST')}
          className="text-start bg-[#0D1520] hover:bg-[#111820] border border-[#1A2530] hover:border-[#FFA500]/50 rounded-2xl p-4 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFA500]/10 border border-[#FFA500]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ListFilter className="w-5 h-5 text-[#FFA500]" />
            </div>
            <span className="text-[10px] font-mono-cyber text-[#FFA500] bg-[#FFA500]/10 px-2 py-0.5 rounded-full border border-[#FFA500]/30">
              BATCH LIST
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono-cyber group-hover:text-[#FFA500] transition-colors">
              {strings.testIps}
            </h3>
            <p className="text-xs text-[#6A8496] mt-1">
              {strings.testIpsDesc}
            </p>
          </div>
        </button>

        {/* Discover Colos */}
        <button
          onClick={handleDiscoverClick}
          className="text-start bg-[#0D1520] hover:bg-[#111820] border border-[#1A2530] hover:border-[#00FF99]/50 rounded-2xl p-4 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#00FF99]/10 border border-[#00FF99]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5 text-[#00FF99]" />
            </div>
            <span className="text-[10px] font-mono-cyber text-[#6A8496] bg-[#111820] px-2 py-0.5 rounded-full border border-[#1A2530]">
              PoP MAP
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono-cyber group-hover:text-[#00FF99] transition-colors">
              {strings.discoverColos}
            </h3>
            <p className="text-xs text-[#6A8496] mt-1">
              {strings.discoverColosDesc}
            </p>
          </div>
        </button>
      </div>

      {/* Auxiliary Tools Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          onClick={() => navigate('DNS')}
          className="bg-[#0D1520] hover:bg-[#111820] border border-[#1A2530] rounded-xl p-3 text-start transition-all"
        >
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-[#38B6FF]" />
            <span className="text-xs font-bold font-mono-cyber text-white">DNS Tuner</span>
          </div>
          <p className="text-[11px] text-[#6A8496]">{strings.dnsToolDesc}</p>
        </button>

        <button
          onClick={() => navigate('SPEEDTEST')}
          className="bg-[#0D1520] hover:bg-[#111820] border border-[#1A2530] rounded-xl p-3 text-start transition-all"
        >
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-[#00FF99]" />
            <span className="text-xs font-bold font-mono-cyber text-white">{strings.speedTestTitle}</span>
          </div>
          <p className="text-[11px] text-[#6A8496]">{strings.speedTestSubtitle}</p>
        </button>

        <button
          onClick={() => navigate('SPLIT_TUNNEL')}
          className="col-span-2 sm:col-span-1 bg-[#0D1520] hover:bg-[#111820] border border-[#1A2530] rounded-xl p-3 text-start transition-all"
        >
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[#FFA500]" />
            <span className="text-xs font-bold font-mono-cyber text-white">Domestic Bypass</span>
          </div>
          <p className="text-[11px] text-[#6A8496]">{strings.vpnBypassIrDesc}</p>
        </button>
      </div>

      {/* Footer Info & Telegram Link */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-cyber text-[#6A8496] border-t border-[#1A2530]">
        <div className="flex items-center gap-3">
          <span>{strings.cfRanges} <strong className="text-[#C8D8E8]">4,663 {strings.cidrs}</strong></span>
          <span>•</span>
          <span>{strings.license}</span>
        </div>

        <a
          href="https://t.me/asha_news2"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38B6FF]/10 text-[#38B6FF] hover:bg-[#38B6FF]/20 border border-[#38B6FF]/30 transition-all font-semibold"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{strings.telegramChannel} ({strings.join})</span>
        </a>
      </div>
    </div>
  );
};
