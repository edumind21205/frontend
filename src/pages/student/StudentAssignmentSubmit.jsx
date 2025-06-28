import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify"; // Add this import

const StudentAssignmentSubmit = () => {
  const { assignmentId } = useParams();
  // --- Restore selectedAssignmentId from localStorage ---
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(() => {
    return localStorage.getItem("assignmentSelectedId") || null;
  });
  const [assignment, setAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [allAssignments, setAllAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileInputs, setFileInputs] = useState({}); // Track file per assignment in list

  const token = localStorage.getItem("token");

  // Fetch all assignments if no assignmentId in URL
  useEffect(() => {
    if (assignmentId) return;
    setLoading(true);
    axios
      .get("https://eduminds-production-180d.up.railway.app/api/submissions/student/assignments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data && res.data.success) {
          setAllAssignments(res.data.assignmentsByCourse || []);
        } else {
          setMessage("Failed to load assignments.");
        }
      })
      .catch(() => setMessage("Failed to load assignments."))
      .finally(() => setLoading(false));
  }, [assignmentId, token]);

  // Fetch single assignment if assignmentId is present (from URL or selection)
  useEffect(() => {
    const id = assignmentId || selectedAssignmentId;
    if (!id) return;
    setLoading(true);
    const fetchAssignment = async () => {
      try {
        const { data } = await axios.get(
          `https://eduminds-production-180d.up.railway.app/api/assignments/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAssignment(data.assignment);
      } catch (err) {
        setMessage("Failed to load assignment. Please login again.");
        setAssignment(null);
      }
      setLoading(false);
    };

    const checkSubmission = async () => {
      try {
        const { data } = await axios.get(
          `https://eduminds-production-180d.up.railway.app/api/submissions/student`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data && Array.isArray(data.submissions)) {
          const submitted = data.submissions.find(
            (s) => s.assignment && s.assignment._id === id
          );
          if (submitted) {
            setAlreadySubmitted(true);
            setMessage("You have already submitted this assignment.");
          } else {
            setAlreadySubmitted(false);
            setMessage("");
          }
        }
      } catch (err) {
        setMessage("Failed to check submission. Please login again.");
        setAlreadySubmitted(false);
      }
    };

    fetchAssignment();
    checkSubmission();
    // eslint-disable-next-line
  }, [assignmentId, selectedAssignmentId, token]);

  // --- Persist selectedAssignmentId to localStorage ---
  useEffect(() => {
    if (selectedAssignmentId) {
      localStorage.setItem("assignmentSelectedId", selectedAssignmentId);
    } else {
      localStorage.removeItem("assignmentSelectedId");
    }
  }, [selectedAssignmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a file.");
    if (!token) return alert("You must be logged in to submit.");
    const id = assignmentId || selectedAssignmentId;

    // upload file to Cloudinary (use /raw/upload for PDFs)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "upload"); // 'upload' is your unsigned preset name

    const cloudName = "dgedargei";
    const isPDF = file && file.type === "application/pdf";
    const uploadUrl = isPDF
      ? `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`
      : `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    const response = await axios.post(uploadUrl, formData);

    const fileUrl = response.data.secure_url;

    // submit to backend
    await axios.post(
      "https://eduminds-production-180d.up.railway.app/api/submissions",
      {
        assignment: id,
        submittedFileUrl: fileUrl,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setAlreadySubmitted(true);
    setMessage("Assignment submitted successfully!");
    toast.success("Assignment submitted successfully!"); // Show toast notification
  };

  // Helper for deadline reminder
  const getDeadlineReminder = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const due = new Date(deadline);
    const diffMs = due - now;
    if (diffMs < 0) {
      return <span className="text-red-600 font-semibold">Deadline passed!</span>;
    }
    if (diffMs < 24 * 60 * 60 * 1000) {
      return <span className="text-orange-600 font-semibold">Due soon!</span>;
    }
    return null;
  };

  // If no assignmentId and no assignment selected, show all assignments
  if (!assignmentId && !selectedAssignmentId) {
    if (loading) return <p>Loading assignments...</p>;
    if (message) return <p className="text-red-600">{message}</p>;
    if (!allAssignments.length) return <p>No assignments found.</p>;
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">
              Your Assignments
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Submit your assignments for all enrolled courses.
            </p>
          </div>
          {/* <img
            src="/assets/logo.png"
            alt="Assignments"
            className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
          /> */}
        </div>
        {allAssignments.map((course) => (
          <div key={course.courseId} className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{course.courseTitle}</h3>
            <div className="space-y-2">
              {course.assignments.map((a) => (
                <div key={a._id} className="border rounded-xl bg-white shadow p-3 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-sm text-gray-600">{a.description}</div>
                    <div className="text-xs text-gray-500">
                      Deadline: {a.deadline ? new Date(a.deadline).toLocaleString() : "N/A"}
                      {" "}
                      {getDeadlineReminder(a.deadline)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 mt-2 md:mt-0">
                    {a.submitted ? (
                      <span className="text-green-600 font-semibold">Submitted</span>
                    ) : (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                          <input
                            type="file"
                            onChange={e =>
                              setFileInputs(inputs => ({
                                ...inputs,
                                [a._id]: e.target.files[0]
                              }))
                            }
                            className="mb-2 sm:mb-0 flex-1 min-w-0"
                            style={{ maxWidth: "100%" }}
                          />
                        </div>
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                          onClick={async () => {
                            const file = fileInputs[a._id];
                            if (!file) return alert("Please upload a file.");
                            if (!token) return alert("You must be logged in to submit.");
                            // upload file to Cloudinary (use /raw/upload for PDFs)
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("upload_preset", "upload"); // 'upload' is your unsigned preset name

                            const cloudName = "dgedargei";
                            const isPDF = file && file.type === "application/pdf";
                            const uploadUrl = isPDF
                              ? `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`
                              : `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
                            let fileUrl = "";
                            try {
                              const cloudRes = await axios.post(uploadUrl, formData);
                              fileUrl = cloudRes.data.secure_url;
                            } catch (err) {
                              const msg =
                                err.response?.data?.error?.message ||
                                err.response?.data?.message ||
                                "File upload failed.";
                              alert(msg);
                              return;
                            }
                            // submit to backend
                            try {
                              await axios.post(
                                "https://eduminds-production-180d.up.railway.app/api/submissions",
                                {
                                  assignment: a._id,
                                  submittedFileUrl: fileUrl,
                                },
                                { headers: { Authorization: `Bearer ${token}` } }
                              );
                              // Refresh assignments after submission
                              setAllAssignments(assignments =>
                                assignments.map(courseObj => ({
                                  ...courseObj,
                                  assignments: courseObj.assignments.map(ass =>
                                    ass._id === a._id
                                      ? { ...ass, submitted: true }
                                      : ass
                                  )
                                }))
                              );
                              setFileInputs(inputs => ({ ...inputs, [a._id]: undefined }));
                              alert("Assignment submitted successfully!");
                            } catch {
                              alert("Submission failed.");
                            }
                          }}
                        >
                          Submit
                        </button>
                        {/* Add button to view this assignment in single view */}
                        <button
                          className="mt-1 text-blue-600 underline text-xs"
                          onClick={() => setSelectedAssignmentId(a._id)}
                        >
                          View Details
                        </button>
                      </>
                    )}
                    {a.marksObtained !== null && (
                      <span className="text-sm text-blue-700">Marks: {a.marksObtained}</span>
                    )}
                    {a.feedback && (
                      <span className="text-xs text-gray-500">Feedback: {a.feedback}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // If loading single assignment
  if (loading) return <p>Loading assignment...</p>;
  if (!assignmentId && !selectedAssignmentId) return <p>Invalid assignment. Please try again.</p>;
  if (!assignment) return <p>Loading assignment...</p>;

  return (
    <div className="max-w-xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">{assignment.title}</h2>
          <p className="text-gray-600 text-base md:text-lg">{assignment.description}</p>
        </div>
        {/* <img
          src="/assets/assignment.jpg"
          alt="Assignment"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        /> */}
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Deadline: {new Date(assignment.deadline).toLocaleString()}
        {" "}
        {getDeadlineReminder(assignment.deadline)}
      </p>

      {alreadySubmitted ? (
        <p className="text-green-600 font-semibold">{message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Submit Assignment
          </button>
        </form>
      )}
      {message && !alreadySubmitted && (
        <p className="text-red-600 font-semibold mt-2">{message}</p>
      )}
      {/* Back button to go to all assignments */}
      {!assignmentId && (
        <button
          className="mt-4 text-blue-600 underline"
          onClick={() => {
            setSelectedAssignmentId(null);
            setAssignment(null);
            setAlreadySubmitted(false);
            setMessage("");
            // localStorage will be cleared by useEffect
          }}
        >
          Back to All Assignments
        </button>
      )}
    </div>
  );
};

export default StudentAssignmentSubmit;

