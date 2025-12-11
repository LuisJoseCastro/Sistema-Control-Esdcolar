import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Input from '../../components/ui/Input';

export const AdminListaAlumnosPage: React.FC = () => {
  const { grupoId = '3A' } = useParams<{ grupoId: string }>();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  
  // Datos de ejemplo para la tabla
  const alumnos = [
    { id: 1, matricula: 'A001', nombre: 'Juan Pérez López' },
    { id: 2, matricula: 'A002', nombre: 'María González Ruiz' },
    { id: 3, matricula: 'A003', nombre: 'Carlos Rodríguez Sánchez' },
    { id: 4, matricula: 'A004', nombre: 'Ana Martínez Torres' },
    { id: 5, matricula: 'A005', nombre: 'Pedro Fernández García' },
    { id: 6, matricula: 'A006', nombre: 'Laura Díaz Méndez' },
    { id: 7, matricula: 'A007', nombre: 'Miguel Ángel Ruiz Castro' },
    { id: 8, matricula: 'A008', nombre: 'Sofía Herrera Vargas' },
  ];
  
  // Filtrar alumnos según búsqueda
  const alumnosFiltrados = alumnos.filter(alumno =>
    alumno.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    alumno.matricula.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleVerPerfil = (alumnoId: number) => {
    navigate(`/admin/alumnos/${grupoId}/${alumnoId}/perfil`);
  };

  const handleVerHistorial = (alumnoId: number) => {
    navigate(`/admin/alumnos/${grupoId}/${alumnoId}/historial`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full font-['Lato']">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-gray-300 pb-6 mb-8">
        <h1 
          className="text-5xl text-black font-['Kaushan_Script'] mb-4 md:mb-0"
        >
          {grupoId}
        </h1>
        
        {/* Barra de búsqueda */}
        <div className="relative w-full md:w-80">
          <Input
            placeholder="Buscar alumno..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="bg-gray-100 border-gray-300"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Search size={20} />
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <Card variant="flat" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Lista de Alumnos - Grupo {grupoId}
          </h2>
          <span className="text-sm text-gray-600">
            {alumnosFiltrados.length} de {alumnos.length} alumnos
          </span>
        </div>

        {/* TABLA DE ALUMNOS */}
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-16 text-center">#</Table.Head>
                <Table.Head>Matrícula</Table.Head>
                <Table.Head>Nombre Completo</Table.Head>
                <Table.Head>Perfil</Table.Head>
                <Table.Head>Historial</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {alumnosFiltrados.map((alumno, index) => (
                <Table.Row key={alumno.id} className="hover:bg-blue-50/50">
                  <Table.Cell className="text-center font-medium text-gray-500">
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell className="font-medium text-[#2E4156]">
                    {alumno.matricula}
                  </Table.Cell>
                  <Table.Cell className="text-gray-800">
                    {alumno.nombre}
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => handleVerPerfil(alumno.id)}
                      className="text-[#2E4156] font-semibold hover:text-blue-700 transition-colors"
                    >
                      ver perfil
                    </button>
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => handleVerHistorial(alumno.id)}
                      className="text-[#2E4156] font-semibold hover:text-blue-700 transition-colors"
                    >
                      Historial Académico
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Si no hay resultados */}
        {alumnosFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron alumnos con "{busqueda}"
          </div>
        )}
      </Card>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => navigate('/admin/alumnos')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          ← Volver a Grupos
        </button>
        
        <div className="flex gap-3">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg transition-colors">
            Exportar Lista
          </button>
          <button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            + Agregar Alumno
          </button>
        </div>
      </div>
    </div>
  );
};