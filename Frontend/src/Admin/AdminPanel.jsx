import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "../PrivateRouter/AuthContext";

import Sidebar from "./Headers/Sidebar";
import Topbar from "./Headers/TopHeader";

import Dashboard from "./Dashboard";
import Orders from "./Orders/Orders";
import Products from "./Products/Products";
import Users from "./Users/AllUsers";
import Delivery from "./Orders/Delivery";
import CancelOrders from "./Orders/cancelOrders";
import StockDetails from "./Products/StockDetails";
import AddDealer from "./Others/AddDealer";
import Reviews from "./Reviews/Reviews";
import Invoice from "./Others/Invoice";
import Billing from "./Others/Billing";
import Stickers from "./PrintStickers/Stikers";

import { auth, db } from "../firebase";
import NewUsers from "./Users/NewUsers";
import AddUsers from "./Users/AddUser";
import Category from "./Products/Category";
import Allproduct from "./Products/Allproduct";
import NewOrders from "./Orders/NewOrders";
import AllOrders from "./Orders/AllOrders";
import MigrateProducts from "./MigrateProducts";

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collectionCounts, setCollectionCounts] = useState({});
  const [orders, setOrders] = useState([]);
  const [todayOrdersCount, setTodayOrdersCount] = useState(0);
  const [adminName, setAdminName] = useState("Administrator");
  const [liveStocks, setLiveStocks] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Fetch admin name
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchUserCount = async () => {
      try {
        const response = await api.get("/users");
        setCollectionCounts((prev) => ({
          ...prev,
          users: response.data.users?.length || 0,
        }));
      } catch (err) {
        console.error("Error fetching user count:", err);
      }
    };
    fetchUserCount();

    return () => {};
  }, [user, navigate]);

  // Fetch orders and stock
  useEffect(() => {
    const unsubs = [];

    // Users & Orders
    const unsubUsers = onSnapshot(collection(db, "users"), (userSnap) => {
      let todayCount = 0;
      const allOrders = [];

      userSnap.docs.forEach((userDoc) => {
        const uid = userDoc.id;
        const orderCol = collection(db, "users", uid, "orders");
        const unsubOrders = onSnapshot(orderCol, (orderSnap) => {
          const userOrders = [];
          orderSnap.forEach((doc) => {
            const data = doc.data();
            if (!["Delivered", "Cancelled"].includes(data.orderStatus)) {
              userOrders.push({ id: doc.id, uid, ...data });

              const date = data.date ? new Date(data.date) : null;
              const today = new Date();
              if (
                date &&
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
              ) {
                todayCount++;
              }
            }
          });

          setOrders((prev) => [
            ...prev.filter((order) => order.uid !== uid),
            ...userOrders,
          ]);
          setTodayOrdersCount(todayCount);
        });

        unsubs.push(unsubOrders);
      });
    });
    unsubs.push(unsubUsers);

    // Products / Stock
    const unsubStock = onSnapshot(collection(db, "products"), (snap) => {
      const products = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) =>
          (a.productId || "").localeCompare(b.productId || "", "en", { numeric: true })
        );
      setLiveStocks(products);

      const lowStock = products.filter(
        (p) =>
          (p.category === "Combo" && (p.stock || 0) <= 5) ||
          (p.category !== "Combo" && (p.stock || 0) <= 5000)
      ).length;
      setLowStockCount(lowStock);

      setCollectionCounts((prev) => ({ ...prev, products: products.length }));
    });
    unsubs.push(unsubStock);

    return () => unsubs.forEach((u) => u());
  }, []);

  const handleLogout = async () => {
    try {
      try { await signOut(auth); } catch (e) {} // sign out of firebase silently if connected
      if (logout) logout();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Logout failed!");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "All Users":
        return <Users />;
      case "New Users":
        return <NewUsers />;
      case "Add Users":
        return <AddUsers />;
      case "Add Products":
        return <Products />;
      case "All Products":
        return <Allproduct />;
      case "Add Category":
        return <Category />;
      case "New Orders":
        return <NewOrders />;
      case "All Orders":
        return <AllOrders />;
      case "Delivered Orders":
        return <Delivery />;
      case "Cancel Orders":
        return <CancelOrders />;
      case "Returned Orders":
        return <ReturenOrders/>;
      case "Stickers":
        return <Stickers />;

      case "Stock Details":
        return <StockDetails />;
      case "Migrate Pricing":
        return <MigrateProducts />;
      case "Dealer":
        return <AddDealer />;
      case "Reviews":
        return <Reviews />;
      case "Invoice":
        return <Invoice />;
      case "Billing":
        return <Billing />;
      default:
        return <p className="text-gray-500">Select a section.</p>;
    }
  };

  return (
    <div>
      <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        setActiveSection={setActiveSection}
        activeSection={activeSection}
        collectionCounts={collectionCounts}
        lowStockCount={lowStockCount}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col ml-0 md:ml-72 overflow-hidden">
        <Topbar
          setIsSidebarOpen={setIsSidebarOpen}
          activeSection={activeSection}
          adminName={adminName}
          todayOrdersCount={todayOrdersCount}
          lowStockCount={lowStockCount}
          ordersold={orders}
          handleLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-2">{renderContent()}</main>
        <footer className="text-center text-sm text-black py-3">
          © {new Date().getFullYear()} Admin Panel. All rights reserved.
        </footer>
      </div>
    </div>
  </div>
);
};

export default AdminPanel;
