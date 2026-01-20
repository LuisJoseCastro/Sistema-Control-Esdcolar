import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Send, Mail, UserCheck, Clock, User as UserIcon, Search, Users } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import api from '../../services/api'; 

// =================================================================================
// COMPONENTE: FORMULARIO DE COMPOSICIÓN (DISEÑO ORIGINAL)
// =================================================================================

interface MensajeFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const ComposicionMensajeForm: React.FC<MensajeFormProps> = ({ onClose, onSuccess }) => {
    const [asunto, setAsunto] = useState('');
    const [cuerpo, setCuerpo] = useState('');
    const [tipoDestinatario, setTipoDestinatario] = useState(''); 
    const [targetId, setTargetId] = useState(''); 
    const [busqueda, setBusqueda] = useState('');
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<any[]>([]);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [grupos, setGrupos] = useState<any[]>([]);
    const [enviando, setEnviando] = useState(false);

    const destinatariosOpciones = [
        { label: 'Seleccionar Destinatario', value: '' },
        { label: 'Todos los Docentes', value: 'docentes' },
        { label: 'Todos los Alumnos', value: 'alumnos' },
        { label: 'Grupo específico', value: 'grupo' },
        { label: 'Usuario específico (Docente/Alumno)', value: 'usuario' },
    ];

    useEffect(() => {
        if (tipoDestinatario === 'grupo') {
            adminService.getGrupos().then(setGrupos).catch(console.error);
        }
    }, [tipoDestinatario]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (tipoDestinatario === 'usuario' && busqueda.length > 1 && !targetId) {
                api.get(`/admin/usuarios/buscar?q=${busqueda}`)
                    .then(res => {
                        setUsuariosFiltrados(res.data);
                        setMostrarSugerencias(true);
                    })
                    .catch(console.error);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [busqueda, tipoDestinatario, targetId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tipoDestinatario) return;
        setEnviando(true);
        try {
            await adminService.enviarMensaje({ 
                tipo: tipoDestinatario, 
                targetId: (tipoDestinatario === 'grupo' || tipoDestinatario === 'usuario') ? targetId : undefined,
                asunto, 
                cuerpo 
            });
            alert('Mensaje enviado con éxito');
            onSuccess();
            onClose();
        } catch (error) {
            alert('Error al enviar comunicado');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-2xl font-serif italic mb-6">Redactar Comunicado</h2>
            
            <div className="grid grid-cols-1 gap-6 mb-6">
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium w-24 text-gray-700 shrink-0">Enviar a:</label>
                    <select
                        value={tipoDestinatario}
                        onChange={(e) => {
                            setTipoDestinatario(e.target.value);
                            setTargetId('');
                            setBusqueda('');
                        }}
                        className="w-full border rounded-lg px-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none border-gray-300"
                    >
                         {destinatariosOpciones.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                {tipoDestinatario === 'usuario' && (
                    <div className="relative flex flex-col space-y-1">
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium w-24 text-gray-700 shrink-0">Buscar:</label>
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Nombre del alumno o docente..."
                                    value={busqueda}
                                    onChange={(e) => { setBusqueda(e.target.value); setTargetId(''); }}
                                    className="w-full border border-blue-300 rounded-lg pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        {mostrarSugerencias && usuariosFiltrados.length > 0 && (
                            <div className="ml-28 absolute top-10 left-0 right-0 z-50 border rounded-md shadow-2xl bg-white max-h-56 overflow-y-auto border-gray-200">
                                {usuariosFiltrados.map(u => (
                                    <div 
                                        key={u.id} 
                                        onClick={() => { setTargetId(u.id); setBusqueda(u.fullName); setMostrarSugerencias(false); }}
                                        className="p-3 hover:bg-blue-50 cursor-pointer text-sm border-b flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="font-bold text-gray-800">{u.fullName}</p>
                                            <p className="text-xs text-gray-500">{u.email}</p>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${
                                            u.rol === 'ALUMNO' ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-purple-100 text-purple-600 border-purple-200'
                                        } border`}>
                                            {u.rol}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* ✅ AQUÍ USAMOS USERCHECK PARA QUITAR LA ADVERTENCIA */}
                        {targetId && (
                            <p className="ml-28 text-[11px] text-green-600 font-bold flex items-center gap-1">
                                <UserCheck size={14} /> Destinatario seleccionado
                            </p>
                        )}
                    </div>
                )}

                {tipoDestinatario === 'grupo' && (
                    <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium w-24 text-gray-700 shrink-0">Grupo:</label>
                        <select
                            value={targetId}
                            onChange={(e) => setTargetId(e.target.value)}
                            className="w-full border border-blue-300 rounded-lg px-3 py-2 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione el grupo destino...</option>
                            {grupos.map(g => (
                                <option key={g.id} value={g.id}>{g.nombre}</option>
                            ))}
                        </select>
                    </div>
                )}
                
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium w-24 text-gray-700 shrink-0">Asunto:</label>
                    <Input
                        type="text"
                        value={asunto}
                        onChange={(e) => setAsunto(e.target.value)}
                        placeholder="Asunto breve"
                        required
                    />
                </div>
            </div>

            <textarea
                value={cuerpo}
                onChange={(e) => setCuerpo(e.target.value)}
                rows={7}
                placeholder="Contenido del mensaje..."
                required
                className="w-full border border-gray-300 rounded-lg p-4 resize-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            />

            <div className="flex justify-end space-x-4 pt-6 border-t mt-4">
                <Button variant="secondary" onClick={onClose} type="button">Cancelar</Button>
                <Button variant="primary" type="submit" disabled={enviando || (!tipoDestinatario || ((tipoDestinatario === 'grupo' || tipoDestinatario === 'usuario') && !targetId))}>
                    <Send size={18} className="mr-2" />
                    {enviando ? 'Enviando...' : 'Enviar Comunicado'}
                </Button>
            </div>
        </form>
    );
};

// =================================================================================
// PANTALLA PRINCIPAL
// =================================================================================

const AdminMensajesPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [historial, setHistorial] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHistorial = async () => {
        setIsLoading(true);
        try {
            const data = await adminService.getHistorialMensajes();
            setHistorial(data);
        } catch (error) {
            console.error("Error al cargar historial", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistorial();
    }, []);
    
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-serif italic text-gray-900 mb-1 flex items-center gap-3">
                        <Mail className="text-blue-600" size={32} />
                        Centro de Mensajería
                    </h1>
                    <p className="text-gray-500 text-sm ml-1">
                        Administración y envío de comunicados globales.
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <Button variant="primary" icon={<Send size={18} />} onClick={() => setIsModalOpen(true)}>
                        Redactar Mensaje
                    </Button>
                    <Button variant="secondary" icon={<Clock size={18} />} onClick={fetchHistorial}>
                        Refrescar
                    </Button>
                </div>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Users size={20} className="text-blue-500" />
                        Historial de Envíos
                    </h2>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <LoadingSpinner className="w-12 h-12 text-blue-600" />
                    </div>
                ) : historial.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-400 text-[11px] font-bold uppercase tracking-widest border-b border-gray-100">
                                    <th className="p-5">Fecha</th>
                                    <th className="p-5">Destinatario</th>
                                    <th className="p-5">Asunto</th>
                                    <th className="p-5 text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {historial.map((msj) => (
                                    <tr key={msj.id} className="hover:bg-blue-50/20 transition-colors">
                                        <td className="p-5 text-sm text-gray-500 font-mono">
                                            {new Date(msj.fechaEnvio).toLocaleString('es-MX', { 
                                                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                                            })}
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <UserIcon size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{msj.destinatario?.fullName || 'General'}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">{msj.destinatario?.rol}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-sm text-gray-700 font-medium">{msj.asunto}</p>
                                            <p className="text-xs text-gray-400 truncate max-w-[200px]">{msj.cuerpoMensaje}</p>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                msj.leido ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {msj.leido ? 'Leído' : 'Enviado'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-24 text-gray-400">
                        <Mail className="mx-auto mb-2" size={32} />
                        <p>No hay mensajes enviados.</p>
                    </div>
                )}
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg" hideHeader>
                <ComposicionMensajeForm onClose={() => setIsModalOpen(false)} onSuccess={fetchHistorial} />
            </Modal>
        </div>
    );
};

export default AdminMensajesPage;