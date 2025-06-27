import React from "react";
import SearchBar from "../../components/SearchBar";
import AdminStudentsCard from "./AdminStudentsCard";

const AdminStudents = () => {
  return (
    <div className="p-4  bg-gradient-to-br from-blue-50 to-white">
    {/* // <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
    //   <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
    //     <div>
    //       <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">
    //         All Students
    //       </h2>
    //       <p className="text-gray-600 text-base md:text-lg">
    //         Search and manage all registered students.
    //       </p>
    //     </div>
    //     <img
          src="/assets/student.png"
          alt="Students"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div> */}
      <SearchBar />
      <AdminStudentsCard />
    </div>
  );
};

export default AdminStudents;
