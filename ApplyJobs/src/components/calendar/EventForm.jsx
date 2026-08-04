import { useState } from "react";
const base = {
  applicationId: "",
  eventType: "HR Interview",
  title: "",
  date: "",
  startTime: "09:00",
  endTime: "10:00",
  mode: "Online",
  location: "",
  meetingLink: "",
  contactPerson: "",
  notes: "",
  reminder: "1 Day Before",
  isCompleted: false,
};
export default function EventForm({ applications, initial, onSubmit, saving }) {
  const [f, setF] = useState({ ...base, ...initial });
  const change = (k, v) => setF((x) => ({ ...x, [k]: v }));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(f);
      }}
      className="event-form"
    >
      <label>
        <span>Application *</span>
        <select
          required
          value={f.applicationId}
          onChange={(e) => change("applicationId", e.target.value)}
        >
          <option value="">Select an application</option>
          {applications.map((a) => (
            <option key={a.id} value={a.id}>
              {a.companyName} — {a.jobTitle}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Event type</span>
        <select
          value={f.eventType}
          onChange={(e) => change("eventType", e.target.value)}
        >
          {[
            "HR Interview",
            "User Interview",
            "Technical Interview",
            "Final Interview",
            "Live Coding",
            "Assessment",
            "Follow-up",
            "Document Submission",
            "Offer Deadline",
            "Onboarding",
            "Other",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label className="span-2">
        <span>Title *</span>
        <input
          required
          value={f.title}
          onChange={(e) => change("title", e.target.value)}
        />
      </label>
      <label>
        <span>Date *</span>
        <input
          required
          type="date"
          value={f.date}
          onChange={(e) => change("date", e.target.value)}
        />
      </label>
      <label>
        <span>Mode</span>
        <select value={f.mode} onChange={(e) => change("mode", e.target.value)}>
          {["Online", "Offline", "Hybrid"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Start time</span>
        <input
          type="time"
          value={f.startTime}
          onChange={(e) => change("startTime", e.target.value)}
        />
      </label>
      <label>
        <span>End time</span>
        <input
          type="time"
          value={f.endTime}
          onChange={(e) => change("endTime", e.target.value)}
        />
      </label>
      {f.mode !== "Offline" && (
        <label className="span-2">
          <span>Meeting link</span>
          <input
            type="url"
            value={f.meetingLink}
            onChange={(e) => change("meetingLink", e.target.value)}
          />
        </label>
      )}
      {f.mode !== "Online" && (
        <label className="span-2">
          <span>Location</span>
          <input
            required
            value={f.location}
            onChange={(e) => change("location", e.target.value)}
          />
        </label>
      )}
      <label className="span-2">
        <span>Notes</span>
        <textarea
          rows="3"
          value={f.notes}
          onChange={(e) => change("notes", e.target.value)}
        />
      </label>
      <button className="btn primary span-2" disabled={saving}>
        {saving ? "Saving..." : "Save event"}
      </button>
    </form>
  );
}
