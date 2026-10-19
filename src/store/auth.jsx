import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

const KEY = 'learnloop_admin_auth_v1'; // isolated from student key on purpose
const Ctx = createContext(null);
export const useAdmin = () => useContext(Ctx);

// ------------------------------------------------------------------
// Dev-only admin credentials (localhost only — NEVER use in production)
// This allows local development without Supabase configured.
// ------------------------------------------------------------------
const DEV_ADMIN_EMAIL = 'admin@learnloop.io';
const DEV_ADMIN_PASSWORD = 'admin123';

const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
// Local dev sign-in only on localhost/127.0.0.1, and only while Supabase is not
// configured. As soon as VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are present,
// real Supabase auth takes over — including locally. Never active in production.
const isDevMode = isLocalHost && !isSupabaseConfigured;

async function signInAdminDev({ email, password }) {
  const e = String(email || '').trim();
  const p = String(password || '');
  if (!e || !p) throw new Error('Enter your admin email and password.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new Error('Enter a valid admin email address.');
  if (e !== DEV_ADMIN_EMAIL || p !== DEV_ADMIN_PASSWORD) {
    throw new Error('Invalid admin email or password.');
  }
  return { id: 'admin_dev_1', email: e, name: 'Admin', role: 'admin' };
}

async function signOutAdminDev() {
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
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Admin authentication is not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in admin/.env.');
  }
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
// Auth provider — uses dev mode on localhost, Supabase elsewhere
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
    if (isDevMode) {
      a = await signInAdminDev({ email, password });
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
      if (isDevMode) await signOutAdminDev();
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
