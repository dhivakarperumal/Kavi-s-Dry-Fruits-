import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2, FiCamera, FiUploadCloud, FiPlus, FiX } from "react-icons/fi";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("card"); // "table" or "card"
  const [showModal, setShowModal] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  
  const [formData, setFormData] = useState({
    userName: "",
    comment: "",
    image: null,
    selected: false,
  });

  const [editingReview, setEditingReview] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "No Date";
    return new Date(dateStr).toLocaleString();
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reviews");
      const data = response.data || [];
      setReviews(data);
      setFilteredReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      toast.error("Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    let temp = [...reviews];
    const now = new Date();
    const lowerSearch = searchQuery.toLowerCase();

    if (lowerSearch) {
      temp = temp.filter(r => 
        (r.userName || "").toLowerCase().includes(lowerSearch) ||
        (r.comment || "").toLowerCase().includes(lowerSearch)
      );
    }

    temp = temp.filter(r => {
      if (timeFilter === "all") return true;
      if (!r.created_at) return false;
      const reviewDate = new Date(r.created_at);
      
      if (timeFilter === "today") {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return reviewDate >= today;
      }
      if (timeFilter === "week") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        return reviewDate >= weekStart;
      }
      if (timeFilter === "month") {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return reviewDate >= monthStart;
      }
      if (timeFilter === "custom" && customFrom && customTo) {
        const from = new Date(customFrom);
        from.setHours(0, 0, 0, 0);
        const to = new Date(customTo);
        to.setHours(23, 59, 59, 999);
        return reviewDate >= from && reviewDate <= to;
      }
      return true;
    });

    setFilteredReviews(temp);
  }, [searchQuery, timeFilter, customFrom, customTo, reviews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.7 quality
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressedBase64);
        };
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large! Max 5MB allowed before compression.");
        return;
      }
      try {
        const compressed = await compressImage(file);
        setFormData(prev => ({ ...prev, image: compressed }));
        toast.success("Image optimized!");
      } catch (err) {
        console.error("Compression failed:", err);
        toast.error("Failed to process image.");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReview(null);
    setFormData({ userName: "", comment: "", image: null, selected: false });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.comment) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview.id}`, formData);
        toast.success("Review updated!");
      } else {
        await api.post("/reviews", formData);
        toast.success("Review published!");
      }

      closeModal();
      fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to save.");
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success("Review removed!");
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Action failed.");
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setFormData({ 
      userName: review.userName, 
      comment: review.comment, 
      image: review.image,
      selected: review.selected 
    });
    setShowModal(true);
  };

  const toggleFeatured = async (review) => {
    try {
      const newValue = !review.selected;
      await api.put(`/reviews/${review.id}`, { ...review, selected: newValue });
      toast.success(newValue ? "Highlighted!" : "Removed highlight");
      fetchReviews();
    } catch (error) {
      console.error("Error updating featured status:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen bg-transparent">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Reviews Wall</h2>
          <p className="text-sm text-green-600 font-black uppercase tracking-widest mt-1 flex items-center gap-2">
            <span className="w-8 h-1 bg-green-500 rounded-full"></span>
            Customer Testimonials
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-green-600 text-white font-black uppercase tracking-widest rounded-[2rem] hover:bg-green-700 shadow-xl shadow-green-100 transition-all hover:-translate-y-1 active:translate-y-0 border-b-4 border-green-800"
        >
          <FiPlus className="text-xl" />
          Add Feedback
        </button>
      </div>

      {/* Main Content Area */}
      <div className="animate-in fade-in duration-500">
        {/* Search, Filter & View Mode Controls */}
        <div className="mb-10 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search customers or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-green-500 pl-14 font-bold text-gray-900 shadow-inner"
            />
            <span className="absolute left-5 top-4.5 text-gray-300 text-xl">🔍</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200/50 shadow-inner">
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === "table" ? "bg-white shadow-md text-green-700" : "text-gray-400 hover:text-gray-600"}`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === "card" ? "bg-white shadow-md text-green-700" : "text-gray-400 hover:text-gray-600"}`}
              >
                Cards
              </button>
            </div>

            {timeFilter === "custom" && (
              <div className="flex items-center gap-3 animate-in slide-in-from-right-4 duration-300 bg-gray-50 p-1.5 rounded-2xl shadow-inner border border-gray-100">
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="bg-transparent border-none px-3 py-1 text-xs font-bold outline-none text-gray-900"
                />
                <span className="text-gray-300 font-black">→</span>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="bg-transparent border-none px-3 py-1 text-xs font-bold outline-none text-gray-900"
                />
              </div>
            )}
            
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-white border-2 border-gray-100 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-widest shadow-sm outline-none cursor-pointer focus:border-green-500 transition-colors"
            >
              <option value="all">Every Feedback</option>
              <option value="today">Today's Voice</option>
              <option value="week">Weekly View</option>
              <option value="month">Monthly Stats</option>
              <option value="custom">📅 Range Pick</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white border border-gray-100 animate-pulse rounded-[3rem] shadow-sm"></div>)}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-gray-50 shadow-inner">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-lg">
              {searchQuery || timeFilter !== "all" ? "No matches found." : "The review wall is empty."}
            </p>
          </div>
        ) : viewMode === "table" ? (
          <div className="overflow-hidden">
            <div className="overflow-x-auto rounded-[2.5rem] border border-gray-100 shadow-xl bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                  <tr>
                    <th className="p-6 text-left font-black uppercase tracking-widest text-[10px]">Pos.</th>
                    <th className="p-6 text-left font-black uppercase tracking-widest text-[10px]">Contributor</th>
                    <th className="p-6 text-left font-black uppercase tracking-widest text-[10px]">Visual</th>
                    <th className="p-6 text-left font-black uppercase tracking-widest text-[10px]">The Message</th>
                    <th className="p-6 text-left font-black uppercase tracking-widest text-[10px]">Status</th>
                    <th className="p-6 text-left font-black uppercase tracking-widest text-[10px]">Date</th>
                    <th className="p-6 text-center font-black uppercase tracking-widest text-[10px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredReviews.map((review, index) => (
                    <tr key={review.id} className="hover:bg-green-50/40 transition-colors group">
                      <td className="p-6 text-gray-500 font-black">{index + 1}</td>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 font-black border border-green-200 shadow-sm relative overflow-hidden">
                            {review.userName?.charAt(0)}
                          </div>
                          <span className="font-black text-gray-900 text-base">{review.userName}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        {review.image ? (
                          <div className="w-16 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative group/img shadow-inner">
                            <img src={review.image} className="w-full h-full object-cover transition-transform group-hover/img:scale-150" alt="Review" />
                          </div>
                        ) : (
                          <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">No Image</span>
                        )}
                      </td>
                      <td className="p-6 max-w-xs xl:max-w-md">
                        <p className="text-gray-900 font-medium italic line-clamp-2 leading-relaxed">"{review.comment}"</p>
                      </td>
                      <td className="p-6">
                        <div onClick={() => toggleFeatured(review)} className="cursor-pointer">
                          {review.selected ? (
                            <span className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-950 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-yellow-500 shadow-sm">⭐ Featured</span>
                          ) : (
                            <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 border border-transparent hover:border-gray-300">Standard</span>
                          )}
                        </div>
                      </td>
                      <td className="p-6 text-xs text-gray-900 font-black uppercase tracking-widest">
                        {formatDate(review.created_at).split(",")[0]}
                      </td>
                      <td className="p-6">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => handleEditReview(review)} className="w-11 h-11 flex items-center justify-center bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-gray-200 shadow-sm"><FiEdit size={16} /></button>
                          <button onClick={() => handleDeleteReview(review.id)} className="w-11 h-11 flex items-center justify-center bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-gray-200 shadow-sm"><FiTrash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-2xl hover:shadow-green-100 transition-all duration-300 h-full">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 font-black text-xl shadow-inner border border-green-200">
                        {review.userName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-lg font-black text-gray-900 tracking-tight">{review.userName}</p>
                        <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Client Feedback</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditReview(review)} className="w-10 h-10 flex items-center justify-center bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-gray-100 shadow-sm"><FiEdit size={16} /></button>
                      <button onClick={() => handleDeleteReview(review.id)} className="w-10 h-10 flex items-center justify-center bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-gray-100 shadow-sm"><FiTrash2 size={16} /></button>
                    </div>
                  </div>
                  
                  {review.image && (
                    <div className="mb-6 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white aspect-video relative group/item">
                      <img src={review.image} className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" alt="Review" />
                    </div>
                  )}
                  
                  <div className="bg-green-50/30 p-6 rounded-3xl italic text-gray-900 font-medium text-sm leading-relaxed mb-6 border border-green-50 transition-colors shadow-inner relative">
                    <span className="absolute -top-3 left-4 text-4xl text-green-200 opacity-50">“</span>
                    "{review.comment}"
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 cursor-pointer group/label" onClick={() => toggleFeatured(review)}>
                    <div className={`w-12 h-7 rounded-full relative transition-all duration-500 ${review.selected ? 'bg-green-500 shadow-lg shadow-green-100' : 'bg-gray-300'}`}>
                      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${review.selected ? 'right-1' : 'left-1'}`}></div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${review.selected ? 'text-green-700' : 'text-gray-500'}`}>Featured</span>
                  </div>
                  
                  <p className="text-[10px] text-gray-900 font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-green-100"></span>
                    {formatDate(review.created_at).split(",")[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal / Popup Form */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
            <button
              onClick={closeModal}
              className="absolute top-8 right-8 w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-2xl flex items-center justify-center transition-all z-10"
            >
              <FiX className="text-2xl" />
            </button>

            <form onSubmit={handleSubmitReview} className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                    {editingReview ? "Update Review" : "Add Feedback"}
                  </h3>
                  <div className="w-16 h-1.5 bg-green-500 mt-2 rounded-full"></div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Customer Name</label>
                    <input
                      type="text"
                      name="userName"
                      required
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-900 shadow-inner"
                      placeholder="e.g. Enter Name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Testimonial</label>
                    <textarea
                      name="comment"
                      rows="6"
                      required
                      value={formData.comment}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-900 resize-none shadow-inner leading-relaxed"
                      placeholder="Write the customer's experience here..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between pt-10 md:pt-4">
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center block">Media Attachment</label>
                  <div className="relative group mx-auto w-full aspect-square max-w-[280px]">
                    <div className="absolute inset-0 bg-green-50 rounded-[2.5rem] border-4 border-dashed border-green-200 group-hover:border-green-400 transition-colors flex flex-col items-center justify-center overflow-hidden">
                      {formData.image ? (
                        <div className="relative w-full h-full">
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <FiUploadCloud className="text-green-500 text-5xl mx-auto mb-4" />
                          <p className="text-xs font-black text-green-700 uppercase">Drop Image Here</p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {formData.image && (
                      <button type="button" onClick={() => setFormData(p => ({ ...p, image: null }))} className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">✕</button>
                    )}
                  </div>

                  <div onClick={() => setFormData(p => ({ ...p, selected: !p.selected }))} className="cursor-pointer bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-black text-gray-700 uppercase tracking-widest pl-2">Feature on Homepage</span>
                    <div className={`w-12 h-7 rounded-full relative transition-all duration-300 ${formData.selected ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${formData.selected ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-8">
                  <button
                    type="submit"
                    className="flex-1 py-5 bg-green-600 text-white font-black uppercase tracking-widest rounded-3xl hover:bg-green-700 shadow-xl shadow-green-100 transition-all border-b-4 border-green-800"
                  >
                    {editingReview ? "Save Changes" : "Publish Review"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
