/**
 * Build script: assembles the build output (dist/) that the deploy ships —
 * the static site files, the server entry, and the service declaration the
 * server imports at run time.
 */
import { copyFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const files = ['index.html', 'style.css', 'travel-image.jpg', 'server.mjs', 'service.mjs'];
await Promise.all(files.map((file) => copyFile(path.join(root, file), path.join(dist, file))));

console.log(`Built dist/ (${files.length} files).`);
