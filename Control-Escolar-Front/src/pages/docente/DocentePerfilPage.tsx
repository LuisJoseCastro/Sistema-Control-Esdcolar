import React, { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Edit, Save, X, User as UserIcon, CheckCircle, AlertCircle } from 'lucide-react';

const TEACHER_ID = "550e8400-e29b-41d4-a716-446655440000";

// Interfaz adaptada al backend
interface DocenteProfileData {
    nombreCompleto: string;
    id: string; // Puede ser claveEmpleado
    especialidad: string;
    fechaNacimiento: string;
    genero: string;
    correo: string;
    telefono: string;
    ciudad: string;
    direccion: string;
    habilidades: string;
    materias: string;
    grupos: string; 
    estadoActivo: 'Activo' | 'Inactivo' | 'Vacaciones';
}

const initialProfileData: DocenteProfileData = {
    nombreCompleto: "Cargando...",
    id: "",
    especialidad: "",
    fechaNacimiento: "",
    genero: "Masculino",
    correo: "",
    telefono: "",
    ciudad: "",
    direccion: "",
    habilidades: "",
    materias: "",
    grupos: "",
    estadoActivo: 'Activo',
};

const DocentePerfilPage: React.FC = () => {
    const [profileData, setProfileData] = useState<DocenteProfileData>(initialProfileData);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tempData, setTempData] = useState<DocenteProfileData>(initialProfileData);
    const [notificacion, setNotificacion] = useState<{ mensaje: string, tipo: 'success' | 'error' } | null>(null);

    // FETCH DATOS REALES
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Endpoint definido en TeacherController
                const response = await fetch('http://localhost:3000/teacher/profile', {
                    headers: {
                        // En un app real, aquí iría 'Authorization': 'Bearer ...'
                        // Como estamos usando un hack rápido, el controller usaba req.user.userId
                        // Si el backend no tiene Auth bypass, esto fallará sin token.
                        // Asumiremos que estás logueado y el token se inyecta por interceptor o 
                        // usaremos un endpoint público temporal si falla.
                        'Authorization': `Bearer ${localStorage.getItem('token')}` 
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    // Mapeo Backend -> Frontend
                    setProfileData({
                        nombreCompleto: data.user?.fullName || "Docente",
                        id: data.claveEmpleado || "N/A",
                        especialidad: data.especialidad || "",
                        fechaNacimiento: "1980-01-01", // Dato no en perfil docente, mockeado
                        genero: "Masculino",
                        correo: data.user?.email || "",
                        telefono: data.telefono || "",
                        ciudad: data.ciudad || "",
                        direccion: data.direccion || "",
                        habilidades: data.habilidades || "",
                        materias: "Ver carga académica",
                        grupos: "Ver carga académica",
                        estadoActivo: 'Activo'
                    });
                    setTempData(profileData);
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            }
        };
        fetchProfile();
    }, []);

    // ... (El resto del código de UI es idéntico, solo cambia la lógica de handleSave)

    useEffect(() => {
        if (notificacion) {
            const timer = setTimeout(() => setNotificacion(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notificacion]);

    const handleEditToggle = () => {
        if (isEditing) { setTempData(profileData); }
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Aquí harías el PUT /teacher/profile
            // await fetch('...', { method: 'PUT', body: JSON.stringify(tempData) ... })
            
            // Simulamos éxito por ahora
            await new Promise(resolve => setTimeout(resolve, 800)); 
            
            setProfileData(tempData);
            setIsEditing(false);
            
            setNotificacion({ 
                mensaje: "¡Cambios realizados correctamente!", 
                tipo: 'success' 
            });
        } catch (e) {
            setNotificacion({ mensaje: "Error al guardar", tipo: 'error' });
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
            {/* ... (Todo el JSX visual se mantiene igual) ... */}
            {/* Solo pego el inicio para referencia, el resto es visual */}
            
            {notificacion && (
                <div className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-2xl border-l-4 transform transition-all duration-500 animate-in fade-in slide-in-from-right-10 ${
                    notificacion.tipo === 'success' 
                    ? 'bg-green-50 border-green-500 text-green-800' 
                    : 'bg-red-50 border-red-500 text-red-800'
                }`}>
                    {notificacion.tipo === 'success' ? <CheckCircle className="mr-3" size={24} /> : <AlertCircle className="mr-3" size={24} />}
                    <span className="font-medium">{notificacion.mensaje}</span>
                    <button onClick={() => setNotificacion(null)} className="ml-4 hover:opacity-70">
                        <X size={18} />
                    </button>
                </div>
            )}

            <h1 className="text-4xl font-serif italic text-gray-800 mb-8">
                Perfil del Maestro
            </h1>

            <Card className="p-8 mb-8 flex items-center bg-grayLight-300 shadow-xl border border-gray-200">
                <div className="w-32 h-32 bg-purple-200 rounded-full flex items-center justify-center mr-8 shrink-0 shadow-inner">
                    <UserIcon size={64} className="text-purple-600" />
                </div>

                <div className="flex-grow">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{displayData.nombreCompleto}</h2>
                    <p className="text-sm text-gray-600">ID: <span className="font-mono font-bold text-main-700">{displayData.id}</span></p>
                    <p className="text-sm text-gray-600">Especialidad: <strong>{displayData.especialidad}</strong></p>
                </div>

                <div className="shrink-0 ml-auto">
                    {isEditing ? (
                        <div className="flex space-x-3">
                            <Button variant="primary" onClick={handleSave} disabled={loading} className="shadow-lg shadow-blue-200">
                                <Save size={18} className="mr-2" />
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                            <Button variant="secondary" onClick={handleEditToggle} disabled={loading}>
                                <X size={18} className="mr-2" />
                                Cancelar
                            </Button>
                        </div>
                    ) : (
                        <Button variant="secondary" onClick={handleEditToggle} className="hover:bg-gray-200 transition-colors">
                            <Edit size={18} className="mr-2" />
                            Editar Perfil
                        </Button>
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* TARJETA 1 */}
                <Card className="p-6 bg-white shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold mb-6 border-b pb-2 text-main-800">Información Personal</h3>
                    <div className="space-y-4">
                        <Input label="Nombre Completo" name="nombreCompleto" value={displayData.nombreCompleto} readOnly={true} onChange={handleChange} />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="ID" name="id" value={displayData.id} readOnly />
                            <Input label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={displayData.fechaNacimiento} readOnly={!isEditing} onChange={handleChange} />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Género</label>
                            <select
                                name="genero"
                                value={displayData.genero}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`block w-full border rounded-lg px-3 py-2.5 transition-all outline-none ${
                                    !isEditing 
                                    ? 'bg-gray-50 text-gray-500 border-gray-200' 
                                    : 'bg-white border-blue-400 ring-2 ring-blue-50'
                                }`}
                            >
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Correo Electrónico" name="correo" value={displayData.correo} readOnly={true} onChange={handleChange} />
                            <Input label="Teléfono" type='number' name="telefono" value={displayData.telefono} readOnly={!isEditing} onChange={handleChange} />
                        </div>
                        <Input label="Ciudad" name="ciudad" value={displayData.ciudad} readOnly={!isEditing} onChange={handleChange} />
                        <Input label="Dirección" name="direccion" value={displayData.direccion} readOnly={!isEditing} onChange={handleChange} />
                    </div>
                </Card>

                {/* TARJETA 2 */}
                <Card className="p-6 bg-white shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold mb-6 border-b pb-2 text-main-800">Datos Académicos</h3>
                    <div className="space-y-4">
                        <Input label="Especialidad" name="especialidad" value={displayData.especialidad} readOnly={!isEditing} onChange={handleChange} />
                        
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Habilidades</label>
                            <textarea
                                name="habilidades"
                                value={displayData.habilidades}
                                onChange={handleChange as any}
                                readOnly={!isEditing}
                                rows={3}
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