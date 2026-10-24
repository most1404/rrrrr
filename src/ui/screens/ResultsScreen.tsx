import React, { useState } from 'react';
import { useScan } from '../../core/state/ScanContext';
import { ConfigLinkBuilder } from '../../core/output/ConfigLinkBuilder';
import {
  ArrowLeft,
  Copy,
  Check,
  Shield,
  Zap,
  Gamepad2,
  Tv,
  RotateCcw,
  Download,
  Share2,
  Sparkles,
} from 'lucide-react';

export const ResultsScreen: React.FC = () => {
  const {
    strings,
    progress,
    parsedProxy,
    resetScan,
    setRoute,
    connectWithCleanIp,
    subUrl,
  } = useScan();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const copyToClipboard = (text: string, id: string, msg: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(msg);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllConfigs = () => {
    if (parsedProxy) {
      const allLinks = progress.best.map((item) =>
        ConfigLinkBuilder.withAddress(parsedProxy, item.ip, item.port)
      );
      copyToClipboard(allLinks.join('\n'), 'all_configs', `Copied ${allLinks.length} ready configs!`);
    } else {
      const allIps = progress.best.map((item) => `${item.ip}:${item.port}`).join('\n');
      copyToClipboard(allIps, 'all_ips', `Copied ${progress.best.length} clean IPs!`);
    }
  };

  const handleCopySubLink = () => {
    copyToClipboard(subUrl, 'sub_link', 'Local Subscription URL copied for v2rayNG / NekoBox!');
  };

  return (
    <div className="space-y-5 pt-3 pb-16">
      {/* Toast popup */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#00FF99] text-[#0A0D12] px-4 py-2 rounded-xl text-xs font-mono-cyber font-bold shadow-[0_0_20px_rgba(0,255,153,0.5)] flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1A2530] pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              resetScan();
              setRoute('HOME');
            }}
            className="w-9 h-9 rounded-xl bg-[#0D1520] hover:bg-[#111820] border border-[#1A2530] flex items-center justify-center text-[#6A8496] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-white font-mono-cyber">
              {strings.results}
            </h2>
            <p className="text-xs text-[#6A8496]">
              {strings.healthyIpsTopShown.replace('%d', String(progress.best.length))}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            resetScan();
            setRoute('HOME');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111820] hover:bg-[#1A2530] border border-[#1A2530] text-xs font-mono-cyber text-[#00FF99]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{strings.scanAgain}</span>
        </button>
      </div>

      {/* Summary Action Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono-cyber text-xs">
        <button
          onClick={handleCopyAllConfigs}
          className="py-3 px-4 rounded-xl bg-[#00FF99] hover:bg-[#00CC77] text-[#0A0D12] font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,153,0.25)] transition-all"
        >
          <Copy className="w-4 h-4" />
          {parsedProxy
            ? strings.copyConfigs.replace('%d', String(progress.best.length))
            : `COPY ALL ${progress.best.length} IPs`}
        </button>

        <button
          onClick={handleCopySubLink}
          className="py-3 px-4 rounded-xl bg-[#111820] hover:bg-[#1A2530] border border-[#1A2530] text-[#38B6FF] font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          {strings.localSub}
        </button>
      </div>

      {/* Empty State */}
      {progress.best.length === 0 ? (
        <div className="bg-[#0D1520] border border-[#1A2530] rounded-2xl p-8 text-center space-y-3 font-mono-cyber">
          <div className="text-sm font-bold text-[#FFA500]">{strings.noResults}</div>
          <p className="text-xs text-[#6A8496] max-w-sm mx-auto">{strings.noResultsHint}</p>
          <button
            onClick={() => setRoute('QUICK')}
            className="px-5 py-2.5 rounded-xl bg-[#00FF99] text-[#0A0D12] font-bold text-xs"
          >
            {strings.scanAgain}
          </button>
        </div>
      ) : (
        /* Ranked Results List */
        <div className="space-y-3">
          {progress.best.map((item, index) => {
            const grade = item.grade || 'C';
            const readyLink = parsedProxy
              ? ConfigLinkBuilder.withAddress(parsedProxy, item.ip, item.port)
              : null;

            return (
              <div
                key={item.ip + item.port}
                className="bg-[#0D1520] border border-[#1A2530] hover:border-[#00FF99]/40 rounded-2xl p-4 transition-all font-mono-cyber space-y-3"
              >
                {/* Top IP row with Grade and Colo badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Rank pill */}
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        index === 0
                          ? 'bg-[#FFA500]/20 text-[#FFA500] border border-[#FFA500]/40'
                          : index < 3
                          ? 'bg-[#38B6FF]/20 text-[#38B6FF] border border-[#38B6FF]/40'
                          : 'bg-[#111820] text-[#6A8496]'
                      }`}
                    >
                      #{index + 1}
                    </span>

                    {/* IP and Port */}
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2 select-text">
                        {item.ip}
                        <span className="text-xs text-[#6A8496] font-normal">:{item.port}</span>
                      </div>
                    </div>
                  </div>

                  {/* Grade Badge */}
                  <div className="flex items-center gap-2">
                    {item.colo && (
                      <span className="text-[10px] bg-[#38B6FF]/10 text-[#38B6FF] border border-[#38B6FF]/30 px-2 py-0.5 rounded-md font-bold">
                        {item.colo}
                      </span>
                    )}

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-md font-bold border ${
                        grade === 'S'
                          ? 'bg-[#FFA500]/20 text-[#FFA500] border-[#FFA500]/50'
                          : grade === 'A'
                          ? 'bg-[#00FF99]/20 text-[#00FF99] border-[#00FF99]/50'
                          : grade === 'B'
                          ? 'bg-[#38B6FF]/20 text-[#38B6FF] border-[#38B6FF]/50'
                          : 'bg-[#111820] text-[#6A8496] border-[#1A2530]'
                      }`}
                    >
                      GRADE {grade}
                    </span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs bg-[#070A0E] p-2.5 rounded-xl border border-[#1A2530]">
                  <div>
                    <span className="text-[10px] text-[#6A8496] block">PING</span>
                    <span
                      className={`font-bold ${
                        item.avgLatencyMs < 100
                          ? 'text-[#00FF99]'
                          : item.avgLatencyMs < 160
                          ? 'text-[#38B6FF]'
                          : 'text-[#FFA500]'
                      }`}
                    >
                      {Math.round(item.avgLatencyMs)}ms
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#6A8496] block">JITTER</span>
                    <span className="font-bold text-[#C8D8E8]">{item.jitterMs}ms</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#6A8496] block">LOSS</span>
                    <span className="font-bold text-[#00FF99]">
                      {Math.round(item.loss * 100)}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#6A8496] block">SPEED</span>
                    <span className="font-bold text-[#38B6FF]">
                      {item.speedTested ? `${item.throughputMbps}M` : '--'}
                    </span>
                  </div>
                </div>

                {/* Tags (Gaming, Streaming, Stability) */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {item.isGaming && (
                    <span className="text-[10px] bg-[#00FF99]/10 text-[#00FF99] border border-[#00FF99]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Gamepad2 className="w-3 h-3" />
                      {strings.gaming}
                    </span>
                  )}
                  {item.isStreaming && (
                    <span className="text-[10px] bg-[#38B6FF]/10 text-[#38B6FF] border border-[#38B6FF]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Tv className="w-3 h-3" />
                      {strings.streaming}
                    </span>
                  )}
                  {item.isStable && (
                    <span className="text-[10px] bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {strings.stability}
                    </span>
                  )}
                </div>

                {/* Action Buttons Row */}
                <div className="flex items-center gap-2 pt-1">
                  {readyLink ? (
                    <button
                      onClick={() =>
                        copyToClipboard(readyLink, item.ip, `Config copied for ${item.ip}!`)
                      }
                      className="flex-1 py-2 rounded-xl bg-[#00FF99]/15 hover:bg-[#00FF99]/25 text-[#00FF99] border border-[#00FF99]/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {copiedId === item.ip ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{strings.copy} CONFIG</span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        copyToClipboard(item.ip, item.ip, `IP copied: ${item.ip}`)
                      }
                      className="flex-1 py-2 rounded-xl bg-[#111820] hover:bg-[#1A2530] border border-[#1A2530] text-[#C8D8E8] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {copiedId === item.ip ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{strings.copyIp}</span>
                    </button>
                  )}

                  <button
                    onClick={() => connectWithCleanIp(item.ip, item.port)}
                    className="py-2 px-3 rounded-xl bg-[#38B6FF]/15 hover:bg-[#38B6FF]/25 text-[#38B6FF] border border-[#38B6FF]/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>CONNECT VPN</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
