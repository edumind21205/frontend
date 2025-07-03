import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Searchbar from "../components/SearchBar";

const DownloadPage = () => {
  const [lessons, setLessons] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add state for certificates
  const [certificates, setCertificates] = useState([]);
  const [certLoading, setCertLoading] = useState(true);
  const [certError, setCertError] = useState(null);

  // Add state for course/quiz/assignment data
  const [courses, setCourses] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [allAssignments, setAllAssignments] = useState({});
  const [assignmentMarksMap, setAssignmentMarksMap] = useState({});
  const [showAllHistory, setShowAllHistory] = useState(false); // Add state for expand/collapse
  const [showAllLessons, setShowAllLessons] = useState(false); // Add state for lessons expand/collapse
  const [selectedCourseId, setSelectedCourseId] = useState(null); // NEW: single course mode
  const [user, setUser] = useState(null); // NEW: store logged-in user
  const [showAllCerts, setShowAllCerts] = useState(false); // For Student Certificates & Course Report
  const [showAllDownloadableCerts, setShowAllDownloadableCerts] = useState(false); // NEW: For Downloadable Certificates table

  // Refactor fetch logic into functions so we can call them on refresh
  const fetchLessons = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let lessonsArr = [];
      let coursesRes = await axios.get("https://eduminds-production-180d.up.railway.app/api/student/enrolled-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(coursesRes.data)) {
        coursesRes.data.forEach((course) => {
          if (Array.isArray(course.lessons)) {
            lessonsArr = lessonsArr.concat(course.lessons.map(l => ({ ...l, courseTitle: course.title })));
          }
        });
      }
      setLessons(lessonsArr);
    } catch (err) {
      setError("Failed to fetch lessons");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://eduminds-production-180d.up.railway.app/api/download/history", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setHistory(res.data || []);
    } catch (err) {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://eduminds-production-180d.up.railway.app/api/enrollments/enroll-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const result = await res.json();
      setCourses(result.courses || []);
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://eduminds-production-180d.up.railway.app/api/quizzes/student/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch all quizzes");
      const data = await res.json();
      setAllQuizzes(data.quizzes || []);
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://eduminds-production-180d.up.railway.app/api/submissions/student/assignments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch all assignments");
      const data = await res.json();
      const assignmentsObj = {};
      (data.assignmentsByCourse || []).forEach(courseBlock => {
        assignmentsObj[courseBlock.courseId] = courseBlock.assignments;
      });
      setAllAssignments(assignmentsObj);
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAssignmentMarks = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://eduminds-production-180d.up.railway.app/api/submissions/student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch assignment submissions");
      const data = await res.json();
      const map = {};
      if (Array.isArray(data.submissions)) {
        data.submissions.forEach(sub => {
          if (sub.assignment && sub.assignment._id && typeof sub.marksObtained === "number") {
            map[sub.assignment._id] = sub.marksObtained;
          }
        });
      }
      setAssignmentMarksMap(map);
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCertificates = useCallback(async () => {
    setCertLoading(true);
    setCertError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://eduminds-production-180d.up.railway.app/api/certificates/my-certificates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch certificates");
      const data = await res.json();
      setCertificates(data.certificates || []);
    } catch (err) {
      setCertError(err.message);
    } finally {
      setCertLoading(false);
    }
  }, []);

  // Fetch lessons (downloadable files)
  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // Fetch download history (admin only)
  useEffect(() => {
    fetchHistory();
  }, []);

  // Fetch all courses (for progress, etc)
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Fetch all quizzes for all courses
  useEffect(() => {
    fetchAllQuizzes();
  }, [fetchAllQuizzes]);

  // Fetch all assignments for all courses
  useEffect(() => {
    fetchAllAssignments();
  }, [fetchAllAssignments]);

  // Fetch student submissions to get marks for assignments
  useEffect(() => {
    fetchAssignmentMarks();
  }, [fetchAssignmentMarks]);

  // Fetch certificates (same logic as StudentCertificateCard)
  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  // Fetch logged-in user info for report header
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/admin/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        // ignore user fetch error
      }
    };
    fetchUser();
  }, []);

  // Enhanced download handler for lessons (video/pdf)
  const handleDownload = async (lessonId) => {
    const token = localStorage.getItem("token");
    // Find lesson object for filename/contentType
    const lesson = lessons.find((l) => l._id === lessonId);
    const displayName = lesson?.title || "download";
    const resourceType = lesson?.contentType?.toUpperCase() || "";
    const resourceUrl = lesson?.contentURL || lesson?.url || null;
    try {
      // If it's a PDF and the resourceUrl is a public Cloudinary URL, download directly
      if (
        resourceType === "PDF" &&
        resourceUrl &&
        resourceUrl.startsWith("https://res.cloudinary.com/") &&
        resourceUrl.endsWith(".pdf")
      ) {
        const a = document.createElement("a");
        a.href = resourceUrl;
        a.download = displayName + ".pdf";
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Optimistically update history table immediately
        setHistory(prev => [
          {
            _id: Date.now().toString(), // temp id
            user: user ? { name: user.name, email: user.email } : null,
            fileName: displayName + ".pdf",
            filePath: resourceUrl || lesson?.url || "",
            courseTitle: lesson?.courseTitle || "-",
            downloadedAt: new Date().toISOString(),
            ip: "-", // will be updated on backend
            userAgent: navigator.userAgent,
          },
          ...prev
        ]);
        // Optionally, you can still fetch from backend to sync with real data in the background
        fetchHistory();
        return;
      }
      // Otherwise, use backend route for download (for protected or video files)
      const response = await fetch(`https://eduminds-production-180d.up.railway.app/api/download/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
          alert(data.message || "Download failed");
          return;
        }
        if (data.url) {
          if (resourceType === "PDF") {
            window.open(data.url, "_blank", "noopener,noreferrer");
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
          } else {
            const link = document.createElement("a");
            link.href = data.url;
            link.setAttribute("download", "");
            link.rel = "noopener noreferrer";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          // Optimistically update history table immediately
          setHistory(prev => [
            {
              _id: Date.now().toString(),
              user: user ? { name: user.name, email: user.email } : null,
              fileName: resourceType === "PDF" ? displayName + ".pdf" : resourceType === "VIDEO" ? displayName + ".mp4" : displayName,
              filePath: resourceUrl || lesson?.url || "",
              courseTitle: lesson?.courseTitle || "-",
              downloadedAt: new Date().toISOString(),
              ip: "-",
              userAgent: navigator.userAgent,
            },
            ...prev
          ]);
          fetchHistory();
          return;
        }
        alert("Download failed");
        return;
      }
      if (!response.ok) {
        alert("Download failed");
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

      // Optimistically update history table immediately
      setHistory(prev => [
        {
          _id: Date.now().toString(), // temp id
          user: user ? { name: user.name, email: user.email } : null,
          fileName: filename,
          filePath: resourceUrl || lesson?.url || "",
          courseTitle: lesson?.courseTitle || "-",
          downloadedAt: new Date().toISOString(),
          ip: "-", // will be updated on backend
          userAgent: navigator.userAgent,
        },
        ...prev
      ]);
      // Optionally, you can still fetch from backend to sync with real data in the background
      fetchHistory();

      // Refresh history after download (let backend handle recording)
      fetchHistory();
    } catch (err) {
      alert("Download failed");
    }
  };

  // --- Download student report as CSV ---
  const handleDownloadCSV = () => {
    // If single course mode, only export that course
    const exportCourses = selectedCourseId
      ? courses.filter((c) => String(c.courseId) === String(selectedCourseId))
      : courses;
    if (!exportCourses.length) return;
    const csvRows = [];
    // Add organization, user, and date info
    const today = new Date().toISOString().slice(0, 10);
    csvRows.push(`Organization:,EduMinds`);
    csvRows.push(`Generated By:,${user?.name || ""}`);
    csvRows.push(`Date:,${today}`);
    csvRows.push(""); // empty line
    csvRows.push([
      'Course Name', 'Organization', 'Date Earned', 'Certificate ID', 'Progress (%)', 'Quiz Score', 'Assignment Marks', 'Completed', 'Certificate Issued'
    ].join(','));
    exportCourses.forEach(course => {
      const cert = certificates.find(c => String(c.courseId) === String(course.courseId));
      const quizzesForCourse = allQuizzes.filter(q => String(q.courseId) === String(course.courseId));
      const assignmentsForCourse = Array.isArray(allAssignments[course.courseId]) ? allAssignments[course.courseId] : [];
      let quizScore = "";
      if (quizzesForCourse.length > 0) {
        const scores = quizzesForCourse.map(q => typeof q.score === "number" ? q.score : null).filter(s => s !== null);
        if (scores.length > 0) {
          quizScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
        }
      }
      let assignmentMarks = "";
      if (assignmentsForCourse.length > 0) {
        const marks = assignmentsForCourse.map(a =>
          typeof assignmentMarksMap[a._id] === "number"
            ? assignmentMarksMap[a._id]
            : typeof a.marksObtained === "number"
            ? a.marksObtained
            : typeof a.marks === "number"
            ? a.marks
            : typeof a.score === "number"
            ? a.score
            : null
        ).filter(m => m !== null);
        if (marks.length > 0) {
          assignmentMarks = marks.reduce((a, b) => a + b, 0);
        } else {
          assignmentMarks = "-";
        }
      } else {
        assignmentMarks = "-";
      }
      let progress = "";
      if (typeof course.progress === "number") {
        progress = Math.round(course.progress) + "%";
      }
      let dateEarnedStr = "";
      if (cert && cert.dateEarned) {
        const dateObj = new Date(cert.dateEarned);
        if (!isNaN(dateObj)) {
          dateEarnedStr = dateObj.toLocaleDateString();
        }
      }
      csvRows.push([
        '"' + (course.title || '') + '"',
        '"' + (cert?.organization || '') + '"',
        dateEarnedStr,
        cert?.certificateId || '',
        progress,
        quizScore,
        assignmentMarks,
        course.completed ? 'Yes' : 'No',
        cert?.certificateId ? 'Yes' : 'No'
      ].join(','));
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_report_${selectedCourseId ? selectedCourseId + '_' : ''}${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- Download student report as PDF ---
  const handleDownloadPDF = async () => {
    // If single course mode, only export that course
    const exportCourses = selectedCourseId
      ? courses.filter((c) => String(c.courseId) === String(selectedCourseId))
      : courses;
    if (!exportCourses.length) return;
    const jsPDF = (await import('jspdf')).default;
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDF();
    const today = new Date().toISOString().slice(0, 10);
    // Add EduMinds heading at top left
    doc.setFontSize(18);
    doc.text('EduMinds', 14, 18);
    // Add logo at top right, same row as heading
    const logoImg = new window.Image();
    logoImg.src = '/assets/logo.png';
    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.onerror = resolve;
    });
    if (logoImg.complete && logoImg.naturalWidth > 0) {
      // Top right, same row as heading, width 40
      doc.addImage(logoImg, 'PNG', doc.internal.pageSize.getWidth() - 54, 6, 40, 20);
      // Date below logo, right aligned
      doc.setFontSize(10);
      doc.text(`Date: ${today}`, doc.internal.pageSize.getWidth() - 34, 30, { align: 'center' });
    } else {
      // If logo not loaded, still print date at right
      doc.setFontSize(10);
      doc.text(`Date: ${today}`, doc.internal.pageSize.getWidth() - 34, 30, { align: 'center' });
    }
    // Organization and user info below heading
    doc.setFontSize(10);
    doc.text(`Generated By: ${user?.name || ""}`, 14, 28);
    doc.setFontSize(12);
    doc.text('Student Courses & Certificates Report', 14, 38);
    const tableColumn = [
      'Course Name', 'Organization', 'Date Earned', 'Certificate ID', 'Progress (%)', 'Quiz Score', 'Assignment Marks', 'Completed', 'Certificate Issued'
    ];
    const tableRows = exportCourses.map(course => {
      const cert = certificates.find(c => String(c.courseId) === String(course.courseId));
      const quizzesForCourse = allQuizzes.filter(q => String(q.courseId) === String(course.courseId));
      const assignmentsForCourse = Array.isArray(allAssignments[course.courseId]) ? allAssignments[course.courseId] : [];
      let quizScore = "";
      if (quizzesForCourse.length > 0) {
        const scores = quizzesForCourse.map(q => typeof q.score === "number" ? q.score : null).filter(s => s !== null);
        if (scores.length > 0) {
          quizScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
        }
      }
      let assignmentMarks = "";
      if (assignmentsForCourse.length > 0) {
        const marks = assignmentsForCourse.map(a =>
          typeof assignmentMarksMap[a._id] === "number"
            ? assignmentMarksMap[a._id]
            : typeof a.marksObtained === "number"
            ? a.marksObtained
            : typeof a.marks === "number"
            ? a.marks
            : typeof a.score === "number"
            ? a.score
            : null
        ).filter(m => m !== null);
        if (marks.length > 0) {
          assignmentMarks = marks.reduce((a, b) => a + b, 0);
        } else {
          assignmentMarks = "-";
        }
      } else {
        assignmentMarks = "-";
      }
      let progress = "";
      let isCompleted = false;
      if (typeof course.progress === "number") {
        progress = Math.round(course.progress) + "%";
        isCompleted = Math.round(course.progress) === 100;
      } else if (course.completed) {
        isCompleted = true;
      }
      let dateEarnedStr = "";
      if (cert && cert.dateEarned) {
        const dateObj = new Date(cert.dateEarned);
        if (!isNaN(dateObj)) {
          dateEarnedStr = dateObj.toLocaleDateString();
        }
      }
      return [
        course.title || '',
        cert?.organization || '',
        dateEarnedStr,
        cert?.certificateId || '',
        progress,
        quizScore,
        assignmentMarks,
        isCompleted ? 'Yes' : 'No',
        cert?.certificateId ? 'Yes' : 'No'
      ];
    });
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 44,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    doc.save(`student_report_${selectedCourseId ? selectedCourseId + '_' : ''}${today}.pdf`);
  };

  // Derived filtered courses for table
  const getFilteredCourses = () => {
    if (selectedCourseId) {
      return courses.filter((c) => String(c.courseId) === String(selectedCourseId));
    }
    return courses;
  };

  const filteredCourses = getFilteredCourses();

  // Add a refresh handler to reload all data
  const handleRefresh = () => {
    setLoading(true);
    fetchLessons();
    fetchCourses();
    fetchAllQuizzes();
    fetchAllAssignments();
    fetchAssignmentMarks();
    fetchCertificates();
    fetchHistory();
    setTimeout(() => setLoading(false), 500); // quick loading state
  };

  // Optionally, auto-refresh when tab regains focus
  useEffect(() => {
    const onFocus = () => handleRefresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // Download certificate with auth token
  const handleDownloadCertificate = async (courseId, courseName) => {
    try {
      const token = localStorage.getItem("token"); // always get fresh token
      const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/certificates/certificate/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        // Try to parse error message from backend
        let errorMsg = "Failed to download certificate";
        try {
          const errData = await res.json();
          if (errData && errData.message) errorMsg = errData.message;
        } catch {}
        throw new Error(errorMsg);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Certificate-${courseName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // --- Add certificate download to history ---
      try {
        await fetch("https://eduminds-production-180d.up.railway.app/api/download/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: `Certificate-${courseName}.pdf`,
            filePath: `/certificates/${courseId}`,
            courseTitle: courseName,
            type: "certificate",
          }),
        });
        fetchHistory(); // Refresh history after download
      } catch (historyErr) {
        // Optionally ignore or log
      }
    } catch (err) {
      alert(err.message || "Failed to download certificate");
    }
  };

  useEffect(() => {
    const onLessonDownloaded = () => {
      fetchHistory();
    };
    window.addEventListener("lesson-downloaded", onLessonDownloaded);
    return () => window.removeEventListener("lesson-downloaded", onLessonDownloaded);
  }, []);

  // Loading spinner for the whole page
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Searchbar/>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">
            Download Center
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Access your course resources and track your download activity.
          </p>
        </div>
        <img
          src="/assets/logo.png"
          alt="Download"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      {error && (
        <div className="text-red-500 mb-4 font-semibold">{error}</div>
      )}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-blue-700 mb-4">
          Downloadable Lessons
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-3 text-left font-semibold text-gray-700">
                  Title
                </th>
                <th className="p-3 text-left font-semibold text-gray-700">
                  Type
                </th>
                <th className="p-3 text-left font-semibold text-gray-700">
                  Course
                </th>
                <th className="p-3 text-left font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filteredLessons = lessons.filter((l) => ["video", "pdf"].includes(l.contentType));
                const visibleLessons = showAllLessons ? filteredLessons : filteredLessons.slice(0, 2);
                if (filteredLessons.length === 0) {
                  return (
                    <tr>
                      <td colSpan={4} className="p-3 text-center text-gray-500">
                        No downloadable lessons found.
                      </td>
                    </tr>
                  );
                }
                return visibleLessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-blue-50 transition">
                    <td className="p-3 font-medium text-gray-900">{lesson.title}</td>
                    <td className="p-3 capitalize text-gray-700">{lesson.contentType}</td>
                    <td className="p-3 text-gray-700">{lesson.courseTitle || "-"}</td>
                    <td className="p-3">
                      <button
                        className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        onClick={() => handleDownload(lesson._id)}
                      >
                        <span className="inline-block align-middle mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 inline"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                            />
                          </svg>
                        </span>
                        Download
                      </button>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
          {/* Expand/Collapse Button for lessons */}
          {lessons.filter((l) => ["video", "pdf"].includes(l.contentType)).length > 2 && (
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                onClick={() => setShowAllLessons((prev) => !prev)}
              >
                {showAllLessons
                  ? "Show Less"
                  : `Show All (${lessons.filter((l) => ["video", "pdf"].includes(l.contentType)).length})`}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-blue-700 mb-4">
          Download History
          <span className="text-sm text-gray-400 font-normal">
            {history.length > 0 && history[0].user && history[0].user.email && history[0].user.email === "admin@example.com"
              ? " (All Users' History - Admin View)"
              : " (Your History)"}
          </span>
        </h2>
        {loading ? (
          <div className="text-gray-500">Loading history...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-3 text-left font-semibold text-gray-700">
                    User
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    File Name
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Course
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Path
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    IP
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    User Agent
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-3 text-center text-gray-500"
                    >
                      No history found.
                    </td>
                  </tr>
                ) : (
                  // Always show only first 2 unless expanded, for both admin and student
                  (showAllHistory ? history : history.slice(0, 2)).map((h) => (
                    <tr
                      key={h._id}
                      className="hover:bg-blue-50 transition"
                    >
                      <td className="p-3">
                        {h.user ? (
                          <span className="font-semibold text-blue-700">
                            {h.user.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">Guest</span>
                        )}
                        <br />
                        <span className="text-xs text-gray-500">
                          {h.user?.email}
                        </span>
                      </td>
                      <td className="p-3">{h.fileName}</td>
                      <td className="p-3 text-gray-700">
                        {typeof h.courseTitle === "string" && h.courseTitle.trim() && h.courseTitle !== "-"
                          ? h.courseTitle
                          : (typeof h.filePath === "string"
                              ? (() => {
                                  const match = h.filePath.match(/courses\/([^\/]+)/);
                                  return match && match[1] ? decodeURIComponent(match[1]) : "-";
                                })()
                              : "-")}
                      </td>
                      <td className="p-3 text-xs text-gray-600">{h.filePath}</td>
                      <td className="p-3 text-xs">{new Date(h.downloadedAt).toLocaleString()}</td>
                      <td className="p-3 text-xs">{h.ip}</td>
                      <td className="p-3 text-xs truncate max-w-xs" title={h.userAgent}>
                        {h.userAgent}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Expand/Collapse Button for all users */}
            {history.length > 2 && (
              <div className="flex justify-center mt-4">
                <button
                  className="px-4 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                  onClick={() => setShowAllHistory((prev) => !prev)}
                >
                  {showAllHistory ? "Show Less" : `Show All (${history.length})`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Student Certificate Report Table */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-700">
            Student Certificates & Course Report
            {selectedCourseId && (
              <span className="ml-2 text-lg text-green-700 font-normal">
                (Single Course)
              </span>
            )}
          </h2>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded border bg-green-600 text-white"
              onClick={handleDownloadCSV}
              disabled={certLoading || !filteredCourses.length}
            >
              Download CSV
            </button>
            <button
              className="px-3 py-1 rounded border bg-red-600 text-white"
              onClick={handleDownloadPDF}
              disabled={certLoading || !filteredCourses.length}
            >
              Download PDF
            </button>
            {selectedCourseId && (
              <button
                className="px-3 py-1 rounded border bg-blue-600 text-white"
                onClick={() => setSelectedCourseId(null)}
              >
                &larr; Back to All Courses
              </button>
            )}
          </div>
        </div>
        {certLoading ? (
          <div className="text-gray-500">Loading certificates...</div>
        ) : certError ? (
          <div className="text-red-500">{certError}</div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-gray-500">You have not enrolled in any courses yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-3 text-left font-semibold text-gray-700">Course Name</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Organization</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Date Earned</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Certificate ID</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Progress (%)</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Quiz Score</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Assignment Marks</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Completed</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Certificate Issued</th>
                  {/* Add View Report column header */}
                  {!selectedCourseId && (
                    <th className="p-3 text-left font-semibold text-gray-700">Report</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {/* Only show first 2 if not expanded, else show all */}
                {(showAllCerts ? filteredCourses : filteredCourses.slice(0, 2)).map(course => {
                  const cert = certificates.find(c => String(c.courseId) === String(course.courseId));
                  const quizzesForCourse = allQuizzes.filter(q => String(q.courseId) === String(course.courseId));
                  const assignmentsForCourse = Array.isArray(allAssignments[course.courseId]) ? allAssignments[course.courseId] : [];
                  // Calculate average quiz score (or blank if none)
                  let quizScore = "";
                  if (quizzesForCourse.length > 0) {
                    const scores = quizzesForCourse.map(q => typeof q.score === "number" ? q.score : null).filter(s => s !== null);
                    if (scores.length > 0) {
                      quizScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
                    }
                  }
                  // Calculate total assignment marks (or blank if none)
                  let assignmentMarks = "";
                  if (assignmentsForCourse.length > 0) {
                    const marks = assignmentsForCourse.map(a =>
                      typeof assignmentMarksMap[a._id] === "number"
                        ? assignmentMarksMap[a._id]
                        : typeof a.marksObtained === "number"
                        ? a.marksObtained
                        : typeof a.marks === "number"
                        ? a.marks
                        : typeof a.score === "number"
                        ? a.score
                        : null
                    ).filter(m => m !== null);
                    if (marks.length > 0) {
                      assignmentMarks = marks.reduce((a, b) => a + b, 0);
                    } else {
                      assignmentMarks = "-";
                    }
                  } else {
                    assignmentMarks = "-";
                  }
                  // Progress
                  let progress = "";
                  let isCompleted = false;
                  if (typeof course.progress === "number") {
                    progress = Math.round(course.progress) + "%";
                    isCompleted = Math.round(course.progress) === 100;
                  } else if (course.completed) {
                    isCompleted = true;
                  }
                  // Date Earned
                  let dateEarnedStr = "";
                  if (cert && cert.dateEarned) {
                    const dateObj = new Date(cert.dateEarned);
                    if (!isNaN(dateObj)) {
                      dateEarnedStr = dateObj.toLocaleDateString();
                    }
                  }
                  return (
                    <tr key={course.courseId}>
                      <td className="p-3">{course.title || ''}</td>
                      <td className="p-3">{cert?.organization || ''}</td>
                      <td className="p-3">{dateEarnedStr}</td>
                      <td className="p-3">{cert?.certificateId || ''}</td>
                      <td className="p-3">{progress}</td>
                      <td className="p-3">{quizScore}</td>
                      <td className="p-3">{assignmentMarks}</td>
                      <td className="p-3">{isCompleted ? 'Yes' : 'No'}</td>
                      <td className="p-3">{cert?.certificateId ? 'Yes' : 'No'}</td>
                      {/* Add View Report button after Certificate Issued column */}
                      {!selectedCourseId && (
                        <td className="p-3">
                          <button
                            className="px-2 py-1 rounded bg-blue-500 text-white text-xs"
                            onClick={() => setSelectedCourseId(course.courseId)}
                          >
                            View Report
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Expand/Collapse Button for certificates */}
            {filteredCourses.length > 2 && (
              <div className="flex justify-center mt-4">
                <button
                  className="px-4 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                  onClick={() => setShowAllCerts((prev) => !prev)}
                >
                  {showAllCerts
                    ? "Show Less"
                    : `Show All (${filteredCourses.length})`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
