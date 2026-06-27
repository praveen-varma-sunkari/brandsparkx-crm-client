const RENDER_BACKEND = 'https://brandsparkx-crm-backend-1.onrender.com';

const API_BASE = import.meta.env.VITE_API_URL
  || (window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : RENDER_BACKEND);

export default API_BASE;