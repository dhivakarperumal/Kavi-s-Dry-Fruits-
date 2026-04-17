/**
 * Image Preload Manager
 * Strategically preloads critical images for better UX
 * Handles priority-based loading and responsive images
 */

class ImagePreloadManager {
  constructor() {
    this.preloadedImages = new Set();
    this.pendingImages = new Map();
    this.maxConcurrent = 5;
    this.activeLoads = 0;
    this.queue = [];
    this.imageCache = new Map();
  }

  /**
   * Preload a single image with priority
   * @param {string} url - Image URL
   * @param {number} priority - Higher number = higher priority (0-100)
   * @returns {Promise}
   */
  preloadImage(url, priority = 50) {
    if (!url || this.preloadedImages.has(url)) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const task = { url, priority, resolve };
      
      // Add to queue
      this.queue.push(task);
      
      // Sort by priority (highest first)
      this.queue.sort((a, b) => b.priority - a.priority);
      
      // Process queue
      this.processQueue();
    });
  }

  /**
   * Preload multiple images
   * @param {Array} imageUrls - Array of {url, priority} objects
   * @returns {Promise}
   */
  preloadMultiple(imageUrls) {
    const promises = imageUrls.map(img => 
      this.preloadImage(
        typeof img === 'string' ? img : img.url,
        typeof img === 'string' ? 50 : img.priority
      )
    );
    return Promise.allSettled(promises);
  }

  /**
   * Process preload queue
   */
  processQueue() {
    while (this.activeLoads < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift();
      this.activeLoads++;

      const img = new Image();
      
      const cleanup = () => {
        this.activeLoads--;
        this.processQueue();
      };

      img.onload = () => {
        this.preloadedImages.add(task.url);
        this.imageCache.set(task.url, 'loaded');
        cleanup();
        task.resolve();
      };

      img.onerror = () => {
        this.imageCache.set(task.url, 'error');
        cleanup();
        task.resolve(); // Resolve even on error
      };

      img.src = task.url;
    }
  }

  /**
   * Preload critical home page images
   */
  async preloadHomepageImages(products = []) {
    const criticalImages = [];

    // Add hero/banner images (highest priority)
    criticalImages.push({ url: '/banner-hero.jpg', priority: 100 });
    
    // Add top 8-12 popular product images (high priority)
    const topProducts = products.slice(0, 12);
    topProducts.forEach((product, index) => {
      if (product.image || product.img || product.imageUrl) {
        const url = product.image || product.img || product.imageUrl;
        criticalImages.push({ 
          url, 
          priority: 90 - (index * 2) // Decreasing priority
        });
      }
    });

    return this.preloadMultiple(criticalImages);
  }

  /**
   * Preload shop page images (paginated)
   */
  async preloadShopPageImages(products = [], pageSize = 30) {
    const images = [];

    // Load current page images
    products.slice(0, pageSize).forEach((product, index) => {
      if (product.image || product.img || product.imageUrl) {
        const url = product.image || product.img || product.imageUrl;
        images.push({ url, priority: 80 - index });
      }
    });

    return this.preloadMultiple(images);
  }

  /**
   * Preload specific product images
   */
  async preloadProductImages(product) {
    if (!product) return;

    const images = [];

    // Main image (highest priority)
    const mainImg = product.image || product.img || product.imageUrl;
    if (mainImg) {
      images.push({ url: mainImg, priority: 95 });
    }

    // Additional images
    if (Array.isArray(product.additionalImages)) {
      product.additionalImages.forEach((img, idx) => {
        images.push({ url: img, priority: 85 - idx });
      });
    }

    // Thumbnail images
    if (Array.isArray(product.thumbnails)) {
      product.thumbnails.forEach((thumb, idx) => {
        images.push({ url: thumb, priority: 70 - idx });
      });
    }

    return this.preloadMultiple(images);
  }

  /**
   * Get status of image preloading
   */
  getStatus() {
    return {
      loaded: this.preloadedImages.size,
      pending: this.queue.length + this.activeLoads,
      active: this.activeLoads,
      queueSize: this.queue.length,
      cacheSize: this.imageCache.size,
    };
  }

  /**
   * Clear preloaded images (memory optimization)
   */
  clearCache() {
    this.preloadedImages.clear();
    this.imageCache.clear();
    this.queue = [];
    this.activeLoads = 0;
  }

  /**
   * Check if image is preloaded
   */
  isPreloaded(url) {
    return this.preloadedImages.has(url);
  }
}

const imagePreloadManager = new ImagePreloadManager();

export default imagePreloadManager;
