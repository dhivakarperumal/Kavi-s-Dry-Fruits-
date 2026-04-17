import React from "react";
import { Helmet } from "react-helmet";

const DEFAULTS = {
  title: "Kavi’s Dry Fruits | Premium Dry Fruits, Nuts, Seeds & Gift Boxes",
  description:
    "Buy premium dry fruits, almonds, cashews, pistachios, dates, raisins, seeds & gift boxes. Pan India delivery from Kavi’s Dry Fruits.",
  keywords:
    "dry fruits online, premium dry fruits, almonds, cashews, pista, dates, raisins, gift boxes, healthy snacks",
  canonical: "https://kavisdryfruits.com/",
  image: "https://www.kavisdryfruits.com/og-image.jpg",
};

const SEO = ({ title, description, keywords, canonical, image }) => {
  const t = title || DEFAULTS.title;
  const d = description || DEFAULTS.description;
  const k = keywords || DEFAULTS.keywords;
  const c = canonical || DEFAULTS.canonical;
  const img = image || DEFAULTS.image;

  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description" content={d} />
      <meta name="keywords" content={k} />
      <link rel="canonical" href={c} />

      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={c} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
};

export default SEO;
