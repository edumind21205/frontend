import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "https://eduminds-production-180d.up.railway.app"}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      setIsSubmitted(true);
      setMessage(data.message || "If an account exists with that email, you will receive a password reset link shortly.");
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="flex flex-col justify-center space-y-6 w-full max-w-md">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset Your Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          {isSubmitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Email Sent</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {message}
              </p>
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or {" "}
                <button
                  className="text-primary hover:underline font-medium"
                  onClick={() => { setIsSubmitted(false); setEmail(""); }}
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}
        </div>
        <div className="text-center text-sm mt-4">
          Remember your password? {" "}
          <Link to="/auth/login" className="text-primary hover:underline font-medium">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
