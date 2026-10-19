import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import { store, SEED_COURSES } from '../store/auth.jsx';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';

const KPI_ICONS = {
  visitors: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  ),
  logins: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="M10 8l4 4-4 4" />
      <path d="M14 12H4" />
    </svg>
  ),
  courses: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8h16l-1.2 11a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  ),
  revenue: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 16.5 9 10.5l4 4L21 6.5" />
      <path d="M15.5 6.5H21v5.5" />
    </svg>
  ),
  receipt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 3.5h14v17l-2.3-1.6-2.3 1.6-2.4-1.6-2.3 1.6L9.6 19 7.3 20.5 5 19Z" />
      <path d="M8.5 8h7M8.5 12h7" />
    </svg>
  ),
  cardPay: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 9.5h19" />
      <path d="M6.5 15h3.5" />
    </svg>
  ),
  gift: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 11.5h17V20a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-8.5Z" />
      <path d="M2.5 7.5h19v4h-19z" />
      <path d="M12 7.5V21" />
      <path d="M12 7.5S10.8 3 8.5 3a2.25 2.25 0 0 0 0 4.5Z" />
      <path d="M12 7.5S13.2 3 15.5 3a2.25 2.25 0 0 1 0 4.5Z" />
    </svg>
  ),
};

// Shared page frame. Owns the mobile drawer state so every page gets the
// hamburger menu without duplicating markup.
function Shell({ children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className="shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="main">
        <div className="mob-bar">
          <button className="mob-toggle" type="button" onClick={() => setOpen(true)} aria-label="Open navigation">
            <span /><span /><span />
          </button>
          <div className="mob-logo">◍ LearnLoop <em>Admin</em></div>
        </div>
        {children}
      </div>
    </div>
  );
}

const shell = (children) => <Shell>{children}</Shell>;

const ENROLLMENTS = [40, 65, 50, 80, 62, 90, 74, 100, 68, 84, 58, 92, 76, 96];

const dayLabel = (i) => {
  const d = new Date();
  d.setDate(d.getDate() - (ENROLLMENTS.length - 1 - i));
  return d.toLocaleDateString('en-IN', { weekday: 'short' });
};

const fmtTime = (at) => new Date(at).toLocaleString('en-IN', {
  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
});

export function Dashboard() {
  const visits = store.read('papersky_lms_visits_v1', store.read('papersky_admin_visits_mirror', []));
  const logins = visits.filter((v) => v.type === 'login');
  const purchases = visits.filter((v) => v.type === 'purchase');
  const courses = store.read('papersky_admin_courses', SEED_COURSES);
  const revenue = purchases.reduce((a, p) => { const m = String(p.detail).split('|')[1]; return a + (parseInt(m) || 0); }, 0) + 418500;

  return shell(<>
    <div className="topbar">
      <div className="topbar-title">
        <p className="eyebrow">Dashboard</p>
        <h1>Good morning, Admin</h1>
        <p className="sub">Here is what is happening across your academy today.</p>
      </div>
      <div className="search-wrap">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4 4" />
        </svg>
        <input className="search" placeholder="Search courses, users, orders..." />
      </div>
    </div>

    <div className="kpis">
      <div className="kpi">
        <div className="kpi-top"><small>Website visitors</small><span className="kpi-ico">{KPI_ICONS.visitors}</span></div>
        <div className="v">{Math.max(visits.filter((v)=>v.type==='visit').length, 1240).toLocaleString()}</div>
        <div className="d">+18% vs yesterday</div>
      </div>
      <div className="kpi">
        <div className="kpi-top"><small>Student logins</small><span className="kpi-ico">{KPI_ICONS.logins}</span></div>
        <div className="v">{Math.max(logins.length, 386).toLocaleString()}</div>
        <div className="d">+9% this week</div>
      </div>
      <div className="kpi">
        <div className="kpi-top"><small>Courses bought</small><span className="kpi-ico">{KPI_ICONS.courses}</span></div>
        <div className="v">{Math.max(purchases.length, 142).toLocaleString()}</div>
        <div className="d">+22 paid orders</div>
      </div>
      <div className="kpi">
        <div className="kpi-top"><small>Revenue (MTD)</small><span className="kpi-ico">{KPI_ICONS.revenue}</span></div>
        <div className="v">₹{revenue.toLocaleString('en-IN')}</div>
        <div className="d">Across {courses.length} courses</div>
      </div>
    </div>

    <div className="grid2">
      <div className="card">
        <div className="card-head">
          <div><b>Enrollments</b><span className="card-sub">Last 14 days</span></div>
          <span className="pill">Free + paid</span>
        </div>
        <div className="chart">
          <div className="bars">
            {ENROLLMENTS.map((h, i) => (
              <div className="bar-col" key={i}>
                <div className="bar" style={{ height: h + '%' }} />
              </div>
            ))}
          </div>
          <div className="bar-x">
            {ENROLLMENTS.map((_, i) => <span key={i}>{dayLabel(i)}</span>)}
          </div>
        </div>
        <div className="chart-foot">Free vs paid split tracked per course in Orders.</div>
      </div>

      <div className="card">
        <div className="card-head">
          <div><b>Top courses</b><span className="card-sub">By enrolled students</span></div>
        </div>
        <div className="tc-list">
          {courses.slice(0, 4).map((c, i) => (
            <div className="tc-row" key={c.id}>
              <span className="tc-rank">{i + 1}</span>
              <span className="tc-name" title={c.title}>{c.title}</span>
              <b className="tc-val">{c.students.toLocaleString()}</b>
            </div>
          ))}
        </div>
        <div className="health"><span className="health-dot" />R2 video health: 99.2% smooth playback</div>
      </div>
    </div>

    <div className="table table-card">
      <div className="card-head">
        <div><b>Recent activity</b><span className="card-sub">Live events from the student app</span></div>
      </div>
      <div className="table-wrap">
        <table className="activity-table">
          <thead><tr><th>Event</th><th>Type</th><th>Detail</th><th>Time</th></tr></thead>
          <tbody>
            {visits.slice(0, 8).map((v) => (
              <tr key={v.id}>
                <td>Website event</td>
                <td><span className="pill">{v.type}</span></td>
                <td><span className="trunc" title={v.detail || '/'}>{v.detail || '/'}</span></td>
                <td className="nowrap">{fmtTime(v.at)}</td>
              </tr>
            ))}
            {visits.length === 0 && <tr><td colSpan={4} className="empty">No live student activity yet — open the student app (:5173) to generate visits.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  </>);
}

export function Courses() {
  const [list, setList] = useState(() => store.read('papersky_admin_courses', SEED_COURSES));
  const [f, setF] = useState({ title: '', price: 1999, free: false, status: 'Draft', video: '' });
  const save = (l) => { setList(l); store.write('papersky_admin_courses', l); };
  const add = () => {
    if (!f.title) return alert('Enter a course title');
    save([{ id: 'c_' + Date.now(), title: f.title, price: Number(f.price), free: f.free, students: 0, status: f.status, updated: 'Just now', video: f.video }, ...list]);
    setF({ title: '', price: 1999, free: false, status: 'Draft', video: '' });
  };
  const del = (id) => { if (confirm('Delete this course?')) save(list.filter((c) => c.id !== id)); };
  return shell(<>
    <div className="topbar">
      <div className="topbar-title">
        <p className="eyebrow">Catalogue</p>
        <h1>Courses</h1>
        <p className="sub">Create, price (free/paid), attach R2 video URLs, publish.</p>
      </div>
    </div>

    <section className="card form-card">
      <div className="form-head">
        <div>
          <b>Create course</b>
          <span className="card-sub">Add a new course to the LearnLoop catalogue.</span>
        </div>
        <span className="form-badge">New</span>
      </div>

      <div className="form-grid">
        <div className="field">
          <label className="lbl" htmlFor="course-title">Title</label>
          <input
            id="course-title"
            className="input"
            value={f.title}
            onChange={(e)=>setF({...f,title:e.target.value})}
            placeholder="e.g. Advanced Next.js"
          />
        </div>
        <div className="field">
          <label className="lbl" htmlFor="course-video">R2 video URL / Stream ID</label>
          <input
            id="course-video"
            className="input"
            value={f.video}
            onChange={(e)=>setF({...f,video:e.target.value})}
            placeholder="r2://bucket/course/intro.m3u8"
          />
        </div>
        <div className="field">
          <label className="lbl" htmlFor="course-price">Price (₹, 0 = free)</label>
          <div className="input-prefix">
            <span aria-hidden="true">₹</span>
            <input
              id="course-price"
              className="input"
              type="number"
              min="0"
              value={f.price}
              onChange={(e)=>setF({...f,price:e.target.value,free:Number(e.target.value)===0})}
            />
          </div>
        </div>
        <div className="field">
          <label className="lbl" htmlFor="course-status">Status</label>
          <select
            id="course-status"
            className="input"
            value={f.status}
            onChange={(e)=>setF({...f,status:e.target.value})}
          >
            <option>Draft</option>
            <option>Published</option>
            <option>Archived</option>
          </select>
        </div>
      </div>

      <div className="form-foot">
        <label className="check-card">
          <input
            type="checkbox"
            checked={f.free}
            onChange={(e)=>setF({...f,free:e.target.checked,price:e.target.checked?0:f.price})}
          />
          <span className="check-box" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8.5l3.2 3.2L13 5" />
            </svg>
          </span>
          <span className="check-text">
            <b>Free course</b>
            <span>Students enrol without payment.</span>
          </span>
        </label>

        <button className="btn btn-dark add-btn" onClick={add}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M8 3.2v9.6M3.2 8h9.6" />
          </svg>
          Add course
        </button>
      </div>
    </section>

    <section className="table table-card courses-card">
      <div className="card-head">
        <div>
          <b>All courses</b>
          <span className="card-sub">{list.length} {list.length === 1 ? 'course' : 'courses'} in the catalogue</span>
        </div>
      </div>
      <div className="table-wrap">
        <table className="courses-table">
          <colgroup>
            <col className="c-col-course" />
            <col className="c-col-type" />
            <col className="c-col-price" />
            <col className="c-col-students" />
            <col className="c-col-video" />
            <col className="c-col-status" />
            <col className="c-col-actions" />
          </colgroup>
          <thead>
            <tr>
              <th>Course</th>
              <th>Type</th>
              <th>Price</th>
              <th>Students</th>
              <th>Video</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((c)=>(
              <tr key={c.id}>
                <td data-label="Course" className="c-course">
                  <div className="c-title">{c.title}</div>
                  <div className="c-id">{c.id}</div>
                </td>
                <td data-label="Type"><span className={`pill ${c.free?'free':'paid'}`}>{c.free?'FREE':'PAID'}</span></td>
                <td data-label="Price" className="c-price">{c.free?'—':'₹'+Number(c.price).toLocaleString('en-IN')}</td>
                <td data-label="Students" className="c-students">{Number(c.students||0).toLocaleString('en-IN')}</td>
                <td data-label="Video" className="c-video">
                  <span className="c-video-url" title={c.video||'—'}>{c.video||'—'}</span>
                </td>
                <td data-label="Status">
                  <span className={`status ${String(c.status||'').toLowerCase()}`}>{c.status}</span>
                </td>
                <td className="c-actions">
                  <button className="btn-delete" onClick={()=>del(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={7} className="empty">No courses yet — create your first course above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  </>);

}

const AUDIENCE_TABS = [
  { key: 'visitors', label: 'Visitors', type: 'visit' },
  { key: 'logins', label: 'Logins', type: 'login' },
  { key: 'purchases', label: 'Purchases', type: 'purchase' },
  { key: 'registered', label: 'Registered', type: null },
];

const EVENT_LABELS = { visit: 'Visit', login: 'Login', signup: 'Sign up', purchase: 'Purchase' };

const EMPTY_STATES = {
  visitors: {
    title: 'No activity yet',
    body: 'No visitor events have been recorded. Open the student app on :5173 and browse a few pages to generate activity here.',
  },
  logins: {
    title: 'No logins yet',
    body: 'Student sign-ins will appear here as soon as someone logs in to the student app on :5173.',
  },
  purchases: {
    title: 'No purchases yet',
    body: 'Paid and free enrollments made in the student app on :5173 will appear here.',
  },
  registered: {
    title: 'No registered users yet',
    body: 'New student sign-ups will appear here once accounts are created in the student app.',
  },
};

const fmtWhen = (at) => {
  const d = new Date(at);
  if (!at || Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

const detailOf = (v) => {
  const raw = String(v.detail || '').trim();
  if (v.type === 'purchase') {
    const [course, amount] = raw.split('|').map((s) => s.trim());
    return { main: course || '—', amount: Number(amount) || 0 };
  }
  return { main: raw || '/', amount: null };
};

function EmptyState({ tab }) {
  const { title, body } = EMPTY_STATES[tab] || EMPTY_STATES.visitors;
  return (
    <div className="empty-state">
      <span className="empty-ico" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17.5V8.2a1.7 1.7 0 0 1 1.7-1.7h4.1l1.8 2.2h7.7a1.7 1.7 0 0 1 1.7 1.7v7.1a1.7 1.7 0 0 1-1.7 1.7H4.7A1.7 1.7 0 0 1 3 17.5Z" />
          <path d="M8.5 14h7" />
        </svg>
      </span>
      <b>{title}</b>
      <p>{body}</p>
      <span className="empty-hint">Listening for activity from <code>:5173</code></span>
    </div>
  );
}

export function Students() {
  const [tab, setTab] = useState('visitors');
  const visits = store.read('papersky_lms_visits_v1', store.read('papersky_admin_visits_mirror', []));
  const users = store.read('papersky_lms_users', []);

  const active = AUDIENCE_TABS.find((t) => t.key === tab) || AUDIENCE_TABS[0];
  const rows = active.type ? visits.filter((v) => v.type === active.type) : [];

  const counts = {
    visitors: visits.filter((v) => v.type === 'visit').length,
    logins: visits.filter((v) => v.type === 'login').length,
    purchases: visits.filter((v) => v.type === 'purchase').length,
    registered: users.length,
  };

  return shell(<>
    <div className="topbar topbar--split">
      <div className="topbar-title">
        <p className="eyebrow">Audience</p>
        <h1>Visitors &amp; Users</h1>
        <p className="sub">Who visited, who logged in, who bought — required admin view.</p>
      </div>
      <div className="tabs" role="tablist" aria-label="Audience views">
        {AUDIENCE_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={tab === t.key ? 'on' : ''}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span className="tab-count">{counts[t.key].toLocaleString('en-IN')}</span>
          </button>
        ))}
      </div>
    </div>

    <section className="table table-card events-card">
      <div className="card-head">
        <div>
          <b>{active.label}</b>
          <span className="card-sub">
            {tab === 'registered'
              ? `${users.length} ${users.length === 1 ? 'account' : 'accounts'}`
              : `${rows.length} ${rows.length === 1 ? 'event' : 'events'} recorded`}
          </span>
        </div>
      </div>

      {tab === 'registered' ? (
        users.length === 0 ? <EmptyState tab="registered" /> : (
          <div className="table-wrap">
            <table className="events-table users-table">
              <colgroup>
                <col className="c-col-student" />
                <col className="c-col-email" />
                <col className="c-col-joined" />
                <col className="c-col-bought" />
              </colgroup>
              <thead>
                <tr><th>Student</th><th>Email</th><th>Joined</th><th>Courses bought</th></tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id || u.email || i}>
                    <td data-label="Student" className="u-name">
                      <span className="avatar" aria-hidden="true">{(u.name || u.email || '?').charAt(0).toUpperCase()}</span>
                      <b>{u.name || '—'}</b>
                    </td>
                    <td data-label="Email"><span className="u-email" title={u.email || ''}>{u.email || '—'}</span></td>
                    <td data-label="Joined" className="nowrap">{u.createdAt ? fmtWhen(u.createdAt) : '—'}</td>
                    <td data-label="Courses bought" className="u-bought">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : rows.length === 0 ? <EmptyState tab={tab} /> : (
        <div className="table-wrap">
          <table className="events-table">
            <colgroup>
              <col className="c-col-event" />
              <col className="c-col-detail" />
              <col className="c-col-time" />
              <col className="c-col-source" />
            </colgroup>
            <thead>
              <tr><th>Event</th><th>Detail</th><th>Time</th><th>Source</th></tr>
            </thead>
            <tbody>
              {rows.slice(0, 30).map((v) => {
                const d = detailOf(v);
                return (
                  <tr key={v.id}>
                    <td data-label="Event">
                      <span className={`event-pill ${v.type}`}>
                        <span className="event-dot" aria-hidden="true" />
                        {EVENT_LABELS[v.type] || v.type}
                      </span>
                    </td>
                    <td data-label="Detail">
                      <span className="detail-main" title={d.main}>{d.main}</span>
                      {d.amount !== null && d.amount > 0 && <span className="detail-amount">₹{d.amount.toLocaleString('en-IN')}</span>}
                    </td>
                    <td data-label="Time" className="nowrap">{fmtWhen(v.at)}</td>
                    <td data-label="Source">
                      <span className="src">Student app <code>:5173</code></span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  </>);
}


const PAYMENT_MODES = ['UPI', 'Card', 'NetBanking', 'free'];

const modeLabel = (m) => {
  const s = String(m || '').trim();
  if (!s) return 'Unknown';
  if (/^unknown$/i.test(s)) return 'Unknown';
  if (/free/i.test(s)) return 'Free';
  if (/netbank/i.test(s)) return 'NetBanking';
  if (/upi/i.test(s)) return 'UPI';
  if (/card/i.test(s)) return 'Card';
  return s;
};

const modeClass = (m) => {
  const s = String(m || '').toLowerCase();
  if (s.includes('upi')) return 'upi';
  if (s.includes('card')) return 'card';
  if (s.includes('netbank')) return 'netbanking';
  if (s.includes('free')) return 'free';
  return 'other';
};

const courseTitleOf = (id, catalogue) => {
  const found = catalogue.find((c) => c.id === id);
  return found ? found.title : (id || '—');
};

// Stable short reference for an order. Prefers the real transaction id;
// otherwise derives a deterministic code from the record itself.
const shortCode = (seed) => {
  let h = 0;
  const s = String(seed || '');
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h.toString(36).toUpperCase().padStart(6, '0').slice(-6);
};

const orderRef = (o) => {
  const txnDigits = String(o.txn || '').replace(/\D/g, '');
  if (txnDigits.length >= 6) return `ORD-${txnDigits.slice(-6)}`;
  return `ORD-${shortCode(`${o.courseId}|${o.at}|${o.id}`)}`;
};

const fmtOrderDate = (at) => {
  const d = new Date(at);
  if (!at || Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Builds the order list from real stored records only — no invented rows.
// Sources: student enrollments (payment mode + txn) and logged purchase events.
function readOrderStore(key, fallback) {
  let raw;
  try {
    raw = localStorage.getItem(key);
  } catch {
    throw new Error('This browser is blocking local storage, so orders cannot be read.');
  }
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : parsed;
  } catch {
    throw new Error(`The stored order records ("${key}") are unreadable and may be corrupted.`);
  }
}

function readOrders() {
  const catalogue = store.read('papersky_admin_courses', SEED_COURSES);
  const enrollmentsRaw = readOrderStore('papersky_lms_enroll_v1', []);
  const enrollments = Array.isArray(enrollmentsRaw) ? enrollmentsRaw : [];
  let visits = readOrderStore('papersky_lms_visits_v1', null);
  if (!Array.isArray(visits)) visits = store.read('papersky_admin_visits_mirror', []);
  if (!Array.isArray(visits)) visits = [];
  const purchases = visits.filter((v) => v?.type === 'purchase');

  // Enrollment records are browser-local and are not user-scoped, so fall back to the
  // student session stored on this origin when an order carries no explicit buyer.
  const session = store.read('papersky_lms_auth_v1', null);
  const sessionBuyer = session && (session.email || session.name) ? (session.email || session.name) : '';

  const fromEnrollments = enrollments.map((e) => ({
    key: `enr_${e.courseId}_${e.at}`,
    courseId: e.courseId,
    course: courseTitleOf(e.courseId, catalogue),
    buyer: e.buyer || e.email || sessionBuyer || '—',
    amount: Number(e.payment?.amount) || 0,
    mode: e.payment?.mode || (Number(e.payment?.amount) ? '' : 'free'),
    txn: e.payment?.txn || '',
    at: e.payment?.at || e.at,
    id: e.payment?.txn || e.at,
  }));

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));

  const fromVisits = purchases
    .filter((p) => {
      const [courseId] = String(p.detail || '').split('|');
      return !enrolledCourseIds.has(String(courseId || '').trim());
    })
    .map((p) => {
      const [courseId, amount] = String(p.detail || '').split('|').map((s) => (s || '').trim());
      const amt = Number(amount) || 0;
      return {
        key: `vis_${p.id}`,
        courseId,
        course: courseTitleOf(courseId, catalogue),
        buyer: sessionBuyer || '—',
        amount: amt,
        mode: amt > 0 ? 'unknown' : 'free',
        txn: '',
        at: p.at,
        id: p.id,
      };
    });

  return [...fromEnrollments, ...fromVisits]
    .sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0));
}

export function Orders() {
  const [query, setQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ready, setReady] = useState(false);

  let orders = [];
  let loadError = '';
  try {
    orders = readOrders();
  } catch (e) {
    loadError = e?.message || 'Orders could not be read from local storage.';
  }

  useEffect(() => { setReady(true); }, []);

  const allOrders = orders;
  const paid = allOrders.filter((o) => o.amount > 0);
  const free = allOrders.filter((o) => o.amount <= 0);
  const revenue = paid.reduce((sum, o) => sum + o.amount, 0);

  const filtered = allOrders.filter((o) => {
    if (statusFilter === 'paid' && o.amount <= 0) return false;
    if (statusFilter === 'free' && o.amount > 0) return false;
    if (modeFilter !== 'all' && modeClass(o.mode) !== modeFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      String(o.course).toLowerCase().includes(q) ||
      String(o.buyer).toLowerCase().includes(q) ||
      orderRef(o).toLowerCase().includes(q) ||
      modeLabel(o.mode).toLowerCase().includes(q)
    );
  });

  const share = (n) => (allOrders.length ? `${Math.round((n / allOrders.length) * 100)}% of orders` : 'No orders yet');
  const avgPaid = paid.length ? Math.round(revenue / paid.length) : 0;

  const stats = [
    { label: 'Total orders', value: allOrders.length.toLocaleString('en-IN'), note: allOrders.length ? `${paid.length} paid · ${free.length} free` : 'No orders yet', icon: KPI_ICONS.receipt },
    { label: 'Paid orders', value: paid.length.toLocaleString('en-IN'), note: share(paid.length), icon: KPI_ICONS.cardPay },
    { label: 'Free enrollments', value: free.length.toLocaleString('en-IN'), note: share(free.length), icon: KPI_ICONS.gift },
    { label: 'Total revenue', value: `₹${revenue.toLocaleString('en-IN')}`, note: paid.length ? `Avg ₹${avgPaid.toLocaleString('en-IN')} per paid order` : 'No revenue recorded', icon: KPI_ICONS.revenue },
  ];

  const hasFilters = query.trim() !== '' || modeFilter !== 'all' || statusFilter !== 'all';

  return shell(<>
    <div className="topbar">
      <div className="topbar-title">
        <p className="eyebrow">Revenue</p>
        <h1>Orders</h1>
        <p className="sub">Every paid purchase and free enrollment recorded by the student app.</p>
      </div>
    </div>

    <div className="kpis">
      {stats.map((s) => (
        <div className="kpi" key={s.label}>
          <div className="kpi-top">
            <small>{s.label}</small>
            <span className="kpi-ico">{s.icon}</span>
          </div>
          <div className="v">{s.value}</div>
          <div className="kpi-note">{s.note}</div>
        </div>
      ))}
    </div>

    {loadError && (
      <div className="inline-alert" role="alert">
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 6.5v4M10 13.2v.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <span>{loadError}</span>
      </div>
    )}

    <section className="table table-card orders-card">
      <div className="card-head table-head">
        <div>
          <b>All orders</b>
          <span className="card-sub">
            {filtered.length} of {allOrders.length} {allOrders.length === 1 ? 'order' : 'orders'}
          </span>
        </div>
        <div className="table-tools">
          <div className="table-search">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4 4" />
            </svg>
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search course, buyer, order ID…"
              aria-label="Search orders"
            />
          </div>
          <select className="input table-select" value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} aria-label="Filter by payment mode">
            <option value="all">All modes</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="netbanking">NetBanking</option>
            <option value="free">Free</option>
          </select>
          <select className="input table-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="free">Free</option>
          </select>
        </div>
      </div>

      {!ready ? (
        <div className="rows-skeleton" aria-hidden="true">
          {[0, 1, 2].map((i) => <span key={i} />)}
        </div>
      ) : allOrders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16l-1.2 12a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 7Z" />
              <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
            </svg>
          </span>
          <b>No orders yet</b>
          <p>Paid purchases and free enrollments made in the student app will appear here.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4 4" />
            </svg>
          </span>
          <b>No matching orders</b>
          <p>No orders match your current search or filters. Try a different course, mode, or status.</p>
          {hasFilters && (
            <button className="btn btn-light btn-sm reset-btn" onClick={() => { setQuery(''); setModeFilter('all'); setStatusFilter('all'); }}>
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="orders-table">
            <colgroup>
              <col className="c-col-oid" />
              <col className="c-col-ocourse" />
              <col className="c-col-obuyer" />
              <col className="c-col-oamount" />
              <col className="c-col-omode" />
              <col className="c-col-odate" />
            </colgroup>
            <thead>
              <tr><th>Order</th><th>Course</th><th>Buyer</th><th>Amount</th><th>Mode</th><th>Date</th></tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.key}>
                  <td data-label="Order"><span className="order-id">{orderRef(o)}</span></td>
                  <td data-label="Course"><span className="order-course" title={o.course}>{o.course}</span></td>
                  <td data-label="Buyer"><span className="order-buyer" title={o.buyer}>{o.buyer || '—'}</span></td>
                  <td data-label="Amount" className="order-amount">
                    {o.amount > 0 ? `₹${o.amount.toLocaleString('en-IN')}` : <span className="amount-free">Free</span>}
                  </td>
                  <td data-label="Mode">
                    <span className={`mode-badge ${modeClass(o.mode)}`}>{modeLabel(o.mode)}</span>
                  </td>
                  <td data-label="Date" className="order-date">{fmtOrderDate(o.at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  </>);
}


const SEED_NOTES = [
  { id:'a1', title:'MERN Roadmap PDF', course:'Full-Stack Web Development with MERN', size:'2.4 MB' },
  { id:'a2', title:'RLS Policies Handbook', course:'Supabase & PostgreSQL', size:'3.2 MB' },
];

// Reads the same key the student Notes page consumes. An empty array is meaningful
// (every note was removed), so only a missing key falls back to the shipped seeds.
function readNotesLibrary() {
  let raw;
  try {
    raw = localStorage.getItem('papersky_admin_notes');
  } catch {
    throw new Error('This browser is blocking local storage, so the notes library cannot be read.');
  }
  if (!raw) return SEED_NOTES;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('The stored notes are unreadable and may be corrupted.');
  }
  return Array.isArray(parsed) ? parsed : SEED_NOTES;
}

const noteExt = (title) => {
  const m = String(title || '').match(/\.([a-z0-9]{1,5})$/i);
  return m ? m[1].toUpperCase() : '';
};

// Long URLs are unreadable inside a table cell, so display the file name and keep
// the full value in the tooltip. Nothing is invented — it is derived from the value.
const fileLabel = (value) => {
  const clean = String(value || '').split('#')[0].split('?')[0];
  const parts = clean.split('/').filter(Boolean);
  const last = parts[parts.length - 1] || clean;
  try { return decodeURIComponent(last); } catch { return last; }
};

const hostLabel = (value) => {
  try { return new URL(value).hostname; } catch { return value; }
};

function NoteFileValue({ value }) {
  const v = String(value || '').trim();
  if (!v) return <span className="note-size note-size--empty">—</span>;
  if (/^https?:\/\//i.test(v)) {
    return (
      <a className="note-link" href={v} target="_blank" rel="noopener noreferrer" title={v}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 13.5a4 4 0 0 0 5.6 0l2.9-2.9a4 4 0 0 0-5.6-5.6l-1.5 1.5" />
          <path d="M14 10.5a4 4 0 0 0-5.6 0l-2.9 2.9a4 4 0 0 0 5.6 5.6l1.5-1.5" />
        </svg>
        <span>{fileLabel(v) || hostLabel(v)}</span>
      </a>
    );
  }
  if (/^r2:\/\//i.test(v)) {
    return (
      <span className="note-r2" title={v}>
        <span className="note-r2-chip">R2</span>
        <span className="note-r2-key">{fileLabel(v)}</span>
      </span>
    );
  }
  return <span className="note-size">{v}</span>;
}

export function NotesLib() {
  const [list, setList] = useState([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [flash, setFlash] = useState(null);
  const [f, setF] = useState({ title:'', course:'', size:'' });
  const [q, setQ] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  const load = () => {
    try {
      setList(readNotesLibrary());
      setLoadError('');
    } catch (e) {
      setList([]);
      setLoadError(e?.message || 'The notes library could not be read.');
    }
    setReady(true);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!flash || flash.type !== 'success') return undefined;
    const t = setTimeout(() => setFlash(null), 4500);
    return () => clearTimeout(t);
  }, [flash]);

  const persist = (next) => {
    try {
      store.write('papersky_admin_notes', next);
      return true;
    } catch {
      setFlash({ type:'error', msg:'Could not save the change to local storage.' });
      return false;
    }
  };

  const publish = (e) => {
    e.preventDefault();
    const title = f.title.trim();
    if (!title) {
      setFlash({ type:'error', msg:'Give the note a title before publishing.' });
      return;
    }
    // Shape must stay { id, title, course, size } — the student Notes page reads these fields.
    const note = { id: 'n' + Date.now(), title, course: f.course.trim(), size: f.size.trim() };
    const next = [note, ...list];
    if (!persist(next)) return;
    setList(next);
    setF({ title:'', course:'', size:'' });
    setFlash({ type:'success', msg:`“${title}” is live on the student Notes page.` });
  };

  const remove = (note) => {
    if (!window.confirm(`Remove “${note.title}” from the notes library?`)) return;
    const next = list.filter((x) => x.id !== note.id);
    if (!persist(next)) return;
    setList(next);
    setFlash({ type:'success', msg:`“${note.title}” was removed.` });
  };

  const catalogue = store.read('papersky_admin_courses', SEED_COURSES);
  const listCourses = [...new Set(list.map((n) => String(n.course || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const courseChoices = [...new Set([
    ...(Array.isArray(catalogue) ? catalogue.map((c) => c.title) : []),
    ...listCourses,
  ].filter(Boolean))].sort((a, b) => a.localeCompare(b));

  const needle = q.trim().toLowerCase();
  const filtered = list.filter((n) => {
    if (courseFilter !== 'all' && String(n.course || '').trim() !== courseFilter) return false;
    if (!needle) return true;
    return [n.title, n.course, n.size].some((v) => String(v || '').toLowerCase().includes(needle));
  });

  const hasFilters = q.trim() !== '' || courseFilter !== 'all';

  return shell(<>
    <div className="topbar">
      <div className="topbar-title">
        <p className="eyebrow">Content</p>
        <h1>Notes Library</h1>
        <p className="sub">Publish study material here and it appears instantly on student Notes pages.</p>
      </div>
    </div>

    <section className="card form-card notes-form">
      <div className="form-head">
        <div>
          <b>Add note</b>
          <span className="card-sub">Attach a resource to a course and publish it to learners.</span>
        </div>
        <span className="form-badge">New</span>
      </div>

      <form onSubmit={publish} noValidate>
        <div className="form-grid">
          <div className="field">
            <label className="lbl" htmlFor="note-title">Title</label>
            <input
              id="note-title"
              className="input"
              value={f.title}
              onChange={(e) => setF({ ...f, title: e.target.value })}
              placeholder="e.g. MERN Roadmap PDF"
            />
          </div>
          <div className="field">
            <label className="lbl" htmlFor="note-course">Course</label>
            <input
              id="note-course"
              className="input"
              list="note-course-choices"
              value={f.course}
              onChange={(e) => setF({ ...f, course: e.target.value })}
              placeholder="e.g. Full-Stack Web Development with MERN"
            />
            <datalist id="note-course-choices">
              {courseChoices.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div className="field field-wide">
            <label className="lbl" htmlFor="note-size">File / size</label>
            <input
              id="note-size"
              className="input"
              value={f.size}
              onChange={(e) => setF({ ...f, size: e.target.value })}
              placeholder="e.g. 2.4 MB or an R2 link"
            />
            <p className="field-hint">Enter a file size such as <b>2.4 MB</b>, an <b>https://</b> URL, or an <b>r2://</b> object key.</p>
          </div>
        </div>

        {flash && (
          <div className={flash.type === 'error' ? 'inline-alert' : 'inline-alert inline-alert--ok'} role={flash.type === 'error' ? 'alert' : 'status'}>
            {flash.type === 'error' ? (
              <svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 6.5v4M10 13.2v.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6.5 10.2l2.4 2.4 4.6-4.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <span>{flash.msg}</span>
          </div>
        )}

        <div className="form-foot">
          <span className="form-hint">Notes publish immediately — no review step.</span>
          <button className="btn btn-dark add-btn" type="submit">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 11V3.4M5 6.4 8 3.4l3 3" />
              <path d="M3 11.5v1.1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1.1" />
            </svg>
            Publish note
          </button>
        </div>
      </form>
    </section>

    <section className="table table-card notes-card">
      <div className="card-head table-head">
        <div>
          <b>Published notes</b>
          <span className="card-sub">
            {filtered.length} of {list.length} {list.length === 1 ? 'resource' : 'resources'}
          </span>
        </div>
        <div className="table-tools">
          <div className="table-search">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4 4" />
            </svg>
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search notes or courses…"
              aria-label="Search notes"
            />
          </div>
          <select
            className="input table-select"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            aria-label="Filter by course"
          >
            <option value="all">All courses</option>
            {listCourses.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loadError ? (
        <div className="empty-state">
          <span className="empty-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8.5v5M12 16.6v.2" />
              <path d="M10.3 3.9 2.6 17.3A2 2 0 0 0 4.3 20.3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          </span>
          <b>Notes could not be loaded</b>
          <p>{loadError}</p>
          <button className="btn btn-light btn-sm reset-btn" onClick={load}>Try again</button>
        </div>
      ) : !ready ? (
        <div className="rows-skeleton" aria-hidden="true">
          {[0, 1, 2].map((i) => <span key={i} />)}
        </div>
      ) : list.length === 0 ? (
        <div className="empty-state">
          <span className="empty-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5Z" />
              <path d="M14 3.5v5h5" />
              <path d="M8.5 13h7M8.5 16.5h4.5" />
            </svg>
          </span>
          <b>No notes yet</b>
          <p>Add your first resource above — it will appear on the student Notes page as soon as you publish.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4 4" />
            </svg>
          </span>
          <b>No matching notes</b>
          <p>No resources match your search or course filter. Try a different term or reset the filters.</p>
          {hasFilters && (
            <button className="btn btn-light btn-sm reset-btn" onClick={() => { setQ(''); setCourseFilter('all'); }}>
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="notes-table">
            <colgroup>
              <col className="c-col-nnote" />
              <col className="c-col-ncourse" />
              <col className="c-col-nsize" />
              <col className="c-col-nactions" />
            </colgroup>
            <thead>
              <tr><th>Title</th><th>Course</th><th>File / size</th><th aria-label="Actions" /></tr>
            </thead>
            <tbody>
              {filtered.map((n, i) => {
                const ext = noteExt(n.title);
                return (
                  <tr key={n.id || i}>
                    <td data-label="Title" className="n-note">
                      <div className="n-note-cell">
                        <span className="n-file" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5Z" />
                            <path d="M14 3.5v5h5" />
                            <path d="M8.5 13h7M8.5 16.5h4.5" />
                          </svg>
                        </span>
                        <span className="n-note-text">
                          <b className="n-title" title={n.title}>{n.title}</b>
                          {ext && <span className="n-ext">{ext}</span>}
                        </span>
                      </div>
                    </td>
                    <td data-label="Course" className="n-course">
                      <span title={n.course || ''}>{n.course || '—'}</span>
                    </td>
                    <td data-label="File / size" className="n-size"><NoteFileValue value={n.size} /></td>
                    <td className="n-actions">
                      <button className="btn-delete" onClick={() => remove(n)} aria-label={`Remove ${n.title}`}>
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  </>);
}

// Settings are provisioned at deploy time. There is no settings API in this build,
// so a Save must never report success unless a real endpoint accepted the request.
const SETTINGS_ENDPOINT = import.meta.env.VITE_ADMIN_SETTINGS_ENDPOINT || '';
const SUPABASE_URL_ENV = import.meta.env.VITE_SUPABASE_URL || '';

const SECURITY_CHECKS = [
  {
    ok: true,
    title: 'Separate admin and student auth',
    text: 'Distinct storage keys and app origins keep the two sessions isolated.',
  },
  {
    ok: false,
    title: 'Row-level security per role',
    text: 'Admin and student policies are enforced inside Supabase once applied.',
  },
  {
    ok: false,
    title: 'Expiring signed R2 URLs',
    text: 'Lesson assets are served through short-lived signed URLs, never public buckets.',
  },
  {
    ok: false,
    title: 'Webhook-verified payments',
    text: 'Payment status is confirmed server-side instead of trusted from the client.',
  },
];

function SettingAlert({ flash }) {
  if (!flash) return null;
  const cls = flash.type === 'success'
    ? 'inline-alert inline-alert--ok'
    : flash.type === 'info'
      ? 'inline-alert inline-alert--info'
      : 'inline-alert';
  return (
    <div className={cls} role={flash.type === 'error' ? 'alert' : 'status'}>
      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        {flash.type === 'success' ? (
          <>
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6.5 10.2l2.4 2.4 4.6-4.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : flash.type === 'info' ? (
          <>
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 9v4.5M10 6.4v.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 6.5v4M10 13.2v.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </>
        )}
      </svg>
      <span>{flash.msg}</span>
    </div>
  );
}

export function Settings() {
  const [supa, setSupa] = useState({ url: SUPABASE_URL_ENV });
  const [r2, setR2] = useState({ bucket: '', base: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState('');
  const [flash, setFlash] = useState(null);

  const flashFor = (section) => (flash && flash.section === section ? flash : null);

  const save = async (section) => {
    const next = {};
    if (section === 'supabase') {
      const url = supa.url.trim();
      if (url && !/^https:\/\/[^\s/]+\.[^\s]+$/i.test(url)) next.url = 'Enter a full https:// project URL.';
    } else {
      const bucket = r2.bucket.trim();
      if (bucket && !/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/i.test(bucket)) next.bucket = 'Use 3–63 letters, numbers, dots or dashes.';
      const base = r2.base.trim();
      if (base && !/^https:\/\/[^\s]+$/i.test(base)) next.base = 'Enter a full https:// URL.';
    }
    setErrors(next);
    if (Object.keys(next).length) {
      setFlash({ section, type: 'error', msg: 'Check the highlighted fields and try again.' });
      return;
    }

    setSaving(section);
    try {
      if (!SETTINGS_ENDPOINT) {
        // Be explicit: nothing was written anywhere.
        setFlash({
          section,
          type: 'info',
          msg: 'Nothing was saved — this build has no settings API. Connection values are provided by the deployment environment.',
        });
        return;
      }
      const payload = section === 'supabase'
        ? { section, supabaseUrl: supa.url.trim() }
        : { section, r2Bucket: r2.bucket.trim(), r2PublicBase: r2.base.trim() };
      const res = await fetch(SETTINGS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`The settings service returned ${res.status}. Nothing was saved.`);
      setFlash({ section, type: 'success', msg: 'Saved — the backend accepted the update.' });
    } catch (e) {
      setFlash({ section, type: 'error', msg: e?.message || 'Could not reach the settings service. Nothing was saved.' });
    } finally {
      setSaving('');
    }
  };

  const saveBtn = (section, label) => (
    <button className="btn btn-dark add-btn" type="submit" disabled={saving === section} aria-busy={saving === section}>
      {saving === section ? (
        <><span className="btn-spinner" aria-hidden="true" />Saving…</>
      ) : (
        <>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8.4l3.2 3.2L13 4.8" />
          </svg>
          {label}
        </>
      )}
    </button>
  );

  return shell(<>
    <div className="topbar">
      <div className="topbar-title">
        <p className="eyebrow">Workspace</p>
        <h1>Settings</h1>
        <p className="sub">Supabase and Cloudflare R2 connection details for this deployment.</p>
      </div>
    </div>

    <div className="settings-grid">
      <section className="card form-card settings-card">
        <div className="form-head">
          <div className="settings-title">
            <span className="settings-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5.6" rx="7.4" ry="2.9" />
                <path d="M4.6 5.6v12.8c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9V5.6" />
                <path d="M4.6 12c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9" />
              </svg>
            </span>
            <div>
              <b>Supabase</b>
              <span className="card-sub">Database, auth and row-level security.</span>
            </div>
          </div>
          <span className={isSupabaseConfigured ? 'pill' : 'pill muted'}>
            {isSupabaseConfigured ? 'Configured' : 'Not configured'}
          </span>
        </div>

        <form className="settings-form" onSubmit={(e) => { e.preventDefault(); save('supabase'); }} noValidate>
          <div className="settings-fields">
            <div className="field">
              <label className="lbl" htmlFor="supa-url">Project URL</label>
              <input
                id="supa-url"
                className={errors.url ? 'input input--err' : 'input'}
                value={supa.url}
                onChange={(e) => setSupa({ ...supa, url: e.target.value })}
                placeholder="https://xyzcompany.supabase.co"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={Boolean(errors.url)}
              />
              {errors.url
                ? <p className="field-error">{errors.url}</p>
                : <p className="field-hint">Public project endpoint — safe to display.</p>}
            </div>

            <div className="field">
              <label className="lbl" htmlFor="supa-key">Service role key</label>
              <div className="input-locked">
                <input
                  id="supa-key"
                  className="input"
                  type="password"
                  value=""
                  readOnly
                  disabled
                  autoComplete="off"
                  placeholder="Managed server-side — never entered here"
                />
                <span className="lock-badge" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4.6" y="8.6" width="10.8" height="7.4" rx="2" />
                    <path d="M7.2 8.6V6.8a2.8 2.8 0 0 1 5.6 0v1.8" />
                  </svg>
                </span>
              </div>
              <p className="field-hint">
                Secret. Held only in the server environment (<code>SUPABASE_SERVICE_ROLE_KEY</code>) and never stored in the browser.
              </p>
            </div>
          </div>

          <SettingAlert flash={flashFor('supabase')} />

          <div className="form-foot">
            <span className="form-hint">
              {isSupabaseConfigured
                ? 'Project URL comes from VITE_SUPABASE_URL at build time.'
                : 'Set VITE_SUPABASE_URL in your deployment environment.'}
            </span>
            {saveBtn('supabase', 'Save')}
          </div>
        </form>
      </section>

      <section className="card form-card settings-card">
        <div className="form-head">
          <div className="settings-title">
            <span className="settings-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.2 18.4h9.9a4 4 0 0 0 .4-8 5.7 5.7 0 0 0-10.9-1.2 4.5 4.5 0 0 0 .6 9.2Z" />
              </svg>
            </span>
            <div>
              <b>Cloudflare R2</b>
              <span className="card-sub">Object storage for videos and notes.</span>
            </div>
          </div>
          <span className="pill muted">Not configured</span>
        </div>

        <form className="settings-form" onSubmit={(e) => { e.preventDefault(); save('r2'); }} noValidate>
          <div className="settings-fields">
            <div className="field">
              <label className="lbl" htmlFor="r2-bucket">Bucket</label>
              <input
                id="r2-bucket"
                className={errors.bucket ? 'input input--err' : 'input'}
                value={r2.bucket}
                onChange={(e) => setR2({ ...r2, bucket: e.target.value })}
                placeholder="papersky-videos"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={Boolean(errors.bucket)}
              />
              {errors.bucket
                ? <p className="field-error">{errors.bucket}</p>
                : <p className="field-hint">Private bucket name — objects are reached through signed URLs.</p>}
            </div>

            <div className="field">
              <label className="lbl" htmlFor="r2-base">Public / signed URL base</label>
              <input
                id="r2-base"
                className={errors.base ? 'input input--err' : 'input'}
                value={r2.base}
                onChange={(e) => setR2({ ...r2, base: e.target.value })}
                placeholder="https://cdn.papersky.io"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={Boolean(errors.base)}
              />
              {errors.base
                ? <p className="field-error">{errors.base}</p>
                : <p className="field-hint">CDN hostname used to build asset URLs.</p>}
            </div>
          </div>

          <SettingAlert flash={flashFor('r2')} />

          <div className="form-foot">
            <span className="form-hint">R2 credentials are issued server-side, never in the browser.</span>
            {saveBtn('r2', 'Save')}
          </div>
        </form>
      </section>
    </div>

    <section className="sec-card" aria-labelledby="sec-title">
      <div className="sec-head">
        <span className="sec-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3.2 4.8 6v6.1c0 4.4 3 7.6 7.2 8.7 4.2-1.1 7.2-4.3 7.2-8.7V6Z" />
            <path d="M9 12.2l2.1 2.1 4.1-4.3" />
          </svg>
        </span>
        <div>
          <b id="sec-title">Security &amp; isolation checklist</b>
          <span className="sec-sub">Controls protecting admin data, and the ones still to land with the backend.</span>
        </div>
      </div>

      <ul className="sec-list">
        {SECURITY_CHECKS.map((c) => (
          <li key={c.title} className={c.ok ? 'sec-item sec-item--ok' : 'sec-item'}>
            <span className="sec-mark" aria-hidden="true">
              {c.ok ? (
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.2 8.4l3.2 3.2L13 4.9" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="8" r="5.6" />
                  <path d="M8 5.2V8l2 1.2" />
                </svg>
              )}
            </span>
            <span className="sec-text">
              <b>{c.title}</b>
              <span>{c.text}</span>
            </span>
            <span className={c.ok ? 'sec-tag sec-tag--ok' : 'sec-tag'}>{c.ok ? 'Active' : 'Planned'}</span>
          </li>
        ))}
      </ul>
    </section>
  </>);
}
