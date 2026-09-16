import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaEnvelope, FaExclamationTriangle, FaTimes, FaExternalLinkAlt } from "react-icons/fa";

/**
 * WhatsApp Web styled notification toast item.
 */
const ToastItem = ({ toast, onDismiss, onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);

  const duration = toast.duration || 8000;

  useEffect(() => {
    if (isHovered) return;

    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onDismiss(toast.id);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isHovered, duration, toast.id, onDismiss]);

  const handleClick = (e) => {
    // Don't navigate if user clicked the close button
    if (e.target.closest(".close-toast-btn")) return;
    if (toast.link) {
      onNavigate(toast.link);
      onDismiss(toast.id);
    }
  };

  // Color & Icon configuration based on type
  const config = {
    order: {
      bgAccent: "bg-emerald-600",
      lightBg: "bg-emerald-50",
      badgeBorder: "border-emerald-200",
      badgeText: "text-emerald-700",
      badgeBg: "bg-emerald-100",
      barColor: "bg-emerald-500",
      icon: <FaShoppingCart className="text-white text-base" />,
      tag: "NEW ORDER",
    },
    lowStock: {
      bgAccent: "bg-amber-500",
      lightBg: "bg-amber-50",
      badgeBorder: "border-amber-200",
      badgeText: "text-amber-800",
      badgeBg: "bg-amber-100",
      barColor: "bg-amber-500",
      icon: <FaExclamationTriangle className="text-white text-base" />,
      tag: "LOW STOCK ALERT",
    },
    contact: {
      bgAccent: "bg-teal-600",
      lightBg: "bg-teal-50",
      badgeBorder: "border-teal-200",
      badgeText: "text-teal-800",
      badgeBg: "bg-teal-100",
      barColor: "bg-teal-500",
      icon: <FaEnvelope className="text-white text-base" />,
      tag: "CONTACT INQUIRY",
    },
  }[toast.type] || {
    bgAccent: "bg-emerald-600",
    lightBg: "bg-emerald-50",
    badgeBorder: "border-emerald-200",
    badgeText: "text-emerald-700",
    badgeBg: "bg-emerald-100",
    barColor: "bg-emerald-500",
    icon: <FaShoppingCart className="text-white text-base" />,
    tag: "NOTIFICATION",
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      className="pointer-events-auto group relative w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-slate-200/80 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_16px_50px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 animate-slide-in-right"
      style={{
        animation: "slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {/* Circular avatar badge */}
          <div
            className={`w-7 h-7 rounded-full ${config.bgAccent} flex items-center justify-center shadow-sm`}
          >
            {config.icon}
          </div>
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`}
          >
            {config.tag}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-slate-400">Just now</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(toast.id);
            }}
            className="close-toast-btn w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition"
            title="Dismiss"
          >
            <FaTimes size={11} />
          </button>
        </div>
      </div>

      {/* Main Notification Content */}
      <div className="p-3.5 flex flex-col gap-1">
        <h4 className="text-sm font-bold text-slate-800 leading-snug">
          {toast.title}
        </h4>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {toast.message}
        </p>

        {toast.secondary && (
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
            {toast.secondary}
          </p>
        )}

        {/* Action hint */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-700 group-hover:text-emerald-800">
          <span className="flex items-center gap-1.5">
            <span>Click to view details</span>
            <FaExternalLinkAlt size={10} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>

      {/* Auto-dismiss progress bar */}
      <div className="h-1 w-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full ${config.barColor} transition-[width] duration-75 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

/**
 * Container component pinned at the bottom-right of the viewport.
 */
export const WhatsAppNotificationContainer = ({ toasts = [], onDismiss, onNavigate }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
      <aside
        aria-label="Notifications"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99999] flex flex-col gap-3 w-[calc(100vw-2rem)] sm:w-96 max-w-full pointer-events-none"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
            onNavigate={onNavigate}
          />
        ))}
      </aside>
    </>
  );
};

export default WhatsAppNotificationContainer;
