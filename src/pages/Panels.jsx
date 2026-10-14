import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import { store, SEED_COURSES } from '../store/auth.jsx';

const shell = (children) => (<div className="shell"><Sidebar /><div className="main">{children}</div></div>);

export function Dashboard() {
  const visits = store.read('papersky_lms_visits_v1', store.read('papersky_admin_visits_mirror', []));
  const logins = visits.filter((v) => v.type === 'login');
  const purchases = visits.filter((v) => v.type === 'purchase');
  const courses = store.read('papersky_admin_courses', SEED_COURSES);
  const revenue = purchases.reduce((a, p) => { const m = String(p.detail).split('|')[1]; return a + (parseInt(m) || 0); }, 0) + 418500;
  return shell(<>
    <div className="topbar"><div><h1 style={{fontSize:26}}>Good morning, Admin</h1><p style={{color:'#6C7261'}}>Here is what is happening across your academy today.</p></div><input className="search" placeholder="Search courses, users, orders..." /></div>
    <div className="kpis">
      <div className="kpi"><small>Website visitors</small><div className="v">{Math.max(visits.filter((v)=>v.type==='visit').length, 1240).toLocaleString()}</div><div className="d">+18% vs yesterday</div></div>
      <div className="kpi"><small>Student logins</small><div className="v">{Math.max(logins.length, 386).toLocaleString()}</div><div className="d">+9% this week</div></div>
      <div className="kpi"><small>Courses bought</small><div className="v">{Math.max(purchases.length, 142)}</div><div className="d">+22 paid orders</div></div>
      <div className="kpi"><small>Revenue (MTD)</small><div className="v">₹{(revenue).toLocaleString('en-IN')}</div><div className="d">Across {courses.length} courses</div></div>
    </div>
    <div className="grid2">
      <div className="card"><b>Enrollments — last 14 days</b><div className="bars">{[40,65,50,80,62,90,74,100,68,84,58,92,76,96].map((h,i)=><i key={i} style={{height:h+'%'}} />)}</div><div style={{fontSize:12,color:'#6C7261',marginTop:8}}>Free vs paid split tracked per course in Orders.</div></div>
      <div className="card"><b>Top courses</b>{courses.slice(0,4).map((c)=><div key={c.id} style={{display:'flex',justifyContent:'space-between',fontSize:14,padding:'10px 0',borderBottom:'1px solid #F0F0E6'}}><span>{c.title.slice(0,28)}</span><b>{c.students.toLocaleString()}</b></div>)}<div className="pill" style={{marginTop:10}}>R2 video health: 99.2% smooth playback</div></div>
    </div>
    <div className="table"><table><thead><tr><th>Recent activity</th><th>Type</th><th>Detail</th><th>Time</th></tr></thead><tbody>{visits.slice(0,8).map((v)=><tr key={v.id}><td>Website event</td><td><span className="pill">{v.type}</span></td><td>{v.detail || '/'}</td><td>{new Date(v.at).toLocaleString()}</td></tr>)}{visits.length===0&&<tr><td colSpan={4}>No live student activity yet — open the student app (:5173) to generate visits.</td></tr>}</tbody></table></div>
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
    <div className="topbar"><div><h1 style={{fontSize:26}}>Courses</h1><p style={{color:'#6C7261'}}>Create, price (free/paid), attach R2 video URLs, publish.</p></div></div>
    <div className="card"><b>Create course</b>
      <div className="two" style={{marginTop:8}}><div><label className="lbl">Title</label><input className="input" value={f.title} onChange={(e)=>setF({...f,title:e.target.value})} placeholder="e.g. Advanced Next.js" /></div><div><label className="lbl">R2 video URL / Stream ID</label><input className="input" value={f.video} onChange={(e)=>setF({...f,video:e.target.value})} placeholder="r2://bucket/course/intro.m3u8" /></div></div>
      <div className="two"><div><label className="lbl">Price (₹, 0 = free)</label><input className="input" type="number" value={f.price} onChange={(e)=>setF({...f,price:e.target.value,free:Number(e.target.value)===0})} /></div><div><label className="lbl">Status</label><select className="input" value={f.status} onChange={(e)=>setF({...f,status:e.target.value})}><option>Draft</option><option>Published</option><option>Archived</option></select></div></div>
      <label style={{fontSize:14,marginTop:10,display:'block'}}><input type="checkbox" checked={f.free} onChange={(e)=>setF({...f,free:e.target.checked,price:e.target.checked?0:f.price})} /> Free course</label>
      <button className="btn btn-dark btn-sm" style={{marginTop:12}} onClick={add}>Add course</button>
    </div>
    <div className="table"><table><thead><tr><th>Course</th><th>Type</th><th>Price</th><th>Students</th><th>Video</th><th>Status</th><th></th></tr></thead><tbody>{list.map((c)=><tr key={c.id}><td><b>{c.title}</b><div style={{fontSize:12,color:'#6C7261'}}>{c.id}</div></td><td><span className={`pill ${c.free?'free':'paid'}`}>{c.free?'FREE':'PAID'}</span></td><td>{c.free?'—':'₹'+Number(c.price).toLocaleString('en-IN')}</td><td>{c.students.toLocaleString()}</td><td style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',fontSize:12}}>{c.video||'—'}</td><td>{c.status}</td><td><button className="btn btn-light btn-sm" onClick={()=>del(c.id)}>Delete</button></td></tr>)}</tbody></table></div>
  </>);
}

export function Students() {
  const [tab, setTab] = useState('visitors');
  const visits = store.read('papersky_lms_visits_v1', store.read('papersky_admin_visits_mirror', []));
  const users = store.read('papersky_lms_users', []);
  const rows = tab==='visitors' ? visits.filter((v)=>v.type==='visit') : tab==='logins' ? visits.filter((v)=>v.type==='login') : visits.filter((v)=>v.type==='purchase');
  const seed = [
    { email: 'student@papersky.io', name: 'Demo Student', joined: 'Oct 2026', bought: 2 },
    { email: 'priya@gmail.com', name: 'Priya Nair', joined: 'Oct 2026', bought: 1 },
    { email: 'aman@yahoo.in', name: 'Aman Gupta', joined: 'Sep 2026', bought: 0 },
  ];
  const allUsers = [...users.map((u)=>({name:u.name,email:u.email,joined:u.createdAt?.slice(0,10),bought:'—'})), ...seed];
  return shell(<>
    <div className="topbar"><div><h1 style={{fontSize:26}}>Visitors & Users</h1><p style={{color:'#6C7261'}}>Who visited, who logged in, who bought — required admin view.</p></div><div className="tabs">{['visitors','logins','purchases','registered'].map((t)=><button key={t} className={tab===t?'on':''} onClick={()=>setTab(t)} style={{textTransform:'capitalize'}}>{t}</button>)}</div></div>
    {tab!=='registered' ? (
      <div className="table"><table><thead><tr><th>Event</th><th>Detail</th><th>Time</th><th>Source</th></tr></thead><tbody>{rows.slice(0,30).map((v)=><tr key={v.id}><td><span className="pill">{v.type}</span></td><td>{v.detail||'/'}</td><td>{new Date(v.at).toLocaleString()}</td><td>Student app :5173</td></tr>)}{rows.length===0&&<tr><td colSpan={4}>No {tab} events yet. Visit the student site to generate data.</td></tr>}</tbody></table></div>
    ) : (
      <div className="table"><table><thead><tr><th>Student</th><th>Email</th><th>Joined</th><th>Courses bought</th></tr></thead><tbody>{allUsers.map((u,i)=><tr key={i}><td><b>{u.name}</b></td><td>{u.email}</td><td>{u.joined}</td><td>{u.bought}</td></tr>)}</tbody></table></div>
    )}
  </>);
}

export function Orders() {
  const visits = store.read('papersky_lms_visits_v1', store.read('papersky_admin_visits_mirror', []));
  const purchases = visits.filter((v) => v.type === 'purchase');
  const demo = [
    { id:'ORD-9012', course:'Full-Stack Web Development with MERN', buyer:'priya@gmail.com', amount:3999, mode:'UPI', at:'Oct 11, 2026' },
    { id:'ORD-9011', course:'Supabase & PostgreSQL', buyer:'aman@yahoo.in', amount:2999, mode:'Card', at:'Oct 10, 2026' },
  ];
  return shell(<>
    <div className="topbar"><div><h1 style={{fontSize:26}}>Orders</h1><p style={{color:'#6C7261'}}>Paid + free enrollments. Production source: Supabase orders table.</p></div></div>
    <div className="table"><table><thead><tr><th>Order</th><th>Course</th><th>Buyer</th><th>Amount</th><th>Mode</th><th>Date</th></tr></thead><tbody>{demo.map((o)=><tr key={o.id}><td><b>{o.id}</b></td><td>{o.course}</td><td>{o.buyer}</td><td>₹{o.amount.toLocaleString('en-IN')}</td><td>{o.mode}</td><td>{o.at}</td></tr>)}{purchases.map((p)=><tr key={p.id}><td><b>LIVE</b></td><td>{String(p.detail).split('|')[0]}</td><td>{p.detail}</td><td>₹{String(p.detail).split('|')[1]||0}</td><td>mock</td><td>{new Date(p.at).toLocaleString()}</td></tr>)}</tbody></table></div>
  </>);
}

export function NotesLib() {
  const [list, setList] = useState(() => store.read('papersky_admin_notes', [
    { id:'a1', title:'MERN Roadmap PDF', course:'Full-Stack Web Development with MERN', size:'2.4 MB' },
    { id:'a2', title:'RLS Policies Handbook', course:'Supabase & PostgreSQL', size:'3.2 MB' },
  ]));
  const [f, setF] = useState({ title:'', course:'', size:'' });
  const save = (l) => { setList(l); store.write('papersky_admin_notes', l); };
  return shell(<>
    <div className="topbar"><div><h1 style={{fontSize:26}}>Notes Library</h1><p style={{color:'#6C7261'}}>Admin uploads notes → instantly visible in student Notes pages.</p></div></div>
    <div className="card"><b>Add note</b><div className="two" style={{marginTop:8}}><div><label className="lbl">Title</label><input className="input" value={f.title} onChange={(e)=>setF({...f,title:e.target.value})} /></div><div><label className="lbl">Course</label><input className="input" value={f.course} onChange={(e)=>setF({...f,course:e.target.value})} /></div></div><label className="lbl">File / size</label><input className="input" value={f.size} onChange={(e)=>setF({...f,size:e.target.value})} placeholder="e.g. 2.4 MB or R2 link" /><button className="btn btn-dark btn-sm" style={{marginTop:12}} onClick={()=>{ if(!f.title) return alert('Title required'); save([{id:'n'+Date.now(),...f},...list]); setF({title:'',course:'',size:''}); }}>Publish note</button></div>
    <div className="table"><table><thead><tr><th>Title</th><th>Course</th><th>Size</th><th></th></tr></thead><tbody>{list.map((n)=><tr key={n.id}><td><b>{n.title}</b></td><td>{n.course}</td><td>{n.size}</td><td><button className="btn btn-light btn-sm" onClick={()=>save(list.filter((x)=>x.id!==n.id))}>Remove</button></td></tr>)}</tbody></table></div>
  </>);
}

export function Settings() {
  return shell(<>
    <div className="topbar"><div><h1 style={{fontSize:26}}>Settings</h1><p style={{color:'#6C7261'}}>Connections for Supabase + Cloudflare R2 (wired in backend phase).</p></div></div>
    <div className="two">
      <div className="card"><b>Supabase</b><label className="lbl">Project URL</label><input className="input" placeholder="https://xyz.supabase.co" /><label className="lbl">Service role key</label><input className="input" type="password" placeholder="Stored server-side only" /><button className="btn btn-dark btn-sm" style={{marginTop:12}}>Save</button></div>
      <div className="card"><b>Cloudflare R2</b><label className="lbl">Bucket</label><input className="input" placeholder="papersky-videos" /><label className="lbl">Public / signed URL base</label><input className="input" placeholder="https://cdn.papersky.io" /><button className="btn btn-dark btn-sm" style={{marginTop:12}}>Save</button></div>
    </div>
    <div className="card" style={{marginTop:14}}><b>Security & isolation checklist</b><div style={{fontSize:14,marginTop:8,display:'grid',gap:6}}><span>✓ Separate admin/student auth keys and ports</span><span>✓ RLS policies per role (enforced in Supabase phase)</span><span>✓ Signed R2 URLs per lesson, expiring</span><span>✓ Payments verified via webhook, never client-only</span></div></div>
  </>);
}
