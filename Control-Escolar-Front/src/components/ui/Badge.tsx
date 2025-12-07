import React, { type HTMLAttributes, type ReactNode } from 'react';

// --- TIPOS Y PROPIEDADES ---

// Define las variantes de color para el badge
type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'gray';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string; // Para clases de Tailwind adicionales
}

// --- LÓGICA DE ESTILOS DE TAILWIND ---
const getVariantClasses = (variant: BadgeVariant) => {
  switch (variant) {
    case 'success': // Generalmente para estados "aprobado" o "activo"
      return `bg-green-100 text-green-800`;
    case 'warning': // Generalmente para notas de "extraordinario" o "pendiente"
      return `bg-yellow-100 text-yellow-800`;
    case 'danger': // Generalmente para "reprobado" o "ausente"
      return `bg-red-100 text-red-800`;
    case 'info': // Generalmente para notificaciones o categorías
      return `bg-blue-100 text-blue-800`;
    case 'gray': // Generalmente para etiquetas neutras o datos secundarios
    default:
      return `bg-gray-100 text-gray-800`;
  }
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  className = '',
  ...rest
}) => {
  const baseClasses = `
    inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold uppercase
  `;

  const finalClasses = `${baseClasses} ${getVariantClasses(variant)} ${className}`;

  return (
    <span
      className={finalClasses}
      {...rest}
    >
      {children}
    </span>
  );
};

export default Badge;