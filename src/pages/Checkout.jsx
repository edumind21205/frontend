import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import StripeProvider from '../components/StripeProvider';

function CheckoutForm({ course, paying, setPaying, setError, setClientSecret, clientSecret, navigate }) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaying(true);
    setError('');
    setCardError('');
    try {
      const token = localStorage.getItem('token');
      // 1. Create PaymentIntent
      const res = await fetch('https://eduminds-production-180d.up.railway.app/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ courseId: course._id, price: course.price }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment failed');
      setClientSecret(data.clientSecret);
      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
      if (result.error) {
        setCardError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Save payment to backend
        try {
          const saveRes = await fetch('https://eduminds-production-180d.up.railway.app/api/payment/save-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              courseId: course._id,
              amount: course.price,
              stripePaymentId: result.paymentIntent.id,
            }),
          });
          if (!saveRes.ok) {
            const saveErrData = await saveRes.json();
            // Optionally show error to user
            console.error('Payment save failed:', saveErrData.message || saveErrData.error);
          }
        } catch (saveErr) {
          // Optionally handle error (e.g., show notification)
          console.error('Payment save request error:', saveErr);
        }
        // Enroll student in course after successful payment
        try {
          const enrollRes = await fetch(`https://eduminds-production-180d.up.railway.app/api/enrollments/${course._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          if (!enrollRes.ok) {
            const enrollErrData = await enrollRes.json();
            console.error('Enrollment failed:', enrollErrData.message || enrollErrData.error);
          }
        } catch (enrollErr) {
          console.error('Enrollment request error:', enrollErr);
        }
        navigate('/payment-success');
      }
    } catch (err) {
      setError(err.message || 'Payment error');
    } finally {
      setPaying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Card Details</label>
        <div className="border rounded p-3 bg-white">
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
        {cardError && <div className="text-red-600 text-sm mt-2">{cardError}</div>}
      </div>
      <Button className="w-full mt-4 bg-green-300" type="submit" disabled={paying || !stripe || !elements}>
        {paying ? 'Processing...' : `Pay PKR ${course.price?.toFixed ? course.price.toFixed(2) : course.price || '0.00'}`}
      </Button>
      {clientSecret && (
        <div className="text-xs text-gray-400 mt-2 text-center">Payment intent created.</div>
      )}
    </form>
  );
}

export default function Checkout() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Fetch course details
    async function fetchCourse() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://eduminds-production-180d.up.railway.app/api/courses/${courseId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Failed to fetch course');
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        setError(err.message || 'Error fetching course');
      } finally {
        setLoading(false);
      }
    }
    if (courseId) fetchCourse();
  }, [courseId]);

  return (
    <StripeProvider>
      <Header />
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
        <Card className="max-w-lg w-full mx-2 my-12 shadow-lg">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>
            {loading ? (
              <div className="text-center py-8">Loading course...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">{error}</div>
            ) : course ? (
              <>
                <div className="mb-6">
                  <div className="font-semibold text-lg mb-1">{course.title}</div>
                  <div className="text-gray-600 mb-2">{course.description}</div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full capitalize">{course.category || 'General'}</span>
                    <span className="text-green-700 font-semibold text-lg">PKR {course.price?.toFixed ? course.price.toFixed(2) : course.price || '0.00'}</span>
                  </div>
                </div>
                <CheckoutForm course={course} paying={paying} setPaying={setPaying} setError={setError} setClientSecret={setClientSecret} clientSecret={clientSecret} navigate={navigate} />
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </StripeProvider>
  );
}

