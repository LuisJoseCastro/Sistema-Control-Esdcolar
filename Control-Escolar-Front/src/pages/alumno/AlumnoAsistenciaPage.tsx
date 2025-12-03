// src/pages/alumno/AlumnoAsistenciaPage.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserHeaderIcons } from "../../components/layout/UserHeaderIcons";
import { ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

// Hooks y Servicios
import { useAuth } from "../../hooks/useAuth";
import { getAsistenciaData } from "../../services/alumno.service";
import type { AsistenciaData } from "../../services/alumno.service";

export const AlumnoAsistenciaPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados
  const [data, setData] = useState<AsistenciaData | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const result = await getAsistenciaData(user.id);
        setData(result);
      } catch (error) {
        console.error("Error al cargar asistencia:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Estilo común para las tarjetas de estadísticas
  const statCardStyle = "bg-[#f4f6f8] w-56 h-40 rounded-2xl shadow-md flex flex-col items-center justify-center transition-transform hover:scale-105";

  // Función auxiliar para saber si un día específico (1, 2... 31) tiene evento
  const getEventoDia = (day: number) => {
    if (!data) return null;
    // Buscamos en la lista de fechas si alguna coincide con el día actual del loop
    // NOTA: Asumimos formato YYYY-MM-DD y comparamos solo el día para este demo visual
    return data.fechas.find(f => parseInt(f.fecha.split('-')[2]) === day);
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen bg-white">
            <LoadingSpinner text="Cargando calendario..." />
        </div>
    );
  }

  // Si no hay datos (error o vacío), mostramos algo por defecto para no romper la UI
  const stats = data?.estadisticas || { asistencia: 0, faltas: 0, retardos: 0 };
  const reminders = data?.recordatorios || [];

  return (
    <div className="p-8 bg-white min-h-full font-sans">
      
      {/* HEADER */}
      <header className="flex justify-between items-end border-b-2 border-gray-400 pb-2 mb-8">
        <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
          Mi Asistencia
        </h1>
        <div className="mb-2">
           <UserHeaderIcons />
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        
        {/* SECCIÓN SUPERIOR: CALENDARIO Y ESTADÍSTICAS */}
        <div className="flex flex-col xl:flex-row gap-16 items-start mb-16">
            
            {/* 1. CALENDARIO (Izquierda) */}
            <div className="bg-[#f4f6f8] p-8 rounded-[2.5rem] shadow-sm w-full lg:w-[450px] shrink-0">
                
                {/* Cabecera del Calendario */}
                <div className="mb-6 px-2">
                    {/* Nota: Fecha estática por el diseño del mock, podrías hacerla dinámica luego */}
                    <h2 className="text-3xl font-bold text-gray-800">Mon, Aug 17</h2>
                    <div className="flex items-center justify-between text-sm text-gray-500 font-medium mt-2">
                        <span>August 2025</span>
                        <div className="flex gap-3">
                            <ChevronLeft size={20} className="cursor-pointer hover:text-black"/>
                            <ChevronRight size={20} className="cursor-pointer hover:text-black"/>
                        </div>
                    </div>
                </div>

                {/* Grid Días (Encabezados) */}
                <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 mb-4 uppercase tracking-wide">
                    {["S","M","T","W","T","F","S"].map(d => <div key={d}>{d}</div>)}
                </div>
                
                {/* Grid Días (Números) */}
                <div className="grid grid-cols-7 text-center text-sm gap-y-3">
                    {[...Array(31)].map((_, i) => {
                        const day = i + 1;
                        // Buscamos si este día tiene evento en la BD
                        const evento = getEventoDia(day);
                        
                        const isAbsent = evento?.tipo === 'Falta';
                        const isLate = evento?.tipo === 'Retardo';
                        
                        return (
                            <div key={day} className="flex items-center justify-center">
                                <span className={`
                                    flex items-center justify-center h-8 w-8 rounded-full font-semibold transition-all cursor-pointer
                                    ${isAbsent ? 'bg-red-500 text-white shadow-md' : 
                                      isLate ? 'bg-yellow-400 text-white shadow-md' : 
                                      'text-gray-600 hover:bg-white hover:shadow-sm'}
                                `} title={evento?.tipo}>
                                    {day}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* Leyenda */}
                <div className="flex gap-6 mt-8 ml-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm text-gray-600">Faltas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <span className="text-sm text-gray-600">Retardos</span>
                    </div>
                </div>
            </div>

            {/* 2. TARJETAS DE ESTADÍSTICAS (Derecha) */}
            <div className="flex-1 w-full flex flex-col items-center xl:items-start gap-8 pt-4">
                
                {/* Fila Superior */}
                <div className="flex flex-wrap justify-center xl:justify-start gap-8 w-full">
                    {/* Tarjeta Asistencia */}
                    <div className={statCardStyle}>
                        <h3 className="text-2xl font-bold text-gray-800">Asistencia</h3>
                        <p className="text-5xl font-extrabold text-gray-900 mt-2">{stats.asistencia}%</p>
                    </div>

                    {/* Tarjeta Falta */}
                    <div className={statCardStyle}>
                        <h3 className="text-2xl font-bold text-gray-800">Faltas</h3>
                        <p className="text-5xl font-extrabold text-gray-900 mt-2">{stats.faltas}</p>
                    </div>
                </div>

                {/* Fila Inferior (Retardos) */}
                <div className="flex justify-center xl:justify-start w-full xl:pl-32"> 
                    <div className={statCardStyle}>
                        <h3 className="text-2xl font-bold text-gray-800">Retardos</h3>
                        <p className="text-5xl font-extrabold text-gray-900 mt-2">{stats.retardos}</p>
                    </div>
                </div>

            </div>
        </div>

        {/* SECCIÓN INFERIOR: RECORDATORIOS Y BOTÓN */}
        <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Recordatorios</h3>
            
            <div className="flex flex-col xl:flex-row gap-12 items-end">
                
                {/* Lista de Recordatorios Dinámica */}
                <div className="flex-1 space-y-5 w-full">
                    {reminders.length > 0 ? (
                        reminders.map((rem, idx) => (
                            <div key={idx} className="bg-[#f4f6f8] rounded-full py-4 px-8 flex items-center gap-6 shadow-sm w-full">
                                <Bell size={28} className="text-gray-500" />
                                <div className="flex-1 flex items-center gap-4 text-gray-500 text-sm md:text-base font-medium overflow-hidden whitespace-nowrap">
                                    <span className="hidden md:inline text-gray-300">--------------------</span>
                                    <span className="truncate">{rem}</span>
                                    <span className="hidden md:inline text-gray-300 w-full">----------------------------------------</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 italic">No hay recordatorios pendientes.</p>
                    )}
                </div>

                {/* Botón Detalles */}
                <button 
                    onClick={() => navigate("/alumno/asistencia/detalles")}
                    className="bg-[#c4c4c4] hover:bg-[#b0b0b0] text-gray-800 font-bold py-4 px-10 rounded-2xl shadow-[0_4px_0px_#9ca3af] active:shadow-none active:translate-y-1 transition-all text-lg mb-2 shrink-0"
                >
                    Detalles de Asistencia
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};