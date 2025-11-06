// src/components/ui/Table.tsx
import React from 'react';

interface TableProps {
  children: React.ReactNode;
}

// Este componente solo proporciona el estilo base del contenedor de la tabla
export const TableContainer: React.FC<TableProps> = ({ children }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  );
};

// Componente para el encabezado de la tabla (<thead>)
export const TableHeader: React.FC<TableProps> = ({ children }) => {
  return (
    <thead className="bg-gray-50">
      <tr>
        {children}
      </tr>
    </thead>
  );
};

// Componente para las celdas de encabezado (<th>)
export const Th: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...props }) => {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
      scope="col"
      {...props}
    >
      {children}
    </th>
  );
};

// Componente para el cuerpo de la tabla (<tbody>)
export const TableBody: React.FC<TableProps> = ({ children }) => {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {children}
    </tbody>
  );
};

// Componente para las celdas de datos (<td>)
export const Td: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...props }) => {
  return (
    <td 
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </td>
  );
};