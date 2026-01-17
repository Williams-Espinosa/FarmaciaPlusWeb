import axios from 'axios';

// Detectar automáticamente la URL del servidor según el ambiente
const getBaseURL = () => {
    const hostname = window.location.hostname;
    const port = 3000;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `http://localhost:${port}`;
    }
    // Para conexiones desde IP de red o Expo
    return `http://${hostname}:${port}`;
};

const BASE_URL = getBaseURL();

const api = axios.create({
    baseURL: `${BASE_URL}/api`
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // Normalizar slashes y asegurar que no haya doble /
    const normalizedPath = path.replace(/\\/g, '/');
    return `${BASE_URL}/${normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath}`;
};

export default api;