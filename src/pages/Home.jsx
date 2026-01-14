import { useState, useEffect } from "react";
import "../styles.css/Home.css";


function Home() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  //Load immediately from localStorage instead of using useEffect
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("calendarEvents");
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState("");
  const [newTime, setNewTime] = useState("");

  // Days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

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

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  // Day click
  const handleDayClick = (day) => {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateKey);
    setNewEvent("");
    setNewTime("");
  };

  // Add event
  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.trim() || !newTime) return;
    setEvents((prev) => {
      const prevEvents = prev[selectedDate] || [];
      const updatedEvents = [
        ...prevEvents,
        { id: Date.now(), text: newEvent.trim(), time: newTime },
      ].sort((a, b) => a.time.localeCompare(b.time));
      return { ...prev, [selectedDate]: updatedEvents };
    });
    setNewEvent("");
    setNewTime("");
  };

  // Delete event
  const handleDeleteEvent = (dateKey, eventId) => {
    setEvents((prev) => {
      const updated = { ...prev };
      updated[dateKey] = prev[dateKey].filter((e) => e.id !== eventId);
      if (updated[dateKey].length === 0) delete updated[dateKey];
      return updated;
    });
  };

  // Generate calendar days
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push({
      number: null,
      events: [],
      hasEvents: false,
      key: `empty-${i}`,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(d).padStart(2, "0")}`;
    const dayEvents = events[dateKey] || [];
    days.push({
      number: d,
      events: dayEvents,
      hasEvents: dayEvents.length > 0,
      key: dateKey,
      onClick: () => handleDayClick(d),
    });
  }

  return (
    <div className="container mt-4" style={{ padding: "20px" }}>
      <h1 className="mb-4 text-center">📅 Kalenteri</h1>

      {/* Keanu of the Day */}
      <div className="text-center mb-3">
        <h4 className="fst-italic">Keanu of the Day</h4>
        <img
          src="https://placekeanu.com/200"
          alt="Keanu of the Day"
          className="rounded-2xl shadow-lg mt-3"
        />
      </div>

      {/* Month Navigation */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-primary btn-lg" onClick={prevMonth}>
          ◀
        </button>
        <h3 className="mb-0">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button className="btn btn-outline-primary btn-lg" onClick={nextMonth}>
          ▶
        </button>
      </div>

      {/* Weekday Headers */}
      <div
        className="d-grid"
        style={{
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="border-bottom py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Month Grid */}
      <div
        className="d-grid"
        style={{
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "6px",
          maxHeight: "70vh",
          overflowY: "auto",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      >
        {days.map((day) => (
          <div
            key={day.key}
            className={`border rounded p-2 calendar-day shadow-sm ${
              day.hasEvents ? "bg-info-subtle" : "bg-white"
            }`}
            style={{
              minHeight: "150px",
              cursor: day.number ? "pointer" : "default",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={day.onClick}
          >
            {day.number && <div className="fw-bold">{day.number}</div>}
            <div className="flex-grow-1 mt-1 overflow-auto">
              {day.events.map((e) => (
                <div
                  key={e.id}
                  className="bg-info-subtle text-dark rounded px-1 py-0 mb-1"
                  style={{ fontSize: "0.8rem" }}
                >
                  {e.time} {e.text}
                </div>
              ))}
            </div>
            {day.events.length > 5 && (
              <div className="small text-muted mt-auto">
                +{day.events.length - 5} more
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedDate && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Events for {selectedDate}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedDate(null)}
                ></button>
              </div>
              <div className="modal-body text-start">
                <ul className="list-group mb-3">
                  {(events[selectedDate] || []).map((event) => (
                    <li
                      key={event.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {event.time} {event.text}
                      </span>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          handleDeleteEvent(selectedDate, event.id)
                        }
                      >
                        🗑
                      </button>
                    </li>
                  ))}
                  {(!events[selectedDate] ||
                    events[selectedDate].length === 0) && (
                    <li className="list-group-item text-muted text-center">
                      No events yet
                    </li>
                  )}
                </ul>
                <div className="row g-2">
                  <div className="col-4">
                    <input
                     id="event-time"
                      type="time"
                      className="form-control form-control-lg"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                  </div>
                  <div className="col-8">
                    <div className="input-group">
                      <input
                        id="event-description"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Event description..."
                        value={newEvent}
                        onChange={(e) => setNewEvent(e.target.value)}
                      />
                      <button
                        className="btn btn-success btn-lg"
                        onClick={handleAddEvent}
                      >
                        ➕ Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => setSelectedDate(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

