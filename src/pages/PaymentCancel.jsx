import React from "react";
import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Payment Cancelled</h1>
        <p className="mb-4">Your payment was cancelled. If this was a mistake, you can try again.</p>
        <Link to="/student/courses" className="text-blue-600 underline">Back to Courses</Link>
      </div>
    </div>
  );
}
