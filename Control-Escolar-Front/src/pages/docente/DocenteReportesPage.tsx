// src/pages/docente/DocenteReportesPage.tsx
import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { FileText, Download, Users, User } from 'lucide-react'; 

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

// Mock del servicio corregido para evitar advertencias de "id no utilizado"
const getReporteSummaryMock = async (): Promise<ReporteSummary> => {
    return {
        promedioFinalGrupo: 8.5,
        asistenciaPromedio: 92,
        tasaAprobacion: 88,
        rendimientoMateria: [
            { materia: "Matemáticas", promedio: 8.2 },
            { materia: "Historia", promedio: 9.0 },
            { materia: "Ciencias", promedio: 7.8 }
        ],
        totalEstudiantes: 50,
        estudiantesBajoRendimiento: 5,
        materiasImpartidas: 3,
        gruposAsignados: 2,
        estudiantesAsistenciaCritica: 3
    };
};

// --- COMPONENTES DE APOYO (GRÁFICOS) ---
const BarChartDynamic: React.FC<{ data: RendimientoMateria[] }> = ({ data }) => {
    const totalPromedio = data.reduce((sum, item) => sum + item.promedio, 0);
    const average = data.length > 0 ? totalPromedio / data.length : 0;
    
    return (
        <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100 h-64">
            <div className="mb-4">
                 <p className="text-2xl font-bold inline">{average.toFixed(1)}</p>
                 <span className="text-green-500 ml-2 text-sm">↑ +2%</span>
            </div>
            <p className="text-sm font-medium mb-2">Rendimiento por Materia</p>
            <div className="flex items-end h-32 border-b border-gray-300 pt-2">
                {data.map((item, index) => (
                     <div key={index} className="w-1/4 flex flex-col items-center mx-1">
                        <div 
                            style={{ height: `${(item.promedio) * 10}px`, minHeight: '20px' }} 
                            className="bg-blue-500 w-10 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                        ></div>
                        <p className="text-[10px] mt-1 truncate w-full text-center">{item.materia}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LineChartPlaceholder: React.FC = () => (
    <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100 h-64">
        <div className="mb-4">
             <p className="text-2xl font-bold inline">90%</p>
             <span className="text-red-500 ml-2 text-sm">↓ -1%</span>
        </div>
        <p className="text-sm font-medium mb-2">Progreso de Asistencia</p>
        <div className="h-36 relative">
            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <polyline 
                    fill="none" 
                    stroke="rgb(66, 153, 225)"
                    strokeWidth="2" 
                    points="0,35 25,20 50,30 75,15 100,5" 
                />
            </svg>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL ---
const DocenteReportesPage: React.FC = () => {
    const [summary, setSummary] = useState<ReporteSummary | null>(null); 
    const [loading, setLoading] = useState(true);
    const [openSelectorModal, setOpenSelectorModal] = useState(false);
    // Se mantienen aunque no se usen en el render básico para no romper tu lógica futura de exportación
    const [, setReportType] = useState<'grupo' | 'alumno' | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await getReporteSummaryMock();
                setSummary(data);
            } catch (error) {
                console.error("Error al cargar el resumen del reporte:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando reporte...</div>;
    if (!summary) return <div className="p-8 text-center text-red-500">Error al cargar datos.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-4xl font-serif italic text-gray-800 mb-2">Reportes</h1>
            <p className="text-gray-600 text-sm mb-8">Resumen del Rendimiento Académico</p>

            {/* HEADER CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="bg-slate-800 text-white p-6"> 
                    <p className="text-sm opacity-80">Promedio Final Grupo</p>
                    <p className="text-4xl font-bold">{summary.promedioFinalGrupo.toFixed(1)}</p> 
                </Card>
                <Card className="bg-slate-800 text-white p-6">
                    <p className="text-sm opacity-80">Asistencia Promedio</p>
                    <p className="text-4xl font-bold">{summary.asistenciaPromedio}%</p> 
                </Card>
                <Card className="bg-slate-800 text-white p-6">
                    <p className="text-sm opacity-80">Tasa Aprobación</p>
                    <p className="text-4xl font-bold">{summary.tasaAprobacion}%</p>
                </Card>
            </div>
            
            {/* GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <BarChartDynamic data={summary.rendimientoMateria} /> 
                <LineChartPlaceholder /> 
            </div>

            {/* MÉTRICAS CLAVE */}
            <h2 className="text-xl font-bold text-gray-700 mb-4">Métricas Clave</h2>
            <Card className="p-6 bg-white mb-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <p className="text-3xl font-bold text-gray-800">{summary.totalEstudiantes}</p>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Total Estudiantes</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-red-500">{summary.estudiantesBajoRendimiento}</p>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Bajo Rendimiento</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-800">{summary.materiasImpartidas}</p>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Materias</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-800">{summary.gruposAsignados}</p>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Grupos</p>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t flex justify-around">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{summary.estudiantesAsistenciaCritica}</p>
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