// src/components/ui/LoadingSpinner.tsx
import React from 'react';

// Se puede usar cualquier icono de Lucide para el spinner
import { Loader } from 'lucide-react'; 

interface LoadingProps {
  size?: number;
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingProps> = ({ size = 32, className = '', text = 'Cargando datos...' }) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Aplicamos una animación de giro y el color principal */}
      <Loader size={size} className="animate-spin text-blue-600" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
};