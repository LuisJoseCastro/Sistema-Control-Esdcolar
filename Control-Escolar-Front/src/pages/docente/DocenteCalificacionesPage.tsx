// src/pages/docente/DocenteCalificacionesPage.tsx

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ClipboardList, Save, ArrowLeft, Search, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Table, { TableHead, TableCell, TableRow } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';

// --- Tipos de Datos (Mock) ---
interface AlumnoCalificacion {
    id: string;
    nombre: string;
    parcial1: string;
    parcial2: string;
    parcial3: string;
    final: string;
    extraordinario: string;
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
    { id: '1', nombre: 'Grupo 1A' },
    { id: '2', nombre: 'Grupo 1B' },
    { id: '3', nombre: 'Grupo 1C' },
    { id: '4', nombre: 'Grupo 2A' },
    { id: '5', nombre: 'Grupo 2B' },
    { id: '6', nombre: 'Grupo 2C' },
    { id: '7', nombre: 'Grupo 3A' },
    { id: '8', nombre: 'Grupo 3B' },
    { id: '9', nombre: 'Grupo 3C' },
    { id: '10', nombre: 'Grupo 4A' },
    { id: '11', nombre: 'Grupo 4B' },
    { id: '12', nombre: 'Grupo 4C' },
    { id: '13', nombre: 'Grupo 5A' },
    { id: '14', nombre: 'Grupo 5B' },
    { id: '15', nombre: 'Grupo 5C' },
    { id: '16', nombre: 'Grupo 6A' },
    { id: '17', nombre: 'Grupo 6B' },
    { id: '18', nombre: 'Grupo 6C' },
];

const MOCK_ASIGNATURAS: Asignatura[] = [
    { id: '101', nombre: 'Matemáticas Avanzadas' },
    { id: '102', nombre: 'Español' },
    { id: '103', nombre: 'Historia' },
];

const MOCK_CALIFICACIONES: AlumnoCalificacion[] = [
    { id: 'a1', nombre: 'Juan Pablo Guzmán', parcial1: '', parcial2: '90', parcial3: '88', final: '88', extraordinario: 'NA' },
    { id: 'a2', nombre: 'María José López', parcial1: '75', parcial2: '79', parcial3: '70', final: '75', extraordinario: 'NA' },
    { id: 'a3', nombre: 'Brandon Jael Ramos', parcial1: 'NA', parcial2: '82', parcial3: '70', final: '', extraordinario: 'P1' },
    { id: 'a4', nombre: 'Miguel Ángel Torres', parcial1: 'NA', parcial2: 'NA', parcial3: 'NA', final: 'NA', extraordinario: 'P1 - P3' },
    { id: 'a5', nombre: 'Sofía Isabel García', parcial1: '95', parcial2: '95', parcial3: '98', final: '100', extraordinario: 'NA' },
];

/**
 * Componente interno para el campo de calificación
 */
interface CalificacionInputProps {
    value: string;
    onChange: (newValue: string) => void;
    placeholder: string;
    isExtraordinario?: boolean;
    hasError?: boolean;
    onBlur?: () => void;
    onFocus?: () => void;
}

const CalificacionInput: React.FC<CalificacionInputProps> = ({ 
    value, 
    onChange, 
    placeholder, 
    isExtraordinario = false,
    hasError = false,
    onBlur,
    onFocus
}) => {
    const [tempValue, setTempValue] = useState<string>(value);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    
    React.useEffect(() => {
        if (!isFocused) {
            setTempValue(value);
        }
    }, [value, isFocused]);
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        if (onFocus) onFocus();
        
        if (value === 'NA' && !isExtraordinario) {
            setTempValue('');
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        
        if (isExtraordinario) {
            setTempValue(inputValue.toUpperCase());
            onChange(inputValue.toUpperCase());
            return;
        }
        
        if (inputValue === '' || /^\d*$/.test(inputValue) || inputValue.toUpperCase() === 'NA') {
            setTempValue(inputValue);
            onChange(inputValue);
        }
    };
    
    const handleBlurInternal = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        const inputValue = e.target.value.trim();
        
        if (isExtraordinario) {
            const finalValue = inputValue || 'NA';
            onChange(finalValue);
            setTempValue(finalValue);
        } else {
            if (inputValue === '' || inputValue.toUpperCase() === 'NA') {
                onChange(inputValue.toUpperCase());
                setTempValue(inputValue.toUpperCase());
            } else {
                const numValue = parseFloat(inputValue);
                if (!isNaN(numValue)) {
                    if (numValue < 70) {
                        onChange('NA');
                        setTempValue('NA');
                    } else {
                        const finalNum = Math.min(Math.max(0, numValue), 100);
                        onChange(finalNum.toString());
                        setTempValue(finalNum.toString());
                    }
                } else {
                    onChange('');
                    setTempValue('');
                }
            }
        }
        
        if (onBlur) onBlur();
    };
    
    const inputClasses = isExtraordinario
        ? "text-xs font-mono text-center"
        : "font-semibold text-center";

    const combinedClasses = `${inputClasses} bg-gray-100 border-gray-300 py-2 text-center ${
        hasError ? 'border-yellow-400 bg-yellow-50' : ''
    } ${
        !isExtraordinario && value === 'NA' ? 'text-gray-500 italic' : ''
    }`;

    return (
        <div className="relative group">
            <Input
                type="text"
                value={tempValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlurInternal}
                placeholder={placeholder}
                className={combinedClasses}
                maxLength={isExtraordinario ? 10 : 5}
            />
            {hasError && value === '' && (
                <div className="absolute z-10 -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg border border-yellow-300">
                    <AlertTriangle className="inline w-3 h-3 mr-1" />
                    Campo requerido
                </div>
            )}
            {!isExtraordinario && value === 'NA' && !hasError && !isFocused && (
                <div className="absolute z-10 -top-8 left-1/2 transform -translate-x-1/2 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    NA (menor a 70)
                </div>
            )}
        </div>
    );
};

// --- PÁGINA PRINCIPAL: DocenteCalificacionesPage ---
export const DocenteCalificacionesPage: React.FC = () => {
    const navigate = useNavigate();

    const [selectedGrupo, setSelectedGrupo] = useState<string>('');
    const [selectedAsignatura, setSelectedAsignatura] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [calificaciones, setCalificaciones] = useState<AlumnoCalificacion[]>(MOCK_CALIFICACIONES);
    const [camposEditados, setCamposEditados] = useState<Set<string>>(new Set());

    const handleUpdateCalificacion = useCallback((id: string, field: keyof AlumnoCalificacion, value: string) => {
        const campoKey = `${id}-${field}`;
        setCamposEditados(prev => new Set(prev).add(campoKey));
        
        setCalificaciones(prevCals => prevCals.map(cal =>
            cal.id === id ? { ...cal, [field]: value } : cal
        ));
    }, []);

    // Función para verificar si hay campos vacíos
    const hayCamposVacios = useCallback((): boolean => {
        for (const alumno of calificaciones) {
            const campos = ['parcial1', 'parcial2', 'parcial3', 'final', 'extraordinario'] as const;
            for (const campo of campos) {
                if (!alumno[campo] || alumno[campo].trim() === '') {
                    return true;
                }
            }
        }
        return false;
    }, [calificaciones]);

    // Función para obtener lista de campos vacíos (para mostrar en alerta)
    const obtenerCamposVacios = useCallback((): Array<{alumno: string, campo: string}> => {
        const camposVacios: Array<{alumno: string, campo: string}> = [];
        
        calificaciones.forEach(alumno => {
            const campos = [
                { key: 'parcial1' as const, label: 'Parcial 1' },
                { key: 'parcial2' as const, label: 'Parcial 2' },
                { key: 'parcial3' as const, label: 'Parcial 3' },
                { key: 'final' as const, label: 'Final' },
                { key: 'extraordinario' as const, label: 'Extraordinario' }
            ];
            
            campos.forEach(({key, label}) => {
                if (!alumno[key] || alumno[key].trim() === '') {
                    camposVacios.push({
                        alumno: alumno.nombre,
                        campo: label
                    });
                }
            });
        });
        
        return camposVacios;
    }, [calificaciones]);

    // Función para verificar si un campo específico está vacío
    const campoTieneError = useCallback((alumnoId: string, campo: keyof AlumnoCalificacion): boolean => {
        const alumno = calificaciones.find(a => a.id === alumnoId);
        if (!alumno) return false;
        return !alumno[campo] || alumno[campo].trim() === '';
    }, [calificaciones]);

    const createUpdateHandler = useCallback((id: string, field: keyof AlumnoCalificacion) => (
        (newValue: string) => {
            handleUpdateCalificacion(id, field, newValue);
        }
    ), [handleUpdateCalificacion]);

    // Función para manejar el guardado con alerta directa
    const handleGuardarCalificaciones = useCallback(() => {
        // Verificar si hay campos vacíos
        if (hayCamposVacios()) {
            const camposVacios = obtenerCamposVacios();
            
            // Crear mensaje de alerta
            let mensaje = `⚠️ Hay ${camposVacios.length} campo(s) vacío(s):\n\n`;
            
            // Agrupar por alumno para mejor presentación
            const porAlumno: Record<string, string[]> = {};
            camposVacios.forEach(({alumno, campo}) => {
                if (!porAlumno[alumno]) {
                    porAlumno[alumno] = [];
                }
                porAlumno[alumno].push(campo);
            });
            
            Object.entries(porAlumno).forEach(([alumno, campos], index) => {
                mensaje += `${index + 1}. ${alumno}: ${campos.join(', ')}\n`;
            });
            
            mensaje += "\nCompleta todos los campos antes de guardar.";
            
            // Mostrar alerta nativa del navegador
            alert(mensaje);
            return;
        }
        
        // Si no hay campos vacíos, proceder con el guardado
        procederConGuardado();
    }, [hayCamposVacios, obtenerCamposVacios]);

    const procederConGuardado = useCallback(() => {
        setIsLoading(true);
        console.log("Guardando calificaciones:", calificaciones);
        setTimeout(() => {
            setIsLoading(false);
            alert('✅ Calificaciones guardadas exitosamente.');
            setCamposEditados(new Set());
        }, 1500);
    }, [calificaciones]);

    const isReadyToSave = useMemo(() => selectedGrupo && selectedAsignatura, [selectedGrupo, selectedAsignatura]);

    const grupoOptions = MOCK_GRUPOS.map(g => ({ value: g.id, label: g.nombre }));
    const asignaturaOptions = MOCK_ASIGNATURAS.map(a => ({ value: a.id, label: a.nombre }));

    // Calcular total de campos vacíos para mostrar en la alerta visual
    const totalCamposVacios = useMemo(() => {
        return calificaciones.reduce((total, alumno) => {
            const campos = ['parcial1', 'parcial2', 'parcial3', 'final', 'extraordinario'] as const;
            return total + campos.filter(campo => !alumno[campo] || alumno[campo].trim() === '').length;
        }, 0);
    }, [calificaciones]);

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">

            {/* Header: Título y Navegación */}
            <header className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <ClipboardList className="w-7 h-7 mr-3 text-main-900" />
                    Captura de Calificaciones
                </h1>
                <button
                    onClick={() => navigate('/docente/dashboard')}
                    className="text-sm px-3 py-2 bg-transparent text-gray-600 hover:bg-gray-100 border border-gray-300 rounded flex items-center"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Volver a Inicio
                </button>
            </header>

            <p className="text-gray-600 mb-6 text-lg">
                Selecciona el grupo y la asignatura para empezar a registrar las calificaciones de los alumnos.
            </p>

            {/* 1. SECCIÓN DE FILTROS */}
            <Card header="Filtros de Captura" variant="flat" className="mb-8 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        label="Grupos"
                        value={selectedGrupo}
                        onChange={(e) => setSelectedGrupo(e.target.value)}
                        placeholder="Seleccionar Grupo"
                        options={grupoOptions}
                    />

                    <Select
                        label="Asignatura"
                        value={selectedAsignatura}
                        onChange={(e) => setSelectedAsignatura(e.target.value)}
                        placeholder="Seleccionar Asignatura"
                        options={asignaturaOptions}
                    />
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm text-blue-700">
                        <span className="font-semibold">Nota:</span> Los campos vacíos se marcarán en amarillo. 
                        Calificaciones menores a 70 se convertirán automáticamente a "NA".
                    </p>
                </div>
            </Card>

            {/* 2. SECCIÓN DE TABLA DE CALIFICACIONES */}
            <div className="relative">

                {(!selectedGrupo || !selectedAsignatura) ? (
                    <Card variant="flat" className="text-center py-12">
                        <Search className="w-10 h-10 mx-auto text-gray-600 mb-4" />
                        <p className="text-xl font-medium text-gray-700">
                            Filtros pendientes. Por favor, selecciona un <strong>Grupo</strong> y una <strong>Asignatura</strong> para cargar el registro de calificaciones.
                        </p>
                    </Card>

                ) : (
                    <>
                        {/* ALERTA VISUAL DE CAMPOS VACÍOS (sin botón "Ver detalles") */}
                        {totalCamposVacios > 0 && (
                            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md">
                                <div className="flex items-center">
                                    <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-yellow-800 text-lg">
                                            {totalCamposVacios} campo(s) vacío(s)
                                        </h3>
                                        <p className="text-yellow-700 text-sm mt-1">
                                            Completa todos los campos con una calificación (0-100) o escribe "NA".
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <Table className="shadow-lg">
                            <Table.Header>
                                <TableRow>
                                    <TableHead className="w-1/4">Nombre del Alumno</TableHead>
                                    <TableHead className="text-center">Parcial 1</TableHead>
                                    <TableHead className="text-center">Parcial 2</TableHead>
                                    <TableHead className="text-center">Parcial 3</TableHead>
                                    <TableHead className="text-center">Final</TableHead>
                                    <TableHead className="text-center w-1/4">Extraordinario</TableHead>
                                </TableRow>
                            </Table.Header>

                            <Table.Body>
                                {calificaciones.map(alumno => (
                                    <TableRow key={alumno.id}>
                                        <TableCell className="font-medium text-gray-900 truncate">
                                            {alumno.nombre}
                                        </TableCell>

                                        <TableCell className="group">
                                            <CalificacionInput
                                                value={alumno.parcial1}
                                                onChange={createUpdateHandler(alumno.id, 'parcial1')}
                                                placeholder="Ej: 85"
                                                hasError={campoTieneError(alumno.id, 'parcial1')}
                                                onFocus={() => {
                                                    const campoKey = `${alumno.id}-parcial1`;
                                                    setCamposEditados(prev => new Set(prev).add(campoKey));
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="group">
                                            <CalificacionInput
                                                value={alumno.parcial2}
                                                onChange={createUpdateHandler(alumno.id, 'parcial2')}
                                                placeholder="Ej: 85"
                                                hasError={campoTieneError(alumno.id, 'parcial2')}
                                                onFocus={() => {
                                                    const campoKey = `${alumno.id}-parcial2`;
                                                    setCamposEditados(prev => new Set(prev).add(campoKey));
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="group">
                                            <CalificacionInput
                                                value={alumno.parcial3}
                                                onChange={createUpdateHandler(alumno.id, 'parcial3')}
                                                placeholder="Ej: 85"
                                                hasError={campoTieneError(alumno.id, 'parcial3')}
                                                onFocus={() => {
                                                    const campoKey = `${alumno.id}-parcial3`;
                                                    setCamposEditados(prev => new Set(prev).add(campoKey));
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="group">
                                            <CalificacionInput
                                                value={alumno.final}
                                                onChange={createUpdateHandler(alumno.id, 'final')}
                                                placeholder="Ej: 85"
                                                hasError={campoTieneError(alumno.id, 'final')}
                                                onFocus={() => {
                                                    const campoKey = `${alumno.id}-final`;
                                                    setCamposEditados(prev => new Set(prev).add(campoKey));
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <CalificacionInput
                                                value={alumno.extraordinario}
                                                onChange={createUpdateHandler(alumno.id, 'extraordinario')}
                                                placeholder="NA, P1, P1-P3"
                                                isExtraordinario={true}
                                                hasError={campoTieneError(alumno.id, 'extraordinario')}
                                                onFocus={() => {
                                                    const campoKey = `${alumno.id}-extraordinario`;
                                                    setCamposEditados(prev => new Set(prev).add(campoKey));
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </Table.Body>
                        </Table>
                    </>
                )}

                {/* 3. BOTÓN DE GUARDAR */}
                {isReadyToSave && (
                    <div className="flex justify-end mt-8">
                        <Button
                            onClick={handleGuardarCalificaciones}
                            disabled={!isReadyToSave || isLoading}
                            icon={<Save className="w-5 h-5" />}
                            variant="primary"
                        >
                            {isLoading ? 'Guardando...' : 'Guardar Calificaciones'}
                        </Button>
                    </div>
                )}
            </div>
            
            {/* LEYENDAS Y GUÍA */}
            <div className="mt-10 space-y-6">
                <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
                    <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
                        <ClipboardList className="w-5 h-5 mr-2" />
                        Guía de uso:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                <span className="text-sm font-bold">1</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Escribe calificaciones</p>
                                <p className="text-sm text-gray-600">Números entre 0-100</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                <span className="text-sm font-bold">2</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">NA automático</p>
                                <p className="text-sm text-gray-600">Calificaciones &lt;70 se convierten a NA</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                <span className="text-sm font-bold">3</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Campos vacíos</p>
                                <p className="text-sm text-gray-600">Se marcarán en <span className="text-yellow-600 font-bold">amarillo</span></p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                <span className="text-sm font-bold">4</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Campo extraordinario</p>
                                <p className="text-sm text-gray-600">Usa P1, P2, P3, P1-P3, etc.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 bg-white rounded-lg border border-gray-300 shadow-sm">
                    <h4 className="font-bold text-gray-700 mb-2">Indicadores visuales:</h4>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded mr-2"></div>
                            <span className="text-sm text-gray-600">Campo vacío (requerido)</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded mr-2"></div>
                            <span className="text-sm text-gray-600">Campo válido</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-red-50 border-2 border-red-200 rounded mr-2 italic text-gray-500">NA</div>
                            <span className="text-sm text-gray-600">No Aplicable</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};