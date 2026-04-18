import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { FaPrint, FaEye } from "react-icons/fa";
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
  const [itemsPerPage, setItemsPerPage] = useState(25);
  // modal state for order details
  const [selectedOrder, setSelectedOrder] = useState(null);

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
  }, [orders, searchText, dateFilter, customRange]);

  // Display limited orders based on selected count
  const currentOrders = filteredOrders.slice(0, itemsPerPage);

  // Status Update Logic
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}`, { orderStatus: newStatus });
      toast.success("Status updated!");
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
    const all = ["Placed", "Packing", "Out for Delivery", "Delivered", "Cancelled"];

    if (current === "Packing")
      return ["Packing", "Out for Delivery", "Delivered", "Cancelled"];

    if (current === "Out for Delivery")
      return ["Out for Delivery", "Delivered", "Cancelled"];

    if (current === "Delivered") return ["Delivered"];

    if (current === "Cancelled") return ["Cancelled"];

    return all; // Placed → show all
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
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-[900] text-slate-900 tracking-tight">Order Archives</h1>
          <p className="text-sm font-bold text-slate-400 mt-1">Showing {filteredOrders.length} processed transactions</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <input
              type="text"
              placeholder="Search by Order ID or Client..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-6 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all font-black text-slate-900 text-sm shadow-sm"
            />
          </div>
          
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

      {dateFilter === "Custom" && (
        <div className="mb-6 flex gap-4 animate-in slide-in-from-top-4 duration-500">
           <input type="date" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black" value={customRange.from} onChange={e => setCustomRange({...customRange, from: e.target.value})} />
           <input type="date" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black" value={customRange.to} onChange={e => setCustomRange({...customRange, to: e.target.value})} />
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#009669] border-b border-emerald-700 text-white">
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
                       {index + 1}
                    </td>
                    <td className="px-8 py-6">
                       <button onClick={() => setSelectedOrder(order)} className="font-black text-indigo-600 text-sm block mb-1 hover:underline decoration-2">#{order.orderId}</button>
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
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer outline-none ${order.orderStatus === 'Delivered' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
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
        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center font-black text-[10px] text-slate-400 uppercase tracking-widest">
           <span>Total Logs: {filteredOrders.length}</span>
           <span>Showing: {currentOrders.length}</span>
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
