import React from "react";
// 1. YA NO IMPORTAMOS styles.css
import { UserHeaderIcons } from "../../components/layout/UserHeaderIcons";
import { Card } from "../../components/ui/Card";
import {
  TableContainer,
  TableHeader,
  TableBody,
  Th,
  Td
} from "../../components/ui/Table";

export const AlumnoCalificacionesPage: React.FC = () => {
  const calificaciones = [
    { materia: "Matemáticas", u1: 8, u2: 9, u3: 9, u4: 8, u5: 9, final: 9 },
    { materia: "Programación Web", u1: 9, u2: 8, u3: 9, u4: 9, u5: 9, final: 9 },
    { materia: "Redes de Computadoras", u1: 8, u2: 8, u3: 8, u4: 9, u5: 9, final: 8.5 },
  ];

  // Cálculo del promedio para mostrarlo
  const promedioNum = calificaciones.reduce((acc, cur) => acc + cur.final, 0) / calificaciones.length;
  const promedioTexto = promedioNum.toFixed(1);

  return (
    // Usamos clases de Tailwind en lugar de 'main-content'
    <div className="p-8 bg-gray-50 min-h-full">
      
      {/* ENCABEZADO (Reemplaza a .header) */}
      <header className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-8">
        <h1 className="text-4xl font-[Kaushan Script] text-gray-800">
          Mis Calificaciones
        </h1>
        <UserHeaderIcons />
      </header>

      {/* FILTRO (Reemplaza a .filter-section) */}
      <section className="flex justify-end mb-6">
        <select className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Periodo Actual (2025-1)</option>
          <option>2024-2</option>
          <option>2024-1</option>
        </select>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex flex-col gap-8">
        
        {/* TABLA (Reemplaza a .table-section usando tus componentes) */}
        <TableContainer>
          <TableHeader>
            <Th>Materia</Th>
            <Th className="text-center">U1</Th>
            <Th className="text-center">U2</Th>
            <Th className="text-center">U3</Th>
            <Th className="text-center">U4</Th>
            <Th className="text-center">U5</Th>
            <Th className="text-center text-blue-700 font-bold">Final</Th>
          </TableHeader>
          <TableBody>
            {calificaciones.map((fila, i) => (
              <tr key={i}>
                <Td className="font-medium text-gray-700">{fila.materia}</Td>
                <Td className="text-center">{fila.u1}</Td>
                <Td className="text-center">{fila.u2}</Td>
                <Td className="text-center">{fila.u3}</Td>
                <Td className="text-center">{fila.u4}</Td>
                <Td className="text-center">{fila.u5}</Td>
                <Td className="text-center font-bold text-blue-600 bg-blue-50">
                  {fila.final}
                </Td>
              </tr>
            ))}
          </TableBody>
        </TableContainer>

        {/* PROMEDIO (Reemplaza a .average-box usando Card) */}
        <div className="flex justify-center mt-4">
            <Card className="w-64 p-8 text-center shadow-xl border-t-4 border-blue-600">
                <p className="text-lg text-gray-500 font-medium mb-2">Promedio General</p>
                <h2 className="text-6xl font-extrabold text-blue-700">
                    {promedioTexto}
                </h2>
            </Card>
        </div>

      </div>
    </div>
  );
};