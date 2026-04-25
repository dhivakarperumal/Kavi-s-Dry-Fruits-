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
  Filler,
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
  PointElement,
  Filler
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
        const deliveredByMonth = {};
        const cancelledByMonth = {};
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
          if (status === "delivered") {
            deliveryCount++;
            deliveredByMonth[month] = (deliveredByMonth[month] || 0) + 1;
          }
          if (status === "cancelled") {
            cancelledCount++;
            cancelledByMonth[month] = (cancelledByMonth[month] || 0) + 1;
          }
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

        const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const months = allMonths;

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
        setMonthlyOrders(months.map((m) => ({
          month: m,
          total: ordersByMonth[m] || 0,
          delivered: deliveredByMonth[m] || 0,
          cancelled: cancelledByMonth[m] || 0
        })));
        setTopProducts(topProductChartData);
        setTodayOrders(todayOrdersList);

      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const lowStockCount = productsData.filter(
    (item) => (Number(item.totalStock) || 0) <= 3000
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
        label: "Revenue (₹)",
        data: monthlyRevenue.map((d) => d.amount),
        backgroundColor: "#0284c7", // Deep blue
        hoverBackgroundColor: "#38bdf8", // Lighter blue on hover
        borderRadius: 2, // Almost square edges
        borderSkipped: false,
      },
    ],
  };

  const ordersChart = {
    labels: monthlyOrders.map((d) => d.month),
    datasets: [
      {
        label: "Total Orders",
        data: monthlyOrders.map((d) => d.total),
        borderColor: "#8b5cf6", // Violet-500
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(139, 92, 246, 0.1)";
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "rgba(139, 92, 246, 0.0)");
          gradient.addColorStop(1, "rgba(139, 92, 246, 0.5)");
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#8b5cf6",
        pointBorderWidth: 2,
        pointRadius: 4,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Delivered",
        data: monthlyOrders.map((d) => d.delivered),
        borderColor: "#10b981", // Emerald-500
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(16, 185, 129, 0.1)";
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.0)");
          gradient.addColorStop(1, "rgba(16, 185, 129, 0.4)");
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#10b981",
        pointBorderWidth: 2,
        pointRadius: 4,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Cancelled",
        data: monthlyOrders.map((d) => d.cancelled),
        borderColor: "#ef4444", // Red-500
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(239, 68, 68, 0.1)";
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "rgba(239, 68, 68, 0.0)");
          gradient.addColorStop(1, "rgba(239, 68, 68, 0.4)");
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#ef4444",
        pointBorderWidth: 2,
        pointRadius: 4,
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const categoryChart = {
    labels: productCategories.map((d) => d.name),
    datasets: [
      {
        data: productCategories.map((d) => d.value),
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const topProductOrdersChart = {
    labels: monthlyRevenue.map((d) => d.month),
    datasets: topProducts.map((item, i) => ({
      label: item.label,
      data: item.data,
      borderColor: ["#3b82f6", "#f59e0b", "#10b981"][i % 3],
      backgroundColor: ["rgba(59,130,246,0.1)", "rgba(245,158,11,0.1)", "rgba(16,185,129,0.1)"][i % 3],
      borderWidth: 3,
      pointBackgroundColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
      fill: true,
      tension: 0.4,
    })),
  };

  const stockChart = {
    labels: liveStocks.map((p) => p.name),
    datasets: [
      {
        label: "Stock Level",
        data: liveStocks.map((p) => (Number(p.totalStock) || 0) / 1000),
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(99, 102, 241, 0.5)";
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "rgba(99, 102, 241, 0.05)"); // Indigo very light at bottom
          gradient.addColorStop(0.5, "rgba(99, 102, 241, 0.4)");
          gradient.addColorStop(1, "rgba(79, 70, 229, 0.9)"); // Solid Indigo at top
          return gradient;
        },
        hoverBackgroundColor: "#4338ca",
        borderColor: "#6366f1",
        borderWidth: { top: 2, right: 2, left: 2, bottom: 0 },
        borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { weight: '600' } } },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 14,
        cornerRadius: 12,
        displayColors: false,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [5, 5] }, beginAtZero: true, border: { display: false } }
    }
  };

  const stockChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: { display: false }
    },
    scales: {
      ...chartOptions.scales,
      x: {
        ...chartOptions.scales.x,
        ticks: { display: false }
      }
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <DashboardStats stats={statsData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaDollarSign className="text-emerald-500" /> Monthly Revenue
          </h2>
          <div className="w-full h-72">
            <Bar data={revenueChart} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaBoxOpen className="text-blue-500" /> Product Category Distribution
          </h2>
          <div className="w-full h-72">
            <Pie
              data={categoryChart}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaUsers className="text-red-500" /> Current Product Stock Levels
        </h2>
        <div className="w-full h-80">
          <Bar data={stockChart} options={stockChartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaTruck className="text-indigo-500" /> Monthly Orders
          </h2>
          <div className="w-full h-72">
            <Line data={ordersChart} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaUndoAlt className="text-amber-500" /> Top Product Orders Over Months
          </h2>
          <div className="w-full h-72">
            <Line
              data={topProductOrdersChart}
              options={chartOptions}
            />
          </div>
        </div>
      </div>

      {/* ✅ Today Orders Table */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 mt-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Today’s Orders</h2>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-700">
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
