import { useState } from "react";
import { FaCheck, FaMapMarkerAlt, FaPrint, FaTimes, FaTruck, FaUser } from "react-icons/fa";

const statusSteps = [
  "Order Placed",
  "Order Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const parseValue = (value, fallback) => {
  if (typeof value !== "string") return value || fallback;
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
};

const getImageUrl = (value) => {
  if (!value) return "/images/placeholder.png";
  if (value.startsWith("data:") || value.startsWith("http")) return value;
  if (value.startsWith("/images")) return value;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  return `${backendUrl}${value.startsWith("/") ? value : `/${value}`}`;
};

const UserOrderDetailsModal = ({ order, onClose, onPrint, onCancel, renderReviewForm }) => {
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!order) return null;
  const address = parseValue(order.shippingAddress || order.client, {});
  const items = parseValue(order.cartItems || order.items, []);
  const currentStatus = order.orderStatus || "Order Placed";
  const statusIndex = statusSteps.indexOf(currentStatus);
  const canCancel = statusIndex >= 0 && statusIndex < statusSteps.indexOf("Shipped");
  const customerName =
    order.clientName ||
    order.fullname ||
    order.client_name ||
    address.fullname ||
    address.name ||
    "Customer";
  const customerEmail = address.email || order.email || "Not available";
  const customerPhone = address.contact || order.clientPhone || order.phone || "Not available";
  const shippingAmount = Number(order.shippingCharge || 0);
  const total = Number(order.totalAmount || order.total || 0);
  const isDelivered = currentStatus === "Delivered";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Order details for ${order.orderId}`}
    >
      <div
        className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-green-100 bg-green-50 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-green-700">Order Details</p>
            <h2 className="text-xl font-black text-gray-900">{order.orderId}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPrint(order)}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-green-700"
            >
              <FaPrint /> <span className="hidden sm:inline">Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-white p-2 text-gray-500 shadow-sm transition hover:bg-green-100 hover:text-green-700"
              aria-label="Close order details"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6">
          <div className="mb-6 rounded-xl border border-green-100 bg-green-50/60 p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Current Status</p>
                <p className="text-lg font-black text-green-800">{currentStatus}</p>
              </div>
              {canCancel && (
                showCancelForm ? (
                  <div className="flex w-full max-w-lg flex-col gap-2 sm:flex-row sm:items-end">
                    <textarea
                      value={cancelReason}
                      onChange={(event) => setCancelReason(event.target.value)}
                      placeholder="Cancellation reason..."
                      rows={2}
                      className="min-h-[58px] w-full flex-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    />
                    <div className="flex gap-2 sm:flex-col">
                      <button
                        type="button"
                        disabled={!cancelReason.trim()}
                        onClick={() => onCancel(cancelReason.trim())}
                        className="w-24 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCancelForm(false)}
                        className="w-24 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
                      >
                        Keep Order
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCancelForm(true)}
                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
                  >
                    Cancel Order
                  </button>
                )
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
              {statusSteps.map((step, index) => {
                const isComplete = statusIndex >= index;
                const isCurrent = currentStatus === step;
                return (
                  <div key={step} className="flex flex-col items-center text-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                        isComplete ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"
                      } ${isCurrent ? "ring-4 ring-green-100" : ""}`}
                    >
                      {isComplete ? <FaCheck size={13} /> : index + 1}
                    </div>
                    <span className="mt-2 text-[11px] font-semibold text-gray-600">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <section className="rounded-xl border border-green-100 p-4">
              <div className="mb-3 flex items-center gap-2 text-green-700">
                <FaUser />
                <h3 className="font-black">Customer Details</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Name:</strong> {customerName}</p>
                <p><strong>Email:</strong> {customerEmail}</p>
                <p><strong>Phone:</strong> {customerPhone}</p>
                <p><strong>Payment:</strong> {order.paymentMethod || order.paymentMode || "Online Payment"}</p>
              </div>
            </section>

            <section className="rounded-xl border border-green-100 p-4">
              <div className="mb-3 flex items-center gap-2 text-green-700">
                <FaMapMarkerAlt />
                <h3 className="font-black">Delivery Address</h3>
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                <p className="font-bold">{address.fullname || address.name || customerName}</p>
                <p>{address.street || ""}{address.street ? ", " : ""}{address.city || ""}</p>
                <p>{address.state || ""}{address.zip ? ` - ${address.zip}` : ""}</p>
                <p>{address.country || "India"}</p>
                <p className="pt-1"><strong>Contact:</strong> {customerPhone}</p>
              </div>
            </section>
          </div>

          <section className="overflow-hidden rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
              <FaTruck className="text-green-600" />
              <h3 className="font-black text-gray-800">Order Items</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <p className="p-4 text-sm text-gray-500">No item details available.</p>
              ) : (
                items.map((item, index) => {
                  const quantity = Number(item.quantity || item.qty || 1);
                  const price = Number(item.price || item.unitPrice || 0);
                  const imageSource = item.image || item.imageUrl || (Array.isArray(item.images) ? item.images[0] : "");
                  return (
                    <div key={`${item.name || "item"}-${index}`} className="flex items-center gap-3 p-3">
                      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                        <img
                          src={getImageUrl(imageSource)}
                          alt={item.name || item.productName || "Product"}
                          className="h-full w-full object-contain"
                          onError={(event) => { event.currentTarget.src = "/images/placeholder.png"; }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{item.name || item.productName || "Product"}</p>
                        <p className="text-xs text-gray-500">Qty: {quantity}{item.weight || item.selectedWeight ? ` | ${item.weight || item.selectedWeight}` : ""}</p>
                      </div>
                      <p className="font-black text-green-700">₹{(price * quantity).toFixed(2)}</p>
                    </div>
                  );
                })
              )}
            </div>
            <div className="border-t border-gray-100 bg-green-50 px-4 py-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹{shippingAmount.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex justify-between font-black text-gray-900">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {isDelivered && renderReviewForm && (
            <section className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-black text-green-800">How was your order?</h3>
                  <p className="text-sm text-green-700">Share your feedback about this delivered order.</p>
                </div>
                {!showReviewForm && (
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(true)}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700"
                  >
                    Add Review
                  </button>
                )}
              </div>
              {showReviewForm && (
                <div className="mt-4 rounded-lg bg-white p-4">
                  {renderReviewForm(() => setShowReviewForm(false))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetailsModal;
