import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FiDownload,
    FiFilter,
    FiSearch,
    FiCreditCard,
    FiFileText,
    FiTrendingUp,
    FiPlus,
    FiRefreshCw,
    FiCalendar,
    FiUser,
    FiPackage,
    FiList,
    FiGrid
} from "react-icons/fi";
import api from "../../services/api";
import { toast } from "react-hot-toast";

const Billing = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("table"); 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get("/orders");
            const parsedOrders = (res.data || []).map(o => ({
                ...o,
                items: typeof o.items === 'string' ? JSON.parse(o.items || '[]') : (o.items || []),
                cartItems: typeof o.cartItems === 'string' ? JSON.parse(o.cartItems || '[]') : (o.cartItems || [])
            }));
            setOrders(parsedOrders);
        } catch (error) {
            console.error("Fetch orders error:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "—";
        try {
            const date = new Date(dateStr);
            return date.toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
        } catch {
            return dateStr;
        }
    };

    const getStatusStyle = (status) => {
        const s = (status || "").toLowerCase();
        if (s === "delivered" || s === "paid") return "bg-emerald-50 text-emerald-600 border-emerald-100";
        if (s === "pending" || s === "placed") return "bg-amber-50 text-amber-600 border-amber-100";
        if (s === "cancelled" || s === "red") return "bg-rose-50 text-rose-600 border-rose-100";
        return "bg-slate-50 text-slate-600 border-slate-100";
    };

    const filteredOrders = orders.filter(order => {
        const s = searchTerm.toLowerCase();
        // Only show Shop Customers in Billing
        if (order.customerType !== "Shop Customer") return false;

        return (
            !s ||
            String(order.id).includes(s) ||
            String(order.orderId || "").toLowerCase().includes(s) ||
            (order.clientName || order.customer_name || "").toLowerCase().includes(s) ||
            (order.clientPhone || order.customer_phone || "").toLowerCase().includes(s) ||
            (order.orderStatus || order.status || "").toLowerCase().includes(s)
        );
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Summary stats (Based on filtered Shop Customers)
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount || o.total_amount || 0), 0);
    const totalItemsCount = filteredOrders.reduce((sum, o) => {
        const items = o.items.length > 0 ? o.items : o.cartItems;
        return sum + items.reduce((s, i) => s + (parseInt(i.quantity || i.qty) || 0), 0);
    }, 0);
    const todayOrders = filteredOrders.filter(o => {
        const dateStr = o.created_at || o.date;
        if (!dateStr) return false;
        const d = new Date(dateStr);
        const today = new Date();
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    }).length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-2 md:p-8 text-left bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 w-full md:w-auto">

                    <div className="relative w-full md:w-80">
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Ref ID, Client or Contact..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 shadow-sm transition-all text-xs w-full font-black uppercase tracking-widest"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">

                    {/* Advanced Filters / Search Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-0 rounded-[2.5rem]  ">
                        <div className="flex items-center gap-4">

                            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 ml-4">
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                    title="Table View"
                                >
                                    <FiList size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode("card")}
                                    className={`p-2 rounded-lg transition-all ${viewMode === "card" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                    title="Card View"
                                >
                                    <FiGrid size={16} />
                                </button>
                            </div>
                        </div>

                    </div>

                    <Link
                        to="/adminpanel/billing/create"
                        className="flex items-center gap-2 px-6 py-4.5 bg-[#009669] hover:bg-indigo-700 text-white rounded-2xl text-xs font-black transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest"
                    >
                        <FiPlus size={16} /> New Transaction
                    </Link>
                </div>
            </div>

            {/* Billing Stats (Dashboard Type Color Tack) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className="group relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-emerald-500/40 bg-gradient-to-br from-emerald-400 to-emerald-600">
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-150"></div>
                    <div className="absolute -top-10 -right-4 w-28 h-28 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-125"></div>

                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-white/80 font-black text-[10px] tracking-widest uppercase mb-2">Gross Revenue</p>
                            <h3 className="text-4xl font-black text-white tracking-tighter">
                                ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner backdrop-blur-md border border-white/20 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 bg-white/20">
                            <FiTrendingUp />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-6 relative z-10">
                        <span className="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
                        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">{filteredOrders.length} Settlements Processed</span>
                    </div>
                </div>

                {/* Traffic Card */}
                <div className="group relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-indigo-500/40 bg-gradient-to-br from-indigo-500 to-indigo-700">
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-150"></div>
                    <div className="absolute -top-10 -right-4 w-28 h-28 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-125"></div>

                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-white/80 font-black text-[10px] tracking-widest uppercase mb-2">Terminal Traffic</p>
                            <h3 className="text-5xl font-black text-white tracking-tighter">
                                {todayOrders}
                            </h3>
                        </div>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner backdrop-blur-md border border-white/20 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 bg-white/20">
                            <FiCalendar />
                        </div>
                    </div>
                    <div className="mt-8 flex items-center gap-2 relative z-10 text-white/50 text-[10px] font-black uppercase tracking-widest italic font-mono">
                        Real-time Synchronized
                    </div>
                </div>

                {/* Stock Card */}
                <div className="group relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-blue-500/40 bg-gradient-to-br from-blue-500 to-blue-700">
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-150"></div>
                    <div className="absolute -top-10 -right-4 w-28 h-28 bg-white opacity-20 rounded-full transition-transform duration-500 group-hover:scale-125"></div>

                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-white/80 font-black text-[10px] tracking-widest uppercase mb-2">Stock Displacement</p>
                            <h3 className="text-4xl font-black text-white tracking-tighter">
                                {totalItemsCount}
                            </h3>
                        </div>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner backdrop-blur-md border border-white/20 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 bg-white/20">
                            <FiPackage />
                        </div>
                    </div>
                    <div className="mt-8 flex items-center gap-2 relative z-10">
                        <span className="flex h-2 w-2 rounded-full bg-white animate-bounce"></span>
                        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Inventory Dispatched</span>
                    </div>
                </div>
            </div>



            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white rounded-[3rem] border border-slate-200">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Synchronizing Records...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 gap-8 bg-white rounded-[3rem] border border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner">
                        <FiFileText size={48} />
                    </div>
                    <div className="text-center space-y-3">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No Shop Settlements</h3>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.25em] max-w-xs mx-auto leading-loose">
                            {searchTerm ? "The ledger matches no search criteria." : "The Registry is currently waiting for the first in-store transaction."}
                        </p>
                    </div>
                    {!searchTerm && (
                        <Link
                            to="/adminpanel/billing/create"
                            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-black text-white rounded-2xl text-[10px] font-black transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest mt-4"
                        >
                            <FiPlus size={16} /> Create First Bill
                        </Link>
                    )}
                </div>
            ) : viewMode === "table" ? (
                <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm mt-4">
                    <table className="w-full border-collapse">
                        <thead className="bg-[#009669]">
                            <tr className="text-left">

                                <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">S.No</th>
                               
                                <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Descriptor</th>
                                <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Identity</th>
                                <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest text-center">Volume</th>
                                <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Classification</th>
                                <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest text-right">Settlement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {currentOrders.map((order, index) => {
                                const items = order.items.length > 0 ? order.items : order.cartItems;
                                const itemCount = items.reduce((s, i) => s + (parseInt(i.quantity || i.qty) || 0), 0);
                                const status = order.orderStatus || order.status || "Pending";

                                return (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-all group">
                                        <td className="px-8 py-6 font-black text-slate-900 text-xs">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                       

                                        <td className="px-8 py-6">
                                            <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                #{order.orderId || order.id}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-[11px] text-slate-400 font-black uppercase">
                                            {formatDateTime(order.created_at || order.date)}
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-black text-slate-900 text-xs uppercase tracking-tight">{order.clientName || order.customer_name || "Guest Trace"}</p>
                                            <p className="text-[9px] font-bold text-slate-300 mt-1">{order.clientPhone || order.customer_phone}</p>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                                                {itemCount} Units
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(status)}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-black text-slate-900 text-sm text-right tracking-tighter">
                                            ₹{parseFloat(order.totalAmount || order.total_amount || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentOrders.map((order, index) => {
                        const items = order.items.length > 0 ? order.items : order.cartItems;
                        const itemCount = items.reduce((s, i) => s + (parseInt(i.quantity || i.qty) || 0), 0);
                        const status = order.orderStatus || order.status || "Pending";

                        return (
                            <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 hover:shadow-2xl hover:shadow-slate-100 transition-all group relative overflow-hidden flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.15em] border mb-3 inline-block ${getStatusStyle(status)}`}>
                                            {status}
                                        </span>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">#{order.orderId || order.id}</h3>
                                        <p className="text-[9px] font-black text-slate-300 uppercase mt-1 tracking-widest">{formatDateTime(order.created_at || order.date)}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden group-hover:border-indigo-600 transition-all p-0.5 shadow-sm">
                                        {items[0]?.image ? (
                                            <img
                                                src={(() => {
                                                    const raw = items[0]?.image || "";
                                                    let resolved = raw;
                                                    try {
                                                        if (typeof raw === 'string' && raw.startsWith('[')) {
                                                            resolved = JSON.parse(raw)[0];
                                                        } else if (Array.isArray(raw)) {
                                                            resolved = raw[0];
                                                        }
                                                    } catch (e) {
                                                        resolved = raw;
                                                    }
                                                    if (!resolved) return "";
                                                    if (resolved.startsWith('http') || resolved.startsWith('data:')) return resolved;
                                                    return `http://localhost:5000${resolved.startsWith('/') ? '' : '/'}${resolved}`;
                                                })()}
                                                alt=""
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <FiFileText size={20} className="text-slate-300 group-hover:text-indigo-600" />
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-5 mb-8 flex-1">
                                    <div className="flex items-center justify-between py-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Client Identity</p>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{order.clientName || order.customer_name || "Guest Trace"}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Displacement</p>
                                        <p className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">{itemCount} Units</p>
                                    </div>
                                    <div className="flex items-center justify-between py-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Terminal ID</p>
                                        <p className="text-xs font-black text-slate-500 font-mono tracking-tighter">{order.paymentMethod || order.paymentMode || "COD/Terminal"}</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Settlement</p>
                                        <p className="text-2xl font-black text-emerald-600 tracking-tighter">₹{parseFloat(order.totalAmount || order.total_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <Link
                                        to={`/adminpanel/invoice/${order.orderId || order.id}`}
                                        className="w-12 h-12 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all"
                                        title="View Invoice"
                                    >
                                        <FiDownload size={18} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm mt-8">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Showing {Math.min(filteredOrders.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredOrders.length, currentPage * itemsPerPage)} of {filteredOrders.length} Settlements
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${currentPage === 1 ? "opacity-30 cursor-not-allowed text-slate-200" : "hover:bg-indigo-600 hover:text-white shadow-lg shadow-indigo-100 text-slate-600 border-indigo-100"}`}
                        >
                            <span className="text-sm">←</span>
                        </button>

                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => {
                                const pg = i + 1;
                                if (pg === 1 || pg === totalPages || (pg >= currentPage - 1 && pg <= currentPage + 1)) {
                                    return (
                                        <button
                                            key={pg}
                                            onClick={() => setCurrentPage(pg)}
                                            className={`w-11 h-11 rounded-xl text-[10px] font-black transition-all ${currentPage === pg ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900 border border-transparent"}`}
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
                            className={`w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${currentPage === totalPages ? "opacity-30 cursor-not-allowed text-slate-200" : "hover:bg-indigo-600 hover:text-white shadow-lg shadow-indigo-100 text-slate-600 border-indigo-100"}`}
                        >
                            <span className="text-sm">→</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Billing;
