import { Protocol, ProxyConfig } from '../model/types';

export class ProxyParser {
  static parse(rawInput: string): ProxyConfig {
    const raw = rawInput.trim();
    const schemeMatch = raw.match(/^([a-zA-Z0-9_-]+):\/\//);
    if (!schemeMatch) {
      throw new Error('Unsupported link. Expected vless://, trojan://, or stormdns://');
    }

    const scheme = schemeMatch[1].toLowerCase();
    if (scheme === 'vless') {
      return this.parseVless(raw);
    } else if (scheme === 'trojan') {
      return this.parseTrojan(raw);
    } else if (scheme === 'stormdns' || scheme === 'masterdns' || scheme === 'cottendns') {
      return this.parseStormDns(raw);
    } else {
      throw new Error(`Unsupported protocol: ${scheme}`);
    }
  }

  static isSupported(raw: string): boolean {
    const s = raw.trim().toLowerCase();
    return s.startsWith('vless://') || s.startsWith('trojan://') || s.startsWith('stormdns://') || s.startsWith('cottendns://');
  }

  private static parseVless(raw: string): ProxyConfig {
    const body = raw.slice(raw.indexOf('://') + 3);
    const parts = this.splitLink(body);
    if (!parts.credential) {
      throw new Error('VLESS link missing UUID');
    }

    const q = parts.query;
    return {
      protocol: 'vless',
      address: parts.host,
      port: parts.port,
      uuid: parts.credential,
      encryption: q.encryption || 'none',
      flow: q.flow || '',
      security: q.security || 'none',
      sni: q.sni || q.peer || '',
      fingerprint: q.fp || '',
      alpn: q.alpn ? q.alpn.split(',').map((s) => s.trim()) : [],
      allowInsecure: q.allowInsecure === '1' || q.insecure === '1',
      network: (q.type || 'tcp').toLowerCase(),
      path: decodeURIComponent(q.path || '/'),
      hostHeader: decodeURIComponent(q.host || ''),
      serviceName: decodeURIComponent(q.serviceName || ''),
      mode: q.mode || '',
      publicKey: q.pbk || '',
      shortId: q.sid || '',
      cipherSuites: q.cs || q.cipherSuites || '',
      dialMode: q.dialMode || '',
      remark: parts.remark,
      raw,
    };
  }

  private static parseTrojan(raw: string): ProxyConfig {
    const body = raw.slice(raw.indexOf('://') + 3);
    const parts = this.splitLink(body);
    if (!parts.credential) {
      throw new Error('Trojan link missing password');
    }

    const q = parts.query;
    return {
      protocol: 'trojan',
      address: parts.host,
      port: parts.port,
      password: parts.credential,
      security: q.security || 'tls',
      sni: q.sni || q.peer || '',
      fingerprint: q.fp || '',
      alpn: q.alpn ? q.alpn.split(',').map((s) => s.trim()) : [],
      allowInsecure: q.allowInsecure === '1' || q.insecure === '1',
      network: (q.type || 'tcp').toLowerCase(),
      path: decodeURIComponent(q.path || '/'),
      hostHeader: decodeURIComponent(q.host || ''),
      serviceName: decodeURIComponent(q.serviceName || ''),
      mode: q.mode || '',
      cipherSuites: q.cs || q.cipherSuites || '',
      dialMode: q.dialMode || '',
      remark: parts.remark,
      raw,
    };
  }

  private static parseStormDns(raw: string): ProxyConfig {
    const body = raw.slice(raw.indexOf('://') + 3);
    const parts = this.splitLink(body);
    return {
      protocol: 'stormdns',
      address: parts.host || '1.1.1.1',
      port: parts.port || 53,
      password: parts.credential,
      security: 'none',
      network: 'udp',
      remark: parts.remark || 'StormDNS Profile',
      raw,
    };
  }

  private static splitLink(input: string): {
    credential: string;
    host: string;
    port: number;
    query: Record<string, string>;
    remark: string;
  } {
    let s = input;
    let remark = '';
    const hash = s.lastIndexOf('#');
    if (hash >= 0) {
      remark = decodeURIComponent(s.slice(hash + 1));
      s = s.slice(0, hash);
    }

    let query: Record<string, string> = {};
    const qmark = s.indexOf('?');
    if (qmark >= 0) {
      query = this.parseQuery(s.slice(qmark + 1));
      s = s.slice(0, qmark);
    }

    const at = s.indexOf('@');
    let credential = '';
    let hostPort = s;
    if (at >= 0) {
      credential = decodeURIComponent(s.slice(0, at));
      hostPort = s.slice(at + 1);
    }

    const { host, port, recovered } = this.splitHostPort(hostPort);
    if (recovered) {
      query = { ...this.parseQuery(recovered), ...query };
    }

    return { credential, host, port, query, remark };
  }

  private static splitHostPort(hp: string): { host: string; port: number; recovered: string } {
    let host = hp;
    let port = 443;
    let recovered = '';

    if (hp.startsWith('[')) {
      // IPv6
      const end = hp.indexOf(']');
      if (end >= 0) {
        host = hp.slice(1, end);
        const rest = hp.slice(end + 1);
        if (rest.startsWith(':')) {
          const afterColon = rest.slice(1);
          const parsedPort = parseInt(afterColon, 10);
          if (!isNaN(parsedPort)) port = parsedPort;
        }
      }
    } else {
      const colon = hp.indexOf(':');
      if (colon >= 0) {
        host = hp.slice(0, colon);
        const portPart = hp.slice(colon + 1);
        const qmark = portPart.indexOf('?');
        if (qmark >= 0) {
          port = parseInt(portPart.slice(0, qmark), 10) || 443;
          recovered = portPart.slice(qmark + 1);
        } else {
          port = parseInt(portPart, 10) || 443;
        }
      }
    }

    return { host, port, recovered };
  }

  private static parseQuery(qs: string): Record<string, string> {
    const result: Record<string, string> = {};
    if (!qs) return result;
    const pairs = qs.split('&');
    for (const pair of pairs) {
      const idx = pair.indexOf('=');
      if (idx >= 0) {
        const key = pair.slice(0, idx);
        const val = pair.slice(idx + 1);
        result[key] = val;
      }
    }
    return result;
  }
}
