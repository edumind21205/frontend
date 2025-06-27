import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
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
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/lessons/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch lesson");
        const data = await res.json();
        setLesson(data);
      } catch (err) {
        setError(err.message || "Error loading lesson");
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!lesson) return <div className="p-8 text-center">Lesson not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow">
      {/* Dashboard Button */}
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleDashboardRedirect}
      >
        Dashboard
      </button>
      <h2 className="text-3xl font-bold mb-4 text-blue-800">{lesson.title || lesson.name}</h2>
      <p className="mb-2 text-gray-700">{lesson.description}</p>
      <div className="mb-2 text-gray-700">Course: {lesson.courseId?.title || lesson.courseId}</div>
      <div className="mb-2 text-gray-700">Content Type: {lesson.contentType}</div>
      <div className="mb-2 text-gray-700">
        Content URL: {lesson.contentURL}
      </div>
      <div className="mb-2 text-gray-700">Created By: {lesson.createdBy?.name || lesson.createdBy}</div>
      <div className="mb-2 text-gray-700">Created At: {lesson.createdAt ? new Date(lesson.createdAt).toLocaleString() : ''}</div>
      <div className="mb-2 text-gray-700">Updated At: {lesson.updatedAt ? new Date(lesson.updatedAt).toLocaleString() : ''}</div>
      <div className="mt-4 text-sm text-gray-500">Lesson ID: {id}</div>
    </div>
  );
};

export default LessonDetail;
