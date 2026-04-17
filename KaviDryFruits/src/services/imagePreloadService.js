/**
 * Image Preload Service
 * Intelligently preloads images based on viewport visibility
 */

class ImagePreloadService {
  constructor() {
    this.preloadedImages = new Set();
    this.pendingImages = new Set();
    this.maxConcurrentLoads = 3;
    this.isLoading = 0;
  }

  /**
   * Preload an image URL
   * @param {string} url - Image URL to preload
   * @returns {Promise} Resolves when image is loaded
   */
  preloadImage(url) {
    if (!url) return Promise.resolve();
    
    if (this.preloadedImages.has(url)) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        this.preloadedImages.add(url);
        this.pendingImages.delete(url);
        resolve();
        this.processQueue();
      };

      img.onerror = () => {
        this.pendingImages.delete(url);
        resolve(); // Resolve even on error to continue with others
        this.processQueue();
      };

      this.pendingImages.add(url);
      this.isLoading++;
      img.src = url;
    });
  }

  /**
   * Preload multiple images with queue management
   * @param {string[]} urls - Array of image URLs
   * @returns {Promise} Resolves when all images are processed
   */
  preloadImages(urls) {
    const validUrls = urls.filter(url => url && !this.preloadedImages.has(url));
    return Promise.all(validUrls.map(url => this.preloadImage(url)));
  }

  /**
   * Preload images for a container with Intersection Observer
   * @param {Element} container - Container element
   * @param {string} imageSelector - CSS selector for image elements
   */
  setupLazyLoadObserver(container, imageSelector = 'img') {
    if (!('IntersectionObserver' in window)) {
      // Fallback: preload all images in container
      const images = container.querySelectorAll(imageSelector);
      images.forEach(img => {
        if (img.dataset.src) {
          this.preloadImage(img.dataset.src);
        }
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src && !this.preloadedImages.has(img.dataset.src)) {
              this.preloadImage(img.dataset.src);
            }
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px' // Start preloading 50px before image enters viewport
      }
    );

    const images = container.querySelectorAll(imageSelector);
    images.forEach(img => observer.observe(img));

    return observer;
  }

  /**
   * Preload images for product grid on page load
   * @param {Array} products - Array of product objects
   */
  preloadProductImages(products) {
    const imageUrls = products
      .flatMap(product => product.images || product.image ? [product.images[0] || product.image] : [])
      .filter(url => url);
    
    // Load first row immediately, rest in background
    const firstRowSize = 4;
    const firstRow = imageUrls.slice(0, firstRowSize);
    const rest = imageUrls.slice(firstRowSize);

    // Load first row with priority
    return Promise.all([
      this.preloadImages(firstRow),
      setTimeout(() => this.preloadImages(rest), 500)
    ]);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.preloadedImages.clear();
    this.pendingImages.clear();
    this.isLoading = 0;
  }

  /**
   * Get preload status
   */
  getStatus() {
    return {
      preloaded: this.preloadedImages.size,
      pending: this.pendingImages.size,
      loading: this.isLoading,
      isActive: this.isLoading > 0
    };
  }

  /**
   * Process queue for concurrent load limiting
   */
  processQueue() {
    this.isLoading--;
  }
}

// Create singleton instance
export const imagePreloadService = new ImagePreloadService();

export default imagePreloadService;
