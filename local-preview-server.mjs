import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "dist");
const port = Number.parseInt(process.env.PORT ?? "4173", 10);
const host = process.env.HOST ?? "0.0.0.0";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

const resolveFilePath = (requestUrl) => {
  const requestPath = new URL(requestUrl, "http://localhost").pathname;
  const sanitizedPath = path.normalize(decodeURIComponent(requestPath)).replace(/^(\.\.[/\\])+/, "");
  const candidatePath = path.join(rootDir, sanitizedPath);

  if (existsSync(candidatePath) && statSync(candidatePath).isFile()) {
    return candidatePath;
  }

  if (existsSync(candidatePath) && statSync(candidatePath).isDirectory()) {
    const indexPath = path.join(candidatePath, "index.html");
    if (existsSync(indexPath)) {
      return indexPath;
    }
  }

  return path.join(rootDir, "index.html");
};

const server = http.createServer((request, response) => {
  try {
    const filePath = resolveFilePath(request.url ?? "/");
    const ext = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": contentTypes[ext] ?? "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    response.end(`Server error: ${error.message}`);
  }
});

server.listen(port, host, () => {
  console.log(`Preview server running at http://${host}:${port}`);
});
