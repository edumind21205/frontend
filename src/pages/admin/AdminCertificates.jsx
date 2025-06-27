
import React from "react";
import SearchBar from "../../components/SearchBar";
import AdminCertificateCard from "./AdminCertificateCard";


const StudentCertificates = () => {
  return (
   <> <div className="p-4 bg-gradient-to-br from-blue-50 to-white">
     <SearchBar />
      <AdminCertificateCard />
    </div>
    </>
  );
};

export default StudentCertificates;
