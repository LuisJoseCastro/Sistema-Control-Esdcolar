import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { CalendarCheck, Save, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🛑 IMPORTACIONES DE COMPONENTES ATÓMICOS
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Table, { TableRow, TableCell, TableHead } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';

// ⚠️ CONFIGURACIÓN API
// Si estás usando Tailscale, cambia localhost por la IP del líder
const API_URL = 'http://localhost:3000';

// --- Tipos de Datos ---
type AsistenciaStatus = 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADA' | 'RETARDO';

interface AlumnoAsistencia {
    id: string; // ID de la inscripción
    nombre: string;
    status: AsistenciaStatus;
}

interface Grupo {
    id: string;
    nombre: string;
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
    const token = localStorage.getItem('token');

    // Lógica de Fecha Dinámica
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());

    // Estado de Datos Reales (Inicializados como array vacío para evitar pantalla blanca)
    const [grupos, setGrupos] = useState<Grupo[]>([]);
    const [selectedGrupo, setSelectedGrupo] = useState<string>('');
    const [alumnos, setAlumnos] = useState<AlumnoAsistencia[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // 1. CARGAR GRUPOS AL INICIO (Backend)
    useEffect(() => {
        fetch(`${API_URL}/academic/groups`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Error al conectar con API');
                return res.json();
            })
            .then(data => {
                // Validación segura: si data no es array, usamos []
                if (Array.isArray(data)) {
                    setGrupos(data);
                } else {
                    console.error("Formato incorrecto de grupos:", data);
                    setGrupos([]);
                }
            })
            .catch(err => {
                console.error("Error cargando grupos", err);
                setGrupos([]); // Fallback seguro
            });
    }, [token]);

    // 2. CARGAR ALUMNOS CUANDO SELECCIONAS GRUPO (Backend)
    useEffect(() => {
        if (!selectedGrupo) {
            setAlumnos([]);
            return;
        }

        setIsLoading(true);
        setErrorMsg(null);

        fetch(`${API_URL}/academic/attendance/students/${selectedGrupo}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Mapeamos la respuesta del Enrollment a la interfaz visual
                    const mappedAlumnos = data.map((enrollment: any) => ({
                        id: enrollment.id, // Importante: ID de la inscripción
                        nombre: enrollment.student.user?.fullName || "Sin Nombre Registrado",
                        status: 'PRESENTE' as AsistenciaStatus // Estado por defecto al cargar
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

    // 3. GUARDAR ASISTENCIA EN BASE DE DATOS
    const handleGuardarAsistencia = async () => {
        if (!selectedGrupo) return;
        setIsLoading(true);

        // Construir fecha en formato YYYY-MM-DD
        const fechaStr = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`;

        const payload = {
            grupoId: selectedGrupo,
            fecha: fechaStr,
            asistencias: alumnos.map(a => ({ studentId: a.id, status: a.status }))
        };

        try {
            const res = await fetch(`${API_URL}/academic/attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('✅ Asistencia guardada correctamente en BD.');
            } else {
                alert('❌ Error al guardar. Asegúrate de tener conexión.');
            }
        } catch (error) {
            console.error(error);
            alert('Error de red al intentar guardar.');
        } finally {
            setIsLoading(false);
        }
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
                        {/* 🛑 AQUI ESTÁ EL CAMBIO: El Select siempre se renderiza, aunque grupos esté vacío */}
                        <Select
                            label="Grupo"
                            value={selectedGrupo}
                            onChange={(e) => setSelectedGrupo(e.target.value)}
                            // Si no hay grupos, mostramos un mensaje en el placeholder
                            placeholder={grupos.length === 0 ? "No hay grupos asignados" : "Seleccionar un grupo"}
                            // Safe mapping: si grupos es [], map devuelve [] sin explotar
                            options={grupos.map(g => ({ value: g.id, label: g.nombre }))}
                        />
                        {grupos.length === 0 && (
                            <p className="mt-2 text-xs text-gray-500">
                                No se encontraron grupos cargados.
                            </p>
                        )}
                    </Card>

                    <Card header="Lista de Estudiantes">
                        {errorMsg && (
                            <div className="bg-red-50 text-red-700 p-3 mb-4 rounded-md text-sm border border-red-200">
                                {errorMsg}
                            </div>
                        )}

                        <Table>
                            <Table.Header>
                                <TableRow>
                                    <TableHead>Nombre Completo</TableHead>
                                    <TableHead className="text-center">Asistencia</TableHead>
                                </TableRow>
                            </Table.Header>
                            <Table.Body>
                                {selectedGrupo ? (
                                    Array.isArray(alumnos) && alumnos.length > 0 ? (
                                        alumnos.map(alumno => (
                                            <AlumnoAsistenciaRow key={alumno.id} alumno={alumno} onUpdateStatus={handleUpdateStatus} />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center py-10 text-gray-400">
                                                {isLoading ? "Cargando alumnos..." : "No hay alumnos inscritos en este grupo."}
                                            </TableCell>
                                        </TableRow>
                                    )
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
                        <Button
                            variant='secondary'
                            onClick={() => changeMonth(-1)}
                            className="p-2 rounded-full h-9 w-9"
                            icon={<ChevronLeft className="w-5 h-5" />}
                        >
                            {""}
                        </Button>

                        <h3 className="font-bold text-gray-700">{monthLabel}</h3>

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
                            Registrando para el: <br />
                            <strong>{selectedDate} de {monthLabel}</strong>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};