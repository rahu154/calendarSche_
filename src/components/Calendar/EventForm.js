import React from "react";

const EventForm = ({
  newEvent,
  handleInputChange,
  handleSubmit,
  selectedEvent,
  setShowForm,
}) => {
  return (
    <div className="event-form-modal">
      <div className="modal-content">
        <button className="close-button" onClick={() => setShowForm(false)}>
          ×
        </button>
        <h3>{selectedEvent ? "Edit Event" : "Create New Event"}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Start Date and Time:
            <input
              type="datetime-local"
              name="start"
              value={newEvent.start}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            End Date and Time:
            <input
              type="datetime-local"
              name="end"
              value={newEvent.end}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Position:
            <input
              type="text"
              name="position"
              value={newEvent.position}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Candidate:
            <input
              type="text"
              name="candidate"
              value={newEvent.candidate}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Meeting Link:
            <input
              type="url"
              name="meetingLink"
              value={newEvent.meetingLink}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Interview Type:
            <input
              type="text"
              name="interviewType"
              value={newEvent.interviewType}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Interviewer:
            <input
              type="text"
              name="interviewer"
              value={newEvent.interviewer}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">
            {selectedEvent ? "Update Event" : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
