//src/pages/alumno/AlumnoPerfilPage.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';
import { useAuth } from '../../hooks/useAuth';
import { getAlumnoProfileData } from '../../services/alumno.service';
import { useNavigate } from 'react-router-dom';
import type {
    AlumnoProfileData,
    PersonalInfoType,
    AcademicInfoType
} from '../../types/models';
import { User as UserIcon, Calendar, Mail, Phone, MapPin, Edit3, ArrowRight } from 'lucide-react';

// Formato de Moneda (MXN en este caso, o el que uses)
const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

// Componente para el Modal de Información Personal (Detalles)
const PersonalDetailsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    data: PersonalInfoType;
}> = ({ isOpen, onClose, data }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Información Personal">
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
                <p><strong>Nombre Completo:</strong> {data.fullName}</p>
                <p><strong>ID:</strong> {data.id}</p>
                <p><strong>Fecha de Nacimiento:</strong> {data.birthDate}</p>
                <p><strong>Sexo:</strong> {data.gender}</p>
            </div>
            <div className="space-y-2">
                <p><strong>Correo Electrónico:</strong> <a href={`mailto:${data.email}`} className="text-blue-600">{data.email}</a></p>
                <p><strong>Teléfono:</strong> <a href={`tel:${data.phone}`} className="text-blue-600">{data.phone}</a></p>
                <p><strong>Domicilio:</strong> {data.address}</p>
            </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Información Adicional</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
                <p><strong>Nacionalidad:</strong> {data.nationality}</p>
                <p><strong>Estado Civil:</strong> {data.civilStatus}</p>
                <p><strong>Tipo de Sangre:</strong> {data.bloodType}</p>
                <p><strong>Discapacidad:</strong> {data.disability}</p>
                <p><strong>CURP:</strong> {data.curp}</p>
                <p><strong>NSS:</strong> {data.nss}</p>
            </div>
        </div>
    </Modal>
);

// Componente para el Modal de Datos Académicos (Detalles)
const AcademicDetailsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    data: AcademicInfoType;
}> = ({ isOpen, onClose, data }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Datos Académicos">
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
                <p><strong>Semestre:</strong> {data.semester}</p>
                <p><strong>Promedio:</strong> <span className="font-bold text-green-600">{data.average.toFixed(1)}</span></p>
                <p><strong>Estado Académico:</strong> {data.status}</p>
                <p><strong>Materias Aprobadas:</strong> {data.approvedSubjects}</p>
            </div>
            <div className="space-y-2">
                <p><strong>Fecha de Ingreso:</strong> {data.admissionDate}</p>
                <p><strong>Carrera:</strong> {data.faculty} en {data.studyPlan}</p>
                <p><strong>Modalidad:</strong> {data.modality}</p>
            </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Información Adicional</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
                <p><strong>Facultad:</strong> {data.faculty}</p>
                <p><strong>Plan de Estudios:</strong> {data.studyPlan}</p>
                <p><strong>Modalidad:</strong> {data.modality}</p>
                <p><strong>Turno:</strong> {data.turn}</p>
                <p><strong>Período:</strong> {data.period}</p>
                <p><strong>Créditos Obtenidos:</strong> {data.credits}</p>
            </div>
        </div>
    </Modal>
);

// Componente para el Modal de Edición de Perfil
const EditProfileModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    currentData: PersonalInfoType;
    onSave: (data: PersonalInfoType) => void;
}> = ({ isOpen, onClose, currentData, onSave }) => {
    const [formData, setFormData] = useState(currentData);

    useEffect(() => {
        if (isOpen) {
            setFormData(currentData);
        }
    }, [isOpen, currentData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Datos a guardar:", formData);
        onSave(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Información Personal" className="max-w-xl">
            <h4 className="font-semibold mb-3 border-b pb-2">Información Básica</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="text-sm font-medium">Nombre Completo *</label>
                    <Input name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div>
                    <label className="text-sm font-medium">Sexo *</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium">Fecha de Nacimiento *</label>
                    <Input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required />
                </div>
            </div>

            <h4 className="font-semibold mb-3 border-b pb-2">Información de Contacto</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="text-sm font-medium">Correo Electrónico *</label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label className="text-sm font-medium">Teléfono *</label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="col-span-2">
                    <label className="text-sm font-medium">Domicilio *</label>
                    <Input name="address" value={formData.address} onChange={handleChange} required />
                </div>
            </div>

            <h4 className="font-semibold mb-3 border-b pb-2 text-gray-400">Información No Editable</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <p><strong>ID del Estudiante:</strong> {formData.id}</p>
                <p><strong>Estado:</strong> Activo</p>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
                <Button variant="primary" type="button" onClick={handleSave}>Guardar Cambios</Button>
            </div>
        </Modal>
    );
};


// Componente principal de la página
export const AlumnoPerfilPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<AlumnoProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    const [isPersonalDetailsModalOpen, setIsPersonalDetailsModalOpen] = useState(false);
    const [isAcademicDetailsModalOpen, setIsAcademicDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // 1. Carga inicial de datos
    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user?.id) return;
            try {
                const data = await getAlumnoProfileData(user.id);
                setProfileData(data);
            } catch (error) {
                console.error("Error al cargar datos del perfil:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [user]);

    // 2. Función para manejar el guardado de edición
    const handleSavePersonalInfo = (newData: PersonalInfoType) => {
        if (profileData) {
            setProfileData({
                ...profileData,
                personal: newData,
                resumen: {
                    ...profileData.resumen,
                    name: newData.fullName,
                }
            });
            alert("¡Información Personal Actualizada con Éxito!");
        }
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-[500px]">
                <LoadingSpinner text="Cargando información del perfil..." />
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="p-8">
                <h1 className="text-4xl font-light text-gray-800 mb-6">Perfil del Estudiante</h1>
                <p className="text-red-500">No se pudieron cargar los datos del perfil.</p>
            </div>
        );
    }

    const data = profileData;

    return (
        <div className="p-8 bg-gray-50 min-h-full">

            {/* Encabezado con título e íconos */}
            <header className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-8">
                <h1 className="text-4xl font-[Kaushan Script] text-gray-800">
                    Perfil del Estudiante
                </h1>
                <UserHeaderIcons />
            </header>

            {/* 1. CARD SUPERIOR: RESUMEN Y EDICIÓN (Mantenida, ya que sí tiene fondo y sombra) */}
            <Card className="p-6 mb-8 flex items-center justify-between shadow-lg">
                <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <UserIcon size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{data.resumen.name}</h2>
                        <p className="text-gray-500 text-sm">ID: {data.resumen.id}</p>
                        <p className="text-gray-600">{data.resumen.career}</p>
                        <p className="text-gray-600">{data.resumen.semester}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="mb-4">
                        <span className="text-sm font-semibold text-gray-500 block">Promedio:</span>
                        <span className="text-4xl font-extrabold text-blue-600">{data.resumen.average.toFixed(1)}</span>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => setIsEditModalOpen(true)}
                        className="shadow-md text-sm py-2 px-4"
                    >
                        <Edit3 size={16} className="mr-2" /> Editar
                    </Button>
                </div>
            </Card>

            {/* ✅ SECCIÓN INFERIOR: TRES CARDS ALINEADAS (Personal | Académico | Pagos) */}
            <div className="flex flex-col space-y-8">

                {/* FILA 1: INFORMACIÓN PERSONAL (50%) Y DATOS ACADÉMICOS (50%) */}
                <div className="flex flex-wrap gap-8">

                    {/* CARD 2: Información Personal (Expandida al 50%) */}
                    <Card className="flex-1 min-w-[45%] shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Información Personal</h3>
                        <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-700">
                            <p className="col-span-1"><strong>Nombre Completo:</strong> {data.personal.fullName}</p>
                            <p className="col-span-1"><strong>ID:</strong> {data.personal.id}</p>

                            <p className="col-span-1 flex items-center"><Calendar size={16} className="mr-2 text-gray-400" /> <strong>Fecha de Nacimiento:</strong> {data.personal.birthDate}</p>
                            <p className="col-span-1"><strong>Sexo:</strong> {data.personal.gender}</p>

                            <p className="col-span-2 flex items-center"><Mail size={16} className="mr-2 text-gray-400" /> <strong>Correo Electrónico:</strong> <a href={`mailto:${data.personal.email}`} className="text-blue-600">{data.personal.email}</a></p>

                            <p className="col-span-2 flex items-center"><Phone size={16} className="mr-2 text-gray-400" /> <strong>Teléfono:</strong> {data.personal.phone}</p>

                            <p className="col-span-2 flex items-start"><MapPin size={16} className="mr-2 mt-1 text-gray-400" /> <strong>Domicilio:</strong> {data.personal.address}</p>
                        </div>
                        <button
                            onClick={() => setIsPersonalDetailsModalOpen(true)}
                            className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                        >
                            Haz clic para ver detalles completos <ArrowRight size={16} className="ml-1" />
                        </button>
                    </Card>

                    {/* CARD 3: Datos Académicos (Expandida al 50%) */}
                    <Card className="flex-1 min-w-[45%] shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Datos Académicos</h3>
                        <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-700">
                            <p className="col-span-1"><strong>Semestre:</strong> {data.academic.semester}</p>
                            <p className="col-span-1"><strong>Promedio:</strong> <span className="font-bold text-green-600">{data.academic.average.toFixed(1)}</span></p>

                            <p className="col-span-1"><strong>Estado Académico:</strong> {data.academic.status}</p>
                            <p className="col-span-1"><strong>Materias Aprobadas:</strong> {data.academic.approvedSubjects}</p>

                            <p className="col-span-2"><strong>Fecha de Ingreso:</strong> {data.academic.admissionDate}</p>
                        </div>
                        <button
                            onClick={() => setIsAcademicDetailsModalOpen(true)}
                            className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                        >
                            Haz clic para ver detalles completos <ArrowRight size={16} className="ml-1" />
                        </button>
                    </Card>
                </div>


                <div className="flex flex-col items-center w-full pt-8">

                    {/* CARD 4: Mis Pagos (Ahora ocupa 100% del ancho) */}
                    <Card className="shadow-lg w-full">

                        {/* Contenedor para el título y el enlace: Usamos text-center y mb-6 */}
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-semibold mb-2 text-gray-800">Mis Pagos</h3>
                            <p className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer mb-6"
                                onClick={() => navigate('/alumno/documentos-pagos')}> {/* <-- ¡AQUÍ ESTÁ LA REDIRECCIÓN! */}
                                Consulta adeudos de Documentos Solicitados
                            </p>
                        </div>

                        {/* Usamos un contenedor interno para centrar el contenido y mantener el justify-between */}
                        <div className="w-full">
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 max-w-lg mx-auto">
                                <div>
                                    <h4 className="text-3xl font-extrabold text-red-600 mb-1">
                                        {formatCurrency(data.payment.balanceDue)}
                                    </h4>
                                    <Button
                                        variant="primary"
                                        className="bg-green-600 hover:bg-green-700 mt-2 py-2 px-4 text-sm"
                                        onClick={() => alert("Simulando acción de Pago...")}
                                    >
                                        Realizar Pago
                                    </Button>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 text-sm">Fecha Actual</p>
                                    <p className="font-semibold text-gray-700">{new Date(data.payment.lastPaymentDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        * Pago correspondiente al período actual
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        • Vence el 15 del siguiente mes
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>

            {/* Modales (Mantenidos) */}
            {isPersonalDetailsModalOpen && (
                <PersonalDetailsModal
                    isOpen={isPersonalDetailsModalOpen}
                    onClose={() => setIsPersonalDetailsModalOpen(false)}
                    data={data.personal}
                />
            )}

            {isAcademicDetailsModalOpen && (
                <AcademicDetailsModal
                    isOpen={isAcademicDetailsModalOpen}
                    onClose={() => setIsAcademicDetailsModalOpen(false)}
                    data={data.academic}
                />
            )}

            {isEditModalOpen && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    currentData={data.personal}
                    onSave={handleSavePersonalInfo}
                />
            )}

        </div>
    );
};