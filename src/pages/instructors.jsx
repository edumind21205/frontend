import React, { useEffect, useState } from "react";
import { getAllTeachers } from "../services/teacherService";
import Header from "../pages/Header";
import Footer from "../pages/Footer";

export default function Instructors() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const data = await getAllTeachers();
        setTeachers(data);
      } catch (err) {
        setError("Failed to load instructors.");
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, []);

  return (
    <>
    <Header />
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Meet Our Instructors</h1>
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="grid gap-8 md:grid-cols-2">
        {teachers.length === 0 && !loading && !error && (
          <p className="col-span-2 text-center text-gray-500">No instructors found.</p>
        )}
        {teachers.map((teacher) => (
          <div key={teacher._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
              {teacher.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-semibold mb-1 text-blue-700">{teacher.name}</h2>
            <p className="text-gray-600 mb-2">{teacher.email}</p>
            <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">Teacher</span>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
}
