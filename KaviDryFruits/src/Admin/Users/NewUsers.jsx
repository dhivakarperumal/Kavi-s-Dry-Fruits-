import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import { toast } from "react-hot-toast";

const NewUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: "", email: "", role: "", phone: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      const data = response.data.users || [];
      
      const normalizedData = data.map((u) => ({
        ...u,
        createdAt: u.createdAt ? new Date(u.createdAt) : null
      }));

      normalizedData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setUsers(normalizedData);
      setFilteredUsers(normalizedData);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const now = new Date();

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const filtered = users
      .filter((u) =>
        (u.fullName || "").toLowerCase().includes(lowerQuery) ||
        (u.email || "").toLowerCase().includes(lowerQuery) ||
        (u.phone || "").toLowerCase().includes(lowerQuery)
      )
      .filter((user) => {
        if (!user.createdAt) return timeFilter === "all";

        switch (timeFilter) {
          case "today":
            return user.createdAt >= todayStart;
          case "week":
            return user.createdAt >= weekStart;
          case "month":
            return user.createdAt >= monthStart;
          case "all":
          default:
            return true;
        }
      });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, users, timeFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName || "",
      email: user.email || "",
      role: user.role || "",
      phone: user.phone || "",
    });
  };

  const closeEditModal = () => setEditingUser(null);

  const handleSave = async () => {
    if (!editingUser) return;
    try {
      await api.put(`/users/${editingUser.id}`, editForm);
      toast.success("User updated successfully!");
      closeEditModal();
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user.");
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search by name, email or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
        />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="all">All Users</option>
            <option value="today">Joined Today</option>
            <option value="week">Joined This Week</option>
            <option value="month">Joined This Month</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <tr>
                <th className="p-4 text-left font-semibold">#</th>
                <th className="p-4 text-left font-semibold">Full Name</th>
                <th className="p-4 text-left font-semibold">Email</th>
                <th className="p-4 text-left font-semibold">Phone</th>
                <th className="p-4 text-left font-semibold">Role</th>
                <th className="p-4 text-left font-semibold">Joined At</th>
                <th className="p-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-green-50 transition-colors">
                    <td className="p-4 text-gray-600">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-4 font-medium text-gray-800">{user.fullName}</td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-600">{user.phone || "—"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                        user.role?.toLowerCase() === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {user.createdAt ? user.createdAt.toLocaleDateString() : "—"}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center">
                      <FaUsers className="text-4xl mb-2 opacity-20" />
                      <p>No users found for this period</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center md:justify-end items-center gap-2 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <div className="flex gap-1 text-sm font-medium">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg border transition-all ${
                  currentPage === i + 1 ? "bg-green-600 text-white border-green-600" : "hover:bg-gray-50 border-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[100] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Edit User Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  disabled
                  className="w-full border rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={closeEditModal} className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewUsers;
