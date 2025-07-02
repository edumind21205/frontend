import React, { useRef, useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion, useInView } from "framer-motion"; // Add useInView


const Hero = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" }); // Animate once when in view

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
    <div className="pb-16 bg-blue-500">
      {/* Hero Section */}
      <section className="relative hero-gradient py-20">
        <div
          className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center"
          ref={ref}
        >
          <motion.div
            className="md:w-1/2 mb-10 md:mb-0 text-white"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 font-accent"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Your Pathway to Knowledge
            </motion.h1>
            <motion.p
              className="text-xl mb-8 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Discover courses taught by industry experts and expand your skills with hands-on learning experiences.
            </motion.p>
            <motion.div
              className={
                `flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4` +
                (!isLoggedIn ? "" : " justify-start")
              }
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              <Button
                size="lg"
                className="bg-white dark:bg-slat-900 text-blue-500 hover:bg-gray-100 py-6 shadow-md font-medium transition transform hover:-translate-y-1"
                asChild
              >
                <Link to="/CoursesPage">
                  Explore Courses
                </Link>
              </Button>
              {!isLoggedIn && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-blue/10 py-6 font-medium transition dark:bg-slat-900 dark:text-white dark:hover:bg-slat-800 hover:-translate-y-1"
                  asChild
                >
                  <Link to="/auth/Login">
                    Sign Up Free
                  </Link>
                </Button>
              )}
            </motion.div>
          </motion.div>
          <motion.div
            className="md:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {/* Students collaborating on a digital learning platform */}
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Students collaborating on digital platform" 
              className="rounded-xl shadow-2xl relative z-10 h-auto w-full"
            />
            <div className="absolute -bottom-4 -right-4 h-full w-full bg-secondary/20 rounded-xl z-0"></div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Hero
