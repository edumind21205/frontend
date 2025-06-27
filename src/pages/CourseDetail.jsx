import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user role from localStorage
  let userRole = null;
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    userRole = userData?.role || null;
  } catch {
    userRole = null;
  }

  // Dashboard redirect logic
  const handleDashboardRedirect = () => {
    if (userRole === "admin") navigate("/admin/dashboard");
    else if (userRole === "teacher") navigate("/teacher/dashboard");
    else if (userRole === "student") navigate("/student/dashboard");
    else navigate("/");
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch course");
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        setError(err.message || "Error loading course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!course) return <div className="p-8 text-center">Course not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow">
      {/* Dashboard Button */}
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleDashboardRedirect}
      >
        Dashboard
      </button>
      <h2 className="text-3xl font-bold mb-4 text-blue-800">{course.title || course.name}</h2>
      <p className="mb-2 text-gray-700">{course.description}</p>
      <div className="mb-2 text-gray-700">Instructor: {course.instructorName || course.createdBy?.name || course.createdBy}</div>
      <div className="mb-2 text-gray-700">Category: {course.category?.name || course.category}</div>
      <div className="mb-2 text-gray-700">Lessons: {course.lessons?.length ?? 0}</div>
      <div className="mb-2 text-gray-700">Price: {course.price ? `$${course.price}` : 'Free'}</div>
      <div className="mb-2 text-gray-700">Created At: {course.createdAt ? new Date(course.createdAt).toLocaleString() : ''}</div>
      <div className="mb-2 text-gray-700">Updated At: {course.updatedAt ? new Date(course.updatedAt).toLocaleString() : ''}</div>
      <div className="mt-4 text-sm text-gray-500">Course ID: {id}</div>
    </div>
  );
};

export default CourseDetail;
