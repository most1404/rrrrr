export class IpGenerator {
  static parseCidr(cidr: string): { base: number; count: number } {
    const [ipStr, prefixStr] = cidr.trim().split('/');
    const prefix = prefixStr ? parseInt(prefixStr, 10) : 32;
    const base = this.ipToInt(ipStr);
    const count = prefix === 32 ? 1 : Math.pow(2, 32 - prefix);
    return { base, count };
  }

  static ipToInt(ip: string): number {
    const parts = ip.split('.').map((p) => parseInt(p, 10));
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
  }

  static intToIp(int: number): string {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255,
    ].join('.');
  }

  static generateRandomFromCidr(cidr: string): string {
    const { base, count } = this.parseCidr(cidr);
    if (count <= 2) return this.intToIp(base);
    // Avoid network and broadcast
    const offset = Math.floor(Math.random() * (count - 2)) + 1;
    return this.intToIp((base + offset) >>> 0);
  }

  static generateIpsFromRanges(cidrs: string[], totalCount: number): string[] {
    const ips = new Set<string>();
    const maxTries = totalCount * 4;
    let tries = 0;

    while (ips.size < totalCount && tries < maxTries && cidrs.length > 0) {
      tries++;
      const cidr = cidrs[Math.floor(Math.random() * cidrs.length)];
      try {
        const ip = this.generateRandomFromCidr(cidr);
        ips.add(ip);
      } catch {
        // ignore invalid cidr
      }
    }

    return Array.from(ips);
  }

  static parseTargetList(rawText: string): { ips: string[]; domains: string[]; total: number } {
    const lines = rawText.split(/[\r\n,]+/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
    const ips = new Set<string>();
    const domains = new Set<string>();

    for (const item of lines) {
      // Range format: 104.16.1.1-50 or 104.16.1.1-104.16.1.50
      if (item.includes('-')) {
        const [startPart, endPart] = item.split('-');
        if (/^\d{1,3}(\.\d{1,3}){3}$/.test(startPart)) {
          const startInt = this.ipToInt(startPart);
          let endInt = startInt;
          if (/^\d{1,3}(\.\d{1,3}){3}$/.test(endPart)) {
            endInt = this.ipToInt(endPart);
          } else {
            const lastOctet = parseInt(endPart, 10);
            if (!isNaN(lastOctet)) {
              const startOctets = startPart.split('.');
              endInt = this.ipToInt(`${startOctets[0]}.${startOctets[1]}.${startOctets[2]}.${lastOctet}`);
            }
          }
          const minI = Math.min(startInt, endInt);
          const maxI = Math.max(startInt, endInt);
          const limit = Math.min(maxI - minI + 1, 1000);
          for (let i = 0; i < limit; i++) {
            ips.add(this.intToIp((minI + i) >>> 0));
          }
          continue;
        }
      }

      // CIDR
      if (item.includes('/')) {
        try {
          const { base, count } = this.parseCidr(item);
          const limit = Math.min(count, 256);
          for (let i = 0; i < limit; i++) {
            ips.add(this.intToIp((base + i) >>> 0));
          }
        } catch {
          // ignore
        }
        continue;
      }

      // Single IP
      if (/^\d{1,3}(\.\d{1,3}){3}$/.test(item)) {
        ips.add(item);
        continue;
      }

      // Domain
      if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(item)) {
        domains.add(item);
      }
    }

    return {
      ips: Array.from(ips),
      domains: Array.from(domains),
      total: ips.size + domains.size,
    };
  }
}
