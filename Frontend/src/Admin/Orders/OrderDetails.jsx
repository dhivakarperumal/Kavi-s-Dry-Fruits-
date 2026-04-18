import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { FaPrint } from "react-icons/fa";
import logo from "/images/Kavi_logo.png";

const OrderDetails = () => {
  const { uid, orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (order) return; // already have data from state
    if (!uid || !orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const ref = doc(db, "users", uid, "orders", orderId);
        const snap = await getDoc(ref);
        if (snap.exists()) setOrder({ id: snap.id, uid, ...snap.data() });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [uid, orderId, order]);

  const handlePrint = () => {
    if (!order) return;
    const address = order.shippingAddress || {};
    const itemsList = (order.cartItems || [])
      .map(
        (item) => `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.name || "-"}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.qty || 1}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.weight || "-"}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${(item.price || 0).toFixed(2)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${(((item.price || 0) * (item.qty || 1))).toFixed(2)}</td>
        </tr>`
      )
      .join("");

    const w = window.open("", "", "width=800,height=700");
    w.document.write(`
      <html><head><title>Invoice</title>
        <style>
          body{font-family:Arial,Helvetica,sans-serif;padding:20px}
          table{width:100%;border-collapse:collapse}
          th{background:#11a823;color:#fff;padding:10px;text-align:left}
        </style>
      </head>
      <body>
        <img src="${logo}" width="120" />
        <h2>Kavi's Dry Fruits</h2>
        <p><strong>Order ID:</strong> ${order.orderId || ""}</p>
        <p><strong>Client:</strong> ${address.fullname || "-"}</p>
        <p>${address.addressLine || ""} ${address.city || ""} ${address.state || ""}</p>

        <table border="0" cellspacing="0" cellpadding="0">
          <thead><tr>
            <th style="padding:10px">Name</th><th style="padding:10px;text-align:center">Qty</th>
            <th style="padding:10px;text-align:center">Weight</th><th style="padding:10px;text-align:right">Price</th>
            <th style="padding:10px;text-align:right">Total</th>
          </tr></thead>
          <tbody>${itemsList}</tbody>
        </table>

        <div style="margin-top:20px;text-align:right">
          <p>GST: ₹${order.gst || 0}</p>
          <p>Shipping: ₹${order.shippingCharge || 0}</p>
          <h3>Total: ₹${order.totalAmount || 0}</h3>
        </div>
      </body></html>
    `);
    w.document.close();
    w.onload = () => w.print();
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!order) return <div className="p-4">Order not found</div>;

  const address = order.shippingAddress || {};
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Order Details</h3>
            <div className="text-sm text-gray-600">{order.orderId}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
              <FaPrint /> Print
            </button>
            <button onClick={() => navigate(-1)} className="bg-gray-200 px-4 py-2 rounded">Close</button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="font-semibold">Client: <span className="font-normal">{address.fullname || "-"}</span></div>
            <div className="text-sm text-gray-600">{address.city || ""}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-green-500 text-white">
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-center">Weight</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.cartItems || []).map((it, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-3">{it.name}</td>
                    <td className="px-4 py-3 text-center">{it.qty}</td>
                    <td className="px-4 py-3 text-center">{it.weight}</td>
                    <td className="px-4 py-3 text-right">₹{(it.price || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">₹{(((it.price || 0) * (it.qty || 1))).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-right">
            <div>GST: ₹{order.gst || 0}</div>
            <div>Shipping: ₹{order.shippingCharge || 0}</div>
            <div className="font-bold text-lg">Total: ₹{order.totalAmount || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
