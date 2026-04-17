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
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    userName: "",
    comment: "",
  });

  const [editingReview, setEditingReview] = useState(null); // ✅ track edit mode

  // ✅ Safe date formatter
  const formatDate = (createdAt) => {
    if (!createdAt) return "No Date";
    if (typeof createdAt === "string") return new Date(createdAt).toLocaleString();
    if (createdAt.toDate) return createdAt.toDate().toLocaleString();
    return "Invalid Date";
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add or Update Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!formData.userName || !formData.comment) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingReview) {
        // update
        const docRef = doc(db, "reviews", editingReview.id);
        await updateDoc(docRef, {
          ...formData,
        });
        toast.success("Review updated!");
        setEditingReview(null);
      } else {
        // add
        await addDoc(collection(db, "reviews"), {
          ...formData,
          createdAt: serverTimestamp(),
          selected: false,
        });
        toast.success("Review submitted!");
      }

      setFormData({ userName: "", comment: "" });
      fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to submit review.");
    }
  };

  // ✅ Delete Review
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

  // ✅ Start editing
  const handleEditReview = (review) => {
    setEditingReview(review);
    setFormData({ userName: review.userName, comment: review.comment });
  };

  // ✅ Toggle Featured
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
    <div className="p-4 max-w-6xl mx-auto">
      

      {/* Add/Edit Review Form */}
      <form
        onSubmit={handleSubmitReview}
        className="mb-6 bg-white p-4 shadow rounded space-y-4"
      >
        <h3 className="text-lg font-semibold">
          {editingReview ? "Edit Review" : "Add New Review"}
        </h3>
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Your Name"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Comment</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Your Comment"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
          >
            {editingReview ? "Update Review" : "Submit Review"}
          </button>
          {editingReview && (
            <button
              type="button"
              onClick={() => {
                setEditingReview(null);
                setFormData({ userName: "", comment: "" });
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Review List */}
      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-600">No reviews found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-4 rounded shadow flex flex-col justify-between gap-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm  font-bold">
                    {review.userName}
                  </p>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(review.createdAt)}
                  </p>
                </div>

              </div>

              {/* ✅ Toggle Featured */}
              <div className="mt-2 flex justify-between items-center gap-2">
                <div>
                  <input
                  type="checkbox"
                  checked={review.selected || false}
                  onChange={() => toggleFeatured(review.id, !review.selected)}
                />
                <label className="text-xs text-gray-700">Mark as Featured</label>
                </div>

                <div className="flex gap-2">
                <button
                  onClick={() => handleEditReview(review)}
                  className="text-blue-600 border border-gray-400 rounded p-1 hover:text-blue-800"
                >
                  <FiEdit size={12} />
                </button>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-red-600 border border-gray-400 rounded p-1 hover:text-red-800"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
              </div>

              
            </div>
          ))}
        </div>

      )}
    </div>
  );
};

export default Reviews;
