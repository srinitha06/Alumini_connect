// Central API configuration
// Uses VITE_API_URL from .env file (set to Render backend URL for production)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_BASE_URL;
