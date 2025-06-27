import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
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
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/quizzes/id/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          // Try to get error message from backend
          let errMsg = "Failed to fetch quiz";
          try {
            const errData = await res.json();
            errMsg = errData.message || errMsg;
          } catch {}
          throw new Error(errMsg);
        }
        const data = await res.json();
        // Always use data.quiz if present, else fallback to data
        setQuiz(data.quiz || data);
      } catch (err) {
        setError(err.message || "Error loading quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!quiz) return <div className="p-8 text-center">Quiz not found.</div>;

  // Defensive: fallback for missing fields
  const title = quiz.title || quiz.quizTitle || "Untitled Quiz";
  const description = quiz.description || "";
  const courseTitle = quiz.course?.title || quiz.course || "N/A";
  const totalQuestions = Array.isArray(quiz.questions) ? quiz.questions.length : 0;
  const createdBy = quiz.createdBy?.name || quiz.createdBy || "N/A";
  const createdAt = quiz.createdAt ? new Date(quiz.createdAt).toLocaleString() : '';
  const updatedAt = quiz.updatedAt ? new Date(quiz.updatedAt).toLocaleString() : '';

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow">
      {/* Dashboard Button */}
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleDashboardRedirect}
      >
        Dashboard
      </button>
      <h2 className="text-3xl font-bold mb-4 text-blue-800">{title}</h2>
      <p className="mb-2 text-gray-700">{description}</p>
      <div className="mb-2 text-gray-700">Course: {courseTitle}</div>
      <div className="mb-2 text-gray-700">Total Questions: {totalQuestions}</div>
      {/* <div className="mb-2 text-gray-700">Created By: {createdBy}</div> */}
      <div className="mb-2 text-gray-700">Created At: {createdAt}</div>
      <div className="mb-2 text-gray-700">Updated At: {updatedAt}</div>
      <div className="mt-4 text-sm text-gray-500">Quiz ID: {id}</div>
    </div>
  );
};

export default QuizDetail;
