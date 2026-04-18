import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "../PrivateRouter/AuthContext";
import api from "../services/api";

import Sidebar from "./Headers/Sidebar";
import Topbar from "./Headers/TopHeader";

import Dashboard from "./Dashboard";
import Orders from "./Orders/Orders";
import Products from "./Products/Products";
import Users from "./Users/AllUsers";
import Delivery from "./Orders/Delivery";
import CancelOrders from "./Orders/cancelOrders";
import ReturenOrders from "./Orders/ReturenOrders";
import StockDetails from "./Products/StockDetails";
import AddDealer from "./Others/AddDealer";
import Reviews from "./Reviews/Reviews";
import Invoice from "./Others/Invoice";
import Billing from "./Others/Billing";
import CreateBilling from "./Others/CreateBilling";
import Stickers from "./PrintStickers/Stikers";
import NewUsers from "./Users/NewUsers";
import AddUsers from "./Users/AddUser";
import Category from "./Products/Category";
import Allproduct from "./Products/Allproduct";
import NewOrders from "./Orders/NewOrders";
import AllOrders from "./Orders/AllOrders";


const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [collectionCounts, setCollectionCounts] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Sync URL Path with Active Section
  useEffect(() => {
    const path = location.pathname.replace(/^\/adminpanel\/?/, "").toLowerCase();
    
    if (!path) {
      if (activeSection !== "dashboard") setActiveSection("dashboard");
      return;
    }

    const routeMap = {
      "dashboard": "dashboard",
      "all-users": "All Users",
      "new-users": "New Users",
      "add-users": "Add Users",
      "products": "Add Products",
      "add-products": "Add Products",
      "all-products": "All Products",
      "add-category": "Add Category",
      "stock-details": "Stock Details",
      "orders": "Orders",
      "new-orders": "New Orders",
      "all-orders": "All Orders",
      "delivered-orders": "Delivered Orders",
      "cancel-orders": "Cancel Orders",
      "returned-orders": "Returned Orders",
      "stickers": "Stickers",
      "dealer": "Dealer",
      "reviews": "Reviews",
      "invoice": "Invoice",
      "billing": "Billing",
      "billing/create": "Create Billing",
    };

    const mappedSection = routeMap[path];
    if (mappedSection && mappedSection !== activeSection) {
      setActiveSection(mappedSection);
    }
  }, [location.pathname]);

  const handleSectionChange = (newSection) => {
    setActiveSection(newSection);
    const reverseMap = {
      "dashboard": "dashboard",
      "All Users": "all-users",
      "New Users": "new-users",
      "Add Users": "add-users",
      "Add Products": "products",
      "All Products": "all-products",
      "Add Category": "add-category",
      "Stock Details": "stock-details",
      "Migrate Pricing": "migrate-pricing",
      "Orders": "orders",
      "New Orders": "new-orders",
      "All Orders": "all-orders",
      "Delivered Orders": "delivered-orders",
      "Cancel Orders": "cancel-orders",
      "Returned Orders": "returned-orders",
      "Stickers": "stickers",
      "Dealer": "dealer",
      "Reviews": "reviews",
      "Invoice": "invoice",
      "Billing": "billing",
      "Create Billing": "billing/create",
    };
    
    const urlPath = reverseMap[newSection] || "dashboard";
    navigate(`/adminpanel/${urlPath === "dashboard" ? "" : urlPath}`);
  };

  // Fetch counts from MySQL API
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchCounts = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.allSettled([
          api.get("/users"),
          api.get("/products"),
          api.get("/orders"),
        ]);

        setCollectionCounts({
          users:    usersRes.status    === "fulfilled" ? (usersRes.value.data?.length    || usersRes.value.data?.users?.length    || 0) : 0,
          products: productsRes.status === "fulfilled" ? (productsRes.value.data?.length || 0) : 0,
          orders:   ordersRes.status   === "fulfilled" ? (ordersRes.value.data?.length   || 0) : 0,
        });
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchCounts();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      if (logout) logout();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Logout failed!");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":          return <Dashboard />;

      // Users
      case "All Users":          return <Users />;
      case "New Users":          return <NewUsers />;
      case "Add Users":          return <AddUsers />;

      // Products
      case "Add Products":       return <Products />;
      case "All Products":       return <Allproduct />;
      case "Add Category":       return <Category />;
      case "Stock Details":      return <StockDetails />;
      

      // Orders
      case "Orders":             return <Orders />;
      case "New Orders":         return <NewOrders />;
      case "All Orders":         return <AllOrders />;
      case "Delivered Orders":   return <Delivery />;
      case "Cancel Orders":      return <CancelOrders />;
      case "Returned Orders":    return <ReturenOrders />;

      // Others
      case "Stickers":           return <Stickers />;
      case "Dealer":             return <AddDealer />;
      case "Reviews":            return <Reviews />;
      case "Invoice":            return <Invoice />;
      case "Billing":            return <Billing />;
      case "Create Billing":     return <CreateBilling />;

      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-400 font-medium">
            Select a section from the sidebar.
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        setActiveSection={handleSectionChange}
        activeSection={activeSection}
        collectionCounts={collectionCounts}
        handleLogout={handleLogout}
      />

      <div className={`flex-1 flex flex-col ml-0 overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? "md:ml-20" : "md:ml-72"}`}>
        <Topbar
          setIsSidebarOpen={setIsSidebarOpen}
          activeSection={activeSection}
          handleLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-2">
          {renderContent()}
        </main>

        <footer className="text-center text-sm text-black py-3">
          © {new Date().getFullYear()} Admin Panel. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminPanel;
