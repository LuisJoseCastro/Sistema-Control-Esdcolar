// src/pages/admin/AdminDocenteProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Edit, BookOpen, Clock } from 'lucide-react'; 

// Importación de Componentes UI
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// 🛑 Servicio y Tipos (Importando de admin.service.ts)
import { getDocenteProfileById } from '../../services/admin.service';
import { type DocenteProfile } from '../../types/models';

/**
 * Componente que muestra la información de un perfil de Docente (solo lectura para el Admin).
 */
export const AdminDocenteProfilePage: React.FC = () => {
    const { id: docenteId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<DocenteProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!docenteId) {
            setError('ID de docente no proporcionado.');
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            try {
                // 🛑 Llamada a la función consolidada en admin.service.ts
                const data = await getDocenteProfileById(docenteId); 
                if (data) {
                    setProfile(data);
                } else {
                    setError('Perfil de Docente no encontrado.');
                }
            } catch (err) {
                setError('Error al cargar el perfil.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [docenteId]);

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center h-[calc(100vh-100px)]">
                <LoadingSpinner text="Cargando perfil del docente..." />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-3xl text-red-600">Error</h1>
                <p>{error}</p>
                <Button onClick={() => navigate('/admin/docentes')} className="mt-4">
                    Volver a Docentes
                </Button>
            </div>
        );
    }
    
    const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    const timeSlots = Array.from(new Set(
        days.flatMap(day => Object.keys(profile.horario[day as keyof typeof profile.horario]))
    )).sort();

    return (
        <div className="p-8 bg-white min-h-full font-sans">
            
            {/* TÍTULO Y HEADER PRINCIPAL (Diseño de la imagen) */}
            <header className="mb-8">
                <h1 
                    className="text-5xl text-black border-b border-gray-400 pb-2" 
                    style={{ fontFamily: '"Kaushan Script", cursive' }}
                >
                    perfil docente
                </h1>
            </header>

            {/* INFORMACIÓN BÁSICA */}
            <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <User size={40} /> 
                </div>
                <div className="flex flex-col text-gray-700">
                    <p className="text-2xl font-bold">{profile.nombre}</p>
                    <p className="text-lg mt-1">Clave: <span className="font-mono text-purple-600">{profile.clave}</span></p>
                    <p className="text-md">Especialidad: <strong>{profile.especialidad}</strong></p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                
                {/* 1. DATOS PERSONALES */}
                <Card 
                    header={<span className="font-bold flex items-center gap-2">Datos Personales</span>} 
                    className="relative"
                >
                    <button 
                        className="absolute top-4 right-4 text-gray-400 hover:text-blue-600"
                        title="Editar datos"
                    >
                        <Edit size={20} />
                    </button>
                    <p className="flex items-center gap-3 text-gray-700">
                        <Mail size={20} className="text-blue-500"/>
                        <span className="font-semibold">correo electronico:</span> {profile.email}
                    </p>
                    <p className="flex items-center gap-3 mt-2 text-gray-700">
                        <Phone size={20} className="text-blue-500"/>
                        <span className="font-semibold">No. Telefonico:</span> {profile.telefono || 'No disponible'}
                    </p>
                </Card>

                {/* 2. MATERIAS ASIGNADAS */}
                <Card 
                    header={<span className="font-bold flex items-center gap-2">Materias Asignadas</span>} 
                    className="relative"
                >
                    <button 
                        className="absolute top-4 right-4 text-gray-400 hover:text-blue-600"
                        title="Editar materias"
                    >
                        <Edit size={20} />
                    </button>
                    {profile.materiasAsignadas.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2">
                            {profile.materiasAsignadas.map((materia) => (
                                <li key={materia.id} className="text-gray-700">
                                    <BookOpen size={16} className="inline mr-2 text-teal-600" />
                                    {materia.nombre} (# Grupo: <strong>{materia.grupo}</strong>)
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No hay materias asignadas.</p>
                    )}
                </Card>
            </div>
            
            {/* 3. HORARIO */}
            <Card 
                header={<span className="font-bold flex items-center gap-2"><Clock size={20} /> Horario</span>}
                className="overflow-x-auto"
            >
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase">Hrs</th>
                            {days.map(day => (
                                <th key={day} className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {timeSlots.length > 0 ? (
                            timeSlots.map(time => (
                                <tr key={time} className="hover:bg-blue-50/50">
                                    <td className="p-3 text-sm font-mono text-gray-800 border-b border-gray-100">{time}</td>
                                    {days.map(day => {
                                        // Acceso seguro al horario
                                        const lesson = profile.horario[day as keyof typeof profile.horario]?.[time]; 
                                        return (
                                            <td 
                                                key={day} 
                                                className={`p-3 text-sm text-gray-700 border-b border-gray-100 ${lesson ? 'bg-teal-50 font-medium' : 'text-gray-400'}`}
                                            >
                                                {lesson || '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center p-4 text-gray-500">No hay horarios definidos.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>

            <div className="mt-8 text-right">
                <Button variant="secondary" onClick={() => navigate('/admin/docentes')}>
                    Volver a Docentes
                </Button>
            </div>
        </div>
    );
};