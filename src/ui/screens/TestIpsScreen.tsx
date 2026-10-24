import React, { useState } from 'react';
import { useScan } from '../../core/state/ScanContext';
import { ArrowLeft, Play, Upload, FileText, CheckCircle2 } from 'lucide-react';

export const TestIpsScreen: React.FC = () => {
  const { strings, back, scanConfig, setScanConfig, startScan } = useScan();
  const [inputText, setInputText] = useState('');

  const parseIps = (text: string) => {
    return text
      .split(/[\r\n,;\s]+/)
      .map((s) => s.trim())
      .filter((s) => /^\d{1,3}(\.\d{1,3}){3}$/.test(s));
  };

  const parsedList = parseIps(inputText);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleStart = () => {
    setScanConfig((prev) => ({
      ...prev,
      explicitIps: parsedList,
      count: parsedList.length,
      pastedTargets: '',
    }));
    startScan();
  };

  return (
    <div className="space-y-6 pt-4 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#1A2530] pb-3">
        <button
          onClick={back}
          className="w-9 h-9 rounded-xl bg-[#0D1520] hover:bg-[#111820] border border-[#1A2530] flex items-center justify-center text-[#6A8496] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white font-mono-cyber">
            {strings.testIps}
          </h2>
          <p className="text-xs text-[#6A8496]">
            {strings.testIpsDesc}
          </p>
        </div>
      </div>

      {/* Paste Card */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono-cyber">
          <label className="text-[#C8D8E8] font-bold flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#FFA500]" />
            {strings.pasteIps}
          </label>
          {parsedList.length > 0 && (
            <span className="text-[10px] text-[#00FF99] bg-[#00FF99]/10 px-2.5 py-0.5 rounded-full border border-[#00FF99]/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {parsedList.length} {strings.ipsSuffix}
            </span>
          )}
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="104.16.12.34&#10;172.67.18.99&#10;104.21.50.60"
          rows={6}
          className="w-full bg-[#070A0E] border border-[#1A2530] focus:border-[#FFA500] rounded-xl px-3 py-2.5 text-xs font-mono-cyber text-[#C8D8E8] placeholder-[#4A6B7E] outline-none"
        />

        <div className="flex items-center justify-between pt-1">
          <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111820] hover:bg-[#1A2530] border border-[#1A2530] text-xs font-mono-cyber text-[#38B6FF] transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>{strings.loadFile}</span>
            <input
              type="file"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {parsedList.length > 0 && (
            <button
              onClick={() => setInputText('')}
              className="text-xs font-mono-cyber text-[#E05050] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Fixed Settings Summary */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-2 text-xs font-mono-cyber">
        <div className="text-[#6A8496] font-bold uppercase tracking-wider mb-2">
          {strings.fixedSettings}
        </div>
        <div className="grid grid-cols-2 gap-2 text-[#C8D8E8]">
          <div className="bg-[#111820] p-2 rounded-lg border border-[#1A2530]">
            <span className="text-[#6A8496] block text-[10px]">PORT</span>
            <span className="font-bold text-[#FFA500]">{scanConfig.ports[0] || 443}</span>
          </div>
          <div className="bg-[#111820] p-2 rounded-lg border border-[#1A2530]">
            <span className="text-[#6A8496] block text-[10px]">HANDSHAKE</span>
            <span className="font-bold text-[#00FF99] uppercase">{scanConfig.mode}</span>
          </div>
          <div className="bg-[#111820] p-2 rounded-lg border border-[#1A2530]">
            <span className="text-[#6A8496] block text-[10px]">TIMEOUT</span>
            <span className="font-bold text-[#38B6FF]">{scanConfig.timeoutMs}ms</span>
          </div>
          <div className="bg-[#111820] p-2 rounded-lg border border-[#1A2530]">
            <span className="text-[#6A8496] block text-[10px]">WORKERS</span>
            <span className="font-bold text-white">{scanConfig.concurrency}</span>
          </div>
        </div>
      </div>

      {/* Start Test Button */}
      <button
        onClick={handleStart}
        disabled={parsedList.length === 0}
        className={`w-full py-4 rounded-2xl font-mono-cyber font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
          parsedList.length > 0
            ? 'bg-[#00FF99] hover:bg-[#00CC77] text-[#0A0D12] shadow-[0_0_20px_rgba(0,255,153,0.35)]'
            : 'bg-[#1A2530] text-[#4A6B7E] cursor-not-allowed'
        }`}
      >
        <Play className="w-5 h-5 fill-current" />
        {strings.startTest} ({parsedList.length})
      </button>
    </div>
  );
};
