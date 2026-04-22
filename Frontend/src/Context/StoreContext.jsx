import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useAuth } from "../PrivateRouter/AuthContext";

import { toast } from "react-hot-toast";
import dataPreloadService from "../services/dataPreloadService";
import imagePreloadManager from "../services/imagePreloadManager";
import api from "../services/api";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
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
    const loadProducts = async () => {
      try {
        // Try to get from cache first
        let products = await dataPreloadService.preloadProducts(async () => {
          const [prodRes, comboRes] = await Promise.all([
            api.get("/products"),
            api.get("/combos"),
          ]);

          const rawProducts = prodRes.data || [];
          const rawCombos = comboRes.data || [];
          
          // Map MySQL products to Frontend schema
          const mappedProducts = rawProducts.map(p => {
            const variants = typeof p.variants === 'string' ? JSON.parse(p.variants || '[]') : (p.variants || []);
            const prices = {};
            const weights = [];
            
            variants.forEach(v => {
              prices[v.weight] = {
                mrp: Number(v.mrp),
                offerPrice: Number(v.offerPrice)
              };
              weights.push(v.weight);
            });

            return {
              ...p,
              type: 'single',
              prices,
              weights,
              category: p.category || "General",
              image: (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : (p.images || []))[0] || "",
              imageUrl: (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : (p.images || []))[0] || "",
              images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : (p.images || []),
              health_benefits: typeof p.healthBenefits === 'string' ? JSON.parse(p.healthBenefits || '[]') : (p.healthBenefits || []),
              tags: typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : (p.tags || []),
              rating: Number(p.rating || 4.5)
            };
          });

          // Map MySQL combos to Frontend schema
          const mappedCombos = rawCombos.map(c => {
            const details = typeof c.comboDetails === 'string' ? JSON.parse(c.comboDetails || '{}') : (c.comboDetails || {});
            const items = typeof c.comboItems === 'string' ? JSON.parse(c.comboItems || '[]') : (c.comboItems || []);
            
            // Price fallback chain: direct DB columns → comboDetails → 0
            const offerPrice = Number(c.offerPrice || c.price || details.offerPrice || details.mrp || 0);
            const mrp = Number(c.mrp || details.mrp || offerPrice || 0);
            // Weight fallback: direct field → sum of items → 'Combo'
            let weight = String(details.totalWeight || c.totalWeight || '');
            if (!weight || weight === '0' || weight === 'Combo') {
              const calculatedWeight = items.reduce((sum, item) => {
                const wStr = String(item.weight || "").toLowerCase();
                let w = parseFloat(wStr) || 0;
                if (wStr.includes("kg") || wStr.includes("k")) w *= 1000;
                return sum + w;
              }, 0);
              weight = calculatedWeight > 0 ? String(calculatedWeight) : 'Combo';
            }
            const stock = Number(c.totalStock ?? c.stock ?? 1); // Default to 1 if not set

            return {
              ...c,
              id: c.id,  
              type: 'combo',
              category: 'Combo',
              price: offerPrice,
              offerPrice,
              mrp,
              stock,
              image: (typeof c.images === 'string' ? JSON.parse(c.images || '[]') : (c.images || []))[0] || "",
              imageUrl: (typeof c.images === 'string' ? JSON.parse(c.images || '[]') : (c.images || []))[0] || "",
              combos: items, // Rename for frontend compatibility
              comboItems: items,
              comboDetails: details,
              prices: { [weight]: { mrp, offerPrice } },
              weights: [weight],
              images: typeof c.images === 'string' ? JSON.parse(c.images || '[]') : (c.images || []),
              health_benefits: typeof c.healthBenefits === 'string' ? JSON.parse(c.healthBenefits || '[]') : (c.healthBenefits || []),
              tags: typeof c.tags === 'string' ? JSON.parse(c.tags || '[]') : (c.tags || []),
              rating: Number(c.rating || 4.8)
            };
          });

          return [...mappedProducts, ...mappedCombos];
        });

        setAllProducts(products);

        // Preload critical images for homepage
        if (products && products.length > 0) {
          const topProducts = products.slice(0, 12);
          imagePreloadManager.preloadHomepageImages(topProducts).catch(err => 
            console.warn('Image preload error:', err)
          );
        }
      } catch (err) {
        console.error("Product fetch error:", err.message);
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
      const productId = String(product.id || product.productId || "unknown");
      const weight = String(product.selectedWeight || "default");
      const docId = `${productId}_${weight}`.replace(/[\/\\.#\s]+/g, "_");
      const userIdToUse = String(user.user_id || user.userUuid || user.userId || user.uid || "");

      // Local update check
      const existing = cartItems.find((c) => c.docId === docId);
      const newQty = (existing?.quantity || 0) + (product.qty || 1);

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
            id: product.id,
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
      const userIdToUse = String(user.user_id || user.userUuid || user.userId || user.uid || "");
      const newQty = (item.quantity || 0) + 1;
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
      }), [user, userData, loading, loadingProducts, allProducts, cartItems, favItems, addToCart, addToFav, increaseQuantity, decreaseQuantity, removeItem, removeFavItem, clearCart, clearFav, updateWeight])}
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
