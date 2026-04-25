// Checkout.jsx
import { useState, useEffect, useMemo } from "react";
import { useStore } from "../Context/StoreContext";
import PageHeader from "../Component/PageHeader";
import { useNavigate, useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import api from "../services/api";
import axios from "axios";

const Checkout = () => {
  const { cartItems, clearCart, user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutProduct = location.state?.checkoutProduct || null;

  // Initialize itemsToCheckout as empty, then populate reactively
  const [itemsToCheckout, setItemsToCheckout] = useState([]);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    contact: "",
    zip: "",
    city: "",
    state: "",
    street: "",
    country: "India",
  });

  // Payment method fixed to online
  const paymentMethod = "Online Payment";

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errors, setErrors] = useState({});


  // ---------------- Order ID generation ----------------
  const generateOrderId = async () => {
    try {
      const res = await api.get("/orders");
      const orderNumber = (res.data?.length || 0) + 1;
      return `KDF00${String(orderNumber).padStart(3, "0")}`;
    } catch (err) {
      console.error("generateOrderId error:", err);
      return `KDF${Date.now()}`;
    }
  };

  const userIdToUse = String(
    user?.user_id || 
    user?.userUuid || 
    user?.userId || 
    user?.uid || 
    user?.email || 
    ""
  );

  // ---------------- Fetch saved addresses ----------------
  useEffect(() => {
    const fetchAddresses = async () => {
      if (userIdToUse && userIdToUse !== "undefined") {
        try {
          const res = await api.get(`/addresses/${userIdToUse}`);
          const rawAddresses = res.data || [];
          
          // Deduplicate based on street, city, zip to avoid UI clutter
          const uniqueMap = new Map();
          rawAddresses.forEach(addr => {
            const signature = `${addr.street}-${addr.city}-${addr.zip}`.toLowerCase().replace(/\s+/g, '');
            if (!uniqueMap.has(signature)) {
              uniqueMap.set(signature, addr);
            }
          });
          
          setSavedAddresses(Array.from(uniqueMap.values()));
        } catch (err) {
          console.error("Fetch addresses error:", err);
        }
      }
    };
    fetchAddresses();
  }, [userIdToUse]);

  // populate itemsToCheckout when cartItems or checkoutProduct changes
  useEffect(() => {
    // Only initialize if itemsToCheckout is empty to prevent manual quantity resets
    if (itemsToCheckout.length === 0) {
      if (checkoutProduct) {
        setItemsToCheckout([
          {
            ...checkoutProduct,
            qty: checkoutProduct.qty || checkoutProduct.quantity || 1,
          },
        ]);
      } else if (Array.isArray(cartItems) && cartItems.length > 0) {
        setItemsToCheckout(cartItems.map((it) => ({ ...it, qty: it.qty || it.quantity || 1 })));
      }
    }
  }, [cartItems, checkoutProduct, itemsToCheckout.length]);

  // Prefill form with user info (if available)
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullname: prev.fullname || user.displayName || "",
        email: prev.email || user.email || "",
        contact: prev.contact || user.phoneNumber || prev.contact || "",
      }));
    }
  }, [user]);

  // ---------------- Helpers ----------------
  const parsePrice = (p) => {
    const n = parseFloat(p);
    return Number.isFinite(n) ? n : 0;
  };

  const calculateItemTotal = (item) => {
    const price = parsePrice(item?.price || 0);
    const qty = parseInt(item?.qty || item?.quantity || 1, 10);
    return price * qty;
  };

  const [shippingSettings, setShippingSettings] = useState({ 
    shipping_enabled: "false", 
    shipping_amount: "0",
    store_latitude: "11.6643",
    store_longitude: "78.1460",
    store_city: "Tirupattur",
    store_zip: "635601",
    distance_buffer: "0",
    distance_multiplier: "1.0"
  });

  // --- Coupon States ---
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    const fetchShippingSettings = async () => {
      try {
        const res = await api.get("/settings");
        if (res.data) setShippingSettings((prev) => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error("Fetch shipping settings error:", err);
      }
    };
    fetchShippingSettings();
  }, []);

  // ---------------- Derived values (useMemo to avoid stale computations) ----------------
  const subtotal = useMemo(() => {
    return itemsToCheckout.reduce((acc, item) => acc + calculateItemTotal(item), 0);
  }, [itemsToCheckout]);

  // Recalculate discount whenever subtotal or appliedCoupon changes
  useEffect(() => {
    if (appliedCoupon) {
      if (appliedCoupon.discountType === "percentage") {
        const disc = (subtotal * Number(appliedCoupon.discountValue)) / 100;
        setCouponDiscount(disc);
      } else {
        setCouponDiscount(Number(appliedCoupon.discountValue));
      }
    } else {
      setCouponDiscount(0);
    }
  }, [subtotal, appliedCoupon]);

  // ---------------- Delivery & Distance Logic ----------------
  const [deliveryInfo, setDeliveryInfo] = useState({
    distance: 0,
    charge: 0,
    time: "Enter location",
    days: 0,
    lat: 0,
    lng: 0,
    areaName: ""
  });

  const WAREHOUSE = { 
    lat: parseFloat(shippingSettings.store_latitude || "11.6643"), 
    lng: parseFloat(shippingSettings.store_longitude || "78.1460") 
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getDeliveryRules = (distance) => {
    if (distance <= 15) return { charge: 40, time: "Same Day", days: 0 };
    if (distance <= 100) return { charge: 60, time: "1–2 Days", days: 1 };
    if (distance <= 400) return { charge: 90, time: "2–3 Days", days: 2 };
    if (distance <= 1000) return { charge: 140, time: "3–5 Days", days: 4 };
    return { charge: 200, time: "5–8 Days", days: 7 };
  };

  const updateDeliveryByLocation = async () => {
    const { zip, city, street, state } = form;
    
    // Only proceed if we have at least one address component
    if (!zip && !city && !street && !state) {
      setDeliveryInfo({
        distance: 0,
        charge: 0,
        time: "Enter location",
        days: 0,
        lat: 0,
        lng: 0,
        areaName: ""
      });
      return;
    }

    const searchQuery = [street, city, state, zip, "India"].filter(Boolean).join(", ");
    if (searchQuery.length < 3) return;

    setIsCalculatingDelivery(true);
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: searchQuery,
          format: "json",
          limit: 1,
          "accept-language": "en"
        },
        headers: {
          "User-Agent": "KavisDryFruits/1.0"
        }
      });

      let geoData = response.data[0];

      // Fallback: If no result for "Street, City, Zip", try just "City, Zip"
      if (!geoData) {
        const fallbackQuery = [city, zip, "India"].filter(Boolean).join(", ");
        if (fallbackQuery !== searchQuery) {
          const fallbackRes = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: { q: fallbackQuery, format: "json", limit: 1, "accept-language": "en" },
            headers: { "User-Agent": "KavisDryFruits/1.0" }
          });
          if (fallbackRes.data && fallbackRes.data.length > 0) {
            geoData = fallbackRes.data[0];
          }
        }
      }

      if (geoData) {
        const { lat, lon, display_name } = geoData;
        const destLat = parseFloat(lat);
        const destLon = parseFloat(lon);

        let roadDist = 0;
        try {
          const distRes = await api.get("/settings/distance", {
            params: {
              originLat: WAREHOUSE.lat,
              originLng: WAREHOUSE.lng,
              destLat,
              destLng: destLon
            }
          });
          roadDist = distRes.data.distance;
        } catch (routeErr) {
          console.warn("Backend distance failed, falling back to local straight-line:", routeErr);
          roadDist = calculateDistance(WAREHOUSE.lat, WAREHOUSE.lng, destLat, destLon) * 1.3;
        }

        const multiplier = parseFloat(shippingSettings.distance_multiplier || "1.0");
        const buffer = parseFloat(shippingSettings.distance_buffer || "0");
        const dist = Math.ceil((roadDist * multiplier) + buffer);

        const rules = getDeliveryRules(dist);
        
        setDeliveryInfo({
          distance: dist,
          charge: subtotal >= 999 ? 0 : rules.charge,
          time: rules.time,
          days: rules.days,
          lat: destLat,
          lng: destLon,
          areaName: display_name
        });
      } else {
        setDeliveryInfo(prev => ({ ...prev, distance: 0, charge: 0, areaName: "Location not found" }));
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsCalculatingDelivery(false);
    }
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsCalculatingDelivery(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
            { headers: { "User-Agent": "KavisDryFruits/1.0" } }
          );

          if (response.data && response.data.address) {
            const addr = response.data.address;
            const city = addr.city || addr.town || addr.village || addr.suburb || "";
            const zip = addr.postcode || "";
            const state = addr.state || "";
            const street = addr.road || addr.suburb || "";

            setForm((prev) => ({
              ...prev,
              city: city,
              zip: zip,
              state: state,
              street: prev.street || street,
            }));

            // Force distance calculation with these specific coords
            let roadDist = 0;
            try {
              const distRes = await api.get("/settings/distance", {
                params: {
                  originLat: WAREHOUSE.lat,
                  originLng: WAREHOUSE.lng,
                  destLat: latitude,
                  destLng: longitude
                }
              });
              roadDist = distRes.data.distance;
            } catch (routeErr) {
              roadDist = calculateDistance(WAREHOUSE.lat, WAREHOUSE.lng, latitude, longitude) * 1.3;
            }

            const multiplier = parseFloat(shippingSettings.distance_multiplier || "1.0");
            const buffer = parseFloat(shippingSettings.distance_buffer || "0");
            const dist = Math.ceil((roadDist * multiplier) + buffer);

            const rules = getDeliveryRules(dist);

            setDeliveryInfo({
              distance: dist.toFixed(2),
              charge: subtotal >= 999 ? 0 : rules.charge,
              time: rules.time,
              days: rules.days,
              lat: latitude,
              lng: longitude,
              areaName: response.data.display_name,
            });

            toast.success("Location detected!");
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          toast.error("Failed to fetch address from location.");
        } finally {
          setIsCalculatingDelivery(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Could not get your location. Please check permissions.");
        setIsCalculatingDelivery(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Debounced location update
  useEffect(() => {
    const timer = setTimeout(() => {
      updateDeliveryByLocation();
    }, 800);
    return () => clearTimeout(timer);
  }, [form.zip, form.city, form.street, form.state, subtotal, shippingSettings.store_latitude, shippingSettings.store_longitude]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    try {
      const res = await api.post("/coupons/validate", { 
        code: couponCode.trim(), 
        subtotal 
      });
      setAppliedCoupon(res.data);
      toast.success("Coupon applied successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon code");
      setAppliedCoupon(null);
      setCouponCode("");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponDiscount(0);
    toast.success("Coupon removed");
  };

  const shippingCost = deliveryInfo.charge;

  const MIN_PURCHASE = 300;

  const finalAmount = useMemo(() => {
    return Math.max(0, subtotal + shippingCost - couponDiscount);
  }, [subtotal, shippingCost, couponDiscount]);

  const isMinimumMet = useMemo(() => subtotal >= MIN_PURCHASE, [subtotal]);
  const remainingToMin = useMemo(() => Math.max(0, MIN_PURCHASE - subtotal), [subtotal]);

  // ---------------- Validation ----------------
  const validateField = (name, value) => {
    let msg = "";

    if (!String(value || "").trim()) {
      msg = "This field is required.";
    } else {
      if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
        msg = "Enter a valid email address.";
      }
      if (name === "contact" && !/^\d{10}$/.test(value)) {
        msg = "Enter a valid 10-digit mobile number.";
      }
      if (name === "zip" && !/^\d{6}$/.test(value)) {
        msg = "Enter a valid 6-digit PIN code.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
    return msg === "";
  };

  const validateForm = () => {
    let valid = true;
    for (const key of Object.keys(form)) {
      const ok = validateField(key, form[key]);
      if (!ok) valid = false;
    }
    return valid;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear the error as user types (optional)
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const autofillAddress = (addr) => {
    // Ensure all expected keys exist
    setForm({
      fullname: addr.fullname || "",
      email: addr.email || "",
      contact: addr.contact || "",
      zip: addr.zip || "",
      city: addr.city || "",
      state: addr.state || "",
      street: addr.street || "",
      country: addr.country || "India",
    });
    toast.success("Address autofilled!");
  };

  const isDuplicateAddress = (newAddr) =>
    savedAddresses.some((addr) =>
      Object.keys(newAddr).every((key) => (addr[key] || "") === (newAddr[key] || ""))
    );

  const saveAddressAfterPayment = async () => {
    const userIdToUse = String(
      user?.user_id || 
      user?.userUuid || 
      user?.userId || 
      user?.uid || 
      user?.id || 
      ""
    ).trim().replace(/^:/, "");

    if (!userIdToUse || userIdToUse === "undefined") return;
    if (isDuplicateAddress(form)) return;
    try {
      await api.post(`/addresses/${userIdToUse}`, form);
      toast.success("Address saved to your profile!");
    } catch (err) {
      console.error("Save address error:", err);
    }
  };

  // ---------------- Email invoice ----------------
  const sendInvoiceEmail = (orderData) => {
    const templateParams = {
      to_email: orderData.email,
      to_name: orderData.fullname,
      order_id: orderData.orderId,
      total_amount: orderData.totalAmount.toFixed(2),
      items: orderData.cartItems
        .map((item) => `${item.name} (Qty: ${item.qty}) - ₹${(item.qty * item.price).toFixed(2)}`)
        .join("\n"),
      address: `${orderData.shippingAddress.street}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}, ${orderData.shippingAddress.zip}, ${orderData.shippingAddress.country}`,
    };

    emailjs
      .send("service_a6grxsl", "template_cmt9s1t", templateParams, "isAR5Sy8Y4PABFBmC")
      .then(() => console.log("Invoice email sent"))
      .catch((error) => console.error("Email error:", error));
  };

  // ---------------- Qty update (local UI) ----------------
  const updateQty = (id, delta) => {
    setItemsToCheckout((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const oldQty = parseInt(item.qty || item.quantity || 1, 10) || 1;
        const newQty = Math.max(1, oldQty + delta); // min 1
        return { ...item, qty: newQty };
      })
    );
  };

  // Optional: allow direct qty set from an input (keeps min 1)
  const setQty = (id, value) => {
    const intVal = Math.max(1, parseInt(value || 1, 10) || 1);
    setItemsToCheckout((prev) => prev.map((it) => (it.id === id ? { ...it, qty: intVal } : it)));
  };

  // ---------------- Place order (save to Firestore + update stock) ----------------
  const placeOrder = async (paymentId = "") => {
    const userIdToUse = String(
      user?.user_id || 
      user?.userUuid || 
      user?.userId || 
      user?.uid || 
      user?.id || 
      ""
    ).trim().replace(/^:/, "");

    if (!userIdToUse) {
      console.error("[Checkout-Error] No valid User ID found during placeOrder:", user);
      throw new Error("User must be logged in to place an order.");
    }

    if (!Array.isArray(itemsToCheckout) || itemsToCheckout.length === 0) {
      throw new Error("Cart is empty.");
    }

    const orderId = await generateOrderId();

    const trimmedCartItems = itemsToCheckout.map((item) => {
      // Ensure we don't send massive base64 images to the DB record
      let safeImage = item.image || (item.images && item.images[0]) || "";
      if (safeImage.startsWith("data:image") && safeImage.length > 10000) {
        safeImage = safeImage.substring(0, 100); // Just a reference for base64 if too large
      }

      return {
        id: item.id,
        productId: item.productId || item.id,
        name: item.name,
        image: safeImage,
        weight: item.selectedWeight || item.weight || "",
        price: parsePrice(item.price || 0),
        qty: parseInt(item.qty || item.quantity || 1, 10),
        type: item.type || "single",
      };
    });

    const orderData = {
      orderId,
      userId: userIdToUse,
      clientName: form.fullname,
      clientPhone: form.contact,
      email: form.email,
      shippingAddress: form,
      customerType: "Online Customer",
      paymentMode: "Online Payment",
      paymentStatus: "Paid",
      paymentId: paymentId,
      orderStatus: "Order Placed",
      shippingCharge: shippingCost,
      delivery_charge: deliveryInfo.charge,
      area: form.city,
      pincode: form.zip,
      lat: deliveryInfo.lat,
      lng: deliveryInfo.lng,
      distance: deliveryInfo.distance,
      delivery_days: deliveryInfo.days,
      items: trimmedCartItems,
      gstAmount: 0, 
      couponCode: appliedCoupon?.code || null,
      discountAmount: couponDiscount,
      totalAmount: finalAmount,
    };

    try {
      // Save order to MySQL (Backend now handles stock reduction in a transaction)
      await api.post("/orders", orderData);

      // Post-order actions
      sendInvoiceEmail({
        ...orderData,
        fullname: form.fullname,
        cartItems: trimmedCartItems
      });
      await saveAddressAfterPayment();
      if (!checkoutProduct) clearCart();
    } catch (err) {
      console.error("Place order error:", err);
      throw err;
    }
  };

  // ---------------- Form submit -> start razorpay payment automatically ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all errors in the form.");
      return;
    }

    if (!user) {
      toast.error("Please log in to place an order.");
      return;
    }

    if (!isMinimumMet) {
      toast.error(`Minimum order value is ₹${MIN_PURCHASE}. Add ₹${remainingToMin.toFixed(2)} more to proceed.`);
      return;
    }

    setIsPlacingOrder(true);

    try {
      // create and append razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      // If script fails to load, reset processing state
      script.onerror = () => {
        setIsPlacingOrder(false);
        toast.error("Failed to load payment gateway. Please try again.");
      };

      script.onload = () => {
        const options = {
          key: "rzp_test_SGj8n5SyKSE10b",
          amount: Math.round(finalAmount * 100), 
          currency: "INR",
          name: "Kavi DryFruits",
          description: "Order Payment",
          handler: async (response) => {
            try {
              await placeOrder(response?.razorpay_payment_id || "");
              toast.success("Order placed successfully!");
              setIsPlacingOrder(false);
              navigate("/account", { state: { goToOrders: true } });
            } catch (err) {
              console.error("Post-payment order error:", err);
              toast.error("Order placement failed after payment.");
              setIsPlacingOrder(false);
            }
          },
          prefill: {
            name: form.fullname,
            email: form.email,
            contact: form.contact,
          },
          notes: {
            address: `${form.street}, ${form.city}, ${form.state}, ${form.zip}`,
          },
          theme: { color: "#388e3c" },
          // IMPORTANT: if user closes/dismisses the payment popup, reset the state
          modal: {
            ondismiss: function () {
              setIsPlacingOrder(false);
              toast.error("Payment cancelled.");
            },
          },
        };

        const rzp = new window.Razorpay(options);

        // Optional: handle explicit payment failure event if SDK supports it
        try {
          if (rzp && typeof rzp.on === "function") {
            rzp.on("payment.failed", function (response) {
              console.error("Razorpay payment failed", response);
              setIsPlacingOrder(false);
              toast.error("Payment failed. Please try again.");
            });
          }
        } catch (err) {
          console.warn("Could not attach payment.failed listener:", err);
        }

        rzp.open();
      };

      document.body.appendChild(script);
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong while starting payment.");
      setIsPlacingOrder(false);
    }
  };

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu & Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal",
    "Andaman & Nicobar",
    "Chandigarh",
    "Dadra & Nagar Haveli",
    "Daman & Diu",
    "Lakshadweep",
    "Puducherry",
  ];

  // ---------------- Minimum purchase rule ----------------
  // (Using the values calculated in useMemo above)

  return (
    <>
    <Helmet>
  <title>Shop Premium Dry Fruits, Nuts, Dates & Seeds | Kavi’s Dry Fruits Tirupattur</title>

  <meta
    name="description"
    content="Buy premium dry fruits, nuts, seeds, raisins, dates and combo packs at best prices. Fresh quality delivered across Tamil Nadu and India. Contact +91 94895 93504. Tirupattur 635653."
  />

  <meta
    name="keywords"
    content="
      dry fruits shop, buy dry fruits online, almonds online, cashews online, pistachios online, dates online, raisins online, premium dry fruits store,
      fresh dry fruits Tirupattur, Tirupattur dry fruits, dry fruits 635653, dry fruits Tamil Nadu,
      dry fruits Chennai, dry fruits Coimbatore, dry fruits Madurai, dry fruits Vellore, dry fruits Salem,
      dry fruits Krishnagiri, dry fruits Dharmapuri, dry fruits Erode, dry fruits Tirunelveli,
      dry fruits Kanyakumari, dry fruits Tiruvannamalai, dry fruits Namakkal, dry fruits Trichy,
      dry fruits Thanjavur, dry fruits Cuddalore, dry fruits Dindigul, dry fruits Kanchipuram,
      buy nuts online India, premium nuts store, healthy snacks online, organic dry fruits,
      big size cashews W180, premium almonds, roasted pistachios, family pack dry fruits,
      dry fruits combo pack, Tamil Nadu pincode delivery, dry fruits shop phone number +91 94895 93504
    "
  />

  <link rel="canonical" href="https://kavisdryfruits.com/shop" />

  <meta property="og:title" content="Shop Premium Dry Fruits & Nuts – Kavi’s Dry Fruits Tirupattur" />
  <meta property="og:description" content="Premium almonds, cashews, pista, dates & seeds delivered across Tamil Nadu & India. Contact +91 94895 93504." />
  <meta property="og:url" content="https://kavisdryfruits.com/shop" />
  <meta property="og:type" content="website" />
</Helmet>

      <PageHeader title="Check Out Page" subtitle="shop" curpage="Check Out Page" />
      <div className="bg-Beach min-h-screen py-10 px-4 sm:px-10 grid md:grid-cols-3 gap-8">

        {/* Move Product sidebar first so product details show before Billing Details */}
        <div className="border w-full overflow-hidden border-green-500 rounded-xl p-6 bg-white shadow-sm h-fit md:sticky md:top-4">
          {/* Product Table */}
          <div className="border border-green-400  rounded-lg p-4 mb-6 bg-white">
            <h3 className="text-lg font-bold mb-3">Products</h3>

            {/* Scrollable container */}
            <div className="overflow-auto max-h-64 pr-2">
              <table className=" w-full text-sm border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b">
                    <th className="py-2 px-2 w-12 text-left">S.No</th>
                    <th className="py-2 px-2 w-20 text-left">Image</th>
                    <th className="py-2 px-2 text-left">Product</th>
                    <th className="py-2 px-2 w-24 text-right">Price</th>
                    <th className="py-3 px-3 w-28 text-center">Qty</th>
                    <th className="py-2 px-2 w-28 text-right">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {itemsToCheckout.map((item, index) => {
                    const productImage =
                      item?.image ||
                      item?.img ||
                      item?.imageURL ||
                      item?.imageUrl ||
                      item?.photo ||
                      (item?.images && item.images[0]) ||
                      "/images/default-product.png";

                    const qty = parseInt(item.qty || item.quantity || 1, 10) || 1;
                    const price = parsePrice(item.price || 0);
                    const itemTotal = price * qty;

                    return (
                      <tr key={item.id} className="border-b align-top">
                        <td className="py-3 px-2">{index + 1}</td>

                        <td className="py-3 px-2">
                          <img
                            src={productImage}
                            alt={`${item.name} - Kavi's Dry Fruits`}
                            className="w-12 h-12 rounded object-cover bg-gray-100"
                          />
                        </td>

                        <td className="py-3 px-2">
                          <p className="font-medium leading-tight">{item.name}</p>
                          {item.selectedWeight && (
                            <p className="text-xs text-gray-600">Weight: {item.selectedWeight}</p>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right">₹{price.toFixed(2)}</td>

                        {/* Qty control */}
                        <td className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, -1)}
                              className="w-7 h-7 flex items-center cursor-pointer justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                            >
                              -
                            </button>

                            <input
                              type="number"
                              value={qty}
                              onChange={(e) => setQty(item.id, e.target.value)}
                              min={1}
                              className="w-12 text-center border rounded px-1 py-1"
                            />

                            <button
                              type="button"
                              onClick={() => updateQty(item.id, +1)}
                              className="w-7 h-7 flex items-center cursor-pointer justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-2 text-right font-medium">₹{itemTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>

          <div className="space-y-3 font-medium">
            {/* 1. Subtotal */}
            <div className="flex justify-between text-slate-600">
              <span>Sub Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {/* 2. Coupon Section */}
            <div className="my-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm">
              <label className="block text-[10px] font-black text-emerald-700 mb-2 uppercase tracking-[0.15em]">
                Apply Coupon
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="CODE"
                  disabled={appliedCoupon}
                  className="flex-1 px-3 py-2 text-sm border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 bg-white font-bold"
                />
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="px-4 py-2 text-xs font-black bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all shadow-md shadow-rose-200"
                  >
                    REMOVE
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 text-xs font-black bg-emerald-900 text-white rounded-xl hover:bg-emerald-800 transition-all shadow-md shadow-emerald-200"
                  >
                    APPLY
                  </button>
                )}
              </div>
              {appliedCoupon && (
                <p className="mt-2 text-[10px] text-emerald-600 font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  {appliedCoupon.code} APPLIED SUCCESSFULLY!
                </p>
              )}
            </div>

            {/* 3. Discount (Conditional) */}
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 italic">
                <span>Discount Applied</span>
                <span>- ₹{couponDiscount.toFixed(2)}</span>
              </div>
            )}

            {/* 4. Shipping */}
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charges</span>
              <span>₹{shippingCost.toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-dashed border-slate-200" />

            {/* 5. Final Total */}
            <div className="flex justify-between text-xl font-black text-slate-900 pt-1">
              <span>Total Amount</span>
              <span className="text-emerald-700">₹{finalAmount.toFixed(2)}</span>
            </div>

            {/* 6. Extra Info (Separated) */}
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Order Details</p>
              <div className="flex justify-between text-xs text-slate-500 font-bold">
                <span>Total Items</span>
                <span>{itemsToCheckout.length} items</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-bold">
                <span>Estimated Weight</span>
                <span>
                  {itemsToCheckout.reduce((total, item) => {
                    const weightStr = String(item.selectedWeight || "").toLowerCase();
                    let weight = parseFloat(weightStr.replace(/[()]/g, ""));
                    
                    if (isNaN(weight) || weight === 0) {
                      // Fallback 1: Combo-specific fields
                      weight = Number(item.totalWeight || item.comboDetails?.totalWeight || 0);
                      
                      // Fallback 2: Sum individual items if still 0
                      if (weight === 0) {
                        const items = item.combos || item.comboItems || [];
                        weight = items.reduce((sum, sub) => {
                          const wStr = String(sub.weight || "").replace(/[()]/g, "").toLowerCase();
                          let w = parseFloat(wStr) || 0;
                          if (wStr.includes("kg") || wStr.includes("k")) w *= 1000;
                          return sum + w;
                        }, 0);
                      }
                    } else if (weightStr.includes("kg") || weightStr.includes("k")) {
                      weight *= 1000;
                    }
                    
                    const qty = parseInt(item.qty || item.quantity || 1, 10) || 1;
                    return total + (weight * qty);
                  }, 0).toLocaleString()} g
                </span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-green-50 p-4 rounded-md border border-green-200 mt-4 relative overflow-hidden">
              {isCalculatingDelivery && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 backdrop-blur-[1px]">
                   <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <h3 className="font-bold text-green-800 mb-2 flex items-center justify-between">
                Delivery Information
                {deliveryInfo.distance > 0 && <span className="text-[10px] bg-green-200 text-green-800 px-2 py-0.5 rounded-full uppercase">Calculated</span>}
              </h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">From (Store):</span>
                  <span className="font-semibold">{shippingSettings.store_city || "Tirupattur"}, {shippingSettings.store_zip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To (You):</span>
                  <span className="font-semibold text-right max-w-[150px] truncate">{deliveryInfo.areaName || "Enter Location"}</span>
                </div>
                <div className="flex justify-between border-t border-green-100 pt-2">
                  <span className="text-gray-600">Estimated Distance:</span>
                  <span className="font-bold text-green-800">{deliveryInfo.distance} KM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charge:</span>
                  <span className="font-bold text-green-700">₹{deliveryInfo.charge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Time:</span>
                  <span className="font-semibold">{deliveryInfo.time}</span>
                </div>
              </div>
              {subtotal >= 999 && (
                <p className="text-xs text-green-600 font-bold mt-2">✓ Free Delivery Applied</p>
              )}
            </div>
          </div>
        </div>

        {/* Billing form comes second */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 space-y-6 bg-white p-6 rounded-md border border-green-300 shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Billing Details</h2>
            <button
              type="button"
              onClick={fetchCurrentLocation}
              disabled={isCalculatingDelivery}
              className="flex items-center gap-2 text-xs font-bold bg-green-100 text-green-700 px-3 py-2 rounded-full hover:bg-green-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use My Location
            </button>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Saved Addresses</h3>
            {savedAddresses.length > 0 ? (
              savedAddresses.map((addr, idx) => (
                <div
                  key={idx}
                  className="border p-3 mb-2 rounded cursor-pointer hover:bg-green-50"
                  onClick={() => autofillAddress(addr)}
                >
                  <p className="font-semibold">{addr.fullname}</p>
                  <p>{`${addr.street}, ${addr.city}, ${addr.state}, ${addr.zip}, ${addr.country}`}</p>
                  <p>{addr.contact}</p>
                  <p>{addr.email}</p>
                </div>
              ))
            ) : (
              <p>No saved addresses found.</p>
            )
            }
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {["fullname", "email", "contact", "zip", "city", "street"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-semibold mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)} *
                </label>
                <input
                  type="text"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full border bg-white border-green-400 rounded-md px-3 py-2"
                />
                {errors[field] && <p className="text-red-600 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold mb-1">State *</label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full border bg-white border-green-400 rounded-md px-3 py-2"
              >
                <option value="">Select State</option>
                {indianStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Country *</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full border bg-white border-green-400 rounded-md px-3 py-2"
              >
                <option value="India">India</option>
              </select>
              {errors.country && <p className="text-red-600 text-xs mt-1">{errors.country}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Payment Method *</label>
            <p className="text-sm font-medium">Online Payment</p>
          </div>

          <button
            type="submit"
            className={`w-full px-6 py-2 rounded mt-4 transition cursor-pointer text-white font-semibold ${
              isPlacingOrder || !isMinimumMet ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
            }`}
            disabled={isPlacingOrder || !isMinimumMet}
          >
            {isPlacingOrder ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 018 8h-4l3.5 3.5L20 12h-4a8 8 0 01-8 8v-4l-3.5 3.5L4 12z"
                  />
                </svg>
                Processing...
              </div>
            ) : (
              `Place Order (₹${finalAmount.toFixed(2)})`
            )}
          </button>

          {/* Minimum purchase notice */}
          {!isMinimumMet && (
            <p className="mt-2 text-sm text-red-600">
              Minimum order value is ₹{MIN_PURCHASE}. Add ₹{remainingToMin.toFixed(2)} more to enable placing the order.
            </p>
          )}
        </form>

      </div>
    </>
  );
};

export default Checkout;
