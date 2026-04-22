import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FaPrint, FaTrash, FaSearch } from "react-icons/fa";
import logo from "/images/Kavi_logo.png";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Delivery = () => {
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [ordersPerPage, setOrdersPerPage] = useState(25);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ========== Fetch Delivered Orders From MySQL ==========
  const fetchDeliveredOrders = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

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

  // ====== Display limited orders based on selected count ======
  const currentOrders = useMemo(() => {
    return filteredOrders.slice(0, ordersPerPage);
  }, [filteredOrders, ordersPerPage]);

  // ====== Calculate total amount for all filtered orders ======
  const totalAmount = useMemo(() => {
    return filteredOrders.reduce((sum, order) => {
      return sum + (Number(order.totalAmount ?? order.total ?? 0));
    }, 0);
  }, [filteredOrders]);

  // ====== Stable callbacks ======
  const handlePrint = useCallback((order) => {
    if (!order) return;

    const address = order.shippingAddress || order.client || {};
    const items = order.cartItems || order.items || [];

    const itemsList = items
      .map((item) => {
        const S_no = items.indexOf(item) + 1;
        const name = item.name || item.productName || "-";
        const qty = Number(item.qty ?? item.quantity ?? 1);
        const weight = item.weight || item.selectedWeight || item.weightDisplay || "-";
        const unitPrice =
          Number(item.price ?? item.unitPrice ?? (item.total && qty ? item.total / qty : 0)) || 0;
        const lineTotal = (unitPrice * qty).toFixed(2);
        const gst = Number(item.gst ?? 0).toFixed(2);
        return `
      <tr>
        <td>${S_no}</td>
        <td>${name}</td>
        <td>${weight}</td>
        <td>₹${unitPrice.toFixed(2)}</td>
        <td>${qty}</td>
        <td>₹${lineTotal}</td>
        </tr>`;
      })
      .join("");

    const gstTotal = Number(order.gstAmount ?? 0);
    const shipping = Number(order.shippingCharge ?? 0);
    const finalAmount = Number(order.totalAmount ?? order.total ?? 0);
    const deliveryDate = new Date(order.deliveryDate || order.date).toLocaleString();

    const printWindow = window.open("", "_blank", "width=900,height=800");
    if (!printWindow) return alert("Please allow pop-ups to print the invoice.");

    const htmlContent = `
      <html>
        <head>
          <title>Invoice ${order.orderId || order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #000; }
            h2 { text-align: center; margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 35px; }
            th, td { border: 2px solid #3a3838ff; padding: 8px; text-align: center; font-size: 13px; }
            th { background-color: #f6f6f6; }
            .summary { margin-top: 12px; font-size: 14px;float: right; text-align: right; }
            .note { margin-top: 24px; font-style: italic; color: #555; text-align: center;position: fixed; bottom: 20px; width: 90%; }
            .info p { margin: 4px 0; font-size: 14px; line-height: 1.6; }
            .top-header { text-align: right; font-size: 12px; margin-bottom: 6px; }
            img.logo { max-width: 140px; display: block; margin: 0 auto 8px; }
          </style>
        </head>
        <body>
         <div class="top-header">Billing Date: ${deliveryDate}</div>
          <img src="${logo}" alt="Logo" class="logo" />
         
          <h2>Kavi's Dry Fruits</h2>
          <div class="info">
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Client Name:</strong> ${order.clientName || order.fullname || order.client_name || order.client?.name || address.fullname || "-"}</p>
          <p><strong>Phone:</strong> ${order.clientPhone || address.contact || "-"}</p>
          <p><strong>Email:</strong> ${order.email || address.email || "-"}</p>
          <p><strong>Payment Mode:</strong> ${order.paymentMethod || order.paymentMode || "-"}</p>
          <p><strong>Address:</strong> ${(address.street ? address.street + ', ' : '')}${(address.city ? address.city + ', ' : '')}${(address.state || '')}${(address.zip ? ' - ' + address.zip : '')}</p>
        </div>
          <table>
            <thead>
              <tr>
              <th>S.No</th>
                <th>Product Name</th>                
                <th>Weight</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          <div class="summary">
            <p><strong>GST Total:</strong> ₹${gstTotal.toFixed(2)}</p>
            <p><strong>Shipping Charge:</strong> ₹${shipping.toFixed(2)}</p>
            <p><strong>Final Amount:</strong> ₹${finalAmount.toFixed(2)}</p>
          </div>
          <div class="note">Thank you for shopping at Kavi's Dry Fruits!
We truly appreciate your trust in us. Enjoy your purchase, and we look forward to serving you again!</div>
        </body>
      </html>`;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
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
      <div className="mb-8">
      

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
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-widest outline-none cursor-pointer shadow-sm hover:border-emerald-200 transition-colors"
            >
              <option value="all">Full Record</option>
              <option value="today">Today's Batch</option>
              <option value="week">Weekly Review</option>
              <option value="month">Monthly Audit</option>
              <option value="custom">Selection Range</option>
            </select>

            <select
              value={ordersPerPage}
              onChange={(e) => setOrdersPerPage(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-widest outline-none cursor-pointer shadow-sm hover:border-emerald-200 transition-colors"
            >
              <option value={25}>Show 25</option>
              <option value={100}>Show 100</option>
            </select>
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

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-700 text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#009669] border-b border-emerald-700 text-white">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">S.No</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Client Name</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Channel</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentOrders.length > 0 ? (
                currentOrders.map((order, index) => (
                  <tr key={order.id} className="group hover:bg-slate-50/70 transition-colors">
                    <td className="px-8 py-6 font-black text-slate-800 text-xs">
                       {index + 1}
                    </td>
                    <td className="px-8 py-6">
                       <button onClick={() => setSelectedOrder(order)} className="font-black text-indigo-600 text-sm block mb-1 hover:underline">#{order.orderId}</button>
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
                  <td colSpan="7" className="px-8 py-32 text-center text-slate-400 font-black uppercase tracking-[0.2em]">
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
