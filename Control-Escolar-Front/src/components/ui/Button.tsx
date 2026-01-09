// src/components/ui/Button.tsx

import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react'; // Usamos Loader2 para simular carga

// --- TIPOS Y PROPIEDADES ---

// Define las variantes de color/estilo del botón
type ButtonVariant = 'gradient' | 'primary' | 'secondary' | 'ghost';

// Extiende las props estándar de un botón HTML para incluir onClick, type, etc.
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  isLoading?: boolean; // Para deshabilitar y mostrar un spinner
  icon?: ReactNode; // Icono opcional a mostrar junto al texto
  className?: string; // Para permitir clases de Tailwind adicionales
}

// --- LÓGICA DE ESTILOS DE TAILWIND ---
const getVariantClasses = (variant: ButtonVariant) => {
  switch (variant) {
    case 'gradient': // Visto en el botón "Empezar Ahora" y "Guardar Calificaciones"
      return `bg-main-800 hover:bg-main-900 
              text-whiteBg-50 shadow-md hover:shadow-lg focus:ring-4 focus:ring-grayDark-500 focus:ring-opacity-75 cursor-pointer`;
    case 'primary': // Visto en botones "Enviar" y "Iniciar Sesión" (Azul Oscuro)
      return `bg-main-800 hover:bg-main-900 text-whiteBg-50 shadow-md focus:ring-4 focus:ring-grayDark-500 cursor-pointer`;
    case 'secondary': // Visto en botón "Limpiar" o acciones menos prioritarias (Gris/Claro)
      return `bg-main-600 hover:bg-main-700 text-whiteBg-50 border border-gray-300 cursor-pointer`;
    case 'ghost': // Visto en la barra lateral o botones de texto plano (Transparente)
      return `bg-main-600 hover:bg-main-800 text-whiteBg-50 border border-transparent cursor-pointer`;
    default:
      return 'bg-main-600 hover:bg-main-700 text-whiteBg-50 cursor-pointer';
  }
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary', // 'primary' es el valor por defecto
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...rest
}) => {
  const baseClasses = `
    font-semibold py-2.5 px-6 rounded-lg 
    transition duration-200 ease-in-out 
    flex items-center justify-center space-x-2 
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

  const finalClasses = `${baseClasses} ${getVariantClasses(variant)} ${className}`;

  return (
    <button
      className={finalClasses}
      disabled={isLoading || disabled}
      {...rest}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {/* Muestra el icono solo si está presente */}
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;