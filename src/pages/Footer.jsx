import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    
      <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">
                {/* Replace <span>E</span> with logo image */}
                <img
                  src="/assets/logo2.png"
                  alt="EduMinds Logo"
                  className="w-30 h-30 object-contain"
                />
              </div>
              <span className="text-xl font-medium">EduMinds</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your pathway to knowledge and skills that matter in today's world.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1BMwiTfuDR/" className="text-gray-400 hover:text-white transition" aria-label="Facebook">
                {/* Facebook */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://x.com/mr_salmangoraya?t=w2iO2h-iyg-iaI_3RzgJ9w&s=09" className="text-gray-400 hover:text-white transition" aria-label="Twitter">
                {/* Twitter */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/salmangoraya05?igsh=dXRjdjk3ZW90b2Ey" className="text-gray-400 hover:text-white transition" aria-label="Instagram">
                {/* Instagram */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/salman-ahmed-a76708356/" className="text-gray-400 hover:text-white transition" aria-label="LinkedIn">
                {/* LinkedIn */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link to="/CoursesPage" className="text-gray-400 hover:text-white transition">Courses</Link></li>
              <li><Link to="/Instructors" className="text-gray-400 hover:text-white transition">Instructors</Link></li>
              <li><Link to="/resources" className="text-gray-400 hover:text-white transition">Resources</Link></li>
              <li><Link to="/Community" className="text-gray-400 hover:text-white transition">Community</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li><Link to="/AboutPage" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link to="/Blog" className="text-gray-400 hover:text-white transition">Blog</Link></li>
              <li><Link to="/FAQ" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
              <li><Link to="/Contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/TermsOfService" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/Cookie" className="text-gray-400 hover:text-white transition">Cookie Policy</Link></li>
              <li><Link to="/Refund" className="text-gray-400 hover:text-white transition">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} EduMinds. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    
  );
}
