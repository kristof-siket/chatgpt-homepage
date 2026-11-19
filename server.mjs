import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import service from './service.mjs';

// Static files live beside this file in the build output.
const root = resolve(fileURLToPath(new URL('.', import.meta.url)));

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

async function serve(url, res) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }
  if (pathname.endsWith('/')) pathname += 'index.html';

  const filePath = resolve(root, '.' + pathname);
  if (filePath !== root && !filePath.startsWith(root + sep)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  const type = contentTypes[extname(filePath).toLowerCase()];
  if (!type) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    return;
  }

  try {
    const body = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': body.length });
    res.end(body);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Internal error');
    }
  }
}

const server = createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
    return;
  }
  serve(req.url ?? '/', res).catch(() => {
    if (!res.headersSent) res.writeHead(500);
    res.end('Internal error');
  });
});

// Compute routes external HTTP to the VM: bind every interface, not loopback only.
server.listen(service.port(), '0.0.0.0');
