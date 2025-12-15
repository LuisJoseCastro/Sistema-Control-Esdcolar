import React, { type HTMLAttributes, type ReactNode, useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

// --- TIPOS Y PROPIEDADES ---

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  // Ancho opcional: 'sm', 'md' (default), 'lg'
  size?: 'xl' | 'sm' | 'md' | 'lg';
  className?: string;
  // NUEVA PROPIEDAD: Permite ocultar el encabezado y el botón de cerrar
  hideHeader?: boolean; 
}

// --- LÓGICA DE ESTILOS ---
const getSizeClasses = (size: ModalProps['size']) => {
  switch (size) {
    case 'sm':
      return 'max-w-md'; // 448px
    case 'lg':
      return 'max-w-3xl'; // 768px
    case 'md':
    default:
      return 'max-w-xl'; // 640px
  }
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'xl',
  className = '',
  // Desestructuramos la nueva propiedad
  hideHeader = false, 
  ...rest
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Cierra el modal al presionar la tecla ESC
  const handleEscape = useCallback((event: KeyboardEvent) => {
    // Solo cerramos con ESC si no hemos ocultado el encabezado (para darle un punto de control)
    // Aunque se suele dejar activo incluso si se oculta la X. Lo dejaremos activo por accesibilidad.
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Maneja el clic fuera del modal (backdrop)
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Opcional: Deshabilita el scroll del body mientras el modal está abierto
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    }
    // Limpieza: asegura que el event listener se elimine y el scroll se restaure
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) {
    return null;
  }

  const sizeClasses = getSizeClasses(size);

  return (
    <div
      // 🛑 CORRECCIÓN FINAL: Usamos un className básico y agregamos estilo en línea con rgba(0,0,0, 0.5)
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Negro al 50% de opacidad para el backdrop
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      {/* Contenedor del Modal */}
      <div
        ref={modalRef}
        // CORRECCIÓN 2: Altura máxima y scroll (max-h-[90vh] overflow-y-auto)
        className={`bg-white rounded-xl shadow-2xl w-full mx-4 p-6 
                    transform transition-all duration-300 
                    ${sizeClasses} ${className}
                    max-h-[90vh] overflow-y-auto`}
        {...rest}
      >
        {/* Encabezado */}
        {/* Encabezado pegajoso (sticky) */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 transition"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className={!hideHeader ? "mt-4" : ""}> 
          {/* Se elimina el margin-top si el encabezado está oculto */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;