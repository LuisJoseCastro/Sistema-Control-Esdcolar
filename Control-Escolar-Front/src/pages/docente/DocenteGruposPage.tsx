import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react'; 
import Table from '../../components/ui/Table';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const DocenteGruposPage: React.FC = () => {
  const token = localStorage.getItem('token');
  const [cursos, setCursos] = useState<any[]>([]);
  const [selectedGrupoId, setSelectedGrupoId] = useState<string>('');
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/academic/teacher-load`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
          if (Array.isArray(data)) {
              const mapped = data.map((c: any) => ({
                  id: c.id, 
                  nombre: `${c.group?.nombre || 'Sin Grupo'} - ${c.subject?.nombre || 'Materia'}`
              }));
              setCursos(mapped);
              if (mapped.length > 0) setSelectedGrupoId(mapped[0].id);
          }
      });
  }, [token]);

  useEffect(() => {
    if (!selectedGrupoId || !token) return;
    setIsLoading(true);

    fetch(`${API_URL}/academic/grades/list/${selectedGrupoId}`, { headers: { 'Authorization': `Bearer ${token}` } })
    .then(res => res.json())
    .then(data => {
        if (Array.isArray(data)) {
            const mapped = data.map((grade: any) => {
                // Cálculo dinámico de unidades adeudadas (Comentarios)
                const parciales = [
                    { v: grade.parcial1, l: 'P1' },
                    { v: grade.parcial2, l: 'P2' },
                    { v: grade.parcial3, l: 'P3' }
                ];
                const debidas = parciales.filter(p => Number(p.v) < 70).map(p => p.l);
                
                // Si reprueba cualquier parcial o el final < 70, mostrar NA
                const valFinal = Number(grade.final);
                const califDisplay = (valFinal < 70 || debidas.length > 0) ? 'NA' : String(valFinal);
                
                // Si acreditó todo, extraordinario queda vacío
                const extraDisplay = debidas.length > 0 ? `Debe: ${debidas.join('-')}` : '-';

                return {
                    id: grade.id,
                    nombre: grade.nombre,
                    matricula: grade.matricula,
                    calificacion: califDisplay,
                    asistencia: `${grade.porcentaje_asistencia_global || 0}%`,
                    comentarios: extraDisplay
                };
            });
            setAlumnos(mapped);
        }
    })
    .finally(() => setIsLoading(false));
  }, [selectedGrupoId, token]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return alumnos.filter(a => a.nombre.toLowerCase().includes(q) || a.matricula.includes(q));
  }, [alumnos, filter]);

  return (
    <div className='h-full bg-gray-100 p-8'>
        <div className="flex items-center gap-4 mb-6">
            <h1 className="text-4xl font-serif italic text-gray-800">
                {cursos.find(c => c.id === selectedGrupoId)?.nombre || 'Cargando...'}
            </h1>
            <select className="p-1 text-sm bg-gray-200 rounded" value={selectedGrupoId} onChange={e => setSelectedGrupoId(e.target.value)}>
                {cursos.map(c => <option key={c.id} value={c.id}>Ir a: {c.nombre}</option>)}
            </select>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Table>
            <Table.Header>
              <tr className="bg-gray-300 font-bold uppercase text-xs tracking-wider">
                <Table.Head className="p-4">Alumno</Table.Head>
                <Table.Head>Matrícula</Table.Head>
                <Table.Head>Calificación</Table.Head>
                <Table.Head>Asistencia</Table.Head>
                <Table.Head>Comentarios</Table.Head>
                <Table.Head>Acciones</Table.Head>
              </tr>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                  <Table.Row><Table.Cell colSpan={6} className="text-center py-10">Cargando...</Table.Cell></Table.Row>
              ) : filtered.map(al => (
                <Table.Row key={al.id} className="hover:bg-gray-50">
                  <Table.Cell className="font-medium text-gray-900 p-4">{al.nombre}</Table.Cell>
                  <Table.Cell>{al.matricula}</Table.Cell>
                  <Table.Cell className={`font-bold ${al.calificacion === 'NA' ? 'text-red-600 italic' : ''}`}>
                    {al.calificacion}
                  </Table.Cell>
                  <Table.Cell className="font-medium text-blue-700">{al.asistencia}</Table.Cell>
                  <Table.Cell className="text-gray-700 text-xs italic">{al.comentarios}</Table.Cell>
                  <Table.Cell><button className="text-blue-600 hover:underline">Ver perfil</button></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
    </div>
  );
};

export default DocenteGruposPage;