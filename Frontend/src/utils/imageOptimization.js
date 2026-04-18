/**
 * Image Optimization Utility
 * Handles:
 * - Image loading with fallbacks
 * - Lazy loading
 * - Error handling
 * - Placeholder generation
 * - Image caching
 */

const DEFAULT_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="%23999"%3ELoading image...%3C/text%3E%3C/svg%3E';

/**
 * Get optimized image URL with width parameter for Firebase Storage
 * @param {string} imageUrl - Original Firebase Storage URL
 * @param {number} width - Desired width (default: 400)
 * @returns {string} Optimized URL
 */
export const getOptimizedImageUrl = (imageUrl, width = 400) => {
  if (!imageUrl) return DEFAULT_PLACEHOLDER;
  
  // Check if it's a Firebase Storage URL
  if (imageUrl.includes('firebasestorage.googleapis.com')) {
    // Add width parameter for image optimization
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}w=${width}`;
  }
  
  return imageUrl;
};

/**
 * Generate LQIP (Low Quality Image Placeholder) - simplified version
 * @returns {string} Placeholder data URL
 */
export const generatePlaceholder = () => {
  return DEFAULT_PLACEHOLDER;
};

/**
 * Preload image and return promise
 * @param {string} url - Image URL
 * @returns {Promise} Resolves when image loads
 */
export const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};

/**
 * Validate image URL
 * @param {string} url - Image URL to validate
 * @returns {boolean}
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get image with fallback
 * Tries main image, then fallback, then placeholder
 * @param {string} primaryUrl - Primary image URL
 * @param {string} fallbackUrl - Fallback image URL
 * @returns {string} Best available URL
 */
export const getImageWithFallback = (primaryUrl, fallbackUrl = null) => {
  if (isValidImageUrl(primaryUrl)) {
    return getOptimizedImageUrl(primaryUrl);
  }
  
  if (isValidImageUrl(fallbackUrl)) {
    return getOptimizedImageUrl(fallbackUrl);
  }
  
  return DEFAULT_PLACEHOLDER;
};

/**
 * Cache for image loading states
 */
const imageCache = new Map();

/**
 * Mark image as loaded in cache
 * @param {string} url - Image URL
 */
export const cacheImageLoaded = (url) => {
  if (url) imageCache.set(url, true);
};

/**
 * Check if image is cached as loaded
 * @param {string} url - Image URL
 * @returns {boolean}
 */
export const isImageCached = (url) => {
  return imageCache.has(url);
};

/**
 * Clear image cache
 */
export const clearImageCache = () => {
  imageCache.clear();
};
