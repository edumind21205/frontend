import React, { useEffect, useState } from "react";

export default function StudentCard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token"); // always get fresh token
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/teacher/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.filter((u) => u.role === "student"));
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

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token"); // always get fresh token
      const res = await fetch(
        `https://eduminds-production-180d.up.railway.app/api/teacher/delete-user/${userId}`,
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
        setSearchResult(null);
        alert("User deleted successfully!");
      } else {
        alert(data.message || "Failed to delete user.");
      }
    } catch (err) {
      alert("Error deleting user.");
    }
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setSearchResult(null);
      return;
    }
    const s = search.trim().toLowerCase();
    const found = users.find(
      (u) =>
        u._id === s ||
        (u.name && u.name.toLowerCase().includes(s)) ||
        (u.email && u.email.toLowerCase().includes(s))
    );
    if (found) {
      setSearchResult(found);
    } else {
      setSearchResult({ notFound: true });
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">
            All Registered Students
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            View, search, and manage all students on the platform.
          </p>
        </div>
        <img
          src="/assets/logo.png"
          alt="Student"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="mb-8 flex flex-col sm:flex-row gap-2 items-center bg-white rounded-xl shadow-lg p-4"
      >
        <input
          type="text"
          placeholder="Enter Student ID, Name, or Email to search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-200 px-3 py-2 rounded-lg w-full sm:w-72 focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        >
          Search
        </button>
      </form>

      {/* Search Result */}
      {searchResult && (
        <div className="mb-8 rounded-xl bg-white shadow-lg p-6 max-w-lg mx-auto">
          <h3 className="text-lg font-bold mb-2 text-blue-700">Search Result</h3>
          {searchResult.notFound ? (
            <p className="text-red-500">Student not found.</p>
          ) : (
            <div className="rounded-xl bg-white border shadow flex flex-col overflow-hidden">
              <div className="flex-1 flex flex-col p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 font-semibold">
                    User ID: {searchResult._id.slice(-6)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold capitalize">
                    {searchResult.role}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1">
                  {searchResult.name || "No Name"}
                </h3>
                <p className="text-slate-600 text-sm mb-2 line-clamp-2">
                  {searchResult.email}
                </p>
                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-xs text-gray-400">
                    Joined:{" "}
                    {searchResult.createdAt &&
                    !isNaN(new Date(searchResult.createdAt))
                      ? new Date(searchResult.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                  <button
                    className="ml-auto bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-xs"
                    onClick={() => handleDelete(searchResult._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}
      {!loading && users.length === 0 && <p>No students found.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="border rounded-xl bg-white shadow-lg hover:shadow-2xl transition transform duration-300 hover:scale-105 flex flex-col overflow-hidden max-w-md"
            style={{ minHeight: 220 }}
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
              <h3 className="text-lg font-bold mb-1">{user.name || "No Name"}</h3>
              <p className="text-slate-600 text-sm mb-2 line-clamp-2">{user.email}</p>
              <div className="flex items-center gap-2 mt-auto">
                <span className="text-xs text-gray-400">
                  Joined: {user.createdAt && !isNaN(new Date(user.createdAt))
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
                <button
                  className="ml-auto bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-xs"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}