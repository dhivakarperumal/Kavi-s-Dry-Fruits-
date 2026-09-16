import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck, FaSearch } from "react-icons/fa";

/**
 * CustomSelect - Beautiful, brand-consistent dropdown component.
 * Replaces native <select> elements, eliminating OS-native blue highlight on hover/focus.
 */
const CustomSelect = ({
  value,
  onChange,
  options = [],
  children,
  placeholder = "Select an option",
  name = "",
  disabled = false,
  required = false,
  className = "",
  buttonClassName = "",
  dropdownClassName = "",
  searchable = undefined, // auto-enabled if options count >= 8
  icon = null,
  iconRight = null,
  align = "left", // 'left' | 'right'
  badgeVariant = false, // if true, styles trigger as status badge
  statusColorMap = null, // custom status color styling
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options from either options prop or children (<option> tags)
  const normalizedOptions = React.useMemo(() => {
    if (options && options.length > 0) {
      return options.map((opt) => {
        if (typeof opt === "object" && opt !== null) {
          const val = opt.value !== undefined ? opt.value : opt.id || opt.name;
          const lbl = opt.label !== undefined ? opt.label : opt.name || opt.title || String(val);
          return {
            value: val,
            label: lbl,
            sublabel: opt.sublabel || (opt.productId && opt.productId !== val ? opt.productId : null),
            type: opt.type,
            disabled: opt.disabled || false,
            data: opt,
          };
        }
        return {
          value: opt,
          label: String(opt),
          sublabel: null,
          disabled: false,
        };
      });
    }

    // Extract options from React children (<option>)
    if (children) {
      const extracted = [];
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === "option") {
          extracted.push({
            value: child.props.value !== undefined ? child.props.value : child.props.children,
            label: child.props.children || child.props.value,
            disabled: child.props.disabled || false,
          });
        }
      });
      return extracted;
    }

    return [];
  }, [options, children]);

  // Determine if search bar inside dropdown should be shown
  const isSearchEnabled = searchable !== undefined ? searchable : normalizedOptions.length >= 8;

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm.trim()) return normalizedOptions;
    const term = searchTerm.toLowerCase();
    return normalizedOptions.filter((opt) => {
      const matchLabel = String(opt.label || "").toLowerCase().includes(term);
      const matchValue = String(opt.value || "").toLowerCase().includes(term);
      const matchSub = opt.sublabel ? String(opt.sublabel).toLowerCase().includes(term) : false;
      return matchLabel || matchValue || matchSub;
    });
  }, [normalizedOptions, searchTerm]);

  // Find currently selected option
  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && isSearchEnabled && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, isSearchEnabled]);

  // Handle keyboard events (Escape to close)
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleSelect = (opt) => {
    if (opt.disabled) return;
    if (onChange) {
      // Support standard form event signature: e.target.value & e.target.name
      const syntheticEvent = {
        target: {
          name,
          value: opt.value,
        },
      };
      onChange(syntheticEvent, opt.value);
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  // Status color pill logic for order pipeline
  const getBadgeStyle = (val) => {
    if (statusColorMap && statusColorMap[val]) {
      return statusColorMap[val];
    }
    switch (val) {
      case "Order Placed":
        return "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100/70";
      case "Order Confirmed":
        return "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100/70";
      case "Processing":
        return "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100/70";
      case "Shipped":
        return "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100/70";
      case "Out for Delivery":
        return "bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100/70";
      case "Delivered":
        return "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/70";
      case "Cancelled":
        return "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100/70";
      case "Returned":
        return "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100/70";
      case "Refunded":
        return "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70";
      default:
        return "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70";
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`relative inline-block text-left ${isOpen ? "z-50" : ""} ${className}`}
    >
      {/* Hidden input for HTML form validation if required */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value ?? ""}
          required={required}
          readOnly
        />
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2.5 transition-all text-left outline-none cursor-pointer select-none ${
          badgeVariant
            ? `px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getBadgeStyle(
                value
              )}`
            : buttonClassName ||
              "bg-white border border-slate-200 hover:border-emerald-500/50 focus:border-emerald-600 rounded-2xl px-5 py-3.5 font-black text-slate-900 text-xs shadow-sm"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${
          isOpen && !badgeVariant ? "ring-2 ring-emerald-500/20 border-emerald-600" : ""
        }`}
      >
        <span className="flex items-center gap-2 truncate flex-1">
          {icon && <span className="text-emerald-600 shrink-0">{icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : <span className="text-slate-400 font-bold">{placeholder}</span>}
          </span>
        </span>

        <span className="flex items-center gap-1.5 shrink-0 ml-1">
          {iconRight}
          <FaChevronDown
            size={10}
            className={`transition-transform duration-300 ${
              badgeVariant ? "text-current opacity-70" : "text-slate-400"
            } ${isOpen ? "rotate-180 text-emerald-600" : ""}`}
          />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[1000] min-w-[12rem] w-full animate-in fade-in zoom-in-95 duration-150 ${
            align === "right" ? "right-0" : "left-0"
          } ${dropdownClassName}`}
          style={{ maxHeight: "360px" }}
        >
          {/* Optional Search Bar */}
          {isSearchEnabled && (
            <div className="p-2.5 border-b border-slate-100 bg-slate-50/70 sticky top-0 z-10">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 transition-all placeholder:text-slate-400"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="py-1.5 overflow-y-auto custom-scrollbar" style={{ maxHeight: "280px" }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const isSelected = String(opt.value) === String(value);

                return (
                  <div
                    key={`${opt.value}-${idx}`}
                    onClick={() => handleSelect(opt)}
                    className={`px-4 py-2.5 text-xs font-black cursor-pointer transition-all flex items-center justify-between gap-3 select-none ${
                      opt.disabled
                        ? "opacity-40 cursor-not-allowed bg-slate-50 text-slate-400"
                        : isSelected
                        ? "bg-[#009669] text-white shadow-sm"
                        : "text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 active:bg-emerald-100"
                    }`}
                  >
                    <div className="truncate flex-1">
                      <div className="truncate">{opt.label}</div>
                      {opt.sublabel && (
                        <div
                          className={`text-[10px] font-bold tracking-tight truncate ${
                            isSelected ? "text-emerald-100" : "text-slate-400"
                          }`}
                        >
                          {opt.sublabel}
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <FaCheck size={11} className="text-white shrink-0 animate-in zoom-in duration-150" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-6 text-center text-xs font-bold text-slate-400">
                No matching options
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
