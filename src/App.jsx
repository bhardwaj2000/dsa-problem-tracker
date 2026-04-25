import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useMatch, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import DSAPage from './pages/DSAPage';
import InterviewPage from './pages/InterviewPage';


function AppContent() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const isInterviewPage = useMatch('/interview') !== null;
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("dsa_dark_mode");
    return saved ? JSON.parse(saved) : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("dsa_dark_mode", JSON.stringify(next));
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div style={{ fontFamily: "var(--font-sans)", minHeight: '100vh', background: 'var(--color-background-secondary)' }}>
      {/* Fixed Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'var(--color-background-secondary)',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem 0.5rem' }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0, color: "var(--color-text-primary)" }}>
                DSA Problem Tracker
              </h2>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
                Welcome, {currentUser.displayName || currentUser.email}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={toggleDarkMode}
                style={{ fontSize: 20, padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer", transition: "all .2s" }}
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                {darkMode ? "☀️" : "🌙"}
              </button>
              <button onClick={async () => { await logout(); navigate('/', { replace: true }); }}
                style={{ fontSize: 13, padding: "8px 16px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer", transition: "all .2s" }}>
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Link
              to="/dsa"
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                background: !isInterviewPage ? '#3b82f6' : 'var(--color-background-secondary)',
                color: !isInterviewPage ? '#fff' : 'var(--color-text-primary)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                border: `0.5px solid ${!isInterviewPage ? '#3b82f6' : 'var(--color-border-secondary)'}`,
                transition: 'all .2s'
              }}
            >
              📊 DSA Practice
            </Link>
            <Link
              to="/interview"
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                background: isInterviewPage ? '#3b82f6' : 'var(--color-background-secondary)',
                color: isInterviewPage ? '#fff' : 'var(--color-text-primary)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                border: `0.5px solid ${isInterviewPage ? '#3b82f6' : 'var(--color-border-secondary)'}`,
                transition: 'all .2s'
              }}
            >
              💼 Interview Prep
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem 0.5rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dsa" replace />} />
          <Route path="/dsa" element={<DSAPage />} />
          <Route path="/interview" element={<InterviewPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '');
  return (
    <BrowserRouter basename={basename || undefined}>
      <AppContent />
    </BrowserRouter>
  );
}
