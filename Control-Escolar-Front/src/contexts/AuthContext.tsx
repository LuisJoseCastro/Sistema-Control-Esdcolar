import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, Role } from '../types/models';
import { useTenant } from './TenantContext'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  role: Role | null;
  login: (email: string, password: string, schoolKey: string) => Promise<Role>;
  logout: () => void;
  isLoading: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('academic_user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false); 
  const { loadTenant } = useTenant();

  useEffect(() => {
    const initTenant = async () => {
      if (user && user.tenantId) {
        try {
          await loadTenant(user.tenantId);
        } catch {
          logout(); 
        }
      }
    };
    initTenant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const login = async (email: string, password: string, schoolKey: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      const data = await response.json();
      const { access_token, user: apiUser } = data;

      localStorage.setItem('token', access_token);

      let role: Role = 'DOCENTE'; 
      if (apiUser.roles && apiUser.roles.includes('admin')) role = 'ADMIN';
      if (apiUser.roles && apiUser.roles.includes('student')) role = 'ALUMNO';
      
      const finalTenantId = apiUser.tenantId || schoolKey;

      const userData: User = {
        id: apiUser.id,
        nombre: apiUser.fullName || apiUser.email,
        email: apiUser.email,
        rol: role, 
        tenantId: finalTenantId
      };

      try {
          await loadTenant(finalTenantId);
      } catch (e) {
          console.warn(e);
      }

      localStorage.setItem('academic_user', JSON.stringify(userData));
      setUser(userData);

      return role;

    } catch (error) {
      console.error(error);
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('academic_user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!user, user, role: user?.rol ?? null, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};