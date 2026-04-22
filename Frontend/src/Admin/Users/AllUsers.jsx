import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { FaEye, FaEdit, FaTrash, FaPlus, FaThLarge, FaTable } from "react-icons/fa";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // "table" or "card"

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = viewMode === "table" ? 15 : 12;

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

  const handleUpdate = async () => {
    try {
      if (addMode) {
        if (!selectedUser.email || !selectedUser.fullName || !selectedUser.role) {
          toast.error("Name, Email and Role are required");
          return;
        }
        await api.post("/auth/register", {
          firstName: selectedUser.fullName,
          email: selectedUser.email,
          phone: selectedUser.phone,
          password: selectedUser.password || "user123",
          role: selectedUser.role || "User"
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

  const generatePassword = (name, phone) => {
    if (!name || !phone) return "kavi" + Math.floor(Math.random() * 1000);
    const lastTwo = phone.slice(-2);
    return name.replace(/\s+/g, "").toLowerCase() + lastTwo;
  };

  const handleAddUser = () => {
    setSelectedUser({ fullName: "", email: "", phone: "", role: "", password: "" });
    setAddMode(true);
    setEditMode(true);
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50/50">
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-none bg-gray-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-green-500 pl-12 font-medium"
            />
            <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "table" ? "bg-white shadow-sm text-green-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                <FaTable /> Table
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "card" ? "bg-white shadow-sm text-green-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                <FaThLarge /> Cards
              </button>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border-none bg-gray-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none cursor-pointer"
            >
              <option value="all">Total Users</option>
              <option value="today">Joined Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>

            <button onClick={handleAddUser} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-100 active:scale-95">
              <FaPlus className="text-xs" /> Add New
            </button>
          </div>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="overflow-hidden animate-in fade-in duration-500">
          <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-[#009669] border-b border-emerald-700">
              <tr className="text-white">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">S.No</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Identity Profile</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Connectivity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Authorization</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Activity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {currentUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-green-50/50 transition-colors group">
                    <td className="p-5 text-gray-400 font-bold">{(currentPage - 1) * usersPerPage + index + 1}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-bold">
                          {user.fullName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{user.fullName}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="text-gray-700">{user.email}</p>
                      <p className="text-xs text-gray-400 font-bold tracking-tight">{user.phone || "No phone number"}</p>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${user.role?.toLowerCase() === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-5 text-gray-500 font-bold text-xs uppercase tracking-tighter">
                      {user.createdAt ? user.createdAt.toLocaleDateString() : "—"}
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => { setSelectedUser(user); setEditMode(false); }} className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-gray-100"><FaEye /></button>
                        <button onClick={() => { setSelectedUser({ ...user }); setEditMode(true); }} className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-xl transition-all border border-gray-100"><FaEdit /></button>
                        <button onClick={() => handleDelete(user)} className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-gray-100"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {currentUsers.map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-green-100 text-green-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {user.fullName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate text-lg tracking-tight">{user.fullName}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${user.role?.toLowerCase() === 'admin' ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50/50 p-2 rounded-xl border border-transparent group-hover:border-gray-100 transition-colors">
                  <span className="w-6 h-6 flex items-center justify-center bg-white rounded-lg shadow-sm text-xs">📧</span>
                  <span className="truncate font-medium">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50/50 p-2 rounded-xl border border-transparent group-hover:border-gray-100 transition-colors">
                    <span className="w-6 h-6 flex items-center justify-center bg-white rounded-lg shadow-sm text-xs">📞</span>
                    <span className="font-medium">{user.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => { setSelectedUser(user); setEditMode(false); }} 
                  className="flex-1 py-2.5 text-xs font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                >
                  Details
                </button>
                <div className="flex gap-1 flex-[1.5]">
                  <button 
                    onClick={() => { setSelectedUser({ ...user }); setEditMode(true); }} 
                    className="flex-1 py-2.5 text-xs font-bold bg-green-600 text-white hover:bg-green-700 rounded-xl transition-all shadow-md shadow-green-100 active:scale-95"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => handleDelete(user)} 
                    className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 px-4">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Page {currentPage} of {totalPages} — {filteredUsers.length} Results</p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)} 
              className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-20 font-bold shadow-sm"
            >
              ←
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all ${currentPage === i + 1 ? "bg-green-600 text-white shadow-xl shadow-green-200" : "bg-white border border-gray-100 text-gray-400 hover:border-green-300"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(p => p + 1)} 
              className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-20 font-bold shadow-sm"
            >
              →
            </button>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all">
          <div className="bg-white p-10 rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-2xl relative overflow-hidden transform animate-in fade-in zoom-in duration-500">
            <button onClick={() => { setSelectedUser(null); setAddMode(false); setEditMode(false); }} className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all text-2xl">✕</button>
            
            <div className="mb-10 text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                {addMode ? "Create New Access" : editMode ? "Update Authentication" : "Security Profile"}
              </h3>
              <div className="w-16 h-1.5 bg-green-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                <input value={selectedUser.fullName || ""} onChange={(e) => setSelectedUser(p => ({ ...p, fullName: e.target.value }))} readOnly={!editMode} placeholder="e.g. John Doe" className={`w-full bg-gray-50 rounded-[1.25rem] px-6 py-4 outline-none transition-all ${!editMode ? "border-transparent font-bold text-gray-800" : "focus:ring-4 focus:ring-green-500/10 focus:bg-white border-2 border-transparent focus:border-green-500"}`} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Identifier</label>
                <input type="email" value={selectedUser.email || ""} onChange={(e) => setSelectedUser(p => ({ ...p, email: e.target.value }))} readOnly={!editMode || !addMode} placeholder="e.g. john@domain.com" className={`w-full bg-gray-50 rounded-[1.25rem] px-6 py-4 outline-none transition-all ${(!editMode || !addMode) ? "border-transparent font-bold text-gray-800" : "focus:ring-4 focus:ring-green-500/10 focus:bg-white border-2 border-transparent focus:border-green-500"}`} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Authorization Role</label>
                <select value={selectedUser.role || ""} onChange={(e) => setSelectedUser(p => ({ ...p, role: e.target.value }))} disabled={!editMode} className={`w-full bg-gray-50 rounded-[1.25rem] px-6 py-4 outline-none appearance-none transition-all cursor-pointer ${!editMode ? "border-transparent font-bold text-gray-800" : "focus:ring-4 focus:ring-green-500/10 focus:bg-white border-2 border-transparent focus:border-green-500"} ${!selectedUser.role ? "text-gray-400 font-normal" : "text-gray-800 font-bold"}`}>
                  <option value="" disabled>Select Role (Admin / User)</option>
                  <option value="User">Standard User</option>
                  <option value="Admin">System Administrator</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Verification</label>
                <input value={selectedUser.phone || ""} onChange={(e) => setSelectedUser(p => ({ ...p, phone: e.target.value }))} readOnly={!editMode} placeholder="e.g. +91 98765 43210" className={`w-full bg-gray-50 rounded-[1.25rem] px-6 py-4 outline-none transition-all ${!editMode ? "border-transparent font-bold text-gray-800" : "focus:ring-4 focus:ring-green-500/10 focus:bg-white border-2 border-transparent focus:border-green-500"}`} />
              </div>
              
              {addMode && (
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Login Password Phase</label>
                  <div className="relative">
                    <input type="text" value={selectedUser.password} onChange={(e) => setSelectedUser(p => ({ ...p, password: e.target.value }))} className="w-full bg-gray-50 rounded-[1.25rem] px-6 py-4 outline-none focus:ring-4 focus:ring-green-500/10 focus:bg-white border-2 border-transparent focus:border-green-500" placeholder="Set password or generate..." />
                    <button type="button" onClick={() => setSelectedUser(p => ({ ...p, password: generatePassword(p.fullName, p.phone) }))} className="absolute right-3 top-2.5 h-11 px-5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-green-200 transition-colors">Auto Generate</button>
                  </div>
                </div>
              )}
            </div>

            {editMode && (
              <div className="flex gap-4 pt-4">
                <button onClick={() => { setSelectedUser(null); setEditMode(false); setAddMode(false); }} className="flex-1 py-5 rounded-[1.5rem] bg-gray-100 font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-200 transition-all">Discard</button>
                <button onClick={handleUpdate} className="flex-[2] py-5 rounded-[1.5rem] bg-green-600 text-white font-bold uppercase tracking-widest shadow-2xl shadow-green-200 hover:bg-green-700 hover:-translate-y-1 active:translate-y-0 transition-all">
                  {addMode ? "Confirm Provisioning" : "Apply Updates"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
