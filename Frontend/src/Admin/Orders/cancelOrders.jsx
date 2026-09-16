import CustomSelect from "../Common/CustomSelect";
import React, { useEffect, useState } from "react";
import { FaTimes, FaSearch, FaThLarge, FaThList, FaBan, FaRupeeSign, FaTimesCircle, FaPrint } from "react-icons/fa";
import api from "../../services/api";
import logo from "/images/Kavi_logo.png";

const CancelOrders = () => {
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    fetchCancelledOrders();
  }, []);

  const fetchCancelledOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      const data = (res.data || [])
        .filter(o => o.orderStatus === "Cancelled")
        .map(o => ({
          ...o,
          cartItems: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []),
          shippingAddress: typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : (o.shippingAddress || {}),
          paymentMethod: o.paymentMode || o.paymentMethod || "-",
          date: o.created_at || o.date
        }));
      setCancelledOrders(data);
    } catch (error) {
      console.error("Error fetching cancelled orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Date Filtering Helper ---
  const filterByDate = (orderDate) => {
    const date = new Date(orderDate);
    const today = new Date();

    if (filterType === "today") {
      return date.toDateString() === today.toDateString();
    }
    if (filterType === "week") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return date >= startOfWeek && date <= endOfWeek;
    }
    if (filterType === "month") {
      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }
    if (filterType === "custom" && customFrom && customTo) {
      return date >= new Date(customFrom) && date <= new Date(customTo);
    }
    return true; // all
  };

  // --- Apply Search & Filters ---
  const filteredOrders = cancelledOrders
    .filter((order) => filterByDate(order.date))
    .filter((order) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        order.orderId?.toLowerCase().includes(term) ||
        order.uid?.toLowerCase().includes(term) ||
        order.shippingAddress?.fullname?.toLowerCase().includes(term)
      );
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, ordersPerPage]);

  // --- Pagination ---
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePrint = (order) => {
    const address = typeof order.shippingAddress === "string" ? JSON.parse(order.shippingAddress || "{}") : (order.shippingAddress || {});
    const items = order.cartItems || order.items || [];
    const itemsList = items.map((item, index) => {
      const qty = Number(item.qty ?? item.quantity ?? 1);
      const price = Number(item.price ?? item.unitPrice ?? 0) || 0;
      return `<tr><td>${index + 1}</td><td>${item.name || item.productName || "-"}</td><td>${item.weight || item.selectedWeight || "-"}</td><td>₹${price.toFixed(2)}</td><td>${qty}</td><td>₹${(price * qty).toFixed(2)}</td></tr>`;
    }).join("");
    const shipping = Number(order.shippingCharge || 0);
    const finalAmount = Number(order.totalAmount || order.total || 0);
    const displayDate = order.date ? new Date(order.date).toLocaleString("en-IN") : new Date().toLocaleString("en-IN");
    const printWindow = window.open("", "_blank", "width=850,height=750");
    if (!printWindow) return alert("Pop-ups must be allowed.");

    printWindow.document.write(`<!DOCTYPE html><html><head><title></title><style>
      @page { size: A4; margin: 0; }
      body { font-family: Inter, Arial, sans-serif; padding: 15mm; color: #333; max-width: 800px; margin: 0 auto; }
      .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:0; }
      .logo { margin-top:3px; } .logo img { max-width:140px; }
      .invoice-title { text-align:right; } .invoice-title h1 { color:#2b5c92; font-size:36px; font-weight:800; margin:0; text-transform:uppercase; }
      .invoice-title p { font-size:16px; color:#555; margin:5px 0 0; font-weight:600; }
      .invoice-date { font-size:11px; color:#666; margin-top:8px; }
      .divider { height:4px; background:#2b5c92; margin-bottom:40px; }
      .info-section { display:flex; justify-content:space-between; margin-bottom:40px; } .info-block { width:48%; }
      .info-block h3 { font-size:14px; color:#555; text-transform:uppercase; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:5px; }
      .info-block p { font-size:13px; line-height:1.6; margin:4px 0; } .info-block p strong { color:#222; }
      .manifest-title { font-size:14px; color:#555; text-transform:uppercase; margin-bottom:15px; font-weight:700; }
      table { width:100%; border-collapse:collapse; border-spacing:0; margin-bottom:5px; } th,td { border:1px solid #333; padding:8px 12px; text-align:center; font-size:13px; } th { background:#fcfcfc; font-weight:700; }
      .summary-section { display:flex; justify-content:flex-end; margin-bottom:50px; } .summary-table { width:300px; } .summary-table div { display:flex; justify-content:space-between; padding:8px 0; font-size:14px; } .total { font-size:18px; font-weight:800; border-top:2px solid #eee; padding-top:12px; margin-top:4px; } .total-val { color:#2b5c92; }
      .footer { text-align:center; border-top:1px solid #eee; padding-top:20px; } .footer p { font-size:12px; color:#666; margin:5px 0; } @media print { body { padding:0; } }
    </style></head><body><div class="header"><div class="logo"><img src="${logo}" alt="Kavi's Logo" /></div><div class="invoice-title"><h1>INVOICE</h1><p>${order.orderId || order.id}</p><div class="invoice-date">${displayDate}</div></div></div><div class="divider"></div>
      <div class="info-section"><div class="info-block"><h3>Customer Info</h3><p><strong>Name:</strong> ${order.clientName || address.fullname || "-"}</p><p><strong>Email:</strong> ${order.email || address.email || "-"}</p><p><strong>Phone:</strong> ${order.clientPhone || address.contact || "-"}</p><p><strong>Address:</strong> ${address.street || address.city || address.state || "-"}</p><p><strong>Country:</strong> ${address.country || "India"}</p></div><div class="info-block"><h3>Order Info</h3><p><strong>Shop:</strong> Kavi's Dry Fruits</p><p>Tirupattur,<br>Tamil Nadu, 635601<br>Ph: +91 94895 93504</p></div></div>
      <div class="manifest-title">Item Manifest</div><table><thead><tr><th style="width:8%">S.No</th><th style="width:34%">Product Name</th><th style="width:16%">Weight</th><th style="width:16%">Price</th><th style="width:10%">Qty</th><th style="width:16%">Total</th></tr></thead><tbody>${itemsList}</tbody></table>
      <div class="summary-section"><div class="summary-table"><div><span>Subtotal:</span><strong>₹${(finalAmount - shipping).toFixed(2)}</strong></div><div><span>Shipping:</span><strong>₹${shipping.toFixed(2)}</strong></div><div class="total"><span>Total Amount:</span><span class="total-val">₹${finalAmount.toFixed(2)}</span></div></div></div><div class="footer"><p><strong>Thank you for shopping with Kavi's Dry Fruits!</strong></p><p>For any support, please contact us at kavidryfruits@gmail.com</p></div></body></html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); printWindow.close(); }, 500);
  };

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen">
      {/* Cancelled Orders Stats Cards (Dealer Reference Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Voided Card */}
        <div className="group relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-emerald-500/40 bg-gradient-to-br from-emerald-400 to-emerald-600">
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-150"></div>
          <div className="absolute -top-10 -right-4 w-28 h-28 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-125"></div>

          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-white/80 font-black text-[10px] tracking-widest uppercase mb-2">Total Voided Orders</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">
                {cancelledOrders.length}
              </h3>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner backdrop-blur-md border border-white/20 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 bg-white/20">
              <FaBan />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6 relative z-10">
            <span className="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Recorded Cancelled Purchases</span>
          </div>
        </div>

        {/* Voided Volume Card */}
        <div className="group relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-indigo-500/40 bg-gradient-to-br from-indigo-500 to-indigo-700">
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-150"></div>
          <div className="absolute -top-10 -right-4 w-28 h-28 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-125"></div>

          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-white/80 font-black text-[10px] tracking-widest uppercase mb-2">Unrealized Gross Value</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">
                ₹{Math.round(cancelledOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0)).toLocaleString()}
              </h3>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner backdrop-blur-md border border-white/20 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 bg-white/20">
              <FaRupeeSign />
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 relative z-10 text-white/50 text-[10px] font-black uppercase tracking-widest italic font-mono">
            Cancelled & Aborted Purchases
          </div>
        </div>

        {/* Filtered Display Card */}
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
              <FaTimesCircle />
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 relative z-10">
            <span className="flex h-2 w-2 rounded-full bg-white animate-bounce"></span>
            <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">{filteredOrders.length} Cancelled in Current Filter</span>
          </div>
        </div>
      </div>

      <div className="relative z-20 mb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-[900] text-slate-900 tracking-tight">Voided Orders</h1>
          <p className="text-sm font-bold text-slate-400 mt-1">Reviewing {filteredOrders.length} cancelled transactions</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 uppercase">
          {/* Left: Search */}
          <div className="relative w-full lg:max-w-sm flex-1">
             <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all font-black text-slate-900 text-sm shadow-sm"
            />
          </div>
          
          {/* Right: Controls */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <CustomSelect
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-48"
              buttonClassName="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-black uppercase tracking-widest outline-none cursor-pointer shadow-sm hover:border-rose-300 transition-colors"
              options={[
                { value: "all", label: "Full Log" },
                { value: "today", label: "Today's Voids" },
                { value: "week", label: "Weekly Review" },
                { value: "month", label: "Monthly Audit" },
                { value: "custom", label: "Custom Filter" },
              ]}
            />
            
            <CustomSelect
              value={ordersPerPage}
              onChange={(e) => setOrdersPerPage(Number(e.target.value))}
              className="w-32"
              buttonClassName="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-black uppercase tracking-widest outline-none cursor-pointer shadow-sm hover:border-rose-300 transition-colors"
              options={[
                { value: 25, label: "Show 25" },
                { value: 100, label: "Show 100" },
              ]}
            />

            <div className="flex items-center gap-1 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <button type="button" onClick={() => setViewMode("table")} className={`p-3 rounded-xl transition-all ${viewMode === "table" ? "bg-rose-500 text-white shadow-lg" : "text-slate-400 hover:text-rose-600"}`} aria-label="Table view" title="Table view"><FaThList /></button>
              <button type="button" onClick={() => setViewMode("card")} className={`p-3 rounded-xl transition-all ${viewMode === "card" ? "bg-rose-500 text-white shadow-lg" : "text-slate-400 hover:text-rose-600"}`} aria-label="Card view" title="Card view"><FaThLarge /></button>
            </div>
          </div>
        </div>
      </div>

      {filterType === "custom" && (
        <div className="mb-6 flex gap-4 animate-in slide-in-from-top-4 duration-500">
           <input type="date" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black" value={customFrom} onChange={e => setCustomFrom(e.target.value)} />
           <input type="date" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black" value={customTo} onChange={e => setCustomTo(e.target.value)} />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-700">
        {viewMode === "card" ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentOrders.length > 0 ? currentOrders.map((order, index) => (
              <article key={order.id} className="border border-rose-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black text-slate-500 text-sm">#{order.orderId}</p>
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-2">{order.orderStatus}</p>
                  </div>
                  <span className="text-xs font-black text-slate-400">#{(currentPage - 1) * ordersPerPage + index + 1}</span>
                </div>
                <div className="mt-6 space-y-3">
                  <p className="font-black text-slate-800">{order.shippingAddress?.fullname || "Guest"}</p>
                  <p className="text-xs font-bold text-slate-500">{new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  <p className="text-xl font-black text-slate-800 opacity-60">₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
                  <span className="inline-block px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest">{order.paymentMethod || "COD"}</span>
                  <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 flex items-start gap-3">
                    <FaTimes className="text-rose-400 text-xs mt-0.5" />
                    <p className="text-[11px] font-black text-rose-700 leading-snug">{order.cancelReason || "No formal reason provided"}</p>
                  </div>
                  <button onClick={() => handlePrint(order)} className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white text-[10px] font-black uppercase py-3 rounded-xl tracking-widest">
                    <FaPrint /> Print Invoice
                  </button>
                </div>
              </article>
            )) : <div className="md:col-span-2 xl:col-span-3 py-20 text-center text-slate-400 font-black uppercase tracking-widest">No cancelled orders found</div>}
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#009669]  text-white">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">S.No</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Client Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Payment</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Loss/Refund</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Cancellation Reason</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentOrders.length > 0 ? (
                currentOrders.map((order, index) => (
                  <tr key={order.id} className="group hover:bg-slate-50/70 transition-colors">
                    <td className="px-8 py-6 font-black text-slate-800 text-xs">{(currentPage - 1) * ordersPerPage + index + 1}</td>
                    <td className="px-8 py-6">
                       <p className="font-black text-slate-400 text-xs italic mb-1">#{order.orderId}</p>
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                         {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                       </p>
                    </td>
                    <td className="px-8 py-6 uppercase">
                      <p className="font-black text-slate-800 text-sm leading-tight mb-1">{order.shippingAddress?.fullname || "Guest"}</p>
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-500 text-[8px] font-black rounded-lg border border-rose-100 uppercase tracking-widest">{order.orderStatus}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
                         {order.paymentMethod || "COD"}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <p className="text-base font-black text-slate-800 tracking-tighter opacity-40 italic">₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
                    </td>
                    <td className="px-8 py-6">
                       <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100 flex items-center gap-3">
                          <FaTimes className="text-rose-400 text-xs" />
                          <p className="text-[11px] font-black text-rose-700 leading-snug">{order.cancelReason || "No formal reason provided"}</p>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button onClick={() => handlePrint(order)} className="p-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all" title="Print invoice">
                        <FaPrint size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-8 py-32 text-center text-slate-400 font-black uppercase tracking-[0.2em]">
                    <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                       <FaTimes className="text-3xl opacity-20" />
                    </div>
                    No cancelled orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Showing <span className="text-slate-800">{Math.min(filteredOrders.length, (currentPage - 1) * ordersPerPage + 1)}</span> to <span className="text-slate-800">{Math.min(filteredOrders.length, currentPage * ordersPerPage)}</span> of <span className="text-slate-800">{filteredOrders.length}</span> Voided Logs
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`w-11 h-11 flex items-center justify-center rounded-2xl border border-slate-200 bg-white transition-all ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-rose-50 hover:text-rose-600 shadow-sm"}`}
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
                      className={`w-11 h-11 rounded-2xl text-[10px] font-black transition-all ${currentPage === pg ? "bg-rose-500 text-white shadow-rose-100 shadow-xl" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}
                    >
                      {pg}
                    </button>
                  );
                } else if (pg === currentPage - 2 || pg === currentPage + 2) {
                  return <span key={pg} className="px-1 text-slate-300 font-black">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`w-11 h-11 flex items-center justify-center rounded-2xl border border-slate-200 bg-white transition-all ${currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "hover:bg-rose-50 hover:text-rose-600 shadow-sm"}`}
            >
              <span className="text-xs">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelOrders;
