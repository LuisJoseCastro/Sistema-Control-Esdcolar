//src/contexts/SidebarContext.tsx
import React, { createContext, useState, useContext} from 'react';
import type {ReactNode} from 'react';
// 1. Definición del tipo de contexto
interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  // Añadimos las variables de ancho para facilitar el uso en el layout
  collapsedWidth: string; // Ej: 'w-20'
  expandedWidth: string;  // Ej: 'w-64'
}

// 2. Creación del contexto
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// 3. Proveedor del Contexto
export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };
  
  const value: SidebarContextType = {
    isCollapsed,
    toggleCollapse,
    collapsedWidth: 'w-20',
    expandedWidth: 'w-64', // Un ancho mayor para mostrar los nombres
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

// 4. Hook personalizado para usar el contexto
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar debe usarse dentro de un SidebarProvider');
  }
  return context;
};