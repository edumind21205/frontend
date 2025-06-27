import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"; // Adjusted import path

// CircularProgress Component
const CircularProgress = ({ 
  percentage, 
  color, 
  size = 120, 
  thickness = 8, 
  label 
}) => {
  const radius = size / 2 - thickness;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={size} width={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#f0f0f0"
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{percentage}%</span>
        {label && <span className="text-xs text-gray-500 mt-1">{label}</span>}
      </div>
    </div>
  );
};

// AttendanceChart Component
const AttendanceChart = () => {
  return (
    <Card className="h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Attendance</CardTitle>
        <div className="flex items-center gap-2">
          <button className="text-sm text-gray-400 hover:text-gray-900">•••</button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-[320px]">
        <div className="flex items-center justify-center gap-8 pt-4">
          <CircularProgress 
            percentage={84} 
            color="#3DD598" 
            label="Students" 
          />
          <CircularProgress 
            percentage={91} 
            color="#FFC542" 
            label="Teachers" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;
