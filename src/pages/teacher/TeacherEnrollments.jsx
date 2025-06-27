import React from 'react'
import SearchBar from "../../components/SearchBar";
import TeacherEnrollmentCrad from './TeacherEnrollmentCrad';

const TeacherEnrollments = () => {
  return (
    <> <div className="p-4 bg-gradient-to-br from-blue-50 to-white">
<SearchBar />
      {/* <h2 className="text-xl font-bold">My enrollment</h2>
      <p>This page lists all courses created by the teacher.</p> */}
      <TeacherEnrollmentCrad />
    </div>
    </>
  )
}

export default TeacherEnrollments
