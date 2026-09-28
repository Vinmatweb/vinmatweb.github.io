import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = resolve(
  process.argv[2] ?? join(projectRoot, "github-pages-export"),
);
const basePath = "/ai-fantasy-adventure";
const siteUrl = "https://vinmat.eu/ai-fantasy-adventure";
const sourceSiteUrl = "https://ai-fantasy-adventure.jirik66.chatgpt.site";

const data = JSON.parse(
  await readFile(join(projectRoot, "app/data/game-data.json"), "utf8"),
);
const workerModule = await import(
  `${pathToFileURL(join(projectRoot, "dist/server/index.js")).href}?export=${Date.now()}`
);
const worker = workerModule.default;
const env = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const context = { waitUntil() {}, passThroughOnException() {} };

const routes = [
  "",
  "/start",
  "/en",
  "/explorer",
  "/explorer/hrdinove",
  "/explorer/hrdinove/rasy",
  "/explorer/hrdinove/povolani",
  "/explorer/bestiar",
  "/explorer/vybaveni",
  "/explorer/magie",
  "/explorer/pravidla",
  "/explorer/vaelor",
  ...data.races.map((item) => `/explorer/hrdinove/rasy/${item.slug}`),
  ...data.classes.map((item) => `/explorer/hrdinove/povolani/${item.slug}`),
  ...data.heroes.map((item) => `/explorer/hrdinove/${item.slug}`),
  ...data.bestiaryCategories.map(
    (item) => `/explorer/bestiar/kategorie/${item.slug}`,
  ),
  ...data.bestiary.map((item) => `/explorer/bestiar/${item.slug}`),
  ...data.equipmentCategories.map(
    (item) => `/explorer/vybaveni/kategorie/${item.slug}`,
  ),
  ...data.equipment.map((item) => `/explorer/vybaveni/${item.slug}`),
  ...data.magicSchools.map((item) => `/explorer/magie/${item.slug}`),
  ...data.spells.map(
    (item) => `/explorer/magie/${item.schoolSlug}/${item.slug}`,
  ),
];

function makeStatic(html) {
  let output = html
    .replaceAll(sourceSiteUrl, siteUrl)
    .replace(/<link\s+rel="modulepreload"[^>]*>/g, "")
    .replace(/<script(?![^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<meta\s+name="codex-preview"[^>]*>/g, "")
    .replace(/(href|src)="\/(?!\/)/g, `$1="${basePath}/`)
    .replace(
      "</body>",
      `<script src="${basePath}/static.js" defer></script></body>`,
    );

  // GitHub Pages serves directory indexes at their slash-terminated URL.
  // Point links and metadata there directly to avoid a redirect on every visit.
  for (const route of routes.filter(Boolean).sort((a, b) => b.length - a.length)) {
    for (const suffix of ['"', "#", "?"]) {
      output = output
        .replaceAll(
          `${siteUrl}${route}${suffix}`,
          `${siteUrl}${route}/${suffix}`,
        )
        .replaceAll(
          `${basePath}${route}${suffix}`,
          `${basePath}${route}/${suffix}`,
        );
    }
  }

  return output;
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

for (const route of routes) {
  const response = await worker.fetch(
    new Request(`http://localhost${route || "/"}`, {
      headers: { accept: "text/html" },
    }),
    env,
    context,
  );
  if (response.status !== 200) {
    throw new Error(`Route ${route || "/"} returned ${response.status}`);
  }
  const outputFile = join(outputRoot, route.slice(1), "index.html");
  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, makeStatic(await response.text()));
}

const cssFiles = (await readdir(join(projectRoot, "dist/client/assets")))
  .filter((file) => file.endsWith(".css"))
  .map((file) => `assets/${file}`);
for (const cssFile of cssFiles) {
  const target = join(outputRoot, cssFile);
  await mkdir(dirname(target), { recursive: true });
  await cp(join(projectRoot, "dist/client", cssFile), target);
}
await cp(
  join(projectRoot, "dist/client/assets/illustrations"),
  join(outputRoot, "assets/illustrations"),
  { recursive: true },
);
await cp(
  join(projectRoot, "dist/client/assets/heroes"),
  join(outputRoot, "assets/heroes"),
  { recursive: true },
);
await cp(
  join(projectRoot, "dist/client/assets/bestiary"),
  join(outputRoot, "assets/bestiary"),
  { recursive: true },
);
await cp(
  join(projectRoot, "dist/client/assets/equipment"),
  join(outputRoot, "assets/equipment"),
  { recursive: true },
);
await cp(
  join(projectRoot, "dist/client/assets/magic"),
  join(outputRoot, "assets/magic"),
  { recursive: true },
);
await cp(
  join(projectRoot, "dist/client/downloads"),
  join(outputRoot, "downloads"),
  { recursive: true },
);
await cp(join(projectRoot, "dist/client/favicon.svg"), join(outputRoot, "favicon.svg"));
await cp(join(projectRoot, "dist/client/og-image.jpg"), join(outputRoot, "og-image.jpg"));

const staticScript = `(() => {
  const fold = (value) => value.toLocaleLowerCase('cs');
  const illustratedSpellSchools = new Set(["obecna", "ohen", "voda", "vzduch", "zeme", "mysl", "duch", "svetla", "temna", "prirodni"]);
  const spellRouteFromPath = (pathname) => {
    const parts = pathname.split("/").filter(Boolean);
    const magicIndex = parts.findIndex((part, index) => part === "magie" && parts[index - 1] === "explorer");
    if (magicIndex < 0) return null;
    const school = parts[magicIndex + 1];
    const spell = parts[magicIndex + 2];
    if (!illustratedSpellSchools.has(school) || !spell) return null;
    const prefixParts = parts.slice(0, magicIndex - 1);
    return {
      school,
      spell,
      prefix: prefixParts.length ? "/" + prefixParts.join("/") : "",
    };
  };
  const spellImagePath = (route) =>
    route.prefix + "/assets/magic/spells/" + route.school + "/" + route.spell + ".webp";

  const currentSpell = spellRouteFromPath(location.pathname);
  if (currentSpell) {
    const slot = document.querySelector(".asset-slot");
    const image = slot?.querySelector(".asset-slot__image");
    const title = slot?.querySelector(".asset-slot__copy strong")?.textContent?.trim();
    const eyebrow = slot?.querySelector(".asset-slot__copy > span");
    if (image) {
      image.src = spellImagePath(currentSpell);
      image.alt = title ? "Ilustrace kouzla " + title : "Ilustrace kouzla";
    }
    if (eyebrow) eyebrow.textContent = "Ilustrace konkrétního kouzla";
    slot?.querySelectorAll(".asset-slot__copy p").forEach((paragraph) => {
      if ((paragraph.textContent || "").startsWith("Společný motiv školy")) paragraph.remove();
    });
  }

  document.querySelectorAll(".collection-card").forEach((card) => {
    const href = card.getAttribute("href");
    if (!href || card.querySelector(".collection-card__image")) return;
    const route = spellRouteFromPath(new URL(href, location.href).pathname);
    if (!route) return;
    const figure = document.createElement("span");
    figure.className = "collection-card__image";
    const image = document.createElement("img");
    image.src = spellImagePath(route);
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    figure.append(image);
    card.classList.add("collection-card--image");
    card.insertBefore(figure, card.firstChild);
  });
  document.querySelectorAll('.collection-search').forEach((root) => {
    const input = root.querySelector('input');
    const count = root.querySelector('.search-count');
    const cards = [...root.querySelectorAll('.collection-card')];
    if (!input || !count) return;
    input.addEventListener('input', () => {
      const query = fold(input.value.trim());
      let visible = 0;
      cards.forEach((card) => {
        const show = !query || fold(card.textContent || '').includes(query);
        card.hidden = !show;
        if (show) visible += 1;
      });
      count.textContent = String(visible);
    });
  });

  document.querySelectorAll('.copy-prompt').forEach((root) => {
    const button = root.querySelector('button');
    const quote = root.querySelector('blockquote');
    if (!button || !quote) return;
    const original = button.textContent;
    button.addEventListener('click', async () => {
      const text = (quote.textContent || '').trim().replace(/^„|“$/g, '');
      await navigator.clipboard.writeText(text);
      button.textContent = document.querySelector('main[lang="en"]') ? 'Copied' : 'Zkopírováno';
      window.setTimeout(() => { button.textContent = original; }, 1800);
    });
  });
})();
`;
await writeFile(join(outputRoot, "static.js"), staticScript);

const manifest = {
  name: "AI Fantasy Adventure",
  short_name: "AI Fantasy",
  description:
    "Kooperativní fantasy RPG pro děti a rodiče s AI Pánem jeskyně.",
  start_url: `${basePath}/`,
  scope: `${basePath}/`,
  display: "standalone",
  background_color: "#080d12",
  theme_color: "#080d12",
  lang: "cs",
  icons: [
    { src: `${basePath}/favicon.svg`, sizes: "any", type: "image/svg+xml" },
  ],
};
await writeFile(
  join(outputRoot, "manifest.webmanifest"),
  JSON.stringify(manifest, null, 2),
);

const sitemapEntries = routes
  .map((route) => {
    const location = `${siteUrl}${route ? `${route}/` : "/"}`;
    return `  <url><loc>${location}</loc><lastmod>2026-08-19</lastmod></url>`;
  })
  .join("\n");
await writeFile(
  join(outputRoot, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`,
);
await writeFile(
  join(outputRoot, "robots.txt"),
  `User-agent: *\nAllow: /ai-fantasy-adventure/\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);

console.log(
  JSON.stringify(
    {
      outputRoot,
      routeCount: routes.length,
      cssFiles: cssFiles.map((file) => basename(file)),
    },
    null,
    2,
  ),
);
