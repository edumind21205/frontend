import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function QnA() {
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [answerInputs, setAnswerInputs] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
const user = userStr ? JSON.parse(userStr) : null; // includes role, id, etc.

  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";

  // Fetch courses depending on role
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Only fetch courses for students and teachers, not admin
        if (user?.role === "admin") return;
        const url = isStudent
          ? "https://eduminds-production-180d.up.railway.app/api/student/enrolled-courses"
          : "https://eduminds-production-180d.up.railway.app/api/teacher/my-courses";
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        toast.error("Failed to load courses");
      }
    };
    fetchCourses();
  }, [isStudent, token, user]);

  // Fetch Q&A data
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/qna/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setQuestions(data.filter((q) => !q.deleted));
      } catch (err) {
        toast.error("Failed to load questions");
      }
      setLoading(false); // Set loading to false after data is fetched
    };
    fetchQuestions();
  }, [token]);

  // Submit a question
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !questionText.trim()) {
      return toast.error("Course and question are required.");
    }

    try {
      const res = await fetch("https://eduminds-production-180d.up.railway.app/api/qna/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: selectedCourse, text: questionText }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Question submitted!");
        setQuestionText("");
        setQuestions((prev) => [data.question, ...prev]);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error posting question.");
    }
  };

  // Submit an answer
  const handleAnswer = async (questionId) => {
    const answerText = answerInputs[questionId];
    if (!answerText || !answerText.trim()) return toast.error("Answer cannot be empty.");

    try {
      const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/qna/answer/${questionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: answerText }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Answered!");
        setQuestions((prev) =>
          prev.map((q) => (q._id === questionId ? data.question : q))
        );
        setAnswerInputs((prev) => ({ ...prev, [questionId]: "" }));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error submitting answer.");
    }
  };

  // Delete a question (admin)
  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/qna/${questionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Question deleted!");
        setQuestions((prev) => prev.filter((q) => q._id !== questionId));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error deleting question.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <ToastContainer />
      {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
        </div>
      )}
      {!loading && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">Q&amp;A Section</h2>
              <p className="text-gray-600 text-base md:text-lg">
                View, answer, and manage all questions on the platform.
              </p>
            </div>
            <img
              src="/assets/logo.png"
              alt="QnA"
              className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
            />
          </div>
          {/* Student Question Form */}
          {isStudent && (
            <form onSubmit={handleAskQuestion} className="mb-8 bg-white rounded-xl shadow-lg p-4 md:p-8">
              <h3 className="text-xl font-bold text-blue-700 mb-4">Ask a Question</h3>
              <select
                className="w-full border border-blue-200 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-blue-400"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Select a Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <textarea
                className="w-full border border-blue-200 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Type your question here..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
                rows={3}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              >
                Submit Question
              </button>
            </form>
          )}

          {/* Question List */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
            <h3 className="text-xl font-bold text-blue-700 mb-6">All Questions</h3>
            {questions.length === 0 ? (
              <p className="text-gray-500">No questions found.</p>
            ) : (
              <ul className="space-y-6">
                {questions.map((q) => (
                  <li key={q._id} className="border-b last:border-b-0 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-lg text-gray-900 mb-1">{q.text}</p>
                        <p className="text-sm text-gray-500 mb-1">
                          Course: <span className="font-medium">{q.course?.title || "N/A"}</span>
                        </p>
                        <div className="text-xs text-gray-600 mb-2">
                          Asked by: {q.askedBy?.name} ({q.askedBy?.email}) | ID: {q.askedBy?._id}
                        </div>
                      </div>
                      {(isTeacher || user?.role === "admin") && (
                        <button
                          onClick={() => handleDeleteQuestion(q._id)}
                          className="bg-red-600 text-white text-xs px-3 py-1 rounded-lg shadow hover:bg-red-700 mt-2 md:mt-0"
                        >
                          Delete Question
                        </button>
                      )}
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm font-semibold text-blue-700 mb-1">Answers:</h4>
                      {q.answers?.length > 0 ? (
                        <ul className="list-disc ml-5 text-sm text-gray-700 space-y-2">
                          {q.answers.map((a, i) => (
                            <li key={i}>
                              <span className="font-medium">{a.text}</span>
                              <div className="text-xs text-gray-600">
                                Answered by: {a.answeredBy?.name} ({a.answeredBy?.email}) | ID: {a.answeredBy?._id}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-400">No answers yet.</p>
                      )}
                    </div>
                    {(isTeacher || user?.role === "admin") && (
                      <div className="mt-4">
                        {/* 
                          Admin and Teacher can answer questions.
                          If admin cannot answer, check backend permissions for /api/qna/answer/:id.
                        */}
                        <textarea
                          className="w-full border border-blue-200 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-400"
                          placeholder="Write your answer..."
                          value={answerInputs[q._id] || ""}
                          onChange={(e) =>
                            setAnswerInputs((prev) => ({
                              ...prev,
                              [q._id]: e.target.value,
                            }))
                          }
                          rows={2}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleAnswer(q._id)}
                            className="bg-green-600 text-white text-sm px-4 py-1 rounded-lg shadow hover:bg-green-700"
                          >
                            Submit Answer
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
