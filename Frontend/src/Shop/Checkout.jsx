// Checkout.jsx
import { useState, useEffect, useMemo } from "react";
import { useStore } from "../Context/StoreContext";
import PageHeader from "../Component/PageHeader";
import { useNavigate, useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import api from "../services/api";

const Checkout = () => {
  const { cartItems, clearCart, user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutProduct = location.state?.checkoutProduct || null;

  // Initialize itemsToCheckout as empty, then populate reactively
  const [itemsToCheckout, setItemsToCheckout] = useState([]);

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
    if (checkoutProduct) {
      setItemsToCheckout([
        {
          ...checkoutProduct,
          qty: checkoutProduct.qty || checkoutProduct.quantity || 1,
        },
      ]);
    } else if (Array.isArray(cartItems) && cartItems.length > 0) {
      setItemsToCheckout(cartItems.map((it) => ({ ...it, qty: it.qty || it.quantity || 1 })));
    } else {
      setItemsToCheckout([]);
    }
  }, [cartItems, checkoutProduct]);

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
    shipping_amount: "0" 
  });

  // --- Coupon States ---
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    const fetchShippingSettings = async () => {
      try {
        const res = await api.get("/settings");
        if (res.data) setShippingSettings(res.data);
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

  const shippingCost = useMemo(() => {
    if (shippingSettings.shipping_enabled !== "true") return 0;

    const baseRate = Number(shippingSettings.shipping_amount || 0);
    let totalWeightGrams = 0;

    itemsToCheckout.forEach((item) => {
      const qty = Number(item.qty || item.quantity || 1);
      const weightStr = String(item.selectedWeight || "0").toLowerCase();
      
      let weightValue = parseInt(weightStr, 10) || 0;
      if (weightStr.includes("kg") || weightStr.includes("k")) {
        weightValue = weightValue * 1000;
      }
      
      totalWeightGrams += weightValue * qty;
    });

    if (totalWeightGrams === 0) return 0;

    let cost = baseRate;
    
    // Tiered pricing for the first 1kg
    if (totalWeightGrams <= 500) {
      // Light order: ₹20 discount from base
      cost = Math.max(0, baseRate - 20);
    } else if (totalWeightGrams <= 1000) {
      // Standard 1kg order: Full base rate
      cost = baseRate;
    } else {
      // Heavy order: Base + extras
      const extraWeight = totalWeightGrams - 1000;
      const extraChunks = Math.ceil(extraWeight / 200);
      cost = baseRate + (extraChunks * 10);
    }

    return cost;
  }, [itemsToCheckout, shippingSettings]);

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
    const userIdToUse = String(user?.user_id || user?.userUuid || user?.userId || user?.uid || "");
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
    const userIdToUse = String(user?.user_id || user?.userUuid || user?.userId || user?.uid || "");
    if (!userIdToUse) {
      throw new Error("User must be logged in to place an order.");
    }

    if (!Array.isArray(itemsToCheckout) || itemsToCheckout.length === 0) {
      throw new Error("Cart is empty.");
    }

    const orderId = await generateOrderId();

    const trimmedCartItems = itemsToCheckout.map((item) => ({
      id: item.id,
      productId: item.productId || item.id,
      name: item.name,
      image: item.images?.[0] || item.image || "",
      selectedWeight: item.selectedWeight || "",
      price: parsePrice(item.price || 0),
      qty: parseInt(item.qty || item.quantity || 1, 10),
      category: item.category || "",
      type: item.type || (item.category === "Combo" ? "combo" : "single"),
    }));

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
      orderStatus: "Placed",
      shippingCharge: shippingCost,
      items: trimmedCartItems,
      gstAmount: 0, // Simplified or calculated if needed
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
                  {itemsToCheckout
                    .filter(i => i.category !== "Combo")
                    .reduce((total, item) => {
                      const weight = parseInt((item.selectedWeight || "").replace("g", "")) || 0;
                      const qty = parseInt(item.qty || item.quantity || 1) || 1;
                      return total + weight * qty;
                    }, 0)} g
                </span>
              </div>
              {itemsToCheckout.some(i => i.category === "Combo") && (
                <div className="flex justify-between text-xs text-slate-500 font-bold">
                  <span>Combo Packs</span>
                  <span>{itemsToCheckout.filter(i => i.category === "Combo").length} packs</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Billing form comes second */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 space-y-6 bg-white p-6 rounded-md border border-green-300 shadow"
        >
          <h2 className="text-2xl font-bold mb-2">Billing Details</h2>

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
