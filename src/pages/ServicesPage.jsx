import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import Cta from '../components/Cta';
import Work from '../components/Work';
import { motion, useInView } from "framer-motion";

export default function ServicesPage() {
  const services = [
    {
      title: 'Online Courses',
      description: 'Access our library of over 10 professionally created courses covering a wide range of subjects, from coding to business to creative arts.',
      features: [
        'Video lectures with downloadable resources',
        'Interactive quizzes and assignments',
        'Certificate upon completion',
        'Lifetime access to course materials',
        'Mobile-friendly learning experience'
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 19 7.5 19s3.332-.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
        </svg>
      )
    }  
  ];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <>
      <Header />
      <Helmet >
        <title>Our Services | EduMinds Learning Platform</title>
        <meta name="description" content="Discover the comprehensive educational services offered by EduMinds - from online courses and mentorship to corporate training and AI-powered tutoring." />
      </Helmet>

      <div
        className="container mx-auto px-4 py-12 min-h-screen w-full"
        style={{
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))"
        }}
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-blue-800"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            ref={ref}
          >
            Our Educational Services
          </motion.h1>
          <motion.p
            className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          >
            Comprehensive learning solutions designed to help you achieve your educational and career goals.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ delay: inView ? index * 0.15 : 0, duration: 0.7, ease: "easeOut" }}
            >
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 ">{service.icon}</div>
                  <h2 className="text-2xl font-bold mb-3 text-blue-800">{service.title}</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button asChild className="w-full text-blue-800">
                      <Link to="/CoursesPage">
                        <span>Learn More</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How It Works Section */}
        {/* <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 md:p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Getting started with EduMinds services is simple. Follow these steps to begin your learning journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Create an Account</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Sign up for a free account to access our platform and explore available options.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Select a Plan</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Choose from our flexible pricing plans - from monthly subscription to one-time purchases.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Start Learning</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Begin your learning journey immediately with instant access to your selected services.
              </p>
            </div>
          </div>
        </div> */}
        <Work />

        {/* Banner Section */}

        {/* CTA Section */}
        <Cta/>
       
      </div>
      <Footer />
    </>
  );
}