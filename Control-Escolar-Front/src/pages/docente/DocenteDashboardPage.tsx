import React, { useCallback, useMemo } from 'react';
import { Calendar, List, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Importación de componentes atómicos (RUTAS CORREGIDAS: de ../../components/ui/... a ../../ui/...)
// Asumo que el archivo DocenteDashboardPage.tsx se encuentra en src/pages/docente/
// y los componentes UI se encuentran en src/components/ui/
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table'; // Importación de componente compuesto

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

// --- COMPONENTE INTERNO DE HORARIO (Ajustado a tema claro) ---

/**
 * Componente para un slot de tiempo en la matriz del horario.
 */
const HorarioSlot: React.FC<{ timeRange: string, content: Clase[] }> = ({ timeRange, content = [] }) => {
    // Lista de los 7 días (Domingo a Sábado) para el mapeo
    const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    
    return (
        <div className="flex border-b border-gray-200 last:border-b-0">
            {/* Columna de la Hora */}
            <div className="w-[100px] text-xs py-2 px-1 text-gray-500 bg-gray-50 border-r border-gray-200 flex items-start justify-center text-center font-medium">
                {timeRange}
            </div>
            
            {/* Celdas de los Días */}
            <div className="flex-1 grid grid-cols-7">
                {days.map(day => {
                    const classes = content.filter(c => c.dia === day);
                    return (
                        <div 
                            key={day} 
                            // Estilos para celda vacía/con clase (ajustados a un tema claro más profesional)
                            className={`flex flex-col justify-start p-1 text-xs border-r border-gray-200 last:border-r-0 h-full min-h-[50px] ${
                                classes.length > 0 ? 'bg-blue-50' : 'bg-white'
                            }`}
                        >
                            {classes.map((clase, index) => (
                                <div 
                                    key={index} 
                                    className="w-auto h-5 bg-grayLight-400 text-white font-semibold rounded px-1 py-px mb-1 truncate leading-tight cursor-pointer hover:bg-grayLight-500 transition-colors shadow-sm"
                                    title={`${clase.asignatura} (${clase.horaInicio}-${clase.horaFin})`}
                                >
                                    {/* Muestra la abreviatura o el nombre completo si hay espacio */}
                                    {clase.asignatura.split(' ')[0]}... ({clase.horaInicio})
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
const DocenteDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    
    // Rango de horas para el horario
    const timeSlots = useMemo(() => [
        '06:00 - 07:00',
        '07:00 - 08:00', 
        '08:00 - 09:00',
        '09:00 - 10:00', 
        '10:00 - 11:00', 
        '11:00 - 12:00', 
        '12:00 - 13:00', 
        '13:00 - 14:00', 
        '14:00 - 15:00', 
    ], []);

    // Función para obtener las clases que caen dentro de un rango de tiempo específico
    const getClasesForSlot = useCallback((slot: string): Clase[] => {
        const [timeStartStr] = slot.split(' - ');
        
        // Asumiendo que las horas de inicio de las clases son horas enteras para el mock
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
        // Se utiliza un fondo claro para toda la página, asumiendo que el layout ya lo tiene o lo necesita.
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-800">
            
            {/* Header del Contenido Principal */}
            <header className="mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Mi Carga Académica</h1>
                <p className="text-gray-500 mt-1">
                    Consulta tus asignaturas y horarios
                </p>
            </header>
            
            {/* 1. SECCIÓN DE ASIGNATURAS (Usando Card y Table) */}
            <Card className="mb-8" variant="default" header={
                <div className="flex items-center">
                    <List className="w-5 h-5 mr-2 text-main-900" />
                    Asignaturas Actuales
                </div>
            }>
                <div className="overflow-x-auto">
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.Head>Asignaturas</Table.Head>
                                <Table.Head>Clave</Table.Head>
                                <Table.Head>Horario</Table.Head>
                                <Table.Head>Salón</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {MOCK_ASIGNATURAS.map((item, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell className="font-semibold text-gray-900">{item.nombre}</Table.Cell>
                                    <Table.Cell className="text-gray-600">{item.clave}</Table.Cell>
                                    <Table.Cell className="text-gray-600">{item.horario}</Table.Cell>
                                    <Table.Cell>
                                        <span className="bg-grayLight-300 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{item.salon}</span>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </Card>


            {/* 2. SECCIÓN DE HORARIO SEMANAL (Usando Card) */}
            <Card header={
                <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-main-900" />
                    Horario Semanal
                </div>
            }>
                {/* Contenedor del Horario (Scrollable horizontalmente si es necesario) */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-inner">
                    <div className="min-w-[800px] bg-white">
                        
                        {/* Encabezados de los Días */}
                        <div className="flex bg-gray-100 text-gray-700 font-semibold text-sm border-b border-gray-200">
                            {/* Celda de hora vacía */}
                            <div className="w-[100px] py-2 px-1 text-center border-r border-gray-200">Hora</div>
                            {/* Días de la Semana */}
                            <div className="flex-1 grid grid-cols-7">
                                {daysHeader.map(day => (
                                    <div key={day} className="py-2 px-1 text-center border-r border-gray-200 last:border-r-0">{day}</div>
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
            </Card>

            {/* Botón de acción (Usando Button) */}
            <div className="mt-8 flex justify-end">
                <Button
                    onClick={() => navigate('/docente/calificaciones')}
                    variant="primary" // Se ajusta al color azul de tu botón original
                    icon={<ClipboardList className="w-5 h-5" />}
                >
                    Capturar Calificaciones
                </Button>
            </div>

        </div>
    );
};

export default DocenteDashboardPage;