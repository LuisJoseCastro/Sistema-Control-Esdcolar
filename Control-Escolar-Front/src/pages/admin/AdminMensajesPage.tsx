// src/pages/admin/AdminMensajesPage.tsx

import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
// Suponemos que tienes un componente Select.tsx
import { Send, Mail, UserCheck } from 'lucide-react';

// =================================================================================
// COMPONENTE PARA LA COMPOSICIÓN DEL MENSAJE (EL CONTENIDO DEL MODAL)
// =================================================================================

interface MensajeFormProps {
    onClose: () => void;
}

const ComposicionMensajeForm: React.FC<MensajeFormProps> = ({ onClose }) => {
    const [asunto, setAsunto] = useState('');
    const [cuerpo, setCuerpo] = useState('');
    const [destinatario, setDestinatario] = useState('');
    const [enviando, setEnviando] = useState(false);

    // Opciones simuladas para el campo "Para:"
    const destinatariosOpciones = [
        { label: 'Seleccionar Destinatario', value: '' },
        { label: 'Todos los Docentes', value: 'docentes' },
        { label: 'Todos los Alumnos', value: 'alumnos' },
        { label: 'Grupo específico', value: 'grupo' },
        { label: 'Usuario específico', value: 'usuario' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        // Simulación de envío
        setTimeout(() => {
            console.log('Mensaje enviado:', { destinatario, asunto, cuerpo });
            setEnviando(false);
            onClose();
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-2xl font-serif italic mb-6">Nuevo Mensaje Global</h2>
            
            {/* Fila: Para: y Asunto: */}
            <div className="grid grid-cols-1 gap-6 mb-6">
                
                {/* Campo "Para:" (Usando tu componente Select, si existe) */}
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium w-20 text-gray-700 shrink-0">Para:</label>
                    {/* Si tienes un componente Select, úsalo aquí */}
                    <select
                        value={destinatario}
                        onChange={(e) => setDestinatario(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 bg-white text-gray-800"
                    >
                         {destinatariosOpciones.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                
                {/* Campo Asunto */}
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium w-20 text-gray-700 shrink-0">Asunto:</label>
                    <Input
                        type="text"
                        value={asunto}
                        onChange={(e) => setAsunto(e.target.value)}
                        placeholder="Asunto del mensaje"
                        required
                    />
                </div>
            </div>

            {/* Área de Texto (Cuerpo del mensaje) */}
            <div className="mb-6">
                <textarea
                    value={cuerpo}
                    onChange={(e) => setCuerpo(e.target.value)}
                    rows={10}
                    placeholder="Escriba aquí el cuerpo del mensaje..."
                    required
                    className="w-full border rounded-lg p-3 resize-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button variant="secondary" onClick={onClose} type="button">
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" disabled={enviando}>
                    <Send size={18} className="mr-2" />
                    {enviando ? 'Enviando...' : 'Enviar'}
                </Button>
            </div>
        </form>
    );
};


// =================================================================================
// PANTALLA PRINCIPAL DEL ADMINISTRADOR
// =================================================================================

const AdminMensajesPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-serif italic text-gray-800 mb-2">
                Centro de Mensajes
            </h1>
            <p className="text-gray-600 text-sm mb-8">
                Administración y envío de comunicados globales
            </p>

            <div className="flex space-x-4 mb-8">
                <Button 
                    variant="primary" 
                    icon={<Mail size={20} />} 
                    onClick={() => setIsModalOpen(true)}
                >
                    Redactar Nuevo Mensaje
                </Button>
                
                <Button 
                    variant="secondary" 
                    icon={<UserCheck size={20} />}
                >
                    Ver Historial de Envíos
                </Button>
            </div>
            
            {/* Placeholder de la bandeja de entrada/resumen */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Bandeja de Resumen</h2>
                <p className="text-gray-500">Aquí se mostraría la lista de mensajes enviados o recibidos (implementación futura).</p>
            </div>
            

            {/* MODAL DE COMPOSICIÓN */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Redactar Mensaje"
                size="lg" // Ajustamos el tamaño para que sea grande
                hideHeader // Ocultamos el encabezado para usar el título interno
            >
                {/* Usamos el componente de composición dentro del Modal */}
                <ComposicionMensajeForm onClose={() => setIsModalOpen(false)} />
            </Modal>

        </div>
    );
};

export default AdminMensajesPage;