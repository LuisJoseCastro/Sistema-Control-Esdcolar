import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Mail, Send, Search, User, Plus, Paperclip } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type MessageStatus = 'INBOX' | 'SENT';

interface Mensaje {
    id: string;
    sender: string;
    subject: string;
    date: string;
    time: string;
    fullContent: string;
    read: boolean;
    status: MessageStatus;
}

interface ApiUser {
    id: string;
    email: string;
    fullName?: string;
}

interface ApiMessage {
    id: string;
    asunto: string;
    cuerpoMensaje: string;
    urlAdjunto?: string;
    leido: boolean;
    fechaEnvio: string;
    remitente?: ApiUser;
    destinatario?: ApiUser;
}

const MensajeRow: React.FC<{ mensaje: Mensaje; isSelected: boolean; onClick: (id: string) => void; }> = ({ mensaje, isSelected, onClick }) => {
    const baseClasses = 'flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 border';
    const selectedClasses = isSelected
        ? 'bg-blue-50 border-blue-500 shadow-md'
        : 'bg-white border-gray-200 hover:bg-gray-50';

    const fontClasses = mensaje.read ? 'font-normal text-gray-600' : 'font-bold text-gray-900';
    const subjectClasses = mensaje.read ? 'text-gray-500' : 'text-gray-700 font-medium';

    return (
        <div className={`${baseClasses} ${selectedClasses}`} onClick={() => onClick(mensaje.id)}>
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 
                ${mensaje.read ? 'bg-gray-200 text-gray-500' : 'bg-blue-50 text-white'}`}>
                <User className="w-5 h-5" />
            </div>
            <div className="grow min-w-0">
                <div className={`text-base truncate ${fontClasses}`}>
                    {mensaje.sender}
                    {!mensaje.read && <Badge variant="info" className="ml-3 h-auto py-0.5 px-2 text-[10px] tracking-normal">Nuevo</Badge>}
                </div>
                <div className={`text-sm truncate mt-0.5 ${subjectClasses}`}>
                    {mensaje.subject}
                </div>
            </div>
            <div className="shrink-0 ml-4 text-right hidden sm:block">
                <div className="text-sm text-gray-600 font-medium">{mensaje.date}</div>
                <div className="text-xs text-gray-400">{mensaje.time}</div>
            </div>
        </div>
    );
};

export const DocenteMensajesPage: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const token = localStorage.getItem('token');

    const [messages, setMessages] = useState<Mensaje[]>([]);
    const [activeTab, setActiveTab] = useState<MessageStatus>('INBOX');
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [messageBody, setMessageBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [errors, setErrors] = useState<{ to?: string, subject?: string, messageBody?: string }>({});

    const formatDateForUI = (isoDate: string) => {
        const d = new Date(isoDate);
        const now = new Date();
        const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        const time = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
        let date = d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' });
        if (isToday) date = "Hoy"; 
        return { date, time };
    };

    const fetchMessages = useCallback(async () => {
        if (!token) return;
        const endpoint = activeTab === 'INBOX' ? '/academic/messages/inbox' : '/academic/messages/sent';
        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (Array.isArray(data)) {
                const mappedMessages: Mensaje[] = data.map((msg: ApiMessage) => {
                    const { date, time } = formatDateForUI(msg.fechaEnvio);
                    
                    // MEJORA: Lógica de selección de nombre con prioridades
                    let displayUser = "Usuario Desconocido";
                    
                    if (activeTab === 'INBOX') {
                        // En Recibidos, buscamos quién lo envió
                        displayUser = msg.remitente?.fullName || msg.remitente?.email || "Remitente sin nombre";
                    } else {
                        // En Enviados, buscamos a quién se lo mandamos
                        displayUser = msg.destinatario?.fullName || msg.destinatario?.email || "Destinatario sin nombre";
                    }

                    return {
                        id: msg.id,
                        sender: displayUser,
                        subject: msg.asunto,
                        fullContent: msg.cuerpoMensaje,
                        date,
                        time,
                        read: activeTab === 'SENT' ? true : msg.leido,
                        status: activeTab
                    };
                });
                setMessages(mappedMessages);
            }
        } catch (error) {
            console.error("Error cargando mensajes", error);
        }
    }, [activeTab, token]);

    useEffect(() => {
        fetchMessages();
        setSelectedMessageId(null);
    }, [fetchMessages]);

    const handleMessageClick = useCallback(async (id: string) => {
        setSelectedMessageId(id);
        const msg = messages.find(m => m.id === id);
        if (msg && !msg.read && activeTab === 'INBOX') {
            try {
                await fetch(`${API_URL}/academic/messages/read/${id}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
            } catch (error) {
                console.error("Error al marcar como leído", error);
            }
        }
    }, [messages, activeTab, token]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            console.log("Archivo seleccionado:", files[0].name);
        }
    };

    const handleClipClick = () => {
        fileInputRef.current?.click();
    };

    const validateFields = useCallback((): boolean => {
        const newErrors: { to?: string, subject?: string, messageBody?: string } = {};
        if (!to.trim()) newErrors.to = 'El campo "Para" es requerido';
        if (!subject.trim()) newErrors.subject = 'El Asunto es requerido';
        if (!messageBody.trim()) newErrors.messageBody = 'El mensaje no puede estar vacío';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [to, subject, messageBody]);

    const handleSendMessage = useCallback(async () => {
        if (!validateFields()) return;
        setIsSending(true);
        try {
            const res = await fetch(`${API_URL}/academic/messages/send`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ to, subject, message: messageBody })
            });

            if (res.ok) {
                alert('Mensaje enviado exitosamente.');
                setIsNewMessageOpen(false);
                handleClearForm();
                if (activeTab === 'SENT') fetchMessages(); 
            } else {
                alert('Error: Verifica el correo del destinatario.');
            }
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            alert('Error de conexión con el servidor.');
        } finally {
            setIsSending(false);
        }
    }, [to, subject, messageBody, token, activeTab, fetchMessages, validateFields]);

    const handleClearForm = () => {
        setTo('');
        setSubject('');
        setMessageBody('');
        setErrors({});
    };

    const handleCloseModal = () => {
        setIsNewMessageOpen(false);
        handleClearForm();
    };

    const filteredMessages = messages.filter(msg => {
        return msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
               msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const selectedMessageDetail = messages.find(m => m.id === selectedMessageId);

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <header className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Mail className="w-7 h-7 mr-3 text-main-900" />
                    Buzón de Mensajes
                </h1>
                <Button variant='primary' onClick={() => setIsNewMessageOpen(true)} icon={<Plus className="w-5 h-5" />}>Nuevo Mensaje</Button>
            </header>

            <Card className="p-0">
                <div className="p-6 pb-0">
                    <div className="flex border-b border-gray-200">
                        <button className={`py-2 px-4 text-lg font-semibold transition-colors duration-200 ${activeTab === 'INBOX' ? 'border-b-4 border-grayDark-500 text-main-800' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => { setActiveTab('INBOX'); setSelectedMessageId(null); }}>Bandeja de Entrada</button>
                        <button className={`py-2 px-4 text-lg font-semibold transition-colors duration-200 ${activeTab === 'SENT' ? 'border-b-4 border-grayDark-500 text-main-800' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => { setActiveTab('SENT'); setSelectedMessageId(null); }}>Enviados</button>
                    </div>
                </div>

                <div className="p-6 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input type="text" placeholder="Buscar por remitente o asunto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2.5 pl-10 pr-4 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:border-main-700 focus:ring-1 focus:ring-main-800 transition duration-150 placeholder:text-gray-500" />
                    </div>
                </div>

                <div className="space-y-3 p-6 pt-0 max-h-[60vh] overflow-y-auto">
                    {filteredMessages.length > 0 ? filteredMessages.map(mensaje => (
                        <MensajeRow key={mensaje.id} mensaje={mensaje} isSelected={mensaje.id === selectedMessageId} onClick={handleMessageClick} />
                    )) : (
                        <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                            <Send className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                            <p className="font-medium">No hay mensajes en esta bandeja.</p>
                        </div>
                    )}
                </div>
            </Card>

            <Modal isOpen={isNewMessageOpen} onClose={handleCloseModal} title="Nuevo Mensaje" size="sm">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-2">Para (Email):</label>
                        <Input placeholder="Destinatario (ejemplo: director@escuela.edu)" value={to} onChange={(e) => { setTo(e.target.value); if (errors.to) setErrors(prev => ({ ...prev, to: undefined })); }} className={`bg-whiteBg-300 ${errors.to ? 'border-red-500' : ''}`} />
                        {errors.to && <p className="mt-1 text-xs text-red-500">{errors.to}</p>}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-2">Asunto:</label>
                        <Input placeholder="Asunto del mensaje" value={subject} onChange={(e) => { setSubject(e.target.value); if (errors.subject) setErrors(prev => ({ ...prev, subject: undefined })); }} className={`bg-whiteBg-300 ${errors.subject ? 'border-red-500' : ''}`} />
                        {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                    </div>

                    <div className="relative">
                        <label className="block text-sm text-gray-600 mb-2">Mensaje:</label>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                        <textarea placeholder="Escribe tu mensaje aquí..." value={messageBody} onChange={(e) => { setMessageBody(e.target.value); if (errors.messageBody) setErrors(prev => ({ ...prev, messageBody: undefined })); }} className={`w-full h-40 p-4 bg-whiteBg-300 border border-gray-300 rounded-lg resize-none text-gray-800 placeholder-gray-500 ${errors.messageBody ? 'border-red-500' : ''}`} />
                        <div className="absolute right-3 top-8 text-gray-500"><button type="button" className="p-1 rounded-md hover:bg-whiteBg-400 transition" onClick={handleClipClick}><Paperclip className="w-5 h-5" /></button></div>
                        {errors.messageBody && <p className="mt-1 text-xs text-red-500">{errors.messageBody}</p>}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <Button variant="secondary" onClick={handleClearForm} className="px-4 py-2 rounded-full">Limpiar</Button>
                        <div className="flex items-center space-x-3">
                            <span className="w-auto text-sm text-gray-500 ms-8 me-2">Adjuntar archivos (opcional)</span>
                            <Button variant="primary" onClick={handleSendMessage} disabled={isSending} icon={isSending ? null : <Send className="w-4 h-4" />} className="px-4 py-2 rounded-full">{isSending ? 'Enviando...' : 'Enviar'}</Button>
                        </div>
                    </div>
                </div>
            </Modal>

            {selectedMessageDetail && (
                <div className="mt-8">
                    <Card header="Detalle del Mensaje" className="border-l-4 border-main-800">
                        <p className="text-sm text-gray-500 mb-2">{activeTab === 'INBOX' ? 'De:' : 'Para:'} <span className="font-semibold text-gray-800">{selectedMessageDetail.sender}</span></p>
                        <p className="text-sm text-gray-500 mb-4">Fecha: <span className="font-semibold text-gray-800">{selectedMessageDetail.date} a las {selectedMessageDetail.time}</span></p>
                        <p className="text-lg font-bold text-gray-800 mb-4">{selectedMessageDetail.subject}</p>
                        <div className="border-t border-gray-100 pt-4 text-gray-800 font-medium whitespace-pre-wrap"><p>{selectedMessageDetail.fullContent}</p></div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default DocenteMensajesPage;