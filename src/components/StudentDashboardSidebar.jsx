import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { saveAllUserDataBeforeLogout } from "../lib/saveUserData";
import { Button } from "./ui/button";

const SidebarItem = ({ icon, label, active, href, onClick, collapsed }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
      active
        ? 'bg-white bg-opacity-10 text-black font-medium'
        : 'text-white text-opacity-70 hover:bg-white hover:bg-opacity-10 hover:text-black'
    }`}
  >
    {href ? (
      <Link to={href} className="flex items-center gap-2 w-full h-full">
        <span className="text-lg">{icon}</span>
        {!collapsed && <span>{label}</span>}
      </Link>
    ) : (
      <>
        <span className="text-lg">{icon}</span>
        {!collapsed && <span>{label}</span>}
      </>
    )}
  </div>
);

const StudentDashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  // Hide sidebar and show mobile menu button on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(false); // Always expanded on mobile (hidden)
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Logout logic
  const handleLogout = async () => {
    await saveAllUserDataBeforeLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // Redirect to landing/home page
  };

  // Toggle sidebar collapse (desktop only)
  const handleToggle = () => setCollapsed((prev) => !prev);

  if (isMobile) {
    // On mobile, render nothing (sidebar is now handled elsewhere)
    return null;
  }

  return (
    <div
      className={`h-screen ${collapsed ? 'w-[70px]' : 'w-[250px]'} bg-blue-500 flex flex-col transition-all duration-200`}
    >
      <div className="p-4 flex items-center gap-2">
        {/* Student Face with Graduation Cap Logo */}
        <button
          onClick={() => {
            // Save token and user with role "student" before navigating
            const token = localStorage.getItem("token");
            const currentUser = JSON.parse(localStorage.getItem("user")) || {};
            if (token) localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({
              ...currentUser,
              role: "student"
            }));
            navigate("/");
          }}
          className="flex items-center gap-2 focus:outline-none"
          style={{ background: 'none', border: 'none', padding: 0 }}
          aria-label="Go to landing page"
        >
          <img
            src="/assets/logo2.png"
            alt="EduMinds Logo"
            className="drop-shadow-lg"
            style={{
              objectFit: "contain",
              width: collapsed ? "36px" : "48px",
              height: collapsed ? "36px" : "48px"
            }}
          />
          {!collapsed && (
            <div className="flex flex-col ml-2">
              <span className="text-white font-extrabold text-2xl tracking-wide logo-font" style={{letterSpacing: '2px'}}>EduMinds</span>
              <span className="text-white text-xs font-light italic mt-1 opacity-80 logo-tagline">Pathway to Knowledge</span>
            </div>
          )}
        </button>
        <button
          className="ml-auto rounded hover:bg-blue-600 transition-colors"
          onClick={handleToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight size={20} color="white" strokeWidth={3} />
            : <ChevronLeft size={20} color="white" strokeWidth={3} />}
        </button>
      </div>
      <div className="mt-6 px-2 flex-1 flex flex-col gap-1">
        <SidebarItem
          icon={<Home size={18} />}
          label="Home"
          active={pathname === '/student/dashboard'}
          href="/student/dashboard"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<BookOpen size={18} />}
          label="All Courses"
          active={pathname === '/student/all-courses'}
          href="/student/all-courses"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<BookOpen size={18} />}
          label="My Courses"
          active={pathname === '/student/courses'}
          href="/student/courses"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<BarChart2 size={18} />}
          label="Progress"
          active={pathname === '/student/progress'}
          href="/student/progress"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<FileCheck2 size={18} />}
          label="Quizzes"
          active={pathname === '/student/quizzes'}
          href="/student/quizzes"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Award size={18} />}
          label="Certificates"
          active={pathname === '/student/certificates'}
          href="/student/certificates"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Download size={18} />}
          label="Downloads"
          active={pathname === '/student/downloads'}
          href="/student/DownloadPage"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<MessageSquare size={18} />}
          label="QnAs"
          active={pathname === '/student/questions'}
          href="/student/questions"
          collapsed={collapsed}
        />
      </div>
      <div className="mt-auto px-2 mb-6">
        <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          active={pathname === '/student/settings'}
          href="/student/settings"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<LogOut size={18} />}
          label="Logout"
          onClick={handleLogout}
          collapsed={collapsed}
        />
      </div>
    </div>
  );
};

export default StudentDashboardSidebar;