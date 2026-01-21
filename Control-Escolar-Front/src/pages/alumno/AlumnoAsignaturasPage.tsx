// src/pages/alumno/AlumnoAsignaturasPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';
import { Search, CalendarDays, Clock, User } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

import Input from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

import { useAuth } from '../../hooks/useAuth';
import { getMisAsignaturas } from '../../services/alumno.service';
import type { AsignaturaConHorario } from '../../services/alumno.service';

export const AlumnoAsignaturasPage: React.FC = () => {
    const { user } = useAuth();

    // Estados
    const [asignaturas, setAsignaturas] = useState<AsignaturaConHorario[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSemestre, setSelectedSemestre] = useState<string>(''); // Estado para el filtro

    // Carga de datos
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

    // 1. Calcular semestres únicos disponibles (Ej: [1, 3, 5])
    const availableSemesters = useMemo(() => {
        const semestres = asignaturas.map(a => a.semestre); // Extraer semestres
        const unique = Array.from(new Set(semestres));      // Eliminar duplicados
        return unique.sort((a, b) => a - b);                // Ordenar ascendente
    }, [asignaturas]);

    // 2. Lógica de Filtrado (Nombre + Semestre)
    const filteredAsignaturas = asignaturas.filter(item => {
        const matchesSearch = item.materia.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSemestre = selectedSemestre === '' || item.semestre.toString() === selectedSemestre;
        return matchesSearch && matchesSemestre;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <LoadingSpinner text="Cargando tus asignaturas..." />
            </div>
        );
    }

    return (
        <div className="p-8 bg-whiteBg-50 min-h-full font-sans">

            <header className="flex justify-between items-end border-b-2 border-black pb-2 mb-8">
                <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
                    Mis Asignaturas
                </h1>
                <div className="mb-2"><UserHeaderIcons /></div>
            </header>

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-4 gap-4">
                <div className="relative w-full md:w-80 bg-whiteBg-50">
                    <Input
                        type="text"
                        placeholder="Buscar asignatura..."
                        className="w-full p-4 rounded-xl border border-gray-200 shadow-xl focus:ring-2 focus:ring-gray-200 text-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={<Search size={20} className="text-gray-400" />}
                    />
                </div>

                {/* SELECT DINÁMICO DE SEMESTRES */}
                <div>
                    <select
                        className="border border-gray-200 rounded-lg px-4 py-3 text-gray-600 bg-white shadow-md focus:outline-none cursor-pointer w-48 font-medium"
                        value={selectedSemestre}
                        onChange={(e) => setSelectedSemestre(e.target.value)}
                    >
                        <option value="">Todos los semestres</option>
                        {availableSemesters.map(sem => (
                            <option key={sem} value={sem}>{sem}° Semestre</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-grayLight-100 p-8 rounded-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.15)] min-h-[500px]">

                {/* Encabezados PC */}
                <div className="hidden md:grid grid-cols-5 gap-4 px-8 mb-4 text-main-800 font-bold text-sm uppercase tracking-wider opacity-70">
                    <div className="pl-2 col-span-2">Materia</div>
                    <div className="text-center col-span-2">Horario</div>
                    <div className="text-right pr-4">Profesor</div>
                </div>

                <div className="space-y-4">
                    {filteredAsignaturas.length > 0 ? (
                        filteredAsignaturas.map((item) => (
                            <Card
                                key={item.id}
                                className="bg-whiteBg-200 grid grid-cols-1 md:grid-cols-5 gap-4 py-5 px-8 items-center text-sm md:text-base text-gray-600 hover:shadow-lg transition-all hover:-translate-y-1 duration-200 border-l-4 border-transparent hover:border-blue-500"
                                variant="default"
                            >
                                {/* Materia + Badge Semestre */}
                                <div className="col-span-2 flex flex-col justify-center">
                                    <span className="font-bold text-gray-800 text-lg leading-tight">{item.materia}</span>
                                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md w-fit mt-1">
                                        {item.semestre}° Semestre
                                    </span>
                                </div>

                                {/* Horarios */}
                                <div className="md:col-span-2 flex flex-col items-center gap-2">
                                    {item.horarios.length > 0 ? item.horarios.map((horario, index) => (
                                        <div key={index} className="flex items-center gap-3 bg-whiteBg-50 px-4 py-1.5 rounded-full border border-gray-100 w-full md:w-auto justify-center shadow-sm">
                                            <div className="flex items-center gap-1 text-blue-600 font-bold w-16 justify-end uppercase text-xs">
                                                <span>{horario.dia.substring(0, 3)}</span>
                                                <CalendarDays size={12} />
                                            </div>
                                            <div className="w-px h-3 bg-gray-300"></div>
                                            <div className="flex items-center gap-1 text-gray-500 text-xs w-24">
                                                <Clock size={12} />
                                                <span>{horario.hora}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <span className="text-xs text-gray-400 italic">Sin horario asignado</span>
                                    )}
                                </div>

                                {/* Profesor */}
                                <div className="flex justify-end items-center gap-3 text-gray-600 font-medium truncate">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase">Docente</p>
                                        <span className="truncate block max-w-[120px]">{item.profesor}</span>
                                    </div>
                                    <div className="p-2 bg-gray-100 rounded-full shadow-inner">
                                        <User size={18} className="text-gray-500" />
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                            <Search size={48} className="opacity-20" />
                            <p>No se encontraron asignaturas para el filtro seleccionado.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};