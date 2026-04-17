import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

const AddDealer = () => {
  const [formData, setFormData] = useState({
    dealerName: "",
    dealerGSTNumber: "",
    dealerPhoneNumber: "",
    dealerMail: "",
    dealerAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const [dealerId, setDealerId] = useState("");
  const [viewMode, setViewMode] = useState("add");
  const [dealers, setDealers] = useState([]);

  // --- Generate Next Dealer ID ---
  const generateDealerId = async () => {
    try {
      const res = await api.get("/dealers");
      if (res.data.length === 0) {
        setDealerId("KD0001");
      } else {
        const sorted = res.data.sort((a, b) => {
          const numA = parseInt(a.dealerId.replace("KD", ""), 10);
          const numB = parseInt(b.dealerId.replace("KD", ""), 10);
          return numB - numA;
        });
        const lastId = sorted[0].dealerId;
        const num = parseInt(lastId.replace("KD", ""), 10) + 1;
        const newId = "KD" + num.toString().padStart(4, "0");
        setDealerId(newId);
      }
    } catch (error) {
      console.error("Error generating dealer ID:", error);
      toast.error("Failed to generate dealer ID");
    }
  };

  // --- Fetch Dealers ---
  const fetchDealers = async () => {
    try {
      const res = await api.get("/dealers");
      setDealers(res.data);
    } catch (error) {
      console.error("Error fetching dealers:", error);
      toast.error("Error loading dealers");
    }
  };

  useEffect(() => {
    generateDealerId();
  }, []);

  useEffect(() => {
    if (viewMode === "view") fetchDealers();
  }, [viewMode]);

  // --- Handle Input Change ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Submit Form ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dealerId || !formData.dealerName || !formData.dealerPhoneNumber) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/dealers", {
        dealerId,
        ...formData,
      });

      toast.success("Dealer added successfully!");
      setFormData({
        dealerName: "",
        dealerGSTNumber: "",
        dealerPhoneNumber: "",
        dealerMail: "",
        dealerAddress: "",
      });
      generateDealerId();
    } catch (error) {
      console.error(error);
      toast.error("Error adding dealer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6">
      {/* Header & Toggle Buttons */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold"></h2>
        <div className="flex gap-3">
          <button
            onClick={() => setViewMode("add")}
            className={`px-4 py-2 rounded-md text-white font-semibold transition-colors ${
              viewMode === "add" ? "bg-green-600" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Add Dealer
          </button>
          <button
            onClick={() => setViewMode("view")}
            className={`px-4 py-2 rounded-md text-white font-semibold transition-colors ${
              viewMode === "view" ? "bg-green-600" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Show Dealers
          </button>
        </div>
      </div>

      {/* --- ADD DEALER FORM --- */}
      {viewMode === "add" && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dealer ID */}
              <div>
                <label className="block text-sm font-medium mb-1">Dealer ID</label>
                <input
                  type="text"
                  value={dealerId}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Dealer Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Dealer Name *</label>
                <input
                  type="text"
                  name="dealerName"
                  value={formData.dealerName}
                  onChange={handleChange}
                  placeholder="Enter dealer name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* GST Number */}
              <div>
                <label className="block text-sm font-medium mb-1">GST Number</label>
                <input
                  type="text"
                  name="dealerGSTNumber"
                  value={formData.dealerGSTNumber}
                  onChange={handleChange}
                  placeholder="Enter GST number (optional)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input
                  type="text"
                  name="dealerPhoneNumber"
                  value={formData.dealerPhoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="dealerMail"
                  value={formData.dealerMail}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  name="dealerAddress"
                  value={formData.dealerAddress}
                  onChange={handleChange}
                  placeholder="Enter dealer address"
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
            >
              {loading ? "Adding..." : "Add Dealer"}
            </button>
          </form>
        </div>
      )}

      {/* --- VIEW DEALERS SECTION --- */}
      {viewMode === "view" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealers.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">No dealers found.</p>
          ) : (
            dealers.map((dealer, idx) => (
              <div
                key={idx}
                className="bg-white border border-green-300 rounded-lg p-5 shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-green-800 mb-1">{dealer.dealerId}</h3>
                <p className="text-sm">
                  <strong>Name:</strong> {dealer.dealerName}
                </p>
                {dealer.dealerGSTNumber && (
                  <p className="text-sm">
                    <strong>GST:</strong> {dealer.dealerGSTNumber}
                  </p>
                )}
                <p className="text-sm">
                  <strong>Phone:</strong> {dealer.dealerPhoneNumber}
                </p>
                {dealer.dealerMail && (
                  <p className="text-sm">
                    <strong>Email:</strong> {dealer.dealerMail}
                  </p>
                )}
                {dealer.dealerAddress && (
                  <p className="text-sm mt-1 text-gray-700">
                    <strong>Address:</strong> {dealer.dealerAddress}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AddDealer;
