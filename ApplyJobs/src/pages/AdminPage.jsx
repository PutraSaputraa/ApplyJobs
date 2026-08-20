import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  LoaderCircle,
  LogOut,
  Plus,
  RotateCcw,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { login, logout } from "../services/authService";
import { createUser, listUsers, setUserStatus } from "../services/adminService";

const dateLabel = (value) =>
  value
    ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
        new Date(value),
      )
    : "–";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [users, setUsers] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const result = await listUsers();
      setUsers(result.users || []);
    } catch (error) {
      setMessage({ tone: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  }, []);

  const verify = useCallback(async (current) => {
    if (!current) {
      setAuthorized(false);
      setChecking(false);
      return false;
    }
    const token = await current.getIdTokenResult(true);
    const valid = token.claims.admin === true;
    setAuthorized(valid);
    setChecking(false);
    if (!valid) await logout();
    return valid;
  }, []);

  useEffect(() => {
    let active = true;
    const stop = onAuthStateChanged(auth, (current) => {
      if (!active) return;
      verify(current)
        .then((valid) => valid && active && load())
        .catch(() => {
          if (active) {
            setChecking(false);
            setMessage({ tone: "error", text: "Sesi admin tidak dapat diverifikasi." });
          }
        });
    });
    return () => {
      active = false;
      stop();
    };
  }, [load, verify]);

  const adminLogin = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const data = new FormData(event.currentTarget);
    try {
      const result = await login(data.get("email"), data.get("password"));
      if (!(await verify(result.user))) {
        setMessage({ tone: "error", text: "Akun ini tidak memiliki akses admin." });
      }
    } catch {
      setMessage({ tone: "error", text: "Email atau password admin tidak sesuai." });
    } finally {
      setBusy(false);
    }
  };

  const addUser = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const result = await createUser({
        fullName: data.get("fullName"),
        email: data.get("email"),
        password: data.get("password"),
      });
      form.reset();
      setMessage({ tone: "success", text: result.message });
      await load();
    } catch (error) {
      setMessage({ tone: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (account) => {
    const next = account.status === "active" ? "disabled" : "active";
    if (!window.confirm(`${next === "disabled" ? "Nonaktifkan" : "Aktifkan"} akun ${account.fullName || account.email}?`)) return;
    setBusy(true);
    try {
      const result = await setUserStatus(account.uid, next);
      setMessage({ tone: "success", text: result.message });
      await load();
    } catch (error) {
      setMessage({ tone: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };

  const counts = useMemo(
    () => ({
      active: users.filter((item) => item.status === "active").length,
      disabled: users.filter((item) => item.status === "disabled").length,
    }),
    [users],
  );

  if (checking)
    return <main className="admin-auth"><LoaderCircle className="spin" /> Memverifikasi akses admin...</main>;

  if (!authorized)
    return (
      <main className="admin-auth">
        <form className="admin-card admin-login" onSubmit={adminLogin}>
          <ShieldCheck size={42} />
          <span className="eyebrow">ADMIN APPLYJOBZ</span>
          <h1>Masuk sebagai admin</h1>
          <p>Kelola akun dan akses customer ApplyJobz.</p>
          {message && <div className={`admin-feedback ${message.tone}`}>{message.text}</div>}
          <label>Email admin<input name="email" type="email" required autoComplete="email" /></label>
          <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
          <button className="btn primary" disabled={busy}>{busy ? <LoaderCircle className="spin" /> : <ShieldCheck />}Masuk sebagai admin</button>
          <a href="/login">Kembali ke login pengguna</a>
        </form>
      </main>
    );

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div><strong><ShieldCheck /> ApplyJobz Admin</strong><small>Manajemen akses customer</small></div>
        <button className="btn secondary" onClick={() => logout().then(() => window.location.assign("/login"))}><LogOut /> Keluar</button>
      </header>
      <div className="admin-content">
        {message && <div className={`admin-feedback ${message.tone}`}>{message.text}</div>}
        <section className="admin-metrics">
          <article className="admin-card"><UsersRound /><span>Semua pengguna<strong>{users.length}</strong></span></article>
          <article className="admin-card"><UserRound /><span>Aktif<strong>{counts.active}</strong></span></article>
          <article className="admin-card"><Archive /><span>Nonaktif<strong>{counts.disabled}</strong></span></article>
        </section>
        <section className="admin-grid">
          <form className="admin-card admin-create" onSubmit={addUser}>
            <h2><Plus /> Buat akun customer</h2>
            <label>Nama lengkap<input name="fullName" required minLength="2" maxLength="80" /></label>
            <label>Email<input name="email" type="email" required autoComplete="off" /></label>
            <label>Password awal<input name="password" type="password" required minLength="8" maxLength="128" autoComplete="new-password" /></label>
            <small>Berikan email dan password awal kepada customer melalui jalur yang aman.</small>
            <button className="btn primary" disabled={busy}><Plus /> Buat akun</button>
          </form>
          <section className="admin-card admin-users">
            <header><div><h2>Daftar pengguna</h2><p>{users.length} akun terdaftar</p></div>{busy && <LoaderCircle className="spin" />}</header>
            <div className="admin-table-wrap"><table><thead><tr><th>Pengguna</th><th>Dibuat</th><th>Status</th><th>Aksi</th></tr></thead><tbody>
              {users.map((account) => <tr key={account.uid}><td><strong>{account.fullName || "Tanpa nama"}{account.isAdmin && <em>Admin</em>}</strong><small>{account.email}</small></td><td>{dateLabel(account.createdAt)}</td><td><span className={`admin-status ${account.status}`}>{account.status === "active" ? "Aktif" : "Nonaktif"}</span></td><td><button className="btn secondary" disabled={busy || account.isAdmin} onClick={() => toggle(account)}>{account.status === "active" ? <Archive /> : <RotateCcw />}{account.status === "active" ? "Nonaktifkan" : "Aktifkan"}</button></td></tr>)}
            </tbody></table></div>
          </section>
        </section>
      </div>
    </main>
  );
}
