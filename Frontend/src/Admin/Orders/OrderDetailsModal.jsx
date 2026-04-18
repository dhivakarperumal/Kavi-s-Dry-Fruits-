import React from "react";
import { FaPrint } from "react-icons/fa";
import logo from "/images/Kavi_logo.png";

const OrderDetailsModal = ({ order, onClose = () => {}, onPrint = () => {} }) => {
  if (!order) return null;

  const address = order.shippingAddress || order.client || {};
  const items = order.cartItems || order.items || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-3xl w-full shadow-lg overflow-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Order Details</h3>
            <p className="text-sm text-gray-600">{order.orderId}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrint(order)}
              className="px-3 py-2 bg-green-600 text-white rounded cursor-pointer flex items-center gap-2"
            >
              <FaPrint /> Print
            </button>
            <button onClick={onClose} className="px-3 py-2 bg-gray-200 rounded cursor-pointer">Close</button>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <strong>Client:</strong>{" "}
            {(address.fullname || address.name || address.contact) || "—"}
            <div className="text-sm text-gray-600">
              {(address.addressLine || address.street || "") + " " + (address.city || "") + " " + (address.state || "")}
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
                {items.map((it, idx) => {
                  const qty = Number(it.qty ?? it.quantity ?? 1);
                  const unitPrice = Number(it.price ?? it.unitPrice ?? 0) || 0;
                  const weight = it.weight || it.selectedWeight || it.weightDisplay || "-";
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
              <p>GST: ₹{Number(order.gst || order.gstAmount || 0).toFixed(2)}</p>
              <p>Shipping: ₹{Number(order.shippingCharge || 0).toFixed(2)}</p>
              <p className="font-semibold">Total: ₹{Number(order.totalAmount || order.total || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
