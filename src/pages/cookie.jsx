import React from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";

export default function Cookie() {
  return (
    <>
    <Header />
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Cookie Policy</h1>
      <div className="space-y-6 text-gray-800">
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device by your browser when you visit websites. They help us enhance your experience on EduMinds by remembering your preferences and login status.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">2. How We Use Cookies</h2>
          <p>
            We use cookies to:
            <ul className="list-disc ml-6 mt-2">
              <li>Keep you signed in</li>
              <li>Remember your preferences</li>
              <li>Analyze site traffic and usage</li>
              <li>Improve our services and user experience</li>
            </ul>
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Managing Cookies</h2>
          <p>
            You can control or delete cookies through your browser settings. Please note that disabling cookies may affect your experience on EduMinds.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Third-Party Cookies</h2>
          <p>
            Some features may use third-party cookies (e.g., analytics, payment gateways). We do not control these cookies, and their use is governed by the respective third parties.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated effective date.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Contact Us</h2>
          <p>
            If you have questions about our Cookie Policy, please contact us at <a href="mailto:support@edumideduinfo@gmail.com" className="text-blue-600 underline">support@edumideduinfo@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
    <Footer />
    </>
  );
}
