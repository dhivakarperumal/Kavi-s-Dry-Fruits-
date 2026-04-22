import React, { useState, useEffect } from "react";
import { FaUserCircle, FaEnvelope, FaLock, FaCamera, FaPhone } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "../../PrivateRouter/AuthContext";
import api from "../../services/api";

const Profile = () => {
  const { user, login } = useAuth(); // assuming login/updateUser function exists in context if needed to update local storage
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || user.displayName || user.username || "Administrator",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const userId = user?.userId || user?.user_id || user?.userUuid || user?.id || user?.uid;
      
      if (!userId) {
        toast.error("User context missing ID");
        setLoading(false);
        return;
      }

      const payload = {
        name: formData.name,
        phone: formData.phone,
      };

      if (formData.currentPassword && formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      // Assume generic user update endpoint
      const response = await api.put(`/users/${userId}`, payload);
      
      toast.success("Profile settings updated successfully!");
      
      // Clear password fields on success
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to update profile settings.");
    } finally {
      setLoading(false);
    }
  };

  const displayName = formData.name || "A";

  return (
    <div className="p-4 md:p-6 min-h-[500px]">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header Cover & Avatar */}
        <div className="h-32 bg-emerald-600 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                <span className="text-4xl font-bold text-emerald-600 uppercase">
                  {displayName.charAt(0)}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 hover:bg-emerald-100 transition shadow-sm">
                <FaCamera size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info Form */}
        <div className="pt-16 pb-8 px-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Profile</h2>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Personal info */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-2">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <FaUserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    title="Email cannot be changed"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all"
                  />
                </div>
              </div>

            </div>

            {/* Right Column: Security */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-2">Security</h3>
              <p className="text-xs text-gray-400 mt-0">Leave blank if you don't want to change the password.</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-6 flex justify-end gap-3 ">
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                  }));
                }}
                className="px-6 py-2.5 text-gray-600 bg-gray-50 hover:bg-gray-100 font-bold rounded-lg transition-all"
              >
                Clear Details
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-lg shadow-md shadow-emerald-200 transition-all flex items-center gap-2"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
