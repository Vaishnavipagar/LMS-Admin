import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

const KEY = 'learnloop_admin_auth_v1'; // isolated from student key on purpose
const Ctx = createContext(null);
export const useAdmin = () => useContext(Ctx);

// ------------------------------------------------------------------
// Demo admin sign-in — used whenever Supabase is not configured.
//
// This is the same sign-in that previously ran on localhost; it now runs on
// any host so the static Vercel deployment works without Supabase. Override
// the credentials at build time with VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD.
//
// SECURITY: Vite inlines these values into the client bundle, so they are not
// secret. They are demo credentials only — connect Supabase (or move auth to a
// server-side endpoint) before using this deployment with sensitive data.
// ------------------------------------------------------------------
const DEMO_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@learnloop.io';
const DEMO_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

// Supabase remains the auth provider when it is configured. Until then the
// panel uses the demo sign-in above — no Supabase configuration is required.
const isDemoMode = !isSupabaseConfigured;

async function signInAdminDemo({ email, password }) {
  const e = String(email || '').trim();
  const p = String(password || '');
  if (!e || !p) throw new Error('Enter your admin email and password.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new Error('Enter a valid admin email address.');
  if (e !== DEMO_ADMIN_EMAIL || p !== DEMO_ADMIN_PASSWORD) {
    throw new Error('Invalid admin email or password.');
  }
  return { id: 'admin_demo_1', email: e, name: 'Admin', role: 'admin' };
}

async function signOutAdminDemo() {
  return true;
}

// ------------------------------------------------------------------
// Supabase authentication (production)
// ------------------------------------------------------------------
async function signInAdminSupabase({ email, password }) {
  const e = String(email || '').trim();
  const p = String(password || '');
  if (!e || !p) throw new Error('Enter your admin email and password.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new Error('Enter a valid admin email address.');
  if (!supabase) throw new Error('Sign-in is temporarily unavailable. Please try again.');
  const { data, error } = await supabase.auth.signInWithPassword({ email: e, password: p });
  if (error || !data?.user) {
    if (error && /invalid login credentials/i.test(error.message)) {
      throw new Error('Invalid admin email or password.');
    }
    throw new Error(error?.message || 'Sign-in failed. Please try again.');
  }
  return { id: data.user.id, email: data.user.email, name: data.user.email, role: 'admin' };
}

async function signOutAdminSupabase() {
  if (supabase) await supabase.auth.signOut().catch(() => {});
  return true;
}

// ------------------------------------------------------------------
// Auth provider — demo sign-in when Supabase is absent, Supabase when present
// ------------------------------------------------------------------
export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setAdmin(JSON.parse(localStorage.getItem(KEY) || 'null')); } catch { /* no session */ }
    setReady(true);
  }, []);

  const login = async (email, password) => {
    let a;
    if (isDemoMode) {
      a = await signInAdminDemo({ email, password });
    } else {
      a = await signInAdminSupabase({ email, password });
    }
    setAdmin(a);
    localStorage.setItem(KEY, JSON.stringify(a));
    return a;
  };

  const logout = async () => {
    setAdmin(null);
    localStorage.removeItem(KEY);
    try {
      if (isDemoMode) await signOutAdminDemo();
      else await signOutAdminSupabase();
    } catch { /* noop */ }
  };

  return <Ctx.Provider value={{ admin, login, logout, ready }}>{children}</Ctx.Provider>;
}

// ---- shared storage helpers (frontend-only mocks) ----
export const store = {
  read(k, fb) { try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(fb)); } catch { return fb; } },
  write(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
};

export const SEED_COURSES = [
  { id: 'fullstack-mern', title: 'Full-Stack Web Development with MERN', price: 4999, free: false, students: 18420, status: 'Published', updated: 'Oct 2026', video: 'r2://papersky-videos/mern/intro.m3u8' },
  { id: 'react-pro', title: 'React 18 Professional', price: 0, free: true, students: 12300, status: 'Published', updated: 'Oct 2026', video: 'r2://papersky-videos/react/intro.m3u8' },
  { id: 'supabase-postgres', title: 'Supabase & PostgreSQL', price: 2999, free: false, students: 8210, status: 'Published', updated: 'Oct 2026', video: 'r2://papersky-videos/sql/intro.m3u8' },
  { id: 'dsa-bootcamp', title: 'DSA Bootcamp in JavaScript', price: 1999, free: false, students: 24100, status: 'Draft', updated: 'Oct 2026', video: '' },
];
