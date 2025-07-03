import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from "framer-motion";
import { Helmet } from 'react-helmet';
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from './Header';
import Cta from '../components/Cta';
import Footer from './Footer';
import { 
  Mail, 
  PhoneCall, 
  MapPin, 
  MessageSquare, 
  Send
} from 'lucide-react';
import { sendContactMessage } from '../services/contactService';

export default function ContactPage() {
  const formRef = useRef();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  // Add state for location
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setLocationError('Unable to retrieve your location.');
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    const data = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };
    try {
      await sendContactMessage(data);
      // Use react-toastify's toast
      toast.success("Message sent! We've received your message and will respond soon.");
      form.reset();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to send message. Please try again later.');
    }
  };

  return (
    <>
      <Header />
      <Helmet>
        <title >Contact Us | EduMinds Learning Platform</title>
        <meta name="description" content="Get in touch with EduMinds for support, partnership inquiries, or feedback. We're here to help with all your educational needs." />
      </Helmet>

      <div
        className="container mx-auto px-4 py-12 min-h-screen w-full"
        style={{
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))"
        }}
        ref={ref}
      >
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-blue-800">Contact Us</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            We'd love to hear from you. Reach out to our team with any questions, feedback, or support needs.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
        >
          {/* Contact Information Cards */}
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-extrabold text-blue-800">Email Us</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                For general inquiries and support
              </p>
              <a 
                href="mailto:info@eduminds.com" 
                className="text-blue-800 hover:underline font-medium"
              >
               edumideduinfo@gmail.com
              </a>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <PhoneCall className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-extrabold text-blue-800">Call Us</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Monday through Friday, 1pm-6pm Pak
              </p>
              <a 
                href="tel:+92 0318-7848331" 
                className="text-blue-800 hover:underline font-medium"
              >
                +92 0318-7848331
              </a>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-extrabold text-blue-800">Visit Us</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Our University location
              </p>
              <address className="not-italic text-blue-800 font-semibold">
                Alipur Chowk<br />
                Gukranwala, Punjab 51100<br />
              </address>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Form Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
        >
          <div>
            <h2 className="text-2xl md:text-3xl mb-6 font-extrabold text-blue-800  ">Get in Touch</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Fill out the form and our team will get back to you within 24 hours.
            </p>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </label>
                  <Input 
                    id="firstName" 
                    name="firstName"
                    placeholder="Your first name" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </label>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    placeholder="Your last name" 
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="Your email address" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input 
                  id="subject" 
                  name="subject"
                  placeholder="What is this regarding?" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  name="message"
                  placeholder="How can we help you?" 
                  rows={5} 
                  required 
                />
              </div>
              
              <Button type="submit" className="w-full sm:w-auto bg-blue-400 text-white hover:bg-primary/90 transition-colors flex items-center justify-center">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl md:text-3xl mb-6 font-extrabold text-blue-800">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 font-extrabold text-blue-800">How do I enroll in a course?</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  To enroll in a course, create an account or log in, browse our course catalog, and click the "Enroll Now" button on the course page. You'll be guided through the payment process if it's a paid course.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 font-extrabold text-blue-800">Can I get a refund if I'm not satisfied?</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Yes, we offer a 30-day money-back guarantee for most courses. If you're not satisfied with your purchase, contact our support team within 30 days of enrollment for a full refund.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 font-extrabold text-blue-800">How do I become an instructor?</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  To become an instructor, visit your account contact page and Type on "Become an Instructor." You'll need to complete an application process and meet our quality standards before you can publish courses.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 font-extrabold text-blue-800">Do you offer corporate training?</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Yes, we offer customized corporate training solutions for teams of all sizes. Contact our business team through the form on this page or email business@eduminds.com for more information.
                </p>
              </div>
              
              <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg flex items-start">
                <MessageSquare className="h-5 w-5 text-primary mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2 font-extrabold text-blue-800">Still have questions?</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Our support team is ready to help. Contact us through the form or via live chat for immediate assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          className="rounded-xl overflow-hidden h-96 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.45, duration: 0.7, ease: "easeOut" }}
        >
          {location ? (
            <iframe
              src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Your Current Location"
            ></iframe>
          ) : locationError ? (
            <div className="flex items-center justify-center h-full text-red-500">
              {locationError}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              Loading your location...
            </div>
          )}
        </motion.div>
        <Cta />


        {/* Connect Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-2xl md:text-3xl mb-6 font-extrabold text-blue-800">Connect With Us</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
            Follow us on social media for the latest updates, educational content, and community discussions.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="https://www.facebook.com/share/1BMwiTfuDR/" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="https://x.com/mr_salmangoraya?t=w2iO2h-iyg-iaI_3RzgJ9w&s=09" className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/salmangoraya05?igsh=dXRjdjk3ZW90b2Ey" className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/salman-ahmed-a76708356/" className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@salmanahmed5183" className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
      <Footer />
      <ToastContainer autoClose={1000} />
    </>
  );
}