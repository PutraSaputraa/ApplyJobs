import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../services/authService";
import { ErrorMessage } from "../components/common/UI";

const friendly = (e) =>
  ({
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/weak-password": "Password must contain at least 6 characters.",
  })[e.code] || "Something went wrong. Please try again.";
function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const [f, setF] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (isRegister && f.password !== f.confirm)
      return setError("Password confirmation does not match.");
    if (f.password.length < 6)
      return setError("Password must contain at least 6 characters.");
    try {
      setLoading(true);
      isRegister
        ? await register(f.fullName, f.email, f.password)
        : await login(f.email, f.password);
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
            {isRegister ? "Mulai perjalananmu" : "Selamat datang kembali"}
          </span>
          <h2>
            {isRegister
              ? "Buat akun barumu"
              : "Masuk ke akunmu"}
          </h2>
          <p>
            {isRegister
              ? "Kelola semua peluang kariermu di satu tempat."
              : "Lanjutkan progres dan aktivitasmu hari ini."}
          </p>
          <div className="auth-tabs" aria-label="Pilih metode autentikasi">
            <Link className={!isRegister ? "active" : ""} to="/login">
              Login
            </Link>
            <Link className={isRegister ? "active" : ""} to="/register">
              Register
            </Link>
          </div>
          <ErrorMessage message={error} />
          {isRegister && (
            <label>
              <span>Full name</span>
              <input
                required
                autoComplete="name"
                value={f.fullName}
                onChange={(e) => setF({ ...f, fullName: e.target.value })}
                placeholder="Your full name"
              />
            </label>
          )}
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
                autoComplete={isRegister ? "new-password" : "current-password"}
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
          {isRegister && (
            <label>
              <span>Confirm password</span>
              <input
                required
                type="password"
                value={f.confirm}
                onChange={(e) => setF({ ...f, confirm: e.target.value })}
                placeholder="Repeat password"
              />
            </label>
          )}
          <button className="btn primary auth-submit" disabled={loading}>
            {loading
              ? "Mohon tunggu..."
              : isRegister
                ? "Buat akun"
                : "Masuk ke MyActivity"}
            {!loading && <ArrowRight />}
          </button>
          {!isRegister && (
            <>
              <div className="auth-divider">
                <span>atau coba tanpa membuat akun</span>
              </div>
              <button className="auth-demo" type="button">
                Lihat dashboard demo
              </button>
              <small className="auth-demo-hint">
                Tidak memerlukan akun Firebase
              </small>
            </>
          )}
          <p className="switch">
            {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
            <Link to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Masuk sekarang" : "Daftar sekarang"}
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
export const LoginPage = () => <AuthPage mode="login" />;
export const RegisterPage = () => <AuthPage mode="register" />;
