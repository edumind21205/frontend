
import React from "react";
import SearchBar from "../../components/SearchBar";
import CertificateCard from "./CertificateCard";


const StudentCertificates = () => {
  return (
   <> <div className="p-4 bg-gradient-to-br from-blue-50 to-white">
       <SearchBar />
      {/* <h2 className="text-xl font-bold">My Certificates</h2>
      <p>This page lists all the certificates issued by you</p> */}
      <CertificateCard/>
    </div>
    </>
  );
};

export default StudentCertificates;
