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
    isReadOnly?: boolean;
    hasError?: boolean;
    onBlur?: () => void;
    onFocus?: () => void;
}

const CalificacionInput: React.FC<CalificacionInputProps> = ({ 
    value, onChange, placeholder, isExtraordinario = false,
    isReadOnly = false, hasError = false, onBlur, onFocus
}) => {
    const [tempValue, setTempValue] = useState<string>(value);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    
    useEffect(() => {
        if (!isFocused) {
            setTempValue(value);
        }
    }, [value, isFocused]);
    
    const handleFocus = () => {
        if (isReadOnly) return;
        setIsFocused(true);
        if (onFocus) onFocus();
        if (value === 'NA' || value === '0') {
            setTempValue('');
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isReadOnly) return;
        const inputValue = e.target.value;
        if (inputValue === '' || /^\d+$/.test(inputValue) || inputValue.toUpperCase() === 'NA') {
            setTempValue(inputValue);
            onChange(inputValue);
        }
    };
    
    const handleBlurInternal = () => {
        if (isReadOnly) return;
        setIsFocused(false);
        const inputValue = tempValue.trim().toUpperCase();
        
        if (inputValue === '' || inputValue === 'NA') {
            const finalVal = inputValue === '' ? '' : 'NA';
            onChange(finalVal);
            setTempValue(finalVal);
        } else {
            const numValue = parseInt(inputValue, 10);
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
        if (onBlur) onBlur();
    };
    
    const inputClasses = isExtraordinario ? "text-xs font-mono text-center" : "font-semibold text-center";
    const readOnlyClasses = isReadOnly ? "bg-gray-200 cursor-not-allowed opacity-80" : "bg-gray-100";
    const combinedClasses = `${inputClasses} ${readOnlyClasses} border-gray-300 py-2 text-center w-full ${
        hasError ? 'border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500' : ''
    } ${value === 'NA' ? 'text-red-600 font-bold italic' : ''}`;

    return (
        <div className="relative group w-full">
            <Input
                type="text" value={tempValue} onChange={handleChange}
                onFocus={handleFocus} onBlur={handleBlurInternal}
                readOnly={isReadOnly}
                placeholder={placeholder} className={combinedClasses}
                maxLength={3}
            />
            {hasError && value === '' && !isReadOnly && (
                <div className="hidden group-hover:block absolute z-10 -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded whitespace-nowrap shadow-md border border-yellow-300">
                    Requerido
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

    const aplicarLogicaFila = useCallback((alumno: AlumnoCalificacion): AlumnoCalificacion => {
        const parciales = [
            { val: alumno.parcial1, label: 'P1' },
            { val: alumno.parcial2, label: 'P2' },
            { val: alumno.parcial3, label: 'P3' }
        ];

        const debidas = parciales
            .filter(p => p.val === 'NA' || (p.val !== '' && parseInt(p.val, 10) < 70))
            .map(p => p.label);
        
        const tieneReprobadas = debidas.length > 0;
        const estanTodosLlenos = parciales.every(p => p.val !== '');

        let nuevoFinal = alumno.final;
        let nuevoExtra = alumno.extraordinario;

        if (estanTodosLlenos) {
            const suma = parciales.reduce((acc, p) => acc + (parseInt(p.val, 10) || 0), 0);
            const promedio = Math.round(suma / 3);

            if (promedio < 70 || tieneReprobadas) {
                nuevoFinal = 'NA';
                nuevoExtra = debidas.length > 0 ? debidas.join('-') : 'NA';
            } else {
                nuevoFinal = promedio.toString();
                nuevoExtra = '';
            }
        } else {
            nuevoExtra = debidas.length > 0 ? debidas.join('-') : '';
        }

        return { ...alumno, final: nuevoFinal, extraordinario: nuevoExtra };
    }, []);

    useEffect(() => {
        const fetchFiltros = async () => {
            if (!token) return;
            try {
                const resGrupos = await fetch(`${API_URL}/academic/groups`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (resGrupos.ok) {
                    const data = await resGrupos.json();
                    setGrupos(data.map((g: ApiGroup) => ({ id: g.id, nombre: g.nombre })));
                }
                const resLoad = await fetch(`${API_URL}/academic/teacher-load`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (resLoad.ok) {
                    const data = await resLoad.json();
                    setAsignaturas(data.map((item: ApiSubject) => ({ id: item.id, nombre: item.subject?.nombre || 'Sin nombre' })));
                }
            } catch (error) { console.error(error); }
        };
        fetchFiltros();
    }, [token]);

    useEffect(() => {
        const cargarAlumnos = async () => {
            if (!selectedAsignatura || !token) { setCalificaciones([]); return; }
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/academic/grades/list/${selectedAsignatura}`, { headers: { 'Authorization': `Bearer ${token}` } });
                const data = await response.json();
                if (Array.isArray(data)) {
                    const procesados = data.map((d: ApiGradeResponse) => {
                        const fmt = (val: any) => {
                            if (val === undefined || val === null || val === '') return '';
                            const n = Number(val);
                            if (isNaN(n)) return String(val);
                            return n < 70 ? 'NA' : String(Math.floor(n));
                        };
                        const basico = {
                            id: d.id, nombre: d.nombre,
                            parcial1: fmt(d.parcial1), parcial2: fmt(d.parcial2), parcial3: fmt(d.parcial3),
                            final: fmt(d.final), extraordinario: d.extraordinario ? String(d.extraordinario) : ''
                        };
                        return aplicarLogicaFila(basico);
                    });
                    setCalificaciones(procesados);
                }
            } catch (error) { console.error(error); } finally { setIsLoading(false); }
        };
        cargarAlumnos();
    }, [selectedAsignatura, token, aplicarLogicaFila]);

    const handleUpdateCalificacion = (id: string, field: string, value: string) => {
        setCamposEditados(prev => new Set(prev).add(`${id}-${field}`));
        setCalificaciones(prev => prev.map(cal => {
            if (cal.id === id) {
                const act = { ...cal, [field]: value };
                return ['parcial1', 'parcial2', 'parcial3'].includes(field) ? aplicarLogicaFila(act) : act;
            }
            return cal;
        }));
    };

    const handleGuardarCalificaciones = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/academic/grades/capture/${selectedAsignatura}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(calificaciones),
            });
            if (res.ok) {
                alert('Calificaciones guardadas exitosamente.');
                setCamposEditados(new Set());
            }
        } catch (error) { alert('Error al conectar con el servidor.'); } finally { setIsLoading(false); }
    };

    const totalCamposVacios = useMemo(() => {
        return calificaciones.reduce((total, alumno) => {
            const required = [alumno.parcial1, alumno.parcial2, alumno.parcial3];
            return total + required.filter(f => f.trim() === '').length;
        }, 0);
    }, [calificaciones]);

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <header className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <ClipboardList className="w-7 h-7 mr-3 text-blue-600" />
                    Captura de Calificaciones
                </h1>
                <button onClick={() => navigate('/docente/dashboard')} className="text-sm px-3 py-2 bg-transparent text-gray-600 hover:bg-gray-100 border border-gray-300 rounded flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Volver a Inicio
                </button>
            </header>

            <p className="text-gray-600 mb-6 text-lg">Selecciona el grupo y la asignatura para empezar a registrar las calificaciones de los alumnos.</p>

            <Card header="Filtros de Captura" variant="flat" className="mb-8 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select label="Grupos" value={selectedGrupo} onChange={(e) => { setSelectedGrupo(e.target.value); setSelectedAsignatura(''); }} options={grupos.map(g => ({ value: g.id, label: g.nombre }))} placeholder="Seleccionar Grupo" />
                    <Select label="Asignatura" value={selectedAsignatura} onChange={(e) => setSelectedAsignatura(e.target.value)} options={asignaturas.map(a => ({ value: a.id, label: a.nombre }))} placeholder={!selectedGrupo ? "Selecciona Asignatura" : "Seleccionar Asignatura"} disabled={!selectedGrupo} />
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm text-blue-700">
                        <span className="font-semibold">Nota:</span> Los campos vacíos se marcarán en amarillo. Calificaciones menores a 70 se convertirán automáticamente a "NA".
                    </p>
                </div>
            </Card>

            {!selectedAsignatura ? (
                <Card variant="flat" className="text-center py-12">
                    <Search className="w-10 h-10 mx-auto text-gray-600 mb-4" />
                    <p className="text-xl font-medium text-gray-700">Filtros pendientes. Por favor, selecciona un <strong>Grupo</strong> y una <strong>Asignatura</strong>.</p>
                </Card>
            ) : (
                <>
                    {totalCamposVacios > 0 && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md flex items-center">
                            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                            <div><h3 className="font-bold text-yellow-800 text-lg">{totalCamposVacios} campo(s) vacío(s)</h3><p className="text-yellow-700 text-sm">Completa todos los parciales para habilitar el guardado.</p></div>
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
                                    <TableCell className="font-medium text-gray-900 truncate">{alumno.nombre}</TableCell>
                                    <TableCell><CalificacionInput value={alumno.parcial1} onChange={(v) => handleUpdateCalificacion(alumno.id, 'parcial1', v)} hasError={alumno.parcial1 === ''} placeholder="Ej: 85" /></TableCell>
                                    <TableCell><CalificacionInput value={alumno.parcial2} onChange={(v) => handleUpdateCalificacion(alumno.id, 'parcial2', v)} hasError={alumno.parcial2 === ''} placeholder="Ej: 85" /></TableCell>
                                    <TableCell><CalificacionInput value={alumno.parcial3} onChange={(v) => handleUpdateCalificacion(alumno.id, 'parcial3', v)} hasError={alumno.parcial3 === ''} placeholder="Ej: 85" /></TableCell>
                                    <TableCell><CalificacionInput value={alumno.final} onChange={() => {}} isReadOnly placeholder="NA" /></TableCell>
                                    <TableCell><CalificacionInput value={alumno.extraordinario} onChange={() => {}} isReadOnly isExtraordinario placeholder="---" /></TableCell>
                                </TableRow>
                            ))}
                        </Table.Body>
                    </Table>

                    <div className="flex justify-end mt-8">
                        <Button onClick={handleGuardarCalificaciones} disabled={isLoading || calificaciones.length === 0 || totalCamposVacios > 0} icon={<Save className="w-5 h-5" />} variant="primary">
                            {isLoading ? 'Guardando...' : (camposEditados.size === 0 ? 'No hay cambios' : 'Guardar Calificaciones')}
                        </Button>
                    </div>
                </>
            )}

            <div className="mt-8">
                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                        <ClipboardList className="w-5 h-5 mr-2" />
                        Guía de uso:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 border border-blue-200"><span className="text-xs font-bold">1</span></div>
                            <div><p className="font-bold text-gray-800 text-sm">Escribe calificaciones</p><p className="text-xs text-gray-600">Números enteros entre 0-100</p></div>
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
                            <div><p className="font-bold text-gray-800 text-sm">Campo extraordinario</p><p className="text-xs text-gray-600">Muestra automáticamente las unidades que se deben</p></div>
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
                        <div className="w-7 h-6 bg-red-50 border border-red-300 rounded flex items-center justify-center text-[13px] font-bold text-red-600 mr-2 italic">NA</div>
                        <span>No Aplicable</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocenteCalificacionesPage;