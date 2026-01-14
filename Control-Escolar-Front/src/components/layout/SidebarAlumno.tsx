import React from 'react';
import { NavLink } from 'react-router-dom';
// ✅ NUEVA IMPORTACIÓN: ChevronsLeft para el botón de colapsar
import { Home, BookOpen, ClipboardList, Calendar, LogOut, User as UserIcon, LibraryBig, ChevronsRight } from 'lucide-react';
// ✅ NUEVA IMPORTACIÓN: Hook del Contexto
import { useSidebar } from '../../contexts/SidebarContext';
import { type User } from '../../types/models';

// Ajustamos la interfaz de props para recibir las variables de AppLayout
interface SidebarProps {
  user: User;
  onLogout: () => void;
  // Los props de SidebarContext ya se obtienen con useSidebar, no es necesario pasarlos por props,
  // pero los mantendré por si lo necesitas en otros componentes.
}

const alumnoNavItems = [
  { name: 'Inicio', icon: Home, to: '/alumno/dashboard' },
  { name: 'Mis Asignaturas', icon: BookOpen, to: '/alumno/asignaturas' },
  { name: 'Mis Calificaciones', icon: ClipboardList, to: '/alumno/calificaciones' },
  { name: 'Mi Asistencia', icon: Calendar, to: '/alumno/asistencia' },
  { name: 'Historial Academico', icon: LibraryBig, to: '/alumno/historial-academico' },
];

export const SidebarAlumno: React.FC<SidebarProps> = ({ user, onLogout }) => {
  // ✅ OBTENER EL ESTADO Y LA FUNCIÓN DEL CONTEXTO
  const { isCollapsed, toggleCollapse, collapsedWidth, expandedWidth } = useSidebar();

  const activeLinkClasses = 'bg-blue-600 text-white shadow-lg';
  const inactiveLinkClasses = 'text-gray-300 hover:bg-gray-700';

  const sidebarWidth = isCollapsed ? collapsedWidth : expandedWidth;

  return (
    // ✅ EL ANCHO AHORA ES DINÁMICO
    <div
      className={`flex flex-col h-screen ${sidebarWidth} bg-gray-800 text-white p-4 transition-all duration-300 relative`}
    >
      {/* Título/Logo dinámico */}
      <header className={`py-4 mb-6 flex ${isCollapsed ? 'justify-center' : 'justify-between items-center'}`}>
        {/* Mostramos el título si NO está colapsado */}
        {!isCollapsed && <span className="text-xl font-bold">Menú Alumno</span>}

        {/* Botón de Colapsar/Expandir */}
        <button
          onClick={toggleCollapse}
          // ✅ El ícono rota si está expandido
          className={`p-1 rounded-full text-gray-400 hover:bg-gray-700 transition-transform duration-300 ${!isCollapsed ? 'rotate-180' : ''}`}
          title={isCollapsed ? "Expandir" : "Colapsar"}
        >
          <ChevronsRight size={24} />
        </button>
      </header>

      {/* Navegación */}
      <nav className="flex grow">
        <ul className="space-y-4 w-full">
          {alumnoNavItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors group ${isActive ? activeLinkClasses : inactiveLinkClasses
                  } ${isCollapsed ? 'justify-center' : 'justify-start'}` // Centrado si está colapsado
                }
                title={item.name}
              >
                <item.icon size={24} className={!isCollapsed ? 'mr-3' : ''} />
                {/* ✅ Mostramos el texto solo si NO está colapsado */}
                {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Área de Usuario y Logout */}
      <div className="pt-4 border-t border-gray-700 w-full flex flex-col items-center">
        <div title={user.nombre} className={`flex items-center mb-2 w-full ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
          <UserIcon size={24} className="text-blue-400 mr-2" />
          {/* ✅ Mostramos el nombre solo si NO está colapsado */}
          {!isCollapsed && <span className="text-sm truncate">{user.nombre}</span>}
        </div>
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