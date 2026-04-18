import React from "react";
import { Helmet } from "react-helmet";

const DEFAULTS = {
  title: "Kavi's Dry Fruits | Premium Dry Fruits, Nuts, Seeds & Gift Boxes",
  description:
    "Buy premium dry fruits, almonds, cashews, pistachios, dates, raisins, seeds & gift boxes. Pan India delivery from Kavi's Dry Fruits.",
  keywords:
    "dry fruits online, premium dry fruits, almonds, cashews, pista, dates, raisins, gift boxes, healthy snacks",
  canonical: "https://kavisdryfruits.com/",
  image: "https://www.kavisdryfruits.com/og-image.jpg",
};

/**
 * Enhanced SEO Component with JSON-LD structured data
 * Improves search engine visibility and rich snippets
 */
const EnhancedSEO = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  image,
  productData = null,
  organizationData = null,
  breadcrumbs = null
}) => {
  const t = title || DEFAULTS.title;
  const d = description || DEFAULTS.description;
  const k = keywords || DEFAULTS.keywords;
  const c = canonical || DEFAULTS.canonical;
  const img = image || DEFAULTS.image;

  // Default organization data
  const orgData = organizationData || {
    name: "Kavi's Dry Fruits",
    url: "https://kavisdryfruits.com",
    logo: "https://www.kavisdryfruits.com/logo.png",
    description: "Premium dry fruits, nuts, seeds and gift boxes from Tirupattur, Tamil Nadu",
    address: {
      streetAddress: "Tirupattur",
      addressLocality: "Tirupattur",
      postalCode: "635653",
      addressCountry: "IN"
    },
    contactPoint: {
      telephone: "+91-94895-93504",
      contactType: "Sales"
    },
    sameAs: [
      "https://www.facebook.com/kavisdryfruits",
      "https://www.instagram.com/kavisdryfruits",
      "https://www.twitter.com/kavisdryfruits"
    ]
  };

  // Generate breadcrumb schema
  const getBreadcrumbSchema = () => {
    const items = breadcrumbs || [
      { name: "Home", url: "https://kavisdryfruits.com" },
      { name: "Shop", url: "https://kavisdryfruits.com/shop" }
    ];

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };
  };

  // Generate product schema if product data provided
  const getProductSchema = () => {
    if (!productData) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productData.name || "",
      description: productData.description || "",
      image: productData.image || img,
      brand: {
        "@type": "Brand",
        name: "Kavi's Dry Fruits"
      },
      offers: {
        "@type": "Offer",
        url: productData.url || c,
        priceCurrency: "INR",
        price: productData.price || "0",
        availability: "InStock"
      },
      aggregateRating: productData.rating ? {
        "@type": "AggregateRating",
        ratingValue: productData.rating.value || "4.5",
        ratingCount: productData.rating.count || "100"
      } : undefined
    };
  };

  // Generate organization schema
  const getOrganizationSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: orgData.name,
      url: orgData.url,
      logo: orgData.logo,
      description: orgData.description,
      address: {
        "@type": "PostalAddress",
        streetAddress: orgData.address.streetAddress,
        addressLocality: orgData.address.addressLocality,
        postalCode: orgData.address.postalCode,
        addressCountry: orgData.address.addressCountry
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: orgData.contactPoint.telephone,
        contactType: orgData.contactPoint.contactType
      },
      sameAs: orgData.sameAs
    };
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{t}</title>
      <meta name="description" content={d} />
      <meta name="keywords" content={k} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="language" content="English" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="theme-color" content="#8B4513" />
      
      {/* Canonical Link */}
      <link rel="canonical" href={c} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={c} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Kavi's Dry Fruits" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:site" content="@kavisdryfruits" />
      <meta name="twitter:creator" content="@kavisdryfruits" />

      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Kavi's Dry Fruits" />
      <meta name="publisher" content="Kavi's Dry Fruits" />
      <meta name="copyright" content="© Kavi's Dry Fruits. All rights reserved." />
      <meta name="format-detection" content="telephone=+91-94895-93504" />
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(getOrganizationSchema())}
      </script>

      <script type="application/ld+json">
        {JSON.stringify(getBreadcrumbSchema())}
      </script>

      {productData && (
        <script type="application/ld+json">
          {JSON.stringify(getProductSchema())}
        </script>
      )}

      {/* Alternative Versions for Multilingual SEO */}
      <link rel="alternate" hrefLang="en-IN" href={c} />
    </Helmet>
  );
};

export default EnhancedSEO;
