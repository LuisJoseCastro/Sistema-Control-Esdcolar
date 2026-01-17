import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, List, ClipboardList, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface AsignaturaUI {
    nombre: string;
    clave: string;
    horario: string;
    salon: string;
}

interface ClaseUI {
    horaInicio: string;
    horaFin: string;
    asignatura: string;
    dia: string;
}

interface ApiSchedule {
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
}

interface ApiSubject {
    nombre: string;
    codigoMateria: string;
}

interface ApiCourse {
    subject?: ApiSubject;
    salonDefault?: string;
    schedules?: ApiSchedule[];
}

const HorarioSlot: React.FC<{ timeRange: string, content: ClaseUI[] }> = ({ timeRange, content = [] }) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    
    return (
        <div className="flex border-b border-gray-200 last:border-b-0">
            <div className="w-[100px] text-xs py-2 px-1 text-gray-500 bg-gray-50 border-r border-gray-200 flex items-start justify-center text-center font-medium">
                {timeRange}
            </div>
            
            <div className="flex-1 grid grid-cols-7">
                {days.map(day => {
                    const classes = content.filter(c => c.dia === day);
                    return (
                        <div 
                            key={day} 
                            className={`flex flex-col justify-start p-1 text-xs border-r border-gray-200 last:border-r-0 h-full min-h-[50px] ${
                                classes.length > 0 ? 'bg-blue-50' : 'bg-white'
                            }`}
                        >
                            {classes.map((clase, index) => (
                                <div 
                                    key={index} 
                                    className="w-auto h-5 bg-blue-600 text-white font-semibold rounded px-1 py-px mb-1 truncate leading-tight cursor-pointer hover:bg-blue-700 transition-colors shadow-sm"
                                    title={`${clase.asignatura} (${clase.horaInicio}-${clase.horaFin})`}
                                >
                                    {clase.asignatura.split(' ')[0]}... ({clase.horaInicio.slice(0,5)})
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const DocenteDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [asignaturas, setAsignaturas] = useState<AsignaturaUI[]>([]);
    const [horario, setHorario] = useState<ClaseUI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCargaAcademica = async () => {
            if (!token) return;
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_URL}/academic/teacher-load`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!response.ok) {
                    throw new Error("No se pudo conectar con el sistema escolar.");
                }
                
                const data = await response.json();

                if (Array.isArray(data)) {
                    const formattedAsignaturas: AsignaturaUI[] = data.map((item: ApiCourse) => ({
                        nombre: item.subject?.nombre || 'Materia desconocida',
                        clave: item.subject?.codigoMateria || 'N/A', 
                        salon: item.salonDefault || 'N/A',
                        horario: item.schedules?.map((s) => `${s.diaSemana} ${s.horaInicio?.slice(0,5)}`).join(', ') || 'Sin horario'
                    }));

                    const formattedHorario: ClaseUI[] = data.flatMap((item: ApiCourse) => 
                        (item.schedules || []).map((s) => ({
                            horaInicio: s.horaInicio,
                            horaFin: s.horaFin,
                            asignatura: item.subject?.nombre || 'Materia',
                            dia: s.diaSemana
                        }))
                    );

                    setAsignaturas(formattedAsignaturas);
                    setHorario(formattedHorario);
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Error desconocido");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCargaAcademica();
    }, [token]);

    const timeSlots = useMemo(() => [
        '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', 
        '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00'
    ], []);

    const getClasesForSlot = useCallback((slot: string): ClaseUI[] => {
        const slotHour = slot.split(':')[0];
        return horario.filter(clase => clase.horaInicio && clase.horaInicio.startsWith(slotHour));
    }, [horario]);

    const daysHeader = useMemo(() => ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'], []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Sincronizando carga académica...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-800">
            <header className="mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Mi Carga Académica</h1>
                <p className="text-gray-500 mt-1">Gestión de clases y horarios</p>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 flex items-center text-amber-800">
                    <AlertCircle className="w-5 h-5 mr-3" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}
            
            <Card className="mb-8" header={
                <div className="flex items-center">
                    <List className="w-5 h-5 mr-2 text-blue-700" />
                    Lista de Asignaturas
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
                            {asignaturas.length > 0 ? (
                                asignaturas.map((item, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell className="font-semibold text-gray-900">{item.nombre}</Table.Cell>
                                        <Table.Cell className="text-gray-600">{item.clave}</Table.Cell>
                                        <Table.Cell className="text-gray-600 text-xs">{item.horario}</Table.Cell>
                                        <Table.Cell>
                                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{item.salon}</span>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell colSpan={4} className="text-center py-10 text-gray-400">
                                        No se encontraron asignaturas registradas para este docente.
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </Card>

            <Card header={
                <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-700" />
                    Horario Semanal
                </div>
            }>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <div className="min-w-[900px] bg-white">
                        <div className="flex bg-gray-100 text-gray-700 font-bold text-sm border-b border-gray-200">
                            <div className="w-[100px] py-3 text-center border-r border-gray-200">Hora</div>
                            <div className="flex-1 grid grid-cols-7">
                                {daysHeader.map(day => (
                                    <div key={day} className="py-3 text-center border-r border-gray-200 last:border-r-0">{day}</div>
                                ))}
                            </div>
                        </div>

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

            <div className="mt-8 flex justify-end">
                <Button
                    onClick={() => navigate('/docente/calificaciones')}
                    variant="primary"
                    className="shadow-lg hover:shadow-blue-200 transition-all"
                    icon={<ClipboardList className="w-5 h-5" />}
                >
                    Capturar Calificaciones
                </Button>
            </div>
        </div>
    );
};

export default DocenteDashboardPage;