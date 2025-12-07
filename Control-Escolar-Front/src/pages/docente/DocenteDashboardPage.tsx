// src/pages/docente/DocenteDashboardPage.tsx

import React, { useCallback, useMemo } from 'react';
import { Bell, Menu, Home, Calendar, BookOpen, Users, MessageSquare, List, ClipboardList } from 'lucide-react';
// 🛑 NUEVO: Importamos useNavigate de react-router-dom
import { useNavigate } from 'react-router-dom'; 

// 🛑 ELIMINADA LA LÍNEA: import { type DocenteView } from '../../App'; 

// --- Tipos de Datos para la Carga Académica (Mock Data) ---
interface Asignatura {
    nombre: string;
    clave: string;
    horario: string;
    salon: string;
}

interface Clase {
    horaInicio: string;
    horaFin: string;
    asignatura: string;
    dia: 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo';
}

// 🛑 ELIMINADA LA INTERFAZ: DocenteDashboardPageProps


// --- MOCK DATA ---
const MOCK_ASIGNATURAS: Asignatura[] = [
    { nombre: 'Matemáticas Avanzadas', clave: 'MA-234', horario: 'Lunes - Martes 10:00 - 11:30', salon: 'N2' },
    { nombre: 'Español', clave: 'ESP-128', horario: 'Miercoles - Viernes 09:00 - 12:00', salon: 'F3' },
    { nombre: 'Historia', clave: 'HI-256', horario: 'Jueves - Viernes 12:00 - 14:00', salon: 'E4' },
];

const MOCK_HORARIO: Clase[] = [
    // Lunes
    { horaInicio: '10:00', horaFin: '11:30', asignatura: 'Matemáticas Avanzadas (N2)', dia: 'Lunes' },
    // Martes
    { horaInicio: '10:00', horaFin: '11:30', asignatura: 'Matemáticas Avanzadas (N2)', dia: 'Martes' },
    // Miércoles
    { horaInicio: '09:00', horaFin: '12:00', asignatura: 'Español (F3)', dia: 'Miercoles' },
    // Jueves
    { horaInicio: '12:00', horaFin: '14:00', asignatura: 'Historia (E4)', dia: 'Jueves' },
    { horaInicio: '09:00', horaFin: '12:00', asignatura: 'Español (F3)', dia: 'Viernes' },
    { horaInicio: '12:00', horaFin: '14:00', asignatura: 'Historia (E4)', dia: 'Viernes' },
];

// --- COMPONENTES ATÓMICOS (Incrustados para simplicidad) ---

// Componente para la Fila de la Tabla de Asignaturas
const AsignaturaRow: React.FC<{ asignatura: Asignatura, isHeader?: boolean }> = ({ asignatura, isHeader = false }) => {
// ... (AsignaturaRow sin cambios) ...
    const baseClasses = "py-3 px-4 border-b border-gray-600 truncate";
    const headerClasses = "bg-gray-700 text-gray-100 font-semibold text-left";
    const rowClasses = "text-gray-200";

    return (
        <div className={`grid grid-cols-4 ${isHeader ? headerClasses : rowClasses} text-sm`}>
            <div className={`${baseClasses} col-span-1`}>{asignatura.nombre}</div>
            <div className={`${baseClasses} col-span-1`}>{asignatura.clave}</div>
            <div className={`${baseClasses} col-span-1`}>{asignatura.horario}</div>
            <div className={`${baseClasses} col-span-1 border-b-0`}>{asignatura.salon}</div>
        </div>
    );
};

// Componente para la Celda de Horario
const HorarioSlot: React.FC<{ timeRange: string, content?: Clase[] }> = ({ timeRange, content = [] }) => {
// ... (HorarioSlot sin cambios) ...
    // Lista de los 7 días (Domingo a Sábado) para el mapeo
    const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    
    return (
        <div className="flex border-b border-gray-600 last:border-b-0">
            {/* Columna de la Hora */}
            <div className="w-[100px] text-xs py-2 px-1 text-gray-400 border-r border-gray-600 flex items-start justify-center text-center">
                {timeRange}
            </div>
            
            {/* Celdas de los Días */}
            <div className="flex-1 grid grid-cols-7">
                {days.map(day => {
                    const classes = content.filter(c => c.dia === day);
                    return (
                        <div 
                            key={day} 
                            className={`flex flex-col justify-start p-1 text-xs border-r border-gray-600 last:border-r-0 h-full ${
                                classes.length > 0 ? 'bg-blue-900/40' : 'bg-gray-800'
                            }`}
                        >
                            {classes.map((clase, index) => (
                                <div key={index} className="bg-blue-700/80 text-white rounded px-1 py-[1px] mb-1 truncate leading-tight cursor-pointer hover:bg-blue-600 transition-colors">
                                    {clase.asignatura} ({clase.horaInicio}-{clase.horaFin})
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


// --- PÁGINA PRINCIPAL DocenteDashboardPage (Carga Académica - Inicio) ---
// 🛑 Componente principal sin props
const DocenteDashboardPage: React.FC = () => {
    // 🛑 Hook de React Router DOM
    const navigate = useNavigate();
    
    // Rango de horas para el horario (como en la maqueta)
    const timeSlots = [
        '06:00 - 07:00',
        '07:00 - 08:00', 
        '08:00 - 09:00',
        '09:00 - 10:00', 
        '10:00 - 11:00', 
        '11:00 - 12:00', 
        '12:00 - 13:00', 
        '13:00 - 14:00', 
        '14:00 - 15:00', 
        // Puedes extender esto según la necesidad
    ];

    // Función para obtener las clases que caen dentro de un rango de tiempo específico
    // Esta es una simplificación visual que funciona para el mock.
    const getClasesForSlot = useCallback((slot: string): Clase[] => {
        const [timeStartStr] = slot.split(' - ');
        
        const slotStartHour = parseInt(timeStartStr.split(':')[0]);

        return MOCK_HORARIO.filter(clase => {
            const claseStartHour = parseInt(clase.horaInicio.split(':')[0]);
            // Comprueba si la hora de inicio de la clase coincide con el slot
            return claseStartHour === slotStartHour; 
        });
        
    }, []);

    // Encabezados de los días
    const daysHeader = useMemo(() => ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'], []);

    return (
        <div className="p-4 md:p-8 bg-gray-900 text-gray-100 min-h-full">
            
            {/* Header del Contenido Principal (Simulando la parte superior derecha de la maqueta) */}
            <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-serif italic text-white">Mi Carga Académica</h1>
                <div className="flex items-center space-x-4">
                    {/* Icono de Campana de Notificaciones (Podríamos usar un componente UserHeaderIcons adaptado al Docente aquí) */}
                    <Bell className="w-6 h-6 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors" 
                        onClick={() => navigate('/docente/mensajes')}
                    />
                    {/* Icono de Menú para dispositivos móviles (si Sidebar fuera colapsable) */}
                    <Menu className="w-6 h-6 text-gray-400 md:hidden cursor-pointer hover:text-gray-300 transition-colors" />
                </div>
            </header>
            
            <p className="text-gray-400 mb-8 text-lg">
                Consulta tus planes de estudio, asignaturas y horarios
            </p>

            {/* 1. SECCIÓN DE ASIGNATURAS */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl mb-10">
                <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
                    <List className="w-5 h-5 mr-2" />
                    Asignaturas Actuales
                </h2>
                
                {/* Tabla de Asignaturas (Estilo Maqueta) */}
                <div className="overflow-x-auto rounded-lg">
                    <div className="min-w-full divide-y divide-gray-700">
                        {/* Fila de Encabezados */}
                        <AsignaturaRow 
                            isHeader 
                            asignatura={{ 
                                nombre: 'Asignaturas', 
                                clave: 'Clave', 
                                horario: 'Horario', 
                                salon: 'Salón' 
                            }} 
                        />
                        {/* Filas de Datos */}
                        {MOCK_ASIGNATURAS.map((item, index) => (
                            <AsignaturaRow key={index} asignatura={item} />
                        ))}
                    </div>
                </div>
            </div>


            {/* 2. SECCIÓN DE HORARIO SEMANAL */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
                <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Horario Semanal
                </h2>
                
                {/* Contenedor del Horario (Scrollable horizontalmente si es necesario) */}
                <div className="overflow-x-auto rounded-lg border border-gray-600">
                    <div className="min-w-[800px] bg-gray-800">
                        
                        {/* Encabezados de los Días */}
                        <div className="flex bg-gray-700 text-gray-100 font-semibold text-sm border-b border-gray-600">
                            {/* Celda de hora vacía */}
                            <div className="w-[100px] py-2 px-1 text-center border-r border-gray-600">Hora</div>
                            {/* Días de la Semana */}
                            <div className="flex-1 grid grid-cols-7">
                                {daysHeader.map(day => (
                                    <div key={day} className="py-2 px-1 text-center border-r border-gray-600 last:border-r-0">{day}</div>
                                ))}
                            </div>
                        </div>

                        {/* Slots de Horario */}
                        {timeSlots.map((slot, index) => (
                            <HorarioSlot 
                                key={index} 
                                timeRange={slot} 
                                content={getClasesForSlot(slot)} 
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Botones de acción opcional, navegando con el hook useNavigate */}
            <div className="mt-8 flex justify-end">
                <button
                    onClick={() => navigate('/docente/calificaciones')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg transition duration-150 shadow-md flex items-center gap-2"
                >
                    <ClipboardList className="w-5 h-5" />
                    Capturar Calificaciones
                </button>
            </div>

        </div>
    );
};

export default DocenteDashboardPage;