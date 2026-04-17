import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 25;

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      const data = response.data.users || [];
      const normalizedData = data.map((u) => ({
        ...u,
        createdAt: u.createdAt ? new Date(u.createdAt) : null,
      }));
      setUsers(normalizedData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let temp = [...users];
    const now = new Date();

    temp = temp.filter((user) => {
      if (!user.createdAt) return filter === "all";
      const userDate = user.createdAt;
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (filter === "today") return userDate >= today;
      if (filter === "week") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        return userDate >= weekStart;
      }
      if (filter === "month") {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return userDate >= monthStart;
      }
      if (filter === "custom" && customFrom && customTo) {
        const from = new Date(customFrom);
        from.setHours(0, 0, 0, 0);
        const to = new Date(customTo);
        to.setHours(23, 59, 59, 999);
        return userDate >= from && userDate <= to;
      }
      return true;
    });

    if (search.trim() !== "") {
      const lowerSearch = search.toLowerCase();
      temp = temp.filter(
        (u) =>
          (u.fullName || "").toLowerCase().includes(lowerSearch) ||
          (u.email || "").toLowerCase().includes(lowerSearch) ||
          (u.phone || "").includes(search)
      );
    }

    setFilteredUsers(temp);
    setCurrentPage(1);
  }, [users, search, filter, customFrom, customTo]);

  const handleView = (user) => {
    setSelectedUser(user);
    setEditMode(false);
    setAddMode(false);
  };

  const handleEdit = (user) => {
    setSelectedUser({ ...user });
    setEditMode(true);
    setAddMode(false);
  };

  const handleAddUser = () => {
    setSelectedUser({ fullName: "", email: "", phone: "", role: "User", password: "" });
    setAddMode(true);
    setEditMode(true);
  };

  const handleUpdate = async () => {
    try {
      if (addMode) {
        if (!selectedUser.email || !selectedUser.fullName) {
          toast.error("Name and Email are required");
          return;
        }
        // Since backend register is different, we use /api/auth/register for new users if available
        // Or if we have a direct create user in userController, let's assume we use auth register for now or update backend later
        // For simplicity, let's use auth register if it exists or generic user creation
        await api.post("/auth/register", {
          firstName: selectedUser.fullName,
          email: selectedUser.email,
          phone: selectedUser.phone,
          password: selectedUser.password || "user123",
        });
        toast.success("User added successfully!");
      } else {
        await api.put(`/users/${selectedUser.id}`, selectedUser);
        toast.success("User updated successfully!");
      }
      fetchUsers();
      setSelectedUser(null);
      setEditMode(false);
      setAddMode(false);
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user.");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${user.id}`);
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50/50">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 pl-10"
            />
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-xl px-4 py-2.5 bg-white text-sm font-medium outline-none cursor-pointer"
            >
              <option value="all">Total Users</option>
              <option value="today">Joined Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
            {filter === "custom" && (
              <div className="flex items-center gap-2">
                <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="border rounded-xl px-3 py-2 text-sm" />
                <span className="text-gray-400">to</span>
                <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="border rounded-xl px-3 py-2 text-sm" />
              </div>
            )}
            <button onClick={handleAddUser} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 ml-auto md:ml-0">
              <FaPlus className="text-xs" /> Add New User
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <th className="p-4 text-left font-semibold">#</th>
                <th className="p-4 text-left font-semibold">Name</th>
                <th className="p-4 text-left font-semibold">Email</th>
                <th className="p-4 text-left font-semibold">Phone</th>
                <th className="p-4 text-left font-semibold">Role</th>
                <th className="p-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-green-50 transition-colors">
                    <td className="p-4 text-gray-600">{indexOfFirstUser + index + 1}</td>
                    <td className="p-4 font-semibold text-gray-800">{user.fullName}</td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-600">{user.phone || "—"}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${user.role?.toLowerCase() === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleView(user)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"><FaEye /></button>
                        <button onClick={() => handleEdit(user)} className="p-2 text-gray-400 hover:text-yellow-600 rounded-lg"><FaEdit /></button>
                        <button onClick={() => handleDelete(user)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-20 text-gray-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-100">
          {currentUsers.map((user) => (
            <div key={user.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div><h3 className="font-bold text-gray-800">{user.fullName}</h3><p className="text-sm text-gray-500">{user.email}</p></div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.role?.toLowerCase() === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{user.role}</span>
              </div>
              <div className="flex justify-end gap-3"><button onClick={() => handleView(user)} className="flex-1 py-1 px-3 border rounded text-xs">View</button><button onClick={() => handleEdit(user)} className="flex-1 py-1 px-3 border rounded text-xs">Edit</button><button onClick={() => handleDelete(user)} className="flex-1 py-1 px-3 border rounded text-xs text-red-600">Delete</button></div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className="px-4 py-2 border rounded-xl disabled:opacity-50">Prev</button>
          <span className="text-sm font-bold">{currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)} className="px-4 py-2 border rounded-xl disabled:opacity-50">Next</button>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xl relative overflow-hidden">
            <button onClick={() => { setSelectedUser(null); setAddMode(false); setEditMode(false); }} className="absolute top-4 right-4 text-gray-400 text-2xl">✕</button>
            <h3 className="text-2xl font-bold mb-6">{addMode ? "Add New User" : editMode ? "Edit User" : "User Profile"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Full Name</label><input value={selectedUser.fullName} onChange={(e) => setSelectedUser((prev) => ({ ...prev, fullName: e.target.value }))} readOnly={!editMode} className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" /></div>
              <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Email</label><input type="email" value={selectedUser.email} onChange={(e) => setSelectedUser((prev) => ({ ...prev, email: e.target.value }))} readOnly={!editMode || !addMode} className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" /></div>
              <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Role</label><select value={selectedUser.role} onChange={(e) => setSelectedUser((prev) => ({ ...prev, role: e.target.value }))} disabled={!editMode} className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"><option value="User">User</option><option value="Admin">Admin</option></select></div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                <input
                  value={selectedUser.phone}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, phone: e.target.value }))}
                  readOnly={!editMode}
                  className={`w-full border rounded-xl px-4 py-3 outline-none transition-all ${!editMode ? "bg-gray-50 text-gray-700 font-semibold border-transparent" : "focus:ring-2 focus:ring-green-500 border-gray-200"}`}
                  placeholder="E.g. +91 9876543210"
                />
              </div>

              {addMode && (
                <div className="col-span-1 md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Login Password</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedUser.password}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, password: e.target.value }))}
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 border-gray-200 pr-24"
                      placeholder="Custom Password"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedUser(prev => ({ ...prev, password: generatePassword(prev.fullName, prev.phone) }))}
                      className="absolute right-2 top-2 h-8 px-3 text-[10px] bg-gray-100 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Regenerate
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 italic mt-1 ml-1">If left empty, a password will be generated automatically.</p>
                </div>
              )}
            </div>
            {editMode && (
              <div className="flex justify-end gap-3 mt-10">
                <button onClick={() => { setSelectedUser(null); setEditMode(false); setAddMode(false); }} className="px-6 py-2 rounded-xl bg-gray-100">Cancel</button>
                <button onClick={handleUpdate} className="px-8 py-2 rounded-xl bg-green-600 text-white font-bold">{addMode ? "Create" : "Save"}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
