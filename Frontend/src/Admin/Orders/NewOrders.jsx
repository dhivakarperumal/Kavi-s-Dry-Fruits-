import React, { useEffect, useState, useCallback } from "react";
import {
  collection,
  doc,
  updateDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { FaPrint } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logo from "/images/Kavi_logo.png";
import OrderDetailsModal from "./OrderDetailsModal";

const NewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelInput, setShowCancelInput] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // modal state
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

  // Fetch Orders
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (usersSnap) => {
      usersSnap.docs.forEach((userDoc) => {
        const uid = userDoc.id;

        onSnapshot(collection(db, "users", uid, "orders"), (ordersSnap) => {
          const userOrders = [];
          ordersSnap.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.orderStatus !== "Delivered" && data.orderStatus !== "Cancelled") {
              userOrders.push({ id: docSnap.id, uid, ...data });
            }
          });

          setOrders((prev) => {
            const filtered = prev.filter((o) => o.uid !== uid);
            return [...filtered, ...userOrders].sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );
          });
        });
      });
    });

    return () => unsubUsers();
  }, []);

  // Apply Filters
  useEffect(() => {
    let temp = [...orders];

    if (searchText.trim()) {
      temp = temp.filter(
        (o) =>
          o.orderId.toLowerCase().includes(searchText.toLowerCase()) ||
          (o.shippingAddress?.fullname || "")
            .toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    const now = new Date();

    if (dateFilter === "Today") {
      temp = temp.filter(
        (o) => new Date(o.date).toDateString() === now.toDateString()
      );
    } else if (dateFilter === "This Week") {
      const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
      temp = temp.filter((o) => new Date(o.date) >= firstDay);
    } else if (dateFilter === "This Month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      temp = temp.filter((o) => new Date(o.date) >= firstDay);
    } else if (dateFilter === "Custom" && customRange.from && customRange.to) {
      const fromDate = new Date(customRange.from);
      const toDate = new Date(customRange.to);
      temp = temp.filter(
        (o) => new Date(o.date) >= fromDate && new Date(o.date) <= toDate
      );
    }

    setFilteredOrders(temp);
  }, [orders, searchText, dateFilter, customRange]);

  // Display limited orders based on selected count
  const currentOrders = filteredOrders.slice(0, itemsPerPage);

  // Update Status Logic
  const handleStatusUpdate = async (uid, orderId, newStatus) => {
    if (!newStatus) return;

    try {
      const orderRef = doc(db, "users", uid, "orders", orderId);
      const updatedOrder = orders.find((o) => o.id === orderId && o.uid === uid);
      if (!updatedOrder) return;

      if (newStatus === "Delivered") {
        await addDoc(collection(db, "delivery"), {
          ...updatedOrder,
          orderStatus: "Delivered",
          deliveryDate: new Date().toISOString(),
        });

        await updateDoc(orderRef, { orderStatus: "Delivered" });
        toast.success("Delivered and moved to Delivery DB!");
      } else if (newStatus === "Cancelled") {
        if (!cancelReason.trim())
          return toast.error("Please enter cancel reason");

        await addDoc(collection(db, "cancelOrders"), {
          ...updatedOrder,
          orderStatus: "Cancelled",
          cancelReason,
          cancelledAt: new Date().toISOString(),
        });

        await updateDoc(orderRef, { orderStatus: "Cancelled", cancelReason });

        setCancelReason("");
        setShowCancelInput(null);
        toast.success("Order Cancelled!");
      } else {
        await updateDoc(orderRef, { orderStatus: newStatus });
        toast.success("Status updated!");
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update status!");
    }
  };

  // Print handler (same format as AllOrders/Delivery)
   const handlePrint = useCallback((order) => {
      if (!order) return;
  
      const address = order.shippingAddress || order.client || {};
      const items = order.cartItems || order.items || [];
  
      const itemsList = items
        .map((item) => {
          const name = item.name || item.productName || "-";
          const qty = Number(item.qty ?? item.quantity ?? 1);
          const weight = item.weight || item.selectedWeight || item.weightDisplay || "-";
          const unitPrice =
            Number(item.price ?? item.unitPrice ?? (item.total && qty ? item.total / qty : 0)) || 0;
          const lineTotal = (unitPrice * qty).toFixed(2);
          const gst = Number(item.gst ?? 0).toFixed(2);
          return `
        <tr>
          <td>${name}</td>
          <td>${qty}</td>
          <td>${weight}</td>
          <td>₹${gst}</td>
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
              h2 { text-align: center; color: green; margin-bottom: 8px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
             th, td { border: 2px solid #3a3838ff; padding: 8px; text-align: center; font-size: 13px; }
              th { background-color: #f6f6f6; }
              .summary { margin-top: 12px; font-size: 15px; }
              .note { margin-top: 24px; font-style: italic; color: #555; text-align: center; }
              .info p { margin: 4px 0; font-size: 14px; }
              .top-header { text-align: right; font-size: 12px; margin-bottom: 6px; }
              img.logo { max-width: 140px; display: block; margin: 0 auto 8px; }
            </style>
          </head>
          <body>
            <img src="${logo}" alt="Logo" class="logo" />
            <div class="top-header">${deliveryDate}</div>
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
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Weight</th>
                  <th>GST</th>
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

  // Status Dropdown Filter Logic
  const getFilteredStatusOptions = (current) => {
    const all = ["Placed", "Packing", "Out for Delivery", "Delivered", "Cancelled"];

    if (current === "Placed") return all;

    if (current === "Packing")
      return ["Packing", "Out for Delivery", "Delivered", "Cancelled"];

    if (current === "Out for Delivery")
      return ["Out for Delivery", "Delivered", "Cancelled"];

    if (current === "Delivered") return ["Delivered"];

    if (current === "Cancelled") return ["Cancelled"];

    return all;
  };

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      {/* Filters */}
      <div className="flex justify-between sm:flex-row gap-4 mb-4 items-center">
        
        <input
          type="text"
          placeholder="Search by Order ID or Client Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        />

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All</option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
          <option value="Custom">Custom Range</option>
        </select>

        {dateFilter === "Custom" && (
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={customRange.from}
              onChange={(e) =>
                setCustomRange({ ...customRange, from: e.target.value })
              }
              className="border p-2 rounded"
            />
            <span>→</span>
            <input
              type="date"
              value={customRange.to}
              onChange={(e) =>
                setCustomRange({ ...customRange, to: e.target.value })
              }
              className="border p-2 rounded"
            />
          </div>
        )}

        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="border p-2 rounded cursor-pointer"
        >
          <option value={25}>Show 25</option>
          <option value={50}>Show 50</option>
          <option value={100}>Show 100</option>
          <option value={250}>Show 250</option>
          <option value={500}>Show 500</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-2xl overflow-x-auto">
        <table className="min-w-full text-sm rounded-lg overflow-hidden">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="px-3 py-4">Order ID</th>
              <th className="px-3 py-4">Payment</th>
              <th className="px-3 py-4">Total</th>
              <th className="px-3 py-4">Status</th>
              <th className="px-3 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id} className="text-center hover:bg-gray-50">
                
                <td
                  className="px-3 py-4 text-blue-600 underline cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  {order.orderId}
                </td>

                <td className="px-3 py-4">{order.paymentMethod || "-"}</td>

                <td className="px-3 py-4 text-green-600 font-semibold">
                  ₹{order.totalAmount}
                </td>

                <td className="px-3 py-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => {
                      if (e.target.value === "Cancelled") {
                        setShowCancelInput(order.id);
                      } else {
                        handleStatusUpdate(
                          order.uid,
                          order.id,
                          e.target.value
                        );
                      }
                    }}
                    className="border p-1 rounded cursor-pointer"
                  >
                    {getFilteredStatusOptions(order.orderStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  {showCancelInput === order.id && (
                    <div className="mt-2">
                      <textarea
                        className="w-full border rounded text-xs p-1"
                        placeholder="Reason for cancellation"
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                      <button
                        onClick={() =>
                          handleStatusUpdate(order.uid, order.id, "Cancelled")
                        }
                        className="mt-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded cursor-pointer"
                      >
                        Confirm Cancel
                      </button>
                    </div>
                  )}
                </td>

                {/* Print */}
                <td className="px-3 py-4 flex justify-center">
                  <button
                    onClick={() => handlePrint(order)}
                    className="text-gray-600 hover:text-black cursor-pointer"
                  >
                    <FaPrint />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 text-sm text-gray-600">
          Showing {Math.min(currentOrders.length, itemsPerPage)} of {filteredOrders.length} orders
        </div>
      </div>

      {/* Order details modal */}
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onPrint={handlePrint} />
    </div>
  );
};

export default NewOrders;
