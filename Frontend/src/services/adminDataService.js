let adminCache = {
  data: null,
  timestamp: 0,
};

const adminDataService = {
  getCache: () => adminCache.data,
  setCache: (data) => {
    adminCache.data = data;
    adminCache.timestamp = Date.now();
  },
  isFresh: () => {
    // Cache for 5 minutes
    return adminCache.data && (Date.now() - adminCache.timestamp < 5 * 60 * 1000);
  },
  clearCache: () => {
    adminCache.data = null;
    adminCache.timestamp = 0;
  }
};

export default adminDataService;
