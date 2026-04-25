import React, { useEffect, useState, useCallback } from "react";
import { FaPrint, FaTable, FaThLarge, FaSearch, FaChevronRight, FaClock, FaBox, FaUser, FaMoneyBillWave } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logo from "/images/Kavi_logo.png";
import OrderDetailsModal from "./OrderDetailsModal";
import api from "../../services/api";

const NewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("Today");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelInput, setShowCancelInput] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" or "card"
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      const parsed = (res.data || []).filter(o => 
        o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled" && o.orderStatus !== "Returned" && o.orderStatus !== "Refunded"
      ).map(o => ({
        ...o,
        cartItems: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []),
        shippingAddress: typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : (o.shippingAddress || {}),
        date: o.created_at || o.date
      }));
      setOrders(parsed.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error("fetchOrders error:", error);
      toast.error("Failed to load new orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, []);

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
  }, [orders, searchText, dateFilter, customRange]);

  const currentOrders = filteredOrders.slice(0, itemsPerPage);

  const handleStatusUpdate = async (id, newStatus) => {
    if (!newStatus) return;
    try {
      const data = { orderStatus: newStatus };
      if (newStatus === "Cancelled") {
        if (!cancelReason.trim()) return toast.error("Please enter cancel reason");
        data.cancelReason = cancelReason;
      }
      await api.put(`/orders/${id}`, data);
      toast.success(`Order ${newStatus} successfully!`);
      setCancelReason("");
      setShowCancelInput(null);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update status!");
    }
  };

  const handlePrint = useCallback((order) => {
    if (!order) return;
    const address = order.shippingAddress || order.client || {};
    const items = order.cartItems || order.items || [];
    const itemsList = items.map((item) => {
      const name = item.name || item.productName || "-";
      const qty = Number(item.qty ?? item.quantity ?? 1);
      const weight = item.weight || item.selectedWeight || item.weightDisplay || "-";
      const unitPrice = Number(item.price ?? item.unitPrice ?? (item.total && qty ? item.total / qty : 0)) || 0;
      const lineTotal = (unitPrice * qty).toFixed(2);
      const gst = Number(item.gst ?? 0).toFixed(2);
      return `<tr><td>${name}</td><td>${qty}</td><td>${weight}</td><td>₹${gst}</td><td>₹${lineTotal}</td></tr>`;
    }).join("");

    const deliveryDate = new Date(order.date).toLocaleString('en-IN');
    const printWindow = window.open("", "_blank");
    if (!printWindow) return alert("Pop-ups must be allowed.");

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${order.orderId}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 40px; }
            .logo { max-width: 120px; display: block; margin: 0 auto 20px; }
            h2 { text-align: center; color: #10b981; margin-bottom: 30px; }
            .info { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 30px; }
            .info div { flex: 1; min-width: 200px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: center; }
            th { background: #f8fafc; font-weight: 700; }
            .summary { margin-top: 30px; text-align: right; }
            .summary p { margin: 5px 0; font-size: 14px; }
            .total { font-size: 18px; font-weight: 900; color: #10b981; }
          </style>
        </head>
        <body>
          <img src="${logo}" class="logo" />
          <p style="text-align: right; font-size: 10px;">${deliveryDate}</p>
          <h2>KAVI'S DRY FRUITS</h2>
          <div class="info">
            <div>
              <p><strong>Order ID:</strong> ${order.orderId}</p>
              <p><strong>Name:</strong> ${order.clientName || address.fullname || "-"}</p>
              <p><strong>Phone:</strong> ${order.clientPhone || address.contact || "-"}</p>
            </div>
            <div>
              <p><strong>Payment:</strong> ${order.paymentMethod || "-"}</p>
              <p><strong>Address:</strong> ${(address.street ? address.street + ', ' : '')}${(address.city ? address.city + ', ' : '')}${(address.state || '')}${(address.zip ? ' - ' + address.zip : '')}</p>
            </div>
          </div>
          <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Weight</th><th>GST</th><th>Total</th></tr></thead>
            <tbody>${itemsList}</tbody>
          </table>
          <div class="summary">
            <p>GST Total: ₹${Number(order.gstAmount || 0).toFixed(2)}</p>
            <p>Shipping: ₹${Number(order.shippingCharge || 0).toFixed(2)}</p>
            <p class="total">Final Total: ₹${Number(order.totalAmount || 0).toFixed(2)}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); }, 500);
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

  return (
    <div className="p-4 sm:p-8  min-h-screen">
      {/* Header & Controls */}
      <div className="mb-8">
      

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
            <div className="bg-white p-1 rounded-2xl border border-slate-200 flex items-center shadow-sm">
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === "table" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
              >
                <FaTable /> Table
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === "card" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
              >
                <FaThLarge /> Cards
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Bar */}
      <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-wrap items-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Filter By Date</span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-black outline-none cursor-pointer"
          >
            <option value="All">All Time</option>
            <option value="Today">Today Only</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="Custom">Custom Range</option>
          </select>
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
           <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-black outline-none cursor-pointer"
          >
            {[25, 50, 100, 250].map(n => <option key={n} value={n}>Show {n}</option>)}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-700">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#009669] border-b border-emerald-700 text-white">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">S.No</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Order Details</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Client</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Status Flow</th>
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
                      <button onClick={() => setSelectedOrder(order)} className="text-indigo-600 font-black text-sm hover:underline block mb-1">#{order.orderId}</button>
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
                         <select
                          value={order.orderStatus}
                          onChange={(e) => e.target.value === "Cancelled" ? setShowCancelInput(order.id) : handleStatusUpdate(order.id, e.target.value)}
                          className={`w-40 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all cursor-pointer ${
                            order.orderStatus === 'Order Placed' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 
                            order.orderStatus === 'Order Confirmed' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                            'bg-amber-50 border-amber-100 text-amber-700'}`}
                        >
                          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
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
                  <select
                    value={order.orderStatus}
                    onChange={(e) => e.target.value === "Cancelled" ? setShowCancelInput(order.id) : handleStatusUpdate(order.id, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-xs font-black uppercase tracking-widest text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
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

      {/* Detail Modal */}
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onPrint={handlePrint} />
    </div>
  );
};

export default NewOrders;
