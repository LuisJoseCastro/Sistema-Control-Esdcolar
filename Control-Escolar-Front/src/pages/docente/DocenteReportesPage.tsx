// src/pages/docente/DocenteReportesPage.tsx (Ruta Asumida)

import React, { useState, useEffect } from 'react';
// ----------------------------------------------------
// 🚨 Reutilizando tus Componentes de UI 🚨
// ----------------------------------------------------
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
// ----------------------------------------------------
// Reutilizando iconos de Lucide (Asegúrate de tenerlos instalados)
import { FileText, Download, Users, User, ArrowRight } from 'lucide-react'; 

// ----------------------------------------------------
// 🚨 Importando Servicio y Tipos Corregidos 🚨
// Usamos '../../' si estás en src/pages/docente/
import { getReporteSummary } from '../../services/docente.service';
import type { ReporteSummary, RendimientoMateria } from '../../types/models'; 
// ----------------------------------------------------


// =================================================================================
// GRÁFICOS DINÁMICOS Y PLACEHOLDERS (Reimplementados para usar los datos)
// =================================================================================

const BarChartDynamic: React.FC<{ data: RendimientoMateria[] }> = ({ data }) => {
    const totalPromedio = data.reduce((sum, item) => sum + item.promedio, 0);
    const average = data.length > 0 ? totalPromedio / data.length : 0;
    const formattedAverage = average.toFixed(1);
    
    return (
        <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100 h-64">
            <div className="mb-4">
                 <p className="text-2xl font-bold inline">{formattedAverage}</p>
                 <span className="text-green-500 ml-2 text-sm">↑ +2%</span>
            </div>
            <p className="text-sm font-medium mb-2">Rendimiento por Materia</p>
            <div className="flex items-end h-32 border-b border-gray-300 pt-2">
                {data.map((item, index) => (
                     <div key={index} className="w-1/4 flex flex-col items-center mx-1">
                        <div 
                            style={{ height: `${(item.promedio - 7) * 30}px`, minHeight: '5px' }} 
                            className="bg-blue-400 w-10 rounded-t-lg transition-all duration-300"
                        ></div>
                        <p className="text-xs mt-1">{item.materia.substring(0, 5)}.</p>
                    </div>
                ))}
                {/* Placeholder para otras barras */}
                {[...Array(4 - data.length)].map((_, i) => (
                    <div key={`p-${i}`} className="w-1/4 flex flex-col items-center mx-1">
                        <div 
                            style={{ height: `${Math.floor(Math.random() * (40 - 15 + 1) + 15)}px` }}
                            className="bg-purple-300 w-10 rounded-t-lg opacity-70"
                        ></div>
                        <p className="text-xs mt-1">Mat. {i+3}.</p>
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
                    strokeWidth="1" 
                    points="0,35 25,20 50,30 75,15 100,5" 
                />
                 <polyline 
                    fill="none" 
                    stroke="rgb(246, 173, 85)" 
                    strokeWidth="1" 
                    points="0,5 25,10 50,25 75,30 100,35" 
                />
            </svg>
        </div>
    </div>
);


// =================================================================================
// COMPONENTE PRINCIPAL CON LÓGICA DE CARGA DE DATOS
// =================================================================================

const DocenteReportesPage: React.FC = () => {
    // ----------------------------------------------------
    // ESTADO PARA LA CARGA DE DATOS DEL SERVICIO
    // ----------------------------------------------------
    const [summary, setSummary] = useState<ReporteSummary | null>(null); 
    const [loading, setLoading] = useState(true);
    // ----------------------------------------------------

    const [openSelectorModal, setOpenSelectorModal] = useState(false);
    const [openExportModal, setOpenExportModal] = useState(false);
    const [reportType, setReportType] = useState<'grupo' | 'alumno' | null>(null);

    // Lógica de carga de datos al montar el componente
    useEffect(() => {
        const docenteId = 'docente-a123'; // ID de ejemplo
        
        const fetchSummary = async () => {
            try {
                const data = await getReporteSummary(docenteId);
                setSummary(data);
            } catch (error) {
                console.error("Error al cargar el resumen del reporte:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-white p-8 text-center text-gray-500">Cargando resumen de reportes...</div>;
    }
        
    if (!summary) {
        return <div className="min-h-screen bg-white p-8 text-center text-red-500">No se pudieron cargar los datos del reporte.</div>;
    }

    const metricasClave = {
        totalEstudiantes: summary.totalEstudiantes ?? 50,
        estudiantesBajoRendimiento: summary.estudiantesBajoRendimiento ?? 15,
        materiasImpartidas: summary.materiasImpartidas ?? 3,
        gruposAsignados: summary.gruposAsignados ?? 2,
        estudiantesAsistenciaCritica: summary.estudiantesAsistenciaCritica ?? 8,
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* =================== HEADER =================== */}
            <h1 className="text-4xl font-serif italic text-gray-800 mb-2">
                Reportes
            </h1>
            <p className="text-gray-600 text-sm mb-8">
                Resumen del Rendimiento Académico
            </p>

            {/* =================== CARDS (Usando datos del servicio) =================== */}
            <div className="grid grid-cols-3 gap-6 mb-10">
                <Card className="bg-gray-700 text-white"> 
                    <p className="text-sm">Promedio Final Grupo</p>
                    <p className="text-4xl font-bold">{summary.promedioFinalGrupo.toFixed(1)}</p> 
                </Card>
                <Card className="bg-gray-700 text-white">
                    <p className="text-sm">Asistencia Promedio</p>
                    <p className="text-4xl font-bold">{summary.asistenciaPromedio} %</p> 
                </Card>
                <Card className="bg-gray-700 text-white">
                    <p className="text-sm">Tasa Aprobación</p>
                    <p className="text-4xl font-bold">{summary.tasaAprobacion} %</p>
                </Card>
            </div>
            
            {/* =================== ANÁLISIS DETALLADO (Gráficos) =================== */}
            <h2 className="text-xl font-bold text-gray-700 mb-4">
                Análisis Detallado
            </h2>
            <div className="grid grid-cols-2 gap-6 mb-10">
                <BarChartDynamic data={summary.rendimientoMateria} /> 
                <LineChartPlaceholder /> 
            </div>

            {/* =================== MÉTRICAS CLAVE =================== */}
            <h2 className="text-xl font-bold text-gray-700 mb-4">
                Métricas Clave
            </h2>
            <div className="grid grid-cols-4 gap-4 p-6 bg-white rounded-xl shadow-md border border-gray-100 mb-10">
                
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{metricasClave.totalEstudiantes}</p>
                    <p className="text-sm text-gray-600">Total de Estudiantes</p>
                </div>

                <div className="text-center">
                    <p className="text-2xl font-bold text-red-500">{metricasClave.estudiantesBajoRendimiento}</p>
                    <p className="text-sm text-gray-600">Estudiantes Bajo Rendimiento</p>
                </div>

                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{metricasClave.materiasImpartidas}</p>
                    <p className="text-sm text-gray-600">Materias impartidas</p>
                </div>

                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{metricasClave.gruposAsignados}</p>
                    <p className="text-sm text-gray-600">Grupos Asignados</p>
                </div>
                
                <div className="col-span-2 text-center mt-4 border-t pt-4">
                    <p className="text-2xl font-bold text-red-500">{metricasClave.estudiantesAsistenciaCritica}</p>
                    <p className="text-sm text-gray-600">Estudiantes Asistencia Crítica</p>
                </div>
                
                <div className="col-span-2 text-center mt-4 border-t pt-4">
                    <button className="text-sm text-blue-600 hover:underline">ver perfil</button>
                    <p className="text-sm text-gray-600">Promedio Calificaciones</p>
                </div>
                
            </div>

            {/* =================== ACCIONES (Botones) =================== */}
            <h2 className="text-xl font-bold text-gray-700 mb-4">
                Acciones
            </h2>
            <div className="flex gap-4">
                <Button
                    variant="secondary"
                    icon={<FileText className="w-5 h-5" />}
                    onClick={() => setOpenSelectorModal(true)}
                >
                    Generar Reporte Completo
                </Button>
                
                <Button
                    variant="primary"
                    icon={<Download className="w-5 h-5"/>} 
                    onClick={() => setOpenSelectorModal(true)} 
                >
                    Exportar Datos
                </Button>
            </div>


            {/* =====================================================
                MODAL 1 — SELECCIÓN DE TIPO DE REPORTE
            ===================================================== */}
            <Modal
                isOpen={openSelectorModal}
                onClose={() => setOpenSelectorModal(false)}
                hideHeader
                size="lg"
                title=""
            >
                <div className="p-6">
                    <h2 className="text-4xl font-serif italic mb-3">
                        Exportar Reportes
                    </h2>
                    <p className="text-sm text-gray-600 mb-8">
                        Seleccione el tipo de reporte que desea generar
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                        {/* GRUPO */}
                        <button
                            onClick={() => {
                                setReportType('grupo');
                                setOpenSelectorModal(false);
                                setOpenExportModal(true);
                            }}
                            className="flex gap-4 items-center bg-gray-300 hover:bg-gray-400 transition rounded-[2rem] p-6"
                        >
                            <Users className="w-12 h-12" />
                            <div>
                                <p className="font-serif font-bold text-xl">
                                    Reporte Grupo
                                </p>
                                <p className="text-xs">Análisis general del grupo</p>
                            </div>
                        </button>

                        {/* ALUMNO */}
                        <button
                            onClick={() => {
                                setReportType('alumno');
                                setOpenSelectorModal(false);
                                setOpenExportModal(true);
                            }}
                            className="flex gap-4 items-center bg-gray-300 hover:bg-gray-400 transition rounded-[2rem] p-6"
                        >
                            <User className="w-12 h-12" />
                            <div>
                                <p className="font-serif font-bold text-xl">
                                    Reporte Alumno
                                </p>
                                <p className="text-xs">Informe individual del alumno</p>
                            </div>
                        </button>
                    </div>
                </div>
            </Modal>

            {/* =====================================================
                MODAL 2 — EXPORTACIÓN (DISEÑO IGUAL A LA IMAGEN)
            ===================================================== */}
            <Modal
                isOpen={openExportModal}
                onClose={() => setOpenExportModal(false)}
                hideHeader
                size="xl"
                title=""
            >
                <div className="p-6">
                    <h2 className="text-4xl font-serif italic mb-1">
                        Exportación de Reportes
                    </h2>
                    <p className="text-sm text-gray-600 mb-8">
                        Crea y descarga reportes personalizados
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                        {/* ================= LEFT ================= */}
                        <div className="space-y-6">
                            {/* Paso 1 */}
                            <div>
                                <p className="text-sm font-medium mb-3">
                                    1. Seleccione el tipo de Reporte
                                </p>
                                <button className="w-full border rounded-full px-6 py-3 mb-3 flex justify-between">
                                    Rendimiento <ArrowRight className="w-5 h-5"/>
                                </button>
                                <button className="w-full border rounded-full px-6 py-3 flex justify-between">
                                    Asistencia <ArrowRight className="w-5 h-5"/>
                                </button>
                            </div>

                            {/* Paso 2 */}
                            <div>
                                <p className="text-sm font-medium mb-3">
                                    2. Seleccionar Grupos / Alumnos
                                </p>
                                <div className="bg-gray-100 rounded-xl p-4 space-y-3">
                                    <Input placeholder="Buscar Grupo o Alumno..." />

                                    {reportType === 'grupo' && (
                                        <select className="w-full border rounded-lg px-4 py-2">
                                            <option>Seleccionar Grupo</option>
                                            <option>Grupo A</option>
                                            <option>Grupo B</option>
                                        </select>
                                    )}

                                    {reportType === 'alumno' && (
                                        <select className="w-full border rounded-lg px-4 py-2">
                                            <option>Seleccionar Alumno</option>
                                            <option>Juan Pérez</option>
                                            <option>Ana López</option>
                                        </select>
                                    )}
                                </div>
                            </div>

                            {/* Paso 3 */}
                            <div>
                                <p className="text-sm font-medium mb-3">
                                    3. Formato Salida
                                </p>
                                <div className="flex gap-4">
                                    <button className="w-24 h-24 border-2 border-red-400 rounded-2xl flex flex-col items-center justify-center">
                                        📄 PDF
                                    </button>
                                    <button className="w-24 h-24 border-2 border-green-400 rounded-2xl flex flex-col items-center justify-center">
                                        📊 EXCEL
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ================= RIGHT ================= */}
                        <div className="flex flex-col">
                            <p className="text-sm font-medium mb-3">Vista Previa</p>

                            <div className="flex-1 bg-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-600">
                                👁️
                                <p className="text-sm mt-2 text-center">
                                    La vista previa del reporte se mostrará aquí
                                </p>
                            </div>

                            <button className="mt-4 bg-gray-800 text-white py-3 rounded-xl flex items-center justify-center gap-2">
                                🔄 Actualizar Vista Previa
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DocenteReportesPage;