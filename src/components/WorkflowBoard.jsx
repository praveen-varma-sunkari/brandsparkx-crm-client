import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './WorkflowBoard.css';
import API_BASE from '../config';

const WorkflowBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const passedLead = location.state?.selectedLead || {
    id: null,
    clientName: 'No Lead Selected',
    contactInfo: 'Please select a lead from the dashboard',
    serviceInterest: '---',
    budget: '---',
    leadSource: '---',
    dateCaptured: '---'
  };

  const [currentLead] = useState(passedLead);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [workflowState, setWorkflowState] = useState({
    action: '',
    assignedTo: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkflowState({ ...workflowState, [name]: value });
  };

  // Map action to status for the backend
  const actionToStatus = {
    'Send Email':       'In Progress',
    'Discovery Call':   'In Progress',
    'Prepare Proposal': 'In Progress',
    'Close Deal':       'Closed'
  };

  const handleProcessAction = async (e) => {
    e.preventDefault();

    if (!currentLead.id) {
      setMessage({ type: 'error', text: 'No lead selected. Go to dashboard and click View.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const status = actionToStatus[workflowState.action] || 'In Progress';

      const response = await fetch(`${API_BASE}/api/leads/${currentLead.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: status,
          owner: workflowState.assignedTo
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `✅ Lead updated! Status → ${status}, Assigned to ${workflowState.assignedTo}` });
        // Reset form
        setWorkflowState({ action: '', assignedTo: '', notes: '' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update lead.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Cannot connect to server. Is the backend running?' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="workflow-container">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2>Workflow</h2>
        <h3>Reviewing Lead ID: #{currentLead.id || '---'}</h3>
      </div>

      {/* Success / Error message */}
      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: '500',
          background: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message.text}
          {message.type === 'success' && (
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => navigate('/admin/dashboard')}
                style={{ padding: '6px 16px', background: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      )}

      <div className="workflow-content">
        {/* Lead Details Panel */}
        <div className="lead-info-panel">
          <h4>Lead Details</h4>
          <ul className="details-list">
            <li><strong>Name:</strong> {currentLead.clientName}</li>
            <li><strong>Contact:</strong> {currentLead.contactInfo}</li>
            <li><strong>Service:</strong> {currentLead.serviceInterest}</li>
            <li><strong>Budget:</strong> {currentLead.budget}</li>
            <li><strong>Source:</strong> {currentLead.leadSource}</li>
            <li><strong>Date:</strong> {currentLead.dateCaptured}</li>
            <li><strong>Status:</strong> <span style={{ color: '#0056b3', fontWeight: '600' }}>{currentLead.status}</span></li>
          </ul>
        </div>

        {/* Process Next Steps Form */}
        <form onSubmit={handleProcessAction} className="process-form-panel">
          <h4>Process Next Steps</h4>

          <div className="form-group">
            <label htmlFor="action">Select Next Action *</label>
            <select id="action" name="action" value={workflowState.action} onChange={handleChange} required>
              <option value="">Choose action...</option>
              <option value="Send Email">Send Email</option>
              <option value="Discovery Call">Discovery Call</option>
              <option value="Prepare Proposal">Prepare Proposal</option>
              <option value="Close Deal">Close Deal</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assign Ownership To *</label>
            <select id="assignedTo" name="assignedTo" value={workflowState.assignedTo} onChange={handleChange} required>
              <option value="">Select team member...</option>
              <option value="Sarah J.">Sarah J.</option>
              <option value="Mike T.">Mike T.</option>
              <option value="Praveen">Praveen</option>
              <option value="Lead unassigned">Unassign</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Internal Workflow Notes</label>
            <textarea
              id="notes" name="notes" rows="4"
              value={workflowState.notes} onChange={handleChange}
              placeholder="Enter requirements, call summaries, or next step details..."
            />
          </div>

          <button
            type="submit"
            className="process-btn"
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? 'Updating...' : 'Confirm Action & Update Status'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkflowBoard;
