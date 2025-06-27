import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NotifyCard() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch notifications for the logged-in student
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token"); // always get fresh token
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 401) {
          navigate("/login");
          return;
        }
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
  }, [navigate]);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      // const token = JSON.parse(localStorage.getItem("token"));
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
      <h2 className="text-2xl font-bold mb-6">Your Notifications</h2>
      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && notifications.length === 0 && (
        <p>No notifications found.</p>
      )}
      <ul className="space-y-4">
        {notifications.map((n) => {
          // Check if notification is QnA related (assuming type or category field)
          const isQnA =
            n.type === "qna" ||
            n.category === "qna" ||
            n.message?.toLowerCase().includes("qna");
          return (
            <li
              key={n._id}
              className={`p-4 rounded border shadow flex items-center justify-between ${
                n.isRead ? "bg-gray-100" : "bg-blue-50"
              }`}
            >
              <div>
                <div className="font-medium flex items-center gap-2">
                  {isQnA && (
                    <span className="inline-block bg-yellow-200 text-yellow-800 text-xs px-2 py-0.5 rounded mr-2">
                      QnA
                    </span>
                  )}
                  {n.message}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
                {isQnA && (
                  <button
                    className="mt-2 text-blue-600 underline text-xs"
                    onClick={() => navigate("/student/qna")}
                  >
                    Go to QnA
                  </button>
                )}
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
          );
        })}
      </ul>
    </div>
  );
}