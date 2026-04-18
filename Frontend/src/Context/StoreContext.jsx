import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useAuth } from "../PrivateRouter/AuthContext";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import api from "../services/api";
import dataPreloadService from "../services/dataPreloadService";
import imagePreloadManager from "../services/imagePreloadManager";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favItems, setFavItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // ============================
  // 🔥 AUTH + CART/FAV LISTENERS
  // ============================
  useEffect(() => {
    let unsubscribeCart = () => {};
    let unsubscribeFav = () => {};

    const storedUserStr = localStorage.getItem("user");
    const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
    const currentUser = authUser || storedUser;
    setUser(currentUser);

    const setupListeners = async () => {
      if (currentUser && (currentUser.userId || currentUser.user_id || currentUser.userUuid || currentUser.uid)) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.userId || currentUser.uid));
          setUserData(userDoc.exists() ? userDoc.data() : null);

          // CART LISTENER
          const rawCartUserId = currentUser.userId || currentUser.uid;
          const cartRef = collection(db, "users", rawCartUserId, "cart");
          unsubscribeCart = onSnapshot(cartRef, (snap) => {
            setCartItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          });

          // FAVORITES LOAD
          const sqlUserId = getSqlUserId(currentUser);
          await loadFavorites(sqlUserId);
        } catch (err) {
          console.error("Firestore Auth Error:", err.message);
          toast.error("Unable to load user data.");
        }
      } else {
        setUserData(null);
        setCartItems([]);
        setFavItems([]);
      }

      setLoading(false);
    };

    setupListeners();

    return () => {
      unsubscribeCart();
      unsubscribeFav();
    };
  }, [authUser]);

  const parseJsonField = (value, fallback) => {
    if (value == null) return fallback;
    if (typeof value === "object") return value;
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  };

  const getSqlUserId = (userObj) =>
    userObj?.user_id || userObj?.userUuid || userObj?.userId || userObj?.uid || null;

  const normalizeFavoriteItem = (item) => {
    const productId = String(item.productId ?? item.product_id ?? item.id ?? "");
    return {
      ...item,
      id: item.id ?? productId,
      productId,
      imageUrl: item.imageUrl || item.image_url || item.image || "",
      weights: parseJsonField(item.weights, []),
      prices: parseJsonField(item.prices, {}),
      date: item.date || item.createdAt || item.created_at || item.timestamp || "",
    };
  };

  const loadFavorites = async (userId) => {
    if (!userId) {
      setFavItems([]);
      return;
    }
    try {
      const response = await api.get(`/favorites?userId=${encodeURIComponent(userId)}`);
      setFavItems((response.data || []).map(normalizeFavoriteItem));
    } catch (err) {
      console.error("Favorites fetch error:", err);
      setFavItems([]);
    }
  };

  const normalizeSqlProduct = (product) => {
    const variants = parseJsonField(product.variants, []);
    const images = parseJsonField(product.images, []);
    const healthBenefits = parseJsonField(product.healthBenefits, []);
    const comboItems = parseJsonField(product.comboItems, []);
    const comboDetails = parseJsonField(product.comboDetails, {});

    const prices = {};
    const weights = [];

    if (Array.isArray(variants)) {
      variants.forEach((variant) => {
        const weight = variant.weight || variant.size || variant.label;
        if (!weight) return;

        const mrp = Number(variant.mrp || variant.mrpPrice || variant.price || 0) || 0;
        const offerPrice = Number(
          variant.offerPrice || variant.offer_price || variant.discountedPrice || variant.price || mrp
        ) || 0;

        weights.push(weight);
        prices[weight] = {
          mrp,
          offerPrice,
          offerPercent: variant.offerPercent || variant.offer_percent || variant.discount || 0,
        };
      });
    }

    return {
      ...product,
      variants,
      images,
      healthBenefits,
      comboItems,
      comboDetails,
      weights: [...new Set(weights)],
      prices,
      imageUrl: product.imageUrl || product.image || images[0] || "",
    };
  };

  // ============================
  // ⚡ SUPER FAST PRODUCT LOADING (WITH CACHING & PRELOADING)
  // ============================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        let products = await dataPreloadService.preloadProducts(async () => {
          const response = await api.get("/products");
          return (response.data || []).map(normalizeSqlProduct);
        });

        setAllProducts(products);

        // Preload critical images for homepage
        if (products && products.length > 0) {
          const topProducts = products.slice(0, 12);
          imagePreloadManager.preloadHomepageImages(topProducts).catch((err) =>
            console.warn("Image preload error:", err)
          );
        }
      } catch (err) {
        console.error("Product fetch error:", err.message || err);
        toast.error("Cannot load products.");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  // ============================
  // 🔥 CART SYSTEM
  // ============================
  const addToCart = async (product) => {
    if (!user) return toast.error("Login to add to cart!");

    try {
      const productId = product.id || product.productId;
      const weight = product.selectedWeight || "default";
      const docId = `${productId}_${weight}`;

      const ref = doc(db, "users", user.uid, "cart", docId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const existingQty = snap.data().quantity || 1;
        await updateDoc(ref, { quantity: existingQty + (product.qty || 1) });
        toast.success("Quantity updated!");
      } else {
        await setDoc(ref, {
          id: docId,
          productId,
          name: product.name,
          category: product.category,
          price: product.price || 0,
          quantity: product.qty || 1,
          imageUrl: product.image || product.img || product.imageUrl || "",
          selectedWeight: weight,
          weights: product.weights || [],
          prices: product.prices || {},
        });
        toast.success("Added to cart!");
      }
    } catch (err) {
      console.error("Add to Cart Error:", err.message);
      toast.error("Failed to add to cart.");
    }
  };

  const increaseQuantity = async (item) => {
    if (!user || !item?.id) return;
    try {
      await updateDoc(doc(db, "users", user.uid, "cart", item.id), {
        quantity: item.quantity + 1,
      });
    } catch {
      toast.error("Failed to update quantity.");
    }
  };

  const decreaseQuantity = async (item) => {
    if (!user || !item?.id || item.quantity <= 1) return;
    try {
      await updateDoc(doc(db, "users", user.uid, "cart", item.id), {
        quantity: item.quantity - 1,
      });
    } catch {
      toast.error("Failed to decrease quantity.");
    }
  };

  const removeItem = async (itemId) => {
    if (!user || !itemId) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "cart", itemId));
      toast.success("Item removed");
    } catch {
      toast.error("Remove failed");
    }
  };

  // ============================
  // 🔥 FAVORITES
  // ============================
  const addToFav = async (product) => {
    if (!user) return toast.error("Login to add to favorites!");
    const sqlUserId = getSqlUserId(user);
    if (!sqlUserId) return toast.error("Login to add to favorites!");

    const productId = String(product.productId ?? product.id ?? "");
    if (!productId) {
      toast.error("Invalid product selected for favorites.");
      return;
    }

    if (favItems.some((item) => String(item.productId) === productId)) {
      toast('Product is already in favorites.');
      return;
    }

    try {
      const payload = {
        userId: sqlUserId,
        productId,
        name: product.name,
        price: product.price || 0,
        imageUrl: product.image || product.img || product.imageUrl || "",
        selectedWeight: product.selectedWeight || "",
        weights: product.weights || [],
        prices: product.prices || {},
        date: product.date || product.createdAt || product.created_at || new Date().toISOString(),
      };

      const response = await api.post('/favorites', payload);
      const newFav = normalizeFavoriteItem(response.data || {
        ...payload,
        id: productId,
        productId,
      });

      setFavItems((current) => [
        ...current.filter((item) => String(item.productId) !== productId),
        newFav,
      ]);
      toast.success("Added to Favorites!");
    } catch (err) {
      console.error('Add to favorites error:', err);
      toast.error("Failed to add to favorites.");
    }
  };

  const removeFavItem = async (itemId) => {
    if (!user || !itemId) return;
    const sqlUserId = getSqlUserId(user);
    if (!sqlUserId) return;

    try {
      await api.delete(`/favorites/${encodeURIComponent(sqlUserId)}/${encodeURIComponent(itemId)}`);
      setFavItems((current) => current.filter((item) => item.productId !== itemId));
      toast.success("Removed from Favorites");
    } catch (err) {
      console.error('Remove favorite error:', err);
      toast.error("Failed to remove.");
    }
  };

  const clearFavorites = async () => {
    if (!user) return;
    const sqlUserId = getSqlUserId(user);
    if (!sqlUserId) return;

    try {
      await api.delete(`/favorites/${encodeURIComponent(sqlUserId)}`);
      setFavItems([]);
      toast.success("Favorites cleared");
    } catch (err) {
      console.error('Clear favorites error:', err);
      toast.error("Failed to clear favorites.");
    }
  };

  const addAllToCart = async () => {
    if (!user) return toast.error("Login to add to cart!");
    const sqlUserId = getSqlUserId(user);
    if (!sqlUserId) return toast.error("Login to add to cart!");

    if (favItems.length === 0) {
      toast.error("No favorites to add to cart.");
      return;
    }

    try {
      for (const item of favItems) {
        const activeWeight = item.selectedWeight || item.weights?.[0] || "100g";
        const price = item.prices?.[activeWeight] || item.price || 0;

        await addToCart({
          id: item.productId,
          name: item.name,
          price,
          image: item.imageUrl,
          selectedWeight: activeWeight,
          qty: 1,
          weights: item.weights,
          prices: item.prices,
        });
      }
      toast.success("All favorites added to cart!");
    } catch (err) {
      console.error('Add all to cart error:', err);
      toast.error("Failed to add some items to cart.");
    }
  };

  // ============================
  // 🔥 CLEAR CART
  // ============================
  const clearCart = async () => {
    if (!user) return;
    try {
      const snap = await getDocs(collection(db, "users", user.uid, "cart"));
      await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart.");
    }
  };

  // ============================
  // 🔥 UPDATE WEIGHT (atomic server update with proper ID handling)
  // ============================
  const sanitizeForId = (v) => String(v ?? "default").replace(/[\/\\.#\s]+/g, "_");

  const updateWeight = async (cartItemId, newWeight, newPrice) => {
    if (!user) return toast.error("Login to update weight");
    if (!cartItemId || !newWeight) return toast.error("Invalid item or weight");

    const prevCart = JSON.parse(JSON.stringify(cartItems || []));

    try {
      // Get current item from cart
      const currentItem = cartItems.find((c) => c.id === cartItemId);
      if (!currentItem) {
        toast.error("Item not found in cart");
        return;
      }

      const baseProductId = currentItem.productId;
      const safeNewWeight = sanitizeForId(newWeight);
      const newDocId = `${baseProductId}_${safeNewWeight}`;

      // Optimistic update
      setCartItems((current) => {
        return current.map((item) => {
          if (item.id === cartItemId) {
            return {
              ...item,
              id: newDocId,
              selectedWeight: newWeight,
              price: newPrice,
            };
          }
          return item;
        });
      });

      // Update on server
      const oldRef = doc(db, "users", user.uid, "cart", cartItemId);
      const newRef = doc(db, "users", user.uid, "cart", newDocId);

      await runTransaction(db, async (transaction) => {
        const oldSnap = await transaction.get(oldRef);
        
        if (!oldSnap.exists()) {
          throw new Error("Item not found on server");
        }

        const oldData = oldSnap.data();

        // If IDs are the same, just update price and weight
        if (newDocId === cartItemId) {
          transaction.update(oldRef, {
            selectedWeight: newWeight,
            price: newPrice,
          });
        } else {
          // Different ID — need to rename the document
          const newSnap = await transaction.get(newRef);

          if (newSnap.exists()) {
            // Merge with existing entry
            const existingData = newSnap.data();
            transaction.update(newRef, {
              quantity: (existingData.quantity || 0) + (oldData.quantity || 0),
              selectedWeight: newWeight,
              price: newPrice,
            });
          } else {
            // Create new document with updated weight/price
            transaction.set(newRef, {
              ...oldData,
              id: newDocId,
              selectedWeight: newWeight,
              price: newPrice,
            });
          }

          // Delete old document
          transaction.delete(oldRef);
        }
      });

      toast.success("Weight updated!");
    } catch (err) {
      console.error("updateWeight error:", err);
      setCartItems(prevCart);
      toast.error("Failed to update weight: " + err.message);
    }
  };

  return (
    <StoreContext.Provider
      value={useMemo(() => ({
        user,
        userData,
        loading,
        loadingProducts,
        allProducts,
        cartItems,
        favItems,
        setFavItems,
        addToCart,
        addToFav,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        removeFavItem,
        clearFavorites,
        addAllToCart,
        clearCart,
        updateWeight,
      }), [user, userData, loading, loadingProducts, allProducts, cartItems, favItems, setFavItems, addToCart, addToFav, increaseQuantity, decreaseQuantity, removeItem, removeFavItem, clearFavorites, addAllToCart, clearCart, updateWeight])}
    >
      {children}
    </StoreContext.Provider>
  );
};

// Safe Hook
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
};
