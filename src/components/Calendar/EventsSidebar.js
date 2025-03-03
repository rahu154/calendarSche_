import { format } from "date-fns";
import React from "react";

const EventsSidebar = ({
  expandedDate,
  groupedEvents,
  setSelectedEvent,
  handleEditEvent,
  handleDeleteEvent,
  setExpandedDate,
}) => {
  return (
    <div className="events-sidebar">
      <h3>Meetings</h3>
      <button onClick={() => setExpandedDate(null)}>X</button>
      {groupedEvents[expandedDate].map((event, index) => (
        <div key={event.id} className="sidebar-event">
          <button
            className="event-details-button"
            onClick={() => setSelectedEvent(event)}
          >
            ›
          </button>
          <div className="sidebar-event-content">
            <div>{event.position}</div>
            <div className="event-round">
              <small>{event.title}</small>
            </div>
            <div>
              <small>Interviewer:{event.interviewer}</small>
            </div>
            <div className="event-date">
              <small>Date:{format(event.start, "dd MMM yyyy")}</small>
            </div>
            <div className="event-time">
              {format(event.start, "hh:mm a")} - {format(event.end, "hh:mm a")}
            </div>
            <div className="event-actions">
              <button
                className="edit-button"
                onClick={() => handleEditEvent(event)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteEvent(event)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsSidebar;
