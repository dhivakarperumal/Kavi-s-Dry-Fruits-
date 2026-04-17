import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { FaPlus, FaTrash, FaStore, FaPhone, FaEnvelope, FaMapLocationDot, FaFileInvoiceDollar } from "react-icons/fa6";

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
    <div className="w-full p-4 md:p-10 mt-15 min-h-screen bg-transparent animate-in fade-in duration-700">
      {/* Header & Tabs */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-8 bg-white/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/60 shadow-xl shadow-gray-100">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-100 bg-gradient-to-tr from-purple-600 to-pink-400`}>
              <FaStore size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                Dealer Management <span className="text-gray-400 font-medium tracking-normal text-3xl">Hub</span>
              </h1>
              <p className="text-sm font-black text-purple-600 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
                Business Partner Control
              </p>
            </div>
          </div>
        </div>

        <div className="flex bg-gray-200/50 p-2 rounded-[2rem] shadow-inner backdrop-blur-sm border border-white/50">
          <button
            onClick={() => setViewMode("add")}
            className={`flex items-center gap-3 px-10 py-4 rounded-[1.5rem] transition-all duration-500 font-black uppercase tracking-widest text-xs ${viewMode === "add" ? "bg-white text-purple-700 shadow-xl scale-105 border border-purple-100" : "text-gray-500 hover:text-purple-600"}`}
          >
            <FaPlus className={viewMode === "add" ? "animate-bounce" : ""} /> Add Dealer
          </button>
          <button
            onClick={() => setViewMode("view")}
            className={`flex items-center gap-3 px-10 py-4 rounded-[1.5rem] transition-all duration-500 font-black uppercase tracking-widest text-xs ${viewMode === "view" ? "bg-white text-purple-700 shadow-xl scale-105 border border-purple-100" : "text-gray-500 hover:text-purple-600"}`}
          >
            <FaStore className={viewMode === "view" ? "animate-bounce" : ""} /> View Dealers
          </button>
        </div>
      </div>

      <div className="animate-in slide-in-from-bottom-8 duration-700">
        {/* --- ADD DEALER FORM --- */}
        {viewMode === "add" && (
          <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-purple-100 ring-1 ring-purple-50">
            <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-400 p-10 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight">Dealer Entry Studio</h2>
                  <p className="opacity-90 font-medium mt-1 text-purple-50 uppercase tracking-[0.2em] text-xs">
                    New Business Partnership
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30">
                  <span className="font-black tracking-widest text-sm">{dealerId}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              {/* Dealer Name & Phone - Top Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block flex items-center gap-2">
                    <FaStore className="text-purple-500" /> Dealer Name *
                  </label>
                  <input
                    type="text"
                    name="dealerName"
                    value={formData.dealerName}
                    onChange={handleChange}
                    placeholder="Enter dealer business name"
                    required
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-500 rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block flex items-center gap-2">
                    <FaPhone className="text-purple-500" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="dealerPhoneNumber"
                    value={formData.dealerPhoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-500 rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-900"
                  />
                </div>
              </div>

              {/* GST & Email */}
              <div className="bg-purple-50 rounded-[2rem] border border-purple-100 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2 block flex items-center gap-2">
                      <FaFileInvoiceDollar /> GST Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="dealerGSTNumber"
                      value={formData.dealerGSTNumber}
                      onChange={handleChange}
                      placeholder="e.g. 27AAPCT1234H1Z5"
                      className="w-full bg-white border-2 border-transparent focus:border-purple-500 rounded-2xl px-6 py-4 text-sm outline-none transition-all font-medium text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2 block flex items-center gap-2">
                      <FaEnvelope /> Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="dealerMail"
                      value={formData.dealerMail}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full bg-white border-2 border-transparent focus:border-purple-500 rounded-2xl px-6 py-4 text-sm outline-none transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block flex items-center gap-2">
                  <FaMapLocationDot className="text-purple-500" /> Dealer Address (Optional)
                </label>
                <textarea
                  name="dealerAddress"
                  value={formData.dealerAddress}
                  onChange={handleChange}
                  placeholder="Enter complete business address"
                  rows="4"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-500 rounded-2xl px-6 py-4 outline-none transition-all resize-none font-medium text-gray-900"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FaPlus size={16} />
                  {loading ? "Adding Dealer..." : "Add New Dealer"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- VIEW DEALERS SECTION --- */}
        {viewMode === "view" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
                <FaStore className="text-purple-600" />
                All Dealers <span className="text-purple-600 text-2xl">({dealers.length})</span>
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-pink-400 rounded-full"></div>
            </div>

            {dealers.length === 0 ? (
              <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-200 p-16 text-center shadow-sm">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStore size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-bold text-lg">No dealers found</p>
                <p className="text-gray-400 text-sm mt-1">Start by adding your first dealer</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dealers.map((dealer) => (
                  <div
                    key={dealer.id}
                    className="bg-white rounded-[2rem] border-2 border-purple-100 p-7 shadow-md hover:shadow-xl transition-all duration-300 hover:border-purple-300 group overflow-hidden relative"
                  >
                    {/* Background gradient accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4 pb-4 border-b-2 border-purple-100">
                        <div>
                          <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Dealer ID</p>
                          <h3 className="text-2xl font-black text-gray-900 mt-1">{dealer.dealerId}</h3>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-400 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                          <FaStore size={20} />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Name</p>
                          <p className="text-lg font-bold text-gray-900">{dealer.dealerName}</p>
                        </div>

                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                            <FaPhone size={12} /> Phone
                          </p>
                          <p className="text-base font-semibold text-purple-600">{dealer.dealerPhoneNumber}</p>
                        </div>

                        {dealer.dealerGSTNumber && (
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                              <FaFileInvoiceDollar size={12} /> GST Number
                            </p>
                            <p className="text-base font-semibold text-gray-700">{dealer.dealerGSTNumber}</p>
                          </div>
                        )}

                        {dealer.dealerMail && (
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                              <FaEnvelope size={12} /> Email
                            </p>
                            <p className="text-base font-semibold text-gray-700 break-all">{dealer.dealerMail}</p>
                          </div>
                        )}

                        {dealer.dealerAddress && (
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                              <FaMapLocationDot size={12} /> Address
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed">{dealer.dealerAddress}</p>
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 font-medium">
                          Added on {new Date(dealer.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddDealer;
