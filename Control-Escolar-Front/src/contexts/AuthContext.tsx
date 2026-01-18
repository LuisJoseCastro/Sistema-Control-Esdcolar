import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, Role } from '../types/models';
import { useTenant } from './TenantContext';

// URL DEL BACKEND
const API_URL = 'http://localhost:3000';

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  role: Role | null;
  // Mantenemos la firma para no romper tus componentes, aunque schoolKey ya no se use en el back
  login: (email: string, password: string, schoolKey: string) => Promise<Role>;
  logout: () => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('academic_user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error parsing user from storage", error);
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const { loadTenant } = useTenant();

  // Efecto para recargar configuración si hay usuario guardado (persistencia)
  useEffect(() => {
    const initTenant = async () => {
      // Si tenemos usuario y token, validamos que el tenant esté cargado
      const token = localStorage.getItem('access_token');
      if (user && token) {
        // Aquí podrías opcionalmente cargar datos extra de la escuela si tienes el ID
        // await loadTenant(user.schoolId); 
      }
    };
    initTenant();
  }, [user]);

  const login = async (email: string, password: string, schoolKey: string) => {
    setIsLoading(true);
    try {
      // 1. PETICIÓN REAL AL BACKEND 🚀
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }) // Ya no enviamos schoolKey al back
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en las credenciales');
      }

      // 2. RECIBIMOS EL TOKEN Y DATOS
      const data = await response.json();
      const { access_token, user: userData } = data;

      // 3. TRANSFORMACIÓN DE DATOS (Backend -> Frontend Model)
      // Adaptamos la respuesta del back a tu interfaz 'User' del front
      const appUser: User = {
        id: userData.id,
        nombre: userData.fullName,
        email: userData.email,
        rol: userData.rol, // Asegúrate de que el enum coincida (ALUMNO vs STUDENT)
        tenantId: 'default-tenant', // O el ID real de la escuela si viene en el login
      };

      // 4. GUARDAR EN LOCALSTORAGE (CRÍTICO PARA QUE FUNCIONE EL PERFIL)
      localStorage.setItem('access_token', access_token); // 👈 ¡ESTO FALTABA!
      localStorage.setItem('academic_user', JSON.stringify(appUser));

      setUser(appUser);
      setIsLoading(false);
      return appUser.rol;

    } catch (error) {
      setIsLoading(false);
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    // Borramos todo rastro
    localStorage.removeItem('access_token');
    localStorage.removeItem('academic_user');
    setUser(null);
    // Redirigir o limpiar estado
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!user, user, role: user?.rol ?? null, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};  