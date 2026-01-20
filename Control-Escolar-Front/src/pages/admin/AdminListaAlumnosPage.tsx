import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, X, Download, Trash2 } from 'lucide-react'; 
import { Card } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { adminService } from '../../services/admin.service'; 

interface Alumno {
  id: string | number;
  matricula: string;
  nombre: string;
}

export const AdminListaAlumnosPage: React.FC = () => {
  // Aquí 'grupoId' viene de la URL (ej: "1A")
  const { grupoId } = useParams<{ grupoId: string }>();
  const navigate = useNavigate();
  
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoAlumno, setNuevoAlumno] = useState({
    matricula: '',
    nombre: ''
  });

  const cargarAlumnos = async () => {
    if (!grupoId) return;
    try {
      setLoading(true);
      
      // 🔥 TRUCO 1: Reconstruimos el nombre oficial para buscar la lista
      // Si la URL dice "1A", pedimos "GRUPO 1A"
      const idParaBackend = (grupoId && !grupoId.includes('GRUPO') && !grupoId.includes('-')) 
        ? `GRUPO ${grupoId}` 
        : grupoId;

      const data = await adminService.getAlumnosPorGrupo(idParaBackend);
      setAlumnos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar alumnos:", error);
      setAlumnos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, [grupoId]);

  const alumnosFiltrados = alumnos.filter(alumno => {
    const nombre = (alumno?.nombre || '').toLowerCase();
    const matricula = (alumno?.matricula || '').toLowerCase();
    return (
      nombre.includes(busqueda.toLowerCase()) ||
      matricula.includes(busqueda.toLowerCase())
    );
  });

  const handleVerPerfil = (alumnoId: string | number) => {
    navigate(`/admin/alumnos/${grupoId}/${alumnoId}/perfil`);
  };

  const handleVerHistorial = (alumnoId: string | number) => {
    navigate(`/admin/alumnos/${grupoId}/${alumnoId}/historial`);
  };

  const handleEliminarAlumno = async (alumnoId: string | number) => {
    if (window.confirm('⚠️ ¿Seguro que quieres eliminar a este alumno? Se liberará su matrícula.')) {
        try {
            await adminService.eliminarAlumno(String(alumnoId));
            alert('✅ Alumno eliminado.');
            cargarAlumnos(); 
        } catch (error) {
            console.error('Error al eliminar', error);
            alert('❌ Hubo un error al eliminar el alumno.');
        }
    }
  };

  const handleAgregarAlumno = () => {
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setNuevoAlumno({ matricula: '', nombre: '' });
  };

  const handleSubmitAlumno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoAlumno.matricula.trim() || !nuevoAlumno.nombre.trim()) {
      alert('Por favor complete todos los campos');
      return;
    }

    try {
        // 🔥 TRUCO 2 (LA SOLUCIÓN AL 404): 
        // Si grupoId es "1A", lo convertimos a "GRUPO 1A" antes de enviarlo.
        // El backend espera el nombre exacto tal como se guardó en BD.
        let grupoParaEnviar = grupoId || "";
        
        // Si no es un UUID (largo) y no tiene la palabra GRUPO, se la ponemos
        if (grupoParaEnviar.length < 10 && !grupoParaEnviar.includes('GRUPO')) {
            grupoParaEnviar = `GRUPO ${grupoParaEnviar}`;
        }

        await adminService.registrarAlumno({
            matricula: nuevoAlumno.matricula.toUpperCase().trim(),
            nombre: nuevoAlumno.nombre.trim(),
            grupoId: grupoParaEnviar // <--- Enviamos el nombre corregido
        });

        alert(`Alumno ${nuevoAlumno.nombre} agregado exitosamente`);
        handleCerrarModal();
        await cargarAlumnos(); 
    } catch (error: any) {
        // Mejor manejo del mensaje de error
        const mensaje = error.response?.data?.message || 'Error al registrar alumno';
        alert(`❌ Error: ${mensaje}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoAlumno(prev => ({ ...prev, [name]: value }));
  };

  const handleExportarLista = () => {
    const headers = ['No.', 'Matrícula', 'Nombre Completo'];
    const rows = alumnosFiltrados.map((alumno, index) => [
      index + 1,
      alumno?.matricula || '',
      alumno?.nombre || ''
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob(['\ufeff', csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `lista_alumnos_${grupoId}.csv`;
    link.click();
  };

  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center bg-gray-50">
              <LoadingSpinner className="w-12 h-12 text-teal-600" />
          </div>
      );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-full font-['Lato']">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-gray-300 pb-6 mb-8">
        <h1 className="text-5xl text-black font-['Kaushan_Script'] mb-4 md:mb-0">
          {/* Mostramos bonito: si dice GRUPO 1A o solo 1A */}
          Grupo {grupoId?.replace('GRUPO', '').trim()}
        </h1>
        
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

      <Card variant="flat" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Lista de Alumnos
          </h2>
          <span className="text-sm text-gray-600">
            {alumnosFiltrados.length} de {alumnos.length} alumnos
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-16 text-center">#</Table.Head>
                <Table.Head>Matrícula</Table.Head>
                <Table.Head>Nombre Completo</Table.Head>
                <Table.Head>Perfil</Table.Head>
                <Table.Head>Historial</Table.Head>
                <Table.Head className="text-center">Eliminar</Table.Head> 
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {alumnosFiltrados.map((alumno, index) => (
                <Table.Row key={alumno?.id || index} className="hover:bg-whiteBg-100">
                  <Table.Cell className="text-center font-medium text-gray-500">
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell className="font-medium text-[#2E4156]">
                    {alumno?.matricula || '---'}
                  </Table.Cell>
                  <Table.Cell className="text-gray-800">
                    {alumno?.nombre || 'Sin nombre registrado'}
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => handleVerPerfil(alumno.id)}
                      className="text-gray-800 font-semibold hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      ver perfil
                    </button>
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => handleVerHistorial(alumno.id)}
                      className="text-gray-800 font-semibold hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      Historial Académico
                    </button>
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    <div className="flex justify-center">
                        <button
                            onClick={() => handleEliminarAlumno(alumno.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 p-2 rounded-full transition-colors cursor-pointer border border-red-200"
                            title="Eliminar Alumno"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </Table.Cell>

                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Card>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => navigate('/admin/grupos')} // Ajustado para volver al dashboard de grupos
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
        >
          ← Volver a Grupos
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={handleExportarLista}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
          >
            <Download size={18} />
            Exportar Lista
          </button>
          <button 
            onClick={handleAgregarAlumno}
            className="bg-main-800 hover:bg-main-900 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            + Agregar Alumno
          </button>
        </div>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-800">
                Agregar Nuevo Alumno
              </h3>
              <button onClick={handleCerrarModal} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitAlumno} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula *</label>
                  <Input name="matricula" value={nuevoAlumno.matricula} onChange={handleInputChange} placeholder="Ej: A009" className="w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                  <Input name="nombre" value={nuevoAlumno.nombre} onChange={handleInputChange} placeholder="Ej: Carlos Sánchez García" className="w-full" required />
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t">
                <button type="button" onClick={handleCerrarModal} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 bg-main-800 hover:bg-main-900 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};