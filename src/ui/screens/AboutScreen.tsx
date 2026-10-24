import React from 'react';
import { useScan } from '../../core/state/ScanContext';
import { ArrowLeft, Info, Send, ShieldCheck, Terminal, Heart, ExternalLink } from 'lucide-react';

export const AboutScreen: React.FC = () => {
  const { strings, back } = useScan();

  return (
    <div className="space-y-6 pt-3 pb-16 font-mono-cyber">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#1A2530] pb-3">
        <button
          onClick={back}
          className="w-9 h-9 rounded-xl bg-[#0D1520] hover:bg-[#111820] border border-[#1A2530] flex items-center justify-center text-[#6A8496] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-[#38B6FF]" />
            {strings.about}
          </h2>
          <p className="text-xs text-[#6A8496]">Asha Scanner v0.8.6</p>
        </div>
      </div>

      {/* Main Blurb Card */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#00FF99]/15 border border-[#00FF99]/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,153,0.25)]">
            <ShieldCheck className="w-6 h-6 text-[#00FF99]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wider">
              ASHA SCANNER IP
            </h3>
            <p className="text-xs text-[#00FF99]">
              Next-Gen Anti-Censorship Edge Discovery
            </p>
          </div>
        </div>

        <p className="text-xs text-[#C8D8E8] leading-relaxed">
          {strings.aboutBlurb}
        </p>

        <div className="border-t border-[#1A2530] pt-3 text-xs text-[#6A8496] space-y-1">
          <div>• Multi-Phase Scanner: TCP connect, TLS SNI handshake, HTTP /cdn-cgi/trace</div>
          <div>• Anti-DPI: ClientHello TLS packet fragmentation to bypass strict deep packet inspection</div>
          <div>• Open-Site Fallback: Resolves reachable Cloudflare CDN domains during national internet cutoffs</div>
          <div>• Quality Ranking: Automated grading (S, A, B, C) for Gaming, Streaming, and Stability</div>
          <div>• Tactical VPN Client & DNS Tuner with Iranian anti-sanction resolvers</div>
        </div>
      </div>

      {/* Telegram Community */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-[#38B6FF]" />
            <h4 className="text-xs font-bold text-white">COMMUNITY & UPDATES</h4>
          </div>
          <span className="text-[10px] text-[#38B6FF] bg-[#38B6FF]/10 px-2 py-0.5 rounded-full border border-[#38B6FF]/30">
            @asha_news2
          </span>
        </div>

        <p className="text-xs text-[#6A8496]">
          Join the official Asha channel for announcements, fresh server pools, and security advisories.
        </p>

        <a
          href="https://t.me/asha_news2"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl bg-[#38B6FF] hover:bg-[#38B6FF]/80 text-[#0A0D12] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(56,182,255,0.3)]"
        >
          <Send className="w-4 h-4" />
          <span>JOIN TELEGRAM CHANNEL</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* License & Credits */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 text-xs text-[#6A8496] space-y-2">
        <div className="flex justify-between items-center text-white font-bold">
          <span>LICENSE: MIT</span>
          <span>Open Source</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Based on the architecture of SenPaiScanner (Go) and Asha Scanner Android (Kotlin Compose). Rewritten in TypeScript & React for high-performance cross-platform web and desktop execution.
        </p>
      </div>
    </div>
  );
};
