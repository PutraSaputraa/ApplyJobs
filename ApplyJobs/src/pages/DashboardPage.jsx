import {
  ArrowUpRight,
  CheckCircle2,
  Plus,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApplications } from "../hooks/useApplications";
import { useEvents } from "../hooks/useEvents";
import { Empty, Spinner, StatusBadge } from "../components/common/UI";
import { autoBadges } from "../utils/applicationStatus";
import applicationMetric from "../assets/metric-application.jpg";
import pipelineMetric from "../assets/metric-pipeline.jpg";
import interviewMetric from "../assets/metric-interview.jpg";
import offerMetric from "../assets/metric-offer.jpg";
export default function DashboardPage() {
  const { user } = useAuth();
  const { data: apps, loading } = useApplications();
  const { data: events } = useEvents();
  if (loading) return <Spinner label="Preparing your overview..." />;
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events
    .filter((e) => !e.isCompleted && e.date >= today)
    .sort((a, b) =>
      `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
    )
    .slice(0, 5);
  const active = apps.filter(
    (a) =>
      !["Accepted", "Rejected", "Withdrawn", "Closed"].includes(
        a.currentStatus,
      ),
  ).length;
  const reached = (set) =>
    apps.filter((a) => set.includes(a.currentStatus)).length;
  const total = apps.length;
  const metrics = [
    ["Total applications", total, applicationMetric],
    ["Active pipeline", active, pipelineMetric],
    ["Interviews", reached(["Interview"]), interviewMetric],
    ["Offers & accepted", reached(["Offer", "Accepted"]), offerMetric],
  ];
  const conversions = [
    [
      "Response rate",
      total
        ? Math.round(
            (reached([
              "Screening",
              "Assessment",
              "Interview",
              "Offer",
              "Accepted",
              "Rejected",
            ]) /
              Math.max(
                reached([
                  "Applied",
                  "Screening",
                  "Assessment",
                  "Interview",
                  "Offer",
                  "Accepted",
                  "Rejected",
                ]),
                1,
              )) *
              100,
          )
        : 0,
    ],
    [
      "Interview rate",
      total
        ? Math.round(
            (reached(["Interview", "Offer", "Accepted"]) / total) * 100,
          )
        : 0,
    ],
    [
      "Offer rate",
      total ? Math.round((reached(["Offer", "Accepted"]) / total) * 100) : 0,
    ],
    [
      "Acceptance rate",
      reached(["Offer", "Accepted"])
        ? Math.round(
            (reached(["Accepted"]) / reached(["Offer", "Accepted"])) * 100,
          )
        : 0,
    ],
  ];
  const reminders = apps
    .filter((a) =>
      autoBadges(a).some(
        (b) =>
          b.includes("Overdue") ||
          b.includes("Today") ||
          b.includes("No Response"),
      ),
    )
    .slice(0, 4);
  const hour = new Date().getHours();
  return (
    <div className="page dashboard">
      <header className="page-head hero-head">
        <div>
          <span className="eyebrow">
            {new Intl.DateTimeFormat("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            }).format(new Date())}
          </span>
          <h1>
            Good {hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"},{" "}
            {user.displayName?.split(" ")[0] || "there"}.
          </h1>
          <p>Here’s what’s moving in your job search.</p>
        </div>
        <Link className="btn primary" to="/applications/new">
          <Plus />
          Add application
        </Link>
      </header>
      <section className="metrics">
        {metrics.map(([label, value, icon]) => (
          <article className="metric" key={label}>
            <span className="metric-icon image">
              <img src={icon} alt="" aria-hidden="true" />
            </span>
            <div>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </article>
        ))}
      </section>
      <div className="dashboard-grid">
        <section className="panel span-2">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Next up</span>
              <h2>Upcoming schedule</h2>
            </div>
            <Link to="/calendar">
              View calendar <ArrowUpRight size={16} />
            </Link>
          </div>
          {upcoming.length ? (
            <div className="schedule-list">
              {upcoming.map((e) => {
                const a = apps.find((x) => x.id === e.applicationId);
                return (
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
                      <strong>{e.title}</strong>
                      <p>
                        {a?.companyName} · {a?.jobTitle}
                      </p>
                    </div>
                    <div className="schedule-meta">
                      <span>{e.startTime || "All day"}</span>
                      <small>{e.mode}</small>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <Empty
              title="A clear calendar"
              text="No upcoming events. Add one from the calendar or an application."
            />
          )}
        </section>
        <div className="dashboard-insights">
          <section className="panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">Funnel health</span>
                <h2>Conversion</h2>
              </div>
              <Sparkles size={20} />
            </div>
            <div className="conversion-list">
              {conversions.map(([label, value]) => (
                <div key={label}>
                  <div>
                    <span>{label}</span>
                    <strong>{value}%</strong>
                  </div>
                  <div className="progress">
                    <i style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">Pipeline</span>
                <h2>Status snapshot</h2>
              </div>
            </div>
            <div className="status-summary">
              {[
                "Applied",
                "Screening",
                "Assessment",
                "Interview",
                "Offer",
                "Accepted",
              ].map((s) => (
                <div key={s}>
                  <StatusBadge status={s} />
                  <strong>
                    {apps.filter((a) => a.currentStatus === s).length}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        </div>
        <section className="panel span-2">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Needs attention</span>
              <h2>Follow-up reminders</h2>
            </div>
          </div>
          {reminders.length ? (
            <div className="reminders">
              {reminders.map((a) => (
                <Link to={`/applications/${a.id}`} key={a.id}>
                  <div>
                    <strong>{a.companyName}</strong>
                    <p>{a.jobTitle}</p>
                  </div>
                  <span className="auto danger">
                    {autoBadges(a).find((b) => !b.includes("Waiting"))}
                  </span>
                  <ArrowUpRight size={18} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="all-clear">
              <CheckCircle2 />
              <div>
                <strong>You're all caught up</strong>
                <p>No applications need your attention today.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
