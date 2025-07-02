import React, { useRef, useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion, useInView } from "framer-motion";

function Cta() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // Track token reactively (update on login/logout without refresh)
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));

  useEffect(() => {
    // Listen for login/logout in other tabs
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);

    // Listen for login/logout in this tab
    const origSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      origSetItem.apply(this, arguments);
      if (key === "token") {
        setIsLoggedIn(!!value);
      }
    };

    // Listen for removal of token (logout)
    const origRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function(key) {
      origRemoveItem.apply(this, arguments);
      if (key === "token") {
        setIsLoggedIn(false);
      }
    };

    return () => {
      window.removeEventListener("storage", onStorage);
      localStorage.setItem = origSetItem;
      localStorage.removeItem = origRemoveItem;
    };
  }, []);

  return (
    <div>
      <section className="py-20 hero-gradient bg-blue-500  dark:bg-slat-900  mb-10">
        <div className="container mx-auto px-4 text-center" ref={ref}>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-6 font-accent"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Start Your Learning Journey Today
          </motion.h2>
          <motion.p
            className="text-xl text-white/90 max-w-2xl mx-auto mb-10 "
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          >
            Join thousands of students from around the world and transform your career with our expert-led courses.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          >
            {!isLoggedIn && (
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 py-6 shadow-lg font-medium text-lg transition transform hover:-translate-y-1 hover:shadow-xl"
                asChild
              >
                <Link to="/auth/Login">
                  Get Started
                </Link>
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 py-6 font-medium text-lg transition hover:scale-105"
              asChild
            >
              <Link to="/CoursesPage">
                Explore Courses
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Cta
