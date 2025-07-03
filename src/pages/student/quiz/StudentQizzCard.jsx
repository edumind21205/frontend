import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StudentAssignmentSubmit from "../StudentAssignmentSubmit";

const API = "https://eduminds-production-180d.up.railway.app/api/quizzes/student/all";
const QUIZ_API = "https://eduminds-production-180d.up.railway.app/api/quizzes";
const RESULTS_API = "https://eduminds-production-180d.up.railway.app/api/quizzes/student/results";
const DASHBOARD_API = "https://eduminds-production-180d.up.railway.app/api/quizzes/student/dashboard";

const QuizList = ({ quizCards, startQuiz, submitting }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
    {quizCards.filter(q => !q.completed).map((quiz) => (
      <div key={quiz.quizId} className="bg-white rounded shadow p-4 flex flex-col">
        <div className="font-semibold">{quiz.title}</div>
        <div className="text-sm text-gray-500">Course: {quiz.courseTitle}</div>
        <div className="text-xs text-gray-400">Created: {new Date(quiz.createdAt).toLocaleString()}</div>
        <button
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => startQuiz(quiz.quizId)}
          disabled={submitting}
        >
          Start / Continue
        </button>
      </div>
    ))}
  </div>
);

const QuizResults = ({ quizCards }) => {
  const completed = quizCards.filter(q => q.completed);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
      {completed.length === 0 ? (
        <div className="text-gray-500">No quiz results yet.</div>
      ) : (
        <div className="space-y-4">
          {completed.map(res => (
            <div key={res.quizId} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">{res.title}</div>
                <div className="text-sm text-gray-500">Submitted: {res.submittedAt ? new Date(res.submittedAt).toLocaleString() : "N/A"}</div>
              </div>
              <div className="font-bold text-blue-700 text-lg">
                Score: {typeof res.score === "number" ? res.score : "N/A"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const QuizForm = ({ quizData, answers, handleAnswer, saveProgress, submitQuiz, submitting }) => (
  <div className="bg-white rounded shadow p-6 mb-8">
    <h3 className="text-xl font-bold mb-2">{quizData.title}</h3>
    <form
      onSubmit={e => {
        e.preventDefault();
        submitQuiz();
      }}
    >
      {quizData.questions.map((q, idx) => (
        <div key={q._id} className="mb-4">
          <div className="font-semibold">{idx + 1}. {q.questionText}</div>
          <div className="flex flex-col gap-2 mt-1">
            {q.options.map((opt, oidx) => (
              <label key={oidx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`q${idx}`}
                  value={opt}
                  checked={answers[idx]?.selectedOption === opt}
                  onChange={() => handleAnswer(idx, opt)}
                  required
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={saveProgress} disabled={submitting}>
          Save Progress
        </button>
        <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded" disabled={submitting}>
          Submit Quiz
        </button>
      </div>
    </form>
  </div>
);

const StudentQuizzCard = () => {
  // --- Restore state from localStorage ---
  const [selectedCourse, setSelectedCourse] = useState(() => localStorage.getItem("quizSelectedCourse") || "");
  const [showResults, setShowResults] = useState(() => localStorage.getItem("quizShowResults") === "true");
  const [showDashboard, setShowDashboard] = useState(() => localStorage.getItem("quizShowDashboard") === "true");
  const [showAssignmentPage, setShowAssignmentPage] = useState(() => localStorage.getItem("quizShowAssignmentPage") === "true");
  const [quizCards, setQuizCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [dashboardCards, setDashboardCards] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Determine if we are on the assignments page for toggle highlight
  const isAssignments = location.pathname.toLowerCase().includes("assignment");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(API, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setQuizCards(data.quizzes || []);
        // Extract unique courses from quizzes
        const uniqueCourses = Array.from(
          new Map(
            (data.quizzes || []).map(q => [q.courseId, { courseId: q.courseId, courseTitle: q.courseTitle }])
          ).values()
        );
        setCourses(uniqueCourses);
        // Auto-select first course if available and not set
        if (uniqueCourses.length && !selectedCourse) {
          setSelectedCourse(uniqueCourses[0].courseId);
          localStorage.setItem("quizSelectedCourse", uniqueCourses[0].courseId);
        }
      } catch (err) {
        setError("Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
    // eslint-disable-next-line
  }, [token]);

  // --- Persist selectedCourse to localStorage ---
  useEffect(() => {
    if (selectedCourse) localStorage.setItem("quizSelectedCourse", selectedCourse);
  }, [selectedCourse]);

  // --- Persist extra views to localStorage ---
  useEffect(() => {
    localStorage.setItem("quizShowResults", showResults ? "true" : "false");
  }, [showResults]);
  useEffect(() => {
    localStorage.setItem("quizShowDashboard", showDashboard ? "true" : "false");
  }, [showDashboard]);
  useEffect(() => {
    localStorage.setItem("quizShowAssignmentPage", showAssignmentPage ? "true" : "false");
  }, [showAssignmentPage]);

  const startQuiz = async (quizId) => {
    setActiveQuiz(quizId);
    setQuizData(null);
    setAnswers([]);
    setSubmitting(false);
    setError(null);
    try {
      const courseId = quizCards.find(q => q.quizId === quizId)?.courseId;
      if (!courseId) {
        setError("Course not found for this quiz.");
        setActiveQuiz(null);
        return;
      }
      const res = await fetch(`${QUIZ_API}/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const quizzes = await res.json();
      const quiz = quizzes.find(q => q._id === quizId);
      if (!quiz) {
        setError("Quiz not found.");
        setActiveQuiz(null);
        return;
      }
      setQuizData(quiz);

      const progressRes = await fetch(`${QUIZ_API}/progress/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const progressData = await progressRes.json();
      if (progressData.progress?.answers?.length) {
        setAnswers(progressData.progress.answers);
      } else {
        setAnswers(Array(quiz.questions.length).fill({ selectedOption: "" }));
      }
    } catch (err) {
      setError("Failed to load quiz.");
      setActiveQuiz(null);
    }
  };

  const handleAnswer = (idx, opt) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[idx] = { selectedOption: opt };
      return updated;
    });
  };

  const saveProgress = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);
    setError(null);
    try {
      await fetch(`${QUIZ_API}/save-progress/${activeQuiz}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      });
    } catch (err) {
      setError("Failed to save progress.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${QUIZ_API}/submit-quiz/${activeQuiz}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      });
      if (!res.ok) throw new Error("Submission failed");
      setActiveQuiz(null);
      setQuizData(null);
      setAnswers([]);
      const dashRes = await fetch(API, { headers: { Authorization: `Bearer ${token}` } });
      const dashData = await dashRes.json();
      setQuizCards(dashData.quizzes || []);
    } catch (err) {
      setError("Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchAllResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(RESULTS_API, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setAllResults(data.results || []);
      setShowResults(true);
      setShowDashboard(false);
    } catch (err) {
      setError("Failed to load all quiz results.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(DASHBOARD_API, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setDashboardCards(data.quizCards || []);
      setShowDashboard(true);
      setShowResults(false);
    } catch (err) {
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  // Filter quizzes by selected course
  const filteredQuizCards = selectedCourse
    ? quizCards.filter(q => q.courseId === selectedCourse)
    : quizCards;

  // Save progress on tab close or reload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (activeQuiz && quizData && answers.length > 0) {
        // Save progress synchronously (best effort)
        navigator.sendBeacon &&
          navigator.sendBeacon(
            `${QUIZ_API}/save-progress/${activeQuiz}`,
            new Blob(
              [JSON.stringify({ answers })],
              { type: "application/json" }
            )
          );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [activeQuiz, quizData, answers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
      </div>
    );
  }
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">Quizzes & Assignments</h2>
          <p className="text-gray-600 text-base md:text-lg">
            Take quizzes and submit assignments for your enrolled courses.
          </p>
        </div>
        <img
          src="/assets/logo.png"
          alt="Quiz"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mb-10">
        <div className="mb-4 flex gap-2">
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
        {showAssignmentPage ? (
          <StudentAssignmentSubmit />
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Available Quizzes</h2>
            {/* Course Search/Select */}
            <div className="mb-4">
              <label className="font-semibold mr-2">Select Course:</label>
              <select
                className="border border-blue-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400"
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
              >
                {courses.map(course => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseTitle}
                  </option>
                ))}
              </select>
            </div>
            {/* Buttons for extra student routes */}
            <div className="mb-4 flex gap-2">
              <button
                className="px-3 py-1 bg-purple-500 text-white rounded-lg"
                onClick={fetchAllResults}
              >
                Show All Quiz Results
              </button>
              <button
                className="px-3 py-1 bg-indigo-500 text-white rounded-lg"
                onClick={fetchDashboard}
              >
                Show Unified Dashboard
              </button>
              <button
                className="px-3 py-1 bg-gray-400 text-white rounded-lg hidden sm:inline-block"
                onClick={() => { setShowResults(false); setShowDashboard(false); }}
              >
                Hide Extra Views
              </button>
            </div>
            {/* Show extra views if toggled */}
            {showResults && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">All Quiz Results</h2>
                {allResults.length === 0 ? (
                  <div className="text-gray-500">No quiz results found.</div>
                ) : (
                  <div className="space-y-2">
                    {allResults.map(res => (
                      <div key={res.quizId} className="bg-white rounded shadow p-3 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-semibold">{res.quizTitle}</div>
                          <div className="text-sm text-gray-500">Submitted: {res.submittedAt ? new Date(res.submittedAt).toLocaleString() : "N/A"}</div>
                        </div>
                        <div className="font-bold text-blue-700 text-lg">
                          Score: {typeof res.score === "number" ? res.score : "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {showDashboard && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Unified Quiz Dashboard</h2>
                {dashboardCards.length === 0 ? (
                  <div className="text-gray-500">No quizzes found in dashboard.</div>
                ) : (
                  <div className="space-y-2">
                    {dashboardCards.map(card => (
                      <div key={card.quizId} className="bg-white rounded shadow p-3 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-semibold">{card.title}</div>
                          <div className="text-sm text-gray-500">Course: {card.courseTitle}</div>
                          <div className="text-xs text-gray-400">Created: {new Date(card.createdAt).toLocaleString()}</div>
                        </div>
                        <div>
                          {card.completed ? (
                            <span className="font-bold text-green-700">Completed</span>
                          ) : (
                            <span className="font-bold text-red-700">Not Completed</span>
                          )}
                        </div>
                        <div className="font-bold text-blue-700 text-lg">
                          Score: {typeof card.score === "number" ? card.score : "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Main quiz list/results */}
            {!showResults && !showDashboard && (
              <>
                <QuizList quizCards={filteredQuizCards} startQuiz={startQuiz} submitting={submitting} />
                {activeQuiz && quizData && (
                  <QuizForm
                    quizData={quizData}
                    answers={answers}
                    handleAnswer={handleAnswer}
                    saveProgress={saveProgress}
                    submitQuiz={submitQuiz}
                    submitting={submitting}
                  />
                )}
                <QuizResults quizCards={filteredQuizCards} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentQuizzCard;
