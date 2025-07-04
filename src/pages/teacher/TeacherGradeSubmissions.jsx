import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TeacherGradeSubmissions = ({ assignmentId: propAssignmentId, onBack }) => {
  const [submissions, setSubmissions] = useState([]);
  const [inputs, setInputs] = useState({}); // { [submissionId]: { marks: '', feedback: '' } }
  const [loading, setLoading] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    deadline: "",
    totalMarks: 100,
    attachmentUrl: "",
    course: "",
  });
  const [message, setMessage] = useState("");
  const [myAssignments, setMyAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(() => {
    return localStorage.getItem("teacherSelectedAssignmentId") || (propAssignmentId || "");
  });
  const [editAssignmentId, setEditAssignmentId] = useState(null);
  const [editAssignment, setEditAssignment] = useState({
    title: "",
    description: "",
    deadline: "",
    totalMarks: 100,
    attachmentUrl: "",
    course: "",
  });
  const [courses, setCourses] = useState([]);

  const CLOUDINARY_CLOUD_NAME = "dctpna06w"; // Replace with your Cloudinary cloud name
  const CLOUDINARY_UPLOAD_PRESET = "upload"; // Replace with your Cloudinary upload preset

  // Helper to get token from localStorage (adjust if you store it elsewhere)
  const getToken = () => localStorage.getItem("token");

  // Fetch all assignments created by this teacher (for dropdown and list)
  useEffect(() => {
    const fetchMyAssignments = async () => {
      try {
        const token = getToken();
        const { data } = await axios.get(
          "https://eduminds-production-180d.up.railway.app/api/assignments/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMyAssignments(Array.isArray(data.assignments) ? data.assignments : []);
        // Auto-select first assignment if none selected
        if (!selectedAssignmentId && data.assignments && data.assignments.length > 0) {
          setSelectedAssignmentId(data.assignments[0]._id);
        }
      } catch (err) {
        setMyAssignments([]);
      }
    };
    fetchMyAssignments();
    // eslint-disable-next-line
  }, []);

  // Fetch all courses for assignment creation
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = getToken();
        const res = await axios.get("https://eduminds-production-180d.up.railway.app/api/teacher/my-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(Array.isArray(res.data) ? res.data : []);
      } catch {
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  // Fetch submissions for selected assignment
  useEffect(() => {
    if (!selectedAssignmentId) {
      setSubmissions([]);
      return;
    }
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://eduminds-production-180d.up.railway.app/api/submissions/assignment/${selectedAssignmentId}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        setSubmissions(Array.isArray(data.submissions) ? data.submissions : []);
      } catch (err) {
        setSubmissions([]);
        alert("Failed to fetch submissions");
      }
      setLoading(false);
    };
    fetchSubmissions();
  }, [selectedAssignmentId]);

  const handleInputChange = (id, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleGrade = async (id) => {
    const { marks, feedback } = inputs[id] || {};
    try {
      await axios.put(
        `https://eduminds-production-180d.up.railway.app/api/submissions/${id}/grade`,
        { marksObtained: marks, feedback },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      toast.success("Graded!");
    } catch (err) {
      toast.error("Failed to grade submission");
    }
  };

  // Assignment upload logic
  const handleAssignmentInput = (field, value) => {
    setNewAssignment((prev) => ({ ...prev, [field]: value }));
  };

  const handleAttachmentFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setNewAssignment((prev) => ({ ...prev, attachmentUrl: data.secure_url }));
        toast.success("Attachment uploaded!");
      } else {
        toast.error("Cloudinary upload failed");
      }
    } catch (err) {
      toast.error("Cloudinary upload error");
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    // Validation: Prevent past deadline
    const now = new Date();
    const selectedDate = new Date(newAssignment.deadline);
    if (!newAssignment.deadline || selectedDate < now) {
      setMessage("Deadline must be a future date and time.");
      return;
    }
    try {
      const token = getToken();
      // Ensure deadline is in ISO format (YYYY-MM-DDTHH:MM)
      const formattedDeadline = newAssignment.deadline
        ? new Date(newAssignment.deadline).toISOString()
        : "";
      const payload = {
        ...newAssignment,
        deadline: formattedDeadline,
      };
      await axios.post(
        "https://eduminds-production-180d.up.railway.app/api/assignments/create",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Assignment created successfully!");
      setShowAssignmentForm(false);
      setNewAssignment({ title: "", description: "", deadline: "", totalMarks: 100, attachmentUrl: "", course: "" });
      // Re-fetch assignments so all have populated course info
      const { data: refreshed } = await axios.get(
        "https://eduminds-production-180d.up.railway.app/api/assignments/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyAssignments(Array.isArray(refreshed.assignments) ? refreshed.assignments : []);
    } catch (err) {
      setMessage("Failed to create assignment");
      // Debug log
      if (err.response) {
        console.error("Assignment creation error:", err.response.data);
      } else {
        console.error("Assignment creation error:", err);
      }
    }
  };

  // Edit assignment logic
  const handleEditAssignmentInput = (field, value) => {
    setEditAssignment((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditAssignment = (assignment) => {
    setEditAssignmentId(assignment._id);
    setEditAssignment({
      title: assignment.title,
      description: assignment.description,
      deadline: assignment.deadline ? new Date(assignment.deadline).toISOString().slice(0, 16) : "",
      totalMarks: assignment.totalMarks,
      attachmentUrl: assignment.attachmentUrl || "",
      course: assignment.course?._id || assignment.course || "",
    });
    setShowAssignmentForm(false);
  };

  const handleEditAssignmentSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = getToken();
      const formattedDeadline = editAssignment.deadline
        ? new Date(editAssignment.deadline).toISOString()
        : "";
      const payload = {
        ...editAssignment,
        deadline: formattedDeadline,
      };
      const { data } = await axios.put(
        `https://eduminds-production-180d.up.railway.app/api/assignments/${editAssignmentId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Assignment updated successfully!");
      setEditAssignmentId(null);
      setEditAssignment({ title: "", description: "", deadline: "", totalMarks: 100, attachmentUrl: "", course: "" });
      // Refresh assignments list
      setMyAssignments((prev) =>
        prev.map((a) => (a._id === data.assignment._id ? data.assignment : a))
      );
    } catch (err) {
      setMessage("Failed to update assignment");
      if (err.response) {
        console.error("Assignment update error:", err.response.data);
      } else {
        console.error("Assignment update error:", err);
      }
    }
  };

  // Delete assignment logic
  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      const token = getToken();
      await axios.delete(
        `https://eduminds-production-180d.up.railway.app/api/assignments/${assignmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Assignment deleted successfully!");
      setMyAssignments((prev) => prev.filter((a) => a._id !== assignmentId));
      if (selectedAssignmentId === assignmentId) setSelectedAssignmentId("");
    } catch (err) {
      toast.error("Failed to delete assignment");
    }
  };

  // Persist selectedAssignmentId to localStorage
  useEffect(() => {
    if (selectedAssignmentId) {
      localStorage.setItem("teacherSelectedAssignmentId", selectedAssignmentId);
    } else {
      localStorage.removeItem("teacherSelectedAssignmentId");
    }
  }, [selectedAssignmentId]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">Assignment & Submissions</h2>
          <p className="text-gray-600 text-base md:text-lg">
            Manage assignments and grade student submissions for your courses.
          </p>
        </div>
        {/* <img
          src="/assets/logo.png"
          alt="Assignments"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        /> */}
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mb-10">
        <div className="flex items-center justify-between mb-4">
          {onBack && (
            <button onClick={onBack} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Back</button>
          )}
        </div>
        <button
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => setShowAssignmentForm((v) => !v)}
        >
          {showAssignmentForm ? "Cancel" : "Upload New Assignment"}
        </button>
        {showAssignmentForm && (
          <form onSubmit={handleAssignmentSubmit} className="mb-6 bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-bold mb-2">New Assignment</h3>
            <select
              className="border border-blue-200 px-3 py-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-400"
              value={newAssignment.course}
              onChange={e => handleAssignmentInput("course", e.target.value)}
              required
            >
              <option value="">-- Select Course --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
            <input
              type="text"
              className="border border-blue-200 px-3 py-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Title"
              value={newAssignment.title}
              onChange={e => handleAssignmentInput("title", e.target.value)}
              required
            />
            <textarea
              className="border border-blue-200 px-3 py-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Description"
              value={newAssignment.description}
              onChange={e => handleAssignmentInput("description", e.target.value)}
            />
            <input
              type="datetime-local"
              className="border border-blue-200 px-3 py-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-400"
              value={newAssignment.deadline}
              onChange={e => handleAssignmentInput("deadline", e.target.value)}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
            <input
              type="number"
              className="border border-blue-200 px-3 py-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Total Marks"
              value={newAssignment.totalMarks}
              onChange={e => handleAssignmentInput("totalMarks", e.target.value)}
              required
            />
            <div className="mb-2">
              {/* Responsive flex container for label, input, and link */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="block font-semibold mb-1 sm:mb-0 sm:mr-2 whitespace-nowrap">
                  Attachment (PDF, image, etc.)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.avi,.mov"
                  onChange={handleAttachmentFileChange}
                  className="mb-1 sm:mb-0 flex-1 min-w-0"
                  style={{ maxWidth: "100%" }}
                />
              </div>
              {newAssignment.attachmentUrl && (
                <a
                  href={newAssignment.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm break-all block mt-1 max-w-full truncate"
                  style={{ wordBreak: "break-all" }}
                >
                  View Uploaded Attachment
                </a>
              )}
            </div>
            <input
              type="text"
              className="border border-blue-200 px-3 py-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Attachment URL (optional)"
              value={newAssignment.attachmentUrl}
              onChange={e => handleAssignmentInput("attachmentUrl", e.target.value)}
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">Create Assignment</button>
            {message && <p className="mt-2 text-green-600">{message}</p>}
          </form>
        )}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Your Assignments</h3>
          {myAssignments.length === 0 ? (
            <div className="text-gray-500">No assignments created yet.</div>
          ) : (
            <ul className="divide-y">
              {myAssignments.map(a => (
                <li key={a._id} className="py-2 flex flex-col">
                  <span className="font-semibold">{a.title}</span>
                  <span className="text-sm text-gray-600">
                    Course: {(typeof a.course === 'object' && a.course && a.course.title) ? a.course.title : "N/A"} | Deadline: {a.deadline ? new Date(a.deadline).toLocaleString() : "N/A"}
                  </span>
                  <div className="flex gap-2 mt-1">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      onClick={() => handleEditAssignment(a)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteAssignment(a._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          {/* Responsive flex container for label and select */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="font-semibold mr-2 min-w-max">Select Assignment:</label>
            <select
              className="border border-blue-200 px-2 py-1 rounded-lg focus:ring-2 focus:ring-blue-400 flex-1 min-w-[180px]"
              value={selectedAssignmentId || ""}
              onChange={e => setSelectedAssignmentId(e.target.value)}
            >
              <option value="">-- Select Assignment --</option>
              {myAssignments.map(a => (
                <option key={a._id} value={a._id}>
                  {a.title} (Course: {a.course?.title || "N/A"}, Deadline: {a.deadline ? new Date(a.deadline).toLocaleString() : "N/A"})
                </option>
              ))}
            </select>
          </div>
        </div>
        {editAssignmentId && (
          <form onSubmit={handleEditAssignmentSubmit} className="mb-6 bg-yellow-50 p-4 rounded-xl">
            <h3 className="text-lg font-bold mb-2">Edit Assignment</h3>
            <input
              type="text"
              className="border border-blue-200 px-3 py-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Title"
              value={editAssignment.title}
              onChange={e => handleEditAssignmentInput("title", e.target.value)}
              required
            />
            <textarea
              className="border border-blue-200 px-3 py-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Description"
              value={editAssignment.description}
              onChange={e => handleEditAssignmentInput("description", e.target.value)}
            />
            <select
              className="border border-blue-200 px-3 py-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-400"
              value={editAssignment.course}
              onChange={e => handleEditAssignmentInput("course", e.target.value)}
              required
            >
              <option value="">-- Select Course --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              className="border border-blue-200 px-3 py-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-400"
              value={editAssignment.deadline}
              onChange={e => handleEditAssignmentInput("deadline", e.target.value)}
              required
            />
            <input
              type="number"
              className="border border-blue-200 px-3 py-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Total Marks"
              value={editAssignment.totalMarks}
              onChange={e => handleEditAssignmentInput("totalMarks", e.target.value)}
              required
            />
            <input
              type="text"
              className="border border-blue-200 px-3 py-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Attachment URL (optional)"
              value={editAssignment.attachmentUrl}
              onChange={e => handleEditAssignmentInput("attachmentUrl", e.target.value)}
            />
            <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded-lg">Update Assignment</button>
            <button
              type="button"
              className="ml-2 bg-gray-400 text-white px-4 py-2 rounded-lg"
              onClick={() => setEditAssignmentId(null)}
            >
              Cancel
            </button>
            {message && <p className="mt-2 text-red-600">{message}</p>}
          </form>
        )}
        <div className="flex items-center justify-between mb-4 mt-8">
          <h2 className="text-2xl font-semibold text-blue-700">Student Submissions</h2>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
          </div>
        ) : (
          selectedAssignmentId && submissions && submissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-100 hidden sm:table-header-group">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Student</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Submission</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Marks</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Feedback</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {submissions.map((s) => (
                    <tr key={s._id} className="flex flex-col sm:table-row">
                      <td className="px-2 py-2 whitespace-normal break-all">
                        <span className="font-semibold">{s.student.name}</span>
                        <br />
                        <span className="text-xs text-gray-600">{s.student.email}</span>
                      </td>
                      <td className="px-2 py-2">
                        <a
                          href={s.submittedFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline break-all"
                        >
                          View Submission
                        </a>
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          placeholder="Marks"
                          value={inputs[s._id]?.marks || ""}
                          onChange={e => handleInputChange(s._id, "marks", e.target.value)}
                          className="border border-blue-200 px-2 py-1 w-full sm:w-20 rounded-lg focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          placeholder="Feedback"
                          value={inputs[s._id]?.feedback || ""}
                          onChange={e => handleInputChange(s._id, "feedback", e.target.value)}
                          className="border border-blue-200 px-2 py-1 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <button
                          onClick={() => handleGrade(s._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg w-full sm:w-auto"
                        >
                          Grade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            selectedAssignmentId ? <div>No submissions found.</div> : <div>Select an assignment to view submissions.</div>
          )
        )}
      </div>
    </div>
  );
};

export default TeacherGradeSubmissions;
