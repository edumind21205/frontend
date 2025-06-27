import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView } from "framer-motion";

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    if (target === 0) {
      setCount(0);
      return;
    }
    const increment = target / (duration / 16);
    let current = 0;
    const step = () => {
      current += increment;
      if (current < target) {
        setCount(Math.floor(current));
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    step();
    // eslint-disable-next-line
  }, [target]);
  return count;
}

export default function Impact() {
  const [impactData, setImpactData] = useState({
    students: 0,
    instructors: 0,
    courses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchImpact = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/impact/data");
        if (!res.ok) throw new Error("Failed to fetch impact data");
        const { report } = await res.json();
        // Use the first object in the report array
        if (report && report.length > 0) {
          setImpactData({
            students: report[0].students,
            instructors: report[0].instructors,
            courses: report[0].courses
          });
        }
      } catch (err) {
        setError(err.message || "Error fetching impact data");
      } finally {
        setLoading(false);
      }
    };
    fetchImpact();
  }, []);

  const studentsCount = useCountUp(impactData.students);
  const instructorsCount = useCountUp(impactData.instructors);
  const coursesCount = useCountUp(impactData.courses);

  return (
    <div>
      {/* bg-primary/5 */}
       <motion.div
          className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 md:p-12 mb-24 transition-all duration-700"
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="text-center mb-12">
            <h2 className="mb-12 text-center text-2xl md:text-3xl  font-extrabold text-blue-800">Our Impact</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Since our founding, we've made a significant impact on education worldwide.
            </p>
          </div>
          {loading && <div>Loading impact data...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-primary text-4xl md:text-5xl font-bold mb-2">{studentsCount}+</p>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Students</p>
              </div>
              <div className="text-center">
                <p className="text-primary text-4xl md:text-5xl font-bold mb-2">{instructorsCount}+</p>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Teachers</p>
              </div>
              <div className="text-center">
                <p className="text-primary text-4xl md:text-5xl font-bold mb-2">{coursesCount}+</p>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Courses</p>
              </div>
              <div className="text-center">

              </div>
            </div>
          )}
        </motion.div>
    </div>
  )
}
