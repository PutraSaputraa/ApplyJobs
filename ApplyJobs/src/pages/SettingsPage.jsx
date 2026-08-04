import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { Save } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { db } from "../services/firebase";
import { Empty, ErrorMessage, Spinner } from "../components/common/UI";
export default function SettingsPage() {
  const { user } = useAuth();
  const [f, setF] = useState({
    fullName: user.displayName || "",
    noResponseThreshold: 7,
    defaultCurrency: "IDR",
    defaultSalaryPeriod: "Per Month",
    calendarView: "dayGridMonth",
    theme: "light",
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      setLoading(true);
      setError("");

      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));

        if (active && snapshot.exists()) {
          setF((current) => ({
            ...current,
            fullName: snapshot.data().fullName,
            ...snapshot.data().preferences,
          }));
        }
      } catch (loadError) {
        if (!active) return;

        setError(
          loadError.code === "permission-denied"
            ? "Firestore rejected this request. Publish the ApplyJobz security rules, then try again."
            : "Failed to load your settings. Please try again.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, [reloadKey, user]);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { fullName, ...preferences } = f;
      await setDoc(
        doc(db, "users", user.uid),
        {
          userId: user.uid,
          fullName,
          email: user.email,
          preferences,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      document.documentElement.dataset.theme = f.theme;
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (saveError) {
      setError(
        saveError.code === "permission-denied"
          ? "Firestore rejected this update. Publish the ApplyJobz security rules, then try again."
          : "Failed to save your settings. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error && !saved)
    return (
      <Empty
        title="Settings could not be loaded"
        text={error}
        action={
          <button
            className="btn primary"
            onClick={() => setReloadKey((key) => key + 1)}
          >
            Try again
          </button>
        }
      />
    );

  return (
    <div className="page settings">
      <header className="page-head">
        <div>
          <span className="eyebrow">Make it yours</span>
          <h1>Settings</h1>
          <p>Manage your profile, defaults, and workspace appearance.</p>
        </div>
      </header>
      <ErrorMessage message={error} />
      <form onSubmit={save}>
        <section className="panel settings-section">
          <div>
            <span className="eyebrow">01</span>
            <h2>Profile</h2>
            <p>Your account information.</p>
          </div>
          <div className="settings-fields">
            <label>
              <span>Full name</span>
              <input
                value={f.fullName}
                onChange={(e) => setF({ ...f, fullName: e.target.value })}
              />
            </label>
            <label>
              <span>Email address</span>
              <input value={user.email} disabled />
            </label>
          </div>
        </section>
        <section className="panel settings-section">
          <div>
            <span className="eyebrow">02</span>
            <h2>Application preferences</h2>
            <p>Defaults for new opportunities.</p>
          </div>
          <div className="settings-fields">
            <label>
              <span>No response threshold</span>
              <select
                value={f.noResponseThreshold}
                onChange={(e) =>
                  setF({ ...f, noResponseThreshold: +e.target.value })
                }
              >
                {[3, 5, 7, 10, 14].map((n) => (
                  <option value={n} key={n}>
                    {n} Days
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Default currency</span>
              <select
                value={f.defaultCurrency}
                onChange={(e) =>
                  setF({ ...f, defaultCurrency: e.target.value })
                }
              >
                {["IDR", "USD", "SGD", "MYR", "EUR"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Salary period</span>
              <select
                value={f.defaultSalaryPeriod}
                onChange={(e) =>
                  setF({ ...f, defaultSalaryPeriod: e.target.value })
                }
              >
                {["Per Hour", "Per Month", "Per Year", "Per Project"].map(
                  (x) => (
                    <option key={x}>{x}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              <span>Calendar view</span>
              <select
                value={f.calendarView}
                onChange={(e) => setF({ ...f, calendarView: e.target.value })}
              >
                <option value="dayGridMonth">Month</option>
                <option value="timeGridWeek">Week</option>
                <option value="listMonth">List</option>
              </select>
            </label>
          </div>
        </section>
        <section className="panel settings-section">
          <div>
            <span className="eyebrow">03</span>
            <h2>Appearance</h2>
            <p>Choose your preferred theme.</p>
          </div>
          <div className="theme-options">
            {["light", "dark", "system"].map((x) => (
              <label key={x} className={f.theme === x ? "active" : ""}>
                <input
                  type="radio"
                  name="theme"
                  value={x}
                  checked={f.theme === x}
                  onChange={(e) => setF({ ...f, theme: e.target.value })}
                />
                <strong>{x[0].toUpperCase() + x.slice(1)}</strong>
                <span>
                  {x === "light"
                    ? "Bright and focused"
                    : x === "dark"
                      ? "Easy on the eyes"
                      : "Match your device"}
                </span>
              </label>
            ))}
          </div>
        </section>
        <div className="settings-save">
          <span>{saved ? "Preferences saved successfully." : ""}</span>
          <button className="btn primary">
            <Save />
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
