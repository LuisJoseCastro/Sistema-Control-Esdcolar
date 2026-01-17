import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface TenantConfigType {
  id: string;
  nombre: string;
  logoUrl: string;
  colorPrimario: string;
}

const DEFAULT_CONFIG: TenantConfigType = {
  id: 'default',
  nombre: 'Plataforma Escolar',
  logoUrl: '/Logo-Academy+.jpeg',
  colorPrimario: '#2563eb'
};

interface TenantContextType {
  config: TenantConfigType | null;
  loading: boolean;
  loadTenant: (tenantId: string) => Promise<void>; 
}

// eslint-disable-next-line react-refresh/only-export-components
export const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<TenantConfigType | null>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);

  const loadTenant = async (tenantId: string) => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tenants/${tenantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error(`Error API: ${response.status}`);

      const data = await response.json();

      const newConfig: TenantConfigType = {
        id: data.id || tenantId,
        nombre: data.schoolName || data.nombre || data.businessName || 'Escuela',
        logoUrl: data.logoUrl || data.logo || DEFAULT_CONFIG.logoUrl,
        colorPrimario: data.primaryColor || data.colorPrimario || DEFAULT_CONFIG.colorPrimario
      };

      setConfig(newConfig);
      
      document.documentElement.style.setProperty('--color-primary', newConfig.colorPrimario);

    } catch (error) {
      console.error(error);
      setConfig({ ...DEFAULT_CONFIG, id: tenantId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TenantContext.Provider value={{ config, loading, loadTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenant debe usarse dentro de un TenantProvider');
  return context;
};