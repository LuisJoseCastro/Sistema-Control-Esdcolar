// src/contexts/TenantContext.tsx - CÓDIGO NECESARIO

import React, { createContext, useState, useContext } from 'react';

// Definición de tipos para la configuración de la escuela
interface TenantConfigType {
  id: string; // ID interno del Tenant (Ej: T-123)
  nombre: string;
  logoUrl: string;
  colorPrimario: string; // Para branding dinámico
}

interface TenantContextType {
  config: TenantConfigType | null;
  loading: boolean;
  // loadTenant es la función clave que llama el AuthContext
  loadTenant: (tenantId: string) => Promise<void>; 
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// MOCK: Base de datos simulada de configuración de Tenants
// El AuthContext usa el 'tenantId' (ej: 'T-123') para buscar esta configuración
const MOCK_TENANTS: Record<string, TenantConfigType> = {
  'T-123': { 
    id: 'T-123', 
    nombre: 'Escuela Tesji Global', 
    logoUrl: '/logos/tesji.png', 
    colorPrimario: 'bg-blue-800', // Color del tema de la escuela 'tesji'
  },
  'T-456': { 
    id: 'T-456', 
    nombre: 'Instituto Azteca', 
    logoUrl: '/logos/azteca.png', 
    colorPrimario: 'bg-red-600', // Otro color para otra escuela
  },
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<TenantConfigType | null>(null);
  const [loading, setLoading] = useState(false);

  // Función para cargar la configuración de la escuela (Tenant)
  const loadTenant = async (tenantId: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simular API

    const tenantConfig = MOCK_TENANTS[tenantId];

    if (tenantConfig) {
      setConfig(tenantConfig);
    } else {
      // Si el ID de la escuela no existe, es un error de configuración
      console.error(`Tenant ID ${tenantId} no encontrado en el sistema.`);
      setConfig(null); 
    }
    setLoading(false);
  };

  return (
    <TenantContext.Provider value={{ config, loading, loadTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant debe usarse dentro de un TenantProvider');
  }
  return context;
};