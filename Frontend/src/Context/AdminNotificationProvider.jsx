import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../PrivateRouter/AuthContext";
import api, { SOCKET_URL } from "../services/api";
import adminDataService from "../services/adminDataService";
import { playNotificationSound } from "../utils/notificationAudio";
import WhatsAppNotificationContainer from "../Component/WhatsAppNotificationToast";
import NotificationSoundModal from "../Component/NotificationSoundModal";

const AdminNotificationContext = createContext(null);

export const useAdminNotification = () => useContext(AdminNotificationContext);

export const AdminNotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [toasts, setToasts] = useState([]);
  const [desktopPermission, setDesktopPermission] = useState(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const socketRef = useRef(null);
  const titleIntervalRef = useRef(null);

  const isAdmin = user && (user.role === "admin" || user.isAdmin === true);

  // Sync notification permission status
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setDesktopPermission(Notification.permission);
      if (isAdmin && Notification.permission !== "granted") {
        setShowPermissionPrompt(true);
      } else {
        setShowPermissionPrompt(false);
      }
    } else {
      setShowPermissionPrompt(false);
    }
  }, [isAdmin]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleNavigate = useCallback((link) => {
    if (!link) return;
    if (link.startsWith("/")) {
      window.location.hash = "#" + link;
    } else {
      window.location.hash = "#/" + link;
    }
  }, []);

  // Flash the document title if the tab is hidden / in the background
  const flashTitle = useCallback((alertTitle) => {
    if (typeof document === "undefined" || !document.hidden) return;

    const baseTitle = "Kavi's Dry Fruits";
    let step = 0;

    if (titleIntervalRef.current) {
      clearInterval(titleIntervalRef.current);
    }

    titleIntervalRef.current = setInterval(() => {
      step++;
      document.title = step % 2 === 1 ? `🔔 (1) ${alertTitle}` : baseTitle;
    }, 1000);

    const onFocus = () => {
      if (titleIntervalRef.current) {
        clearInterval(titleIntervalRef.current);
        titleIntervalRef.current = null;
      }
      document.title = baseTitle;
      window.removeEventListener("focus", onFocus);
    };

    window.addEventListener("focus", onFocus);
  }, []);

  // Trigger Windows OS / Browser Native Push Notification (SYNCHRONOUS, DOES NOT HANG)
  const triggerDesktopNotification = useCallback((title, body, link) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const iconUrl = "/Kavi_logo.png";
    let notificationShown = false;

    // 1. Immediate new Notification (runs synchronously and pops up in Windows Action Center)
    try {
      const notif = new Notification(title, {
        body: body || "",
        icon: iconUrl,
        badge: iconUrl,
        tag: `kavi-${Date.now()}`,
        requireInteraction: true, // Keep notification pinned on Windows until user acts
      });

      notif.onclick = () => {
        window.focus();
        handleNavigate(link);
        notif.close();
      };
      notificationShown = true;
    } catch (err) {
      console.warn("Direct Notification constructor failed:", err);
    }

    // 2. Also notify active service worker if present
    if (!notificationShown && navigator.serviceWorker?.controller) {
      try {
        navigator.serviceWorker.controller.postMessage({
          type: "SHOW_NOTIFICATION",
          title,
          body,
          url: link,
        });
      } catch (swErr) {
        console.warn("Service worker message failed:", swErr);
      }
    }
  }, [handleNavigate]);

  // Broadcast alert across other open Chrome tabs (e.g. user tab, shop tab)
  const broadcastToOtherTabs = useCallback((alertData) => {
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("kavi_admin_alerts_channel");
        bc.postMessage(alertData);
        bc.close();
      }
    } catch (e) {}
  }, []);

  // Listen to cross-tab broadcasts so user login tabs ALSO show the notification!
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;

    const bc = new BroadcastChannel("kavi_admin_alerts_channel");
    bc.onmessage = (event) => {
      const alertData = event.data;
      if (!alertData) return;

      // Play sound on this tab too
      playNotificationSound(alertData.type || "default");

      // Flash tab title
      flashTitle(alertData.title);

      // Show bottom-right floating card on this tab!
      setToasts((prev) => [
        ...prev.slice(-3),
        {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
          type: alertData.type || "contact",
          title: alertData.title,
          message: alertData.message,
          secondary: alertData.secondary,
          link: alertData.link,
          duration: 8000,
        },
      ]);
    };

    return () => {
      bc.close();
    };
  }, [flashTitle]);

  const addNotification = useCallback(
    ({ type, title, message, secondary, link, sound = true }) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);

      if (sound) {
        playNotificationSound(type);
      }

      // Flash tab title in browser bar if tab is hidden
      flashTitle(title);

      const alertItem = {
        id,
        type, // 'order' | 'lowStock' | 'contact'
        title,
        message,
        secondary,
        link,
        duration: 8000,
      };

      // Add to local state (renders in bottom-right corner of this tab)
      setToasts((prev) => [...prev.slice(-3), alertItem]);

      // Broadcast to other open Chrome tabs (e.g. user login tab)
      broadcastToOtherTabs(alertItem);

      // Fire native Windows OS Action Center notification
      triggerDesktopNotification(title, message, link);
    },
    [triggerDesktopNotification, flashTitle, broadcastToOtherTabs]
  );

  // Request desktop notification permission and test immediately
  const requestDesktopPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        setDesktopPermission(perm);
        if (perm === "granted") {
          setShowPermissionPrompt(false);
          // Send an immediate test notification so user sees the Windows toast!
          addNotification({
            type: "order",
            title: "🔔 Desktop Notifications Enabled!",
            message: "You will now receive alerts on your screen even when in other tabs or minimized.",
            secondary: "WhatsApp Web-style alerts are active.",
            link: "/adminpanel",
            sound: true,
          });
        } else {
          alert("Notification permission was not granted. Please allow notifications in your browser address bar.");
        }
      } catch (e) {
        console.warn("Desktop notification permission error:", e);
      }
    }
  };

  // Test button for user to verify Windows toast at any time
  const testDesktopNotification = () => {
    addNotification({
      type: "contact",
      title: "🧪 Test Notification (WhatsApp Style)",
      message: "This is a test notification. It appears on your Windows screen even in other tabs!",
      secondary: "Click to open Admin Panel",
      link: "/adminpanel/contact-form",
      sound: true,
    });
  };

  // Establish socket connection for admin
  useEffect(() => {
    if (!isAdmin) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socket = io(SOCKET_URL, {
      transports: ["polling"],
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
        testDesktopNotification,
        desktopPermission,
        openSoundSettings: () => setIsSoundModalOpen(true),
        closeSoundSettings: () => setIsSoundModalOpen(false),
      }}
    >
      {children}

      {/* Sound Settings Modal */}
      {isAdmin && (
        <NotificationSoundModal
          isOpen={isSoundModalOpen}
          onClose={() => setIsSoundModalOpen(false)}
          onTestNotification={testDesktopNotification}
        />
      )}

      {/* WhatsApp Web styled bottom-right floating notifications (renders on ANY open tab that has an alert!) */}
      {toasts.length > 0 && (
        <WhatsAppNotificationContainer
          toasts={toasts}
          onDismiss={dismissToast}
          onNavigate={handleNavigate}
        />
      )}

      {/* Prominent Notification Permission Banner if not yet allowed */}
      {isAdmin && showPermissionPrompt && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999999] max-w-lg w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 animate-bounce-short">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div className="text-left">
              <p className="font-bold text-xs sm:text-sm text-emerald-400">
                Enable WhatsApp-Style Desktop Notifications
              </p>
              <p className="text-[11px] text-slate-300">
                Get real-time alerts on your Windows screen even when in other tabs or minimized!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={requestDesktopPermission}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 font-bold rounded-xl text-xs text-white transition shadow cursor-pointer"
            >
              Allow & Test
            </button>
            <button
              onClick={() => setShowPermissionPrompt(false)}
              className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </AdminNotificationContext.Provider>
  );
};

export default AdminNotificationProvider;
