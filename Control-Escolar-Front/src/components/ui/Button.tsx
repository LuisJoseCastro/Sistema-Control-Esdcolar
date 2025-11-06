// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Define las variantes de estilo que usará tu equipo
  variant: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ variant, children, className = '', ...props }) => {
  // Clases base para todos los botones
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2';
  
  // Lógica para aplicar los colores según la variante
  const getClasses = () => {
    switch (variant) {
      case 'primary': return 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400';
      case 'danger': return 'bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400';
      default: return 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-400';
    }
  };

  return (
    <button className={`${baseClasses} ${getClasses()} ${className}`} {...props}>
      {children}
    </button>
  );
};