import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { CalendarCheck, Save, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Table, { TableRow, TableCell, TableHead } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

interface ApiEnrollment {
    id: string;
    student: {
        user?: {
            fullName: string;
        }
    }
}

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
            <TableCell className="font-medium text-gray-900 truncate">{alumno.nombre}</TableCell>
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
            className={`w-10 h-10 p-0 rounded-lg font-bold transition-all duration-150 ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} ${isToday && !isSelected ? 'border-2 border-blue-500' : ''}`}
        >
            {day}
        </Button>
    );
};

export const DocenteAsistenciaPage: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [viewDate, setViewDate] = useState(new Date()); 
    const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
    const [grupos, setGrupos] = useState<Grupo[]>([]);
    const [selectedGrupo, setSelectedGrupo] = useState<string>('');
    const [alumnos, setAlumnos] = useState<AlumnoAsistencia[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;
        
        fetch(`${API_URL}/academic/groups`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then((data: unknown) => {
            if (Array.isArray(data)) {
                setGrupos(data as Grupo[]); 
            } else {
                setGrupos([]);
            }
        })
        .catch(err => {
            console.error(err);
            setGrupos([]);
        });
    }, [token]);

    useEffect(() => {
        if (!selectedGrupo || !token) {
            setAlumnos([]);
            return;
        }
        
        setIsLoading(true);
        setErrorMsg(null);

        fetch(`${API_URL}/academic/attendance/students/${selectedGrupo}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then((data: unknown) => {
            if (Array.isArray(data)) {
                const mappedAlumnos = data.map((enrollment: ApiEnrollment) => ({
                    id: enrollment.id,
                    nombre: enrollment.student.user?.fullName || "Sin Nombre Registrado",
                    status: 'PRESENTE' as AsistenciaStatus
                }));
                setAlumnos(mappedAlumnos);
            } else {
                setAlumnos([]);
            }
        })
        .catch(err => {
            console.error(err);
            setErrorMsg("No se pudieron cargar los alumnos.");
            setAlumnos([]);
        })
        .finally(() => setIsLoading(false));
    }, [selectedGrupo, token]);

    const { daysInMonth, firstDayOffset, monthLabel, isCurrentMonth } = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const offset = new Date(year, month, 1).getDay();
        const label = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(viewDate);
        return {
            daysInMonth: Array.from({ length: totalDays }, (_, i) => i + 1),
            firstDayOffset: offset,
            monthLabel: label.charAt(0).toUpperCase() + label.slice(1),
            isCurrentMonth: new Date().getMonth() === month && new Date().getFullYear() === year
        };
    }, [viewDate]);

    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
        setViewDate(newDate);
    };

    const handleUpdateStatus = useCallback((id: string, status: AsistenciaStatus) => {
        setAlumnos(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    }, []);

    const handleGuardarAsistencia = async () => {
        if (!selectedGrupo || !token) return;
        setIsLoading(true);
        const fechaStr = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`;
        const payload = {
            grupoId: selectedGrupo,
            fecha: fechaStr,
            asistencias: alumnos.map(a => ({ studentId: a.id, status: a.status }))
        };

        try {
            const res = await fetch(`${API_URL}/academic/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (res.ok) alert('Asistencia guardada');
            else alert('Error al guardar asistencia');
        } catch { alert('Error de red'); } 
        finally { setIsLoading(false); }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <header className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center"><CalendarCheck className="w-7 h-7 mr-3 text-blue-600" />Registro de Asistencia</h1>
                <Button variant='ghost' onClick={() => navigate(-1)} icon={<ArrowLeft className="w-4 h-4" />}>Volver</Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card header="Configuración">
                        <Select label="Grupo" value={selectedGrupo} onChange={(e) => setSelectedGrupo(e.target.value)} placeholder={grupos.length === 0 ? "Seleccionar un grupo" : "Seleccionar un grupo"} options={grupos.map(g => ({ value: g.id, label: g.nombre }))} />
                    </Card>
                    <Card header="Lista de Estudiantes">
                        {errorMsg && <div className="bg-red-50 text-red-700 p-3 mb-4 rounded-md text-sm">{errorMsg}</div>}
                        <Table>
                            <Table.Header><TableRow><TableHead>Nombre Completo</TableHead><TableHead className="text-center">Asistencia</TableHead></TableRow></Table.Header>
                            <Table.Body>
                                {selectedGrupo ? (alumnos.length > 0 ? alumnos.map(al => <AlumnoAsistenciaRow key={al.id} alumno={al} onUpdateStatus={handleUpdateStatus} />) : <TableRow><TableCell colSpan={2} className="text-center py-10 text-gray-400">No hay alumnos.</TableCell></TableRow>) : <TableRow><TableCell colSpan={2} className="text-center py-10 text-gray-400">Selecciona un grupo.</TableCell></TableRow>}
                            </Table.Body>
                        </Table>
                    </Card>
                    {selectedGrupo && <Button variant='primary' onClick={handleGuardarAsistencia} isLoading={isLoading} icon={<Save className="w-5 h-5" />}>Guardar Asistencia</Button>}
                </div>
                <Card header="Fecha de Registro">
                    <div className="flex justify-between items-center mb-6">
                        <Button variant='secondary' onClick={() => changeMonth(-1)} className="p-2 rounded-full h-9 w-9" icon={<ChevronLeft className="w-5 h-5" />}>{""}</Button>
                        <h3 className="font-bold text-gray-700">{monthLabel}</h3>
                        <Button variant='secondary' onClick={() => changeMonth(1)} className="p-2 rounded-full h-9 w-9" icon={<ChevronRight className="w-5 h-5" />}>{""}</Button>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                            <span key={i} className="text-xs font-black text-gray-400 mb-2">{d}</span>
                        ))}
                        {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`empty-${i}`} />)}
                        {daysInMonth.map(day => <DayButton key={day} day={day} isSelected={day === selectedDate} isToday={isCurrentMonth && day === new Date().getDate()} onClick={() => setSelectedDate(day)} />)}
                    </div>
                    <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100"><p className="text-sm text-blue-800 text-center">Registrando para el: <br/><strong>{selectedDate} de {monthLabel}</strong></p></div>
                </Card>
            </div>
        </div>
    );
};