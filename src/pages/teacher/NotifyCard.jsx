import React, { useEffect, useState } from "react";

export default function TeacherNotify() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch notifications for the logged-in user
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        // console.log("Authorization header:", `Bearer ${token}`); // <-- Add this line
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setNotifications(data);
        } else {
          setError(data.message || "Failed to fetch notifications.");
        }
      } catch (err) {
        setError("Error fetching notifications.");
      }
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`https://eduminds-production-180d.up.railway.app/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      // Optionally handle error
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">
            Your Notifications
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Stay updated with important alerts and messages.
          </p>
        </div>
        <img
          src="/assets/logo.png"
          alt="Notifications"
          className="w-20 h-20 md:w-28 md:h-28 object-contain hidden md:block"
        />
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        {loading && <p>Loading notifications...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && notifications.length === 0 && (
          <p>No notifications found.</p>
        )}
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-4 rounded-xl border shadow flex items-center justify-between ${
                n.isRead ? "bg-gray-100" : "bg-blue-50"
              }`}
            >
              <div>
                <div className="font-medium">{n.message}</div>
                <div className="text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
              {!n.isRead && (
                <button
                  className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                  onClick={() => markAsRead(n._id)}
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}