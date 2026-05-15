import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el rol del usuario en cada petición
api.interceptors.request.use((config) => {
  const rol = sessionStorage.getItem('rolUsuario');
  if (rol) {
    config.headers['x-user-role'] = rol;
  }
  return config;
});

export default api;
