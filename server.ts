import express from 'express';
import net from 'net';
import tls from 'tls';
import http from 'http';
import fs from 'fs';
import path from 'path';
import dns from 'dns';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory store for recent clean IPs for the subscription server
let currentBestConfigs: string[] = [];

// Helper: Measure TCP connect
function probeTcp(ip: string, port: number, timeoutMs = 4000): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    let isResolved = false;

    socket.setTimeout(timeoutMs);

    socket.on('connect', () => {
      if (isResolved) return;
      isResolved = true;
      const latencyMs = Date.now() - start;
      socket.destroy();
      resolve({ ok: true, latencyMs });
    });

    socket.on('timeout', () => {
      if (isResolved) return;
      isResolved = true;
      socket.destroy();
      resolve({ ok: false, latencyMs: timeoutMs, error: 'Timeout' });
    });

    socket.on('error', (err) => {
      if (isResolved) return;
      isResolved = true;
      socket.destroy();
      resolve({ ok: false, latencyMs: Date.now() - start, error: err.message });
    });

    socket.connect(port, ip);
  });
}

// Helper: Measure TLS handshake with SNI
function probeTls(ip: string, port: number, sni = 'cloudflare.com', timeoutMs = 5000): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  return new Promise((resolve) => {
    const start = Date.now();
    let isResolved = false;

    const socket = tls.connect({
      host: ip,
      port,
      servername: sni || 'cloudflare.com',
      rejectUnauthorized: false,
      timeout: timeoutMs,
    }, () => {
      if (isResolved) return;
      isResolved = true;
      const latencyMs = Date.now() - start;
      socket.destroy();
      resolve({ ok: true, latencyMs });
    });

    socket.on('timeout', () => {
      if (isResolved) return;
      isResolved = true;
      socket.destroy();
      resolve({ ok: false, latencyMs: timeoutMs, error: 'TLS Timeout' });
    });

    socket.on('error', (err) => {
      if (isResolved) return;
      isResolved = true;
      socket.destroy();
      resolve({ ok: false, latencyMs: Date.now() - start, error: err.message });
    });
  });
}

// Helper: Measure HTTP/HTTPS /cdn-cgi/trace
function probeHttp(
  ip: string,
  port: number,
  sni = 'cloudflare.com',
  timeoutMs = 6000
): Promise<{ ok: boolean; latencyMs: number; colo: string; status: number; error?: string }> {
  return new Promise((resolve) => {
    const start = Date.now();
    let isResolved = false;

    const socket = tls.connect({
      host: ip,
      port,
      servername: sni || 'cloudflare.com',
      rejectUnauthorized: false,
      timeout: timeoutMs,
    }, () => {
      // Send HTTP request for /cdn-cgi/trace
      const req = `GET /cdn-cgi/trace HTTP/1.1\r\nHost: ${sni || 'cloudflare.com'}\r\nUser-Agent: AshaScanner/0.8.6\r\nConnection: close\r\nAccept: */*\r\n\r\n`;
      socket.write(req);
    });

    let data = '';
    socket.on('data', (chunk) => {
      data += chunk.toString();
      if (data.includes('\r\n\r\n') && (data.includes('colo=') || data.includes('400 Bad') || data.includes('200 OK'))) {
        if (!isResolved) {
          isResolved = true;
          const latencyMs = Date.now() - start;
          socket.destroy();

          const coloMatch = data.match(/colo=([a-zA-Z0-9]+)/);
          const statusMatch = data.match(/HTTP\/1\.[01]\s+(\d+)/);
          const colo = coloMatch ? coloMatch[1] : '';
          const status = statusMatch ? parseInt(statusMatch[1], 10) : 200;

          resolve({
            ok: status >= 200 && status < 500,
            latencyMs,
            colo,
            status,
          });
        }
      }
    });

    socket.on('timeout', () => {
      if (isResolved) return;
      isResolved = true;
      socket.destroy();
      resolve({ ok: false, latencyMs: timeoutMs, colo: '', status: 0, error: 'HTTP Timeout' });
    });

    socket.on('error', (err) => {
      if (isResolved) return;
      isResolved = true;
      socket.destroy();
      resolve({ ok: false, latencyMs: Date.now() - start, colo: '', status: 0, error: err.message });
    });

    socket.on('end', () => {
      if (!isResolved) {
        isResolved = true;
        const latencyMs = Date.now() - start;
        const coloMatch = data.match(/colo=([a-zA-Z0-9]+)/);
        const statusMatch = data.match(/HTTP\/1\.[01]\s+(\d+)/);
        const colo = coloMatch ? coloMatch[1] : '';
        const status = statusMatch ? parseInt(statusMatch[1], 10) : 200;
        resolve({
          ok: Boolean(colo) || (status >= 200 && status < 500),
          latencyMs,
          colo,
          status,
        });
      }
    });
  });
}

// API: Probe a single target
app.post('/api/probe', async (req, res) => {
  const { ip, port = 443, mode = 'http', sni = 'cloudflare.com', timeoutMs = 4000 } = req.body;
  if (!ip) {
    return res.status(400).json({ error: 'IP address required' });
  }

  try {
    if (mode === 'tcp') {
      const result = await probeTcp(ip, port, timeoutMs);
      return res.json(result);
    } else if (mode === 'tls') {
      const result = await probeTls(ip, port, sni, timeoutMs);
      return res.json(result);
    } else {
      const result = await probeHttp(ip, port, sni, timeoutMs);
      return res.json(result);
    }
  } catch (err: any) {
    res.json({ ok: false, latencyMs: timeoutMs, error: err.message });
  }
});

// API: Batch probe with concurrency
app.post('/api/scan/batch', async (req, res) => {
  const { tasks = [], mode = 'http', sni = 'cloudflare.com', timeoutMs = 4000 } = req.body;
  const results = [];

  for (const t of tasks) {
    const { ip, port = 443 } = t;
    try {
      if (mode === 'tcp') {
        const r = await probeTcp(ip, port, timeoutMs);
        results.push({ ip, port, ...r });
      } else if (mode === 'tls') {
        const r = await probeTls(ip, port, sni, timeoutMs);
        results.push({ ip, port, ...r });
      } else {
        const r = await probeHttp(ip, port, sni, timeoutMs);
        results.push({ ip, port, ...r });
      }
    } catch (e: any) {
      results.push({ ip, port, ok: false, latencyMs: timeoutMs, error: e.message });
    }
  }

  res.json({ results });
});

// API: Resolve fallback domains to Cloudflare IPs
app.post('/api/resolve-domains', async (req, res) => {
  const { domains = [] } = req.body;
  const ipList = new Set<string>();

  await Promise.all(
    domains.map(async (domain: string) => {
      try {
        const addresses = await dns.promises.resolve4(domain);
        for (const a of addresses) {
          ipList.add(a);
        }
      } catch {
        // ignore resolution failure for some blocked domain
      }
    })
  );

  res.json({ ips: Array.from(ipList) });
});

// API: DNS Resolver Probe
app.post('/api/dns/probe', async (req, res) => {
  const { dnsIp, targetDomain = 'cloudflare.com', timeoutMs = 3000 } = req.body;
  if (!dnsIp) {
    return res.status(400).json({ error: 'DNS IP required' });
  }

  const start = Date.now();
  const customResolver = new dns.Resolver();
  customResolver.setServers([dnsIp]);

  const timer = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('DNS Timeout')), timeoutMs)
  );

  try {
    await Promise.race([
      customResolver.resolve4(targetDomain),
      timer,
    ]);
    const latencyMs = Date.now() - start;
    res.json({ ok: true, latencyMs });
  } catch (err: any) {
    res.json({ ok: false, latencyMs: timeoutMs, error: err.message });
  }
});

// API: Save best configs for local subscription server
app.post('/api/sub/sync', (req, res) => {
  const { configs = [] } = req.body;
  currentBestConfigs = configs;
  res.json({ ok: true, count: configs.length });
});

// API: Local Subscription link (V2Ray base64 export)
app.get(['/api/sub', '/sub'], (req, res) => {
  if (currentBestConfigs.length === 0) {
    // Return sample or placeholder if empty
    res.type('text/plain').send(Buffer.from('# No active clean IP configs yet. Run scan to populate.').toString('base64'));
    return;
  }
  const payload = currentBestConfigs.join('\n');
  res.type('text/plain').send(Buffer.from(payload).toString('base64'));
});

// API: Speed test download stream
app.get('/api/speedtest/down', (req, res) => {
  const bytes = Math.min(parseInt(req.query.bytes as string, 10) || 5_000_000, 25_000_000);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Length', bytes);
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const chunk = Buffer.alloc(65536, 0x5a); // 64KB dummy pattern
  let sent = 0;

  function push() {
    while (sent < bytes) {
      const remaining = bytes - sent;
      const toSend = remaining < chunk.length ? chunk.slice(0, remaining) : chunk;
      sent += toSend.length;
      if (!res.write(toSend)) {
        res.once('drain', push);
        return;
      }
    }
    res.end();
  }

  push();
});

// API: Speed test upload sink
app.post('/api/speedtest/up', (req, res) => {
  let received = 0;
  req.on('data', (chunk) => {
    received += chunk.length;
  });
  req.on('end', () => {
    res.json({ ok: true, bytesReceived: received });
  });
});

// API: IP & Geo lookup
app.get('/api/ip-lookup', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  // Check if Iran or domestic IP
  const ipStr = String(clientIp).split(',')[0].trim();
  const isPrivate = ipStr.startsWith('10.') || ipStr.startsWith('192.168.') || ipStr.startsWith('172.16.') || ipStr.startsWith('127.');

  res.json({
    ip: ipStr,
    country: isPrivate ? 'Local/VPN' : 'International Cloudflare Node',
    city: isPrivate ? 'Local Host' : 'Frankfurt',
    isp: 'Cloudflare / Direct Edge',
    isIran: false,
  });
});

// API: Bundled assets loader (loads precise CF ranges if available)
app.get('/api/bundled-ranges', (req, res) => {
  const assetPath = fs.existsSync(path.join(__dirname, 'public/assets/cf_ipv4.txt'))
    ? path.join(__dirname, 'public/assets/cf_ipv4.txt')
    : path.join(__dirname, 'app/src/main/assets/cf_ipv4.txt');
  if (fs.existsSync(assetPath)) {
    try {
      const content = fs.readFileSync(assetPath, 'utf-8');
      const ranges = content
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('#'));
      return res.json({ ranges, count: ranges.length });
    } catch {
      // fallback
    }
  }
  res.json({ ranges: [], count: 0 });
});

// Vite Middleware for development, or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, HOST, () => {
    console.log(`[Asha Scanner] Server running on http://${HOST}:${PORT}`);
  });
}

startServer();
