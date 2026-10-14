import { createContext, useContext, useState, useEffect } from 'react';

const KEY = 'learnloop_admin_auth_v1'; // isolated from student key on purpose
const LEGACY_KEYS = ['papersky_admin_auth_v1'];
const Ctx = createContext(null);
export const useAdmin = () => useContext(Ctx);

// ------------------------------------------------------------------
// Authentication integration point (Supabase-ready, frontend only)
// ------------------------------------------------------------------
// Production wiring (backend phase) — drop in without touching UI:
//
//   import { supabase } from '../lib/supabaseClient';
//   export async function signInAdmin({ email, password }) {
//     const { data, error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) throw error;
//     // Optionally verify admin role from a profiles / admins table:
//     // const { data: profile } = await supabase.from('admins').select('*').eq('id', data.user.id).single();
//     return { id: data.user.id, email: data.user.email, name: data.user.user_metadata?.name ?? 'Admin', role: 'admin' };
//   }
//
// Until Supabase is configured this adapter intentionally rejects —
// no hardcoded credentials, no fake login success.
export async function signInAdmin({ email, password }) {
  const e = String(email || '').trim();
  const p = String(password || '');
  if (!e || !p) throw new Error('Enter your admin email and password.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new Error('Enter a valid admin email address.');
  if (p.length < 8) throw new Error('Password must be at least 8 characters.');
  throw new Error('Admin authentication is not connected yet. Connect Supabase in src/store/auth.jsx → signInAdmin().');
}

export async function signOutAdmin() {
  // Production: await supabase.auth.signOut();
  return true;
}

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY) || LEGACY_KEYS.map((k) => localStorage.getItem(k)).find(Boolean) || 'null';
      setAdmin(JSON.parse(raw));
    } catch { /* no session */ }
    setReady(true);
  }, []);
  const login = async (email, password) => {
    const a = await signInAdmin({ email, password });
    setAdmin(a);
    localStorage.setItem(KEY, JSON.stringify(a));
    return a;
  };
  const logout = async () => {
    setAdmin(null);
    localStorage.removeItem(KEY);
    LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
    try { await signOutAdmin(); } catch { /* noop */ }
  };
  return <Ctx.Provider value={{ admin, login, logout, ready }}>{children}</Ctx.Provider>;
}

// ---- shared storage helpers (frontend mock of Supabase tables) ----
export const store = {
  read(k, fb) { try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(fb)); } catch { return fb; } },
  write(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
};

export const SEED_COURSES = [
  { id: 'fullstack-mern', title: 'Full-Stack Web Development with MERN', price: 4999, free: false, students: 18420, status: 'Published', updated: 'Oct 2026', video: 'r2://papersky-videos/mern/intro.m3u8' },
  { id: 'react-pro', title: 'React 18 Professional', price: 0, free: true, students: 12300, status: 'Published', updated: 'Oct 2026', video: 'r2://papersky-videos/react/intro.m3u8' },
  { id: 'supabase-postgres', title: 'Supabase & PostgreSQL', price: 2999, free: false, students: 8210, status: 'Published', updated: 'Sep 2026', video: 'r2://papersky-videos/sql/intro.m3u8' },
  { id: 'dsa-bootcamp', title: 'DSA Bootcamp in JavaScript', price: 1999, free: false, students: 24100, status: 'Draft', updated: 'Oct 2026', video: '' },
];
