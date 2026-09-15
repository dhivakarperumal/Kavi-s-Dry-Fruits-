import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { FaPrint, FaEye, FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";
import logo from "/images/Kavi_logo.png";
import OrderDetailsModal from "./OrderDetailsModal";
import { useNavigate } from "react-router-dom";

const AllOrders = ({ adminData }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelInput, setShowCancelInput] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // modal state for order details
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("table"); // "table" or "card"
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch all orders from all users
  const fetchOrders = async (forceApi = false) => {
    // Use the admin snapshot for the initial render, but fetch fresh data after a mutation.
    if (!forceApi && adminData && adminData.allOrders && adminData.allOrders.length > 0) {
      const parsedOrders = adminData.allOrders.map(o => ({
        ...o,
        items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []),
        shippingAddress: typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : (o.shippingAddress || {}),
        date: o.created_at || o.date
      }));
      setOrders(parsedOrders);
      return;
    }

    try {
      const res = await api.get("/orders");
      const parsedOrders = (res.data || []).map(o => ({
        ...o,
        items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []),
        shippingAddress: typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : (o.shippingAddress || {}),
        date: o.created_at || o.date
      }));
      setOrders(parsedOrders);
    } catch (error) {
      console.error("fetchOrders error:", error);
      toast.error("Failed to load all orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [adminData]);

  // Apply filters
  useEffect(() => {
    let temp = [...orders];

    if (searchText.trim()) {
      temp = temp.filter(
        (o) =>
          (o.orderId || "").toLowerCase().includes(searchText.toLowerCase()) ||
          (o.clientName || "").toLowerCase().includes(searchText.toLowerCase()) ||
          (o.clientPhone || "").toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const now = new Date();

    if (dateFilter === "Today") {
      temp = temp.filter(
        (o) => new Date(o.date).toDateString() === now.toDateString()
      );
    } else if (dateFilter === "This Week") {
      const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
      temp = temp.filter((o) => new Date(o.date) >= firstDay);
    } else if (dateFilter === "This Month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      temp = temp.filter((o) => new Date(o.date) >= firstDay);
    } else if (dateFilter === "Custom" && customRange.from && customRange.to) {
      const fromDate = new Date(customRange.from);
      const toDate = new Date(customRange.to);
      temp = temp.filter(
        (o) => new Date(o.date) >= fromDate && new Date(o.date) <= toDate
      );
    }

    if (statusFilter !== "All") {
      temp = temp.filter((o) => o.orderStatus === statusFilter);
    }

    setFilteredOrders(temp);
    setCurrentPage(1);
  }, [orders, searchText, dateFilter, customRange, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const generateDocketNumber = () => {
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
    return `AA${randomDigits}IN`;
  };

  // Status Update Logic
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const data = { orderStatus: newStatus };
      if (newStatus === "Shipped") {
        data.docketNumber = generateDocketNumber();
      }

      await api.put(`/orders/${id}`, data);
      setOrders((currentOrders) => currentOrders.map((order) => (
        order.id === id
          ? { ...order, orderStatus: newStatus, ...(data.docketNumber ? { docketNumber: data.docketNumber } : {}) }
          : order
      )));
      toast.success(newStatus === "Shipped" ? `Order Shipped! Docket: ${data.docketNumber}` : "Status updated!");
      await fetchOrders(true);
      setCancelReason("");
      setShowCancelInput(null);
    } catch (err) {
      console.error(err);
      toast.error("Status update failed!");
    }
  };

  // Filtered status options
  const getStatusOptions = (current) => {
    const all = [
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

    if (current === "Delivered") return ["Delivered", "Returned"];
    if (current === "Cancelled") return ["Cancelled"];
    if (current === "Returned") return ["Returned", "Refunded"];
    if (current === "Refunded") return ["Refunded"];

    const currentIndex = all.indexOf(current);
    if (currentIndex === -1) return all;

    let options = all.slice(currentIndex);

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

  // Print Invoice
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
    
    const orderDate = (order.deliveryDate || order.created_at || order.date);
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
            <img src="${logo}" alt="Kavi's Logo" />
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
            <p><strong>Name:</strong> ${order.clientName || order.fullname || order.client_name || order.client?.name || address.fullname || "-"}</p>
            <p><strong>Email:</strong> ${order.email || address.email || "-"}</p>
            <p><strong>Phone:</strong> ${order.clientPhone || address.contact || "-"}</p>
            <p><strong>Address:</strong> ${(address.street ? address.street + ', ' : '')}${(address.city ? address.city + ', ' : '')}${(address.state || '')}${(address.zip ? ' - ' + address.zip : '')}</p>
            <p><strong>Country:</strong> ${address.country || "India"}</p>
          </div>
          <div class="info-block">
            <h3>Order Info</h3>
            <p><strong>Shop:</strong> Kavi's Dry Fruits</p>
            <p>Tirupattur,<br>Tamil Nadu, 635601<br>Ph: +91 94895 93504</p>
            <p style="margin-top:15px"><strong>Status:</strong> <span class="status-badge">${order.orderStatus || "ORDER PLACED"}</span></p>
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

  return (
    <div className="p-4 sm:p-8  min-h-screen">
      <div className="mb-8">
       

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Search */}
          <div className="relative w-full lg:max-w-sm flex-1">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Search by Order ID or Client..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all font-black text-slate-900 text-sm shadow-sm"
            />
          </div>
          
          {/* Right: Controls */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-widest outline-none cursor-pointer shadow-sm hover:border-indigo-200 transition-colors"
            >
              <option value="All">All</option>
              <option value="Today">Today's Log</option>
              <option value="This Week">Weekly View</option>
              <option value="This Month">Monthly View</option>
              <option value="Custom">Custom Range</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-widest outline-none cursor-pointer shadow-sm hover:border-indigo-200 transition-colors"
            >
              <option value="All">All Status</option>
              <option value="Order Placed">Placed</option>
              <option value="Order Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
              <option value="Refunded">Refunded</option>
            </select>

      
            
            <div className="flex bg-slate-100 p-1.5 rounded-2xl ">
              <button 
                onClick={() => setViewMode("table")} 
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "table" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                Table
              </button>
              <button 
                onClick={() => setViewMode("card")} 
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "card" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>
      </div>

      {dateFilter === "Custom" && (
        <div className="mb-6 flex gap-4 animate-in slide-in-from-top-4 duration-500">
           <input type="date" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black" value={customRange.from} onChange={e => setCustomRange({...customRange, from: e.target.value})} />
           <input type="date" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black" value={customRange.to} onChange={e => setCustomRange({...customRange, to: e.target.value})} />
        </div>
      )}

      {viewMode === "table" ? (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#009669]  text-white">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">S.No</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Order Details</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Client Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Payment</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Revenue</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">State</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Actions</th>
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
                         <button onClick={() => setSelectedOrder(order)} className="font-black text-indigo-600 text-sm block mb-1 hover:underline decoration-2">#{order.orderId}</button>
                         {order.docketNumber && (
                           <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-md border border-emerald-100">
                             Docket: {order.docketNumber}
                           </p>
                         )}
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                           {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                         </p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-800 text-sm leading-tight mb-1">{order.clientName || order.fullname || order.shippingAddress?.fullname || "Guest"}</p>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{order.shippingAddress?.city || "Local Order"}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          {order.paymentMethod || "COD"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <p className="text-base font-black text-emerald-600 tracking-tighter">₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v === "Cancelled") setShowCancelInput(order.id);
                            else handleStatusUpdate(order.id, v);
                          }}
                          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer outline-none ${
                            order.orderStatus === 'Order Placed' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                            order.orderStatus === 'Delivered' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                            'bg-slate-50 border-slate-100 text-slate-600'}`}
                        >
                          {getStatusOptions(order.orderStatus).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {showCancelInput === order.id && (
                           <div className="mt-2 flex flex-col gap-2">
                              <textarea className="w-full text-xs p-2 border border-rose-100 rounded-xl bg-rose-50" placeholder="Reason..." onChange={e => setCancelReason(e.target.value)} />
                              <button onClick={() => handleStatusUpdate(order.id, "Cancelled")} className="bg-rose-500 text-white text-[9px] font-black uppercase py-2 rounded-lg tracking-widest shadow-lg shadow-rose-100">Confirm Cancel</button>
                           </div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => setSelectedOrder(order)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-slate-100 shadow-sm"><FaEye /></button>
                          <button onClick={() => handlePrint(order)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all border border-slate-100 shadow-sm"><FaPrint /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-8 py-32 text-center text-slate-400 font-black uppercase tracking-[0.2em]">
                      <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                         <FaPrint className="text-3xl opacity-20" />
                      </div>
                      No archived orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 hover:shadow-2xl hover:shadow-indigo-100 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest mb-2 inline-block ${
                      order.orderStatus === 'Order Placed' ? 'bg-indigo-50 text-indigo-500' :
                      order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-500' :
                      'bg-slate-50 text-slate-500'
                    }`}>{order.orderStatus}</span>
                    <h3 onClick={() => setSelectedOrder(order)} className="text-xl font-black text-slate-900 tracking-tighter cursor-pointer hover:text-indigo-600 transition-colors">#{order.orderId}</h3>
                    {order.docketNumber && (
                      <p className="text-[9px] font-black text-emerald-600 uppercase mt-1 bg-emerald-50/50 w-fit px-2 py-0.5 rounded-md">Docket: {order.docketNumber}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedOrder(order)} className="w-10 h-10 bg-slate-50 text-slate-300 border border-slate-100 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                      <FaEye size={16} />
                    </button>
                    <button onClick={() => handlePrint(order)} className="w-10 h-10 bg-slate-50 text-slate-300 border border-slate-100 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                      <FaPrint size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</p>
                    <p className="text-sm font-black text-slate-800 uppercase">{order.clientName || order.fullname || "Guest"}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</p>
                    <p className="text-lg font-black text-emerald-600 tracking-tighter">₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment</p>
                    <p className="text-[10px] font-black text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{order.paymentMethod || "COD"}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "Cancelled") setShowCancelInput(order.id);
                      else handleStatusUpdate(order.id, v);
                    }}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-xs font-black uppercase tracking-widest text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
                  >
                    {getStatusOptions(order.orderStatus).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  
                  {showCancelInput === order.id && (
                    <div className="mt-4 animate-in slide-in-from-top-2">
                       <textarea className="w-full text-xs p-3 border border-rose-100 rounded-2xl bg-rose-50 mb-2" placeholder="Cancellation reason..." onChange={e => setCancelReason(e.target.value)} />
                       <button onClick={() => handleStatusUpdate(order.id, "Cancelled")} className="w-full bg-rose-500 text-white text-[10px] font-black uppercase py-3 rounded-xl tracking-widest shadow-xl shadow-rose-100">Cancel Order</button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center text-slate-400 font-black uppercase tracking-[0.2em] bg-white rounded-[3rem] border border-slate-200">
               No orders found for this selection
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing {Math.min(filteredOrders.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredOrders.length, currentPage * itemsPerPage)} of {filteredOrders.length} Logs
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"}`}
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
                        className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === pg ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-white hover:text-slate-600 border border-transparent hover:border-slate-200"}`}
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
                className={`w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"}`}
              >
                <span className="text-xs">→</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onPrint={(o) => handlePrint(o)}
      />
    </div>
  );
};

export default AllOrders;
