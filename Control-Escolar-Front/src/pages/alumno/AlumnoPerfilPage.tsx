import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAlumnoProfileData } from '../../services/alumno.service';
import type { AlumnoProfileData, PersonalInfoType, AcademicInfoType } from '../../types/models';

import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';
import { User as UserIcon, ArrowRight } from 'lucide-react';

const PersonalDetailsModal: React.FC<{ isOpen: boolean; onClose: () => void; data: PersonalInfoType }> = ({ isOpen, onClose, data }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Información Personal">
        <div className="space-y-6 text-sm text-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div><p className="font-bold mb-1">Nombre Completo:</p><p>{data.fullName}</p></div>
                <div><p className="font-bold mb-1">Correo Electrónico:</p><p className="text-blue-600">{data.email}</p></div>
                <div><p className="font-bold mb-1">Matrícula (ID):</p><p>{data.id}</p></div>
                <div><p className="font-bold mb-1">Teléfono:</p><p>{data.phone}</p></div>
                <div><p className="font-bold mb-1">Fecha de Nacimiento:</p><p>{data.birthDate}</p></div>
                <div><p className="font-bold mb-1">Domicilio:</p><p>{data.address}</p></div>
                <div><p className="font-bold mb-1">Sexo:</p><p>{data.gender}</p></div>
                <div><p className="font-bold mb-1">CURP:</p><p>{data.curp}</p></div>
            </div>
        </div>
    </Modal>
);

const AcademicDetailsModal: React.FC<{ isOpen: boolean; onClose: () => void; data: AcademicInfoType }> = ({ isOpen, onClose, data }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Datos Académicos">
        <div className="space-y-6 text-sm text-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div><p className="font-bold mb-1">Semestre Actual:</p><p>{data.semester}</p></div>
                <div><p className="font-bold mb-1">Promedio General:</p><p className="text-green-600 font-bold">{data.average.toFixed(1)}</p></div>
                <div><p className="font-bold mb-1">Estatus:</p><p>{data.status}</p></div>
                <div><p className="font-bold mb-1">Materias Aprobadas:</p><p>{data.approvedSubjects}</p></div>
            </div>
        </div>
    </Modal>
);

export const AlumnoPerfilPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<AlumnoProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState<{ personal: boolean, academic: boolean }>({ personal: false, academic: false });

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

    if (loading) return <div className="flex justify-center mt-20"><LoadingSpinner /></div>;
    if (!profileData) return <div>Error cargando perfil.</div>;

    const { resumen, personal, academic, payment } = profileData;
    const cardStyle = "bg-[#f4f6f8] rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8";

    return (
        <div className="p-8 bg-white min-h-full font-sans">
            <header className="flex justify-between items-end border-b-2 border-gray-400 pb-2 mb-10">
                <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>Perfil del Estudiante</h1>
                <div className="mb-2"><UserHeaderIcons /></div>
            </header>

            <div className="flex flex-col gap-8 max-w-7xl mx-auto">
                <Card className={`${cardStyle} flex flex-col md:flex-row items-center justify-between gap-8 bg-grayDark-200`}>
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
                    <div className="text-center md:text-right min-w-[150px]">
                        <p className="text-sm font-bold text-gray-500 uppercase">Promedio:</p>
                        <p className="text-4xl font-extrabold ">{resumen.average.toFixed(1)}</p>
                    </div>
                </Card>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <Card className={`${cardStyle} relative flex flex-col bg-grayDark-200`}>
                        <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Información Personal</h3>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm md:text-base flex-1">
                            <div><p className="font-bold text-gray-800">Nombre:</p><p className="text-gray-600 text-sm mt-1">{personal.fullName}</p></div>
                            <div><p className="font-bold text-gray-800">ID:</p><p className="text-gray-600 text-sm mt-1">{personal.id}</p></div>
                            <div><p className="font-bold text-gray-800">Fecha Nac:</p><p className="text-gray-600 text-sm mt-1">{personal.birthDate}</p></div>
                            <div><p className="font-bold text-gray-800">Sexo:</p><p className="text-gray-600 text-sm mt-1">{personal.gender}</p></div>
                            <div><p className="font-bold text-gray-800">Email:</p><p className="text-blue-600 text-sm mt-1 truncate">{personal.email}</p></div>
                            <div><p className="font-bold text-gray-800">Teléfono:</p><p className="text-gray-600 text-sm mt-1">{personal.phone}</p></div>
                            <div className="col-span-2"><p className="font-bold text-gray-800">Domicilio</p><p className="text-gray-600 text-sm mt-1">{personal.address}</p></div>
                        </div>
                        <div className="mt-6 pt-4 text-right">
                            <Button onClick={() => setModalState(p => ({ ...p, personal: true }))} variant="ghost" className="text-blue-600 text-sm font-bold p-0 bg-main-800" icon={<ArrowRight size={16} />}>Ver detalles</Button>
                        </div>
                    </Card>


                    <Card className={`${cardStyle} relative flex flex-col bg-grayDark-200`}>
                        <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Datos Académicos</h3>
                        <div className="grid grid-cols-2 gap-y-8 gap-x-4 text-sm md:text-base flex-1">
                            <div><p className="font-bold text-gray-800">Semestre</p><p className="text-gray-600 mt-1">{academic.semester}</p></div>
                            <div className="text-right"><p className="font-bold text-gray-800">Promedio</p><p className="text-green-600 font-bold mt-1">{academic.average.toFixed(1)}</p></div>
                            <div><p className="font-bold text-gray-800">Estatus</p><p className="text-gray-600 mt-1">{academic.status}</p></div>
                            <div className="text-right"><p className="font-bold text-gray-800">Aprobadas</p><p className="text-gray-600 mt-1">{academic.approvedSubjects}</p></div>
                        </div>
                        <div className="mt-6 pt-4 text-right">
                            <Button onClick={() => setModalState(p => ({ ...p, academic: true }))} variant="ghost" className="text-blue-600 text-sm font-bold p-0" icon={<ArrowRight size={16} />}>Ver detalles</Button>
                        </div>
                    </Card>
                </div>


                <Card className={`${cardStyle} text-center bg-grayDark-200`}>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Mis Pagos</h3>
                    <p onClick={() => navigate('/alumno/documentos-pagos')} className="text-gray-600 mb-8 cursor-pointer hover:text-blue-600 hover:underline">Consulta adeudos</p>
                    <div className="flex justify-center gap-6">
                        <div className="bg-[#344054] text-white py-3 px-8 rounded-lg min-w-[200px] shadow-md font-medium text-lg">$ {payment.balanceDue.toFixed(2)}</div>
                    </div>
                </Card>
            </div>

            {modalState.personal && profileData.personal && <PersonalDetailsModal isOpen={modalState.personal} onClose={() => setModalState(p => ({ ...p, personal: false }))} data={profileData.personal} />}
            {modalState.academic && profileData.academic && <AcademicDetailsModal isOpen={modalState.academic} onClose={() => setModalState(p => ({ ...p, academic: false }))} data={profileData.academic} />}
        </div>
    );
};