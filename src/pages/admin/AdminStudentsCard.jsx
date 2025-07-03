import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StudentCard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token"); // always get fresh token
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          setError(data.message || "Failed to fetch users.");
        }
      } catch (err) {
        setError("Error fetching users.");
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Handler to delete a user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token"); // always get fresh token
      const res = await fetch(
        `https://eduminds-production-180d.up.railway.app/api/admin/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        alert("User deleted successfully!");
      } else {
        alert(data.message || "Failed to delete user.");
      }
    } catch (err) {
      alert("Error deleting user.");
    }
  };

  // Handler to update user role
  const handleRoleUpdate = async (userId, currentRole) => {
    const newRole = currentRole === "student" ? "teacher" : "student";
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://eduminds-production-180d.up.railway.app/api/admin/update-user-role/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, role: newRole } : u
          )
        );
        alert("User role updated successfully!");
      } else {
        alert(data.message || "Failed to update user role.");
      }
    } catch (err) {
      alert("Error updating user role.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
        </div>
      )}
      {!loading && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">
                All Registered Users
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                View, search, and manage all users on the platform.
              </p>
            </div>
            <img
              src="/assets/logo.png"
              alt="Users"
              className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          {!loading && users.length === 0 && <p>No users found.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {users.map((user, idx) => (
              <motion.div
                key={user._id}
                className="rounded-xl bg-white border shadow-lg hover:shadow-2xl transition flex flex-col overflow-hidden"
                style={{ minHeight: 220 }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07, type: "spring", stiffness: 80 }}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                }}
              >
                <div className="flex-1 flex flex-col p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 font-semibold">
                      User ID: {user._id.slice(-6)}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold capitalize">
                      {user.role}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">
                    {user.name || "No Name"}
                  </h3>
                  <p className="text-slate-600 text-sm mb-2 line-clamp-2">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-xs text-gray-400">
                      Joined:{" "}
                      {user.createdAt && !isNaN(new Date(user.createdAt))
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                    {(user.role === "student" || user.role === "teacher") && (
                      <button
                        className="ml-auto bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 text-xs"
                        onClick={() => handleRoleUpdate(user._id, user.role)}
                      >
                        Make {user.role === "student" ? "Teacher" : "Student"}
                      </button>
                    )}
                    {user.role !== "admin" && (
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-xs"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}