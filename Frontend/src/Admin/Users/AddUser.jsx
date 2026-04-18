import React, { useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

const AddUsers = () => {
  const [editUserId, setEditUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "User",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editUserId) {
        await api.put(`/users/${editUserId}`, formData);
        toast.success("User updated successfully");
        setEditUserId(null);
      } else {
        const password = formData.password || "user123";
        await api.post("/auth/register", {
          firstName: formData.username,
          email: formData.email,
          password: password,
          role: formData.role || "User"
        });

        toast.success(`User registered successfully.`);
      }

      setFormData({
        username: "",
        email: "",
        password: "",
        role: "User",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error saving user: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-800 mb-6">{editUserId ? "Update Identity" : "New User Registration"}</h2>
        
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Username / Full Name</label>
          <input
            type="text"
            name="username"
            placeholder="e.g. John Doe"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full border-2 border-transparent bg-gray-50 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="e.g. john@domain.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border-2 border-transparent bg-gray-50 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold"
            disabled={!!editUserId}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
          <input
            type="text"
            name="password"
            placeholder="Enter password or leave for default"
            value={formData.password}
            onChange={handleChange}
            className="w-full border-2 border-transparent bg-gray-50 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Authorization Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full border-2 border-transparent bg-gray-50 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold appearance-none cursor-pointer"
          >
            <option value="User">Standard User</option>
            <option value="Admin">Administrator</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-black py-4 rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-95 text-sm uppercase tracking-widest mt-4"
        >
          {editUserId ? "Apply Updates" : "Confirm Registration"}
        </button>
      </form>
    </div>
  );
};

export default AddUsers;
