//src/pages/alumno/AlumnoHistorialAcademicoPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'; // Importado
import { Download } from 'lucide-react';
import { getHistorialAcademico } from '../../services/alumno.service'; // Importado
import type { HistorialAcademico, CalificacionHistorial } from '../../types/models'; // Importado
import { useAuth } from '../../hooks/useAuth'; // Importado para obtener el user.id
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';
/**
 * Página: AlumnoHistorialAcademicoPage
 * Descripción: Muestra el resumen académico (promedio, materias) y permite descargar documentos.
 */
export const AlumnoHistorialAcademicoPage: React.FC = () => {
    const { user } = useAuth(); 
    const [historial, setHistorial] = useState<HistorialAcademico | null>(null);
    const [loading, setLoading] = useState(true);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('');

    // 1. Efecto para cargar los datos al montar el componente
    useEffect(() => {
        const fetchHistorial = async () => {
            // Utilizamos el ID de usuario, aunque el mock devuelva datos fijos
            if (!user) return; 
            try {
                const data = await getHistorialAcademico(user.id);
                setHistorial(data);
            } catch (error) {
                console.error("Error al cargar historial académico:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistorial();
    }, [user]);

    // 2. Cálculo de la lista única de períodos (optimizado con useMemo)
    const periodos = useMemo(() => {
        if (!historial) return [];
        const uniquePeriods = new Set(historial.calificacionesDetalle.map(c => c.periodo));
        // Muestra los más recientes primero
        return Array.from(uniquePeriods).sort().reverse(); 
    }, [historial]);

    // 3. Filtrado de calificaciones basado en el período seleccionado (optimizado con useMemo)
    const calificacionesFiltradas: CalificacionHistorial[] = useMemo(() => {
        if (!historial) return [];
        if (!periodoSeleccionado) return historial.calificacionesDetalle;

        return historial.calificacionesDetalle.filter(c => c.periodo === periodoSeleccionado);
    }, [historial, periodoSeleccionado]);


    // Manejo de la carga
    if (loading) {
        return (
            <div className="flex justify-center items-center h-[500px]">
                <LoadingSpinner text="Cargando historial académico..." />
            </div>
        );
    }
    
    // Manejo de errores o datos no encontrados
    if (!historial) {
        return (
             <div className="p-8">
                <h1 className="text-4xl font-[Kaushan Script] text-gray-800 mb-6">Historial Académico</h1>
                <p className="text-red-500">No hay datos de historial disponibles para el alumno.</p>
            </div>
        );
    }


    return (
        <div className="p-8 bg-white min-h-full">
            
            {/* Título Principal */}
            <header className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-6">
                <h1 className="text-4xl font-[Kaushan Script] text-gray-800">
                    Historial Académico
                </h1>
                <UserHeaderIcons />
                
            </header>

            {/* Sección Superior: Estadísticas (Usa datos del servicio) */}
            <section className="flex flex-wrap gap-8 mb-8 justify-start">
                <Card className="p-6 text-center shadow-xl w-60">
                    <p className="text-lg text-gray-500">Promedio General</p>
                    <h2 className="text-5xl font-extrabold text-blue-600 mt-2">
                        {historial.promedioGeneral.toFixed(1)}
                    </h2>
                </Card>
                
                <Card className="p-6 text-center shadow-xl w-60">
                    <p className="text-lg text-gray-500">Asignaturas Aprobadas</p>
                    <h2 className="text-5xl font-extrabold text-gray-800 mt-2">
                        {historial.asignaturasAprobadas}
                    </h2>
                </Card>
            </section>

            {/* Selector de Período */}
            <div className="mb-6 w-56">
                <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={periodoSeleccionado}
                    onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                >
                    <option value="">Mostrar todos los períodos</option>
                    {periodos.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            {/* Sección Principal: Calificaciones y Documentos */}
            <section className="flex flex-wrap gap-8">
                
                {/* Sub-sección 1: Calificaciones por Asignatura (Usa datos filtrados) */}
                <Card className="p-6 shadow-lg flex-1 min-w-[300px] max-w-lg">
                    <div className="grid grid-cols-3 font-bold border-b pb-2 mb-3 text-gray-700">
                        <span>Asignatura</span>
                        <span className="text-center">Período</span>
                        <span className="text-right">Promedio</span>
                    </div>

                    <div className="space-y-3">
                        {calificacionesFiltradas.length > 0 ? (
                             calificacionesFiltradas.map((item, index) => (
                                <div key={index} className="grid grid-cols-3 py-2 border-b border-gray-100 last:border-b-0">
                                    <span className="text-gray-600">{item.asignatura}</span>
                                    <span className="text-center text-gray-500 text-sm">{item.periodo}</span>
                                    <span className={`text-right font-semibold ${item.promedio < 8.0 ? 'text-red-500' : 'text-green-600'}`}>
                                        {item.promedio.toFixed(1)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-4">No hay calificaciones para este período.</p>
                        )}
                    </div>
                </Card>

                {/* Sub-sección 2: Documentos (Usa datos del servicio) */}
                <div className="flex flex-col space-y-4 flex-1 min-w-[200px] max-w-sm">
                    <h2 className="text-2xl font-semibold text-gray-800">Documentos</h2>
                    
                    {historial.documentosDisponibles.map((doc, index) => (
                        <Button 
                            key={index}
                            variant="secondary" 
                            className="bg-gray-200 text-gray-700 hover:bg-gray-300 py-3 shadow-md"
                            onClick={() => {
                                // En una app real, aquí iría una función de descarga o un link directo
                                window.open(doc.url, '_blank'); 
                                alert(`Simulando descarga de: ${doc.nombre}`);
                            }} 
                        >
                            {doc.nombre} <Download size={20} className="ml-2" />
                        </Button>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AlumnoHistorialAcademicoPage;