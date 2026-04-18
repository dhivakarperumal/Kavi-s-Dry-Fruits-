import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaBell, FaBoxOpen, FaSignOutAlt, FaUserCircle, FaSearch, FaCog, FaUsers } from "react-icons/fa";
import { MdWarning } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Topbar = ({
  setIsSidebarOpen,
  activeSection,
  adminName = "Administrator",
  todayOrdersCount = 0,
  lowStockCount = 0,
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
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 bg-white border-b border-gray-200 shadow-sm">

      {/* ── LEFT: Hamburger + Title ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 transition"
        >
          <FaBars size={18} />
        </button>

        <div className="hidden sm:flex flex-col leading-tight">
          <h1 className="text-[17px] font-bold text-gray-800 capitalize">{activeSection}</h1>
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
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="px-4 py-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest border-b border-gray-100">
                Orders
              </div>
              <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50 transition">
                <FaBoxOpen className="text-emerald-500" />
                Today's Orders: <span className="font-bold ml-auto">{todayOrdersCount}</span>
              </div>
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
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="px-4 py-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest border-b border-gray-100">
                Stock Alerts
              </div>
              <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-amber-50 transition">
                <MdWarning className="text-amber-400" />
                Low Stock: <span className="font-bold ml-auto">{lowStockCount}</span>
              </div>
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
