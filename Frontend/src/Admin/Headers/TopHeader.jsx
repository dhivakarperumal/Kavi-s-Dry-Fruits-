import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaBell, FaBoxOpen, FaSignOutAlt, FaUserCircle, FaSearch, FaCog, FaUsers, FaFileInvoice } from "react-icons/fa";
import { MdWarning } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Topbar = ({
  setIsSidebarOpen,
  activeSection,
  setActiveSection,
  adminName = "Administrator",
  todayOrdersCount = 0,
  todayOrdersList = [],
  lowStockCount = 0,
  lowStockItems = [],
  allProducts = [],
  allOrders = [],
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
            overflow: showSearch ? "visible" : "hidden",
            maxWidth: showSearch ? "220px" : "0px",
            opacity: showSearch ? 1 : 0,
            transition: "max-width 0.3s ease, opacity 0.25s ease",
          }}
        >
          <div className="relative" style={{ width: "220px" }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search orders, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
            />
            {/* Search Results Dropdown */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[70] max-h-96 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 origin-top">
                <div className="p-3 bg-slate-50 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Search Results</span>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Live</span>
                </div>
                
                {/* Product Results */}
                {allProducts.filter(p => 
                  String(p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                  String(p.productId || "").toLowerCase().includes(searchQuery.toLowerCase())
                ).slice(0, 3).map(product => (
                  <button
                    key={`p-${product.id}`}
                    onClick={() => { setActiveSection("All Products"); setShowSearch(false); setSearchQuery(""); }}
                    className="w-full flex items-center gap-3 p-4 hover:bg-emerald-50 transition-colors border-b border-gray-50 text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <FaBoxOpen size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">{product.name}</p>
                      <p className="text-[9px] font-medium text-slate-400 uppercase">Product #{product.productId}</p>
                    </div>
                  </button>
                ))}

                {/* Order Results */}
                {allOrders.filter(o => 
                  String(o.orderId || o.id || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                  String(o.customerName || o.userName || o.clientName || "").toLowerCase().includes(searchQuery.toLowerCase())
                ).slice(0, 3).map(order => (
                  <button
                    key={`o-${order.id}`}
                    onClick={() => { setActiveSection("All Orders"); setShowSearch(false); setSearchQuery(""); }}
                    className="w-full flex items-center gap-3 p-4 hover:bg-blue-50 transition-colors border-b border-gray-50 text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <FaFileInvoice size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">Order #{order.orderId || order.id}</p>
                      <p className="text-[9px] font-medium text-slate-400 uppercase">{order.customerName || order.userName || order.clientName || 'Guest'}</p>
                    </div>
                  </button>
                ))}

                {allProducts.filter(p => String(p.name || "").toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && 
                 allOrders.filter(o => String(o.orderId || o.id || "").toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <div className="p-8 text-center text-slate-400">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaSearch className="opacity-20" size={20} />
                    </div>
                    <p className="text-xs font-medium italic">No matches for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
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
              
              <div className="max-h-80 overflow-y-auto pr-1" style={{ 
                scrollbarWidth: 'thin', 
                scrollbarColor: '#A7F3D0 transparent' 
              }}>
                {todayOrdersList.length > 0 ? (
                  <div className="flex flex-col p-2 gap-2">
                    {todayOrdersList.map((order, idx) => {
                      const customerName = order.clientName || order.fullname || order.userName || order.shippingAddress?.fullname || "Guest User";
                      return (
                        <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 hover:bg-emerald-50/50 hover:border-emerald-100 transition-all group">
                          <div className="flex justify-between items-start mb-2">
                            <div className="min-w-0">
                              <p className="text-[11px] font-black text-slate-900 truncate pr-2 capitalize">{customerName}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Order #{order.orderId || order.id}</p>
                            </div>
                            <span className="text-[11px] font-black text-emerald-600">₹{order.totalAmount || order.totalPrice || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                              order.orderStatus === 'Pending' ? 'bg-amber-100 text-amber-600' : 
                              order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>{order.orderStatus}</span>
                            <button 
                              onClick={() => { navigate('/adminpanel/all-orders'); setIsOrderDropdown(false); }}
                              className="text-[9px] font-black text-slate-300 hover:text-emerald-600 uppercase tracking-widest transition-colors"
                            >
                              Details →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
              
              <div className="max-h-80 overflow-y-auto pr-1" style={{ 
                scrollbarWidth: 'thin', 
                scrollbarColor: '#A7F3D0 transparent' 
              }}>
                {lowStockItems.length > 0 ? (
                  <div className="flex flex-col p-2 gap-2">
                    {lowStockItems.map((item, idx) => {
                      const stockGrams = Number(item.totalStock || 0);
                      const isZero = stockGrams <= 0;
                      return (
                        <div key={idx} className="bg-amber-50/20 border border-amber-100/50 rounded-xl p-3 hover:bg-amber-50 transition-all group">
                          <div className="flex justify-between items-start mb-2">
                            <div className="min-w-0">
                              <p className="text-[11px] font-black text-slate-900 truncate pr-2">{item.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Product #{item.productId}</p>
                            </div>
                            <span className={`text-[11px] font-black ${isZero ? 'text-rose-600' : 'text-amber-600'}`}>
                              {stockGrams >= 1000 ? (stockGrams / 1000).toFixed(1) + " KG" : stockGrams + " G"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-200/50">
                              {item.category}
                            </span>
                            <span className={`text-[8px] font-black uppercase ${isZero ? 'text-rose-500' : 'text-amber-500'}`}>
                              {isZero ? 'Out of Stock' : 'Low Stock'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
