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
  // ✅ CAMBIO 1: Quitamos schoolKey de la definición del tipo
  login: (email: string, password: string) => Promise<Role>;
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
      // ✅ IMPORTANTE: Buscamos 'token' para ser consistentes con api.ts
      const token = localStorage.getItem('token'); 
      if (user && token) {
        // Lógica de carga de tenant si fuera necesaria
      }
    };
    initTenant();
  }, [user]);

  // ✅ CAMBIO 2: Quitamos 'schoolKey' de los argumentos de la función
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // 1. PETICIÓN REAL AL BACKEND
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Al backend solo le mandamos email y password, él deduce la escuela
        body: JSON.stringify({ email, password }) 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en las credenciales');
      }

      // 2. RECIBIMOS EL TOKEN
      const data = await response.json();
      const { access_token, user: userData } = data;

      const appUser: User = {
        id: userData.id,
        nombre: userData.fullName,
        email: userData.email,
        rol: userData.rol, 
        tenantId: 'default-tenant',
      };

      // ✅ 3. GUARDADO CRÍTICO (Usamos 'token' para coincidir con api.ts)
      localStorage.setItem('token', access_token); 
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
    localStorage.removeItem('token');
    localStorage.removeItem('academic_user');
    setUser(null);
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