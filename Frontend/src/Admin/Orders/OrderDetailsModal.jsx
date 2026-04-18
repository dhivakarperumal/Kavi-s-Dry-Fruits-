import React from "react";
import { FaPrint, FaTimes, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaCreditCard } from "react-icons/fa";
import logo from "/images/Kavi_logo.png";

const OrderDetailsModal = ({ order, onClose = () => {}, onPrint = () => {} }) => {
  if (!order) return null;

  const address = order.shippingAddress || order.client || {};
  const items = order.cartItems || order.items || [];
  const clientName = order.clientName || order.fullname || order.client_name || order.client?.name || address.fullname || address.name || address.contact || "Guest Customer";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] max-w-4xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "92vh" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
               <img src={logo} alt="Kavi's" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Order Details</h3>
              <p className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-1 uppercase tracking-wider">{order.orderId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onPrint(order)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl cursor-pointer flex items-center gap-2 font-black text-sm shadow-lg shadow-emerald-100 transition-all uppercase tracking-widest"
            >
              <FaPrint /> Print
            </button>
            <button onClick={onClose} className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl cursor-pointer transition-all">
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto" style={{ maxHeight: "calc(92vh - 100px)" }}>
          {/* Info Grid - Consolidated into 2 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Card 1: Order Meta */}
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                  <FaUser className="text-indigo-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Customer</p>
                  <p className="font-black text-slate-800 text-sm leading-none">{clientName}</p>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">{order.clientPhone || address.contact || "No contact"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date & Time</p>
                  <p className="font-black text-slate-800 text-xs">
                    {new Date(order.date || order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold">
                    {new Date(order.date || order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Method</p>
                  <p className="font-black text-slate-800 text-xs">{order.paymentMethod || "COD"}</p>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full mt-1 inline-block ${order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {order.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Location */}
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                  <FaMapMarkerAlt className="text-rose-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Shipping Address</p>
                  <p className="font-black text-slate-800 text-sm leading-none">Primary Location</p>
                </div>
              </div>
              
              <div className="flex-1 bg-white/50 rounded-2xl p-4 border border-slate-200/50">
                <p className="font-black text-slate-900 text-xs mb-1.5 uppercase tracking-tight">
                  {address.fullname || address.name || clientName}
                </p>
                <p className="font-bold text-slate-600 text-[11px] leading-relaxed">
                  {(address.street ? address.street + ', ' : '')}
                  {(address.city ? address.city + ', ' : '')}
                  {(address.state || '')}
                  {(address.zip ? ' - ' + address.zip : '')}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1">
                   <p className="text-[10px] text-slate-500 font-black flex items-center gap-1.5 lowercase">
                     <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> {address.email || order.email || "No Email"}
                   </p>
                   <p className="text-[10px] text-slate-500 font-black flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> {address.contact || order.clientPhone || "No Phone"}
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Item</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Qty</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Weight</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Price</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((it, idx) => {
                  const qty = Number(it.qty ?? it.quantity ?? 1);
                  const unitPrice = Number(it.price ?? it.unitPrice ?? 0) || 0;
                  const weight = it.weight || it.selectedWeight || it.weightDisplay || "-";
                  const lineTotal = (unitPrice * qty).toFixed(2);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center p-1">
                          {it.image ? (
                            <img src={it.image.startsWith('http') ? it.image : (it.image.startsWith('data') ? it.image : (it.image.startsWith('/images') ? it.image : `http://localhost:5000${it.image}`))} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <div className="text-[8px] font-black text-slate-300">N/A</div>
                          )}
                        </div>
                        <span className="font-black text-slate-800 text-sm leading-tight">{it.name || it.productName || "-"}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-black text-slate-600 text-sm">{qty}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-[10px] font-black px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">{weight}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-black text-slate-400 text-sm">₹{unitPrice.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-right font-black text-slate-900 text-sm">₹{Number(lineTotal).toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Summary */}
          <div className="flex flex-col items-end gap-3 pr-6">
             <div className="flex items-center gap-12 text-sm">
                <span className="font-bold text-slate-400">Subtotal</span>
                <span className="w-24 text-right font-black text-slate-600">₹{Number(order.totalAmount - (order.shippingCharge || 0) - (order.gstAmount || 0)).toLocaleString('en-IN')}</span>
             </div>
             <div className="flex items-center gap-12 text-sm">
                <span className="font-bold text-slate-400">GST Total</span>
                <span className="w-24 text-right font-black text-emerald-600">₹{Number(order.gst || order.gstAmount || 0).toLocaleString('en-IN')}</span>
             </div>
             <div className="flex items-center gap-12 text-sm">
                <span className="font-bold text-slate-400">Shipping</span>
                <span className="w-24 text-right font-black text-slate-600">₹{Number(order.shippingCharge || 0).toLocaleString('en-IN')}</span>
             </div>
             <div className="mt-2 pt-4 border-t border-slate-100 flex items-center gap-12">
                <span className="text-xl font-black text-slate-900 uppercase tracking-tighter">Total Payable</span>
                <span className="text-3xl font-black text-indigo-600 tracking-tighter">₹{Number(order.totalAmount || order.total || 0).toLocaleString('en-IN')}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
