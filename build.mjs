import { mkdir, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The deploy ships only the build output, so everything the app reads or
// imports at run time is copied into dist/: the server, its service
// declaration, and the static files it serves.
const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const files = ['server.mjs', 'service.mjs', 'index.html', 'style.css', 'travel-image.jpg'];

await mkdir(dist, { recursive: true });
for (const file of files) {
  await copyFile(join(root, file), join(dist, file));
}
console.log(`Built dist/ (${files.length} files)`);
