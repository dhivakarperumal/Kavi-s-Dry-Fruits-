const cache = {
  products: null,
};

const dataPreloadService = {
  preloadProducts: async (fetchProducts) => {
    if (cache.products) {
      return cache.products;
    }

    const products = await fetchProducts();
    cache.products = products || [];
    return cache.products;
  },

  clearCache: () => {
    cache.products = null;
  },
};

export default dataPreloadService;
