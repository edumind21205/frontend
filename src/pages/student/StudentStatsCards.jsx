import React, { useEffect, useState } from "react";
import StartCardTemplate from "./StartCardTemplate";
import { BookOpen, UserCheck, FileText, BarChart2, Users } from "lucide-react";

const StudentStatsCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // always get fresh token
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/student/dashboard/student-dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load Student Dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
      </div>
    );
  }

  if (!stats) return <p>Loading...</p>;

  // Use backend-calculated stats if available, fallback to 0
  const activeEnrollments = stats.activeEnrollments ?? 0;
  const quizzesAttempted = stats.quizzesAttempted ?? 0;
  const averageScore =
    stats.averageScore !== undefined && stats.averageScore !== null
      ? Number(stats.averageScore).toFixed(2)
      : "0.00";

  return (
    <div className="max-w-6xl  mx-auto p-4 md:p-8  bg-gradient-to-br from-blue-50 to-white   ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
         <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">Welcome to the Student Dashboard</h2>   
              
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-6 mb-0">
        <StartCardTemplate
          title="Courses Enrolled"
          value={stats.coursesEnrolled ?? 0}
          icon={BookOpen}
          color="bg-indigo-500"
        />
        <StartCardTemplate
          title="Active Enrollments"
          value={activeEnrollments}
          icon={UserCheck}
          color="bg-emerald-500"
        />
        <StartCardTemplate
          title="Quizzes Attempted"
          value={quizzesAttempted}
          icon={FileText}
          color="bg-yellow-500"
        />
        <StartCardTemplate
          title="Average Quiz Score"
          value={averageScore}
          icon={BarChart2}
          color="bg-purple-500"
        />
        <StartCardTemplate
          title="Total Certificates"
          value={stats.certificates ?? 0}
          icon={Users}
          color="bg-blue-500"
        />
      </div>
    </div>
  );
};

export default StudentStatsCards;

