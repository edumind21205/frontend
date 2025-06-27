import React from 'react'
import SearchBar from "../../components/SearchBar";
import StudentProgressCard from "./StudentProgressCard";
// import CourseDetails from "../CourseDetails"


const StudentProgress = () => {
  return (
 <> <div className="p-4 bg-gradient-to-br from-blue-50 to-white">
      <SearchBar />
      <StudentProgressCard />
      {/* <CourseDetails /> */}
    </div>
    </> 
  )
}

export default StudentProgress
