import fs from "node:fs";
import path from "node:path";

const distDir = process.argv[2] ?? "dist";
const dataDir = process.argv[3] ?? "public/data";
const siteUrl = (process.env.MOVIE_NIGHT_SITE_URL ?? "https://mvnight.xyz").replace(/\/$/, "");
const brand = "Movie Night";
const sitemapUrlLimit = 3000;
const seoCategories = [
  { name: "电影", slug: "movie" },
  { name: "剧集", slug: "series" },
  { name: "动漫", slug: "anime" },
  { name: "综艺", slug: "variety" },
];

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

function splitValues(value) {
  return String(value ?? "").split(/\s*[\/,|]\s*/).map((item) => item.trim()).filter(Boolean);
}

function known(value) {
  return Boolean(value && value !== "未知");
}

function factSummaryFor(title) {
  const facts = [
    title.year > 0 ? `${title.year}年` : "",
    known(title.area) ? title.area : "",
    known(title.genre) ? title.genre : "",
    title.category,
  ].filter(Boolean).join(" · ");
  const credits = [
    title.director ? `导演：${title.director}` : "",
    title.actors ? `主演：${splitValues(title.actors).slice(0, 6).join("、")}` : "",
  ].filter(Boolean).join("；");
  return `《${title.title}》${facts ? `（${facts}）` : ""}在线播放${credits ? `，${credits}` : ""}。`;
}

function descriptionFor(title) {
  const lead = `${title.title}${title.year > 0 ? `（${title.year}）` : ""}在线观看。`;
  const facts = [
    known(title.area) ? `地区：${title.area}` : "",
    known(title.genre) ? `类型：${title.genre}` : "",
    title.director ? `导演：${title.director}` : "",
    title.actors ? `主演：${splitValues(title.actors).slice(0, 5).join("、")}` : "",
  ].filter(Boolean).join("；");
  return `${lead}${facts ? `${facts}。` : ""}${title.description ? title.description : ""}`.replace(/\s+/g, " ").trim().slice(0, 160);
}

function inject(template, { title, description, canonical, image, schema, bodyHtml, ogType = "website" }) {
  const tags = [
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    '<meta property="og:locale" content="zh_CN" />',
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:site_name" content="${brand}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : "",
    '<meta name="twitter:card" content="summary_large_image" />',
    `<script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>`,
  ].filter(Boolean).join("\n    ");
  const fallback = `<div id="root">${bodyHtml}</div>`;

  return template
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description"[^>]*\/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace("</head>", `    ${tags}\n  </head>`)
    .replace('<div id="root"></div>', fallback);
}

function staticShell(content) {
  return `<main style="max-width:1080px;margin:48px auto;padding:24px;color:#fff;font-family:Arial,sans-serif;background:#141414;line-height:1.65">${content}</main>`;
}

function renderTitleLinks(items, limit = 96) {
  return `<ul style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px 24px;padding-left:20px">${items.slice(0, limit).map((item) => `<li><a style="color:#fff" href="/title/${item.id}">${escapeHtml(item.title)}${item.year > 0 ? ` (${item.year})` : ""}</a></li>`).join("")}</ul>`;
}

function renderHomeBody(titles) {
  const categoryLinks = seoCategories.map((category) => `<a style="color:#fff" href="/category/${category.slug}">${category.name}在线观看</a>`).join(" · ");
  return staticShell(`<header><h1>${brand} 在线电影、剧集、动漫与综艺</h1><p>${categoryLinks}</p></header><section><h2>最近更新</h2>${renderTitleLinks(titles, 80)}</section>`);
}

function renderCategoryBody(category, items) {
  return staticShell(`<nav aria-label="面包屑"><a style="color:#fff" href="/">首页</a> / ${category.name}</nav><header><h1>${category.name}在线观看</h1><p>浏览最新更新的${category.name}，按片名进入详情页查看年份、地区、演员、导演与播放信息。</p></header><section><h2>最新${category.name}</h2>${renderTitleLinks(items)}</section>`);
}

function renderTitleBody(item, category, related) {
  const summary = factSummaryFor(item);
  const details = [
    item.year > 0 ? ["年份", item.year] : null,
    known(item.area) ? ["地区", item.area] : null,
    known(item.genre) ? ["类型", item.genre] : null,
    item.director ? ["导演", item.director] : null,
    item.actors ? ["主演", item.actors] : null,
    item.status_text ? ["状态", item.status_text] : null,
  ].filter(Boolean);
  const facts = details.length ? `<dl>${details.map(([label, value]) => `<dt style="font-weight:700">${label}</dt><dd style="margin:0 0 8px">${escapeHtml(value)}</dd>`).join("")}</dl>` : "";
  const description = item.description ? `<section><h2>剧情简介</h2><p>${escapeHtml(item.description)}</p></section>` : "";
  return staticShell(`<nav aria-label="面包屑"><a style="color:#fff" href="/">首页</a> / <a style="color:#fff" href="/category/${category.slug}">${category.name}</a> / ${escapeHtml(item.title)}</nav><article><h1>${escapeHtml(item.title)} 在线观看</h1><p>${escapeHtml(summary)}</p>${facts}${description}</article><section><h2>相关${category.name}</h2>${renderTitleLinks(related, 8)}</section>`);
}

function write(file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

function renderUrlset(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map((entry) => [
    "  <url>",
    `    <loc>${escapeHtml(entry.loc)}</loc>`,
    entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : "",
    "    <changefreq>weekly</changefreq>",
    `    <priority>${entry.priority}</priority>`,
    "  </url>",
  ].filter(Boolean).join("\n")).join("\n")}\n</urlset>\n`;
}

function renderSitemapIndex(files) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files.map((file) => [
    "  <sitemap>",
    `    <loc>${escapeHtml(`${siteUrl}/${file}`)}</loc>`,
    "  </sitemap>",
  ].join("\n")).join("\n")}\n</sitemapindex>\n`;
}

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(dataDir, "manifest.json"), "utf8"));
const titles = [];
for (const file of fs.readdirSync(path.join(dataDir, "details")).filter((name) => !name.startsWith(".") && name.endsWith(".json"))) {
  const bucket = JSON.parse(fs.readFileSync(path.join(dataDir, "details", file), "utf8"));
  titles.push(...Object.values(bucket));
}

const titlesByFreshness = [...titles].sort((left, right) => {
  const updated = String(right.updated_at ?? "").localeCompare(String(left.updated_at ?? ""));
  return updated || Number(right.id) - Number(left.id);
});
const categoriesByName = new Map(seoCategories.map((category) => [category.name, category]));
const categoryGroups = new Map(seoCategories.map((category) => [category.name, titlesByFreshness.filter((item) => item.category === category.name)]));
const relatedGroups = new Map();
for (const item of titles) {
  const genre = known(item.genre) ? splitValues(item.genre)[0] : "";
  const key = `${item.category}:${genre}`;
  relatedGroups.set(key, [...(relatedGroups.get(key) ?? []), item]);
}

function relatedTitlesFor(item) {
  const genre = known(item.genre) ? splitValues(item.genre)[0] : "";
  const genreGroup = relatedGroups.get(`${item.category}:${genre}`) ?? [];
  const pool = genreGroup.length > 8 ? genreGroup : categoryGroups.get(item.category) ?? titlesByFreshness;
  const related = [];
  const start = Math.abs(Number(item.id)) % pool.length;
  for (let offset = 0; offset < pool.length && related.length < 8; offset += 1) {
    const candidate = pool[(start + offset) % pool.length];
    if (candidate.id !== item.id) related.push(candidate);
  }
  return related;
}

const homeDescription = `${brand} 在线影视库，收录 ${manifest.playableTotal} 部可播放电影、剧集、动漫与综艺。`;
const homeHtml = inject(template, {
  title: `${brand} - 在线电影、剧集、动漫与综艺`,
  description: homeDescription,
  canonical: `${siteUrl}/`,
  bodyHtml: renderHomeBody(titlesByFreshness),
  schema: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand,
    url: `${siteUrl}/`,
    inLanguage: "zh-CN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
});
write(path.join(distDir, "index.html"), homeHtml);

const sitemapEntries = [{ loc: `${siteUrl}/`, lastmod: manifest.generatedAt?.slice(0, 10), priority: "1.0" }];
for (const category of seoCategories) {
  const categoryItems = categoryGroups.get(category.name) ?? [];
  const canonical = `${siteUrl}/category/${category.slug}`;
  const description = `${category.name}在线观看，浏览 ${categoryItems.length} 部${category.name}的年份、地区、演员、导演与播放信息。`;
  write(path.join(distDir, "category", `${category.slug}.html`), inject(template, {
    title: `${category.name}在线观看 | ${brand}`,
    description,
    canonical,
    bodyHtml: renderCategoryBody(category, categoryItems),
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${category.name}在线观看`,
      url: canonical,
      description,
      inLanguage: "zh-CN",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: categoryItems.slice(0, 96).map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          url: `${siteUrl}/title/${item.id}`,
        })),
      },
    },
  }));
  sitemapEntries.push({ loc: canonical, lastmod: manifest.generatedAt?.slice(0, 10), priority: "0.8" });
}

for (const item of titles) {
  const canonical = `${siteUrl}/title/${item.id}`;
  const description = descriptionFor(item);
  const pageTitle = `${item.title}${item.year > 0 ? ` (${item.year})` : ""} 在线观看 | ${brand}`;
  const episodic = ["剧集", "动漫", "综艺"].includes(item.category);
  const category = categoriesByName.get(item.category) ?? seoCategories[0];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": episodic ? "TVSeries" : "Movie",
        name: item.title,
        url: canonical,
        image: item.cover_url ? [publicCoverUrl(item.cover_url)] : undefined,
        description,
        dateCreated: item.year > 0 ? String(item.year) : undefined,
        genre: known(item.genre) ? splitValues(item.genre) : undefined,
        director: item.director ? splitValues(item.director).map((name) => ({ "@type": "Person", name })) : undefined,
        actor: item.actors ? splitValues(item.actors).slice(0, 12).map((name) => ({ "@type": "Person", name })) : undefined,
        inLanguage: "zh-CN",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "首页", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: category.name, item: `${siteUrl}/category/${category.slug}` },
          { "@type": "ListItem", position: 3, name: item.title, item: canonical },
        ],
      },
    ],
  };
  write(path.join(distDir, "title", `${item.id}.html`), inject(template, {
    title: pageTitle,
    description,
    canonical,
    image: publicCoverUrl(item.cover_url),
    schema,
    bodyHtml: renderTitleBody(item, category, relatedTitlesFor(item)),
    ogType: "video.other",
  }));
  sitemapEntries.push({ loc: canonical, lastmod: item.updated_at?.slice(0, 10), priority: "0.7" });
}

for (const file of fs.readdirSync(distDir).filter((name) => /^sitemap-\d+\.xml$/.test(name))) {
  fs.unlinkSync(path.join(distDir, file));
}

const sitemapFiles = [];
for (let offset = 0; offset < sitemapEntries.length; offset += sitemapUrlLimit) {
  const file = `sitemap-${sitemapFiles.length + 1}.xml`;
  sitemapFiles.push(file);
  write(path.join(distDir, file), renderUrlset(sitemapEntries.slice(offset, offset + sitemapUrlLimit)));
}

write(path.join(distDir, "sitemap.xml"), renderSitemapIndex(sitemapFiles));
write(path.join(distDir, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /play/\nDisallow: /data/sources/\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log(JSON.stringify({ siteUrl, titles: titles.length, urls: sitemapEntries.length, sitemaps: sitemapFiles.length }));
