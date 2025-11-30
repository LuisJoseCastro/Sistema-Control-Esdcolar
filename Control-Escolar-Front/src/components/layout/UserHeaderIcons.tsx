import React from 'react';
import { BellDot, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// NOTA: Asumo que tienes una forma de obtener el número de notificaciones no leídas,
// por ahora, lo haremos estático o basado en el Dashboard.

interface UserHeaderIconsProps {
  // Opcional: para mostrar la burbuja de notificación no leída (ejemplo)
  unreadCount?: number; 
}

export const UserHeaderIcons: React.FC<UserHeaderIconsProps> = ({ unreadCount = 0 }) => {
  const navigate = useNavigate();
  
  // Rutas asumidas para el alumno:
  const NOTIFICATION_ROUTE = '/alumno/mensajes';
  const PROFILE_ROUTE = '/alumno/perfil';

  return (
    <div className="flex gap-4 text-gray-500 text-2xl">
      
      {/* Ícono de Notificaciones */}
      <span 
        className="cursor-pointer relative transition-colors hover:text-blue-600"
        onClick={() => navigate(NOTIFICATION_ROUTE)}
        title="Ver Notificaciones"
      >
        <BellDot size={28} />
        {/* Indicador de no leídas (ejemplo) */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </span>
      
      {/* Ícono de Perfil */}
      <span 
        className="cursor-pointer transition-colors hover:text-blue-600"
        onClick={() => navigate(PROFILE_ROUTE)}
        title="Ver Perfil"
      >
        <UserIcon size={28} />
      </span>
      
    </div>
  );
};