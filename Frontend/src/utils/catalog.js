import { isProductOutOfStock } from "./stockUtils";
import { normalizeImageUrl } from "./imageOptimization";

const parseJson = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const parseArray = (value) => {
  const parsed = parseJson(value, []);
  return Array.isArray(parsed) ? parsed : [];
};

const normalizeImages = (value) => parseArray(value)
  .filter((image) => typeof image === "string" && image.trim())
  .map(normalizeImageUrl);

export const normalizeProduct = (product) => {
  const variants = parseArray(product.variants);
  const images = normalizeImages(product.images);
  const prices = {};
  const weights = [];

  variants.forEach((variant) => {
    if (!variant?.weight) return;
    prices[variant.weight] = {
      mrp: Number(variant.mrp) || 0,
      offerPrice: Number(variant.offerPrice) || Number(variant.mrp) || 0,
    };
    weights.push(variant.weight);
  });

  const stock = Number(product.totalStock ?? product.stock ?? 0);
  const normalized = {
    ...product,
    id: product.id ?? product.productId,
    type: "single",
    prices,
    weights,
    category: product.category || "General",
    images,
    image: images[0] || "",
    imageUrl: images[0] || "",
    health_benefits: parseArray(product.healthBenefits ?? product.health_benefits),
    tags: parseArray(product.tags),
    rating: Number(product.rating) || 4.5,
    stock,
  };

  return {
    ...normalized,
    isOutOfStock: isProductOutOfStock(normalized),
  };
};

export const normalizeCombo = (combo) => {
  const details = parseJson(combo.comboDetails, {});
  const items = parseArray(combo.comboItems ?? combo.combos);
  const images = normalizeImages(combo.images);
  const offerPrice = Number(combo.offerPrice || combo.price || details.offerPrice || details.mrp || 0);
  const mrp = Number(combo.mrp || details.mrp || offerPrice || 0);
  let weight = String(details.totalWeight || combo.totalWeight || "");

  if (!weight || weight === "0" || weight === "Combo") {
    const totalWeight = items.reduce((sum, item) => {
      const weightValue = String(item.weight || "").toLowerCase();
      let amount = parseFloat(weightValue) || 0;
      if (weightValue.includes("kg") || weightValue.includes("k")) amount *= 1000;
      return sum + amount;
    }, 0);
    weight = totalWeight > 0 ? String(totalWeight) : "Combo";
  }

  const stock = Number(combo.totalStock ?? combo.stock ?? 0);
  return {
    ...combo,
    id: combo.id ?? combo.productId,
    type: "combo",
    category: "Combo",
    price: offerPrice,
    offerPrice,
    mrp,
    stock,
    isOutOfStock: stock <= 0,
    images,
    image: images[0] || "",
    imageUrl: images[0] || "",
    combos: items,
    comboItems: items,
    comboDetails: details,
    prices: { [weight]: { mrp, offerPrice } },
    weights: [weight],
    health_benefits: parseArray(combo.healthBenefits ?? combo.health_benefits),
    tags: parseArray(combo.tags),
    rating: Number(combo.rating) || 4.8,
  };
};

export const normalizeCategory = (category) => {
  const rawImages = parseJson(category.cimgs, {});
  const categoryImages = Array.isArray(rawImages)
    ? rawImages.map(normalizeImageUrl)
    : {
      ...rawImages,
      default: normalizeImageUrl(rawImages?.default),
      hover: normalizeImageUrl(rawImages?.hover || rawImages?.default),
    };

  return {
    ...category,
    name: category.cname || category.name,
    images: Array.isArray(categoryImages)
      ? { default: categoryImages[0] || "", hover: categoryImages[1] || categoryImages[0] || "" }
      : categoryImages,
  };
};
