// Build: assemble the deployable build output under dist/.
// The service declaration (service.mjs) names this directory as the built tree
// that deploy copies verbatim, so everything the server reads at run time —
// the static site and the service declaration it imports — must be in here.
import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, "dist");

const staticFiles = ["index.html", "style.css", "travel-image.jpg", "server.mjs", "service.mjs"];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const file of staticFiles) {
	await copyFile(path.join(root, file), path.join(dist, file));
}
console.log("built dist/:", (await readdir(dist)).sort().join(", "));
