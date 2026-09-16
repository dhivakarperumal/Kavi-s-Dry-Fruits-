import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "../PrivateRouter/AuthContext";
import api from "../services/api";
import adminDataService from "../services/adminDataService";
import LodingPage from "../Component/LoadingPage";

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
import ContactFormSubmissions from "./Others/ContactFormSubmissions";
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
import BannerManagement from "./Bannermanagement/BannerManagement";

import { io } from "socket.io-client";

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [visitedSections, setVisitedSections] = useState(["dashboard"]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Use cache to initialize data and loading state
  const [loading, setLoading] = useState(!adminDataService.isFresh());
  const [collectionCounts, setCollectionCounts] = useState(adminDataService.getCache() || {
    users: 0,
    products: 0,
    orders: 0,
    "New Orders": [],
    lowStockList: [],
    allProducts: [],
    allOrders: [],
    allUsers: [],
    allCombos: [],
    categories: 0,
    deliveredOrders: 0,
    cancelledOrders: 0
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleOrderUpdated = useCallback((updatedOrder) => {
    setCollectionCounts((previousData) => {
      const allOrders = (previousData.allOrders || []).map((order) => (
        order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
      ));
      const todayStr = new Date().toISOString().split("T")[0];
      const todayActiveOrders = allOrders.filter((order) =>
        order.orderStatus === "Order Placed" &&
        (order.created_at || order.date || "").includes(todayStr)
      );
      const deliveredOrders = allOrders.filter((order) => order.orderStatus === "Delivered");
      const cancelledOrders = allOrders.filter((order) => order.orderStatus === "Cancelled");
      const nextData = {
        ...previousData,
        allOrders,
        "New Orders": todayActiveOrders,
        deliveredOrders: deliveredOrders.length,
        cancelledOrders: cancelledOrders.length,
      };
      adminDataService.setCache(nextData);
      return nextData;
    });
  }, []);

  // Socket.io connection for real-time order notifications
  useEffect(() => {
    if (!user) return;
    const socket = io(api.defaults.baseURL.replace('/api', ''));
    
    socket.on("newOrder", async (data) => {
      // Background synchronization for AdminPanel state
      try {
        const ordersRes = await api.get("/orders");
        const ordersList = ordersRes.data || [];
        const todayStr = new Date().toISOString().split('T')[0];
        const todayActiveOrdersList = ordersList.filter(o => 
          o.orderStatus === "Order Placed" &&
          (o.created_at || o.date || "").includes(todayStr)
        );
        const deliveredOrders = ordersList.filter(o => o.orderStatus === "Delivered");
        const cancelledOrders = ordersList.filter(o => o.orderStatus === "Cancelled");
        
        setCollectionCounts(prev => {
          const newData = {
            ...prev,
            orders: ordersList.length,
            "New Orders": todayActiveOrdersList,
            allOrders: ordersList,
            deliveredOrders: deliveredOrders.length,
            cancelledOrders: cancelledOrders.length
          };
          adminDataService.setCache(newData);
          return newData;
        });
      } catch (error) {
        console.error("Failed to fetch fresh orders on socket event:", error);
      }
    });

    socket.on("connect", async () => {
      // Sync on reconnect to prevent missing orders
      try {
        const ordersRes = await api.get("/orders");
        const ordersList = ordersRes.data || [];
        const todayStr = new Date().toISOString().split('T')[0];
        const todayActiveOrdersList = ordersList.filter(o => 
          o.orderStatus === "Order Placed" &&
          (o.created_at || o.date || "").includes(todayStr)
        );
        const deliveredOrders = ordersList.filter(o => o.orderStatus === "Delivered");
        const cancelledOrders = ordersList.filter(o => o.orderStatus === "Cancelled");
        
        setCollectionCounts(prev => {
          const newData = {
            ...prev,
            orders: ordersList.length,
            "New Orders": todayActiveOrdersList,
            allOrders: ordersList,
            deliveredOrders: deliveredOrders.length,
            cancelledOrders: cancelledOrders.length
          };
          adminDataService.setCache(newData);
          return newData;
        });
      } catch (error) {
        console.error("Failed to sync orders on connect:", error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

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
      "banner": "Banner",
      "dealer": "Dealer",
      "reviews": "Reviews",
      "contact-form": "Contact Form",
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

  useEffect(() => {
    setVisitedSections((previousSections) => (
      previousSections.includes(activeSection)
        ? previousSections
        : [...previousSections, activeSection]
    ));
  }, [activeSection]);

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
      "Banner": "banner",
      "Dealer": "dealer",
      "Reviews": "reviews",
      "Contact Form": "contact-form",
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
      // If we don't have fresh data, show loading
      if (!adminDataService.isFresh()) {
        setLoading(true);
      }

      try {
        const [usersRes, productsRes, combosRes, categoriesRes, ordersRes] = await Promise.allSettled([
          api.get("/users"),
          api.get("/products"),
          api.get("/combos"),
          api.get("/categories"),
          api.get("/orders"),
        ]);

        const usersList = usersRes.status === "fulfilled" ? (usersRes.value.data?.users || usersRes.value.data || []) : [];
        const productsList = productsRes.status === "fulfilled" ? (productsRes.value.data || []) : [];
        const combosList = combosRes.status === "fulfilled" ? (combosRes.value.data || []) : [];
        const categoriesList = categoriesRes.status === "fulfilled" ? (categoriesRes.value.data || []) : [];
        const ordersList = ordersRes.status === "fulfilled" ? (ordersRes.value.data || []) : [];
        
        const todayStr = new Date().toISOString().split('T')[0];
        const todayActiveOrdersList = ordersList.filter(o => 
          o.orderStatus === "Order Placed" &&
          (o.created_at || o.date || "").includes(todayStr)
        );
        const deliveredOrders = ordersList.filter(o => o.orderStatus === "Delivered");
        const cancelledOrders = ordersList.filter(o => o.orderStatus === "Cancelled");

        const lowStockItems = productsList.filter(p => {
          const stock = parseFloat(p.totalStock || 0);
          return stock <= 500;
        });

        const newData = {
          users: usersList.length,
          products: productsList.length + combosList.length,
          orders: ordersList.length,
          "New Orders": todayActiveOrdersList,
          lowStockList: lowStockItems,
          allProducts: productsList,
          allOrders: ordersList,
          allUsers: usersList,
          allCombos: combosList,
          categories: categoriesList.length,
          deliveredOrders: deliveredOrders.length,
          cancelledOrders: cancelledOrders.length
        };

        setCollectionCounts(newData);
        adminDataService.setCache(newData);
      } catch (error) {
        console.error("Dashboard Stats Error:", error);
      } finally {
        setLoading(false);
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

  const renderContent = (section) => {
    switch (section) {
      case "dashboard": return <Dashboard adminData={collectionCounts} setActiveSection={handleSectionChange} />;

      // Users
      case "All Users": return <Users adminData={collectionCounts} />;
      case "New Users": return <NewUsers adminData={collectionCounts} />;
      case "Add Users": return <AddUsers />;

      // Products
      case "Add Products": return <Products />;
      case "All Products": return <Allproduct adminData={collectionCounts} />;
      case "Add Category": return <Category adminData={collectionCounts} />;
      case "Stock Details": return <StockDetails adminData={collectionCounts} />;


      // Orders
      case "Orders": return <Orders adminData={collectionCounts} />;
      case "New Orders": return <NewOrders adminData={collectionCounts} onOrderUpdated={handleOrderUpdated} />;
      case "All Orders": return <AllOrders adminData={collectionCounts} onOrderUpdated={handleOrderUpdated} />;
      case "Delivered Orders": return <Delivery adminData={collectionCounts} />;
      case "Cancel Orders": return <CancelOrders adminData={collectionCounts} />;
      case "Returned Orders": return <ReturenOrders adminData={collectionCounts} />;

      // Others
      case "Stickers": return <Stickers adminData={collectionCounts} />;
      case "Banner": return <BannerManagement />;
      case "Dealer": return <AddDealer />;
      case "Reviews": return <Reviews />;
      case "Contact Form": return <ContactFormSubmissions />;
      case "SEO Keywords": return <SEOKeywords />;
      case "Invoice": return <Invoice />;
      case "Billing": return <Billing />;
      case "Create Billing": return <CreateBilling />;
      case "Add Health Benefit": return <AddHealthBenefit onSuccess={() => setActiveSection("View Health Benefits")} onCancel={() => setActiveSection("View Health Benefits")} />;
      case "View Health Benefits": return <ViewHealthBenefits setActiveSection={setActiveSection} />;
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

        <main className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {visitedSections.map((section) => (
            <div key={section} className={section === activeSection ? "block" : "hidden"}>
              {renderContent(section)}
            </div>
          ))}
        </main>

        <footer className="text-center text-sm text-black py-3">
          © {new Date().getFullYear()} Admin Panel. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminPanel;
