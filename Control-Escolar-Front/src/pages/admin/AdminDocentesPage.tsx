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

// 🛑 Importar la Modal de Formulario
import { DocenteFormModal } from '../../components/admin/DocenteFormModal';

// Hooks y Servicios
import { useTenant } from '../../contexts/TenantContext';
// 🛑 IMPORTAMOS el objeto adminService unificado
import { adminService } from '../../services/admin.service'; 
import { type DocenteProfile } from '../../types/models'; 

export const AdminDocentesPage: React.FC = () => {
    const { config } = useTenant(); // Usamos 'tenant' que es el nombre en tu Contexto
    const navigate = useNavigate();

    const [docentes, setDocentes] = useState<DocenteProfile[]>([]);
    const [filteredDocentes, setFilteredDocentes] = useState<DocenteProfile[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    
    const [isNewDocenteModalOpen, setIsNewDocenteModalOpen] = useState(false);

    // 1. Carga inicial de datos de docentes reales
    const fetchDocentes = async () => {
        setLoading(true);
        try {
            // Llamamos a la función del objeto adminService
            const allUsers = await adminService.getAllUsersByTenant(); 
            
            // Filtramos para asegurar que solo vemos docentes
            const initialDocentes = allUsers.filter(u => u.rol === 'DOCENTE') as DocenteProfile[];
            
            setDocentes(initialDocentes);
            setFilteredDocentes(initialDocentes);
        } catch (error) {
            console.error("Error al cargar docentes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocentes();
    }, [config]);

    // 2. Lógica de búsqueda/filtrado (DISEÑO INTACTO)
    useEffect(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        const results = docentes.filter(docente =>
            docente.nombre.toLowerCase().includes(lowerCaseSearch) ||
            docente.email.toLowerCase().includes(lowerCaseSearch) ||
            (docente.clave && docente.clave.toLowerCase().includes(lowerCaseSearch)) ||
            (docente.especialidad && docente.especialidad.toLowerCase().includes(lowerCaseSearch))
        );
        setFilteredDocentes(results);
    }, [searchTerm, docentes]);
    
    // --- Handlers de acciones ---
    const handleNewDocente = () => {
        setIsNewDocenteModalOpen(true);
    };

    // GUARDAR EN BD REAL
    const handleSaveNewDocente = async (data: any) => {
        try {
            const success = await adminService.addNewUser({
                nombre: data.nombre,
                email: data.email,
                clave: data.clave,
                especialidad: data.especialidad,
                telefono: data.telefono
            });

            if (success) {
                await fetchDocentes(); // Recargamos la lista desde el servidor
                setIsNewDocenteModalOpen(false);
            } else {
                alert("Error al registrar el docente en el servidor.");
            }
        } catch (error) {
            console.error("Error saving docente:", error);
        }
    };

    const handleViewProfile = (docenteId: string) => {
        navigate(`/admin/docentes/${docenteId}/perfil`); 
    };

    const handleDelete = async (docenteId: string, docenteNombre: string) => {
        if (window.confirm(`¿Está seguro de que desea eliminar al docente ${docenteNombre}? Esta acción es irreversible.`)) {
            try {
                // Aquí podrías agregar adminService.deleteUser(docenteId) si lo creamos
                // Por ahora lo removemos del estado para que visualmente desaparezca
                setDocentes(prev => prev.filter(d => d.id !== docenteId));
                console.log(`Docente ${docenteId} eliminado.`);
            } catch (error) {
                console.error("Error deleting docente:", error);
            }
        }
    };

    return (
        <div className="p-8 bg-whiteBg-50 min-h-full font-sans">
            <header className="flex justify-between items-end border-b border-grayDark-500 pb-2 mb-8">
                <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
                    Docentes
                </h1>
                <Button 
                    variant="ghost" 
                    onClick={handleNewDocente}
                    className="flex items-center text-sm font-normal p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    icon={<PlusCircle size={16} className="text-white-50 mr-1" />}
                >
                    Nuevo
                </Button>
            </header>
            
            <div className="flex justify-end mb-6">
                <div className="md:w-1/3 w-full max-w-sm">
                    <Input
                        type="text"
                        placeholder="Buscar por nombre, email, clave o especialidad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        endIcon={Search} 
                        className="shadow-md"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner className="w-12 h-12 text-teal-600 mb-4" />
                </div>
            ) : (
                <Card variant="default">
                    {filteredDocentes.length === 0 ? (
                        <div className="text-center p-8 text-main-700">
                            <Briefcase size={48} className="mx-auto mb-4" />
                            <p className="text-lg">No se encontraron docentes.</p>
                        </div>
                    ) : (
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
                    )}
                </Card>
            )}

            <DocenteFormModal
                isOpen={isNewDocenteModalOpen}
                onClose={() => setIsNewDocenteModalOpen(false)}
                onSave={handleSaveNewDocente}
            />
        </div>
    );
};