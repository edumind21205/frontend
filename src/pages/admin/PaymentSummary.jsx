import React from 'react'
import SearchBar from "../../components/SearchBar";
import AdminpaymentCard from "./AdminpaymentCard";
function PaymentSummary() {
  return (
  <>  <div className="p-4 bg-gradient-to-br from-blue-50 to-white">
      <SearchBar />
      <AdminpaymentCard />
    </div>
    </> 
  )
}

export default PaymentSummary
