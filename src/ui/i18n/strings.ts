export type Lang = 'en' | 'fa';

export interface AppStrings {
  // Home
  homeSubtitle: string;
  quickScan: string;
  quickScanDesc: string;
  customScan: string;
  customScanDesc: string;
  testIps: string;
  testIpsDesc: string;
  discoverColos: string;
  discoverColosDesc: string;
  telegramChannel: string;
  join: string;
  cfRanges: string;
  cidrs: string;
  license: string;
  // Scan settings
  count: string;
  workers: string;
  timeout: string;
  port: string;
  advancedOptions: string;
  mode: string;
  speedTest: string;
  openSiteFallback: string;
  openSiteFallbackHint: string;
  configOptional: string;
  configPlaceholder: string;
  configParsed: string;
  configUnrecognized: string;
  startScan: string;
  // Live scan
  measuringSpeed: string;
  stabilityCheck: string;
  resolvingOpenSites: string;
  probing: string;
  cancel: string;
  fallbackBanner: string;
  healthy: string;
  probed: string;
  done: string;
  tested: string;
  elapsed: string;
  phaseHandshake: string;
  phaseThroughConfig: string;
  phaseEdgesMeasured: string;
  phaseDnsLookup: string;
  phaseFallbackEdges: string;
  radar: string;
  copyIp: string;
  // Update
  updateAvailable: string;
  updateDesc: string;
  downloadNow: string;
  later: string;
  localSub: string;
  localSubDesc: string;
  smartStop: string;
  smartStopDesc: string;
  fragment: string;
  fragmentDesc: string;
  loadIsp: string;
  mci: string;
  irancell: string;
  mokhaberat: string;
  rightel: string;
  gaming: string;
  streaming: string;
  stability: string;
  gradeS: string;
  gradeA: string;
  gradeB: string;
  gradeC: string;
  gradeLegend: string;
  gamingDesc: string;
  streamingDesc: string;
  stabilityDesc: string;
  // Tiers
  tierTurbo: string;
  tierTurboDesc: string;
  tierBalanced: string;
  tierBalancedDesc: string;
  tierThorough: string;
  tierThoroughDesc: string;
  tierStealth: string;
  tierStealthDesc: string;
  tierIronclad: string;
  tierIroncladDesc: string;
  tierCustom: string;
  tierCustomDesc: string;
  // Results
  results: string;
  healthyIpsTopShown: string;
  bestMs: string;
  copyConfigs: string;
  share: string;
  copy: string;
  scanAgain: string;
  noResults: string;
  noResultsHint: string;
  copiedConfigs: string;
  copiedIps: string;
  copiedConfigFor: string;
  copiedIp: string;
  // Test IPs
  pasteIps: string;
  loadFile: string;
  fixedSettings: string;
  startTest: string;
  ipsSuffix: string;
  // Discover
  popDiscovery: string;
  popDiscoveryDesc: string;
  specs: string;
  startDiscovery: string;
  // About
  about: string;
  aboutBlurb: string;
  telegram: string;
  // VPN Mode
  vpnMode: string;
  vpnModeDesc: string;
  connect: string;
  disconnect: string;
  connecting: string;
  connected: string;
  disconnected: string;
  activeConfig: string;
  noActiveConfig: string;
  tapToSelect: string;
  testDelay: string;
  testingDelay: string;
  delayMs: string;
  cleanIpActive: string;
  directHost: string;
  cleanIpOption: string;
  cleanIpOptionDesc: string;
  manageConfigs: string;
  importConfig: string;
  pasteConfigPrompt: string;
  saveConfig: string;
  deleteConfig: string;
  select: string;
  connectWithCleanIp: string;
  vpnPermissionRequired: string;
  connectedDuration: string;
  vpnBypassIr: string;
  vpnBypassIrDesc: string;
  dnsTool: string;
  dnsToolDesc: string;
  dnsInfo: string;
  dnsTestAll: string;
  dnsTesting: string;
  dnsFastest: string;
  dnsUseFastest: string;
  dnsApplied: string;
  dnsNoAnswer: string;
  dnsStart: string;
  dnsStop: string;
  dnsResume: string;
  dnsWorkers: string;
  dnsTotal: string;
  dnsValid: string;
  dnsRejected: string;
  dnsProgress: string;
  dnsCatAll: string;
  dnsCatAntiSanction: string;
  dnsCatGlobal: string;
  dnsCatCustom: string;
  dnsAddCustom: string;
  dnsCustomName: string;
  dnsCustomIp: string;
  dnsSave: string;
  dnsImport: string;
  dnsExport: string;
  dnsImportPrompt: string;
  dnsCopiedValid: string;
  dnsDelete: string;
  dnsTargetDomain: string;
  dnsWarningHighWorkers: string;
  dnsSearchHint: string;
  // StormDNS Auto-Tune
  stormTune: string;
  stormTuneDesc: string;
  stormTuneRun: string;
  stormTuneStop: string;
  stormTuneAggressive: string;
  stormTuneApplied: string;
  stormTuneNeedProfile: string;
  stormTuneNeedsIdle: string;
  stormTuneActive: string;
  // Asha Guard Anti-Censorship Transports
  transportWireguard: string;
  transportWireguardDesc: string;
  transportMasque: string;
  transportMasqueDesc: string;
  transportWom: string;
  transportWomDesc: string;
  transportGool: string;
  transportGoolDesc: string;
  tlsHandshakeFragment: string;
  tlsPresetAuto: string;
  tlsPresetRecords: string;
  tlsPresetCompact: string;
  tlsPresetCustom: string;
  tlsFragmentSize: string;
  tlsFragmentDelay: string;
  tlsSplitSni: string;
  tlsEncryptedHello: string;
  tlsEchConfigList: string;
  transportPow: string;
  transportPowDesc: string;
  transportPsiphon: string;
  transportPsiphonDesc: string;
  transportTor: string;
  transportTorDesc: string;
  transportShard: string;
  transportShardDesc: string;
  transportCustom: string;
  transportCustomDesc: string;
  // Speed Test & Network Diagnostics
  speedTestTitle: string;
  speedTestSubtitle: string;
  startSpeedTest: string;
  stopSpeedTest: string;
  pingLatency: string;
  jitter: string;
  downloadSpeed: string;
  uploadSpeed: string;
  loadedPing: string;
  dataUsed: string;
  speedTesting: string;
  speedTestDone: string;
  // MTU & Split Tunnel
  splitTunnelTitle: string;
  splitTunnelSubtitle: string;
  mtuOptimizerTitle: string;
  mtuOptimizerDesc: string;
  measureMtu: string;
  recommendedMtu: string;
  // UI Dock & Common
  dockHome: string;
  dockScanner: string;
  dockTools: string;
  dockVpn: string;
  dockAbout: string;
  copied: string;
  status: string;
  latencyTrace: string;
  terminalLogs: string;
}

export const EN: AppStrings = {
  homeSubtitle: 'CLOUDFLARE IP SCANNER',
  quickScan: 'Quick Scan',
  quickScanDesc: 'Scan random CF IPs',
  customScan: 'Custom Scan',
  customScanDesc: 'Configure details',
  testIps: 'Test IPs',
  testIpsDesc: 'Validate a list',
  discoverColos: 'Discover Colos',
  discoverColosDesc: 'Find reachable DCs',
  telegramChannel: 'TELEGRAM CHANNEL',
  join: 'JOIN →',
  cfRanges: 'CF RANGES:',
  cidrs: 'CIDRs',
  license: 'MIT LICENSE',
  count: 'Count',
  workers: 'Workers',
  timeout: 'Timeout',
  port: 'Port',
  advancedOptions: 'Advanced options',
  mode: 'Mode',
  speedTest: 'Speed test',
  openSiteFallback: 'Open-site fallback',
  openSiteFallbackHint: 'If no range IP responds, resolve open Cloudflare sites and probe their IPs',
  configOptional: 'Config (optional)',
  configPlaceholder: 'vless:// or trojan:// for ready configs',
  configParsed: 'PARSED · SPEED TEST RUNS THROUGH THIS CONFIG',
  configUnrecognized: '✕ UNRECOGNIZED LINK · EXPECTED vless:// OR trojan://',
  startScan: 'Start Scan',
  measuringSpeed: 'MEASURING SPEED',
  stabilityCheck: 'STABILITY RE-CHECK',
  resolvingOpenSites: 'RESOLVING OPEN SITES',
  probing: 'PROBING',
  cancel: 'CANCEL',
  fallbackBanner: 'No range IP responded — trying IPs of open Cloudflare sites',
  healthy: 'HEALTHY',
  probed: 'PROBED',
  done: 'DONE',
  tested: 'TESTED',
  elapsed: 'ELAPSED',
  phaseHandshake: 'PHASE 1/2 · HANDSHAKE PROBE',
  phaseThroughConfig: 'THROUGH YOUR CONFIG',
  phaseEdgesMeasured: 'EDGES MEASURED',
  phaseDnsLookup: 'FALLBACK · DNS LOOKUP OF OPEN CF SITES',
  phaseFallbackEdges: 'FALLBACK · PROBING OPEN CF SITE EDGES',
  radar: 'RADAR',
  copyIp: 'COPY IP',
  updateAvailable: 'Update Available',
  updateDesc: 'A new version is available on GitHub.',
  downloadNow: 'DOWNLOAD NOW',
  later: 'LATER',
  localSub: 'LOCAL SUB LINK',
  localSubDesc: 'Copy this link to v2rayNG/NekoBox to auto-sync results.',
  smartStop: 'SMART STOP',
  smartStopDesc: 'Stop scanning once enough healthy IPs are found.',
  fragment: 'TLS FRAGMENTATION',
  fragmentDesc: 'Split packets to bypass strict SNI blocking.',
  loadIsp: 'LOAD ISP RANGES',
  mci: 'MCI (Hamrah-e Aval)',
  irancell: 'Irancell',
  mokhaberat: 'Mokhaberat',
  rightel: 'Rightel',
  gaming: 'GAMING',
  streaming: 'STREAMING',
  stability: 'STABILITY',
  gradeS: 'Excellent (Ping < 80ms, Speed > 20Mbps)',
  gradeA: 'Great (Ping < 120ms, Speed > 10Mbps)',
  gradeB: 'Good (Ping < 180ms, Speed > 3Mbps)',
  gradeC: 'Fair (Other healthy IPs)',
  gradeLegend: 'QUALITY RANKING GUIDE',
  gamingDesc: 'Low jitter & 0% packet loss',
  streamingDesc: 'High bandwidth (15Mbps+)',
  stabilityDesc: 'Reliable for long sessions',
  tierTurbo: 'TURBO',
  tierTurboDesc: 'Fastest discovery, TCP only',
  tierBalanced: 'BALANCED',
  tierBalancedDesc: 'Default optimized profile',
  tierThorough: 'THOROUGH',
  tierThoroughDesc: 'Deeper TLS verification',
  tierStealth: 'STEALTH',
  tierStealthDesc: 'Slow and careful for strict DPI',
  tierIronclad: 'IRONCLAD',
  tierIroncladDesc: 'Maximum reliability, full HTTP',
  tierCustom: 'CUSTOM',
  tierCustomDesc: 'Manual adjustments',
  results: 'Results',
  healthyIpsTopShown: 'HEALTHY IPs · TOP %d SHOWN',
  bestMs: 'BEST MS',
  copyConfigs: 'COPY %d CONFIGS',
  share: 'SHARE',
  copy: 'COPY',
  scanAgain: 'Scan Again',
  noResults: 'NO WORKING IPs FOUND',
  noResultsHint: 'Try more IPs, another port, or a longer timeout',
  copiedConfigs: 'Copied ready configs',
  copiedIps: 'Copied IPs',
  copiedConfigFor: 'Copied config for %s',
  copiedIp: 'Copied: %s',
  pasteIps: 'Paste IPs — one per line or CSV',
  loadFile: 'Load .txt / .csv',
  fixedSettings: 'Fixed settings',
  startTest: 'Start Test',
  ipsSuffix: 'IPs',
  popDiscovery: 'POP DISCOVERY',
  popDiscoveryDesc: 'Probes Cloudflare IPs via HTTP and groups results by Cloudflare PoP (colo). Useful to see which data centers are reachable from your network.',
  specs: 'Specs',
  startDiscovery: 'Start Discovery',
  about: 'About',
  aboutBlurb: 'A native Cloudflare clean-IP scanner for restricted networks — finds fast, reachable CF edges for VLESS / Trojan configs.',
  telegram: 'Telegram channel',
  vpnMode: 'VPN Client',
  vpnModeDesc: 'Connect directly with proxy',
  connect: 'CONNECT',
  disconnect: 'DISCONNECT',
  connecting: 'CONNECTING...',
  connected: 'CONNECTED',
  disconnected: 'DISCONNECTED',
  activeConfig: 'ACTIVE PROFILE',
  noActiveConfig: 'No active proxy profile',
  tapToSelect: 'Tap to select or import config',
  testDelay: 'PING',
  testingDelay: '...',
  delayMs: 'ms',
  cleanIpActive: 'CLEAN IP ATTACHED',
  directHost: 'ORIGINAL HOST',
  cleanIpOption: 'Attach Clean IP',
  cleanIpOptionDesc: 'Tunnel through a fast Cloudflare edge IP',
  manageConfigs: 'Config Profiles',
  importConfig: 'IMPORT CONFIG',
  pasteConfigPrompt: 'Paste vless://, trojan://, or stormdns:// share link',
  saveConfig: 'SAVE CONFIG',
  deleteConfig: 'Delete',
  select: 'Select',
  connectWithCleanIp: 'Connect with this Clean IP',
  vpnPermissionRequired: 'VPN permission is required to start the tunnel',
  connectedDuration: 'DURATION',
  vpnBypassIr: 'Bypass Iranian Sites',
  vpnBypassIrDesc: 'Local banks, government and .ir services connect directly instead of through the tunnel',
  dnsTool: 'DNS Tuner',
  dnsToolDesc: 'Find & apply fastest DNS',
  dnsInfo: 'Probe DNS resolvers on your network and find the fastest one. Anti-sanction resolvers also unblock 403 sanctioned services.',
  dnsTestAll: 'TEST ALL RESOLVERS',
  dnsTesting: 'TESTING',
  dnsFastest: 'FASTEST',
  dnsUseFastest: 'USE FASTEST',
  dnsApplied: 'DNS set. Reconnect to switch.',
  dnsNoAnswer: 'no answer',
  dnsStart: 'START',
  dnsStop: 'STOP',
  dnsResume: 'RESUME',
  dnsWorkers: 'Workers',
  dnsTotal: 'Total',
  dnsValid: 'Valid',
  dnsRejected: 'Rejected',
  dnsProgress: 'Progress',
  dnsCatAll: 'ALL',
  dnsCatAntiSanction: 'ANTI-SANCTION',
  dnsCatGlobal: 'GLOBAL',
  dnsCatCustom: 'CUSTOM',
  dnsAddCustom: 'Add Custom DNS',
  dnsCustomName: 'Resolver Name',
  dnsCustomIp: 'IP Address',
  dnsSave: 'Save Resolver',
  dnsImport: 'Import List',
  dnsExport: 'Export Valid',
  dnsImportPrompt: 'Paste lines of Category|Name|IP or bare IP',
  dnsCopiedValid: 'Working resolvers copied to clipboard',
  dnsDelete: 'Delete',
  dnsTargetDomain: 'Probe Target',
  dnsWarningHighWorkers: 'High worker count may increase network jitter.',
  dnsSearchHint: 'Search name or IP...',
  stormTune: 'StormDNS Auto-Tune',
  stormTuneDesc: 'Tests measured MTU profiles on your carrier and keeps the fastest one for the DNS tunnel.',
  stormTuneRun: 'RUN AUTO-TUNE',
  stormTuneStop: 'STOP',
  stormTuneAggressive: 'Include aggressive',
  stormTuneApplied: 'Applied. Reconnect the DNS tunnel to switch.',
  stormTuneNeedProfile: 'Select a StormDNS / CottenDNS profile first',
  stormTuneNeedsIdle: 'Disconnect the VPN before running auto-tune',
  stormTuneActive: 'ACTIVE PRESET',
  transportWireguard: 'WireGuard',
  transportWireguardDesc: 'Fast direct UDP Noise protocol',
  transportMasque: 'MASQUE',
  transportMasqueDesc: 'CONNECT-IP over HTTP/3 & HTTP/2',
  transportWom: 'WOM',
  transportWomDesc: 'WARP WireGuard over MASQUE H2/TCP',
  transportGool: 'WARP-on-WARP',
  transportGoolDesc: 'Double-layer WireGuard tunnel',
  tlsHandshakeFragment: 'TLS Handshake Fragmentation',
  tlsPresetAuto: 'Auto',
  tlsPresetRecords: 'Records',
  tlsPresetCompact: 'Compact',
  tlsPresetCustom: 'Custom',
  tlsFragmentSize: 'Fragment Size (Bytes)',
  tlsFragmentDelay: 'Fragment Delay (ms)',
  tlsSplitSni: 'Split Server Name (SNI)',
  tlsEncryptedHello: 'Encrypted Client Hello (ECH)',
  tlsEchConfigList: 'Custom Base64 ECHConfigList',
  transportPow: 'Asha PoW (Smart)',
  transportPowDesc: 'Dual-layer stealth cloud shield with dynamic clean gateway scanning',
  transportPsiphon: 'Psiphon',
  transportPsiphonDesc: 'Multi-protocol ladder · 25 countries',
  transportTor: 'Tor',
  transportTorDesc: 'Onion routing & Lyrebird bridges',
  transportShard: 'SHARD',
  transportShardDesc: 'Cloudflare edge pool & TLS fragment',
  transportCustom: 'Custom Proxy',
  transportCustomDesc: 'VLESS / Trojan / StormDNS + Clean IP',
  speedTestTitle: 'Speed Test',
  speedTestSubtitle: 'Multi-stream throughput test via Cloudflare infrastructure',
  startSpeedTest: 'Start Test',
  stopSpeedTest: 'Stop',
  pingLatency: 'Ping',
  jitter: 'Jitter',
  downloadSpeed: 'Download',
  uploadSpeed: 'Upload',
  loadedPing: 'Loaded Ping',
  dataUsed: 'Data Used',
  speedTesting: 'Testing...',
  speedTestDone: 'Test Complete',
  splitTunnelTitle: 'Split Tunnel & Domestic Bypass',
  splitTunnelSubtitle: 'Route Iranian sites and domestic banking directly',
  mtuOptimizerTitle: 'MTU Optimizer',
  mtuOptimizerDesc: 'Discover the exact unfragmented Path MTU to eliminate packet loss',
  measureMtu: 'Optimize MTU',
  recommendedMtu: 'Recommended MTU',
  dockHome: 'Dashboard',
  dockScanner: 'Scanner',
  dockTools: 'Tools',
  dockVpn: 'VPN Client',
  dockAbout: 'About',
  copied: 'Copied to clipboard!',
  status: 'STATUS',
  latencyTrace: 'LIVE OSCILLOSCOPE',
  terminalLogs: 'SECURITY CONSOLE LOG',
};

export const FA: AppStrings = {
  homeSubtitle: 'اسکنر آی‌پی کلودفلر',
  quickScan: 'اسکن سریع',
  quickScanDesc: 'اسکن آی‌پی‌های تصادفی کلودفلر',
  customScan: 'اسکن سفارشی',
  customScanDesc: 'تنظیم جزئیات اسکن',
  testIps: 'تست آی‌پی',
  testIpsDesc: 'بررسی یک لیست آی‌پی',
  discoverColos: 'کشف دیتاسنترها',
  discoverColosDesc: 'یافتن دیتاسنترهای در دسترس',
  telegramChannel: 'کانال تلگرام',
  join: 'عضویت ←',
  cfRanges: 'رنج‌های کلودفلر:',
  cidrs: 'بلوک',
  license: 'مجوز MIT',
  count: 'تعداد',
  workers: 'نخ‌ها',
  timeout: 'مهلت زمانی',
  port: 'پورت',
  advancedOptions: 'تنظیمات پیشرفته',
  mode: 'حالت',
  speedTest: 'تست سرعت',
  openSiteFallback: 'آی‌پی از سایت‌های باز',
  openSiteFallbackHint: 'اگر هیچ آی‌پی از رنج جواب نداد، سایت‌های باز کلودفلر را resolve کرده و آی‌پی‌هایشان بررسی می‌شود',
  configOptional: 'کانفیگ (اختیاری)',
  configPlaceholder: 'vless:// یا trojan:// برای ساخت کانفیگ آماده',
  configParsed: 'شناسایی شد · تست سرعت از طریق این کانفیگ انجام می‌شود',
  configUnrecognized: '✕ لینک ناشناخته · انتظار vless:// یا trojan:// می‌رود',
  startScan: 'شروع اسکن',
  measuringSpeed: 'اندازه‌گیری سرعت',
  stabilityCheck: 'بررسی پایداری',
  resolvingOpenSites: 'در حال خواندن دامنه‌های باز',
  probing: 'در حال تست',
  cancel: 'لغو',
  fallbackBanner: 'هیچ آی‌پی از رنج‌ها پاسخ نداد — در حال تست آی‌پی‌های سایت‌های باز کلودفلر',
  healthy: 'سالم',
  probed: 'بررسی‌شده',
  done: 'پایان یافت',
  tested: 'تست‌شده',
  elapsed: 'زمان سپری‌شده',
  phaseHandshake: 'فاز ۱/۲ · تست هندشیک',
  phaseThroughConfig: 'از طریق کانفیگ شما',
  phaseEdgesMeasured: 'لبه‌های اندازه‌گیری‌شده',
  phaseDnsLookup: 'فال‌بک · دی‌ان‌اس سایت‌های باز',
  phaseFallbackEdges: 'فال‌بک · بررسی لبه‌های سایت‌های باز',
  radar: 'رادار',
  copyIp: 'کپی آی‌پی',
  updateAvailable: 'نسخه جدید در دسترس است',
  updateDesc: 'نسخه جدیدی در گیت‌هاب منتشر شده است.',
  downloadNow: 'دانلود اکنون',
  later: 'بعداً',
  localSub: 'لینک سابسکریپشن محلی',
  localSubDesc: 'این لینک را در v2rayNG یا NekoBox کپی کنید تا نتایج خودکار همگام شوند.',
  smartStop: 'توقف هوشمند',
  smartStopDesc: 'پس از یافتن تعداد کافی آی‌پی سالم، اسکن متوقف شود.',
  fragment: 'تکه‌تکه‌سازی پکت (Fragment)',
  fragmentDesc: 'شکستن پکت‌های هندشیک TLS جهت دور زدن مسدودسازی SNI.',
  loadIsp: 'بارگذاری رنج اپراتورها',
  mci: 'همراه اول (MCI)',
  irancell: 'ایرانسل (Irancell)',
  mokhaberat: 'مخابرات',
  rightel: 'رایتل',
  gaming: 'گیمینگ',
  streaming: 'استریم',
  stability: 'پایداری',
  gradeS: 'عالی (پینگ کمتر از ۸۰ms، سرعت بالای ۲۰Mbps)',
  gradeA: 'بسیار خوب (پینگ کمتر از ۱۲۰ms، سرعت بالای ۱۰Mbps)',
  gradeB: 'خوب (پینگ کمتر از ۱۸۰ms، سرعت بالای ۳Mbps)',
  gradeC: 'معمولی (سایر آی‌پی‌های سالم)',
  gradeLegend: 'راهنمای رتبه‌بندی کیفی',
  gamingDesc: 'جیتر پایین و ۰٪ پکت لاس',
  streamingDesc: 'پهنای باند بالا (۱۵Mbps+)',
  stabilityDesc: 'مناسب اتصالات طولانی‌مدت',
  tierTurbo: 'توربو',
  tierTurboDesc: 'سریع‌ترین کشف، فقط TCP',
  tierBalanced: 'متعادل',
  tierBalancedDesc: 'پروفایل پیش‌فرض و بهینه',
  tierThorough: 'دقیق',
  tierThoroughDesc: 'تست عمیق‌تر TLS و پایداری',
  tierStealth: 'مخفی',
  tierStealthDesc: 'آهسته و محتاط برای سیستم‌های فیلترینگ سختگیر',
  tierIronclad: 'فوق پایدار',
  tierIroncladDesc: 'حداکثر اطمینان، تایید کامل HTTP',
  tierCustom: 'شخصی‌سازی',
  tierCustomDesc: 'تنظیمات دستی',
  results: 'نتایج اسکن',
  healthyIpsTopShown: 'آی‌پی‌های سالم · برترین‌ها',
  bestMs: 'بهترین پینگ',
  copyConfigs: 'کپی همه کانفیگ‌ها',
  share: 'اشتراک‌گذاری',
  copy: 'کپی',
  scanAgain: 'اسکن دوباره',
  noResults: 'هیچ آی‌پی کارآمدی یافت نشد',
  noResultsHint: 'تعداد آی‌پی بیشتری انتخاب کنید، پورت را عوض کنید یا مهلت زمانی را افزایش دهید',
  copiedConfigs: 'کانفیگ‌های آماده کپی شدند',
  copiedIps: 'آی‌پی‌ها کپی شدند',
  copiedConfigFor: 'کانفیگ کپی شد برای %s',
  copiedIp: 'کپی شد: %s',
  pasteIps: 'آی‌پی‌ها را وارد کنید — هر خط یکی یا با کاما',
  loadFile: 'بارگذاری فایل txt یا csv',
  fixedSettings: 'تنظیمات ثابت',
  startTest: 'شروع تست',
  ipsSuffix: 'آی‌پی',
  popDiscovery: 'کشف دیتاسنترها (PoP)',
  popDiscoveryDesc: 'بررسی آی‌پی‌های کلودفلر و دسته‌بندی بر اساس کد دیتاسنتر (Colo) برای مشاهده دیتاسنترهای باز در شبکه شما.',
  specs: 'مشخصات',
  startDiscovery: 'شروع کشف',
  about: 'درباره برنامه',
  aboutBlurb: 'اسکنر بومی تمیزترین آی‌پی‌های کلودفلر برای شبکه‌های با محدودیت دسترسی — یافتن سریع‌ترین لبه‌های CF برای کانفیگ‌های VLESS و Trojan.',
  telegram: 'کانال تلگرام',
  vpnMode: 'کلاینت VPN',
  vpnModeDesc: 'اتصال مستقیم با پروکسی و آی‌پی تمیز',
  connect: 'اتصال',
  disconnect: 'قطع اتصال',
  connecting: 'در حال برقراری اتصال...',
  connected: 'متصل شد',
  disconnected: 'قطع است',
  activeConfig: 'پروفایل فعال',
  noActiveConfig: 'هیچ پروفایلی انتخاب نشده است',
  tapToSelect: 'برای انتخاب یا افزودن کانفیگ کلیک کنید',
  testDelay: 'پینگ',
  testingDelay: '...',
  delayMs: 'میلی‌ثانیه',
  cleanIpActive: 'آی‌پی تمیز متصل شد',
  directHost: 'آدرس اصلی',
  cleanIpOption: 'اتصال با آی‌پی تمیز',
  cleanIpOptionDesc: 'ترافیک از طریق آی‌پی تمیز و سریع کلودفلر هدایت شود',
  manageConfigs: 'مدیریت کانفیگ‌ها',
  importConfig: 'افزودن کانفیگ',
  pasteConfigPrompt: 'لینک اشتراک vless://، trojan:// یا stormdns:// را وارد کنید',
  saveConfig: 'ذخیره کانفیگ',
  deleteConfig: 'حذف',
  select: 'انتخاب',
  connectWithCleanIp: 'اتصال با این آی‌پی تمیز',
  vpnPermissionRequired: 'اجازه دسترسی به شبکه الزامی است',
  connectedDuration: 'مدت اتصال',
  vpnBypassIr: 'دور زدن سایت‌های ایرانی',
  vpnBypassIrDesc: 'بانک‌ها، درگاه‌های پرداخت و سایت‌های داخلی به صورت مستقیم متصل می‌شوند',
  dnsTool: 'تنظیم‌کننده DNS',
  dnsToolDesc: 'تست و انتخاب سریع‌ترین DNS',
  dnsInfo: 'بررسی رزولورهای DNS و یافتن سریع‌ترین گزینه. دی‌ان‌اس‌های ضدتحریم سایت‌های تحریم‌شده را نیز باز می‌کنند.',
  dnsTestAll: 'تست تمام دی‌ان‌اس‌ها',
  dnsTesting: 'در حال تست',
  dnsFastest: 'سریع‌ترین',
  dnsUseFastest: 'استفاده از سریع‌ترین',
  dnsApplied: 'دی‌ان‌اس اعمال شد.',
  dnsNoAnswer: 'بی‌پاسخ',
  dnsStart: 'شروع',
  dnsStop: 'توقف',
  dnsResume: 'ادامه',
  dnsWorkers: 'تعداد نخ‌ها',
  dnsTotal: 'مجموع',
  dnsValid: 'پاسخ‌گو',
  dnsRejected: 'ناموفق',
  dnsProgress: 'پیشرفت',
  dnsCatAll: 'همه',
  dnsCatAntiSanction: 'ضدتحریم',
  dnsCatGlobal: 'جهانی',
  dnsCatCustom: 'سفارشی',
  dnsAddCustom: 'افزودن DNS دستی',
  dnsCustomName: 'نام رزولور',
  dnsCustomIp: 'آدرس آی‌پی',
  dnsSave: 'ذخیره',
  dnsImport: 'ورود لیست',
  dnsExport: 'خروجی سالم‌ها',
  dnsImportPrompt: 'آی‌پی‌ها را در قالب Category|Name|IP یا آی‌پی تنها وارد کنید',
  dnsCopiedValid: 'دی‌ان‌اس‌های سالم در کلیپ‌بورد کپی شدند',
  dnsDelete: 'حذف',
  dnsTargetDomain: 'دامنه تست',
  dnsWarningHighWorkers: 'تعداد نخ بالا ممکن است جیتر شبکه را افزایش دهد.',
  dnsSearchHint: 'جستجوی نام یا آی‌پی...',
  stormTune: 'تنظیم خودکار StormDNS',
  stormTuneDesc: 'تست پروفایل‌های مختلف MTU روی اپراتور و انتخاب سریع‌ترین حالت برای تونل.',
  stormTuneRun: 'اجرای تنظیم خودکار',
  stormTuneStop: 'توقف',
  stormTuneAggressive: 'شامل حالت تهاجمی',
  stormTuneApplied: 'تنظیمات با موفقیت اعمال شد.',
  stormTuneNeedProfile: 'ابتدا یک پروفایل StormDNS / CottenDNS انتخاب کنید',
  stormTuneNeedsIdle: 'پیش از اجرا اتصال VPN را قطع کنید',
  stormTuneActive: 'پروفایل فعال',
  transportWireguard: 'WireGuard',
  transportWireguardDesc: 'پروتکل سریع بر پایه UDP Noise',
  transportMasque: 'MASQUE',
  transportMasqueDesc: 'تونل نسل جدید HTTP/3 و HTTP/2',
  transportWom: 'WOM',
  transportWomDesc: 'وارپ روی MASQUE جهت دور زدن مسدودی UDP',
  transportGool: 'WARP روی WARP',
  transportGoolDesc: 'تونل دو لایه وایردگارد',
  tlsHandshakeFragment: 'تکه‌تکه‌سازی هندشیک TLS',
  tlsPresetAuto: 'خودکار',
  tlsPresetRecords: 'رکوردی',
  tlsPresetCompact: 'فشرده',
  tlsPresetCustom: 'سفارشی',
  tlsFragmentSize: 'اندازه تکه (بایت)',
  tlsFragmentDelay: 'تاخیر تکه (میلی‌ثانیه)',
  tlsSplitSni: 'شکستن SNI',
  tlsEncryptedHello: 'کلاینت‌هلو رمزشده (ECH)',
  tlsEchConfigList: 'لیست ECHConfig Base64 سفارشی',
  transportPow: 'Asha PoW (هوشمند)',
  transportPowDesc: 'سپر ابری دو لایه با اسکن پویای گیت‌وی‌های تمیز',
  transportPsiphon: 'سایفون (Psiphon)',
  transportPsiphonDesc: 'پروتکل نردبانی چندگانه · ۲۵ کشور',
  transportTor: 'تور (Tor)',
  transportTorDesc: 'مسیریابی پیازی همراه با پل‌های Lyrebird',
  transportShard: 'SHARD',
  transportShardDesc: 'استخر لبه‌های کلودفلر و تکه‌تکه‌سازی TLS',
  transportCustom: 'پروکسی سفارشی',
  transportCustomDesc: 'VLESS / Trojan / StormDNS + آی‌پی تمیز',
  speedTestTitle: 'تست سرعت',
  speedTestSubtitle: 'تست چند جریانی پهنای باند از زیرساخت کلودفلر',
  startSpeedTest: 'شروع تست',
  stopSpeedTest: 'توقف',
  pingLatency: 'پینگ',
  jitter: 'جیتر',
  downloadSpeed: 'دانلود',
  uploadSpeed: 'آپلود',
  loadedPing: 'پینگ زیر بار',
  dataUsed: 'دیتای مصرفی',
  speedTesting: 'در حال تست...',
  speedTestDone: 'تست تکمیل شد',
  splitTunnelTitle: 'تونل مجزا و دور زدن سایت‌های داخلی',
  splitTunnelSubtitle: 'اتصال مستقیم بانک‌ها و سامانه‌های دولتی',
  mtuOptimizerTitle: 'بهینه‌ساز MTU',
  mtuOptimizerDesc: 'یافتن دقیق‌ترین Path MTU شبکه جهت از بین بردن پکت لاس',
  measureMtu: 'بهینه‌سازی MTU',
  recommendedMtu: 'MTU پیشنهادی',
  dockHome: 'داشبورد',
  dockScanner: 'اسکنر',
  dockTools: 'ابزارها',
  dockVpn: 'کلاینت VPN',
  dockAbout: 'درباره',
  copied: 'در حافظه کپی شد!',
  status: 'وضعیت',
  latencyTrace: 'اسیلوسکوپ زنده',
  terminalLogs: 'کنسول گزارش امنیتی',
};

export function stringsFor(lang: Lang): AppStrings {
  return lang === 'fa' ? FA : EN;
}
