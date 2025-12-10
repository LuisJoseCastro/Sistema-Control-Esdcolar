// src/pages/docente/DocenteMensajesPage.tsx

import React, { useState, useCallback } from 'react';
import { Mail, Send, Search, User, Plus, ArrowLeft, Paperclip } from 'lucide-react';
// 🛑 NUEVO: Importamos useNavigate de react-router-dom para la navegación
import { useNavigate } from 'react-router-dom';
// Componentes atómicos reutilizables
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// 🛑 ELIMINADA LA LÍNEA: import { type DocenteView } from '../../App'; 

// --- Tipos de Datos (Mock) ---
type MessageStatus = 'INBOX' | 'SENT';

interface Mensaje {
    id: string;
    sender: string;
    subject: string;
    date: string; // Puede ser 'Hoy', 'Ayer' o una fecha específica
    time: string;
    read: boolean;
    status: MessageStatus;
}

// --- MOCK DATA ---
const MOCK_MESSAGES: Mensaje[] = [
    // ... (MOCK_MESSAGES sin cambios) ...
    { id: 'm1', sender: 'Director', subject: 'Se cancelan clases a la hoy a las 13:00 pm.', date: 'Hoy', time: '12:30 pm', read: true, status: 'INBOX' },
    { id: 'm2', sender: 'Control Escolar', subject: 'Junta hoy a las 14:00 pm.', date: 'Hoy', time: '10:45 am', read: true, status: 'INBOX' },
    { id: 'm3', sender: 'Maestro Juan', subject: 'Hoy no podre ir tengo un problema familiar.', date: 'Ayer', time: '11:00 am', read: false, status: 'INBOX' },
    { id: 'm4', sender: 'Director', subject: 'La reunión de padres de familia será a las 10:30 am.', date: '03/10/25', time: '11:45 am', read: false, status: 'INBOX' },
    { id: 'm5', sender: 'Control Escolar', subject: 'Reunión de padres de familia el día de mañana favor de avisar a sus grupos.', date: '02/10/25', time: '14:00 pm', read: true, status: 'INBOX' },
    // Mensajes Enviados (Mock)
    { id: 's1', sender: 'Yo', subject: 'Confirmación de entrega de calificaciones.', date: '01/10/25', time: '09:00 am', read: true, status: 'SENT' },
    { id: 's2', sender: 'Jefa de Grupo 3A', subject: 'Reporte de ausencias de la semana.', date: '28/09/25', time: '16:30 pm', read: true, status: 'SENT' },
];

// 🛑 ELIMINADA LA INTERFAZ: DocenteMensajesPageProps

// --- Componente Atómico: Fila de Mensaje ---
interface MensajeRowProps {
    mensaje: Mensaje;
    isSelected: boolean;
    onClick: (id: string) => void;
}

const MensajeRow: React.FC<MensajeRowProps> = ({ mensaje, isSelected, onClick }) => {

    // Estilos basados en si el mensaje está seleccionado o no leído
    const baseClasses = 'flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 shadow-lg';
    const selectedClasses = isSelected ? 'bg-gray-700 ring-2 ring-blue-500' : 'bg-gray-700 hover:bg-gray-600';
    const readStatusClasses = mensaje.read ? 'text-gray-300' : 'text-white font-semibold';

    return (
        <div
            className={`${baseClasses} ${selectedClasses}`}
            onClick={() => onClick(mensaje.id)}
        >
            {/* Ícono de Perfil (Avatar) */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${isSelected ? 'bg-blue-500' : 'bg-gray-600'}`}>
                <User className="w-6 h-6 text-white" />
            </div>

            {/* Contenido del Mensaje */}
            <div className="flex-grow min-w-0">
                <div className={`text-base truncate ${readStatusClasses}`}>
                    {mensaje.sender}
                </div>
                <div className="text-sm text-gray-400 truncate mt-0.5">
                    Asunto: {mensaje.subject}
                </div>
            </div>

            {/* Fecha y Hora */}
            <div className="flex-shrink-0 ml-4 text-right">
                <div className="text-sm text-gray-300 font-medium">
                    {mensaje.date}
                </div>
                <div className="text-xs text-gray-400">
                    {mensaje.time}
                </div>
            </div>
        </div>
    );
};


// --- PÁGINA PRINCIPAL: DocenteMensajesPage ---
// 🛑 Componente principal sin prop de navegación, utiliza el hook
export const DocenteMensajesPage: React.FC = () => {
    // 🛑 Hook de React Router DOM
    const navigate = useNavigate();

    // Estado para la pestaña activa (Bandeja de Entrada por defecto)
    const [activeTab, setActiveTab] = useState<MessageStatus>('INBOX');
    // Estado para el ID del mensaje seleccionado (para simular la apertura)
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    // Estado para el término de búsqueda
    const [searchTerm, setSearchTerm] = useState<string>('');
    // Estado para la modal de Nuevo Mensaje
    const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
    // Campos del formulario de nuevo mensaje
    const [to, setTo] = useState<string>('');
    const [messageBody, setMessageBody] = useState<string>('');

    // Función para cambiar el mensaje seleccionado
    const handleMessageClick = useCallback((id: string) => {
        setSelectedMessageId(id);
        // Simular marcar como leído
    }, []);

    // Filtrar los mensajes según la pestaña activa y el término de búsqueda
    const filteredMessages = MOCK_MESSAGES.filter(msg => {
        const matchesTab = msg.status === activeTab;
        const matchesSearch =
            msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="p-4 md:p-8 bg-gray-900 text-gray-100 min-h-full">

            {/* Header: Título y Botón */}
            <header className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-serif italic text-white flex items-center">
                    <Mail className="w-7 h-7 mr-3 text-blue-400" />
                    Mensajes
                </h1>

                {/* Botón de Nuevo Mensaje */}
                <button
                    className="flex items-center space-x-2 py-2 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                    onClick={() => setIsNewMessageOpen(true)}
                >
                    <Plus className="w-5 h-5" />
                    <span>Nuevo Mensaje</span>
                </button>
            </header>

            {/* Contenedor Principal: Tabs, Búsqueda y Lista */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl">

                {/* Tabs de Navegación */}
                <div className="flex border-b border-gray-700 mb-6">
                    <button
                        className={`py-2 px-4 text-lg font-semibold transition-colors duration-200 ${activeTab === 'INBOX'
                                ? 'border-b-4 border-blue-500 text-blue-400'
                                : 'text-gray-400 hover:text-gray-200'
                            }`}
                        onClick={() => setActiveTab('INBOX')}
                    >
                        Bandeja de Entrada
                    </button>
                    <button
                        className={`py-2 px-4 text-lg font-semibold transition-colors duration-200 ${activeTab === 'SENT'
                                ? 'border-b-4 border-blue-500 text-blue-400'
                                : 'text-gray-400 hover:text-gray-200'
                            }`}
                        onClick={() => setActiveTab('SENT')}
                    >
                        Enviados
                    </button>
                </div>

                {/* Barra de Búsqueda (Input nativo, que debe ser refactorizado en la siguiente fase) */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Buscar mensajes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 text-gray-200 py-3 pl-10 pr-4 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>

                {/* Lista de Mensajes */}
                <div className="space-y-4">
                    {filteredMessages.length > 0 ? (
                        filteredMessages.map(mensaje => (
                            <MensajeRow
                                key={mensaje.id}
                                mensaje={mensaje}
                                isSelected={mensaje.id === selectedMessageId}
                                onClick={handleMessageClick}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            No hay mensajes en esta bandeja que coincidan con la búsqueda.
                        </div>
                    )}
                </div>

            </div>

            {/* Modal: Nuevo Mensaje */}
            <Modal
                isOpen={isNewMessageOpen}
                onClose={() => setIsNewMessageOpen(false)}
                title="Nuevo Mensaje"
                size="sm"
            >
                <div className="space-y-4">
                    {/* Campo Para: */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-2">Para:</label>
                        <Input
                            placeholder="Destinatario"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="bg-gray-100"
                        />
                    </div>

                    {/* Área de texto grande con ícono de clip */}
                    <div className="relative">
                        <textarea
                            placeholder="Escribe tu mensaje aquí..."
                            value={messageBody}
                            onChange={(e) => setMessageBody(e.target.value)}
                            className="w-full h-40 p-4 bg-gray-100 border border-gray-300 rounded-lg resize-none text-gray-800 placeholder-gray-500"
                        />
                        <div className="absolute right-3 top-3 text-gray-500">
                            <button type="button" className="p-1 rounded-md hover:bg-gray-200 transition">
                                <Paperclip className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Botones: Limpiar y Enviar */}
                    <div className="flex justify-between items-center">
                        <div>
                            <Button
                                variant="secondary"
                                onClick={() => { setTo(''); setMessageBody(''); }}
                                className="px-4 py-2 rounded-full"
                            >
                                Limpiar
                            </Button>
                        </div>

                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-500">Adjuntar archivos (opcional)</span>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    // Simulación de envío
                                    console.log('Enviando mensaje a', to, messageBody);
                                    // En una implementación real se llamaría al servicio API
                                    setIsNewMessageOpen(false);
                                    setTo('');
                                    setMessageBody('');
                                    alert('Mensaje enviado (simulación)');
                                }}
                                icon={<Send className="w-4 h-4" />}
                                className="px-4 py-2 rounded-full"
                            >
                                Enviar
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

        </div>
    );
};