import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Edit, Clock, PlusCircle, Trash2, CheckCircle, Home, X, Save } from 'lucide-react';

import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

import { adminService } from '../../services/admin.service';
// ✅ CORREGIDO: Se eliminó 'MateriaAsignada' para que ya no aparezca la advertencia amarilla
import { type DocenteProfile, type HorarioType } from '../../types/models';

// =========================================================
// 1. Componente Modal: Administrar Materias y Horario
// =========================================================
interface AssignedSubjectsModalProps {
    profile: DocenteProfile;
    onSave: (newProfile: DocenteProfile) => Promise<void>;
    isOpen: boolean;
    onClose: () => void;
}

const AssignedSubjectsModal: React.FC<AssignedSubjectsModalProps> = ({ profile, onSave, isOpen, onClose }) => {
    const [localSchedule, setLocalSchedule] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [gruposBD, setGruposBD] = useState<any[]>([]); 
    const [materiasBD, setMateriasBD] = useState<any[]>([]);

    const [selectedMateriaId, setSelectedMateriaId] = useState('');
    const [newMateriaGrupo, setNewMateriaGrupo] = useState('');
    const [newDay, setNewDay] = useState('Lunes');
    const [newTimeStart, setNewTimeStart] = useState('08:00');
    const [newTimeEnd, setNewTimeEnd] = useState('09:00');

    const daysOptions = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    const timeOptions = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

    useEffect(() => {
        if (isOpen && profile.horario) {
            const initial: any[] = [];
            Object.entries(profile.horario).forEach(([day, slots]) => {
                Object.entries(slots as Record<string, string>).forEach(([time, desc]) => {
                    const match = desc.match(/(.*) \((.*)\)/);
                    if (match) {
                        initial.push({
                            id: Math.random().toString(),
                            nombre: match[1].trim(),
                            grupo: match[2].trim(),
                            day,
                            timeStart: time,
                            timeEnd: desc.includes('[') ? desc.split('[')[1].split('-')[1].replace(']', '') : '00:00',
                            scheduleKey: `${day}-${time}`
                        });
                    }
                });
            });
            setLocalSchedule(initial);
        }
    }, [isOpen, profile.horario]);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const [grupos, materiasRaw] = await Promise.all([adminService.getGrupos(), adminService.getAsignaturas()]);
                setGruposBD(grupos);
                setMateriasBD(materiasRaw.map((m: any) => ({ id: m.id, nombre: m.nombre || m.materia })));
                if (grupos.length > 0) setNewMateriaGrupo(grupos[0].nombre);
                if (materiasRaw.length > 0) setSelectedMateriaId(materiasRaw[0].id);
            } catch (err) { console.error(err); }
        };
        if (isOpen) fetchDatos();
    }, [isOpen]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const materiaObj = materiasBD.find(m => m.id === selectedMateriaId);
        if (!materiaObj) return;
        setLocalSchedule(prev => [...prev, {
            id: selectedMateriaId, nombre: materiaObj.nombre, grupo: newMateriaGrupo,
            day: newDay, timeStart: newTimeStart, timeEnd: newTimeEnd,
            scheduleKey: `${newDay}-${newTimeStart}`
        }]);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const newHorario: any = { 'Lunes': {}, 'Martes': {}, 'Miercoles': {}, 'Jueves': {}, 'Viernes': {} };
        const uniqueMaterias = new Map();
        localSchedule.forEach(item => {
            uniqueMaterias.set(`${item.nombre}-${item.grupo}`, { id: item.id, nombre: item.nombre, grupo: item.grupo });
            newHorario[item.day][item.timeStart] = `${item.nombre} (${item.grupo}) [${item.timeStart}-${item.timeEnd}]`;
        });
        try {
            await onSave({ ...profile, materiasAsignadas: Array.from(uniqueMaterias.values()), horario: newHorario });
            onClose();
        } catch (error) { console.error(error); }
        finally { setIsSaving(false); }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Administrar Materias y Horario" size="lg">
            <div className="p-6 space-y-8 bg-[#f8fafc]">
                <div className="bg-[#F1F5F9] p-6 rounded-2xl border border-gray-200">
                    <h3 className="text-gray-800 font-bold mb-4 text-lg">Asignar Nueva Clase</h3>
                    <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3 w-full">
                        <div className="flex-grow min-w-[200px]">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Materia</label>
                            <select value={selectedMateriaId} onChange={(e) => setSelectedMateriaId(e.target.value)} className="w-full border-gray-300 border p-2 rounded-lg bg-white text-sm outline-none">
                                {materiasBD.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                            </select>
                        </div>
                        <div className="w-24">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Grupo</label>
                            <select value={newMateriaGrupo} onChange={(e) => setNewMateriaGrupo(e.target.value)} className="w-full border-gray-300 border p-2 rounded-lg bg-white text-sm outline-none">
                                {gruposBD.map(g => <option key={g.id} value={g.nombre}>{g.nombre}</option>)}
                            </select>
                        </div>
                        <div className="w-28">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Día</label>
                            <select value={newDay} onChange={(e) => setNewDay(e.target.value)} className="w-full border-gray-300 border p-2 rounded-lg bg-white text-sm outline-none">
                                {daysOptions.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="w-20">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Inicio</label>
                            <select value={newTimeStart} onChange={(e) => setNewTimeStart(e.target.value)} className="w-full border-gray-300 border p-2 rounded-lg bg-white text-sm outline-none">
                                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="w-20">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fin</label>
                            <select value={newTimeEnd} onChange={(e) => setNewTimeEnd(e.target.value)} className="w-full border-gray-300 border p-2 rounded-lg bg-white text-sm outline-none">
                                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="bg-[#2C445A] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm h-[38px] hover:bg-[#1E2F3E]">
                            <PlusCircle size={18} /> Add
                        </button>
                    </form>
                </div>

                <div className="bg-[#F1F5F9] p-6 rounded-2xl border border-gray-200">
                    <h3 className="text-gray-800 font-bold mb-4 text-lg">Horario Asignado</h3>
                    <div className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-[#E2E8F0] border-b border-gray-300">
                                <tr>
                                    <th className="p-3 text-[10px] font-bold text-gray-600 uppercase">Día</th>
                                    <th className="p-3 text-[10px] font-bold text-gray-600 uppercase">Hora</th>
                                    <th className="p-3 text-[10px] font-bold text-gray-600 uppercase">Materia (Grupo)</th>
                                    <th className="p-3 text-[10px] font-bold text-gray-600 uppercase text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {localSchedule.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-3 text-sm text-gray-700 font-medium">{item.day}</td>
                                        <td className="p-3 text-sm font-mono text-[#2C445A] font-bold">{item.timeStart} - {item.timeEnd}</td>
                                        <td className="p-3 text-sm text-gray-700">{item.nombre} ({item.grupo})</td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => setLocalSchedule(prev => prev.filter((_, i) => i !== idx))} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                                <Trash2 size={18}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button onClick={onClose} disabled={isSaving} className="bg-[#4F6D8C] text-white px-8 py-2.5 rounded-xl font-bold shadow-md">Cancelar</button>
                    <button onClick={handleSave} disabled={isSaving} className="bg-[#1E2F3E] text-white px-8 py-2.5 rounded-xl font-bold shadow-md">
                        {isSaving ? 'Guardando...' : 'Guardar Todo'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// =========================================================
// 2. Componente Principal
// =========================================================
const AdminDocenteProfilePage: React.FC = () => {
    const { id: docenteId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<DocenteProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    
    const [isMateriasModalOpen, setMateriasModalOpen] = useState(false);
    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [datosEditados, setDatosEditados] = useState<any>(null);

const handleProfileUpdate = useCallback(async (updatedProfile: DocenteProfile) => {
    try {
        // updatedProfile.id es el UUID que el AdminController espera recibir en el @Param('id')
        await adminService.updateDocenteProfile(updatedProfile);
        setProfile(updatedProfile);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) { 
        console.error(err);
        alert("Error al guardar"); 
    }
}, []);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!docenteId) return;
            try {
                const data = await adminService.getDocenteProfileById(docenteId);
                if (data) {
                    data.clave = data.clave || (data as any).claveEmpleado || docenteId.substring(0, 8).toUpperCase();
                }
                setProfile(data);
                setDatosEditados(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchProfile();
    }, [docenteId]);

    const handleEditarPerfil = () => {
        setDatosEditados({ ...profile });
        setMostrarModalEditar(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatosEditados((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleGuardarDatosPersonales = async () => {
        try {
            await handleProfileUpdate(datosEditados);
            setMostrarModalEditar(false);
        } catch (error) { console.error(error); }
    };

    const days = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
    const timeSlots = profile?.horario ? Array.from(new Set(Object.values(profile.horario).flatMap(d => Object.keys(d)))).sort() : [];

    if (loading) return <div className="p-8 flex justify-center items-center h-screen"><LoadingSpinner className="w-12 h-12 text-teal-600" /></div>;
    if (!profile) return <div className="p-8 text-center text-xl text-gray-500 italic">No encontrado. <Button onClick={() => navigate('/admin/docentes')}>Volver</Button></div>;

    return (
        <div className="p-8 bg-white min-h-screen relative font-sans">
            {showSuccess && (
                <div className="fixed top-20 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2 z-50 animate-bounce">
                    <CheckCircle size={20} /> ¡Cambios guardados!
                </div>
            )}

            <header className="mb-6 flex justify-between items-center border-b border-gray-400 pb-2">
                <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>perfil docente</h1>
                <Button variant="ghost" onClick={() => navigate('/admin/dashboard')} icon={<Home size={22} />} className="text-[#2C445A]">Volver</Button>
            </header>

            <div className="flex items-center gap-6 mb-8 p-6 bg-[#F8FAFC] rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shadow-inner"><User size={48} /></div>
                <div className="flex flex-col flex-1">
                    <p className="text-3xl font-bold text-gray-800">{profile.nombre}</p>
                    <p className="text-xl mt-1 text-gray-600">Clave: <span className="font-mono text-purple-700 font-bold bg-purple-50 px-2 rounded border border-purple-100">{profile.clave}</span></p>
                    <p className="text-md mt-1 text-gray-500 italic">Especialidad: <strong>{profile.especialidad}</strong></p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* DATOS PERSONALES CARD */}
                <Card 
                    header={
                        <div className="flex justify-between items-center w-full">
                            <span className="font-bold text-[#2C445A]">Datos Personales</span>
                            <button onClick={handleEditarPerfil} className="text-[#2C445A] hover:bg-gray-200 p-2 rounded-full transition-all">
                                <Edit size={18} />
                            </button>
                        </div>
                    } 
                    className="bg-[#F1F5F9] border-none shadow-none rounded-2xl p-4"
                >
                    <div className="space-y-3 py-2">
                        <p className="flex items-center gap-3 text-gray-600"><Mail size={20} className="text-[#4F6D8C]" />{profile.email}</p>
                        <p className="flex items-center gap-3 text-gray-600"><Phone size={20} className="text-[#4F6D8C]" />{profile.telefono || 'S/N'}</p>
                    </div>
                </Card>

                {/* MATERIAS CARD */}
                <Card 
                    header={
                        <div className="flex justify-between items-center w-full">
                            <span className="font-bold text-[#2C445A]">Materias Asignadas</span>
                            <button onClick={() => setMateriasModalOpen(true)} className="text-[#2C445A] hover:bg-gray-200 p-2 rounded-full transition-all">
                                <Edit size={18} />
                            </button>
                        </div>
                    } 
                    className="bg-[#F1F5F9] border-none shadow-none rounded-2xl p-4"
                >
                    <div className="space-y-2 py-2">
                        {profile.materiasAsignadas?.length > 0 ? profile.materiasAsignadas.map((m, idx) => (
                            <p key={idx} className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                <span className="w-2 h-2 rounded-full bg-teal-500 inline-block"></span>
                                {m.nombre} (Grupo: <span className="font-bold text-teal-700">{m.grupo}</span>)
                            </p>
                        )) : <p className="text-xs text-gray-400 italic">No hay materias asignadas.</p>}
                    </div>
                </Card>
            </div>

            <Card header={<span className="font-bold flex items-center gap-2 text-[#2C445A]"><Clock size={18} /> Horario Semanal</span>} className="overflow-x-auto bg-[#F8FAFC] border-t-[6px] border-[#2C445A] rounded-2xl shadow-sm">
                <table className="min-w-full text-center divide-y divide-gray-200">
                    <thead className="bg-[#E2E8F0]">
                        <tr>
                            <th className="px-3 py-4 text-[11px] font-bold text-gray-600 uppercase">Hrs</th>
                            {days.map(day => <th key={day} className="px-3 py-4 text-[11px] font-bold text-gray-600 uppercase">{day}</th>)}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {timeSlots.map(time => (
                            <tr key={time} className="hover:bg-gray-50 transition-colors">
                                <td className="p-3 text-[11px] font-mono text-gray-500 bg-[#F8FAFC] border-r border-gray-100">{time}</td>
                                {days.map(day => {
                                    const lesson = profile.horario?.[day.charAt(0) + day.slice(1).toLowerCase() as keyof HorarioType]?.[time];
                                    return (
                                        <td key={day} className={`p-3 text-xs border-r border-gray-100 ${lesson ? 'bg-teal-50 font-bold text-teal-800' : 'text-gray-300'}`}>
                                            {lesson ? lesson.split('[')[0] : '-'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <div className="mt-8 text-right"><Button variant="secondary" onClick={() => navigate('/admin/docentes')} className="px-10 py-2.5 rounded-xl shadow-md font-bold">Cerrar Perfil</Button></div>

            <AssignedSubjectsModal profile={profile} onSave={handleProfileUpdate} isOpen={isMateriasModalOpen} onClose={() => setMateriasModalOpen(false)} />

            {/* MODAL EDITAR PERFIL */}
            {mostrarModalEditar && datosEditados && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
                            <h3 className="text-2xl font-bold text-gray-800">Editar Perfil Docente</h3>
                            <button onClick={() => setMostrarModalEditar(false)} className="text-gray-500 hover:text-gray-700 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                                        <Input name="nombre" value={datosEditados.nombre} onChange={handleInputChange} required className="w-full" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad *</label>
                                        <Input name="especialidad" value={datosEditados.especialidad} onChange={handleInputChange} required className="w-full" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                        <Input name="email" value={datosEditados.email} onChange={handleInputChange} type="email" className="w-full" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                        <Input name="telefono" value={datosEditados.telefono} onChange={handleInputChange} className="w-full" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8 pt-6 border-t">
                                <button onClick={() => setMostrarModalEditar(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors">Cancelar</button>
                                <button onClick={handleGuardarDatosPersonales} className="flex-1 flex items-center justify-center gap-2 bg-[#2C445A] hover:bg-[#1E2F3E] text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all"><Save size={18} /> Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDocenteProfilePage;