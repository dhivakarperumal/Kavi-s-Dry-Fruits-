import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineStock,
  AiOutlineLogout
} from "react-icons/ai";
import { FaHome, FaUsersCog, FaDropbox, FaUsers, FaStickyNote, FaFileInvoice, FaSearch } from "react-icons/fa";
import {
  MdDashboard,
  MdOutlineProductionQuantityLimits,
  MdCategory,
  MdOutlineInventory2,
  MdOutlineAddBox,
  MdDeliveryDining,
  MdOutlineCancelPresentation,
  MdPreview,
  MdPrint,
  MdSettings
} from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp, IoIosArrowBack } from "react-icons/io";

const Sidebar = ({
  isOpen,
  setActiveSection,
  activeSection,
  collectionCounts = {},
  lowStockCount = 0,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const SideBarmenu = [
    { label: "dashboard", icon: <MdDashboard /> },

    {
      label: "products",
      icon: <MdOutlineProductionQuantityLimits />,
      dropdown: [
        // { label: "Add Products", icon: <MdOutlineAddBox /> },
        { label: "All Products", icon: <MdOutlineInventory2 /> },
        { label: "Add Category", icon: <MdCategory /> },
        { label: "Stock Details", collection: "products", icon: <AiOutlineStock /> },

      ],
    },

    // {
    //   label: "users",
    //   icon: <FaUsersCog />,
    //   dropdown: [
    //     { label: "New Users", collection: "users", icon: <FaUsers /> },
    //     { label: "All Users", collection: "users", icon: <FaUsers /> },
    //   ],
    // },

    {
      label: "Orders",
      icon: <FaDropbox />,
      dropdown: [
        { label: "New Orders", collection: "New Orders", icon: <MdDeliveryDining /> },
        { label: "All Orders", icon: <FaDropbox /> },
        { label: "Delivered Orders", icon: <MdDeliveryDining /> },
        { label: "Cancel Orders", icon: <MdOutlineCancelPresentation /> },
        { label: "Returned Orders", icon: <MdOutlineCancelPresentation /> },
      ],
    },

    { label: "Stickers", icon: <FaStickyNote /> },
    // { label: "Dealer", icon: <FaUsers /> },
    // { label: "Reviews", icon: <MdPreview /> },
    { label: "SEO Keywords", icon: <FaSearch /> },
    // { label: "Invoice", icon: <FaFileInvoice /> },
    { label: "Billing", icon: <MdPrint /> },


    {
      label: "Health Benefits",
      icon: <MdPreview />,
      dropdown: [
        { label: "Add Health Benefit", icon: <MdOutlineAddBox /> },
        { label: "View Health Benefits", icon: <MdOutlineInventory2 /> },
      ],
    },


  ];

  const handleClick = (item) => {
    if (item.dropdown) {
      // Toggle this dropdown; close if already open
      setOpenDropdown(openDropdown === item.label ? null : item.label);
    } else {
      setActiveSection(item.label);
      setOpenDropdown(null); // close any open dropdown
      if (typeof setIsOpen === 'function') setIsOpen(false);
    }
  };

  useEffect(() => {
    const parent = SideBarmenu.find(item => {
      let active = activeSection === "Create Billing" ? "Billing" : activeSection;
      if (active === "Add Products") active = "All Products";
      return item.label === active ||
      (item.dropdown && item.dropdown.some(sub => sub.label === active));
    });
    if (parent && parent.dropdown) {
      // Open the parent dropdown of the active section
      setOpenDropdown(parent.label);
    } else {
      // No parent dropdown — close all dropdowns
      setOpenDropdown(null);
    }
  }, [activeSection]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 flex flex-col z-[60] transform shadow-2xl transition-all duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-20" : "w-72"}`}
      style={{
        background: "linear-gradient(160deg, #064e3b 0%, #065f46 40%, #064e3b 80%, #064e3b 100%)",
        color: "#ecfdf5"
      }}
    >
      {/* ========== COLLAPSE BUTTON ========== */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="
          hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2
          w-9 h-9 rounded-full
          bg-emerald-600
          shadow-xl shadow-emerald-500/40
          items-center justify-center
          text-white hover:scale-110 transition-all z-50
        "
      >
        <IoIosArrowBack
          className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Logo and Mobile Header */}
      <div
        className="relative flex items-center justify-between border-b border-white/10"
        style={{
          background: "rgba(0,0,0,0.25)",
          padding: isCollapsed ? "14px 12px" : "14px 16px",
        }}
      >
        <Link
          to="/"
          className={`flex items-center gap-3 min-w-0 hover:opacity-90 transition-opacity ${isCollapsed ? "w-full justify-center" : ""}`}
        >
          {/* Logo avatar — white bg so the PNG shows clearly */}
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-2xl bg-white"
            style={{
              width: isCollapsed ? "40px" : "46px",
              height: isCollapsed ? "40px" : "46px",
              boxShadow: "0 0 0 2px #34d399, 0 0 16px rgba(52,211,153,0.45)",
              padding: "4px",
            }}
          >
            <img
              src="/images/Kavi_logo.png"
              alt="Kavi's Dry Fruits"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  `<span style="font-size:1.5rem;font-weight:900;color:#065f46;font-family:Georgia,serif;line-height:1;">K</span>`;
              }}
            />
          </div>

          {/* Brand text */}
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span
                className="font-black text-[15px] leading-tight tracking-wide truncate"
                style={{
                  background: "linear-gradient(90deg, #fff 30%, #6ee7b7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Kavi's Dry Fruits
              </span>
              <span
                className="inline-block mt-[3px] text-[9px] font-bold tracking-[0.18em] uppercase rounded-full px-2 py-[1px] w-fit"
                style={{
                  background: "rgba(52,211,153,0.18)",
                  color: "#6ee7b7",
                  border: "1px solid rgba(52,211,153,0.3)",
                }}
              >
                Admin Panel
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        {!isCollapsed && (
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden ml-2 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition-all text-base"
          >
            ✕
          </button>
        )}
      </div>

      {/* Sidebar Menu */}
      <nav className="flex flex-col flex-1 px-2 py-5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {SideBarmenu.map((item) => {
          let effectiveActiveSection = activeSection === "Create Billing" ? "Billing" : activeSection;
          if (effectiveActiveSection === "Add Products") effectiveActiveSection = "All Products";
          const count =
            item.label === "Stock Details" ? lowStockCount : collectionCounts[item.label] || 0;
          const showBadge = item.collection && count > 0 && effectiveActiveSection !== item.label;
          const isActiveParent = effectiveActiveSection === item.label || (item.dropdown && item.dropdown.some(sub => sub.label === effectiveActiveSection));

          return (
            <div key={item.label} className="mb-1">
              <button
                onClick={() => handleClick(item)}
                className={`flex justify-between items-center w-full text-left px-4 py-3.5 font-bold cursor-pointer transition-all capitalize ${effectiveActiveSection === item.label
                  ? "bg-gradient-to-r from-white/20 to-white/5 text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] border-l-[4px] border-[#6ee7b7] rounded-r-xl"
                  : isActiveParent
                    ? "bg-white/10 text-white rounded-xl"
                    : "text-emerald-100 hover:bg-white/10 hover:text-white rounded-xl"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`text-[1.25rem] flex-shrink-0 p-2 rounded-lg flex items-center justify-center transition-colors ${effectiveActiveSection === item.label
                      ? "bg-white text-[#064e3b] shadow-md"
                      : "bg-white/10 text-emerald-100 shadow-sm border border-white/5"
                    }`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span>{item.label}</span>}
                </span>

                {!isCollapsed && (item.dropdown ? (
                  <span className="text-lg">
                    {openDropdown === item.label ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                ) : (
                  showBadge && (
                    <span className="text-xs px-2 rounded-full bg-white/20 text-white font-bold shadow-sm">
                      {count}
                    </span>
                  )
                ))}
              </button>

              {/* Dropdown */}
              {item.dropdown && (
                <div
                  className={`flex flex-col ml-6 mt-1 overflow-hidden transition-all cursor-pointer duration-500 ${openDropdown === item.label ? "max-h-[500px]" : "max-h-0"
                    }`}
                >
                  {item.dropdown.map((subItem) => (
                    <button
                      key={subItem.label}
                      onClick={() => {
                        setActiveSection(subItem.label);
                        if (typeof setIsOpen === 'function') setIsOpen(false);
                      }}
                      className={`flex items-center gap-3 text-left px-4 py-3 font-bold text-sm transition-all cursor-pointer capitalize ${effectiveActiveSection === subItem.label
                        ? "bg-gradient-to-r from-white/20 to-transparent text-white shadow-md border-l-[3px] border-[#6ee7b7] rounded-r-lg mb-1"
                        : "text-emerald-200 hover:bg-white/10 hover:text-white rounded-lg mb-1"
                        }`}
                    >
                      <span className={`text-[1.1rem] flex-shrink-0 p-1.5 rounded-md flex items-center justify-center transition-colors ${effectiveActiveSection === subItem.label
                          ? "bg-white text-[#064e3b] shadow-sm"
                          : "bg-white/10 text-emerald-200 border border-white/5"
                        }`}>
                        {subItem.icon}
                      </span>
                      {!isCollapsed && <span className="truncate">{subItem.label}</span>}
                      {!isCollapsed && subItem.collection && collectionCounts[subItem.label] > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white cursor-pointer font-bold ml-2 shadow-sm">
                          {collectionCounts[subItem.label]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

      </nav>

      {/* Back to Home - Pinned to Bottom */}
      <div className="p-4 border-t border-white/10 mt-auto bg-black/20">
        <Link
          to="/"
          className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/10 shadow-md transition-colors ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
          <span className="text-[1.25rem] flex-shrink-0"><FaHome /></span>
          {!isCollapsed && <span>Back to Home</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
