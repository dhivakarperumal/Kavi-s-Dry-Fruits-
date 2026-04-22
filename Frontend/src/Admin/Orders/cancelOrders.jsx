import React, { useEffect, useState } from "react";
import { FaTimes, FaSearch } from "react-icons/fa";
import api from "../../services/api";

const CancelOrders = () => {
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const ordersPerPage = 10;

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

  // --- Pagination ---
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
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
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-widest outline-none cursor-pointer shadow-sm hover:border-indigo-200 transition-colors"
            >
              <option value="all">Full Log</option>
              <option value="today">Today's Voids</option>
              <option value="week">Weekly Review</option>
              <option value="month">Monthly Audit</option>
              <option value="custom">Custom Filter</option>
            </select>
          </div>
        </div>
      </div>

      {filterType === "custom" && (
        <div className="mb-6 flex gap-4 animate-in slide-in-from-top-4 duration-500">
           <input type="date" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black" value={customFrom} onChange={e => setCustomFrom(e.target.value)} />
           <input type="date" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black" value={customTo} onChange={e => setCustomTo(e.target.value)} />
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#009669] border-b border-emerald-700 text-white">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">S.No</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Client Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Payment</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Loss/Refund</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Cancellation Reason</th>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-32 text-center text-slate-400 font-black uppercase tracking-[0.2em]">
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
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
           {[...Array(totalPages)].map((_, i) => (
             <button
               key={i}
               onClick={() => setCurrentPage(i + 1)}
               className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === i + 1 ? "bg-indigo-600 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-400 hover:border-indigo-200"}`}
             >
               {i + 1}
             </button>
           ))}
        </div>
      )}
    </div>
  );
};

export default CancelOrders;
