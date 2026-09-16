import { useState, useEffect } from "react";
import { FaEdit, FaPrint } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import PageHeader from "../Component/PageHeader";
import Services from "../Home/Services";
import { useLocation } from "react-router-dom";
import { useAuth } from "../PrivateRouter/AuthContext";
import api from "../services/api";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import OrderTracking from "../Shop/OrderTracking";
import { FaTruck, FaShoppingCart, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import { useStore } from "../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import UserOrderDetailsModal from "./UserOrderDetailsModal";

const Account = () => {
  const { user } = useAuth();
  const { addToCart, clearCart, allProducts } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [allOrders, setAllOrders] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    fullname: "",
    contact: "",
    email: "",
    city: "",
    zip: "",
    state: "",
    street: "",
    country: "India",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };
  const [errors, setErrors] = useState({});
  const [trackingOrderId, setTrackingOrderId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const location = useLocation();

  const countries = ["India"];

  const statesIndia = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Puducherry"
  ];

  const userIdToUse = String(
    user?.user_id || 
    user?.userUuid || 
    user?.userId || 
    user?.uid || 
    user?.email || 
    ""
  );

  useEffect(() => {
    if (!userIdToUse || userIdToUse === "undefined") return;

    const fetchData = async () => {
      // 1. Fetch Profile
      try {
        const profileRes = await api.get(`/users/profile/${userIdToUse}`);
        if (profileRes.data) {
          setUserInfo({
            username: profileRes.data.username || user?.displayName || user?.username || "",
            email: profileRes.data.email || user?.email || "",
            phone: profileRes.data.phone || user?.phone || "",
          });
        }
      } catch (error) {
        console.error("Profile sync error:", error);
        setUserInfo({
          username: user?.displayName || user?.username || "",
          email: user?.email || "",
          phone: user?.phone || "",
        });
      }

      // 2. Fetch Orders
      try {
        const ordersRes = await api.get(`/orders/user/${userIdToUse}`);
        setAllOrders(ordersRes.data || []);
      } catch (err) {
        console.error("Orders fetch error:", err);
        setAllOrders([]);
      }

      // 3. Fetch Addresses
      try {
        const addressRes = await api.get(`/addresses/${userIdToUse}`);
        setAddresses(addressRes.data || []);
      } catch (err) {
        console.error("Address fetch error:", err);
        setAddresses([]);
      }

      // 4. Fetch this user's reviews so each order can be reviewed only once
      try {
        const reviewsRes = await api.get("/reviews");
        const reviews = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];
        setUserReviews(
          reviews.filter((review) => String(review.userId) === userIdToUse)
        );
      } catch (err) {
        console.error("Reviews fetch error:", err);
        setUserReviews([]);
      }
    };

    fetchData();
  }, [userIdToUse, user]);

  useEffect(() => {
    if (location.state?.goToOrders) setActiveTab("orders");
  }, [location.state]);

  const saveAddresses = async (addressData) => {
    if (!userIdToUse) return;
    try {
      await api.post(`/users/${userIdToUse}/addresses`, addressData);
      const addressRes = await api.get(`/users/${userIdToUse}/addresses`);
      setAddresses(addressRes.data);
    } catch (err) {
      toast.error("Failed to save address");
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    // sanitize pin code: digits only, max 6
    if (name === "zip") {
      const digits = value.replace(/\D/g, "").slice(0, 6);
      setNewAddress((prev) => ({ ...prev, [name]: digits }));
      // clear zip error as user types
      setErrors((prev) => ({ ...prev, zip: undefined }));
      return;
    }
    setNewAddress((prev) => ({ ...prev, [name]: value }));
    // clear error for this field when user types
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateFields = () => {
    const newErrors = {};
    const updated = { ...newAddress };

    if (!updated.fullname || !updated.fullname.trim()) newErrors.fullname = "Full Name is required.";
    if (!updated.contact || !updated.contact.trim()) newErrors.contact = "Phone Number is required.";
    if (!updated.email || !updated.email.trim()) newErrors.email = "Email is required.";
    if (!updated.street || !updated.street.trim()) newErrors.street = "Street is required.";
    if (!updated.city || !updated.city.trim()) newErrors.city = "City is required.";
    if (!updated.state || !updated.state.trim()) newErrors.state = "State is required.";
    if (!updated.country || !updated.country.trim()) newErrors.country = "Country is required.";
    if (!/^\d{6}$/.test((updated.zip || "").toString())) newErrors.zip = "Pin Code must be a 6-digit number.";
    
    return newErrors;
  };

  const handleAddOrUpdateAddress = () => {
    const errorMap = validateFields();
    if (Object.keys(errorMap).length > 0) {
      setErrors(errorMap);
      return;
    }

    const updated = {
      ...newAddress,
    };

    const isUpdate = editingIndex !== null;
    const normalizeAddressValue = (value) => String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
    const getAddressKey = (address) => [
      address.street,
      address.city,
      address.state,
      address.country,
      address.zip,
    ].map(normalizeAddressValue).join("|");
    const updatedAddressKey = getAddressKey(updated);
    const duplicateIndex = addresses.findIndex((address) => getAddressKey(address) === updatedAddressKey);

    if (duplicateIndex !== -1 && (!isUpdate || duplicateIndex !== editingIndex)) {
      toast.error("This address is already saved.");
      return;
    }
    
    const saveOp = async () => {
      try {
        if (isUpdate) {
          const originalId = addresses[editingIndex].id;
          await api.put(`/addresses/${originalId}`, updated);
          toast.success("Address updated successfully!");
        } else {
          await api.post(`/addresses/${userIdToUse}`, updated);
          toast.success("Address added successfully!");
        }
        
        // Refresh list
        const addressRes = await api.get(`/addresses/${userIdToUse}`);
        setAddresses(addressRes.data || []);
      } catch (err) {
        console.error("Address save error:", err);
        toast.error("Failed to save address.");
      }
    };

    saveOp();

    setNewAddress({
      fullname: "",
      contact: "",
      email: "",
      city: "",
      zip: "",
      state: "",
      street: "",
      country: "India",
    });
    setEditingIndex(null);
    setErrors({});
  };

  const handleEdit = (idx) => {
    setEditingIndex(idx);
    setNewAddress(addresses[idx] || {});
    setErrors({});
  };

  const handleDelete = async (idx) => {
    const addressToDelete = addresses[idx];
    if (!addressToDelete || !addressToDelete.id) return;

    const confirmed = window.confirm(`Are you sure you want to delete this address for ${addressToDelete.fullname || 'this contact'}?`);
    if (!confirmed) return;

    try {
      await api.delete(`/users/addresses/${addressToDelete.id}`);
      setAddresses(prev => prev.filter((_, i) => i !== idx));
      toast.success("Address deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleUpdateProfile = async () => {
    if (!userIdToUse) return;
    try {
      await api.put(`/users/profile/${userIdToUse}`, {
        username: userInfo.username,
        phone: userInfo.phone,
        email: userInfo.email
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordFields;
    if (
      !currentPassword ||
      !newPassword ||
      newPassword !== confirmPassword
    ) {
      toast.error("Please check all fields and ensure passwords match.");
      return;
    }
    try {
      await api.put(`/users/password/${userIdToUse}`, {
        currentPassword,
        newPassword
      });
      setPasswordFields({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error updating password.");
    }
  };

  const handlePrint = (order) => {
    if (!order) return;
    
    // Safety check for shippingAddress (might be string or object)
    let address = order.shippingAddress || {};
    if (typeof address === 'string') {
      try { address = JSON.parse(address); } catch(e) { address = {}; }
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    
    const itemsList = (order.items || order.cartItems || [])
      .map(
        (item, index) => {
          let img = "";
          if (item.image) img = item.image;
          else if (item.imageUrl) img = item.imageUrl;
          else if (item.images && item.images.length) img = item.images[0];
          
          if (img && !img.startsWith('http') && !img.startsWith('data:')) {
            const cleanPath = img.replace(/\\/g, '/');
            img = `${backendUrl}${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`;
          }

          return `
            <tr>
              <td>${index + 1}</td>
              <td style="text-align: left; vertical-align: middle;">
                <div style="display: flex; align-items: center; gap: 15px;">
                  ${img ? `<img src="${img}" alt="product" style="width:50px; height:50px; object-fit:contain; border:1px solid #eee; border-radius:4px;" />` : ''}
                  <div>
                    <strong style="color: #333; font-size: 14px;">${item.name || "-"}</strong>
                    <div style="font-size: 11px; color: #777; margin-top: 4px;">Weight: ${item.weight || item.selectedWeight || "-"}</div>
                  </div>
                </div>
              </td>
              <td>${item.qty || item.quantity || 1}</td>
              <td>₹${Number(item.price || 0).toFixed(2)}</td>
              <td>₹${(Number(item.price || 0) * Number(item.qty || item.quantity || 1)).toFixed(2)}</td>
            </tr>`;
        }
      )
      .join("");

    const shipping = Number(order.shippingCharge || 0);
    const finalAmount = Number(order.totalAmount || 0);
    const subtotal = finalAmount - shipping;
    
    const orderDate = (order.created_at || order.date);
    const displayDate = orderDate ? new Date(orderDate).toLocaleString() : new Date().toLocaleString();

    const printWindow = window.open("", "", "width=850,height=750");
    if (!printWindow) {
      alert("Please allow pop-ups for printing.");
      return;
    }

    const htmlContent = `
    <html>
      <head>
        <title>Invoice ${order.orderId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            padding: 40px;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .logo img {
            max-width: 140px;
          }
          .invoice-title {
            text-align: right;
          }
          .invoice-title h1 {
            color: #2b5c92;
            font-size: 36px;
            font-weight: 800;
            margin: 0;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .invoice-title p {
            font-size: 16px;
            color: #555;
            margin: 5px 0 0 0;
            font-weight: 600;
          }
          .divider {
            height: 4px;
            background-color: #2b5c92;
            margin-bottom: 40px;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }
          .info-block {
            width: 48%;
          }
          .info-block h3 {
            font-size: 14px;
            color: #555;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          .info-block p {
            font-size: 13px;
            line-height: 1.6;
            margin: 4px 0;
            color: #444;
          }
          .info-block p strong {
            color: #222;
          }
          .status-badge {
            color: #2b5c92;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            margin-left: 5px;
          }
          .manifest-title {
            font-size: 14px;
            color: #555;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
            font-weight: 700;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            border: 1px solid #e0e0e0;
            padding: 12px;
            text-align: center;
            font-size: 13px;
          }
          th {
            background-color: #fcfcfc;
            font-weight: 700;
            color: #333;
          }
          .summary-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 50px;
          }
          .summary-table {
            width: 300px;
          }
          .summary-table div {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
            color: #444;
          }
          .summary-table .total {
            font-size: 18px;
            font-weight: 800;
            color: #222;
            border-top: 2px solid #eee;
            padding-top: 12px;
            margin-top: 4px;
          }
          .total-val {
            color: #2b5c92;
          }
          .footer {
            text-align: center;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
          .footer p {
            font-size: 12px;
            color: #666;
            margin: 5px 0;
          }
          .footer p strong {
            color: #333;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">
            <img src="/images/Kavi_logo.png" alt="Kavi's Logo" />
          </div>
          <div class="invoice-title">
            <h1>INVOICE</h1>
            <p>${order.orderId}</p>
          </div>
        </div>
        <div class="divider"></div>

        <div class="info-section">
          <div class="info-block">
            <h3>Customer Info</h3>
            <p><strong>Name:</strong> ${address.fullname || "-"}</p>
            <p><strong>Email:</strong> ${userInfo?.email || address.email || "-"}</p>
            <p><strong>Phone:</strong> ${address.contact || "-"}</p>
            <p><strong>Address:</strong> ${address.street || ""}, ${address.city || ""}, ${address.state || ""} - ${address.zip || ""}</p>
            <p><strong>Country:</strong> ${address.country || "India"}</p>
          </div>
          <div class="info-block">
            <h3>Order Info</h3>
            <p><strong>Shop:</strong> Kavi's Dry Fruits</p>
            <p>Tirupattur,<br>Tamil Nadu, 635601<br>Ph: +91 94895 93504</p>
            <p style="margin-top:15px"><strong>Status:</strong> <span class="status-badge">${order.orderStatus || "ORDER PLACED"}</span></p>
            <p><strong>Payment:</strong> ${order.paymentMethod || "Online Payment"}</p>
            <p><strong>Date:</strong> ${displayDate}</p>
          </div>
        </div>

        <div class="manifest-title">Item Manifest</div>
        <table>
          <thead>
            <tr>
              <th style="width: 5%">S No</th>
              <th style="width: 50%; text-align: left;">Product Details</th>
              <th style="width: 10%">Qty</th>
              <th style="width: 15%">Price</th>
              <th style="width: 20%">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>

        <div class="summary-section">
          <div class="summary-table">
            <div>
              <span>Subtotal:</span>
              <strong>₹${subtotal.toFixed(2)}</strong>
            </div>
            <div>
              <span>Shipping:</span>
              <strong>₹${shipping.toFixed(2)}</strong>
            </div>
            <div class="total">
              <span>Total Amount:</span>
              <span class="total-val">₹${finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p><strong>Thank you for shopping with Kavi's Dry Fruits!</strong></p>
          <p>For any support, please contact us at kavidryfruits@gmail.com</p>
        </div>
      </body>
    </html>
  `;
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Use a small timeout instead of onload for better cross-browser reliability
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close(); 
    }, 500);
  };

  const cancelOrder = async (orderId, reason, index) => {
    try {
      // Find the DB internal ID for this orderId string
      const orderToCancel = allOrders[index];
      if (!orderToCancel || !orderToCancel.id) return;
      if (!reason || !reason.trim()) {
        toast.error("Please enter a cancellation reason.");
        return;
      }

      await api.put(`/orders/${orderToCancel.id}`, {
        orderStatus: "Cancelled",
        cancelReason: reason.trim()
      });

      // Update local state
      const updated = [...allOrders];
      updated[index].orderStatus = "Cancelled";
      updated[index].cancelReason = reason.trim();
      setAllOrders(updated);

      toast.success("Order cancelled!");
    } catch (err) {
      console.error("Cancel order failed:", err);
      toast.error("Failed to cancel order.");
    }
  };
  
  const handleReorder = async (order) => {
    try {
      const items = order.items || order.cartItems || [];
      if (items.length === 0) return toast.error("No items found in this order.");
      
      toast.loading("Re-adding items to cart...");
      
      // Clear existing cart first
      await clearCart();
      
      for (const item of items) {
        // Try to find the full product details from allProducts
        const fullProduct = allProducts.find(p => String(p.id) === String(item.id || item.productId));
        
        if (fullProduct) {
          await addToCart({
            ...fullProduct,
            selectedWeight: item.weight || item.selectedWeight || fullProduct.weights?.[0],
            qty: item.qty || item.quantity || 1,
            price: item.price || fullProduct.prices?.[item.weight || item.selectedWeight]?.offerPrice || fullProduct.offerPrice
          });
        } else {
          // Fallback if product not in current inventory (might be discontinued)
          await addToCart({
            id: item.id || item.productId,
            productId: item.productId,
            name: item.name,
            image: item.image,
            selectedWeight: item.weight || item.selectedWeight,
            qty: item.qty || item.quantity || 1,
            price: item.price,
            category: item.category || "General"
          });
        }
      }
      
      toast.dismiss();
      toast.success("Items added to cart!");
      navigate("/checkout");
    } catch (err) {
      toast.dismiss();
      console.error("Reorder failed:", err);
      toast.error("Failed to reorder items.");
    }
  };

  const AddReviewForm = ({ onReviewSubmitted, order, userInfo, userId }) => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmitReview = async () => {
      if (!message.trim()) return toast.error("Review message cannot be empty");
      if (!order?.orderId || !userId) {
        return toast.error("Missing order or user information.");
      }

      setLoading(true);
      try {
        await api.post("/reviews", {
          userName: userInfo?.username || "Anonymous",
          userId: userId,
          orderId: order.orderId,
          comment: message.trim(),
          selected: false,
        });

        toast.success("Review submitted successfully!");
        setMessage("");
        onReviewSubmitted?.({
          orderId: order.orderId,
          userId,
          comment: message.trim(),
        });
      } catch (error) {
        console.error("Error submitting review:", error);
        toast.error("Error submitting review. Try again.");
      }
      setLoading(false);
    };

    return (
      <div className="space-y-3">
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

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={userInfo?.username || "Anonymous"}
            disabled
            className="bg-gray-100 w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Review</label>
          <textarea
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Write your feedback here..."
          />
        </div>
        <button
          onClick={handleSubmitReview}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    );
  };

  const tabs = [
    { key: "personal", label: "Personal Info" },
    { key: "orders", label: "My Orders" },
    { key: "address", label: "Manage Address" },
    { key: "tracking", label: "Track Order" },
    { key: "password", label: "Set Password" },
  ];
  const renderContent = () => {
    const firstName = (userInfo.username || "").split(" ")[0] || "";
    const lastName = (userInfo.username || "").split(" ")[1] || "";
    switch (activeTab) {
      case "personal":
        return (
          <div className="bg-white p-6 rounded-xl shadow border border-green-200 w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center text-4xl font-bold text-green-800">
                  {userInfo.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-600 text-white p-1 rounded-full cursor-pointer">
                  <FaEdit size={14} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {firstName} {lastName}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col col-span-2">
                <label className="text-sm font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  value={userInfo.username || ""}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, username: e.target.value }))}
                  className="border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col col-span-2">
                <label className="text-sm font-bold mb-1">Email ID *</label>
                <input
                  type="email"
                  value={userInfo.email || ""}
                  readOnly
                  className="border border-green-300 rounded px-3 py-2 bg-gray-50 focus:outline-none"
                />
              </div>

              <div className="flex flex-col col-span-2">
                <label className="text-sm font-bold mb-1">Phone No * </label>
                <input
                  type="text"
                  value={userInfo.phone || ""}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="12345-67890"
                  className="border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={handleUpdateProfile}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 cursor-pointer rounded-md font-semibold"
              >
                Update Changes
              </button>
            </div>
          </div>
        );
      case "tracking":
        return (
          <div className="bg-white p-6 rounded-xl shadow border border-green-200 w-full">
            {!trackingOrderId ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaTruck className="text-green-600" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Track Your Order</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Enter your Order ID or Docket Number to see real-time tracking information.</p>
                
                <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="e.g. ORD0001 or AA123456789IN" 
                    className="flex-1 border border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setTrackingOrderId(searchInput.trim())}
                  />
                  <button 
                    onClick={() => {
                      if (!searchInput.trim()) return toast.error("Please enter an ID to track");
                      setTrackingOrderId(searchInput.trim());
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-green-100 transition-all whitespace-nowrap"
                  >
                    Track Now
                  </button>
                </div>
                
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto opacity-50 grayscale">
                   <div className="text-xs font-medium">Order Placed</div>
                   <div className="text-xs font-medium">Processing</div>
                   <div className="text-xs font-medium">In Transit</div>
                   <div className="text-xs font-medium">Delivered</div>
                </div>
              </div>
            ) : (
              <div>
                <button 
                  onClick={() => {
                    setTrackingOrderId("");
                    setSearchInput("");
                  }}
                  className="mb-6 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all"
                >
                  ← New Search
                </button>
                <OrderTracking orderId={trackingOrderId} />
              </div>
            )}
          </div>
        );
      case "orders":
        const selectedOrder = allOrders.find((order) => order.orderId === selectedOrderId);
        const selectedOrderReview = userReviews.find(
          (review) => String(review.orderId) === String(selectedOrder?.orderId)
        );

        return (
          <div className="bg-white min-h-screen py-6 px-2 md:px-6 rounded-xl">
            {allOrders.length === 0 ? (
              <p className="text-center text-gray-500">No Orders Found</p>
            ) : (
              allOrders.map((order, index) => {
                const isOpen = selectedOrderId === order.orderId;
                const statusSteps = [
                  "Order Placed",
                  "Order Confirmed",
                  "Processing",
                  "Shipped",
                  "Out for Delivery",
                  "Delivered",
                ];
                const currentStatus = order.orderStatus || "Order Placed";
                const statusIndex = statusSteps.indexOf(currentStatus);

                return (
                  <div
                    key={order.orderId}
                    className="w-full mx-auto shadow-md mb-6 rounded-lg border border-green-200"
                  >
                    <div
                      className={`${
                        isOpen ? "bg-green-100" : "bg-green-50"
                      } flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 cursor-pointer`}
                      onClick={() => setSelectedOrderId(order.orderId)}
                    >
                      <div className="flex-1">
                        <h2 className="font-bold text-base md:text-lg text-black">
                          Order ID: {order.orderId}
                        </h2>
                        <p className="text-sm text-black opacity-60">
                          {order.created_at || order.date
                            ? new Date(order.created_at || order.date).toLocaleString()
                            : "N/A"}
                        </p>
                        {order.docketNumber && (statusIndex >= 3 || order.orderStatus === "Shipped") && (
                          <div className="mt-2 inline-flex items-center gap-2 bg-white/80 px-3 py-1 rounded-lg border border-green-200 shadow-sm">
                            <span className="text-[10px] font-black uppercase text-green-700 tracking-wider">Docket:</span>
                            <span className="text-xs font-black text-black">{order.docketNumber}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrint(order);
                          }}
                          className="flex items-center cursor-pointer justify-center w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full transition-all shadow-md"
                          title="Print Invoice"
                        >
                          <FaPrint /> 
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReorder(order);
                          }}
                          className="flex cursor-pointer items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-bold rounded-full transition-all shadow-md"
                        >
                          <MdRefresh size={18} /> Reorder
                        </button>

                        <div className={`px-4 py-1.5 rounded-full text-xs font-black shadow-sm border-2 ${
                          order.orderStatus === "Delivered" ? "bg-green-100 text-green-700 border-green-200" :
                          order.orderStatus === "Shipped" ? "bg-blue-100 text-blue-700 border-blue-200" :
                          order.orderStatus === "Processing" ? "bg-orange-50 text-orange-700 border-orange-100" :
                          order.orderStatus === "Cancelled" ? "bg-red-50 text-red-700 border-red-100" :
                          "bg-white text-gray-700 border-gray-200"
                        }`}>
                          {order.orderStatus === "Order Placed" && "🛒 Order Placed"}
                          {order.orderStatus === "Order Confirmed" && "✅ Order Confirmed"}
                          {order.orderStatus === "Processing" && "📦 Processing"}
                          {order.orderStatus === "Shipped" && "🚚 Shipped"}
                          {order.orderStatus === "Out for Delivery" && "🛵 Out for Delivery"}
                          {order.orderStatus === "Delivered" && "✨ Delivered"}
                          {order.orderStatus === "Cancelled" && "❌ Cancelled"}
                          {order.orderStatus === "Returned" && "🔄 Returned"}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTrackingOrderId(order.orderId);
                            setActiveTab("tracking");
                          }}
                          className="bg-green-600 cursor-pointer text-white px-6 py-2 rounded-full text-sm font-black flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-100 border-b-4 border-green-800"
                        >
                          <FaTruck size={14} /> Track
                        </button>
                      </div>
                    </div>

                    {false && (
                      <div className="bg-white px-4 py-4">
                        <div className="mb-4">
                          <h3 className="font-semibold text-base mb-2">
                            Order Tracker
                          </h3>
                          <div className="flex sm:flex-row flex-col gap-4">
                            {statusSteps.map((step, idx) => {
                              const isDone = idx <= statusIndex;
                              return (
                                <div
                                  key={idx}
                                  className="flex flex-col items-center text-center"
                                >
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                                      isDone ? "bg-green-600" : "bg-gray-300"
                                    }`}
                                  >
                                    {idx + 1}
                                  </div>
                                  <p className="text-xs mt-1">{step}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="divide-y border-t">
                          {order.cartItems?.map((item, i) => {
                            const raw = item.image || "";
                            const imageUrl = (raw.startsWith('data:') || raw.startsWith('http')) 
                              ? raw 
                              : `http://localhost:5000/api/uploads/${raw}`;

                            return (
                              <div
                                key={i}
                                className="flex gap-4 items-center py-3 text-sm"
                              >
                                <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                  <img 
                                    src={imageUrl} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = "/images/placeholder.png"; }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-bold text-gray-900">{item.name}</p>
                                  <p className="text-gray-500">
                                    Qty: {item.quantity || item.qty}
                                  </p>
                                </div>
                                <p className="text-orange-600 font-black text-base">
                                  ₹{((item.quantity || item.qty) * item.price).toFixed(2)}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4 space-y-1 text-sm text-gray-700">
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>
                              ₹
                              {order.shippingCharge !== undefined
                                ? Number(order.shippingCharge).toFixed(2)
                                : "0.00"}{" "}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxes</span> <span>₹0.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Discount</span> <span>₹0.00</span>
                          </div>
                          <div className="flex justify-between font-bold border-t pt-2 text-base">
                            <span>Total</span>
                            <span>
                              ₹
                              {order.totalAmount !== undefined
                                ? Number(order.totalAmount).toFixed(2)
                                : "0.00"}
                            </span>
                          </div>
                        </div>

                        {order.orderStatus === "Delivered" && (
                          <div className="mt-6 bg-green-50 p-4 border border-green-300 rounded">
                            <h4 className="text-green-700 font-bold text-base mb-2">
                              Add Review
                            </h4>
                            {!order.showReviewForm ? (
                              <button
                                onClick={() => {
                                  const updated = [...allOrders];
                                  updated[index].showReviewForm = true;
                                  setAllOrders(updated);
                                }}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                              >
                                Add Review
                              </button>
                            ) : (
                              <AddReviewForm
                                order={order}
                                userInfo={userInfo}
                                userId={userIdToUse}
                                onReviewSubmitted={() => {
                                  const updated = [...allOrders];
                                  updated[index].showReviewForm = false;
                                  setAllOrders(updated);
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            {selectedOrder && (
              <UserOrderDetailsModal
                order={selectedOrder}
                onClose={() => setSelectedOrderId(null)}
                onPrint={handlePrint}
                existingReview={selectedOrderReview}
                renderReviewForm={(onReviewSubmitted) => (
                  <AddReviewForm
                    order={selectedOrder}
                    userInfo={userInfo}
                    userId={userIdToUse}
                    onReviewSubmitted={(review) => {
                      setUserReviews((currentReviews) => [...currentReviews, review]);
                      onReviewSubmitted(review);
                    }}
                  />
                )}
                onCancel={(reason) => {
                  const orderIndex = allOrders.findIndex((item) => item.orderId === selectedOrder.orderId);
                  if (orderIndex >= 0 && window.confirm("Are you sure you want to cancel this order?")) {
                    cancelOrder(selectedOrder.orderId, reason, orderIndex);
                  }
                }}
              />
            )}
          </div>
        );

      case "address":
        return (
          <div className="space-y-4">
            {addresses.length > 0 &&
              addresses.map((addr, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded shadow md:flex-row flex-col flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{addr.fullname}</p>
                    <p className="text-sm">
                      {addr.street}, {addr.city}, {addr.state} - {addr.zip},{" "}
                      {addr.country}
                    </p>
                    <p className="text-sm">Phone: {addr.contact}</p>
                    <p className="text-sm">Email: {addr.email}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      className="text-green-600 underline cursor-pointer"
                      onClick={() => handleEdit(idx)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 underline cursor-pointer"
                      onClick={() => handleDelete(idx)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

            <div className="p-4 bg-white rounded shadow">
              <h4 className="text-lg font-semibold mb-2">
                {editingIndex != null ? "Edit Address" : "Add New Address"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {[
                  { name: "fullname", label: "Full Name" },
                  { name: "contact", label: "Phone Number" },
                  { name: "email", label: "Email" },
                  { name: "street", label: "Street" },
                  { name: "city", label: "City" },
                  { name: "zip", label: "Pin Code" },
                  { name: "state", label: "State" },
                  { name: "country", label: "Country" },
                ].map(({ name, label }) => {
                  // render select for state and country, and special zip input
                  if (name === "state") {
                    return (
                      <div key={name} className="flex flex-col">
                        <select
                          name={name}
                          value={newAddress[name] || ""}
                          onChange={handleNewAddressChange}
                          className={`border p-2 rounded ${
                            errors[name] ? "border-red-500" : "border-green-400"
                          }`}
                          required
                        >
                          <option value="">Select State</option>
                          {statesIndia.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {errors[name] && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors[name]}
                          </p>
                        )}
                      </div>
                    );
                  }

                  if (name === "country") {
                    return (
                      <div key={name} className="flex flex-col">
                        <select
                          name={name}
                          value={newAddress[name] || "India"}
                          onChange={handleNewAddressChange}
                          className={`border p-2 rounded ${
                            errors[name] ? "border-red-500" : "border-green-400"
                          }`}
                          required
                        >
                          <option value="">Select Country</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        {errors[name] && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors[name]}
                          </p>
                        )}
                      </div>
                    );
                  }

                  if (name === "zip") {
                    return (
                      <div key={name} className="flex flex-col">
                        <input
                          name={name}
                          placeholder={label}
                          value={newAddress[name] || ""}
                          onChange={handleNewAddressChange}
                          className={`border p-2 rounded ${
                            errors[name] ? "border-red-500" : "border-green-400"
                          }`}
                          required
                          inputMode="numeric"
                          maxLength={6}
                        />
                        {errors[name] && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors[name]}
                          </p>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div key={name} className="flex flex-col">
                      <input
                        name={name}
                        placeholder={label}
                        value={newAddress[name] || ""}
                        onChange={handleNewAddressChange}
                        className={`border p-2 rounded ${
                          errors[name] ? "border-red-500" : "border-green-400"
                        }`}
                        required
                      />
                      {errors[name] && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors[name]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleAddOrUpdateAddress}
                  className="bg-green-600 text-white px-6 py-2 rounded cursor-pointer hover:bg-green-700 transition"
                >
                  {editingIndex != null ? "Update Address" : "Add Address"}
                </button>
                <button
                  onClick={() => {
                    setNewAddress({
                      fullname: "",
                      contact: "",
                      email: "",
                      city: "",
                      zip: "",
                      state: "",
                      street: "",
                      country: "India",
                    });
                    setEditingIndex(null);
                    setErrors({});
                  }}
                  className="bg-gray-400 text-white px-6 py-2 rounded cursor-pointer hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );

      case "password":
        return (
          <div className="bg-white p-6 rounded-xl shadow border border-green-200 w-full">
            <h3 className="font-bold text-lg mb-4">Set Password</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-bold mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordFields.currentPassword}
                    onChange={handlePasswordChange}
                    className="border border-green-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 cursor-pointer"
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordFields.newPassword}
                    onChange={handlePasswordChange}
                    className="border border-green-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 cursor-pointer"
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordFields.confirmPassword}
                    onChange={handlePasswordChange}
                    className="border border-green-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 cursor-pointer"
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handlePasswordUpdate}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-white rounded shadow">Content here...</div>
        );
    }
  };

  return (
    <>
      <PageHeader
        title="Account"
        curpage={tabs.find((t) => t.key === activeTab)?.label || "Account"}
      />
      <div className="flex flex-col lg:flex-row min-h-screen  py-5 px-4 lg:py-10 lg:px-20 gap-4">
        <div className="w-full lg:w-1/3 bg-white p-4 rounded-xl shadow hidden md:block">
          <div className="space-y-3 ">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full text-left px-4 py-3 shadow-md font-semibold rounded ${
                  activeTab === tab.key ? "bg-green-600 text-white" : "bg-white text-black"
                }  transition`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-2/3 bg-white p-4 rounded-xl shadow">
          <div className="md:hidden mb-4 px-0">
            <label htmlFor="account-tabs" className="sr-only">Select section</label>
            <select
              id="account-tabs"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-100 max-w-full border border-green-300 rounded px-3 py-2 text-sm md:text-base appearance-none bg-green-600 text-white"
              aria-label="Select account section"
              style={{ fontSize: 14 }}
            >
              {tabs.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {renderContent()}
        </div>
      </div>
      <Services />
    </>
  );
};
export default Account;
