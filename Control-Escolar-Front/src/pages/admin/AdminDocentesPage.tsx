// src/pages/admin/AdminDocentesPage.tsx 
// (Asegúrate de que esta sea la ubicación correcta, o ajusta las rutas de importación)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Trash2, Edit, Briefcase, Eye } from 'lucide-react'; // Añadí Eye

// 🛑 Importación de Componentes UI (Ruta ajustada asumiendo que AdminDocentesPage está directamente en src/pages/admin/)
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table, { TableHead, TableCell, TableRow } from '../../components/ui/Table';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// Hooks y Servicios (Ruta ajustada)
import { useTenant } from '../../contexts/TenantContext';
import { getAllUsersByTenant } from '../../services/admin.service'; 
import { type User } from '../../types/models'; 

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

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredDocentes(docentes);
            return;
        }

        const lowerCaseSearch = searchTerm.toLowerCase();
        const results = docentes.filter(docente =>
            docente.nombre.toLowerCase().includes(lowerCaseSearch) ||
            docente.email.toLowerCase().includes(lowerCaseSearch)
        );
        setFilteredDocentes(results);
    }, [searchTerm, docentes]);
    
    // --- Handlers de acciones (Mock) ---
    const handleNewDocente = () => {
        console.log('Navegar a creación de nuevo Docente');
    };

    const handleViewProfile = (docenteId: string) => {
        console.log('Ver perfil del docente:', docenteId);
    };

    const handleDelete = (docenteId: string) => {
        console.log('Eliminar docente:', docenteId);
    };


    // --- Renderizado Principal ---
    return (
        <div className="p-8 bg-white min-h-full font-sans"> {/* Fondo blanco y padding externo */}
            
            {/* 🛑 HEADER DE DISEÑO: Título con tipografía y línea de separación */}
            <header className="flex justify-between items-end border-b border-gray-400 pb-2 mb-8">
                <h1 
                    className="text-5xl text-black" 
                    style={{ fontFamily: '"Kaushan Script", cursive' }} // 🛑 Aplicamos la fuente
                >
                    Docentes
                </h1>
                
                {/* 🛑 BOTÓN NUEVO: Ubicado arriba a la derecha del header, usando un estilo más "ghost" */}
                <Button 
                    variant="ghost" // Usamos ghost para un diseño más limpio
                    onClick={handleNewDocente}
                    className="flex items-center text-sm font-normal p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    icon={<PlusCircle size={16} className="text-gray-600 mr-1" />}
                >
                    + Nuevo
                </Button>
            </header>
            
            {/* Controles: Búsqueda (ajustado para estar solo) */}
            <div className="flex justify-end mb-6">
                <div className="md:w-1/3 w-full max-w-sm">
                    <Input
                        type="text"
                        placeholder="Buscar" // 🛑 Placeholder simplificado a "Buscar"
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
                    ) : (
                        // TABLA DE DOCENTES
                        <Table>
                            <Table.Header>
                                <TableRow>
                                    {/* 🛑 Nombres de columnas ajustados a la imagen */}
                                    <TableHead>clave</TableHead>
                                    <TableHead>Nombre Completo</TableHead>
                                    <TableHead>Email</TableHead> {/* Email es más descriptivo que usuario */}
                                    <TableHead>perfil</TableHead>
                                    <TableHead className="text-right">Accion</TableHead>
                                </TableRow>
                            </Table.Header>
                            
                            <Table.Body>
                                {filteredDocentes.map((docente) => (
                                    <TableRow key={docente.id}>
                                        <TableCell className="font-mono text-gray-600">---</TableCell> {/* Placeholder para la clave */}
                                        <TableCell className="font-medium text-gray-800">{docente.nombre}</TableCell>
                                        <TableCell>{docente.email}</TableCell>
                                        <TableCell>
                                             {/* 🛑 Botón con diseño de enlace como en la imagen */}
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
                                            {/* 🛑 Ícono de Basura */}
                                            <Button 
                                                variant="ghost" // Cambiado a ghost para minimalismo
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
                    )}
                </Card>
            )}
        </div>
    );
};