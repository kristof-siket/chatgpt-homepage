import { extname, join, normalize, sep } from "node:path";
import service from "./service.mjs";

const root = import.meta.dir;

const contentTypes = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".ico": "image/x-icon",
	".txt": "text/plain; charset=utf-8",
	".json": "application/json; charset=utf-8",
};

const notFound = () => new Response("Not found", { status: 404 });

async function fetch(request) {
	const { pathname } = new URL(request.url);
	let relative;
	try {
		relative = decodeURIComponent(pathname);
	} catch {
		return notFound();
	}
	if (relative.endsWith("/")) relative += "index.html";
	const filePath = normalize(join(root, relative));
	if (filePath !== root && !filePath.startsWith(root + sep)) return notFound();
	const file = Bun.file(filePath);
	if (!(await file.exists())) return notFound();
	return new Response(file, {
		headers: { "content-type": contentTypes[extname(filePath).toLowerCase()] ?? "application/octet-stream" },
	});
}

Bun.serve({
	port: service.port(),
	hostname: "0.0.0.0",
	fetch,
});
