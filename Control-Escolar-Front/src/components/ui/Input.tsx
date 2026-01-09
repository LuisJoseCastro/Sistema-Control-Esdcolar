// src/components/ui/Input.tsx

import React, { type InputHTMLAttributes, useState, type ReactNode, type ComponentType } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

// --- TIPOS Y PROPIEDADES ---

type LucideIconComponent = ComponentType<{ className: string }>;
type CustomIcon = LucideIconComponent | ReactNode;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  iconType?: 'email' | 'password' | 'default';
  endIcon?: CustomIcon;
  className?: string;

  // Mantenemos 'children' opcional por el tipado de React
  children?: ReactNode;
  icon?: CustomIcon;
}

const Input: React.FC<InputProps> = ({
  label,
  iconType = 'default',
  endIcon,
  className = '',
  type = 'text',
  icon,

  // 🚨 CORRECCIÓN CLAVE: Extraemos 'children' para que NO vaya en {...rest}
  children,

  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = iconType === 'password' && showPassword ? 'text' : type;

  // LÓGICA DE ICONOS DE INICIO (Start Icon)
  let StartIconComponent: LucideIconComponent | null | ReactNode = null;
  if (icon) {
    StartIconComponent = icon;
  } else if (iconType === 'email') {
    StartIconComponent = Mail;
  } else if (iconType === 'password') {
    StartIconComponent = Lock;
  }

  // Lógica de End Icon
  let EndIconComponent: CustomIcon | undefined = endIcon;
  if (iconType === 'password') {
    EndIconComponent = showPassword ? EyeOff : Eye;
  }

  const inputBaseClasses = `
    w-full py-2.5 px-4 bg-grayLight-100 border border-gray-300 rounded-lg text-gray-800 
    focus:border-gray-200 focus:ring-1 focus:ring-gray-300 
    transition duration-150 placeholder:text-gray-500
  `;

  const renderIcon = (IconComponent: CustomIcon | undefined, isStart: boolean = false) => {
    if (React.isValidElement(IconComponent) || typeof IconComponent === 'string' || typeof IconComponent === 'number') {
      return IconComponent;
    }
    if (IconComponent && typeof IconComponent === 'function') {
      const Component = IconComponent as LucideIconComponent;
      const iconClassName = isStart ? 'w-5 h-5 text-black' : 'w-5 h-5';
      return <Component className={iconClassName} />;
    }
    return null;
  };

  const renderedEndIcon = endIcon && iconType !== 'password' ? renderIcon(endIcon) : null;
  const renderedStartIcon = StartIconComponent ? renderIcon(StartIconComponent, true) : null;


  return (
    <div className={`w-full ${className}`}>
      {/* Etiqueta */}
      {label && (
        <label className="block text-gray-700 text-sm font-medium mb-1.5">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Icono de inicio */}
        {renderedStartIcon && (
          <div className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none">
            {renderedStartIcon}
          </div>
        )}

        {/* Campo de Input principal */}
        <input
          type={inputType}
          className={`${inputBaseClasses} ${renderedStartIcon ? 'pl-10' : 'pl-4'}`}
          // 'children' NO está en {...rest}
          {...rest}
        />

        {/* Icono de fin (Toggle de Contraseña o Icono personalizado) */}
        {EndIconComponent && iconType === 'password' ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-1 text-black hover:text-black transition"
          >
            {renderIcon(EndIconComponent)}
          </button>
        ) : (
          renderedEndIcon && (
            <span className="absolute right-3 text-black pointer-events-none">
              {renderedEndIcon}
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default Input;