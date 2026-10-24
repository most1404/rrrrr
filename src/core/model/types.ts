export type ProbeMode = 'tcp' | 'tls' | 'http';

export type Protocol = 'vless' | 'trojan' | 'stormdns';

export type ScanTier = 'TURBO' | 'BALANCED' | 'THOROUGH' | 'STEALTH' | 'IRONCLAD' | 'CUSTOM';

export type ScanPhase = 'IDLE' | 'PROBING' | 'RESOLVING' | 'STABILITY' | 'VALIDATING' | 'DONE' | 'CANCELLED' | 'ERROR';

export type QualityGrade = 'S' | 'A' | 'B' | 'C' | 'F';

export interface AntiDpiConfig {
  enabled: boolean;
  preset: 'auto' | 'records' | 'compact' | 'custom';
  fragmentSize: number;
  fragmentDelayMs: number;
  splitSni: boolean;
  useEch: boolean;
  echConfigList: string;
  recipeJson?: string;
}

export interface ProxyConfig {
  protocol: Protocol;
  address: string;
  port: number;
  uuid?: string;
  password?: string;
  encryption?: string;
  flow?: string;
  security?: string; // none | tls | reality
  sni?: string;
  fingerprint?: string;
  alpn?: string[];
  allowInsecure?: boolean;
  network?: string; // tcp | ws | grpc | xhttp | splithttp
  path?: string;
  hostHeader?: string;
  serviceName?: string;
  mode?: string;
  publicKey?: string;
  shortId?: string;
  cipherSuites?: string;
  dialMode?: string;
  remark?: string;
  raw: string;
}

export interface ScanConfig {
  tier: ScanTier;
  count: number;
  concurrency: number;
  timeoutMs: number;
  tries: number;
  ports: number[];
  mode: ProbeMode;
  useV4: boolean;
  useV6: boolean;
  top: number;
  stabilityCount: number;
  speedTest: boolean;
  smartStop: boolean;
  fragment: boolean;
  sniOverride: string;
  extraCidrs: string[];
  customV4Ranges: string[];
  explicitIps: string[];
  fallbackToDomains: boolean;
  fallbackDomains: string[];
  gentle: boolean;
  phase2Only: boolean;
  antiDpi: AntiDpiConfig;
  pastedTargets: string;
}

export interface ScanResult {
  ip: string;
  port: number;
  mode: ProbeMode;
  latenciesMs: number[];
  attempts: number;
  tlsOk: boolean;
  httpStatus: number;
  colo: string;
  throughputBytesPerSec: number;
  speedTested: boolean;
  healthy: boolean;
  passRate: number;
  timestamp: number;
  avgLatencyMs: number;
  minLatencyMs: number;
  jitterMs: number;
  loss: number;
  throughputMbps: number;
  endpoint: string;
  grade?: QualityGrade;
  isGaming?: boolean;
  isStreaming?: boolean;
  isStable?: boolean;
}

export interface ScanProgress {
  phase: ScanPhase;
  tested: number;
  total: number;
  found: number;
  validated: number;
  validateTotal: number;
  elapsedMs: number;
  best: ScanResult[];
  error?: string | null;
  usingFallback: boolean;
  latencyTrace: number[];
  logs: string[];
  currentIp?: string;
}

export interface DnsResolver {
  id: string;
  category: 'ANTI_SANCTION' | 'GLOBAL' | 'CUSTOM';
  name: string;
  ip: string;
  latencyMs?: number | null;
  status?: 'IDLE' | 'TESTING' | 'VALID' | 'FAILED';
  answered?: boolean;
}

export interface VpnProfile {
  id: string;
  name: string;
  protocol: string;
  rawConfig: string;
  cleanIp?: string;
  cleanPort?: number;
  pingMs?: number | null;
  addedAt: number;
}

export interface SpeedTestState {
  running: boolean;
  progress: number; // 0 - 100
  pingMs: number;
  jitterMs: number;
  downloadMbps: number;
  uploadMbps: number;
  loadedPingMs: number;
  dataUsedMb: number;
  status: 'idle' | 'pinging' | 'downloading' | 'uploading' | 'done' | 'error';
  colo?: string;
  clientIp?: string;
}

export interface ColoResult {
  colo: string;
  city: string;
  country: string;
  count: number;
  avgLatency: number;
  bestIp: string;
  sampleIps: string[];
}
