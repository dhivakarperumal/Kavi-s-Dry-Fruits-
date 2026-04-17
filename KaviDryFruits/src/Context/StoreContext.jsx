import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
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
import dataPreloadService from "../services/dataPreloadService";
import imagePreloadManager from "../services/imagePreloadManager";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
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

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          setUserData(userDoc.exists() ? userDoc.data() : null);

          // CART LISTENER
          const cartRef = collection(db, "users", currentUser.uid, "cart");
          unsubscribeCart = onSnapshot(cartRef, (snap) => {
            setCartItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          });

          // FAVORITES LISTENER
          const favRef = collection(db, "users", currentUser.uid, "favorites");
          unsubscribeFav = onSnapshot(favRef, (snap) => {
            setFavItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          });
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
    });

    return () => {
      unsubscribeAuth();
      unsubscribeCart();
      unsubscribeFav();
    };
  }, []);

  // ============================
  // ⚡ SUPER FAST PRODUCT LOADING (WITH CACHING & PRELOADING)
  // ============================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Try to get from cache first
        let products = await dataPreloadService.preloadProducts(async () => {
          const snap = await getDocs(collection(db, "products"));
          return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        });

        setAllProducts(products);

        // Preload critical images for homepage
        if (products && products.length > 0) {
          // Get top 12 products for preloading
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

    try {
      const docId = product.id || product.productId;
      await setDoc(doc(db, "users", user.uid, "favorites", docId), {
        id: docId,
        productId: docId,
        name: product.name,
        price: product.price || 0,
        imageUrl: product.image || product.img || product.imageUrl || "",
        selectedWeight: product.selectedWeight || "",
        weights: product.weights || [],
        prices: product.prices || {},
      });
      toast.success("Added to Favorites!");
    } catch {
      toast.error("Failed to add to favorites.");
    }
  };

  const removeFavItem = async (itemId) => {
    if (!user || !itemId) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "favorites", itemId));
      toast.success("Removed from Favorites");
    } catch {
      toast.error("Failed to remove.");
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
        addToCart,
        addToFav,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        removeFavItem,
        clearCart,
        updateWeight,
      }), [user, userData, loading, loadingProducts, allProducts, cartItems, favItems, addToCart, addToFav, increaseQuantity, decreaseQuantity, removeItem, removeFavItem, clearCart, updateWeight])}
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
