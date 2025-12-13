import React, { useState, useMemo } from 'react';
import { Search, Home } from 'lucide-react';
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
    <div className="flex min-h-screen bg-gray-900">
      {/* HEADER SUPERIOR */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-300 flex items-center justify-between px-8 z-50">
        <h1 className="text-xl font-semibold text-gray-800">Académico</h1>
        
        {/* Iconos derechos */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => navigate('/docente/dashboard')}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition"
            title="Ir a Inicio"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">Inicio</span>
          </button>
          
          <div className="w-6 h-6 text-gray-600">🔔</div>
          
          <div className="flex items-center space-x-2 text-gray-700">
            <div className="w-5 h-5">👤</div>
            <span className="text-sm font-medium">Rodolfo docente</span>
          </div>
        </div>
      </div>

      {/* SIDEBAR IZQUIERDO */}
      <aside className="fixed left-0 top-16 bottom-0 w-56 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-center">Grupos</h2>
        <div className="space-y-3">
          {MOCK_GRUPOS.map(grupo => (
            <button
              key={grupo.id}
              onClick={() => setSelectedGrupoId(grupo.id)}
              className={`w-full text-left py-3 px-4 rounded-2xl transition font-medium text-sm ${
                selectedGrupoId === grupo.id
                  ? 'bg-white text-gray-800 shadow-lg'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {grupo.nombre}
            </button>
          ))}
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="ml-56 mt-16 flex-1 bg-gray-100 p-8">
        {/* Encabezado de la sección */}
        <div className="mb-6">
          <h1 className="text-4xl font-serif italic text-gray-800 mb-2">
            {selectedGrupo}
          </h1>
          <p className="text-gray-600">
            Lista de alumnos inscritos el grupo
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
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
