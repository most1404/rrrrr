import React, { useState, useEffect } from 'react';
import { Minus, Square, X, Download, Shield, Radio, Monitor } from 'lucide-react';
import { useScan } from '../../core/state/ScanContext';

export const WindowsTitleBar: React.FC = () => {
  const { lang, toggleLang } = useScan();
  const [isMaximized, setIsMaximized] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('To install as Windows app: In Edge/Chrome, click the App icon in the address bar or menu -> Apps -> "Install Asha Scanner".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const toggleMaximize = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsMaximized(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsMaximized(false);
    }
  };

  return (
    <div className="w-full bg-[#070A0E] border-b border-[#1A2530] text-[#6A8496] text-xs font-mono-cyber flex items-center justify-between px-3 py-1.5 select-none z-50 sticky top-0">
      {/* Left: Windows App Icon and Title */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-[#00FF99]/20 flex items-center justify-center">
          <Radio className="w-2.5 h-2.5 text-[#00FF99]" />
        </div>
        <span className="font-bold text-[#C8D8E8] text-[11px] tracking-wide">
          Asha Scanner
        </span>
        <span className="text-[10px] text-[#4A6B7E] hidden md:inline">
          — Cloudflare Clean IP Scanner (Windows Edition v0.8.6)
        </span>
      </div>

      {/* Center: Desktop Install badge if available */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#00FF99]/10 hover:bg-[#00FF99]/20 border border-[#00FF99]/30 text-[#00FF99] text-[10px] font-semibold transition-colors"
          title="Install as Windows Desktop Application"
        >
          <Monitor className="w-3 h-3" />
          <span>{isInstallable ? 'Install Windows App' : 'Windows App'}</span>
        </button>

        <button
          onClick={toggleLang}
          className="px-2 py-0.5 rounded bg-[#111820] hover:bg-[#1A2530] text-[#38B6FF] border border-[#1A2530] text-[10px] font-bold"
        >
          {lang === 'fa' ? 'English' : 'فارسی'}
        </button>
      </div>

      {/* Right: Windows Window Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => {}}
          className="w-7 h-6 flex items-center justify-center hover:bg-[#111820] text-[#6A8496] hover:text-[#C8D8E8] rounded transition-colors"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={toggleMaximize}
          className="w-7 h-6 flex items-center justify-center hover:bg-[#111820] text-[#6A8496] hover:text-[#C8D8E8] rounded transition-colors"
          title={isMaximized ? 'Restore' : 'Maximize'}
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          onClick={() => window.location.reload()}
          className="w-7 h-6 flex items-center justify-center hover:bg-[#E05050] text-[#6A8496] hover:text-white rounded transition-colors"
          title="Close / Reload"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
