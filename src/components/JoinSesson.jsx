import React from 'react'
import { Link } from "react-router-dom";
// import { Button } from "../components/ui/button";
export default function JoinSesson() {
  return (
<div className="py-20 hero-gradient bg-blue-500 ">
      <div className="text-center max-w-3xl mx-auto bg-blue-500">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Join Our Journey</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  Whether you're a student looking to learn new skills, an instructor with knowledge to share, or a team member passionate about education, we invite you to be part of our growing community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/courses"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-800 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2"
                  >
                    Explore Courses
                  </Link>
                  <Link
                    to="/Contact"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-800 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-4 py-2"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              </div>

  )
}
