import React from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";

const blogPosts = [
  {
    id: 1,
    title: "Welcome to EduMinds Blog!",
    date: "2025-06-05",
    author: "Admin",
    summary: "Stay updated with the latest news, tips, and educational resources from EduMinds. Our blog is your go-to place for learning inspiration and platform updates.",
    image: "/vite.svg",
  },
  {
    id: 2,
    title: "5 Tips to Succeed in Online Learning",
    date: "2025-05-28",
    author: "Admin",
    summary: "Discover practical strategies to stay motivated, organized, and successful in your online courses at EduMinds.",
    image: "/vite.svg",
  },
  {
    id: 3,
    title: "How Teachers Can Make the Most of EduMinds",
    date: "2025-05-20",
    author: "Admin",
    summary: "Explore features and best practices for teachers to create engaging courses and track student progress effectively.",
    image: "/vite.svg",
  },
];

export default function Blog() {
  return (
    <>
    <Header />
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">EduMinds Blog</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 text-blue-600">{post.title}</h2>
              <p className="text-gray-500 text-sm mb-2">By {post.author} | {new Date(post.date).toLocaleDateString()}</p>
              <p className="text-gray-700 mb-4">{post.summary}</p>
              <button className="text-blue-500 hover:underline font-medium">Read More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
}
