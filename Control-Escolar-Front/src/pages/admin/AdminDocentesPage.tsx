// src/pages/admin/AdminDocentesPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Trash2, Briefcase, Eye } from 'lucide-react';

// Importación de Componentes UI
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table, { TableHead, TableCell, TableRow } from '../../components/ui/Table';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// 🛑 Importar la nueva Modal de Formulario
import { DocenteFormModal } from '../../components/admin/DocenteFormModal';


// Hooks y Servicios
import { useTenant } from '../../contexts/TenantContext';
// 🛑 IMPORTAMOS injectNewDocenteProfile
import { getAllUsersByTenant, injectNewDocenteProfile } from '../../services/admin.service'; 
import { type User, type DocenteProfile, type HorarioType } from '../../types/models'; 


/**
 * Filtra los usuarios para mostrar solo los de rol 'DOCENTE'.
 */
const filterDocentes = (users: User[]): DocenteProfile[] => {
    return users.filter(user => user.rol === 'DOCENTE') as DocenteProfile[];
}

export const AdminDocentesPage: React.FC = () => {
    const { config } = useTenant();
    const navigate = useNavigate();

    const [docentes, setDocentes] = useState<DocenteProfile[]>([]);
    const [filteredDocentes, setFilteredDocentes] = useState<DocenteProfile[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    
    const [isNewDocenteModalOpen, setIsNewDocenteModalOpen] = useState(false);

    // 1. Carga inicial de datos de docentes
    useEffect(() => {
        const fetchDocentes = async () => {
            if (!config) return;

            setLoading(true);
            try {
                const allUsers = await getAllUsersByTenant(config.id); 
                const initialDocentes = filterDocentes(allUsers);
                
                setDocentes(initialDocentes);
                setFilteredDocentes(initialDocentes);

            } catch (error) {
                console.error("Error al cargar docentes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocentes();
    }, [config]);

    // 2. Lógica de búsqueda/filtrado
    useEffect(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        
        const results = docentes.filter(docente =>
            docente.nombre.toLowerCase().includes(lowerCaseSearch) ||
            docente.email.toLowerCase().includes(lowerCaseSearch) ||
            docente.clave.toLowerCase().includes(lowerCaseSearch) 
        );
        
        setFilteredDocentes(results);
    }, [searchTerm, docentes]);
    
    
    // --- Handlers de acciones ---
    const handleNewDocente = () => {
        setIsNewDocenteModalOpen(true); // Abre la modal de creación
    };

    // FUNCIÓN PARA AÑADIR EL NUEVO DOCENTE A LA LISTA
    const handleSaveNewDocente = (data: any) => {
        const newDocente: DocenteProfile = { 
            id: `DOC-${Date.now()}`, 
            rol: 'DOCENTE', 
            tenantId: config?.id || 'T-default', 
            nombre: data.nombre,
            email: data.email,
            clave: data.clave || '', 
            telefono: data.telefono || '', 
            especialidad: data.especialidad || '', 
            materiasAsignadas: [], 
            horario: { Lunes: {}, Martes: {}, Miercoles: {}, Jueves: {}, Viernes: {} } as HorarioType,
        };

        // 🛑 INYECTAMOS EL PERFIL COMPLETO PARA QUE LA PÁGINA DE PERFIL LO ENCUENTRE
        injectNewDocenteProfile(newDocente);

        // Añadir el nuevo docente al estado principal
        setDocentes(prevDocentes => [...prevDocentes, newDocente]);
        console.log("Nuevo docente registrado:", newDocente);
    };

    // Modificación de navegación para ir al perfil
    const handleViewProfile = (docenteId: string) => {
        navigate(`/admin/docentes/${docenteId}/perfil`); 
    };

    // FUNCIÓN DE ELIMINACIÓN IMPLEMENTADA
    const handleDelete = (docenteId: string, docenteNombre: string) => {
        if (window.confirm(`¿Está seguro de que desea eliminar al docente ${docenteNombre}? Esta acción es irreversible.`)) {
            
            console.log(`[API MOCK] Eliminando docente ID: ${docenteId}`);
            
            setDocentes(prevDocentes => prevDocentes.filter(d => d.id !== docenteId));
        }
    };


    // --- Renderizado Principal ---
    return (
        <div className="p-8 bg-whiteBg-50 min-h-full font-sans">
            
            {/* TÍTULO Y BOTÓN DE NUEVO */}
            <header className="flex justify-between items-end border-b border-grayDark-500 pb-2 mb-8">
                <h1 
                    className="text-5xl text-black" 
                    style={{ fontFamily: '"Kaushan Script", cursive' }}
                >
                    Docentes
                </h1>
                
                {/* BOTÓN NUEVO */}
                <Button 
                    variant="ghost" 
                    onClick={handleNewDocente}
                    className="flex items-center text-sm font-normal p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    icon={<PlusCircle size={16} className="text-white-50 mr-1" />}
                >
                    Nuevo
                </Button>
            </header>
            
            {/* Controles: Búsqueda */}
            <div className="flex justify-end mb-6">
                <div className="md:w-1/3 w-full max-w-sm">
                    <Input
                        type="text"
                        placeholder="Buscar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        endIcon={Search} 
                        className="shadow-md"
                    />
                </div>
            </div>

            {/* Contenido: Tabla o Loading */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner text="Cargando lista de docentes..." />
                </div>
            ) : (
                <Card variant="default">
                    {filteredDocentes.length === 0 && searchTerm === '' ? (
                        <div className="text-center p-8 text-main-700">
                            <Briefcase size={48} className="mx-auto mb-4" />
                            <p className="text-lg">No hay docentes registrados.</p>
                        </div>
                    ) : filteredDocentes.length === 0 && searchTerm !== '' ? (
                        <div className="text-center p-8 text-main-700">
                            <p className="text-lg">No se encontraron docentes con el término: **{searchTerm}**.</p>
                        </div>
                    ) : (
                        <>
                            {/* TABLA DE DOCENTES */}
                            <Table>
                                <Table.Header>
                                    <TableRow>
                                        <TableHead className="text-start">clave</TableHead>
                                        <TableHead className="text-start">Nombre Completo</TableHead>
                                        <TableHead className="text-start">Email</TableHead>
                                        <TableHead className="text-start">perfil</TableHead>
                                        <TableHead className="text-start">Accion</TableHead>
                                    </TableRow>
                                </Table.Header>
                                
                                <Table.Body>
                                    {/* ITERAMOS SOBRE filteredDocentes DIRECTAMENTE */}
                                    {filteredDocentes.map((docente) => (
                                        <TableRow key={docente.id}>
                                            <TableCell className="font-mono text-gray-600">
                                                {docente.clave || docente.id} 
                                            </TableCell> 
                                            <TableCell className="font-medium text-gray-800">{docente.nombre}</TableCell>
                                            <TableCell>{docente.email}</TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => handleViewProfile(docente.id)} 
                                                    className="px-2 py-1 text-sm text-whiteBG-50 hover: underline"
                                                    icon={<Eye size={16} className="mr-1" />}
                                                >
                                                    ver perfil
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="ghost"
                                                    onClick={() => handleDelete(docente.id, docente.nombre)}
                                                    className="px-2 py-1 hover:bg-main-900"
                                                    title={`Eliminar a ${docente.nombre}`}
                                                >
                                                    <Trash2 size={20} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </Table.Body>
                            </Table>
                        </>
                    )}
                </Card>
            )}

            {/* RENDERIZADO DEL MODAL DE CREACIÓN */}
            <DocenteFormModal
                isOpen={isNewDocenteModalOpen}
                onClose={() => setIsNewDocenteModalOpen(false)}
                onSave={handleSaveNewDocente}
            />
        </div>
    );
};