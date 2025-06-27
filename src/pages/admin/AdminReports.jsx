
import React from "react";
import SearchBar from "../../components/SearchBar";
import AdminReportCard from "./AdminReportCard"


const AdminReports = () => {
  return (
  <>  

  <div className="p-4 bg-gradient-to-br from-blue-50 to-white">
            <SearchBar />
     <AdminReportCard/>
    </div>
    </>
  );
};

export default AdminReports;
