import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../store/auth.jsx';

export default function Login() {
  const { login } = useAdmin();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const go = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      // Separated auth adapter — swap internals for Supabase later, UI stays the same.
      await login(email, pw);
      nav('/');
    } catch (x) {
      setErr(x?.message || 'Unable to sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ll-auth">
      {/* Left — brand / product panel */}
      <aside className="ll-hero" aria-label="LearnLoop Admin overview">
        <div className="ll-hero-glow" aria-hidden="true" />
        <div className="ll-hero-inner">
          <Link to="/login" className="ll-brand">
            <span className="ll-mark" aria-hidden="true">
              <span className="ll-mark-dot" />
            </span>
            <span className="ll-brand-text">LearnLoop <em>Admin</em></span>
          </Link>

          <div className="ll-hero-copy">
            <p className="ll-eyebrow">ADMIN CONSOLE</p>
            <h1>
              Operate your learning
              <br />
              business with confidence.
            </h1>
            <p className="ll-sub">
              A calm, secure workspace to manage courses, learners, orders and
              content — cleanly separated from the student experience.
            </p>

            <ul className="ll-points">
              <li>
                <span className="ll-ico" aria-hidden="true">
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none"><path d="M10 2l7 3.5v4c0 4.5-3 7.2-7 8.5-4-1.3-7-4-7-8.5v-4L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7.5 10l1.8 1.8L12.8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <div>
                  <b>Isolated admin session</b>
                  <span>Separate credentials and access from student accounts.</span>
                </div>
              </li>
              <li>
                <span className="ll-ico" aria-hidden="true">
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none"><rect x="2.5" y="3.5" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2.5 7h15M6 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </span>
                <div>
                  <b>Course &amp; content controls</b>
                  <span>Publish courses, curate the notes library, manage access.</span>
                </div>
              </li>
              <li>
                <span className="ll-ico" aria-hidden="true">
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none"><circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2.5 17c.6-3 2.4-4.5 4.5-4.5s3.9 1.5 4.5 4.5M13.5 4.5h4M15.5 2.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </span>
                <div>
                  <b>Learners &amp; orders</b>
                  <span>Review enrolments, purchases and learner activity.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Right — sign-in */}
      <main className="ll-main">
        <div className="ll-card-wrap">
          <div className="ll-mobile-brand" aria-label="LearnLoop Admin">
            <span className="ll-mark ll-mark--light" aria-hidden="true"><span className="ll-mark-dot" /></span>
            <span>LearnLoop <em>Admin</em></span>
          </div>

          <section className="ll-card" aria-labelledby="ll-title">
            <p className="ll-card-eyebrow">ADMIN SIGN IN</p>
            <h2 id="ll-title">Welcome back</h2>
            <p className="ll-card-sub">Sign in to access the LearnLoop admin console.</p>

            {err && (
              <div className="ll-alert" role="alert">
                <svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6.5v4M10 13.2v.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
                <span>{err}</span>
              </div>
            )}

            <form onSubmit={go} noValidate>
              <label className="ll-lbl" htmlFor="ll-email">Work email</label>
              <input
                id="ll-email"
                className="ll-input"
                type="email"
                autoComplete="username"
                placeholder="admin@learnloop.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
              />

              <label className="ll-lbl" htmlFor="ll-pw">Password</label>
              <div className="ll-pw">
                <input
                  id="ll-pw"
                  className="ll-input"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  disabled={busy}
                />
                <button
                  type="button"
                  className="ll-show"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  disabled={busy}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="ll-row">
                <label className="ll-check">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} disabled={busy} />
                  <span>Remember me</span>
                </label>
                <span className="ll-muted-link" title="Contact your workspace administrator to reset your password">Forgot password?</span>
              </div>

              <button className="ll-btn" type="submit" disabled={busy}>
                {busy ? (
                  <span className="ll-spinner" aria-hidden="true" />
                ) : (
                  <svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true"><rect x="3" y="9" width="11" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9V7a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5"/></svg>
                )}
                {busy ? 'Signing in…' : 'Sign in to dashboard'}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
