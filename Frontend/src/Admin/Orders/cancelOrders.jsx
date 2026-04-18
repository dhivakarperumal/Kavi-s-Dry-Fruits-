import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { FaTimes } from "react-icons/fa";

const CancelOrders = () => {
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchCancelledOrders();
  }, []);

  const fetchCancelledOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "cancelOrders"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCancelledOrders(data);
    } catch (error) {
      console.error("Error fetching cancelled orders:", error);
    }
  };

  // --- Date Filtering Helper ---
  const filterByDate = (orderDate) => {
    const date = new Date(orderDate);
    const today = new Date();

    if (filterType === "today") {
      return date.toDateString() === today.toDateString();
    }
    if (filterType === "week") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return date >= startOfWeek && date <= endOfWeek;
    }
    if (filterType === "month") {
      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }
    if (filterType === "custom" && customFrom && customTo) {
      return date >= new Date(customFrom) && date <= new Date(customTo);
    }
    return true; // all
  };

  // --- Apply Search & Filters ---
  const filteredOrders = cancelledOrders
    .filter((order) => filterByDate(order.date))
    .filter((order) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        order.orderId?.toLowerCase().includes(term) ||
        order.uid?.toLowerCase().includes(term) ||
        order.shippingAddress?.fullname?.toLowerCase().includes(term)
      );
    });

  // --- Pagination ---
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      

      {/* Search + Filter */}
      <div className="flex flex-col justify-between  sm:flex-row gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by Order ID, User ID, or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {filterType === "custom" && (
          <div className="flex gap-2">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>
        )}
      </div>

      {/* Table */}
        <div className="bg-white shadow rounded-2xl overflow-x-auto">
          <table className="min-w-full text-sm rounded-lg overflow-hidden">
            <thead className="bg-green-500 text-white">
            <tr>
              <th className="px-3 py-4">Order ID</th>
              
              <th className="px-3 py-4">Payment Type</th>
             

              <th className="px-3 py-4">Total</th>
               <th className="px-3 py-4">Status</th>
              <th className="px-3 py-4">Reason</th>
              
              
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id} className="text-center hover:bg-gray-50">
                <td className="px-3 py-4">{order.orderId}</td>
                
                <td className="px-3 py-4">{order.paymentMethod}</td>
                <td className="px-3 py-4 text-green-600 font-semibold">
                  ₹ {order.totalAmount}
                </td>
                <td className="px-3 py-4 ">
                  {order.orderStatus}
                </td>
                <td className="px-3 py-4 text-red-500">
                  {order.cancelReason}
                </td>
               
               
              </tr>
            ))}
            {currentOrders.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No cancelled orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end gap-2 mt-4">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

     
    </div>
  );
};

export default CancelOrders;
