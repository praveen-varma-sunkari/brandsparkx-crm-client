import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import API_BASE from '../config';

const Dashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const listRef = useRef(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/leads`);
      if (res.ok) setLeads(await res.json());
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { fetchLeads(); }, []);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),2500); };
  const statusClass = (s) => { const x=(s||'').toLowerCase(); if(x==='in progress')return'in-progress'; if(x==='closed')return'closed'; return'new'; };
  const prioClass = (p) => { const x=(p||'warm').toLowerCase(); return `prio-${x}`; };
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—';

  const applyFilter = (status) => { setStatusFilter(status); setSearch(''); setTimeout(()=>listRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),100); };

  const deleteLead = async (id, name) => {
    if (!window.confirm(`Delete lead "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/leads/${id}`, { method:'DELETE' });
      if (res.ok) { showToast('Lead deleted'); fetchLeads(); } else showToast('Delete failed','error');
    } catch(e) { showToast('Cannot reach server','error'); }
  };

  const exportCSV = () => {
    const rows = filtered.length ? filtered : leads;
    if (!rows.length) { showToast('No leads to export','error'); return; }
    const headers = ['Name','Contact','Service','Budget','Location','Source','Status','Priority','Owner','Date'];
    const csv = [headers.join(',')].concat(rows.map(l =>
      [l.clientName,l.contactInfo,l.serviceInterest,l.budget,l.location,l.leadSource,l.status,l.priority,l.owner,fmtDate(l.dateCaptured||l.created_at)]
      .map(v=>`"${(v||'').toString().replace(/"/g,'""')}"`).join(','))).join('\n');
    const blob = new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=`brandsparkx-leads-${new Date().toISOString().split('T')[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    showToast(`Exported ${rows.length} leads`);
  };

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d==='asc'?'desc':'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const stats = useMemo(() => {
    const total=leads.length, newL=leads.filter(l=>l.status==='New').length,
      prog=leads.filter(l=>l.status==='In Progress').length, closed=leads.filter(l=>l.status==='Closed').length;
    return { total, newL, prog, closed, rate: total?Math.round((closed/total)*100):0 };
  }, [leads]);

  const sources = useMemo(() => {
    const map={}; leads.forEach(l=>{const s=l.leadSource||'Other'; map[s]=(map[s]||0)+1;});
    const max=Math.max(1,...Object.values(map));
    return Object.entries(map).map(([name,count])=>({name,count,pct:Math.round((count/max)*100)})).sort((a,b)=>b.count-a.count);
  }, [leads]);

  const filtered = useMemo(() => {
    let r = leads.filter(l => {
      const ms = !search || (l.clientName||'').toLowerCase().includes(search.toLowerCase()) || (l.contactInfo||'').toLowerCase().includes(search.toLowerCase());
      const mst = statusFilter==='All' || l.status===statusFilter;
      return ms && mst;
    });
    const prioRank = { Hot:3, Warm:2, Cold:1 };
    r.sort((a,b) => {
      let av, bv;
      if (sortBy==='name') { av=(a.clientName||'').toLowerCase(); bv=(b.clientName||'').toLowerCase(); }
      else if (sortBy==='status') { av=a.status||''; bv=b.status||''; }
      else if (sortBy==='priority') { av=prioRank[a.priority]||2; bv=prioRank[b.priority]||2; }
      else if (sortBy==='owner') { av=(a.owner||'').toLowerCase(); bv=(b.owner||'').toLowerCase(); }
      else { av=new Date(a.dateCaptured||a.created_at).getTime(); bv=new Date(b.dateCaptured||b.created_at).getTime(); }
      if (av<bv) return sortDir==='asc'?-1:1;
      if (av>bv) return sortDir==='asc'?1:-1;
      return 0;
    });
    return r;
  }, [leads, search, statusFilter, sortBy, sortDir]);

  const sortIcon = (col) => sortBy!==col ? '↕' : (sortDir==='asc'?'↑':'↓');

  const statCards = [
    { key:'All', label:'Total Leads', val:stats.total, ico:'▦', cls:'c-blue' },
    { key:'New', label:'New', val:stats.newL, ico:'✦', cls:'c-blue' },
    { key:'In Progress', label:'In Progress', val:stats.prog, ico:'◐', cls:'c-amber' },
    { key:'Closed', label:'Closed', val:stats.closed, ico:'✓', cls:'c-green' },
  ];

  return (
    <div className="dash">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      {showModal && <QuickAddModal API_BASE={API_BASE} onClose={()=>setShowModal(false)} onSaved={()=>{setShowModal(false);fetchLeads();showToast('Lead added');}} />}

      <div className="dash-top">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-sub">Live pipeline overview · {stats.total} total leads</p>
        </div>
        <div className="dash-actions">
          <button className="btn-ghost" onClick={exportCSV}>↓ Export</button>
          <button className="btn-ghost" onClick={fetchLeads} disabled={isLoading}><span className={isLoading?'spin':''}>↻</span> Refresh</button>
          <button className="btn-primary" onClick={()=>setShowModal(true)}>＋ Quick Add</button>
        </div>
      </div>

      <div className="stat-grid">
        {statCards.map((c,i)=>(
          <button key={c.key} className={`stat ${statusFilter===c.key?'sel':''}`} style={{animationDelay:`${i*50}ms`}} onClick={()=>applyFilter(c.key)}>
            <div className={`stat-ico ${c.cls}`}>{c.ico}</div>
            <div className="stat-body"><div className="stat-val">{c.val}</div><div className="stat-label">{c.label}</div></div>
          </button>
        ))}
        <div className="stat stat-rate" style={{animationDelay:'200ms'}}>
          <div className="stat-ico c-violet">%</div>
          <div className="stat-body"><div className="stat-val">{stats.rate}<span className="stat-pct">%</span></div><div className="stat-label">Conversion</div></div>
        </div>
      </div>

      {sources.length>0 && (
        <div className="panel">
          <div className="panel-head"><h3>Leads by Source</h3></div>
          <div className="bars">
            {sources.map((s,i)=>(
              <div className="bar-row" key={s.name}>
                <span className="bar-name">{s.name}</span>
                <div className="bar-track"><div className="bar-fill" style={{width:`${s.pct}%`,animationDelay:`${i*70}ms`}}/></div>
                <span className="bar-count">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="toolbar" ref={listRef}>
        <div className="search-wrap">
          <span className="search-ico">⌕</span>
          <input className="search-input" placeholder="Search leads…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {['All','New','In Progress','Closed'].map(s=>(
            <button key={s} className={`ftab ${statusFilter===s?'active':''}`} onClick={()=>setStatusFilter(s)}>{s}</button>
          ))}
        </div>
      </div>

      {(statusFilter!=='All'||search) && (
        <div className="fnote">{filtered.length} result{filtered.length!==1?'s':''}{statusFilter!=='All'?` · ${statusFilter}`:''}{search?` · "${search}"`:''}
          <button className="fclear" onClick={()=>{setStatusFilter('All');setSearch('');}}>Clear</button>
        </div>
      )}

      {isLoading && <div className="empty">Loading…</div>}
      {!isLoading && filtered.length===0 && <div className="empty">{leads.length===0?'No leads yet. Click Quick Add to create one.':'No leads match your filters.'}</div>}

      {filtered.length>0 && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr>
              <th className="sortable" onClick={()=>toggleSort('name')}>Client <span className="sort-i">{sortIcon('name')}</span></th>
              <th className="sortable" onClick={()=>toggleSort('priority')}>Priority <span className="sort-i">{sortIcon('priority')}</span></th>
              <th className="sortable" onClick={()=>toggleSort('status')}>Status <span className="sort-i">{sortIcon('status')}</span></th>
              <th className="sortable" onClick={()=>toggleSort('date')}>Date <span className="sort-i">{sortIcon('date')}</span></th>
              <th className="sortable" onClick={()=>toggleSort('owner')}>Owner <span className="sort-i">{sortIcon('owner')}</span></th>
              <th>Source</th><th></th>
            </tr></thead>
            <tbody>
              {filtered.map(l=>(
                <tr key={l.id} onClick={()=>navigate(`/admin/lead/${l.id}`,{state:{lead:l}})} className="tbl-row">
                  <td><div className="t-name">{l.clientName}</div><div className="t-sub">{l.contactInfo}</div></td>
                  <td><span className={`prio ${prioClass(l.priority)}`}>● {l.priority||'Warm'}</span></td>
                  <td><span className={`badge ${statusClass(l.status)}`}>{l.status}</span></td>
                  <td className="t-mut">{fmtDate(l.dateCaptured||l.created_at)}</td>
                  <td className="t-mut">{l.owner||'Unassigned'}</td>
                  <td className="t-mut">{l.leadSource||'—'}</td>
                  <td onClick={e=>e.stopPropagation()}>
                    <div className="row-actions">
                      <button className="ra-btn" title="View / Edit" onClick={()=>navigate(`/admin/lead/${l.id}`,{state:{lead:l}})}>✎</button>
                      <button className="ra-btn ra-del" title="Delete" onClick={()=>deleteLead(l.id,l.clientName)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length>0 && (
        <div className="cards">
          {filtered.map(l=>(
            <div className="card" key={l.id} onClick={()=>navigate(`/admin/lead/${l.id}`,{state:{lead:l}})}>
              <div className="card-top">
                <div className="card-name">{l.clientName}</div>
                <span className={`badge ${statusClass(l.status)}`}>{l.status}</span>
              </div>
              <div className="card-contact">{l.contactInfo}</div>
              <div className="card-prio-row"><span className={`prio ${prioClass(l.priority)}`}>● {l.priority||'Warm'} priority</span></div>
              <div className="card-grid">
                <div><span className="cl">Budget</span><span className="cv">{l.budget||'—'}</span></div>
                <div><span className="cl">Source</span><span className="cv">{l.leadSource||'—'}</span></div>
                <div><span className="cl">Owner</span><span className="cv">{l.owner||'Unassigned'}</span></div>
                <div><span className="cl">Date</span><span className="cv">{fmtDate(l.dateCaptured||l.created_at)}</span></div>
              </div>
              <div className="card-actions" onClick={e=>e.stopPropagation()}>
                <button className="ca-btn" onClick={()=>navigate(`/admin/lead/${l.id}`,{state:{lead:l}})}>View & Edit</button>
                <button className="ca-btn ca-del" onClick={()=>deleteLead(l.id,l.clientName)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Quick Add Modal ──
const QuickAddModal = ({ API_BASE, onClose, onSaved }) => {
  const [form, setForm] = useState({ clientName:'', contactInfo:'', serviceInterest:'', budget:'', location:'', leadSource:'', priority:'Warm' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    if (!form.clientName || !form.contactInfo) { setErr('Name and contact are required'); return; }
    setSaving(true); setErr('');
    try {
      const res = await fetch(`${API_BASE}/api/leads`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
      if (res.ok) onSaved(); else { const d=await res.json(); setErr(d.error||'Failed'); }
    } catch(e) { setErr('Cannot reach server'); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-head"><h3>Quick Add Lead</h3><button className="modal-x" onClick={onClose}>✕</button></div>
        {err && <div className="modal-err">{err}</div>}
        <div className="modal-body">
          <div className="mrow">
            <div className="mfield"><label>Name *</label><input value={form.clientName} onChange={e=>setForm({...form,clientName:e.target.value})} placeholder="Client name" /></div>
            <div className="mfield"><label>Contact *</label><input value={form.contactInfo} onChange={e=>setForm({...form,contactInfo:e.target.value})} placeholder="Email or phone" /></div>
          </div>
          <div className="mrow">
            <div className="mfield"><label>Service</label><input value={form.serviceInterest} onChange={e=>setForm({...form,serviceInterest:e.target.value})} placeholder="Service interest" /></div>
            <div className="mfield"><label>Budget</label>
              <select value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})}><option value="">Select</option><option>Low</option><option>Medium</option><option>High</option></select>
            </div>
          </div>
          <div className="mrow">
            <div className="mfield"><label>Source</label>
              <select value={form.leadSource} onChange={e=>setForm({...form,leadSource:e.target.value})}><option value="">Select</option><option>Website</option><option>Ads</option><option>WhatsApp</option><option>LinkedIn</option></select>
            </div>
            <div className="mfield"><label>Priority</label>
              <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>Hot</option><option>Warm</option><option>Cold</option></select>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit} disabled={saving}>{saving?'Saving…':'Add Lead'}</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
