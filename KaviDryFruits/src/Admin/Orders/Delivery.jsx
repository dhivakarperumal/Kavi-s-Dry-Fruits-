import React, { useEffect, useState, useMemo, useCallback } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { FaPrint, FaTrash } from "react-icons/fa";
import logo from "/images/Kavi_logo.png";
import { useNavigate } from "react-router-dom";

const Delivery = () => {
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [ordersPerPage, setOrdersPerPage] = useState(25);

  const navigate = useNavigate();

  // ========== Fetch once, attach orderDateMs to each order ==========
  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      const snapshot = await getDocs(collection(db, "delivery"));
      const deliveries = snapshot.docs.map((doc) => {
        const data = doc.data() || {};
        const dateStr = data.deliveryDate || data.date;
        const orderDateMs = dateStr ? new Date(dateStr).getTime() : 0;
        return {
          id: doc.id,
          orderDateMs,
          ...data,
        };
      });

      // sort once by timestamp (descending)
      deliveries.sort((a, b) => (b.orderDateMs || 0) - (a.orderDateMs || 0));
      setDeliveredOrders(deliveries);
    };

    fetchDeliveredOrders();
  }, []);

  // ========== Debounce search input (reduce frequent re-filtering) ==========
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [searchText]);

  // ====== Memoize date bounds (recompute only when filterType/customFrom/customTo change) =====
  const dateBounds = useMemo(() => {
    const now = new Date();
    const nowMs = now.getTime();

    if (filterType === "today") {
      const start = new Date(now.setHours(0, 0, 0, 0)).getTime();
      const end = new Date(now.setHours(23, 59, 59, 999)).getTime();
      return { start, end };
    }

    if (filterType === "week") {
      const d = new Date();
      const firstDay = new Date(d.setDate(d.getDate() - d.getDay())); // sunday
      firstDay.setHours(0, 0, 0, 0);
      const lastDay = new Date(firstDay);
      lastDay.setDate(firstDay.getDate() + 6);
      lastDay.setHours(23, 59, 59, 999);
      return { start: firstDay.getTime(), end: lastDay.getTime() };
    }

    if (filterType === "month") {
      const d = new Date();
      const first = new Date(d.getFullYear(), d.getMonth(), 1);
      const last = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      return { start: first.getTime(), end: last.getTime() };
    }

    if (filterType === "custom") {
      if (!customFrom || !customTo) return { start: -Infinity, end: Infinity };
      const from = new Date(customFrom);
      from.setHours(0, 0, 0, 0);
      const to = new Date(customTo);
      to.setHours(23, 59, 59, 999);
      return { start: from.getTime(), end: to.getTime() };
    }

    // all
    return { start: -Infinity, end: Infinity };
  }, [filterType, customFrom, customTo]);

  // ====== Memoized filtered orders (date + search) ======
  const filteredOrders = useMemo(() => {
    const s = debouncedSearch;
    const { start, end } = dateBounds;

    // small micro-optimizations: use local vars
    return deliveredOrders.filter((order) => {
      const od = order.orderDateMs || 0;
      if (od < start || od > end) return false;

      if (!s) return true;
      const orderId = (order.orderId || order.id || "").toString().toLowerCase();
      const clientName = (order.client?.name || order.shippingAddress?.fullname || "").toString().toLowerCase();
      return orderId.includes(s) || clientName.includes(s);
    });
  }, [deliveredOrders, debouncedSearch, dateBounds]);

  // ====== Display limited orders based on selected count ======
  const currentOrders = useMemo(() => {
    return filteredOrders.slice(0, ordersPerPage);
  }, [filteredOrders, ordersPerPage]);

  // ====== Calculate total amount for all filtered orders ======
  const totalAmount = useMemo(() => {
    return filteredOrders.reduce((sum, order) => {
      return sum + (Number(order.totalAmount ?? order.total ?? 0));
    }, 0);
  }, [filteredOrders]);

  // ====== Stable callbacks ======
  const handlePrint = useCallback((order) => {
    if (!order) return;

    const address = order.shippingAddress || order.client || {};
    const items = order.cartItems || order.items || [];

    const itemsList = items
      .map((item) => {
        const S_no = items.indexOf(item) + 1;
        const name = item.name || item.productName || "-";
        const qty = Number(item.qty ?? item.quantity ?? 1);
        const weight = item.weight || item.selectedWeight || item.weightDisplay || "-";
        const unitPrice =
          Number(item.price ?? item.unitPrice ?? (item.total && qty ? item.total / qty : 0)) || 0;
        const lineTotal = (unitPrice * qty).toFixed(2);
        const gst = Number(item.gst ?? 0).toFixed(2);
        return `
      <tr>
        <td>${S_no}</td>
        <td>${name}</td>
        <td>${weight}</td>
        <td>₹${unitPrice.toFixed(2)}</td>
        <td>${qty}</td>
        <td>₹${lineTotal}</td>
        </tr>`;
      })
      .join("");

    const gstTotal = Number(order.gstAmount ?? 0);
    const shipping = Number(order.shippingCharge ?? 0);
    const finalAmount = Number(order.totalAmount ?? order.total ?? 0);
    const deliveryDate = new Date(order.deliveryDate || order.date).toLocaleString();

    const printWindow = window.open("", "_blank", "width=900,height=800");
    if (!printWindow) return alert("Please allow pop-ups to print the invoice.");

    const htmlContent = `
      <html>
        <head>
          <title>Invoice ${order.orderId || order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #000; }
            h2 { text-align: center; margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 35px; }
            th, td { border: 2px solid #3a3838ff; padding: 8px; text-align: center; font-size: 13px; }
            th { background-color: #f6f6f6; }
            .summary { margin-top: 12px; font-size: 14px;float: right; text-align: right; }
            .note { margin-top: 24px; font-style: italic; color: #555; text-align: center;position: fixed; bottom: 20px; width: 90%; }
            .info p { margin: 4px 0; font-size: 14px; line-height: 1.6; }
            .top-header { text-align: right; font-size: 12px; margin-bottom: 6px; }
            img.logo { max-width: 140px; display: block; margin: 0 auto 8px; }
          </style>
        </head>
        <body>
         <div class="top-header">Billing Date: ${deliveryDate}</div>
          <img src="${logo}" alt="Logo" class="logo" />
         
          <h2>Kavi's Dry Fruits</h2>
          <div class="info">
            <p><strong>Order ID:</strong> ${order.orderId || order.id}</p>
            <p><strong>Client Name:</strong> ${address.fullname || order.client?.name || "-"}</p>
            <p><strong>Phone:</strong> ${address.contact || order.client?.phone || "-"}</p>
            <p><strong>Address:</strong> ${address.street || ""} ${address.city || ""} ${address.state || ""} ${address.zip || ""}</p>
          </div>
          <table>
            <thead>
              <tr>
              <th>S.No</th>
                <th>Product Name</th>                
                <th>Weight</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          <div class="summary">
            <p><strong>GST Total:</strong> ₹${gstTotal.toFixed(2)}</p>
            <p><strong>Shipping Charge:</strong> ₹${shipping.toFixed(2)}</p>
            <p><strong>Final Amount:</strong> ₹${finalAmount.toFixed(2)}</p>
          </div>
          <div class="note">Thank you for shopping at Kavi's Dry Fruits!
We truly appreciate your trust in us. Enjoy your purchase, and we look forward to serving you again!</div>
        </body>
      </html>`;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  }, []);

  // Delete handler
  const handleDelete = useCallback(async (order) => {
    if (window.confirm(`Are you sure you want to delete order ${order.orderId}?`)) {
      try {
        await deleteDoc(doc(db, "delivery", order.id));
        setDeliveredOrders((prev) => prev.filter((o) => o.id !== order.id));
        alert("Order deleted successfully!");
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order");
      }
    }
  }, []);

  // small helper for row click (stable)
  const handleRowClick = useCallback((order) => setSelectedOrder(order), []);

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Search & Filter */}
      <div className="flex flex-wrap justify-between gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by Order ID or Client Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border px-3 py-1 rounded flex-1 max-w-[300px]"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
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

        <select
          value={ordersPerPage}
          onChange={(e) => setOrdersPerPage(Number(e.target.value))}
          className="border px-3 py-1 rounded cursor-pointer"
        >
          <option value={25}>Show 25</option>
          <option value={50}>Show 50</option>
          <option value={100}>Show 100</option>
          <option value={250}>Show 250</option>
          <option value={500}>Show 500</option>
        </select>
      </div>

      {/* Total Amount Summary */}
      {filteredOrders.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-green-800">Total Amount</h3>
              <p className="text-sm text-green-600">For {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-800">₹{totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500">No delivered orders found.</p>
      ) : (
        <div className="bg-white shadow rounded-2xl overflow-x-auto">
          <table className="min-w-full text-sm rounded-lg overflow-hidden">
            <thead className="bg-green-500  text-white">
              <tr>
                <th className="px-3 py-4">Order ID</th>
                <th className="px-3 py-4">Client Name</th>
                <th className="px-3 py-4">Order Date</th>
                <th className="px-3 py-4">Amount</th>
                <th className="px-3 py-4">Type</th>
                <th className="px-3 py-4">Status</th>
                <th className="px-3 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => {
                return (
                  <tr key={order.id} className="text-center hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(order)}>
                    <td className="px-3 py-4 text-blue-600 underline cursor-pointer">{order.orderId}</td>
                    <td className="px-3 py-4 text-green-600 font-semibold">{order.client?.name || (order.shippingAddress && (order.shippingAddress.fullname || order.shippingAddress.contact)) || "—"}</td>
                    <td className="px-3 py-4">{formatDate(order.date)}</td>
                    <td className="px-3 py-4">₹{order.totalAmount}</td>
                    <td className="px-3 py-4">{order.customerType || "Online Customer"}</td>
                    <td className="px-3 py-4">{order.orderStatus}</td>
                    <td className="px-3 py-4 text-center flex gap-3 justify-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePrint(order); }}
                        className="text-gray-600 cursor-pointer hover:text-black"
                        title="Print"
                      >
                        <FaPrint />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(order); }}
                        className="text-red-600 cursor-pointer hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="p-4 text-sm text-gray-600">
            Showing {Math.min(currentOrders.length, ordersPerPage)} of {filteredOrders.length} orders
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-lg max-w-3xl w-full shadow-lg overflow-auto" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90vh" }}>
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">Order Details</h3>
                <p className="text-sm text-gray-600">{selectedOrder.orderId}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handlePrint(selectedOrder)} className="px-3 py-2 bg-green-600 text-white cursor-pointer rounded">Print</button>
                <button onClick={() => setSelectedOrder(null)} className="px-3 py-2 bg-gray-200 cursor-pointer rounded">Close</button>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <strong>Client:</strong>{" "}
                {(selectedOrder.shippingAddress && (selectedOrder.shippingAddress.fullname || selectedOrder.shippingAddress.contact))
                  || (selectedOrder.client && (selectedOrder.client.name || selectedOrder.client.phone)) || "—"}
                <div className="text-sm text-gray-600">
                  {(selectedOrder.shippingAddress && `${selectedOrder.shippingAddress.street || ""} ${selectedOrder.shippingAddress.city || ""} ${selectedOrder.shippingAddress.state || ""}`) || selectedOrder.client?.address || ""}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-green-500 text-white">
                    <tr>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Qty</th>
                      <th className="px-3 py-2">Weight</th>
                      <th className="px-3 py-2">Price</th>
                      <th className="px-3 py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrder.cartItems || selectedOrder.items || []).map((it, idx) => {
                      const qty = Number(it.qty ?? it.quantity ?? 1);
                      const unitPrice = Number(it.price ?? it.unitPrice ?? (it.total && qty ? it.total / qty : 0)) || 0;
                      const weight = it.weight || it.selectedWeight || "-";
                      const lineTotal = (unitPrice * qty).toFixed(2);
                      return (
                        <tr key={idx} className="text-center border-b">
                          <td className="px-3 py-2">{it.name || it.productName || "-"}</td>
                          <td className="px-3 py-2">{qty}</td>
                          <td className="px-3 py-2">{weight}</td>
                          <td className="px-3 py-2">₹{unitPrice.toFixed(2)}</td>
                          <td className="px-3 py-2">₹{lineTotal}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end gap-6">
                <div className="text-right">
                  <p>GST: ₹{Number(selectedOrder.gstAmount ?? 0).toFixed(2)}</p>
                  <p>Shipping: ₹{Number(selectedOrder.shippingCharge ?? 0).toFixed(2)}</p>
                  <p className="font-semibold">Total: ₹{Number(selectedOrder.totalAmount ?? selectedOrder.total ?? 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Delivery;
