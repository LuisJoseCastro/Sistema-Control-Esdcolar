import React, { useState, useMemo } from 'react';
import { Search, Home, ArrowLeft } from 'lucide-react'; // Añadí ArrowLeft
import { useNavigate } from 'react-router-dom';
import Table from '../../components/ui/Table';

interface Grupo {
  id: string;
  nombre: string;
}

interface Alumno {
  id: string;
  nombre: string;
  matricula: string;
  email: string;
  calificacion: number;
  asistencia: string;
  comentarios?: string;
}

const MOCK_GRUPOS: Grupo[] = [
  { id: 'g1', nombre: 'Grupo A - Matemáticas' },
  { id: 'g2', nombre: 'Grupo B - Física' },
  { id: 'g3', nombre: 'Grupo C - Química' },
  { id: 'g4', nombre: 'Grupo A - Historia' },
];

const MOCK_ALUMNOS: Record<string, Alumno[]> = {
  g1: [
    { id: 'a1', nombre: 'Juan Pablo Guzmán', matricula: '2023565', email: 'juanpablo565@gmail.com', calificacion: 90, asistencia: 'Ausente', comentarios: '' },
    { id: 'a2', nombre: 'María José López', matricula: '2023750', email: 'mariajose@gmail.com', calificacion: 75, asistencia: 'Presente', comentarios: '' },
    { id: 'a3', nombre: 'Brandon Jael Ramos', matricula: '2023230', email: 'brandonj@gmail.com', calificacion: 85, asistencia: 'Falta Justificada', comentarios: '' },
    { id: 'a4', nombre: 'Miguel Ángel Torres', matricula: '2023640', email: 'miguelt@gmail.com', calificacion: 70, asistencia: 'Retardo', comentarios: '' },
    { id: 'a5', nombre: 'Brenda Sofía García', matricula: '2023145', email: 'brendasofia@gmail.com', calificacion: 100, asistencia: 'Presente', comentarios: '' },
  ],
  g2: [],
  g3: [],
  g4: [],
};

const DocenteGruposPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGrupoId, setSelectedGrupoId] = useState<string>(MOCK_GRUPOS[0].id);
  const [filter, setFilter] = useState<string>('');

  const alumnos = useMemo(() => MOCK_ALUMNOS[selectedGrupoId] ?? [], [selectedGrupoId]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return alumnos;
    return alumnos.filter(a =>
      a.nombre.toLowerCase().includes(q) ||
      a.matricula.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q)
    );
  }, [alumnos, filter]);

  const selectedGrupo = MOCK_GRUPOS.find(g => g.id === selectedGrupoId)?.nombre ?? '';

  return (
    <div className='h-full'>
      {/* CONTENIDO PRINCIPAL */}
      <main className="h-full bg-gray-100 p-8">
        {/* Encabezado de la sección */}
        <div className="mb-6">
          <h1 className="text-4xl font-serif italic text-gray-800 mb-2">
            {selectedGrupo}
          </h1>
          <p className="text-gray-600">
            Lista de alumnos inscritos en el grupo
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6 flex justify-end">
          <div className="w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="nombre, matrícula .."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-main-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Table>
            <Table.Header>
              <tr className="bg-gray-300">
                <Table.Head className="text-gray-800 font-bold uppercase text-xs tracking-wider">Alumno</Table.Head>
                <Table.Head className="text-gray-800 font-bold uppercase text-xs tracking-wider">Matrícula</Table.Head>
                <Table.Head className="text-gray-800 font-bold uppercase text-xs tracking-wider">Correo Electrónico</Table.Head>
                <Table.Head className="text-gray-800 font-bold uppercase text-xs tracking-wider">Calificación</Table.Head>
                <Table.Head className="text-gray-800 font-bold uppercase text-xs tracking-wider">Asistencia</Table.Head>
                <Table.Head className="text-gray-800 font-bold uppercase text-xs tracking-wider">Comentarios</Table.Head>
                <Table.Head className="text-gray-800 font-bold uppercase text-xs tracking-wider">Acciones</Table.Head>
              </tr>
            </Table.Header>

            <Table.Body>
              {filtered.map(al => (
                <Table.Row key={al.id} className="hover:bg-gray-50">
                  <Table.Cell className="font-medium text-gray-900">{al.nombre}</Table.Cell>
                  <Table.Cell className="text-gray-700">{al.matricula}</Table.Cell>
                  <Table.Cell className="text-gray-700">{al.email}</Table.Cell>
                  <Table.Cell className="text-gray-700 font-semibold">{al.calificacion}</Table.Cell>
                  <Table.Cell className="text-gray-700">{al.asistencia}</Table.Cell>
                  <Table.Cell className="text-gray-700">{al.comentarios ?? '-'}</Table.Cell>
                  <Table.Cell>
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      Ver perfil ...
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default DocenteGruposPage;