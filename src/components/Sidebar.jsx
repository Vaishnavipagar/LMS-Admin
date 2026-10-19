import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../store/auth.jsx';

const ICONS = {
  '/': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </svg>
  ),
  '/courses': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H19v13H5.5A1.5 1.5 0 0 0 4 18.5V5.5Z" />
      <path d="M4 18.5A1.5 1.5 0 0 1 5.5 17H19v3H5.5A1.5 1.5 0 0 1 4 18.5Z" />
    </svg>
  ),
  '/students': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19c.7-3.4 3-5 6-5s5.3 1.6 6 5" />
      <path d="M16.5 5.5h4M18.5 3.5v4" />
    </svg>
  ),
  '/orders': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h16l-1.2 12a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 7Z" />
      <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
    </svg>
  ),
  '/notes': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3.5h8L19 8v12.5H6Z" />
      <path d="M13.5 3.5V8H19" />
      <path d="M9 12h7M9 15.5h5" />
    </svg>
  ),
  '/settings': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2M12 18.5v2M4.6 7.8l1.7 1M17.7 15.2l1.7 1M4.6 16.2l1.7-1M17.7 8.8l1.7-1" />
    </svg>
  ),
};

export default function Sidebar({ open = false, onClose }) {
  const loc = useLocation();
  const { logout } = useAdmin();
  const nav = useNavigate();
  const links = [['/','Dashboard'],['/courses','Courses'],['/students','Visitors & Users'],['/orders','Orders'],['/notes','Notes Library'],['/settings','Settings']];

  return (
    <>
      <div className={`nav-scrim ${open ? 'on' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`side ${open ? 'open' : ''}`}>
        <div className="logo-row">
          <div className="logo">◍ LearnLoop <em>Admin</em></div>
          <button className="nav-close" type="button" onClick={onClose} aria-label="Close navigation">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav className="side-nav">
          {links.map(([h,l])=>(
            <Link key={h} to={h} className={loc.pathname===h?'active':''} onClick={onClose}>
              <span className="nav-ico">{ICONS[h]}</span>
              <span className="nav-label">{l}</span>
            </Link>
          ))}
        </nav>
        <div className="side-foot">
          <button className="btn btn-lime btn-sm side-logout" onClick={()=>{logout();nav('/login');}}>Logout</button>
        </div>
      </aside>
    </>
  );
}
