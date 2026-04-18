import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  AiOutlineStock, 
  AiOutlineLogout 
} from "react-icons/ai";
import { FaHome, FaUsersCog, FaDropbox, FaUsers, FaStickyNote, FaFileInvoice } from "react-icons/fa";
import { 
  MdDashboard, 
  MdOutlineProductionQuantityLimits, 
  MdCategory, 
  MdOutlineInventory2, 
  MdOutlineAddBox, 
  MdDeliveryDining, 
  MdOutlineCancelPresentation, 
  MdPreview, 
  MdPrint 
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
        { label: "Add Products", icon: <MdOutlineAddBox /> },
        { label: "All Products", icon: <MdOutlineInventory2 /> },
        { label: "Add Category", icon: <MdCategory /> },
        { label: "Stock Details", collection: "products", icon: <AiOutlineStock /> },
        
      ],
    },

    {
      label: "users",
      icon: <FaUsersCog />,
      dropdown: [
        { label: "New Users", collection: "users", icon: <FaUsers /> },
        { label: "All Users", collection: "users", icon: <FaUsers /> },
      ],
    },

    {
      label: "Orders",
      icon: <FaDropbox />,
      dropdown: [
        { label: "New Orders", icon: <MdDeliveryDining /> },
        { label: "All Orders", icon: <FaDropbox /> },
        { label: "Delivered Orders", icon: <MdDeliveryDining /> },
        { label: "Cancel Orders", icon: <MdOutlineCancelPresentation /> },
        { label: "Returned Orders", icon: <MdOutlineCancelPresentation /> },
      ],
    },

    { label: "Stickers", icon: <FaStickyNote /> },
    { label: "Dealer", icon: <FaUsers /> },
    { label: "Reviews", icon: <MdPreview /> },
    { label: "Invoice", icon: <FaFileInvoice /> },
    { label: "Billing", icon: <MdPrint /> },
  ];

  const handleClick = (item) => {
    if (item.dropdown) {
      setOpenDropdown(openDropdown === item.label ? null : item.label);
    } else {
      setActiveSection(item.label);
      if (typeof setIsOpen === 'function') setIsOpen(false);
    }
  };

  useEffect(() => {
    const parent = SideBarmenu.find(item => 
      item.label === activeSection || 
      (item.dropdown && item.dropdown.some(sub => sub.label === activeSection))
    );
    if (parent && parent.dropdown && openDropdown !== parent.label) {
      setOpenDropdown(parent.label);
    }
  }, [activeSection]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[60] transform shadow lg:shadow-md bg-white text-black transition-all duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${isCollapsed ? "w-20" : "w-72"}`}
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
          className={`w-4 h-4 transition-transform duration-300 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Logo and Mobile Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity overflow-hidden">
          <img
            src="/images/Kavi_logo.png"
            alt="Kavi's Dry Fruits Logo"
            className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {!isCollapsed && <span className="text-lg md:text-xl font-bold text-gray-800 truncate">Kavi's Dry Fruits</span>}
        </Link>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 hover:text-black">
          ✕
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex flex-col px-2 py-5 h-full overflow-y-auto max-h-[calc(100vh-80px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {SideBarmenu.map((item) => {
          const count =
            item.label === "Stock Details" ? lowStockCount : collectionCounts[item.label] || 0;
          const showBadge = item.collection && count > 0 && activeSection !== item.label;
          const isActiveParent = activeSection === item.label || (item.dropdown && item.dropdown.some(sub => sub.label === activeSection));

          return (
            <div key={item.label} className="mb-1">
              <button
                onClick={() => handleClick(item)}
                className={`flex justify-between items-center w-full text-left px-4 py-3.5 rounded-xl font-bold cursor-pointer transition-all capitalize ${
                  activeSection === item.label
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : isActiveParent
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-[1.25rem] flex-shrink-0">{item.icon}</span> 
                  {!isCollapsed && <span>{item.label}</span>}
                </span>

                {!isCollapsed && (item.dropdown ? (
                  <span className="text-lg">
                    {openDropdown === item.label ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                ) : (
                  showBadge && (
                    <span className="text-xs px-2 rounded-full bg-emerald-100 text-emerald-700 font-bold shadow-sm">
                      {count}
                    </span>
                  )
                ))}
              </button>

              {/* Dropdown */}
              {item.dropdown && (
                <div
                  className={`flex flex-col ml-6 mt-1 overflow-hidden transition-all cursor-pointer duration-500 ${
                    openDropdown === item.label ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  {item.dropdown.map((subItem) => (
                    <button
                      key={subItem.label}
                      onClick={() => {
                        setActiveSection(subItem.label);
                        if (typeof setIsOpen === 'function') setIsOpen(false);
                      }}
                      className={`flex items-center gap-3 text-left px-4 py-3 font-bold rounded-lg text-sm transition-all cursor-pointer capitalize ${
                        activeSection === subItem.label
                          ? "bg-emerald-600 text-white shadow-sm mb-1"
                          : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-700 mb-1"
                      }`}
                    >
                      <span className="text-[1.1rem] flex-shrink-0">{subItem.icon}</span> 
                      {!isCollapsed && <span className="truncate">{subItem.label}</span>}
                      {!isCollapsed && subItem.collection && collectionCounts[subItem.label] > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 cursor-pointer font-bold ml-2 shadow-sm">
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

        {/* Back to Site */}
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 mt-1 text-sm font-bold rounded-xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
        >
          <span className="text-[1.25rem] flex-shrink-0"><FaHome /></span> 
          {!isCollapsed && <span>Back to Site</span>}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
