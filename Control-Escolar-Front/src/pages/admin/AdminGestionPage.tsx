// src/pages/admin/AdminGestionPage.tsx

import React, { useState, useMemo, useEffect } from 'react'; 
import { Search, Plus, Edit, Trash2, Calendar, GraduationCap, PlusCircle, MinusCircle, FilterX } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input'; 
import Modal from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { adminService } from '../../services/admin.service';

// --- TIPOS DE DATOS ---
interface PlanEstudio {
    id: string;
    nombre: string;
    codigo: string;
    fechaInicio: string;
    fechaFinal: string;
    asignaturas?: AsignaturaSimple[]; 
}

interface AsignaturaSimple { 
    materia: string;
    codigo: string;
}

interface Asignatura {
    id: string;
    materia: string;
    codigo: string;
    planEstudio: string;
}

// =================================================================================
// FORMULARIO PLAN DE ESTUDIO (CARRERA)
// =================================================================================
interface PlanFormProps {
    plan?: PlanEstudio; 
    onSave: (data: any) => void; 
    onClose: () => void;
}

const PlanEstudioForm: React.FC<PlanFormProps> = ({ plan, onSave, onClose }) => {
    const [planData, setPlanData] = useState({
        nombre: plan?.nombre || '',
        codigo: plan?.codigo || '',
        fechaInicio: plan?.fechaInicio || '',
        fechaFinal: plan?.fechaFinal || '',
    });

    const [asignaturasList, setAsignaturasList] = useState<AsignaturaSimple[]>(
        plan?.asignaturas?.length ? plan.asignaturas : [{ materia: '', codigo: '' }]
    );

    const handlePlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlanData({ ...planData, [e.target.name]: e.target.value });
    };

    const handleAsignaturaChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newAsignaturas = [...asignaturasList];
        newAsignaturas[index] = { ...newAsignaturas[index], [e.target.name]: e.target.value } as AsignaturaSimple;
        setAsignaturasList(newAsignaturas);
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave({ ...planData, asignaturas: asignaturasList }); }} className="p-4 space-y-6"> 
            <div className="space-y-4">
                <Input label="Nombre de la Carrera / Plan" name="nombre" value={planData.nombre} onChange={handlePlanChange} required />
                <Input label="Código del Plan" name="codigo" value={planData.codigo} onChange={handlePlanChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input label="Fecha inicio" name="fechaInicio" type="date" value={planData.fechaInicio} onChange={handlePlanChange} required />
                <Input label="Fecha finalización" name="fechaFinal" type="date" value={planData.fechaFinal} onChange={handlePlanChange} required />
            </div>
            <div className="space-y-3 pt-3 border-t">
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Carga Académica Inicial</h3>
                {asignaturasList.map((asig, index) => (
                    <div key={index} className="flex gap-2 animate-in slide-in-from-left-2">
                        <Input name="materia" value={asig.materia} onChange={(e) => handleAsignaturaChange(index, e)} placeholder="Materia" className="flex-1" />
                        <Input name="codigo" value={asig.codigo} onChange={(e) => handleAsignaturaChange(index, e)} placeholder="Cód." className="w-24" />
                        {asignaturasList.length > 1 && (
                            <Button type="button" variant="ghost" onClick={() => setAsignaturasList(prev => prev.filter((_, i) => i !== index))} className="p-2 text-red-500 hover:text-red-700">
                                <MinusCircle size={20} />
                            </Button>
                        )}
                    </div>
                ))}
                <Button type="button" variant="ghost" onClick={() => setAsignaturasList(prev => [...prev, { materia: '', codigo: '' }])} className="text-blue-600 text-sm flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded">
                    <PlusCircle size={16} /> Agregar otra materia
                </Button>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="secondary" onClick={onClose} type="button">Cancelar</Button>
                <Button variant="primary" type="submit">Guardar Carrera</Button>
            </div>
        </form>
    );
};

// =================================================================================
// FORMULARIO ASIGNATURA INDIVIDUAL
// =================================================================================
interface AsignaturaFormProps {
    asignatura?: Asignatura; 
    planesDisponibles: PlanEstudio[]; 
    onSave: (data: any) => void;
    onClose: () => void;
}

const AsignaturaForm: React.FC<AsignaturaFormProps> = ({ asignatura, planesDisponibles, onSave, onClose }) => {
    const [data, setData] = useState({
        materia: asignatura?.materia || '',
        codigo: asignatura?.codigo || '',
        planEstudio: asignatura?.planEstudio || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(data); }} className="p-4 space-y-4">
            <Input label="Materia" name="materia" value={data.materia} onChange={handleChange} required />
            <Input label="Código" name="codigo" value={data.codigo} onChange={handleChange} required />
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vincular a Carrera</label>
                <select 
                    name="planEstudio" 
                    value={data.planEstudio} 
                    onChange={handleChange} 
                    className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 bg-white"
                    required
                >
                    <option value="">Seleccione una carrera...</option>
                    {planesDisponibles.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                </select>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <Button variant="secondary" onClick={onClose} type="button">Cancelar</Button>
                <Button variant="primary" type="submit">Guardar Asignatura</Button>
            </div>
        </form>
    );
};

// =================================================================================
// COMPONENTE PRINCIPAL
// =================================================================================
const AdminGestionPage: React.FC = () => {
    const [planes, setPlanes] = useState<PlanEstudio[]>([]);
    const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
    const [loading, setLoading] = useState(true);

    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [isMateriaModalOpen, setIsMateriaModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<PlanEstudio | null>(null);
    const [editingAsignatura, setEditingAsignatura] = useState<Asignatura | null>(null);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [planesData, asigData] = await Promise.all([
                adminService.getPlanes(), // Aquí vendrán solo los que tú crees
                adminService.getAsignaturas()
            ]);
            setPlanes(planesData);
            setAsignaturas(asigData);
        } catch (error) {
            console.error("Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSavePlan = async (data: any) => {
        try {
            if (editingPlan) {
                await adminService.actualizarPlan(editingPlan.id, data);
            } else {
                await adminService.crearPlan(data);
            }
            fetchData();
            setIsPlanModalOpen(false);
        } catch (error) { alert("Error al guardar"); }
    };

    const handleSaveAsignatura = async (data: any) => {
        try {
            await adminService.crearAsignatura(data);
            fetchData();
            setIsMateriaModalOpen(false);
        } catch (error) { alert("Error al guardar"); }
    };

    const filteredPlanes = useMemo(() => {
        return planes.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [planes, searchTerm]);

    const filteredAsignaturas = useMemo(() => {
        if (!selectedPlanId) return asignaturas; 
        const planName = planes.find(p => p.id === selectedPlanId)?.nombre;
        return asignaturas.filter(a => a.planEstudio === planName);
    }, [asignaturas, planes, selectedPlanId]);

    if (loading) return <div className="flex h-screen items-center justify-center bg-white"><LoadingSpinner className="w-12 h-12 text-blue-600" /></div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8 space-y-8 font-sans">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-serif italic text-gray-800 flex items-center">
                        <GraduationCap size={40} className="mr-4 text-[#527191]" />
                        Gestión Académica
                    </h1>
                    <p className="text-gray-500 ml-14">Panel de Administración de Carreras y Oferta Educativa</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" icon={<Calendar size={18} />} onClick={() => { setEditingPlan(null); setIsPlanModalOpen(true); }}>
                        Crear Carrera
                    </Button>
                    <Button variant="primary" icon={<Plus size={18} />} onClick={() => { setEditingAsignatura(null); setIsMateriaModalOpen(true); }}>
                        Agregar Asignatura
                    </Button>
                </div>
            </header>

            {/* TABLA DE PLANES (CARRERAS) */}
            <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white">
                <div className="p-6 flex justify-between items-center border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">Planes de Estudio Vigentes</h2>
                    <div className="relative">
                        <Input placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-80 pr-10" />
                        <Search className="absolute right-3 top-3 text-gray-400" size={18} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#DDE3E9] text-[#4A5568] font-bold text-xs uppercase tracking-widest">
                            <tr>
                                <th className="p-4 text-center">#</th>
                                <th className="p-4">Nombre de la Carrera</th>
                                <th className="p-4">Código</th>
                                <th className="p-4">Fecha Inicio</th>
                                <th className="p-4">Fecha Fin</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPlanes.length > 0 ? filteredPlanes.map((plan, index) => (
                                <tr key={plan.id} onClick={() => setSelectedPlanId(selectedPlanId === plan.id ? null : plan.id)}
                                    className={`cursor-pointer transition-colors ${selectedPlanId === plan.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                                    <td className="p-4 text-center text-gray-400 text-xs font-mono">{index + 1}</td>
                                    <td className="p-4 font-bold text-gray-700">{plan.nombre}</td>
                                    <td className="p-4 text-gray-500 font-mono text-xs">{plan.codigo}</td>
                                    <td className="p-4 text-sm text-gray-600">{plan.fechaInicio}</td>
                                    <td className="p-4 text-sm text-gray-600">{plan.fechaFinal}</td>
                                    <td className="p-4 flex justify-center gap-2" onClick={e => e.stopPropagation()}>
                                        <button onClick={() => { setEditingPlan(plan); setIsPlanModalOpen(true); }} className="p-2 text-white bg-[#527191] rounded-lg hover:bg-[#3E566E] shadow-sm"><Edit size={16}/></button>
                                        <button className="p-2 text-white bg-[#527191] rounded-lg hover:bg-red-600 shadow-sm"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="p-10 text-center text-gray-400 italic font-serif text-lg">No hay planes creados. Presiona "Crear Carrera" para comenzar.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* TABLA DE ASIGNATURAS */}
            <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">Asignaturas</h2>
                        {selectedPlanId && (
                            <button onClick={() => setSelectedPlanId(null)} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-blue-200">
                                <FilterX size={14}/> Ver todas
                            </button>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#DDE3E9] text-[#4A5568] font-bold text-xs uppercase tracking-widest">
                            <tr>
                                <th className="p-4 text-center">#</th>
                                <th className="p-4">Materia</th>
                                <th className="p-4">Código</th>
                                <th className="p-4">Pertenece a</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAsignaturas.length > 0 ? filteredAsignaturas.map((asig, index) => (
                                <tr key={asig.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-center text-gray-400 text-xs font-mono">{index + 1}</td>
                                    <td className="p-4 font-bold text-gray-700">{asig.materia}</td>
                                    <td className="p-4 text-gray-500 font-mono text-xs uppercase">{asig.codigo}</td>
                                    <td className="p-4"><span className="text-blue-600 font-medium text-sm">{asig.planEstudio}</span></td>
                                    <td className="p-4 flex justify-center gap-2">
                                        <button className="p-2 text-white bg-[#527191] rounded-lg hover:bg-[#3E566E] shadow-sm"><Edit size={16}/></button>
                                        <button onClick={async () => { if(window.confirm("¿Borrar?")) { await adminService.eliminarMateria(asig.id); fetchData(); } }} className="p-2 text-white bg-[#527191] rounded-lg hover:bg-red-600 shadow-sm"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} className="p-10 text-center text-gray-400 italic">No hay materias registradas.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} title={editingPlan ? 'Editar Carrera' : 'Crear Nueva Carrera'} size="lg">
                <PlanEstudioForm plan={editingPlan || undefined} onSave={handleSavePlan} onClose={() => setIsPlanModalOpen(false)} />
            </Modal>

            <Modal isOpen={isMateriaModalOpen} onClose={() => setIsMateriaModalOpen(false)} title={editingAsignatura ? 'Editar Asignatura' : 'Registrar Nueva Asignatura'} size="md">
                <AsignaturaForm asignatura={editingAsignatura || undefined} planesDisponibles={planes} onSave={handleSaveAsignatura} onClose={() => setIsMateriaModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default AdminGestionPage;