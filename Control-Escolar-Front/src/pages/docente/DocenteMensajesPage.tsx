// src/pages/docente/DocenteMensajesPage.tsx

import React, { useState, useCallback } from 'react';
import { Mail, Send, Search, User, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Componentes atómicos reutilizables
import Modal from '../../components/ui/Modal';

// 🛑 IMPORTACIONES DE COMPONENTES ATÓMICOS
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input'; // Se importó pero no se usa en el bloque de búsqueda, se usa en el atómico original
import Badge from '../../components/ui/Badge';

// --- Tipos de Datos (Mock) ---
type MessageStatus = 'INBOX' | 'SENT';

interface Mensaje {
    id: string;
    sender: string;
    subject: string;
    date: string; 
    time: string;
    read: boolean;
    status: MessageStatus;
}

// --- MOCK DATA ---
const MOCK_MESSAGES: Mensaje[] = [
    { id: 'm1', sender: 'Director', subject: 'Se cancelan clases a la hoy a las 13:00 pm.', date: 'Hoy', time: '12:30 pm', read: true, status: 'INBOX' },
    { id: 'm2', sender: 'Control Escolar', subject: 'Junta hoy a las 14:00 pm.', date: 'Hoy', time: '10:45 am', read: true, status: 'INBOX' },
    { id: 'm3', sender: 'Maestro Juan', subject: 'Hoy no podre ir tengo un problema familiar.', date: 'Ayer', time: '11:00 am', read: false, status: 'INBOX' },
    { id: 'm4', sender: 'Director', subject: 'La reunión de padres de familia será a las 10:30 am.', date: '03/10/25', time: '11:45 am', read: false, status: 'INBOX' },
    { id: 'm5', sender: 'Control Escolar', subject: 'Reunión de padres de familia el día de mañana favor de avisar a sus grupos.', date: '02/10/25', time: '14:00 pm', read: true, status: 'INBOX' },
    // Mensajes Enviados (Mock)
    { id: 's1', sender: 'Yo', subject: 'Confirmación de entrega de calificaciones.', date: '01/10/25', time: '09:00 am', read: true, status: 'SENT' },
    { id: 's2', sender: 'Jefa de Grupo 3A', subject: 'Reporte de ausencias de la semana.', date: '28/09/25', time: '16:30 pm', read: true, status: 'SENT' },
];


// --- Componente de Fila de Mensaje Refactorizado ---
interface MensajeRowProps {
    mensaje: Mensaje;
    isSelected: boolean;
    onClick: (id: string) => void;
}

const MensajeRow: React.FC<MensajeRowProps> = ({ mensaje, isSelected, onClick }) => {

    const baseClasses = 'flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 border';
    const selectedClasses = isSelected 
        ? 'bg-blue-50 border-blue-500 shadow-md' 
        : 'bg-white border-gray-200 hover:bg-gray-50';
    
    // Estilo para el texto según el estado de lectura
    const fontClasses = mensaje.read ? 'font-normal text-gray-600' : 'font-bold text-gray-900';
    const subjectClasses = mensaje.read ? 'text-gray-500' : 'text-gray-700 font-medium';

    return (
        <div
            className={`${baseClasses} ${selectedClasses}`}
            onClick={() => onClick(mensaje.id)}
        >
            {/* Ícono de Perfil (Avatar) - Estilo manual más acorde a un avatar simple */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 
                ${mensaje.read ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white'}`}>
                <User className="w-5 h-5" />
            </div>

            {/* Contenido del Mensaje */}
            <div className="flex-grow min-w-0">
                <div className={`text-base truncate ${fontClasses}`}>
                    {mensaje.sender}
                    {/* 🛑 USO DEL COMPONENTE ATÓMICO: Badge para No Leído */}
                    {!mensaje.read && (
                         <Badge variant="info" className="ml-3 h-auto py-0.5 px-2 text-[10px] tracking-normal">
                             Nuevo
                         </Badge>
                    )}
                </div>
                <div className={`text-sm truncate mt-0.5 ${subjectClasses}`}>
                    {mensaje.subject}
                </div>
            </div>

            {/* Fecha y Hora */}
            <div className="flex-shrink-0 ml-4 text-right hidden sm:block">
                <div className="text-sm text-gray-600 font-medium">
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
export const DocenteMensajesPage: React.FC = () => {
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
        // Simular marcar como leído (aquí iría la lógica real)
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
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">

            {/* Header: Título y Botón */}
            <header className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Mail className="w-7 h-7 mr-3 text-cyan-600" />
                    Buzón de Mensajes
                </h1>
                {/* USO DEL COMPONENTE ATÓMICO: Button (variant: primary) */}
                <Button
                    variant='primary'
                    onClick={() => console.log('Abrir Modal/Página para Nuevo Mensaje')}
                    icon={<Plus className="w-5 h-5" />}
                >
                    Nuevo Mensaje
                </Button>
            </header>

            {/* Contenedor Principal: Tabs, Búsqueda y Lista */}
            {/* USO DEL COMPONENTE ATÓMICO: Card */}
            <Card className="p-0">

                {/* Tabs de Navegación */}
                <div className="p-6 pb-0">
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`py-2 px-4 text-lg font-semibold transition-colors duration-200 
                                ${activeTab === 'INBOX'
                                    ? 'border-b-4 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => {
                                setActiveTab('INBOX');
                                setSelectedMessageId(null);
                            }}
                        >
                            Bandeja de Entrada
                        </button>
                        <button
                            className={`py-2 px-4 text-lg font-semibold transition-colors duration-200 
                                ${activeTab === 'SENT'
                                    ? 'border-b-4 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => {
                                setActiveTab('SENT');
                                setSelectedMessageId(null);
                            }}
                        >
                            Enviados
                        </button>
                    </div>
                </div>

                {/* Barra de Búsqueda 🛑 CORRECCIÓN: Se utiliza un div con input nativo para evitar el error de "void element" */}
                <div className="p-6 pb-4">
                    <div className="relative">
                        {/* Ícono de Search a la izquierda */}
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        
                        {/* Input nativo con estilos de Tailwind basados en el Input atómico */}
                        <input
                            type="text"
                            placeholder="Buscar por remitente o asunto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2.5 pl-10 pr-4 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 placeholder:text-gray-500"
                        />
                    </div>
                </div>
                
                {/* Lista de Mensajes */}
                <div className="space-y-3 p-6 pt-0 max-h-[60vh] overflow-y-auto">
                    {filteredMessages.length > 0 ? (
                        filteredMessages.map(mensaje => (
                            <MensajeRow
                                // 🛑 VERIFICACIÓN DE CLAVE: Usando mensaje.id
                                key={mensaje.id} 
                                mensaje={mensaje}
                                isSelected={mensaje.id === selectedMessageId}
                                onClick={handleMessageClick}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                            <Send className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                            <p className="font-medium">No hay mensajes en esta bandeja que coincidan con la búsqueda.</p>
                        </div>
                    )}
                </div>

            </Card>
            {/* Opcional: Contenedor para ver el mensaje seleccionado (simulación) */}
            {selectedMessageId && (
                <div className="mt-8">
                    {/* USO DEL COMPONENTE ATÓMICO: Card (para el detalle) */}
                    <Card header="Detalle del Mensaje" className="border-l-4 border-cyan-600">
                        <p className="text-sm text-gray-500 mb-2">
                            De: <span className="font-semibold text-gray-800">{MOCK_MESSAGES.find(m => m.id === selectedMessageId)?.sender}</span>
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            Fecha: <span className="font-semibold text-gray-800">{MOCK_MESSAGES.find(m => m.id === selectedMessageId)?.date} a las {MOCK_MESSAGES.find(m => m.id === selectedMessageId)?.time}</span>
                        </p>
                        <p className="text-lg font-bold text-gray-800 mb-4">
                            {MOCK_MESSAGES.find(m => m.id === selectedMessageId)?.subject}
                        </p>
                        <div className="border-t border-gray-100 pt-4 text-gray-700">
                            <p>
                                {/* Simulación de contenido del mensaje */}
                                Estimado Docente, la administración ha emitido una nueva circular con respecto a las horas de salida.
                                Por favor, revise su correo electrónico oficial para los detalles completos.
                            </p>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};