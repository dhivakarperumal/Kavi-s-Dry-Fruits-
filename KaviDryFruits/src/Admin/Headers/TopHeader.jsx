import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Topbar = ({ setIsSidebarOpen, activeSection, adminName, todayOrdersCount, lowStockCount, ordersold, handleLogout }) => {
  const [isOrderDropdown, setIsOrderDropdown] = useState(false);
  const [isStockDropdown, setIsStockDropdown] = useState(false);
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);

  const orderRef = useRef();
  const stockRef = useRef();
  const profileRef = useRef();

  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (orderRef.current && !orderRef.current.contains(event.target)) {
        setIsOrderDropdown(false);
      }
      if (stockRef.current && !stockRef.current.contains(event.target)) {
        setIsStockDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-white text-black shadow border-b border-gray-200">
      
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-2 rounded hover:bg-gray-100 transition text-gray-700"
        >
          <FaBars size={20} />
        </button>

        {/* Section title */}
        <div className=" hidden sm:flex flex-col">
          <h1 className="text-xl font-bold text-gray-800 capitalize">{activeSection}</h1>
          <span className="text-sm text-gray-600">Hello, {adminName}! Welcome back.</span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Orders Dropdown */}
        <div className="relative" ref={orderRef}>
          <button
            onClick={() => setIsOrderDropdown(!isOrderDropdown)}
            className="relative w-10 h-10 rounded-full bg-white flex items-center cursor-pointer justify-center text-indigo-600 font-bold text-lg shadow-md"
          >
            <FaBell size={18} />
            {todayOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs font-bold px-1.5 rounded-full ">
                {todayOrdersCount}
              </span>
            )}
          </button>
          {isOrderDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg py-2 border border-gray-200">
              <p className="px-4 py-2 font-medium hover:bg-gray-100 cursor-pointer">
                Today's Orders: {todayOrdersCount}
              </p>
            </div>
          )}
        </div>

        {/* Low Stock Dropdown */}
        <div className="relative" ref={stockRef}>
          <button
            onClick={() => setIsStockDropdown(!isStockDropdown)}
            className="relative w-10 h-10 rounded-full bg-white flex items-center cursor-pointer justify-center text-indigo-600 font-bold text-lg shadow-md"
          >
            S
            {lowStockCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs font-bold px-1.5 rounded-full ">
                {lowStockCount}
              </span>
            )}
          </button>
          {isStockDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded cursor-pointer shadow-lg py-2 border border-gray-200">
              <p className="px-4 py-2 font-medium hover:bg-gray-100 cursor-pointer">
                Low Stock Items: {lowStockCount}
              </p>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileDropdown(!isProfileDropdown)}
            className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 font-bold text-lg shadow-md cursor-pointer"
          >
            {adminName.charAt(0).toUpperCase()}
          </button>
          {isProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg py-2 cursor-pointer border border-gray-200">
              <p onClick={() => navigate('/adminpanel')} className="px-4 py-2 font-medium hover:bg-gray-100 cursor-pointer">Profile</p>
              <p onClick={() => { if (typeof handleLogout === 'function') { handleLogout(); } else { navigate('/login'); } }} className="px-4 py-2 font-medium hover:bg-gray-100 cursor-pointer">Logout</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
