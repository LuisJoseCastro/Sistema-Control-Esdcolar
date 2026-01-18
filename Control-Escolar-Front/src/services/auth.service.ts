import api from './api';
import type { AuthResponse, User } from '../types/models';

export const authService = {
  /**
   * 1. LOGIN: Solo se encarga de hablar con la API.
   * La parte de guardar en localStorage la dejaremos al Contexto 
   * para no duplicar código y evitar errores de sincronización.
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Error de conexión con el servidor' };
    }
  },

  // 🚨 AGREGA ESTA FUNCIÓN AQUÍ:
    forgotPassword: async (email: string) => {
        const { data } = await api.post('/auth/forgot-password', { email });
        return data; 
    },

    /**
     * Restablecer contraseña con token (NUEVA)
     */
    resetPassword: async (token: string, password: string) => {
        const { data } = await api.post('/auth/reset-password', { token, password });
        return data;
    },

  /**
   * 2. LOGOUT: Limpia todo
   * Aquí usamos 'academic_user' para coincidir con tu Contexto nuevo.
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('academic_user'); // ⚠️ Corrección importante
    // localStorage.removeItem('user'); // Por si quedó basura vieja
    window.location.href = '/login'; 
  },

  /**
   * 3. OBTENER USUARIO ACTUAL
   * Sirve para cuando recargas la página (F5)
   */
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('academic_user'); // ⚠️ Debe coincidir con Context
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * 4. HELPER DE REDIRECCIÓN (Conservamos tu función útil)
   * Esto ayuda al Login a saber a dónde mandar a la gente.
   */
  getRedirectPath: (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'DOCENTE':
        return '/docente/dashboard'; // Asegúrate que la ruta en App.tsx sea esta
      case 'ALUMNO':
        return '/alumno/dashboard';
      default:
        return '/login'; // O una página 404
    }
  }
};