import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import TeacherGradeSubmissions from "./TeacherGradeSubmissions";

export default function QuizCard() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAssignmentPage, setShowAssignmentPage] = useState(false);
  const navigate = useNavigate();

  // Fetch teacher's courses
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("https://eduminds-production-180d.up.railway.app/api/teacher/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  // Fetch quizzes for selected course
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchQuizzes = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/teacher/quizzes/course/${selectedCourse}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setQuizzes(Array.isArray(data) ? data : []);
        } else {
          setError(data.message || "Failed to fetch quizzes.");
        }
      } catch (err) {
        setError("Error fetching quizzes.");
      }
      setLoading(false);
    };
    fetchQuizzes();
  }, [selectedCourse]);

  // Handle quiz creation
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/teacher/courses/${selectedCourse}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, questions }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Quiz created!");
        setTitle("");
        setQuestions([{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
        setQuizzes((prev) => [...prev, data.quiz]);
      } else {
        toast.error(data.message || "Failed to create quiz.");
      }
    } catch (err) {
      toast.error("Error creating quiz.");
    }
  };

  // Add/remove question logic
  const handleQuestionChange = (idx, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === idx ? { ...q, [field]: value } : q
      )
    );
  };
  const handleOptionChange = (qIdx, oIdx, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((opt, oi) => (oi === oIdx ? value : opt)) }
          : q
      )
    );
  };
  const addQuestion = () => setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
  const removeQuestion = (idx) => setQuestions(questions.filter((_, i) => i !== idx));

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">Teacher Dashboard</h2>
          <p className="text-gray-600 text-base md:text-lg">
            Create, manage, and review quizzes and assignments for your courses.
          </p>
        </div>
        <img
          src="/assets/logo.png"
          alt="Quiz"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded font-semibold transition ${!showAssignmentPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setShowAssignmentPage(false)}
            >
              Quizzes
            </button>
            <button
              className={`px-4 py-2 rounded font-semibold transition ${showAssignmentPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setShowAssignmentPage(true)}
            >
              Assignments
            </button>
          </div>
        </div>
        {/* Only show course select when NOT on assignments page */}
        {!showAssignmentPage && (
          <div className="mb-6">
            <label className="block mb-1 font-semibold">Select Course</label>
            <select
              className="border border-blue-200 px-3 py-2 rounded-lg w-full max-w-xs focus:ring-2 focus:ring-blue-400"
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
              }}
              required
            >
              <option value="">-- Select a course --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}
        {showAssignmentPage ? (
          selectedCourse ? (
            <TeacherGradeSubmissions courseId={selectedCourse} />
          ) : (
            <div className="text-gray-500 text-center py-8">Please select a course to manage assignments.</div>
          )
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">Create Quiz</h2>
            <form onSubmit={handleQuizSubmit} className="mb-8">
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Quiz Title</label>
                <input
                  type="text"
                  className="border border-blue-200 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter quiz title"
                />
              </div>
              {questions.map((q, idx) => (
                <div key={idx} className="mb-4 border border-blue-100 p-3 rounded-lg bg-blue-50">
                  <label className="block mb-1 font-semibold">Question {idx + 1}</label>
                  <input
                    type="text"
                    className="border border-blue-200 px-3 py-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-400"
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(idx, "questionText", e.target.value)}
                    required
                    placeholder="Enter question"
                  />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {q.options.map((opt, oIdx) => (
                      <input
                        key={oIdx}
                        type="text"
                        className="border border-blue-200 px-2 py-1 rounded-lg focus:ring-2 focus:ring-blue-400"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, oIdx, e.target.value)}
                        required
                        placeholder={`Option ${oIdx + 1}`}
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    className="border border-blue-200 px-3 py-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-400"
                    value={q.correctAnswer}
                    onChange={(e) => handleQuestionChange(idx, "correctAnswer", e.target.value)}
                    required
                    placeholder="Correct answer"
                  />
                  {questions.length > 1 && (
                    <button type="button" className="text-red-600" onClick={() => removeQuestion(idx)}>
                      Remove Question
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2" onClick={addQuestion}>
                Add Question
              </button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
                Create Quiz
              </button>
            </form>
            <h2 className="text-2xl font-bold mb-6 flex items-center justify-between text-blue-700">
              Quizzes for Selected Course
            </h2>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
              </div>
            ) : (
              <>
                {error && <p className="text-red-600">{error}</p>}
                {!loading && quizzes.length === 0 && <p>No quizzes found.</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz._id}
                      className="rounded-xl bg-white border shadow-lg hover:shadow-2xl transition flex flex-col overflow-hidden"
                      style={{ minHeight: 220 }}
                    >
                      <div className="flex-1 flex flex-col p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500 font-semibold">
                            Quiz ID: {quiz._id.slice(-6)}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold capitalize">
                            {quiz.title}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mb-2">
                          Created: {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : "N/A"}
                        </div>
                        <div className="mt-2">
                          <h4 className="font-bold text-sm mb-1">
                            Questions: {quiz.questions?.length || 0}
                          </h4>
                          <ul className="list-disc pl-4 text-xs">
                            {quiz.questions?.map((q, i) => (
                              <li key={i}>
                                <span className="font-semibold">{q.questionText}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {/* ...existing code... */}
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
