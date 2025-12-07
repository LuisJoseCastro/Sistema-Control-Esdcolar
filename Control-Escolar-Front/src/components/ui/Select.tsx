import React, { type SelectHTMLAttributes} from 'react';
import { ChevronDown } from 'lucide-react';

// --- TIPOS Y PROPIEDADES ---

// Define la estructura de las opciones que recibe el select
interface SelectOption {
  value: string | number;
  label: string;
}

// Extiende las props estándar de un select HTML
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string; // Clases para el div contenedor
  selectClassName?: string; // Clases específicas para el elemento <select>
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  placeholder,
  className = '',
  selectClassName = '',
  ...rest
}) => {
  const baseSelectClasses = `
    appearance-none block w-full bg-white border border-gray-300 
    text-gray-900 py-2.5 pl-4 pr-10 rounded-lg shadow-sm 
    focus:border-cyan-500 focus:ring-cyan-500 transition duration-150
  `;

  return (
    <div className={`w-full ${className}`}>
      {/* Etiqueta */}
      {label && (
        <label className="block text-gray-700 text-sm font-medium mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          className={`${baseSelectClasses} ${selectClassName}`}
          {...rest}
        >
          {/* Opción de placeholder/deshabilitada */}
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {/* Opciones mapeadas */}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Icono de flecha para la apariencia de un select moderno */}
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default Select;