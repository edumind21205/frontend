import React, { useEffect, useState } from 'react'
import EventsCalendar from "../../components/EventsCalendar"
import RevenueCircle from "../../components/revenue"


function Admincalendar() {
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://eduminds-production-180d.up.railway.app/api/admin/admin-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch payment history");
        const data = await res.json();
        const total = data.reduce(
          (sum, p) =>
            sum +
            (p.price ||
              p.amount ||
              (p.course && p.course.price) ||
              0),
          0
        );
        setRevenue(total);
      } catch (err) {
        setRevenue(0);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-center items-start md:gap-20 gap-8 w-full mt-6 md:mt-10">
      <div className="flex-shrink-0 mt-6 md:mt-10 ml-0 md:ml-1 w-full md:w-auto">
        <RevenueCircle revenue={revenue} />
      </div>
      <div className="flex-shrink-0 w-full md:w-[540px] min-w-0 md:min-w-[320px]">
        <EventsCalendar />
      </div>
    </div>
  );
}

export default Admincalendar
