import React from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";

const communityFeatures = [
  {
    title: "Discussion Forums",
    description:
      "Join course-specific forums to ask questions, share insights, and connect with fellow learners and instructors.",
    icon: "💬",
  },
  {
    title: "Events & Webinars",
    description:
      "Participate in live events, webinars, and Q&A sessions hosted by EduMinds experts and guest speakers.",
    icon: "🎥",
  },
  {
    title: "Study Groups",
    description:
      "Form or join study groups to collaborate, discuss assignments, and motivate each other.",
    icon: "🤝",
  },
  {
    title: "Resource Sharing",
    description:
      "Share helpful resources, articles, and tools with the EduMinds community.",
    icon: "📚",
  },
  {
    title: "Achievements & Badges",
    description:
      "Earn badges for participation, helping others, and completing community challenges.",
    icon: "🏅",
  },
  {
    title: "Community Guidelines",
    description:
      "Our community is built on respect and collaboration. Please review our guidelines to keep EduMinds safe and welcoming for all.",
    icon: "📜",
  },
];

export default function Community() {
  return (
    <>
    <Header />
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">EduMinds Community</h1>
      <p className="text-lg text-center mb-10 text-gray-700">
        Connect, collaborate, and grow with other learners and educators. The EduMinds Community is your space to share knowledge, ask questions, and celebrate achievements together.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {communityFeatures.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h2 className="text-2xl font-semibold mb-2 text-blue-600">{feature.title}</h2>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600 mb-4">
          Have ideas or want to get more involved? Email us at{' '}
          <a href="mailto:community@eduminds.com" className="text-blue-600 underline">community@edumideduinfo@gmail.com</a>
        </p>
        <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          More interactive features coming soon!
        </span>
      </div>
    </div>
    <Footer />
    </>
  );
}
