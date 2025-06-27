
import React from "react";
import SearchBar from "../../components/SearchBar";
import CourseCard from "./CourseCard";


const TeacherCourses = () => {
  return (
   <> <div className="p-4 bg-gradient-to-br from-blue-50 to-white">
<SearchBar />
      {/* <h2 className="text-xl font-bold">My Courses</h2>
      <p>This page lists all courses created by the teacher.</p> */}
      <CourseCard />
    </div>
    </>
  );
};

export default TeacherCourses;
