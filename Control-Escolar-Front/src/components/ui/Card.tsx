import React, { type HTMLAttributes, type ReactNode } from 'react';

// --- TIPOS Y PROPIEDADES ---

// Define las variantes predefinidas de la tarjeta
type CardVariant = 'default' | 'elevated' | 'flat';

// Extiende las props estándar de un div HTML
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  // Permite definir un encabezado opcional para la tarjeta (ej: el título "Iniciar Sesión")
  header?: ReactNode; 
  className?: string; // Para permitir clases de Tailwind adicionales
}

// --- LÓGICA DE ESTILOS DE TAILWIND ---
const getVariantClasses = (variant: CardVariant) => {
  switch (variant) {
    case 'elevated': // Para elementos que flotan (ej: Modales o el contenedor de Login)
      return `shadow-xl hover:shadow-2xl transition-shadow duration-300`;
    case 'flat': // Para contenedores de información o filtros (ej: Tarjeta de Filtros en Grades)
      return `border border-gray-200`;
    case 'default': // El estilo más común
    default:
      return `shadow-lg border border-gray-100`;
  }
};

/**
 * Componente atómico de Tarjeta (Card).
 * Proporciona un contenedor estilizado con variantes predefinidas.
 * Se puede usar para contenedores, paneles de formularios o tarjetas de navegación.
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  header,
  className = '',
  ...rest
}) => {
  // Si el className tiene un color de fondo personalizado, no agregamos bg-white
  const hasCustomBg = className.includes('bg-');
  const baseClasses = `rounded-2xl p-6 ${!hasCustomBg ? 'bg-grayDark-300' : ''}`;

  const finalClasses = `${baseClasses} ${getVariantClasses(variant)} ${className}`;

  return (
    <div
      className={finalClasses}
      {...rest}
    >
      {/* Encabezado Opcional */}
      {header && (
        <div className="mb-4 pb-3 border-b border-whiteBg-50">
          {/* Aseguramos un estilo consistente para el encabezado */}
          <h2 className="text-xl font-bold text-gray-800">{header}</h2>
        </div>
      )}

      {/* Contenido principal de la tarjeta */}
      {children}
    </div>
  );
};
// Usamos exportación nombrada para consistencia