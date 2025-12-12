// src/pages/admin/AdminDocentesPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Trash2, Briefcase, Eye } from 'lucide-react';

// Importación de Componentes UI
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table, { TableHead, TableCell, TableRow } from '../../components/ui/Table';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// Hooks y Servicios
import { useTenant } from '../../contexts/TenantContext';
import { getAllUsersByTenant } from '../../services/admin.service'; 
// 🛑 Usaremos el tipo User que incluye las propiedades base.
import { type User } from '../../types/models'; 

// Constante para definir cuántos elementos mostramos por página
const ITEMS_PER_PAGE = 10; 

/**
 * Filtra los usuarios para mostrar solo los de rol 'DOCENTE'.
 */
const filterDocentes = (users: User[]): User[] => {
    return users.filter(user => user.rol === 'DOCENTE');
}

export const AdminDocentesPage: React.FC = () => {
    const { config } = useTenant();
    const navigate = useNavigate();

    const [docentes, setDocentes] = useState<User[]>([]);
    const [filteredDocentes, setFilteredDocentes] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Estados para Paginación
    const [currentPage, setCurrentPage] = useState(1);

    // 1. Carga inicial de datos de docentes
    useEffect(() => {
        const fetchDocentes = async () => {
            if (!config) return;

            setLoading(true);
            try {
                // El servicio devuelve User[], pero el mock incluye 'clave'.
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
            // 🛑 Accedemos a 'clave' con 'as any' solo aquí para mantener limpio el estado 'docentes'
            ((docente as any).clave || '').toLowerCase().includes(lowerCaseSearch) 
        );
        
        setFilteredDocentes(results);
        setCurrentPage(1); // Resetear a la primera página al buscar
    }, [searchTerm, docentes]);
    
    // --- Lógica de Paginación ---
    const totalPages = useMemo(() => {
        return Math.ceil(filteredDocentes.length / ITEMS_PER_PAGE);
    }, [filteredDocentes.length]);

    const currentDocentes = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredDocentes.slice(startIndex, endIndex);
    }, [filteredDocentes, currentPage]);
    
    const goToPage = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    // --- Handlers de acciones ---
    const handleNewDocente = () => {
        console.log('Navegar a creación de nuevo Docente');
    };

    // 🛑 Modificación de navegación para ir al perfil
    const handleViewProfile = (docenteId: string) => {
        navigate(`/admin/docentes/${docenteId}/perfil`); 
    };

    const handleDelete = (docenteId: string) => {
        console.log('Eliminar docente:', docenteId);
    };


    // --- Renderizado Principal ---
    return (
        <div className="p-8 bg-white min-h-full font-sans">
            
            {/* TÍTULO Y BOTÓN DE NUEVO */}
            <header className="flex justify-between items-end border-b border-gray-400 pb-2 mb-8">
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
                    icon={<PlusCircle size={16} className="text-gray-600 mr-1" />}
                >
                    + Nuevo
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
                        <div className="text-center p-8 text-gray-500">
                            <Briefcase size={48} className="mx-auto mb-4" />
                            <p className="text-lg">No hay docentes registrados.</p>
                        </div>
                    ) : filteredDocentes.length === 0 && searchTerm !== '' ? (
                         <div className="text-center p-8 text-gray-500">
                            <p className="text-lg">No se encontraron docentes con el término: **{searchTerm}**.</p>
                        </div>
                    ) : (
                        <>
                            {/* TABLA DE DOCENTES */}
                            <Table>
                                <Table.Header>
                                    <TableRow>
                                        <TableHead>clave</TableHead>
                                        <TableHead>Nombre Completo</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>perfil</TableHead>
                                        <TableHead className="text-right">Accion</TableHead>
                                    </TableRow>
                                </Table.Header>
                                
                                <Table.Body>
                                    {currentDocentes.map((docente) => (
                                        <TableRow key={docente.id}>
                                            <TableCell className="font-mono text-gray-600">
                                                {/* Mostrar la clave simulada. Es seguro porque el mock la incluye. */}
                                                {(docente as any).clave || docente.id} 
                                            </TableCell> 
                                            <TableCell className="font-medium text-gray-800">{docente.nombre}</TableCell>
                                            <TableCell>{docente.email}</TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => handleViewProfile(docente.id)} 
                                                    className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800 underline"
                                                    icon={<Eye size={16} className="mr-1" />}
                                                >
                                                    ver perfil
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="ghost"
                                                    onClick={() => handleDelete(docente.id)}
                                                    className="px-2 py-1 text-red-600 hover:bg-red-50/50"
                                                    title="Eliminar Docente"
                                                >
                                                    <Trash2 size={20} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </Table.Body>
                            </Table>
                            
                            {/* CONTROLES DE PAGINACIÓN */}
                            <div className="flex justify-between items-center pt-4 border-t mt-4">
                                <span className="text-sm text-gray-600">
                                    Mostrando {currentDocentes.length} de {filteredDocentes.length} docentes.
                                </span>
                                <div className="flex space-x-2">
                                    <Button 
                                        variant="secondary" 
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Anterior
                                    </Button>
                                    <span className="flex items-center text-sm font-semibold">
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <Button 
                                        variant="secondary" 
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Card>
            )}
        </div>
    );
};