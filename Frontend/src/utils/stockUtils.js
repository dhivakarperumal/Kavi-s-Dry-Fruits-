// stockUtils.js - Centralized stock and weight handling utilities

/**
 * Parse weight string (e.g., "100g", "250 gm", "1kg", "1.5 kg", "500", "Combo") to grams (number).
 * @param {string|number} weightStr
 * @returns {number} Weight in grams
 */
export const parseWeightToGrams = (weightStr) => {
  if (weightStr === null || weightStr === undefined || weightStr === "") return 0;
  if (typeof weightStr === "number") return weightStr;

  const raw = String(weightStr).trim().toLowerCase().replace(/,/g, "").replace(/\s+/g, "");
  if (!raw || raw === "combo" || raw === "default") return 0;

  const match = raw.match(/^([\d.]+)(kg|k|g|gm|gram|grams)?$/i);
  if (!match) {
    const fallback = parseFloat(raw);
    return Number.isFinite(fallback) ? fallback : 0;
  }

  const amount = parseFloat(match[1]);
  if (!Number.isFinite(amount)) return 0;

  const unit = (match[2] || "g").toLowerCase();
  if (["kg", "k", "kilogram", "kilograms"].includes(unit)) {
    return Math.round(amount * 1000);
  }

  return Math.round(amount);
};

/**
 * Formats stock amount into a human-readable string.
 * E.g., 100 -> "100g", 250 -> "250g", 1000 -> "1 kg", 1500 -> "1.5 kg"
 * For combos: 3 -> "3 units"
 * @param {number} stock
 * @param {boolean} isCombo
 * @returns {string}
 */
export const formatStockDisplay = (stock, isCombo = false) => {
  const s = Number(stock || 0);
  if (s <= 0) return "0";

  if (isCombo) {
    return `${s} ${s === 1 ? "unit" : "units"}`;
  }

  if (s >= 1000) {
    const kg = s / 1000;
    const formatted = kg % 1 === 0 ? kg.toFixed(0) : kg.toFixed(kg % 0.1 === 0 ? 1 : 2);
    return `${formatted} kg`;
  }

  return `${Math.round(s)}g`;
};

/**
 * Check if a product is out of stock.
 * A product is out of stock ONLY if totalStock <= 0, or if all its weights exceed the available stock.
 * @param {object} product
 * @returns {boolean}
 */
export const isProductOutOfStock = (product) => {
  if (!product) return true;

  const isCombo = product.category === "Combo" || product.type === "combo";
  const stock = Number(product.stock ?? product.totalStock ?? 0);

  if (stock <= 0) return true;

  // For regular products, if all declared weights exceed the stock, user cannot buy any size
  if (!isCombo && Array.isArray(product.weights) && product.weights.length > 0) {
    const parsedWeights = product.weights
      .map(parseWeightToGrams)
      .filter((w) => w > 0);

    if (parsedWeights.length > 0) {
      const minWeight = Math.min(...parsedWeights);
      if (stock < minWeight) {
        return true; // Stock is less than smallest package size
      }
    }
  }

  return false;
};

/**
 * Check if a product is in "Low Stock" status.
 * By default: stock > 0 and stock <= 3000g (3kg) for single products, or <= 5 units for combos.
 * @param {object} product
 * @returns {boolean}
 */
export const isLowStock = (product) => {
  if (!product) return false;
  if (isProductOutOfStock(product)) return false;

  const isCombo = product.category === "Combo" || product.type === "combo";
  const stock = Number(product.stock ?? product.totalStock ?? 0);

  if (isCombo) {
    return stock > 0 && stock <= 5;
  }

  return stock > 0 && stock <= 3000;
};

/**
 * Check if a specific variant/weight and quantity can be fulfilled from available stock.
 * @param {string|number} weightStr
 * @param {number} quantity
 * @param {number} totalStock
 * @param {boolean} isCombo
 * @returns {{ canFulfill: boolean, required: number, available: number, diff: number }}
 */
export const checkVariantStock = (weightStr, quantity = 1, totalStock = 0, isCombo = false) => {
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const stock = Math.max(0, Number(totalStock || 0));

  if (isCombo) {
    return {
      canFulfill: qty <= stock,
      required: qty,
      available: stock,
      diff: stock - qty,
    };
  }

  const weightInGrams = parseWeightToGrams(weightStr);
  const totalRequiredGrams = weightInGrams * qty;

  return {
    canFulfill: totalRequiredGrams <= stock,
    weightInGrams,
    totalRequiredGrams,
    available: stock,
    diff: stock - totalRequiredGrams,
  };
};
