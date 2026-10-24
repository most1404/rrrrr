import React, { useState } from 'react';
import { useScan } from '../../core/state/ScanContext';
import { DnsResolver } from '../../core/model/types';
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Plus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Sliders,
  Zap,
} from 'lucide-react';

export const DnsScreen: React.FC = () => {
  const {
    strings,
    back,
    dnsResolvers,
    setDnsResolvers,
    testAllDns,
    dnsTesting,
    applyDns,
    vpnDnsIp,
  } = useScan();

  const [filter, setFilter] = useState<'ALL' | 'ANTI_SANCTION' | 'GLOBAL' | 'CUSTOM'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customIp, setCustomIp] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const filteredResolvers = dnsResolvers.filter((r) => {
    if (filter === 'ALL') return true;
    return r.category === filter;
  });

  const validResolvers = dnsResolvers.filter((r) => r.status === 'VALID' && r.latencyMs != null);
  const fastest = [...validResolvers].sort((a, b) => (a.latencyMs || 999) - (b.latencyMs || 999))[0];

  const handleApplyFastest = () => {
    if (fastest) {
      applyDns(fastest.ip);
      showToast(`${strings.dnsApplied} (${fastest.name}: ${fastest.ip})`);
    }
  };

  const handleAddCustom = () => {
    if (!customName.trim() || !customIp.trim()) return;
    const newRes: DnsResolver = {
      id: Date.now().toString(),
      category: 'CUSTOM',
      name: customName.trim(),
      ip: customIp.trim(),
      status: 'IDLE',
    };
    setDnsResolvers((prev) => [newRes, ...prev]);
    setCustomName('');
    setCustomIp('');
    setShowAddModal(false);
    showToast('Custom DNS added!');
  };

  const handleExportValid = () => {
    const lines = validResolvers.map((v) => `${v.category}|${v.name}|${v.ip} (${v.latencyMs}ms)`).join('\n');
    navigator.clipboard.writeText(lines);
    showToast(strings.dnsCopiedValid);
  };

  return (
    <div className="space-y-6 pt-3 pb-16 font-mono-cyber">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#00FF99] text-[#0A0D12] px-4 py-2 rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(0,255,153,0.5)] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1A2530] pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={back}
            className="w-9 h-9 rounded-xl bg-[#0D1520] hover:bg-[#111820] border border-[#1A2530] flex items-center justify-center text-[#6A8496] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-white">
              {strings.dnsTool}
            </h2>
            <p className="text-xs text-[#6A8496]">{strings.dnsToolDesc}</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111820] hover:bg-[#1A2530] border border-[#1A2530] text-xs text-[#38B6FF] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{strings.dnsAddCustom}</span>
        </button>
      </div>

      {/* Description Info Banner */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 text-xs text-[#6A8496] leading-relaxed">
        {strings.dnsInfo}
      </div>

      {/* Primary Actions: Test All & Use Fastest */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={testAllDns}
          disabled={dnsTesting}
          className={`py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            dnsTesting
              ? 'bg-[#FFA500]/20 text-[#FFA500] border border-[#FFA500]/40 animate-pulse'
              : 'bg-[#00FF99] hover:bg-[#00CC77] text-[#0A0D12] shadow-[0_0_15px_rgba(0,255,153,0.3)]'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          {dnsTesting ? strings.dnsTesting : strings.dnsTestAll}
        </button>

        <button
          onClick={handleApplyFastest}
          disabled={!fastest}
          className="py-3.5 px-4 rounded-xl bg-[#111820] hover:bg-[#1A2530] border border-[#1A2530] text-[#38B6FF] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 transition-colors"
        >
          <Zap className="w-4 h-4" />
          {strings.dnsUseFastest} {fastest ? `(${fastest.latencyMs}ms)` : ''}
        </button>
      </div>

      {/* Active DNS status */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-3.5 flex items-center justify-between text-xs">
        <span className="text-[#6A8496]">ACTIVE TUNNEL DNS:</span>
        <span className="text-[#00FF99] font-bold bg-[#00FF99]/10 px-2.5 py-0.5 rounded-full border border-[#00FF99]/30">
          {vpnDnsIp}
        </span>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        {(['ALL', 'ANTI_SANCTION', 'GLOBAL', 'CUSTOM'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`py-1.5 px-3 rounded-xl transition-all ${
              filter === cat
                ? 'bg-[#38B6FF] text-[#0A0D12] font-bold shadow-[0_0_10px_rgba(56,182,255,0.3)]'
                : 'bg-[#0D1520] text-[#6A8496] hover:text-[#C8D8E8] border border-[#1A2530]'
            }`}
          >
            {cat === 'ALL' && strings.dnsCatAll}
            {cat === 'ANTI_SANCTION' && strings.dnsCatAntiSanction}
            {cat === 'GLOBAL' && strings.dnsCatGlobal}
            {cat === 'CUSTOM' && strings.dnsCatCustom}
          </button>
        ))}

        {validResolvers.length > 0 && (
          <button
            onClick={handleExportValid}
            className="ml-auto py-1.5 px-3 rounded-xl bg-[#111820] border border-[#1A2530] text-[#00FF99] hover:bg-[#1A2530] transition-colors flex items-center gap-1.5"
          >
            <Copy className="w-3 h-3" />
            <span>{strings.dnsExport}</span>
          </button>
        )}
      </div>

      {/* Resolvers List */}
      <div className="space-y-2.5">
        {filteredResolvers.map((item) => {
          const isCurrentActive = vpnDnsIp === item.ip;
          return (
            <div
              key={item.id}
              className="bg-[#0D1520] border border-[#1A2530] hover:border-[#38B6FF]/40 rounded-2xl p-3.5 flex items-center justify-between transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{item.name}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                      item.category === 'ANTI_SANCTION'
                        ? 'bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/30'
                        : item.category === 'GLOBAL'
                        ? 'bg-[#38B6FF]/10 text-[#38B6FF] border border-[#38B6FF]/30'
                        : 'bg-[#111820] text-[#C8D8E8]'
                    }`}
                  >
                    {item.category}
                  </span>
                  {isCurrentActive && (
                    <span className="text-[9px] bg-[#00FF99]/15 text-[#00FF99] px-1.5 py-0.2 rounded font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#6A8496] select-text">{item.ip}</div>
              </div>

              <div className="flex items-center gap-3">
                {item.status === 'TESTING' ? (
                  <span className="text-xs text-[#FFA500] animate-pulse">Testing...</span>
                ) : item.status === 'VALID' ? (
                  <span className="text-xs font-bold text-[#00FF99]">
                    {item.latencyMs}ms
                  </span>
                ) : item.status === 'FAILED' ? (
                  <span className="text-xs text-[#E05050] flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    {strings.dnsNoAnswer}
                  </span>
                ) : (
                  <span className="text-xs text-[#4A6B7E]">--</span>
                )}

                <button
                  onClick={() => {
                    applyDns(item.ip);
                    showToast(`${strings.dnsApplied} (${item.name}: ${item.ip})`);
                  }}
                  className="py-1 px-2.5 rounded-lg bg-[#111820] hover:bg-[#1A2530] text-[#00FF99] border border-[#1A2530] text-xs font-semibold"
                >
                  Apply
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Custom DNS */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1520] border border-[#38B6FF]/40 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">
              {strings.dnsAddCustom}
            </h3>

            <div>
              <label className="text-[11px] text-[#6A8496] block mb-1">{strings.dnsCustomName}</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. NextDNS / Private"
                className="w-full bg-[#070A0E] border border-[#1A2530] focus:border-[#38B6FF] rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#6A8496] block mb-1">{strings.dnsCustomIp}</label>
              <input
                type="text"
                value={customIp}
                onChange={(e) => setCustomIp(e.target.value)}
                placeholder="e.g. 45.90.28.0"
                className="w-full bg-[#070A0E] border border-[#1A2530] focus:border-[#38B6FF] rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#111820] hover:bg-[#1A2530] text-[#6A8496] text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustom}
                disabled={!customName.trim() || !customIp.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#38B6FF] text-[#0A0D12] text-xs font-bold disabled:opacity-40"
              >
                {strings.dnsSave}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
