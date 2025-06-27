import React from "react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Payment Successful!</h1>
        <p className="mb-4">Thank you for your purchase. Your payment was successful and you now have access to your course.</p>
        <Link to="/student/courses" className="text-blue-600 underline">Go to My Courses</Link>
      </div>
    </div>
  );
}
