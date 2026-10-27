import { useCallback, useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";
import api from "../services/api";

const INSTAGRAM_PROFILE = "https://www.instagram.com/kavisdryfruits/";

const getFeedError = (error) => {
  const status = error?.response?.status;
  if (status === 404) return "backend-not-deployed";
  if (status === 503) return "not-configured";
  if (status === 502) return "meta-unavailable";
  return "unavailable";
};

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [feedError, setFeedError] = useState(null);

  const loadFeed = useCallback(async () => {
    setHasLoaded(false);
    try {
      const { data } = await api.get("/instagram/feed");
      setPosts(Array.isArray(data?.items) ? data.items : []);
      setNextCursor(data?.nextCursor || null);
      setHasMore(Boolean(data?.hasMore));
      setFeedError(null);
    } catch (error) {
      console.error("Instagram feed could not be loaded:", error);
      setFeedError(getFeedError(error));
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    void loadFeed();
  }, [loadFeed]);

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);

    try {
      const { data } = await api.get("/instagram/feed", { params: { after: nextCursor } });
      const newPosts = Array.isArray(data?.items) ? data.items : [];
      setPosts((currentPosts) => {
        const existingIds = new Set(currentPosts.map((post) => post.id));
        return [...currentPosts, ...newPosts.filter((post) => !existingIds.has(post.id))];
      });
      setNextCursor(data?.nextCursor || null);
      setHasMore(Boolean(data?.hasMore));
    } catch (error) {
      console.error("More Instagram posts could not be loaded:", error);
      setFeedError(getFeedError(error));
    } finally {
      setLoadingMore(false);
    }
  };

  const visiblePosts = posts.filter((post) => post.permalink && post.preview_url);

  return (
    <section className="bg-white py-12 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">Follow our Instagram</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-2">
            Fresh from <span className="text-pink-600">@kavisdryfruits</span>
          </h2>
          <p className="text-gray-600 mt-2">See our latest products, posts, and Reels.</p>
        </div>

        {visiblePosts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {visiblePosts.map((post) => {
              const image = post.preview_url || post.thumbnail_url || post.media_url;

              return (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100"
                  aria-label={`View Instagram ${post.media_type === "VIDEO" ? "Reel" : "post"} on Instagram`}
                >
                  <img
                    src={image}
                    alt={post.caption?.slice(0, 120) || "Kavi's Dry Fruits Instagram post"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {post.media_type === "VIDEO" && (
                    <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white">
                      Reel
                    </span>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                    <FaInstagram size={30} />
                  </span>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-green-50 px-6 py-8 text-center">
            <p className="text-gray-700">
              {!hasLoaded
                ? "Loading our latest Instagram posts..."
                : feedError === "backend-not-deployed"
                  ? "The Instagram feed API is not deployed on the website server yet. Deploy the latest backend version to enable posts and Reels."
                  : feedError === "not-configured"
                    ? "The feed API is deployed, but its Instagram account ID and Meta access token are not configured on the backend."
                    : feedError === "meta-unavailable"
                      ? "The backend could not retrieve Instagram media. Check the Meta token, account connection, and Instagram permissions in the backend logs."
                      : feedError
                        ? "We could not connect to the Instagram feed API. Check the website API URL and backend availability."
                        : "No Instagram posts are available to display yet."}
            </p>
            {hasLoaded && feedError && (
              <button
                type="button"
                onClick={() => void loadFeed()}
                className="mt-4 rounded-lg border border-green-700 px-4 py-2 font-semibold text-green-800 transition hover:bg-green-100"
              >
                Try again
              </button>
            )}
          </div>
        )}

        {visiblePosts.length > 0 && hasMore && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="rounded-lg border border-green-700 px-6 py-3 font-semibold text-green-800 transition hover:bg-green-50 disabled:cursor-wait disabled:opacity-60"
            >
              {loadingMore ? "Loading..." : "Load more posts and Reels"}
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700"
          >
            <FaInstagram />
            Follow us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
