import React from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";

const resources = [
  {
    title: "Getting Started Guide",
    description: "Learn how to create an account, enroll in courses, and start your learning journey on EduMinds.",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    type: "PDF",
  },
  {
    title: "Video Tutorial: Navigating EduMinds",
    description: "Watch our step-by-step video on how to use the EduMinds platform as a student or teacher.",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    type: "Video",
  },
  {
    title: "FAQ",
    description: "Find answers to the most common questions about EduMinds.",
    link: "/#/FAQ",
    type: "Page",
  },
  {
    title: "Contact Support",
    description: "Need help? Reach out to our support team for assistance.",
    link: "/#/Contact",
    type: "Page",
  },
  {
    title: "Community Forum (Coming Soon)",
    description: "Join discussions, ask questions, and connect with other learners and educators.",
    link: "#",
    type: "Forum",
  },
];

export default function Resources() {
  return (
    <>
    <Header />
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">EduMinds Resources</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {resources.map((res, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-blue-600">{res.title}</h2>
              <p className="text-gray-700 mb-4">{res.description}</p>
            </div>
            <a
              href={res.link}
              target={res.type === "Video" || res.type === "PDF" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-500 hover:underline font-medium"
            >
              {res.type === "PDF" && "View PDF"}
              {res.type === "Video" && "Watch Video"}
              {res.type === "Page" && "Go to Page"}
              {res.type === "Forum" && "Coming Soon"}
            </a>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
}
