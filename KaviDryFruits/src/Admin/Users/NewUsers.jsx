import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { FaEdit, FaTrash } from "react-icons/fa";

const NewUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: "", email: "", role: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("today");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Fetch all users
  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    const data = snap.docs.map((doc) => {
      const d = doc.data();

      // Normalize createdAt to JS Date
      let createdDate;
      if (d.createdAt?.toDate) createdDate = d.createdAt.toDate();
      else if (d.createdAt?.seconds) createdDate = new Date(d.createdAt.seconds * 1000);
      else createdDate = d.createdAt ? new Date(d.createdAt) : null;

      return { id: doc.id, ...d, createdAt: createdDate };
    });

    // Sort newest users first
    data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    setUsers(data);
    setFilteredUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users by search + time
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const now = new Date();

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const filtered = users
      .filter((u) =>
        (u.fullName || u.username || "").toLowerCase().includes(lowerQuery) ||
        (u.email || "").toLowerCase().includes(lowerQuery)
      )
      .filter((user) => {
        if (!user.createdAt) return true;

        switch (timeFilter) {
          case "today":
            return user.createdAt >= todayStart && user.createdAt <= todayEnd;

          
          default:
            return true;
        }
      });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, users, timeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Edit user modal
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName || user.username || "",
      email: user.email || "",
      role: user.role || "",
    });
  };

  const closeEditModal = () => setEditingUser(null);

  const handleSave = async () => {
    if (!editingUser) return;

    await updateDoc(doc(db, "users", editingUser.id), editForm);

    closeEditModal();
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await deleteDoc(doc(db, "users", id));
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen">

      {/* Search + Time Filter */}
      <div className="mb-4 flex justify-between flex-col sm:flex-row sm:items-center sm:gap-4">
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-1/4"
        />

        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="border rounded px-3 py-2 mt-2 sm:mt-0"
        >
          {/* <option value="all">All</option> */}
          <option value="today">Today</option>
         
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-2xl overflow-x-auto">
        <table className="min-w-full text-sm rounded-lg overflow-hidden">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Full Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-3">{user.fullName || user.username}</td>
                  <td className="p-3 break-words">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3 text-gray-600">
                    {user.createdAt
                      ? user.createdAt.toLocaleDateString() +
                        " " +
                        user.createdAt.toLocaleTimeString()
                      : "—"}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-gray-600 hover:text-blue-600 border p-2 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-gray-600 hover:text-red-600 border p-2 rounded"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit User</h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              />

              <input
                type="email"
                placeholder="Email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              />

              <input
                type="text"
                placeholder="Role"
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NewUsers;
