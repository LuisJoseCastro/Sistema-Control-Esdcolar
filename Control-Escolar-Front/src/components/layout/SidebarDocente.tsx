// src/components/layout/SidebarDocente.tsx (VERSIÓN FINAL CON ENLACE DE PERFIL)

import React from 'react';
import { NavLink, Link } from 'react-router-dom'; // 🚨 Importamos 'Link' para el perfil
import { useSidebar } from '../../contexts/SidebarContext'; 
import { type User } from '../../types/models';
import {
  Home,
  ClipboardList,
  BookOpen,
  Calendar,
  Users,
  MessageSquare,
  LogOut,
  User as UserIcon,
  ChevronsLeft 
} from 'lucide-react';

// Interfaz de Props ajustada
interface SidebarProps {
  user: User;
  onLogout: () => void;
}

// Elementos de Navegación del Docente (sin cambios)
const docenteNavItems = [
  { name: 'Inicio', icon: Home, to: '/docente/dashboard' },
  { name: 'Calificaciones', icon: ClipboardList, to: '/docente/calificaciones' },
  { name: 'Asistencia', icon: BookOpen, to: '/docente/asistencia' },
  { name: 'Reportes', icon: Calendar, to: '/docente/reportes' },
  { name: 'Grupos', icon: Users, to: '/docente/grupos' },
  { name: 'Mensajes', icon: MessageSquare, to: '/docente/mensajes' },
];

export const SidebarDocente: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const { isCollapsed, toggleCollapse, collapsedWidth, expandedWidth } = useSidebar();

  const activeLinkClasses = 'bg-blue-600 text-white shadow-lg';
  const inactiveLinkClasses = 'text-gray-300 hover:bg-gray-700';

  const sidebarWidth = isCollapsed ? collapsedWidth : expandedWidth;

  return (
    <div
      className={`flex flex-col h-screen ${sidebarWidth} bg-gray-800 text-white p-4 transition-all duration-300 relative shrink-0`}
    >
      {/* Título/Logo y Botón de Colapso */}
      <header className={`py-4 mb-6 flex ${isCollapsed ? 'justify-center' : 'justify-between items-center'}`}>
        {!isCollapsed && <span className="text-xl font-bold">Menú Docente</span>}
        <button
          onClick={toggleCollapse}
          className={`p-1 rounded-full text-gray-400 hover:bg-gray-700 transition-transform duration-300 ${!isCollapsed ? 'rotate-180' : ''}`}
          title={isCollapsed ? "Expandir" : "Colapsar"}
        >
          <ChevronsLeft size={24} />
        </button>
      </header>

      {/* Navegación (sin cambios) */}
      <nav className="flex grow">
        <ul className="space-y-4 w-full">
          {docenteNavItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors group ${isActive ? activeLinkClasses : inactiveLinkClasses
                  } ${isCollapsed ? 'justify-center' : 'justify-start'}`
                }
                title={item.name}
              >
                <item.icon size={24} className={!isCollapsed ? 'mr-3' : ''} />
                {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Área de Usuario y Logout (MODIFICADA) */}
      <div className="pt-4 border-t border-gray-700 w-full flex flex-col items-center">
        
        {/* 🚨 ENLACE DE PERFIL DEL DOCENTE */}
        <Link 
            to="/docente/perfil" 
            title={`Ver perfil de ${user.nombre}`}
            className={`flex items-center mb-2 w-full p-2 rounded-lg transition-colors ${
                isCollapsed ? 'justify-center hover:bg-gray-700' : 'justify-start hover:bg-gray-700'
            }`}
        >
          <UserIcon size={24} className="text-blue-400 mr-2" />
          {/* Mostramos el nombre solo si NO está colapsado */}
          {!isCollapsed && <span className="text-sm truncate">{user.nombre}</span>}
        </Link>
        
        <button
          onClick={onLogout}
          // Centramos el botón en el modo colapsado
          className={`p-2 rounded-lg hover:bg-red-600 transition-colors w-full ${isCollapsed ? 'flex justify-center' : 'flex justify-start items-center'}`}
          title="Salir"
        >
          <LogOut size={24} className={!isCollapsed ? 'mr-3' : ''} />
          {!isCollapsed && <span className="text-sm font-medium">Salir</span>}
        </button>
      </div>
    </div>
  );
};