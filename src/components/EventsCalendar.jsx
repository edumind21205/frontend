import React, { useEffect, useState } from "react";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const eventTypeLabels = {
  blue: "Event",
  red: "Holiday",
  dark: "Other",
  course: "Course Schedule",
  quiz: "Quiz",
  delete: "Course Deletion",
};

const eventTypeColors = {
  blue: "bg-blue-50",
  red: "bg-red-50",
  dark: "bg-gray-100",
  course: "bg-green-50",
  quiz: "bg-yellow-50",
  delete: "bg-red-100",
};

const eventTypeDot = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  dark: "bg-gray-800",
  course: "bg-green-500",
  quiz: "bg-yellow-500",
  delete: "bg-red-500",
};

const EventsCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("blue");
  const [eventListChanged, setEventListChanged] = useState(false);

  // Simulate fetching events from backend
  useEffect(() => {
    const key = `events-${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    const stored = localStorage.getItem(key);
    setEvents(stored ? JSON.parse(stored) : []);
  }, [currentDate, eventListChanged]);

  // Check user role (simulate)
  const role = localStorage.getItem("role"); // "teacher", "admin", "student", etc.
  const canEdit = role === "teacher" || role === "admin";

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Fill empty days at the start
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Fill actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const event = events.find((e) => e.day === i);
      days.push({
        day: i,
        isToday:
          i === new Date().getDate() &&
          month === new Date().getMonth() &&
          year === new Date().getFullYear(),
        eventType: event ? event.type : null,
      });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Handle month navigation
  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  // Handle event add
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!eventTitle || !selectedDay) return;
    const newEvent = {
      id: Date.now(),
      title: eventTitle,
      date: `${selectedDay} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
      type: eventType,
      day: selectedDay,
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    // Save to localStorage (replace with backend call in production)
    const key = `events-${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    localStorage.setItem(key, JSON.stringify(updatedEvents));
    setShowEventForm(false);
    setEventTitle("");
    setEventType("blue");
    setSelectedDay(null);
    setEventListChanged((v) => !v);
  };

  // Handle event delete
  const handleDeleteEvent = (id) => {
    const updatedEvents = events.filter((e) => e.id !== id);
    setEvents(updatedEvents);
    const key = `events-${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    localStorage.setItem(key, JSON.stringify(updatedEvents));
    setEventListChanged((v) => !v);
  };

  return (
    <div className="flex justify-end w-full mt-8">
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold">Events Calendar</div>
          {canEdit && (
            <button
              className="text-blue-600 hover:text-blue-900 text-xl"
              onClick={() => setShowEventForm(true)}
              title="Add Event, Holiday, Course Schedule, or Quiz"
            >
              +
            </button>
          )}
        </div>
        {/* Month Navigation */}
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-gray-400 hover:text-gray-900 text-lg"
            onClick={() => changeMonth(-1)}
          >
            &lt;
          </button>
          <span className="font-medium text-base">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            className="text-gray-400 hover:text-gray-900 text-lg"
            onClick={() => changeMonth(1)}
          >
            &gt;
          </button>
        </div>
        {/* Calendar Grid */}
        <div>
          <div className="grid grid-cols-7 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-xs text-center font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cell, idx) =>
              cell ? (
                <div
                  key={`day-${cell.day}-${idx}`}
                  className={`
                    h-8 w-8 rounded-full flex items-center justify-center text-sm
                    ${canEdit ? "cursor-pointer" : ""}
                    ${cell.isToday ? "bg-blue-600 text-white font-bold" : ""}
                    ${cell.eventType && eventTypeColors[cell.eventType] ? eventTypeColors[cell.eventType] : ""}
                    ${!cell.isToday && !cell.eventType && canEdit ? "hover:bg-gray-100" : ""}
                    transition
                  `}
                  onClick={() => canEdit && setSelectedDay(cell.day)}
                  title={cell.eventType ? eventTypeLabels[cell.eventType] : ""}
                >
                  {cell.day}
                </div>
              ) : (
                <div key={`empty-${idx}`}></div>
              )
            )}
          </div>
        </div>
        {/* Add Event/Holiday/Course/Quiz Form */}
        {canEdit && showEventForm && (
          <form
            className="mt-4 p-4 bg-gray-50 rounded shadow space-y-2"
            onSubmit={handleAddEvent}
          >
            <div className="font-semibold">Add Event, Holiday, Course Schedule, or Quiz</div>
            <div>
              <label className="block text-sm mb-1">Day</label>
              <input
                type="number"
                min={1}
                max={31}
                className="border px-2 py-1 rounded w-20"
                value={selectedDay || ""}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Title</label>
              <input
                type="text"
                className="border px-2 py-1 rounded w-full"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Type</label>
              <select
                className="border px-2 py-1 rounded w-full"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              >
                <option value="blue">Event</option>
                <option value="red">Holiday</option>
                <option value="course">Course Schedule</option>
                <option value="quiz">Quiz</option>
                <option value="delete">Course Deletion</option>
                <option value="dark">Other</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Add
              </button>
              <button
                type="button"
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                onClick={() => setShowEventForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {/* Events List */}
        <div className="space-y-2 mt-6">
          {events.length === 0 && (
            <div className="text-gray-400 text-sm">
              No events or holidays set for this month.
            </div>
          )}
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-2 rounded-lg flex items-center gap-2 ${
                eventTypeColors[event.type] || "bg-gray-100"
              }`}
            >
              <div
                className={`w-2 h-8 rounded-full ${
                  eventTypeDot[event.type] || "bg-gray-800"
                }`}
              ></div>
              <div className="flex-1">
                <div className="font-medium text-sm">{event.title}</div>
                <div className="text-xs text-gray-500">
                  {event.date}{" "}
                  <span className="ml-2 italic">
                    {eventTypeLabels[event.type] || "Other"}
                  </span>
                </div>
              </div>
              {canEdit && (
                <button
                  className="text-red-500 hover:text-red-700 text-xs"
                  onClick={() => handleDeleteEvent(event.id)}
                  title="Delete"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;
