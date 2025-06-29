import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, BarChart2,
  BookOpen, FileText, Award, Settings, LogOut
} from 'lucide-react';

const SidebarItem = ({ icon, label, active, href }) => (
  <Link
    to={href}
    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
      active
        ? 'bg-white bg-opacity-10 text-white font-medium'
        : 'text-white text-opacity-70 hover:bg-white hover:bg-opacity-10 hover:text-white'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </Link>
);

const New = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const role = localStorage.getItem("role");

  const commonLinks = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      href: `/${role}/dashboard`
    },
    {
      label: "Settings",
      icon: <Settings size={18} />,
      href: `/${role}/settings`
    },
    {
      label: "Logout",
      icon: <LogOut size={18} />,
      href: "/logout"
    }
  ];

  const roleLinks = {
    admin: [
      {
        label: "Students",
        icon: <Users size={18} />,
        href: "/admin/students"
      },
      {
        label: "Reports",
        icon: <BarChart2 size={18} />,
        href: "/admin/reports"
      }
    ],
    teacher: [
      {
        label: "Courses",
        icon: <BookOpen size={18} />,
        href: "/teacher/courses"
      },
      {
        label: "Lessons",
        icon: <FileText size={18} />,
        href: "/teacher/lessons"
      }
    ],
    student: [
      {
        label: "Courses",
        icon: <BookOpen size={18} />,
        href: "/student/courses"
      },
      {
        label: "Quizzes",
        icon: <FileText size={18} />,
        href: "/student/quizzes"
      },
      {
        label: "Certificates",
        icon: <Award size={18} />,
        href: "/student/certificates"
      }
    ]
  };

  const links = [...(roleLinks[role] || []), ...commonLinks];

  return (
    <div className="h-screen w-[250px] bg-blue-900 flex flex-col">
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-white text-blue-900 font-bold flex items-center justify-center rounded">ED</div>
        <h2 className="text-white font-bold text-xl">EduMinds</h2>
      </div>

      <div className="mt-6 px-2 flex-1 flex flex-col gap-1">
        {links.map(({ icon, label, href }) => (
          <SidebarItem
            key={label}
            icon={icon}
            label={label}
            href={href}
            active={pathname === href}
          />
        ))}
      </div>
    </div>
  );
};

export default New;
