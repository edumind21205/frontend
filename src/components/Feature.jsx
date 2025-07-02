import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ChevronRight } from "lucide-react";
// import BuyButton from "../components/BuyButton";
import EnrollButton from "../components/EnrollButton";
import { motion } from "framer-motion"; // Add this import
import { toast, ToastContainer } from "react-toastify";

export default function Feature() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/courses", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        setError(err.message || "Error fetching courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter courses with category 'best sell'
  const bestSellCourses = courses.filter(course => course.category && course.category.toLowerCase() === "best seller");

  return (
    <>
      <ToastContainer />
      <section
        className="py-16 bg-slate-50 "
      >
        <div className="container mx-auto px-4">
          <div
            className="flex justify-between items-center mb-10 fade-in"
          >
            <h2 className="text-3xl font-bold text-gray-900  font-accent">
              Featured Courses
            </h2>
            <Link to="/CoursesPage" className="hidden md:block">
              <Button
                variant="link"
                className="text-primary hover:text-primary-light dark:hover:text-primary-light flex items-center font-medium"
              >
                View All Courses
                <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
          </div>
          {/* Add featured course cards here */}
          {loading && <div>Loading featured courses...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {bestSellCourses.length === 0 ? (
                <div>No 'Best Sell' courses available at the moment.</div>
              ) : (
                bestSellCourses.map((course, idx) => (
                  <motion.div
                    key={course._id}
                    className="border rounded-xl shadow bg-white flex flex-col max-w-xs w-full mx-auto h-full hover:shadow-lg transition-transform duration-300 hover:scale-105"
                    style={{ minHeight: "420px", transitionProperty: "box-shadow, transform" }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15, duration: 0.7, ease: "easeOut" }}
                  >
                    {course.picture && (
                      <img
                        src={course.picture.startsWith("http") ? course.picture : `https://eduminds-production-180d.up.railway.app/${course.picture}`}
                        alt={course.title}
                        className="w-full h-44 object-cover rounded-t-xl"
                      />
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="font-bold text-lg mb-1">{course.title}</div>
                      <div className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full capitalize">
                          {course.category || "fantasy"}
                        </span>
                        <span className="text-green-700 font-semibold text-lg">
                          {course.price ? `PKR${course.price}` : 'Free'}
                        </span>
                      </div>
                      <div className="mt-auto flex justify-end ml-30">
                        <EnrollButton course={course} />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
