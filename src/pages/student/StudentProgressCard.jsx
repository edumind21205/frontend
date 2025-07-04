import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const StudentProgressCard = () => {
  const [progresses, setProgresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(() => {
    // Try to get from localStorage, fallback to ""
    return localStorage.getItem("selectedCourseId") || "";
  });
  const [marking, setMarking] = useState(false);
  const [downloadingLessonId, setDownloadingLessonId] = useState(null);

  // Replace with your auth token logic
  const token = localStorage.getItem("token");
  // console.log("Token:", token);
  const user = localStorage.getItem("user");
  // console.log("User:", user);

  // Fetch all enrolled courses with progress
  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // always get fresh token
        const res = await axios.get(
          "https://eduminds-production-180d.up.railway.app/api/progress/my-enrolled-progress",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
        setProgresses(data);
        // Set default selected course only if not set or not found in data
        if (data.length) {
          const found = data.find(p => p.courseId && p.courseId._id === selectedCourseId);
          if (!selectedCourseId || !found) {
            setSelectedCourseId(data[0].courseId._id);
            localStorage.setItem("selectedCourseId", data[0].courseId._id);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch progress");
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
    // eslint-disable-next-line
  }, [token, marking]);

  // Handler to mark lesson as completed
  const handleCompleteLesson = async (courseId, lessonId) => {
    setMarking(true);
    try {
      const token = localStorage.getItem("token"); // always get fresh token
      await axios.post(
        "https://eduminds-production-180d.up.railway.app/api/progress/complete-lesson",
        { courseId, lessonId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Lesson marked as completed!");
      // Update progress locally for immediate UI feedback
      setProgresses(prev =>
        prev.map(progress => {
          if (progress.courseId && progress.courseId._id === courseId) {
            // Add lessonId to completedLessons if not already present
            const completedLessons = Array.isArray(progress.completedLessons)
              ? [...progress.completedLessons]
              : [];
            const lessonIdStr = lessonId.toString();
            if (!completedLessons.map(l => (l && l._id ? l._id : l).toString()).includes(lessonIdStr)) {
              completedLessons.push(lessonId);
            }
            // Recalculate progressPercentage
            const totalLessons = progress.courseId.lessons ? progress.courseId.lessons.length : 0;
            const completedCount = completedLessons.length;
            const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

            // --- Store completed lessons in localStorage for StudentCourseCard sync ---
            let completedLessonsMap = {};
            try {
              completedLessonsMap = JSON.parse(localStorage.getItem("completedLessonsMap") || "{}");
            } catch {}
            completedLessonsMap[courseId] = completedLessons.map(l => (l && l._id ? l._id : l));
            localStorage.setItem("completedLessonsMap", JSON.stringify(completedLessonsMap));
            // -------------------------------------------------------------------------

            return {
              ...progress,
              completedLessons,
              progressPercentage,
            };
          }
          return progress;
        })
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark lesson as completed");
    } finally {
      setMarking(false);
    }
  };

  // Download handler for protected lessons
  const handleDownloadLesson = async (lessonId, displayName, resourceType, resourceUrl) => {
    setDownloadingLessonId(lessonId);
    try {
      // If it's a PDF and the resourceUrl is a public Cloudinary URL, download directly
      if (
        resourceType === "PDF" &&
        resourceUrl &&
        resourceUrl.startsWith("https://res.cloudinary.com/") &&
        resourceUrl.endsWith(".pdf")
      ) {
        // Create a temporary <a> to trigger download
        const a = document.createElement("a");
        a.href = resourceUrl;
        a.download = displayName + ".pdf";
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.dispatchEvent(new CustomEvent("lesson-downloaded")); // Notify other tabs/pages
        setDownloadingLessonId(null);
        return;
      }
      // Otherwise, use backend route for download (for protected or video files)
      const token = localStorage.getItem("token");
      const response = await fetch(`https://eduminds-production-180d.up.railway.app/api/progress/download-lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
          alert(data.message || "Download failed");
          setDownloadingLessonId(null);
          return;
        }
        if (data.url) {
          if (resourceType === "PDF") {
            window.open(data.url, "_blank", "noopener,noreferrer");
            window.dispatchEvent(new CustomEvent("lesson-downloaded"));
          } else if (resourceType === "VIDEO") {
            const videoRes = await fetch(data.url);
            const videoBlob = await videoRes.blob();
            const videoUrl = window.URL.createObjectURL(videoBlob);
            const a = document.createElement("a");
            a.href = videoUrl;
            a.download = displayName + ".mp4";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(videoUrl);
            window.dispatchEvent(new CustomEvent("lesson-downloaded"));
          } else {
            const link = document.createElement("a");
            link.href = data.url;
            link.setAttribute("download", "");
            link.rel = "noopener noreferrer";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.dispatchEvent(new CustomEvent("lesson-downloaded"));
          }
          setDownloadingLessonId(null);
          return;
        }
        alert("Download failed");
        setDownloadingLessonId(null);
        return;
      }
      if (!response.ok) {
        alert("Download failed");
        setDownloadingLessonId(null);
        return;
      }
      // Download as blob (fallback)
      const blob = await response.blob();
      let filename = displayName;
      const disposition = response.headers.get("Content-Disposition");
      if (disposition && disposition.indexOf("filename=") !== -1) {
        filename = disposition.split("filename=")[1].replace(/['"]/g, "");
      } else if (resourceType === "PDF") {
        filename += ".pdf";
      } else if (resourceType === "VIDEO") {
        filename += ".mp4";
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      window.dispatchEvent(new CustomEvent("lesson-downloaded"));
    } catch (err) {
      alert("Download failed");
    } finally {
      setDownloadingLessonId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
      </div>
    );
  }
  if (error) return <div className="text-red-500">{error}</div>;
  if (!progresses.length) return <div>No progress found.</div>;

  // Find selected course progress
  const selectedProgress = progresses.find(
    (p) => p.courseId && p.courseId._id === selectedCourseId
  );
  const course = selectedProgress?.courseId;

  // Use teacherName from API response only
  const teacherName = selectedProgress?.teacherName || "-";
  // Fetch category as string (category name) from category model
  const categoryName = typeof course?.category === "string"
    ? course.category
    : (course?.category?.name || "-");

  const completedLessons = Array.isArray(selectedProgress?.completedLessons)
    ? selectedProgress.completedLessons.map(l => (l && l._id ? l._id : l))
    : [];
  const lessons = course?.lessons || [];

  // Helper to check if a file is an image (for mis-uploaded PDFs)
  const isImageFile = (url) => {
    if (!url) return false;
    // Check by extension (jpg, jpeg, png, gif, webp, etc)
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
  };

  // When user changes course, update localStorage
  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value);
    localStorage.setItem("selectedCourseId", e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <ToastContainer />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">Course Progress</h2>
          <p className="text-gray-600 text-base md:text-lg">
            Track your lesson completion and download resources for each course.
          </p>
        </div>
        <img
          src="/assets/logo.png"
          alt="Progress"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      <div className="space-y-6">
        {/* Course selection dropdown */}
        <div className="mb-4">
          <label className="font-semibold mr-2">Select Course:</label>
          <select
            value={selectedCourseId}
            onChange={handleCourseChange}
            className="border border-blue-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400"
          >
            {progresses.filter(p => p.courseId && p.courseId._id).map((p) => (
              <option key={p.courseId._id} value={p.courseId._id}>
                {p.courseId.title}
              </option>
            ))}
          </select>
        </div>

        {/* Show selected course progress */}
        {selectedProgress && (
          <div className="border rounded-xl p-4 shadow-lg bg-white">
            <h2 className="text-xl font-bold mb-2">
              {course?.title || "Untitled Course"}
            </h2>
            <div className="mb-1 text-gray-600">
              Teacher: {teacherName}
            </div>
            <div className="mb-1 text-gray-600">
              Category: {categoryName}
            </div>
            <div className="mb-2">
              Progress: <span className="font-semibold">{typeof selectedProgress.progressPercentage === "number" ? selectedProgress.progressPercentage.toFixed(1) : "0.0"}%</span>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${selectedProgress.progressPercentage || 0}%` }}
                ></div>
              </div>
            </div>
            <div className="mb-2">
              Completed Lessons: {completedLessons.length} / {lessons.length || "?"}
            </div>
            {selectedProgress.progressPercentage === 100 && (
              <>
                <div className="text-green-600 font-semibold mt-2">
                  🏁 Congratulations! You've completed this course.
                </div>
                <div className="mt-4">
                  <a
                    // href={`https://eduminds-production-180d.up.railway.app/api/certificates/${selectedCourseId}`}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🎓 Download Certificate
                  </a>
                </div>
              </>
            )}

            {/* Lessons list with completion action */}
            <details className="mt-2" open>
              <summary className="cursor-pointer text-blue-600 font-semibold text-lg select-none">Lessons</summary>
              <ul className="list-none ml-0 mt-3 flex flex-col gap-4 w-full">
                {lessons.length === 0 && <li className="text-gray-500">No lessons in this course.</li>}
                {lessons.map((lesson) => {
                  const lessonId = lesson._id ? lesson._id : lesson;
                  const isCompleted = completedLessons.includes(lessonId.toString());
                  let resourceType = lesson.contentType ? lesson.contentType.toUpperCase() : "UNKNOWN";
                  let resourceUrl = lesson.contentURL || null;
                  let displayName = lesson.title || lesson.name || lessonId;
                  const isDownloadable = resourceType === "PDF" || resourceType === "VIDEO";

                  return (
                    <li key={lessonId} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col gap-2 border hover:shadow-lg transition-all w-full">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-base text-gray-800 truncate max-w-xs" title={displayName}>{displayName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${resourceType === "VIDEO" ? "bg-blue-100 text-blue-700" : resourceType === "PDF" ? "bg-red-100 text-red-700" : resourceType === "LINK" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>{resourceType}</span>
                        {resourceType === "VIDEO" && resourceUrl && (
                          <video
                            src={resourceUrl}
                            controls
                            className="w-full max-w-xs h-32 rounded mt-2 border"
                            preload="metadata"
                          />
                        )}
                        {resourceType === "PDF" && resourceUrl && (
                          <button
                            onClick={() => window.open(resourceUrl, "_blank", "noopener,noreferrer")}
                            className="underline text-blue-600 text-xs ml-1 font-semibold"
                            disabled={downloadingLessonId === lessonId}
                            style={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}
                          >
                            {downloadingLessonId === lessonId ? "Loading..." : "View PDF"}
                          </button>
                        )}
                        {resourceType === "LINK" && resourceUrl && (
                          <a
                            href={resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-green-600 text-xs ml-1 font-semibold"
                          >
                            Open Link
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {isCompleted ? (
                          <span className="text-green-600 font-semibold flex items-center gap-1">✓ Completed</span>
                        ) : (
                          <button
                            className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
                            disabled={marking}
                            onClick={() => handleCompleteLesson(course._id, lessonId)}
                          >
                            Mark as Completed
                          </button>
                        )}
                        {/* Move Download button here, right after Mark as Completed / Completed */}
                        {isDownloadable && resourceUrl && (
                          <button
                            onClick={() => handleDownloadLesson(lessonId, displayName, resourceType, resourceUrl)}
                            className="ml-2 px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 transition flex items-center"
                            title={`Download ${resourceType}`}
                            disabled={downloadingLessonId === lessonId}
                          >
                            {downloadingLessonId === lessonId ? (
                              "Downloading..."
                            ) : (
                              // Download icon SVG
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgressCard;
