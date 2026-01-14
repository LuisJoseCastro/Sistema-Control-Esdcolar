// src/components/layout/SidebarAdmin.tsx

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, GraduationCap, FileText, LogOut, User as UserIcon, X, Check } from 'lucide-react';
import { type User } from '../../types/models'; // Importado como 'type'
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
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
  // Estado para controlar la modal de confirmación
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
                title={item.name} 
              >
                <item.icon size={24} />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* PIE DE PÁGINA */}
      <div className="pt-4 border-t border-gray-700 w-full flex flex-col items-center">
        {/* Icono de usuario para contexto (opcional, pero útil) */}
        <div className="mb-4 text-blue-400" title={`Administrador: ${user.nombre}`}>
          <UserIcon size={24} />
        </div>

        <button
          // CAMBIO: Ahora abre la modal en lugar de salir directo
          onClick={() => setIsLogoutModalOpen(true)} 
          className="p-2 rounded-lg hover:bg-red-600 transition-colors"
          title="Salir"
        >
          <LogOut size={24} /> 
        </button>
      </div>

      {/* MODAL DE CONFIRMACIÓN PARA ADMIN */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirmar Salida"
        size="sm"
      >
        <div className="py-4 text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-red-100 p-3 rounded-full">
              <LogOut className="text-red-600 w-8 h-8" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">¿Cerrar Sesión?</h3>
          <p className="text-gray-600 mb-8">
            Estás a punto de salir del panel de administración. ¿Deseas continuar?
          </p>
          
          <div className="flex justify-center gap-3">
            {/* Botón para Cancelar (Icono X) */}
            <Button
              variant="secondary"
              onClick={() => setIsLogoutModalOpen(false)}
              className="flex items-center gap-2"
            >
              <X size={18} />
              Cancelar
            </Button>

            {/* Botón para Confirmar (Icono Check) */}
            <Button
              variant="primary"
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 border-none"
            >
              <Check size={18} />
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};