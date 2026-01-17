import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react'; 
import Table from '../../components/ui/Table';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

interface ApiLoadResponse {
    id: string;
    group?: { nombre: string };
    subject?: { nombre: string };
}

interface ApiGradeResponse {
    id: string;
    nombre: string;
    matricula: string;
    final?: string;
    extraordinario?: string;
}

const DocenteGruposPage: React.FC = () => {
  const token = localStorage.getItem('token');

  const [cursos, setCursos] = useState<Grupo[]>([]);
  const [selectedGrupoId, setSelectedGrupoId] = useState<string>('');
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/academic/teacher-load`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
    })
      .then(res => {
          if (!res.ok) throw new Error('Error al cargar cursos');
          return res.json();
      })
      .then((data: unknown) => {
          if (Array.isArray(data)) {
              const mappedCursos = data.map((c: ApiLoadResponse) => ({
                  id: c.id, 
                  nombre: `${c.group?.nombre || 'Sin Grupo'} - ${c.subject?.nombre || 'Materia'}`
              }));
              
              setCursos(mappedCursos);
              if (mappedCursos.length > 0) {
                  setSelectedGrupoId(mappedCursos[0].id);
              }
          } else {
              setCursos([]);
          }
      })
      .catch(err => console.error("Error fetching groups:", err));
  }, [token]);

  useEffect(() => {
    if (!selectedGrupoId || !token) {
        setAlumnos([]);
        return;
    }

    setIsLoading(true);
    fetch(`${API_URL}/academic/grades/list/${selectedGrupoId}`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
    })
      .then(res => res.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
            const mappedAlumnos = data.map((grade: ApiGradeResponse) => ({
                id: grade.id,
                nombre: grade.nombre,
                matricula: grade.matricula,
                email: "registrado@escuela.edu",
                calificacion: Number(grade.final || 0),
                asistencia: "-",
                comentarios: grade.extraordinario ? `Extra: ${grade.extraordinario}` : ''
            }));
            setAlumnos(mappedAlumnos);
        } else {
            setAlumnos([]);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedGrupoId, token]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return alumnos;
    return alumnos.filter(a =>
      a.nombre.toLowerCase().includes(q) ||
      a.matricula.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q)
    );
  }, [alumnos, filter]);

  const selectedGrupoNombre = cursos.find(g => g.id === selectedGrupoId)?.nombre ?? 'Cargando...';

  return (
    <div className='h-full'>
      <main className="h-full bg-gray-100 p-8">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4">
                <h1 className="text-4xl font-serif italic text-gray-800 mb-2">
                {selectedGrupoNombre}
                </h1>
                {cursos.length > 0 && (
                    <select 
                        className="mt-1 ml-2 p-1 text-sm bg-gray-200 border-none rounded text-gray-700 cursor-pointer focus:ring-2 focus:ring-blue-500"
                        value={selectedGrupoId}
                        onChange={(e) => setSelectedGrupoId(e.target.value)}
                        title="Cambiar grupo"
                    >
                        {cursos.map(c => (
                            <option key={c.id} value={c.id}>Ir a: {c.nombre}</option>
                        ))}
                    </select>
                )}
            </div>
            <p className="text-gray-600">
              Lista de alumnos inscritos en el grupo
            </p>
          </div>
        </div>

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
              {isLoading ? (
                  <Table.Row>
                      <Table.Cell colSpan={7} className="text-center py-10 text-gray-500">Cargando datos...</Table.Cell>
                  </Table.Row>
              ) : filtered.length > 0 ? (
                  filtered.map(al => (
                    <Table.Row key={al.id} className="hover:bg-gray-50">
                      <Table.Cell className="font-medium text-gray-900">{al.nombre}</Table.Cell>
                      <Table.Cell className="text-gray-700">{al.matricula}</Table.Cell>
                      <Table.Cell className="text-gray-700">{al.email}</Table.Cell>
                      <Table.Cell className="text-gray-700 font-semibold">{al.calificacion}</Table.Cell>
                      <Table.Cell className="text-gray-700">{al.asistencia}</Table.Cell>
                      <Table.Cell className="text-gray-700">{al.comentarios || '-'}</Table.Cell>
                      <Table.Cell>
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          Ver perfil ...
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))
              ) : (
                  <Table.Row>
                      <Table.Cell colSpan={7} className="text-center py-10 text-gray-500">No se encontraron alumnos en este grupo.</Table.Cell>
                  </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default DocenteGruposPage;