import React from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";

export default function Refund() {
  return (
    <>
    <Header />
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Refund Policy</h1>
      <div className="space-y-6 text-gray-800">
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Eligibility for Refunds</h2>
          <p>
            If you are not satisfied with a course purchased on EduMinds, you may request a refund within 7 days of enrollment, provided you have not completed more than 20% of the course content.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">2. How to Request a Refund</h2>
          <p>
            To request a refund, please contact our support team at <a href="mailto:support@edumideduinfo@gmail.com" className="text-blue-600 underline">support@edumideduinfo@gmail.com</a> with your course details and reason for the request.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Refund Process</h2>
          <p>
            Once your request is reviewed and approved, the refund will be processed to your original payment method within 5-10 business days. You will receive a confirmation email once the refund is issued.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Non-Refundable Items</h2>
          <p>
            Refunds are not available for courses where more than 20% of the content has been accessed, or for promotional/discounted purchases unless required by law.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Changes to This Policy</h2>
          <p>
            EduMinds reserves the right to update this Refund Policy at any time. Changes will be posted on this page with an updated effective date.
          </p>
        </section>
      </div>
    </div>
    <Footer />
    </>
  );
}
