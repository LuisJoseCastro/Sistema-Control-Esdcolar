import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Edit2, Save, X, Download } from 'lucide-react';
import Input from '../../components/ui/Input';

type TabType = 'informacion' | 'pagos' | 'solicitudes';

interface AlumnoData {
  id: string;
  nombre: string;
  matricula: string;
  grado: string;
  grupo: string;
  promedio: number;
  faltas: number;
  fechaNacimiento: string;
  curp: string;
  telefono: string;
  correo: string;
  direccion: string;
  tutor: string;
  telefonoTutor: string;
}

interface Pago {
  concepto: string;
  fecha: string;
  monto: string;
  estado: string;
}

interface Solicitud {
  tipo: string;
  fechaSolicitud: string;
  estado: string;
}

export const AdminPerfilAlumnoPage: React.FC = () => {
  const { alumnoId, grupoId } = useParams<{ alumnoId: string; grupoId?: string }>();
  const navigate = useNavigate();
  
  const [tabActiva, setTabActiva] = useState<TabType>('informacion');
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [alumno, setAlumno] = useState<AlumnoData>({
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
  });

  const [datosEditados, setDatosEditados] = useState<AlumnoData>({ ...alumno });

  // Datos de ejemplo para pagos
  const pagos: Pago[] = [
    { concepto: 'Matrícula Semestral', fecha: '15/01/2024', monto: '$5,000.00 MXN', estado: 'Pagado' },
    { concepto: 'Mensualidad Enero', fecha: '05/01/2024', monto: '$2,500.00 MXN', estado: 'Pagado' },
    { concepto: 'Mensualidad Febrero', fecha: '05/02/2024', monto: '$2,500.00 MXN', estado: 'Pendiente' },
  ];

  // Datos de ejemplo para solicitudes
  const solicitudes: Solicitud[] = [
    { tipo: 'Constancia de Estudios', fechaSolicitud: '20/01/2024', estado: 'Aprobada' },
    { tipo: 'Justificación de Falta', fechaSolicitud: '18/01/2024', estado: 'En revisión' },
  ];

  const handleEditarPerfil = () => {
    setDatosEditados({ ...alumno });
    setMostrarModalEditar(true);
  };

  const handleGuardarCambios = () => {
    setAlumno({ ...datosEditados });
    setMostrarModalEditar(false);
    alert('Perfil actualizado correctamente');
  };

  const handleCancelarEdicion = () => {
    setMostrarModalEditar(false);
    setDatosEditados({ ...alumno });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosEditados(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDescargarHistorial = () => {
    const fechaActual = new Date().toISOString().split('T')[0];
    const nombreArchivo = `historial_${alumno.matricula}_${fechaActual}`;
    
    // Crear contenido CSV
    const contenidoCSV = generarContenidoCSV();
    
    // Crear y descargar archivo
    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${nombreArchivo}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`Historial descargado exitosamente: ${nombreArchivo}.csv`);
  };

  const generarContenidoCSV = (): string => {
    const lineas: string[] = [];
    
    // Encabezado
    lineas.push('HISTORIAL ACADÉMICO DEL ALUMNO');
    lineas.push('');
    lineas.push(`Alumno: ${alumno.nombre}`);
    lineas.push(`Matrícula: ${alumno.matricula}`);
    lineas.push(`Grado: ${alumno.grado} Grupo: ${alumno.grupo}`);
    lineas.push(`Fecha de generación: ${new Date().toLocaleString()}`);
    lineas.push('');
    
    // Datos personales
    lineas.push('=== DATOS PERSONALES ===');
    lineas.push('Campo,Valor');
    lineas.push(`Nombre Completo,${alumno.nombre}`);
    lineas.push(`Matrícula,${alumno.matricula}`);
    lineas.push(`Grado y Grupo,${alumno.grado} ${alumno.grupo}`);
    lineas.push(`Fecha de Nacimiento,${alumno.fechaNacimiento}`);
    lineas.push(`CURP,${alumno.curp}`);
    lineas.push(`Teléfono,${alumno.telefono}`);
    lineas.push(`Correo Electrónico,${alumno.correo}`);
    lineas.push(`Dirección,"${alumno.direccion}"`);
    lineas.push(`Tutor,${alumno.tutor}`);
    lineas.push(`Teléfono del Tutor,${alumno.telefonoTutor}`);
    lineas.push('');
    
    // Indicadores académicos
    lineas.push('=== INDICADORES ACADÉMICOS ===');
    lineas.push('Indicador,Valor');
    lineas.push(`Promedio,${alumno.promedio}`);
    lineas.push(`Faltas,${alumno.faltas}`);
    lineas.push('Asistencias,42');
    lineas.push('');
    
    // Historial de pagos
    lineas.push('=== HISTORIAL DE PAGOS ===');
    lineas.push('Concepto,Fecha,Monto,Estado');
    pagos.forEach(pago => {
      lineas.push(`${pago.concepto},${pago.fecha},${pago.monto},${pago.estado}`);
    });
    lineas.push('');
    
    // Historial de solicitudes
    lineas.push('=== HISTORIAL DE SOLICITUDES ===');
    lineas.push('Tipo de Solicitud,Fecha de Solicitud,Estado');
    solicitudes.forEach(solicitud => {
      lineas.push(`${solicitud.tipo},${solicitud.fechaSolicitud},${solicitud.estado}`);
    });
    
    return lineas.join('\n');
  };

  // Función alternativa para PDF (comentada - requiere instalación)
  /*
  const handleDescargarHistorialPDF = async () => {
    // Si decides instalar jspdf, descomenta esto:
    // const { jsPDF } = await import('jspdf');
    // const doc = new jsPDF();
    // ... código para generar PDF
  };
  */

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
              {pagos.map((pago, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    pago.estado === 'Pagado' ? 'bg-green-50 border-green-200' :
                    pago.estado === 'Pendiente' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-800">{pago.concepto}</h4>
                      <p className="text-sm text-gray-600">
                        {pago.estado === 'Pagado' ? `Pago realizado: ${pago.fecha}` : `Pendiente - Vence: ${pago.fecha}`}
                      </p>
                    </div>
                    <span className={`font-bold ${
                      pago.estado === 'Pagado' ? 'text-green-700' :
                      pago.estado === 'Pendiente' ? 'text-yellow-700' :
                      'text-blue-700'
                    }`}>
                      {pago.monto}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'solicitudes':
        return (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-[#2E4156] mb-4">Solicitudes</h3>
            <div className="space-y-4">
              {solicitudes.map((solicitud, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-800">{solicitud.tipo}</h4>
                      <p className="text-sm text-gray-600">
                        Solicitada: {solicitud.fechaSolicitud} - Estado: 
                        <span className={`ml-1 ${
                          solicitud.estado === 'Aprobada' ? 'text-green-600 font-semibold' :
                          solicitud.estado === 'En revisión' ? 'text-blue-600 font-semibold' :
                          'text-red-600 font-semibold'
                        }`}>
                          {solicitud.estado}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
          <button 
            onClick={handleEditarPerfil}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
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

      {/* BOTÓN DE ACCIÓN */}
      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleDescargarHistorial}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          <Download size={18} />
          Descargar Historial
        </button>
      </div>

      {/* MODAL PARA EDITAR PERFIL */}
      {mostrarModalEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-gray-800">
                Editar Perfil de Alumno
              </h3>
              <button
                onClick={handleCancelarEdicion}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo *
                    </label>
                    <Input
                      name="nombre"
                      value={datosEditados.nombre}
                      onChange={handleInputChange}
                      placeholder="Nombre completo"
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Matrícula *
                    </label>
                    <Input
                      name="matricula"
                      value={datosEditados.matricula}
                      onChange={handleInputChange}
                      placeholder="Matrícula"
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grado
                      </label>
                      <Input
                        name="grado"
                        value={datosEditados.grado}
                        onChange={handleInputChange}
                        placeholder="Ej: 3°"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grupo
                      </label>
                      <Input
                        name="grupo"
                        value={datosEditados.grupo}
                        onChange={handleInputChange}
                        placeholder="Ej: A"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Nacimiento
                    </label>
                    <Input
                      name="fechaNacimiento"
                      value={datosEditados.fechaNacimiento}
                      onChange={handleInputChange}
                      placeholder="DD/MM/AAAA"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CURP
                    </label>
                    <Input
                      name="curp"
                      value={datosEditados.curp}
                      onChange={handleInputChange}
                      placeholder="CURP"
                      className="w-full uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <Input
                      name="telefono"
                      value={datosEditados.telefono}
                      onChange={handleInputChange}
                      placeholder="Teléfono"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico
                    </label>
                    <Input
                      name="correo"
                      value={datosEditados.correo}
                      onChange={handleInputChange}
                      placeholder="correo@ejemplo.com"
                      type="email"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <Input
                      name="direccion"
                      value={datosEditados.direccion}
                      onChange={handleInputChange}
                      placeholder="Dirección completa"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tutor
                    </label>
                    <Input
                      name="tutor"
                      value={datosEditados.tutor}
                      onChange={handleInputChange}
                      placeholder="Nombre del tutor"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono del Tutor
                    </label>
                    <Input
                      name="telefonoTutor"
                      value={datosEditados.telefonoTutor}
                      onChange={handleInputChange}
                      placeholder="Teléfono del tutor"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Nota:</span> Los campos marcados con * son obligatorios. 
                  Los cambios se reflejarán inmediatamente en el perfil del alumno.
                </p>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleCancelarEdicion}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarCambios}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Save size={18} />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};