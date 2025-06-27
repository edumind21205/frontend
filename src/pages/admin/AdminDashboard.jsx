
import React from "react";
import { Outlet } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import StatsCards from "./StatsCards";
import Admincalendar from  "./Admincalendar"

const AdminDashboard = () => {
  return (
 <>  
  <div className="p-4 bg-gradient-to-br from-blue-50 to-white">
    <SearchBar />
       <StatsCards />
       <Admincalendar />
    </div>
    {/* <Outlet /> */}
    </> 
  );
};

export default AdminDashboard;
