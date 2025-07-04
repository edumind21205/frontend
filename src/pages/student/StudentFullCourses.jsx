import React from 'react'
import SearchBar from '../../components/SearchBar'
import StudentAllCoursesCard from "./StudentAllCoursesCard"

export default function StudentFullCourses() {
  return (
    <div className='p-4 bg-gradient-to-br from-blue-50 to-white'>
      <SearchBar />
      <StudentAllCoursesCard />
    </div>
  )
}
