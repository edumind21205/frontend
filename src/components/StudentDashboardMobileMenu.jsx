import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  BarChart2,
  FileCheck2,
  Award,
  Settings,
  LogOut,
  MessageSquare,
  Download,
  Menu,
  X
} from 'lucide-react';
import { saveAllUserDataBeforeLogout } from "../lib/saveUserData";
import { Button } from "./ui/button";

const mobileSidebarItems = [
  { icon: <Home size={18} />, label: 'Home', href: '/student/dashboard' },
  { icon: <BookOpen size={18} />, label: 'All Courses', href: '/student/all-courses' },
  { icon: <BookOpen size={18} />, label: 'My Courses', href: '/student/courses' },
  { icon: <BarChart2 size={18} />, label: 'Progress', href: '/student/progress' },
  { icon: <FileCheck2 size={18} />, label: 'Quizzes', href: '/student/quizzes' },
  { icon: <Award size={18} />, label: 'Certificates', href: '/student/certificates' },
  { icon: <Download size={18} />, label: 'Downloads', href: '/student/DownloadPage' },
  { icon: <MessageSquare size={18} />, label: 'QnAs', href: '/student/questions' },
  { icon: <Settings size={18} />, label: 'Settings', href: '/student/settings' },
];

const StudentDashboardMobileMenu = ({ open, onClose, onLogout, pathname }) => (
  open ? (
    
    <div className="fixed inset-0 z-50 md:hidden flex">
      <div className="w-4/5 max-w-xs bg-white py-4 px-4 h-full flex flex-col transition-transform duration-300 ease-in-out overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" onClick={onClose}>
            <div className="flex items-center space-x-2">
              <img src="/assets/logo2.png" alt="EduMinds Logo" className="w-10 h-10 object-contain" />
              <span className="text-lg font-bold text-primary">EduMinds</span>
            </div>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="flex flex-col space-y-2">
          {mobileSidebarItems.map(item => (
            <Link key={item.label} to={item.href} onClick={onClose}>
              <span className={`flex items-center gap-2 py-2 px-2 rounded-lg font-medium ${pathname === item.href ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-blue-50'}`}>
                {item.icon}
                <span>{item.label}</span>
              </span>
            </Link>
          ))}
          <button
            className="flex items-center gap-2 py-2 px-2 rounded-lg font-medium text-red-600 hover:bg-red-50 mt-2"
            onClick={() => { onLogout(); onClose(); }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  ) : null
);

export default StudentDashboardMobileMenu;
