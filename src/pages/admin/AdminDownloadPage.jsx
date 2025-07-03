import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DownloadPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false); // <-- Add this line

  // Fetch user role from backend (now uses /api/admin/user/me)
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://eduminds-production-180d.up.railway.app/api/admin/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(res.data?.role === "admin");
      } catch (err) {
        setIsAdmin(false);
      }
    };
    fetchUserRole();
  }, []);

  // Fetch download history (admin only)
  useEffect(() => {
    const fetchHistory = async () => {
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
    fetchHistory();
  }, []);

  const handleDownload = async (lessonId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://eduminds-production-180d.up.railway.app/api/progress/download-lesson/${lessonId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      const blob = await response.blob();
      // Try to get filename from Content-Disposition header
      const disposition = response.headers.get("Content-Disposition");
      let filename = "download";
      if (disposition && disposition.indexOf("filename=") !== -1) {
        filename = disposition.split("filename=")[1].replace(/['"]/g, "");
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Access denied or download failed.");
    }
  };

  // PDF download logic for Download History
  const handleDownloadPDF = async () => {
    if (!history.length) return;
    const doc = new jsPDF({ orientation: "landscape" });
    // Add logo image (assets/logo.png)
    const getBase64Logo = (url) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = url;
      });
    };
    const logoUrl = '/assets/logo2.png';
    try {
      const logoBase64 = await getBase64Logo(logoUrl);
      doc.addImage(logoBase64, 'PNG', 250, 4, 40, 18); // x, y, width, height (adjust for landscape)
    } catch (e) {
      // Logo failed to load, continue without it
    }
    doc.setFontSize(14);
    doc.text("EduMinds - Download History Report", 14, 14);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
    const tableColumn = [
      "User",
      "Email",
      "File Name",
      "Course",
      "Path",
      "Date",
      "IP",
      "User Agent"
    ];
    // Truncate long fields for better fit
    const truncate = (str, n = 40) => str && str.length > n ? str.slice(0, n) + "..." : str;
    const tableRows = history.map((h) => [
      h.user?.name || "Guest",
      h.user?.email || "-",
      h.fileName || "-",
      h.lesson?.course?.title || h.courseTitle || h.course?.title || h.lesson?.courseTitle || "-",
      truncate(h.filePath || "-", 50),
      h.downloadedAt ? new Date(h.downloadedAt).toLocaleString() : "-",
      h.ip || "-",
      truncate(h.userAgent || "-", 40)
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 7, cellWidth: 'wrap' },
      headStyles: { fillColor: [59, 130, 246] },
      columnStyles: {
        0: { cellWidth: 22 }, // User
        1: { cellWidth: 38 }, // Email
        2: { cellWidth: 28 }, // File Name
        3: { cellWidth: 32 }, // Course
        4: { cellWidth: 60 }, // Path
        5: { cellWidth: 32 }, // Date
        6: { cellWidth: 22 }, // IP
        7: { cellWidth: 50 }, // User Agent
      }
    });
    doc.save('download_history_' + new Date().toISOString().slice(0,10) + '.pdf');
  };

  // CSV download logic for Download History
  const handleDownloadCSV = () => {
    if (!history.length) return;
    const csvRows = [];
    csvRows.push('User,Email,File Name,Course,Path,Date,IP,User Agent');
    const truncate = (str, n = 40) => str && str.length > n ? str.slice(0, n) + "..." : str;
    history.forEach(h => {
      const row = [
        '"' + (h.user?.name || 'Guest') + '"',
        '"' + (h.user?.email || '-') + '"',
        '"' + (h.fileName || '-') + '"',
        '"' + (h.lesson?.course?.title || h.courseTitle || h.course?.title || h.lesson?.courseTitle || '-') + '"',
        '"' + truncate(h.filePath || '-', 50) + '"',
        '"' + (h.downloadedAt ? new Date(h.downloadedAt).toLocaleString() : '-') + '"',
        '"' + (h.ip || '-') + '"',
        '"' + truncate(h.userAgent || '-', 40) + '"'
      ];
      csvRows.push(row.join(','));
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'download_history_' + new Date().toISOString().slice(0,10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">
            Download Center
          </h1>
          {/* <p className="text-gray-600 text-base md:text-lg">
            Access your course resources and track your download activity.
          </p> */}
        </div>
        <img
          src="/assets/logo.png"
          alt="Download"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-blue-700">
            Download History
            <span className="text-sm text-gray-400 font-normal">
              (All Downloads)
            </span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className="px-3 py-1 rounded border bg-green-600 text-white font-semibold hover:bg-green-700 transition text-sm w-full sm:w-auto"
              onClick={handleDownloadCSV}
              disabled={loading || !history.length}
            >
              Download CSV
            </button>
            <button
              className="px-3 py-1 rounded border bg-red-600 text-white font-semibold hover:bg-red-700 transition text-sm w-full sm:w-auto"
              onClick={handleDownloadPDF}
              disabled={loading || !history.length}
            >
              Download PDF
            </button>
          </div>
        </div>
        {error && (
          <div className="text-red-500 mb-4 font-semibold">{error}</div>
        )}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
          </div>
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
                  // Only show first 2 unless expanded
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
                      <td className="p-3">
                        {/* Display course title if available */}
                        {h.lesson?.course?.title ||
                         h.courseTitle ||
                         h.course?.title ||
                         h.lesson?.courseTitle ||
                         "-"}
                      </td>
                      <td className="p-3 text-xs text-gray-600">
                        {h.filePath}
                      </td>
                      <td className="p-3 text-xs">
                        {new Date(h.downloadedAt).toLocaleString()}
                      </td>
                      <td className="p-3 text-xs">{h.ip}</td>
                      <td className="p-3 text-xs truncate max-w-xs" title={h.userAgent}>
                        {h.userAgent}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Expand/Collapse Button */}
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
    </div>
  );
};

export default DownloadPage;
