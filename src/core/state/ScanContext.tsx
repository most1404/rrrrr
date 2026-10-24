import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Lang, AppStrings, stringsFor } from '../../ui/i18n/strings';
import {
  ScanConfig,
  ProxyConfig,
  ScanProgress,
  ScanResult,
  VpnProfile,
  DnsResolver,
} from '../model/types';
import { ProxyParser } from '../parser/ProxyParser';
import { ScanEngine } from '../engine/ScanEngine';
import { ConfigLinkBuilder } from '../output/ConfigLinkBuilder';
import { DEFAULT_DNS_RESOLVERS, DEFAULT_CF_V4_RANGES } from '../data/defaultData';

export type Route =
  | 'HOME'
  | 'QUICK'
  | 'CUSTOM'
  | 'TEST'
  | 'DISCOVER'
  | 'LIVE'
  | 'RESULTS'
  | 'VPN'
  | 'DNS'
  | 'SPLIT_TUNNEL'
  | 'SPEEDTEST'
  | 'ABOUT';

interface ScanContextType {
  lang: Lang;
  strings: AppStrings;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
  route: Route;
  setRoute: (r: Route) => void;
  navigate: (r: Route) => void;
  back: () => void;
  configText: string;
  setConfigText: (txt: string) => void;
  parsedProxy: ProxyConfig | null;
  scanConfig: ScanConfig;
  setScanConfig: React.Dispatch<React.SetStateAction<ScanConfig>>;
  progress: ScanProgress;
  isScanning: boolean;
  startScan: () => void;
  stopScan: () => void;
  resetScan: () => void;
  prepareQuickScan: () => void;
  prepareDiscoverScan: () => void;
  // VPN State
  vpnConnected: boolean;
  vpnConnecting: boolean;
  vpnDurationSec: number;
  vpnStats: { rxBytes: number; txBytes: number; rxSpeedMbps: number; txSpeedMbps: number };
  savedProfiles: VpnProfile[];
  activeProfile: VpnProfile | null;
  setActiveProfile: (p: VpnProfile | null) => void;
  addProfile: (raw: string, name?: string) => void;
  deleteProfile: (id: string) => void;
  toggleVpn: () => void;
  connectWithCleanIp: (cleanIp: string, port: number) => void;
  vpnBypassIr: boolean;
  setVpnBypassIr: (v: boolean) => void;
  vpnDnsIp: string;
  setVpnDnsIp: (v: string) => void;
  selectedTransport: string;
  setSelectedTransport: (v: string) => void;
  // DNS State
  dnsResolvers: DnsResolver[];
  setDnsResolvers: React.Dispatch<React.SetStateAction<DnsResolver[]>>;
  testAllDns: () => void;
  dnsTesting: boolean;
  applyDns: (ip: string) => void;
  subUrl: string;
}

const defaultScanConfig: ScanConfig = {
  tier: 'BALANCED',
  count: 300,
  concurrency: 40,
  timeoutMs: 4000,
  tries: 2,
  ports: [443],
  mode: 'http',
  useV4: true,
  useV6: false,
  top: 10,
  stabilityCount: 2,
  speedTest: true,
  smartStop: true,
  fragment: false,
  sniOverride: '',
  extraCidrs: [],
  customV4Ranges: DEFAULT_CF_V4_RANGES,
  explicitIps: [],
  fallbackToDomains: true,
  fallbackDomains: [],
  gentle: false,
  phase2Only: false,
  antiDpi: {
    enabled: false,
    preset: 'auto',
    fragmentSize: 64,
    fragmentDelayMs: 2,
    splitSni: true,
    useEch: false,
    echConfigList: '',
  },
  pastedTargets: '',
};

const ScanContext = createContext<ScanContextType | null>(null);

export const ScanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('asha_lang') as Lang) || 'en';
  });

  const [routeStack, setRouteStack] = useState<Route[]>(['HOME']);
  const route = routeStack[routeStack.length - 1];

  const [configText, setConfigText] = useState<string>(() => {
    return localStorage.getItem('asha_config_text') || '';
  });
  const [parsedProxy, setParsedProxy] = useState<ProxyConfig | null>(null);

  const [scanConfig, setScanConfig] = useState<ScanConfig>(defaultScanConfig);
  const [progress, setProgress] = useState<ScanProgress>({
    phase: 'IDLE',
    tested: 0,
    total: 0,
    found: 0,
    validated: 0,
    validateTotal: 0,
    elapsedMs: 0,
    best: [],
    usingFallback: false,
    latencyTrace: [],
    logs: ['[INIT] Asha Scanner Core Engine ready.'],
  });

  const [isScanning, setIsScanning] = useState(false);
  const engineRef = useRef<ScanEngine>(new ScanEngine());

  // VPN State
  const [vpnConnected, setVpnConnected] = useState(false);
  const [vpnConnecting, setVpnConnecting] = useState(false);
  const [vpnDurationSec, setVpnDurationSec] = useState(0);
  const [vpnStats, setVpnStats] = useState({ rxBytes: 0, txBytes: 0, rxSpeedMbps: 0, txSpeedMbps: 0 });
  const [selectedTransport, setSelectedTransport] = useState('pow');
  const [vpnBypassIr, setVpnBypassIr] = useState(true);
  const [vpnDnsIp, setVpnDnsIp] = useState('1.1.1.1');

  const [savedProfiles, setSavedProfiles] = useState<VpnProfile[]>(() => {
    try {
      const stored = localStorage.getItem('asha_vpn_profiles');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeProfile, setActiveProfile] = useState<VpnProfile | null>(() => {
    try {
      const stored = localStorage.getItem('asha_active_profile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // DNS State
  const [dnsResolvers, setDnsResolvers] = useState<DnsResolver[]>(() => {
    try {
      const stored = localStorage.getItem('asha_custom_dns');
      return stored ? JSON.parse(stored) : DEFAULT_DNS_RESOLVERS;
    } catch {
      return DEFAULT_DNS_RESOLVERS;
    }
  });
  const [dnsTesting, setDnsTesting] = useState(false);

  // Sub link
  const [subUrl, setSubUrl] = useState(() => {
    return `${window.location.origin}/api/sub`;
  });

  const strings = stringsFor(lang);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('asha_lang', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'fa' : 'en');
  };

  // Sync language attribute on mount
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  // Parse config text when it changes
  useEffect(() => {
    if (!configText.trim()) {
      setParsedProxy(null);
      return;
    }
    try {
      const parsed = ProxyParser.parse(configText.trim());
      setParsedProxy(parsed);
      localStorage.setItem('asha_config_text', configText);
    } catch {
      setParsedProxy(null);
    }
  }, [configText]);

  // Persist profiles
  useEffect(() => {
    localStorage.setItem('asha_vpn_profiles', JSON.stringify(savedProfiles));
  }, [savedProfiles]);

  useEffect(() => {
    if (activeProfile) {
      localStorage.setItem('asha_active_profile', JSON.stringify(activeProfile));
    } else {
      localStorage.removeItem('asha_active_profile');
    }
  }, [activeProfile]);

  const navigate = (target: Route) => {
    setRouteStack((prev) => [...prev, target]);
  };

  const back = () => {
    setRouteStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const setRoute = (r: Route) => {
    setRouteStack([r]);
  };

  // Scanner actions
  const startScan = async () => {
    setIsScanning(true);
    navigate('LIVE');

    await engineRef.current.runScan(parsedProxy, scanConfig, (p) => {
      setProgress(p);

      // If we have clean configs and a proxy was set, sync to local subscription server
      if (p.best.length > 0 && parsedProxy) {
        const readyConfigs = p.best.map((b) =>
          ConfigLinkBuilder.withAddress(parsedProxy, b.ip, b.port)
        );
        fetch('/api/sub/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ configs: readyConfigs }),
        }).catch(() => {});
      }

      if (p.phase === 'DONE' || p.phase === 'CANCELLED' || p.phase === 'ERROR') {
        setIsScanning(false);
      }
    });
  };

  const stopScan = () => {
    engineRef.current.stop();
    setIsScanning(false);
  };

  const resetScan = () => {
    stopScan();
    setProgress({
      phase: 'IDLE',
      tested: 0,
      total: 0,
      found: 0,
      validated: 0,
      validateTotal: 0,
      elapsedMs: 0,
      best: [],
      usingFallback: false,
      latencyTrace: [],
      logs: ['[READY] System initialized.'],
    });
  };

  const prepareQuickScan = () => {
    setScanConfig((prev) => ({
      ...prev,
      tier: 'BALANCED',
      count: 300,
      concurrency: 40,
      ports: [443],
      mode: 'http',
      explicitIps: [],
      pastedTargets: '',
    }));
  };

  const prepareDiscoverScan = () => {
    setScanConfig((prev) => ({
      ...prev,
      tier: 'TURBO',
      count: 300,
      concurrency: 50,
      ports: [443],
      mode: 'http',
      explicitIps: [],
      pastedTargets: '',
    }));
  };

  // VPN controls
  const toggleVpn = () => {
    if (vpnConnected) {
      setVpnConnected(false);
      setVpnConnecting(false);
      setVpnDurationSec(0);
    } else {
      setVpnConnecting(true);
      setTimeout(() => {
        setVpnConnecting(false);
        setVpnConnected(true);
      }, 1400);
    }
  };

  // VPN simulated timer and throughput ticker
  useEffect(() => {
    let timer: any;
    let ticker: any;
    if (vpnConnected) {
      timer = setInterval(() => {
        setVpnDurationSec((d) => d + 1);
      }, 1000);

      ticker = setInterval(() => {
        const rxSpd = Math.round((Math.random() * 12 + 2) * 10) / 10;
        const txSpd = Math.round((Math.random() * 4 + 0.5) * 10) / 10;
        setVpnStats((prev) => ({
          rxBytes: prev.rxBytes + (rxSpd * 1024 * 1024) / 8,
          txBytes: prev.txBytes + (txSpd * 1024 * 1024) / 8,
          rxSpeedMbps: rxSpd,
          txSpeedMbps: txSpd,
        }));
      }, 2000);
    }
    return () => {
      clearInterval(timer);
      clearInterval(ticker);
    };
  }, [vpnConnected]);

  const addProfile = (raw: string, customName?: string) => {
    try {
      const parsed = ProxyParser.parse(raw);
      const name = customName || parsed.remark || `${parsed.protocol.toUpperCase()} Edge`;
      const newProfile: VpnProfile = {
        id: Date.now().toString(),
        name,
        protocol: parsed.protocol,
        rawConfig: raw,
        cleanIp: parsed.address,
        cleanPort: parsed.port,
        addedAt: Date.now(),
      };
      setSavedProfiles((prev) => [newProfile, ...prev]);
      if (!activeProfile) {
        setActiveProfile(newProfile);
      }
    } catch {
      // Create manual profile
      const newProfile: VpnProfile = {
        id: Date.now().toString(),
        name: customName || 'Imported Config',
        protocol: 'custom',
        rawConfig: raw,
        addedAt: Date.now(),
      };
      setSavedProfiles((prev) => [newProfile, ...prev]);
    }
  };

  const deleteProfile = (id: string) => {
    setSavedProfiles((prev) => prev.filter((p) => p.id !== id));
    if (activeProfile?.id === id) {
      setActiveProfile(null);
    }
  };

  const connectWithCleanIp = (cleanIp: string, port: number) => {
    if (parsedProxy) {
      const link = ConfigLinkBuilder.withAddress(parsedProxy, cleanIp, port);
      addProfile(link, `${parsedProxy.remark || 'Proxy'} [Clean: ${cleanIp}]`);
    } else {
      addProfile(`vless://auto@${cleanIp}:${port}?security=tls&sni=cloudflare.com#Clean-${cleanIp}`);
    }
    setVpnConnecting(true);
    navigate('VPN');
    setTimeout(() => {
      setVpnConnecting(false);
      setVpnConnected(true);
    }, 1200);
  };

  // DNS Testing
  const testAllDns = async () => {
    setDnsTesting(true);
    const updated = [...dnsResolvers];

    for (let i = 0; i < updated.length; i++) {
      const resolver = { ...updated[i], status: 'TESTING' as const };
      updated[i] = resolver;
      setDnsResolvers([...updated]);

      try {
        const res = await fetch('/api/dns/probe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dnsIp: resolver.ip, targetDomain: 'cloudflare.com', timeoutMs: 2500 }),
        });
        const data = await res.json();
        if (data.ok) {
          resolver.latencyMs = data.latencyMs;
          resolver.status = 'VALID';
          resolver.answered = true;
        } else {
          resolver.latencyMs = null;
          resolver.status = 'FAILED';
          resolver.answered = false;
        }
      } catch {
        resolver.latencyMs = null;
        resolver.status = 'FAILED';
        resolver.answered = false;
      }

      updated[i] = resolver;
      setDnsResolvers([...updated]);
    }

    setDnsTesting(false);
  };

  const applyDns = (ip: string) => {
    setVpnDnsIp(ip);
  };

  return (
    <ScanContext.Provider
      value={{
        lang,
        strings,
        toggleLang,
        setLang,
        route,
        setRoute,
        navigate,
        back,
        configText,
        setConfigText,
        parsedProxy,
        scanConfig,
        setScanConfig,
        progress,
        isScanning,
        startScan,
        stopScan,
        resetScan,
        prepareQuickScan,
        prepareDiscoverScan,
        vpnConnected,
        vpnConnecting,
        vpnDurationSec,
        vpnStats,
        savedProfiles,
        activeProfile,
        setActiveProfile,
        addProfile,
        deleteProfile,
        toggleVpn,
        connectWithCleanIp,
        vpnBypassIr,
        setVpnBypassIr,
        vpnDnsIp,
        setVpnDnsIp,
        selectedTransport,
        setSelectedTransport,
        dnsResolvers,
        setDnsResolvers,
        testAllDns,
        dnsTesting,
        applyDns,
        subUrl,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error('useScan must be used within ScanProvider');
  return ctx;
};
