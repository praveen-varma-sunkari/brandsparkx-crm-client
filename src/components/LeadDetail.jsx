import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './LeadDetail.css';
import API_BASE from '../config';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [lead, setLead] = useState(location.state?.lead || null);
  const [loading, setLoading] = useState(!location.state?.lead);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg,type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),2500); };

  const fetchLead = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/leads`);
      if (res.ok) {
        const all = await res.json();
        const found = all.find(l => String(l.id) === String(id));
        if (found) setLead(found);
      }
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (!lead) fetchLead(); }, []);

  useEffect(() => { if (lead) setForm({...lead}); }, [lead]);

  const statusClass = (s) => {
    const x=(s||'').toLowerCase();
    if (x==='in progress') return 'in-progress';
    if (x==='closed') return 'closed';
    return 'new';
  };
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—';

  const saveEdit = async () => {
    setSaving(true);
    try {
      // Update status (backend supports status update) + we update the local view
      const res = await fetch(`${API_BASE}/api/leads/${id}/status`, {
        method:'PUT', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ status: form.status, owner: form.owner, priority: form.priority, notes: form.notes })
      });
      if (res.ok) {
        setLead({...lead, ...form});
        setEditing(false);
        showToast('Lead updated successfully');
      } else showToast('Update failed','error');
    } catch(e) { showToast('Cannot reach server','error'); }
    finally { setSaving(false); }
  };

  const deleteLead = async () => {
    if (!window.confirm(`Delete "${lead.clientName}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/leads/${id}`, { method:'DELETE' });
      if (res.ok) { navigate('/admin/dashboard'); }
      else showToast('Delete failed','error');
    } catch(e) { showToast('Cannot reach server','error'); }
  };

  if (loading) return <div className="ld-empty">Loading lead…</div>;
  if (!lead) return (
    <div className="ld-empty">
      Lead not found. <button className="ld-back-link" onClick={()=>navigate('/admin/dashboard')}>← Back to dashboard</button>
    </div>
  );

  // Build activity timeline from lead data
  const timeline = [
    { icon:'✦', color:'blue', title:'Lead captured', desc:`Came in via ${lead.leadSource||'unknown source'}`, time:fmtDate(lead.dateCaptured||lead.created_at) },
    ...(lead.status!=='New' ? [{ icon:'◐', color:'amber', title:'Moved to In Progress', desc:`Assigned to ${lead.owner||'a team member'}`, time:fmtDate(lead.dateCaptured||lead.created_at) }] : []),
    ...(lead.status==='Closed' ? [{ icon:'✓', color:'green', title:'Deal closed', desc:'Lead successfully converted', time:fmtDate(lead.dateCaptured||lead.created_at) }] : []),
  ];

  return (
    <div className="ld">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <button className="ld-back" onClick={()=>navigate('/admin/dashboard')}>← Back to Dashboard</button>

      <div className="ld-header">
        <div className="ld-avatar">{(lead.clientName||'?').charAt(0).toUpperCase()}</div>
        <div className="ld-head-info">
          <h1>{lead.clientName}</h1>
          <p>{lead.contactInfo}</p>
        </div>
        <span className={`badge ${statusClass(lead.status)}`}>{lead.status}</span>
        <div className="ld-head-actions">
          {!editing && <button className="btn-primary" onClick={()=>setEditing(true)}>✎ Edit</button>}
          <button className="btn-danger" onClick={deleteLead}>🗑 Delete</button>
        </div>
      </div>

      <div className="ld-grid">
        {/* Details / Edit */}
        <div className="ld-panel">
          <h3 className="ld-panel-h">{editing ? 'Edit Lead' : 'Lead Information'}</h3>
          {!editing ? (
            <div className="ld-fields">
              <div className="ld-field"><span className="ld-label">Service Interest</span><span className="ld-value">{lead.serviceInterest||'—'}</span></div>
              <div className="ld-field"><span className="ld-label">Budget</span><span className="ld-value">{lead.budget||'—'}</span></div>
              <div className="ld-field"><span className="ld-label">Location</span><span className="ld-value">{lead.location||'—'}</span></div>
              <div className="ld-field"><span className="ld-label">Source</span><span className="ld-value">{lead.leadSource||'—'}</span></div>
              <div className="ld-field"><span className="ld-label">Owner</span><span className="ld-value">{lead.owner||'Unassigned'}</span></div>
              <div className="ld-field"><span className="ld-label">Priority</span><span className="ld-value">{lead.priority||'Warm'}</span></div>
              <div className="ld-field"><span className="ld-label">Date Captured</span><span className="ld-value">{fmtDate(lead.dateCaptured||lead.created_at)}</span></div>
              {lead.notes && <div className="ld-notes"><span className="ld-label">Notes</span><p>{lead.notes}</p></div>}
            </div>
          ) : (
            <div className="ld-edit">
              <div className="ld-egroup">
                <label>Status</label>
                <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                  <option>New</option><option>In Progress</option><option>Closed</option>
                </select>
              </div>
              <div className="ld-egroup">
                <label>Owner</label>
                <select value={form.owner||''} onChange={e=>setForm({...form,owner:e.target.value})}>
                  <option value="Unassigned">Unassigned</option>
                  <option>Praveen</option><option>Sarah J.</option><option>Mike T.</option>
                </select>
              </div>
              <div className="ld-egroup">
                <label>Priority</label>
                <select value={form.priority||'Warm'} onChange={e=>setForm({...form,priority:e.target.value})}>
                  <option>Hot</option><option>Warm</option><option>Cold</option>
                </select>
              </div>
              <div className="ld-egroup">
                <label>Notes</label>
                <textarea rows="3" value={form.notes||''} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Call summaries, next steps, context…" />
              </div>
              <div className="ld-edit-actions">
                <button className="btn-primary" onClick={saveEdit} disabled={saving}>{saving?'Saving…':'Save changes'}</button>
                <button className="btn-ghost" onClick={()=>{setEditing(false);setForm({...lead});}}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Activity timeline */}
        <div className="ld-panel">
          <h3 className="ld-panel-h">Activity Timeline</h3>
          <div className="timeline">
            {timeline.map((t,i)=>(
              <div className="tl-item" key={i}>
                <div className={`tl-dot tl-${t.color}`}>{t.icon}</div>
                <div className="tl-body">
                  <div className="tl-title">{t.title}</div>
                  <div className="tl-desc">{t.desc}</div>
                  <div className="tl-time">{t.time}</div>
                </div>
              </div>
            ))}
            <div className="tl-item">
              <div className="tl-dot tl-mut">→</div>
              <div className="tl-body">
                <button className="tl-action" onClick={()=>navigate('/admin/workflow',{state:{selectedLead:lead}})}>
                  Process next step in Workflow →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
