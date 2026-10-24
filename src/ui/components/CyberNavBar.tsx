import React from 'react';
import { useScan, Route } from '../../core/state/ScanContext';
import {
  LayoutDashboard,
  Radar,
  ShieldCheck,
  Wrench,
  Info,
  Languages,
} from 'lucide-react';

export const CyberNavBar: React.FC = () => {
  const { route, setRoute, strings, lang, toggleLang, isScanning } = useScan();

  const isScannerActive = route === 'QUICK' || route === 'CUSTOM' || route === 'TEST' || route === 'DISCOVER' || route === 'LIVE' || route === 'RESULTS';
  const isToolsActive = route === 'DNS' || route === 'SPEEDTEST' || route === 'SPLIT_TUNNEL';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-2 sm:p-4 pointer-events-none">
      <div className="max-w-xl mx-auto bg-[#0D1520]/95 backdrop-blur-md border border-[#1A2530] rounded-2xl p-1.5 shadow-2xl pointer-events-auto flex items-center justify-between text-xs font-mono-cyber">
        {/* Home / Dashboard */}
        <button
          onClick={() => setRoute('HOME')}
          className={`flex-1 flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
            route === 'HOME'
              ? 'bg-[#00FF99]/15 text-[#00FF99] border border-[#00FF99]/30 shadow-[0_0_10px_rgba(0,255,153,0.2)]'
              : 'text-[#6A8496] hover:text-[#C8D8E8] hover:bg-[#111820]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-1" />
          <span className="font-semibold tracking-wider uppercase text-[10px]">{strings.dockHome}</span>
        </button>

        {/* Scanner */}
        <button
          onClick={() => setRoute('QUICK')}
          className={`flex-1 flex flex-col items-center py-1.5 px-1 rounded-xl relative transition-all ${
            isScannerActive
              ? 'bg-[#00FF99]/15 text-[#00FF99] border border-[#00FF99]/30 shadow-[0_0_10px_rgba(0,255,153,0.2)]'
              : 'text-[#6A8496] hover:text-[#C8D8E8] hover:bg-[#111820]'
          }`}
        >
          {isScanning && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-[#00FF99] animate-ping" />
          )}
          <Radar className="w-5 h-5 mb-1" />
          <span className="font-semibold tracking-wider uppercase text-[10px]">{strings.dockScanner}</span>
        </button>

        {/* VPN */}
        <button
          onClick={() => setRoute('VPN')}
          className={`flex-1 flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
            route === 'VPN'
              ? 'bg-[#00FF99]/15 text-[#00FF99] border border-[#00FF99]/30 shadow-[0_0_10px_rgba(0,255,153,0.2)]'
              : 'text-[#6A8496] hover:text-[#C8D8E8] hover:bg-[#111820]'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-1" />
          <span className="font-semibold tracking-wider uppercase text-[10px]">{strings.dockVpn}</span>
        </button>

        {/* Tools */}
        <button
          onClick={() => setRoute('DNS')}
          className={`flex-1 flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
            isToolsActive
              ? 'bg-[#00FF99]/15 text-[#00FF99] border border-[#00FF99]/30 shadow-[0_0_10px_rgba(0,255,153,0.2)]'
              : 'text-[#6A8496] hover:text-[#C8D8E8] hover:bg-[#111820]'
          }`}
        >
          <Wrench className="w-5 h-5 mb-1" />
          <span className="font-semibold tracking-wider uppercase text-[10px]">{strings.dockTools}</span>
        </button>

        {/* About */}
        <button
          onClick={() => setRoute('ABOUT')}
          className={`flex-1 flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
            route === 'ABOUT'
              ? 'bg-[#00FF99]/15 text-[#00FF99] border border-[#00FF99]/30 shadow-[0_0_10px_rgba(0,255,153,0.2)]'
              : 'text-[#6A8496] hover:text-[#C8D8E8] hover:bg-[#111820]'
          }`}
        >
          <Info className="w-5 h-5 mb-1" />
          <span className="font-semibold tracking-wider uppercase text-[10px]">{strings.dockAbout}</span>
        </button>

        {/* Language switch */}
        <button
          onClick={toggleLang}
          className="flex flex-col items-center py-1 px-2.5 ml-1 rounded-xl bg-[#111820] text-[#38B6FF] hover:bg-[#1A2530] border border-[#1A2530] transition-colors"
          title="Toggle English / فارسی"
        >
          <Languages className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] font-bold tracking-widest">{lang.toUpperCase()}</span>
        </button>
      </div>
    </div>
  );
};
