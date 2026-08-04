import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CalendarPlus,
  ExternalLink,
  MapPin,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";
import { useApplications } from "../hooks/useApplications";
import { useEvents } from "../hooks/useEvents";
import { useUserCollection } from "../hooks/useCollection";
import { useAuth } from "../hooks/useAuth";
import {
  ConfirmModal,
  Empty,
  Modal,
  Spinner,
  StatusBadge,
} from "../components/common/UI";
import EventForm from "../components/calendar/EventForm";
import { createEvent } from "../services/eventService";
import {
  deleteApplication,
  updateApplication,
} from "../services/applicationService";
import { STATUSES } from "../utils/applicationStatus";
import { formatDate, formatSalary } from "../utils/format";
export default function ApplicationDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const { data: apps, loading } = useApplications();
  const { data: events } = useEvents();
  const { data: logs } = useUserCollection("activityLogs");
  const [eventOpen, setEventOpen] = useState(false);
  const [del, setDel] = useState(false);
  const [saving, setSaving] = useState(false);
  const a = apps.find((x) => x.id === id);
  if (loading) return <Spinner />;
  if (!a)
    return (
      <Empty
        title="Application not found"
        text="It may have been deleted."
        action={
          <Link className="btn primary" to="/applications">
            Back to applications
          </Link>
        }
      />
    );
  const appEvents = events
    .filter((e) => e.applicationId === id)
    .sort((x, y) => x.date.localeCompare(y.date));
  const appLogs = logs
    .filter((l) => l.applicationId === id)
    .sort((x, y) => (y.createdAt?.seconds || 0) - (x.createdAt?.seconds || 0));
  const status = async (next) => {
    if (next === a.currentStatus) return;
    setSaving(true);
    await updateApplication(
      user.uid,
      id,
      { ...a, currentStatus: next },
      a.currentStatus,
    );
    setSaving(false);
  };
  return (
    <div className="page">
      <Link className="back" to="/applications">
        <ArrowLeft />
        Back to applications
      </Link>
      <header className="detail-hero">
        <div className="company-logo">{a.companyName[0]}</div>
        <div>
          <span className="eyebrow">Application detail</span>
          <h1>{a.jobTitle}</h1>
          <p>
            <Building2 /> {a.companyName} <i /> <MapPin /> {a.location}
          </p>
        </div>
        <div className="detail-actions">
          <Link className="btn secondary" to={`/applications/${id}/edit`}>
            <Pencil />
            Edit
          </Link>
          <button
            className="btn secondary danger-text"
            onClick={() => setDel(true)}
          >
            <Trash2 />
            Delete
          </button>
        </div>
      </header>
      <div className="detail-grid">
        <div className="detail-main">
          <section className="panel detail-status">
            <div>
              <span>Current status</span>
              <StatusBadge status={a.currentStatus} />
            </div>
            <label>
              <span>Move application to</span>
              <select
                disabled={saving}
                value={a.currentStatus}
                onChange={(e) => status(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </section>
          <section className="panel">
            <div className="panel-head">
              <h2>Job information</h2>
              {a.sourceLink && (
                <a
                  className="text-link"
                  href={a.sourceLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open job vacancy <ExternalLink />
                </a>
              )}
            </div>
            <div className="info-grid">
              {[
                ["Company", a.companyName],
                ["Role", a.jobTitle],
                ["Location", a.location],
                ["Work arrangement", a.workArrangement],
                ["Job type", a.jobType],
                ["Applied on", formatDate(a.applicationDate)],
                ["Source", a.source || "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <span>{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>
            {a.jobDescription && (
              <div className="prose">
                <span>Description</span>
                <p>{a.jobDescription}</p>
              </div>
            )}
          </section>
          <section className="panel">
            <div className="panel-head">
              <h2>Schedule</h2>
              <button
                className="btn secondary small"
                onClick={() => setEventOpen(true)}
              >
                <CalendarPlus />
                Add event
              </button>
            </div>
            {appEvents.length ? (
              <div className="event-list">
                {appEvents.map((e) => (
                  <article key={e.id}>
                    <div className="date-tile">
                      <strong>
                        {new Date(`${e.date}T00:00:00`).getDate()}
                      </strong>
                      <span>
                        {new Date(`${e.date}T00:00:00`).toLocaleString("en", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div>
                      <StatusBadge
                        status={e.isCompleted ? "Accepted" : "Interview"}
                      />
                      <h3>{e.title}</h3>
                      <p>
                        {e.startTime}–{e.endTime} · {e.mode}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <Empty
                title="Nothing scheduled"
                text="Add interviews, assessments, follow-ups, or deadlines."
              />
            )}
          </section>
        </div>
        <aside className="detail-side">
          <section className="panel">
            <h2>Key details</h2>
            <div className="side-info">
              <div>
                <span>Salary</span>
                <strong>{formatSalary(a)}</strong>
                <small>{a.salaryPeriod}</small>
              </div>
              <div>
                <span>Priority</span>
                <strong>{a.priority}</strong>
              </div>
              <div>
                <span>Follow-up</span>
                <strong>{formatDate(a.followUpDate)}</strong>
              </div>
            </div>
          </section>
          <section className="panel">
            <h2>Contact</h2>
            {a.contactPersonName ? (
              <div className="contact">
                <span>
                  <UserRound />
                </span>
                <div>
                  <strong>{a.contactPersonName}</strong>
                  <p>{a.contactPersonRole}</p>
                  <small>
                    {a.contactMethod}: {a.contactInformation}
                  </small>
                </div>
              </div>
            ) : (
              <p className="muted">No contact person added.</p>
            )}
          </section>
          <section className="panel">
            <h2>Notes & tags</h2>
            <p className="notes">{a.notes || "No notes added."}</p>
            <div className="tags">
              {a.tags?.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </section>
          <section className="panel">
            <h2>Activity</h2>
            {appLogs.length ? (
              <div className="timeline">
                {appLogs.map((l) => (
                  <div key={l.id}>
                    <i />
                    <div>
                      <strong>{l.description}</strong>
                      <small>
                        {l.createdAt?.toDate?.().toLocaleString() || "Just now"}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">No activity yet.</p>
            )}
          </section>
        </aside>
      </div>
      {eventOpen && (
        <Modal title="Add schedule" wide onClose={() => setEventOpen(false)}>
          <EventForm
            applications={apps}
            initial={{
              applicationId: id,
              title: `${a.companyName} — ${a.jobTitle}`,
            }}
            saving={saving}
            onSubmit={async (f) => {
              setSaving(true);
              await createEvent(user.uid, f);
              setSaving(false);
              setEventOpen(false);
            }}
          />
        </Modal>
      )}
      {del && (
        <ConfirmModal
          onClose={() => setDel(false)}
          onConfirm={async () => {
            setSaving(true);
            await deleteApplication(user.uid, id);
            nav("/applications");
          }}
          loading={saving}
        />
      )}
    </div>
  );
}
