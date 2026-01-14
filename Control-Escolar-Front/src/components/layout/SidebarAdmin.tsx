// src/components/layout/SidebarAdmin.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, GraduationCap, FileText, LogOut, User as UserIcon } from 'lucide-react';
import { type User } from '../../types/models'; // Importado como 'type'

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const adminNavItems = [
  { name: 'Inicio', icon: Home, to: '/admin/dashboard' },
  { name: 'Mensajes', icon: MessageSquare, to: '/admin/mensajes' },
  { name: 'Gestión Plan Estudios', icon: GraduationCap, to: '/admin/plan-estudios' },
  { name: 'Reporte Académico', icon: FileText, to: '/admin/reportes' },
];

export const SidebarAdmin: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const activeLinkClasses = 'bg-blue-600 text-white shadow-lg';
  const inactiveLinkClasses = 'text-gray-300 hover:bg-gray-700';

  return (
    <div className="flex flex-col h-screen w-20 bg-gray-800 text-white p-4 items-center">
      
      {/* Encabezado/Logo */}
      <div className="text-xl font-bold py-4 mb-6">M</div>

      {/* Menú de Navegación (Solo Iconos) */}
      <nav className="grow">
        <ul className="space-y-4">
          {adminNavItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) => 
                  `flex justify-center p-3 rounded-lg transition-colors group ${
                    isActive ? activeLinkClasses : inactiveLinkClasses
                  }`
                }
                // --- CORRECCIÓN AQUÍ ---
                // El 'title' se aplica al NavLink para el tooltip.
                title={item.name} 
              >
                {/* El 'title' se elimina del icono */}
                <item.icon size={24} />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* PIE DE PÁGINA (Usa user y onLogout) */}
      <div className="pt-4 border-t border-gray-700 w-full flex flex-col items-center">
        
        <button
          onClick={onLogout} 
          className="p-2 rounded-lg hover:bg-red-600 transition-colors"
          title="Salir"
        >
          <LogOut size={24} /> 
        </button>
      </div>
    </div>
  );
};