import React from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";

export default function TermsOfService() {
  return (
    <>
    <Header />
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Terms of Service</h1>
      <div className="space-y-6 text-gray-800">
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using EduMinds, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our platform.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">2. User Accounts</h2>
          <p>
            You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account and password.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Course Content</h2>
          <p>
            All content provided on EduMinds is for educational purposes. Users may not copy, distribute, or use content for commercial purposes without permission.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Payments & Refunds</h2>
          <p>
            Payments for courses are processed securely. Refunds are subject to our refund policy. Please review course details before purchasing.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Prohibited Conduct</h2>
          <p>
            Users must not misuse the platform, post inappropriate content, or attempt to access unauthorized areas. Violations may result in account suspension.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Privacy</h2>
          <p>
            We respect your privacy. Please review our Privacy Policy to understand how your information is handled.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Changes to Terms</h2>
          <p>
            EduMinds may update these Terms at any time. Continued use of the platform constitutes acceptance of the revised Terms.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">8. Contact Us</h2>
          <p>
            For questions about these Terms, please contact us at <a href="mailto:edumideduinfo@gmail.com" className="text-blue-600 underline"> edumideduinfo@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
    <Footer />
    </>
  );
}
