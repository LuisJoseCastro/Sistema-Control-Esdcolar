import React, { useState, useEffect } from 'react'; 
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input'; 
import Modal from '../../components/ui/Modal'; 
import { BarChart3, ChevronDown, Download, User, FileText, FileSpreadsheet } from 'lucide-react'; 
import { adminService } from '../../services/admin.service'; // 👈 Conexión real

// --- TIPOS DE DATOS ---
interface FilterOption {
    value: string;
    label: string;
}

const AdminReportesPage: React.FC = () => {
    const [periodos, setPeriodos] = useState<FilterOption[]>([]);
    const [asignaturas, setAsignaturas] = useState<FilterOption[]>([]);
    const [grupos, setGrupos] = useState<FilterOption[]>([]);
    
    const [selectedPeriodo, setSelectedPeriodo] = useState('');
    const [selectedAsignatura, setSelectedAsignatura] = useState('');
    const [selectedGrupo, setSelectedGrupo] = useState('');
    const [selectedMatricula, setSelectedMatricula] = useState(''); 
    
    const [reportData, setReportData] = useState<string | null>(null);
    const [isLoadingReporte, setIsLoadingReporte] = useState(false); 
    const [isLoadingFilters, setIsLoadingFilters] = useState(true); 

    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    // 1. CARGA DE FILTROS REALES DESDE EL BACKEND
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                setIsLoadingFilters(true);
                const data = await adminService.getReportFilters();
                
                setPeriodos(data.periodos || []);
                setAsignaturas(data.asignaturas || []);
                setGrupos(data.grupos || []);

                if (data.periodos?.length > 0) setSelectedPeriodo(data.periodos[0].value);
                if (data.asignaturas?.length > 0) setSelectedAsignatura(data.asignaturas[0].value);
                if (data.grupos?.length > 0) setSelectedGrupo(data.grupos[0].value);

            } catch (error) {
                console.error("Error al cargar los filtros:", error);
            } finally {
                setIsLoadingFilters(false);
            }
        };
        fetchFilters();
    }, []); 

    // 2. GENERAR REPORTE (CONECTADO A API)
    const handleGenerarReporte = async () => {
        if (!selectedPeriodo || !selectedAsignatura || !selectedGrupo) {
            alert("Por favor, selecciona un Periodo, Asignatura y Grupo.");
            return;
        }

        setIsLoadingReporte(true);
        setReportData(null); 
        
        const payload = {
            periodo: selectedPeriodo,
            asignatura: selectedAsignatura,
            grupo: selectedGrupo,
            matricula: selectedMatricula || undefined,
        };
        
        try {
            const data = await adminService.generarReporteAcademico(payload);
            setReportData(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error("Error al generar reporte:", error);
            setReportData("Error al conectar con el servidor para generar el reporte.");
        } finally {
            setIsLoadingReporte(false);
        }
    };

    const handleExportar = () => {
        if (reportData) setIsExportModalOpen(true);
    };

    // 3. EXPORTAR ARCHIVO REAL
    const handleExportSelection = async (format: 'pdf' | 'xlsx') => {
        try {
            const payload = {
                periodo: selectedPeriodo,
                asignatura: selectedAsignatura,
                grupo: selectedGrupo,
                matricula: selectedMatricula
            };
            
            const blob = await adminService.exportarReporte(payload, format);
            
            // Lógica de descarga de archivo
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Reporte_${selectedGrupo}_${selectedPeriodo}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            setIsExportModalOpen(false);
        } catch (error) {
            alert("Error al descargar el archivo.");
        }
    }

    // --- RENDERIZADO (DISEÑO INTACTO) ---
    const SelectControl: React.FC<{ label: string; name: string; value: string; options: FilterOption[]; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; disabled: boolean }> = ({ label, name, value, options, onChange, disabled }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className="appearance-none w-full border border-gray-300 rounded-lg p-2.5 shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 pr-10 disabled:bg-gray-200 disabled:text-gray-500"
                >
                    {options.length === 0 && !isLoadingFilters ? <option value="">Sin opciones</option> : null}
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
        </div>
    );

    const disabledControls = isLoadingFilters || isLoadingReporte;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-serif italic text-gray-800 flex items-center">
                    <BarChart3 size={32} className="mr-3 text-green-600" />
                    Reporte Académico
                </h1>
                <p className="text-gray-600 ml-10">Filtros para generar calificaciones y reportes de progreso.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                {/* PANEL DE FILTROS */}
                <Card className="p-6 bg-white shadow-xl lg:w-1/3 border-2 border-gray-200">
                    <h2 className="text-xl font-semibold mb-6 border-b pb-2">Filtros</h2>
                    {isLoadingFilters ? (
                        <div className="text-center py-10 text-blue-500">Cargando filtros...</div>
                    ) : (
                        <div className="space-y-6">
                             <SelectControl
                                label="Periodo"
                                name="periodo"
                                value={selectedPeriodo}
                                options={periodos} 
                                onChange={(e) => setSelectedPeriodo(e.target.value)}
                                disabled={disabledControls}
                            />
                             <SelectControl
                                label="Asignatura"
                                name="asignatura"
                                value={selectedAsignatura}
                                options={asignaturas} 
                                onChange={(e) => setSelectedAsignatura(e.target.value)}
                                disabled={disabledControls}
                            />
                            <SelectControl
                                label="Grupo"
                                name="grupo"
                                value={selectedGrupo}
                                options={grupos} 
                                onChange={(e) => setSelectedGrupo(e.target.value)}
                                disabled={disabledControls}
                            />
                            <Input 
                                label="Alumno (opcional)"
                                name="matricula"
                                value={selectedMatricula}
                                onChange={(e) => setSelectedMatricula(e.target.value)}
                                placeholder="matrícula (ej: 20201234)"
                                icon={<User size={18} className="text-gray-400"/>}
                                type="text" 
                                disabled={disabledControls}
                            />
                        </div>
                    )}

                    <div className="mt-8">
                        <Button 
                            variant="primary" 
                            onClick={handleGenerarReporte}
                            disabled={disabledControls || !selectedPeriodo || !selectedAsignatura || !selectedGrupo}
                            className="w-full"
                        >
                            {isLoadingReporte ? 'Generando...' : 'Generar reporte'}
                        </Button>
                    </div>
                </Card>

                {/* PANEL DE VISTA PREVIA */}
                <Card className="p-6 bg-white shadow-xl lg:w-2/3 flex flex-col">
                    <h2 className="text-xl font-semibold mb-6 border-b pb-2">Vista Previa</h2>
                    
                    <div className="flex-grow min-h-[300px] bg-gray-50 border p-4 overflow-auto rounded-lg mb-6 text-gray-700 whitespace-pre-wrap">
                        {isLoadingReporte ? (
                            <div className="text-center py-10 text-blue-500">Procesando solicitud...</div>
                        ) : reportData === null ? (
                            <div className="text-center py-10 text-gray-500 italic">
                                Selecciona los filtros y haz clic en "Generar reporte".
                            </div>
                        ) : (
                            <pre className="text-sm font-mono">{reportData}</pre>
                        )}
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <Button 
                            variant="secondary"
                            onClick={handleExportar}
                            disabled={!reportData || isLoadingReporte}
                            icon={<Download size={18} />}
                        >
                            Exportar
                        </Button>
                    </div>
                </Card>
            </div>

            {/* MODAL DE EXPORTACIÓN (DISEÑO INTACTO) */}
            <Modal 
                isOpen={isExportModalOpen} 
                onClose={() => setIsExportModalOpen(false)} 
                title="Exportación"
            >
                <div className="text-center p-4">
                    <h3 className="text-xl font-semibold mb-2">Formato de exportación</h3>
                    <p className="text-gray-600 mb-8">Seleccione el formato en que desea exportar</p>

                    <div className="flex justify-center space-x-16">
                        <button
                            onClick={() => handleExportSelection('pdf')}
                            className="flex flex-col items-center p-6 border border-gray-300 rounded-xl bg-gray-50 hover:bg-white hover:shadow-xl transition duration-200 w-44 h-44 justify-center cursor-pointer"
                        >
                            <div className="relative mb-2">
                                <FileText size={80} className="text-red-600 mx-auto" />
                                <span className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded-sm">PDF</span>
                            </div>
                            <span className="mt-4 text-gray-700 font-medium">PDF</span>
                        </button>

                        <button
                            onClick={() => handleExportSelection('xlsx')}
                            className="flex flex-col items-center p-6 border border-gray-300 rounded-xl bg-gray-50 hover:bg-white hover:shadow-xl transition duration-200 w-44 h-44 justify-center cursor-pointer"
                        >
                            <FileSpreadsheet size={80} className="text-green-700" />
                            <span className="mt-4 text-gray-700 font-medium">Excel (XLSX)</span>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminReportesPage;