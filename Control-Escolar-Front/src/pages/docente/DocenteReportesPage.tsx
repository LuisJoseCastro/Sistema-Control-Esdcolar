import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { FileText, Download, Users, User } from 'lucide-react'; 

// --- CONSTANTE ID (REEMPLAZAR CON ID REAL DE LA BD) ---
const TEACHER_ID = "550e8400-e29b-41d4-a716-446655440000";

// --- DEFINICIÓN DE INTERFACES ---
interface RendimientoMateria {
    materia: string;
    promedio: number;
}

interface ReporteSummary {
    promedioFinalGrupo: number;
    asistenciaPromedio: number;
    tasaAprobacion: number;
    rendimientoMateria: RendimientoMateria[];
    totalEstudiantes: number;
    estudiantesBajoRendimiento: number;
    materiasImpartidas: number;
    gruposAsignados: number;
    estudiantesAsistenciaCritica: number;
}

// --- DATOS MOCK DE RESPALDO (Para evitar pantalla de error) ---
const MOCK_DATA: ReporteSummary = {
    promedioFinalGrupo: 0,
    asistenciaPromedio: 0,
    tasaAprobacion: 0,
    rendimientoMateria: [],
    totalEstudiantes: 0,
    estudiantesBajoRendimiento: 0,
    materiasImpartidas: 0,
    gruposAsignados: 0,
    estudiantesAsistenciaCritica: 0
};

// --- COMPONENTES DE APOYO (GRÁFICOS) ---
const BarChartDynamic: React.FC<{ data: RendimientoMateria[] }> = ({ data }) => {
    // Si no hay datos, mostramos vacío seguro
    if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-gray-400">Sin datos registrados</div>;

    const totalPromedio = data.reduce((sum, item) => sum + item.promedio, 0);
    const average = data.length > 0 ? totalPromedio / data.length : 0;
    
    return (
        <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100 h-64">
            <div className="mb-4">
                 <p className="text-2xl font-bold inline">{average.toFixed(1)}</p>
                 <span className="text-green-500 ml-2 text-sm">↑ Promedio Gral</span>
            </div>
            <p className="text-sm font-medium mb-2">Rendimiento por Materia</p>
            <div className="flex items-end h-32 border-b border-gray-300 pt-2 space-x-2 overflow-x-auto">
                {data.map((item, index) => (
                     <div key={index} className="w-1/4 min-w-[50px] flex flex-col items-center mx-1 group relative">
                        <div 
                            style={{ height: `${(item.promedio) * 10}px`, minHeight: '20px' }} 
                            className="bg-blue-500 w-10 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                            title={`${item.materia}: ${item.promedio}`}
                        ></div>
                        <p className="text-[10px] mt-1 truncate w-full text-center">{item.materia ? item.materia.substring(0, 10) : 'N/A'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LineChartPlaceholder: React.FC = () => (
    <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100 h-64">
        <div className="mb-4">
             <p className="text-2xl font-bold inline">-- %</p>
             <span className="text-gray-400 ml-2 text-sm">Sin historial</span>
        </div>
        <p className="text-sm font-medium mb-2">Progreso de Asistencia</p>
        <div className="h-36 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-xs text-gray-400">Gráfico disponible con más datos</p>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL ---
const DocenteReportesPage: React.FC = () => {
    const [summary, setSummary] = useState<ReporteSummary | null>(null); 
    const [loading, setLoading] = useState(true);
    const [openSelectorModal, setOpenSelectorModal] = useState(false);
    const [, setReportType] = useState<'grupo' | 'alumno' | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                // INTENTO 1: FETCH REAL A LA API
                const response = await fetch(`http://localhost:3000/academic/stats/${TEACHER_ID}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setSummary(data);
                } else {
                    // Si falla la API (404, 500), usamos datos vacíos seguros
                    console.warn("API falló, cargando datos vacíos seguros.");
                    setSummary(MOCK_DATA);
                }
            } catch (error) {
                console.error("Error de conexión (servidor apagado?), cargando respaldo:", error);
                setSummary(MOCK_DATA);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Calculando estadísticas...</div>;
    
    // Si summary es null (caso extremo), usamos MOCK_DATA
    const safeSummary = summary || MOCK_DATA;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-4xl font-serif italic text-gray-800 mb-2">Reportes</h1>
            <p className="text-gray-600 text-sm mb-8">Resumen del Rendimiento Académico</p>

            {/* HEADER CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="bg-slate-800 text-white p-6"> 
                    <p className="text-sm opacity-80">Promedio Final Grupo</p>
                    <p className="text-4xl font-bold">{safeSummary.promedioFinalGrupo?.toFixed(1) || "0.0"}</p> 
                </Card>
                <Card className="bg-slate-800 text-white p-6">
                    <p className="text-sm opacity-80">Asistencia Promedio</p>
                    <p className="text-4xl font-bold">{safeSummary.asistenciaPromedio || 0}%</p> 
                </Card>
                <Card className="bg-slate-800 text-white p-6">
                    <p className="text-sm opacity-80">Tasa Aprobación</p>
                    <p className="text-4xl font-bold">{safeSummary.tasaAprobacion?.toFixed(0) || 0}%</p>
                </Card>
            </div>
            
            {/* GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <BarChartDynamic data={safeSummary.rendimientoMateria || []} /> 
                <LineChartPlaceholder /> 
            </div>

            {/* MÉTRICAS CLAVE */}
            <h2 className="text-xl font-bold text-gray-700 mb-4">Métricas Clave</h2>
            <Card className="p-6 bg-white mb-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <p className="text-3xl font-bold text-gray-800">{safeSummary.totalEstudiantes || 0}</p>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Total Estudiantes</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-red-500">{safeSummary.estudiantesBajoRendimiento || 0}</p>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Bajo Rendimiento</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-800">{safeSummary.materiasImpartidas || 0}</p>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Materias</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-800">{safeSummary.gruposAsignados || 0}</p>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Grupos</p>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t flex justify-around">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{safeSummary.estudiantesAsistenciaCritica || 0}</p>
                        <p className="text-sm text-gray-600">Asistencia Crítica</p>
                    </div>
                </div>
            </Card>

            {/* ACCIONES */}
            <div className="flex gap-4">
                <Button variant="secondary" onClick={() => setOpenSelectorModal(true)}>
                    <FileText className="mr-2 w-5 h-5" /> Generar Reporte
                </Button>
                <Button variant="primary" onClick={() => setOpenSelectorModal(true)}>
                    <Download className="mr-2 w-5 h-5" /> Exportar Datos
                </Button>
            </div>

            {/* MODAL SELECCIÓN */}
            <Modal isOpen={openSelectorModal} onClose={() => setOpenSelectorModal(false)} title="Exportar Reportes">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <button 
                        onClick={() => { setReportType('grupo'); setOpenSelectorModal(false); }}
                        className="p-6 bg-gray-100 rounded-2xl hover:bg-gray-200 flex flex-col items-center"
                    >
                        <Users size={40} className="mb-2 text-blue-600" />
                        <span className="font-bold">Reporte por Grupo</span>
                    </button>
                    <button 
                        onClick={() => { setReportType('alumno'); setOpenSelectorModal(false); }}
                        className="p-6 bg-gray-100 rounded-2xl hover:bg-gray-200 flex flex-col items-center"
                    >
                        <User size={40} className="mb-2 text-purple-600" />
                        <span className="font-bold">Reporte por Alumno</span>
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default DocenteReportesPage;