import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { FaArrowLeft } from "react-icons/fa";

const OrderDetail = () => {
  const { uid, orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, "users", uid, "orders", orderId);
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
          setOrder({ id: orderSnap.id, uid, ...orderSnap.data() });
        } else {
          alert("Order not found");
          navigate("/orders");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch order");
      }
    };
    fetchOrder();
  }, [uid, orderId, navigate]);

  if (!order) return <p className="p-6 text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-6 sm:p-10  bg-gray-100 min-h-screen">
     

      <h1 className="text-3xl font-bold mb-6 text-green-700">Order Details</h1>

    

      {/* Cart Items */}
      <div className="">
       
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full rounded-lg">
            <thead className="bg-[#009669] border-b border-emerald-700 text-white">
              <tr className="text-center">
                <th className="px-4 py-4 ">Name</th>
                <th className="px-4 py-4 ">Weight</th>
                <th className="px-4 py-4 ">Quantity</th>
                <th className="px-4 py-4 ">Price</th>
              </tr>
            </thead>
            <tbody className="">
              {order.cartItems?.map((item, idx) => (
                <tr key={idx} className="text-center hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">{item.name}</td>
                  <td className="px-4 py-4">{item.weight || item.selectedWeight || "-"}</td>
                  <td className="px-4 py-4">{item.qty || item.quantity}</td>
                  <td className="px-4 py-4">₹{(item.price * (item.qty || item.quantity)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        {/* Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Order Info</h2>
          <p className="mb-2"><span className="font-semibold">Order ID:</span> {order.orderId}</p>
          <p className="mb-2"><span className="font-semibold">Customer Name:</span> {order.shippingAddress?.fullname}</p>
          <p className="mb-2"><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</p>
          <p className="mb-2"><span className="font-semibold">Status:</span> {order.orderStatus}</p>
          <p className="mb-2"><span className="font-semibold">Total Amount:</span> ₹{order.totalAmount.toFixed(2)}</p>
        </div>

        {/* Shipping Address */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Shipping Address</h2>
          <p className="mb-2"><span className="font-semibold">Street:</span> {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state}, {order.shippingAddress?.zip}</p>
          <p className="mb-2"><span className="font-semibold">Country:</span> {order.shippingAddress?.country}</p>
          <p className="mb-2"><span className="font-semibold">Contact:</span> {order.shippingAddress?.contact}</p>
          <p className="mb-2"><span className="font-semibold">Email:</span> {order.shippingAddress?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
