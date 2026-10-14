import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './store/auth.jsx';
import Login from './pages/Login.jsx';
import { Dashboard, Courses, Students, Orders, NotesLib, Settings } from './pages/Panels.jsx';

function Guard({ children }) {
  const { admin, ready } = useAdmin();
  if (!ready) return null;
  if (!admin) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Guard><Dashboard /></Guard>} />
          <Route path="/courses" element={<Guard><Courses /></Guard>} />
          <Route path="/students" element={<Guard><Students /></Guard>} />
          <Route path="/orders" element={<Guard><Orders /></Guard>} />
          <Route path="/notes" element={<Guard><NotesLib /></Guard>} />
          <Route path="/settings" element={<Guard><Settings /></Guard>} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}
