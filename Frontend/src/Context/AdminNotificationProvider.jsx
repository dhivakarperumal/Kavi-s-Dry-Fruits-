import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../PrivateRouter/AuthContext";
import api from "../services/api";
import adminDataService from "../services/adminDataService";
import { playNotificationSound } from "../utils/notificationAudio";
import WhatsAppNotificationContainer from "../Component/WhatsAppNotificationToast";

const AdminNotificationContext = createContext(null);

export const useAdminNotification = () => useContext(AdminNotificationContext);

export const AdminNotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [toasts, setToasts] = useState([]);
  const [desktopPermission, setDesktopPermission] = useState(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const socketRef = useRef(null);

  const isAdmin = user && (user.role === "admin" || user.isAdmin === true);

  // Check if desktop notification permission can be prompted
  useEffect(() => {
    if (isAdmin && typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        setShowPermissionPrompt(true);
      } else {
        setDesktopPermission(Notification.permission);
        setShowPermissionPrompt(false);
      }
    } else {
      setShowPermissionPrompt(false);
    }
  }, [isAdmin]);

  const requestDesktopPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        setDesktopPermission(perm);
        setShowPermissionPrompt(false);
      } catch (e) {
        console.warn("Desktop notification permission error:", e);
      }
    }
  };

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleNavigate = useCallback((link) => {
    if (!link) return;
    // For hash router compatibility, update hash directly
    if (link.startsWith("/")) {
      window.location.hash = "#" + link;
    } else {
      window.location.hash = "#/" + link;
    }
  }, []);

  const triggerDesktopNotification = useCallback((title, body, link) => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        const notif = new Notification(title, {
          body: body || "",
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          tag: title + (body || ""),
        });
        notif.onclick = () => {
          window.focus();
          handleNavigate(link);
          notif.close();
        };
      } catch (err) {
        console.warn("Desktop notification error:", err);
      }
    }
  }, [handleNavigate]);

  const addNotification = useCallback(({ type, title, message, secondary, link, sound = true }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);

    if (sound) {
      playNotificationSound(type);
    }

    setToasts((prev) => [
      ...prev.slice(-3), // keep maximum 4 notifications stacked
      {
        id,
        type, // 'order' | 'lowStock' | 'contact'
        title,
        message,
        secondary,
        link,
        duration: 8000,
      },
    ]);

    triggerDesktopNotification(title, message, link);
  }, [triggerDesktopNotification]);

  // Establish socket connection for admin
  useEffect(() => {
    if (!isAdmin) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socketUrl = (api.defaults.baseURL || "http://localhost:5000").replace("/api", "");
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
    });
    socketRef.current = socket;

    // 1. New Order Received
    socket.on("newOrder", (data = {}) => {
      const orderId = data.orderId || "N/A";
      const totalAmount = data.totalAmount ? `₹${data.totalAmount}` : "";
      const clientName = data.clientName || "Customer";

      addNotification({
        type: "order",
        title: `New Order Received! #${orderId}`,
        message: `${clientName} placed an order${totalAmount ? ` for ${totalAmount}` : ""}.`,
        secondary: "Tap to review in Orders Panel.",
        link: "/adminpanel/all-orders",
      });

      // Update cached admin counts if available
      try {
        const currentCache = adminDataService.getCache();
        if (currentCache) {
          adminDataService.setCache({
            ...currentCache,
            orders: (currentCache.orders || 0) + 1,
          });
        }
      } catch (e) {}
    });

    // 2. Low Stock Alert (Threshold <= 500g)
    socket.on("lowStockAlert", (data = {}) => {
      const productName = data.name || "Product";
      const remainingStock = data.remainingStock !== undefined ? `${data.remainingStock}g` : "0g";
      const isZero = Number(data.remainingStock || 0) <= 0;

      addNotification({
        type: "lowStock",
        title: isZero ? `Out of Stock: ${productName}!` : `Low Stock Alert: ${productName}`,
        message: `Inventory has dropped to ${remainingStock} (Threshold: 500g).`,
        secondary: data.category ? `Category: ${data.category}` : "Stock update required",
        link: "/adminpanel/stock-details",
      });
    });

    // 3. Contact Form Submission
    socket.on("newContactMessage", (data = {}) => {
      const senderName = data.name || "A visitor";
      const contactInfo = data.phone || data.email || "";
      const preview = data.subject || data.message || "New message received.";

      addNotification({
        type: "contact",
        title: `New Contact Message from ${senderName}`,
        message: preview.length > 90 ? preview.substring(0, 90) + "..." : preview,
        secondary: contactInfo ? `Contact: ${contactInfo}` : "Via Contact Form",
        link: "/adminpanel/contact-form",
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAdmin, addNotification]);

  return (
    <AdminNotificationContext.Provider
      value={{
        toasts,
        addNotification,
        dismissToast,
        requestDesktopPermission,
        desktopPermission,
      }}
    >
      {children}

      {/* WhatsApp Web styled bottom-right floating notifications */}
      {isAdmin && (
        <WhatsAppNotificationContainer
          toasts={toasts}
          onDismiss={dismissToast}
          onNavigate={handleNavigate}
        />
      )}

      {/* Optional unobtrusive Desktop Notification Permission Banner */}
      {isAdmin && showPermissionPrompt && (
        <div className="fixed bottom-4 left-4 sm:left-6 z-[99998] bg-slate-900/90 backdrop-blur-md text-white text-xs px-3.5 py-2.5 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-fade-in">
          <span>🔔 Enable desktop notifications for orders & alerts?</span>
          <button
            onClick={requestDesktopPermission}
            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 font-bold rounded-lg text-[11px] transition shadow cursor-pointer"
          >
            Enable
          </button>
          <button
            onClick={() => setShowPermissionPrompt(false)}
            className="text-slate-400 hover:text-white text-xs font-semibold px-1"
          >
            ✕
          </button>
        </div>
      )}
    </AdminNotificationContext.Provider>
  );
};

export default AdminNotificationProvider;
