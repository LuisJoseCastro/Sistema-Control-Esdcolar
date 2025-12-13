// src/pages/docente/DocentePerfilPage.tsx (Versión con la sección académica alineada al diseño)

import React, { useState } from 'react'; 
import Input from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Edit, Save, X, User as UserIcon } from 'lucide-react';

// Interfaz para los datos del perfil específico del docente
interface DocenteProfileData {
    nombreCompleto: string;
    id: string;
    // --- Campos de la Imagen ---
    especialidad: string;
    fechaNacimiento: string;
    genero: string;
    correo: string;
    telefono: string;
    ciudad: string;
    direccion: string;
    habilidades: string;
    materias: string;
    grupos: string; // Campo que se ajustó
    estadoActivo: 'Activo' | 'Inactivo' | 'Vacaciones';
    // ---------------------------
}

// Datos MOCK iniciales (Ajustados para reflejar todos los campos, incluyendo los académicos)
const initialProfileData: DocenteProfileData = {
    nombreCompleto: "Miguel Hidalgo",
    id: "DOC-4567",
    especialidad: "Historia y Geografía",
    fechaNacimiento: "17/05/1970",
    genero: "Masculino",
    correo: "m.hidalgo@escuela.edu",
    telefono: "55 1234 5678",
    ciudad: "Ciudad de México",
    direccion: "Av. Siempre Viva #742",
    habilidades: "Liderazgo, Oratoria, Planificación curricular.",
    materias: "Historia Universal, Historia de México, Geografía.",
    grupos: "A101, B203",
    estadoActivo: 'Activo',
};

// =================================================================================
// COMPONENTE PRINCIPAL
// =================================================================================

const DocentePerfilPage: React.FC = () => {
    
    const [profileData, setProfileData] = useState<DocenteProfileData>(initialProfileData);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tempData, setTempData] = useState<DocenteProfileData>(initialProfileData);

    const handleEditToggle = () => {
        if (isEditing) { setTempData(profileData); }
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800)); 
        setProfileData(tempData);
        setIsEditing(false);
        setLoading(false);
        console.log("Perfil guardado:", tempData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTempData(prev => ({ ...prev, [name]: value }));
    };

    const displayData = isEditing ? tempData : profileData;
    
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* TÍTULO */}
            <h1 className="text-4xl font-serif italic text-gray-800 mb-8">
                Perfil del Maestro
            </h1>

            {/* SECCIÓN SUPERIOR DE RESUMEN */}
            <Card className="p-8 mb-8 flex items-center bg-white shadow-xl">
                {/* Avatar */}
                <div className="w-32 h-32 bg-purple-200 rounded-full flex items-center justify-center mr-8 shrink-0">
                    <UserIcon size={64} className="text-purple-600" />
                </div>
                
                {/* Datos del Perfil y Botón */}
                <div className="flex-grow">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{profileData.nombreCompleto}</h2>
                    <p className="text-sm text-gray-600">ID: {profileData.id}</p>
                    <p className="text-sm text-gray-600">Especialidad: {profileData.especialidad}</p>
                </div>
                
                {/* Botón de Editar/Guardar */}
                <div className="shrink-0 ml-auto">
                    {isEditing ? (
                        <div className="flex space-x-3">
                            <Button variant="primary" onClick={handleSave} disabled={loading}>
                                <Save size={18} className="mr-2" />
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                            <Button variant="secondary" onClick={handleEditToggle} disabled={loading}>
                                <X size={18} className="mr-2" />
                                Cancelar
                            </Button>
                        </div>
                    ) : (
                        <Button variant="secondary" onClick={handleEditToggle}>
                            <Edit size={18} className="mr-2" />
                            Editar Perfil
                        </Button>
                    )}
                </div>
            </Card>


            {/* INFORMACIÓN PERSONAL Y ACADÉMICA (GRID PRINCIPAL) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* TARJETA 1: INFORMACIÓN PERSONAL (Sin cambios) */}
                <Card className="p-6 bg-white shadow-lg">
                    <h3 className="text-xl font-semibold mb-6 border-b pb-2">Información Personal</h3>
                    <div className="space-y-4">
                        <Input 
                            label="Nombre Completo" 
                            name="nombreCompleto" 
                            value={displayData.nombreCompleto} 
                            readOnly={!isEditing}
                            onChange={handleChange}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="ID" name="id" value={displayData.id} readOnly/>
                            <Input 
                                label="Fecha de Nacimiento" 
                                name="fechaNacimiento" 
                                value={displayData.fechaNacimiento} 
                                readOnly={!isEditing}
                                onChange={handleChange}
                            />
                        </div>
                        <Input 
                            label="Género" 
                            name="genero" 
                            value={displayData.genero} 
                            readOnly={!isEditing}
                            onChange={handleChange}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input 
                                label="Correo Electrónico" 
                                name="correo" 
                                value={displayData.correo} 
                                readOnly={!isEditing}
                                onChange={handleChange}
                            />
                            <Input 
                                label="Teléfono" 
                                name="telefono" 
                                value={displayData.telefono} 
                                readOnly={!isEditing}
                                onChange={handleChange}
                            />
                        </div>
                        <Input 
                            label="Ciudad" 
                            name="ciudad" 
                            value={displayData.ciudad} 
                            readOnly={!isEditing}
                            onChange={handleChange}
                        />
                        <Input 
                            label="Dirección" 
                            name="direccion" 
                            value={displayData.direccion} 
                            readOnly={!isEditing}
                            onChange={handleChange}
                        />
                    </div>
                </Card>

                {/* 🚨 TARJETA 2: DATOS ACADÉMICOS Y LABORALES (CORREGIDA) */}
                <Card className="p-6 bg-white shadow-lg">
                    <h3 className="text-xl font-semibold mb-6 border-b pb-2">Datos Académicos</h3>
                    <div className="space-y-4">
                        
                        {/* Fila 1: Especialidad / Estado Activo */}
                        <div className="grid grid-cols-2 gap-4">
                            <Input 
                                label="Especialidad" 
                                name="especialidad" 
                                value={displayData.especialidad} 
                                readOnly={!isEditing}
                                onChange={handleChange}
                            />
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Estado Activo</span>
                                <select 
                                    name="estadoActivo" 
                                    value={displayData.estadoActivo} 
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`mt-1 block w-full border rounded-lg px-3 py-2 ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
                                >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                    <option value="Vacaciones">Vacaciones</option>
                                </select>
                            </label>
                        </div>
                        
                        {/* Fila 2: Habilidades / Grupos (Dos textareas uno al lado del otro) */}
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Habilidades</span>
                                <textarea
                                    name="habilidades"
                                    value={displayData.habilidades}
                                    onChange={handleChange as any}
                                    readOnly={!isEditing}
                                    rows={3}
                                    className={`mt-1 block w-full border rounded-lg px-3 py-2 ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
                                />
                            </label>
                            
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Grupos</span>
                                <textarea
                                    name="grupos"
                                    value={displayData.grupos}
                                    onChange={handleChange as any}
                                    readOnly={!isEditing}
                                    rows={3}
                                    className={`mt-1 block w-full border rounded-lg px-3 py-2 ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
                                />
                            </label>
                        </div>

                        {/* Fila 3: Materias (Un textarea ancho) */}
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Materias</span>
                            <textarea
                                name="materias"
                                value={displayData.materias}
                                onChange={handleChange as any}
                                readOnly={!isEditing}
                                rows={2}
                                className={`mt-1 block w-full border rounded-lg px-3 py-2 ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
                            />
                        </label>
                        
                    </div>
                </Card>
            </div>
            
            <div className="h-10"></div>
        </div>
    );
};

export default DocentePerfilPage;