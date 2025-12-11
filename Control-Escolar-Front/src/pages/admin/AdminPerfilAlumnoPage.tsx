import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Edit2 } from 'lucide-react';

type TabType = 'informacion' | 'pagos' | 'solicitudes';

export const AdminPerfilAlumnoPage: React.FC = () => {
  const { alumnoId, grupoId } = useParams<{ alumnoId: string; grupoId?: string }>();
  const navigate = useNavigate();
  
  const [tabActiva, setTabActiva] = useState<TabType>('informacion');
  
  const alumno = {
    id: alumnoId || '1',
    nombre: 'Juan Pérez López',
    matricula: 'A001',
    grado: '3°',
    grupo: 'A',
    promedio: 8.5,
    faltas: 4,
    fechaNacimiento: '15/05/2005',
    curp: 'PELJ050515HDFRRNA1',
    telefono: '55 1234 5678',
    correo: 'juan.perez@escuela.edu.mx',
    direccion: 'Calle Principal #123, Col. Centro',
    tutor: 'María López Pérez',
    telefonoTutor: '55 8765 4321',
  };

  const renderContenido = () => {
    switch (tabActiva) {
      case 'informacion':
        return (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-[#2E4156] mb-4">Datos Personales</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Fecha de Nacimiento</span>
                <span className="font-medium">{alumno.fechaNacimiento}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">CURP</span>
                <span className="font-medium">{alumno.curp}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Teléfono</span>
                <span className="font-medium">{alumno.telefono}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Correo Electrónico</span>
                <span className="font-medium">{alumno.correo}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Dirección</span>
                <span className="font-medium text-right max-w-xs">{alumno.direccion}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Tutor</span>
                <span className="font-medium">{alumno.tutor}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Teléfono del Tutor</span>
                <span className="font-medium">{alumno.telefonoTutor}</span>
              </div>
            </div>
          </div>
        );

      case 'pagos':
        return (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-[#2E4156] mb-4">Historial de Pagos</h3>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">Matrícula Semestral</h4>
                    <p className="text-sm text-gray-600">Pago realizado: 15/01/2024</p>
                  </div>
                  <span className="text-green-700 font-bold">$5,000.00 MXN</span>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">Mensualidad Enero</h4>
                    <p className="text-sm text-gray-600">Pago realizado: 05/01/2024</p>
                  </div>
                  <span className="text-blue-700 font-bold">$2,500.00 MXN</span>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">Mensualidad Febrero</h4>
                    <p className="text-sm text-gray-600">Pendiente - Vence 05/02/2024</p>
                  </div>
                  <span className="text-yellow-700 font-bold">$2,500.00 MXN</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'solicitudes':
        return (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-[#2E4156] mb-4">Solicitudes</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">Constancia de Estudios</h4>
                    <p className="text-sm text-gray-600">Solicitada: 20/01/2024 - Estado: <span className="text-green-600">Aprobada</span></p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">Justificación de Falta</h4>
                    <p className="text-sm text-gray-600">Solicitada: 18/01/2024 - Estado: <span className="text-blue-600">En revisión</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full font-['Lato']">
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
      <h1 className="font-['Kaushan_Script'] text-4xl text-black mb-2">
        Perfil del Alumno
      </h1>
      <hr className="border-gray-300 mb-8" />

      {/* HEADER DEL PERFIL */}
      <Card variant="elevated" className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          {/* AVATAR */}
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-3xl font-bold text-gray-600">
            {alumno.nombre.charAt(0)}
          </div>

          {/* DATOS BÁSICOS */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">Nombre Completo</p>
                <p className="text-xl font-bold text-[#2E4156]">{alumno.nombre}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Matrícula</p>
                <p className="text-xl font-bold text-[#2E4156]">{alumno.matricula}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Grado</p>
                <p className="text-xl font-bold text-[#2E4156]">{alumno.grado}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Grupo</p>
                <p className="text-xl font-bold text-[#2E4156]">{alumno.grupo}</p>
              </div>
            </div>
          </div>

          {/* BOTÓN EDITAR */}
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Edit2 size={18} />
            Editar Perfil
          </button>
        </div>
      </Card>

      {/* INDICADORES */}
      <div className="mb-8 flex justify-center">
        <div className="bg-gray-100 w-full md:w-2/3 p-6 rounded-3xl shadow-sm flex justify-around">
          <div className="text-center">
            <p className="text-gray-600 mb-1">Promedio</p>
            <p className="text-3xl font-bold text-[#2E4156]">{alumno.promedio}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-1">Faltas</p>
            <p className="text-3xl font-bold text-[#2E4156]">{alumno.faltas}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-1">Asistencias</p>
            <p className="text-3xl font-bold text-[#2E4156]">42</p>
          </div>
        </div>
      </div>

      {/* PESTAÑAS */}
      <div className="mb-6">
        <div className="flex border-b border-gray-300">
          <button
            className={`px-6 py-3 text-lg font-medium transition-colors ${tabActiva === 'informacion' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setTabActiva('informacion')}
          >
            Información
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium transition-colors ${tabActiva === 'pagos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setTabActiva('pagos')}
          >
            Pagos
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium transition-colors ${tabActiva === 'solicitudes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setTabActiva('solicitudes')}
          >
            Solicitudes
          </button>
        </div>
      </div>

      {/* CONTENIDO DE LA PESTAÑA */}
      <Card variant="elevated">
        {renderContenido()}
      </Card>

      {/* ACCIONES ADICIONALES */}
      <div className="mt-8 flex flex-wrap gap-4 justify-end">
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg transition-colors">
          Descargar Historial
        </button>
        <button className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2.5 px-6 rounded-lg transition-colors">
          Suspender Alumno
        </button>
        <button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          Generar Reporte
        </button>
      </div>
    </div>
  );
};