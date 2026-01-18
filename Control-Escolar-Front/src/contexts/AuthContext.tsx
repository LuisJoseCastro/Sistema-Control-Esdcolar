// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, Role } from '../types/models';
import { useTenant } from './TenantContext'; 
import { authService } from '../services/auth.service'; 

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  role: Role | null;
  login: (email: string, password: string) => Promise<void>; 
  logout: () => void;
  isLoading: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  // Inicializar usuario desde localStorage
  const [user, setUser] = useState<User | null>(() => {
    return authService.getCurrentUser();
  });

  const [isLoading, setIsLoading] = useState(false); 
  const { loadTenant } = useTenant();

  // Efecto para cargar la configuración de la escuela (Tenant) al iniciar
  useEffect(() => {
    const initTenant = async () => {
      if (user && user.tenantId) {
        try {
          await loadTenant(user.tenantId);
        } catch (e) {
          console.warn("Error cargando tenant", e);
          // Opcional: logout() si es crítico
        }
      }
    };
    initTenant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // --- FUNCIÓN LOGIN ---
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // 1. Llamada al Backend
      const data = await authService.login(email, password);
      
      const { access_token, user: apiUser } = data;

      // 2. Determinar ROL (NestJS devuelve un string)
      const roleFromServer = (apiUser.rol as string) || (apiUser as any).role; 
      let role: Role = 'DOCENTE'; // Default
      
      if (roleFromServer === 'ADMIN') role = 'ADMIN';
      if (roleFromServer === 'ALUMNO') role = 'ALUMNO';
      if (roleFromServer === 'DOCENTE') role = 'DOCENTE';

      // 3. Determinar Tenant ID (Escuela)
      const finalTenantId = apiUser.school?.id || apiUser.tenantId || 'default-school';

      // 4. Construir objeto de usuario limpio
      const userData: User = {
        id: apiUser.id,
        nombre: apiUser.nombre || apiUser.email, 
        email: apiUser.email,
        rol: role,
        tenantId: finalTenantId,
        school: apiUser.school
      };

      // 5. Cargar datos visuales de la escuela
      try {
          await loadTenant(finalTenantId);
      } catch (e) {
          console.warn("No se pudo cargar config del tenant:", e);
      }

      // 6. Guardar en LocalStorage y Estado
      localStorage.setItem('token', access_token);
      localStorage.setItem('academic_user', JSON.stringify(userData));
      
      setUser(userData);

    } catch (error) {
      console.error("Login error:", error);
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!user, user, role: user?.rol ?? null, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};