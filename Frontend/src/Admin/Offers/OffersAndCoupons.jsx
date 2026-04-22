import React, { useState, useEffect } from "react";
import { FaTicketAlt, FaTrash, FaPlus, FaPercentage, FaRegCalendarAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import api from "../../services/api";
import { toast } from "react-hot-toast";

const OffersAndCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    
    // Form state
    const [form, setForm] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minPurchase: "0",
        expiryDate: "",
        usageLimit: "0",
        status: "active"
    });

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await api.get("/coupons");
            setCoupons(res.data || []);
        } catch (error) {
            console.error("fetchCoupons error:", error);
            toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.code || !form.discountValue) {
            return toast.error("Please fill mandatory fields");
        }

        try {
            await api.post("/coupons", form);
            toast.success("Coupon created successfully!");
            setShowAddModal(false);
            setForm({
                code: "",
                discountType: "percentage",
                discountValue: "",
                minPurchase: "0",
                expiryDate: "",
                usageLimit: "0",
                status: "active"
            });
            fetchCoupons();
        } catch (error) {
            console.error("createCoupon error:", error);
            toast.error("Failed to create coupon");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;
        try {
            await api.delete(`/coupons/${id}`);
            toast.success("Coupon deleted!");
            fetchCoupons();
        } catch (error) {
            console.error("deleteCoupon error:", error);
            toast.error("Deletion failed");
        }
    };

    return (
        <div className="p-4 sm:p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-[900] text-slate-900 tracking-tight">Offers & Coupons</h1>
                    <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Manage promotional discounts and active vouchers</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-3"
                >
                    <FaPlus /> Create New Voucher
                </button>
            </div>

            {/* Coupons List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center animate-pulse font-black text-slate-300 uppercase tracking-widest">
                        Initializing Discount Engine...
                    </div>
                ) : coupons.length > 0 ? (
                    coupons.map((coupon) => (
                        <div key={coupon.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-100 relative group overflow-hidden">
                            <div className={`absolute top-0 right-0 w-24 h-24 -mt-10 -mr-10 rounded-full blur-2xl opacity-20 ${coupon.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                            
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                    <FaTicketAlt className="text-indigo-600 text-xl" />
                                </div>
                                <button 
                                    onClick={() => handleDelete(coupon.id)}
                                    className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>

                            <div className="relative z-10">
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${coupon.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {coupon.status}
                                </span>
                                <h2 className="text-2xl font-black text-slate-900 mt-3 tracking-tighter uppercase">{coupon.code}</h2>
                                <p className="text-emerald-600 text-xl font-black mt-1">
                                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                </p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-50 flex flex-col gap-3">
                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                                    <span className="flex items-center gap-2"><FaRegCalendarAlt /> Expiry</span>
                                    <span className="text-slate-900">{coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'NO EXPIRY'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Min Purchase</span>
                                    <span className="text-slate-900">₹{coupon.minPurchase}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Usage Limit</span>
                                    <span className="text-slate-900">{coupon.usageLimit > 0 ? `${coupon.usedCount} / ${coupon.usageLimit}` : 'UNLIMITED'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                            <FaTicketAlt className="text-4xl text-slate-300" />
                        </div>
                        <p className="font-black text-slate-300 uppercase tracking-[0.3em]">No Active Coupons Found</p>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-500">
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-10 text-left">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">New Promotional Voucher</h3>
                                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mt-1">Configure discount parameters</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-full">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Voucher Code</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. SUMMER50" 
                                            value={form.code} 
                                            onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                                            className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-2xl px-6 py-4 font-black shadow-inner outline-none transition-all uppercase"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Discount Type</label>
                                        <select 
                                            value={form.discountType} 
                                            onChange={e => setForm({...form, discountType: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-2xl px-6 py-4 font-black shadow-inner outline-none transition-all"
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (₹)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Discount Value</label>
                                        <input 
                                            type="number" 
                                            placeholder="e.g. 10" 
                                            value={form.discountValue} 
                                            onChange={e => setForm({...form, discountValue: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-2xl px-6 py-4 font-black shadow-inner outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Min. Purchase (₹)</label>
                                        <input 
                                            type="number" 
                                            value={form.minPurchase} 
                                            onChange={e => setForm({...form, minPurchase: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-2xl px-6 py-4 font-black shadow-inner outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Expiry Date</label>
                                        <input 
                                            type="date" 
                                            value={form.expiryDate} 
                                            onChange={e => setForm({...form, expiryDate: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-2xl px-6 py-4 font-black shadow-inner outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Limit Usage</label>
                                        <input 
                                            type="number" 
                                            value={form.usageLimit} 
                                            onChange={e => setForm({...form, usageLimit: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-2xl px-6 py-4 font-black shadow-inner outline-none transition-all"
                                        />
                                        <p className="text-[9px] text-slate-300 font-bold mt-1 px-1">0 for unlimited usage</p>
                                    </div>

                                    <div className="flex items-center gap-4 py-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status:</span>
                                        <button 
                                            type="button"
                                            onClick={() => setForm({...form, status: form.status === 'active' ? 'inactive' : 'active'})}
                                            className="text-2xl"
                                        >
                                            {form.status === 'active' ? <FaToggleOn className="text-emerald-500" /> : <FaToggleOff className="text-slate-300" />}
                                        </button>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${form.status === 'active' ? 'text-emerald-500' : 'text-slate-400'}`}>{form.status}</span>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all mt-4"
                                >
                                    Activate Voucher
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OffersAndCoupons;
