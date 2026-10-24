import { ScanConfig, ProxyConfig, ScanProgress, ScanResult } from '../model/types';
import { IpGenerator } from '../ipsrc/ipGenerator';
import { DEFAULT_CF_V4_RANGES, DEFAULT_FALLBACK_DOMAINS } from '../data/defaultData';
import { QualityEvaluator } from './QualityEvaluator';

export class ScanEngine {
  private isCancelled = false;

  stop() {
    this.isCancelled = true;
  }

  async runScan(
    proxy: ProxyConfig | null,
    cfg: ScanConfig,
    onProgress: (p: ScanProgress) => void
  ) {
    this.isCancelled = false;
    const startMs = Date.now();
    const elapsed = () => Date.now() - startMs;

    const logs: string[] = [];
    const log = (msg: string) => {
      const time = new Date().toTimeString().split(' ')[0];
      logs.push(`[${time}] ${msg}`);
      if (logs.length > 60) logs.shift();
    };

    const latencyTrace: number[] = [];
    const healthy: ScanResult[] = [];
    let foundCount = 0;
    let testedCount = 0;

    log(`Engine initialized. Mode: ${cfg.mode.toUpperCase()}${cfg.gentle ? ' [GENTLE: 25w / 6s]' : ''}`);
    if (proxy) log(`Target Config: ${proxy.remark || proxy.protocol} (${proxy.protocol})`);
    if (cfg.sniOverride) log(`SNI Override: ${cfg.sniOverride}`);
    if (cfg.antiDpi?.enabled) log(`Anti-DPI Fragment active: size=${cfg.antiDpi.fragmentSize}B delay=${cfg.antiDpi.fragmentDelayMs}ms`);

    // 1. Generate target IP pool
    let targetIps: string[] = [];
    if (cfg.explicitIps && cfg.explicitIps.length > 0) {
      targetIps = [...cfg.explicitIps];
      log(`Running explicit scan on ${targetIps.length} target IPs`);
    } else if (cfg.pastedTargets) {
      const parsed = IpGenerator.parseTargetList(cfg.pastedTargets);
      targetIps = [...parsed.ips];
      if (parsed.domains.length > 0) {
        log(`Resolving ${parsed.domains.length} custom domain targets...`);
        try {
          const res = await fetch('/api/resolve-domains', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domains: parsed.domains }),
          });
          const data = await res.json();
          if (data.ips && data.ips.length > 0) {
            targetIps.push(...data.ips);
            log(`Resolved ${data.ips.length} IPs from domain targets`);
          }
        } catch (e: any) {
          log(`Domain resolution warning: ${e.message}`);
        }
      }
    } else {
      const ranges = cfg.customV4Ranges?.length ? cfg.customV4Ranges : DEFAULT_CF_V4_RANGES;
      targetIps = IpGenerator.generateIpsFromRanges(ranges, cfg.count || 200);
      log(`Generated ${targetIps.length} random Cloudflare IPs from CIDR ranges`);
    }

    const ports = cfg.ports?.length ? cfg.ports : [443];
    const tasks: Array<{ ip: string; port: number }> = [];
    for (const ip of targetIps) {
      for (const port of ports) {
        tasks.push({ ip, port });
      }
    }

    const totalTasks = tasks.length;
    log(`Phase 1: Probing ${totalTasks} targets with port(s): ${ports.join(', ')}`);

    const effectiveConcurrency = cfg.gentle ? Math.min(cfg.concurrency, 20) : Math.min(cfg.concurrency, 80);
    const effectiveTimeoutMs = cfg.gentle ? Math.max(cfg.timeoutMs, 6000) : cfg.timeoutMs;

    // Helper to send progress
    const emit = (phase: ScanProgress['phase'], currentIp = '', usingFallback = false) => {
      // Sort healthy list: by avg latency, then throughput
      const sorted = [...healthy].sort((a, b) => {
        if (a.avgLatencyMs === 0) return 1;
        if (b.avgLatencyMs === 0) return -1;
        return a.avgLatencyMs - b.avgLatencyMs;
      });

      onProgress({
        phase,
        tested: testedCount,
        total: totalTasks,
        found: foundCount,
        validated: healthy.filter((h) => h.speedTested).length,
        validateTotal: Math.min(cfg.top, healthy.length),
        elapsedMs: elapsed(),
        best: sorted.slice(0, cfg.top),
        usingFallback,
        latencyTrace: [...latencyTrace],
        logs: [...logs],
        currentIp,
      });
    };

    emit('PROBING');

    // Worker pool for Phase 1
    let taskIndex = 0;
    const sni = cfg.sniOverride || proxy?.effectiveSni?.() || 'cloudflare.com';

    const runWorker = async () => {
      while (taskIndex < tasks.length && !this.isCancelled) {
        // Smart stop check
        if (cfg.smartStop && foundCount >= cfg.top * 2) {
          log(`Smart Stop triggered: Found ${foundCount} healthy IPs, ending Phase 1 early.`);
          break;
        }

        const task = tasks[taskIndex++];
        if (!task) break;

        try {
          const res = await fetch('/api/probe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ip: task.ip,
              port: task.port,
              mode: cfg.mode,
              sni,
              timeoutMs: effectiveTimeoutMs,
            }),
          });
          const data = await res.json();
          testedCount++;

          if (data.ok) {
            foundCount++;
            const latency = data.latencyMs || 0;
            latencyTrace.push(latency);
            if (latencyTrace.length > 50) latencyTrace.shift();

            const scanRes: ScanResult = {
              ip: task.ip,
              port: task.port,
              mode: cfg.mode,
              latenciesMs: [latency],
              attempts: 1,
              tlsOk: true,
              httpStatus: data.status || 200,
              colo: data.colo || 'CF',
              throughputBytesPerSec: 0,
              speedTested: false,
              healthy: true,
              passRate: 1.0,
              timestamp: Date.now(),
              avgLatencyMs: latency,
              minLatencyMs: latency,
              jitterMs: 0,
              loss: 0,
              throughputMbps: 0,
              endpoint: `${task.ip}:${task.port}`,
            };
            scanRes.grade = QualityEvaluator.evaluate(scanRes);
            scanRes.isGaming = QualityEvaluator.isGoodForGaming(scanRes);
            scanRes.isStreaming = QualityEvaluator.isGoodForStreaming(scanRes);
            scanRes.isStable = QualityEvaluator.isStable(scanRes);

            healthy.push(scanRes);
            log(`[OK] ${task.ip}:${task.port} · ${latency}ms ${data.colo ? `[${data.colo}]` : ''}`);
          } else {
            latencyTrace.push(0); // 0 indicates miss
            if (latencyTrace.length > 50) latencyTrace.shift();
          }

          if (testedCount % 5 === 0 || data.ok) {
            emit('PROBING', task.ip);
          }
        } catch {
          testedCount++;
          latencyTrace.push(0);
          if (latencyTrace.length > 50) latencyTrace.shift();
        }
      }
    };

    const workers = Array.from({ length: effectiveConcurrency }, () => runWorker());
    await Promise.all(workers);

    if (this.isCancelled) {
      emit('CANCELLED');
      return;
    }

    // 2. Open-Site Fallback if 0 healthy IPs found
    if (healthy.length === 0 && cfg.fallbackToDomains) {
      log('No range IP responded. Launching Open-Site Fallback...');
      emit('RESOLVING', '', true);

      const fallbackDomains = cfg.fallbackDomains?.length ? cfg.fallbackDomains : DEFAULT_FALLBACK_DOMAINS;
      let fallbackIps: string[] = [];
      try {
        const res = await fetch('/api/resolve-domains', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domains: fallbackDomains.slice(0, 15) }),
        });
        const d = await res.json();
        fallbackIps = d.ips || [];
        log(`Resolved ${fallbackIps.length} open-site fallback IPs`);
      } catch (e: any) {
        log(`Fallback resolution error: ${e.message}`);
      }

      if (fallbackIps.length > 0) {
        for (const fbIp of fallbackIps) {
          if (this.isCancelled) break;
          try {
            const probeRes = await fetch('/api/probe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ip: fbIp,
                port: 443,
                mode: cfg.mode,
                sni: 'cloudflare.com',
                timeoutMs: effectiveTimeoutMs,
              }),
            });
            const d = await probeRes.json();
            if (d.ok) {
              foundCount++;
              const scanRes: ScanResult = {
                ip: fbIp,
                port: 443,
                mode: cfg.mode,
                latenciesMs: [d.latencyMs],
                attempts: 1,
                tlsOk: true,
                httpStatus: d.status || 200,
                colo: d.colo || 'CF-FALLBACK',
                throughputBytesPerSec: 0,
                speedTested: false,
                healthy: true,
                passRate: 1.0,
                timestamp: Date.now(),
                avgLatencyMs: d.latencyMs,
                minLatencyMs: d.latencyMs,
                jitterMs: 0,
                loss: 0,
                throughputMbps: 0,
                endpoint: `${fbIp}:443`,
              };
              healthy.push(scanRes);
              log(`[FALLBACK OK] ${fbIp}:443 · ${d.latencyMs}ms`);
            }
          } catch {
            // ignore
          }
        }
      }
    }

    if (this.isCancelled) {
      emit('CANCELLED');
      return;
    }

    // 3. Phase 1.5: Stability Re-Check
    if (healthy.length > 0 && cfg.stabilityCount > 1) {
      emit('STABILITY');
      log(`Phase 1.5: Re-checking top ${Math.min(cfg.top, healthy.length)} survivors for stability (${cfg.stabilityCount}x)...`);

      const topCandidates = healthy
        .sort((a, b) => a.avgLatencyMs - b.avgLatencyMs)
        .slice(0, cfg.top);

      for (const item of topCandidates) {
        if (this.isCancelled) break;
        let successCount = 1;
        const newLatencies = [...item.latenciesMs];

        for (let s = 1; s < cfg.stabilityCount; s++) {
          try {
            const probeRes = await fetch('/api/probe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ip: item.ip,
                port: item.port,
                mode: cfg.mode,
                sni,
                timeoutMs: effectiveTimeoutMs,
              }),
            });
            const d = await probeRes.json();
            if (d.ok) {
              successCount++;
              newLatencies.push(d.latencyMs);
            }
          } catch {
            // failed sample
          }
        }

        item.latenciesMs = newLatencies;
        item.attempts = cfg.stabilityCount;
        item.passRate = successCount / cfg.stabilityCount;
        item.avgLatencyMs = Math.round(newLatencies.reduce((a, b) => a + b, 0) / newLatencies.length);
        item.minLatencyMs = Math.min(...newLatencies);
        item.jitterMs = Math.max(...newLatencies) - Math.min(...newLatencies);
        item.loss = 1.0 - (newLatencies.length / cfg.stabilityCount);
        item.grade = QualityEvaluator.evaluate(item);

        emit('STABILITY', item.ip);
      }
    }

    // 4. Phase 2: Throughput Validation (Speed Test on top IPs)
    if (healthy.length > 0 && cfg.speedTest && !this.isCancelled) {
      emit('VALIDATING');
      log('Phase 2: Measuring throughput on top verified edges...');

      const topCandidates = healthy
        .sort((a, b) => a.avgLatencyMs - b.avgLatencyMs)
        .slice(0, Math.min(cfg.top, 5));

      for (const item of topCandidates) {
        if (this.isCancelled) break;
        log(`Speed testing ${item.ip}...`);
        const dlStart = Date.now();
        try {
          const testRes = await fetch(`/api/speedtest/down?bytes=3000000&t=${Date.now()}`);
          if (testRes.ok) {
            const blob = await testRes.blob();
            const dlTimeSec = (Date.now() - dlStart) / 1000;
            const bytesSec = dlTimeSec > 0 ? blob.size / dlTimeSec : 0;
            item.throughputBytesPerSec = bytesSec;
            item.throughputMbps = Math.round((bytesSec * 8) / 10000) / 100;
            item.speedTested = true;
            item.grade = QualityEvaluator.evaluate(item);
            log(`Speed test ${item.ip}: ${item.throughputMbps} Mbps`);
          }
        } catch (e: any) {
          log(`Speed test error for ${item.ip}: ${e.message}`);
        }
        emit('VALIDATING', item.ip);
      }
    }

    log(`Scan completed in ${Math.round(elapsed() / 1000)}s. Found ${healthy.length} clean IPs.`);
    emit('DONE');
  }
}
