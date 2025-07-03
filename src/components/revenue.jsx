import React, { useEffect, useState, useRef } from "react";

export default function RevenueCircle({ revenue = 0 }) {
  const [displayed, setDisplayed] = useState(0);
  const animationRef = useRef();

  // Animate the number counting up
  useEffect(() => {
    if (revenue === 0) {
      setDisplayed(0);
      return;
    }
    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayed(Math.floor(progress * revenue));
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayed(revenue);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [revenue]);

  // Circle animation
  // Set maxRevenue to a realistic value or make it dynamic
  const maxRevenue = 900000; // Set to 1,000,000 PKR as a realistic example
  // If you want it dynamic, you could use: Math.max(10000, revenue)
  const percent = Math.min(revenue / maxRevenue, 1);
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - percent * circumference;

  // Calculate percentage for display
  const percentDisplay = Math.round(percent * 100);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative rounded-3xl shadow-2xl"
        style={{
          background: "linear-gradient(135deg,rgb(49, 83, 197) 0%,rgb(51, 25, 165) 100%)",
          width: 260,
          height: 260,
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
            stroke="url(#revenue-gradient)"
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
            <linearGradient id="revenue-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#43e97b" />
              <stop offset="100%" stopColor="#38f9d7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center"
          style={{ transform: "translate(-50%, -50%)" }}>
          <span className="text-4xl font-bold text-white drop-shadow-lg">{percentDisplay}%</span>
          <span className="text-base text-white/80 mt-1">of {maxRevenue.toLocaleString()} PKR</span>
        </div>
      </div>
      <div className="mt-6 text-center">
        <div className="text-lg font-semibold text-gray-800">Total Revenue</div>
        <div className="text-2xl font-bold text-purple-700 mt-1">
          PKR {displayed.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
