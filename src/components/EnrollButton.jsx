import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function EnrollButton({ course }) {
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = useState(false);

  // Helper to check enrollment status
  const checkEnrollment = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/enrollments/check/${course._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to check enrollment");
      const data = await res.json();
      return data.enrolled !== undefined ? data.enrolled : data.isEnrolled;
    } catch {
      return false;
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return;
    }
    setEnrolling(true);
    try {
      // Check if already enrolled
      const alreadyEnrolled = await checkEnrollment();
      if (alreadyEnrolled) {
        toast.info("Already enrolled in this course");
        setEnrolling(false);
        return;
      }
      // Fetch user role from backend
      const res = await fetch("https://eduminds-production-180d.up.railway.app/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user info");
      const user = await res.json();
      if (user.role && user.role.toLowerCase() === "student") {
        navigate(`/checkout/${course._id}`);
      } else {
        toast.info("Please login as a student to enroll.");
      }
    } catch {
      toast.error("Unable to verify user role. Please login again.");
      navigate("/auth/login");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full hover:-translate-y-1"
      onClick={handleEnroll}
      disabled={enrolling}
    >
       Buy now 
        {/* {course.price} */}
    </button>
  );
}
