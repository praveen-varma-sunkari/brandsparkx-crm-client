import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LeadCaptureForm from './components/LeadCaptureForm';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WorkflowBoard from './components/WorkflowBoard';
import LeadDetail from './components/LeadDetail';
import './App.css';

// ── Theme ──
const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('bsx-theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('bsx-theme', theme); } catch(e){}
  }, [theme]);
  return [theme, () => setTheme(t => t === 'light' ? 'dark' : 'light')];
};

// ── Brand logo (clickable → home) ──
const BrandLogo = ({ light }) => (
  <Link to="/" className="brand-logo">
    <span className="brand-mark">b</span>
    <span className={`brand-word ${light?'on-dark':''}`}>brandsparkx<span className="brand-accent"> CRM</span></span>
  </Link>
);

const PublicNav = ({ theme, toggleTheme, isLoggedIn }) => (
  <nav className="pub-nav">
    <BrandLogo />
    <div className="pub-nav-links">
      <NavLink to="/capture" className={({isActive})=>isActive?'pub-link active':'pub-link'}>Capture Lead</NavLink>
      <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">{theme==='light'?'🌙':'☀️'}</button>
      {isLoggedIn
        ? <Link to="/admin/dashboard" className="pub-login">Go to Dashboard</Link>
        : <Link to="/login" className="pub-login">Agency Login</Link>}
    </div>
  </nav>
);

const Sidebar = ({ theme, toggleTheme, onLogout, open, setOpen }) => {
  const nav = useNavigate();
  const links = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '▦' },
    { to: '/admin/workflow', label: 'Workflow', icon: '⚡' },
    { to: '/capture', label: 'Capture Lead', icon: '＋' },
  ];
  return (
    <>
      <div className={`sidebar ${open?'open':''}`}>
        <Link to="/" className="sb-brand" onClick={()=>setOpen(false)}>
          <span className="brand-mark">b</span>
          <span className="sb-brand-text">brandsparkx</span>
        </Link>
        <div className="sb-section">Menu</div>
        <nav className="sb-nav">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} onClick={()=>setOpen(false)}
              className={({isActive})=>isActive?'sb-link active':'sb-link'}>
              <span className="sb-ico">{l.icon}</span> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="sb-bottom">
          <button className="sb-link sb-theme" onClick={toggleTheme}>
            <span className="sb-ico">{theme==='light'?'🌙':'☀️'}</span> {theme==='light'?'Dark mode':'Light mode'}
          </button>
          <button className="sb-link sb-logout" onClick={()=>{onLogout();nav('/');}}>
            <span className="sb-ico">⏻</span> Logout
          </button>
        </div>
      </div>
      {open && <div className="sb-overlay" onClick={()=>setOpen(false)} />}
    </>
  );
};

const AdminShell = ({ theme, toggleTheme, onLogout, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="admin-layout">
      <Sidebar theme={theme} toggleTheme={toggleTheme} onLogout={onLogout} open={open} setOpen={setOpen} />
      <div className="admin-main">
        <button className="mobile-menu-btn" onClick={()=>setOpen(true)}>☰ Menu</button>
        {children}
      </div>
    </div>
  );
};

function App() {
  // Persist login across page navigation
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('bsx-auth') === '1');
  const [theme, toggleTheme] = useTheme();

  const login = (val) => {
    setIsLoggedIn(val);
    try { val ? localStorage.setItem('bsx-auth','1') : localStorage.removeItem('bsx-auth'); } catch(e){}
  };

  const Protected = ({ children }) =>
    isLoggedIn
      ? <AdminShell theme={theme} toggleTheme={toggleTheme} onLogout={()=>login(false)}>{children}</AdminShell>
      : <Navigate to="/login" />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><PublicNav theme={theme} toggleTheme={toggleTheme} isLoggedIn={isLoggedIn} /><div className="pub-page"><LandingPage isLoggedIn={isLoggedIn} /></div></>} />
        <Route path="/capture" element={<><PublicNav theme={theme} toggleTheme={toggleTheme} isLoggedIn={isLoggedIn} /><div className="pub-page"><LeadCaptureForm /></div></>} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/admin/dashboard" /> : <><PublicNav theme={theme} toggleTheme={toggleTheme} isLoggedIn={isLoggedIn} /><div className="pub-page"><Login onLogin={login} /></div></>} />
        <Route path="/admin/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/admin/workflow" element={<Protected><WorkflowBoard /></Protected>} />
        <Route path="/admin/lead/:id" element={<Protected><LeadDetail /></Protected>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
