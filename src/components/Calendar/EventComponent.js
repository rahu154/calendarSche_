import { format } from "date-fns";
import React from "react";

const EventComponent = ({ event, handleExpandClick, groupedEvents }) => {
  const dateKey = format(event.start, "yyyy-MM-dd");
  const eventsCount = groupedEvents[dateKey]?.length || 0;

  return (
    <div className="custom-event">
      {eventsCount > 1 && (
        <div className="event-count-badge">{eventsCount}</div>
      )}
      <button
        className="event-expand-button"
        onClick={(e) => {
          e.stopPropagation();
          handleExpandClick(dateKey);
        }}
      >
        ›
      </button>
      <div className="event-main-content">
        <strong>{event.title}</strong>
        <div>{format(event.start, "hh:mm a")}</div>
      </div>
    </div>
  );
};

export default EventComponent;
