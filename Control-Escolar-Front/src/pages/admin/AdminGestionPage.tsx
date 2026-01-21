// src/pages/admin/AdminGestionPage.tsx

import React, { useState, useMemo, useEffect } from 'react'; 
import { Search, Plus, Edit, Trash2, Calendar, GraduationCap, UserCheck, ArrowLeftCircle } from 'lucide-react';
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
    salon_default?: string; 
    docente_nombre?: string;
    grupo_nombre?: string;
    id_docente?: string; 
}

interface Asignatura {
    id: string;
    materia: string;
    codigo: string;
    creditos: number; 
    grupoAsignado?: string; 
}

// =================================================================================
// FORMULARIO PLAN DE ESTUDIO (CARRERA)
// =================================================================================
interface PlanFormProps {
    plan?: PlanEstudio; 
    docentes: any[]; 
    onSave: (data: any) => void; 
    onClose: () => void;
}

const PlanEstudioForm: React.FC<PlanFormProps> = ({ plan, docentes, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        nombre: plan?.nombre || '', 
        id_docente: plan?.id_docente || '', 
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-6"> 
            <Input label="Nombre del Plan / Carrera" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Ingeniería en Sistemas" required />
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Docente Encargado</label>
                <div className="text-xs text-gray-500 mb-2">
                    * Solo se muestran docentes con materias configuradas.
                </div>
                <select name="id_docente" value={formData.id_docente} onChange={handleChange} className="w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 bg-white" required>
                    <option value="">Seleccione un docente...</option>
                    {docentes
                        .filter((d: any) => d.tieneMaterias)
                        .map((d: any) => (
                            <option key={d.id} value={d.id}>{d.nombre}</option>
                    ))}
                </select>
                {docentes.filter((d: any) => d.tieneMaterias).length === 0 && (
                    <p className="text-xs text-red-500 mt-1">⚠ No hay docentes con materias asignadas.</p>
                )}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <Button variant="secondary" onClick={onClose} type="button">Cancelar</Button>
                <Button variant="primary" type="submit">Guardar Carrera</Button>
            </div>
        </form>
    );
};

// =================================================================================
// FORMULARIO ASIGNATURA
// =================================================================================
interface AsignaturaFormProps {
    asignatura?: Asignatura; 
    onSave: (data: any) => void;
    onClose: () => void;
}

const AsignaturaForm: React.FC<AsignaturaFormProps> = ({ asignatura, onSave, onClose }) => {
    const [data, setData] = useState({
        materia: asignatura?.materia || '',
        codigo: asignatura?.codigo || '',
        creditos: asignatura?.creditos || '', 
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...data, creditos: Number(data.creditos) });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <Input label="Nombre de la Materia" name="materia" value={data.materia} onChange={handleChange} required />
            <div className="grid grid-cols-2 gap-4">
                <Input label="Código" name="codigo" value={data.codigo} onChange={handleChange} required />
                <Input label="Créditos" name="creditos" type="number" value={String(data.creditos)} onChange={handleChange} placeholder="Ej: 8" required />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <Button variant="secondary" onClick={onClose} type="button">Cancelar</Button>
                <Button variant="primary" type="submit">Guardar Materia</Button>
            </div>
        </form>
    );
};

// =================================================================================
// COMPONENTE PRINCIPAL
// =================================================================================
const AdminGestionPage: React.FC = () => {
    const [planes, setPlanes] = useState<PlanEstudio[]>([]);
    const [asignaturasGlobales, setAsignaturasGlobales] = useState<Asignatura[]>([]);
    const [listaMostrada, setListaMostrada] = useState<Asignatura[]>([]);
    const [docentes, setDocentes] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);

    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [isMateriaModalOpen, setIsMateriaModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<PlanEstudio | null>(null);
    const [editingAsignatura, setEditingAsignatura] = useState<Asignatura | null>(null);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    const [filtroDocenteNombre, setFiltroDocenteNombre] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [planesData, asigDataRaw, docentesData] = await Promise.all([
                adminService.getPlanes(), 
                adminService.getAsignaturas(),
                adminService.getTeachers()
            ]);
            
            setPlanes(planesData);
            
            const mapAsig = asigDataRaw.map((item: any) => ({
                id: item.id,
                materia: item.nombre,           
                codigo: item.codigoMateria,     
                creditos: item.creditos,
            }));

            setAsignaturasGlobales(mapAsig);
            
            if (!filtroDocenteNombre) {
                setListaMostrada(mapAsig);
            }

            setDocentes(docentesData);

        } catch (error) {
            console.error("Error al cargar datos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTeacherDoubleClick = async (teacherId: string, teacherName: string) => {
        if (!teacherId) return;
        setFiltroDocenteNombre(teacherName);
        setListaMostrada([]); 

        try {
            const profile = await adminService.getTeacherProfile(teacherId);
            if (profile && profile.materiasAsignadas && profile.materiasAsignadas.length > 0) {
                const materiasDelDocente: Asignatura[] = profile.materiasAsignadas.map((m: any) => ({
                    id: m.id,
                    materia: m.nombre,
                    codigo: '---', 
                    creditos: 0,
                    grupoAsignado: m.grupo 
                }));
                setListaMostrada(materiasDelDocente);
            } else {
                setListaMostrada([]);
            }
        } catch (error) {
            console.error("Error cargando materias del docente", error);
            alert("Error al cargar las materias.");
            setListaMostrada(asignaturasGlobales); 
            setFiltroDocenteNombre(null);
        }
    };

    const clearFilter = () => {
        setFiltroDocenteNombre(null);
        setListaMostrada(asignaturasGlobales);
    };

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
        return listaMostrada.filter(a => a.materia.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [listaMostrada, searchTerm]);

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
                        Registrar Materia
                    </Button>
                </div>
            </header>

            {/* TABLA DE CURSOS VIGENTES */}
            <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white">
                <div className="p-6 flex justify-between items-center border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">Cursos Vigentes</h2>
                    <div className="relative">
                        <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-80 pr-10" />
                        <Search className="absolute right-3 top-3 text-gray-400" size={18} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#DDE3E9] text-[#4A5568] font-bold text-xs uppercase tracking-widest">
                            <tr>
                                <th className="p-4 text-center w-16">#</th>
                                <th className="p-4">Carrera</th>
                                {/* ✅ HEADER RESTAURADO: Se ve limpio como antes, pero mantiene funcionalidad */}
                                <th className="p-4">Docente</th> 
                                <th className="p-4">Grupo</th>
                                <th className="p-4 text-center w-32">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPlanes.length > 0 ? filteredPlanes.map((plan, index) => (
                                <tr key={plan.id} onClick={() => setSelectedPlanId(selectedPlanId === plan.id ? null : plan.id)}
                                    className={`cursor-pointer transition-colors ${selectedPlanId === plan.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                                    <td className="p-4 text-center text-gray-400 text-xs font-mono">{index + 1}</td>
                                    <td className="p-4 text-blue-600 font-semibold">{plan.salon_default || plan.nombre || '---'}</td>
                                    
                                    {/* ✅ LA INTERACCIÓN SIGUE AQUÍ EN LA CELDA */}
                                    <td 
                                        className="p-4 font-bold text-gray-700 hover:text-blue-600 transition-colors select-none"
                                        title="Doble click para ver las materias de este docente"
                                        onDoubleClick={(e) => {
                                            e.stopPropagation();
                                            if (plan.id_docente) {
                                                handleTeacherDoubleClick(plan.id_docente, plan.docente_nombre || 'Docente');
                                            } else {
                                                alert("Esta carrera no tiene docente asignado.");
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <UserCheck size={16} className="text-gray-400"/>
                                            {plan.docente_nombre || 'Sin asignar'}
                                        </div>
                                    </td>

                                    <td className="p-4 text-gray-600 font-medium">{plan.grupo_nombre || '---'}</td>
                                    <td className="p-4 flex justify-center gap-2" onClick={e => e.stopPropagation()}>
                                        <button onClick={() => { setEditingPlan(plan); setIsPlanModalOpen(true); }} className="p-2 text-white bg-[#527191] rounded-lg hover:bg-[#3E566E] shadow-sm"><Edit size={16}/></button>
                                        <button className="p-2 text-white bg-[#527191] rounded-lg hover:bg-red-600 shadow-sm"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} className="p-10 text-center text-gray-400 italic font-serif text-lg">No hay registros disponibles.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* TABLA DE ASIGNATURAS */}
            <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white transition-colors duration-500"
                     style={filtroDocenteNombre ? { backgroundColor: '#EFF6FF' } : {}}>
                    
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {filtroDocenteNombre ? `Materias de: ${filtroDocenteNombre}` : 'Catálogo General de Materias'}
                        </h2>
                        
                        {filtroDocenteNombre && (
                            <button 
                                onClick={clearFilter} 
                                className="text-xs bg-red-100 text-red-700 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-red-200 transition-all font-bold shadow-sm"
                            >
                                <ArrowLeftCircle size={16}/> 
                                Ver Catálogo Completo
                            </button>
                        )}
                    </div>
                    {!filtroDocenteNombre && (
                         <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Vista Global</span>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#DDE3E9] text-[#4A5568] font-bold text-xs uppercase tracking-widest">
                            <tr>
                                <th className="p-4 text-center w-16">#</th>
                                <th className="p-4">Materia</th>
                                <th className="p-4">Código / Grupo</th> 
                                <th className="p-4 text-center">Créditos</th>
                                <th className="p-4 text-center w-32">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAsignaturas.length > 0 ? filteredAsignaturas.map((asig, index) => (
                                <tr key={index} className={`transition-colors ${filtroDocenteNombre ? 'bg-blue-50/50 hover:bg-blue-100' : 'hover:bg-gray-50'}`}>
                                    <td className="p-4 text-center text-gray-400 text-xs font-mono">{index + 1}</td>
                                    <td className="p-4 font-bold text-gray-700 flex items-center gap-2">
                                        {filtroDocenteNombre && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                                        {asig.materia}
                                    </td>
                                    
                                    <td className="p-4 text-gray-500 font-mono text-xs uppercase">
                                        {filtroDocenteNombre && asig.grupoAsignado ? (
                                            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded font-bold">Gr: {asig.grupoAsignado}</span>
                                        ) : (
                                            asig.codigo
                                        )}
                                    </td>

                                    <td className="p-4 text-center font-bold text-[#527191]">{asig.creditos > 0 ? asig.creditos : '-'}</td>
                                    
                                    <td className="p-4 flex justify-center gap-2">
                                        {!filtroDocenteNombre ? (
                                            <>
                                                <button className="p-2 text-white bg-[#527191] rounded-lg hover:bg-[#3E566E] shadow-sm"><Edit size={16}/></button>
                                                <button onClick={async () => { if(window.confirm("¿Borrar materia global?")) { await adminService.eliminarMateria(asig.id); fetchData(); } }} className="p-2 text-white bg-[#527191] rounded-lg hover:bg-red-600 shadow-sm"><Trash2 size={16}/></button>
                                            </>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Asignada</span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-gray-400 italic">
                                        {filtroDocenteNombre 
                                            ? `El docente ${filtroDocenteNombre} no tiene materias asignadas.`
                                            : "No hay materias registradas en el catálogo."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} title={editingPlan ? 'Editar Carrera' : 'Crear Nueva Carrera'} size="md">
                <PlanEstudioForm 
                    plan={editingPlan || undefined} 
                    docentes={docentes} 
                    onSave={handleSavePlan} 
                    onClose={() => setIsPlanModalOpen(false)} 
                />
            </Modal>

            <Modal isOpen={isMateriaModalOpen} onClose={() => setIsMateriaModalOpen(false)} title={editingAsignatura ? 'Editar Materia' : 'Registrar Nueva Materia'} size="md">
                <AsignaturaForm asignatura={editingAsignatura || undefined} onSave={handleSaveAsignatura} onClose={() => setIsMateriaModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default AdminGestionPage;