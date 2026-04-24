import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../Component/PageHeader";
import { Helmet } from "react-helmet";
import { useStore } from "../Context/StoreContext";
import api from "../services/api";

const Orders = () => {
  const { user } = useStore();
  const [allOrders, setAllOrders] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const userIdToUse = String(user?.user_id || user?.userUuid || user?.userId || user?.uid || "");
      if (!userIdToUse || userIdToUse === "undefined") {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/orders/user/${userIdToUse}`);
        setAllOrders(response.data);
      } catch (error) {
        console.error("Fetch orders error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const handlePrint = (order, e) => {
    e.stopPropagation(); 
    const printWindow = window.open("", "", "width=800,height=600");
    const content = `
      <html>
        <head>
          <title>Kavis Dry Fruits - Invoice</title>
          <style>
            body { font-family: Arial; padding: 20px; color: #333; }
            .print-container { border: 1px solid #ccc; padding: 20px; max-width: 800px; margin: auto; }
            .product-img { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 10px; }
            .item-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
            footer { margin-top: 40px; text-align: center; font-size: 12px; border-top: 1px solid #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="print-container">
            <h2>Invoice - Order ID: ${order.orderId}</h2>
            <p>Date: ${order.date}</p>
            <hr />
            ${order.cartItems
              .map(
                (item) => `
              <div class="item-row">
                <div style="display:flex; align-items:center;">
                  <img src="${item.img}" class="product-img" />
                  <div>
                    <strong>${item.name}</strong><br/>
                    Qty: ${item.qty} | ₹${item.price} each
                  </div>
                </div>
                <div>₹${(item.qty * item.price).toFixed(2)}</div>
              </div>
            `
              )
              .join("")}
            <hr />
            <div style="text-align:right; font-weight:bold;">Total: ₹${order.totalAmount.toFixed(
              2
            )}</div>
          </div>
          <footer><p>Printed on: ${new Date().toLocaleString()}</p></footer>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  if (loading) {
    return <div className="text-center mt-10">Loading orders...</div>;
  }

  if (!allOrders.length) {
    return (
      <div className="text-center mt-10">
        <PageHeader title="Your Orders" curpage="Order Completed" />
        <p className="text-red-600 mt-10 text-xl font-bold">No orders found.</p>
        <button onClick={() => navigate("/shop")} className="mt-4 bg-green-700 text-white px-6 py-2 rounded">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <>
    <Helmet>
  <title>Shop Premium Dry Fruits, Nuts, Dates & Seeds | Kavi’s Dry Fruits Tirupattur</title>

  <meta
    name="description"
    content="Buy premium dry fruits, nuts, seeds, raisins, dates and combo packs at best prices. Fresh quality delivered across Tamil Nadu and India. Contact +91 94895 93504. Tirupattur 635653."
  />

  <meta
    name="keywords"
    content="
      dry fruits shop, buy dry fruits online, almonds online, cashews online, pistachios online, dates online, raisins online, premium dry fruits store,
      fresh dry fruits Tirupattur, Tirupattur dry fruits, dry fruits 635653, dry fruits Tamil Nadu,
      dry fruits Chennai, dry fruits Coimbatore, dry fruits Madurai, dry fruits Vellore, dry fruits Salem,
      dry fruits Krishnagiri, dry fruits Dharmapuri, dry fruits Erode, dry fruits Tirunelveli,
      dry fruits Kanyakumari, dry fruits Tiruvannamalai, dry fruits Namakkal, dry fruits Trichy,
      dry fruits Thanjavur, dry fruits Cuddalore, dry fruits Dindigul, dry fruits Kanchipuram,
      buy nuts online India, premium nuts store, healthy snacks online, organic dry fruits,
      big size cashews W180, premium almonds, roasted pistachios, family pack dry fruits,
      dry fruits combo pack, Tamil Nadu pincode delivery, dry fruits shop phone number +91 94895 93504
    "
  />

  <link rel="canonical" href="https://kavisdryfruits.com/shop" />

  <meta property="og:title" content="Shop Premium Dry Fruits & Nuts – Kavi’s Dry Fruits Tirupattur" />
  <meta property="og:description" content="Premium almonds, cashews, pista, dates & seeds delivered across Tamil Nadu & India. Contact +91 94895 93504." />
  <meta property="og:url" content="https://kavisdryfruits.com/shop" />
  <meta property="og:type" content="website" />
</Helmet>

      <PageHeader title="Your Orders" curpage="Order Completed" />
      <div className="bg-Beach min-h-screen py-10 px-4">
        {allOrders.map((order, index) => (
          <div
            key={index}
            className="max-w-4xl mx-auto shadow-md mb-6 rounded-lg overflow-hidden border border-yellow-300"
          >
            {/* Header Section */}
            <div
              className="bg-yellow-400 flex justify-between items-center px-6 py-4 cursor-pointer"
              onClick={() =>
                setSelectedIndex(selectedIndex === index ? null : index)
              }
            >
              <div>
                <h2 className="text-lg font-bold text-black">
                  Order ID: {order.orderId}
                </h2>
                <p className="text-sm text-black">
                  Placed on: {new Date(order.date).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/tracking/${order.orderId}`);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded font-bold"
                >
                  Track Order
                </button>
                <button
                  onClick={(e) => handlePrint(order, e)}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded font-bold"
                >
                  Invoice
                </button>
                {/* <div className="text-black text-xl">
                  {selectedIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </div> */}
              </div>
            </div>

            {/* Order Details (Only visible when selected) */}
            {selectedIndex === index && (
              <div className="bg-white px-6 py-4">
                <div className="divide-y">
                  {order.cartItems.map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.img || "/placeholder.png"}
                          alt={`${item.name} - Kavi's Dry Fruits`}
                          className="w-14 h-14 object-cover rounded mr-4"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.qty}
                          </p>
                        </div>
                      </div>
                      <p className="text-orange-600 font-semibold">
                        ₹{(item.qty * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals Section */}
                <div className="mt-6 text-sm text-gray-700 space-y-2">
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹00.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>₹00.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coupon Discount</span>
                    <span>₹00.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-3 mt-2">
                    <span>Total</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Orders;
