const loadedImages = new Set();

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      return resolve();
    }

    if (loadedImages.has(src)) {
      return resolve();
    }

    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedImages.add(src);
      resolve();
    };
    img.onerror = reject;
  });
};

const imagePreloadManager = {
  preloadHomepageImages: async (products = []) => {
    const imagePromises = products.map((product) => {
      const imageUrl = product.image || product.img || product.imageUrl || product.thumbnail || "";
      return loadImage(imageUrl);
    });

    await Promise.all(imagePromises);
  },
};

export default imagePreloadManager;
