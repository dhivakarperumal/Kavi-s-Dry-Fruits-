const axios = require('axios');

const CACHE_TTL_MS = 5 * 60 * 1000;
const PAGE_SIZE = 25;
const feedCache = new Map();
const pendingRequests = new Map();

exports.getFeed = async (req, res) => {
  const userId = process.env.INSTAGRAM_USER_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const after = typeof req.query.after === 'string' ? req.query.after : '';

  if (!userId || !accessToken) {
    return res.status(503).json({ message: 'Instagram feed is not configured' });
  }

  if (after.length > 500) {
    return res.status(400).json({ message: 'Invalid Instagram pagination cursor' });
  }

  const cacheKey = after || 'first';
  const cachedPage = feedCache.get(cacheKey);
  if (cachedPage && cachedPage.expiresAt > Date.now()) {
    res.set('Cache-Control', 'public, max-age=60');
    return res.json(cachedPage.page);
  }

  try {
    if (!pendingRequests.has(cacheKey)) {
      const graphVersion = process.env.META_GRAPH_API_VERSION || 'v26.0';
      const request = axios.get(
        `https://graph.facebook.com/${graphVersion}/${encodeURIComponent(userId)}/media`,
        {
          params: {
            fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,children{media_type,media_url,thumbnail_url,permalink}',
            limit: PAGE_SIZE,
            ...(after ? { after } : {}),
          },
          headers: { Authorization: `Bearer ${accessToken}` },
          timeout: 10000,
        }
      );

      const pendingRequest = request
        .then(({ data }) => {
          if (!Array.isArray(data?.data)) {
            throw new Error('Instagram Graph API returned an invalid media response');
          }

          const items = data.data.map((item) => {
            const firstChild = item.children?.data?.[0];
            return {
              ...item,
              preview_url: item.media_type === 'VIDEO'
                ? item.thumbnail_url || item.media_url
                : item.media_type === 'CAROUSEL_ALBUM'
                  ? firstChild?.media_url || firstChild?.thumbnail_url || item.media_url
                  : item.media_url || item.thumbnail_url,
            };
          });
          const page = {
            items,
            nextCursor: data.paging?.cursors?.after || null,
            hasMore: Boolean(data.paging?.next && data.paging?.cursors?.after),
          };
          feedCache.set(cacheKey, { page, expiresAt: Date.now() + CACHE_TTL_MS });
          return page;
        })
        .finally(() => {
          pendingRequests.delete(cacheKey);
        });
      pendingRequests.set(cacheKey, pendingRequest);
    }

    const page = await pendingRequests.get(cacheKey);
    res.set('Cache-Control', 'public, max-age=60');
    return res.json(page);
  } catch (error) {
    console.error('Instagram feed request failed:', error.response?.data?.error?.message || error.message);

    if (cachedPage) {
      res.set('Cache-Control', 'no-store');
      return res.json({ ...cachedPage.page, stale: true });
    }

    return res.status(502).json({ message: 'Unable to load Instagram posts right now' });
  }
};
