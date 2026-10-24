import React, { useState } from 'react';
import { useScan } from '../../core/state/ScanContext';
import {
  Shield,
  ShieldAlert,
  Power,
  Cpu,
  Wifi,
  Radio,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  CheckCircle2,
  Sliders,
  ExternalLink,
} from 'lucide-react';

export const VpnScreen: React.FC = () => {
  const {
    strings,
    vpnConnected,
    vpnConnecting,
    vpnDurationSec,
    vpnStats,
    toggleVpn,
    savedProfiles,
    activeProfile,
    setActiveProfile,
    addProfile,
    deleteProfile,
    vpnBypassIr,
    setVpnBypassIr,
    selectedTransport,
    setSelectedTransport,
    navigate,
  } = useScan();

  const [showImportModal, setShowImportModal] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [importName, setImportName] = useState('');

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleImportSubmit = () => {
    if (!importInput.trim()) return;
    addProfile(importInput.trim(), importName.trim() || undefined);
    setImportInput('');
    setImportName('');
    setShowImportModal(false);
  };

  const transports = [
    { id: 'pow', name: strings.transportPow, desc: strings.transportPowDesc },
    { id: 'masque', name: strings.transportMasque, desc: strings.transportMasqueDesc },
    { id: 'wireguard', name: strings.transportWireguard, desc: strings.transportWireguardDesc },
    { id: 'wom', name: strings.transportWom, desc: strings.transportWomDesc },
    { id: 'tor', name: strings.transportTor, desc: strings.transportTorDesc },
    { id: 'psiphon', name: strings.transportPsiphon, desc: strings.transportPsiphonDesc },
    { id: 'shard', name: strings.transportShard, desc: strings.transportShardDesc },
  ];

  return (
    <div className="space-y-6 pt-3 pb-16 font-mono-cyber">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1A2530] pb-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00FF99]" />
            {strings.vpnMode}
          </h2>
          <p className="text-xs text-[#6A8496]">{strings.vpnModeDesc}</p>
        </div>

        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00FF99]/15 hover:bg-[#00FF99]/25 text-[#00FF99] border border-[#00FF99]/30 text-xs font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{strings.importConfig}</span>
        </button>
      </div>

      {/* Tactical Arc Reactor Dial */}
      <div className="flex flex-col items-center justify-center py-4">
        <button
          onClick={toggleVpn}
          disabled={vpnConnecting}
          className={`relative w-44 h-44 sm:w-48 sm:h-48 rounded-full border-2 flex flex-col items-center justify-center transition-all group ${
            vpnConnected
              ? 'bg-[#00FF99]/10 border-[#00FF99] shadow-[0_0_35px_rgba(0,255,153,0.4)]'
              : vpnConnecting
              ? 'bg-[#FFA500]/10 border-[#FFA500] shadow-[0_0_30px_rgba(255,165,0,0.3)] animate-pulse'
              : 'bg-[#0D1520] border-[#1A2530] hover:border-[#00FF99]/40'
          }`}
        >
          {/* Animated concentric ring */}
          <div
            className={`absolute inset-2 rounded-full border border-dashed transition-all ${
              vpnConnected
                ? 'border-[#00FF99]/40 animate-spin [animation-duration:15s]'
                : 'border-[#1A2530]'
            }`}
          />

          <Power
            className={`w-12 h-12 mb-2 transition-transform group-hover:scale-110 ${
              vpnConnected
                ? 'text-[#00FF99]'
                : vpnConnecting
                ? 'text-[#FFA500]'
                : 'text-[#6A8496]'
            }`}
          />

          <span
            className={`text-sm font-bold tracking-widest ${
              vpnConnected
                ? 'text-[#00FF99]'
                : vpnConnecting
                ? 'text-[#FFA500]'
                : 'text-white'
            }`}
          >
            {vpnConnecting ? strings.connecting : vpnConnected ? strings.connected : strings.connect}
          </span>

          <span className="text-[10px] text-[#6A8496] mt-0.5">
            {vpnConnected ? formatDuration(vpnDurationSec) : strings.arcReactorReady}
          </span>
        </button>
      </div>

      {/* Live Speed Rx / Tx Readout */}
      {vpnConnected && (
        <div className="grid grid-cols-2 gap-3 bg-[#0D1520] border border-[#1A2530] rounded-2xl p-3.5 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00FF99]/10 flex items-center justify-center text-[#00FF99]">
              <ArrowDown className="w-4 h-4" />
            </div>
            <div className="text-start">
              <span className="text-[10px] text-[#6A8496] block">{strings.liveSpeedRx}</span>
              <span className="text-base font-bold text-white">
                {vpnStats.rxSpeedMbps} <small className="text-xs text-[#00FF99]">Mbps</small>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#38B6FF]/10 flex items-center justify-center text-[#38B6FF]">
              <ArrowUp className="w-4 h-4" />
            </div>
            <div className="text-start">
              <span className="text-[10px] text-[#6A8496] block">{strings.liveSpeedTx}</span>
              <span className="text-base font-bold text-white">
                {vpnStats.txSpeedMbps} <small className="text-xs text-[#38B6FF]">Mbps</small>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Active Profile / Profiles Manager */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#C8D8E8] flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#38B6FF]" />
            {strings.activeConfig}
          </label>
          <span className="text-[10px] text-[#6A8496]">
            {savedProfiles.length} Profiles Saved
          </span>
        </div>

        {savedProfiles.length === 0 ? (
          <div
            onClick={() => setShowImportModal(true)}
            className="border border-dashed border-[#1A2530] hover:border-[#00FF99]/40 rounded-xl p-4 text-center cursor-pointer transition-colors"
          >
            <p className="text-xs text-[#6A8496]">{strings.noActiveConfig}</p>
            <p className="text-[11px] text-[#00FF99] mt-1">{strings.tapToSelect}</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {savedProfiles.map((prof) => {
              const isSelected = activeProfile?.id === prof.id;
              return (
                <div
                  key={prof.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#00FF99]/10 border-[#00FF99]/40 text-white'
                      : 'bg-[#111820] border-[#1A2530] text-[#C8D8E8] hover:border-[#1A2530]/80'
                  }`}
                >
                  <div
                    onClick={() => setActiveProfile(prof)}
                    className="flex-1 cursor-pointer truncate mr-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold truncate">{prof.name}</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#070A0E] text-[#38B6FF] border border-[#38B6FF]/30">
                        {prof.protocol}
                      </span>
                    </div>
                    {prof.cleanIp && (
                      <span className="text-[10px] text-[#00FF99]">
                        Clean IP: {prof.cleanIp}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveProfile(prof)}
                      className={`p-1.5 rounded-lg text-xs font-bold ${
                        isSelected ? 'text-[#00FF99]' : 'text-[#6A8496] hover:text-white'
                      }`}
                    >
                      {isSelected ? <CheckCircle2 className="w-4 h-4" /> : strings.select}
                    </button>
                    <button
                      onClick={() => deleteProfile(prof.id)}
                      className="p-1.5 text-[#6A8496] hover:text-[#E05050] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Anti-Censorship Transport Selector */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 space-y-3">
        <label className="text-xs font-bold text-[#FFA500] flex items-center gap-1.5">
          <Radio className="w-4 h-4" />
          {strings.protocolSelectorTitle}
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {transports.map((t) => {
            const isSelected = selectedTransport === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTransport(t.id)}
                className={`p-3 rounded-xl text-start border transition-all ${
                  isSelected
                    ? 'bg-[#00FF99]/10 border-[#00FF99]/40 text-white shadow-[0_0_10px_rgba(0,255,153,0.15)]'
                    : 'bg-[#111820] border-[#1A2530] text-[#6A8496] hover:text-[#C8D8E8] hover:bg-[#1A2530]'
                }`}
              >
                <div className="text-xs font-bold text-[#C8D8E8] flex items-center justify-between">
                  <span>{t.name}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#00FF99]" />}
                </div>
                <div className="text-[10px] text-[#4A6B7E] mt-0.5 line-clamp-1">{t.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Domestic Iranian Bypass (.ir) Toggle */}
      <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-[#C8D8E8]">{strings.vpnBypassIr}</div>
          <div className="text-[11px] text-[#6A8496]">{strings.vpnBypassIrDesc}</div>
        </div>
        <input
          type="checkbox"
          checked={vpnBypassIr}
          onChange={(e) => setVpnBypassIr(e.target.checked)}
          className="w-4 h-4 accent-[#00FF99] rounded cursor-pointer"
        />
      </div>

      {/* Modal: Import Config */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1520] border border-[#00FF99]/40 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white font-mono-cyber">
              {strings.importConfig}
            </h3>

            <input
              type="text"
              value={importName}
              onChange={(e) => setImportName(e.target.value)}
              placeholder="Profile Label / Remark (optional)"
              className="w-full bg-[#070A0E] border border-[#1A2530] focus:border-[#00FF99] rounded-xl px-3 py-2 text-xs font-mono-cyber text-[#C8D8E8] outline-none"
            />

            <textarea
              value={importInput}
              onChange={(e) => setImportInput(e.target.value)}
              placeholder={strings.pasteConfigPrompt}
              rows={4}
              className="w-full bg-[#070A0E] border border-[#1A2530] focus:border-[#00FF99] rounded-xl px-3 py-2 text-xs font-mono-cyber text-[#C8D8E8] outline-none resize-none"
            />

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#111820] hover:bg-[#1A2530] text-[#6A8496] text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                disabled={!importInput.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#00FF99] hover:bg-[#00CC77] text-[#0A0D12] text-xs font-bold disabled:opacity-40"
              >
                {strings.saveConfig}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
