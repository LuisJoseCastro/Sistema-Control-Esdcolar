import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserHeaderIcons } from "../../components/layout/UserHeaderIcons";
import { ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

// 🛑 UI UNIFICADA
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// Hooks y Servicios
import { useAuth } from "../../hooks/useAuth";
import { getAsistenciaData } from "../../services/alumno.service";
import type { AsistenciaData } from "../../services/alumno.service";

export const AlumnoAsistenciaPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // --- ESTADOS ---
    const [data, setData] = useState<AsistenciaData | null>(null);
    const [loading, setLoading] = useState(true);

    // --- CARGA DE DATOS ---
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
    }, [user?.id]);

    // Estilo base para los recordatorios
    const reminderCardStyle = "rounded-full py-4 px-8 flex items-center gap-6 shadow-sm w-full bg-grayDark-100";

    // Función auxiliar para el calendario
    const getEventoDia = (day: number) => {
        if (!data) return null;
        return data.fechas.find(f => parseInt(f.fecha.split('-')[2]) === day);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-whiteBg-50">
                <LoadingSpinner text="Cargando calendario y recordatorios..." />
            </div>
        );
    }

    const stats = data?.estadisticas || { asistencia: 0, faltas: 0, retardos: 0 };
    const reminders = data?.recordatorios || [];

    // Componente para las tarjetas de estadísticas (KPIs)
    const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
        <Card 
            className="w-56 h-40 flex flex-col items-center justify-center transition-transform hover:scale-105 !bg-grayLight-200 rounded-2xl shadow-md"
            variant="default"
        >
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            <p className="text-5xl font-extrabold text-gray-900 mt-2">{value}</p>
        </Card>
    );

    return (
        <div className="p-8 bg-whiteBg-50 min-h-full font-sans">
            
            {/* 1. HEADER */}
            <header className="flex justify-between items-end border-b-2 border-grayDark-400 pb-2 mb-8">
                <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
                    Mi Asistencia
                </h1>
                <div className="mb-2">
                    <UserHeaderIcons />
                </div>
            </header>

            <div className="max-w-7xl mx-auto">
                
                {/* 2. SECCIÓN SUPERIOR: CALENDARIO Y ESTADÍSTICAS */}
                <div className="flex flex-col xl:flex-row gap-16 items-start mb-16">
                    
                    {/* CALENDARIO (Corrección de Keys aplicada) */}
                    <Card className="p-8 rounded-[2.5rem] shadow-sm w-full lg:w-[450px] shrink-0 !bg-grayDark-100 border-grayDark-200" variant="default">
                        <div className="mb-6 px-2">
                            <h2 className="text-3xl font-bold text-gray-800">Mon, Aug 17</h2>
                            <div className="flex items-center justify-between text-sm text-gray-500 font-medium mt-2">
                                <span>August 2025</span>
                                <div className="flex gap-3">
                                    <ChevronLeft size={20} className="cursor-pointer hover:text-black"/>
                                    <ChevronRight size={20} className="cursor-pointer hover:text-black"/>
                                </div>
                            </div>
                        </div>

                        {/* Letras de días sin duplicados de KEY (D, M, T, W, J, F, S) */}
                        <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 mb-4 uppercase tracking-wide">
                            {["D", "M", "T", "W", "J", "F", "S"].map(d => <div key={d}>{d}</div>)}
                        </div>
                        
                        <div className="grid grid-cols-7 text-center text-sm gap-y-3">
                            {[...Array(31)].map((_, i) => {
                                const day = i + 1;
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
                    </Card>

                    {/* TARJETAS KPI */}
                    <div className="flex-1 w-full flex flex-col items-center xl:items-start gap-8 pt-4">
                        <div className="flex flex-wrap justify-center xl:justify-start gap-8 w-full">
                            <StatCard title="Asistencia" value={`${stats.asistencia}%`} />
                            <StatCard title="Faltas" value={stats.faltas}/>
                        </div>
                        <div className="flex justify-center xl:justify-start w-full xl:pl-32"> 
                            <StatCard title="Retardos" value={stats.retardos} />
                        </div>
                    </div>
                </div>

                {/* 3. SECCIÓN INFERIOR: RECORDATORIOS (Corregida para objetos) */}
                <div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-6">Recordatorios</h3>
                    
                    <div className="flex flex-col xl:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-5 w-full">
                            {reminders.length > 0 ? (
                                reminders.map((rem, idx) => (
                                    <Card 
                                        key={rem.id || idx} 
                                        variant="flat" 
                                        className={`${reminderCardStyle} border-gray-300`}
                                    >
                                        <Bell size={28} className="text-gray-500 shrink-0" />
                                        <div className="flex-1 text-gray-700 text-base md:text-lg font-semibold truncate">
                                            {/* 🛑 SOLUCIÓN AL ERROR: Accedemos a .mensaje en lugar de pintar el objeto entero */}
                                            {rem.mensaje}
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-gray-400 italic">No hay recordatorios pendientes.</p>
                            )}
                        </div>

                        <Button
                            onClick={() => navigate("/alumno/asistencia/detalles")}
                            variant="primary"
                            className="!bg-grayDark-400 hover:!bg-gray-700 text-white font-bold py-4 px-10 rounded-2xl shadow-md transition-all text-lg mb-2 shrink-0 h-16"
                        >
                            Detalles de Asistencia
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};