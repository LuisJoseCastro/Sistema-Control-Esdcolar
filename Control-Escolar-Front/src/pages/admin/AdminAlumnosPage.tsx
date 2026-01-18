import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'; 
import { Edit2, Save, X, Users, Clock, Plus } from 'lucide-react';
import { adminService } from '../../services/admin.service'; 

// Interfaz para el tipo de dato que viene del backend
interface Grupo {
  id: number | string;
  nombre: string;
  alumnos: number;
  grado: string;
  turno: string;
}

export const AdminAlumnosPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar grupos reales al iniciar
  useEffect(() => {
    cargarGrupos();
  }, []);

  const cargarGrupos = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getGrupos();
      
      // MAPEO CORREGIDO: 
      // Vinculamos 'totalAlumnos' del backend con la propiedad 'alumnos' de tu diseño
      const gruposMapeados = data.map((g: any) => ({
        ...g,
        id: g.id,
        nombre: g.nombre,
        alumnos: g.totalAlumnos ?? 0, // 👈 Aquí se recibe el conteo real del Backend
        grado: g.semestre?.toString() || '1',
        turno: g.turno || 'Matutino'
      }));
      setGrupos(gruposMapeados);
    } catch (error) {
      console.error("Error al cargar grupos", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [modalAbierto, setModalAbierto] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  
  const [grupoEditando, setGrupoEditando] = useState({
    id: 0 as number | string,
    nombre: '',
    alumnos: 0,
    grado: '',
    turno: 'Matutino'
  });

  const handleVerAlumnos = (grupoNombre: string) => {
    const grupoId = grupoNombre.replace('GRUPO ', '').trim();
    navigate(`/admin/alumnos/${grupoId}`);
  };

  const abrirModalEdicion = (grupo: Grupo) => {
    // Intentamos extraer la letra del grupo
    let letraGrupo = grupo.nombre.replace('GRUPO', '').replace(grupo.grado, '').trim();
    
    setGrupoEditando({
      id: grupo.id,
      nombre: letraGrupo, 
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

  const guardarCambiosGrupo = async () => {
    setIsSaving(true);
    try {
        const nombreCompleto = `GRUPO ${grupoEditando.grado}${grupoEditando.nombre.toUpperCase()}`;
        
        const datosParaEnviar = {
            nombre: nombreCompleto,
            semestre: Number(grupoEditando.grado), // IMPORTANTE: Enviamos número al backend
            turno: grupoEditando.turno,
        };

        if (grupoEditando.id === 0) {
            await adminService.crearGrupo(datosParaEnviar);
        } else {
            await adminService.actualizarGrupo(grupoEditando.id, datosParaEnviar);
        }
        
        await cargarGrupos();
        cerrarModalEdicion();
    } catch (error) {
        console.error("Error guardando grupo", error);
        alert("Hubo un error al guardar el grupo.");
    } finally {
        setIsSaving(false);
    }
  };

  const eliminarGrupo = async (id: number | string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este grupo?')) {
      try {
          await adminService.eliminarGrupo(id);
          setGrupos(grupos.filter(grupo => grupo.id !== id));
      } catch (error) {
          console.error("Error eliminando", error);
          alert("No se pudo eliminar el grupo.");
      }
    }
  };

  const agregarNuevoGrupo = () => {
    setGrupoEditando({
      id: 0, 
      nombre: '', 
      alumnos: 0,
      grado: '1',
      turno: 'Matutino'
    });
    setModalAbierto(true);
  };

  const camposCompletos = () => {
    return grupoEditando.grado.toString().trim() !== '' && 
           grupoEditando.nombre.trim() !== '';
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <LoadingSpinner className="w-12 h-12 text-teal-600" />
        </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <header className="flex justify-between items-end border-b-2 border-gray-400 pb-4 mb-8">
        <h1 className="text-5xl text-black font-['Kaushan_Script']">
          Grupos de Alumnos
        </h1>
        <div className="text-sm text-gray-600">
          Total: {grupos.length} grupos • {grupos.reduce((sum, grupo) => sum + grupo.alumnos, 0)} alumnos
        </div>
      </header>

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
                  {/* Visualización limpia del número grande */}
                  {grupo.nombre.replace('GRUPO', '').trim()}
                </div>
              </div>
              
              <div className="p-4">
                {/* Título limpio: "1C" en lugar de "GRUPO 1C" */}
                <h3 className="text-xl font-bold text-[#2E4156] mb-2">
                  {grupo.nombre.replace('GRUPO', '').replace('Grupo', '').trim()}
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
                    grupo.alumnos > 25 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {grupo.alumnos > 25 ? 'Lleno' : 'Disponible'}
                  </span>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button 
                    className="flex-1 bg-main-700 hover:bg-main-900 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); handleVerAlumnos(grupo.nombre); }}
                  >
                    <Users size={14} /> Ver Alumnos
                  </button>
                  <button 
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded text-sm flex items-center justify-center gap-1"
                    onClick={(e) => { e.stopPropagation(); abrirModalEdicion(grupo); }}
                  >
                    <Edit2 size={14} /> Editar
                  </button>
                </div>
                
                <div className="mt-3 text-center">
                  <button onClick={(e) => { e.stopPropagation(); eliminarGrupo(grupo.id); }} className="text-red-500 hover:text-red-700 text-xs">
                    Eliminar grupo
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button onClick={agregarNuevoGrupo} className="bg-main-800 hover:bg-main-900 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md flex items-center gap-2 cursor-pointer">
            <Plus size={20} /> Agregar Nuevo Grupo
          </button>
        </div>
      </div>

      {/* MODAL RESTAURADO CON EL DISEÑO COMPLETO */}
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
              {/* Input de alumnos deshabilitado (Diseño original) */}
              <Input
                label="Número de Alumnos"
                value={grupoEditando.alumnos.toString()}
                onChange={(_) => {/* No hacemos nada */}}
                type="number"
                disabled={true} 
              />
            </div>
            
            <div>
              {/* Select de Turno (Restaurado) */}
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

          {/* Caja de previsualización (Restaurada) */}
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
              disabled={!camposCompletos() || isSaving}
            >
              <Save size={18} />
              {isSaving ? "Guardando..." : (grupoEditando.id === 0 ? "Crear Grupo" : "Guardar Cambios")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};