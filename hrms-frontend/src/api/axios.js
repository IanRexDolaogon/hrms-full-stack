import axios from 'axios';

const api = axios.create({
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
        return response; 
    },
    (error) => {       if (error.response && error.response.status === 401) {
            console.warn("Session expired. Logging out automatically.");
            
            // 1. Nuke the dead credentials
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // 2. Force the browser back to the login screen
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;