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
  const [user, setUser] = useState<User | null>(null);
  // INICIA EN TRUE: Para que la app espere a verificar el localStorage antes de renderizar nada
  const [isLoading, setIsLoading] = useState(true); 
  
  const { loadTenant } = useTenant();

  // EFECTO: Recuperar sesión al recargar la página
  useEffect(() => {
    const initAuth = async () => {
      console.log("🔄 Verificando sesión guardada...");
      const storedUser = localStorage.getItem('academic_user');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("✅ Usuario encontrado:", parsedUser.email);
          
          // Recargamos la configuración de la escuela (Tenant)
          if (parsedUser.tenantId) {
             await loadTenant(parsedUser.tenantId);
          }
          setUser(parsedUser);
        } catch (error) {
          console.error("❌ Error recuperando sesión:", error);
          localStorage.removeItem('academic_user');
        }
      } else {
        console.warn("⚠️ No hay sesión activa.");
      }
      
      // FINALMENTE: Liberamos la carga para que el Router decida qué mostrar
      setIsLoading(false);
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const login = async (email: string, _password: string, schoolKey: string) => {
    setIsLoading(true);
    // Simular delay de red
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
    
    // GUARDAR EN LOCALSTORAGE (La clave de la persistencia)
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