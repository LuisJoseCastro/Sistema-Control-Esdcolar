import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ClipboardList, Save, ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Table, { TableHead, TableCell, TableRow } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface AlumnoCalificacion {
    id: string;
    nombre: string;
    parcial1: string;
    parcial2: string;
    parcial3: string;
    final: string;
    extraordinario: string;
    [key: string]: string; 
}

interface Grupo { id: string; nombre: string; }
interface Asignatura { id: string; nombre: string; }

interface ApiGroup { id: string; nombre: string; }
interface ApiSubject { id: string; subject: { nombre: string; } }
interface ApiGradeResponse {
    id: string;
    nombre: string;
    parcial1?: string | number;
    parcial2?: string | number;
    parcial3?: string | number;
    final?: string | number;
    extraordinario?: string | number;
}

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
    
    const handleBlurInternal = () => {
        setIsFocused(false);
        const inputValue = tempValue.trim();
        
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
    const token = localStorage.getItem('token');
    
    const [grupos, setGrupos] = useState<Grupo[]>([]);
    const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
    const [calificaciones, setCalificaciones] = useState<AlumnoCalificacion[]>([]);
    
    const [selectedGrupo, setSelectedGrupo] = useState<string>('');
    const [selectedAsignatura, setSelectedAsignatura] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const [camposEditados, setCamposEditados] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchFiltros = async () => {
            if (!token) return;
            try {
                const resGrupos = await fetch(`${API_URL}/academic/groups`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (resGrupos.ok) {
                    const dataGrupos = await resGrupos.json();
                    if(Array.isArray(dataGrupos)) {
                        setGrupos(dataGrupos.map((g: ApiGroup) => ({ id: g.id, nombre: g.nombre })));
                    }
                }

                const resLoad = await fetch(`${API_URL}/academic/teacher-load`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (resLoad.ok) {
                    const dataLoad = await resLoad.json();
                    if(Array.isArray(dataLoad)) {
                        const mats = dataLoad.map((item: ApiSubject) => ({
                            id: item.id,
                            nombre: item.subject?.nombre || 'Sin nombre'
                        }));
                        setAsignaturas(mats);
                    }
                }
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };
        fetchFiltros();
    }, [token]);

    useEffect(() => {
        const cargarAlumnos = async () => {
            if (!selectedAsignatura || !token) {
                setCalificaciones([]);
                return;
            }
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/academic/grades/list/${selectedAsignatura}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('No se pudo obtener la lista');
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    const safeData: AlumnoCalificacion[] = data.map((d: ApiGradeResponse) => ({
                        id: d.id,
                        nombre: d.nombre,
                        parcial1: String(d.parcial1 || ''),
                        parcial2: String(d.parcial2 || ''),
                        parcial3: String(d.parcial3 || ''),
                        final: String(d.final || ''),
                        extraordinario: String(d.extraordinario || '')
                    }));
                    setCalificaciones(safeData);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setCalificaciones([]);
            } finally {
                setIsLoading(false);
            }
        };
        cargarAlumnos();
    }, [selectedAsignatura, token]);

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
        }

        return { ...alumno, final: nuevoFinal, extraordinario: nuevoExtra };
    }, []);

    const handleUpdateCalificacion = useCallback((id: string, field: keyof AlumnoCalificacion, value: string) => {
        setCamposEditados(prev => new Set(prev).add(`${id}-${field}`));
        
        setCalificaciones(prevCals => prevCals.map(cal => {
            if (cal.id === id) {
                const actualizado = { ...cal, [field]: value };
                if (['parcial1', 'parcial2', 'parcial3'].includes(field as string)) {
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
                { key: 'parcial1', label: 'Parcial 1' },
                { key: 'parcial2', label: 'Parcial 2' },
                { key: 'parcial3', label: 'Parcial 3' },
                { key: 'final', label: 'Final' },
                { key: 'extraordinario', label: 'Extraordinario' }
            ];
            campos.forEach(({key, label}) => {
                if (!alumno[key] || alumno[key].trim() === '') {
                    camposVacios.push({ alumno: alumno.nombre, campo: label });
                }
            });
        });
        return camposVacios;
    }, [calificaciones]);

    const handleGuardarCalificaciones = useCallback(async () => {
        const vacios = obtenerCamposVacios();
        if (vacios.length > 0) {
            alert(`Hay ${vacios.length} campo(s) vacío(s). Completa todos antes de guardar.`);
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/academic/grades/capture/${selectedAsignatura}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(calificaciones),
            });

            if (!response.ok) throw new Error('Error al guardar');

            alert('Calificaciones guardadas exitosamente.');
            setCamposEditados(new Set()); 
        } catch (error) {
            console.error("Error saving grades:", error);
            alert('No se pudo conectar con el servidor.');
        } finally {
            setIsLoading(false);
        }
    }, [obtenerCamposVacios, selectedAsignatura, calificaciones, token]);

    const totalCamposVacios = useMemo(() => {
        return calificaciones.reduce((total, alumno) => {
            const campos = ['parcial1', 'parcial2', 'parcial3', 'final', 'extraordinario'];
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
                        <p className="text-xl font-medium text-gray-700">Filtros pendientes. Por favor, selecciona un <strong>Grupo</strong> y una <strong>Asignatura</strong>.</p>
                    </Card>
                ) : (
                    <>
                        {totalCamposVacios > 0 && (
                            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md flex items-center">
                                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                                <div>
                                    <h3 className="font-bold text-yellow-800 text-lg">{totalCamposVacios} campo(s) vacío(s)</h3>
                                    <p className="text-yellow-700 text-sm">Completa todos los campos.</p>
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
                                            <TableCell><CalificacionInput value={alumno.extraordinario} onChange={(v) => handleUpdateCalificacion(alumno.id, 'extraordinario', v)} isExtraordinario hasError={alumno.extraordinario === ''} placeholder="NA, P1..." /></TableCell>
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
                            <Button 
                                onClick={handleGuardarCalificaciones} 
                                disabled={isLoading || calificaciones.length === 0 || camposEditados.size === 0} 
                                icon={<Save className="w-5 h-5" />} 
                                variant="primary"
                            >
                                {isLoading ? 'Guardando...' : (camposEditados.size === 0 ? 'No hay cambios' : 'Guardar Calificaciones')}
                            </Button>
                        </div>
                    </>
                )}
            </div>
            
            <div className="mt-8">
                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                        <ClipboardList className="w-5 h-5 mr-2" />
                        Guía de uso:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 border border-blue-200"><span className="text-xs font-bold">1</span></div>
                            <div><p className="font-bold text-gray-800 text-sm">Escribe calificaciones</p><p className="text-xs text-gray-600">Números entre 0-100</p></div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 border border-yellow-200"><span className="text-xs font-bold">2</span></div>
                            <div><p className="font-bold text-gray-800 text-sm">NA automático</p><p className="text-xs text-gray-600">Calificaciones &lt; 70 se convierten a NA</p></div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 border border-red-200"><span className="text-xs font-bold">3</span></div>
                            <div><p className="font-bold text-gray-800 text-sm">Campos vacíos</p><p className="text-xs text-gray-600">Se marcarán en <span className="text-yellow-600 font-bold">amarillo</span></p></div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 border border-green-200"><span className="text-xs font-bold">4</span></div>
                            <div><p className="font-bold text-gray-800 text-sm">Campo extraordinario</p><p className="text-xs text-gray-600">Usa P1, P2, P3, P1-P3, etc.</p></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">Indicadores visuales:</h4>
                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <div className="flex items-center">
                        <div className="w-5 h-5 bg-yellow-50 border border-yellow-400 rounded mr-2"></div>
                        <span>Campo vacío (requerido)</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-5 h-5 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                        <span>Campo válido</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-7 h-6 bg-red-50 border border-red-300 rounded flex items-center justify-center text-[13px] font-bold text-black-600 mr-2">NA</div>
                        <span>No Aplicable</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocenteCalificacionesPage;