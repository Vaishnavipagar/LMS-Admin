import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../store/auth.jsx';

export default function Sidebar() {
  const loc = useLocation();
  const { logout } = useAdmin();
  const nav = useNavigate();
  const links = [['/','Dashboard'],['/courses','Courses'],['/students','Visitors & Users'],['/orders','Orders'],['/notes','Notes Library'],['/settings','Settings']];
  return (
    <aside className="side">
      <div className="logo">◍ LearnLoop <em>Admin</em></div>
      {links.map(([h,l])=><Link key={h} to={h} className={loc.pathname===h?'active':''}>{l}<span>→</span></Link>)}
      <div style={{marginTop:'auto',background:'rgba(217,242,79,.1)',borderRadius:12,padding:12,fontSize:12}}><b>Isolation note</b><div style={{opacity:.7,marginTop:4}}>Admin token (<code>learnloop_admin_auth</code>) is separate from student token. Never shared across student / admin apps.</div></div>
      <button className="btn btn-lime btn-sm" onClick={()=>{logout();nav('/login');}}>Logout</button>
    </aside>
  );
}
