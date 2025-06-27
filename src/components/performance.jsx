import React, { useEffect, useState, useRef } from "react";

export default function PerformanceCircle() {
  const [performance, setPerformance] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const animationRef = useRef();

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/enrollments/enroll-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch student courses");
        const result = await res.json();
        // Calculate average progress across all courses
        if (result.courses && result.courses.length > 0) {
          const totalProgress = result.courses.reduce(
            (sum, course) => sum + (typeof course.progress === "number" ? course.progress : 0),
            0
          );
          const avgProgress = totalProgress / result.courses.length;
          setPerformance(Math.round(avgProgress));
        } else {
          setPerformance(0);
        }
      } catch {
        setPerformance(0);
      }
    };
    fetchPerformance();
  }, []);

  // Animate the number counting up
  useEffect(() => {
    if (performance === 0) {
      setDisplayed(0);
      return;
    }
    const duration = 1200; // ms
    let startTime = null;

    const animate = (now) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayed(Math.floor(progress * performance));
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayed(performance);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [performance]);

  // Circle animation
  const percent = Math.min(performance / 100, 1);
  const radius = 100; // Reduced from 120
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - percent * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative rounded-3xl shadow-2xl"
        style={{
          background: "linear-gradient(135deg,rgb(49, 83, 197) 0%,rgb(51, 25, 165) 100%)",
          width: 290, // Reduced from 340
          height: 290, // Reduced from 340
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
            stroke="url(#performance-gradient)"
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
            <linearGradient id="performance-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#43e97b" />
              <stop offset="100%" stopColor="#38f9d7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center"
          style={{ transform: "translate(-50%, -50%)" }}>
          <span className="text-5xl font-bold text-white drop-shadow-lg">{displayed}%</span>
          <span className="text-lg text-white/80 mt-2">Average Progress</span>
        </div>
      </div>
      <div className="mt-6 text-center">
        <div className="text-lg font-semibold text-gray-800">Performance</div>
        <div className="text-2xl font-bold text-emerald-700 mt-1">
          {displayed}% Completed
        </div>
      </div>
    </div>
  );
}
