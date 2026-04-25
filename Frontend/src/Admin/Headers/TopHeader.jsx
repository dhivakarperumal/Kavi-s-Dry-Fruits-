import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaBell, FaBoxOpen, FaSignOutAlt, FaUserCircle, FaSearch, FaCog, FaUsers } from "react-icons/fa";
import { MdWarning } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Topbar = ({
  setIsSidebarOpen,
  activeSection,
  adminName = "Administrator",
  todayOrdersCount = 0,
  todayOrdersList = [],
  lowStockCount = 0,
  lowStockItems = [],
  ordersold = [],
  handleLogout,
}) => {
  const [isOrderDropdown,   setIsOrderDropdown]   = useState(false);
  const [isStockDropdown,   setIsStockDropdown]   = useState(false);
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const [searchQuery,       setSearchQuery]       = useState("");
  const [showSearch,        setShowSearch]        = useState(false);
  const searchInputRef = useRef();

  const orderRef   = useRef();
  const stockRef   = useRef();
  const profileRef = useRef();
  const navigate   = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (orderRef.current   && !orderRef.current.contains(e.target))   setIsOrderDropdown(false);
      if (stockRef.current   && !stockRef.current.contains(e.target))   setIsStockDropdown(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Close search on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setShowSearch(false); setSearchQuery(""); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-4.5 bg-white border-b border-gray-200 shadow-sm">

      {/* ── LEFT: Hamburger + Title ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 transition"
        >
          <FaBars size={18} />
        </button>

        <div className="hidden sm:flex flex-col leading-tight">
          <h1 className="text-[20px] font-bold text-gray-800 capitalize">{activeSection}</h1>
          <span className="text-[11px] text-gray-500 font-medium">Welcome back, {adminName}!</span>
        </div>
      </div>


      {/* ── RIGHT: Icons ── */}
      <div className="flex items-center gap-2">

        {/* 🔍 Expanding search input — appears LEFT of the search icon */}
        <div
          style={{
            overflow: "hidden",
            maxWidth: showSearch ? "220px" : "0px",
            opacity: showSearch ? 1 : 0,
            transition: "max-width 0.3s ease, opacity 0.25s ease",
          }}
        >
          <div className="relative" style={{ width: "220px" }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>
        </div>

        {/* 🔍 Search icon toggle */}
        <button
          onClick={() => { setShowSearch(!showSearch); setSearchQuery(""); }}
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition shadow-sm ${
            showSearch
              ? "bg-emerald-600 text-white"
              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
          }`}
        >
          <FaSearch size={14} />
        </button>

        {/* 🔔 Orders Bell */}
        <div className="relative" ref={orderRef}>
          <button
            onClick={() => { setIsOrderDropdown(!isOrderDropdown); setIsStockDropdown(false); setIsProfileDropdown(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition shadow-sm"
          >
            <FaBell size={16} />
            {todayOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-px rounded-full border-2 border-white">
                {todayOrdersCount}
              </span>
            )}
          </button>
          {isOrderDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">New Orders</span>
                <span className="bg-emerald-200 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full">{todayOrdersCount} Today</span>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {todayOrdersList.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100">Order</th>
                        <th className="px-2 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100">Customer</th>
                        <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayOrdersList.map((order, idx) => (
                        <tr key={idx} className="hover:bg-emerald-50/50 transition-colors border-b border-gray-50 last:border-0">
                          <td className="px-4 py-3">
                            <p className="text-[10px] font-black text-slate-900">#{order.orderId || order.id}</p>
                            <span className={`text-[7px] font-black uppercase px-1 rounded ${
                              order.orderStatus === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                            }`}>{order.orderStatus}</span>
                          </td>
                          <td className="px-2 py-3">
                            <p className="text-[10px] font-black text-slate-700 truncate max-w-[80px]">{order.customerName || order.userName || 'Guest'}</p>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-[10px] font-black text-emerald-600">₹{order.totalAmount || order.totalPrice || 0}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center">
                    <FaBoxOpen className="mx-auto text-slate-200 mb-2" size={24} />
                    <p className="text-xs font-medium text-slate-400">No new orders today yet</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => { navigate('/adminpanel/all-orders'); setIsOrderDropdown(false); }}
                className="w-full py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-inner"
              >
                View All Orders
              </button>
            </div>
          )}
        </div>

        {/* ⚠️ Low Stock */}
        <div className="relative" ref={stockRef}>
          <button
            onClick={() => { setIsStockDropdown(!isStockDropdown); setIsOrderDropdown(false); setIsProfileDropdown(false); }}
            className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition shadow-sm ${
              lowStockCount > 0
                ? "bg-amber-50 text-amber-500 hover:bg-amber-100"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            }`}
          >
            <MdWarning size={18} />
            {lowStockCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-white text-[9px] font-bold px-1.5 py-px rounded-full border-2 border-white">
                {lowStockCount}
              </span>
            )}
          </button>
          {isStockDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Stock Alerts</span>
                <span className="bg-amber-200 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full">{lowStockCount} Items</span>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {lowStockItems.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100">Product</th>
                        <th className="px-2 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100">Cat</th>
                        <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 text-right">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockItems.map((item, idx) => {
                        const stockGrams = Number(item.totalStock || 0);
                        return (
                          <tr key={idx} className="hover:bg-amber-50/50 transition-colors border-b border-gray-50 last:border-0">
                            <td className="px-4 py-3">
                              <p className="text-[10px] font-black text-slate-900 truncate max-w-[100px]">{item.name}</p>
                              <span className="text-[8px] font-medium text-slate-400 uppercase tracking-tighter">#{item.productId}</span>
                            </td>
                            <td className="px-2 py-3">
                              <span className="text-[7px] font-black bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded uppercase">{item.category?.substring(0, 5)}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-[10px] font-black text-amber-600">
                                {stockGrams >= 1000 ? (stockGrams / 1000).toFixed(1) + "K" : stockGrams + "G"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center">
                    <FaBoxOpen className="mx-auto text-slate-200 mb-2" size={24} />
                    <p className="text-xs font-medium text-slate-400">All stock levels healthy</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => { navigate('/adminpanel/stock-details'); setIsStockDropdown(false); }}
                className="w-full py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition"
              >
                View Full Inventory
              </button>
            </div>
          )}
        </div>

        {/* 👤 Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setIsProfileDropdown(!isProfileDropdown); setIsOrderDropdown(false); setIsStockDropdown(false); }}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[15px] shadow-md shadow-emerald-200 transition cursor-pointer"
          >
            {(adminName || "A").charAt(0).toUpperCase()}
          </button>
          {isProfileDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {/* Profile card */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {(adminName || "A").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 leading-tight">{adminName}</p>
                  <p className="text-[10px] text-emerald-600 font-medium">Administrator</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/adminpanel/profile')}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition text-left"
              >
                <FaUserCircle className="text-emerald-500" size={15} /> Profile
              </button>
              <button
                onClick={() => navigate('/adminpanel/settings')}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition text-left"
              >
                <FaCog className="text-emerald-500" size={14} /> Settings
              </button>
              <button
                onClick={() => { if (typeof handleLogout === 'function') handleLogout(); else navigate('/login'); }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition text-left border-t border-gray-100"
              >
                <FaSignOutAlt size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
