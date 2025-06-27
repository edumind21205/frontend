import React, { useEffect, useState, useRef } from "react";
import { Input } from "./ui/input";
import { Search, Bell } from "lucide-react";
import { Avatar } from "./ui/avatar";
import { Link, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [userInitial, setUserInitial] = useState("");
  const [userName, setUserName] = useState(""); // Add this line
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage (assuming user object is stored after login)
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    // console.log("User from localStorage:", user);
    if (user && user.name && user.name.length > 0) {
      setUserInitial(user.name[0].toUpperCase());
      setUserName(user.name); // Add this line
    }

    // Fetch unread notifications count
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log("token from localStorage:", token);
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          const unread = data.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        setUnreadCount(0);
      }
    };
    fetchNotifications();
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://eduminds-production-180d.up.railway.app/api/search/all?q=${encodeURIComponent(searchTerm)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        // Flatten and tag results
        const results = [];
        if (data.courses) results.push(...data.courses.map((c) => ({ ...c, _type: "course" })));
        if (data.lessons) results.push(...data.lessons.map((l) => ({ ...l, _type: "lesson" })));
        if (data.quizzes) results.push(...data.quizzes.map((q) => ({ ...q, _type: "quiz" })));
        if (data.assignments) results.push(...data.assignments.map((a) => ({ ...a, _type: "assignment" })));
        setSearchResults(results);
        setShowDropdown(true);
      } catch (err) {
        setSearchError("Failed to search");
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setSearchLoading(false);
      }
    }, 400); // 400ms debounce
    return () => clearTimeout(searchTimeout.current);
  }, [searchTerm]);

  // Handle navigation on result click
  const handleResultClick = (item) => {
    setShowDropdown(false);
    if (item._type === "course") {
      navigate(`/courses/${item._id}`);
    } else if (item._type === "lesson") {
      navigate(`/lessons/${item._id}`);
    } else if (item._type === "quiz") {
      navigate(`/quizzes/${item._id}`);
    } else if (item._type === "assignment") {
      navigate(`/assignments/${item._id}`);
    }
  };

  // Handler for bell click
  const handleBellClick = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin/notifications");
    } else if (role === "teacher") {
      navigate("/teacher/notifications");
    } else {
      navigate("/student/notifications");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 w-full">
      {/* Dashboard Title */}
      <div className="flex-1 min-w-[120px]">
        <h1 className="text-2xl md:text-4xl font-extrabold text-blue-800 mb-2">
          {userName ? ` ${userName}` : "n"}
        </h1>
      </div>

      {/* Search Bar and Notifications */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {/* Search Input */}
        <div className="relative w-[160px] sm:w-[220px] md:w-[300px]">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            className="pl-10 pr-4 w-full bg-gray-50 transition-all duration-200"
            placeholder="Search for courses, lessons, quizzes, assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            autoComplete="off"
          />
          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute z-20 left-0 mt-2 w-full bg-white border border-gray-200 rounded shadow-lg max-h-72 overflow-y-auto">
              {searchLoading && (
                <div className="p-3 text-gray-500 text-sm">Searching...</div>
              )}
              {searchError && (
                <div className="p-3 text-red-500 text-sm">{searchError}</div>
              )}
              {!searchLoading && !searchError && searchResults.length === 0 && (
                <div className="p-3 text-gray-500 text-sm">No results found</div>
              )}
              {!searchLoading && !searchError && searchResults.map((item) => {
                let displayTitle = item.title || item.quizTitle || item.assignmentTitle || item.name || "Untitled";
                let typeLabel = item._type.charAt(0).toUpperCase() + item._type.slice(1);
                let tooltipText = `Go to ${typeLabel} page`;
                return (
                  <div
                    key={item._type + item._id}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex flex-col border-b last:border-b-0 group"
                    onMouseDown={() => handleResultClick(item)}
                    title={tooltipText}
                  >
                    <span className="font-medium text-gray-800 flex items-center gap-2">
                      {displayTitle}
                      <span className="ml-2 text-xs text-blue-500 hidden group-hover:inline">↗</span>
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{typeLabel}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative flex items-center">
          <Bell
            size={20}
            className="text-gray-600 cursor-pointer"
            onClick={handleBellClick}
          />
          {unreadCount > 0 && (
            <span
              className="absolute flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full"
              style={{
                top: '-6px',
                right: '-6px',
                minWidth: '18px',
                height: '18px',
                padding: '0 4px',
                lineHeight: '18px',
                fontSize: '12px',
                zIndex: 10,
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>

        {/* User Avatar */}
        <Avatar className="h-8 w-8 bg-blue-600 text-white flex items-center justify-center font-bold">
          {userInitial || "✨"}
        </Avatar>
      </div>
    </div>
  );
};

export default SearchBar;


