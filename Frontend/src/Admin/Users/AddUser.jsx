import React, { useState } from "react";
import { db } from "../../firebase";
import { setDoc, doc, updateDoc, collection } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-hot-toast";

const AddUsers = () => {
  const auth = getAuth();

  const [editUserId, setEditUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
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
        // Update Firestore only
        const { password, ...dataWithoutPassword } = formData;
        await updateDoc(doc(db, "users", editUserId), dataWithoutPassword);
        toast.success("User updated successfully");
        setEditUserId(null);
      } else {
        // Auto-generate password if empty
        const password = formData.password || formData.username;

        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          password
        );

        const uid = userCredential.user.uid;

        // Save user in Firestore
        await setDoc(doc(db, "users", uid), {
          ...formData,
          uid,
          password, // stored for reference only
          createdAt: new Date(),
        });

        toast.success(
          `User created successfully. Password: "${password}" (for reference only)`
        );
      }

      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error saving user: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={!!editUserId} // disable editing email
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Password (for reference only)
          </label>
          <input
            type="text"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white font-bold px-6 py-2 rounded hover:bg-green-900"
        >
          {editUserId ? "Update User" : "Add User"}
        </button>
      </form>
    </div>
  );
};

export default AddUsers;
