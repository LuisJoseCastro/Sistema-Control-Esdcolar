// src/components/ui/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean; // Estado para mostrar u ocultar
  onClose: () => void; // Función para cerrar el modal
  title: string;
  children: React.ReactNode;
  className?: string; // Para estilizar el contenido interior
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className = '' }) => {
  if (!isOpen) return null;

  // Manejador para cerrar si se hace clic fuera del contenido
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Backdrop oscuro que cubre toda la pantalla
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Contenedor principal del Modal */}
      <div 
        className={`bg-white rounded-xl shadow-2xl max-w-lg w-full transform transition-all overflow-hidden ${className}`}
        onClick={(e) => e.stopPropagation()} // Evita que el clic cierre el modal
      >
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            {/* Ícono simple de cerrar (X) */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        {/* Cuerpo del Modal (donde va el formulario o contenido) */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};