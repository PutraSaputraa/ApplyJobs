import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../services/authService";
import applyJobzLogo from "../../assets/applyjobz-logo-mark-v2.jpg";

const items = [
  { to: "/dashboard", label: "Overview", icon: ChartNoAxesColumnIncreasing },
  { to: "/applications", label: "Applications", icon: BriefcaseBusiness },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/settings", label: "Settings", icon: Settings },
];
export default function AppShell() {
  const { user } = useAuth();
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
  const userInitial = (user?.displayName || user?.email || "U")[0].toUpperCase();
  const signOut = async () => {
    setMobileAccountOpen(false);
    await logout();
  };
  const nav = (
    <>
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} onClick={() => setMobileAccountOpen(false)}>
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </>
  );
  return (
    <div className="shell">
      <aside className="app-sidebar">
        <Link className="brand" to="/dashboard" aria-label="ApplyJobz dashboard">
          <span className="brandmark logo">
            <img src={applyJobzLogo} alt="" aria-hidden="true" />
          </span>
          <span>ApplyJobz</span>
        </Link>
        <nav>{nav}</nav>
        <div className="account">
          <div className="avatar">
            {userInitial}
          </div>
          <div>
            <strong>{user?.displayName || "Job seeker"}</strong>
            <small>{user?.email}</small>
          </div>
          <button className="icon-btn" onClick={signOut} aria-label="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
      <nav className="mobile-nav">
        {nav}
        <div className="mobile-account">
          <button
            className={mobileAccountOpen ? "mobile-account-button active" : "mobile-account-button"}
            type="button"
            aria-label="Buka menu akun"
            aria-expanded={mobileAccountOpen}
            onClick={() => setMobileAccountOpen((open) => !open)}
          >
            <span>{userInitial}</span>
            <small>Akun</small>
          </button>
          {mobileAccountOpen && (
            <div className="mobile-account-menu">
              <header>
                <span className="avatar">{userInitial}</span>
                <div>
                  <strong>{user?.displayName || "Job seeker"}</strong>
                  <small>{user?.email}</small>
                </div>
              </header>
              <button type="button" onClick={signOut}>
                <LogOut />
                Keluar dari akun
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
