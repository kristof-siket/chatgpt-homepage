/**
 * The app's server entry: serves the static site files that sit next to this
 * file in the build output. Prisma Compute boots it through the service
 * declaration (`service.mjs`), which also provides the reserved port.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import service from './service.mjs';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const server = createServer(async (request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  } catch {
    pathname = '/';
  }
  if (pathname.endsWith('/')) pathname += 'index.html';

  // Only ever serve files from the build output this file lives in.
  const filePath = path.normalize(path.join(rootDir, pathname));
  if (filePath !== rootDir && !filePath.startsWith(rootDir + path.sep)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream',
      'Content-Length': body.length,
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

// The port comes from the service declaration — never from process.env.
const port = service.port();
server.listen(port, '0.0.0.0', () => {
  console.log(`homepage listening on http://0.0.0.0:${port}`);
});
