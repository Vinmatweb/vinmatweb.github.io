import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const exportRoot = resolve(
  process.argv[2] ?? join(projectRoot, "github-pages-export"),
);
const prefix = "/ai-fantasy-adventure";

async function filesUnder(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await filesUnder(path)));
    else result.push(path);
  }
  return result;
}

const files = await filesUnder(exportRoot);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const failures = [];

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  if (html.includes("self.__VINEXT")) {
    failures.push(`${relative(exportRoot, file)} contains Vinext hydration data`);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (!url.startsWith(`${prefix}/`)) continue;
    const clean = url.slice(prefix.length + 1).split(/[?#]/)[0];
    if (clean && !extname(clean) && !clean.endsWith("/")) {
      failures.push(`${relative(exportRoot, file)} redirects instead of linking directly: ${url}`);
    }
    const target = extname(clean)
      ? join(exportRoot, clean)
      : join(exportRoot, clean, "index.html");
    try {
      await access(target);
    } catch {
      failures.push(`${relative(exportRoot, file)} -> ${url}`);
    }
  }
}

const sitemap = await readFile(join(exportRoot, "sitemap.xml"), "utf8");
const sitemapCount = [...sitemap.matchAll(/<url>/g)].length;
if (sitemapCount !== htmlFiles.length) {
  failures.push(`sitemap ${sitemapCount}, HTML ${htmlFiles.length}`);
}
for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  if (!match[1].endsWith("/")) {
    failures.push(`sitemap URL redirects instead of resolving directly: ${match[1]}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Validated ${htmlFiles.length} HTML routes and ${files.length} exported files.`,
);
