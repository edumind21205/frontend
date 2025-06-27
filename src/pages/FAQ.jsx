import React, { useState } from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";

const faqs = [
  {
    question: "What is EduMinds?",
    answer:
      "EduMinds is an online learning platform where students can enroll in courses, and teachers can create and manage educational content. We aim to make quality education accessible to everyone.",
  },
  {
    question: "How do I enroll in a course?",
    answer:
      "Simply sign up as a student, browse our available courses, and click the 'Enroll' button on the course page. You may need to complete payment if the course is not free.",
  },
  {
    question: "Can I become a teacher on EduMinds?",
    answer:
      "Yes! Register as a teacher and submit your profile for approval. Once approved, you can start creating and publishing your own courses.",
  },
  {
    question: "How are lessons delivered?",
    answer:
      "Lessons are delivered through a mix of videos, PDFs, quizzes, and interactive content. You can access them anytime after enrolling in a course.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Absolutely. We use secure payment gateways and do not store your payment details on our servers.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can reach out to our support team via the Contact page or email us at support@eduminds.com.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <>
    <Header />
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border rounded-lg bg-white shadow">
            <button
              className="w-full text-left px-6 py-4 focus:outline-none flex justify-between items-center"
              onClick={() => toggleFAQ(idx)}
            >
              <span className="font-medium text-lg text-blue-600">{faq.question}</span>
              <span className="ml-4 text-blue-500">{openIndex === idx ? "-" : "+"}</span>
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-4 text-gray-700 animate-fade-in">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
}
