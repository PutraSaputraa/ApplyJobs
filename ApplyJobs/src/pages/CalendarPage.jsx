import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarPlus, ExternalLink } from "lucide-react";
import { useApplications } from "../hooks/useApplications";
import { useEvents } from "../hooks/useEvents";
import { useAuth } from "../hooks/useAuth";
import { Modal, Empty } from "../components/common/UI";
import EventForm from "../components/calendar/EventForm";
import { createEvent, updateEvent } from "../services/eventService";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/format";
export default function CalendarPage() {
  const { user } = useAuth();
  const { data: apps } = useApplications();
  const { data: events } = useEvents();
  const [form, setForm] = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const calendarEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    start: `${e.date}${e.startTime ? `T${e.startTime}` : ""}`,
    end: e.endTime ? `${e.date}T${e.endTime}` : undefined,
    backgroundColor: e.isCompleted
      ? "#94a3b8"
      : e.eventType.includes("Interview")
        ? "#7056e8"
        : e.eventType.includes("Assessment")
          ? "#e59b2f"
          : e.eventType.includes("Follow")
            ? "#0f9f8d"
            : "#3c79e6",
    extendedProps: e,
  }));
  const save = async (f) => {
    setSaving(true);
    if (f.id) await updateEvent(f.id, f);
    else await createEvent(user.uid, f);
    setSaving(false);
    setForm(null);
  };
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <span className="eyebrow">Plan your next move</span>
          <h1>Calendar</h1>
          <p>
            Interviews, assessments, follow-ups, and deadlines in one place.
          </p>
        </div>
        <button className="btn primary" onClick={() => setForm({})}>
          <CalendarPlus />
          Add event
        </button>
      </header>
      <section className="panel calendar-panel">
        {events.length ? (
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
            ]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,listMonth",
            }}
            events={calendarEvents}
            eventClick={({ event }) => setSelected(event.extendedProps)}
            height="auto"
          />
        ) : (
          <Empty
            title="Your calendar is open"
            text="Add an event to see your recruitment schedule here."
            action={
              <button className="btn primary" onClick={() => setForm({})}>
                <CalendarPlus />
                Add event
              </button>
            }
          />
        )}
      </section>
      {form && (
        <Modal
          wide
          title={form.id ? "Edit event" : "Add event"}
          onClose={() => setForm(null)}
        >
          <EventForm
            applications={apps}
            initial={form}
            onSubmit={save}
            saving={saving}
          />
        </Modal>
      )}
      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <div className="event-detail">
            <span className="eyebrow">{selected.eventType}</span>
            <div className="info-grid">
              <div>
                <span>Date</span>
                <strong>{formatDate(selected.date)}</strong>
              </div>
              <div>
                <span>Time</span>
                <strong>
                  {selected.startTime}–{selected.endTime}
                </strong>
              </div>
              <div>
                <span>Mode</span>
                <strong>{selected.mode}</strong>
              </div>
              <div>
                <span>Location</span>
                <strong>{selected.location || "—"}</strong>
              </div>
            </div>
            {selected.notes && <p>{selected.notes}</p>}
            <div className="modal-actions">
              {selected.meetingLink && (
                <a
                  className="btn secondary"
                  href={selected.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Join meeting <ExternalLink />
                </a>
              )}
              <Link
                className="btn primary"
                to={`/applications/${selected.applicationId}`}
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
