import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Edit2, Save, X, Download } from 'lucide-react';
import Input from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { adminService } from '../../services/admin.service';

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

interface Pago { concepto: string; fecha: string; monto: string; estado: string; }
interface Solicitud { tipo: string; fechaSolicitud: string; estado: string; }

export const AdminPerfilAlumnoPage: React.FC = () => {
  const { alumnoId, grupoId } = useParams<{ alumnoId: string; grupoId?: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState<TabType>('informacion');
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  
  const [alumno, setAlumno] = useState<AlumnoData | null>(null);
  const [datosEditados, setDatosEditados] = useState<AlumnoData | null>(null);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  useEffect(() => {
    const fetchFullProfile = async () => {
      if (!alumnoId) return;
      try {
        setLoading(true);
        const data = await adminService.getAlumnoFullProfile(alumnoId);
        
        // Mapeo refinado para asegurar que los datos del tutor y fecha se carguen correctamente
        const mappedAlumno = {
          id: data?.id || '',
          nombre: data?.nombreCompleto || data?.nombre || '',
          matricula: data?.matricula || '',
          grado: data?.gradoActual || data?.grado || '',
          grupo: data?.grupo?.nombre || data?.grupo || '',
          promedio: data?.promedio || 0,
          faltas: data?.faltas || 0,
          fechaNacimiento: data?.fechaNacimiento || '',
          curp: data?.curp || '',
          telefono: data?.telefono || '',
          correo: data?.email || data?.correo || '',
          direccion: data?.direccion || '',
          tutor: data?.tutor || '',
          telefonoTutor: data?.telefonoTutor || ''
        };

        setAlumno(mappedAlumno);
        setDatosEditados(mappedAlumno);
        setPagos(data?.pagos || []);
        setSolicitudes(data?.solicitudes || []);
      } catch (error) {
        console.error("Error al cargar perfil del alumno:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFullProfile();
  }, [alumnoId]);

  const handleEditarPerfil = () => {
    setMostrarModalEditar(true);
  };

  const handleGuardarCambios = async () => {
    if (!datosEditados || !alumnoId) return;
    try {
      // ✅ AJUSTE: Enviamos el objeto datosEditados al servicio
      // Asegúrate de que en admin.service.ts el método se llame updateStudentProfile
      await adminService.updateStudentProfile(alumnoId, datosEditados);
      
      setAlumno({ ...datosEditados });
      setMostrarModalEditar(false);
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert('Error al actualizar el perfil');
    }
  };

  const handleCancelarEdicion = () => {
    setMostrarModalEditar(false);
    setDatosEditados(alumno ? { ...alumno } : null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosEditados(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleDescargarHistorial = () => {
    if (!alumno) return;
    const fechaActual = new Date().toISOString().split('T')[0];
    const nombreArchivo = `historial_${alumno.matricula}_${fechaActual}`;
    const contenidoCSV = generarContenidoCSV();
    const blob = new Blob(['\ufeff', contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.body.appendChild(document.createElement('a'));
    link.href = URL.createObjectURL(blob);
    link.download = `${nombreArchivo}.csv`;
    link.click();
    document.body.removeChild(link);
  };

  const generarContenidoCSV = (): string => {
    if (!alumno) return '';
    const lineas = [
        'HISTORIAL ACADÉMICO DEL ALUMNO', '',
        `Alumno: ${alumno.nombre}`, `Matrícula: ${alumno.matricula}`,
        `Grado: ${alumno.grado} Grupo: ${alumno.grupo}`,
        `Fecha de generación: ${new Date().toLocaleString()}`, '',
        '=== DATOS PERSONALES ===',
        `CURP,${alumno.curp}`, `Correo,${alumno.correo}`, `Tutor,${alumno.tutor}`, ''
    ];
    return lineas.join('\n');
  };

  if (loading || !alumno || !datosEditados) {
    return (
      <div className="flex h-screen items-center justify-center bg-whiteBg-50">
        <LoadingSpinner className="w-12 h-12 text-main-800" />
      </div>
    );
  }

  const renderContenido = () => {
    switch (tabActiva) {
      case 'informacion':
        return (
          <div className="mt-6 bg-whiteBg-50 p-5 rounded-xl m-1">
            <h3 className="text-xl font-bold text-[#2E4156] mb-4">Datos Personales</h3>
            <div className="space-y-3">
              {[
                { label: 'Fecha de Nacimiento', value: alumno.fechaNacimiento },
                { label: 'CURP', value: alumno.curp },
                { label: 'Teléfono', value: alumno.telefono },
                { label: 'Correo Electrónico', value: alumno.correo },
                { label: 'Dirección', value: alumno.direccion },
                { label: 'Tutor', value: alumno.tutor },
                { label: 'Teléfono del Tutor', value: alumno.telefonoTutor }
              ].map((item, i) => (
                <div key={i} className={`flex justify-between items-center py-2 ${i !== 6 ? 'border-b border-gray-200' : ''}`}>
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-medium text-right max-w-xs">{item.value || 'No registrado'}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'pagos':
        return (
          <div className="mt-6 bg-whiteBg-50 p-5 rounded-xl m-1">
            <h3 className="text-xl font-bold text-[#2E4156] mb-4">Historial de Pagos</h3>
            <div className="space-y-4">
              {pagos.length > 0 ? pagos.map((pago, index) => (
                <div key={index} className={`p-4 rounded-lg border ${pago.estado === 'Pagado' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-800">{pago.concepto}</h4>
                      <p className="text-sm text-gray-600">{pago.estado}: {pago.fecha}</p>
                    </div>
                    <span className="font-bold text-gray-700">{pago.monto}</span>
                  </div>
                </div>
              )) : <p className="text-gray-500 italic">No hay registros de pagos.</p>}
            </div>
          </div>
        );
      case 'solicitudes':
        return (
          <div className="mt-6 bg-whiteBg-50 p-5 rounded-xl m-1">
            <h3 className="text-xl font-bold text-[#2E4156] mb-4">Solicitudes</h3>
            <div className="space-y-4">
              {solicitudes.length > 0 ? solicitudes.map((sol, index) => (
                <div key={index} className="bg-whiteBg-100 p-4 rounded-xl border border-grayDark-300 flex justify-between">
                   <div>
                      <h4 className="font-bold text-gray-800">{sol.tipo}</h4>
                      <p className="text-sm text-gray-600">Fecha: {sol.fechaSolicitud}</p>
                    </div>
                    <span className="font-semibold text-blue-600">{sol.estado}</span>
                </div>
              )) : <p className="text-gray-500 italic">No hay solicitudes pendientes.</p>}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-8 bg-whiteBg-50 min-h-full font-['Lato']">
      <div className="mb-6">
        <button onClick={() => navigate(grupoId ? `/admin/alumnos/${grupoId}` : '/admin/alumnos')} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
          <ArrowLeft size={20} />
          <span>Volver a la lista</span>
        </button>
      </div>

      <h1 className="font-['Kaushan_Script'] text-4xl text-black mb-2">Perfil del Alumno</h1>
      <hr className="border-gray-300 mb-8" />

      <Card variant="elevated" className="mb-8 bg-whiteBg-100">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-3xl font-bold text-gray-600">
            {(alumno.nombre || "A").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><p className="text-gray-600 text-sm">Nombre</p><p className="text-xl font-bold text-[#2E4156]">{alumno.nombre}</p></div>
              <div><p className="text-gray-600 text-sm">Matrícula</p><p className="text-xl font-bold text-[#2E4156]">{alumno.matricula}</p></div>
              <div><p className="text-gray-600 text-sm">Grado</p><p className="text-xl font-bold text-[#2E4156]">{alumno.grado}</p></div>
              <div><p className="text-gray-600 text-sm">Grupo</p><p className="text-xl font-bold text-[#2E4156]">{alumno.grupo}</p></div>
            </div>
          </div>
          <button onClick={handleEditarPerfil} className="flex items-center gap-2 bg-main-800 hover:bg-main-900 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"><Edit2 size={18} /> Editar Perfil</button>
        </div>
      </Card>

      <div className="mb-8 flex justify-center">
        <div className="bg-whiteBg-100 w-full md:w-2/3 p-6 rounded-3xl shadow-sm flex justify-around">
          <div className="text-center"><p className="text-gray-600 mb-1">Promedio</p><p className="text-3xl font-bold text-[#2E4156]">{alumno.promedio}</p></div>
          <div className="text-center"><p className="text-gray-600 mb-1">Faltas</p><p className="text-3xl font-bold text-[#2E4156]">{alumno.faltas}</p></div>
          <div className="text-center"><p className="text-gray-600 mb-1">Asistencias</p><p className="text-3xl font-bold text-[#2E4156]">42</p></div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-300">
          {['informacion', 'pagos', 'solicitudes'].map((t) => (
            <button key={t} className={`px-6 py-3 text-lg font-medium transition-colors capitalize ${tabActiva === t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setTabActiva(t as TabType)}>{t}</button>
          ))}
        </div>
      </div>

      <Card variant="elevated">{renderContenido()}</Card>

      <div className="mt-8 flex justify-end">
        <button onClick={handleDescargarHistorial} className="flex items-center gap-2 bg-main-800 hover:bg-main-900 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors cursor-pointer"><Download size={18} /> Descargar Historial</button>
      </div>

      {mostrarModalEditar && datosEditados && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-grayDark-200 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-grayDark-100">
              <h3 className="text-2xl font-bold text-gray-800">Editar Perfil de Alumno</h3>
              <button onClick={handleCancelarEdicion} className="text-gray-500 hover:text-gray-700 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input label="Nombre Completo *" name="nombre" value={datosEditados.nombre} onChange={handleInputChange} required />
                  <Input label="Matrícula *" name="matricula" value={datosEditados.matricula} onChange={handleInputChange} required />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Grado" name="grado" value={datosEditados.grado} onChange={handleInputChange} />
                    <Input label="Grupo" name="grupo" value={datosEditados.grupo} onChange={handleInputChange} />
                  </div>
                  <Input label="Fecha de Nacimiento" name="fechaNacimiento" value={datosEditados.fechaNacimiento} onChange={handleInputChange} />
                  <Input label="CURP" name="curp" value={datosEditados.curp} onChange={handleInputChange} className="uppercase" />
                </div>
                <div className="space-y-4">
                  <Input label="Teléfono" name="telefono" value={datosEditados.telefono} onChange={handleInputChange} />
                  <Input label="Correo" name="correo" type="email" value={datosEditados.correo} onChange={handleInputChange} />
                  <Input label="Dirección" name="direccion" value={datosEditados.direccion} onChange={handleInputChange} />
                  <Input label="Tutor" name="tutor" value={datosEditados.tutor} onChange={handleInputChange} />
                  <Input label="Teléfono Tutor" name="telefonoTutor" value={datosEditados.telefonoTutor} onChange={handleInputChange} />
                </div>
              </div>
              <div className="flex gap-3 mt-8 pt-6 border-t">
                <button onClick={handleCancelarEdicion} className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg">Cancelar</button>
                <button onClick={handleGuardarCambios} className="flex-1 flex items-center justify-center gap-2 bg-main-800 hover:bg-main-900 text-white py-3 rounded-lg"><Save size={18} /> Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};