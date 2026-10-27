import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { loadEnv } from "vite";

const siteUrl = "https://kavisdryfruits.com";
const env = loadEnv("production", process.cwd(), "");
const apiUrl = (process.env.VITE_API_URL || env.VITE_API_URL || `${siteUrl}/api`).replace(/\/+$/, "");
const sitemapPath = resolve("public", "sitemap.xml");
const staticPages = [
  "/",
  "/shop/",
  "/aboutus/",
  "/contactus/",
  "/healthbenefits/",
  "/combos/",
  "/offers/",
  "/privacy-policy/",
  "/return-policy/",
];

const escapeXml = (value) => String(value).replace(/[<>&'"]/g, (character) => ({
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&apos;",
  '"': "&quot;",
}[character]));

const slugify = (value) => String(value || "")
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? `<lastmod>${date.toISOString().slice(0, 10)}</lastmod>`
    : "";
};

const fetchJson = async (path) => {
  const response = await fetch(`${apiUrl}${path}`, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error(`${path} did not return a JSON array`);
  return data;
};

const isPublic = (record) => {
  const status = String(record.status || "").trim().toLowerCase();
  return !status || ["active", "available", "published"].includes(status);
};

const entries = new Map(staticPages.map((path) => [`${siteUrl}${path}`, ""]));

try {
  const [products, combos, categories] = await Promise.all([
    fetchJson("/products"),
    fetchJson("/combos"),
    fetchJson("/categories"),
  ]);

  for (const product of products.filter(isPublic)) {
    if (String(product.category || "").toLowerCase() === "combo") continue;
    const id = String(product.id ?? product.productId ?? "");
    if (!/^\d+$/.test(id)) continue;
    entries.set(`${siteUrl}/shop/${encodeURIComponent(id)}/`, formatDate(product.updated_at || product.created_at));
  }

  for (const combo of combos.filter(isPublic)) {
    const id = String(combo.id ?? "");
    if (!/^\d+$/.test(id)) continue;
    entries.set(`${siteUrl}/combos/${encodeURIComponent(id)}/`, formatDate(combo.updated_at || combo.created_at));
  }

  for (const category of categories) {
    const slug = slugify(category.cname || category.name);
    if (slug) {
      entries.set(`${siteUrl}/category/${slug}/`, formatDate(category.updated_at || category.created_at));
    }
  }
} catch (error) {
  console.warn(`[sitemap] Could not load live catalog from ${apiUrl}: ${error.message}`);
  console.warn("[sitemap] Building the sitemap with public static pages only.");
  for (const categorySlug of ["dryfruits", "nuts", "dates", "seeds"]) {
    entries.set(`${siteUrl}/category/${categorySlug}/`, "");
  }

  try {
    const previousSitemap = await readFile(sitemapPath, "utf8");
    for (const match of previousSitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
      if (match[1].startsWith(`${siteUrl}/`)) entries.set(match[1], "");
    }
  } catch {
    // The fallback category URLs above are sufficient for a fresh checkout.
  }
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...[...entries.entries()].map(([loc, lastmod]) =>
    `  <url><loc>${escapeXml(loc)}</loc>${lastmod}</url>`),
  "</urlset>",
  "",
].join("\n");

await writeFile(sitemapPath, xml, "utf8");
console.log(`[sitemap] Wrote ${entries.size} public URLs.`);
