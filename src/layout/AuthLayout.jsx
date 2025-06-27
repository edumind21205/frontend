import React from "react";
import Index from "../pages/LandingPage";
import LandingPage from "../pages/LandingPage";

export default function AuthLayout({ children }) {
  return (
    <div>
      
      {/* <LandingPage /> */}
      <div>{children}</div>
    </div>
  );
}           
