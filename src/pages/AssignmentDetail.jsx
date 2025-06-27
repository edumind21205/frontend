import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
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
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/assignments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch assignment");
        const data = await res.json();
        setAssignment(data);
      } catch (err) {
        setError(err.message || "Error loading assignment");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!assignment) return <div className="p-8 text-center">Assignment not found.</div>;

  // If backend returns { success, assignment }, use assignment.assignment
  const a = assignment.success ? assignment.assignment : assignment;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow">
      {/* Dashboard Button */}
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleDashboardRedirect}
      >
        Dashboard
      </button>
      <h2 className="text-3xl font-bold mb-4 text-blue-800">{a.title || a.assignmentTitle}</h2>
      <p className="mb-2 text-gray-700">{a.description}</p>
      <div className="mb-2 text-gray-700">Course: {a.course?.title || a.course}</div>
      <div className="mb-2 text-gray-700">Due Date: {a.deadline ? new Date(a.deadline).toLocaleString() : 'N/A'}</div>
      <div className="mb-2 text-gray-700">Max Score: {a.totalMarks ?? 'N/A'}</div>
      <div className="mb-2 text-gray-700">Created By: {a.createdBy?.name || a.createdBy}</div>
      <div className="mb-2 text-gray-700">Created At: {a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</div>
      <div className="mb-2 text-gray-700">Updated At: {a.updatedAt ? new Date(a.updatedAt).toLocaleString() : ''}</div>
      <div className="mt-4 text-sm text-gray-500">Assignment ID: {id}</div>
    </div>
  );
};

export default AssignmentDetail;
