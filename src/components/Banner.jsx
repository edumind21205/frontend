import React, { useRef } from 'react'
import { motion, useInView } from "framer-motion";

export default function Banner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div>
        <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4" ref={ref}>
          <motion.h2
            className="text-3xl font-bold text-gray-900  text-center mb-4 font-accent fade-in"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Why Choose EduMinds
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto mb-16 fade-in"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          >
            Our platform combines cutting-edge technology with expert instruction to provide an unmatched learning experience.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              className="bg-gray-50 dark:bg-slate-800 rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 zoom-in"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            >
              <div className="feature-icon-container bg-primary/10 dark:bg-primary/20 ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white   mb-3">Expert Instructors</h3>
              <p className="text-gray-600  dark:text-gray-400">
                Learn from industry professionals with years of experience in their respective fields.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div
              className="bg-gray-50 dark:bg-slate-800 rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 zoom-in"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ delay: 0.45, duration: 0.7, ease: "easeOut" }}
            >
              <div className="feature-icon-container bg-accent/10 dark:bg-accent/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900  dark:text-white  mb-3">Recognized Certifications</h3>
              <p className="text-gray-600 dark:text-gray-400 ">
                Earn certificates that are recognized by top companies worldwide.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div
              className="bg-gray-50 dark:bg-slate-800 rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 zoom-in"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
            >
              <div className="feature-icon-container bg-primary/10 dark:bg-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900  dark:text-white  mb-3">Thriving Community</h3>
              <p className="text-gray-600  dark:text-gray-400">
                Join forums and discussion groups to connect with fellow learners and instructors.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
