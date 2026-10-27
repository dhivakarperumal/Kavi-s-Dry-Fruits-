import React from "react";
import { Helmet } from "react-helmet-async";

const DEFAULTS = {
  title: "Kavi's Dry Fruits | Premium Dry Fruits, Nuts, Seeds & Gift Boxes",
  description:
    "Buy premium dry fruits, almonds, cashews, pistachios, dates, raisins, seeds, spices and gift boxes with Pan India delivery from Kavi's Dry Fruits.",
  canonical: "https://kavisdryfruits.com/",
  image: "https://kavisdryfruits.com/Kavi_logo.png",
};

const SEO = ({
  title,
  description,
  canonical,
  image,
  robots = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  type = "website",
  author = "Kavi's Dry Fruits",
  siteName = "Kavi's Dry Fruits",
  locale = "en_IN",
}) => {
  const t = title || DEFAULTS.title;
  const d = description || DEFAULTS.description;
  const c = canonical || DEFAULTS.canonical;
  const img = image || DEFAULTS.image;

  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description" content={d} />
      <meta name="robots" content={robots} />
      <meta name="author" content={author} />
      <meta name="theme-color" content="#8B4513" />
      <meta name="language" content="English" />
      <meta name="format-detection" content="telephone=yes" />
      <link rel="canonical" href={c} />
      <link rel="alternate" hrefLang="en-IN" href={c} />

      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:image" content={img} />
      <meta property="og:image:secure_url" content={img} />
      <meta property="og:image:alt" content={t} />
      <meta property="og:url" content={c} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
};

export default SEO;
