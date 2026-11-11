const cache = {
  products: null,
  cachedAt: 0,
};

let inFlightRequest = null;
const CACHE_DURATION_MS = 30_000;

const dataPreloadService = {
  preloadProducts: async (fetchProducts) => {
    if (cache.products && Date.now() - cache.cachedAt < CACHE_DURATION_MS) {
      return cache.products;
    }

    if (!inFlightRequest) {
      inFlightRequest = fetchProducts()
        .then((products) => {
          if (products?.products?.length || products?.categories?.length) {
            cache.products = products;
            cache.cachedAt = Date.now();
          }
          return products || { products: [], categories: [] };
        })
        .finally(() => {
          inFlightRequest = null;
        });
    }
    return inFlightRequest;
  },

  clearCache: () => {
    cache.products = null;
    cache.cachedAt = 0;
    inFlightRequest = null;
  },
};

export default dataPreloadService;
