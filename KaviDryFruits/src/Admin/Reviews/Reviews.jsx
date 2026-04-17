import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi"

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // "add" or "all"
  const [viewMode, setViewMode] = useState("card"); // "table" or "card"
  
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  
  const [formData, setFormData] = useState({
    userName: "",
    comment: "",
  });

  const [editingReview, setEditingReview] = useState(null);

  const formatDate = (createdAt) => {
    if (!createdAt) return "No Date";
    if (typeof createdAt === "string") return new Date(createdAt).toLocaleString();
    if (createdAt.toDate) return createdAt.toDate().toLocaleString();
    return "Invalid Date";
  };

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReviews(data);
      setFilteredReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
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

    // 1. Search Filter
    if (lowerSearch) {
      temp = temp.filter(r => 
        (r.userName || "").toLowerCase().includes(lowerSearch) ||
        (r.comment || "").toLowerCase().includes(lowerSearch)
      );
    }

    // 2. Time Filter
    temp = temp.filter(r => {
      if (timeFilter === "all") return true;
      if (!r.createdAt) return false;

      const reviewDate = r.createdAt.toDate ? r.createdAt.toDate() : new Date(r.createdAt);
      
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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.comment) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingReview) {
        const docRef = doc(db, "reviews", editingReview.id);
        await updateDoc(docRef, { ...formData });
        toast.success("Review updated!");
        setEditingReview(null);
      } else {
        await addDoc(collection(db, "reviews"), {
          ...formData,
          createdAt: serverTimestamp(),
          selected: false,
        });
        toast.success("Review submitted!");
      }

      setFormData({ userName: "", comment: "" });
      setActiveTab("all");
      fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to submit review.");
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteDoc(doc(db, "reviews", id));
      toast.success("Review deleted!");
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review.");
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setFormData({ userName: review.userName, comment: review.comment });
    setActiveTab("add");
  };

  const toggleFeatured = async (id, value) => {
    try {
      const docRef = doc(db, "reviews", id);
      await updateDoc(docRef, { selected: value });
      toast.success(`Review ${value ? "marked" : "unmarked"} as featured.`);
      fetchReviews();
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen bg-transparent">
      {/* Header & Tabs */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Customer Reviews</h2>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Management Dashboard</p>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          <button
            onClick={() => { setActiveTab("all"); setEditingReview(null); setFormData({ userName: "", comment: "" }); }}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "all" ? "bg-green-600 text-white shadow-lg shadow-green-100" : "text-gray-400 hover:text-gray-600"}`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "add" ? "bg-green-600 text-white shadow-lg shadow-green-100" : "text-gray-400 hover:text-gray-600"}`}
          >
            {editingReview ? "Editing Mode" : "Add Review"}
          </button>
        </div>
      </div>

      <div className="animate-in fade-in duration-500">
        {activeTab === "add" ? (
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmitReview} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100 space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                  {editingReview ? "Modify Review Details" : "Publish New Review"}
                </h3>
                <div className="w-12 h-1 bg-green-500 mx-auto mt-2 rounded-full"></div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Customer Name</label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-800"
                    placeholder="Enter customer name..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Review Comment</label>
                  <textarea
                    name="comment"
                    rows="4"
                    value={formData.comment}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-800 resize-none"
                    placeholder="Write the review content here..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {editingReview && (
                  <button
                    type="button"
                    onClick={() => { setEditingReview(null); setFormData({ userName: "", comment: "" }); setActiveTab("all"); }}
                    className="flex-1 py-4 bg-gray-100 text-gray-500 font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-green-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-green-700 shadow-xl shadow-green-100 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  {editingReview ? "Apply Changes" : "Submit Publicly"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            {/* Search, Filter & View Mode Controls */}
            <div className="mb-8 bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Search reviews or customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-green-500 pl-12 font-bold text-sm"
                />
                <span className="absolute left-4 top-3.5 text-gray-300">🔍</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100/50">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "table" ? "bg-white shadow-sm text-green-600" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode("card")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "card" ? "bg-white shadow-sm text-green-600" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    Cards
                  </button>
                </div>

                {timeFilter === "custom" && (
                  <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300">
                    <input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none"
                    />
                    <span className="text-gray-300 font-black">→</span>
                    <input
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none"
                    />
                  </div>
                )}
                
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-gray-50 border-none rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-widest outline-none cursor-pointer"
                >
                  <option value="all">Total Reviews</option>
                  <option value="today">Today's Feedback</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">📅 Custom Range</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-[2rem]"></div>)}
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold uppercase tracking-widest">
                  {searchQuery || timeFilter !== "all" ? "No matches found for your criteria." : "No customer reviews available yet."}
                </p>
              </div>
            ) : viewMode === "table" ? (
              <div className="animate-in fade-in duration-500 overflow-hidden">
                <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm bg-white">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                      <tr>
                        <th className="p-5 text-left font-black uppercase tracking-widest text-[10px]">S No</th>
                        <th className="p-5 text-left font-black uppercase tracking-widest text-[10px]">Customer</th>
                        <th className="p-5 text-left font-black uppercase tracking-widest text-[10px]">Comment</th>
                        <th className="p-5 text-left font-black uppercase tracking-widest text-[10px]">Status</th>
                        <th className="p-5 text-left font-black uppercase tracking-widest text-[10px]">Date</th>
                        <th className="p-5 text-center font-black uppercase tracking-widest text-[10px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-medium">
                      {filteredReviews.map((review, index) => (
                        <tr key={review.id} className="hover:bg-green-50/50 transition-colors group">
                          <td className="p-5 text-gray-500 font-black">{index + 1}</td>
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-700 font-black border border-green-200 shadow-sm">
                                {review.userName?.charAt(0)}
                              </div>
                              <span className="font-black text-gray-900 tracking-tight">{review.userName}</span>
                            </div>
                          </td>
                          <td className="p-5 max-w-xs xl:max-w-md">
                            <p className="text-gray-900 font-medium italic line-clamp-2 leading-relaxed">"{review.comment}"</p>
                          </td>
                          <td className="p-5">
                            <div onClick={() => toggleFeatured(review.id, !review.selected)} className="cursor-pointer group/toggle">
                              {review.selected ? (
                                <span className="flex items-center gap-1.5 px-3 py-2 bg-yellow-400 text-yellow-950 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-yellow-500">⭐ Featured</span>
                              ) : (
                                <span className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 border border-transparent hover:border-gray-300">Standard</span>
                              )}
                            </div>
                          </td>
                          <td className="p-5 text-xs text-gray-600 font-black uppercase tracking-widest">
                            {formatDate(review.createdAt).split(",")[0]}
                          </td>
                          <td className="p-5">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => handleEditReview(review)} className="w-10 h-10 flex items-center justify-center bg-white text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-gray-100 shadow-sm"><FiEdit size={14} /></button>
                              <button onClick={() => handleDeleteReview(review.id)} className="w-10 h-10 flex items-center justify-center bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-gray-100 shadow-sm"><FiTrash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-2xl hover:shadow-green-100 transition-all duration-300">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 font-black text-lg shadow-inner border border-green-200">
                            {review.userName?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-base font-black text-gray-900 tracking-tight">{review.userName}</p>
                            <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Verified Customer</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditReview(review)} className="w-9 h-9 flex items-center justify-center bg-white text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-gray-100 shadow-sm"><FiEdit size={14} /></button>
                          <button onClick={() => handleDeleteReview(review.id)} className="w-9 h-9 flex items-center justify-center bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-gray-100 shadow-sm"><FiTrash2 size={14} /></button>
                        </div>
                      </div>
                      
                      <div className="bg-green-50/30 p-5 rounded-3xl italic text-gray-900 font-medium text-sm leading-relaxed mb-6 border border-green-100 transition-colors shadow-sm">
                        "{review.comment}"
                      </div>
                      
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1 mb-6 flex items-center gap-2">
                        <span className="w-6 h-px bg-green-200"></span>
                        {formatDate(review.createdAt)}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3 cursor-pointer group/label" onClick={() => toggleFeatured(review.id, !review.selected)}>
                        <div className={`w-11 h-6 rounded-full relative transition-all duration-300 ${review.selected ? 'bg-green-500 shadow-lg shadow-green-100' : 'bg-gray-300'}`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${review.selected ? 'right-1' : 'left-1'}`}></div>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${review.selected ? 'text-green-700' : 'text-gray-500'}`}>Featured</span>
                      </div>
                      
                      {review.selected && (
                        <div className="animate-in zoom-in duration-300">
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-yellow-950 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md shadow-yellow-100 border border-yellow-500">
                            ⭐ Highlighted
                          </span>
                        </div>
                      )}
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

export default Reviews;
