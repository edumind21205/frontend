import React, { useEffect, useState } from "react";

export default function CertificateCard() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingId, setLoadingId] = useState(""); // Track which student is being processed

  // Fetch teacher's courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("https://eduminds-production-180d.up.railway.app/api/teacher/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourses(data);
      setFilteredCourses(data);
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

  // Fetch enrollments for selected course
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchEnrollments = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://eduminds-production-180d.up.railway.app/api/enrollments/course/${selectedCourse._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setEnrollments(data);
    };
    fetchEnrollments();
  }, [selectedCourse]);

  // Issue certificate to a student
  const handleIssueCertificate = async (studentId) => {
    setLoadingId(studentId);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://eduminds-production-180d.up.railway.app/api/certificates/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: selectedCourse._id,
          studentId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Certificate issued successfully!");
        setEnrollments((prev) =>
          prev.map((enr) =>
            enr.student._id === studentId
              ? { ...enr, certificateIssued: true }
              : enr
          )
        );
      } else {
        setMessage(data.message || "Failed to issue certificate.");
      }
    } catch (err) {
      setMessage("Error issuing certificate.");
    }
    setLoadingId("");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">
            Issue Certificates
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Search for students who completed your courses and issue certificates.
          </p>
        </div>
        <img
          src="/assets/logo.png"
          alt="Certificate"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        {message && (
          <div className="mb-4 text-center text-sm text-blue-700">{message}</div>
        )}

        {/* Student Search and Course Selector */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Search Student</label>
          <input
            type="text"
            className="border border-blue-200 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
            placeholder="Enter student name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold">Select Course</label>
          <select
            className="border border-blue-200 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
            value={selectedCourse ? selectedCourse._id : ""}
            onChange={(e) => {
              const course = courses.find((c) => c._id === e.target.value);
              setSelectedCourse(course);
              setMessage("");
            }}
          >
            <option value="">-- Select a course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title} ({course._id})
              </option>
            ))}
          </select>
        </div>

        {/* Enrolled Students List */}
        {selectedCourse && (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Students Who Completed "{selectedCourse.title}"
            </h3>
            {enrollments.filter((enr) => enr.progress >= 100).length === 0 && (
              <p className="text-slate-500">
                No students have completed this course yet.
              </p>
            )}
            <ul>
              {enrollments
                .filter(
                  (enr) =>
                    enr.progress >= 100 &&
                    (search.trim() === "" ||
                      enr.student.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      enr.student.email
                        .toLowerCase()
                        .includes(search.toLowerCase()))
                )
                .map((enr) => (
                  <li
                    key={enr.student._id}
                    className="mb-4 flex items-center justify-between border-b pb-2"
                  >
                    <span>
                      {enr.student.name} ({enr.student.email})
                    </span>
                    {enr.certificateIssued ? (
                      <span className="text-green-600 font-semibold">
                        Certificate Issued
                      </span>
                    ) : (
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                        disabled={loadingId === enr.student._id}
                        onClick={() => handleIssueCertificate(enr.student._id)}
                      >
                        {loadingId === enr.student._id ? (
                          <span className="flex items-center gap-2">
                            <span>Issuing...</span>
                            <span>
                              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-blue-200 border-t-blue-600"></span>
                            </span>
                          </span>
                        ) : (
                          "Issue Certificate"
                        )}
                      </button>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
