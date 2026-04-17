import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { FaEdit, FaTrash, FaUsers, FaTable, FaThLarge, FaEye } from "react-icons/fa";
import { toast } from "react-hot-toast";

const NewUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: "", email: "", role: "", phone: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // "table" or "card"
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = viewMode === "table" ? 10 : 12;

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

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName || "",
      email: user.email || "",
      role: user.role || "",
      phone: user.phone || "",
    });
  };

  const handleSave = async () => {
    try {
      await api.put(`/users/${selectedUser.id}`, editForm);
      toast.success("User updated successfully!");
      setSelectedUser(null);
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
    <div className="p-4 sm:p-6 min-h-screen bg-transparent">
      {/* Search + Time Filter + View Toggle */}
      <div className="mb-6 bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search recent users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-green-500 pl-12 font-medium"
          />
          <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex bg-gray-50 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "table" ? "bg-white shadow-sm text-green-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <FaTable /> Table
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "card" ? "bg-white shadow-sm text-green-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <FaThLarge /> Cards
            </button>
          </div>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none cursor-pointer"
          >
            <option value="all">All New Users</option>
            <option value="today">Joined Today</option>
            <option value="week">Joined This Week</option>
            <option value="month">Joined This Month</option>
          </select>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="bg-white shadow-xl rounded-[2rem] overflow-hidden border border-gray-100 transition-all animate-in fade-in duration-500">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm font-medium">
              <thead className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <tr className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <th className="p-5 text-left font-bold uppercase tracking-wider">S No</th>
                  <th className="p-5 text-left font-bold uppercase tracking-wider">User Info</th>
                  <th className="p-5 text-left font-bold uppercase tracking-wider">Contact</th>
                  <th className="p-5 text-left font-bold uppercase tracking-wider">Joined At</th>
                  <th className="p-5 text-center font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-green-50/50 transition-colors">
                      <td className="p-5 text-gray-400 font-bold">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-bold">
                            {user.fullName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{user.fullName}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{user.role || 'User'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-400">{user.phone || "—"}</p>
                      </td>
                      <td className="p-5 text-gray-500">
                        {user.createdAt ? user.createdAt.toLocaleDateString() : "—"}
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(user)}
                            className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all border border-gray-100"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-gray-100"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest">
                      <FaUsers className="text-4xl mx-auto mb-4 opacity-10" />
                      No recent user activity found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {paginatedUsers.map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-green-100 text-green-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {user.fullName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate text-lg tracking-tight">{user.fullName}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${user.role?.toLowerCase() === 'admin' ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user.role || "User"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50/50 p-2 rounded-xl border border-transparent group-hover:border-gray-100 transition-colors">
                  <span className="w-6 h-6 flex items-center justify-center bg-white rounded-lg shadow-sm text-xs">📧</span>
                  <span className="truncate font-medium">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50/50 p-2 rounded-xl border border-transparent group-hover:border-gray-100 transition-colors">
                  <span className="w-6 h-6 flex items-center justify-center bg-white rounded-lg shadow-sm text-xs">📅</span>
                  <span className="font-medium">Joined {user.createdAt?.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => handleEdit(user)} 
                  className="flex-[2] py-2.5 text-xs font-bold bg-green-600 text-white hover:bg-green-700 rounded-xl transition-all shadow-md shadow-green-100 active:scale-95"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={() => handleDelete(user.id)} 
                  className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center md:justify-end items-center gap-3 mt-10 p-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
          >
            ←
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all ${
                  currentPage === i + 1 ? "bg-green-600 text-white shadow-xl shadow-green-200" : "bg-white border border-gray-100 text-gray-400 hover:border-green-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm font-bold"
          >
            →
          </button>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[100] backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300 relative overflow-hidden">
            <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 bg-gray-50 rounded-2xl transition-all">✕</button>
            
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Modify User Access</h2>
              <div className="w-12 h-1 bg-green-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full bg-gray-50 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-green-500/10 border-2 border-transparent focus:border-green-500 font-bold text-gray-800 transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Contact</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-gray-50 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-green-500/10 border-2 border-transparent focus:border-green-500 font-bold text-gray-800 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Authorization</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full bg-gray-50 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-green-500/10 border-2 border-transparent focus:border-green-500 font-bold text-gray-800 transition-all appearance-none cursor-pointer"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-10">
              <button onClick={() => setSelectedUser(null)} className="flex-1 py-5 rounded-[1.25rem] bg-gray-100 text-gray-500 font-bold uppercase tracking-widest hover:bg-gray-200 transition-all">Cancel</button>
              <button onClick={handleSave} className="flex-[2] py-5 rounded-[1.25rem] bg-green-600 text-white font-bold uppercase tracking-widest shadow-2xl shadow-green-100 hover:bg-green-700 hover:-translate-y-1 active:translate-y-0 transition-all">Commit Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewUsers;
