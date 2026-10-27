import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { loadEnv } from "vite";

const siteUrl = "https://kavisdryfruits.com";
const env = loadEnv("production", process.cwd(), "");
const apiUrl = (process.env.VITE_API_URL || env.VITE_API_URL || `${siteUrl}/api`).replace(/\/+$/, "");
const distRoot = resolve("dist");
const template = await readFile(resolve(distRoot, "index.html"), "utf8");

const fetchJson = async (path) => {
  const response = await fetch(`${apiUrl}${path}`, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error(`${path} did not return a JSON array`);
  return data;
};

const publicRecord = (record) => {
  const status = String(record.status || "").trim().toLowerCase();
  return !status || ["active", "available", "published"].includes(status);
};

const slugify = (value) => String(value || "")
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const text = (value) => String(value || "").replace(/\s+/g, " ").trim();
const canonicalImage = (value) => {
  const image = text(value);
  return image.replace(/^http:\/\/(?:www\.)?kavisdryfruits\.com\//i, `${siteUrl}/`);
};
const htmlAttribute = (value) => text(value)
  .replace(/&/g, "&amp;")
  .replace(/"/g, "&quot;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");
const htmlText = (value) => text(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");
const jsonForHtml = (value) => JSON.stringify(value).replace(/</g, "\\u003c");
const descriptionFor = (value, fallback) => {
  const source = text(value) || fallback;
  return source.length > 155 ? `${source.slice(0, 152).trimEnd()}...` : source;
};
const parseArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const replaceMeta = (html, selector, replacement) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(new RegExp(`<meta\\s+${escapedSelector}[^>]*>`, "i"), replacement);
};

const createPageHtml = ({ title, description, canonical, image, schema, bodyHtml, type = "website" }) => {
  const safeTitle = htmlAttribute(title);
  const safeDescription = htmlAttribute(description);
  const safeCanonical = htmlAttribute(canonical);
  const safeImage = htmlAttribute(image || `${siteUrl}/Kavi_logo.png`);
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
  html = replaceMeta(html, 'name="description"', `<meta name="description" content="${safeDescription}" />`);
  html = replaceMeta(html, 'property="og:title"', `<meta property="og:title" content="${safeTitle}" />`);
  html = replaceMeta(html, 'property="og:description"', `<meta property="og:description" content="${safeDescription}" />`);
  html = replaceMeta(html, 'property="og:image"', `<meta property="og:image" content="${safeImage}" />`);
  html = replaceMeta(html, 'property="og:type"', `<meta property="og:type" content="${htmlAttribute(type)}" />`);
  html = replaceMeta(html, 'property="og:url"', `<meta property="og:url" content="${safeCanonical}" />`);
  html = replaceMeta(html, 'name="twitter:title"', `<meta name="twitter:title" content="${safeTitle}" />`);
  html = replaceMeta(html, 'name="twitter:description"', `<meta name="twitter:description" content="${safeDescription}" />`);
  html = replaceMeta(html, 'name="twitter:image"', `<meta name="twitter:image" content="${safeImage}" />`);
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${safeCanonical}" />`);
  if (bodyHtml) {
    html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${bodyHtml}</div>`);
  }
  html = html.replace("</head>", `<script type="application/ld+json">${jsonForHtml(schema)}</script>\n</head>`);
  return html;
};

const writeRoutePage = async (routePath, metadata) => {
  const outputPath = resolve(distRoot, routePath, "index.html");
  await mkdir(resolve(distRoot, routePath), { recursive: true });
  await writeFile(outputPath, createPageHtml(metadata), "utf8");
};

try {
  const [products, combos, categories] = await Promise.all([
    fetchJson("/products"),
    fetchJson("/combos"),
    fetchJson("/categories"),
  ]);
  let generated = 0;
  const staticPages = [
    {
      path: "shop",
      title: "Shop Premium Dry Fruits, Nuts & Seeds | Kavi's Dry Fruits",
      description: "Shop premium dry fruits, nuts, dates, raisins and seeds, carefully packed and delivered across Tamil Nadu and India.",
      heading: "Shop Premium Dry Fruits, Nuts & Seeds",
    },
    {
      path: "aboutus",
      title: "About Kavi's Dry Fruits | Tirupattur, Tamil Nadu",
      description: "Learn about Kavi's Dry Fruits, based in Tirupattur, Tamil Nadu, and our commitment to quality and delivery across Tamil Nadu and India.",
      heading: "About Kavi's Dry Fruits",
    },
    {
      path: "contactus",
      title: "Contact Kavi's Dry Fruits | Tirupattur",
      description: "Contact Kavi's Dry Fruits in Tirupattur for product enquiries, gift boxes and delivery support across Tamil Nadu and India.",
      heading: "Contact Kavi's Dry Fruits",
    },
    {
      path: "healthbenefits",
      title: "Health Benefits of Dry Fruits, Nuts & Seeds | Kavi's Dry Fruits",
      description: "Explore nutrition information about dry fruits, nuts and seeds for informed food choices.",
      heading: "Health Benefits of Dry Fruits, Nuts & Seeds",
    },
    {
      path: "combos",
      title: "Dry Fruit Gift Combos & Hampers | Kavi's Dry Fruits",
      description: "Explore dry fruit gift boxes and combo packs, carefully selected and delivered across Tamil Nadu and India.",
      heading: "Dry Fruit Gift Combos & Hampers",
    },
    {
      path: "offers",
      title: "Dry Fruit Offers & Deals | Kavi's Dry Fruits",
      description: "Browse current offers on premium dry fruits, nuts and gift combos from Kavi's Dry Fruits.",
      heading: "Dry Fruit Offers & Deals",
    },
    {
      path: "privacy-policy",
      title: "Privacy Policy | Kavi's Dry Fruits",
      description: "Read the privacy policy for Kavi's Dry Fruits and how customer information is handled.",
      heading: "Privacy Policy",
    },
    {
      path: "return-policy",
      title: "Return Policy | Kavi's Dry Fruits",
      description: "Review the return and refund terms for Kavi's Dry Fruits orders and how to contact customer support.",
      heading: "Return Policy",
    },
  ];

  for (const page of staticPages) {
    const url = `${siteUrl}/${page.path}/`;
    const description = descriptionFor(page.description, page.description);
    await writeRoutePage(page.path, {
      title: page.title,
      description,
      canonical: url,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: page.title,
        description,
        url,
      },
      bodyHtml: `<main><h1>${htmlText(page.heading)}</h1><p>${htmlText(description)}</p><p>Serving customers across Tamil Nadu and India.</p><p><a href="/shop/">Browse the shop</a></p></main>`,
    });
    generated += 1;
  }

  for (const product of products.filter(publicRecord)) {
    if (String(product.category || "").toLowerCase() === "combo") continue;
    const id = String(product.id ?? product.productId ?? "");
    if (!/^\d+$/.test(id)) continue;

    const url = `${siteUrl}/shop/${encodeURIComponent(id)}/`;
    const variants = parseArray(product.variants);
    const prices = variants
      .map((variant) => Number(variant.offerPrice || variant.mrp))
      .filter((price) => Number.isFinite(price) && price > 0);
    const fallbackPrice = Number(product.price);
    if (prices.length === 0 && Number.isFinite(fallbackPrice) && fallbackPrice > 0) {
      prices.push(fallbackPrice);
    }
    const lowPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const highPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const images = parseArray(product.images)
      .filter((image) => typeof image === "string" && image)
      .map(canonicalImage);
    const productName = text(product.name) || "Premium Dry Fruits";
    const description = descriptionFor(
      product.description,
      `Buy ${productName} from Kavi's Dry Fruits, carefully packed and delivered across Tamil Nadu and India.`,
    );
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productName,
      description,
      image: images,
      brand: { "@type": "Brand", name: "Kavi's Dry Fruits" },
      offers: lowPrice > 0 ? {
        "@type": prices.length > 1 ? "AggregateOffer" : "Offer",
        url,
        priceCurrency: "INR",
        ...(prices.length > 1 ? { lowPrice, highPrice, offerCount: prices.length } : { price: lowPrice }),
        availability: Number(product.totalStock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: "Kavi's Dry Fruits" },
      } : undefined,
    };

    await writeRoutePage(`shop/${encodeURIComponent(id)}`, {
      title: `${productName} | Buy Online | Kavi's Dry Fruits`,
      description,
      canonical: url,
      image: images[0],
      type: "product",
      schema,
      bodyHtml: `<main><h1>${htmlText(productName)}</h1>${images[0] ? `<img src="${htmlAttribute(images[0])}" alt="${htmlAttribute(productName)}" width="320" height="320" />` : ""}<p>${htmlText(description)}</p>${lowPrice > 0 ? `<p>From ₹${lowPrice.toFixed(2)}${highPrice > lowPrice ? ` to ₹${highPrice.toFixed(2)}` : ""} INR</p>` : ""}<p>Delivery available across Tamil Nadu and India.</p></main>`,
    });
    generated += 1;
  }

  for (const combo of combos.filter(publicRecord)) {
    const id = String(combo.id ?? "");
    if (!/^\d+$/.test(id)) continue;
    const url = `${siteUrl}/combos/${encodeURIComponent(id)}/`;
    const details = typeof combo.comboDetails === "string"
      ? (() => { try { return JSON.parse(combo.comboDetails); } catch { return {}; } })()
      : (combo.comboDetails || {});
    const price = Number(combo.offerPrice || combo.price || details.offerPrice || details.mrp || 0);
    const images = parseArray(combo.images)
      .filter((image) => typeof image === "string" && image)
      .map(canonicalImage);
    const comboName = text(combo.name) || "Dry Fruit Gift Combo";
    const description = descriptionFor(
      combo.description,
      `Buy ${comboName} from Kavi's Dry Fruits, delivered across Tamil Nadu and India.`,
    );
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: comboName,
      description,
      image: images,
      brand: { "@type": "Brand", name: "Kavi's Dry Fruits" },
      offers: price > 0 ? {
        "@type": "Offer",
        url,
        priceCurrency: "INR",
        price,
        availability: Number(combo.totalStock || combo.stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: "Kavi's Dry Fruits" },
      } : undefined,
    };

    await writeRoutePage(`combos/${encodeURIComponent(id)}`, {
      title: `${comboName} | Dry Fruit Gift Combo | Kavi's Dry Fruits`,
      description,
      canonical: url,
      image: images[0],
      type: "product",
      schema,
      bodyHtml: `<main><h1>${htmlText(comboName)}</h1>${images[0] ? `<img src="${htmlAttribute(images[0])}" alt="${htmlAttribute(comboName)}" width="320" height="320" />` : ""}<p>${htmlText(description)}</p>${price > 0 ? `<p>₹${price.toFixed(2)} INR</p>` : ""}<p>Delivery available across Tamil Nadu and India.</p></main>`,
    });
    generated += 1;
  }

  for (const category of categories) {
    const name = text(category.cname || category.name);
    const slug = slugify(name);
    if (!name || !slug) continue;
    const url = `${siteUrl}/category/${slug}/`;
    const description = descriptionFor(
      category.cdescription,
      `Shop ${name} online from Kavi's Dry Fruits, with delivery across Tamil Nadu and India.`,
    );

    await writeRoutePage(`category/${slug}`, {
      title: `Buy ${name} Online | Kavi's Dry Fruits`,
      description,
      canonical: url,
      bodyHtml: `<main><h1>Buy ${htmlText(name)} Online</h1><p>${htmlText(description)}</p><p>Explore ${htmlText(name)} products with delivery across Tamil Nadu and India.</p><p><a href="/shop/">Browse all products</a></p></main>`,
      schema: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${name} | Kavi's Dry Fruits`,
        description,
        url,
      },
    });
    generated += 1;
  }

  console.log(`[seo] Generated crawlable metadata pages for ${generated} catalog URLs.`);
} catch (error) {
  throw new Error(`Could not generate catalog metadata pages from ${apiUrl}: ${error.message}`, { cause: error });
}
