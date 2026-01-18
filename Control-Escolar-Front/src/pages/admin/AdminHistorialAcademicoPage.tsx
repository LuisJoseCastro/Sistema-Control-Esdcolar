import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Download } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { adminService } from '../../services/admin.service'; 

interface Inscripcion { ciclo: string; estado: string; fecha: string; }
interface CalificacionMateria { materia: string; calificacion: number; asistencia: string; }

export const AdminHistorialAcademicoPage: React.FC = () => {
  const { alumnoId, grupoId } = useParams<{ alumnoId: string; grupoId?: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [alumno, setAlumno] = useState({ id: '', nombre: '', matricula: '' });
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [calificaciones, setCalificaciones] = useState<CalificacionMateria[]>([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      if (!alumnoId) return;
      try {
        setLoading(true);
        const data = await adminService.getHistorialAlumno(alumnoId);
        
        setAlumno({ 
          id: data?.id || "", 
          nombre: data?.nombre || "Sin Nombre", 
          matricula: data?.matricula || "S/M" 
        });

        // Aquí llenamos ambos estados con los datos del backend
        setInscripciones(Array.isArray(data?.inscripciones) ? data.inscripciones : []);
        setCalificaciones(Array.isArray(data?.calificaciones) ? data.calificaciones : []);
        
      } catch (error) {
        console.error("Error al cargar historial:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, [alumnoId]);

  const hasCalificaciones = calificaciones.length > 0;
  const promedioGeneral = hasCalificaciones ? calificaciones.reduce((acc, curr) => acc + (curr.calificacion || 0), 0) / calificaciones.length : 0;

  if (loading) return <div className="flex h-screen items-center justify-center bg-whiteBg-50"><LoadingSpinner className="w-12 h-12 text-main-800" /></div>;

  return (
    <div className="p-8 bg-whiteBg-50 min-h-full">
      <div className="mb-6">
        <button onClick={() => navigate(grupoId ? `/admin/alumnos/${grupoId}` : '/admin/alumnos')} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
          <ArrowLeft size={20} />
          <span>Volver a la lista</span>
        </button>
      </div>

      <h1 className="font-['Kaushan_Script'] text-4xl text-black mb-4 pb-2 border-b-2 border-gray-300">Historial Académico</h1>

      <Card variant="elevated" className="mb-6 bg-whiteBg-100 border-2 border-grayDark-200">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-200 to-blue-200 flex items-center justify-center">
            <span className="text-2xl font-bold text-purple-700">{(alumno.nombre || "A").charAt(0)}</span>
          </div>
          <div className="flex-1">
            <div className="space-y-3">
              <div><p className="text-sm text-gray-600 mb-1">Nombre Completo</p><p className="text-xl font-bold text-[#2E4156]">{alumno.nombre}</p></div>
              <div><p className="text-sm text-gray-600 mb-1">Matrícula</p><p className="text-xl font-bold text-[#2E4156]">{alumno.matricula}</p></div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-600 mb-1">Promedio General</p>
            <div className="text-3xl font-bold bg-whiteBg-100 text-main-800 p-2 rounded-xl">{promedioGeneral.toFixed(1)}</div>
          </div>
        </div>
      </Card>

      {/* Tabla de Calificaciones */}
      <Card variant="elevated" className="mb-6 bg-whiteBg-100 border-2 border-grayDark-200">
        <h3 className="text-2xl font-bold text-main-800 mb-6">Calificaciones y Asistencia</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300 bg-grayLight-300">
                <th className="text-left py-3 px-4 font-bold text-xl text-main-800">Materia</th>
                <th className="text-left py-3 px-4 font-bold text-xl text-main-800 w-32">Calificación</th>
                <th className="text-left py-3 px-4 font-bold text-xl text-main-800 w-32">Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {calificaciones.map((materia, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-whiteBg-200">
                  <td className="py-3 px-4"><div className="font-medium text-gray-800">{materia.materia}</div></td>
                  <td className="py-3 px-4 font-bold text-lg text-main-800">{materia.calificacion.toFixed(1)}</td>
                  <td className="py-3 px-4 text-gray-600">{materia.asistencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ✅ SECCIÓN DE INSCRIPCIONES (Esto quita el error de 'never read') */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Ciclos Escolares Cursados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inscripciones.map((ins, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between">
              <span className="font-medium">{ins.ciclo}</span>
              <span className="text-teal-600 font-bold">{ins.estado}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button className="flex items-center gap-2 bg-main-800 hover:bg-main-900 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors cursor-pointer"><Download size={18} />Descargar Historial</button>
      </div>
    </div>
  );
};