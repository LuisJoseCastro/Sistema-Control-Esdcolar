import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ClipboardList, Save, ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Table, { TableHead, TableCell, TableRow } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';

// --- CONSTANTE ID (REEMPLAZAR CON ID REAL DE LA BD) ---
const TEACHER_ID = "550e8400-e29b-41d4-a716-446655440000";

// --- Tipos de Datos ---
interface AlumnoCalificacion {
    id: string; // ID real de la base de datos (GradeCard ID)
    nombre: string;
    parcial1: string;
    parcial2: string;
    parcial3: string;
    final: string;
    extraordinario: string;
}

interface Grupo { id: string; nombre: string; }
interface Asignatura { id: string; nombre: string; }

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
    value, onChange, placeholder, isExtraordinario = false,
    hasError = false, onBlur, onFocus
}) => {
    const [tempValue, setTempValue] = useState<string>(value);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    
    useEffect(() => {
        if (!isFocused) setTempValue(value);
    }, [value, isFocused]);
    
    const handleFocus = () => {
        setIsFocused(true);
        if (onFocus) onFocus();
        if (value === 'NA' && !isExtraordinario) setTempValue('');
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
    
    const inputClasses = isExtraordinario ? "text-xs font-mono text-center" : "font-semibold text-center";
    const combinedClasses = `${inputClasses} bg-gray-100 border-gray-300 py-2 text-center ${
        hasError ? 'border-yellow-400 bg-yellow-50' : ''
    } ${!isExtraordinario && value === 'NA' ? 'text-red-600 font-bold italic' : ''}`;

    return (
        <div className="relative group">
            <Input
                type="text" value={tempValue} onChange={handleChange}
                onFocus={handleFocus} onBlur={handleBlurInternal}
                placeholder={placeholder} className={combinedClasses}
                maxLength={isExtraordinario ? 10 : 5}
            />
            {hasError && value === '' && (
                <div className="absolute z-10 -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg border border-yellow-300">
                    <AlertTriangle className="inline w-3 h-3 mr-1" />
                    Campo requerido
                </div>
            )}
        </div>
    );
};

export const DocenteCalificacionesPage: React.FC = () => {
    const navigate = useNavigate();
    
    // --- ESTADOS CONECTADOS A LA BD (Inicializan vacíos) ---
    const [grupos, setGrupos] = useState<Grupo[]>([]);
    const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
    const [calificaciones, setCalificaciones] = useState<AlumnoCalificacion[]>([]);
    
    const [selectedGrupo, setSelectedGrupo] = useState<string>('');
    const [selectedAsignatura, setSelectedAsignatura] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [camposEditados, setCamposEditados] = useState<Set<string>>(new Set());

    // 1. CARGA INICIAL: Grupos y Asignaturas desde el Backend
    useEffect(() => {
        const fetchFiltros = async () => {
            try {
                // Grupos
                const resGrupos = await fetch(`http://localhost:3000/academic/groups/${TEACHER_ID}`);
                if (resGrupos.ok) {
                    const dataGrupos = await resGrupos.json();
                    setGrupos(dataGrupos);
                }

                // Asignaturas (desde la carga académica)
                const resLoad = await fetch(`http://localhost:3000/academic/teacher-load/${TEACHER_ID}`);
                if (resLoad.ok) {
                    const dataLoad = await resLoad.json();
                    const mats = dataLoad.map((item: any) => ({
                        id: item.id,
                        nombre: item.subject?.nombre || 'Sin nombre'
                    }));
                    setAsignaturas(mats);
                }
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };
        fetchFiltros();
    }, []);

    // 2. CARGA DINÁMICA: Alumnos (cuando seleccionas asignatura)
    useEffect(() => {
        const cargarAlumnos = async () => {
            if (!selectedAsignatura) {
                setCalificaciones([]);
                return;
            }
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/academic/grades/list/${selectedAsignatura}`);
                if (!response.ok) throw new Error('No se pudo obtener la lista');
                const data = await response.json();
                setCalificaciones(data);
            } catch (error) {
                console.error("Fetch error:", error);
                setCalificaciones([]);
            } finally {
                setIsLoading(false);
            }
        };
        cargarAlumnos();
    }, [selectedAsignatura]);

    // --- LÓGICA DE NEGOCIO (Idéntica a tu original) ---
    const actualizarLogicaAutomática = useCallback((alumno: AlumnoCalificacion): AlumnoCalificacion => {
        const parciales = [
            { val: alumno.parcial1, label: 'P1' },
            { val: alumno.parcial2, label: 'P2' },
            { val: alumno.parcial3, label: 'P3' }
        ];

        const debidas = parciales
            .filter(p => p.val === 'NA' || (p.val !== '' && parseFloat(p.val) < 70))
            .map(p => p.label);
        
        const tieneNA = debidas.length > 0;
        const estanTodosLlenos = parciales.every(p => p.val !== '' && p.val !== 'NA');

        let nuevoFinal = alumno.final;
        let nuevoExtra = 'NA';

        if (tieneNA) {
            nuevoFinal = 'NA';
            nuevoExtra = debidas.join(' - ');
        } else if (estanTodosLlenos) {
            const suma = parciales.reduce((acc, p) => acc + parseFloat(p.val), 0);
            nuevoFinal = Math.round(suma / 3).toString();
            nuevoExtra = 'NA';
        } else {
            nuevoFinal = ''; 
            nuevoExtra = 'NA';
        }

        return { ...alumno, final: nuevoFinal, extraordinario: nuevoExtra };
    }, []);

    const handleUpdateCalificacion = useCallback((id: string, field: keyof AlumnoCalificacion, value: string) => {
        const campoKey = `${id}-${field}`;
        setCamposEditados(prev => new Set(prev).add(campoKey));
        
        setCalificaciones(prevCals => prevCals.map(cal => {
            if (cal.id === id) {
                const actualizado = { ...cal, [field]: value };
                if (['parcial1', 'parcial2', 'parcial3'].includes(field)) {
                    return actualizarLogicaAutomática(actualizado);
                }
                return actualizado;
            }
            return cal;
        }));
    }, [actualizarLogicaAutomática]);

    const obtenerCamposVacios = useCallback(() => {
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
                    camposVacios.push({ alumno: alumno.nombre, campo: label });
                }
            });
        });
        return camposVacios;
    }, [calificaciones]);

    // 3. GUARDADO REAL: Fetch POST al Backend
    const handleGuardarCalificaciones = useCallback(async () => {
        const vacios = obtenerCamposVacios();
        if (vacios.length > 0) {
            let mensaje = `⚠️ Hay ${vacios.length} campo(s) vacío(s):\n\n`;
            const porAlumno: Record<string, string[]> = {};
            vacios.forEach(({alumno, campo}) => {
                if (!porAlumno[alumno]) porAlumno[alumno] = [];
                porAlumno[alumno].push(campo);
            });
            Object.entries(porAlumno).forEach(([alumno, campos], index) => {
                mensaje += `${index + 1}. ${alumno}: ${campos.join(', ')}\n`;
            });
            alert(mensaje + "\nCompleta todos los campos antes de guardar.");
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/academic/grades/capture/${selectedAsignatura}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(calificaciones),
            });

            if (!response.ok) throw new Error('Error al guardar');

            alert('✅ Calificaciones guardadas exitosamente.');
            setCamposEditados(new Set());
        } catch (error) {
            console.error("Error saving grades:", error);
            alert('❌ No se pudo conectar con el servidor.');
        } finally {
            setIsLoading(false);
        }
    }, [obtenerCamposVacios, selectedAsignatura, calificaciones]);

    const totalCamposVacios = useMemo(() => {
        return calificaciones.reduce((total, alumno) => {
            const campos = ['parcial1', 'parcial2', 'parcial3', 'final', 'extraordinario'] as const;
            return total + campos.filter(campo => !alumno[campo] || alumno[campo].trim() === '').length;
        }, 0);
    }, [calificaciones]);

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <header className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <ClipboardList className="w-7 h-7 mr-3 text-main-900" />
                    Captura de Calificaciones
                </h1>
                <button onClick={() => navigate('/docente/dashboard')} className="text-sm px-3 py-2 bg-transparent text-gray-600 hover:bg-gray-100 border border-gray-300 rounded flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Volver a Inicio
                </button>
            </header>

            <p className="text-gray-600 mb-6 text-lg">Selecciona el grupo y la asignatura para empezar a registrar las calificaciones de los alumnos.</p>

            <Card header="Filtros de Captura" variant="flat" className="mb-8 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select 
                        label="Grupos" 
                        value={selectedGrupo} 
                        onChange={(e) => setSelectedGrupo(e.target.value)} 
                        options={grupos.map(g => ({ value: g.id, label: g.nombre }))} 
                        placeholder="Seleccionar Grupo" 
                    />
                    <Select 
                        label="Asignatura" 
                        value={selectedAsignatura} 
                        onChange={(e) => setSelectedAsignatura(e.target.value)} 
                        options={asignaturas.map(a => ({ value: a.id, label: a.nombre }))} 
                        placeholder="Seleccionar Asignatura" 
                    />
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm text-blue-700">
                        <span className="font-semibold">Nota:</span> Los campos vacíos se marcarán en amarillo. Calificaciones menores a 70 se convertirán automáticamente a "NA".
                    </p>
                </div>
            </Card>

            <div className="relative">
                {(!selectedGrupo || !selectedAsignatura) ? (
                    <Card variant="flat" className="text-center py-12">
                        <Search className="w-10 h-10 mx-auto text-gray-600 mb-4" />
                        <p className="text-xl font-medium text-gray-700">Filtros pendientes. Por favor, selecciona un <strong>Grupo</strong> y una <strong>Asignatura</strong> para cargar el registro de calificaciones.</p>
                    </Card>
                ) : (
                    <>
                        {totalCamposVacios > 0 && (
                            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md flex items-center">
                                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                                <div>
                                    <h3 className="font-bold text-yellow-800 text-lg">{totalCamposVacios} campo(s) vacío(s)</h3>
                                    <p className="text-yellow-700 text-sm">Completa todos los campos con una calificación (0-100) o escribe "NA".</p>
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
                                {calificaciones.length > 0 ? (
                                    calificaciones.map(alumno => (
                                        <TableRow key={alumno.id}>
                                            <TableCell className="font-medium text-gray-900 truncate">{alumno.nombre}</TableCell>
                                            <TableCell><CalificacionInput value={alumno.parcial1} onChange={(v) => handleUpdateCalificacion(alumno.id, 'parcial1', v)} hasError={alumno.parcial1 === ''} placeholder="Ej: 85" /></TableCell>
                                            <TableCell><CalificacionInput value={alumno.parcial2} onChange={(v) => handleUpdateCalificacion(alumno.id, 'parcial2', v)} hasError={alumno.parcial2 === ''} placeholder="Ej: 85" /></TableCell>
                                            <TableCell><CalificacionInput value={alumno.parcial3} onChange={(v) => handleUpdateCalificacion(alumno.id, 'parcial3', v)} hasError={alumno.parcial3 === ''} placeholder="Ej: 85" /></TableCell>
                                            <TableCell><CalificacionInput value={alumno.final} onChange={(v) => handleUpdateCalificacion(alumno.id, 'final', v)} hasError={alumno.final === ''} placeholder="Ej: 85" /></TableCell>
                                            <TableCell><CalificacionInput value={alumno.extraordinario} onChange={(v) => handleUpdateCalificacion(alumno.id, 'extraordinario', v)} isExtraordinario hasError={alumno.extraordinario === ''} placeholder="NA, P1, P1-P3" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-gray-500 italic">
                                            {isLoading ? 'Cargando alumnos...' : 'No se encontraron alumnos en este grupo.'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Table.Body>
                        </Table>

                        <div className="flex justify-end mt-8">
                            <Button onClick={handleGuardarCalificaciones} disabled={isLoading || calificaciones.length === 0} icon={<Save className="w-5 h-5" />} variant="primary">
                                {isLoading ? 'Guardando...' : 'Guardar Calificaciones'}
                            </Button>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-10 space-y-6">
                <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
                    <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
                        <ClipboardList className="w-5 h-5 mr-2" />
                        Guía de uso:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0"><span className="text-sm font-bold">1</span></div>
                            <div><p className="font-medium text-gray-800">Escribe calificaciones</p><p className="text-sm text-gray-600">Números entre 0-100</p></div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0"><span className="text-sm font-bold">2</span></div>
                            <div><p className="font-medium text-gray-800">NA automático</p><p className="text-sm text-gray-600">Calificaciones &lt; 70 se convierten a NA</p></div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0"><span className="text-sm font-bold">3</span></div>
                            <div><p className="font-medium text-gray-800">Campos vacíos</p><p className="text-sm text-gray-600">Se marcarán en <span className="text-yellow-600 font-bold">amarillo</span></p></div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0"><span className="text-sm font-bold">4</span></div>
                            <div><p className="font-medium text-gray-800">Campo extraordinario</p><p className="text-sm text-gray-600">Usa P1, P2, P3, P1-P3, etc.</p></div>
                        </div>
                    </div>
                </div>
                
                {/* INDICADORES VISUALES (RESTAURADOS) */}
                <div className="p-4 bg-white rounded-lg border border-gray-300 shadow-sm">
                    <h4 className="font-bold text-gray-700 mb-2">Indicadores visuales:</h4>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center"><div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded mr-2"></div><span className="text-sm text-gray-600">Campo vacío (requerido)</span></div>
                        <div className="flex items-center"><div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded mr-2"></div><span className="text-sm text-gray-600">Campo válido</span></div>
                        <div className="flex items-center"><div className="w-8 h-6 bg-red-50 outline-2 outline-red-200 rounded mr-2 pl-1.5 italic text-gray-500">NA</div><span className="text-sm text-gray-600">No Aplicable</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocenteCalificacionesPage;