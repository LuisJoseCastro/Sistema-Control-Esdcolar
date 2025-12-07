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
      return `bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 
              text-white shadow-md hover:shadow-lg focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-75`;
    case 'primary': // Visto en botones "Enviar" y "Iniciar Sesión" (Azul Oscuro)
      return `bg-blue-600 hover:bg-blue-700 text-white shadow-md focus:ring-4 focus:ring-blue-300`;
    case 'secondary': // Visto en botón "Limpiar" o acciones menos prioritarias (Gris/Claro)
      return `bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300`;
    case 'ghost': // Visto en la barra lateral o botones de texto plano (Transparente)
      return `bg-transparent hover:bg-gray-100 text-blue-600 border border-transparent`;
    default:
      return 'bg-blue-600 hover:bg-blue-700 text-white';
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