import { ProxyConfig } from '../model/types';

export class ConfigLinkBuilder {
  static withAddress(proxy: ProxyConfig, ip: string, port: number): string {
    const raw = proxy.raw;
    if (!raw) return `${ip}:${port}`;

    // 1. Separate fragment
    const hashIdx = raw.indexOf('#');
    let base = hashIdx >= 0 ? raw.slice(0, hashIdx) : raw;
    const frag = hashIdx >= 0 ? raw.slice(hashIdx) : '';

    // 2. Replace host:port surgically
    const atIdx = base.indexOf('@');
    if (atIdx >= 0) {
      const qIdx = base.indexOf('?', atIdx);
      const hostPortEnd = qIdx >= 0 ? qIdx : base.length;

      const prefix = base.slice(0, atIdx + 1);
      const suffix = base.slice(hostPortEnd);

      const newHostPort = ip.includes(':') ? `[${ip}]:${port}` : `${ip}:${port}`;
      base = prefix + newHostPort + suffix;
    }

    // 3. Ensure SNI and Security for Cloudflare/TLS
    const extra: string[] = [];
    const originalDomain = proxy.address;
    if (originalDomain && !this.isIpLiteral(originalDomain)) {
      const isTlsPort = this.isCloudflareTlsPort(port);
      const currentSecurity = this.getParam(base, 'security')?.toLowerCase() || '';
      const isTls = currentSecurity === 'tls' || currentSecurity === 'reality' || (!currentSecurity && isTlsPort);

      if (isTls && (!currentSecurity || currentSecurity === 'none')) {
        base = this.setParam(base, 'security', 'tls');
      }

      if (isTls && !this.containsParam(base, 'sni')) {
        extra.push(`sni=${encodeURIComponent(originalDomain)}`);
      }

      const network = this.getParam(base, 'type')?.toLowerCase() || 'tcp';
      const isHttpLike = network === 'ws' || network === 'grpc' || network.includes('http');
      if (isHttpLike && !this.containsParam(base, 'host')) {
        extra.push(`host=${encodeURIComponent(originalDomain)}`);
      }
    }

    if (proxy.cipherSuites && !this.containsParam(base, 'cs') && !this.containsParam(base, 'cipherSuites')) {
      extra.push(`cs=${encodeURIComponent(proxy.cipherSuites)}`);
    }
    if (proxy.dialMode && !this.containsParam(base, 'dialMode')) {
      extra.push(`dialMode=${encodeURIComponent(proxy.dialMode)}`);
    }

    if (extra.length > 0) {
      base += base.includes('?') ? '&' : '?';
      base += extra.join('&');
    }

    // 4. Update fragment
    const newFrag = !frag ? `#${ip}` : `${frag}-${ip}`;
    return base + newFrag;
  }

  private static containsParam(url: string, name: string): boolean {
    return new RegExp(`[?&]${name}=`, 'i').test(url);
  }

  private static getParam(url: string, name: string): string | null {
    const match = url.match(new RegExp(`[?&]${name}=([^&?#]*)`, 'i'));
    return match ? match[1] : null;
  }

  private static setParam(url: string, name: string, value: string): string {
    if (this.containsParam(url, name)) {
      return url.replace(new RegExp(`([?&])${name}=[^&?#]*`, 'i'), `$1${name}=${value}`);
    } else {
      return url + (url.includes('?') ? '&' : '?') + `${name}=${value}`;
    }
  }

  private static isIpLiteral(s: string): boolean {
    return s.includes(':') || /^\d{1,3}(\.\d{1,3}){3}$/.test(s);
  }

  private static isCloudflareTlsPort(port: number): boolean {
    return [443, 2053, 2083, 2087, 2095, 2096, 8443].includes(port);
  }
}
