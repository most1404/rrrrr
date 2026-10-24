import React, { useState } from 'react';
import { useScan } from '../../core/state/ScanContext';
import { POP_COLOS } from '../../core/data/defaultData';
import { ArrowLeft, Play, Globe, Search, Server } from 'lucide-react';

export const DiscoverScreen: React.FC = () => {
  const { strings, back, startScan } = useScan();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredColos = POP_COLOS.filter(
    (c) =>
      c.colo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {strings.popDiscovery}
          </h2>
          <p className="text-xs text-[#6A8496]">
            {strings.discoverColosDesc}
          </p>
        </div>
      </div>

      {/* Description Info Banner */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#38B6FF]/10 border border-[#38B6FF]/30 flex items-center justify-center shrink-0">
          <Globe className="w-5 h-5 text-[#38B6FF]" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-white font-mono-cyber mb-1">
            CLOUDFLARE EDGE DATACENTER DISCOVERY
          </h3>
          <p className="text-xs text-[#6A8496] leading-relaxed">
            {strings.popDiscoveryDesc}
          </p>
        </div>
      </div>

      {/* Search and Datacenter list */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono-cyber font-bold tracking-wider text-[#C8D8E8] flex items-center gap-1.5">
            <Server className="w-4 h-4 text-[#00FF99]" />
            PRIMARY EDGE COLOS ({filteredColos.length})
          </label>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#4A6B7E]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search code, city or country (e.g. FRA, Frankfurt, IKA)..."
            className="w-full bg-[#070A0E] border border-[#1A2530] focus:border-[#38B6FF] rounded-xl pl-9 pr-3 py-2 text-xs font-mono-cyber text-[#C8D8E8] placeholder-[#4A6B7E] outline-none"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {filteredColos.map((item) => (
            <div
              key={item.colo}
              className="bg-[#111820] border border-[#1A2530] hover:border-[#38B6FF]/40 rounded-xl p-2.5 transition-colors font-mono-cyber"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#38B6FF] bg-[#38B6FF]/10 px-1.5 py-0.5 rounded border border-[#38B6FF]/30">
                  {item.colo}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#00FF99]" />
              </div>
              <div className="text-xs font-semibold text-[#C8D8E8] truncate">{item.city}</div>
              <div className="text-[10px] text-[#4A6B7E] truncate">{item.country}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={startScan}
        className="w-full py-4 rounded-2xl bg-[#00FF99] hover:bg-[#00CC77] text-[#0A0D12] font-mono-cyber font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,153,0.35)] transition-all"
      >
        <Play className="w-5 h-5 fill-current" />
        {strings.startDiscovery}
      </button>
    </div>
  );
};
