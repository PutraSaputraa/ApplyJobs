import { X, AlertCircle, LoaderCircle } from "lucide-react";
import { statusTone, autoBadges } from "../../utils/applicationStatus";

export function Spinner({ label = "Loading..." }) {
  return (
    <div className="empty">
      <LoaderCircle className="spin" />
      <p>{label}</p>
    </div>
  );
}
export function Empty({ title, text, action }) {
  return (
    <div className="empty">
      <div className="empty-icon">✦</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
export function ErrorMessage({ message }) {
  return (
    message && (
      <div className="error">
        <AlertCircle size={17} />
        {message}
      </div>
    )
  );
}
export function StatusBadge({ status }) {
  return (
    <span className={`badge ${statusTone[status] || "slate"}`}>
      <i />
      {status}
    </span>
  );
}
export function AutoBadges({ application }) {
  return (
    <div className="auto-badges">
      {autoBadges(application).map((b) => (
        <span
          key={b}
          className={
            b.includes("Overdue") || b.includes("No Response")
              ? "auto danger"
              : "auto"
          }
        >
          {b}
        </span>
      ))}
    </div>
  );
}
export function Modal({ title, children, onClose, wide = false }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        className={`modal ${wide ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <header>
          <div>
            <span className="eyebrow">ApplyJobz</span>
            <h2>{title}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
export function ConfirmModal({ onClose, onConfirm, loading }) {
  return (
    <Modal title="Delete application?" onClose={onClose}>
      <p className="modal-copy">
        This application and all related events, status history, and activity
        logs will be permanently removed.
      </p>
      <div className="modal-actions">
        <button className="btn secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn danger" disabled={loading} onClick={onConfirm}>
          {loading ? "Deleting..." : "Delete application"}
        </button>
      </div>
    </Modal>
  );
}
