import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Input } from '../../components/ui/Input';
import {
    TableContainer,
    TableHeader,
    TableBody,
    Th,
    Td
} from '../../components/ui/Table';
import { getHistorialPagos, getDocumentosSolicitados } from '../../services/alumno.service';
import { useAuth } from '../../hooks/useAuth';
import type { DocumentoPagado, DocumentoSolicitado } from '../../types/models';
import { Download, FileText, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Opciones de documentos (simulado)
const DOCUMENTO_OPTIONS = [
    'Historial Académico',
    'Constancia de Estudios',
    'Certificado de Terminación',
    'Boleta de Calificaciones',
];

/**
 * Página: AlumnoDocumentosPage
 * Descripción: Muestra el historial de pagos de documentos, permite solicitar nuevos documentos
 * y adjuntar comprobantes.
 */
export const AlumnoDocumentosPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Estados de carga y datos
    const [loading, setLoading] = useState(true);
    const [historialPagos, setHistorialPagos] = useState<DocumentoPagado[]>([]);
    const [solicitados, setSolicitados] = useState<DocumentoSolicitado[]>([]);

    // Estados de formularios
    const [documentoSolicitar, setDocumentoSolicitar] = useState(DOCUMENTO_OPTIONS[0]);
    const [cantidadSolicitar, setCantidadSolicitar] = useState(1);
    const [archivoAdjunto, setArchivoAdjunto] = useState<File | null>(null);
    const [documentoAdjuntar, setDocumentoAdjuntar] = useState(DOCUMENTO_OPTIONS[0]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            try {
                const [pagos, docs] = await Promise.all([
                    getHistorialPagos(user.id),
                    getDocumentosSolicitados(user.id)
                ]);
                setHistorialPagos(pagos);
                setSolicitados(docs);
            } catch (error) {
                console.error("Error al cargar datos de documentos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        
        // Si vienes de la página de perfil, te aseguras de que el enlace en 'Mis Pagos' funcione.
        // Esto redirige a la nueva ruta, que debe ser la misma ruta de esta página.
        if (window.location.pathname === '/alumno/perfil') {
             // Esto es solo un placeholder, la navegación real ocurre en AlumnoPerfilPage.tsx
        } 

    }, [user, navigate]);


    // Simulación de acción de descarga
    const handleDownload = (concepto: string) => {
        alert(`Simulando descarga de: ${concepto}`);
    };

    // Simulación de acción de solicitud
    const handleSolicitar = () => {
        console.log(`Solicitando ${cantidadSolicitar} de ${documentoSolicitar}`);
        alert(`¡${documentoSolicitar} solicitado con éxito!`);
        // Lógica real: Llamar al servicio, actualizar lista 'solicitados'
    };

    // Simulación de subida de comprobante
    const handleUploadComprobante = () => {
        if (!archivoAdjunto) {
            alert("Por favor, selecciona un archivo.");
            return;
        }
        console.log(`Subiendo comprobante para ${documentoAdjuntar}: ${archivoAdjunto.name}`);
        alert(`Comprobante para ${documentoAdjuntar} subido con éxito.`);
        setArchivoAdjunto(null);
        // Lógica real: Llamar al servicio de subida, actualizar el estado
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[500px]">
                <LoadingSpinner text="Cargando historial de documentos..." />
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            
            {/* Encabezado */}
            <header className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-8">
                <h1 className="text-4xl font-[Kaushan Script] text-gray-800">
                    Documentos y Pagos
                </h1>
                <UserHeaderIcons /> 
            </header>

            {/* SECCIÓN 1: HISTORIAL GENERAL DE PAGOS */}
            <Card className="shadow-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                    <FileText size={24} className="mr-3 text-blue-600" /> Historial General de Pagos
                </h2>
                <p className="text-sm text-gray-500 mb-4">Visualiza los pagos y documentos que has tramitado.</p>
                
                <TableContainer>
                    <TableHeader>
                        <Th>Fecha</Th>
                        <Th>Concepto</Th>
                        <Th className="text-right">Monto</Th>
                        <Th>Estado</Th>
                        <Th className="text-center">Descargar</Th>
                    </TableHeader>
                    <TableBody>
                        {historialPagos.map((item, index) => (
                            <tr key={index}>
                                <Td>{item.fecha}</Td>
                                <Td>{item.concepto}</Td>
                                <Td className="text-right">{`$${item.monto.toFixed(2)}`}</Td>
                                <Td>
                                    <span className="text-green-600 font-medium">{item.estado}</span>
                                </Td>
                                <Td className="text-center">
                                    <Button variant="secondary" className="bg-gray-700 hover:bg-gray-800 text-white py-1 px-3" onClick={() => handleDownload(item.concepto)}>
                                        <Download size={16} />
                                    </Button>
                                </Td>
                            </tr>
                        ))}
                    </TableBody>
                </TableContainer>
            </Card>

            {/* SECCIÓN 2: SOLICITUD DE DOCUMENTOS */}
            <Card className="shadow-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                    <FileText size={24} className="mr-3 text-blue-600" /> Solicitud de Documentos
                </h2>
                <p className="text-sm text-gray-500 mb-4">Selecciona y solicita los documentos que requieras tramitar.</p>

                {/* Formulario de Solicitud */}
                <div className="flex items-end gap-3 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                        <select 
                            value={documentoSolicitar}
                            onChange={(e) => setDocumentoSolicitar(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            {DOCUMENTO_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-20">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                        <Input 
                            type="number" 
                            min="1" 
                            value={cantidadSolicitar} 
                            onChange={(e) => setCantidadSolicitar(parseInt(e.target.value))} 
                        />
                    </div>
                    <Button variant="primary" onClick={handleSolicitar} className="py-2 px-4 bg-green-600 hover:bg-green-700">
                        Agregar
                    </Button>
                </div>

                {/* Tabla de Documentos Solicitados */}
                <TableContainer>
                    <TableHeader>
                        <Th>Fecha</Th>
                        <Th>Concepto</Th>
                        <Th className="text-right">Pago</Th>
                        <Th className="text-center">Voucher</Th>
                    </TableHeader>
                    <TableBody>
                        {solicitados.map((item, index) => (
                            <tr key={index}>
                                <Td>{item.fecha}</Td>
                                <Td>{item.concepto}</Td>
                                <Td className="text-right">
                                    {item.pago !== '---' ? `$${(item.pago as number).toFixed(2)}` : '---'}
                                </Td>
                                <Td className="text-center">
                                    <Button variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3" onClick={() => handleDownload("Voucher")}>
                                        Descargar
                                    </Button>
                                </Td>
                            </tr>
                        ))}
                    </TableBody>
                </TableContainer>
            </Card>

            {/* SECCIÓN 3: ADJUNTAR COMPROBANTES DE PAGO */}
            <Card className="shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                    <Upload size={24} className="mr-3 text-blue-600" /> Adjuntar Comprobantes de Pago
                </h2>
                <p className="text-sm text-gray-500 mb-4">Visualiza tus documentos que solicitaste que están en trámite y finalizados.</p>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {/* Selector de Documento Pendiente de Pago */}
                    <div className="w-56">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                        <select 
                            value={documentoAdjuntar}
                            onChange={(e) => setDocumentoAdjuntar(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            {DOCUMENTO_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Selector de Archivo */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar archivo</label>
                        <div className="flex items-center border border-gray-300 rounded-md bg-white">
                            <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 text-sm rounded-l-md transition">
                                Seleccionar archivo
                                <input 
                                    type="file" 
                                    hidden 
                                    onChange={(e) => setArchivoAdjunto(e.target.files ? e.target.files[0] : null)}
                                />
                            </label>
                            <span className="ml-3 text-sm text-gray-500 truncate">
                                {archivoAdjunto ? archivoAdjunto.name : 'Ningún archivo seleccionado'}
                            </span>
                        </div>
                    </div>

                    <Button variant="primary" onClick={handleUploadComprobante} disabled={!archivoAdjunto} className="py-2 px-4 bg-blue-600 hover:bg-blue-700">
                        Subir
                    </Button>
                </div>
            </Card>
        </div>
    );
};