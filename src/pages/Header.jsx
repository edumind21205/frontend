import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../components/theme-toggle";
import { useAuthStore } from "../lib/auth";
import { cn } from "../lib/utils";
import "./styles/Header.css"; 
import { 
  Search, 
  Bell, 
  Menu, 
  ChevronDown,
  X 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { saveAllUserDataBeforeLogout } from "../lib/saveUserData";

export default function Header({ sidebarOpen, onSidebarToggle, showSidebarToggle }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  
  // Debug: log isAuthenticated
  // console.log("isAuthenticated:", isAuthenticated);

  // Fetch user role from localStorage
  let userRole = null;
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    userRole = userData?.role || null;
  } catch {
    userRole = null;
  }

  // Dashboard redirect logic
  const handleDashboardRedirect = () => {
    if (userRole === "admin") navigate("/admin/dashboard");
    else if (userRole === "teacher") navigate("/teacher/dashboard");
    else if (userRole === "student") navigate("/student/dashboard");
    else navigate("/");
  };

  const handleLogout = async () => {
    await saveAllUserDataBeforeLogout();
    logout();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const closeSearchOnMobile = () => {
    if (window.innerWidth < 768) {
      setIsSearchOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    // Fetch notification count from API or localStorage
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          const unread = data.filter((n) => !n.isRead).length;
          setNotificationCount(unread);
        }
      } catch {
        setNotificationCount(0);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <header className="bg-white dark:bg-slat-900 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSidebarToggle}
              className="md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {!showSidebarToggle && (
            <Link to="/">
              <div className="flex items-center space-x-2 cursor-pointer dark:bg-slat-900">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold">
                  {/* Replace <span >E</span> with logo image */}
                  <img
                    src="/assets/logo2.png"
                    alt="EduMinds Logo"
                    className="w-10 h-10 max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-primary hidden md:inline">EduMinds</span>
              </div>
            </Link>
          )}
          
          {isAuthenticated && (
            <div className={cn(
              "relative",
              isSearchOpen ? "md:w-64 w-full" : "md:w-64 w-0"
            )}>
              <input 
                type="text" 
                placeholder="Search courses, lessons..." 
                className={cn(
                  "w-full py-2 pl-10 pr-4 text-sm bg-slate-100 dark:bg-slate-700 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary",
                  !isSearchOpen && "md:block hidden"
                )}
                onBlur={closeSearchOnMobile}
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" />
              
              {!isSearchOpen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden" 
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 mr-4">
          <Link to="/">
            <span className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium text-sm cursor-pointer">Home</span>
          </Link>
          <Link to="/ServicesPage">
            <span className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium text-sm cursor-pointer">Services</span>
          </Link>
          <Link to="/CoursesPage">
            <span className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium text-sm cursor-pointer">Courses</span>
          </Link>
          {/* <Link to="/pricing">
            <span className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium text-sm cursor-pointer">Pricing</span>
          </Link> */}
          <Link to="/AboutPage">
            <span className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium text-sm cursor-pointer">About Us</span>
          </Link>
          <Link to="/contact">
            <span className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium text-sm cursor-pointer">Contact</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2 ">
          {/* <ThemeToggle /> */}
          {/* <ThemeToggle />
           */}
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          {(isAuthenticated || userRole) ? (
            <>
              {/* Dashboard button for logged-in users */}
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                size="sm"
                onClick={handleDashboardRedirect}
              >
                Dashboard
              </Button>
              
              {/* Notifications Button with Badge */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative flex items-center justify-center"
                aria-label="Notifications"
                onClick={() => navigate("/Notify")}
              >
                <span className="relative">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white font-bold rounded-full"
                      style={{
                        minWidth: '14px',
                        height: '14px',
                        padding: '0 2px',
                        lineHeight: '14px',
                        fontSize: '10px',
                        zIndex: 10,
                      }}
                    >
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 focus:ring-0">
                    <Avatar className="h-8 w-8 bg-blue-600 text-white flex items-center justify-center font-bold rounded-full">
                      {/* Show user initials in a circle */}
                      <AvatarFallback>
                        {
                          (user?.fullName && user.fullName.length > 0)
                            ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                            : (() => {
                                try {
                                  const u = JSON.parse(localStorage.getItem("user"));
                                  if (u && u.name && u.name.length > 0) {
                                    return u.name.split(' ').map(n => n[0]).join('').toUpperCase();
                                  }
                                } catch {}
                                return "U";
                              })()
                        }
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium">{user?.fullName || "User"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gradient-to-br from-blue-50 to-white">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {/* <Link to="/setting">
                    <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                  </Link> */}
                  {/* <Link to="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">Dashboard</DropdownMenuItem>
                  </Link> */}
                  <Link to="/setting">
                    <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/auth/Login">
                <Button className="bg-blue-300" variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/auth/SignUp">
                <Button className="bg-blue-300" size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && !isAuthenticated && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Side Drawer */}
          <div className="w-4/5 max-w-xs bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 py-4 px-4 h-full flex flex-col transition-transform duration-300 ease-in-out overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center space-x-2">
                  <img src="/assets/logo.png" alt="EduMinds Logo" className="w-10 h-10 max-w-full max-h-full object-contain" />
                  <span className="text-lg font-bold text-primary hidden md:inline">EduMinds</span>
                </div>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <span className="block py-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium">Home</span>
              </Link>
              <Link to="/ServicesPage" onClick={() => setMobileMenuOpen(false)}>
                <span className="block py-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium">Services</span>
              </Link>
              <Link to="/CoursesPage" onClick={() => setMobileMenuOpen(false)}>
                <span className="block py-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium">Courses</span>
              </Link>
              <Link to="/AboutPage" onClick={() => setMobileMenuOpen(false)}>
                <span className="block py-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium">About Us</span>
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                <span className="block py-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium">Contact</span>
              </Link>
              {isAuthenticated ? (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-600 w-full"
                    size="sm"
                    onClick={() => {
                      handleDashboardRedirect();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-left"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <span className="block py-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium">Log in</span>
                  </Link>
                  <Link to="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                    <span className="block py-2 text-primary font-medium">Sign up</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}

