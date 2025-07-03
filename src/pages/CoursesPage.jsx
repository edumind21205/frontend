import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/auth";
import Header from "./Header"
import Footer from "./Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EnrollButton({ course }) {
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
      alert("Unable to verify user role. Please login again.");
      navigate("/auth/login");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      onClick={handleEnroll}
      disabled={enrolling}
    >
      Enroll Now
    </button>
  );
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/courses", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        setError(err.message || "Error fetching courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Spinner as in StatsCard */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="text-blue-600 font-medium mt-2">Loading courses...</span>
        </div>
      </div>
    );
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!courses.length) return <div className="p-4">No courses available at the moment.</div>;

  return (
    <>
      <Header />
      <div
        className="min-h-screen w-full"
        style={{
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))"
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 items-stretch mb-10">
          {courses.map((course) => (
            <div
              key={course._id}
              className="border rounded-xl shadow bg-white flex flex-col max-w-xs w-full mx-auto h-full hover:shadow-lg transition-transform duration-300 hover:scale-105"
              style={{ minHeight: "420px", transitionProperty: "box-shadow, transform" }}
            >
              {course.picture && (
                <img
                  src={course.picture.startsWith("http") ? course.picture : `https://eduminds-production-180d.up.railway.app/${course.picture}`}
                  alt={course.title}
                  className="w-full h-44 object-cover rounded-t-xl"
                />
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="font-bold text-lg mb-1">{course.title}</div>
                <div className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full capitalize">
                    {course.category || "General"}
                  </span>
                  <span className="text-green-700 font-semibold text-lg">
                    
                    PKR{course.price?.toFixed ? course.price.toFixed(2) : course.price || "0.00"}
                  </span>
                </div>
                <div className="mt-auto flex justify-end">
                  <EnrollButton course={course} />
                </div>
              </div>
            </div>
          ))} 
        </div>
      </div>
      <Footer />
      <ToastContainer autoClose={1000} />
    </>
  );
}
