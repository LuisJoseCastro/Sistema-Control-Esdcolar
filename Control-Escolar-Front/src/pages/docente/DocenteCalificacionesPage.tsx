// src/pages/docente/DocenteCalificacionesPage.tsx

import React, { useState, useCallback, useMemo } from 'react';
import { ClipboardList, Save, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🛑 CORRECCIÓN DE IMPORTACIÓN: 
// Solo importamos Table (default) y los sub-componentes que sí se exportaron (TableRow, TableHead, TableCell).
// TableHeader y TableBody se accederán mediante la sintaxis de punto (Table.Header, Table.Body).
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Table, { TableHead, TableCell, TableRow } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
// El spinner no es necesario aquí, ya que el Button lo maneja internamente.
// import { LoadingSpinner } from '../../components/ui/LoadingSpinner';


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

// --- MOCK DATA (Sin cambios) ---
const MOCK_GRUPOS: Grupo[] = [
    { id: '1', nombre: 'Grupo 3A - Matemáticas' },
    { id: '2', nombre: 'Grupo 5B - Español' },
    { id: '3', nombre: 'Grupo 1C - Historia' },
];

const MOCK_ASIGNATURAS: Asignatura[] = [
    { id: '101', nombre: 'Matemáticas Avanzadas' },
    { id: '102', nombre: 'Español' },
    { id: '103', nombre: 'Historia' },
];

const MOCK_CALIFICACIONES: AlumnoCalificacion[] = [
    { id: 'a1', nombre: 'Juan Pablo Guzmán', parcial1: '85', parcial2: '90', parcial3: '88', final: '88', extraordinario: 'NA' },
    { id: 'a2', nombre: 'María José López', parcial1: '75', parcial2: '79', parcial3: '70', final: '75', extraordinario: 'NA' },
    { id: 'a3', nombre: 'Brandon Jael Ramos', parcial1: 'NA', parcial2: '82', parcial3: '70', final: 'NA', extraordinario: 'P1' },
    { id: 'a4', nombre: 'Miguel Ángel Torres', parcial1: 'NA', parcial2: 'NA', parcial3: 'NA', final: 'NA', extraordinario: 'P1 - P3' },
    { id: 'a5', nombre: 'Sofía Isabel García', parcial1: '95', parcial2: '95', parcial3: '98', final: '100', extraordinario: 'NA' },
];


/**
 * Componente interno para el campo de calificación, utilizando el componente Input atómico.
 */
interface CalificacionInputProps {
    value: string;
    // 🛑 CORRECCIÓN DE TIPO: onChange recibe el nuevo valor (string), no el evento.
    onChange: (newValue: string) => void;
    placeholder: string;
    isExtraordinario?: boolean;
}

const CalificacionInput: React.FC<CalificacionInputProps> = ({ value, onChange, placeholder, isExtraordinario = false }) => {
    // Clases específicas para el input dentro de la tabla
    const inputClasses = isExtraordinario
        ? "text-xs font-mono text-center" // Para Extraordinario: Texto más chico, sin color específico
        : "font-semibold text-center"; // Para Parcial/Final

    return (
        // 🛑 USO DEL COMPONENTE ATÓMICO: Input
        <Input
            type="number" // Usamos text para permitir 'NA', 'P1', etc.
            value={value}
            // 🛑 CORRECCIÓN: El Input atómico usa (e) => onChange(e.target.value) para extraer el valor.
            // Aquí lo adaptamos para que el prop 'onChange' de CalificacionInput reciba directamente el valor.
            onChange={(e) => onChange(e.target.value.toUpperCase())} // Convertimos a mayúsculas para Extraordinario/NA
            placeholder={placeholder}
            className="p-0 m-0" // Anulamos padding/margin externo del div contenedor de Input
            inputClassName={`${inputClasses} bg-gray-100 border-gray-300 py-2`} // Estilos internos del input
            maxLength={isExtraordinario ? 5 : 3}
        />
    );
};


// --- PÁGINA PRINCIPAL: DocenteCalificacionesPage ---
export const DocenteCalificacionesPage: React.FC = () => {
    const navigate = useNavigate();

    // Estado de los filtros
    const [selectedGrupo, setSelectedGrupo] = useState<string>('');
    const [selectedAsignatura, setSelectedAsignatura] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false); // 🛑 Nuevo: Estado de carga

    // Estado de las calificaciones editables
    const [calificaciones, setCalificaciones] = useState<AlumnoCalificacion[]>(MOCK_CALIFICACIONES);

    // Simulación de la actualización de una celda
    // Esta función recibe el ID, el campo y el valor (string)
    const handleUpdateCalificacion = useCallback((id: string, field: keyof AlumnoCalificacion, value: string) => {
        setCalificaciones(prevCals => prevCals.map(cal =>
            cal.id === id ? { ...cal, [field]: value } : cal
        ));
    }, []);

    // 🛑 CORRECCIÓN DEL ERROR DE TIPADO: Función de Currying para usar en el onChange
    // Esta función recibe los argumentos fijos y retorna la función que acepta el valor dinámico (newValue).
    const createUpdateHandler = useCallback((id: string, field: keyof AlumnoCalificacion) => (
        (newValue: string) => {
            // Llama a la función principal de actualización con todos los argumentos
            handleUpdateCalificacion(id, field, newValue);
        }
    ), [handleUpdateCalificacion]);


    // Simulación de la acción de Guardar
    const handleGuardarCalificaciones = useCallback(() => {
        setIsLoading(true); // Iniciar carga
        console.log("Guardando calificaciones:", calificaciones);
        setTimeout(() => {
            setIsLoading(false); // Finalizar carga
            // Idealmente, aquí se usaría un componente Toast o Modal de éxito.
            alert('Calificaciones guardadas exitosamente (Simulación).');
        }, 1500); // Simulación de retraso de red
    }, [calificaciones]);

    const isReadyToSave = useMemo(() => selectedGrupo && selectedAsignatura, [selectedGrupo, selectedAsignatura]);

    // Opciones para el Select atómico (transformación de Mock Data)
    const grupoOptions = MOCK_GRUPOS.map(g => ({ value: g.id, label: g.nombre }));
    const asignaturaOptions = MOCK_ASIGNATURAS.map(a => ({ value: a.id, label: a.nombre }));


    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">

            {/* Header: Título y Navegación */}
            <header className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <ClipboardList className="w-7 h-7 mr-3 text-main-900" />
                    Captura de Calificaciones
                </h1>
                {/* 🛑 USO DEL COMPONENTE ATÓMICO: Button (variant: ghost) */}
                <Button
                    variant='ghost'
                    onClick={() => navigate('/docente/dashboard')}
                    icon={<ArrowLeft className="w-4 h-4" />}
                    className="text-sm px-3 py-2"
                >
                    Volver a Inicio
                </Button>
            </header>

            <p className="text-gray-600 mb-6 text-lg">
                Selecciona el grupo y la asignatura para empezar a registrar las calificaciones de los alumnos.
            </p>

            {/* 1. SECCIÓN DE FILTROS */}
            {/* 🛑 USO DEL COMPONENTE ATÓMICO: Card (variant: flat) */}
            <Card header="Filtros de Captura" variant="flat" className="mb-8 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Filtro de Grupos */}
                    {/* 🛑 USO DEL COMPONENTE ATÓMICO: Select */}
                    <Select
                        label="Grupos"
                        value={selectedGrupo}
                        onChange={(e) => setSelectedGrupo(e.target.value)}
                        placeholder="Seleccionar Grupo"
                        options={grupoOptions}
                    />

                    {/* Filtro de Asignatura */}
                    {/* 🛑 USO DEL COMPONENTE ATÓMICO: Select */}
                    <Select
                        label="Asignatura"
                        value={selectedAsignatura}
                        onChange={(e) => setSelectedAsignatura(e.target.value)}
                        placeholder="Seleccionar Asignatura"
                        options={asignaturaOptions}
                    />
                </div>
            </Card>

            {/* 2. SECCIÓN DE TABLA DE CALIFICACIONES */}
            <div className="relative">

                {(!selectedGrupo || !selectedAsignatura) ? (
                    // 🛑 USO DE COMPONENTE ATÓMICO: Card para el mensaje de inactividad
                    <Card variant="flat" className="text-center py-12">
                        <Search className="w-10 h-10 mx-auto text-gray-600 mb-4" />
                        <p className="text-xl font-medium text-gray-700">
                            Filtros pendientes. Por favor, selecciona un **Grupo** y una **Asignatura** para cargar el registro de calificaciones.
                        </p>
                    </Card>

                ) : (
                    // 🛑 USO DEL COMPONENTE ATÓMICO: Table
                    <Table className="shadow-lg">
                        {/* 🛑 CORRECCIÓN DE IMPORTACIÓN: Usamos Table.Header */}
                        <Table.Header>
                            {/* 🛑 USO DEL SUB-COMPONENTE: Table.Row */}
                            <TableRow>
                                {/* 🛑 USO DEL SUB-COMPONENTE: Table.Head */}
                                <TableHead className="w-1/4">Nombre del Alumno</TableHead>
                                <TableHead className="text-center">Parcial 1</TableHead>
                                <TableHead className="text-center">Parcial 2</TableHead>
                                <TableHead className="text-center">Parcial 3</TableHead>
                                <TableHead className="text-center">Final</TableHead>
                                <TableHead className="text-center w-1/4">Extraordinario</TableHead>
                            </TableRow>
                        </Table.Header>

                        {/* 🛑 CORRECCIÓN DE IMPORTACIÓN: Usamos Table.Body (Línea 208 corregida) */}
                        <Table.Body>
                            {calificaciones.map(alumno => (
                                // 🛑 USO DEL SUB-COMPONENTE: Table.Row
                                <TableRow key={alumno.id}>
                                    {/* Nombre del Alumno */}
                                    {/* 🛑 USO DEL SUB-COMPONENTE: Table.Cell */}
                                    <TableCell className="font-medium text-gray-900 truncate">
                                        {alumno.nombre}
                                    </TableCell>

                                    {/* Calificaciones (Parciales y Final) */}
                                    <TableCell>
                                        <CalificacionInput
                                            value={alumno.parcial1}
                                            // 🛑 CORRECCIÓN DE TIPADO: Usamos el handler de currying
                                            onChange={createUpdateHandler(alumno.id, 'parcial1')}
                                            placeholder="NA"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <CalificacionInput
                                            value={alumno.parcial2}
                                            // 🛑 CORRECCIÓN DE TIPADO
                                            onChange={createUpdateHandler(alumno.id, 'parcial2')}
                                            placeholder="NA"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <CalificacionInput
                                            value={alumno.parcial3}
                                            // 🛑 CORRECCIÓN DE TIPADO
                                            onChange={createUpdateHandler(alumno.id, 'parcial3')}
                                            placeholder="NA"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <CalificacionInput
                                            value={alumno.final}
                                            // 🛑 CORRECCIÓN DE TIPADO
                                            onChange={createUpdateHandler(alumno.id, 'final')}
                                            placeholder="NA"
                                        />
                                    </TableCell>

                                    {/* Extraordinario */}
                                    <TableCell>
                                        <CalificacionInput
                                            value={alumno.extraordinario}
                                            // 🛑 CORRECCIÓN DE TIPADO
                                            onChange={createUpdateHandler(alumno.id, 'extraordinario')}
                                            placeholder="NA"
                                            isExtraordinario={true}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </Table.Body>
                    </Table>
                )}

                {/* 3. BOTÓN DE GUARDAR */}
                {isReadyToSave && (
                    <div className="flex justify-end mt-6">
                        {/* 🛑 USO DEL COMPONENTE ATÓMICO: Button (variant: gradient) */}
                        <Button
                            variant='gradient'
                            onClick={handleGuardarCalificaciones}
                            disabled={!isReadyToSave || isLoading}
                            isLoading={isLoading}
                            icon={<Save className="w-5 h-5" />}
                        >
                            Guardar Calificaciones
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};