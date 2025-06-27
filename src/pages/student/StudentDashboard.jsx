import React from "react";
import SearchBar from "../../components/SearchBar";
import StudentStatsCards from "./StudentStatsCards";
import StudentCalendar from "./StudentCalendar";
const StudentDashboard = () => {
  return (
  <>  <div className="p-4 bg-gradient-to-br from-blue-50 to-white ">
      <SearchBar />
      <StudentStatsCards />
        <StudentCalendar />
  
        </div>

    
    </>
  );
};

export default StudentDashboard;
