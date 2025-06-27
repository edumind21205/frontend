import React, { useEffect, useState } from "react";

export default function AdminNotifyCard() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch notifications for the logged-in admin
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (role !== "admin") {
          setError("Unauthorized: Only admins can view these notifications.");
          setLoading(false);
          return;
        }
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
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Admin Notifications</h2>
      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && notifications.length === 0 && !error && (
        <p>No notifications found.</p>
      )}
      <ul className="space-y-4">
        {notifications.map((n) => (
          <li
            key={n._id}
            className={`p-4 rounded border shadow flex items-center justify-between ${
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
                className="ml-4 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                onClick={() => markAsRead(n._id)}
              >
                Mark as read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
