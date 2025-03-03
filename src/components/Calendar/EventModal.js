import axios from "axios";
import { format, getDay, parse, startOfWeek } from "date-fns";
import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarComponent.css";
import EventComponent from "./EventComponent";
import EventForm from "./EventForm";
import EventModal from "./EventModal";
import EventsSidebar from "./EventsSidebar";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [view, setView] = useState(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [resume, setResume] = useState(null);
  const [aadhar, setAadhar] = useState(null);
  const [expandedDate, setExpandedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    position: "",
    candidate: "",
    meetingLink: "",
    interviewType: "",
    interviewer: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/calendarfromtoenddate.json");
        const formattedEvents = response.data.map((event) => ({
          id: event.id,
          title: event.summary,
          start: new Date(event.start),
          end: new Date(event.end),
          position: event.job_id.jobRequest_Title,
          createdBy: `${event.user_det.handled_by.firstName} ${event.user_det.handled_by.lastName}`,
          candidate: `${event.user_det.candidate.candidate_firstName} ${event.user_det.candidate.candidate_lastName}`,
          interviewer: `${event.user_det.handled_by.firstName} ${event.user_det.handled_by.lastName}`,
          meetingLink: event.link,
          interviewType: event.summary,
          attachments: event.attachments || [],
        }));
        setEvents(formattedEvents);
        setGroupedEvents(groupEventsByDate(formattedEvents));
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      }
    };

    fetchEvents();
  }, []);

  const groupEventsByDate = (events) => {
    const groups = {};
    events.forEach((event) => {
      const dateKey = format(event.start, "yyyy-MM-dd");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(event);
    });
    return groups;
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleExpandClick = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      start: format(event.start, "yyyy-MM-dd'T'HH:mm"),
      end: format(event.end, "yyyy-MM-dd'T'HH:mm"),
      position: event.position,
      candidate: event.candidate,
      meetingLink: event.meetingLink,
      interviewType: event.interviewType,
      interviewer: event.interviewer,
    });
    setShowForm(true);
  };

  const handleDeleteEvent = (event) => {
    const updatedEvents = events.filter((e) => e.id !== event.id);
    setEvents(updatedEvents);
    setGroupedEvents(groupEventsByDate(updatedEvents));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const event = {
      id: events.length + 1,
      ...newEvent,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end),
    };
    setEvents([...events, event]);
    setGroupedEvents(groupEventsByDate([...events, event]));
    setShowForm(false);
    setNewEvent({
      title: "",
      start: "",
      end: "",
      position: "",
      candidate: "",
      meetingLink: "",
      interviewType: "",
      interviewer: "",
    });
  };

  const handleUpdateEvent = (e) => {
    e.preventDefault();
    const updatedEvents = events.map((event) =>
      event.id === selectedEvent.id ? { ...event, ...newEvent } : event
    );
    setEvents(updatedEvents);
    setGroupedEvents(groupEventsByDate(updatedEvents));
    setShowForm(false);
    setSelectedEvent(null);
  };

  return (
    <div className="calendar-container" style={{ height: "100vh" }}>
      <div className="calendar-header">
        <h2>YOUR TODO'S</h2>
        <button className="create-schedule" onClick={() => setShowForm(true)}>
          + New Schedule
        </button>
      </div>

      {showForm && (
        <EventForm
          newEvent={newEvent}
          handleInputChange={handleInputChange}
          handleSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
          selectedEvent={selectedEvent}
          setShowForm={setShowForm}
        />
      )}

      <div
        className="calendar-wrapper"
        style={{ width: "100%", height: "100%" }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%", width: "100%" }}
          onSelectEvent={handleEventClick}
          view={view}
          onView={setView}
          date={currentDate}
          onNavigate={setCurrentDate}
          components={{
            event: (props) => (
              <EventComponent
                {...props}
                handleExpandClick={handleExpandClick}
                groupedEvents={groupedEvents}
              />
            ),
          }}
          selectable={false} // Make the calendar read-only
        />

        {expandedDate && groupedEvents[expandedDate]?.length > 1 && (
          <EventsSidebar
            expandedDate={expandedDate}
            groupedEvents={groupedEvents}
            setSelectedEvent={setSelectedEvent}
            handleEditEvent={handleEditEvent}
            handleDeleteEvent={handleDeleteEvent}
            setExpandedDate={setExpandedDate}
          />
        )}
      </div>

      {selectedEvent && (
        <EventModal
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          setResume={setResume}
          setAadhar={setAadhar}
          resume={resume}
          aadhar={aadhar}
        />
      )}
    </div>
  );
};

export default CalendarComponent;
