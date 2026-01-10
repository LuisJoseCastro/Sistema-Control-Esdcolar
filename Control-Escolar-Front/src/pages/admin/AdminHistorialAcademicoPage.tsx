import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Download } from 'lucide-react';

export const AdminHistorialAcademicoPage: React.FC = () => {
  const { alumnoId, grupoId } = useParams<{ alumnoId: string; grupoId?: string }>();
  const navigate = useNavigate();
  
  // Datos de ejemplo del alumno
  const alumno = {
    id: alumnoId || '1',
    nombre: 'Juan Pérez López',
    matricula: 'A001',
  };

  // Datos de inscripción
  const inscripciones = [
    { ciclo: '2024-1', estado: 'Completado', fecha: '2023-08-20' },
    { ciclo: '2023-2', estado: 'Completado', fecha: '2023-01-15' },
    { ciclo: '2023-1', estado: 'Completado', fecha: '2022-08-18' },
  ];

  // Calificaciones por materia
  const calificaciones = [
    { materia: 'Matemáticas', calificacion: 9.2, asistencia: '95%' },
    { materia: 'Español', calificacion: 8.7, asistencia: '92%' },
    { materia: 'Ciencias Naturales', calificacion: 9.0, asistencia: '98%' },
    { materia: 'Historia', calificacion: 8.5, asistencia: '90%' },
    { materia: 'Geografía', calificacion: 9.3, asistencia: '96%' },
    { materia: 'Inglés', calificacion: 9.1, asistencia: '94%' },
  ];

  // Promedio general
  const promedioGeneral = calificaciones.reduce((acc, curr) => acc + curr.calificacion, 0) / calificaciones.length;

  // Función para descargar el historial en formato CSV
  const handleDescargarHistorial = () => {
    const fechaActual = new Date().toISOString().split('T')[0];
    const nombreArchivo = `historial_academico_${alumno.matricula}_${fechaActual}`;
    
    // Crear contenido del CSV
    const contenidoCSV = generarContenidoCSV();
    
    // Crear y descargar archivo CSV
    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${nombreArchivo}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Mostrar mensaje de confirmación
    alert(`Historial académico descargado exitosamente: ${nombreArchivo}.csv`);
  };

  // Función para generar el contenido CSV
  const generarContenidoCSV = (): string => {
    const lineas: string[] = [];
    
    // Encabezado del documento
    lineas.push('HISTORIAL ACADÉMICO');
    lineas.push('');
    lineas.push(`Alumno: ${alumno.nombre}`);
    lineas.push(`Matrícula: ${alumno.matricula}`);
    lineas.push(`Fecha de generación: ${new Date().toLocaleString()}`);
    lineas.push('');
    
    // Promedio general
    lineas.push('=== RESUMEN GENERAL ===');
    lineas.push('Promedio General,' + promedioGeneral.toFixed(1));
    lineas.push('');
    
    // Detalles de inscripción
    lineas.push('=== DETALLES DE INSCRIPCIÓN ===');
    lineas.push('Ciclo,Estado,Fecha de Inscripción');
    inscripciones.forEach(inscripcion => {
      lineas.push(`${inscripcion.ciclo},${inscripcion.estado},${inscripcion.fecha}`);
    });
    lineas.push('');
    
    // Calificaciones y asistencia
    lineas.push('=== CALIFICACIONES Y ASISTENCIA - CICLO 2024-1 ===');
    lineas.push('Materia,Calificación,Asistencia,Estado');
    calificaciones.forEach(materia => {
      const estado = materia.calificacion >= 6 ? 'Aprobado' : 'Reprobado';
      lineas.push(`${materia.materia},${materia.calificacion.toFixed(1)},${materia.asistencia},${estado}`);
    });
    lineas.push('');
    
    // Resumen del ciclo
    const promedioCiclo = calificaciones.reduce((acc, curr) => acc + curr.calificacion, 0) / calificaciones.length;
    const promedioAsistencia = calificaciones.reduce((acc, curr) => acc + parseFloat(curr.asistencia), 0) / calificaciones.length;
    const materiasAprobadas = calificaciones.filter(m => m.calificacion >= 6).length;
    
    lineas.push('=== RESUMEN DEL CICLO 2024-1 ===');
    lineas.push('Promedio del Ciclo,' + promedioCiclo.toFixed(1));
    lineas.push('Promedio de Asistencia,' + promedioAsistencia.toFixed(1) + '%');
    lineas.push('Materias Aprobadas,' + materiasAprobadas + '/' + calificaciones.length);
    
    return lineas.join('\n');
  };

  return (
    <div className="p-8 bg-whiteBg-50 min-h-full">
      {/* BOTÓN VOLVER */}
      <div className="mb-6">
        <button
          onClick={() => navigate(grupoId ? `/admin/alumnos/${grupoId}` : '/admin/alumnos')}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver a la lista</span>
        </button>
      </div>

      {/* TÍTULO PRINCIPAL */}
      <h1 className="font-['Kaushan_Script'] text-4xl text-black mb-4 pb-2 border-b-2 border-gray-300">
        Historial Académico
      </h1>

      {/* ENCABEZADO CON FOTO Y DATOS */}
      <Card variant="elevated" className="mb-6 bg-whiteBg-100 border-2 border-grayDark-200">
        <div className="flex items-center gap-6">
          {/* FOTO */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-200 to-blue-200 flex items-center justify-center">
            <span className="text-2xl font-bold text-purple-700">
              {alumno.nombre.charAt(0)}
            </span>
          </div>

          {/* DATOS */}
          <div className="flex-1">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nombre Completo</p>
                <p className="text-xl font-bold text-[#2E4156]">{alumno.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Matrícula</p>
                <p className="text-xl font-bold text-[#2E4156]">{alumno.matricula}</p>
              </div>
            </div>
          </div>

          {/* PROMEDIO GENERAL */}
          <div className="text-center">
            <p className="text-xl font-bold text-gray-600 mb-1">Promedio General</p>
            <div className="text-3xl font-bold bg-whiteBg-100 text-main-800 p-2 rounded-xl">
              {promedioGeneral.toFixed(1)}
            </div>
          </div>
        </div>
      </Card>

      {/* DETALLES DE INSCRIPCIÓN */}
      <Card variant="elevated" className="mb-6 bg-whiteBg-100 border-2 border-grayDark-200">
        <h3 className="text-2xl font-bold text-main-800 mb-6">Detalles de Inscripción</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {inscripciones.map((inscripcion, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">Ciclo</p>
                <p className="text-lg font-bold text-[#2E4156]">{inscripcion.ciclo}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Estado</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${inscripcion.estado === 'Completado' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className={`text-sm font-medium ${inscripcion.estado === 'Completado' ? 'text-green-700' : 'text-yellow-700'}`}>
                      {inscripcion.estado}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">Fecha</p>
                  <p className="text-sm font-medium text-gray-800">{inscripcion.fecha}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* CALIFICACIONES Y ASISTENCIA */}
      <Card variant="elevated" className="mb-6 bg-whiteBg-100 border-2 border-grayDark-200">
        <h3 className="text-2xl font-bold text-main-800 mb-6">Calificaciones y Asistencia - Ciclo 2024-1</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300 bg-grayLight-300">
                <th className="text-left py-3 px-4 font-bold text-xl text-main-800">Materia</th>
                <th className="text-left py-3 px-4 font-bold text-xl text-main-800 w-32">Calificación</th>
                <th className="text-left py-3 px-4 font-bold text-xl text-main-800 w-32">Asistencia</th>
                <th className="text-left py-3 px-4 font-bold text-xl text-main-800 w-32">Estado</th>
              </tr>
            </thead>
            <tbody>
              {calificaciones.map((materia, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-whiteBg-200">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">{materia.materia}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`text-lg font-bold ${materia.calificacion >= 9 ? 'text-green-600' : materia.calificacion >= 8 ? 'text-blue-600' : 'text-red-600'}`}>
                      {materia.calificacion.toFixed(1)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-teal-500 h-2 rounded-full"
                          style={{ width: parseFloat(materia.asistencia) + '%' }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{materia.asistencia}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${materia.calificacion >= 6 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {materia.calificacion >= 6 ? 'Aprobado' : 'Reprobado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RESUMEN */}
        <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center border-rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Promedio del Ciclo</p>
            <p className="text-2xl font-bold text-[#2E4156]">
              {(calificaciones.reduce((acc, curr) => acc + curr.calificacion, 0) / calificaciones.length).toFixed(1)}
            </p>
          </div>
          
          <div className="text-center border-rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Promedio de Asistencia</p>
            <p className="text-2xl font-bold text-[#2E4156]">
              {(
                calificaciones.reduce((acc, curr) => acc + parseFloat(curr.asistencia), 0) / calificaciones.length
              ).toFixed(1)}%
            </p>
          </div>
          
          <div className="text-center border-rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Materias Aprobadas</p>
            <p className="text-2xl font-bold text-[#2E4156]">
              {calificaciones.filter(m => m.calificacion >= 6).length} / {calificaciones.length}
            </p>
          </div>
        </div>
      </Card>

      {/* BOTÓN DE ACCIÓN */}
      <div className="flex justify-end mt-8">
        <button 
          onClick={handleDescargarHistorial}
          className="flex items-center gap-2 bg-main-800 hover:bg-main-900 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
        >
          <Download size={18} />
          Descargar Historial
        </button>
      </div>
    </div>
  );
};