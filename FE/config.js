
const RAILWAY_API_URL = import.meta.env.VITE_API_BASE_URL;
const RAILWAY_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;


export const API_BASE_URL = RAILWAY_API_URL || 'http://localhost:3000/api';


export const SOCKET_URL = RAILWAY_SOCKET_URL || 'http://localhost:3000';