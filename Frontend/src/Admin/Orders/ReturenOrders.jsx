import React, { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { FaTimes } from "react-icons/fa";

const ReturnOrders = () => {
  const [returnOrders, setReturnOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 🔹 States for filters and pagination
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchReturnOrders();
  }, []);

  const fetchReturnOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "returnOrders"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReturnOrders(data);
    } catch (error) {
      console.error("Error fetching return orders:", error);
    }
  };

  // 🔹 Filtering logic
  const filteredOrders = useMemo(() => {
    let filtered = [...returnOrders];

    // Search by Order ID or Client Name
    if (searchText) {
      filtered = filtered.filter(
        (order) =>
          order.orderId?.toLowerCase().includes(searchText.toLowerCase()) ||
          order.shippingAddress?.fullname
            ?.toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    // Date filters
    const now = new Date();
    if (filterType === "today") {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date);
        return (
          orderDate.toDateString() === new Date().toDateString()
        );
      });
    } else if (filterType === "week") {
      const startOfWeek = new Date();
      startOfWeek.setDate(now.getDate() - now.getDay());
      filtered = filtered.filter(
        (order) =>
          new Date(order.date) >= startOfWeek &&
          new Date(order.date) <= now
      );
    } else if (filterType === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter(
        (order) =>
          new Date(order.date) >= startOfMonth &&
          new Date(order.date) <= now
      );
    } else if (filterType === "custom" && customFrom && customTo) {
      const from = new Date(customFrom);
      const to = new Date(customTo);
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate >= from && orderDate <= to;
      });
    }

    return filtered;
  }, [returnOrders, searchText, filterType, customFrom, customTo]);

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      

      {/* Search + Filters */}
      <div className="flex flex-wrap justify-between gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by Order ID or Client Name"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-1 rounded flex-1 max-w-[300px]"
        />

        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-1 rounded cursor-pointer"
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {filterType === "custom" && (
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            />
            <span>to</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
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
              <th className="px-3 py-4">Refund Amount</th>
             
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-3 py-4">{order.orderId}</td>
                <td className="px-3 py-4">{order.paymentMethod}</td>
                <td className="px-3 py-4 text-green-600 font-semibold">
                  ₹ {order.refundAmount || order.totalAmount}
                </td>
                 <td className="px-3 py-4 ">
                  {order.orderStatus}
                </td>
                <td className="px-3 py-4 text-red-500">
                  {order.returnReason}
                </td>
               
              </tr>
            ))}

            {paginatedOrders.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No returned orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal for details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setSelectedOrder(null)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Returned Order - {selectedOrder.orderId}
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Payment:</strong> {selectedOrder.paymentMethod}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.orderStatus}
              </p>
              <p>
                <strong>Refund Amount:</strong> ₹
                {selectedOrder.refundAmount || selectedOrder.totalAmount}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {selectedOrder.date
                  ? new Date(selectedOrder.date).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                <strong>Reason:</strong> {selectedOrder.returnReason}
              </p>

              <div className="mt-3">
                <h4 className="font-semibold underline mb-1">Items:</h4>
                <ul className="list-disc pl-5">
                  {selectedOrder.cartItems?.map((item, idx) => (
                    <li key={idx}>
                      {item.name} {item.weight || item.selectedWeight || "-"} ×{" "}
                      {item.qty || item.quantity} — ₹
                      {(item.price * (item.qty || item.quantity)).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3">
                <h4 className="font-semibold underline mb-1">
                  Shipping Address:
                </h4>
                <p>
                  {selectedOrder.shippingAddress?.fullname},{" "}
                  {selectedOrder.shippingAddress?.street},{" "}
                  {selectedOrder.shippingAddress?.city},{" "}
                  {selectedOrder.shippingAddress?.state} -{" "}
                  {selectedOrder.shippingAddress?.zip},{" "}
                  {selectedOrder.shippingAddress?.country}
                </p>
                <p>
                  <strong>Contact:</strong>{" "}
                  {selectedOrder.shippingAddress?.contact}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {selectedOrder.shippingAddress?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnOrders;
