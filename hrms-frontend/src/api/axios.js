import axios from 'axios';

const api = axios.create({
    // Make sure this matches your Laravel backend URL
    baseURL: 'http://localhost:8000/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// ---------------------------------------------------
// REQUEST INTERCEPTOR (The Outbound Guard)
// ---------------------------------------------------
// Automatically attaches your token to EVERY outgoing request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ---------------------------------------------------
// RESPONSE INTERCEPTOR (The Inbound Guard)
// ---------------------------------------------------
// Catches 401 Unauthorized errors globally
api.interceptors.response.use(
    (response) => {
        // If the request was successful, just pass the data through normally
        return response; 
    },
    (error) => {
        // If Laravel rejected the request because the token is dead/missing...
        if (error.response && error.response.status === 401) {
            console.warn("Session expired. Logging out automatically.");
            
            // 1. Nuke the dead credentials
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // 2. Force the browser back to the login screen
            // We use window.location because this file is outside the React Router tree
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        
        // Pass any other errors (like 500s or 422s) down to the components to handle
        return Promise.reject(error);
    }
);

export default api;