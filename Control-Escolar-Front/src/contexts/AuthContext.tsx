import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, Role } from '../types/models';
import { useTenant } from './TenantContext'; 

// --- MOCK DB ---
const MOCK_DB: Record<string, User> = {
  'adminmaria@tesji.com': { id: 'a1', nombre: 'Admin Maria', email: 'adminmaria@tesji.com', rol: 'ADMIN', tenantId: 'T-123' },
  'drodolfo@tesji.com': { id: 'd1', nombre: 'Rodolfo Docente', email: 'drodolfo@tesji.com', rol: 'DOCENTE', tenantId: 'T-123' },
  'a12345678@tesji.com': { id: 'l1', nombre: 'Laura Alumna', email: 'a12345678@tesji.com', rol: 'ALUMNO', tenantId: 'T-123' },
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  role: Role | null;
  login: (email: string, password: string, schoolKey: string) => Promise<Role>;
  logout: () => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  // 1. CAMBIO CLAVE: "Lazy Initialization"
  // Leemos el localStorage DIRECTAMENTE al iniciar el estado.
  // Esto garantiza que 'user' tenga valor ANTES del primer renderizado.
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('academic_user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error parsing user from storage", error);
      return null;
    }
  });

  // Si ya tenemos usuario (por lazy init), no necesitamos bloquear con carga inicial
  // a menos que quieras forzar la carga del Tenant.
  const [isLoading, setIsLoading] = useState(true); 
  
  const { loadTenant } = useTenant();

  // 2. EFECTO: Solo para cargar configuraciones extra (Tenant)
  useEffect(() => {
    const initTenant = async () => {
      if (user && user.tenantId) {
        console.log("🔄 Recargando configuración de escuela...");
        await loadTenant(user.tenantId);
      }
      setIsLoading(false);
    };

    initTenant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Se ejecuta una vez. Si user ya existe, carga el tenant.

  const login = async (email: string, _password: string, schoolKey: string) => {
    setIsLoading(true);
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const lookupEmail = email.toLowerCase();
    const foundUser = MOCK_DB[lookupEmail];
    
    if (!foundUser) {
        setIsLoading(false);
        throw new Error("Credenciales inválidas.");
    }

    const emailDomainPart = lookupEmail.split('@')[1]?.split('.')[0];
    if (emailDomainPart !== schoolKey) {
        setIsLoading(false);
        throw new Error("Clave de escuela inválida.");
    }
    
    await loadTenant(foundUser.tenantId); 
    
    // Guardar en Storage
    localStorage.setItem('academic_user', JSON.stringify(foundUser));
    
    setUser(foundUser);
    setIsLoading(false);
    return foundUser.rol;
  };

  const logout = () => {
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