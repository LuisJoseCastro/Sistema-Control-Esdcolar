import React, { useState, useEffect, useCallback } from 'react';
import Input from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Edit, Save, X, User as UserIcon, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface DocenteProfileData {
    nombreCompleto: string;
    id: string; 
    especialidad: string;
    fechaNacimiento: string;
    genero: string;
    correo: string;
    telefono: string;
    ciudad: string;
    direccion: string;
    habilidades: string;
    tituloAcademico: string;
    claveEmpleado: string;
    estadoActivo: 'Activo' | 'Inactivo' | 'Vacaciones';
}

const initialProfileData: DocenteProfileData = {
    nombreCompleto: "Cargando...",
    id: "",
    especialidad: "",
    fechaNacimiento: "1980-01-01",
    genero: "Masculino",
    correo: "",
    telefono: "",
    ciudad: "",
    direccion: "",
    habilidades: "",
    tituloAcademico: "",
    claveEmpleado: "",
    estadoActivo: 'Activo',
};

const DocentePerfilPage: React.FC = () => {
    const token = localStorage.getItem('token');
    const [profileData, setProfileData] = useState<DocenteProfileData>(initialProfileData);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tempData, setTempData] = useState<DocenteProfileData>(initialProfileData);
    const [notificacion, setNotificacion] = useState<{ mensaje: string, tipo: 'success' | 'error' } | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!token) return;
        try {
            const response = await fetch(`${API_URL}/academic/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                const cleanData: DocenteProfileData = {
                    nombreCompleto: data.user?.fullName || "Docente",
                    id: data.id || "N/A",
                    claveEmpleado: data.claveEmpleado || "S/N",
                    especialidad: data.especialidad || "",
                    fechaNacimiento: "1980-01-01", 
                    genero: "Masculino",
                    correo: data.user?.email || "",
                    telefono: data.telefono || "",
                    ciudad: data.ciudad || "",
                    direccion: data.direccion || "",
                    habilidades: data.habilidades || "",
                    tituloAcademico: data.tituloAcademico || "",
                    estadoActivo: 'Activo'
                };
                setProfileData(cleanData);
                setTempData(cleanData);
            }
        } catch (error) {
            console.error(error);
        }
    }, [token]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (notificacion) {
            const timer = setTimeout(() => setNotificacion(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notificacion]);

    const handleEditToggle = () => {
        if (!isEditing) { 
            setTempData(profileData); 
        }
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/academic/profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(tempData)
            });

            if (response.ok) {
                setProfileData(tempData);
                setIsEditing(false);
                setNotificacion({ mensaje: "Cambios guardados correctamente", tipo: 'success' });
            } else {
                throw new Error('Error al guardar');
            }
        } catch {
            setNotificacion({ mensaje: "Error al guardar los cambios", tipo: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTempData(prev => ({ ...prev, [name]: value }));
    };

    const displayData = isEditing ? tempData : profileData;

    return (
        <div className="min-h-screen bg-whiteBg-50 p-8 relative overflow-hidden">
            {notificacion && (
                <div className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-2xl border-l-4 ${
                    notificacion.tipo === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'
                }`}>
                    {notificacion.tipo === 'success' ? <CheckCircle className="mr-3" size={24} /> : <AlertCircle className="mr-3" size={24} />}
                    <span className="font-medium">{notificacion.mensaje}</span>
                    <button onClick={() => setNotificacion(null)} className="ml-4 hover:opacity-70"><X size={18} /></button>
                </div>
            )}

            <h1 className="text-4xl font-serif italic text-gray-800 mb-8">Perfil del Maestro</h1>

            <Card className="p-8 mb-8 flex items-center bg-grayLight-300 shadow-xl border border-gray-200">
                <div className="w-32 h-32 bg-purple-200 rounded-full flex items-center justify-center mr-8 shrink-0 shadow-inner">
                    <UserIcon size={64} className="text-purple-600" />
                </div>
                <div className="flex-grow">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{displayData.tituloAcademico} {displayData.nombreCompleto}</h2>
                    <p className="text-sm text-gray-600">No. Empleado: <span className="font-mono font-bold text-main-700">{displayData.claveEmpleado}</span></p>
                    <p className="text-sm text-gray-600">Especialidad: <strong>{displayData.especialidad}</strong></p>
                </div>
                <div className="shrink-0 ml-auto">
                    {isEditing ? (
                        <div className="flex space-x-3">
                            <Button variant="primary" onClick={handleSave} disabled={loading}>
                                <Save size={18} className="mr-2" /> {loading ? 'Guardando...' : 'Guardar'}
                            </Button>
                            <Button variant="secondary" onClick={handleEditToggle} disabled={loading}>
                                <X size={18} className="mr-2" /> Cancelar
                            </Button>
                        </div>
                    ) : (
                        <Button variant="secondary" onClick={handleEditToggle}>
                            <Edit size={18} className="mr-2" /> Editar Perfil
                        </Button>
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 bg-white shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold mb-6 border-b pb-2 text-main-800">Información Personal</h3>
                    <div className="space-y-4">
                        <Input label="Nombre Completo" name="nombreCompleto" value={displayData.nombreCompleto} readOnly={true} onChange={handleChange} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Clave Empleado" name="claveEmpleado" value={displayData.claveEmpleado} readOnly={!isEditing} onChange={handleChange} />
                            <Input label="Título (Lic, Ing, Mtro)" name="tituloAcademico" value={displayData.tituloAcademico} readOnly={!isEditing} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Correo Electrónico" name="correo" value={displayData.correo} readOnly={true} onChange={handleChange} />
                            <Input label="Teléfono" type='number' name="telefono" value={displayData.telefono} readOnly={!isEditing} onChange={handleChange} />
                        </div>
                        <Input label="Ciudad" name="ciudad" value={displayData.ciudad} readOnly={!isEditing} onChange={handleChange} />
                        <Input label="Dirección" name="direccion" value={displayData.direccion} readOnly={!isEditing} onChange={handleChange} />
                    </div>
                </Card>

                <Card className="p-6 bg-white shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold mb-6 border-b pb-2 text-main-800">Datos Académicos</h3>
                    <div className="space-y-4">
                        <Input label="Especialidad" name="especialidad" value={displayData.especialidad} readOnly={!isEditing} onChange={handleChange} />
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Habilidades / Biografía</label>
                            <textarea
                                name="habilidades"
                                value={displayData.habilidades}
                                onChange={handleChange} 
                                readOnly={!isEditing}
                                rows={5}
                                className={`block w-full border rounded-lg px-3 py-2 transition-all ${!isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white border-blue-400 ring-2 ring-blue-100'}`}
                            />
                        </div>
                    </div>
                </Card>
            </div>
            <div className="h-10"></div>
        </div>
    );
};

export default DocentePerfilPage;