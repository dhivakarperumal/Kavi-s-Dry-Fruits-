let adminCache = {
  data: null,
  timestamp: 0,
};

const storageKey = "kavi-admin-data";

try {
  const storedCache = JSON.parse(localStorage.getItem(storageKey) || "null");
  if (storedCache?.data) adminCache = storedCache;
} catch (_error) {
  localStorage.removeItem(storageKey);
}

const adminDataService = {
  getCache: () => adminCache.data,
  setCache: (data) => {
    adminCache.data = data;
    adminCache.timestamp = Date.now();
    localStorage.setItem(storageKey, JSON.stringify(adminCache));
  },
  isFresh: () => {
    // Cache for 5 minutes
    return adminCache.data && (Date.now() - adminCache.timestamp < 5 * 60 * 1000);
  },
  clearCache: () => {
    adminCache.data = null;
    adminCache.timestamp = 0;
    localStorage.removeItem(storageKey);
  }
};

export default adminDataService;
