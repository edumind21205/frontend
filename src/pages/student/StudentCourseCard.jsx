import React, { useEffect, useState } from "react";

const StudentCourseCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unenrolling, setUnenrolling] = useState({});
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [allAssignments, setAllAssignments] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const user = localStorage.getItem("user");
      // console.log("User from localStorage:", user);
      const token = localStorage.getItem("token"); // always get fresh token
      // console.log("token from localStorage:", token);
      const res = await fetch("https://eduminds-production-180d.up.railway.app/api/enrollments/enroll-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Fetch all quizzes for all courses using /quizzes/student/all
    const fetchAllQuizzes = async () => {
      try {
        const token = localStorage.getItem("token"); // always get fresh token
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/quizzes/student/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch all quizzes");
        const data = await res.json();
        setAllQuizzes(data.quizzes || []);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchAllQuizzes();

    // Fetch all assignments for all courses
    const fetchAllAssignments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/submissions/student/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch all assignments");
        const data = await res.json();
         // Transform assignmentsByCourse array to object keyed by courseId
        const assignmentsObj = {};
        (data.assignmentsByCourse || []).forEach(courseBlock => {
          assignmentsObj[courseBlock.courseId] = courseBlock.assignments;
        });
        setAllAssignments(assignmentsObj);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchAllAssignments();
  }, []);

  const handleUnenroll = async (courseId) => {
    setUnenrolling((prev) => ({ ...prev, [courseId]: true }));
    try {
      const token = localStorage.getItem("token"); // always get fresh token
      const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/enrollments/${courseId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to unenroll from course");
      await fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setUnenrolling((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
      </div>
    );
  }
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!data || !data.courses || data.courses.length === 0)
    return <div className="p-4">You have not enrolled in any courses yet.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">My Courses</h2>
          <p className="text-gray-600 text-base md:text-lg">
            Track your progress, quizzes, and assignments for enrolled courses.
          </p>
        </div>
        <img
          src="/assets/logo.png"
          alt="My Courses"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      {/* User Info */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow-lg flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold">
          {data.user.id.slice(0, 2).toUpperCase()}
        </div>
        <div className="text-center sm:text-left">
          <div className="font-semibold">User ID: {data.user.id}</div>
          <div className="text-sm text-gray-500">Role: {data.user.role}</div>
        </div>
      </div>
      {/* Courses */}
      <div className="space-y-8">
        {data.courses.map((course) => {
          // Merge completedLessons from localStorage for instant UI sync
          let completedLessonsFromStorage = [];
          try {
            const completedLessonsMap = JSON.parse(localStorage.getItem("completedLessonsMap") || "{}");
            if (completedLessonsMap && completedLessonsMap[course.courseId]) {
              completedLessonsFromStorage = completedLessonsMap[course.courseId].map(String);
            }
          } catch {}
          // Merge with fetched completedLessons (avoid duplicates)
          const completedLessonsFetched = Array.isArray(course.completedLessons)
            ? course.completedLessons.map(l => String(l))
            : [];
          const completedLessons = Array.from(new Set([...completedLessonsFetched, ...completedLessonsFromStorage]));

          return (
            <div key={course.courseId} className="bg-white rounded-xl shadow-lg p-6">
              {/* Payment status badge */}
              {course.paymentStatus === "paid" && (
                <div className="mb-2">
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mr-2">Paid Course</span>
                </div>
              )}
              {course.paymentStatus === "unpaid" && (
                <div className="mb-2">
                  <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full mr-2">Payment Required</span>
                </div>
              )}
              {course.paymentStatus === "free" && (
                <div className="mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mr-2">Free Course</span>
                </div>
              )}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">{course.title}</h2>
                  <p className="text-gray-600 mb-2">{course.description}</p>
                  <div className="text-sm text-gray-500">
                    Enrolled: {
                      course.enrolledAt
                        ? (() => {
                            // Try to parse as date
                            const date = new Date(course.enrolledAt);
                            return !isNaN(date)
                              ? date.toLocaleDateString()
                              : String(course.enrolledAt);
                          })()
                        : "Unknown"
                    }
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="font-semibold">
                    Progress: {typeof course.progress === "number" ? Math.round(course.progress) : 0}%
                  </div>
                  <div className="w-40 h-2 bg-gray-200 rounded mt-1">
                    <div
                      className="h-2 bg-blue-500 rounded"
                      style={{ width: `${typeof course.progress === "number" ? Math.round(course.progress) : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              {/* Lessons */}
              <div className="mb-4">
                <div className="font-semibold mb-2">Lessons</div>
                {(course.lessons && course.lessons.length > 0) ? (
                  <ul className="space-y-1">
                    {course.lessons.map((lesson) => {
                      const lessonId = lesson.lessonId || lesson._id;
                      // Use merged completedLessons for status
                      const isCompleted = completedLessons.includes(String(lessonId));
                      return (
                        <li key={lessonId} className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isCompleted ? "bg-green-500" : "bg-gray-400"}`}></span>
                          <span className={isCompleted ? "text-green-700 font-semibold" : undefined}>{lesson.title}</span>
                          {isCompleted && (
                            <span className="ml-2 text-xs text-green-600">Completed</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-gray-400 text-sm">No lessons available.</div>
                )}
              </div>
              {/* Quizzes */}
              <div>
                <div className="font-semibold mb-2">
                  Quizzes ({Number.isFinite(allQuizzes.filter(q => String(q.courseId) === String(course.courseId)).length)
                    ? allQuizzes.filter(q => String(q.courseId) === String(course.courseId)).length
                    : 0})
                </div>
                {(() => {
                  const quizzesForCourse = allQuizzes.filter(q => String(q.courseId) === String(course.courseId));
                  if (quizzesForCourse.length > 0) {
                    return (
                      <ul className="space-y-1">
                        {quizzesForCourse.map((quiz) => (
                          <li key={quiz.quizId} className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${quiz.completed ? "bg-green-500" : "bg-gray-400"}`}></span>
                            <span>{quiz.title}</span>
                            {quiz.completed ? (
                              <span className="ml-2 text-xs text-green-600">
                                Submitted
                                {typeof quiz.score === "number"
                                  ? ` (Score: ${quiz.score})`
                                  : ""}
                              </span>
                            ) : (
                              <span className="ml-2 text-xs text-gray-500">Not Submitted</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    );
                  } else {
                    return <div className="text-gray-400 text-sm">No quizzes available.</div>;
                  }
                })()}
              </div>
              {/* Assignments */}
              <div className="mt-4">
                <div className="font-semibold mb-2">
                  Assignments ({Array.isArray(allAssignments[course.courseId]) && typeof allAssignments[course.courseId].length === "number"
                    ? allAssignments[course.courseId].length
                    : 0})
                </div>
                {Array.isArray(allAssignments[course.courseId]) && allAssignments[course.courseId].length > 0 ? (
                  <ul className="space-y-1">
                    {allAssignments[course.courseId].map((assignment) => (
                      <li key={assignment._id} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${assignment.submitted ? "bg-green-500" : "bg-gray-400"}`}></span>
                        <span>{assignment.title}</span>
                        {assignment.submitted ? (
                          <span className="ml-2 text-xs text-green-600">
                            Submitted
                            {typeof assignment.marksObtained === "number"
                              ? ` (Marks: ${assignment.marksObtained})`
                              : ""}
                          </span>
                        ) : (
                          <span className="ml-2 text-xs text-gray-500">Not Submitted</span>
                        )}
                        {!assignment.submitted && (
                          <button
                            className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                            onClick={() => window.location.href = `/student/StudentAssignmentSubmit/${assignment._id}`}
                          >
                            Submit
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-400 text-sm">No assignments available.</div>
                )}
              </div>
              <button
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => handleUnenroll(course.courseId)}
                disabled={unenrolling[course.courseId]}
              >
                {unenrolling[course.courseId] ? "Unenrolling..." : "Unenroll"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentCourseCard;
