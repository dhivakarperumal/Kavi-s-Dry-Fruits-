// Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  FaUsers,
  FaBoxOpen,
  FaTruck,
  FaTimesCircle,
  FaUndoAlt,
  FaDollarSign,
} from "react-icons/fa";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

const DashboardStats = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
    {stats.map((stat, i) => (
      <div
        key={i}
        className={`group relative overflow-hidden rounded-2xl p-6 shadow-xl transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl ${stat.bgColor}`}
      >
        {/* Background Decorative Circles */}
        <div className={`absolute -bottom-8 -right-8 w-40 h-40 ${stat.round1} opacity-20 rounded-full transition-transform duration-500 group-hover:scale-150`}></div>
        <div className={`absolute -top-10 -right-4 w-28 h-28 ${stat.round2} opacity-20 rounded-full transition-transform duration-500 group-hover:scale-125`}></div>

        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-white/80 font-bold text-sm tracking-widest uppercase mb-1">{stat.title}</p>
            <h3 className="text-4xl font-extrabold text-white">{stat.value}</h3>
          </div>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner backdrop-blur-md border border-white/20 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 ${stat.iconBg}`}>
            {stat.icon}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    deliveryOrders: 0,
    cancelledOrders: 0,
    returnedOrders: 0,
    revenue: 0,
  });

  const [productsData, setProductsData] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [liveStocks, setLiveStocks] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes, combosRes, ordersRes] = await Promise.all([
          api.get("/users"),
          api.get("/products"),
          api.get("/combos"),
          api.get("/orders")
        ]);

        const users = usersRes.data.users || usersRes.data || [];
        const products = productsRes.data || [];
        const combos = combosRes.data || [];
        const orders = ordersRes.data || [];

        const unifiedProducts = [
          ...products.map(p => ({ ...p, type: 'single' })),
          ...combos.map(c => ({ ...c, type: 'combo' }))
        ];

        let deliveryCount = 0;
        let cancelledCount = 0;
        let returnedCount = 0;
        let totalRevenue = 0;

        const revenueByMonth = {};
        const ordersByMonth = {};
        const topProductOrdersMap = {};
        const todayOrdersList = [];

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        orders.forEach(order => {
          const total = Number(order.totalAmount) || 0;
          const orderDate = new Date(order.created_at || order.date);
          const month = orderDate.toLocaleString("default", { month: "short" });
          const status = (order.orderStatus || "").toLowerCase();

          totalRevenue += total;
          if (status === "delivered") deliveryCount++;
          if (status === "cancelled") cancelledCount++;
          if (status === "returned") returnedCount++;

          revenueByMonth[month] = (revenueByMonth[month] || 0) + total;
          ordersByMonth[month] = (ordersByMonth[month] || 0) + 1;

          // Process items for top products
          const items = typeof order.items === 'string' ? JSON.parse(order.items || '[]') : (order.items || []);
          if (Array.isArray(items)) {
            items.forEach(item => {
              const key = item.name;
              if (key) {
                if (!topProductOrdersMap[key]) topProductOrdersMap[key] = {};
                topProductOrdersMap[key][month] = (topProductOrdersMap[key][month] || 0) + (Number(item.quantity) || 1);
              }
            });
          }

          // Today's orders
          const dt = (order.created_at || order.date || "");
          if (dt.includes(todayStr)) {
            todayOrdersList.push({
              id: order.id,
              orderId: order.orderId,
              clientName: order.clientName,
              clientPhone: order.clientPhone,
              totalAmount: total,
              orderStatus: order.orderStatus,
              shippingAddress: typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress || '{}') : order.shippingAddress
            });
          }
        });

        const months = Object.keys(revenueByMonth);
        const topProductChartData = Object.entries(topProductOrdersMap)
          .map(([name, monthlyData]) => ({
            label: name,
            data: months.map((m) => monthlyData[m] || 0),
          }))
          .slice(0, 3);

        const cats = {};
        unifiedProducts.forEach(p => {
          const cat = p.category || "Other";
          cats[cat] = (cats[cat] || 0) + 1;
        });

        setStats({
          users: users.length,
          products: unifiedProducts.length,
          deliveryOrders: deliveryCount,
          cancelledOrders: cancelledCount,
          returnedOrders: returnedCount,
          revenue: totalRevenue
        });

        setProductCategories(Object.entries(cats).map(([name, value]) => ({ name, value })));
        setLiveStocks(unifiedProducts.sort((a, b) => (a.productId || "").localeCompare(b.productId || "", "en", { numeric: true })));
        setProductsData(unifiedProducts);
        setMonthlyRevenue(months.map((m) => ({ month: m, amount: revenueByMonth[m] })));
        setMonthlyOrders(months.map((m) => ({ month: m, count: ordersByMonth[m] })));
        setTopProducts(topProductChartData);
        setTodayOrders(todayOrdersList);

      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const lowStockCount = productsData.filter(
    (item) => (item.combos?.length > 0 ? item.stock <= 5 : item.stock <= 5000)
  ).length;

  const profit = stats.revenue * 0.2;

  const statsData = [
    {
      title: "Users",
      value: stats.users,
      icon: <FaUsers />,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-500/40",
      iconBg: "bg-white/20 text-white",
      round1: "bg-white",
      round2: "bg-white",
    },
    {
      title: "Products",
      value: stats.products,
      icon: <FaBoxOpen />,
      bgColor: "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/40",
      iconBg: "bg-white/20 text-white",
      round1: "bg-white",
      round2: "bg-white",
    },
    {
      title: "Delivery Orders",
      value: stats.deliveryOrders,
      icon: <FaTruck />,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-700 shadow-purple-500/40",
      iconBg: "bg-white/20 text-white",
      round1: "bg-white",
      round2: "bg-white",
    },
    {
      title: "Cancelled Orders",
      value: stats.cancelledOrders,
      icon: <FaTimesCircle />,
      bgColor: "bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/40",
      iconBg: "bg-white/20 text-white",
      round1: "bg-white",
      round2: "bg-white",
    },
    {
      title: "Returned Orders",
      value: stats.returnedOrders,
      icon: <FaUndoAlt />,
      bgColor: "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-orange-500/40",
      iconBg: "bg-white/20 text-white",
      round1: "bg-white",
      round2: "bg-white",
    },
    {
      title: "Low Stock",
      value: lowStockCount,
      icon: <FaBoxOpen />,
      bgColor: "bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-500/40",
      iconBg: "bg-white/20 text-white",
      round1: "bg-white",
      round2: "bg-white",
    },
  ];

  const revenueChart = {
    labels: monthlyRevenue.map((d) => d.month),
    datasets: [
      {
        label: "Revenue",
        data: monthlyRevenue.map((d) => d.amount),
        backgroundColor: "rgba(16, 185, 129, 0.6)",
        borderRadius: 6,
      },
    ],
  };

  const ordersChart = {
    labels: monthlyOrders.map((d) => d.month),
    datasets: [
      {
        label: "Orders",
        data: monthlyOrders.map((d) => d.count),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.3)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const categoryChart = {
    labels: productCategories.map((d) => d.name),
    datasets: [
      {
        data: productCategories.map((d) => d.value),
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"],
        borderWidth: 2,
      },
    ],
  };

  const topProductOrdersChart = {
    labels: monthlyRevenue.map((d) => d.month),
    datasets: topProducts.map((item, i) => ({
      label: item.label,
      data: item.data,
      borderColor: ["#3b82f6", "#f59e0b", "#10b981"][i % 3],
      backgroundColor: ["#93c5fd", "#fde68a", "#6ee7b7"][i % 3],
      fill: false,
      tension: 0.4,
    })),
  };

  const stockChart = {
    labels: liveStocks.map((p) => p.name),
    datasets: [
      {
        label: "Stock",
        data: liveStocks.map((p) =>
          p.combos?.length > 0 ? p.stock : (p.stock || 0) / 1000
        ),
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "#dc2626",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6 min-h-screen">
      <DashboardStats stats={statsData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue</h2>
          <Bar data={revenueChart} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Product Category Distribution
          </h2>
          <div className="w-full h-64">
            <Pie
              data={categoryChart}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Current Product Stock Levels
        </h2>
        <Bar data={stockChart} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Orders</h2>
          <Line data={ordersChart} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Product Orders Over Months
          </h2>
          <div className="w-full h-64">
            <Line
              data={topProductOrdersChart}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      {/* ✅ Today Orders Table */}
      <div className="bg-white p-6 rounded-2xl shadow-md mt-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Today’s Orders</h2>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#009669]  text-white">
                  <th className="px-4 py-4 ">S No </th>
                  <th className="px-4 py-4 ">Order ID</th>
                  <th className="px-4 py-4 ">Customer Name</th>
                  <th className="px-4 py-4 ">Amount</th>
                  <th className="px-4 py-4 ">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayOrders.length > 0 ? (
                  todayOrders.map((order, ind) => (
                    <tr key={order.id} className=" hover:bg-gray-50">
                      <td className="px-4 py-4 ">{ind + 1}</td>
                      <td className="px-4 py-4 ">{order.orderId}</td>
                      <td className="px-4 py-4 ">{order.clientName || order.shippingAddress?.fullname || "Guest User"}</td>
                      <td className="px-4 py-4 ">₹ {order.totalAmount}</td>
                      <td className="px-4 py-4 ">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${order.orderStatus?.toLowerCase() === "delivered"
                              ? "bg-green-100 text-green-600"
                              : order.orderStatus?.toLowerCase() === "cancelled"
                                ? "bg-red-100 text-red-600"
                                : order.orderStatus?.toLowerCase() === "order placed"
                                  ? "bg-blue-100 text-blue-600"
                                  : order.orderStatus?.toLowerCase() === "shipped"
                                    ? "bg-purple-100 text-purple-600"
                                    : "bg-yellow-100 text-yellow-600"
                            }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-4 ">
                      No orders placed today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
