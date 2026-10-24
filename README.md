# Asha Scanner (Windows Desktop & Web Edition)

**Asha Scanner** is a high-performance Cloudflare clean-IP scanner and anti-censorship toolkit for restricted networks. Originally designed for Android, it has been fully ported into a modern, native-feeling Windows desktop and web application with cyber-terminal aesthetic, multi-phase probing, real-time Canvas oscilloscope, and bilingual English / Persian (فارسی) support.

## Key Features

- **Multi-Phase Scan Engine**:
  - **Phase 1 Probing**: Direct TCP connect, TLS SNI handshake, and full HTTP `/cdn-cgi/trace` verification with datacenter (Colo) discovery.
  - **Phase 1.5 Stability Check**: Automated re-probing of survivors to determine packet loss %, jitter, and handshake pass rate.
  - **Phase 2 Throughput Validation**: Real-time multi-stream throughput testing on top candidate edges.
  - **Open-Site Fallback**: Resolves reachable Cloudflare-fronted domains (Discord, Canva, Cloudflare) when IP ranges are heavily blocked.
  - **Smart Stop & Gentle Mode**: Prevents ISP rate limiting and stops early once sufficient clean IPs are discovered.

- **VLESS / Trojan / StormDNS Link Parser & Generator**:
  - Parses `vless://`, `trojan://`, and `stormdns://` share links.
  - Surgically injects discovered clean IPs into configs while preserving UUID, password, SNI, and WebSocket/gRPC headers.
  - One-click copy for single configs, all configs, or raw clean IPs.
  - Built-in Local Subscription Server (`/api/sub` and `/sub`) for live sync with v2rayNG and NekoBox.

- **Windows Native Experience**:
  - Custom Cyberpunk Windows title bar with minimize, maximize/fullscreen, close, and system tray status.
  - Installable Progressive Web App (PWA) with desktop icon and standalone window frame.
  - Fast keyboard and mouse navigation with responsive grid layout.

- **Tactical VPN Client & Anti-Censorship Transports**:
  - Arc Reactor interactive dashboard with live connection duration and RX/TX throughput tickers.
  - Profile manager for saving and switching between imported configs.
  - Transport protocols: Asha PoW, MASQUE (HTTP/3), WireGuard, WOM, Tor (Onion routing), Psiphon, and SHARD.

- **Network Diagnostics & Iranian Bypass**:
  - **DNS Tuner**: Probes Iranian anti-sanction resolvers (Shecan, 403.online, Begzar, Electro, Radar Game) and global public DNS (Cloudflare, Google, Quad9, AdGuard).
  - **Domestic Iranian Bypass**: Direct un-tunneled routing for local `.ir` sites, banking, and government services.
  - **Network Guard**: QUIC blocker (UDP 443 rejection), WebRTC leak shield, IPv6 drop, and tracker sinkhole.
  - **Speed Test**: Cloudflare CDN throughput measurement for Ping, Jitter, Download, and Upload.
  - **MTU Optimizer**: Path MTU discovery to prevent fragmentation.

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide icons, Canvas API.
- **Backend / Engine**: Node.js 22, Express, raw `net.Socket` and `tls.connect` probers, DNS promises resolver.
- **Languages**: Bilingual English + Persian (Farsi) with instant toggle and RTL support.

## License

MIT License.
