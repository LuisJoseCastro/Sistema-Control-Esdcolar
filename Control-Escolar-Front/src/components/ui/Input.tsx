import React, { type InputHTMLAttributes, useState, type ReactNode, type ComponentType } from 'react';
// Eliminamos 'type Icon' de la importación ya que genera conflicto
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'; 

// --- TIPOS Y PROPIEDADES ---

// Usamos ComponentType para tipar los iconos de lucide-react (que son Componentes Funcionales)
type LucideIconComponent = ComponentType<{ className: string }>;

// Definimos un nuevo tipo para los iconos (Componentes o ReactNode)
// Mantenemos la definición por ahora, pero usaremos renderIcon para manejarla.
type CustomIcon = LucideIconComponent | ReactNode; 

// Extiende las props estándar de un input HTML
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  iconType?: 'email' | 'password' | 'default';
  // endIcon puede ser un Componente (para el toggle) o un elemento ReactNode (si lo pasa el usuario)
  endIcon?: CustomIcon; 
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  iconType = 'default',
  endIcon,
  className = '',
  type = 'text',
  ...rest
}) => {
  // Estado para manejar el toggle de visibilidad de contraseña
  const [showPassword, setShowPassword] = useState(false);
  
  // Determina el tipo de input real (text, password, etc.)
  const inputType = iconType === 'password' && showPassword ? 'text' : type;

  // Determina el icono inicial (Start Icon) y le asignamos el tipo más general 'LucideIconComponent | null'
  let StartIcon: LucideIconComponent | null = null;
  if (iconType === 'email') {
    StartIcon = Mail;
  } else if (iconType === 'password') {
    StartIcon = Lock;
  }
  
  // Definimos EndIconComponent usando el tipo que acabamos de crear
  let EndIconComponent: CustomIcon | undefined = endIcon;
  if (iconType === 'password') {
    EndIconComponent = showPassword ? EyeOff : Eye;
  }

  // Clases base para el campo de entrada
  const inputBaseClasses = `
    w-full py-2.5 px-4 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 
    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
    transition duration-150 placeholder:text-gray-500
  `;
  
  // Función auxiliar para renderizar el icono
  const renderIcon = (IconComponent: CustomIcon | undefined) => {
      // 1. Si es un elemento JSX (ya renderizado: ReactNode)
      if (React.isValidElement(IconComponent) || typeof IconComponent === 'string' || typeof IconComponent === 'number') {
          return IconComponent;
      }
      // 2. Si es un componente (función/clase, como un icono de lucide)
      if (IconComponent && typeof IconComponent === 'function') {
          // Tipamos Component como el tipo funcional que sabemos que es
          const Component = IconComponent as LucideIconComponent; 
          return <Component className="w-5 h-5" />;
      }
      return null;
  };

  // Pre-renderizamos el endIcon para el caso que NO es password
  // Esto nos permite asegurar que siempre se renderice un ReactNode válido.
  const renderedEndIcon = endIcon && iconType !== 'password' ? renderIcon(endIcon) : null;


  return (
    <div className={`w-full ${className}`}>
      {/* Etiqueta */}
      {label && (
        <label className="block text-gray-700 text-sm font-medium mb-1.5">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Icono de inicio (si existe) */}
        {StartIcon && (
          // Como StartIcon es un componente, lo renderizamos como componente
          <StartIcon className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
        )}
        
        {/* Campo de Input principal */}
        <input
          type={inputType}
          className={`${inputBaseClasses} ${StartIcon ? 'pl-10' : 'pl-4'}`}
          {...rest}
        />

        {/* Icono de fin (Toggle de Contraseña o Icono personalizado) */}
        {EndIconComponent && iconType === 'password' ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-1 text-gray-500 hover:text-gray-700 transition"
          >
            {renderIcon(EndIconComponent)}
          </button>
        ) : (
          // Renderiza cualquier otro icono final si no es de tipo 'password'
          renderedEndIcon && (
            <span className="absolute right-3 text-gray-500 pointer-events-none">
              {renderedEndIcon}
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default Input;