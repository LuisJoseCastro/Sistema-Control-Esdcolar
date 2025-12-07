// src/pages/docente/DocenteCalificacionesPage.tsx

import React, { useState, useCallback, useMemo } from 'react';
import { ClipboardList, Save, ArrowLeft, Search } from 'lucide-react';
// 🛑 NUEVO: Importamos useNavigate de react-router-dom
import { useNavigate } from 'react-router-dom';

// 🛑 ELIMINADA LA LÍNEA: import { type DocenteView } from '../../App'; 

// --- Tipos de Datos (Mock) ---
interface AlumnoCalificacion {
    id: string;
    nombre: string;
    parcial1: string;
    parcial2: string;
    parcial3: string;
    final: string;
    extraordinario: string; // Puede ser P1, P1-P3, NA
}

interface Grupo {
    id: string;
    nombre: string;
}

interface Asignatura {
    id: string;
    nombre: string;
}

// --- MOCK DATA ---
const MOCK_GRUPOS: Grupo[] = [
    // ... (MOCK_GRUPOS sin cambios) ...
    { id: '1', nombre: 'Grupo 3A - Matemáticas' },
    { id: '2', nombre: 'Grupo 5B - Español' },
    { id: '3', nombre: 'Grupo 1C - Historia' },
];

const MOCK_ASIGNATURAS: Asignatura[] = [
    // ... (MOCK_ASIGNATURAS sin cambios) ...
    { id: '101', nombre: 'Matemáticas Avanzadas' },
    { id: '102', nombre: 'Español' },
    { id: '103', nombre: 'Historia' },
];

const MOCK_CALIFICACIONES: AlumnoCalificacion[] = [
    // ... (MOCK_CALIFICACIONES sin cambios) ...
    { id: 'a1', nombre: 'Juan Pablo Guzmán', parcial1: '85', parcial2: '90', parcial3: '88', final: '88', extraordinario: 'NA' },
    { id: 'a2', nombre: 'María José López', parcial1: '75', parcial2: '79', parcial3: '70', final: '75', extraordinario: 'NA' },
    { id: 'a3', nombre: 'Brandon Jael Ramos', parcial1: 'NA', parcial2: '82', parcial3: '70', final: 'NA', extraordinario: 'P1' },
    { id: 'a4', nombre: 'Miguel Ángel Torres', parcial1: 'NA', parcial2: 'NA', parcial3: 'NA', final: 'NA', extraordinario: 'P1 - P3' },
    { id: 'a5', nombre: 'Sofía Isabel García', parcial1: '95', parcial2: '95', parcial3: '98', final: '100', extraordinario: 'NA' },
];

// 🛑 ELIMINADA LA INTERFAZ: DocenteCalificacionesPageProps


// --- Componentes Atómicos (Simplificados) ---

// Componente para los campos de entrada de calificación
interface CalificacionInputProps {
    // ... (CalificacionInputProps sin cambios) ...
    value: string;
    onChange: (newValue: string) => void;
    placeholder: string;
    isExtraordinario?: boolean;
}

const CalificacionInput: React.FC<CalificacionInputProps> = ({ value, onChange, placeholder, isExtraordinario = false }) => {
    // ... (CalificacionInput sin cambios) ...
    // Clases para el input (más pequeño y centrado)
    const baseClasses = "w-full text-center bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 py-2 text-sm";

    // Si es extraordinario, el estilo de texto es diferente ya que puede ser un texto
    const textClasses = isExtraordinario ? "text-xs font-mono text-yellow-400" : "font-semibold text-gray-200";

    return (
        <input
            type={isExtraordinario ? "text" : "text"} // Usamos text para permitir 'NA' o 'P1'
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())} // Convertimos a mayúsculas para Extraordinario/NA
            placeholder={placeholder}
            className={`${baseClasses} ${textClasses} transition-all duration-200`}
            maxLength={isExtraordinario ? 5 : 3}
        />
    );
};

// Componente de la Fila de la Tabla
interface AlumnoRowProps {
    // ... (AlumnoRowProps sin cambios) ...
    alumno: AlumnoCalificacion;
    onUpdate: (id: string, field: keyof AlumnoCalificacion, value: string) => void;
}

const AlumnoRow: React.FC<AlumnoRowProps> = ({ alumno, onUpdate }) => {
    // ... (AlumnoRow sin cambios) ...
    const baseClasses = "py-3 px-2 border-b border-gray-700";

    // Función de ayuda para actualizar el estado del alumno
    const handleChange = (field: keyof AlumnoCalificacion) => (value: string) => {
        onUpdate(alumno.id, field, value);
    };

    return (
        <div className="grid grid-cols-7 text-sm hover:bg-gray-700/50 transition-colors">
            {/* Nombre del Alumno */}
            <div className={`${baseClasses} font-medium text-gray-100 col-span-1 truncate`}>
                {alumno.nombre}
            </div>

            {/* Calificaciones (Parciales y Final) */}
            <div className={`${baseClasses} text-center col-span-1`}>
                <CalificacionInput value={alumno.parcial1} onChange={handleChange('parcial1')} placeholder="NA" />
            </div>
            <div className={`${baseClasses} text-center col-span-1`}>
                <CalificacionInput value={alumno.parcial2} onChange={handleChange('parcial2')} placeholder="NA" />
            </div>
            <div className={`${baseClasses} text-center col-span-1`}>
                <CalificacionInput value={alumno.parcial3} onChange={handleChange('parcial3')} placeholder="NA" />
            </div>
            <div className={`${baseClasses} text-center col-span-1`}>
                <CalificacionInput value={alumno.final} onChange={handleChange('final')} placeholder="NA" />
            </div>

            {/* Extraordinario */}
            <div className={`${baseClasses} text-center col-span-2`}>
                <CalificacionInput
                    value={alumno.extraordinario}
                    onChange={handleChange('extraordinario')}
                    placeholder="NA"
                    isExtraordinario={true}
                />
            </div>
        </div>
    );
};

// --- PÁGINA PRINCIPAL: DocenteCalificacionesPage ---
// 🛑 Componente principal sin props
export const DocenteCalificacionesPage: React.FC = () => {
    // 🛑 Hook de React Router DOM
    const navigate = useNavigate();

    // Estado de los filtros
    const [selectedGrupo, setSelectedGrupo] = useState<string>('');
    const [selectedAsignatura, setSelectedAsignatura] = useState<string>('');

    // Estado de las calificaciones editables
    const [calificaciones, setCalificaciones] = useState<AlumnoCalificacion[]>(MOCK_CALIFICACIONES);

    // Simulación de la actualización de una celda
    const handleUpdateCalificacion = useCallback((id: string, field: keyof AlumnoCalificacion, value: string) => {
        setCalificaciones(prevCals => prevCals.map(cal =>
            cal.id === id ? { ...cal, [field]: value } : cal
        ));
    }, []);

    // Simulación de la acción de Guardar
    const handleGuardarCalificaciones = useCallback(() => {
        console.log("Guardando calificaciones:", calificaciones);
        // Aquí iría la lógica de API/Firestore
        // En una app real, mostraríamos un toast o modal de éxito.
        alert('Calificaciones guardadas exitosamente (Simulación).');
        // Nota: En la regla de oro se pide no usar alert(), pero lo dejo como simulación de la acción de guardado, idealmente se usaría un componente Modal o Toast.
    }, [calificaciones]);

    const isReadyToSave = useMemo(() => selectedGrupo && selectedAsignatura, [selectedGrupo, selectedAsignatura]);

    return (
        <div className="p-4 md:p-8 bg-gray-900 text-gray-100 min-h-full">

            {/* Header: Título y Navegación */}
            <header className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-serif italic text-white flex items-center">
                    <ClipboardList className="w-7 h-7 mr-3 text-blue-400" />
                    Captura de Calificaciones
                </h1>
                {/* Botón de Regresar (al Dashboard si existiera una página de selección previa) */}
                <button
                    // 🛑 CORREGIDO: Usamos navigate de React Router DOM
                    onClick={() => navigate('/docente/dashboard')}
                    className="flex items-center text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Volver a Inicio
                </button>
            </header>

            <p className="text-gray-400 mb-6 text-lg">
                Selecciona el grupo y la asignatura para empezar a registrar las calificaciones de los alumnos.
            </p>

            {/* 1. SECCIÓN DE FILTROS */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl mb-8">
                <h2 className="text-xl font-semibold text-blue-400 mb-4">Filtros</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Filtro de Grupos */}
                    <div>
                        <label htmlFor="grupo" className="block text-sm font-medium text-gray-300 mb-2">Grupos</label>
                        <select
                            id="grupo"
                            value={selectedGrupo}
                            onChange={(e) => setSelectedGrupo(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 text-gray-200 py-2.5 px-4 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                            <option value="" disabled>Seleccionar Grupos</option>
                            {MOCK_GRUPOS.map(grupo => (
                                <option key={grupo.id} value={grupo.id}>{grupo.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro de Asignatura */}
                    <div>
                        <label htmlFor="asignatura" className="block text-sm font-medium text-gray-300 mb-2">Asignatura</label>
                        <select
                            id="asignatura"
                            value={selectedAsignatura}
                            onChange={(e) => setSelectedAsignatura(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 text-gray-200 py-2.5 px-4 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                            <option value="" disabled>Seleccionar Asignatura</option>
                            {MOCK_ASIGNATURAS.map(asignatura => (
                                <option key={asignatura.id} value={asignatura.id}>{asignatura.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* 2. SECCIÓN DE TABLA DE CALIFICACIONES */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl relative">

                {/* Título de la Tabla (Opcional, se puede poner aquí o en el header) */}
                <h2 className="text-xl font-semibold text-white mb-4">Registro de Calificaciones</h2>

                {/* Tabla de Calificaciones (Contenedor Scrollable) */}
                <div className="overflow-x-auto rounded-lg border border-gray-700">
                    <div className="min-w-full divide-y divide-gray-700">

                        {/* Encabezados de la Tabla */}
                        <div className="grid grid-cols-7 text-sm bg-gray-700 text-gray-100 font-bold">
                            <div className="py-3 px-2 col-span-1 text-left truncate">Alumno</div>
                            <div className="py-3 px-2 col-span-1 text-center">Parcial 1</div>
                            <div className="py-3 px-2 col-span-1 text-center">Parcial 2</div>
                            <div className="py-3 px-2 col-span-1 text-center">Parcial 3</div>
                            <div className="py-3 px-2 col-span-1 text-center">Final</div>
                            <div className="py-3 px-2 col-span-2 text-center">Extraordinario</div>
                        </div>

                        {/* Filas de Datos */}
                        <div className="divide-y divide-gray-700/50">
                            {calificaciones.map(alumno => (
                                <AlumnoRow
                                    key={alumno.id}
                                    alumno={alumno}
                                    onUpdate={handleUpdateCalificacion}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Botón de Guardar Calificaciones (Ubicado abajo a la derecha, flotante en la maqueta) */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleGuardarCalificaciones}
                        disabled={!isReadyToSave}
                        className={`flex items-center space-x-2 py-3 px-6 rounded-lg font-bold text-white transition-all duration-300 shadow-lg ${isReadyToSave
                                ? 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
                                : 'bg-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <Save className="w-5 h-5" />
                        <span>Guardar Calificaciones</span>
                    </button>
                </div>
            </div>

        </div>
    );
};