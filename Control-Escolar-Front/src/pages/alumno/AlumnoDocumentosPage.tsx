// src/pages/alumno/AlumnoDocumentosPage.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
// Importamos la nueva función del servicio
import { getHistorialPagos, getDocumentosSolicitados, getCatalogoDocumentos } from '../../services/alumno.service';
import type { DocumentoPagado, DocumentoSolicitado } from '../../types/models';

// 🛑 IMPORTACIONES DE UI UNIFICADA
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';
import { Card } from '../../components/ui/Card';        // Nombrada (Solo para filas internas)
import Input from '../../components/ui/Input';          // Por defecto
import Select from '../../components/ui/Select';        // Por defecto
import Button from '../../components/ui/Button';        // Por defecto
import Badge from '../../components/ui/Badge';          // Por defecto

import { Download, Upload, Plus } from 'lucide-react';

export const AlumnoDocumentosPage: React.FC = () => {
    const { user } = useAuth();
    
    const [loading, setLoading] = useState(true);
    const [historialPagos, setHistorialPagos] = useState<DocumentoPagado[]>([]);
    const [solicitados, setSolicitados] = useState<DocumentoSolicitado[]>([]);
    
    // Nuevo estado para el catálogo dinámico (Ahora tipado para Select)
    const [opcionesDocumentos, setOpcionesDocumentos] = useState<{ value: string; label: string; }[]>([]);

    // Estados del formulario
    const [documentoSolicitar, setDocumentoSolicitar] = useState('');
    const [cantidadSolicitar, setCantidadSolicitar] = useState(1);
    const [archivoAdjunto, setArchivoAdjunto] = useState<File | null>(null);
    const [documentoAdjuntar, setDocumentoAdjuntar] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            try {
                const [pagos, docs, catalogo] = await Promise.all([
                    getHistorialPagos(user.id),
                    getDocumentosSolicitados(user.id),
                    getCatalogoDocumentos()
                ]);

                setHistorialPagos(pagos);
                setSolicitados(docs);
                // Mapear a formato Select
                setOpcionesDocumentos(catalogo.map(d => ({ value: d, label: d })));
                
                if (catalogo.length > 0) {
                    setDocumentoSolicitar(catalogo[0]);
                    setDocumentoAdjuntar(catalogo[0]);
                }

            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleDownload = (concepto: string) => alert(`Descargando: ${concepto}`);
    const handleSolicitar = () => {
        if (!documentoSolicitar || cantidadSolicitar < 1) return alert("Selecciona documento y cantidad.");
        alert(`¡${documentoSolicitar} (x${cantidadSolicitar}) solicitado con éxito!`);
    };
    const handleUploadComprobante = () => {
        if (!archivoAdjunto) return alert("Por favor, selecciona un archivo.");
        alert(`Comprobante para ${documentoAdjuntar} subido con éxito.`);
        setArchivoAdjunto(null);
    };

    if (loading) return <div className="flex justify-center h-screen items-center bg-white"><LoadingSpinner text="Cargando trámites..." /></div>;

    // 🛑 CLASE DE ESTILO GRIS ORIGINAL (Sin el componente Card)
    const cardStyle = "bg-gray-200 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8 md:p-10";

    // Componente para las filas internas que deben ser blancas (usamos Card)
    const InnerRow: React.FC<{ children: React.ReactNode, key: number }> = ({ children, key }) => (
        <Card 
            key={key} 
            variant="flat" 
            // Forzamos el fondo blanco y border/shadow ligero para la fila
            className="rounded-xl px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-sm mb-3 text-sm text-gray-600 gap-4 bg-white border border-gray-200"
        >
            {children}
        </Card>
    );

    return (
        <div className="p-8 bg-white min-h-full font-sans">
            
            {/* ENCABEZADO sin cambios */}
            <header className="flex justify-between items-end border-b-2 border-gray-400 pb-2 mb-10">
                <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
                    Documentos y Pagos
                </h1>
                <div className="mb-2">
                    <UserHeaderIcons />
                </div>
            </header>

            <div className="flex flex-col gap-10 max-w-7xl mx-auto">

                {/* 1. HISTORIAL GENERAL DE PAGOS */}
                {/* 🛑 DE VUELTA A DIV NATIVO con la clase de estilo GRIS */}
                <div className={cardStyle}>
                    <div className="mb-6 ml-2">
                        <h2 className="text-2xl font-bold text-gray-800">Historial General de Pagos</h2>
                        <p className="text-gray-500 text-sm">Visualiza los pagos de documentos que has tramitado</p>
                    </div>

                    <div className="hidden md:grid grid-cols-5 px-6 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-1">Fecha</div>
                        <div className="col-span-2">Concepto</div>
                        <div className="text-right pr-8">Monto</div>
                        <div className="text-center">Estado</div>
                        <div className="text-center">Acción</div>
                    </div>

                    <div>
                        {historialPagos.map((item, i) => (
                            <InnerRow key={i}>
                                <div className="w-full md:w-1/5 font-medium">{item.fecha}</div>
                                <div className="w-full md:w-2/5 font-bold text-gray-800">{item.concepto}</div>
                                <div className="w-full md:w-1/5 text-left md:text-right font-mono text-gray-700 font-bold">
                                    ${item.monto.toFixed(2)}
                                </div>
                                <div className="w-full md:w-1/5 flex justify-center">
                                    <Badge variant="success">
                                        {item.estado}
                                    </Badge>
                                </div>
                                <div className="w-full md:w-1/5 flex justify-center">
                                    <Button 
                                        onClick={() => handleDownload(item.concepto)}
                                        variant="ghost"
                                        className="text-gray-500 hover:text-black font-bold text-xs p-1"
                                        icon={<Download size={16}/>}
                                    >
                                        Descargar
                                    </Button>
                                </div>
                            </InnerRow>
                        ))}
                    </div>
                </div>


                {/* 2. SOLICITUD DE DOCUMENTOS */}
                {/* 🛑 DE VUELTA A DIV NATIVO con la clase de estilo GRIS */}
                <div className={cardStyle}>
                    <div className="mb-8 ml-2">
                        <h2 className="text-2xl font-bold text-gray-800">Solicitud de Documentos</h2>
                        <p className="text-gray-500 text-sm">Selecciona y adjunta los documentos que requieras tramitar</p>
                    </div>

                    {/* Formulario */}
                    <div className="flex flex-col md:flex-row items-end gap-6 mb-10 px-2">
                        <div className="flex-1 w-full space-y-2">
                            <label className="block text-sm font-bold text-gray-500 ml-1">Selecciona..</label>
                            <Select
                                value={documentoSolicitar}
                                onChange={(e) => setDocumentoSolicitar(e.target.value)}
                                options={opcionesDocumentos}
                                selectClassName="bg-white border-gray-300"
                            />
                        </div>

                        <div className="w-full md:w-32 space-y-2">
                            <label className="block text-sm font-bold text-gray-500 ml-1">Cantidad</label>
                            <Input 
                                type="number" 
                                min="1"
                                value={cantidadSolicitar}
                                onChange={(e) => setCantidadSolicitar(parseInt(e.target.value))}
                                className="w-full text-center font-bold bg-white"
                            />
                        </div>

                        <Button 
                            onClick={handleSolicitar}
                            variant="primary"
                            icon={<Plus size={20} />}
                            className="h-[50px] min-w-[140px] w-full md:w-auto mt-6"
                        >
                            Agregar
                        </Button>
                    </div>

                    {/* Tabla de Pendientes */}
                    <div>
                        {solicitados.map((item, i) => (
                            <InnerRow key={i}>
                                <div className="w-full md:w-1/4 font-medium text-gray-500">{item.fecha}</div>
                                <div className="w-full md:w-1/4 font-bold text-gray-800">{item.concepto}</div>
                                <div className="w-full md:w-1/4 text-left md:text-right font-mono text-gray-700 font-bold">
                                    {item.pago !== '---' ? `$${(item.pago as number).toFixed(2)}` : '---'}
                                </div>
                                <div className="w-full md:w-1/4 flex justify-center">
                                    <Button 
                                        onClick={() => handleDownload("Voucher")}
                                        variant="ghost"
                                        className="text-gray-500 hover:text-black font-bold text-xs p-1"
                                        icon={<Download size={16}/>}
                                    >
                                        Voucher
                                    </Button>
                                </div>
                            </InnerRow>
                        ))}
                    </div>
                </div>


                {/* 3. ADJUNTAR COMPROBANTES */}
                {/* 🛑 DE VUELTA A DIV NATIVO con la clase de estilo GRIS */}
                <div className={cardStyle}>
                    <div className="mb-6 ml-2">
                        <h2 className="text-2xl font-bold text-gray-800">Adjuntar Comprobantes de Pago</h2>
                        <p className="text-gray-500 text-sm">Visualiza si tus documentos que solicitaste estan en tramite o finalizados</p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-4 bg-transparent mt-8">
                        
                        {/* 1. Selector */}
                        <div className="flex-1 w-full space-y-2">
                            <label className="block text-sm font-bold text-gray-500 ml-1">Selecciona..</label>
                            <Select
                                value={documentoAdjuntar}
                                onChange={(e) => setDocumentoAdjuntar(e.target.value)}
                                options={opcionesDocumentos}
                                selectClassName="bg-white border-gray-300"
                            />
                        </div>

                        {/* 2. Botón Archivo (Usamos Label con Button estilo manual) */}
                        <label className="flex-1 w-full bg-white rounded-xl px-6 py-4 flex items-center justify-center gap-3 cursor-pointer h-[50px] hover:bg-gray-100 transition-colors relative mt-6 border border-gray-300">
                            <input 
                                type="file" 
                                className="hidden"
                                onChange={(e) => setArchivoAdjunto(e.target.files ? e.target.files[0] : null)}
                            />
                            <Upload size={20} className="text-gray-600"/>
                            <span className="font-bold text-gray-600 truncate">
                                {archivoAdjunto ? archivoAdjunto.name : 'Seleccionar documento'}
                            </span>
                        </label>

                        {/* 3. Botón Subir */}
                        <Button 
                            onClick={handleUploadComprobante}
                            disabled={!archivoAdjunto}
                            variant="primary"
                            icon={<Upload size={20} />}
                            className="bg-[#344054] hover:bg-[#232b38] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold h-[50px] w-full lg:w-auto mt-6"
                        >
                            Subir
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};