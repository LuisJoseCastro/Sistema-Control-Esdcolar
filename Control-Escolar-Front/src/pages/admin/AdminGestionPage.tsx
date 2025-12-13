// src/pages/admin/AdminGestionPage.tsx

import React, { useState, useMemo } from 'react'; 
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input'; 
import Modal from '../../components/ui/Modal';
import { Search, Plus, Edit, Trash2, Calendar, GraduationCap, X, Save, PlusCircle, MinusCircle } from 'lucide-react';

// ----------------------------------------------------------------------
// 1. TIPOS DE DATOS (MOCK)
// ----------------------------------------------------------------------

interface PlanEstudio {
    id: number;
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
    id: number;
    materia: string;
    codigo: string;
    planEstudio: string; // Nombre del plan asociado
}

interface AsignaturaData extends AsignaturaSimple {
    planEstudio: string; // Para el formulario de Materia independiente
}

const mockPlanes: PlanEstudio[] = [
    { id: 1, nombre: 'Lic. en Educación', codigo: 'EDU-001', fechaInicio: '2024-01-01', fechaFinal: '2028-12-31' },
    { id: 2, nombre: 'Ing. en Sistemas', codigo: 'ING-003', fechaInicio: '2024-01-01', fechaFinal: '2088-12-31' },
    { id: 3, nombre: 'Lic. en Contabilidad', codigo: 'CON-002', fechaInicio: '2025-01-01', fechaFinal: '2030-12-31' },
];

const mockAsignaturas: Asignatura[] = [
    { id: 1, materia: 'Matemáticas I', codigo: 'MAT-101', planEstudio: 'Lic. en Educación' },
    { id: 2, materia: 'Programación Avanzada', codigo: 'PRO-201', planEstudio: 'Ing. en Sistemas' },
    { id: 3, materia: 'Fundamentos de la Contabilidad', codigo: 'CON-101', planEstudio: 'Lic. en Contabilidad' },
];


// ----------------------------------------------------------------------
// 2. COMPONENTES MODAL
// ----------------------------------------------------------------------

// 2.1. PlanEstudioForm (Se mantiene igual a la corrección anterior)
interface PlanFormProps {
    plan?: PlanEstudio; 
    onSave: (data: Omit<PlanEstudio, 'id'>) => void; 
    onClose: () => void;
}

const PlanEstudioForm: React.FC<PlanFormProps> = ({ plan, onSave, onClose }) => {
    
    // El resto de la implementación de PlanEstudioForm permanece SIN CAMBIOS
    const [planData, setPlanData] = useState<Omit<PlanEstudio, 'id'>>({
        nombre: plan?.nombre || '',
        codigo: plan?.codigo || '',
        fechaInicio: plan?.fechaInicio || '',
        fechaFinal: plan?.fechaFinal || '',
    });

    const [asignaturasList, setAsignaturasList] = useState<AsignaturaSimple[]>(
        plan?.asignaturas?.length ? plan.asignaturas : [{ materia: '', codigo: '' }]
    );

    const handlePlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPlanData(prev => ({ ...prev, [name]: value }));
    };

    const handleAsignaturaChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newAsignaturas = [...asignaturasList];
        newAsignaturas[index] = { ...newAsignaturas[index], [name]: value }; 
        setAsignaturasList(newAsignaturas);
    };

    const handleAddAsignatura = () => {
        setAsignaturasList(prev => [...prev, { materia: '', codigo: '' }]);
    };

    const handleRemoveAsignatura = (index: number) => {
        setAsignaturasList(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...planData, asignaturas: asignaturasList }); 
    };
    
    // Renderizado del formulario (se omite por brevedad, pero usarías el código completo de la corrección anterior)
    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-6"> 
            {/* Datos del Plan */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-1">Datos del Plan</h3>
                <Input label="Nombre del plan" name="nombre" value={planData.nombre} onChange={handlePlanChange} required />
                <Input label="Código" name="codigo" value={planData.codigo} onChange={handlePlanChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input label="Fecha inicio" name="fechaInicio" type="date" value={planData.fechaInicio} onChange={handlePlanChange} required />
                <Input label="Fecha finalización" name="fechaFinal" type="date" value={planData.fechaFinal} onChange={handlePlanChange} required />
            </div>

            {/* Sección de Asignaturas Dinámicas */}
            <div className="space-y-3 pt-3 border-t">
                <h3 className="text-lg font-semibold border-b pb-1">Asignaturas</h3>
                
                {asignaturasList.map((asig, index) => (
                    <div key={index} className="flex items-end space-x-2">
                        <div className="flex-1">
                            <Input label="Materia" name="materia" value={asig.materia} onChange={(e) => handleAsignaturaChange(index, e)} placeholder="Nombre de la materia" required />
                        </div>
                        <div className="w-1/4">
                            <Input label="Código" name="codigo" value={asig.codigo} onChange={(e) => handleAsignaturaChange(index, e)} placeholder="Cód." required />
                        </div>
                        
                        {asignaturasList.length > 1 && (
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => handleRemoveAsignatura(index)}
                                className="p-2 h-10 mb-1"
                                icon={<MinusCircle size={20} className="text-red-500" />}
                            >
                                {''}
                            </Button>
                        )}
                    </div>
                ))}

                <div className="flex justify-start pt-2">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={handleAddAsignatura}
                        className="p-2 h-10 text-blue-600 hover:bg-blue-50"
                        icon={<PlusCircle size={20} />}
                    >
                        Agregar Materia
                    </Button>
                </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                <Button variant="secondary" onClick={onClose} type="button" icon={<X size={18} />}>
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" icon={<Save size={18} />}>
                    {plan ? 'Guardar Cambios' : 'Aceptar'} 
                </Button>
            </div>
        </form>
    );
};

// ----------------------------------------------------------------------
// 2.2. AsignaturaForm (NUEVO COMPONENTE DE MATERIA)
// ----------------------------------------------------------------------

interface AsignaturaFormProps {
    asignatura?: Asignatura; 
    planesDisponibles: PlanEstudio[]; // Necesitamos la lista de planes
    onSave: (data: AsignaturaData) => void;
    onClose: () => void;
}

const AsignaturaForm: React.FC<AsignaturaFormProps> = ({ asignatura, planesDisponibles, onSave, onClose }) => {
    
    // Usamos AsignaturaData para incluir el planEstudio
    const [data, setData] = useState<AsignaturaData>({
        materia: asignatura?.materia || '',
        codigo: asignatura?.codigo || '',
        planEstudio: asignatura?.planEstudio || planesDisponibles[0]?.nombre || '', // Preseleccionar el primer plan
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(data);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <div className="space-y-4">
                <Input 
                    label="Nombre de la Materia" 
                    name="materia" 
                    value={data.materia} 
                    onChange={handleChange} 
                    placeholder="Ej: Álgebra Lineal"
                    required
                />
                <Input 
                    label="Código" 
                    name="codigo" 
                    value={data.codigo} 
                    onChange={handleChange} 
                    placeholder="Ej: AL-201"
                    required
                />

                {/* Selección del Plan de Estudio (Usamos un select simple) */}
                <div>
                    <label htmlFor="planEstudio" className="block text-sm font-medium text-gray-700 mb-1">
                        Asociar a Plan de Estudio
                    </label>
                    <select
                        id="planEstudio"
                        name="planEstudio"
                        value={data.planEstudio}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        {planesDisponibles.map(plan => (
                            <option key={plan.id} value={plan.nombre}>
                                {plan.nombre} ({plan.codigo})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                <Button variant="secondary" onClick={onClose} type="button" icon={<X size={18} />}>
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" icon={<Save size={18} />}>
                    {asignatura ? 'Guardar Cambios' : 'Aceptar'}
                </Button>
            </div>
        </form>
    );
};


// ----------------------------------------------------------------------
// 3. COMPONENTE PRINCIPAL DE LA PÁGINA
// ----------------------------------------------------------------------

const AdminGestionPage: React.FC = () => {
    const [planes, setPlanes] = useState<PlanEstudio[]>(mockPlanes);
    const [asignaturas, setAsignaturas] = useState<Asignatura[]>(mockAsignaturas);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [isMateriaModalOpen, setIsMateriaModalOpen] = useState(false);
    
    // Estados para edición
    const [editingPlan, setEditingPlan] = useState<PlanEstudio | null>(null);
    const [editingAsignatura, setEditingAsignatura] = useState<Asignatura | null>(null); // Nuevo estado para edición de Materia

    // Estado para la búsqueda
    const [searchTerm, setSearchTerm] = useState(''); 
    
    // --- Lógica de Planes ---
    const handleOpenCreatePlan = () => {
        setEditingPlan(null); 
        setIsPlanModalOpen(true);
    };

    const handleOpenEditPlan = (plan: PlanEstudio) => {
        setEditingPlan(plan); 
        setIsPlanModalOpen(true);
    };

    const handleClosePlanModal = () => {
        setIsPlanModalOpen(false);
        setEditingPlan(null); 
    };
    
    const handleSavePlan = (data: Omit<PlanEstudio, 'id'>) => {
        const { asignaturas: newAsignaturasSimple, ...planData } = data;
        
        // Lógica de guardado/edición... (se mantiene igual)
        if (editingPlan) {
            setPlanes(prev => prev.map(p => p.id === editingPlan.id ? { ...p, ...planData, id: editingPlan.id, asignaturas: newAsignaturasSimple } : p));
        } else {
            const newPlan = { id: Date.now(), ...planData, asignaturas: newAsignaturasSimple };
            setPlanes(prev => [...prev, newPlan]);
        }
        handleClosePlanModal();
    };
    
    // --- Lógica de Asignaturas ---
    
    const handleSaveAsignatura = (data: AsignaturaData) => {
        // Lógica de guardado/edición (simplificada)
        if (editingAsignatura) {
            // Modo edición
            setAsignaturas(prev => prev.map(a => a.id === editingAsignatura.id ? { ...a, ...data, id: editingAsignatura.id } : a));
        } else {
            // Modo creación
            const newAsignatura = { id: Date.now(), ...data };
            setAsignaturas(prev => [...prev, newAsignatura]);
        }
        setIsMateriaModalOpen(false);
        setEditingAsignatura(null);
    };

    const handleOpenCreateAsignatura = () => {
        setEditingAsignatura(null);
        setIsMateriaModalOpen(true);
    };

    const handleOpenEditAsignatura = (asig: Asignatura) => {
        setEditingAsignatura(asig);
        setIsMateriaModalOpen(true);
    };

    const handleDeletePlan = (id: number) => {
        if (window.confirm('¿Seguro que desea eliminar este plan de estudios?')) {
            setPlanes(prev => prev.filter(p => p.id !== id));
        }
    };
    
    // LÓGICA DE FILTRADO (Planes)
    const filteredPlanes = useMemo(() => {
        if (!searchTerm) {
            return planes;
        }
        const lowerCaseSearch = searchTerm.toLowerCase();
        return planes.filter(plan => 
            plan.nombre.toLowerCase().includes(lowerCaseSearch) ||
            plan.codigo.toLowerCase().includes(lowerCaseSearch)
        );
    }, [planes, searchTerm]);


    // Renderizado de las filas de planes (se mantiene igual)
    const renderPlanesRows = () => (
        <>
            {/* ... (Encabezado de planes) */}
            <tr className="border-b bg-gray-50 text-sm">
                <td className="p-3 text-center">#</td>
                <td className="p-3 text-left">Nombre del plan</td>
                <td className="p-3 text-left">Código</td>
                <td className="p-3 text-left">Fecha Inicio</td>
                <td className="p-3 text-left">Fecha Final</td>
                <td className="p-3 text-center">Acciones</td>
            </tr>
            {/* Mapeo de datos reales usando la lista filtrada */}
            {filteredPlanes.map((plan) => (
                <tr key={plan.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-center">{plan.id}</td>
                    <td className="p-3">{plan.nombre}</td>
                    <td className="p-3">{plan.codigo}</td>
                    <td className="p-3">{plan.fechaInicio}</td>
                    <td className="p-3">{plan.fechaFinal}</td>
                    <td className="p-3 text-center space-x-2">
                        <Button variant="ghost" icon={<Edit size={16} className="text-blue-500" />} onClick={() => handleOpenEditPlan(plan)} className="p-1.5">{''}</Button>
                        <Button variant="ghost" icon={<Trash2 size={16} className="text-red-500" />} onClick={() => handleDeletePlan(plan.id)} className="p-1.5">{''}</Button>
                    </td>
                </tr>
            ))}
            {/* ... (Mensaje de no resultados) */}
            {filteredPlanes.length === 0 && planes.length > 0 && (
                <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500 italic">
                        No se encontraron planes de estudio que coincidan con la búsqueda "{searchTerm}".
                    </td>
                </tr>
            )}
        </>
    );
    
    // Renderizado de las filas de asignaturas (ACTUALIZADO para usar edición)
    const renderAsignaturasRows = () => (
        <>
            <tr className="border-b bg-gray-50 text-sm">
                <td className="p-3 text-center">#</td>
                <td className="p-3 text-left">Materia</td>
                <td className="p-3 text-left">Código</td>
                <td className="p-3 text-left">Plan de estudio</td>
                <td className="p-3 text-center">Acciones</td>
            </tr>
            {asignaturas.map((asig) => (
                <tr key={asig.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-center">{asig.id}</td>
                    <td className="p-3">{asig.materia}</td>
                    <td className="p-3">{asig.codigo}</td>
                    <td className="p-3">{asig.planEstudio}</td>
                    <td className="p-3 text-center space-x-2">
                        <Button 
                            variant="ghost" 
                            icon={<Edit size={16} className="text-blue-500" />} 
                            onClick={() => handleOpenEditAsignatura(asig)} // 🚨 LLAMADA A EDICIÓN
                            className="p-1.5"
                        >
                            {''}
                        </Button>
                        <Button variant="ghost" icon={<Trash2 size={16} className="text-red-500" />} onClick={() => { /* Eliminar */ }} className="p-1.5">{''} </Button>
                    </td>
                </tr>
            ))}
        </>
    );
    
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-serif italic text-gray-800 flex items-center">
                    <GraduationCap size={32} className="mr-3 text-blue-600" />
                    Gestión de plan estudios
                </h1>
                <p className="text-gray-600 ml-10">Administración de planes de estudio y asignaturas</p>
            </header>

            {/* BARRA DE BOTONES SUPERIOR */}
            <div className="flex justify-end space-x-3 mb-6">
                <Button 
                    variant="secondary" 
                    icon={<Calendar size={18} />} 
                    onClick={handleOpenCreatePlan} 
                >
                    Nuevo Plan
                </Button>
                <Button 
                    variant="primary" 
                    icon={<Plus size={18} />} 
                    onClick={handleOpenCreateAsignatura} // 🚨 LLAMADA A CREACIÓN DE MATERIA
                >
                    Nueva Materia
                </Button>
            </div>
            
            
            {/* CARD 1: PLANES DE ESTUDIO */}
            <Card className="p-6 bg-white shadow-xl mb-10">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Plan de estudios</h2>
                
                <div className="flex justify-end items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <Input 
                            type="text" 
                            placeholder="Buscar por nombre o código" 
                            className="w-48" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="secondary" className="p-1.5" icon={<Search size={18} />} >{''}</Button>
                    </div>
                </div>

                {/* Tabla de Planes de Estudio */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white divide-y divide-gray-200">
                            {renderPlanesRows()}
                        </tbody>
                    </table>
                </div>
            </Card>


            {/* CARD 2: ASIGNATURAS */}
            <Card className="p-6 bg-white shadow-xl">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Asignatura</h2>
                
                <div className="flex justify-end items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <Input type="text" placeholder="Buscar" className="w-48" />
                        <Button variant="secondary" className="p-1.5" icon={<Search size={18} />} >{''} </Button>
                    </div>
                </div>

                {/* Tabla de Asignaturas */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white divide-y divide-gray-200">
                            {renderAsignaturasRows()}
                        </tbody>
                    </table>
                </div>
            </Card>


            {/* MODALES */}
            
            {/* Modal para Crear/Editar Plan de Estudio */}
            <Modal
                isOpen={isPlanModalOpen}
                onClose={handleClosePlanModal} 
                title={editingPlan ? 'Editar Plan de Estudio' : 'Crear Nuevo Plan de Estudio'}
                size="lg"
            >
                <PlanEstudioForm 
                    plan={editingPlan || undefined} 
                    onSave={handleSavePlan} 
                    onClose={handleClosePlanModal} 
                />
            </Modal>
            
            {/* Modal para Crear/Editar Materia */}
            <Modal
                isOpen={isMateriaModalOpen}
                onClose={() => setIsMateriaModalOpen(false)}
                title={editingAsignatura ? 'Editar Asignatura' : 'Crear Nueva Asignatura'} // 🚨 Título dinámico
                size="md"
            >
                <AsignaturaForm
                    asignatura={editingAsignatura || undefined}
                    planesDisponibles={planes} // Le pasamos la lista de planes existentes
                    onSave={handleSaveAsignatura}
                    onClose={() => setIsMateriaModalOpen(false)}
                />
            </Modal>

        </div>
    );
};

export default AdminGestionPage;