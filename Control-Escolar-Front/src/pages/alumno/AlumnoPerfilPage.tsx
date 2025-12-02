import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAlumnoProfileData } from '../../services/alumno.service';
import type { AlumnoProfileData, PersonalInfoType, AcademicInfoType } from '../../types/models';

// UI & Icons
//import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';
import { User as UserIcon, Edit3, ArrowRight } from 'lucide-react';

// --- 1. MODAL: DETALLES PERSONALES (Replica image_973d73.png) ---
const PersonalDetailsModal: React.FC<{ isOpen: boolean; onClose: () => void; data: PersonalInfoType }> = ({ isOpen, onClose, data }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Información Personal">
        <div className="space-y-6 text-sm text-gray-800">
            {/* Sección Superior: 2 Columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                    <p className="font-bold mb-1">Nombre Completo:</p>
                    <p>{data.fullName}</p>
                </div>
                <div>
                    <p className="font-bold mb-1">Correo Electrónico:</p>
                    <p className="text-blue-600 hover:underline cursor-pointer">{data.email}</p>
                </div>

                <div>
                    <p className="font-bold mb-1">ID:</p>
                    <p>{data.id}</p>
                </div>
                <div>
                    <p className="font-bold mb-1">Teléfono:</p>
                    <p className="text-blue-600 hover:underline cursor-pointer">{data.phone}</p>
                </div>

                <div>
                    <p className="font-bold mb-1">Fecha de Nacimiento:</p>
                    <p>{data.birthDate}</p>
                </div>
                <div>
                    <p className="font-bold mb-1">Domicilio:</p>
                    <p>{data.address}</p>
                </div>

                <div>
                    <p className="font-bold mb-1">Sexo:</p>
                    <p>{data.gender}</p>
                </div>
            </div>

            {/* Sección Inferior: Recuadro Azul "Información Adicional" */}
            <div className="bg-[#f0f5fa] p-5 rounded-lg">
                <h4 className="font-bold text-gray-700 mb-4 text-base">Información Adicional</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                         <p className="font-bold mb-1">Nacionalidad:</p>
                         <p>{data.nationality}</p>
                    </div>
                    <div>
                         <p className="font-bold mb-1">Estado Civil:</p>
                         <p>{data.civilStatus}</p>
                    </div>

                    <div>
                         <p className="font-bold mb-1">Tipo de Sangre:</p>
                         <p>{data.bloodType}</p>
                    </div>
                    <div>
                         <p className="font-bold mb-1">Discapacidad:</p>
                         <p>{data.disability}</p>
                    </div>

                    <div>
                         <p className="font-bold mb-1">CURP:</p>
                         <p>{data.curp}</p>
                    </div>
                    <div>
                         <p className="font-bold mb-1">NSS:</p>
                         <p>{data.nss}</p>
                    </div>
                </div>
            </div>
        </div>
    </Modal>
);

// --- 2. MODAL: DATOS ACADÉMICOS (Replica image_973d19.png) ---
const AcademicDetailsModal: React.FC<{ isOpen: boolean; onClose: () => void; data: AcademicInfoType }> = ({ isOpen, onClose, data }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Datos Académicos">
        <div className="space-y-6 text-sm text-gray-800">
            {/* Sección Superior */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                    <p className="font-bold mb-1">Semestre:</p>
                    <p>{data.semester}</p>
                </div>
                <div>
                    <p className="font-bold mb-1">Fecha de Ingreso:</p>
                    <p>{data.admissionDate}</p>
                </div>

                <div>
                    <p className="font-bold mb-1">Promedio:</p>
                    <p className="text-green-600 font-bold">{data.average.toFixed(1)}</p>
                </div>
                <div>
                    <p className="font-bold mb-1">Carrera:</p>
                    <p>Ingeniería en ISC 2010</p> 
                </div>

                <div>
                    <p className="font-bold mb-1">Estado Académico:</p>
                    <p>{data.status}</p>
                </div>
                <div>
                    <p className="font-bold mb-1">Modalidad:</p>
                    <p>{data.modality}</p>
                </div>

                <div>
                    <p className="font-bold mb-1">Materias Aprobadas:</p>
                    <p>{data.approvedSubjects}</p>
                </div>
            </div>

            {/* Sección Inferior: Recuadro Azul */}
            <div className="bg-[#f0f5fa] p-5 rounded-lg">
                <h4 className="font-bold text-gray-700 mb-4 text-base">Información Adicional</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                         <p className="font-bold mb-1">Facultad:</p>
                         <p>{data.faculty}</p>
                    </div>
                    <div>
                         <p className="font-bold mb-1">Plan de Estudios:</p>
                         <p>{data.studyPlan}</p>
                    </div>

                    <div>
                         <p className="font-bold mb-1">Modalidad:</p>
                         <p>{data.modality}</p>
                    </div>
                    <div>
                         <p className="font-bold mb-1">Turno:</p>
                         <p>{data.turn}</p>
                    </div>

                    <div>
                         <p className="font-bold mb-1">Período:</p>
                         <p>{data.period}</p>
                    </div>
                    <div>
                         <p className="font-bold mb-1">Créditos Obtenidos:</p>
                         <p>{data.credits}</p>
                    </div>
                </div>
            </div>
        </div>
    </Modal>
);

// --- 3. MODAL: EDITAR INFORMACIÓN (Replica image_96dafe.png) ---
const EditProfileModal: React.FC<{ isOpen: boolean; onClose: () => void; currentData: PersonalInfoType; onSave: (data: PersonalInfoType) => void }> = ({ isOpen, onClose, currentData, onSave }) => {
    const [formData, setFormData] = useState(currentData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Información Personal" className="max-w-2xl">
            <div className="space-y-6">
                
                {/* SECCIÓN: INFORMACIÓN BÁSICA */}
                <div>
                    <h4 className="text-base font-bold text-black border-b border-gray-300 pb-2 mb-4">Información Básica</h4>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-gray-800 mb-2">Nombre Completo *</label>
                            <Input name="fullName" value={formData.fullName} onChange={handleChange} className="bg-white" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-gray-800 mb-2">Sexo *</label>
                            <select 
                                name="gender" 
                                value={formData.gender} 
                                onChange={handleChange} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="Femenino">Femenino</option>
                                <option value="Masculino">Masculino</option>
                            </select>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-gray-800 mb-2">Fecha de Nacimiento *</label>
                            <div className="relative">
                                <Input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} className="bg-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECCIÓN: INFORMACIÓN DE CONTACTO */}
                <div>
                    <h4 className="text-base font-bold text-black border-b border-gray-300 pb-2 mb-4">Información de Contacto</h4>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-gray-800 mb-2">Correo Electrónico *</label>
                            <Input name="email" value={formData.email} onChange={handleChange} className="bg-white" />
                        </div>
                        <div className="col-span-1">
                             <label className="block text-sm font-bold text-gray-800 mb-2">Teléfono *</label>
                             <Input name="phone" value={formData.phone} onChange={handleChange} className="bg-white" />
                        </div>
                        <div className="col-span-2">
                             <label className="block text-sm font-bold text-gray-800 mb-2">Domicilio *</label>
                             <Input name="address" value={formData.address} onChange={handleChange} className="bg-white" />
                        </div>
                    </div>
                </div>

                {/* SECCIÓN: INFORMACIÓN NO EDITABLE (Estilo grisáceo) */}
                <div>
                    <h4 className="text-base font-bold text-gray-400 border-b border-gray-200 pb-2 mb-4">Información No Editable</h4>
                    <div className="flex gap-12 text-gray-500 text-sm font-medium">
                        <p><strong className="text-gray-600">ID del Estudiante:</strong> {formData.id}</p>
                        <p><strong className="text-gray-600">Estado:</strong> Activo</p>
                    </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex justify-end gap-3 pt-4">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={() => { onSave(formData); onClose(); }}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </Modal>
    );
};


// --- PÁGINA PRINCIPAL (Mismo diseño aprobado previamente) ---

export const AlumnoPerfilPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<AlumnoProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({ personal: false, academic: false, edit: false });

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user?.id) return;
            try {
                const data = await getAlumnoProfileData(user.id);
                setProfileData(data);
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchProfileData();
    }, [user]);

    const handleSavePersonalInfo = (newData: PersonalInfoType) => {
        if (profileData) {
             setProfileData({ ...profileData, personal: newData, resumen: { ...profileData.resumen, name: newData.fullName } });
        }
    };

    if (loading) return <div className="flex justify-center mt-20"><LoadingSpinner /></div>;
    if (!profileData) return <div>Error</div>;

    const { resumen, personal, academic, payment } = profileData;

    // Estilo exacto de las tarjetas
    const cardStyle = "bg-[#f4f6f8] rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8";

    return (
        <div className="p-8 bg-white min-h-full font-sans">
            
            <header className="flex justify-between items-end border-b-2 border-gray-400 pb-2 mb-10">
                <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
                    Perfil del Estudiante
                </h1>
                <div className="mb-2">
                   <UserHeaderIcons />
                </div>
            </header>

            <div className="flex flex-col gap-8 max-w-7xl mx-auto">

                {/* 1. TARJETA SUPERIOR: RESUMEN */}
                <div className={`${cardStyle} flex flex-col md:flex-row items-center justify-between gap-8`}>
                    <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                        <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center shrink-0 border-4 border-white shadow-sm">
                             <UserIcon size={64} className="text-purple-600" />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-3xl font-bold text-gray-900">{resumen.name}</h2>
                            <div className="flex flex-col md:flex-row gap-x-12 gap-y-1 text-gray-600 font-medium text-sm md:text-base">
                                <p>ID: {resumen.id}</p>
                                <p>{resumen.semester}</p>
                            </div>
                            <p className="text-gray-800 font-medium pt-1">{resumen.career}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-6 min-w-[200px]">
                        <button 
                            onClick={() => setModalState(p => ({...p, edit: true}))}
                            className="flex items-center gap-2 px-6 py-2 border-2 border-gray-400 rounded-lg text-gray-600 font-bold hover:bg-gray-200 transition text-sm"
                        >
                            <Edit3 size={18} /> Editar Perfil
                        </button>
                        <div className="text-center md:text-right">
                             <p className="text-sm font-bold text-gray-500 uppercase">Promedio:</p>
                             <p className="text-4xl font-extrabold text-blue-600">{resumen.average.toFixed(1)}</p>
                        </div>
                    </div>
                </div>

                {/* 2. SECCIÓN MEDIA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Tarjeta: Información Personal */}
                    <div className={`${cardStyle} relative flex flex-col`}>
                        <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Información Personal</h3>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm md:text-base flex-1">
                            <div><p className="font-bold text-gray-800">Nombre Completo:</p><p className="text-gray-600 text-sm mt-1">{personal.fullName}</p></div>
                            <div><p className="font-bold text-gray-800">ID:</p><p className="text-gray-600 text-sm mt-1">{personal.id}</p></div>
                            <div><p className="font-bold text-gray-800">Fecha de Nacimiento:</p><p className="text-gray-600 text-sm mt-1">{personal.birthDate}</p></div>
                            <div><p className="font-bold text-gray-800">Sexo:</p><p className="text-gray-600 text-sm mt-1">{personal.gender}</p></div>
                            <div><p className="font-bold text-gray-800">Correo Electrónico:</p><p className="text-blue-600 text-sm mt-1 truncate">{personal.email}</p></div>
                            <div><p className="font-bold text-gray-800">Telefono:</p><p className="text-gray-600 text-sm mt-1">{personal.phone}</p></div>
                            <div className="col-span-2"><p className="font-bold text-gray-800">Domicilio</p><p className="text-gray-600 text-sm mt-1">{personal.address}</p></div>
                        </div>
                        <div className="mt-6 pt-4">
                            <button onClick={() => setModalState(p => ({...p, personal: true}))} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1">
                                Haz clic para ver detalles completos <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Tarjeta: Datos Académicos */}
                    <div className={`${cardStyle} relative flex flex-col`}>
                        <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Datos Académicos</h3>
                        <div className="grid grid-cols-2 gap-y-8 gap-x-4 text-sm md:text-base flex-1">
                            <div className="text-center md:text-left"><p className="font-bold text-gray-800">Semestre</p><p className="text-gray-600 mt-1">{academic.semester}</p></div>
                            <div className="text-center md:text-right"><p className="font-bold text-gray-800">Promedio</p><p className="text-green-600 font-bold mt-1">{academic.average.toFixed(1)}</p></div>
                            <div className="text-center md:text-left"><p className="font-bold text-gray-800">Estado Académico</p><p className="text-gray-600 mt-1">{academic.status}</p></div>
                            <div className="text-center md:text-right"><p className="font-bold text-gray-800">Materias Aprobadas</p><p className="text-gray-600 mt-1">{academic.approvedSubjects}</p></div>
                            <div className="col-span-2 text-center md:text-left"><p className="font-bold text-gray-800">Fecha de Ingreso</p><p className="text-gray-600 mt-1">{academic.admissionDate}</p></div>
                        </div>
                         <div className="mt-6 pt-4">
                             <button onClick={() => setModalState(p => ({...p, academic: true}))} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1">
                                Haz clic para ver detalles completos <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. TARJETA INFERIOR: MIS PAGOS */}
                <div className={`${cardStyle} text-center`}>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Mis Pagos</h3>
                    <p onClick={() => navigate('/alumno/documentos-pagos')} className="text-gray-600 mb-8 cursor-pointer hover:text-blue-600 hover:underline transition-colors" title="Ir a sección de pagos">
                        Consulta adeudos de Documentos Solicitados
                    </p>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
                        <div className="bg-[#344054] text-white py-3 px-8 rounded-lg w-64 text-center shadow-md font-medium text-lg">$ {payment.balanceDue.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                        <div className="bg-[#344054] text-white py-3 px-8 rounded-lg w-64 text-center shadow-md font-medium text-lg">Fecha Actual</div>
                    </div>
                </div>
            </div>

            {/* MODALES FUNCIONALES */}
            {modalState.personal && <PersonalDetailsModal isOpen={modalState.personal} onClose={() => setModalState(p => ({...p, personal: false}))} data={personal} />}
            {modalState.academic && <AcademicDetailsModal isOpen={modalState.academic} onClose={() => setModalState(p => ({...p, academic: false}))} data={academic} />}
            {modalState.edit && <EditProfileModal isOpen={modalState.edit} onClose={() => setModalState(p => ({...p, edit: false}))} currentData={personal} onSave={handleSavePersonalInfo} />}

        </div>
    );
};