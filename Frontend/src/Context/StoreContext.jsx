import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useAuth } from "../PrivateRouter/AuthContext";

import { toast } from "react-hot-toast";
import dataPreloadService from "../services/dataPreloadService";
import api from "../services/api";
import { parseWeightToGrams, formatStockDisplay, isSameProduct, getProductCartUsage } from "../utils/stockUtils";
import { normalizeCategory, normalizeCombo, normalizeProduct } from "../utils/catalog";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favItems, setFavItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // ============================
  // 🔥 AUTH + CART/FAV FETCHING
  // ============================
  useEffect(() => {
    const fetchData = async () => {
      // Prioritize the UUID-based user_id/userUuid
      const userIdToUse = String(user?.user_id || user?.userUuid || user?.userId || user?.uid || "");
      
      if (userIdToUse && userIdToUse !== "undefined") {
        try {
          // Fetch CART from MySQL API
          const cartRes = await api.get(`/cart/${userIdToUse}`);
          setCartItems(cartRes.data || []);
          console.log(`✓ Cart synced for user: ${userIdToUse}`);

          // Fetch FAVORITES from MySQL API
          const favRes = await api.get(`/favorites/${userIdToUse}`);
          setFavItems(favRes.data || []);
        } catch (err) {
          console.error("API Data Fetch Error:", err.message);
          // toast.error("Unable to sync your cart/wishlist.");
        }
      } else {
        setCartItems([]);
        setFavItems([]);
      }

      setLoading(false);
    };

    if (user !== undefined) {
       fetchData();
    }
  }, [user]);

  // ============================
  // ⚡ SUPER FAST PRODUCT LOADING (WITH CACHING & PRELOADING)
  // ============================
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to get from cache first
        let data = await dataPreloadService.preloadProducts(async () => {
          const results = await Promise.allSettled([
            api.get("/products", { timeout: 8000 }),
            api.get("/combos", { timeout: 8000 }),
            api.get("/categories", { timeout: 8000 }),
          ]);
          const [productsResult, combosResult, categoriesResult] = results;
          if (productsResult.status === "rejected") console.error("Product catalog request failed:", productsResult.reason);
          if (combosResult.status === "rejected") console.error("Combo catalog request failed:", combosResult.reason);
          if (categoriesResult.status === "rejected") console.error("Category catalog request failed:", categoriesResult.reason);
          if (productsResult.status === "rejected" && combosResult.status === "rejected") {
            throw productsResult.reason;
          }

          const rawProducts = productsResult.status === "fulfilled" && Array.isArray(productsResult.value.data)
            ? productsResult.value.data
            : [];
          const rawCombos = combosResult.status === "fulfilled" && Array.isArray(combosResult.value.data)
            ? combosResult.value.data
            : [];
          const rawCategories = categoriesResult.status === "fulfilled" && Array.isArray(categoriesResult.value.data)
            ? categoriesResult.value.data
            : [];

          return {
            products: [...rawProducts.map(normalizeProduct), ...rawCombos.map(normalizeCombo)],
            categories: rawCategories.map(normalizeCategory),
          };
        });

        setAllProducts(data.products || []);
        setAllCategories(data.categories || []);
      } catch (err) {
        const isNetworkIssue = !err?.response && !!err?.message && /network|timeout|connection|failed/i.test(err.message);

        if (isNetworkIssue) {
          console.warn("Backend is unavailable right now. Product catalog will remain empty until the API is reachable.");
        } else {
          console.error("Data load error:", err.message);
        }

        setAllProducts([]);
        setAllCategories([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadData();
  }, []);

  // ============================
  // 🔥 CART SYSTEM
  // ============================
  const addToCart = async (product) => {
    if (!user) return toast.error("Login to add to cart!");

    try {
      const productId = String(product.id || product.productId || "unknown");
      const weight = String(product.selectedWeight || "default");
      const docId = `${productId}_${weight}`.replace(/[\/\\.#\s]+/g, "_");
      // Extract the most reliable user ID available
      const userIdToUse = String(
        user.user_id || 
        user.userUuid || 
        user.userId || 
        user.uid || 
        user.id || 
        ""
      ).trim().replace(/^:/, ""); // Remove any accidental leading colon

      if (!userIdToUse) {
        console.error("[Cart-Error] No valid User ID found in user object:", user);
        return toast.error("Session error: Please log out and log back in.");
      }

      console.log(`[Cart-Action] Adding to cart for user: ${userIdToUse}`);
      
      // Local update check
      const existing = cartItems.find((c) => c.docId === docId);
      const newQty = (existing?.quantity || 0) + (product.qty || 1);

      // Check available stock
      const matchedProd = allProducts.find(
        (p) => isSameProduct(p, product)
      ) || product;

      const availableStock = Number(matchedProd.stock ?? matchedProd.totalStock ?? 0);
      const isCombo = (matchedProd.category === "Combo") || (matchedProd.type === "combo");

      if (availableStock <= 0) {
        return toast.error("Sorry, this product is out of stock.");
      }

      if (isCombo) {
        const otherQty = getProductCartUsage(cartItems, matchedProd, docId);
        if (newQty + otherQty > availableStock) {
          if (otherQty > 0) {
            return toast.error(`Only ${formatStockDisplay(availableStock, true)} available in stock (${otherQty} already in your cart).`);
          }
          return toast.error(`Out of Stock. Only ${formatStockDisplay(availableStock, true)} available.`);
        }
      } else {
        const weightGrams = parseWeightToGrams(weight);
        const otherGrams = getProductCartUsage(cartItems, matchedProd, docId);
        if (weightGrams > 0 && (weightGrams * newQty + otherGrams) > availableStock) {
          if (otherGrams > 0) {
            return toast.error(
              `Only ${formatStockDisplay(availableStock, false)} available in stock (${formatStockDisplay(otherGrams, false)} already in your cart). Cannot add ${product.qty > 1 ? product.qty + "x " : ""}${weight}.`
            );
          }
          return toast.error(
            `Only ${formatStockDisplay(availableStock, false)} available in stock. Cannot add ${newQty > 1 ? newQty + "x " : ""}${weight}.`
          );
        }
      }

      await api.post(`/cart/${userIdToUse}`, {
        productId,
        name: product.name || "Unknown Product",
        category: product.category || "General",
        price: product.price || 0,
        quantity: newQty,
        image: product.image || product.img || product.imageUrl || "",
        selectedWeight: weight,
        weights: product.weights || [],
        prices: product.prices || {},
        id: product.id,
        type: product.type || 'single',
        docId,
      });

      // Update local state for immediate feedback
      setCartItems((prev) => {
        if (existing) {
          return prev.map((item) =>
            item.docId === docId ? { ...item, quantity: newQty } : item
          );
        }
        return [
          ...prev,
          {
            id: docId || product.id,
            type: product.type || 'single',
            docId,
            productId,
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: newQty,
            image: product.image || product.img || product.imageUrl || "",
            selectedWeight: weight,
            weights: product.weights,
            prices: product.prices,
          },
        ];
      });

      toast.success(existing ? "Quantity updated!" : "Added to cart!");
    } catch (err) {
      console.error("Add to Cart Error:", err.message);
      toast.error("Failed to add to cart.");
    }
  };

  const increaseQuantity = async (item) => {
    if (!user || !item?.docId) return;
    try {
      const matchedProd = allProducts.find(
        (p) => isSameProduct(p, item)
      ) || item;

      const availableStock = Number(matchedProd.stock ?? matchedProd.totalStock ?? 0);
      const isCombo = (matchedProd.category === "Combo") || (matchedProd.type === "combo");
      const newQty = (item.quantity || 0) + 1;

      if (availableStock <= 0) {
        return toast.error("Sorry, this item is out of stock.");
      }

      if (isCombo) {
        const otherQty = getProductCartUsage(cartItems, matchedProd, item.docId);
        if (newQty + otherQty > availableStock) {
          return toast.error(`Out of Stock. Only ${formatStockDisplay(availableStock, true)} available.`);
        }
      } else {
        const weightGrams = parseWeightToGrams(item.selectedWeight || item.weights?.[0]);
        const otherGrams = getProductCartUsage(cartItems, matchedProd, item.docId);
        if (weightGrams > 0 && (weightGrams * newQty + otherGrams) > availableStock) {
          return toast.error(`Only ${formatStockDisplay(availableStock, false)} available in stock. Cannot increase quantity.`);
        }
      }

      const userIdToUse = String(user.user_id || user.userUuid || user.userId || user.uid || "");
      await api.post(`/cart/${userIdToUse}/update-quantity`, {
        docId: item.docId,
        quantity: newQty,
      });
      setCartItems((prev) =>
        prev.map((i) => (i.docId === item.docId ? { ...i, quantity: newQty } : i))
      );
    } catch {
      toast.error("Failed to update quantity.");
    }
  };

  const decreaseQuantity = async (item) => {
    if (!user || !item?.docId || item.quantity <= 1) return;
    try {
      const userIdToUse = String(user.user_id || user.userUuid || user.userId || user.uid || "");
      const newQty = (item.quantity || 0) - 1;
      await api.post(`/cart/${userIdToUse}/update-quantity`, {
        docId: item.docId,
        quantity: newQty,
      });
      setCartItems((prev) =>
        prev.map((i) => (i.docId === item.docId ? { ...i, quantity: newQty } : i))
      );
    } catch {
      toast.error("Failed to decrease quantity.");
    }
  };

  const removeItem = async (docId) => {
    if (!user || !docId) return;
    try {
      const userIdToUse = String(user.user_id || user.userUuid || user.userId || user.uid || "");
      await api.delete(`/cart/${userIdToUse}/${docId}`);
      setCartItems((prev) => prev.filter((i) => i.docId !== docId));
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

    try {
      const userIdToUse = String(user.user_id || user.userUuid || user.userId || user.uid || "");
      const productId = String(product.id || product.productId || "unknown");
      
      await api.post(`/favorites/${userIdToUse}`, {
        productId,
        name: product.name || "Unknown Product",
        price: product.price || 0,
        image: product.image || product.img || product.imageUrl || "",
        selectedWeight: product.selectedWeight || "",
        weights: product.weights || [],
        prices: product.prices || {},
        category: product.category || "General",
      });

      setFavItems(prev => {
        if (prev.some(i => String(i.productId) === productId)) return prev;
        return [...prev, {
          productId,
          name: product.name,
          price: product.price,
          image: product.image || product.img || product.imageUrl || "",
          selectedWeight: product.selectedWeight,
          weights: product.weights,
          prices: product.prices,
          category: product.category || "General",
        }];
      });

      toast.success("Added to Favorites!");
    } catch {
      toast.error("Failed to add to favorites.");
    }
  };

  const removeFavItem = async (productId) => {
    if (!user || !productId) return;
    try {
      const userIdToUse = String(user.user_id || user.userUuid || user.userId || user.uid || "");
      await api.delete(`/favorites/${userIdToUse}/${productId}`);
      setFavItems(prev => prev.filter(i => String(i.productId) !== String(productId)));
      toast.success("Removed from Favorites");
    } catch {
      toast.error("Failed to remove.");
    }
  };

  // ============================
  // 🔥 CLEAR SYSTEMS
  // ============================
  const removeCartItem = async (docId) => {
    if (!user) return;
    try {
      const userIdToUse = String(user.user_id || user.userUuid || user.userId || user.uid || "");
      await api.delete(`/cart/${userIdToUse}/${docId}`);
      setCartItems((prev) => prev.filter((i) => i.docId !== docId));
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item.");
    }
  };

  const clearCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    try {
      const userIdToUse = String(user.user_id || user.userUuid || user.userId || user.uid || "");
      await api.delete(`/cart/${userIdToUse}`);
      setCartItems([]);
      // toast.success("Cart cleared");
    } catch {
      console.warn("Failed to clear cart on server");
      setCartItems([]); // Clear local anyway
    }
  };

  const clearFav = async () => {
    if (!user) return;
    try {
      const userIdToUse = String(user.user_id || user.userUuid || user.userId || user.uid || "");
      await api.delete(`/favorites/${userIdToUse}`);
      setFavItems([]);
      toast.success("Wishlist cleared");
    } catch (err) {
      console.error("clearFav error:", err);
      toast.error("Failed to clear wishlist.");
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
      const currentItem = cartItems.find((c) => c.id === cartItemId || c.docId === cartItemId);
      if (!currentItem) {
        toast.error("Item not found in cart");
        return;
      }

      const matchedProd = allProducts.find((p) => isSameProduct(p, currentItem)) || currentItem;
      const availableStock = Number(matchedProd.stock ?? matchedProd.totalStock ?? 0);
      const isCombo = (matchedProd.category === "Combo") || (matchedProd.type === "combo");

      if (!isCombo) {
        const requestedGrams = (currentItem.quantity || 1) * parseWeightToGrams(newWeight);
        const otherGrams = getProductCartUsage(cartItems, matchedProd, currentItem.docId || cartItemId);
        if (requestedGrams + otherGrams > availableStock) {
          toast.error(
            `Only ${formatStockDisplay(availableStock, false)} available in stock. Cannot select ${newWeight} for ${currentItem.quantity} item(s).`
          );
          return;
        }
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
      const userIdToUse = String(user.user_id || user.userUuid || user.userId || user.uid || "");
      
      await api.post(`/cart/${userIdToUse}/update-weight`, {
        oldDocId: cartItemId,
        newDocId,
        newWeight,
        newPrice
      });

      toast.success("Weight updated!");
    } catch (err) {
      console.error("updateWeight error:", err);
      setCartItems(prevCart);
      toast.error("Failed to update weight");
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
        allCategories,
        cartItems,
        favItems,
        addToCart,
        addToFav,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        removeFavItem,
        clearCart,
        clearFav,
        updateWeight,
      }), [user, userData, loading, loadingProducts, allProducts, allCategories, cartItems, favItems, addToCart, addToFav, increaseQuantity, decreaseQuantity, removeItem, removeFavItem, clearCart, clearFav, updateWeight])}
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
