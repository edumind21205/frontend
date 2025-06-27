import React from 'react'

function  Students() {
  return (
  <>
   <main className="flex-1 p-8  mt-0 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Total      fkywekufkuwefwutf Courses</h2>
            <p className="text-3xl font-bold text-violet-600">24</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Active Students</h2>
            <p className="text-3xl font-bold text-green-600">382</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Pending Assignments</h2>
            <p className="text-3xl font-bold text-orange-600">12</p>
          </div>
        </div>
      </main>
  </>
  )
}

export default Students
