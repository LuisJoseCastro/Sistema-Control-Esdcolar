// src/pages/alumno/AlumnoAsistenciaDetallesPage.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserHeaderIcons } from "../../components/layout/UserHeaderIcons";
import { ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

// Importamos Hooks y Servicio
import { useAuth } from "../../hooks/useAuth";
import { getDetalleAsistencias } from "../../services/alumno.service";
import type { AsistenciaDetalleItem } from "../../services/alumno.service";

export const AlumnoAsistenciaDetallesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados
  const [asistencias, setAsistencias] = useState<AsistenciaDetalleItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos del servicio
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const data = await getDetalleAsistencias(user.id);
        setAsistencias(data);
      } catch (error) {
        console.error("Error cargando detalles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Helper para formato de fecha amigable (Visual)
  const formatDate = (dateString: string) => {
    // Agregamos T00:00:00 para evitar desajustes de zona horaria
    const date = new Date(`${dateString}T00:00:00`);
    // Validamos que sea una fecha válida antes de formatear
    if (isNaN(date.getTime())) return dateString; 
    
    return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Helper para estilos de etiqueta según estado (Visual)
  const getStatusStyles = (estado: string) => {
    if (estado === 'Falta') return "bg-red-100 text-red-700 border border-red-200";
    if (estado === 'Retardo') return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen bg-white">
            <LoadingSpinner text="Cargando detalles..." />
        </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-full font-sans">
      
      {/* ENCABEZADO */}
      <header className="flex justify-between items-end border-b-2 border-gray-400 pb-2 mb-12">
        <div className="flex items-end gap-4">
            <button 
                onClick={() => navigate(-1)}
                className="mb-2 p-2 rounded-full hover:bg-gray-100 transition text-gray-500"
                title="Regresar"
            >
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
                Detalles de asistencia
            </h1>
        </div>
        <div className="mb-2">
           <UserHeaderIcons />
        </div>
      </header>

      {/* CONTENEDOR CENTRAL */}
      <div className="flex justify-center items-start mt-4">
          <div className="w-full max-w-4xl bg-[#f4f6f8] rounded-4xl shadow-[0_15px_35px_rgba(0,0,0,0.1)] p-8 md:p-12 min-h-[500px]">
                
                <div className="overflow-x-auto">
                    {/* ENCABEZADOS DE LISTA */}
                    <div className="grid grid-cols-3 mb-6 px-4 min-w-[600px] text-center">
                        <div className="pb-2 border-b-2 border-gray-300 mx-4">
                            <span className="font-bold text-gray-600 text-lg">Fecha</span>
                        </div>
                        <div className="pb-2 border-b-2 border-gray-300 mx-4">
                            <span className="font-bold text-gray-600 text-lg">Materia</span>
                        </div>
                        <div className="pb-2 border-b-2 border-gray-300 mx-4">
                            <span className="font-bold text-gray-600 text-lg">Estado</span>
                        </div>
                    </div>

                    {/* LISTA DE ASISTENCIAS */}
                    <div className="space-y-2 min-w-[600px]">
                        {asistencias.length > 0 ? (
                            asistencias.map((item, index) => (
                                <div 
                                    key={index} 
                                    className="grid grid-cols-3 text-center items-center group hover:bg-white rounded-xl py-3 px-2 transition-all duration-200 border-b border-gray-200/50 last:border-0 hover:shadow-sm"
                                >
                                    {/* Fecha Formateada */}
                                    <div className="text-base font-medium text-gray-600 capitalize">
                                        {formatDate(item.fecha)}
                                    </div>
                                    
                                    {/* Materia */}
                                    <div className="text-base font-bold text-gray-700">
                                        {item.materia}
                                    </div>

                                    {/* Estado (Etiqueta) */}
                                    <div className="flex justify-center">
                                        <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusStyles(item.estado)}`}>
                                            {item.estado}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-4">No tienes faltas ni retardos registrados.</p>
                        )}
                    </div>
                </div>

                {/* Botón Volver */}
                <div className="mt-10 flex justify-center">
                    <button 
                        onClick={() => navigate("/alumno/asistencia")}
                        className="text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors border-b border-transparent hover:border-gray-400 pb-0.5"
                    >
                        Volver al calendario
                    </button>
                </div>

          </div>
      </div>

    </div>
  );
};