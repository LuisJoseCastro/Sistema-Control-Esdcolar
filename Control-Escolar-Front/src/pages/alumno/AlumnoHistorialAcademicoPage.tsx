//src/pages/alumno/AlumnoHistorialAcademicoPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getHistorialAcademico } from '../../services/alumno.service';
import type { HistorialAcademico } from '../../types/models';

// UI Components
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';
import { Download, ChevronDown } from 'lucide-react';

export const AlumnoHistorialAcademicoPage: React.FC = () => {
    const { user } = useAuth(); 
    const [historial, setHistorial] = useState<HistorialAcademico | null>(null);
    const [loading, setLoading] = useState(true);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('');

    // --- LÓGICA DE DATOS ---
    useEffect(() => {
        const fetchHistorial = async () => {
            if (!user) return; 
            try {
                const data = await getHistorialAcademico(user.id);
                setHistorial(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistorial();
    }, [user]);

    const periodos = useMemo(() => {
        if (!historial) return [];
        const uniquePeriods = new Set(historial.calificacionesDetalle.map(c => c.periodo));
        return Array.from(uniquePeriods).sort().reverse(); 
    }, [historial]);

    const calificacionesFiltradas = useMemo(() => {
        if (!historial) return [];
        if (!periodoSeleccionado) return historial.calificacionesDetalle;
        return historial.calificacionesDetalle.filter(c => c.periodo === periodoSeleccionado);
    }, [historial, periodoSeleccionado]);

    if (loading) return <div className="flex justify-center mt-20"><LoadingSpinner /></div>;
    if (!historial) return <div className="p-8">No hay datos.</div>;

    // --- ESTILOS VISUALES ---
    // Eliminamos 'min-h-[500px]' y dejamos que la altura sea automática
    // Agregamos 'self-start' al contenedor padre en flex para que no se estire innecesariamente si la otra columna es más larga
    const cardStyle = "bg-[#f4f6f8] rounded-[2rem] shadow-[0_15px_35px_rgba(0,0,0,0.1)] p-8 relative overflow-hidden h-fit"; 
    
    // Tarjetas pequeñas superiores
    const statCardStyle = "bg-[#f4f6f8] rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.1)] p-4 w-48 text-center border border-white flex flex-col items-center justify-center h-32";

    return (
        <div className="p-8 bg-white min-h-full font-sans">
            
            {/* 1. ENCABEZADO */}
            <header className="flex justify-between items-end border-b-2 border-gray-400 pb-2 mb-10">
                <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
                    Historial académico
                </h1>
                <div className="mb-2">
                   <UserHeaderIcons />
                </div>
            </header>

            <div className="max-w-6xl mx-auto flex flex-col gap-10">

                {/* 2. ESTADÍSTICAS SUPERIORES (KPIs) */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                    {/* Tarjeta Promedio */}
                    <div className={statCardStyle}>
                        <p className="text-2xl text-gray-800 mb-1" style={{ fontFamily: '"Kaushan Script", cursive' }}>Promedio</p>
                        <p className={`text-5xl font-black ${historial.promedioGeneral >= 8 ? 'text-gray-900' : 'text-red-600'}`}>
                            {historial.promedioGeneral.toFixed(1)}
                        </p>
                    </div>
                    {/* Tarjeta Asignaturas */}
                    <div className={statCardStyle}>
                        <p className="text-xl text-gray-800 mb-2" style={{ fontFamily: '"Kaushan Script", cursive' }}>Asignaturas Aprobadas</p>
                        <p className="text-5xl font-black text-gray-900">{historial.asignaturasAprobadas}</p>
                    </div>
                </div>

                {/* 3. FILTRO DE PERIODO (Centrado) */}
                <div className="flex justify-center">
                    <div className="relative w-64">
                        <select 
                            className="w-full appearance-none bg-white border border-gray-200 text-gray-500 py-2 px-6 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer text-center font-medium"
                            value={periodoSeleccionado}
                            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                        >
                            <option value="">Todos los periodos</option>
                            {periodos.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                            <ChevronDown size={16} />
                        </div>
                    </div>
                </div>

                {/* 4. CONTENIDO PRINCIPAL (Dos columnas visuales) */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
                    
                    {/* COLUMNA IZQ: LISTA DE MATERIAS (Tarjeta Flotante Ajustable) */}
                    {/* Usamos h-fit para que se ajuste al contenido */}
                    <div className={`flex-1 w-full ${cardStyle}`}>
                        {/* Encabezados */}
                        <div className="flex justify-between px-4 mb-6 border-b border-gray-300 pb-2">
                            <span className="text-gray-600 font-bold text-sm uppercase tracking-wide">Asignatura</span>
                            <span className="text-gray-600 font-bold text-sm uppercase tracking-wide">Promedio</span>
                        </div>

                        {/* Lista */}
                        <div className="space-y-4 pb-2">
                            {calificacionesFiltradas.length > 0 ? (
                                calificacionesFiltradas.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center px-4 group hover:bg-white/50 rounded-lg py-2 transition-colors">
                                        <span className="text-gray-800 font-medium text-base">{item.asignatura}</span>
                                        
                                        {/* Línea decorativa punteada */}
                                        <div className="flex-1 border-b-2 border-gray-300 border-dotted mx-6 h-1 relative top-1 opacity-40"></div>
                                        
                                        {/* Promedio con lógica de color */}
                                        <span className={`text-lg font-bold ${item.promedio < 8.0 ? 'text-red-500' : 'text-gray-700'}`}>
                                            {item.promedio.toFixed(1)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 font-medium">No hay calificaciones para este periodo.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLUMNA DER: DOCUMENTOS (Minimalista) */}
                    <div className="lg:w-64 flex flex-col items-center pt-4 shrink-0 w-full">
                        <h3 className="text-2xl font-bold text-gray-800 mb-8">Documentos</h3>
                        
                        <div className="space-y-8 w-full flex flex-col items-center">
                            {historial.documentosDisponibles.map((doc, index) => (
                                <div key={index} className="flex flex-col items-center gap-2 w-full">
                                    <span className="text-gray-600 font-medium text-lg text-center leading-tight">{doc.nombre}</span>
                                    <button 
                                        onClick={() => alert(`Descargando: ${doc.nombre}`)}
                                        className="bg-[#c4c4c4] hover:bg-[#a8a8a8] text-gray-700 w-32 h-10 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 border border-transparent hover:border-gray-400 mt-2"
                                        title={`Descargar ${doc.nombre}`}
                                    >
                                        <Download size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};