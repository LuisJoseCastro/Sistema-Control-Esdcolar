// src/components/layout/SidebarDocente.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, BookOpen, Calendar, Users, MessageSquare, LogOut, User as UserIcon } from 'lucide-react';
import { type User } from '../../types/models.ts';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const docenteNavItems = [
  { name: 'Inicio', icon: Home, to: '/docente/dashboard' },
  { name: 'Calificaciones', icon: ClipboardList, to: '/docente/calificaciones' },
  { name: 'Asistencia', icon: BookOpen, to: '/docente/asistencia' },
  { name: 'Reportes', icon: Calendar, to: '/docente/reportes' },
  { name: 'Grupos', icon: Users, to: '/docente/grupos' },
  { name: 'Mensajes', icon: MessageSquare, to: '/docente/mensajes' },
];

export const SidebarDocente: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const activeLinkClasses = 'bg-blue-600 text-white shadow-lg';
  const inactiveLinkClasses = 'text-gray-300 hover:bg-gray-700';

  return (
    <div className="flex flex-col h-screen w-64 bg-gray-800 text-white p-4">
      {/* ... (Usar la plantilla de width-64 con nombres) ... */}
      <div className="text-xl font-bold py-4 border-b border-gray-700 mb-6">
        Sistema Académico
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {docenteNavItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                    isActive ? activeLinkClasses : inactiveLinkClasses
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 p-3">
          <UserIcon size={20} className="text-blue-400" />
          <div>
            <p className="font-semibold text-sm">{user.nombre.split(' ')[0]}</p>
            <p className="text-xs text-gray-400 capitalize">{user.rol.toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center justify-center w-full space-x-2 bg-gray-700 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg mt-2"
        >
          <LogOut size={20} />
          <span>Salir</span>
        </button>
      </div>
    </div>
  );
};