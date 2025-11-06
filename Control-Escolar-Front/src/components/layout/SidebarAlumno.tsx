// src/components/layout/SidebarAlumno.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, ClipboardList, Calendar, MessageSquare, LogOut, User as UserIcon } from 'lucide-react';
import { type User } from '../../types/models';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const alumnoNavItems = [
  { name: 'Inicio', icon: Home, to: '/alumno/dashboard' },
  { name: 'Mis Asignaturas', icon: BookOpen, to: '/alumno/asignaturas' },
  { name: 'Mis Calificaciones', icon: ClipboardList, to: '/alumno/calificaciones' },
  { name: 'Mi Asistencia', icon: Calendar, to: '/alumno/asistencia' },
  { name: 'Mensajes', icon: MessageSquare, to: '/alumno/mensajes' },
];

export const SidebarAlumno: React.FC<SidebarProps> = ({ user, onLogout }) => {
  // ... (Usar la misma plantilla de SidebarAdmin.tsx con width-20 y solo iconos) ...
  // [CÓDIGO DE SIDEBAR similar a SidebarAdmin.tsx, pero con alumnoNavItems]
  const activeLinkClasses = 'bg-blue-600 text-white shadow-lg';
  const inactiveLinkClasses = 'text-gray-300 hover:bg-gray-700';

  return (
    <div className="flex flex-col h-screen w-20 bg-gray-800 text-white p-4 items-center">
      <div className="text-xl font-bold py-4 mb-6">M</div>
      <nav className="flex-grow">
        <ul className="space-y-4">
          {alumnoNavItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) => 
                  `flex justify-center p-3 rounded-lg transition-colors group ${
                    isActive ? activeLinkClasses : inactiveLinkClasses
                  }`
                }
                title={item.name}
              >
                <item.icon size={24} />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="pt-4 border-t border-gray-700 w-full flex flex-col items-center">
        <div title={user.nombre}>
          <UserIcon size={24} className="text-blue-400 mb-2" />
        </div>
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