// src/pages/alumno/AlumnoAsignaturasPage.tsx (CÓDIGO FINAL CORREGIDO)

import React, { useState, useEffect } from 'react';
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';
import { Search, CalendarDays, Clock, User } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// 🛑 Importaciones de UI unificada: Input y Modal por defecto, Card y LoadingSpinner nombradas
import Input from '../../components/ui/Input'; 
import { Card } from '../../components/ui/Card'; 
// Importaciones de servicio (asumo que existen en tu proyecto)
import { useAuth } from '../../hooks/useAuth';
import { getMisAsignaturas } from '../../services/alumno.service';
import type { AsignaturaConHorario } from '../../services/alumno.service';

export const AlumnoAsignaturasPage: React.FC = () => {
    const { user } = useAuth();
    
    // Estados para datos y carga
    const [asignaturas, setAsignaturas] = useState<AsignaturaConHorario[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Efecto para cargar los datos desde el servicio
    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            
            try {
                const data = await getMisAsignaturas(user.id);
                setAsignaturas(data);
            } catch (error) {
                console.error("Error al cargar asignaturas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <LoadingSpinner text="Cargando tus asignaturas..." />
            </div>
        );
    }

    // Filtramos las asignaturas según el buscador
    const filteredAsignaturas = asignaturas.filter(item => 
        item.materia.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-white min-h-full font-sans">
            
            <header className="flex justify-between items-end border-b-2 border-black pb-2 mb-8">
                <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
                    Mis Asignaturas
                </h1>
                <div className="mb-2">
                    <UserHeaderIcons />
                </div>
            </header>

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-4">
                <div className="relative w-full md:w-80 mb-4 md:mb-0">
                    {/* Usamos el componente Input unificado */}
                    <Input 
                        type="text" 
                        placeholder="Buscar asignatura..." 
                        className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-gray-200 text-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                </div>
                <div>
                    {/* Mantenemos el select nativo del diseño original */}
                    <select className="border border-gray-200 rounded-lg px-4 py-2 text-gray-500 bg-white shadow-sm focus:outline-none cursor-pointer w-40">
                        <option>Semestre</option>
                        <option>1°</option>
                        <option>2°</option>
                    </select>
                </div>
            </div>

            {/* CONTENEDOR PRINCIPAL GRIS (DIV) */}
            <div className="bg-[#eff3f6] p-8 rounded-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.15)] min-h-[500px]">
                
                {/* Encabezados de la tabla (ocultos en móvil) */}
                <div className="hidden md:grid grid-cols-4 gap-4 px-8 mb-4 text-gray-500 font-bold text-sm uppercase tracking-wider">
                    <div className="text-left pl-2">Materia</div>
                    <div className="text-center col-span-2">Horario</div>
                    <div className="text-right pr-4">Profesor</div>
                </div>

                <div className="space-y-4">
                    {filteredAsignaturas.length > 0 ? (
                        filteredAsignaturas.map((item) => (
                            /* CARD para CADA FILA (Asegura fondo blanco y sombra individual) */
                            <Card
                                key={item.id}
                                // Reaplicamos el grid y el estilo visual de la fila
                                className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 px-8 items-center text-sm md:text-base text-gray-600 hover:shadow-md transition-all hover:-translate-y-1 duration-200"
                                variant="default" // Asegura el fondo blanco y la sombra ligera por defecto
                            >
                                {/* COLUMNA 1: Materia */}
                                <div className="font-bold text-gray-800 truncate text-lg">
                                    {item.materia}
                                </div>
                                
                                {/* COLUMNA 2 y 3: Horarios Multiples */}
                                <div className="md:col-span-2 flex flex-col items-center gap-2">
                                    {item.horarios.map((horario, index) => (
                                        <div key={index} className="flex items-center gap-3 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 w-fit">
                                            {/* Día */}
                                            <div className="flex items-center gap-2 text-blue-600 font-semibold w-24 justify-end">
                                                <span>{horario.dia}</span>
                                                <CalendarDays size={14} />
                                            </div>
                                            
                                            {/* Separador */}
                                            <div className="w-px h-3 bg-gray-300"></div>
                                            
                                            {/* Hora */}
                                            <div className="flex items-center gap-2 text-gray-500 text-sm w-28">
                                                <Clock size={14} />
                                                <span>{horario.hora}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* COLUMNA 4: Profesor */}
                                <div className="flex justify-end items-center gap-2 text-gray-600 font-medium truncate">
                                    <span className="truncate">{item.profesor}</span>
                                    <div className="p-1.5 bg-gray-100 rounded-full">
                                        <User size={16} className="text-gray-400"/>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            No se encontraron asignaturas.
                        </div>
                    )}
                </div>

            </div> {/* Cierre del DIV gris */}

        </div>
    );
};