import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { ErrorMessage } from "../components/common/UI";
import applyJobzLogo from "../assets/applyjobz-logo-mark-v2.jpg";
import applyJobzHero from "../assets/applyjobz-hero-transparent-v3.png";

const ADMIN_WHATSAPP =
  "https://wa.me/628155181494?text=Halo%20Admin%20ApplyJobz%2C%20saya%20tertarik%20untuk%20mendapatkan%20akses%20ApplyJobz.";

const friendly = (e) =>
  ({
    "auth/invalid-credential": "Email atau password tidak sesuai.",
    "auth/email-already-in-use": "Email ini sudah terdaftar.",
    "auth/weak-password": "Password minimal terdiri dari 6 karakter.",
  })[e.code] || "Terjadi kendala. Silakan coba lagi.";

function AuthPage() {
  const [f, setF] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (f.password.length < 6)
      return setError("Password minimal terdiri dari 6 karakter.");
    try {
      setLoading(true);
      await login(f.email, f.password);
      navigate("/dashboard");
    } catch (err) {
      setError(friendly(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-brand">
        <Link className="brand light auth-brand-logo" to="/">
          <span className="brandmark logo">
            <img src={applyJobzLogo} alt="" aria-hidden="true" />
          </span>
          <span>ApplyJobz</span>
        </Link>

        <div className="auth-brand-content">
          <div className="auth-brand-copy">
            <span className="auth-brand-pill">
              <Sparkles /> Career workspace untuk pencari kerja
            </span>
            <h1>
              Setiap lamaran,
              <span> lebih terarah.</span>
            </h1>
            <p>
              Lanjutkan progres, pantau proses rekrutmen, dan siapkan langkah
              berikutnya dalam satu workspace yang tenang.
            </p>
          </div>

          <div className="auth-visual">
            <span className="auth-orbit one" aria-hidden="true" />
            <span className="auth-orbit two" aria-hidden="true" />
            <img
              src={applyJobzHero}
              alt="Ilustrasi workspace ApplyJobz untuk mengelola proses lamaran kerja"
            />
            <div className="auth-float-card pipeline">
              <TrendingUp />
              <span>
                <small>Pipeline aktif</small>
                <strong>Semua terpantau</strong>
              </span>
            </div>
            <div className="auth-float-card interview">
              <CalendarDays />
              <span>
                <small>Jadwal berikutnya</small>
                <strong>Interview siap</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="auth-brand-proof" aria-label="Keunggulan ApplyJobz">
          <span>
            <CheckCircle2 /> Data akun terpisah
          </span>
          <span>
            <CheckCircle2 /> Progres tersimpan
          </span>
          <span>
            <CheckCircle2 /> Responsif di semua perangkat
          </span>
        </div>
      </section>

      <section className="auth-form-wrap">
        <div className="auth-form-topbar">
          <Link to="/">
            <ArrowLeft /> Kembali ke beranda
          </Link>
          <span>
            <ShieldCheck /> Area akun aman
          </span>
        </div>

        <div className="auth-form-shell">
          <form className="auth-form" onSubmit={submit}>
            <div className="auth-mobile-brand">
              <span className="brandmark logo">
                <img src={applyJobzLogo} alt="" aria-hidden="true" />
              </span>
              <strong>ApplyJobz</strong>
            </div>
            <span className="eyebrow">Selamat datang kembali</span>
            <h2>Masuk ke akunmu</h2>
            <p>Lanjutkan progres dan aktivitas pencarian kerjamu hari ini.</p>
            <ErrorMessage message={error} />

            <label>
              <span>Email</span>
              <div className="auth-input">
                <Mail />
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={f.email}
                  onChange={(e) => setF({ ...f, email: e.target.value })}
                  placeholder="nama@email.com"
                  aria-label="Email"
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
                  aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {show ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </label>

            <button className="btn primary auth-submit" disabled={loading}>
              {loading ? "Mohon tunggu..." : "Masuk ke ApplyJobz"}
              {!loading && <ArrowRight />}
            </button>

            <div className="auth-account-help">
              <span>Belum punya akun?</span>
              <a href={ADMIN_WHATSAPP} target="_blank" rel="noreferrer">
                <MessageCircle /> Hubungi admin
                <ArrowRight />
              </a>
            </div>
          </form>
          <p className="auth-privacy-note">
            <ShieldCheck /> Kredensialmu digunakan hanya untuk mengakses akun
            ApplyJobz.
          </p>
        </div>
      </section>
    </div>
  );
}

export const LoginPage = () => <AuthPage />;
