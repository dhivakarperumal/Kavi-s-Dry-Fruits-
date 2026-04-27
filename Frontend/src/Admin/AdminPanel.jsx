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
import OffersAndCoupons from "./Offers/OffersAndCoupons";

import AddHealthBenefit from "./HealthBenefits/AddHealthBenefit";
import ViewHealthBenefits from "./HealthBenefits/ViewHealthBenefits";


import SEOKeywords from "./SEOKeywords";
import Settings from "./Settings/Settings";
import Profile from "./Settings/Profile";
import DeliverySettings from "./Settings/DeliverySettings";

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
      "seo-keywords": "SEO Keywords",
      "invoice": "Invoice",
      "billing": "Billing",
      "billing/create": "Create Billing",
      "add-health-benefit": "Add Health Benefit",
      "view-health-benefits": "View Health Benefits",
      "settings": "Settings",
      "coupons": "Offers & Coupons",
      "profile": "Profile",
      "delivery-settings": "Delivery Settings",
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
      "Orders": "orders",
      "New Orders": "new-orders",
      "All Orders": "all-orders",
      "Delivered Orders": "delivered-orders",
      "Cancel Orders": "cancel-orders",
      "Returned Orders": "returned-orders",
      "Stickers": "stickers",
      "Dealer": "dealer",
      "Reviews": "reviews",
      "SEO Keywords": "seo-keywords",
      "Invoice": "invoice",
      "Billing": "billing",
      "Create Billing": "billing/create",
      "Add Health Benefit": "add-health-benefit",
      "View Health Benefits": "view-health-benefits",
      "Settings": "settings",
      "Offers & Coupons": "coupons",
      "Profile": "profile",
      "Delivery Settings": "delivery-settings",
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

        const orders = ordersRes.status === "fulfilled" ? (ordersRes.value.data || []) : [];
        const products = productsRes.status === "fulfilled" ? (productsRes.value.data || []) : [];
        
        const todayStr = new Date().toISOString().split('T')[0];
        const todayActiveOrdersList = orders.filter(o => 
          o.orderStatus === "Order Placed" &&
          (o.created_at || o.date || "").includes(todayStr)
        );

        const lowStockItems = products.filter(p => {
          const stock = parseFloat(p.totalStock || 0);
          return stock <= 3000; // 3 KG threshold (stored as grams)
        });

        setCollectionCounts({
          users: usersRes.status === "fulfilled" ? (usersRes.value.data?.length || usersRes.value.data?.users?.length || 0) : 0,
          products: products.length,
          orders: orders.length,
          "New Orders": todayActiveOrdersList,
          lowStockList: lowStockItems,
          allProducts: products,
          allOrders: orders
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
      case "dashboard": return <Dashboard />;

      // Users
      case "All Users": return <Users />;
      case "New Users": return <NewUsers />;
      case "Add Users": return <AddUsers />;

      // Products
      case "Add Products": return <Products />;
      case "All Products": return <Allproduct />;
      case "Add Category": return <Category />;
      case "Stock Details": return <StockDetails />;


      // Orders
      case "Orders": return <Orders />;
      case "New Orders": return <NewOrders />;
      case "All Orders": return <AllOrders />;
      case "Delivered Orders": return <Delivery />;
      case "Cancel Orders": return <CancelOrders />;
      case "Returned Orders": return <ReturenOrders />;

      // Others
      case "Stickers": return <Stickers />;
      case "Dealer": return <AddDealer />;
      case "Reviews": return <Reviews />;
      case "SEO Keywords": return <SEOKeywords />;
      case "Invoice": return <Invoice />;
      case "Billing": return <Billing />;
      case "Create Billing": return <CreateBilling />;
      case "Add Health Benefit": return <AddHealthBenefit />;
      case "View Health Benefits": return <ViewHealthBenefits />;
      case "Settings": return <Settings />;
      case "Offers & Coupons": return <OffersAndCoupons />;
      case "Profile": return <Profile />;
      case "Delivery Settings": return <DeliverySettings />;

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
          setActiveSection={setActiveSection}
          handleLogout={handleLogout}
          todayOrdersCount={collectionCounts["New Orders"]?.length || 0}
          todayOrdersList={collectionCounts["New Orders"] || []}
          lowStockCount={collectionCounts.lowStockList?.length || 0}
          lowStockItems={collectionCounts.lowStockList || []}
          allProducts={collectionCounts.allProducts || []}
          allOrders={collectionCounts.allOrders || []}
          adminName={user?.name || "Administrator"}
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
