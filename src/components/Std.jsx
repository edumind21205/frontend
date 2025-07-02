import React, { useRef } from 'react'
import { motion, useInView } from "framer-motion";

function Std() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div>
      <main className="text-center py-20 px-4 bg-slate-50" >
        <p className="text-lg mb-8">
          Your all-in-one Learning Management System for Students, Teachers, and Admins.
        </p>
        <div
          className="flex flex-col md:flex-row justify-center gap-8 mt-10"
          ref={ref}
        >
          <motion.div
            className="bg-white rounded shadow p-6 w-full max-w-sm"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Students</h3>
            <p>
              <img src="/assets/Student.jpg" alt="landpagege" />
              Track your course progress, take quizzes, and earn certificates.
            </p>
          </motion.div>
          <motion.div
            className="bg-white rounded shadow p-6 w-full max-w-sm"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Teachers</h3>
            <p>
              <img src="/assets/Teacher2.jpg" alt="landpagege" />
              Create and manage courses, lessons, and student enrollments.
            </p>
          </motion.div>
          <motion.div
            className="bg-white rounded shadow p-6 w-full max-w-sm"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Admins</h3>
            <p>
              <img src="/assets/Admin.png" alt="landpagege" />
              Oversee the entire platform, generate reports, and manage users.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default Std
