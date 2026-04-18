import React, { useEffect, useState } from "react";
import { FaPrint, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import logo from "/images/Kavi_logo.png";
import api from "../../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelInput, setShowCancelInput] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      // Filter for non-delivered and non-cancelled orders for management
      const filtered = (res.data || []).filter(o => 
        o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled"
      ).map(o => ({
        ...o,
        // Parse JSON strings from MySQL
        cartItems: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []),
        shippingAddress: typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : (o.shippingAddress || {}),
        date: o.created_at
      }));
      setOrders(filtered);
    } catch (err) {
      console.error("Fetch orders error:", err);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Refresh every 60 seconds
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    if (!newStatus) return;

    try {
      const data = { orderStatus: newStatus };
      if (newStatus === "Cancelled") {
        if (!cancelReason.trim()) return toast.error("Please enter cancel reason");
        data.cancelReason = cancelReason;
      }

      await api.put(`/orders/${id}`, data);
      toast.success(`Order ${newStatus} successfully!`);
      
      setCancelReason("");
      setShowCancelInput(null);
      fetchOrders(); // Refresh list
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update status!");
    }
  };

  const handlePrint = (order) => {
    const address = order.shippingAddress || {};
    const itemsList = (order.cartItems || [])
      .map(
        (item) => `
     <tr>
  <td>${item.name || "-"}</td>
  <td>${item.qty || item.quantity || 1}</td>
  <td>${item.weight || item.selectedWeight || "-"}</td>
  <td>₹0.00</td>
  <td>₹${((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}</td>
  
</tr>`
      )
      .join("");

    const gstTotal = 0;
    const shipping = order.shippingCharge ||0;
    const finalAmount = order.totalAmount || 0;

    const printWindow = window.open("", "", "width=800,height=700");
    if (!printWindow) {
      alert("Please allow pop-ups for printing.");
      return;
    }

    const htmlContent = `
    <html>
      <head>
        <title>Invoice ${order.orderId}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #000;
          }
          .logo-container {
            text-align: center;
            margin-bottom: 10px;
          }
          .logo-container img {
            max-width: 150px;
            height: auto;
          }
          h2 {
            text-align: center;
            color: green;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: center;
            font-size: 14px;
          }
          th {
            background-color: #f0f0f0;
          }
          .summary {
            margin-top: 20px;
            font-size: 16px;
          }
          .summary p {
            margin: 4px 0;
          }
          .note {
            position: absolute;
            bottom: 20px;
            left:14%;
            margin-top: 30px;
            font-style: italic;
            color: #555;
            text-align: center;
          }
          .info {
            margin-bottom: 10px;
          }
          .info p {
            margin: 3px 0;
          }
          .date-header {
            text-align: right;
            font-size: 12px;
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <div class="date-header">${new Date(order.date).toLocaleString()}</div>
        <div class="logo-container">
          <img src="${logo}" alt="Kavi's Logo" />
        </div>
        <h2>Kavi's Dry Fruits</h2>

        <div class="info">
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Client Name:</strong> ${order.clientName || order.fullname || order.client_name || order.client?.name || address.fullname || "-"}</p>
          <p><strong>Phone:</strong> ${order.clientPhone || address.contact || "-"}</p>
          <p><strong>Email:</strong> ${order.email || address.email || "-"}</p>
          <p><strong>Payment Mode:</strong> ${order.paymentMethod || order.paymentMode || "-"}</p>
          <p><strong>Address:</strong> ${(address.street ? address.street + ', ' : '')}${(address.city ? address.city + ', ' : '')}${(address.state || '')}${(address.zip ? ' - ' + address.zip : '')}</p>
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
          <p><strong>ShippingCharge:</strong> ₹${shipping.toFixed(2)}</p>
          <p><strong>Final Amount:</strong> ₹${finalAmount.toFixed(2)}</p>
        </div>

        <div class="note">
          Thank you for shopping at Kavi's Dry Fruits. We appreciate your business!
        </div>
      </body>
    </html>
  `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border text-sm">
          <thead className="bg-[#009669] border-b border-emerald-700">
            <tr className="text-white">
              <th className="p-3 text-[10px] font-black uppercase tracking-widest">Order ID</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest">Client Name</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest">Payment</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest">Payment ID</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest">Total</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest">Status</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td
                  className="p-3 border text-blue-600 underline cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  {order.orderId}
                </td>
                <td className="p-3 border font-semibold text-green-700">
                  {order.clientName || order.fullname || order.client?.name || order.shippingAddress?.fullname || order.shippingAddress?.contact || "—"}
                </td>
                <td className="p-3 border">{order.paymentMethod || "-"}</td>
                <td className="p-3 border">
                  {order.paymentMethod === "Online Payment"
                    ? order.paymentId
                    : "-"}
                </td>
                <td className="p-3 border text-green-600 font-semibold">
                  ₹ {order.totalAmount}
                </td>
                <td className="p-3 border ">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "Cancelled") {
                        setShowCancelInput(order.id);
                      } else {
                        handleStatusUpdate(order.id, value);
                      }
                    }}
                    className="border p-1 rounded cursor-pointer"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
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
                          handleStatusUpdate(order.id, "Cancelled")
                        }
                        className="mt-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded cursor-pointer"
                      >
                        Confirm Cancel
                      </button>
                    </div>
                  )}
                </td>
                <td className="p-3 flex gap-2 justify-center">
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
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setSelectedOrder(null)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4 text-green-700">
              Order Details - {selectedOrder.orderId}
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>User ID:</strong> {selectedOrder.userId || selectedOrder.uid || "N/A"}
              </p>
              <p>
                <strong>Payment:</strong> {selectedOrder.paymentMethod}
              </p>
              <p>
                <strong>Payment ID:</strong> {selectedOrder.paymentId || "-"}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.orderStatus}
              </p>
              <p>
                <strong>Total:</strong> ₹{selectedOrder.totalAmount}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedOrder.date).toLocaleString()}
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
                  <strong>Email:</strong> {selectedOrder.shippingAddress?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
