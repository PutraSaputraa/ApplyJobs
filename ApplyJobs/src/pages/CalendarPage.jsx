import { useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  MapPin,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import EventForm from "../components/calendar/EventForm";
import { Empty, Modal } from "../components/common/UI";
import { useApplications } from "../hooks/useApplications";
import { useAuth } from "../hooks/useAuth";
import { useEvents } from "../hooks/useEvents";
import { createEvent, updateEvent } from "../services/eventService";
import { formatDate } from "../utils/format";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthDays(month) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

function eventTone(eventType = "") {
  if (eventType.includes("Interview")) return "purple";
  if (eventType.includes("Assessment") || eventType.includes("Coding"))
    return "amber";
  if (eventType.includes("Follow-up")) return "blue";
  if (eventType.includes("Deadline")) return "red";
  if (eventType.includes("Onboarding")) return "green";
  return "slate";
}

export default function CalendarPage() {
  const { user } = useAuth();
  const { data: applications } = useApplications();
  const { data: events } = useEvents();
  const todayKey = toDateKey(new Date());
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [form, setForm] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [saving, setSaving] = useState(false);

  const monthDays = useMemo(() => getMonthDays(month), [month]);
  const eventsByDate = useMemo(() => {
    return events.reduce((grouped, event) => {
      if (!grouped[event.date]) grouped[event.date] = [];
      grouped[event.date].push(event);
      grouped[event.date].sort((a, b) =>
        (a.startTime || "").localeCompare(b.startTime || ""),
      );
      return grouped;
    }, {});
  }, [events]);
  const selectedEvents = eventsByDate[selectedDate] || [];

  const changeMonth = (offset) => {
    setMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  };

  const goToday = () => {
    const today = new Date();
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(toDateKey(today));
  };

  const saveEvent = async (event) => {
    setSaving(true);
    try {
      if (event.id) await updateEvent(event.id, event);
      else await createEvent(user.uid, event);
      setForm(null);
    } finally {
      setSaving(false);
    }
  };

  const markCompleted = async () => {
    setSaving(true);
    try {
      await updateEvent(selectedEvent.id, {
        ...selectedEvent,
        isCompleted: !selectedEvent.isCompleted,
      });
      setSelectedEvent(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <header className="page-head calendar-page-head">
        <div>
          <span className="eyebrow">Plan your next move</span>
          <h1>Calendar</h1>
          <p>
            Interviews, assessments, follow-ups, and deadlines in one place.
          </p>
        </div>
        <button
          className="btn primary"
          onClick={() => setForm({ date: selectedDate })}
        >
          <CalendarPlus />
          Add event
        </button>
      </header>

      <div className="job-calendar-layout">
        <section className="job-calendar-card">
          <header className="job-calendar-header">
            <div className="job-calendar-navigation">
              <button
                className="calendar-icon-button"
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
              >
                <ChevronLeft />
              </button>
              <h2>
                {new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  year: "numeric",
                }).format(month)}
              </h2>
              <button
                className="calendar-icon-button"
                onClick={() => changeMonth(1)}
                aria-label="Next month"
              >
                <ChevronRight />
              </button>
            </div>
            <button className="btn secondary small" onClick={goToday}>
              Today
            </button>
          </header>

          <div className="job-calendar-weekdays">
            {DAY_NAMES.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="job-calendar-grid">
            {monthDays.map((day) => {
              const dateKey = toDateKey(day);
              const dayEvents = eventsByDate[dateKey] || [];
              const outside = day.getMonth() !== month.getMonth();
              const selected = selectedDate === dateKey;
              const today = todayKey === dateKey;

              return (
                <button
                  key={dateKey}
                  className={`job-calendar-day ${outside ? "outside" : ""} ${selected ? "selected" : ""} ${today ? "today" : ""}`}
                  onClick={() => setSelectedDate(dateKey)}
                  aria-label={`Select ${formatDate(dateKey)}`}
                >
                  <span className="job-calendar-day-number">
                    {day.getDate()}
                  </span>
                  <span className="job-calendar-events">
                    {dayEvents.slice(0, 2).map((event) => (
                      <span
                        className={`job-calendar-event ${eventTone(event.eventType)}`}
                        key={event.id}
                      >
                        <i />
                        {event.startTime && `${event.startTime} `}
                        {event.title}
                      </span>
                    ))}
                    {dayEvents.length > 2 && (
                      <small>+{dayEvents.length - 2} more</small>
                    )}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="job-calendar-mobile-dots">
                      {dayEvents.slice(0, 3).map((event) => (
                        <i
                          className={eventTone(event.eventType)}
                          key={event.id}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <footer className="job-calendar-legend">
            <span>
              <i className="purple" /> Interview
            </span>
            <span>
              <i className="amber" /> Assessment
            </span>
            <span>
              <i className="blue" /> Follow-up
            </span>
            <span>
              <i className="red" /> Deadline
            </span>
          </footer>
        </section>

        <aside className="selected-day-panel">
          <header>
            <div>
              <span>
                {new Intl.DateTimeFormat("en-US", {
                  weekday: "long",
                }).format(new Date(`${selectedDate}T12:00:00`))}
              </span>
              <h2>
                {new Intl.DateTimeFormat("en-US", {
                  day: "numeric",
                  month: "long",
                }).format(new Date(`${selectedDate}T12:00:00`))}
              </h2>
            </div>
            {selectedDate === todayKey && <b>Today</b>}
          </header>

          <div className="selected-day-title">
            <span>
              Schedule <b>{selectedEvents.length}</b>
            </span>
            <button
              onClick={() => setForm({ date: selectedDate })}
              aria-label="Add event on selected date"
            >
              <Plus />
            </button>
          </div>

          {selectedEvents.length ? (
            <div className="selected-event-list">
              {selectedEvents.map((event) => {
                const application = applications.find(
                  (item) => item.id === event.applicationId,
                );
                return (
                  <button
                    key={event.id}
                    className={event.isCompleted ? "completed" : ""}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <span className={`event-line ${eventTone(event.eventType)}`} />
                    <span className="event-time">
                      {event.startTime || "All day"}
                    </span>
                    <span className="event-main">
                      <strong>{event.title}</strong>
                      <small>
                        {application?.companyName || event.eventType}
                      </small>
                    </span>
                    {event.isCompleted && <CheckCircle2 />}
                  </button>
                );
              })}
            </div>
          ) : (
            <Empty
              title="No schedule"
              text="There are no recruitment events on this date."
              action={
                <button
                  className="btn secondary small"
                  onClick={() => setForm({ date: selectedDate })}
                >
                  <Plus /> Add event
                </button>
              }
            />
          )}
        </aside>
      </div>

      {form && (
        <Modal
          wide
          title={form.id ? "Edit event" : "Add event"}
          onClose={() => setForm(null)}
        >
          <EventForm
            applications={applications}
            initial={form}
            onSubmit={saveEvent}
            saving={saving}
          />
        </Modal>
      )}

      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          onClose={() => setSelectedEvent(null)}
        >
          <div className="event-detail">
            <span className="eyebrow">{selectedEvent.eventType}</span>
            <div className="calendar-detail-list">
              <div>
                <CalendarDays />
                <span>
                  <small>Date</small>
                  <strong>{formatDate(selectedEvent.date)}</strong>
                </span>
              </div>
              <div>
                <Clock3 />
                <span>
                  <small>Time</small>
                  <strong>
                    {selectedEvent.startTime || "All day"}
                    {selectedEvent.endTime && `–${selectedEvent.endTime}`}
                  </strong>
                </span>
              </div>
              <div>
                <MapPin />
                <span>
                  <small>{selectedEvent.mode}</small>
                  <strong>{selectedEvent.location || "Online"}</strong>
                </span>
              </div>
            </div>
            {selectedEvent.notes && <p>{selectedEvent.notes}</p>}
            <div className="modal-actions calendar-modal-actions">
              <button
                className="btn secondary"
                disabled={saving}
                onClick={markCompleted}
              >
                <CheckCircle2 />
                {selectedEvent.isCompleted ? "Mark active" : "Mark completed"}
              </button>
              {selectedEvent.meetingLink && (
                <a
                  className="btn secondary"
                  href={selectedEvent.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Join <ExternalLink />
                </a>
              )}
              <Link
                className="btn primary"
                to={`/applications/${selectedEvent.applicationId}`}
              >
                View application
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
