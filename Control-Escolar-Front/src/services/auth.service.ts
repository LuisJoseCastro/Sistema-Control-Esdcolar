// src/services/auth.service.ts (EN EL FRONTEND)

import axios from 'axios';

// ⚠️ Asegúrate de que esta URL coincida con el puerto de tu Backend (NestJS)
// Si tu backend corre en el 3000, déjalo así.
const API_URL = 'http://localhost:3000/api/auth';

/**
 * Función para iniciar sesión
 * Recibe: { email, password }
 */
export const login = async (credentials: { email: string; password: string }) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        // Si el login es exitoso, guardamos el token en localStorage para no perder la sesión
        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Error de conexión con el servidor' };
    }
};

/**
 * Función para cerrar sesión
 * Borra los datos del navegador
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirige al login
};

/**
 * Función para SOLICITAR recuperación de contraseña
 * Recibe: email
 */
export const forgotPassword = async (email: string) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        return response.data; 
    } catch (error: any) {
        throw error.response?.data || { message: 'Error al solicitar recuperación' };
    }
};

/**
 * Función para CAMBIAR la contraseña usando el token
 * Recibe: token (del link), newPassword
 */
export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Error al restablecer contraseña' };
    }
};

/**
 * Helper para obtener el usuario actual guardado
 */
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
};