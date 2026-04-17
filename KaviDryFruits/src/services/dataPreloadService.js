/**
 * Data Preload Service
 * Preloads critical product data on app initialization
 * Caches data in memory and localStorage for instant access
 */

const CACHE_KEYS = {
  PRODUCTS: 'preload_products',
  PRODUCTS_TIMESTAMP: 'preload_products_timestamp',
  FEATURED: 'preload_featured',
  FEATURED_TIMESTAMP: 'preload_featured_timestamp',
};

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour in milliseconds

class DataPreloadService {
  constructor() {
    this.cachedData = {};
    this.loadingPromises = {};
    this.isOnline = navigator.onLine;
    
    // Listen for online/offline events
    window.addEventListener('online', () => { this.isOnline = true; });
    window.addEventListener('offline', () => { this.isOnline = false; });
  }

  /**
   * Check if cached data is still valid
   */
  isCacheValid(cacheKey) {
    if (!this.cachedData[cacheKey]) return false;
    
    const timestamp = this.cachedData[`${cacheKey}_timestamp`];
    if (!timestamp) return false;
    
    return Date.now() - timestamp < CACHE_DURATION;
  }

  /**
   * Get cached data with fallback to localStorage
   */
  getCachedData(cacheKey) {
    // Check memory cache first
    if (this.isCacheValid(cacheKey)) {
      return this.cachedData[cacheKey];
    }

    // Check localStorage
    try {
      const stored = localStorage.getItem(cacheKey);
      const storedTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
      
      if (stored && storedTimestamp) {
        const timestamp = parseInt(storedTimestamp, 10);
        if (Date.now() - timestamp < CACHE_DURATION) {
          const data = JSON.parse(stored);
          // Update memory cache
          this.cachedData[cacheKey] = data;
          this.cachedData[`${cacheKey}_timestamp`] = timestamp;
          return data;
        }
      }
    } catch (err) {
      console.warn('Failed to read from localStorage:', err);
    }

    return null;
  }

  /**
   * Set cached data
   */
  setCachedData(cacheKey, data) {
    const timestamp = Date.now();
    
    // Store in memory
    this.cachedData[cacheKey] = data;
    this.cachedData[`${cacheKey}_timestamp`] = timestamp;

    // Store in localStorage for persistence
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(`${cacheKey}_timestamp`, timestamp.toString());
    } catch (err) {
      console.warn('Failed to write to localStorage:', err);
    }
  }

  /**
   * Preload products data
   * @param {Function} fetchFn - Firebase getDocs function or similar
   * @returns {Promise<Array>} Array of products
   */
  async preloadProducts(fetchFn) {
    // Return existing promise if already loading
    if (this.loadingPromises[CACHE_KEYS.PRODUCTS]) {
      return this.loadingPromises[CACHE_KEYS.PRODUCTS];
    }

    // Check cache first
    const cached = this.getCachedData(CACHE_KEYS.PRODUCTS);
    if (cached && Array.isArray(cached)) {
      return Promise.resolve(cached);
    }

    // Fetch new data
    const promise = (async () => {
      try {
        const products = await fetchFn();
        if (Array.isArray(products) && products.length > 0) {
          this.setCachedData(CACHE_KEYS.PRODUCTS, products);
        }
        return products;
      } catch (err) {
        console.error('Error preloading products:', err);
        // Return cached data as fallback
        return cached || [];
      } finally {
        delete this.loadingPromises[CACHE_KEYS.PRODUCTS];
      }
    })();

    this.loadingPromises[CACHE_KEYS.PRODUCTS] = promise;
    return promise;
  }

  /**
   * Get featured/popular products
   */
  async preloadFeaturedProducts(fetchFn) {
    if (this.loadingPromises[CACHE_KEYS.FEATURED]) {
      return this.loadingPromises[CACHE_KEYS.FEATURED];
    }

    const cached = this.getCachedData(CACHE_KEYS.FEATURED);
    if (cached && Array.isArray(cached)) {
      return Promise.resolve(cached);
    }

    const promise = (async () => {
      try {
        const featured = await fetchFn();
        if (Array.isArray(featured) && featured.length > 0) {
          this.setCachedData(CACHE_KEYS.FEATURED, featured);
        }
        return featured;
      } catch (err) {
        console.error('Error preloading featured products:', err);
        return cached || [];
      } finally {
        delete this.loadingPromises[CACHE_KEYS.FEATURED];
      }
    })();

    this.loadingPromises[CACHE_KEYS.FEATURED] = promise;
    return promise;
  }

  /**
   * Clear all cache
   */
  clearCache() {
    this.cachedData = {};
    Object.values(CACHE_KEYS).forEach(key => {
      try {
        localStorage.removeItem(key);
        localStorage.removeItem(`${key}_timestamp`);
      } catch (err) {
        console.warn('Failed to clear localStorage:', err);
      }
    });
  }

  /**
   * Get cache status info
   */
  getCacheStatus() {
    return {
      productsLoaded: !!this.getCachedData(CACHE_KEYS.PRODUCTS),
      productsSize: this.getCachedData(CACHE_KEYS.PRODUCTS)?.length || 0,
      featuredLoaded: !!this.getCachedData(CACHE_KEYS.FEATURED),
      featuredSize: this.getCachedData(CACHE_KEYS.FEATURED)?.length || 0,
      isOnline: this.isOnline,
    };
  }
}

// Create singleton instance
const dataPreloadService = new DataPreloadService();

export default dataPreloadService;
