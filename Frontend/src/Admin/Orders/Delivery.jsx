import CustomSelect from "../Common/CustomSelect";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FaPrint, FaTrash, FaSearch, FaThLarge, FaThList } from "react-icons/fa";
import logo from "/images/Kavi_logo.png";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { io } from "socket.io-client";

const Delivery = () => {
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("table");

  const navigate = useNavigate();

  // ========== Fetch Delivered Orders From MySQL ==========
  const fetchDeliveredOrders = useCallback(async () => {
    try {
      const res = await api.get("/orders");
      const deliveries = (res.data || [])
        .filter(o => o.orderStatus === "Delivered")
        .map((order) => {
          const dateStr = order.created_at || order.date;
          const orderDateMs = dateStr ? new Date(dateStr).getTime() : 0;
          return {
            ...order,
            id: order.id,
            paymentMethod: order.paymentMode || order.paymentMethod || "-",
            orderDateMs,
            cartItems: typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []),
            shippingAddress: typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : (order.shippingAddress || {}),
            date: dateStr
          };
        });

      // sort by timestamp (descending)
      deliveries.sort((a, b) => (b.orderDateMs || 0) - (a.orderDateMs || 0));
      setDeliveredOrders(deliveries);
    } catch (error) {
      console.error("fetchDeliveredOrders error:", error);
    }
  }, []);

  useEffect(() => {
    // Fetch immediately on mount
    fetchDeliveredOrders();

    // Poll every 15 seconds as fallback
    const interval = setInterval(fetchDeliveredOrders, 15000);

    // Real-time: listen for new bills (created with Delivered status) and status updates
    const socket = io(api.defaults.baseURL.replace('/api', ''));
    socket.on('newOrder', () => {
      fetchDeliveredOrders(); // New bill may be Delivered
    });
    socket.on('orderStatusUpdated', () => {
      fetchDeliveredOrders(); // Status changed to Delivered
    });
    socket.on('connect', () => {
      fetchDeliveredOrders(); // Sync on reconnect
    });

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, [fetchDeliveredOrders]);

  // ========== Debounce search input (reduce frequent re-filtering) ==========
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [searchText]);

  // ====== Memoize date bounds (recompute only when filterType/customFrom/customTo change) =====
  const dateBounds = useMemo(() => {
    const now = new Date();
    const nowMs = now.getTime();

    if (filterType === "today") {
      const start = new Date(now.setHours(0, 0, 0, 0)).getTime();
      const end = new Date(now.setHours(23, 59, 59, 999)).getTime();
      return { start, end };
    }

    if (filterType === "week") {
      const d = new Date();
      const firstDay = new Date(d.setDate(d.getDate() - d.getDay())); // sunday
      firstDay.setHours(0, 0, 0, 0);
      const lastDay = new Date(firstDay);
      lastDay.setDate(firstDay.getDate() + 6);
      lastDay.setHours(23, 59, 59, 999);
      return { start: firstDay.getTime(), end: lastDay.getTime() };
    }

    if (filterType === "month") {
      const d = new Date();
      const first = new Date(d.getFullYear(), d.getMonth(), 1);
      const last = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      return { start: first.getTime(), end: last.getTime() };
    }

    if (filterType === "custom") {
      if (!customFrom || !customTo) return { start: -Infinity, end: Infinity };
      const from = new Date(customFrom);
      from.setHours(0, 0, 0, 0);
      const to = new Date(customTo);
      to.setHours(23, 59, 59, 999);
      return { start: from.getTime(), end: to.getTime() };
    }

    // all
    return { start: -Infinity, end: Infinity };
  }, [filterType, customFrom, customTo]);

  // ====== Memoized filtered orders (date + search) ======
  const filteredOrders = useMemo(() => {
    const s = debouncedSearch;
    const { start, end } = dateBounds;

    // small micro-optimizations: use local vars
    return deliveredOrders.filter((order) => {
      const od = order.orderDateMs || 0;
      if (od < start || od > end) return false;

      if (!s) return true;
      const orderId = (order.orderId || order.id || "").toString().toLowerCase();
      const clientName = (order.client?.name || order.shippingAddress?.fullname || "").toString().toLowerCase();
      return orderId.includes(s) || clientName.includes(s);
    });
  }, [deliveredOrders, debouncedSearch, dateBounds]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, dateBounds, ordersPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // ====== Display limited orders based on selected count ======
  const currentOrders = useMemo(() => {
    return filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);
  }, [filteredOrders, ordersPerPage, currentPage]);

  // ====== Calculate total amount for all filtered orders ======
  const totalAmount = useMemo(() => {
    return filteredOrders.reduce((sum, order) => {
      return sum + (Number(order.totalAmount ?? order.total ?? 0));
    }, 0);
  }, [filteredOrders]);

  // ====== Stable callbacks ======
  const handlePrint = useCallback((order) => {
    if (!order) return;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    let address = order.shippingAddress || order.client || {};
    if (typeof address === 'string') {
      try { address = JSON.parse(address); } catch(e) { address = {}; }
    }

    const items = order.cartItems || order.items || [];
    const itemsList = items.map((item, index) => {
      let img = "";
      if (item.image) img = item.image;
      else if (item.imageUrl) img = item.imageUrl;
      else if (item.images && item.images.length) img = item.images[0];

      if (img && !img.startsWith('http') && !img.startsWith('data:')) {
        const cleanPath = img.replace(/\\/g, '/');
        img = `${backendUrl}${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`;
      }

      const name = item.name || item.productName || "-";
      const qty = Number(item.qty ?? item.quantity ?? 1);
      const weight = item.weight || item.selectedWeight || item.weightDisplay || "-";
      const unitPrice = Number(item.price ?? item.unitPrice ?? (item.total && qty ? item.total / qty : 0)) || 0;
      const lineTotal = (unitPrice * qty).toFixed(2);

      return `
        <tr>
          <td>${index + 1}</td>
          <td style="text-align: left; vertical-align: middle;">
            <div style="display: flex; align-items: center; gap: 15px;">
              ${img ? `<img src="${img}" alt="product" style="width:50px; height:50px; object-fit:contain; border:1px solid #eee; border-radius:4px;" />` : ''}
              <div>
                <strong style="color: #333; font-size: 14px;">${name}</strong>
                <div style="font-size: 11px; color: #777; margin-top: 4px;">Weight: ${weight}</div>
              </div>
            </div>
          </td>
          <td>${qty}</td>
          <td>₹${unitPrice.toFixed(2)}</td>
          <td>₹${lineTotal}</td>
        </tr>`;
    }).join("");

    const shipping = Number(order.shippingCharge || 0);
    const finalAmount = Number(order.totalAmount || order.total || 0);
    const subtotal = finalAmount - shipping;

    const orderDate = order.created_at || order.date;
    const displayDate = orderDate ? new Date(orderDate).toLocaleString('en-IN') : new Date().toLocaleString('en-IN');

    const printWindow = window.open("", "_blank", "width=850,height=750");
    if (!printWindow) return alert("Pop-ups must be allowed.");

    printWindow.document.write(`
    <html>
      <head>
        <title>Invoice ${order.orderId || order.id}</title>
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
          .logo img { max-width: 140px; }
          .invoice-title { text-align: right; }
          .invoice-title h1 { color: #2b5c92; font-size: 36px; font-weight: 800; margin: 0; letter-spacing: 1px; text-transform: uppercase; }
          .invoice-title p { font-size: 16px; color: #555; margin: 5px 0 0 0; font-weight: 600; }
          .divider { height: 4px; background-color: #2b5c92; margin-bottom: 40px; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .info-block { width: 48%; }
          .info-block h3 { font-size: 14px; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .info-block p { font-size: 13px; line-height: 1.6; margin: 4px 0; color: #444; }
          .info-block p strong { color: #222; }
          .status-badge { color: #2b5c92; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-left: 5px; }
          .manifest-title { font-size: 14px; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; font-weight: 700; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #e0e0e0; padding: 12px; text-align: center; font-size: 13px; }
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
            <img src="/images/Kavi_logo.png" alt="Kavi's Logo" />
          </div>
          <div class="invoice-title">
            <h1>INVOICE</h1>
            <p>${order.orderId || order.id}</p>
          </div>
        </div>
        <div class="divider"></div>

        <div class="info-section">
          <div class="info-block">
            <h3>Customer Info</h3>
            <p><strong>Name:</strong> ${order.clientName || order.fullname || order.client_name || address.fullname || "-"}</p>
            <p><strong>Email:</strong> ${order.email || address.email || "-"}</p>
            <p><strong>Phone:</strong> ${order.clientPhone || address.contact || "-"}</p>
            <p><strong>Address:</strong> ${(address.street ? address.street + ', ' : '')}${(address.city ? address.city + ', ' : '')}${(address.state || '')}${(address.zip ? ' - ' + address.zip : '')}</p>
            <p><strong>Country:</strong> ${address.country || "India"}</p>
          </div>
          <div class="info-block">
            <h3>Order Info</h3>
            <p><strong>Shop:</strong> Kavi's Dry Fruits</p>
            <p>Tirupattur,<br>Tamil Nadu, 635601<br>Ph: +91 94895 93504</p>
            <p style="margin-top:15px"><strong>Status:</strong> <span class="status-badge">${order.orderStatus || "DELIVERED"}</span></p>
            <p><strong>Payment:</strong> ${order.paymentMethod || order.paymentMode || "Online Payment"}</p>
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
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); printWindow.close(); }, 500);
  }, []);

  // Delete handler
  const handleDelete = useCallback(async (order) => {
    if (window.confirm(`Are you sure you want to delete order ${order.orderId}?`)) {
      try {
        await api.delete(`/orders/${order.id}`);
        setDeliveredOrders((prev) => prev.filter((o) => o.id !== order.id));
        alert("Order deleted successfully!");
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order");
      }
    }
  }, []);

  // small helper for row click (stable)
  const handleRowClick = useCallback((order) => setSelectedOrder(order), []);

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="p-4 sm:p-8  min-h-screen">
      <div className="relative z-20 mb-8">
      

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 uppercase">
          {/* Left: Search */}
          <div className="relative w-full lg:max-w-sm flex-1">
             <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Search by ID or Client..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all font-black text-slate-900 text-sm shadow-sm"
            />
          </div>
          
          {/* Right: Controls */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <CustomSelect
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-48"
              buttonClassName="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-black uppercase tracking-widest outline-none cursor-pointer shadow-sm hover:border-emerald-500/50 transition-colors"
              options={[
                { value: "all", label: "Full Record" },
                { value: "today", label: "Today's Batch" },
                { value: "week", label: "Weekly Review" },
                { value: "month", label: "Monthly Audit" },
                { value: "custom", label: "Selection Range" },
              ]}
            />

            <CustomSelect
              value={ordersPerPage}
              onChange={(e) => setOrdersPerPage(Number(e.target.value))}
              className="w-32"
              buttonClassName="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-black uppercase tracking-widest outline-none cursor-pointer shadow-sm hover:border-emerald-500/50 transition-colors"
              options={[
                { value: 25, label: "Show 25" },
                { value: 100, label: "Show 100" },
              ]}
            />

            <div className="flex items-center gap-1 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <button type="button" onClick={() => setViewMode("table")} className={`p-3 rounded-xl transition-all ${viewMode === "table" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-emerald-600"}`} aria-label="Table view" title="Table view"><FaThList /></button>
              <button type="button" onClick={() => setViewMode("card")} className={`p-3 rounded-xl transition-all ${viewMode === "card" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-emerald-600"}`} aria-label="Card view" title="Card view"><FaThLarge /></button>
            </div>
          </div>
        </div>
      </div>

      {filterType === "custom" && (
        <div className="mb-6 flex animate-in slide-in-from-top-4 duration-500">
           <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <input type="date" className="px-4 py-2 text-xs font-black outline-none" value={customFrom} onChange={e => setCustomFrom(e.target.value)} />
              <div className="w-4 h-0.5 bg-slate-200"></div>
              <input type="date" className="px-4 py-2 text-xs font-black outline-none" value={customTo} onChange={e => setCustomTo(e.target.value)} />
           </div>
        </div>
      )}

      {/* Revenue Summary Card */}
      {filteredOrders.length > 0 && (
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-[2rem] p-8 mb-8 shadow-2xl shadow-emerald-100 flex flex-col md:flex-row justify-between items-center text-white relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Total Collection</p>
            <h2 className="text-4xl font-black tracking-tighter">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
          </div>
          <div className="mt-6 md:mt-0 text-right">
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Batch Size</p>
            <p className="text-xl font-black">{filteredOrders.length} Confirmed Orders</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-700 text-left">
        {viewMode === "card" ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentOrders.length > 0 ? currentOrders.map((order, index) => (
              <article key={order.id} className="border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <button onClick={() => setSelectedOrder(order)} className="font-black text-indigo-600 hover:underline">#{order.orderId}</button>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-2">{order.orderStatus}</p>
                  </div>
                  <span className="text-xs font-black text-slate-500">#{(currentPage - 1) * ordersPerPage + index + 1}</span>
                </div>
                <div className="mt-6 space-y-3 text-sm">
                  <p className="font-black text-slate-800">{order.clientName || order.fullname || order.shippingAddress?.fullname || "Guest"}</p>
                  <p className="text-xs font-bold text-slate-500">{formatDate(order.date)}</p>
                  <p className="text-xl font-black text-emerald-600">₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-[9px] font-black uppercase">{order.paymentMethod || order.paymentMode || "-"}</span>
                    <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-xl text-[9px] font-black uppercase">{order.customerType || "Online"}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-6 pt-4 border-t border-slate-100">
                  <button onClick={() => handlePrint(order)} className="flex-1 py-3 bg-slate-50 text-slate-500 rounded-xl hover:text-emerald-600 font-black text-[10px] uppercase">Print</button>
                  <button onClick={() => handleDelete(order)} className="flex-1 py-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white font-black text-[10px] uppercase">Delete</button>
                </div>
              </article>
            )) : <div className="md:col-span-2 xl:col-span-3 py-20 text-center text-slate-400 font-black uppercase tracking-widest">No delivered orders to display</div>}
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#009669]  text-white">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">S.No</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Client Name</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Payment Method</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Channel</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentOrders.length > 0 ? (
                currentOrders.map((order, index) => (
                  <tr key={order.id} className="group hover:bg-slate-50/70 transition-colors">
                    <td className="px-8 py-6 font-black text-slate-800 text-xs">
                       {(currentPage - 1) * ordersPerPage + index + 1}
                    </td>
                    <td className="px-8 py-6">
                       <button onClick={() => setSelectedOrder(order)} className="font-black text-indigo-600 text-sm block mb-1 hover:underline">#{order.orderId}</button>
                       {order.docketNumber && (
                         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-md border border-emerald-100">
                           Docket: {order.docketNumber}
                         </p>
                       )}
                    </td>
                    <td className="px-8 py-6 uppercase">
                      <p className="font-black text-slate-800 text-sm leading-tight mb-1">{order.clientName || order.fullname || order.shippingAddress?.fullname || "Guest"}</p>
                      <p className="text-[10px] font-black text-emerald-500 tracking-widest">{order.orderStatus}</p>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-xs font-black text-slate-500">{formatDate(order.date)}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <p className="text-base font-black text-emerald-600 tracking-tighter">₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
                    </td>
                      <td className="px-8 py-6 text-center">
                        <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-xl text-[9px] font-black text-emerald-700 uppercase tracking-widest">
                         {order.paymentMethod || order.paymentMode || "-"}
                        </span>
                      </td>
                    <td className="px-8 py-6 text-center">
                       <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest">
                         {order.customerType || "Online"}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center gap-3">
                        <button onClick={(e) => { e.stopPropagation(); handlePrint(order); }} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all border border-slate-100 shadow-sm"><FaPrint /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(order); }} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all border border-slate-100 shadow-sm"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-8 py-32 text-center text-slate-400 font-black uppercase tracking-[0.2em]">
                    <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                       <FaPrint className="text-3xl opacity-20" />
                    </div>
                    No delivered orders to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Showing {Math.min(filteredOrders.length, (currentPage - 1) * ordersPerPage + 1)}-{Math.min(filteredOrders.length, currentPage * ordersPerPage)} of {filteredOrders.length} Logs
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-emerald-50 hover:text-emerald-600 shadow-sm"}`}
              >
                <span className="text-xs">←</span>
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pg = i + 1;
                  if (pg === 1 || pg === totalPages || (pg >= currentPage - 1 && pg <= currentPage + 1)) {
                    return (
                      <button
                        key={pg}
                        onClick={() => setCurrentPage(pg)}
                        className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === pg ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:bg-white hover:text-slate-600 border border-transparent hover:border-slate-200"}`}
                      >
                        {pg}
                      </button>
                    );
                  } else if (pg === currentPage - 2 || pg === currentPage + 2) {
                    return <span key={pg} className="px-1 text-slate-300">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "hover:bg-emerald-50 hover:text-emerald-600 shadow-sm"}`}
              >
                <span className="text-xs">→</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Re-using shared modal from OrderDetailsModal.jsx if possible, 
          but as it stands we'll keep the specialized one or link to the common one */}
      {selectedOrder && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden p-10 animate-in zoom-in duration-500" onClick={e => e.stopPropagation()}>
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Receipt Details</h3>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mt-1">Confirmed Delivery Log</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-400 text-xl hover:text-slate-900 transition-colors">✕</button>
               </div>
               
               <div className="space-y-6 mb-10 text-left">
                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Recipient Information</p>
                     <p className="text-lg font-black text-slate-800">{selectedOrder.clientName || selectedOrder.fullname || "Guest Transaction"}</p>
                     <p className="text-xs font-black text-slate-400 mt-1">{(selectedOrder.shippingAddress?.street + ', ' + selectedOrder.shippingAddress?.city) || "Store Pickup"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Order Amount</p>
                        <p className="text-xl font-black text-emerald-600">₹{Number(selectedOrder.totalAmount).toLocaleString('en-IN')}</p>
                     </div>
                     <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Processing Date</p>
                        <p className="text-xl font-black text-slate-800">{formatDate(selectedOrder.date)}</p>
                     </div>
                  </div>
               </div>
               
               <div className="flex gap-4">
                  <button onClick={() => handlePrint(selectedOrder)} className="flex-1 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">Print Duplicate Receipt</button>
                  <button onClick={() => setSelectedOrder(null)} className="px-8 py-5 bg-slate-50 text-slate-600 rounded-[1.5rem] font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all">Return to List</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Delivery;
