// src/pages/docente/DocenteAsistenciaPage.tsx

import React, { useState, useCallback, useMemo } from 'react';
import { CalendarCheck, Save, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🛑 IMPORTACIONES DE COMPONENTES ATÓMICOS
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
// Importamos todos los sub-componentes necesarios
import Table, { TableRow, TableCell, TableHead } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
// import Badge from '../../components/ui/Badge'; // Nuevo: Para el estado

// --- Tipos de Datos (Mock) ---

// Tipos de estado de asistencia
type AsistenciaStatus = 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADA' | 'RETARDO';

interface AlumnoAsistencia {
    id: string;
    nombre: string;
    status: AsistenciaStatus;
}

interface Grupo {
    id: string;
    nombre: string;
}

// --- MOCK DATA ---
const MOCK_GRUPOS: Grupo[] = [
    { id: '1', nombre: 'Grupo 3A - Matemáticas' },
    { id: '2', nombre: 'Grupo 5B - Español' },
    { id: '3', nombre: 'Grupo 1C - Historia' },
];

const MOCK_ALUMNOS: AlumnoAsistencia[] = [
    { id: 'a1', nombre: 'Juan Pablo Guzmán', status: 'AUSENTE' },
    { id: 'a2', nombre: 'María José López', status: 'PRESENTE' },
    { id: 'a3', nombre: 'Brandon Jael Ramos', status: 'JUSTIFICADA' },
    { id: 'a4', nombre: 'Miguel Ángel Torres', status: 'RETARDO' },
    { id: 'a5', nombre: 'Sofía Isabel García', status: 'PRESENTE' },
    { id: 'a6', nombre: 'Diego Fernando Ruiz', status: 'AUSENTE' },
];

// 🛑 Mapeo de estados a variantes de Badge (Usando la lógica de Badge.tsx)
const STATUS_BADGE_VARIANT: Record<AsistenciaStatus, 'success' | 'danger' | 'warning' | 'info'> = {
    PRESENTE: 'success', // Verde
    AUSENTE: 'danger',   // Rojo
    JUSTIFICADA: 'warning', // Amarillo
    RETARDO: 'info',    // Azul
};

// Mapeo de estados a etiquetas en español
const STATUS_LABELS: Record<AsistenciaStatus, string> = {
    PRESENTE: 'Presente',
    AUSENTE: 'Ausente',
    JUSTIFICADA: 'Falta Justificada',
    RETARDO: 'Retardo',
};


// --- Componentes Atómicos Específicos de la Página ---

interface AlumnoAsistenciaRowProps {
    alumno: AlumnoAsistencia;
    onUpdateStatus: (id: string, status: AsistenciaStatus) => void;
}

const AlumnoAsistenciaRow: React.FC<AlumnoAsistenciaRowProps> = ({ alumno, onUpdateStatus }) => {

    const statusOptions = (Object.keys(STATUS_LABELS) as AsistenciaStatus[]).map(status => ({
        value: status,
        label: STATUS_LABELS[status],
    }));

    return (
        // 🛑 USO DEL SUB-COMPONENTE: TableRow
        <TableRow key={alumno.id}>
            {/* Nombre del Alumno */}
            {/* 🛑 USO DEL SUB-COMPONENTE: TableCell */}
            <TableCell className="font-medium text-gray-900 truncate">
                {alumno.nombre}
            </TableCell>

            {/* Selector de Asistencia */}
            <TableCell className="w-[180px]">
                {/* 🛑 USO DEL COMPONENTE ATÓMICO: Select */}
                <Select
                    value={alumno.status}
                    onChange={(e) => onUpdateStatus(alumno.id, e.target.value as AsistenciaStatus)}
                    // Aplicamos clases al select interno para darle el estilo de pastilla
                    selectClassName={`
                        bg-white border-gray-300 py-1 px-2 rounded-full text-sm font-semibold text-center
                        ${STATUS_BADGE_VARIANT[alumno.status] === 'success' ? 'text-green-800' : ''}
                        ${STATUS_BADGE_VARIANT[alumno.status] === 'danger' ? 'text-red-800' : ''}
                        ${STATUS_BADGE_VARIANT[alumno.status] === 'warning' ? 'text-yellow-800' : ''}
                        ${STATUS_BADGE_VARIANT[alumno.status] === 'info' ? 'text-blue-800' : ''}
                        
                    `}
                    className="p-0 m-0 w-full"
                    options={statusOptions}
                />
            </TableCell>
        </TableRow>
    );
};

// Componente de Botón de Día (se mantiene manual ya que es muy específico del diseño de calendario)
const DayButton: React.FC<{ day: number, isSelected: boolean, onClick: () => void }> = ({ day, isSelected, onClick }) => {
    const classes = isSelected
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'; // Ajustamos a estética Light Theme (asumimos que la página de asistencia debería seguir el tema general Light, aunque tu código original usaba dark)

    return (
        // 🛑 USO DE COMPONENTE ATÓMICO: Button (pero con override fuerte de estilo para el calendario)
        <Button
            onClick={onClick}
            variant='secondary' // Usamos secondary como base, pero sobreescribimos con las clases de DayButton
            className={`w-10 h-10 p-0 rounded-lg font-bold transition-all duration-150 ${classes}`}
        >
            {day}
        </Button>
    );
};


// --- PÁGINA PRINCIPAL: DocenteAsistenciaPage ---
export const DocenteAsistenciaPage: React.FC = () => {
    const navigate = useNavigate();

    // Estado de los filtros y datos
    const [selectedGrupo, setSelectedGrupo] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<number>(12);
    const [currentMonth, setCurrentMonth] = useState<string>('Enero 2026');
    const [alumnos, setAlumnos] = useState<AlumnoAsistencia[]>(MOCK_ALUMNOS);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Días del mes mock (simulamos 31 días)
    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

    // Función para actualizar el estado de asistencia de un alumno
    const handleUpdateStatus = useCallback((id: string, status: AsistenciaStatus) => {
        setAlumnos(prevAlumnos => prevAlumnos.map(alumno =>
            alumno.id === id ? { ...alumno, status: status } : alumno
        ));
    }, []);

    // Simulación de la acción de Guardar
    const handleGuardarAsistencia = useCallback(() => {
        if (!selectedGrupo) {
            alert('Por favor, selecciona un grupo antes de guardar la asistencia.');
            return;
        }
        setIsLoading(true);
        console.log(`Guardando asistencia para el grupo ${selectedGrupo} en el día ${selectedDate}:`, alumnos);
        setTimeout(() => {
            setIsLoading(false);
            alert('Asistencia guardada exitosamente (Simulación).');
        }, 1500);
    }, [alumnos, selectedGrupo, selectedDate]);

    const isReadyToSave = useMemo(() => selectedGrupo !== '', [selectedGrupo]);

    // Opciones para el Select atómico (transformación de Mock Data)
    const grupoOptions = MOCK_GRUPOS.map(g => ({ value: g.id, label: g.nombre }));


    return (
        // 🛑 AJUSTE: Volvemos a un fondo Light (bg-gray-50) para consistencia con el tema atómico
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">

            {/* Header: Título y Navegación */}
            <header className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <CalendarCheck className="w-7 h-7 mr-3 text-main-900" />
                    Registro de Asistencia
                </h1>
                {/* 🛑 USO DEL COMPONENTE ATÓMICO: Button (variant: ghost) */}
                <Button
                    variant='ghost'
                    onClick={() => navigate('/docente/dashboard')}
                    icon={<ArrowLeft className="w-4 h-4" />}
                    className="text-sm px-3 py-2"
                >
                    Volver a Inicio
                </Button>
            </header>

            <p className="text-gray-600 mb-6 text-lg">
                Selecciona el grupo y la fecha para empezar a registrar la asistencia de los alumnos.
            </p>

            {/* CONTENEDOR PRINCIPAL: Grid de 2 Columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUMNA IZQUIERDA: Filtros y Lista de Estudiantes (ocupa 2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Sección: Seleccionar Grupo */}
                    {/* 🛑 USO DEL COMPONENTE ATÓMICO: Card (variant: flat) */}
                    <Card header="Seleccionar Grupo" variant="flat">
                        {/* 🛑 USO DEL COMPONENTE ATÓMICO: Select */}
                        <Select
                            label="Grupos" // Label se usa aquí
                            value={selectedGrupo}
                            onChange={(e) => setSelectedGrupo(e.target.value)}
                            placeholder="Seleccionar Grupos"
                            options={grupoOptions}
                        />
                    </Card>

                    {/* Sección: Lista de Estudiantes */}
                    {/* 🛑 USO DEL COMPONENTE ATÓMICO: Card */}
                    <Card header="Lista de Estudiantes">

                        {/* 🛑 USO DEL COMPONENTE ATÓMICO: Table */}
                        <Table className="shadow-none border border-gray-200">
                            {/* 🛑 USO DEL SUB-COMPONENTE: Table.Header */}
                            <Table.Header>
                                {/* 🛑 USO DEL SUB-COMPONENTE: TableRow */}
                                <TableRow>
                                    {/* 🛑 USO DEL SUB-COMPONENTE: TableHead */}
                                    <TableHead className="w-1/2">Nombre Completo</TableHead>
                                    <TableHead className="w-1/2 text-center">Asistencia</TableHead>
                                </TableRow>
                            </Table.Header>

                            {/* 🛑 USO DEL SUB-COMPONENTE: Table.Body */}
                            <Table.Body>
                                {selectedGrupo ? (
                                    alumnos.map(alumno => (
                                        <AlumnoAsistenciaRow
                                            key={alumno.id}
                                            alumno={alumno}
                                            onUpdateStatus={handleUpdateStatus}
                                        />
                                    ))
                                ) : (
                                    // Fila de mensaje si no hay grupo seleccionado
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-gray-500 py-6 font-medium">
                                            Por favor, selecciona un grupo para ver la lista de alumnos.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Table.Body>
                        </Table>
                    </Card>
                    
                    {/* 3. BOTÓN DE GUARDAR */}
                    {isReadyToSave && (
                        <div className="flex justify-start">
                            {/* 🛑 USO DEL COMPONENTE ATÓMICO: Button (variant: gradient) */}
                            <Button
                                variant='primary'
                                onClick={handleGuardarAsistencia}
                                disabled={!isReadyToSave || isLoading}
                                isLoading={isLoading}
                                icon={<Save className="w-5 h-5" />}
                            >
                                Guardar Asistencia
                            </Button>
                        </div>
                    )}
                </div>

                {/* COLUMNA DERECHA: Calendario (ocupa 1/3) */}
                {/* 🛑 USO DEL COMPONENTE ATÓMICO: Card */}
                <Card header="Seleccionar Día" className="lg:col-span-1 flex flex-col h-full">

                    {/* Header del Calendario */}
                    <div className="flex justify-between items-center mb-6">
                        {/* 🛑 USO DEL COMPONENTE ATÓMICO: Button (navegación del calendario) */}
                        <Button
                            variant='primary'
                            onClick={() => console.log('Anterior Mes')}
                            className="p-2 rounded-full h-auto w-auto"
                            icon={<ChevronLeft className="w-5 h-5" />}
                        >
                            {/* Vacio */}
                        </Button>
                        <h3 className="text-xl font-semibold text-gray-800">{currentMonth}</h3>
                        {/* 🛑 USO DEL COMPONENTE ATÓMICO: Button (navegación del calendario) */}
                        <Button
                            variant='primary'
                            onClick={() => console.log('Siguiente Mes')}
                            className="p-2 rounded-full h-auto w-auto"
                            icon={<ChevronRight className="w-5 h-5" />}
                        >
                            {/* Vacio */}
                        </Button>
                    </div>

                    {/* Vista de Días */}
                    <div className="grid grid-cols-7 text-center gap-2">
                        {/* Días de la semana (Encabezado) */}
                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(day => (
                            <div key={day} className="text-sm font-bold text-gray-900">{day}</div>
                        ))}

                        {/* Relleno inicial (mock) */}
                        {Array.from({ length: 3 }, (_, i) => (
                            <div key={`fill-${i}`} className="w-10 h-10"></div>
                        ))}

                        {/* Botones de Días del Mes */}
                        {daysInMonth.map(day => (
                            <DayButton
                                key={day}
                                day={day}
                                isSelected={day === selectedDate}
                                onClick={() => setSelectedDate(day)}
                            />
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};