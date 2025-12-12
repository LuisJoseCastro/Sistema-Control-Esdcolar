// src/pages/admin/AdminReportesPage.tsx

import React, { useState } from 'react';
import { FileDown, ListChecks } from 'lucide-react';
//import { useNavigate } from 'react-router-dom';

// Importación de Componentes UI
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select'; 
import Input from '../../components/ui/Input';
import Table, { TableHead, TableCell, TableRow } from '../../components/ui/Table'; // 🛑 Importamos Table
import { ExportFormatModal } from '../../components/ui/ExportFormatModal'; 
import Badge from '../../components/ui/Badge'; // Usaremos Badge para el estado

// =======================================================
// Mocks de datos y tipos para resultados
// =======================================================

// Simulación de un reporte consolidado de grupo
interface ReporteGrupo {
    matricula: string;
    nombre: string;
    asistencia: number; // Porcentaje
    promedio: number;
    estado: 'APROBADO' | 'REPROBADO';
}

const mockReportData: ReporteGrupo[] = [
    { matricula: 'A12301', nombre: 'Carlos Soto', asistencia: 95, promedio: 8.8, estado: 'APROBADO' },
    { matricula: 'A12302', nombre: 'Laura Alumna', asistencia: 85, promedio: 7.2, estado: 'APROBADO' },
    { matricula: 'A12303', nombre: 'Daniela Ríos', asistencia: 65, promedio: 5.9, estado: 'REPROBADO' },
    { matricula: 'A12304', nombre: 'Javier Pérez', asistencia: 99, promedio: 9.5, estado: 'APROBADO' },
];

const mockPeriods = [
    { value: '2025-1', label: '2025-1 (Actual)' },
    { value: '2024-2', label: '2024-2' },
];

const mockSubjects = [
    { value: 'bd', label: 'Bases de Datos I' },
    { value: 'web', label: 'Desarrollo Web' },
    { value: 'calc', label: 'Cálculo Avanzado' },
];

const mockGroups = [
    { value: '101', label: 'Grupo 101' },
    { value: '102', label: 'Grupo 102' },
];

// =======================================================
// Renderizado de la tabla de resultados
// =======================================================

const ReporteResultTable: React.FC<{ data: ReporteGrupo[] }> = ({ data }) => {
    return (
        <Table className="shadow-none">
            <Table.Header>
                <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Asistencia</TableHead>
                    <TableHead>Promedio</TableHead>
                    <TableHead>Estado</TableHead>
                </TableRow>
            </Table.Header>
            <Table.Body>
                {data.map((item) => (
                    <TableRow key={item.matricula}>
                        <TableCell className="font-mono">{item.matricula}</TableCell>
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell>{item.asistencia}%</TableCell>
                        <TableCell className="font-semibold">{item.promedio.toFixed(1)}</TableCell>
                        <TableCell>
                            <Badge variant={item.estado === 'APROBADO' ? 'success' : 'danger'}>
                                {item.estado}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </Table.Body>
        </Table>
    );
};

// =======================================================
// Componente Principal
// =======================================================

export const AdminReportesPage: React.FC = () => {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [reportGenerated, setReportGenerated] = useState(false);
    const [reportType, setReportType] = useState<'individual' | 'group' | null>(null);
    
    // Estados para filtros
    const [period, setPeriod] = useState('');
    const [subject, setSubject] = useState('');
    const [group, setGroup] = useState('');
    const [studentId, setStudentId] = useState('');

    const handleGenerateReport = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (studentId.trim()) {
            setReportType('individual');
        } else {
            setReportType('group');
        }
        
        setReportGenerated(true);
    };
    
    const handleExport = (format: 'PDF' | 'EXCEL') => {
        console.log(`Exportando reporte (${reportType}) a: ${format}`);
        alert(`Reporte de ${reportType === 'individual' ? studentId : group} exportado a ${format}.`);
    };

    const displayTitle = reportType === 'individual' 
        ? `Resultados de Alumno: ${studentId}` 
        : `Resultados de ${mockSubjects.find(s => s.value === subject)?.label || 'Asignatura'} - ${group}`;
    
    const displayData = reportType === 'individual'
        ? mockReportData.filter(d => d.matricula === studentId) 
        : mockReportData;
    
    // Si es reporte individual, solo mostramos si existe
    const showReport = reportGenerated && (reportType === 'group' || displayData.length > 0);


    return (
        <div className="p-8 bg-white min-h-full font-sans">
            
            {/* TÍTULO PRINCIPAL */}
            <header className="mb-8">
                <h1 
                    className="text-5xl text-black border-b border-gray-400 pb-2" 
                    style={{ fontFamily: '"Kaushan Script", cursive' }}
                >
                    Reporte Académico
                </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Columna 1: Filtros de Reporte */}
                <Card header="Reporte" className="lg:col-span-1 shadow-xl">
                    <form onSubmit={handleGenerateReport} className="space-y-4">
                        
                        <Select 
                            label="Período:"
                            options={mockPeriods}
                            placeholder="Seleccione un período"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            required
                        />

                        <Select 
                            label="Asignatura:"
                            options={mockSubjects}
                            placeholder="Seleccione la asignatura"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />

                        <Select 
                            label="Grupo:"
                            options={mockGroups}
                            placeholder="Seleccione el grupo"
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
                            required
                        />

                        <Input
                            label="Alumno (opcional)"
                            type="text"
                            placeholder="Matrícula"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                        />

                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="w-full"
                                icon={<ListChecks size={20} />}
                                disabled={!period || !subject || !group}
                            >
                                Generar Reporte
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Columna 2: Contenido y Exportación */}
                <Card header="Reporte Académico" className="lg:col-span-2 shadow-xl flex flex-col justify-between min-h-[500px]">
                    
                    {showReport ? (
                        /* Contenido del reporte */
                        <div className="p-4 text-gray-700 flex-1 overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">{displayTitle}</h2>
                            <ReporteResultTable data={displayData} />
                            <p className="mt-4 text-sm text-green-600">Reporte listo para ser exportado.</p>
                        </div>
                    ) : reportGenerated && reportType === 'individual' ? (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                             No se encontró el alumno con matrícula {studentId} en el grupo/asignatura seleccionada.
                         </div>
                    ) : (
                        /* Mensaje de inicio */
                         <div className="flex-1 flex items-center justify-center text-gray-500">
                             Seleccione los filtros y haga clic en "Generar Reporte".
                         </div>
                    )}

                    {/* Botón de Exportar */}
                    <div className="text-right pt-4 border-t">
                        <Button 
                            onClick={() => setIsExportModalOpen(true)}
                            variant="secondary" 
                            disabled={!showReport} // Solo se puede exportar si hay un reporte generado y visible
                            icon={<FileDown size={20} />}
                        >
                            Exportar
                        </Button>
                    </div>
                </Card>
            </div>
            
            {/* Modal de Exportación (Reutilizable) */}
            <ExportFormatModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onSelectFormat={handleExport}
                title={`Exportar ${reportType === 'individual' ? 'Resultado Individual' : 'Reporte Consolidado'}`}
            />
            
        </div>
    );
};