import React from 'react';
// YA NO IMPORTAMOS CSS
import {
  TableContainer,
  TableHeader,
  TableBody,
  Th,
  Td
} from '../../components/ui/Table';
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';

export const AlumnoAsignaturasPage: React.FC = () => {
  // Datos simulados (MOCK directo por ahora para no romper nada)
  const asignaturas = [
    { materia: 'Programación Web', horario: 'Lunes 10:00 - 12:00', profesor: 'Ing. García' },
    { materia: 'Bases de Datos', horario: 'Martes 8:00 - 10:00', profesor: 'Mtra. Ruiz' },
    { materia: 'Redes de Computadoras', horario: 'Miércoles 9:00 - 11:00', profesor: 'Mtro. López' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* ENCABEZADO */}
      <header className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-8">
        <h1 className="text-4xl font-[Kaushan Script] text-gray-800">Mis Asignaturas</h1>
        <UserHeaderIcons />
      </header>

      {/* BUSCADOR Y FILTRO */}
      <section className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar asignatura..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
            🔍
          </button>
        </div>
        <div>
          <select className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Semestre Actual</option>
            <option>1°</option>
            <option>2°</option>
            <option>3°</option>
          </select>
        </div>
      </section>

      {/* TABLA */}
      <section>
        <TableContainer>
          <TableHeader>
            <Th>Materia</Th>
            <Th>Horario</Th>
            <Th>Profesor</Th>
          </TableHeader>
          <TableBody>
            {asignaturas.map((a, i) => (
              <tr key={i}>
                <Td className="font-medium text-gray-800">{a.materia}</Td>
                <Td className="text-gray-600">{a.horario}</Td>
                <Td className="text-blue-600">{a.profesor}</Td>
              </tr>
            ))}
          </TableBody>
        </TableContainer>
      </section>
    </div>
  );
};