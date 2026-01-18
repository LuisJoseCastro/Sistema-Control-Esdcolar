// src/pages/admin/AdminGestionPage.tsx

import React, { useState, useMemo, useEffect } from 'react'; 
import { Search, Plus, Edit, Trash2, Calendar, GraduationCap, PlusCircle, MinusCircle, FilterX } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input'; 
import Modal from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { adminService } from '../../services/admin.service'; // 👈 Conexión real

// --- TIPOS DE DATOS ---
interface PlanEstudio {
    id: string | number;
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
    id: string | number;
    materia: string;
    codigo: string;
    planEstudio: string;
}

// --- FORMULARIO PLAN (DISEÑO IGUAL) ---
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
                <Input label="Nombre del plan" name="nombre" value={planData.nombre} onChange={handlePlanChange} required />
                <Input label="Código" name="codigo" value={planData.codigo} onChange={handlePlanChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input label="Fecha inicio" name="fechaInicio" type="date" value={planData.fechaInicio} onChange={handlePlanChange} required />
                <Input label="Fecha finalización" name="fechaFinal" type="date" value={planData.fechaFinal} onChange={handlePlanChange} required />
            </div>
            <div className="space-y-3 pt-3 border-t">
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Asignaturas Iniciales</h3>
                {asignaturasList.map((asig, index) => (
                    <div key={index} className="flex gap-2">
                        <Input name="materia" value={asig.materia} onChange={(e) => handleAsignaturaChange(index, e)} placeholder="Nombre Materia" className="flex-1" />
                        <Input name="codigo" value={asig.codigo} onChange={(e) => handleAsignaturaChange(index, e)} placeholder="Cód." className="flex-2" />
                        {asignaturasList.length > 1 && (
                            <Button type="button" variant="ghost" onClick={() => setAsignaturasList(prev => prev.filter((_, i) => i !== index))} className="p-2"><MinusCircle size={20} /></Button>
                        )}
                    </div>
                ))}
                <Button type="button" variant="ghost" onClick={() => setAsignaturasList(prev => [...prev, { materia: '', codigo: '' }])} className="text-blue-600 text-sm flex items-center gap-1">
                    <PlusCircle size={16} /> Agregar otra
                </Button>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="secondary" onClick={onClose} type="button">Cancelar</Button>
                <Button variant="primary" type="submit">Guardar</Button>
            </div>
        </form>
    );
};

// --- FORMULARIO MATERIA (DISEÑO IGUAL) ---
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
        planEstudio: asignatura?.planEstudio || planesDisponibles[0]?.nombre || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(data); }} className="p-4 space-y-4">
            <Input label="Materia" name="materia" value={data.materia} onChange={handleChange} required />
            <Input label="Código" name="codigo" value={data.codigo} onChange={handleChange} required />
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan de Estudio</label>
                <select name="planEstudio" value={data.planEstudio} onChange={handleChange} className="w-full border p-2 rounded-md">
                    {planesDisponibles.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                </select>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <Button variant="secondary" onClick={onClose} type="button">Cancelar</Button>
                <Button variant="primary" type="submit">Guardar</Button>
            </div>
        </form>
    );
};

// --- COMPONENTE PRINCIPAL (CONECTADO) ---
const AdminGestionPage: React.FC = () => {
    const [planes, setPlanes] = useState<PlanEstudio[]>([]);
    const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
    const [loading, setLoading] = useState(true);

    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [isMateriaModalOpen, setIsMateriaModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<PlanEstudio | null>(null);
    const [editingAsignatura, setEditingAsignatura] = useState<Asignatura | null>(null);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [selectedPlanId, setSelectedPlanId] = useState<string | number | null>(null);

    // 1. CARGA INICIAL DESDE API
    const fetchData = async () => {
        setLoading(true);
        try {
            const [planesData, asigData] = await Promise.all([
                adminService.getPlanes(),
                adminService.getAsignaturas()
            ]);
            setPlanes(planesData);
            setAsignaturas(asigData);
        } catch (error) {
            console.error("Error al cargar gestión académica", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. HANDLERS CON API
    const handleSavePlan = async (data: any) => {
        try {
            if (editingPlan) {
                await adminService.actualizarPlan(editingPlan.id, data);
            } else {
                await adminService.crearPlan(data);
            }
            fetchData();
            setIsPlanModalOpen(false);
            setEditingPlan(null);
        } catch (error) { alert("Error al guardar plan"); }
    };

    const handleSaveAsignatura = async (data: any) => {
        try {
            if (editingAsignatura) {
                await adminService.actualizarAsignatura(editingAsignatura.id, data);
            } else {
                await adminService.crearAsignatura(data);
            }
            fetchData();
            setIsMateriaModalOpen(false);
            setEditingAsignatura(null);
        } catch (error) { alert("Error al guardar materia"); }
    };

    const handleDeletePlan = async (id: string | number) => {
        if (window.confirm('¿Eliminar este plan?')) {
            // await adminService.eliminarPlan(id); // Agregar si existe en backend
            setPlanes(prev => prev.filter(p => p.id !== id));
            if (selectedPlanId === id) setSelectedPlanId(null);
        }
    };

    const handleSelectPlan = (id: string | number) => {
        setSelectedPlanId(prev => prev === id ? null : id);
    };

    const filteredPlanes = useMemo(() => {
        return planes.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || p.codigo.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [planes, searchTerm]);

    const filteredAsignaturas = useMemo(() => {
        if (selectedPlanId === null) return asignaturas; 
        const planName = planes.find(p => p.id === selectedPlanId)?.nombre;
        if (!planName) return asignaturas;
        return asignaturas.filter(a => a.planEstudio === planName);
    }, [asignaturas, planes, selectedPlanId]);

    if (loading) return <div className="flex h-screen items-center justify-center bg-whiteBg-50"><LoadingSpinner className="w-12 h-12 text-main-800" /></div>;

    return (
        <div className="min-h-screen bg-whiteBg-50 p-8">
            <header className="mb-6">
                <h1 className="text-4xl font-serif italic text-gray-800 flex items-center">
                    <GraduationCap size={32} className="mr-3 text-main-800" />
                    Gestión Académica
                </h1>
                <p className="text-gray-600 ml-10">Administración de planes y asignaturas</p>
            </header>

            <div className="flex justify-end space-x-3 mb-8">
                <Button variant="secondary" icon={<Calendar size={18} />} onClick={() => { setEditingPlan(null); setIsPlanModalOpen(true); }}>
                    Nuevo Plan
                </Button>
                <Button variant="primary" icon={<Plus size={18} />} onClick={() => { setEditingAsignatura(null); setIsMateriaModalOpen(true); }}>
                    Nueva Materia
                </Button>
            </div>

            <Card className="p-6 bg-white shadow-xl shadow-grayDark-200 mb-10 border-2 border-gray-400">
                <div className="flex justify-between items-end mb-4 border-b pb-2">
                    <div>
                        <h2 className="text-2xl font-semibold">Planes de Estudio</h2>
                        <p className="text-xs text-gray-500 mt-1">Haz clic en una fila para ver sus materias.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input placeholder="Buscar plan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64" />
                        <Button variant="secondary" className="p-2" icon={<Search size={18} />}>{''}</Button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-grayDark-200 text-sm font-semibold text-gray-700">
                            <tr>
                                <th className="p-3 text-center text-xl">ID</th>
                                <th className="p-3 text-left text-xl">Nombre del Plan</th>
                                <th className="p-3 text-left text-xl">Código</th>
                                <th className="p-3 text-left text-xl">Inicio</th>
                                <th className="p-3 text-left text-xl">Fin</th>
                                <th className="p-3 text-center text-xl">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-whiteBg-50 divide-y divide-gray-200">
                            {filteredPlanes.map((plan) => {
                                const isSelected = selectedPlanId === plan.id;
                                return (
                                    <tr key={plan.id} onClick={() => handleSelectPlan(plan.id)}
                                        className={`transition-colors duration-200 cursor-pointer ${isSelected ? 'bg-blue-50 border-l-4 border-l-main-600' : 'hover:bg-whiteBg-100 border-l-4 border-l-transparent'}`}>
                                        <td className="p-3 text-center text-gray-500 text-[10px] font-mono">
                                            {typeof plan.id === 'string' ? plan.id.slice(0, 8) : plan.id}
                                        </td>
                                        <td className={`p-3 font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>{plan.nombre}</td>
                                        <td className="p-3 text-gray-500 font-mono text-xs">{plan.codigo}</td>
                                        <td className="p-3 text-sm">{plan.fechaInicio}</td>
                                        <td className="p-3 text-sm">{plan.fechaFinal}</td>
                                        <td className="p-3 text-center flex justify-center gap-2" onClick={(e) => e.stopPropagation()}> 
                                            <Button variant="ghost" className="p-1" onClick={() => { setEditingPlan(plan); setIsPlanModalOpen(true); }}>
                                                <Edit size={16} />
                                            </Button>
                                            <Button variant="ghost" className="p-1" onClick={() => handleDeletePlan(plan.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card className="p-6 bg-white shadow-xl border-2 border-gray-400">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-semibold">Asignaturas</h2>
                        {selectedPlanId && (
                            <div className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full animate-fadeIn">
                                <span>Filtrado por: <strong>{planes.find(p => p.id === selectedPlanId)?.nombre}</strong></span>
                                <button onClick={() => setSelectedPlanId(null)} className="ml-2"><FilterX size={16} /></button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-grayDark-200 text-xl font-semibold text-gray-700">
                            <tr>
                                <th className="p-3 text-center text-xl">ID</th>
                                <th className="p-3 text-left text-xl">Materia</th>
                                <th className="p-3 text-left text-xl">Código</th>
                                <th className="p-3 text-left text-xl">Plan de Estudio</th>
                                <th className="p-3 text-center text-xl">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-whiteBg-50 divide-y divide-gray-200">
                            {filteredAsignaturas.length > 0 ? (
                                filteredAsignaturas.map((asig) => (
                                    <tr key={asig.id} className="border-b hover:bg-whiteBg-100">
                                        <td className="p-3 text-center text-gray-500 text-[10px] font-mono">
                                            {typeof asig.id === 'string' ? asig.id.slice(0, 8) : asig.id}
                                        </td>
                                        <td className="p-3 font-medium text-gray-800">{asig.materia}</td>
                                        <td className="p-3 font-mono text-xs text-gray-500">{asig.codigo}</td>
                                        <td className="p-3 text-sm text-blue-600 bg-blue-50/50 rounded">{asig.planEstudio}</td>
                                        <td className="p-3 text-center flex justify-center gap-2">
                                            <Button variant="ghost" className="p-1" onClick={() => { setEditingAsignatura(asig); setIsMateriaModalOpen(true); }}>
                                                <Edit size={16} />
                                            </Button>
                                            <Button variant="ghost" className="p-1"><Trash2 size={16} /></Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400 italic">No hay materias disponibles.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} title={editingPlan ? 'Editar Plan' : 'Nuevo Plan'} size="lg">
                <PlanEstudioForm plan={editingPlan || undefined} onSave={handleSavePlan} onClose={() => setIsPlanModalOpen(false)} />
            </Modal>

            <Modal isOpen={isMateriaModalOpen} onClose={() => setIsMateriaModalOpen(false)} title={editingAsignatura ? 'Editar Materia' : 'Nueva Materia'} size="md">
                <AsignaturaForm asignatura={editingAsignatura || undefined} planesDisponibles={planes} onSave={handleSaveAsignatura} onClose={() => setIsMateriaModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default AdminGestionPage;