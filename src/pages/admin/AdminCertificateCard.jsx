import React, { useEffect, useState } from "react";

export default function AdminCertificateCard() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [revokedCertificates, setRevokedCertificates] = useState([]);
  const [revokedLoading, setRevokedLoading] = useState(true);
  const [revokedError, setRevokedError] = useState("");
  const [history, setHistory] = useState({}); // enrollmentId -> history array
  const [historyLoading, setHistoryLoading] = useState(""); // enrollmentId
  const [showHistory, setShowHistory] = useState(""); // enrollmentId
  const [studentSearch, setStudentSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [revokedReissuedCertificates, setRevokedReissuedCertificates] = useState([]);
  const [revokedReissuedLoading, setRevokedReissuedLoading] = useState(true);
  const [revokedReissuedError, setRevokedReissuedError] = useState("");

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/admin/certificates/issued-certificates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          // Defensive: filter out certificates with missing student or course info to avoid null errors
          const safeCertificates = (data.issuedCertificates || []).map(cert => ({
            ...cert,
            studentName: cert.studentName || cert.student?.name || "Unknown Student",
            studentEmail: cert.studentEmail || cert.student?.email || "-",
            courseTitle: cert.courseTitle || cert.course?.title || "Unknown Course",
            dateCompleted: cert.dateCompleted || cert.completedAt || cert.updatedAt || cert.createdAt || null,
            enrollmentId: cert.enrollmentId || cert._id || null
          }));
          setCertificates(safeCertificates);
          
        } else {
          setError(data.message || "Failed to fetch certificates.");
        }
      } catch (err) {
        setError("Error fetching certificates.");
      }
      setLoading(false);
    };
    fetchCertificates();
  }, [refresh]);

  useEffect(() => {
    const fetchRevoked = async () => {
      setRevokedLoading(true);
      setRevokedError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/admin/certificates/revoked-certificates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setRevokedCertificates(data || []);
        } else {
          setRevokedError(data.message || "Failed to fetch revoked certificates.");
        }
      } catch (err) {
        setRevokedError("Error fetching revoked certificates.");
      }
      setRevokedLoading(false);
    };
    fetchRevoked();
  }, [refresh]);

  useEffect(() => {
    const fetchRevokedReissued = async () => {
      setRevokedReissuedLoading(true);
      setRevokedReissuedError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/admin/certificates/revoked-reissued-certificates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setRevokedReissuedCertificates(data || []);
        } else {
          setRevokedReissuedError(data.message || "Failed to fetch revoked & reissued certificates.");
        }
      } catch (err) {
        setRevokedReissuedError("Error fetching revoked & reissued certificates.");
      }
      setRevokedReissuedLoading(false);
    };
    fetchRevokedReissued();
  }, [refresh]);

  // Revoke certificate
  const handleRevoke = async (enrollmentId) => {
    if (!window.confirm("Revoke this certificate?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/admin/certificates/revoke-certificate/${enrollmentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Certificate revoked successfully!");
        setRefresh((r) => !r);
      } else {
        alert(data.message || "Failed to revoke certificate.");
      }
    } catch (err) {
      alert("Error revoking certificate.");
    }
  };

  // View reissue history
  const handleViewHistory = async (enrollmentId) => {
    alert("Implement view reissue history modal or page. EnrollmentId: " + enrollmentId);
  };

  // Re-issue certificate
  const handleReissue = async (enrollmentId) => {
    if (!window.confirm("Re-issue this certificate?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/admin/certificates/reissue-certificate/${enrollmentId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Certificate re-issued successfully!");
        setRefresh((r) => !r);
      } else {
        alert(data.message || "Failed to re-issue certificate.");
      }
    } catch (err) {
      alert("Error re-issuing certificate.");
    }
  };

  // Fetch reissue history for a revoked certificate
  const handleViewReissueHistory = async (enrollmentId) => {
    if (showHistory === enrollmentId) {
      setShowHistory("");
      return;
    }
    setHistoryLoading(enrollmentId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/admin/certificates/certificate-reissue-history/${enrollmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) {
        setHistory((prev) => ({ ...prev, [enrollmentId]: data.history || [] }));
        setShowHistory(enrollmentId);
      } else {
        alert(data.message || "Failed to fetch reissue history.");
      }
    } catch (err) {
      alert("Error fetching reissue history.");
    }
    setHistoryLoading("");
  };

  // Filtered issued certificates
  const filteredCertificates = certificates.filter(cert => {
    const studentMatch = cert.studentName?.toLowerCase().includes(studentSearch.toLowerCase());
    const courseMatch = cert.courseTitle?.toLowerCase().includes(courseSearch.toLowerCase());
    return (!studentSearch || studentMatch) && (!courseSearch || courseMatch);
  });

  // Filtered revoked certificates
  const filteredRevokedCertificates = revokedCertificates.filter(cert => {
    const studentMatch = cert.student?.name?.toLowerCase().includes(studentSearch.toLowerCase());
    const courseMatch = cert.course?.title?.toLowerCase().includes(courseSearch.toLowerCase());
    return (!studentSearch || studentMatch) && (!courseSearch || courseMatch);
  });

  // Filtered revoked & reissued certificates
  const filteredRevokedReissuedCertificates = revokedReissuedCertificates.filter(cert => {
    const studentMatch = cert.student?.name?.toLowerCase().includes(studentSearch.toLowerCase());
    const courseMatch = cert.course?.title?.toLowerCase().includes(courseSearch.toLowerCase());
    return (!studentSearch || studentMatch) && (!courseSearch || courseMatch);
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
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
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">Issued Certificates</h2>
              <p className="text-gray-600 text-base md:text-lg">
                Manage, revoke, and re-issue certificates for all students and courses.
              </p>
            </div>
            <img
              src="/assets/logo.png"
              alt="Certificates"
              className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
            />
          </div>
          {/* Search/Filter UI */}
          <div className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
            <input
              type="text"
              className="border px-3 py-2 rounded w-full sm:w-60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Search by student name"
              value={studentSearch}
              onChange={e => setStudentSearch(e.target.value)}
            />
            <input
              type="text"
              className="border px-3 py-2 rounded w-full sm:w-60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Search by course title"
              value={courseSearch}
              onChange={e => setCourseSearch(e.target.value)}
            />
          </div>
          {loading && <p>Loading certificates...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && filteredCertificates.length === 0 && !error && (
            <p>No certificates issued yet.</p>
          )}

          {/* Responsive Table/Card for Issued Certificates */}
          <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-lg bg-white">
            <table className="hidden md:table min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Student Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Student Email</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Course</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Date Completed</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Enrollment ID</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map((cert, idx) => (
                  <tr key={idx} className="bg-white even:bg-gray-50 hover:bg-blue-50 transition">
                    <td className="px-4 py-2 font-semibold">{cert.studentName}</td>
                    <td className="px-4 py-2">{cert.studentEmail}</td>
                    <td className="px-4 py-2">{cert.courseTitle}</td>
                    <td className="px-4 py-2">{cert.dateCompleted ? new Date(cert.dateCompleted).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-2">{cert.enrollmentId || "-"}</td>
                    <td className="px-4 py-2 flex gap-2 flex-wrap">
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                        onClick={() => handleRevoke(cert.enrollmentId)}
                        disabled={!cert.enrollmentId}
                      >
                        Revoke
                      </button>
                      <button
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                        onClick={() => handleViewHistory(cert.enrollmentId)}
                        disabled={!cert.enrollmentId}
                      >
                        View History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Mobile Card Layout */}
            <div className="md:hidden flex flex-col gap-4 p-2">
              {filteredCertificates.map((cert, idx) => (
                <div key={idx} className="bg-white border rounded-lg shadow-sm p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-base">{cert.studentName}</span>
                    <span className="text-xs text-gray-500">{cert.courseTitle}</span>
                  </div>
                  <div className="text-xs text-gray-600">{cert.studentEmail}</div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                    <span>Date: {cert.dateCompleted ? new Date(cert.dateCompleted).toLocaleDateString() : "-"}</span>
                    <span>ID: {cert.enrollmentId || "-"}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs w-full focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                      onClick={() => handleRevoke(cert.enrollmentId)}
                      disabled={!cert.enrollmentId}
                    >
                      Revoke
                    </button>
                    <button
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 text-xs w-full focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                      onClick={() => handleViewHistory(cert.enrollmentId)}
                      disabled={!cert.enrollmentId}
                    >
                      View History
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revoked Certificates Section */}
          <h2 className="mt-12 mb-6 text-3xl md:text-4xl font-extrabold text-blue-800">Revoked Certificates</h2>
          {revokedLoading && <p>Loading revoked certificates...</p>}
          {revokedError && <p className="text-red-600">{revokedError}</p>}
          {!revokedLoading && filteredRevokedCertificates.length === 0 && !revokedError && (
            <p>No revoked certificates found.</p>
          )}
          <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-lg bg-white">
            <table className="hidden md:table min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Student Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Student Email</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Course</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Date Revoked</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Enrollment ID</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRevokedCertificates.map((cert, idx) => (
                  <React.Fragment key={cert._id}>
                    <tr className="bg-white even:bg-gray-50 hover:bg-blue-50 transition">
                      <td className="px-4 py-2 font-semibold">{cert.student?.name}</td>
                      <td className="px-4 py-2">{cert.student?.email}</td>
                      <td className="px-4 py-2">{cert.course?.title}</td>
                      <td className="px-4 py-2">{cert.updatedAt ? new Date(cert.updatedAt).toLocaleDateString() : "-"}</td>
                      <td className="px-4 py-2">{cert._id}</td>
                      <td className="px-4 py-2 flex gap-2 flex-wrap">
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                          onClick={() => handleReissue(cert._id)}
                        >
                          Re-Issue
                        </button>
                        <button
                          className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                          onClick={() => handleViewReissueHistory(cert._id)}
                        >
                          {historyLoading === cert._id ? "Loading..." : showHistory === cert._id ? "Hide History" : "View Reissue History"}
                        </button>
                      </td>
                    </tr>
                    {showHistory === cert._id && (
                      <tr>
                        <td colSpan={6} className="bg-gray-50 px-4 py-2">
                          <strong>Reissue History:</strong>
                          {history[cert._id] && history[cert._id].length > 0 ? (
                            <ul className="list-disc ml-6">
                              {history[cert._id].map((item, i) => (
                                <li key={i}>
                                  {item.reissuedAt ? new Date(item.reissuedAt).toLocaleString() : "-"} by {item.adminId?.name || "Unknown Admin"} ({item.adminId?.email || "-"})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="ml-2">No reissue history found.</span>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            {/* Mobile Card Layout */}
            <div className="md:hidden flex flex-col gap-4 p-2">
              {filteredRevokedCertificates.map((cert, idx) => (
                <div key={cert._id} className="bg-white border rounded-lg shadow-sm p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-base">{cert.student?.name}</span>
                    <span className="text-xs text-gray-500">{cert.course?.title}</span>
                  </div>
                  <div className="text-xs text-gray-600">{cert.student?.email}</div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                    <span>Revoked: {cert.updatedAt ? new Date(cert.updatedAt).toLocaleDateString() : "-"}</span>
                    <span>ID: {cert._id}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs w-full focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                      onClick={() => handleReissue(cert._id)}
                    >
                      Re-Issue
                    </button>
                    <button
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-xs w-full focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                      onClick={() => handleViewReissueHistory(cert._id)}
                    >
                      {historyLoading === cert._id ? "Loading..." : showHistory === cert._id ? "Hide History" : "View Reissue History"}
                    </button>
                  </div>
                  {showHistory === cert._id && (
                    <div className="bg-gray-50 px-2 py-2 rounded mt-2 text-xs">
                      <strong>Reissue History:</strong>
                      {history[cert._id] && history[cert._id].length > 0 ? (
                        <ul className="list-disc ml-6">
                          {history[cert._id].map((item, i) => (
                            <li key={i}>
                              {item.reissuedAt ? new Date(item.reissuedAt).toLocaleString() : "-"} by {item.adminId?.name || "Unknown Admin"} ({item.adminId?.email || "-"})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="ml-2">No reissue history found.</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Revoked & Reissued Certificates Section */}
          <h2 className="mt-12 mb-6 text-3xl md:text-4xl font-extrabold text-blue-800">Revoked & Reissued Certificates</h2>
          {revokedReissuedLoading && <p>Loading revoked & reissued certificates...</p>}
          {revokedReissuedError && <p className="text-red-600">{revokedReissuedError}</p>}
          {!revokedReissuedLoading && revokedReissuedCertificates.length === 0 && !revokedReissuedError && (
            <p>No revoked & reissued certificates found.</p>
          )}
          <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-lg bg-white">
            <table className="hidden md:table min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Student Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Student Email</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Course</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Last Reissued At</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Enrollment ID</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRevokedReissuedCertificates.map((cert) => (
                  <React.Fragment key={cert._id}>
                    <tr className="bg-white even:bg-gray-50 hover:bg-blue-50 transition">
                      <td className="px-4 py-2 font-semibold">{cert.student?.name}</td>
                      <td className="px-4 py-2">{cert.student?.email}</td>
                      <td className="px-4 py-2">{cert.course?.title}</td>
                      <td className="px-4 py-2">{cert.lastReissuedAt ? new Date(cert.lastReissuedAt).toLocaleString() : "-"}</td>
                      <td className="px-4 py-2">{cert._id}</td>
                      <td className="px-4 py-2 flex gap-2 flex-wrap">
                        <button
                          className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                          onClick={() => handleViewReissueHistory(cert._id)}
                        >
                          {historyLoading === cert._id ? "Loading..." : showHistory === cert._id ? "Hide History" : "View Reissue History"}
                        </button>
                      </td>
                    </tr>
                    {showHistory === cert._id && (
                      <tr>
                        <td colSpan={6} className="bg-gray-50 px-4 py-2">
                          <strong>Reissue History:</strong>
                          {history[cert._id] && history[cert._id].length > 0 ? (
                            <ul className="list-disc ml-6">
                              {history[cert._id].map((item, i) => (
                                <li key={i}>
                                  {item.reissuedAt ? new Date(item.reissuedAt).toLocaleString() : "-"} by {item.adminId?.name || "Unknown Admin"} ({item.adminId?.email || "-"})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="ml-2">No reissue history found.</span>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            {/* Mobile Card Layout */}
            <div className="md:hidden flex flex-col gap-4 p-2">
              {filteredRevokedReissuedCertificates.map((cert) => (
                <div key={cert._id} className="bg-white border rounded-lg shadow-sm p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-base">{cert.student?.name}</span>
                    <span className="text-xs text-gray-500">{cert.course?.title}</span>
                  </div>
                  <div className="text-xs text-gray-600">{cert.student?.email}</div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                    <span>Last Reissued: {cert.lastReissuedAt ? new Date(cert.lastReissuedAt).toLocaleString() : "-"}</span>
                    <span>ID: {cert._id}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-xs w-full focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                      onClick={() => handleViewReissueHistory(cert._id)}
                    >
                      {historyLoading === cert._id ? "Loading..." : showHistory === cert._id ? "Hide History" : "View Reissue History"}
                    </button>
                  </div>
                  {showHistory === cert._id && (
                    <div className="bg-gray-50 px-2 py-2 rounded mt-2 text-xs">
                      <strong>Reissue History:</strong>
                      {history[cert._id] && history[cert._id].length > 0 ? (
                        <ul className="list-disc ml-6">
                          {history[cert._id].map((item, i) => (
                            <li key={i}>
                              {item.reissuedAt ? new Date(item.reissuedAt).toLocaleString() : "-"} by {item.adminId?.name || "Unknown Admin"} ({item.adminId?.email || "-"})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="ml-2">No reissue history found.</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
