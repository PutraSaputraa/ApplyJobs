import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import { useAuth } from "./hooks/useAuth";
import { Spinner } from "./components/common/UI";
import { LoginPage } from "./pages/AuthPages";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ApplicationEditorPage from "./pages/ApplicationEditorPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import CalendarPage from "./pages/CalendarPage";
import SettingsPage from "./pages/SettingsPage";
import LandingPage from "./pages/LandingPage";
function Protected() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner label="Opening ApplyJobz..." />;
  return user ? <AppShell /> : <Navigate to="/login" replace />;
}
function Public({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? <Navigate to="/dashboard" replace /> : children;
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <Public>
            <LoginPage />
          </Public>
        }
      />
      <Route
        path="/register"
        element={<Navigate to="/login" replace />}
      />
      <Route path="/admin" element={<AdminPage />} />
      <Route element={<Protected />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="applications/new" element={<ApplicationEditorPage />} />
        <Route path="applications/:id" element={<ApplicationDetailPage />} />
        <Route
          path="applications/:id/edit"
          element={<ApplicationEditorPage />}
        />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route
        path="*"
        element={
          <div className="empty full">
            <h1>404</h1>
            <h2>Page not found</h2>
            <a className="btn primary" href="/">
              Back to home
            </a>
          </div>
        }
      />
    </Routes>
  );
}
