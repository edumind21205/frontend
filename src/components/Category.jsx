import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "../components/ui/button";
import { motion, useInView } from "framer-motion";

export default function Category() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/courses");
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

  // Group courses by category
  const categoryMap = {};
  courses.forEach(course => {
    const cat = course.category || "General";
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push(course);
  });
  const categoryCards = Object.entries(categoryMap);

  return (
    <div>
     <section
        className="py-16 bg-slate-50 "
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-gray-900  text-center mb-6 font-accent fade-in"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Explore Categories
          </motion.h2>
          <motion.p
            className="text-center text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 fade-in"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          >
            Browse our wide selection of courses across different categories and find the perfect fit for your learning goals
          </motion.p>
          {loading && <div>Loading categories...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            ref={ref}
          >
            {/* Category cards go here */}
            {!loading && !error && categoryCards.map(([category, coursesInCat], idx) => {
              const firstCourse = coursesInCat[0];
              return (
                <motion.div
                  key={category}
                  className="relative border rounded-xl shadow bg-white flex flex-col max-w-xs w-full mx-auto h-full hover:shadow-lg transition-transform duration-300 hover:scale-105 overflow-hidden"
                  style={{ minHeight: "350px", transitionProperty: "box-shadow, transform" }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ delay: inView ? idx * 0.15 : 0, duration: 0.7, ease: "easeOut" }}
                >
                  {firstCourse.picture && (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${firstCourse.picture.startsWith('http') ? firstCourse.picture : 'https://eduminds-production-180d.up.railway.app/' + firstCourse.picture})`,
                        filter: "brightness(0.65)"
                      }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col flex-1 items-center justify-center h-full p-5">
                    <span className="mt-2 bg-blue-100 bg-opacity-80 text-blue-700 text-xs px-3 py-1 rounded-full capitalize">
                      {category}
                    </span>
                    <span className="mt-2 text-gray-100 text-sm font-semibold drop-shadow">
                      {coursesInCat.length} course{coursesInCat.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
           <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
          >
            <Button 
              asChild
              className="mt-8 px-8 py-6 text-lg bg-blue-500 hover:bg-primary-light dark:bg-primary dark:hover:bg-primary-light transition-all duration-300 transform hover:scale-105 zoom-in"
            >
              <Link to="/CoursesPage">
                View All Categories
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
     
  )
}
