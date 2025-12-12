// src/pages/admin/AdminDocenteProfilePage.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Edit, BookOpen, Clock, PlusCircle, Trash2 } from 'lucide-react'; 

// Importación de Componentes UI
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal'; 

// Servicio y Tipos
import { getDocenteProfileById } from '../../services/admin.service';
import { type DocenteProfile, type MateriaAsignada, type HorarioType } from '../../types/models';

// Interfaz local para combinar materia con su franja horaria (usada en el modal)
interface MateriaHorarioItem extends MateriaAsignada {
    day?: 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes';
    timeStart?: string; // Ejemplo: '08:00'
    timeEnd?: string;   // Ejemplo: '10:00'
    // 🛑 Añadimos una clave única para la tabla del modal para la edición
    scheduleKey: string; 
}


// ... (PersonalDataModal - Sin cambios de lógica, solo copiado para completar el archivo) ...

interface PersonalDataModalProps {
    profile: DocenteProfile;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newProfile: DocenteProfile) => void; 
}

const PersonalDataModal: React.FC<PersonalDataModalProps> = ({ profile, isOpen, onClose, onSave }) => {
    const [isEditing, setIsEditing] = useState(false); 

    const [clave, setClave] = useState(profile.clave); 
    const [nombre, setNombre] = useState(profile.nombre);
    const [email, setEmail] = useState(profile.email);
    const [telefono, setTelefono] = useState(profile.telefono);
    const [especialidad, setEspecialidad] = useState(profile.especialidad);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setClave(profile.clave);
            setNombre(profile.nombre);
            setEmail(profile.email);
            setTelefono(profile.telefono);
            setEspecialidad(profile.especialidad);
            setIsEditing(false); 
        }
    }, [isOpen, profile]);


    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        await new Promise(resolve => setTimeout(resolve, 800));

        const updatedProfile: DocenteProfile = { 
            ...profile, 
            clave, 
            nombre, 
            email, 
            telefono, 
            especialidad 
        };
        
        onSave(updatedProfile); 
        setIsSaving(false);
        setIsEditing(false); 
        onClose(); 
    };

    const fields = [
        { label: 'Clave Institucional', value: clave, setter: setClave, key: 'clave', type: 'text', required: true }, 
        { label: 'Nombre Completo', value: nombre, setter: setNombre, key: 'nombre', type: 'text', required: true },
        { label: 'Correo Electrónico', value: email, setter: setEmail, key: 'email', type: 'email', required: true },
        { label: 'Teléfono', value: telefono, setter: setTelefono, key: 'telefono', type: 'tel', required: false },
        { label: 'Especialidad', value: especialidad, setter: setEspecialidad, key: 'especialidad', type: 'text', required: false },
    ];
    
    const readOnlyInputClasses = "mt-1 block w-full rounded-md p-2 bg-gray-100 text-gray-700 border border-gray-300";


    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isEditing ? "Modificando Datos Personales" : "Vista de Datos Personales"} 
            size="sm"
        >
            <form onSubmit={handleSave} className="space-y-4">
                
                {fields.map((field) => (
                    <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                        
                        {!isEditing ? (
                            <p className={`${readOnlyInputClasses} ${field.key === 'clave' ? 'font-mono bg-yellow-50 text-purple-700 border-purple-200' : ''}`}>
                                {field.value || "No especificado"}
                            </p>
                        ) : (
                            <input
                                type={field.type}
                                value={field.value}
                                onChange={(e) => field.setter?.(e.target.value)}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${field.key === 'clave' ? 'font-mono' : ''}`}
                                required={field.required}
                                disabled={isSaving}
                            />
                        )}
                    </div>
                ))}

                <div className="flex justify-end pt-4 border-t gap-3">
                    
                    {!isEditing && (
                        <>
                             <Button 
                                type="button" 
                                variant="secondary" 
                                onClick={onClose} 
                            >
                                Cerrar
                            </Button>
                            <Button 
                                type="button" 
                                variant="primary" 
                                onClick={() => setIsEditing(true)} 
                                icon={<Edit size={20} />}
                            >
                                Activar Edición
                            </Button>
                        </>
                    )}
                    
                    {isEditing && (
                        <>
                            <Button 
                                type="button" 
                                variant="secondary" 
                                onClick={() => {
                                    setClave(profile.clave); 
                                    setNombre(profile.nombre);
                                    setEmail(profile.email);
                                    setTelefono(profile.telefono);
                                    setEspecialidad(profile.especialidad);
                                    setIsEditing(false); 
                                }} 
                                disabled={isSaving}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                variant="primary" 
                                isLoading={isSaving} 
                                disabled={isSaving}
                            >
                                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </>
                    )}
                </div>
            </form>
        </Modal>
    );
};


// =========================================================
// 2. Componente Modal: Materias Asignadas (FORMULARIO DE EDICIÓN CON HORARIO)
// =========================================================
interface AssignedSubjectsModalProps {
    profile: DocenteProfile; 
    onSave: (newProfile: DocenteProfile) => void; 
    isOpen: boolean;
    onClose: () => void;
}

const AssignedSubjectsModal: React.FC<AssignedSubjectsModalProps> = ({ profile, onSave, isOpen, onClose }) => {
    const [localSchedule, setLocalSchedule] = useState<MateriaHorarioItem[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    
    // Estados para la nueva entrada
    const [newMateriaNombre, setNewMateriaNombre] = useState('');
    const [newMateriaGrupo, setNewMateriaGrupo] = useState('');
    const [newDay, setNewDay] = useState<'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes'>('Lunes');
    // 🛑 NUEVOS ESTADOS DE TIEMPO
    const [newTimeStart, setNewTimeStart] = useState('08:00'); 
    const [newTimeEnd, setNewTimeEnd] = useState('09:00'); 
    
    const daysOptions = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    const timeOptions = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
    
    // Función de inicialización/reestructuración de datos (para cargar desde el mock)
    const rehydrateSchedule = useCallback((p: DocenteProfile) => {
        const schedule: MateriaHorarioItem[] = [];
        // Usamos un Set para rastrear las materias ya agregadas (evita duplicados si no tienen hora)
        const addedMateriaKeys = new Set<string>();

        // 1. Recorrer el horario (Ej: '08:00': 'Desarrollo Web (101)')
        daysOptions.forEach(day => {
            const dayKey = day as keyof HorarioType;
            Object.entries(p.horario[dayKey]).forEach(([timeStart, description]) => {
                // Asumimos que la duración es de 1 hora para el mock simple de reconstrucción.
                // En un sistema real, la API devolvería la hora de fin.
                
                // Intentamos encontrar la hora de fin. Si no la encontramos, asumimos +1 hora.
                let timeEnd = timeStart; 
                // Buscamos si la descripción incluye la franja. En este mock, solo tenemos la hora de inicio.

                const match = description.match(/(.*) \((.*)\)/); // Captura Nombre (Grupo)
                
                if (match) {
                    const nombre = match[1].trim();
                    const grupo = match[2].trim();
                    const materiaId = p.materiasAsignadas.find(m => m.nombre === nombre && m.grupo === grupo)?.id || `temp-${nombre}`;
                    const scheduleKey = `${dayKey}-${timeStart}-${materiaId}`;

                    schedule.push({
                        id: materiaId,
                        nombre: nombre,
                        grupo: grupo,
                        day: dayKey,
                        timeStart: timeStart,
                        timeEnd: timeEnd, // Usamos la misma hora, o ajustamos si podemos calcular la duración
                        scheduleKey: scheduleKey
                    });
                    addedMateriaKeys.add(materiaId);
                }
            });
        });
        
        // 2. Añadir materias que existen pero que NO tienen horario asignado
        p.materiasAsignadas.forEach(m => {
             if (!addedMateriaKeys.has(m.id)) {
                schedule.push({
                    ...m,
                    scheduleKey: `no-schedule-${m.id}-${Date.now()}`
                });
             }
        });

        setLocalSchedule(schedule);
    }, [daysOptions]);

    useEffect(() => {
        if (isOpen) {
            rehydrateSchedule(profile);
        }
    }, [isOpen, profile, rehydrateSchedule]);


    // Función para eliminar una entrada de horario/materia
    const handleDelete = (scheduleKey: string) => {
        setLocalSchedule(prev => prev.filter(item => item.scheduleKey !== scheduleKey));
    };
    
    // Función para agregar una nueva entrada de materia y horario
    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMateriaNombre.trim() || !newMateriaGrupo.trim() || !newTimeStart || !newTimeEnd) return;

        // Validar que la hora de inicio sea anterior a la hora de fin
        if (newTimeStart >= newTimeEnd) {
             alert('La hora de inicio debe ser anterior a la hora de fin.');
             return;
        }

        // Usar ID existente o crear uno nuevo
        const existingMateria = profile.materiasAsignadas.find(m => 
             m.nombre === newMateriaNombre.trim() && m.grupo === newMateriaGrupo.trim()
        );

        const newMateriaId = existingMateria?.id || ('m-' + Date.now());


        const newItem: MateriaHorarioItem = {
            id: newMateriaId,
            nombre: newMateriaNombre.trim(),
            grupo: newMateriaGrupo.trim(),
            day: newDay,
            timeStart: newTimeStart,
            timeEnd: newTimeEnd,
            scheduleKey: `${newDay}-${newTimeStart}-${newTimeEnd}-${newMateriaId}`
        };
        
        // 🛑 PREVENIR DUPLICADOS DE HORARIO: Verificar si ya existe una clase en la franja horaria
        const isConflict = localSchedule.some(item => 
            item.day === newDay && item.timeStart === newTimeStart // Conflicto de hora de inicio
        );
        if (isConflict) {
             alert(`¡Conflicto de horario! Ya hay una clase asignada el ${newDay} a las ${newTimeStart}.`);
             return;
        }

        setLocalSchedule(prev => [...prev, newItem]);
        setNewMateriaNombre('');
        setNewMateriaGrupo('');
    };

    // Función principal de guardado
    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        // 1. RECONSTRUIR LA LISTA DE MATERIAS ASIGNADAS (únicas)
        const uniqueMateriasMap = new Map<string, MateriaAsignada>();
        localSchedule.forEach(item => {
            uniqueMateriasMap.set(item.id, { id: item.id, nombre: item.nombre, grupo: item.grupo });
        });
        const newMaterias: MateriaAsignada[] = Array.from(uniqueMateriasMap.values());


        // 2. RECONSTRUIR EL OBJETO DE HORARIO (HorarioType)
        const newHorario: Record<string, Record<string, string>> = {
            'Lunes': {}, 'Martes': {}, 'Miercoles': {}, 'Jueves': {}, 'Viernes': {}
        };
        
        localSchedule.forEach(item => {
            if (item.day && item.timeStart && item.timeEnd) {
                const dayKey = item.day;
                // Usamos la hora de inicio como clave, y la franja completa en la descripción
                newHorario[dayKey][item.timeStart] = `${item.nombre} (${item.grupo}) [${item.timeStart}-${item.timeEnd}]`;
            }
        });
        
        // 3. CONSTRUIR EL PERFIL ACTUALIZADO
        const updatedProfile: DocenteProfile = {
            ...profile,
            materiasAsignadas: newMaterias,
            horario: newHorario as DocenteProfile['horario'],
        };

        onSave(updatedProfile); 
        setIsSaving(false);
        onClose();
    };


    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Administrar Materias y Horario" 
            size="lg"
        >
            <div className="space-y-6">
                
                {/* Formulario para Añadir Materia/Horario */}
                <Card header="Asignar Nueva Clase" variant="flat">
                    <form onSubmit={handleAdd} className="grid grid-cols-6 gap-3 items-end">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Materia</label>
                            <input type="text" value={newMateriaNombre} onChange={(e) => setNewMateriaNombre(e.target.value)} required 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                placeholder="Ej: Bases de Datos"
                            />
                        </div>
                        <div className="w-20">
                             <label className="block text-sm font-medium text-gray-700">Grupo</label>
                            <input type="text" value={newMateriaGrupo} onChange={(e) => setNewMateriaGrupo(e.target.value)} required 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                placeholder="101"
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Día</label>
                            <select value={newDay} onChange={(e) => setNewDay(e.target.value as any)} 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            >
                                {daysOptions.map(day => <option key={day} value={day}>{day}</option>)}
                            </select>
                        </div>
                        {/* 🛑 HORA DE INICIO Y FIN */}
                        <div>
                             <label className="block text-sm font-medium text-gray-700">De (Inicio)</label>
                             <select value={newTimeStart} onChange={(e) => setNewTimeStart(e.target.value)} 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            >
                                {timeOptions.filter(t => t < newTimeEnd).map(time => <option key={time} value={time}>{time}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">A (Fin)</label>
                             <select value={newTimeEnd} onChange={(e) => setNewTimeEnd(e.target.value)} 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            >
                                {timeOptions.filter(t => t > newTimeStart).map(time => <option key={time} value={time}>{time}</option>)}
                            </select>
                        </div>
                        <Button type="submit" variant="primary" className="h-[42px] col-span-6 md:col-span-1" icon={<PlusCircle size={20} />}>
                            Asignar
                        </Button>
                    </form>
                </Card>

                {/* Tabla de Horario de Edición */}
                <h3 className="text-lg font-semibold border-b pb-1">Horario Asignado</h3>
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase">DÍA</th>
                                <th className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase">HORA</th>
                                <th className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase">MATERIA (GRUPO)</th>
                                <th className="px-4 py-2 text-right text-sm font-bold text-gray-700 uppercase">ELIMINAR</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {localSchedule.length > 0 ? (
                                // Mostrar el horario agrupado y ordenado
                                daysOptions.flatMap(day => 
                                    localSchedule
                                        .filter(item => item.day === day)
                                        .sort((a, b) => (a.timeStart || '00:00').localeCompare(b.timeStart || '00:00'))
                                        .map(item => (
                                            <tr key={item.scheduleKey} className="hover:bg-red-50/50 transition duration-150">
                                                <td className="p-3 text-sm font-mono text-gray-800">{item.day}</td>
                                                <td className="p-3 text-sm font-mono text-blue-600">{item.timeStart} - {item.timeEnd}</td>
                                                <td className="p-3 text-sm text-gray-700 font-medium">{item.nombre} ({item.grupo})</td>
                                                <td className="p-3 text-right">
                                                    <Button 
                                                        variant="ghost" 
                                                        onClick={() => handleDelete(item.scheduleKey)}
                                                        className="text-red-600 hover:bg-red-100"
                                                    >
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                )
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-4 text-gray-500">No hay clases asignadas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            <div className="flex justify-end pt-4 border-t mt-6 gap-3">
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSave} isLoading={isSaving} disabled={isSaving}>
                    {isSaving ? 'Guardando...' : 'Guardar Asignaciones'}
                </Button>
            </div>
        </Modal>
    );
};


// =========================================================
// 3. Componente Principal AdminDocenteProfilePage (CORREGIDO)
// =========================================================
export const AdminDocenteProfilePage: React.FC = () => {
    const { id: docenteId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<DocenteProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isPersonalModalOpen, setPersonalModalOpen] = useState(false);
    const [isMateriasModalOpen, setMateriasModalOpen] = useState(false);
    
    // HOOKS MOVIDOS ARRIBA DE LA VALIDACIÓN
    const handleProfileUpdate = useCallback((updatedProfile: DocenteProfile) => {
        setProfile(updatedProfile);
    }, []);

    useEffect(() => {
        if (!docenteId) {
            setError('ID de docente no proporcionado.');
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const data = await getDocenteProfileById(docenteId); 
                if (data) {
                    setProfile(data);
                } else {
                    setError('Perfil de Docente no encontrado.');
                }
            } catch (err) {
                setError('Error al cargar el perfil.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [docenteId]);

    // LÓGICA DEPENDIENTE DE 'PROFILE' AHORA EJECUTADA INCONDICIONALMENTE
    const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    
    const timeSlots = useMemo(() => {
        if (!profile) return [];
        
        // Extrae las claves de tiempo (inicio) del horario y las ordena
        return Array.from(new Set(
            days.flatMap(day => Object.keys(profile.horario[day as keyof typeof profile.horario]))
        )).sort();
    }, [profile]); 

    const isMateriaAssigned = useCallback((materiaName: string) => { 
        if (!profile) return false;
        
        // Verifica si el nombre de la materia (del mock) existe en la lista de materias asignadas actual.
        return profile.materiasAsignadas.some(m => materiaName.includes(m.nombre));
    }, [profile]); 
    
    // RETORNOS CONDICIONALES (Se mantienen en orden)

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center h-[calc(100vh-100px)]">
                <LoadingSpinner text="Cargando perfil del docente..." />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-3xl text-red-600">Error</h1>
                <p>{error}</p>
                <Button onClick={() => navigate('/admin/docentes')} className="mt-4">
                    Volver a Docentes
                </Button>
            </div>
        );
    }

    return (
        <div className="p-8 bg-white min-h-full font-sans">
            
            {/* TÍTULO Y HEADER PRINCIPAL */}
            <header className="mb-8">
                <h1 
                    className="text-5xl text-black border-b border-gray-400 pb-2" 
                    style={{ fontFamily: '"Kaushan Script", cursive' }}
                >
                    perfil docente
                </h1>
            </header>

            {/* INFORMACIÓN BÁSICA */}
            <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <User size={40} /> 
                </div>
                <div className="flex flex-col text-gray-700">
                    <p className="text-2xl font-bold">{profile.nombre}</p>
                    <p className="text-lg mt-1">Clave: <span className="font-mono text-purple-600">{profile.clave}</span></p>
                    <p className="text-md">Especialidad: <strong>{profile.especialidad}</strong></p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                
                {/* 1. DATOS PERSONALES */}
                <Card 
                    header={<span className="font-bold flex items-center gap-2">Datos Personales</span>} 
                    className="relative"
                >
                    <button 
                        className="absolute top-4 right-4 text-gray-400 hover:text-blue-600"
                        title="Ver y Editar datos"
                        onClick={() => setPersonalModalOpen(true)}
                    >
                        <Edit size={20} />
                    </button>
                    <p className="flex items-center gap-3 text-gray-700">
                        <Mail size={20} className="text-blue-500"/>
                        <span className="font-semibold">correo electronico:</span> {profile.email}
                    </p>
                    <p className="flex items-center gap-3 mt-2 text-gray-700">
                        <Phone size={20} className="text-blue-500"/>
                        <span className="font-semibold">No. Telefonico:</span> {profile.telefono || 'No disponible'}
                    </p>
                </Card>

                {/* 2. MATERIAS ASIGNADAS */}
                <Card 
                    header={<span className="font-bold flex items-center gap-2">Materias Asignadas</span>} 
                    className="relative"
                >
                    <button 
                        className="absolute top-4 right-4 text-gray-400 hover:text-blue-600"
                        title="Ver y Editar materias"
                        onClick={() => setMateriasModalOpen(true)}
                    >
                        <Edit size={20} />
                    </button>
                    {profile.materiasAsignadas.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2">
                            {profile.materiasAsignadas.slice(0, 2).map((materia) => (
                                <li key={materia.id} className="text-gray-700">
                                    <BookOpen size={16} className="inline mr-2 text-teal-600" />
                                    {materia.nombre} (# Grupo: <strong>{materia.grupo}</strong>)
                                </li>
                            ))}
                             {profile.materiasAsignadas.length > 2 && (
                                 <li className="text-blue-600 cursor-pointer" onClick={() => setMateriasModalOpen(true)}>
                                    ... ver {profile.materiasAsignadas.length - 2} más.
                                </li>
                            )}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No hay materias asignadas.</p>
                    )}
                </Card>
            </div>
            
            {/* 3. HORARIO */}
            <Card 
                header={<span className="font-bold flex items-center gap-2"><Clock size={20} /> Horario</span>}
                className="overflow-x-auto"
            >
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase">Hrs</th>
                            {days.map(day => (
                                <th key={day} className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {timeSlots.length > 0 ? (
                            timeSlots.map(time => (
                                <tr key={time} className="hover:bg-blue-50/50">
                                    <td className="p-3 text-sm font-mono text-gray-800 border-b border-gray-100">{time}</td>
                                    {days.map(day => {
                                        const lesson = profile.horario[day as keyof typeof profile.horario]?.[time]; 
                                        
                                        // Lógica de coherencia: Si la materia no está en la lista asignada, no se muestra.
                                        const showLesson = lesson && isMateriaAssigned(lesson);
                                        
                                        // Extraer el texto de la franja horaria para la vista
                                        const timeMatch = lesson ? lesson.match(/\[(\d{2}:\d{2}-\d{2}:\d{2})\]/) : null;
                                        const timeDisplay = timeMatch ? timeMatch[1] : time;
                                        
                                        return (
                                            <td 
                                                key={day} 
                                                className={`p-3 text-sm border-b border-gray-100 ${showLesson ? 'bg-teal-50 font-medium text-gray-700' : 'text-gray-400'}`}
                                            >
                                                {showLesson ? lesson.replace(/\[.*\]/, timeDisplay) : '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center p-4 text-gray-500">No hay horarios definidos.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>

            <div className="mt-8 text-right">
                <Button variant="secondary" onClick={() => navigate('/admin/docentes')}>
                    Volver a Docentes
                </Button>
            </div>


            {/* Renderizado de los Modales */}
            <PersonalDataModal 
                profile={profile}
                isOpen={isPersonalModalOpen} 
                onClose={() => setPersonalModalOpen(false)} 
                onSave={handleProfileUpdate}
            />

            <AssignedSubjectsModal
                profile={profile}
                onSave={handleProfileUpdate}
                isOpen={isMateriasModalOpen}
                onClose={() => setMateriasModalOpen(false)}
            />

        </div>
    );
};