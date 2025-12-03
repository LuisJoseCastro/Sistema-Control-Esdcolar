import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getHistorialPagos, getDocumentosSolicitados } from '../../services/alumno.service';
import type { DocumentoPagado, DocumentoSolicitado } from '../../types/models';

// UI & Iconos
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';
import { Download, FileText, Upload, Plus, X, CheckCircle, ChevronDown } from 'lucide-react';

// Opciones de documentos
const DOCUMENTO_OPTIONS = [
    'Historial Académico',
    'Constancia de Estudios',
    'Certificado de Terminación',
    'Boleta de Calificaciones',
];

export const AlumnoDocumentosPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // --- ESTADOS Y LÓGICA (Tu código original intacto) ---
    const [loading, setLoading] = useState(true);
    const [historialPagos, setHistorialPagos] = useState<DocumentoPagado[]>([]);
    const [solicitados, setSolicitados] = useState<DocumentoSolicitado[]>([]);

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
                console.error("Error al cargar datos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleDownload = (concepto: string) => alert(`Descargando: ${concepto}`);
    const handleSolicitar = () => alert(`¡${documentoSolicitar} (x${cantidadSolicitar}) solicitado con éxito!`);
    const handleUploadComprobante = () => {
        if (!archivoAdjunto) return alert("Por favor, selecciona un archivo.");
        alert(`Comprobante para ${documentoAdjuntar} subido con éxito.`);
        setArchivoAdjunto(null);
    };

    if (loading) return <div className="flex justify-center mt-20"><LoadingSpinner /></div>;

    // --- ESTILOS VISUALES (Diseño idéntico a tu imagen) ---
    const cardStyle = "bg-[#f4f6f8] rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8 md:p-10";
    const rowStyle = "bg-white rounded-xl px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-sm mb-3 text-sm text-gray-600 gap-4";

    return (
        <div className="p-8 bg-white min-h-full font-sans">
            
            {/* ENCABEZADO (Estilo Cursiva) */}
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
                <div className={cardStyle}>
                    <div className="mb-6 ml-2">
                        <h2 className="text-2xl font-bold text-gray-800">Historial General de Pagos</h2>
                        <p className="text-gray-500 text-sm">Visualiza los pagos de documentos que has tramitado</p>
                    </div>

                    {/* Encabezados (Grid manual para alinear con las filas) */}
                    <div className="hidden md:grid grid-cols-5 px-6 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-1">Fecha</div>
                        <div className="col-span-2">Concepto</div>
                        <div className="text-right pr-8">Monto</div>
                        <div className="text-center">Estado</div>
                        <div className="text-center">Acción</div>
                    </div>

                    {/* Filas (Cápsulas) */}
                    <div>
                        {historialPagos.map((item, i) => (
                            <div key={i} className={rowStyle}>
                                <div className="w-full md:w-1/5 font-medium">{item.fecha}</div>
                                <div className="w-full md:w-2/5 font-bold text-gray-800">{item.concepto}</div>
                                <div className="w-full md:w-1/5 text-left md:text-right font-mono text-gray-700 font-bold">
                                    ${item.monto.toFixed(2)}
                                </div>
                                <div className="w-full md:w-1/5 flex justify-center">
                                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                        {item.estado}
                                    </span>
                                </div>
                                <div className="w-full md:w-1/5 flex justify-center">
                                    <button 
                                        onClick={() => handleDownload(item.concepto)}
                                        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-bold text-xs"
                                    >
                                        <Download size={16}/> Descargar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* 2. SOLICITUD DE DOCUMENTOS */}
                <div className={cardStyle}>
                    <div className="mb-8 ml-2">
                        <h2 className="text-2xl font-bold text-gray-800">Solicitud de Documentos</h2>
                        <p className="text-gray-500 text-sm">Selecciona y adjunta los documentos que requieras tramitar</p>
                    </div>

                    {/* Formulario */}
                    <div className="flex flex-col md:flex-row items-end gap-6 mb-10 px-2">
                        <div className="flex-1 w-full space-y-2">
                            <label className="text-sm font-bold text-gray-500 ml-1">Selecciona..</label>
                            <div className="relative">
                                <select 
                                    value={documentoSolicitar}
                                    onChange={(e) => setDocumentoSolicitar(e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
                                >
                                    {DOCUMENTO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={20} />
                            </div>
                        </div>

                        <div className="w-full md:w-32 space-y-2">
                             <div className="bg-[#e2e8f0] rounded-lg flex items-center px-3 py-1 h-[50px] relative mt-7">
                                <input 
                                    type="number" 
                                    min="1"
                                    value={cantidadSolicitar}
                                    onChange={(e) => setCantidadSolicitar(parseInt(e.target.value))}
                                    className="bg-transparent w-full text-center font-bold text-gray-700 outline-none text-lg"
                                />
                                <X size={16} className="text-gray-500 absolute right-3 cursor-pointer hover:text-red-500"/>
                            </div>
                        </div>

                        <button 
                            onClick={handleSolicitar}
                            className="bg-[#344054] hover:bg-[#232b38] text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform active:scale-95 h-[50px] min-w-[140px] w-full md:w-auto"
                        >
                            Agregar
                        </button>
                    </div>

                    {/* Tabla de Pendientes */}
                    <div>
                        {/* Filas */}
                        {solicitados.map((item, i) => (
                            <div key={i} className={rowStyle}>
                                <div className="w-full md:w-1/4 font-medium text-gray-500">{item.fecha}</div>
                                <div className="w-full md:w-1/4 font-bold text-gray-800">{item.concepto}</div>
                                <div className="w-full md:w-1/4 text-left md:text-right font-mono text-gray-700 font-bold">
                                    {item.pago !== '---' ? `$${(item.pago as number).toFixed(2)}` : '---'}
                                </div>
                                <div className="w-full md:w-1/4 flex justify-center">
                                    <button 
                                        onClick={() => handleDownload("Voucher")}
                                        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-bold text-xs uppercase"
                                    >
                                        <Download size={16}/> Descargar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* 3. ADJUNTAR COMPROBANTES */}
                <div className={cardStyle}>
                    <div className="mb-6 ml-2">
                        <h2 className="text-2xl font-bold text-gray-800">Adjuntar Comprobantes de Pago</h2>
                        <p className="text-gray-500 text-sm">Visualiza si tus documentos que solicitaste estan en tramite o finalizados</p>
                    </div>

                    {/* Barra de Subida Horizontal (Idéntica a la imagen) */}
                    <div className="flex flex-col lg:flex-row items-center gap-4 bg-transparent mt-8">
                        
                        {/* 1. Selector (Gris) */}
                        <div className="flex-1 w-full relative">
                            <div className="bg-[#e2e8f0] rounded-xl px-6 py-4 flex items-center justify-between cursor-pointer h-[60px]">
                                <span className="font-bold text-gray-700 truncate mr-2">{documentoAdjuntar}</span>
                                <ChevronDown className="text-gray-500" size={20} />
                            </div>
                            <select 
                                value={documentoAdjuntar}
                                onChange={(e) => setDocumentoAdjuntar(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            >
                                {DOCUMENTO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        {/* 2. Botón Archivo (Gris) */}
                        <label className="flex-1 w-full bg-[#e2e8f0] rounded-xl px-6 py-4 flex items-center justify-center gap-3 cursor-pointer h-[60px] hover:bg-[#d1dbe6] transition-colors relative">
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

                        {/* 3. Botón Subir (Oscuro) */}
                        <button 
                            onClick={handleUploadComprobante}
                            disabled={!archivoAdjunto}
                            className="bg-[#344054] hover:bg-[#232b38] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-12 rounded-xl shadow-md h-[60px] w-full lg:w-auto"
                        >
                            Subir
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};