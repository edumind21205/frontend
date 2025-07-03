import React, { useEffect, useState } from "react";

export default function StudentCertificateCard() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token"); // always get fresh token
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/certificates/my-certificates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch certificates");
        const data = await res.json();
        setCertificates(data.certificates || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  // Download certificate with auth token
  const handleDownload = async (courseId, courseName) => {
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
    } catch (err) {
      alert(err.message || "Failed to download certificate");
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
  if (!certificates.length)
    return <div className="p-4">You have not earned any certificates yet.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">My Certificates</h2>
          <p className="text-gray-600 text-base md:text-lg">
            Download your earned certificates for completed courses.
          </p>
        </div>
        <img
          src="/assets/logo.png"
          alt="Certificate"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.certificateId}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border border-gray-100 hover:shadow-2xl transition-shadow duration-200"
          >
            <div>
              <h2 className="text-xl font-bold text-blue-700 mb-2">{cert.courseName}</h2>
              <div className="text-gray-600 mb-1">Issued by: <span className="font-semibold">{cert.organization}</span></div>
              <div className="text-gray-500 text-sm mb-2">
                Date Earned: {
                  (() => {
                    // Debug log to see what values are present
                    // console.log("Certificate dateEarned:", cert.dateEarned, "createdAt:", cert.createdAt, "certificateId:", cert.certificateId);
                    let dateVal = cert.dateEarned || cert.createdAt;
                    // Try to parse ObjectId timestamp if no date fields
                    if (!dateVal && cert.certificateId && typeof cert.certificateId === "string" && cert.certificateId.length === 24) {
                      // Parse MongoDB ObjectId timestamp
                      const timestamp = parseInt(cert.certificateId.substring(0, 8), 16) * 1000;
                      dateVal = new Date(timestamp);
                    }
                    if (dateVal) {
                      const dateObj = new Date(dateVal);
                      return !isNaN(dateObj) ? dateObj.toLocaleDateString() : String(dateVal);
                    }
                    return '';
                  })()
                }
              </div>
              <div className="text-xs text-gray-400 mb-2">Certificate ID: {cert.certificateId}</div>
            </div>
            <button
              onClick={() => handleDownload(cert.courseId, cert.courseName)}
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center text-sm font-medium"
            >
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
