// src/contexts/AuthContext.tsx - CÓDIGO CORREGIDO PARA SAAS

import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import type { User, Role } from '../types/models';
// Necesitas este hook para cargar la configuración de la escuela al hacer login
import { useTenant } from './TenantContext'; 

// --- MOCK DATABASE (Para pruebas del Login General) ---
const MOCK_DB: Record<string, User> = {
  // CLAVE: Correo en minúsculas para coincidencia
  // USUARIOS DEL TENANT 'tesji' (Clave SaaS: tesji. Dominio de prueba: T-123)
  'adminmaria@tesji.com': { 
    id: 'a1', 
    nombre: 'Admin Maria', 
    email: 'adminmaria@tesji.com', 
    rol: 'ADMIN', 
    tenantId: 'T-123' 
  },
  'drodolfo@tesji.com': { 
    id: 'd1', 
    nombre: 'Rodolfo Docente', 
    email: 'drodolfo@tesji.com', 
    rol: 'DOCENTE', 
    tenantId: 'T-123' 
  },
  'a12345678@tesji.com': { 
    id: 'l1', 
    nombre: 'Laura Alumna', 
    email: 'a12345678@tesji.com', 
    rol: 'ALUMNO', 
    tenantId: 'T-123' 
  },
  // Nota: La contraseña '1234' se ignora en este mock, solo se valida el email.
};
// --- FIN MOCK DATABASE ---


// Tipo del contexto de autenticación
type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  role: Role | null;
  // El tercer parámetro schoolKey ya NO es opcional
  login: (email: string, password: string, schoolKey: string) => Promise<Role>;
  logout: () => void;
};

// Contexto (exportado para que useAuth lo consuma)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor de Auth
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { loadTenant } = useTenant(); // Usar el hook del TenantContext

  const login = async (email: string, _password: string, schoolKey: string) => {
    
    // 1. Estandarizar el email a minúsculas para la búsqueda en MOCK_DB
    const lookupEmail = email.toLowerCase();
    
    // 2. Buscar al usuario en la base de datos mock
    const foundUser = MOCK_DB[lookupEmail];
    
    if (!foundUser) {
        throw new Error("Credenciales inválidas o usuario no encontrado.");
    }

    // 3. Simular la validación del Dominio (Clave SaaS)
    // El dominio del email debe coincidir con la clave (tesji)
    const emailDomainPart = lookupEmail.split('@')[1]?.split('.')[0];
    
    if (emailDomainPart !== schoolKey) {
        throw new Error("Clave de escuela inválida. El dominio del correo no coincide.");
    }
    
    // 4. Cargar la configuración del Tenant (Escuela)
    // Usamos 'T-123' ya que todos los usuarios de prueba pertenecen a esa escuela
    await loadTenant(foundUser.tenantId); 
    
    // 5. Autenticación exitosa
    setUser(foundUser);
    return foundUser.rol;
  };

  const logout = () => {
    // Al hacer logout, también debes restablecer el tenant (opcional, pero buena práctica)
    setUser(null);
    // Nota: Deberías agregar una función clearTenant al TenantContext para una limpieza completa.
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!user, user, role: user?.rol ?? null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook simple para usar el contexto (debería estar en hooks/useAuth.ts)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};