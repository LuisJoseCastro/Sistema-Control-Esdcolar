// src/components/ui/Card.tsx
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  // Permite controlar si la tarjeta tiene relleno (p-6)
  noPadding?: boolean; 
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false, ...props }) => {
  // La clase base aplica el estilo blanco con sombra de tus diseños.
  const baseClasses = 'bg-white rounded-xl shadow-lg';
  
  // Clase de relleno condicional.
  const paddingClass = noPadding ? '' : 'p-6';
  
  return (
    <div 
      className={`${baseClasses} ${paddingClass} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};