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
    FiPackage
} from "react-icons/fi";
import api from "../../services/api";
import { toast } from "react-hot-toast";

const Billing = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get("/orders");
            setOrders(Array.isArray(res.data) ? res.data : []);
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
        if (s === "delivered" || s === "paid") return "bg-emerald-100 text-emerald-700";
        if (s === "pending" || s === "placed") return "bg-amber-100 text-amber-700";
        if (s === "cancelled" || s === "red") return "bg-red-100 text-red-700";
        return "bg-gray-100 text-gray-700";
    };

    const filteredOrders = orders.filter(order => {
        const s = searchTerm.toLowerCase();
        return (
            !s ||
            String(order.id).includes(s) ||
            String(order.orderId || "").toLowerCase().includes(s) ||
            (order.clientName || order.customer_name || "").toLowerCase().includes(s) ||
            (order.clientPhone || order.customer_phone || "").toLowerCase().includes(s) ||
            (order.orderStatus || order.status || "").toLowerCase().includes(s)
        );
    });

    // Summary stats
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.totalAmount || o.total_amount || 0), 0);
    const totalItemsCount = orders.reduce((sum, o) => {
        let items = [];
        try { 
            const rawItems = o.items || o.cartItems;
            items = typeof rawItems === "string" ? JSON.parse(rawItems) : (rawItems || []); 
        } catch { }
        return sum + items.reduce((s, i) => s + (parseInt(i.quantity || i.qty) || 0), 0);
    }, 0);
    const todayOrders = orders.filter(o => {
        const dateStr = o.created_at || o.date;
        if (!dateStr) return false;
        const d = new Date(dateStr);
        const today = new Date();
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    }).length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-2 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Billing Console</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Real-time financial tracking and POS management</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchOrders}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
                    >
                        <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                    <Link
                        to="/adminpanel/billing/create"
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest"
                    >
                        <FiPlus /> New Bill
                    </Link>
                </div>
            </div>

            {/* Billing Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between group transition-all hover:shadow-xl hover:shadow-gray-100">
                    <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Gross Revenue</p>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tighter">₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h2>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
                        <FiTrendingUp /> {orders.length} transactions
                    </div>
                </div>
                <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-200 flex flex-col justify-between text-white relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div>
                        <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-4">Terminal Traffic</p>
                        <h2 className="text-4xl font-black tracking-tighter">{todayOrders}</h2>
                    </div>
                    <p className="mt-6 text-[10px] font-black opacity-90 uppercase tracking-widest flex items-center gap-1.5"><FiCalendar size={12} /> Today's performance</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between group transition-all hover:shadow-xl hover:shadow-gray-100">
                    <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Stock Displacement</p>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tighter">{totalItemsCount}</h2>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-indigo-500 font-black text-xs uppercase tracking-widest">
                        <FiPackage size={14} /> Units moved
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-2xl hover:shadow-gray-100/50">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Financial Ledger</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Ref ID, Client or Contact..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-14 pr-6 py-3.5 bg-white border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 shadow-sm transition-all text-sm w-full md:w-80 font-bold"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Synchronizing Records...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-40">
                            <FiFileText size={48} className="text-gray-200" />
                            <p className="text-xs font-black uppercase text-gray-400 tracking-widest">{searchTerm ? "Audit: Zero Results" : "Registry: Empty"}</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Descriptor</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identity</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Volume</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Classification</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Settlement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map((order) => {
                                    let items = [];
                                    try { 
                                        const rawItems = order.items || order.cartItems;
                                        items = typeof rawItems === "string" ? JSON.parse(rawItems) : (rawItems || []); 
                                    } catch { }
                                    const itemCount = items.reduce((s, i) => s + (parseInt(i.quantity || i.qty) || 0), 0);
                                    const status = order.orderStatus || order.status || "Pending";

                                    return (
                                        <tr key={order.id} className="hover:bg-indigo-50/30 transition-all group">
                                            <td className="px-8 py-6">
                                                <span className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                    #{order.orderId || order.id}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-sm text-gray-400 font-bold">
                                                <div className="flex items-center gap-2">
                                                    <FiCalendar size={14} className="opacity-40" />
                                                    {formatDateTime(order.created_at || order.date)}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-black text-slate-700 text-sm flex items-center gap-2">
                                                    <FiUser size={14} className="text-indigo-400" />
                                                    {order.clientName || order.customer_name || "Guest Trace"}
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-300 mt-0.5 ml-5">{order.clientPhone || order.customer_phone}</p>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase tracking-tighter">
                                                    {itemCount} Unit{itemCount !== 1 ? "s" : ""}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] ${getStatusStyle(status)}`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 font-black text-slate-800 text-lg text-right tracking-tighter">
                                                ₹{parseFloat(order.totalAmount || order.total_amount || 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Billing;
