// src/components/ui/Input.tsx
import React from 'react';

// Acepta todas las propiedades nativas de un <input>
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input 
      // Estilo de borde, relleno y foco consistente con el diseño de Figma
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
      {...props} 
    />
  );
};