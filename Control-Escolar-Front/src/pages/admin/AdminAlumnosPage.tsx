import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Edit2, Save, X, Users, Clock, Plus } from 'lucide-react';

export const AdminAlumnosPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Estado inicial de grupos
  const [grupos, setGrupos] = useState([
    { id: 1, nombre: 'GRUPO 3A', alumnos: 25, grado: '3', turno: 'Matutino' },
    { id: 2, nombre: 'GRUPO 3B', alumnos: 28, grado: '3', turno: 'Matutino' },
    { id: 3, nombre: 'GRUPO 3C', alumnos: 22, grado: '3', turno: 'Matutino' },
    { id: 4, nombre: 'GRUPO 4A', alumnos: 30, grado: '4', turno: 'Vespertino' },
    { id: 5, nombre: 'GRUPO 4B', alumnos: 26, grado: '4', turno: 'Vespertino' },
    { id: 6, nombre: 'GRUPO 4C', alumnos: 24, grado: '4', turno: 'Vespertino' },
  ]);

  // Estado para el modal de edición
  const [modalAbierto, setModalAbierto] = useState(false);
  const [grupoEditando, setGrupoEditando] = useState({
    id: 0,
    nombre: '',
    alumnos: 0,
    grado: '',
    turno: 'Matutino'
  });

  const handleVerAlumnos = (grupoNombre: string) => {
    const grupoId = grupoNombre.replace('GRUPO ', '');
    navigate(`/admin/alumnos/${grupoId}`);
  };

  const abrirModalEdicion = (grupo: typeof grupos[0]) => {
    setGrupoEditando({
      id: grupo.id,
      nombre: grupo.nombre.replace('GRUPO ', ''),
      alumnos: grupo.alumnos,
      grado: grupo.grado,
      turno: grupo.turno
    });
    setModalAbierto(true);
  };

  const cerrarModalEdicion = () => {
    setModalAbierto(false);
    setGrupoEditando({
      id: 0,
      nombre: '',
      alumnos: 0,
      grado: '',
      turno: 'Matutino'
    });
  };

  const guardarCambiosGrupo = () => {
    if (grupoEditando.id === 0) {
      // Crear nuevo grupo
      const nuevoId = Math.max(...grupos.map(g => g.id), 0) + 1;
      const nuevoGrupo = {
        id: nuevoId,
        nombre: `GRUPO ${grupoEditando.grado}${grupoEditando.nombre}`,
        alumnos: grupoEditando.alumnos,
        grado: grupoEditando.grado,
        turno: grupoEditando.turno
      };
      
      setGrupos([...grupos, nuevoGrupo]);
      console.log('Creando nuevo grupo:', nuevoGrupo);
    } else {
      // Editar grupo existente
      setGrupos(grupos.map(grupo => 
        grupo.id === grupoEditando.id 
          ? { 
              ...grupo, 
              nombre: `GRUPO ${grupoEditando.grado}${grupoEditando.nombre}`,
              alumnos: grupoEditando.alumnos,
              grado: grupoEditando.grado,
              turno: grupoEditando.turno
            }
          : grupo
      ));
      console.log('Editando grupo:', grupoEditando);
    }
    
    // Aquí puedes agregar una llamada API para guardar en el backend
    
    cerrarModalEdicion();
  };

  const eliminarGrupo = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este grupo?')) {
      setGrupos(grupos.filter(grupo => grupo.id !== id));
      // Aquí puedes agregar una llamada API para eliminar en el backend
      console.log('Eliminando grupo con ID:', id);
    }
  };

  const agregarNuevoGrupo = () => {
    const nuevoId = Math.max(...grupos.map(g => g.id), 0) + 1;
    
    setGrupoEditando({
      id: 0, // ID 0 indica que es un nuevo grupo
      nombre: 'A',
      alumnos: 0,
      grado: '1',
      turno: 'Matutino'
    });
    setModalAbierto(true);
  };

  // Validar si los campos están completos
  const camposCompletos = () => {
    return grupoEditando.grado.trim() !== '' && 
           grupoEditando.nombre.trim() !== '' &&
           grupoEditando.alumnos >= 0;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* HEADER */}
      <header className="flex justify-between items-end border-b-2 border-gray-400 pb-4 mb-8">
        <h1 
          className="text-5xl text-black font-['Kaushan_Script']"
        >
          Grupos de Alumnos
        </h1>
        <div className="text-sm text-gray-600">
          Total: {grupos.length} grupos • {grupos.reduce((sum, grupo) => sum + grupo.alumnos, 0)} alumnos
        </div>
      </header>

      {/* CONTENIDO DE GRUPOS */}
      <div className="font-['Lato']">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {grupos.map((grupo) => (
            <Card
              key={grupo.id}
              className="cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              variant="elevated"
              onClick={() => handleVerAlumnos(grupo.nombre)}
            >
              <div className="w-full h-48 bg-[#D4D8DD] rounded-t-lg mb-4 flex items-center justify-center relative">
                <div className="text-5xl font-bold text-[#2E4156] opacity-50">
                  {grupo.nombre.slice(-2)}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-bold text-[#2E4156] mb-2">
                  {grupo.nombre}
                </h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Clock size={16} className="mr-2 text-gray-400" />
                    <span className="text-sm">{grupo.turno}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Users size={16} className="mr-2 text-gray-400" />
                    <span className="text-sm">{grupo.alumnos} alumnos</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    grupo.alumnos > 25 
                      ? 'bg-red-100 text-red-800' 
                      : grupo.alumnos > 20 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {grupo.alumnos > 25 ? 'Lleno' : grupo.alumnos > 20 ? 'Casi lleno' : 'Disponible'}
                  </span>
                </div>
                
                {/* Acciones */}
                <div className="mt-4 flex gap-2">
                  <button 
                    className="flex-1 bg-main-700 hover:bg-main-900 text-white px-3 py-2 rounded transition-colors text-sm flex items-center justify-center gap-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerAlumnos(grupo.nombre);
                    }}
                  >
                    <Users size={14} />
                    Ver Alumnos
                  </button>
                  <button 
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded transition-colors text-sm flex items-center justify-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirModalEdicion(grupo);
                    }}
                  >
                    <Edit2 size={14} />
                    Editar
                  </button>
                </div>
                
                {/* Botón eliminar */}
                <div className="mt-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      eliminarGrupo(grupo.id);
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors text-xs"
                    title="Eliminar grupo"
                  >
                    Eliminar grupo
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Botón para agregar nuevo grupo */}
        <div className="mt-8 flex justify-end">
          <button 
            onClick={agregarNuevoGrupo}
            className="bg-main-800 hover:bg-main-900 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <Plus size={20} />
            Agregar Nuevo Grupo
          </button>
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      <Modal
        isOpen={modalAbierto}
        onClose={cerrarModalEdicion}
        title={grupoEditando.id === 0 ? "Nuevo Grupo" : "Editar Grupo"}
        size="md"
      >
        <div className="space-y-4 bg-whiteBg-200 p-2 rounded-xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Grado"
                value={grupoEditando.grado}
                onChange={(e) => setGrupoEditando({...grupoEditando, grado: e.target.value})}
                type="number"
                min="1"
                max="6"
              />
            </div>
            
            <div>
              <Input
                label="Letra del Grupo"
                value={grupoEditando.nombre}
                onChange={(e) => setGrupoEditando({...grupoEditando, nombre: e.target.value.toUpperCase()})}
                placeholder="Ej: A, B, C"
                maxLength={1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Número de Alumnos"
                value={grupoEditando.alumnos.toString()}
                onChange={(e) => setGrupoEditando({...grupoEditando, alumnos: parseInt(e.target.value) || 0})}
                type="number"
                min="0"
                max="40"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">
                Turno
              </label>
              <select
                value={grupoEditando.turno}
                onChange={(e) => setGrupoEditando({...grupoEditando, turno: e.target.value})}
                className="w-full py-2.5 px-4 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:border-main-600 focus:ring-1 focus:ring-main-600 transition duration-150"
              >
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
              </select>
            </div>
          </div>

          <div className="bg-whiteBg-100 p-3 rounded-lg border border-grayDark-400 hover:bg-whiteBg-50">
            <p className="text-sm text-main-800">
              <strong>Nombre completo del grupo:</strong> GRUPO {grupoEditando.grado}{grupoEditando.nombre}
            </p>
            <p className="text-xs text-main-600 mt-1">
              {grupoEditando.alumnos} alumnos • {grupoEditando.turno}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={cerrarModalEdicion}
              className="flex items-center gap-2"
            >
              <X size={18} />
              Cancelar
            </Button>
            
            <Button
              variant="gradient"
              onClick={guardarCambiosGrupo}
              className="flex items-center gap-2"
              disabled={!camposCompletos()}
            >
              <Save size={18} />
              {grupoEditando.id === 0 ? "Crear Grupo" : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};