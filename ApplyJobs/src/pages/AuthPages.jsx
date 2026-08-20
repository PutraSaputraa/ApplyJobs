import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { ErrorMessage } from "../components/common/UI";

const friendly = (e) =>
  ({
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/weak-password": "Password must contain at least 6 characters.",
  })[e.code] || "Something went wrong. Please try again.";
function AuthPage() {
  const [f, setF] = useState({
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (f.password.length < 6)
      return setError("Password must contain at least 6 characters.");
    try {
      setLoading(true);
      await login(f.email, f.password);
      navigate("/");
    } catch (err) {
      setError(friendly(err));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <section className="auth-brand">
        <div className="brand light">
          <span className="brandmark">
            <BriefcaseBusiness />
          </span>
          <span>ApplyJobz</span>
        </div>
        <div>
          <span className="eyebrow light">Your career command center</span>
          <h1>Turn every application into a clear next step.</h1>
          <p>
            Organize opportunities, stay ahead of interviews, and understand
            your job search at a glance.
          </p>
        </div>
        <div className="auth-quote">
          “A calm, focused place for the work behind finding work.”
        </div>
      </section>
      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <span className="eyebrow">
            Selamat datang kembali
          </span>
          <h2>Masuk ke akunmu</h2>
          <p>Lanjutkan progres dan aktivitasmu hari ini.</p>
          <ErrorMessage message={error} />
          <label>
            <span>Username</span>
            <div className="auth-input">
              <UserRound />
              <input
                required
                type="email"
                autoComplete="email"
                value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })}
                placeholder="Masukkan username"
                aria-label="Username"
              />
            </div>
          </label>
          <label>
            <span>Password</span>
            <div className="password">
              <LockKeyhole className="password-leading-icon" />
              <input
                required
                minLength="6"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={f.password}
                onChange={(e) => setF({ ...f, password: e.target.value })}
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label="Toggle password"
              >
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>
          <button className="btn primary auth-submit" disabled={loading}>
            {loading
              ? "Mohon tunggu..."
              : "Masuk ke ApplyJobz"}
            {!loading && <ArrowRight />}
          </button>
          <p className="switch">
            Belum punya akun? Hubungi admin ApplyJobz untuk membeli akses.
          </p>
        </form>
      </section>
    </div>
  );
}
export const LoginPage = () => <AuthPage />;
