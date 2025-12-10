// src/pages/alumno/AlumnoHistorialAcademicoPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getHistorialAcademico } from '../../services/alumno.service';
import type { HistorialAcademico } from '../../types/models';

// 🛑 IMPORTACIONES DE UI UNIFICADA
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';
import { Card } from '../../components/ui/Card';     // Nombrada
import Select from '../../components/ui/Select';     // Por defecto
import Button from '../../components/ui/Button';     // Por defecto

import { Download } from 'lucide-react';

export const AlumnoHistorialAcademicoPage: React.FC = () => {
    const { user } = useAuth(); 
    const [historial, setHistorial] = useState<HistorialAcademico | null>(null);
    const [loading, setLoading] = useState(true);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('');

    // --- LÓGICA DE DATOS ---
    useEffect(() => {
        const fetchHistorial = async () => {
            if (!user) return; 
            try {
                const data = await getHistorialAcademico(user.id);
                setHistorial(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistorial();
    }, [user]);

    // Opciones para el Select (transformadas al formato { value, label })
    const periodoOptions = useMemo(() => {
        if (!historial) return [];
        const uniquePeriods = new Set(historial.calificacionesDetalle.map(c => c.periodo));
        const options = Array.from(uniquePeriods)
            .sort()
            .reverse()
            .map(p => ({ value: p, label: p }));
        
        return options;
    }, [historial]);

    const calificacionesFiltradas = useMemo(() => {
        if (!historial) return [];
        if (!periodoSeleccionado) return historial.calificacionesDetalle;
        return historial.calificacionesDetalle.filter(c => c.periodo === periodoSeleccionado);
    }, [historial, periodoSeleccionado]);

    if (loading) return <div className="flex justify-center mt-20"><LoadingSpinner /></div>;
    if (!historial) return <div className="p-8">No hay datos.</div>;

    // --- ESTILOS VISUALES (Simplificamos la clase ya que ahora usamos Card) ---
    // Estilo para las tarjetas pequeñas superiores
    const statCardStyle = "p-4 w-48 text-center flex flex-col items-center justify-center h-32";

    return (
        <div className="p-8 bg-white min-h-full font-sans">
            
            {/* 1. ENCABEZADO */}
            <header className="flex justify-between items-end border-b-2 border-gray-400 pb-2 mb-10">
                <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
                    Historial académico
                </h1>
                <div className="mb-2">
                   <UserHeaderIcons />
                </div>
            </header>

            <div className="max-w-6xl mx-auto flex flex-col gap-10">

                {/* 2. ESTADÍSTICAS SUPERIORES (KPIs) */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                    {/* Tarjeta Promedio */}
                    {/* 🛑 Usamos Card */}
                    <Card className={`${statCardStyle} bg-gray-100! shadow-[0_8px_20px_rgba(0,0,0,0.1)] border border-white`}>
                        <p className="text-2xl text-gray-800 mb-1" style={{ fontFamily: '"Kaushan Script", cursive' }}>Promedio</p>
                        <p className={`text-5xl font-black ${historial.promedioGeneral >= 8 ? 'text-gray-900' : 'text-red-600'}`}>
                            {historial.promedioGeneral.toFixed(1)}
                        </p>
                    </Card>
                    
                    {/* Tarjeta Asignaturas */}
                    {/* 🛑 Usamos Card */}
                    <Card className={`${statCardStyle} bg-gray-100! shadow-[0_8px_20px_rgba(0,0,0,0.1)] border border-white`}>
                        <p className="text-xl text-gray-800 mb-2" style={{ fontFamily: '"Kaushan Script", cursive' }}>Asignaturas Aprobadas</p>
                        <p className="text-5xl font-black text-gray-900">{historial.asignaturasAprobadas}</p>
                    </Card>
                </div>

                {/* 3. FILTRO DE PERIODO (Centrado) */}
                <div className="flex justify-center">
                    <div className="w-64">
                        {/* 🛑 Usamos Select */}
                        <Select 
                            placeholder="Todos los periodos"
                            value={periodoSeleccionado}
                            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                            options={periodoOptions}
                            selectClassName="text-gray-500 text-center font-medium shadow-sm focus:ring-2 focus:ring-gray-300"
                        />
                    </div>
                </div>

                {/* 4. CONTENIDO PRINCIPAL (Dos columnas visuales) */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
                    
                    {/* COLUMNA IZQ: LISTA DE MATERIAS */}
                    {/* 🛑 Usamos Card para el contenedor gris */}
                    <Card 
                        className={`flex-1 w-full rounded-4xl shadow-[0_15px_35px_rgba(0,0,0,0.1)] p-8 relative overflow-hidden h-fit bg-gray-100!`}
                        variant="default"
                    >
                        {/* Encabezados */}
                        <div className="flex justify-between px-4 mb-6 border-b border-gray-300 pb-2">
                            <span className="text-gray-600 font-bold text-sm uppercase tracking-wide">Asignatura</span>
                            <span className="text-gray-600 font-bold text-sm uppercase tracking-wide">Promedio</span>
                        </div>

                        {/* Lista */}
                        <div className="space-y-4 pb-2">
                            {calificacionesFiltradas.length > 0 ? (
                                calificacionesFiltradas.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center px-4 group hover:bg-white/50 rounded-lg py-2 transition-colors">
                                        <span className="text-gray-800 font-medium text-base">{item.asignatura}</span>
                                        
                                        {/* Línea decorativa punteada */}
                                        <div className="flex-1 border-b-2 border-gray-300 border-dotted mx-6 h-1 relative top-1 opacity-40"></div>
                                        
                                        {/* Promedio con lógica de color */}
                                        <span className={`text-lg font-bold ${item.promedio < 8.0 ? 'text-red-500' : 'text-gray-700'}`}>
                                            {item.promedio.toFixed(1)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 font-medium">No hay calificaciones para este periodo.</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* COLUMNA DER: DOCUMENTOS (Minimalista) */}
                    <div className="lg:w-64 flex flex-col items-center pt-4 shrink-0 w-full">
                        <h3 className="text-2xl font-bold text-gray-800 mb-8">Documentos</h3>
                        
                        <div className="space-y-8 w-full flex flex-col items-center">
                            {historial.documentosDisponibles.map((doc, index) => (
                                <div key={index} className="flex flex-col items-center gap-2 w-full">
                                    <span className="text-gray-600 font-medium text-lg text-center leading-tight">{doc.nombre}</span>
                                    {/* 🛑 Usamos Button */}
                                    <Button 
                                        onClick={() => alert(`Descargando: ${doc.nombre}`)}
                                        variant="secondary"
                                        icon={<Download size={20} />}
                                        className="bg-[#c4c4c4] hover:bg-[#a8a8a8] text-gray-700 w-32 h-10 rounded-full flex items-center justify-center shadow-md border-transparent hover:border-gray-400 mt-2 p-1"
                                    >
                                        Descargar
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};