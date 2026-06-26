import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast'; // 1. Import the notification library
import './LeadCaptureForm.css';
import API_BASE from '../config';

const LeadCaptureForm = () => {
  // We use this to disable the button so the user can't click it twice while saving
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    contactInfo: '',
    serviceInterest: '',
    budget: '',
    location: '',
    leadSource: '',
    followUpStatus: 'Pending'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 2. Add 'async' to the function because talking to a database takes time
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Change button to "Saving..."
    
    // Show a loading toast that will be replaced when finished
    const toastId = toast.loading('Sending lead to database...');

    try {
      // 3. The Bridge: Sending the data to the backend API
      // (This assumes your teammate's Node.js server will run on port 5000)
      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST', // We are "posting" new data to the server
        headers: {
          'Content-Type': 'application/json', // Telling the server we are sending JSON
        },
        body: JSON.stringify(formData), // Packaging our React state into a JSON string
      });

      // 4. Check if the server gave us a "Thumbs Up" (Status 200/201)
      if (response.ok) {
        toast.success('Lead captured and saved successfully!', { id: toastId });
        
        // Reset the form back to empty
        setFormData({
          clientName: '', contactInfo: '', serviceInterest: '', budget: '', location: '', leadSource: '', followUpStatus: 'Pending'
        });
      } else {
        // If the server rejected the data (e.g., missing fields)
        toast.error('Failed to save lead. Check the data.', { id: toastId });
      }

    } catch (error) {
      // 5. If the server is offline or the internet drops
      console.error('Network Error:', error);
      toast.error('Cannot connect to server. Is the backend running?', { id: toastId });
    } finally {
      setIsSubmitting(false); // Turn the button back on
    }
  };

  return (
    <div className="form-container">
      {/* 6. Add the Toaster component to render the popups */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <h2>Client Lead Capture Form</h2>
      <form onSubmit={handleSubmit} className="crm-form">
        
        <div className="form-group">
          <label htmlFor="clientName">Client/Lead Name *</label>
          <input type="text" id="clientName" name="clientName" value={formData.clientName} onChange={handleChange} required placeholder="Enter full name" />
        </div>

        <div className="form-group">
          <label htmlFor="contactInfo">Contact Info (Email/Phone) *</label>
          <input type="text" id="contactInfo" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required placeholder="Email or Phone Number" />
        </div>

        <div className="form-group row">
          <div className="half-width">
            <label htmlFor="serviceInterest">Service Interest</label>
            <select id="serviceInterest" name="serviceInterest" value={formData.serviceInterest} onChange={handleChange} required>
              <option value="">Select Service</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Campaign Delivery">Campaign Delivery</option>
              <option value="HR Outsourcing">HR Outsourcing</option>
              <option value="SaaS Subscription">SaaS Subscription</option>
            </select>
          </div>

          <div className="half-width">
            <label htmlFor="budget">Budget</label>
            <select id="budget" name="budget" value={formData.budget} onChange={handleChange} required>
              <option value="">Select Budget</option>
              <option value="Low">Low (&lt; $1k)</option>
              <option value="Medium">Medium ($1k - $5k)</option>
              <option value="High">High ($5k+)</option>
            </select>
          </div>
        </div>

        <div className="form-group row">
          <div className="half-width">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" />
          </div>

          <div className="half-width">
            <label htmlFor="leadSource">Lead Source</label>
            <select id="leadSource" name="leadSource" value={formData.leadSource} onChange={handleChange}>
              <option value="">Select Source</option>
              <option value="Website">Website</option>
              <option value="Ads">Ads</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>
        </div>

        {/* 7. Disable the button while saving to prevent double-clicks */}
        <button type="submit" className="submit-btn" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
          {isSubmitting ? 'Saving to Database...' : 'Capture Lead'}
        </button>
      </form>
    </div>
  );
};

export default LeadCaptureForm;