import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CourseCard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState(null);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdCourse, setCreatedCourse] = useState(null);
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    if (picture) formData.append("picture", picture);

    // Always get token right before the request
    const token = localStorage.getItem("token");
    // console.log("token from localStorage:", token);

    if (!token) {
      setMessage("Invalid token. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://eduminds-production-180d.up.railway.app/api/teacher/create-course", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Course created successfully!");
        setTitle("");
        setDescription("");
        setPicture(null);
        setPrice("");
        setCategory("");
        setCreatedCourse(data.course || {
          title,
          description,
          price,
          picture: picture ? URL.createObjectURL(picture) : null,
          _id: data.course?._id || Math.random().toString(36).slice(2, 10),
          category,
        });
      } else {
        // Show validation errors if present
        if (data.errors && Array.isArray(data.errors)) {
          setMessage(data.errors.map((err) => err.msg).join(", "));
        } else {
          setMessage(data.message || "Failed to create course.");
        }
      }
    } catch (err) {
      setMessage("Error creating course.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <ToastContainer />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">Create New Course</h2>
          <p className="text-gray-600 text-base md:text-lg">
            Fill out the form below to add a new course to the platform.
          </p>
        </div>
        <img
          src="/assets/logo.png"
          alt="Course"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
        </div>
      )}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-4 md:p-8">
        {message && (
          <div className="mb-4 text-center text-sm text-blue-700">{message}</div>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Title</label>
            <input
              type="text"
              className="border border-blue-200 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter course title"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              className="border border-blue-200 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter course description"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Picture</label>
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => setPicture(e.target.files[0])}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Price (pkr)</label>
            <input
              type="number"
              min="0"
              step="1"
              className="border border-blue-200 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="Enter course price"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold">Category</label>
            <input
              type="text"
              className="border border-blue-200 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              placeholder="Enter course category"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>
      {createdCourse && (
        <div className="flex justify-center mt-10">
          <div className="border rounded-xl bg-white shadow-lg hover:shadow-2xl transition transform duration-300 hover:scale-105 flex flex-col overflow-hidden max-w-md">
            {createdCourse.picture && (
              <img
                src={
                  createdCourse.picture.startsWith("uploads/")
                    ? `https://eduminds-production-180d.up.railway.app/${createdCourse.picture}`
                    : createdCourse.picture
                }
                alt={createdCourse.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="flex-1 flex flex-col p-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 font-semibold">
                  Course ID: {(createdCourse._id || createdCourse.id)?.toString().slice(-6)}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1">{createdCourse.title}</h3>
              <p className="text-slate-600 text-sm mb-2 line-clamp-2">{createdCourse.description}</p>
              {createdCourse.price && (
                <div className="text-base font-semibold text-green-700 mb-2">
                  PKR {parseFloat(createdCourse.price).toFixed(2)}
                </div>
              )}
              {createdCourse.category && (
                <div className="text-sm font-semibold text-blue-700 mb-2">
                  Category: {createdCourse.category}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
