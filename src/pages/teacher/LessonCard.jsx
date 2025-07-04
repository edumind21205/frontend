import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LessonCard() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("video");
  const [contentURL, setContentURL] = useState("");
  const [file, setFile] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // For displaying lessons per course
  const [lessons, setLessons] = useState({});

  // Fetch teacher's courses and their lessons on mount
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("https://eduminds-production-180d.up.railway.app/api/teacher/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourses(data);
      setFilteredCourses(data);

      // Fetch lessons for each course
      const lessonsData = {};
      for (const course of data) {
        const lessonRes = await fetch(
          `https://eduminds-production-180d.up.railway.app/api/lessons/course/${course._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const lessonList = await lessonRes.json();
        lessonsData[course._id] = lessonList.lessons;
      }
      setLessons(lessonsData);
    };
    fetchCourses();
  }, []);

  // Filter courses by search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(
        courses.filter(
          (c) =>
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c._id === search.trim()
        )
      );
    }
  }, [search, courses]);

  // Handle lesson submission
  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const teacherId = userStr ? JSON.parse(userStr).id : null; // get teacher id from user object

    const formData = new FormData();
    formData.append("courseId", selectedCourse._id);
    formData.append("title", title);
    formData.append("contentType", contentType);
    formData.append("createdBy", teacherId);

    if (contentType === "link") {
      formData.append("contentURL", contentURL);
    } else if (file) {
      formData.append("file", file);
    }

    try {
      const res = await fetch("https://eduminds-production-180d.up.railway.app/api/lessons/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Lesson added successfully!");
        // setMessage("Lesson added successfully!");
        setTitle("");
        setContentType("video");
        setContentURL("");
        setFile(null);

        // Refresh lessons for the selected course
        const lessonRes = await fetch(
          `https://eduminds-production-180d.up.railway.app/api/lessons/course/${selectedCourse._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const lessonList = await lessonRes.json();
        setLessons((prev) => ({
          ...prev,
          [selectedCourse._id]: lessonList.lessons,
        }));
      } else {
        setMessage(data.message || "Failed to add lesson.");
      }
    } catch (err) {
      setMessage("Error adding lesson.");
    }
    setLoading(false);
  };

  // Update Lesson
  const handleUpdateLesson = async (lessonId, updatedFields) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://eduminds-production-180d.up.railway.app/api/lessons/update/${lessonId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Lesson updated successfully!");
        // Refresh lessons for the selected course
        if (selectedCourse) {
          const lessonRes = await fetch(
            `https://eduminds-production-180d.up.railway.app/api/lessons/course/${selectedCourse._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const lessonList = await lessonRes.json();
          setLessons((prev) => ({
            ...prev,
            [selectedCourse._id]: lessonList.lessons,
          }));
        }
      } else {
        toast.error(data.message || "Failed to update lesson.");
      }
    } catch (err) {
      toast.error("Error updating lesson.");
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async (lessonId, courseId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      const res = await fetch(
        `https://eduminds-production-180d.up.railway.app/api/lessons/delete/${lessonId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Lesson deleted successfully!");
        // Refresh lessons for the course
        const lessonRes = await fetch(
          `https://eduminds-production-180d.up.railway.app/api/lessons/course/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const lessonList = await lessonRes.json();
        setLessons((prev) => ({
          ...prev,
          [courseId]: lessonList.lessons,
        }));
      } else {
        toast.error(data.message || "Failed to delete lesson.");
      }
    } catch (err) {
      toast.error("Error deleting lesson.");
    }
  };

  // Helper to get correct video/pdf src
  const getFileSrc = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    // Always serve from Cloudinary or local server
    if (url.startsWith("/")) return `https://eduminds-production-180d.up.railway.app${url}`;
    return `https://eduminds-production-180d.up.railway.app/${url}`;
  };

  // Helper to check if a file is an image (for mis-uploaded PDFs)
  const isImageFile = (url) => {
    if (!url) return false;
    // Check by extension (jpg, jpeg, png, gif, webp, etc)
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <ToastContainer />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">
            Lesson Management
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Add, edit, and manage lessons for your courses.
          </p>
        </div>
        <img
          src="/assets/logo.png"
          alt="Lesson"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
        </div>
      )}
      <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg mb-10">
        <h2 className="text-2xl font-bold mb-4">Add Lesson to Course</h2>
        {message && (
          <div className="mb-4 text-center text-sm text-blue-700">{message}</div>
        )}

        {/* Course Search and Select */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Search Course</label>
          <input
            type="text"
            className="border border-blue-200 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
            placeholder="Enter course title or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="mt-2 max-h-48 overflow-y-auto border rounded bg-white">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-2 py-1 text-left font-semibold">Title</th>
                  <th className="px-2 py-1 text-left font-semibold">Category</th>
                  <th className="px-2 py-1 text-left font-semibold">Price</th>
                  <th className="px-2 py-1 text-left font-semibold">Select</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr
                    key={course._id}
                    className={`hover:bg-blue-100 cursor-pointer ${
                      selectedCourse && selectedCourse._id === course._id
                        ? "bg-blue-200 font-bold"
                        : ""
                    }`}
                  >
                    <td className="px-2 py-1">
                      <div className="font-semibold">{course.title}</div>
                      <div className="text-xs text-slate-600">
                        {course.description}
                      </div>
                    </td>
                    <td className="px-2 py-1 capitalize">
                      {course.category || "General"}
                    </td>
                    <td className="px-2 py-1 text-blue-700 font-semibold">
                      $
                      {course.price?.toFixed
                        ? Number(course.price).toFixed(2)
                        : course.price || "0.00"}
                    </td>
                    <td className="px-2 py-1">
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        onClick={() => setSelectedCourse(course)}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lesson Form */}
        {selectedCourse && (
          <form
            onSubmit={handleLessonSubmit}
            className="mt-4"
            encType="multipart/form-data"
          >
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Lesson Title</label>
              <input
                type="text"
                className="border border-blue-200 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter lesson title"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Content Type</label>
              <select
                className="border border-blue-200 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="link">URL</option>
              </select>
            </div>
            {contentType === "link" ? (
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Content URL</label>
                <input
                  type="url"
                  className="border border-blue-200 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                  value={contentURL}
                  onChange={(e) => setContentURL(e.target.value)}
                  required
                  placeholder="Enter content URL"
                />
              </div>
            ) : (
              <div className="mb-4">
                <label className="block mb-1 font-semibold">
                  {contentType === "video" ? "Upload Video" : "Upload PDF"}
                </label>
                <input
                  type="file"
                  accept={
                    contentType === "video"
                      ? "video/*"
                      : "application/pdf"
                  }
                  className="w-full"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>
            )}
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Lesson"}
            </button>
          </form>
        )}
      </div>

      <h3 className="text-2xl font-bold mb-4 mt-8 text-blue-700">
        All Courses & Lessons
      </h3>
      {courses.length === 0 && <p>No courses found.</p>}
      <div className="grid grid-cols-1 gap-6">
        {courses.map((course, idx) => (
          <div
            key={course._id}
            className="border rounded-xl bg-white shadow-lg hover:shadow-2xl transition transform duration-300 hover:scale-105 flex flex-col overflow-hidden w-full"
            style={{ width: "100%" }}
          >
            {course.picture && (
              <img
                src={
                  course.picture.startsWith("http")
                    ? course.picture
                    : `https://eduminds-production-180d.up.railway.app/${course.picture.replace(/^\//, "")}`
                }
                alt={course.title}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="flex-1 flex flex-col p-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 font-semibold">
                  Course #{idx + 1} | ID: {course._id.slice(-6)}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1">{course.title}</h3>
              <p className="text-slate-600 text-sm mb-2 line-clamp-2">
                {course.description}
              </p>
              {/* Category and Price */}
              <div className="flex items-center justify-between mb-2">
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full capitalize">
                  {course.category || "General"}
                </span>
                <span className="text-blue-700 font-semibold text-xs">
                  $
                  {course.price?.toFixed
                    ? Number(course.price).toFixed(2)
                    : course.price || "0.00"}
                </span>
              </div>
              <div className="mt-2">
                <h4 className="font-bold text-sm mb-1">Lessons:</h4>
                {lessons[course._id] && lessons[course._id].length > 0 ? (
                  <ul className="list-disc pl-4 text-xs">
                    {lessons[course._id].map((lesson) => (
                      <li key={lesson._id} className="mb-2">
                        <span className="font-semibold">{lesson.title}</span>
                        {" - "}
                        <span className="italic">{lesson.contentType}</span>
                        {lesson.contentType === "video" && lesson.contentURL && (
                          <video
                            src={getFileSrc(lesson.contentURL)}
                            controls
                            className="w-40 h-24 rounded mt-1"
                          />
                        )}
                        {lesson.contentType === "pdf" && lesson.contentURL && (
                          isImageFile(lesson.contentURL) ? (
                            <img
                              src={getFileSrc(lesson.contentURL)}
                              alt="PDF as image"
                              className="w-40 h-24 rounded mt-1 object-contain border"
                            />
                          ) : (
                            <a
                              href={getFileSrc(lesson.contentURL)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline ml-2"
                            >
                              View PDF
                            </a>
                          )
                        )}
                        {lesson.contentType === "link" && lesson.contentURL && (
                          <a
                            href={lesson.contentURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline ml-2"
                          >
                            Open Link
                          </a>
                        )}
                        <button
                          className="ml-2 text-blue-600 underline"
                          onClick={() => {
                            const newTitle = prompt(
                              "Enter new lesson title:",
                              lesson.title
                            );
                            if (newTitle && newTitle !== lesson.title) {
                              handleUpdateLesson(lesson._id, { title: newTitle });
                            }
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="ml-2 text-red-600 underline"
                          onClick={() => handleDeleteLesson(lesson._id, course._id)}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-xs">No lessons added yet.</p>
                )}
                <p className="mt-2 font-semibold text-xs">
                  Total Lessons:{" "}
                  {lessons[course._id] ? lessons[course._id].length : 0}
                </p>
              </div>
              <button
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                onClick={async () => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this course? This action cannot be undone."
                    )
                  ) {
                    try {
                      const token = localStorage.getItem("token");
                      const res = await fetch(
                        `https://eduminds-production-180d.up.railway.app/api/teacher/courses/${course._id}`,
                        {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                      const data = await res.json();
                      if (res.ok) {
                        alert("Course deleted successfully!");
                        setCourses((prev) => prev.filter((c) => c._id !== course._id));
                        setLessons((prev) => {
                          const updated = { ...prev };
                          delete updated[course._id];
                          return updated;
                        });
                      } else {
                        alert(data.message || "Failed to delete course.");
                      }
                    } catch (err) {
                      alert("Error deleting course.");
                    }
                  }
                }}
              >
                Delete Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
