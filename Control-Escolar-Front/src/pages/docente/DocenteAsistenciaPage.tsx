// src/pages/docente/DocenteAsistenciaPage.tsx

import React, { useState, useCallback, useMemo } from 'react';
import { CalendarCheck, Save, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
// 🛑 NUEVO: Importamos useNavigate de react-router-dom para la navegación
import { useNavigate } from 'react-router-dom';

// 🛑 ELIMINADA LA LÍNEA: import { type DocenteView } from '../../App'; 

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

// Mapeo de estados a estilos
const STATUS_STYLES: Record<AsistenciaStatus, string> = {
    PRESENTE: 'bg-green-600 text-white',
    AUSENTE: 'bg-red-600 text-white',
    JUSTIFICADA: 'bg-yellow-600 text-gray-900',
    RETARDO: 'bg-blue-600 text-white',
};

// Mapeo de estados a etiquetas en español
const STATUS_LABELS: Record<AsistenciaStatus, string> = {
    PRESENTE: 'Presente',
    AUSENTE: 'Ausente',
    JUSTIFICADA: 'Falta Justificada',
    RETARDO: 'Retardo',
};


// 🛑 ELIMINADA LA INTERFAZ: DocenteAsistenciaPageProps


// --- Componentes Atómicos ---

interface AlumnoAsistenciaRowProps {
    alumno: AlumnoAsistencia;
    onUpdateStatus: (id: string, status: AsistenciaStatus) => void;
}

const AlumnoAsistenciaRow: React.FC<AlumnoAsistenciaRowProps> = ({ alumno, onUpdateStatus }) => {

    // Función para obtener el color de fondo y texto del estado actual
    const statusClasses = STATUS_STYLES[alumno.status] || 'bg-gray-700 text-gray-200';
    // const statusLabel = STATUS_LABELS[alumno.status]; // No utilizada en el render

    // Array de opciones para el dropdown
    const statusOptions: AsistenciaStatus[] = ['PRESENTE', 'AUSENTE', 'JUSTIFICADA', 'RETARDO'];

    return (
        <div className="grid grid-cols-2 text-sm border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors">
            {/* Nombre del Alumno */}
            <div className="py-3 px-4 font-medium text-gray-100 truncate">
                {alumno.nombre}
            </div>

            {/* Selector de Asistencia (simulando la pastilla de la maqueta) */}
            <div className="py-2 px-4 flex items-center justify-center">
                <select
                    value={alumno.status}
                    onChange={(e) => onUpdateStatus(alumno.id, e.target.value as AsistenciaStatus)}
                    className={`
                        w-full max-w-[150px] text-center rounded-xl py-1 px-2 text-xs font-semibold 
                        border-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-400
                        ${statusClasses} transition-all duration-200
                    `}
                >
                    {statusOptions.map(status => (
                        <option key={status} value={status} className="bg-gray-800 text-white">
                            {STATUS_LABELS[status]}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

// Componente de Botón de Día
const DayButton: React.FC<{ day: number, isSelected: boolean, onClick: () => void }> = ({ day, isSelected, onClick }) => {
    const classes = isSelected
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
        : 'bg-gray-700 text-gray-200 hover:bg-gray-600';

    return (
        <button
            onClick={onClick}
            className={`w-10 h-10 rounded-lg font-bold transition-all duration-150 ${classes}`}
        >
            {day}
        </button>
    );
};


// --- PÁGINA PRINCIPAL: DocenteAsistenciaPage ---
// 🛑 Ahora el componente no recibe props de navegación, usa el hook useNavigate
export const DocenteAsistenciaPage: React.FC = () => {
    // 🛑 Hook de React Router DOM
    const navigate = useNavigate();

    // Estado de los filtros y datos
    const [selectedGrupo, setSelectedGrupo] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<number>(12); // Simula el día 12 seleccionado
    const [currentMonth, setCurrentMonth] = useState<string>('Enero 2026');
    const [alumnos, setAlumnos] = useState<AlumnoAsistencia[]>(MOCK_ALUMNOS);

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
        console.log(`Guardando asistencia para el grupo ${selectedGrupo} en el día ${selectedDate}:`, alumnos);
        // Aquí iría la lógica de API/Firestore
        alert('Asistencia guardada exitosamente (Simulación).');
    }, [alumnos, selectedGrupo, selectedDate]);

    const isReadyToSave = useMemo(() => selectedGrupo !== '', [selectedGrupo]);

    return (
        <div className="p-4 md:p-8 bg-gray-900 text-gray-100 min-h-full">

            {/* Header: Título y Navegación */}
            <header className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-serif italic text-white flex items-center">
                    <CalendarCheck className="w-7 h-7 mr-3 text-blue-400" />
                    Registro de Asistencia
                </h1>
                {/* Botón de Regresar */}
                <button
                    // 🛑 CORREGIDO: Usamos navigate de React Router DOM
                    onClick={() => navigate('/docente/dashboard')}
                    className="flex items-center text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Volver a Inicio
                </button>
            </header>

            <p className="text-gray-400 mb-6 text-lg">
                Selecciona el grupo y la fecha para empezar a registrar la asistencia de los alumnos.
            </p>

            {/* CONTENEDOR PRINCIPAL: Grid de 2 Columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUMNA IZQUIERDA: Filtros y Lista de Estudiantes (ocupa 2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Sección: Seleccionar Grupo (Misma estética que el filtro de calificaciones) */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
                        <h2 className="text-xl font-semibold text-blue-400 mb-4">Seleccionar Grupo</h2>

                        <div>
                            <label htmlFor="grupo" className="block text-sm font-medium text-gray-300 mb-2 sr-only">Grupos</label>
                            <select
                                id="grupo"
                                value={selectedGrupo}
                                onChange={(e) => setSelectedGrupo(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 text-gray-200 py-2.5 px-4 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value="" disabled>Seleccionar Grupos</option>
                                {MOCK_GRUPOS.map(grupo => (
                                    <option key={grupo.id} value={grupo.id}>{grupo.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Sección: Lista de Estudiantes */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
                        <h2 className="text-xl font-semibold text-blue-400 mb-4">Lista de Estudiantes</h2>

                        <div className="overflow-x-auto rounded-lg border border-gray-700">
                            <div className="min-w-full divide-y divide-gray-700">

                                {/* Encabezados de la Tabla */}
                                <div className="grid grid-cols-2 text-sm bg-gray-700 text-gray-100 font-bold">
                                    <div className="py-3 px-4 text-left">Nombre Completo</div>
                                    <div className="py-3 px-4 text-center">Asistencia</div>
                                </div>

                                {/* Filas de Datos */}
                                <div className="divide-y divide-gray-700/50">
                                    {alumnos.map(alumno => (
                                        <AlumnoAsistenciaRow
                                            key={alumno.id}
                                            alumno={alumno}
                                            onUpdateStatus={handleUpdateStatus}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* COLUMNA DERECHA: Calendario (ocupa 1/3) */}
                <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col h-full">

                    {/* Header del Calendario */}
                    <div className="flex justify-between items-center mb-6">
                        <button
                            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                            onClick={() => console.log('Anterior Mes')}
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-200" />
                        </button>
                        <h3 className="text-xl font-semibold text-white">{currentMonth}</h3>
                        <button
                            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                            onClick={() => console.log('Siguiente Mes')}
                        >
                            <ChevronRight className="w-5 h-5 text-gray-200" />
                        </button>
                    </div>

                    {/* Días del Calendario (Grid 7xN) */}
                    <div className="grid grid-cols-7 gap-2 text-xs text-center flex-grow">
                        {/* Nombres de los días (Mockup simplificado, asumiendo inicio en Lunes o Domingo) */}
                        <span className="text-gray-400 font-medium">D</span>
                        <span className="text-gray-400 font-medium">L</span>
                        <span className="text-gray-400 font-medium">M</span>
                        <span className="text-gray-400 font-medium">X</span>
                        <span className="text-gray-400 font-medium">J</span>
                        <span className="text-gray-400 font-medium">V</span>
                        <span className="text-gray-400 font-medium">S</span>

                        {/* Relleno para que Enero empiece en el día correcto (Ejemplo: Enero 1, 2026 fue Jueves) */}
                        {/* Simularemos que el mes empieza un Lunes para la estética del grid 7xN de la maqueta */}
                        {Array.from({ length: 1 }, (_, i) => i + 1).map((_, index) => (
                            <div key={`empty-${index}`} className="w-10 h-10"></div>
                        ))}

                        {/* Botones de Días */}
                        {daysInMonth.map(day => (
                            <DayButton
                                key={day}
                                day={day}
                                isSelected={day === selectedDate}
                                onClick={() => setSelectedDate(day)}
                            />
                        ))}
                    </div>

                </div>
            </div>

            {/* Botón de Guardar Asistencia (Posicionado en la parte inferior derecha, como en la maqueta) */}
            <div className="fixed bottom-6 right-6 z-10">
                <button
                    onClick={handleGuardarAsistencia}
                    disabled={!isReadyToSave}
                    className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-bold text-white transition-all duration-300 shadow-xl ${isReadyToSave
                            ? 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
                            : 'bg-gray-500 cursor-not-allowed'
                        }`}
                >
                    <Save className="w-5 h-5" />
                    <span>Guardar Asistencia</span>
                </button>
            </div>

        </div>
    );
};