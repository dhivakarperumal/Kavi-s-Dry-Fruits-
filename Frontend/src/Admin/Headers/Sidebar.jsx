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
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Sidebar = ({
  isOpen,
  setActiveSection,
  activeSection,
  collectionCounts = {},
  lowStockCount = 0,
  setIsOpen,
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
        { label: "Migrate Pricing", icon: <MdOutlineAddBox /> },
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
      className={`fixed inset-y-0 left-0 z-[60] w-72 transform shadow lg:shadow-md bg-white text-black transition-transform duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo and Mobile Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src="/images/Kavi_logo.png"
            alt="Kavi's Dry Fruits Logo"
            className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="text-lg md:text-xl font-bold text-gray-800 truncate">Kavi's Dry Fruits</span>
        </Link>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 hover:text-black">
          ✕
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex flex-col px-2 py-5 h-full overflow-y-auto max-h-[calc(100vh-80px)]">
        {SideBarmenu.map((item) => {
          const count =
            item.label === "Stock Details" ? lowStockCount : collectionCounts[item.label] || 0;
          const showBadge = item.collection && count > 0 && activeSection !== item.label;
          const isActiveParent = activeSection === item.label || (item.dropdown && item.dropdown.some(sub => sub.label === activeSection));

          return (
            <div key={item.label} className="mb-1">
              <button
                onClick={() => handleClick(item)}
                className={`flex justify-between items-center w-full text-left px-4 py-4 rounded font-semibold cursor-pointer transition-all capitalize ${
                  isActiveParent
                    ? "bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white"
                    : "hover:bg-gradient-to-r hover:from-green-400 hover:via-green-500 hover:to-green-600 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2 ">
                  {item.icon} {item.label}
                </span>

                {item.dropdown ? (
                  <span className="text-lg">
                    {openDropdown === item.label ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                ) : (
                  showBadge && (
                    <span className="text-xs px-2 rounded-full bg-white text-green-600 font-semibold">
                      {count}
                    </span>
                  )
                )}
              </button>

              {/* Dropdown */}
              {item.dropdown && (
                <div
                  className={`flex flex-col ml-6 mt-1 overflow-hidden transition-all cursor-pointer duration-300 ${
                    openDropdown === item.label ? "max-h-60" : "max-h-0"
                  }`}
                >
                  {item.dropdown.map((subItem) => (
                    <button
                      key={subItem.label}
                      onClick={() => {
                        setActiveSection(subItem.label);
                        if (typeof setIsOpen === 'function') setIsOpen(false);
                      }}
                      className={`flex items-center gap-2 text-left px-4 py-2.5 font-semibold rounded text-sm transition-all cursor-pointer capitalize ${
                        activeSection === subItem.label
                          ? "bg-green-600 text-white"
                          : "hover:bg-green-500 hover:text-white"
                      }`}
                    >
                      {subItem.icon} {subItem.label}
                      {subItem.collection && collectionCounts[subItem.label] > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white text-green-600 cursor-pointer font-semibold ml-2">
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
          className="flex items-center gap-2 px-4 py-2 mt-1 text-sm font-semibold rounded hover:bg-green-600 hover:text-white transition-colors"
        >
          <FaHome /> Back to Site
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
