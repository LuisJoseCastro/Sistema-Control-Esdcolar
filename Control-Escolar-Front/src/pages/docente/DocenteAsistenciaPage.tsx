import React, { useState, useCallback, useMemo } from 'react';
import { CalendarCheck, Save, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🛑 IMPORTACIONES DE COMPONENTES ATÓMICOS
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Table, { TableRow, TableCell, TableHead } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';

// --- Tipos de Datos ---
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

const STATUS_BADGE_VARIANT: Record<AsistenciaStatus, string> = {
    PRESENTE: 'text-green-800',
    AUSENTE: 'text-red-800',
    JUSTIFICADA: 'text-yellow-800',
    RETARDO: 'text-blue-800',
};

const STATUS_LABELS: Record<AsistenciaStatus, string> = {
    PRESENTE: 'Presente',
    AUSENTE: 'Ausente',
    JUSTIFICADA: 'Falta Justificada',
    RETARDO: 'Retardo',
};

// --- Componentes Atómicos Específicos ---

const AlumnoAsistenciaRow: React.FC<{
    alumno: AlumnoAsistencia;
    onUpdateStatus: (id: string, status: AsistenciaStatus) => void;
}> = ({ alumno, onUpdateStatus }) => {
    const statusOptions = (Object.keys(STATUS_LABELS) as AsistenciaStatus[]).map(status => ({
        value: status,
        label: STATUS_LABELS[status],
    }));

    return (
        <TableRow>
            <TableCell className="font-medium text-gray-900 truncate">
                {alumno.nombre}
            </TableCell>
            <TableCell className="w-[180px]">
                <Select
                    value={alumno.status}
                    onChange={(e) => onUpdateStatus(alumno.id, e.target.value as AsistenciaStatus)}
                    selectClassName={`bg-white border-gray-300 py-1 px-2 rounded-full text-sm font-semibold text-center ${STATUS_BADGE_VARIANT[alumno.status]}`}
                    className="p-0 m-0 w-full"
                    options={statusOptions}
                />
            </TableCell>
        </TableRow>
    );
};

const DayButton: React.FC<{ day: number, isSelected: boolean, isToday: boolean, onClick: () => void }> = ({ day, isSelected, isToday, onClick }) => {
    return (
        <Button
            onClick={onClick}
            variant='secondary'
            className={`w-10 h-10 p-0 rounded-lg font-bold transition-all duration-150 
                ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
                ${isToday && !isSelected ? 'border-2 border-blue-500' : ''}`}
        >
            {day}
        </Button>
    );
};

// --- PÁGINA PRINCIPAL ---
export const DocenteAsistenciaPage: React.FC = () => {
    const navigate = useNavigate();

    // Lógica de Fecha Dinámica
    const [viewDate, setViewDate] = useState(new Date()); 
    const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
    
    const [selectedGrupo, setSelectedGrupo] = useState<string>('');
    const [alumnos, setAlumnos] = useState<AlumnoAsistencia[]>(MOCK_ALUMNOS);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Cálculos del Calendario
    const { daysInMonth, firstDayOffset, monthLabel, isCurrentMonth } = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        
        const totalDays = new Date(year, month + 1, 0).getDate();
        const offset = new Date(year, month, 1).getDay();
        const label = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(viewDate);
        const current = new Date().getMonth() === month && new Date().getFullYear() === year;

        return {
            daysInMonth: Array.from({ length: totalDays }, (_, i) => i + 1),
            firstDayOffset: offset,
            monthLabel: label.charAt(0).toUpperCase() + label.slice(1),
            isCurrentMonth: current
        };
    }, [viewDate]);

    // Navegación de meses
    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
        setViewDate(newDate);
    };

    const handleUpdateStatus = useCallback((id: string, status: AsistenciaStatus) => {
        setAlumnos(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    }, []);

    const handleGuardarAsistencia = () => {
        if (!selectedGrupo) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert('Asistencia guardada correctamente.');
        }, 1000);
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <header className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <CalendarCheck className="w-7 h-7 mr-3 text-blue-600" />
                    Registro de Asistencia
                </h1>
                <Button variant='ghost' onClick={() => navigate(-1)} icon={<ArrowLeft className="w-4 h-4" />}>
                    Volver
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Estudiantes */}
                <div className="lg:col-span-2 space-y-8">
                    <Card header="Configuración">
                        <Select
                            label="Grupo"
                            value={selectedGrupo}
                            onChange={(e) => setSelectedGrupo(e.target.value)}
                            placeholder="Seleccionar un grupo"
                            options={MOCK_GRUPOS.map(g => ({ value: g.id, label: g.nombre }))}
                        />
                    </Card>

                    <Card header="Lista de Estudiantes">
                        <Table>
                            <Table.Header>
                                <TableRow>
                                    <TableHead>Nombre Completo</TableHead>
                                    <TableHead className="text-center">Asistencia</TableHead>
                                </TableRow>
                            </Table.Header>
                            <Table.Body>
                                {selectedGrupo ? (
                                    alumnos.map(alumno => (
                                        <AlumnoAsistenciaRow key={alumno.id} alumno={alumno} onUpdateStatus={handleUpdateStatus} />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center py-10 text-gray-400">
                                            Selecciona un grupo para cargar la lista.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Table.Body>
                        </Table>
                    </Card>

                    {selectedGrupo && (
                        <Button variant='primary' onClick={handleGuardarAsistencia} isLoading={isLoading} icon={<Save className="w-5 h-5" />}>
                            Guardar Asistencia
                        </Button>
                    )}
                </div>

                {/* Columna Calendario */}
                <Card header="Fecha de Registro">
                    <div className="flex justify-between items-center mb-6">
                        {/* 🛑 FIX: Se agregó {""} para cumplir con la propiedad children obligatoria */}
                        <Button 
                            variant='secondary' 
                            onClick={() => changeMonth(-1)} 
                            className="p-2 rounded-full h-9 w-9" 
                            icon={<ChevronLeft className="w-5 h-5" />}
                        >
                            {""}
                        </Button>
                        
                        <h3 className="font-bold text-gray-700">{monthLabel}</h3>
                        
                        {/* 🛑 FIX: Se agregó {""} para cumplir con la propiedad children obligatoria */}
                        <Button 
                            variant='secondary' 
                            onClick={() => changeMonth(1)} 
                            className="p-2 rounded-full h-9 w-9" 
                            icon={<ChevronRight className="w-5 h-5" />}
                        >
                            {""}
                        </Button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center">
                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
                            <span key={d} className="text-xs font-black text-gray-400 mb-2">{d}</span>
                        ))}
                        
                        {Array.from({ length: firstDayOffset }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}

                        {daysInMonth.map(day => (
                            <DayButton
                                key={day}
                                day={day}
                                isSelected={day === selectedDate}
                                isToday={isCurrentMonth && day === new Date().getDate()}
                                onClick={() => setSelectedDate(day)}
                            />
                        ))}
                    </div>
                    <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-800 text-center">
                            Registrando para el: <br/>
                            <strong>{selectedDate} de {monthLabel}</strong>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};