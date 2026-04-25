import React, { useEffect, useState, useMemo } from "react";
import { FaTimes, FaBoxOpen, FaSearch } from "react-icons/fa";
import api from "../../services/api";

const ReturnOrders = () => {
  const [returnOrders, setReturnOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 🔹 States for filters and pagination
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchReturnOrders();
  }, []);

  const fetchReturnOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      const data = (res.data || [])
        .filter(o => o.orderStatus === "Returned" || o.orderStatus === "Refunded")
        .map(o => ({
          ...o,
          cartItems: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []),
          shippingAddress: typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : (o.shippingAddress || {}),
          date: o.created_at || o.date
        }));
      setReturnOrders(data);
    } catch (error) {
      console.error("Error fetching return orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filtering logic
  const filteredOrders = useMemo(() => {
    let filtered = [...returnOrders];

    // Search by Order ID or Client Name
    if (searchText) {
      filtered = filtered.filter(
        (order) =>
          order.orderId?.toLowerCase().includes(searchText.toLowerCase()) ||
          order.shippingAddress?.fullname
            ?.toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    // Date filters
    const now = new Date();
    if (filterType === "today") {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date);
        return (
          orderDate.toDateString() === new Date().toDateString()
        );
      });
    } else if (filterType === "week") {
      const startOfWeek = new Date();
      startOfWeek.setDate(now.getDate() - now.getDay());
      filtered = filtered.filter(
        (order) =>
          new Date(order.date) >= startOfWeek &&
          new Date(order.date) <= now
      );
    } else if (filterType === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter(
        (order) =>
          new Date(order.date) >= startOfMonth &&
          new Date(order.date) <= now
      );
    } else if (filterType === "custom" && customFrom && customTo) {
      const from = new Date(customFrom);
      const to = new Date(customTo);
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate >= from && orderDate <= to;
      });
    }

    return filtered;
  }, [returnOrders, searchText, filterType, customFrom, customTo]);

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-[900] text-slate-900 tracking-tight">Return Management</h1>
          <p className="text-sm font-bold text-slate-400 mt-1">Processing {filteredOrders.length} return requests</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 uppercase">
          {/* Left: Search */}
          <div className="relative w-full lg:max-w-sm flex-1">
             <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-6 py-5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all font-black text-slate-900 text-sm shadow-sm"
            />
          </div>
          
          {/* Right: Controls */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-slate-200 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-widest outline-none cursor-pointer shadow-sm hover:border-indigo-200 transition-colors"
            >
              <option value="all">Full History</option>
              <option value="today">Today's Returns</option>
              <option value="week">Weekly Summary</option>
              <option value="month">Monthly Audit</option>
              <option value="custom">Custom Selector</option>
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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-700 text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#009669]  text-white">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">S.No</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Client Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Payment</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Refundable</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Return Reason</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order, index) => (
                  <tr key={order.id} className="group hover:bg-slate-50/70 transition-colors">
                    <td className="px-8 py-6 font-black text-slate-800 text-xs">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-8 py-6">
                       <button onClick={() => setSelectedOrder(order)} className="font-black text-indigo-600 text-sm block mb-1 hover:underline">#{order.orderId}</button>
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                         {order.date ? new Date(order.date).toLocaleDateString() : "—"}
                       </p>
                    </td>
                    <td className="px-8 py-6 uppercase">
                      <p className="font-black text-slate-800 text-sm leading-tight mb-1">{order.shippingAddress?.fullname || "Guest Transaction"}</p>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-black rounded-lg border border-amber-100 uppercase tracking-widest">{order.orderStatus}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest">
                         {order.paymentMethod || "PREPAID"}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <p className="text-base font-black text-emerald-600 tracking-tighter">₹{Number(order.refundAmount || order.totalAmount).toLocaleString('en-IN')}</p>
                    </td>
                    <td className="px-8 py-6">
                       <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                          <p className="text-[11px] font-black text-slate-500 leading-tight italic line-clamp-1">"{order.returnReason || "General Return Claim"}"</p>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center flex-col gap-1">
                        <button onClick={() => setSelectedOrder(order)} className="px-4 py-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-100 font-black text-[9px] uppercase tracking-widest shadow-sm">Review Claim</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-8 py-32 text-center text-slate-400 font-black uppercase tracking-[0.2em]">
                    <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                       <FaBoxOpen className="text-3xl opacity-20" />
                    </div>
                    No return requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
           <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:border-indigo-500 disabled:opacity-30 transition-all shadow-sm">Previous</button>
           <span className="font-black text-xs text-slate-400">Page {currentPage} of {totalPages}</span>
           <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:border-indigo-500 disabled:opacity-30 transition-all shadow-sm">Next</button>
        </div>
      )}

      {selectedOrder && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden p-10 animate-in zoom-in duration-500" onClick={e => e.stopPropagation()}>
               <div className="flex justify-between items-start mb-8 text-left">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Return Claim Details</h3>
                    <p className="text-xs font-black text-amber-600 uppercase tracking-widest mt-1">Order Ref: #{selectedOrder.orderId}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-400 text-xl hover:text-slate-900 transition-colors">✕</button>
               </div>
               
               <div className="space-y-6 mb-10 text-left overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar text-slate-900">
                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">Internal Context</p>
                     <p className="text-xs font-black text-slate-500 leading-relaxed mb-4">Reason for Return: <span className="text-rose-600 italic">"{selectedOrder.returnReason || "Not specified"}"</span></p>
                     <div className="h-px bg-slate-200 mb-4"></div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">Order Composition</p>
                     <div className="space-y-2">
                        {(selectedOrder.cartItems || selectedOrder.items || []).map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center text-xs font-black text-slate-800">
                              <span>{item.name || item.productName} {item.weight || item.selectedWeight} × {item.qty || item.quantity}</span>
                              <span className="text-slate-400">₹{(item.price * (item.qty || item.quantity)).toFixed(2)}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left">Dispatch Target</p>
                     <div className="text-xs font-black text-slate-800 space-y-1">
                        <p>{selectedOrder.shippingAddress?.fullname}</p>
                        <p className="text-slate-400 font-bold">{selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zip}</p>
                        <p className="pt-2 text-indigo-500 tracking-tighter underline">{selectedOrder.shippingAddress?.email}</p>
                     </div>
                  </div>
               </div>
               
               <div className="flex gap-4">
                  <button onClick={() => setSelectedOrder(null)} className="flex-1 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Approve & Settle Refund</button>
                  <button onClick={() => setSelectedOrder(null)} className="px-10 py-5 bg-slate-50 text-slate-600 rounded-[1.5rem] font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all">Close</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default ReturnOrders;
