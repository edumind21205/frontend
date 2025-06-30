import React from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";

export default function Privacy() {
  return (
    <>
    <Header />
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Privacy Policy</h1>
      <div className="space-y-6 text-gray-800">
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
          <p>
            EduMinds is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">2. Information We Collect</h2>
          <p>
            We collect information you provide when registering, enrolling in courses, or contacting support. This may include your name, email, payment details, and course activity.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Information</h2>
          <p>
            Your information is used to provide and improve our services, process payments, communicate updates, and ensure platform security.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Sharing of Information</h2>
          <p>
            We do not sell or rent your personal information. We may share data with trusted partners for payment processing and platform functionality, always in accordance with this policy.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Cookies</h2>
          <p>
            EduMinds uses cookies to enhance your experience. You can control cookie preferences in your browser settings.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Children's Privacy</h2>
          <p>
            EduMinds is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">9. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at <a href="mailto:support@edumideduinfo@gmail.com" className="text-blue-600 underline">support@edumideduinfo@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
    <Footer />
    </>
  );
}
