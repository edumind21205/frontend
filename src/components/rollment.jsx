import React, { useEffect, useState, useRef } from "react";

export default function RollmentCircle() {
  const [courseCount, setCourseCount] = useState(0);
  const [avgEnrollment, setAvgEnrollment] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const animationRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch teacher's courses
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/teacher/my-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const courses = await res.json();
        setCourseCount(Array.isArray(courses) ? courses.length : 0);

        // Fetch enrollments for each course
        let totalEnrollments = 0;
        for (const course of courses) {
          const enrollRes = await fetch(
            `https://eduminds-production-180d.up.railway.app/api/enrollments/course/${course._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const enrollList = await enrollRes.json();
          totalEnrollments += Array.isArray(enrollList) ? enrollList.length : 0;
        }
        const avg = courses.length > 0 ? totalEnrollments / courses.length : 0;
        setAvgEnrollment(Math.round(avg));
      } catch {
        setCourseCount(0);
        setAvgEnrollment(0);
      }
    };
    fetchData();
  }, []);

  // Animate the number counting up for average enrollment
  useEffect(() => {
    if (avgEnrollment === 0) {
      setDisplayed(0);
      return;
    }
    const duration = 1200;
    let startTime = null;
    const animate = (now) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayed(Math.floor(progress * avgEnrollment));
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayed(avgEnrollment);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [avgEnrollment]);

  // Circle animation for average enrollment (max 100 for visualization)
  const percent = Math.min(avgEnrollment / 100, 1);
  const radius = 100;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - percent * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative rounded-3xl shadow-2xl"
        style={{
          background: "linear-gradient(135deg,rgb(49, 83, 197) 0%,rgb(51, 25, 165) 100%)", // match revenue.jsx
          width: 290,
          height: 290,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg height={radius * 2} width={radius * 2} className="block">
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="url(#rollment-gradient)"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)" }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <defs>
            <linearGradient id="rollment-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#43e97b" />
              <stop offset="100%" stopColor="#38f9d7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center"
          style={{ transform: "translate(-50%, -50%)" }}>
          <span className="text-5xl font-bold text-white drop-shadow-lg">{displayed}</span>
          <span className="text-lg text-white/80 mt-2">Avg. Enrollments</span>
        </div>
      </div>
      <div className="mt-6 text-center">
        <div className="text-lg font-semibold text-gray-800">Your Courses</div>
        <div className="text-2xl font-bold text-yellow-700 mt-1">
          {courseCount} Courses
        </div>
      </div>
    </div>
  );
}
