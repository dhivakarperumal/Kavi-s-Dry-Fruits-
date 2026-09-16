import CustomSelect from "../Common/CustomSelect";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaPrint, FaTable, FaThLarge, FaShoppingBag, FaSearch, FaChevronRight, FaChevronLeft, FaClock, FaBox, FaUser, FaMoneyBillWave } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logo from "/images/Kavi_logo.png";
import OrderDetailsModal from "./OrderDetailsModal";
import api from "../../services/api";
import { io } from "socket.io-client";

const NewOrders = ({ adminData, onOrderUpdated }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("Today");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelInput, setShowCancelInput] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" or "card"
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const seenIncomingOrderIds = useRef(new Set());

  const navigate = useNavigate();

  const applyOrders = (sourceOrders) => {
    const parsed = sourceOrders.filter(o =>
      o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled" && o.orderStatus !== "Returned" && o.orderStatus !== "Refunded"
    ).map(o => ({
      ...o,
      cartItems: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []),
      shippingAddress: typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : (o.shippingAddress || {}),
      date: o.created_at || o.date
    }));
    setOrders(parsed.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  // Always fetch fresh from API — never rely on stale adminData cache for New Orders
  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get("/orders");
      applyOrders(res.data || []);
    } catch (error) {
      console.error("fetchOrders error:", error);
      // Fallback to adminData only if API fails
      if (adminData?.allOrders?.length > 0) {
        applyOrders(adminData.allOrders);
      }
    }
  }, [adminData]);

  useEffect(() => {
    // Always fetch fresh data on mount
    fetchOrders();

    // Poll every 15 seconds for sync
    const interval = setInterval(fetchOrders, 15000);

    // Listen for real-time status updates via Socket.IO
    const socket = io(api.defaults.baseURL.replace('/api', ''), {
      auth: { token: localStorage.getItem("token") },
      transports: ["polling"],
    });
    const handleIncomingOrder = (incomingOrder) => {
      const orderKey = incomingOrder?.orderId || incomingOrder?.id;
      if (!orderKey || seenIncomingOrderIds.current.has(orderKey)) return;
      seenIncomingOrderIds.current.add(orderKey);
      if (["Delivered", "Cancelled", "Returned", "Refunded"].includes(incomingOrder.orderStatus)) return;
      const normalizedOrder = {
        ...incomingOrder,
        cartItems: Array.isArray(incomingOrder.items) ? incomingOrder.items : [],
        shippingAddress: incomingOrder.shippingAddress || {},
        date: incomingOrder.created_at || incomingOrder.date || new Date().toISOString(),
      };
      setOrders((currentOrders) => [normalizedOrder, ...currentOrders.filter((order) => (order.orderId || order.id) !== orderKey)]);
    };
    socket.on('new-order', handleIncomingOrder);
    socket.on('newOrder', handleIncomingOrder);
    socket.on('orderStatusUpdated', () => {
      fetchOrders(); // Re-fetch immediately when any status changes
    });
    socket.on('newOrder', () => {
      fetchOrders(); // Re-fetch when new order arrives
    });
    socket.on('connect', () => {
      fetchOrders(); // Sync on reconnect
    });

    return () => {
      clearInterval(interval);
      socket.off('new-order', handleIncomingOrder);
      socket.off('newOrder', handleIncomingOrder);
      socket.disconnect();
    };
  }, [fetchOrders]);

  useEffect(() => {
    let temp = [...orders];
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      temp = temp.filter(
        (o) =>
          (o.orderId || "").toLowerCase().includes(q) ||
          (o.clientName || "").toLowerCase().includes(q) ||
          (o.shippingAddress?.fullname || "").toLowerCase().includes(q)
      );
    }

    const now = new Date();
    if (dateFilter === "Today") {
      temp = temp.filter((o) => new Date(o.date).toDateString() === now.toDateString());
    } else if (dateFilter === "This Week") {
      const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
      temp = temp.filter((o) => new Date(o.date) >= firstDay);
    } else if (dateFilter === "This Month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      temp = temp.filter((o) => new Date(o.date) >= firstDay);
    } else if (dateFilter === "Custom" && customRange.from && customRange.to) {
      const fromDate = new Date(customRange.from);
      const toDate = new Date(customRange.to);
      temp = temp.filter((o) => new Date(o.date) >= fromDate && new Date(o.date) <= toDate);
    }
    setFilteredOrders(temp);
    setCurrentPage(1); // Reset to first page on filter change
  }, [orders, searchText, dateFilter, customRange]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when items per page changes
  }, [itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const generateDocketNumber = () => {
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
    return `AA${randomDigits}IN`;
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!newStatus) return;
    try {
      const data = { orderStatus: newStatus };
      if (newStatus === "Cancelled") {
        if (!cancelReason.trim()) return toast.error("Please enter cancel reason");
        data.cancelReason = cancelReason;
      }

      if (newStatus === "Shipped") {
        data.docketNumber = generateDocketNumber();
      }

      // ✅ Optimistic update: immediately reflect change in the UI
      setOrders(prev => prev.map(o =>
        o.id === id
          ? { ...o, orderStatus: newStatus, ...(data.docketNumber ? { docketNumber: data.docketNumber } : {}) }
          : o
      ));

      await api.put(`/orders/${id}`, data);
      const updatedOrder = orders.find((order) => order.id === id);
      onOrderUpdated?.({
        ...updatedOrder,
        id,
        orderStatus: newStatus,
        ...(data.docketNumber ? { docketNumber: data.docketNumber } : {}),
        ...(data.cancelReason ? { cancelReason: data.cancelReason } : {}),
      });
      toast.success(newStatus === "Shipped" ? `Order Shipped! Docket: ${data.docketNumber}` : `Order ${newStatus} successfully!`);
      setCancelReason("");
      setShowCancelInput(null);

      // Background sync to confirm DB state (no loading spinner)
      fetchOrders(true);
    } catch (err) {
      toast.error("Failed to update status!");
      // Revert optimistic update on failure
      fetchOrders(true);
    }
  };

  const handlePrint = useCallback((order) => {
    if (!order) return;
    let address = order.shippingAddress || order.client || {};
    if (typeof address === 'string') {
      try { address = JSON.parse(address); } catch(e) { address = {}; }
    }

    const items = order.cartItems || order.items || [];
    const itemsList = items.map((item, index) => {
      const name = item.name || item.productName || "-";
      const qty = Number(item.qty ?? item.quantity ?? 1);
      const weight = item.weight || item.selectedWeight || item.weightDisplay || "-";
      const unitPrice = Number(item.price ?? item.unitPrice ?? (item.total && qty ? item.total / qty : 0)) || 0;
      const lineTotal = (unitPrice * qty).toFixed(2);
      
      return `
        <tr>
          <td>${index + 1}</td>
          <td style="text-align: center; vertical-align: middle;"><strong style="color: #333; font-size: 14px;">${name}</strong></td>
          <td>${weight}</td>
          <td>₹${unitPrice.toFixed(2)}</td>
          <td>${qty}</td>
          <td>₹${lineTotal}</td>
        </tr>`;
    }).join("");

    const shipping = Number(order.shippingCharge || 0);
    const finalAmount = Number(order.totalAmount || 0);
    const subtotal = finalAmount - shipping;
    
    const orderDate = (order.created_at || order.date);
    const displayDate = orderDate ? new Date(orderDate).toLocaleString('en-IN') : new Date().toLocaleString('en-IN');

    const printWindow = window.open("", "_blank", "width=850,height=750");
    if (!printWindow) return alert("Pop-ups must be allowed.");

    printWindow.document.write(`
    <html>
      <head>
        <title></title>
        <style>
          @page { size: A4; margin: 0; }
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            padding: 15mm;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0;
          }
          .logo { margin-top: 3px; }
          .logo img { max-width: 140px; }
          .invoice-title { text-align: right; }
          .invoice-title h1 { color: #2b5c92; font-size: 36px; font-weight: 800; margin: 0; letter-spacing: 1px; text-transform: uppercase; }
          .invoice-title p { font-size: 16px; color: #555; margin: 5px 0 0 0; font-weight: 600; }
          .invoice-title .invoice-date { font-size: 11px; color: #666; margin-top: 8px; font-weight: 500; }
          .divider { height: 4px; background-color: #2b5c92; margin-bottom: 40px; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .info-block { width: 48%; }
          .info-block h3 { font-size: 14px; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .info-block p { font-size: 13px; line-height: 1.6; margin: 4px 0; color: #444; }
          .info-block p strong { color: #222; }
          .status-badge { color: #2b5c92; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-left: 5px; }
          .manifest-title { font-size: 14px; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; font-weight: 700; }
          table { width: 100%; border-collapse: collapse; border-spacing: 0; margin-bottom: 5px; }
          th, td { border: 1px solid #333; padding: 8px 12px; text-align: center; font-size: 13px; }
          th { background-color: #fcfcfc; font-weight: 700; color: #333; }
          .summary-section { display: flex; justify-content: flex-end; margin-bottom: 50px; }
          .summary-table { width: 300px; }
          .summary-table div { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #444; }
          .summary-table .total { font-size: 18px; font-weight: 800; color: #222; border-top: 2px solid #eee; padding-top: 12px; margin-top: 4px; }
          .total-val { color: #2b5c92; }
          .footer { text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
          .footer p { font-size: 12px; color: #666; margin: 5px 0; }
          .footer p strong { color: #333; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">
            <img src="${logo}" alt="Kavi's Logo" />
          </div>
          <div class="invoice-title">
            <h1>INVOICE</h1>
            <p>${order.orderId}</p>
            <div class="invoice-date">${displayDate}</div>
          </div>
        </div>
        <div class="divider"></div>

        <div class="info-section">
          <div class="info-block">
            <h3>Customer Info</h3>
            <p><strong>Name:</strong> ${order.clientName || address.fullname || "-"}</p>
            <p><strong>Email:</strong> ${order.clientEmail || address.email || "-"}</p>
            <p><strong>Phone:</strong> ${order.clientPhone || address.contact || "-"}</p>
            <p><strong>Address:</strong> ${(address.street ? address.street + ', ' : '')}${(address.city ? address.city + ', ' : '')}${(address.state || '')}${(address.zip ? ' - ' + address.zip : '')}</p>
            <p><strong>Country:</strong> ${address.country || "India"}</p>
          </div>
          <div class="info-block">
            <h3>Order Info</h3>
            <p><strong>Shop:</strong> Kavi's Dry Fruits</p>
            <p>Tirupattur,<br>Tamil Nadu, 635601<br>Ph: +91 94895 93504</p>
          </div>
        </div>

        <div class="manifest-title">Item Manifest</div>
        <table>
          <thead>
            <tr>
              <th style="width: 8%">S.No</th>
              <th style="width: 34%; text-align: center;">Product Name</th>
              <th style="width: 16%">Weight</th>
              <th style="width: 16%">Price</th>
              <th style="width: 10%">Qty</th>
              <th style="width: 16%">Total</th>
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
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); printWindow.close(); }, 500);
  }, []);

  const statusOptions = [
    "Order Placed",
    "Order Confirmed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
    "Returned",
    "Refunded"
  ];

  const getFilteredStatusOptions = (currentStatus) => {
    const currentIndex = statusOptions.indexOf(currentStatus);
    if (currentIndex === -1) return statusOptions;
    
    let options = statusOptions.slice(currentIndex);

    // 1. Hide "Cancelled" if the order has already been Shipped (index 3)
    if (currentIndex >= 3) {
      options = options.filter(s => s !== "Cancelled");
    }

    // 2. Hide "Returned" and "Refunded" until the order is Delivered (index 5)
    if (currentIndex < 5) {
      options = options.filter(s => s !== "Returned" && s !== "Refunded");
    }

    return options;
  };

  return (
    <div className="p-4 sm:p-8  min-h-screen">
      {/* New Orders Stats Cards (Dealer Reference Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total New Orders Card */}
        <div className="group relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-emerald-500/40 bg-gradient-to-br from-emerald-400 to-emerald-600">
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-150"></div>
          <div className="absolute -top-10 -right-4 w-28 h-28 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-125"></div>

          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-white/80 font-black text-[10px] tracking-widest uppercase mb-2">New Orders In Queue</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">
                {orders.length}
              </h3>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner backdrop-blur-md border border-white/20 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 bg-white/20">
              <FaShoppingBag />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6 relative z-10">
            <span className="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">{orders.filter(o => o.orderStatus === 'Placed' || o.orderStatus === 'Pending').length} Awaiting Dispatch Action</span>
          </div>
        </div>

        {/* New Orders Value Card */}
        <div className="group relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-indigo-500/40 bg-gradient-to-br from-indigo-500 to-indigo-700">
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-150"></div>
          <div className="absolute -top-10 -right-4 w-28 h-28 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-125"></div>

          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-white/80 font-black text-[10px] tracking-widest uppercase mb-2">Pending Fulfillment Value</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">
                ₹{Math.round(orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0)).toLocaleString()}
              </h3>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner backdrop-blur-md border border-white/20 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 bg-white/20">
              <FaMoneyBillWave />
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 relative z-10 text-white/50 text-[10px] font-black uppercase tracking-widest italic font-mono">
            Active Unfulfilled Orders Volume
          </div>
        </div>

        {/* Filtered In-View Card */}
        <div className="group relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-blue-500/40 bg-gradient-to-br from-blue-500 to-blue-700">
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-150"></div>
          <div className="absolute -top-10 -right-4 w-28 h-28 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-125"></div>

          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-white/80 font-black text-[10px] tracking-widest uppercase mb-2">Matching Filter</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">
                {filteredOrders.length}
              </h3>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner backdrop-blur-md border border-white/20 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 bg-white/20">
              <FaBox />
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 relative z-10">
            <span className="flex h-2 w-2 rounded-full bg-white animate-bounce"></span>
            <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">{filteredOrders.length} Orders in Active View</span>
          </div>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="relative z-20 mb-8">
      

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Search */}
          <div className="relative w-full lg:max-w-sm flex-1">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Search ID, Name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all font-black text-slate-900 text-sm shadow-sm"
            />
          </div>

          {/* Right: Controls */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* View Toggle */}
            <div className="bg-white p-1 rounded-md border border-slate-200 flex items-center shadow-sm">
              <button
                onClick={() => setViewMode("table")}
                aria-label="Table view"
                title="Table view"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-black transition-all ${viewMode === "table" ? "bg-[#009669] text-white shadow-lg" : "text-slate-400 hover:text-[#009669]"}`}
              >
                <FaTable /> 
              </button>
              <button
                onClick={() => setViewMode("card")}
                aria-label="Card view"
                title="Card view"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-black transition-all ${viewMode === "card" ? "bg-[#009669] text-white shadow-lg" : "text-slate-400 hover:text-[#009669]"}`}
              >
                <FaThLarge /> 
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Bar */}
      <div className="bg-white p-5 rounded-[2rem]  shadow-sm flex flex-wrap items-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Filter By Date</span>
          <CustomSelect
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-40"
            buttonClassName="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-black text-slate-800 hover:border-emerald-500/50"
            options={[
              { value: "All", label: "All Time" },
              { value: "Today", label: "Today Only" },
              { value: "This Week", label: "This Week" },
              { value: "This Month", label: "This Month" },
              { value: "Custom", label: "Custom Range" },
            ]}
          />
        </div>

        {dateFilter === "Custom" && (
          <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-300">
            <input type="date" value={customRange.from} onChange={(e) => setCustomRange({ ...customRange, from: e.target.value })} className="bg-slate-50 px-3 py-2 rounded-xl text-xs font-black border-none" />
            <FaChevronRight className="text-slate-300" size={12} />
            <input type="date" value={customRange.to} onChange={(e) => setCustomRange({ ...customRange, to: e.target.value })} className="bg-slate-50 px-3 py-2 rounded-xl text-xs font-black border-none" />
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility</span>
           <CustomSelect
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="w-32"
            buttonClassName="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-black text-slate-800 hover:border-emerald-500/50"
            options={[25, 50, 100, 250].map(n => ({ value: n, label: `Show ${n}` }))}
          />
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-visible animate-in fade-in duration-700">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#009669] text-white">
                <th className="px-3 py-3 text-[8px] md:px-4 md:py-3 md:text-[9px] lg:px-8 lg:py-5 lg:text-[10px] font-black uppercase tracking-widest rounded-tl-xl md:rounded-tl-2xl">S.No</th>
                <th className="px-3 py-3 text-[8px] md:px-4 md:py-3 md:text-[9px] lg:px-8 lg:py-5 lg:text-[10px] font-black uppercase tracking-widest">Order Details</th>
                <th className="px-3 py-3 text-[8px] md:px-4 md:py-3 md:text-[9px] lg:px-8 lg:py-5 lg:text-[10px] font-black uppercase tracking-widest">Client</th>
                <th className="px-3 py-3 text-[8px] md:px-4 md:py-3 md:text-[9px] lg:px-8 lg:py-5 lg:text-[10px] font-black uppercase tracking-widest">Amount</th>
                <th className="px-3 py-3 text-[8px] md:px-4 md:py-3 md:text-[9px] lg:px-8 lg:py-5 lg:text-[10px] font-black uppercase tracking-widest">Status Flow</th>
                <th className="px-3 py-3 text-[8px] md:px-4 md:py-3 md:text-[9px] lg:px-8 lg:py-5 lg:text-[10px] font-black uppercase tracking-widest text-center rounded-tr-xl md:rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentOrders.length > 0 ? (
                currentOrders.map((order, index) => (
                  <tr key={order.id} className="group hover:bg-slate-50/70 transition-colors">
                    <td className="px-8 py-6 font-black text-slate-800 text-xs">
                       {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-8 py-6">
                      <button onClick={() => setSelectedOrder(order)} className="text-indigo-600 font-black text-sm hover:underline block mb-1">#{order.orderId}</button>
                      {order.docketNumber && (
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-md border border-emerald-100">
                          Docket: {order.docketNumber}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                         <FaClock className="text-slate-300" />
                         {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-800 text-sm leading-tight">{order.clientName || order.fullname || order.shippingAddress?.fullname || "Guest"}</p>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1.5">{order.paymentMethod || "COD"}</p>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-lg font-black text-emerald-600 tracking-tighter">₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
                       <p className="text-[8px] font-black text-slate-300 uppercase mt-0.5 tracking-widest">{order.cartItems?.length || 0} Items</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                         <CustomSelect
                          value={order.orderStatus}
                          onChange={(e) => e.target.value === "Cancelled" ? setShowCancelInput(order.id) : handleStatusUpdate(order.id, e.target.value)}
                          badgeVariant={true}
                          className="w-44"
                          options={getFilteredStatusOptions(order.orderStatus)}
                        />
                        {showCancelInput === order.id && (
                          <div className="flex flex-col gap-2 mt-2 animate-in slide-in-from-top-2 duration-300">
                             <textarea className="w-40 p-2 text-[10px] font-bold border border-rose-100 rounded-xl bg-rose-50 outline-none" placeholder="Reason" onChange={e => setCancelReason(e.target.value)} />
                             <button onClick={() => handleStatusUpdate(order.id, "Cancelled")} className="w-40 bg-rose-500 text-white text-[8px] font-black uppercase py-2 rounded-lg tracking-widest shadow-lg shadow-rose-100">Abort Order</button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button onClick={() => handlePrint(order)} className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-slate-100 shadow-sm group-hover:scale-110">
                        <FaPrint />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-32 text-center text-slate-400 font-black uppercase tracking-[0.2em]">
                    <FaBox className="text-5xl mx-auto mb-4 opacity-10" />
                    No orders awaiting fulfillment
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-700">
          {currentOrders.map(order => (
            <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
               <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50/50 px-2 py-1 rounded-lg uppercase tracking-widest mb-2 inline-block">Order Pending</span>
                    <h3 onClick={() => setSelectedOrder(order)} className="text-xl font-black text-slate-900 tracking-tighter cursor-pointer hover:text-indigo-600 transition-colors">#{order.orderId}</h3>
                    {order.docketNumber && (
                      <p className="text-[9px] font-black text-emerald-600 uppercase mt-1">Docket: {order.docketNumber}</p>
                    )}
                  </div>
                  <button onClick={() => handlePrint(order)} className="w-12 h-12 bg-slate-50 text-slate-300 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                    <FaPrint size={18} />
                  </button>
               </div>

               <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100"><FaUser size={14} /></div>
                     <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</p>
                        <p className="font-black text-slate-800 text-xs truncate">{order.clientName || order.fullname || order.shippingAddress?.fullname || "Guest"}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100"><FaMoneyBillWave size={14} /></div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                        <p className="font-black text-emerald-600 text-sm tracking-tighter">₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
                     </div>
                  </div>
               </div>

               <div className="pt-6 border-t border-slate-100">
                  <label className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-3 pl-1">Update Pipeline</label>
                  <CustomSelect
                    value={order.orderStatus}
                    onChange={(e) => e.target.value === "Cancelled" ? setShowCancelInput(order.id) : handleStatusUpdate(order.id, e.target.value)}
                    badgeVariant={true}
                    className="w-full"
                    options={getFilteredStatusOptions(order.orderStatus)}
                  />
               </div>

               {/* Decorative Gradient Line */}
               <div className={`absolute bottom-0 left-0 h-1.5 transition-all duration-500 ${
                  order.orderStatus === 'Order Placed' ? 'bg-indigo-500 w-1/4' : 
                  order.orderStatus === 'Order Confirmed' ? 'bg-blue-500 w-2/4' :
                  order.orderStatus === 'Processing' ? 'bg-amber-500 w-3/4' :
                  'bg-emerald-500 w-full'}`}></div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-10 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Showing <span className="text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-slate-800">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of <span className="text-slate-800">{filteredOrders.length}</span> Orders
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`w-11 h-11 flex items-center justify-center rounded-2xl border border-slate-100 transition-all ${currentPage === 1 ? "text-slate-200 cursor-not-allowed" : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 shadow-sm"}`}
            >
              <FaChevronLeft size={14} />
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pg = i + 1;
                // Logic to show limited pages
                if (pg === 1 || pg === totalPages || (pg >= currentPage - 1 && pg <= currentPage + 1)) {
                  return (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`w-11 h-11 rounded-2xl text-xs font-black transition-all ${currentPage === pg ? "bg-indigo-600 text-white shadow-indigo-200 shadow-xl" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}
                    >
                      {pg}
                    </button>
                  );
                } else if (pg === currentPage - 2 || pg === currentPage + 2) {
                  return <span key={pg} className="px-2 text-slate-300 font-bold">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`w-11 h-11 flex items-center justify-center rounded-2xl border border-slate-100 transition-all ${currentPage === totalPages ? "text-slate-200 cursor-not-allowed" : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 shadow-sm"}`}
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onPrint={handlePrint} />
    </div>
  );
};

export default NewOrders;
