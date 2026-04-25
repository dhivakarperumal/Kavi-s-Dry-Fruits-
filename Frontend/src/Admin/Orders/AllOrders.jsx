import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { FaPrint, FaEye, FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";
import logo from "/images/Kavi_logo.png";
import OrderDetailsModal from "./OrderDetailsModal";
import { useNavigate } from "react-router-dom";

const AllOrders = () => {
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

  // Fetch all orders from all users
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      const parsedOrders = (res.data || []).map(o => ({
        ...o,
        // Parse JSON strings from MySQL
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
  }, []);

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

    setFilteredOrders(temp);
    setCurrentPage(1);
  }, [orders, searchText, dateFilter, customRange]);

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
      toast.success(newStatus === "Shipped" ? `Order Shipped! Docket: ${data.docketNumber}` : "Status updated!");
      fetchOrders();
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
 
     const address = order.shippingAddress || order.client || {};
     const items = order.cartItems || order.items || [];
 
     const itemsList = items
       .map((item) => {
        const sno= items.indexOf(item)+1;
         const name = item.name || item.productName || "-";
         const qty = Number(item.qty ?? item.quantity ?? 1);
         const price = Number(item.price ?? item.unitPrice ?? 0) || 0;
         const weight = item.weight || item.selectedWeight || item.weightDisplay || "-";
         const unitPrice =
           Number(item.price ?? item.unitPrice ?? (item.total && qty ? item.total / qty : 0)) || 0;
         const lineTotal = (unitPrice * qty).toFixed(2);
         const gst = Number(item.gst ?? 0).toFixed(2);
         return `
       <tr>
          <td>${sno}</td>
         <td>${name}</td>
         <td>${weight}</td>
         <td>₹${price.toFixed(2)}</td>
         <td>${qty}</td>
         <td>₹${gst}</td>
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
             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 2px solid #3a3838ff; padding: 8px; text-align: center; font-size: 13px; }
             th { background-color: #f6f6f6; }
             .summary { margin-top: 12px; font-size: 15px; float: right; }
             .note { margin-top: 24px; font-style: italic; color: #555; text-align: center;position: absolute; bottom: 0; width: 100%; }
             .info p { margin: 4px 0; font-size: 14px;line-height: 1.4; }
             .top-header { text-align: right; font-size: 12px; margin-bottom: 6px; }
             img.logo { max-width: 140px; display: block; margin: 0 auto 8px; }
           </style>
         </head>
         <body>
          <div class="top-header">Order Booking Date: ${deliveryDate}</div>
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
           <table style="margin-top:20px;">
             <thead>
               <tr>
                 <th>S.No</th>
                 <th>Product Name</th>
                 <th>Weight</th>
                 <th>Price</th>
                 <th>Qty</th>
                 
                 <th>GST</th>
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
              <option value="All">Full History</option>
              <option value="Today">Today's Log</option>
              <option value="This Week">Weekly View</option>
              <option value="This Month">Monthly View</option>
              <option value="Custom">Custom Range</option>
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-widest outline-none cursor-pointer shadow-sm hover:border-indigo-200 transition-colors"
            >
              <option value={25}>Show 25</option>
              <option value={100}>Show 100</option>
              <option value={500}>Show 500</option>
            </select>
          </div>
        </div>
      </div>

      {dateFilter === "Custom" && (
        <div className="mb-6 flex gap-4 animate-in slide-in-from-top-4 duration-500">
           <input type="date" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black" value={customRange.from} onChange={e => setCustomRange({...customRange, from: e.target.value})} />
           <input type="date" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black" value={customRange.to} onChange={e => setCustomRange({...customRange, to: e.target.value})} />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-700">
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
