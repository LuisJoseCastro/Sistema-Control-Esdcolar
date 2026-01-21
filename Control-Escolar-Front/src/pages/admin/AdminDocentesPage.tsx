import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Trash2, Briefcase, Eye, Home } from 'lucide-react';

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
import { adminService } from '../../services/admin.service'; 

export const AdminDocentesPage: React.FC = () => {
    const { config } = useTenant(); 
    const navigate = useNavigate();

    const [docentes, setDocentes] = useState<any[]>([]);
    const [filteredDocentes, setFilteredDocentes] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    
    const [isNewDocenteModalOpen, setIsNewDocenteModalOpen] = useState(false);

    // 1. Carga de datos con generación de clave automática (Igual que alumnos)
    const fetchDocentes = async () => {
        setLoading(true);
        try {
            const data = await adminService.getTeachers(); 
            
            // ✅ PROCESAMIENTO: Si no hay clave, cortamos el ID (UUID) a 8 caracteres
            // Esto garantiza que NUNCA aparezca vacío o "S/C"
            const dataConClave = data.map((doc: any) => {
                const idBase = doc.id || '';
                const claveAuto = idBase.substring(0, 8).toUpperCase();
                return {
                    ...doc,
                    // Prioridad: claveEmpleado > clave > Recorte de ID
                    displayClave: doc.claveEmpleado || doc.clave || claveAuto || 'S/C'
                };
            });

            setDocentes(dataConClave);
            setFilteredDocentes(dataConClave);
        } catch (error) {
            console.error("Error al cargar docentes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocentes();
    }, [config]);

    // 2. Lógica de búsqueda
    useEffect(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        const results = docentes.filter(docente =>
            docente.nombre?.toLowerCase().includes(lowerCaseSearch) ||
            docente.email?.toLowerCase().includes(lowerCaseSearch) ||
            docente.displayClave?.toLowerCase().includes(lowerCaseSearch)
        );
        setFilteredDocentes(results);
    }, [searchTerm, docentes]);
    
    // --- Handlers ---
    const handleNewDocente = () => {
        setIsNewDocenteModalOpen(true);
    };

    const handleSaveNewDocente = async (data: any) => {
        try {
            await adminService.registrarDocente({
                nombre: data.nombre,
                email: data.email,
                clave: data.clave,
                especialidad: data.especialidad,
                telefono: data.telefono
            });
            await fetchDocentes(); 
            setIsNewDocenteModalOpen(false);
        } catch (error) {
            console.error("Error saving docente:", error);
        }
    };

    const handleViewProfile = (docenteId: string) => {
        navigate(`/admin/docentes/${docenteId}/perfil`); 
    };

    const handleDelete = async (docenteId: string, docenteNombre: string) => {
        if (window.confirm(`¿Está seguro de que desea eliminar al docente ${docenteNombre}?`)) {
            try {
                await adminService.deleteDocente(docenteId);
                setDocentes(prev => prev.filter(d => d.id !== docenteId));
            } catch (error) {
                console.error("Error deleting docente:", error);
            }
        }
    };

    return (
        <div className="p-8 bg-whiteBg-50 min-h-full font-sans">
            <header className="flex justify-between items-center border-b border-grayDark-500 pb-2 mb-8">
                <div className="flex items-center gap-6">
                    <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
                        Docentes
                    </h1>
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/admin/dashboard')} 
                        className="flex items-center gap-2 text-main-800 hover:bg-gray-100"
                        icon={<Home size={24} />}
                    >
                        Dashboard
                    </Button>
                </div>
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
                        placeholder="Buscar por nombre, email o clave..."
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
                                        <TableCell className="font-mono text-gray-600 font-bold">
                                            {/* ✅ Usamos displayClave (8 dígitos del ID) */}
                                            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100">
                                                {docente.displayClave}
                                            </span>
                                        </TableCell> 
                                        <TableCell className="font-medium text-gray-800">{docente.nombre}</TableCell>
                                        <TableCell>{docente.email}</TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="ghost" 
                                                onClick={() => handleViewProfile(docente.id)} 
                                                className="px-2 py-1 text-sm text-blue-600 hover:underline"
                                                icon={<Eye size={16} className="mr-1" />}
                                            >
                                                ver perfil
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="ghost"
                                                onClick={() => handleDelete(docente.id, docente.nombre)}
                                                className="px-2 py-1 hover:bg-red-50 text-red-500"
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