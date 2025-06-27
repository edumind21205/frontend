import React from 'react'
import EventsCalendar from "../../components/EventsCalendar"
import RollmentCircle from "../../components/rollment"

export default function TeacherCalendar() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-start md:gap-20 gap-8 w-full mt-6 md:mt-10">
      <div className="flex-shrink-0 mt-6 md:mt-10 ml-0 md:ml-1 w-full md:w-auto">
        <RollmentCircle />
      </div>
      <div className="flex-shrink-0 w-full md:w-[540px] min-w-0 md:min-w-[320px]">
        <EventsCalendar />
      </div>
    </div>
  )
}

