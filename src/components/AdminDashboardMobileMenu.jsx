import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  BarChart2,
  Award,
  Download,
  CreditCard,
  MessageSquare,
  Briefcase,
  Settings,
  LogOut,
  X
} from "lucide-react";
import { Button } from "./ui/button";

const mobileSidebarItems = [
  { icon: <Home size={18} />, label: "Home", href: "/admin/dashboard" },
  { icon: <Users size={18} />, label: "Students/Teachers", href: "/admin/manage-users" },
  { icon: <BarChart2 size={18} />, label: "Reports", href: "/admin/reports" },
  { icon: <Award size={18} />, label: "Certificates", href: "/admin/certificates" },
  { icon: <Download size={18} />, label: "Downloads", href: "/admin/DownloadPage" },
  { icon: <CreditCard size={18} />, label: "Payment Summary", href: "/admin/paymentSummary" },
  { icon: <MessageSquare size={18} />, label: "QnAs", href: "/admin/questions" },
  { icon: <Briefcase size={18} />, label: "Management", href: "/admin/management" },
  { icon: <Settings size={18} />, label: "Settings", href: "/admin/settings" },
];

const AdminDashboardMobileMenu = ({ open, onClose, onLogout, pathname }) => (
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

export default AdminDashboardMobileMenu;
