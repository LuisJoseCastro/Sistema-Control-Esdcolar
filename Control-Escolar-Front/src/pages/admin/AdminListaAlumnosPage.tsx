import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, X, Download } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Input from '../../components/ui/Input';

interface Alumno {
  id: number;
  matricula: string;
  nombre: string;
}

export const AdminListaAlumnosPage: React.FC = () => {
  const { grupoId = '3A' } = useParams<{ grupoId: string }>();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoAlumno, setNuevoAlumno] = useState({
    matricula: '',
    nombre: ''
  });
  const [alumnos, setAlumnos] = useState<Alumno[]>([
    { id: 1, matricula: 'A001', nombre: 'Juan Pérez López' },
    { id: 2, matricula: 'A002', nombre: 'María González Ruiz' },
    { id: 3, matricula: 'A003', nombre: 'Carlos Rodríguez Sánchez' },
    { id: 4, matricula: 'A004', nombre: 'Ana Martínez Torres' },
    { id: 5, matricula: 'A005', nombre: 'Pedro Fernández García' },
    { id: 6, matricula: 'A006', nombre: 'Laura Díaz Méndez' },
    { id: 7, matricula: 'A007', nombre: 'Miguel Ángel Ruiz Castro' },
    { id: 8, matricula: 'A008', nombre: 'Sofía Herrera Vargas' },
  ]);
  
  // Filtrar alumnos según búsqueda
  const alumnosFiltrados = alumnos.filter(alumno =>
    alumno.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    alumno.matricula.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleVerPerfil = (alumnoId: number) => {
    navigate(`/admin/alumnos/${grupoId}/${alumnoId}/perfil`);
  };

  const handleVerHistorial = (alumnoId: number) => {
    navigate(`/admin/alumnos/${grupoId}/${alumnoId}/historial`);
  };

  const handleAgregarAlumno = () => {
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setNuevoAlumno({ matricula: '', nombre: '' });
  };

  const handleSubmitAlumno = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nuevoAlumno.matricula.trim() || !nuevoAlumno.nombre.trim()) {
      alert('Por favor complete todos los campos');
      return;
    }

    // Verificar si la matrícula ya existe
    const matriculaExiste = alumnos.some(
      alumno => alumno.matricula.toLowerCase() === nuevoAlumno.matricula.toLowerCase()
    );
    
    if (matriculaExiste) {
      alert('La matrícula ya existe. Por favor ingrese una matrícula diferente.');
      return;
    }

    // Crear nuevo alumno con ID único
    const nuevoAlumnoConId: Alumno = {
      id: alumnos.length > 0 ? Math.max(...alumnos.map(a => a.id)) + 1 : 1,
      matricula: nuevoAlumno.matricula.toUpperCase(),
      nombre: nuevoAlumno.nombre
    };

    // Agregar al estado
    setAlumnos([...alumnos, nuevoAlumnoConId]);
    
    // Limpiar formulario y cerrar modal
    setNuevoAlumno({ matricula: '', nombre: '' });
    setMostrarModal(false);
    
    // Opcional: Mostrar mensaje de éxito
    alert(`Alumno ${nuevoAlumnoConId.nombre} agregado exitosamente al grupo ${grupoId}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoAlumno(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExportarLista = () => {
    // Crear contenido CSV
    const alumnosAExportar = busqueda ? alumnosFiltrados : alumnos;
    
    // Encabezados del CSV
    const headers = ['No.', 'Matrícula', 'Nombre Completo'];
    
    // Filas de datos
    const rows = alumnosAExportar.map((alumno, index) => [
      index + 1,
      alumno.matricula,
      alumno.nombre
    ]);

    // Combinar encabezados y filas
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Crear blob y descargar archivo
    const blob = new Blob(['\ufeff',csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute(
      'download', 
      `lista_alumnos_${grupoId}_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Mostrar mensaje de éxito
    alert(`Se ha exportado la lista de ${alumnosAExportar.length} alumno(s) del grupo ${grupoId}`);
  };

  // Función alternativa para exportar como Excel (usando xlsx library si está disponible)
  const handleExportarExcel = () => {
    // Si quieres exportar como Excel necesitarías la librería xlsx
    // Por ahora, exportaremos como CSV que es más simple
    handleExportarLista();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full font-['Lato']">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-gray-300 pb-6 mb-8">
        <h1 className="text-5xl text-black font-['Kaushan_Script'] mb-4 md:mb-0">
          {grupoId}
        </h1>
        
        {/* Barra de búsqueda */}
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

      {/* CONTENIDO PRINCIPAL */}
      <Card variant="flat" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Lista de Alumnos - Grupo {grupoId}
          </h2>
          <span className="text-sm text-gray-600">
            {alumnosFiltrados.length} de {alumnos.length} alumnos
          </span>
        </div>

        {/* TABLA DE ALUMNOS */}
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-16 text-center">#</Table.Head>
                <Table.Head>Matrícula</Table.Head>
                <Table.Head>Nombre Completo</Table.Head>
                <Table.Head>Perfil</Table.Head>
                <Table.Head>Historial</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {alumnosFiltrados.map((alumno, index) => (
                <Table.Row key={alumno.id} className="hover:bg-whiteBg-100">
                  <Table.Cell className="text-center font-medium text-gray-500">
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell className="font-medium text-[#2E4156]">
                    {alumno.matricula}
                  </Table.Cell>
                  <Table.Cell className="text-gray-800">
                    {alumno.nombre}
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
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Si no hay resultados */}
        {alumnosFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron alumnos con "{busqueda}"
          </div>
        )}
      </Card>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => navigate('/admin/alumnos')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          ← Volver a Grupos
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={handleExportarLista}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg transition-colors"
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

      {/* MODAL PARA AGREGAR ALUMNO */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-800">
                Agregar Nuevo Alumno
              </h3>
              <button
                onClick={handleCerrarModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitAlumno} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matrícula *
                  </label>
                  <Input
                    name="matricula"
                    value={nuevoAlumno.matricula}
                    onChange={handleInputChange}
                    placeholder="Ej: A009"
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    La matrícula debe ser única
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo *
                  </label>
                  <Input
                    name="nombre"
                    value={nuevoAlumno.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Carlos Sánchez García"
                    className="w-full"
                    required
                  />
                </div>

                <div className="text-sm text-gray-600">
                  <p>El alumno será agregado al grupo: <strong>{grupoId}</strong></p>
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleCerrarModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-main-800 hover:bg-main-900 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  Agregar Alumno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};