import fs from "node:fs";
import path from "node:path";

const distDir = process.argv[2] ?? "dist";
const dataDir = process.argv[3] ?? "public/data";
const siteUrl = (process.env.MOVIE_NIGHT_SITE_URL ?? "https://mvnight.xyz").replace(/\/$/, "");
const brand = "Movie Night";

function publicCoverUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "static.olelive.com" ? `${siteUrl}/covers${parsed.pathname}` : url;
  } catch {
    return url;
  }
}

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

function descriptionFor(title) {
  const fallback = [title.title, title.year || "", title.area, title.genre].filter((value) => value && value !== "未知").join("，");
  return String(title.description || fallback || `${title.title}在线观看`).replace(/\s+/g, " ").trim().slice(0, 180);
}

function inject(template, { title, description, canonical, image, schema, heading }) {
  const tags = [
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    '<meta property="og:locale" content="zh_CN" />',
    '<meta property="og:type" content="video.other" />',
    `<meta property="og:site_name" content="${brand}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : "",
    '<meta name="twitter:card" content="summary_large_image" />',
    `<script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>`,
  ].filter(Boolean).join("\n    ");
  const fallback = `<div id="root"><main style="max-width:920px;margin:48px auto;padding:24px;color:#fff;font-family:sans-serif;background:#141414"><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p></main></div>`;

  return template
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description"[^>]*\/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace("</head>", `    ${tags}\n  </head>`)
    .replace('<div id="root"></div>', fallback);
}

function write(file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(dataDir, "manifest.json"), "utf8"));
const titles = [];
for (const file of fs.readdirSync(path.join(dataDir, "details")).filter((name) => !name.startsWith(".") && name.endsWith(".json"))) {
  const bucket = JSON.parse(fs.readFileSync(path.join(dataDir, "details", file), "utf8"));
  titles.push(...Object.values(bucket));
}

const homeDescription = `${brand} 在线影视库，收录 ${manifest.playableTotal} 部可播放电影、剧集、动漫与综艺。`;
const homeHtml = inject(template, {
  title: `${brand} - 在线电影、剧集、动漫与综艺`,
  description: homeDescription,
  canonical: `${siteUrl}/`,
  heading: brand,
  schema: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand,
    url: `${siteUrl}/`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
});
write(path.join(distDir, "index.html"), homeHtml);

const sitemapEntries = [{ loc: `${siteUrl}/`, lastmod: manifest.generatedAt?.slice(0, 10), priority: "1.0" }];
for (const item of titles) {
  const canonical = `${siteUrl}/title/${item.id}`;
  const description = descriptionFor(item);
  const pageTitle = `${item.title}${item.year > 0 ? ` (${item.year})` : ""} 在线观看 | ${brand}`;
  const episodic = ["剧集", "动漫", "综艺"].includes(item.category);
  const schema = {
    "@context": "https://schema.org",
    "@type": episodic ? "TVSeries" : "Movie",
    name: item.title,
    url: canonical,
    image: item.cover_url ? [publicCoverUrl(item.cover_url)] : undefined,
    description,
    dateCreated: item.year || undefined,
    genre: item.genre && item.genre !== "未知" ? item.genre.split("/").map((value) => value.trim()) : undefined,
    director: item.director ? item.director.split("/").map((name) => ({ "@type": "Person", name: name.trim() })) : undefined,
    actor: item.actors ? item.actors.split("/").slice(0, 12).map((name) => ({ "@type": "Person", name: name.trim() })) : undefined,
  };
  write(path.join(distDir, "title", `${item.id}.html`), inject(template, {
    title: pageTitle,
    description,
    canonical,
    image: publicCoverUrl(item.cover_url),
    schema,
    heading: item.title,
  }));
  sitemapEntries.push({ loc: canonical, lastmod: item.updated_at?.slice(0, 10), priority: "0.7" });
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.map((entry) => [
  "  <url>",
  `    <loc>${escapeHtml(entry.loc)}</loc>`,
  entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : "",
  "    <changefreq>weekly</changefreq>",
  `    <priority>${entry.priority}</priority>`,
  "  </url>",
].filter(Boolean).join("\n")).join("\n")}\n</urlset>\n`;

write(path.join(distDir, "sitemap.xml"), sitemap);
write(path.join(distDir, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /play/\nDisallow: /data/sources/\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log(JSON.stringify({ siteUrl, titles: titles.length, urls: sitemapEntries.length }));
