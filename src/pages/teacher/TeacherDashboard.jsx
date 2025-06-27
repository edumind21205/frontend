
import React from "react";
import SearchBar from "../../components/SearchBar";
import TeacherStatsCards from "./TeacherStatsCards";
import TeacherCalendar from "./TeacherCalendar";

const TeacherDashboard = () => {
  return (
  <>  <div className="p-4 bg-gradient-to-br from-blue-50 to-white">
      <SearchBar />
      <TeacherStatsCards />
        <TeacherCalendar />
    </div>
    </>
  );
};

export default TeacherDashboard;
