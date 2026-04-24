import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { FaCheckCircle, FaBox, FaTruck, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import PageHeader from "../Component/PageHeader";

const OrderTracking = ({ orderId: propOrderId }) => {
  const { orderId: paramOrderId } = useParams();
  const orderId = propOrderId || paramOrderId;
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTrackingData = async () => {
    try {
      const [orderRes, trackingRes, locationRes] = await Promise.all([
        api.get(`/orders/${orderId}`),
        api.get(`/orders/${orderId}/tracking`),
        api.get(`/orders/${orderId}/location`)
      ]);
      setOrder(orderRes.data);
      setTracking(trackingRes.data);
      setLocation(locationRes.data);
    } catch (error) {
      console.error("Error fetching tracking data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingData();
    const interval = setInterval(fetchTrackingData, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) return <div className="p-10 text-center">Loading Tracking...</div>;
  if (!order) return <div className="p-10 text-center text-red-600">Order not found</div>;

  const statuses = ["Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];
  const currentStatusIndex = statuses.findIndex(s => s.toLowerCase() === (order.orderStatus || "").toLowerCase());

  return (
    <div className="bg-green4 min-h-screen">
      <PageHeader title="Order Tracking" subtitle="Shop" curpage="Track" />
      <div className="max-w-4xl mx-auto p-4 md:p-10">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-green-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-green-800">Order #{order.orderId}</h1>
              <p className="text-gray-500">Estimated Delivery: {order.delivery_days === 0 ? "Same Day" : `${order.delivery_days} days`}</p>
            </div>
            <div className="text-right">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold uppercase">
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative flex flex-col md:flex-row justify-between items-center mb-10 space-y-8 md:space-y-0">
            {statuses.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              return (
                <div key={status} className="flex flex-col items-center relative z-10 w-full md:w-auto">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted ? "bg-green-600 text-white" : "bg-gray-200 text-gray-400"
                  }`}>
                    {isCompleted ? <FaCheckCircle /> : index + 1}
                  </div>
                  <p className={`text-xs text-center font-bold ${isCompleted ? "text-green-700" : "text-gray-400"}`}>
                    {status}
                  </p>
                  {index < statuses.length - 1 && (
                    <div className={`hidden md:block absolute h-1 w-full top-5 left-1/2 -z-10 ${
                      index < currentStatusIndex ? "bg-green-600" : "bg-gray-200"
                    }`} style={{ width: 'calc(100% + 2rem)' }}></div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-8 border-t pt-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Delivery Details</h3>
              <p className="text-sm text-gray-600">Charge: ₹{order.delivery_charge}</p>
              <p className="text-sm text-gray-600">Distance: {order.distance} KM</p>
            </div>
            {order.orderStatus === "Out for Delivery" && location && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-800 mb-2">Delivery Agent</h3>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white">
                      <FaTruck size={24} />
                   </div>
                   <div>
                      <p className="font-bold">{location.agentName || "Agent Name"}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <FaPhone size={12} /> {location.agentPhone || "Not available"}
                      </p>
                   </div>
                </div>
                <a href={`tel:${location.agentPhone}`} className="mt-3 block text-center bg-green-600 text-white py-2 rounded-md font-bold text-sm">
                  Call Delivery Agent
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Live Map Placeholder / Implementation */}
        {order.orderStatus === "Out for Delivery" && (
          <div className="bg-white rounded-xl shadow-lg p-4 border border-green-200 overflow-hidden">
            <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt /> Live Tracking
            </h3>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative">
               <div className="w-full h-full relative p-4 bg-green-50 overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
                  
                  {/* Customer Marker */}
                  <div className="absolute top-1/4 right-1/4 flex flex-col items-center">
                    <FaMapMarkerAlt className="text-red-600 text-3xl" />
                    <span className="text-[10px] font-bold bg-white px-1 shadow rounded">You</span>
                  </div>

                  {/* Agent Marker */}
                  {location && (
                    <div 
                      className="absolute transition-all duration-1000 flex flex-col items-center" 
                      style={{ 
                        left: '50%', 
                        top: '50%'
                      }}
                    >
                      <FaTruck className="text-green-600 text-3xl animate-bounce" />
                      <span className="text-[10px] font-bold bg-white px-1 shadow rounded">Agent</span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow text-xs">
                     <p className="font-bold">Live Status: Moving</p>
                     <p className="text-gray-500">Lat: {location?.lat}, Lng: {location?.lng}</p>
                  </div>
               </div>
            </div>
            <p className="mt-4 text-xs text-gray-500 italic text-center">
              * Live location updates every 5 seconds
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
