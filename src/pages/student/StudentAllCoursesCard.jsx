import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyButton from "../../components/BuyButton";
import { useAuthStore } from "../../lib/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EnrollButton({ course }) {
  const navigate = useNavigate();

  const isFree = (course.category && course.category.toLowerCase() === 'free') || Number(course.price) === 0;

  // Helper to check enrollment status
  const checkEnrollment = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/enrollments/check/${course._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to check enrollment");
      const data = await res.json();
      // Accept both { enrolled: true/false } and { isEnrolled: true/false }
      return data.enrolled !== undefined ? data.enrolled : data.isEnrolled;
    } catch (err) {
      // fallback: treat as not enrolled if error
      return false;
    }
  };

  const handleEnroll = async () => {
    try {
      const alreadyEnrolled = await checkEnrollment();
      if (alreadyEnrolled) {
        toast.info("Already enrolled in this course");
        return;
      }
      if (isFree) {
        // Directly enroll the user (simulate API call)
        const token = localStorage.getItem("token");
        const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/enrollments/${course._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          let errMsg = "Enrollment failed";
          try {
            const errData = await res.json();
            errMsg = errData.message || JSON.stringify(errData) || errMsg;
          } catch (e) {
            // fallback if not JSON
          }
          throw new Error(errMsg);
        }
        // Optionally show a toast or redirect
        navigate("/student/courses");
      } else {
        // Paid: go to checkout only if not enrolled
        setTimeout(() => navigate(`/checkout/${course._id}`), 0);
      }
    } catch (err) {
      toast.error(err.message || "Could not enroll in course");
    }
  };

  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      onClick={handleEnroll}
    >
      {isFree ? "Enroll Free" : "Enroll Now"}
    </button>
  );
}

export default function StudentAllCoursesCard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token"); // always get fresh token
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
      </div>
    );
  }
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!courses.length) return <div className="p-4">No courses available at the moment.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <ToastContainer  autoClose={1000} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">All Courses</h2>
          <p className="text-gray-600 text-base md:text-lg">
            Browse and enroll in available courses.
          </p>
        </div>
        <img
          src="/assets/logo.png"
          alt="All Courses"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 items-stretch">
        {courses.map((course) => (
          <div
            key={course._id}
            className="border rounded-xl shadow-lg bg-white flex flex-col max-w-xs w-full mx-auto h-full hover:shadow-2xl transition-transform duration-300 hover:scale-105"
            style={{ minHeight: "420px", transitionProperty: "box-shadow, transform" }}
          >
            {course.picture && (
              <img
                src={
                  course.picture.startsWith("http")
                    ? course.picture
                    : `https://eduminds-production-180d.up.railway.app/${course.picture.replace(/^\//, "")}`
                }
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
  );
}
