// Auto-detect API base URL.
// - On localhost (PC): uses http://localhost:5000
// - On phone via WiFi (e.g. 192.168.1.5:5173): uses http://192.168.1.5:5000
const API_BASE = `http://${window.location.hostname}:5000`;

export default API_BASE;
