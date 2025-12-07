import React, { type TableHTMLAttributes, type ReactNode, type HTMLAttributes } from 'react';

// --- SUB-COMPONENTES INTERNOS ---

// Define las props para el Encabezado (<thead>)
interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

// Define las props para el Cuerpo (<tbody>)
interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

// Componente para el encabezado de la tabla
const TableHeader: React.FC<TableHeaderProps> = ({ children, className = '' }) => (
  <thead className={`bg-gray-100 ${className}`}>
    {children}
  </thead>
);

// Componente para el cuerpo de la tabla
const TableBody: React.FC<TableBodyProps> = ({ children, className = '' }) => (
  <tbody className={`bg-white divide-y divide-gray-100 ${className}`}>
    {children}
  </tbody>
);

// Componentes para <tr>, <th> y <td> (para consistencia de estilo)
export const TableRow: React.FC<HTMLAttributes<HTMLTableRowElement>> = ({ children, className = '', ...rest }) => (
  <tr className={`hover:bg-blue-50/50 transition duration-150 ${className}`} {...rest}>
    {children}
  </tr>
);

export const TableHead: React.FC<HTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...rest }) => (
  <th className={`px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider ${className}`} {...rest}>
    {children}
  </th>
);

export const TableCell: React.FC<HTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...rest }) => (
  <td className={`p-3 border-b border-gray-100 text-sm text-gray-700 ${className}`} {...rest}>
    {children}
  </td>
);


// --- COMPONENTE PRINCIPAL (TABLE.TSX) ---

// Extiende las props estándar de una tabla HTML
interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  className?: string;
}

const Table: React.FC<TableProps> & {
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Head: typeof TableHead;
  Cell: typeof TableCell;
} = ({ children, className = '', ...rest }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
      <table
        className={`min-w-full divide-y divide-gray-200 ${className}`}
        {...rest}
      >
        {children}
      </table>
    </div>
  );
};

// Asignamos los sub-componentes al componente principal (patrón compuesto)
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

export default Table;