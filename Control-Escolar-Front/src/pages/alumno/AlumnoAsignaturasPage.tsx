// Description: Página de asignaturas para el alumno
import React from 'react';
import {
  TableContainer,
  TableHeader,
  TableBody,
  Th,
  Td
} from '../../components/ui/Table';
import "../../styles/styles.css";
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';

export const AlumnoAsignaturasPage: React.FC = () => {
  const asignaturas = [
    { materia: 'Programación Web', horario: 'Lunes 10:00 - 12:00', profesor: 'Ing. García' },
    { materia: 'Bases de Datos', horario: 'Martes 8:00 - 10:00', profesor: 'Mtra. Ruiz' },
    { materia: 'Redes de Computadoras', horario: 'Miércoles 9:00 - 11:00', profesor: 'Mtro. López' },
  ];

  return (
    <div className="main-content p-10">
      {/* Encabezado */}
      <header className="header flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Mis Asignaturas</h1>
        <div className="user-icons flex gap-4 text-2xl">
          <UserHeaderIcons />
        </div>
      </header>

      {/* Buscador y filtro */}
      <section className="search-section flex justify-between items-center mb-6">
        <div className="search-box flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar asignatura..."
            className="border border-gray-300 rounded-lg p-2 w-64"
          />
          <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition">
            🔍
          </button>
        </div>
        <div className="filter-box">
          <select className="border border-gray-300 rounded-lg p-2">
            <option>Semestre</option>
            <option>1°</option>
            <option>2°</option>
            <option>3°</option>
          </select>
        </div>
      </section>

      {/* Tabla de asignaturas */}
      <section className="table-section">
        <TableContainer>
          <TableHeader>
            <Th>Materia</Th>
            <Th>Horario</Th>
            <Th>Profesor</Th>
          </TableHeader>
          <TableBody>
            {asignaturas.map((a, i) => (
              <tr key={i}>
                <Td>{a.materia}</Td>
                <Td>{a.horario}</Td>
                <Td>{a.profesor}</Td>
              </tr>
            ))}
          </TableBody>
        </TableContainer>
      </section>
    </div>
  );
};
