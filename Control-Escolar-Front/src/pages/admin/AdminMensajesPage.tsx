import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
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
        { label: 'Seleccionar Destinatario', value: '' }, // Valor vacío por defecto
        { label: 'Todos los Docentes', value: 'docentes' },
        { label: 'Todos los Alumnos', value: 'alumnos' },
        { label: 'Grupo específico', value: 'grupo' },
        { label: 'Usuario específico', value: 'usuario' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validación extra de seguridad antes de enviar
        if (!destinatario) return;

        setEnviando(true);
        setTimeout(() => {
            console.log('Mensaje enviado:', { destinatario, asunto, cuerpo });
            setEnviando(false);
            onClose();
        }, 1500);
    };

    // 🚨 LÓGICA DE VALIDACIÓN: El formulario es válido solo si hay destinatario, asunto y cuerpo.
    // Esto asegura que el botón "Enviar" cumpla con lo que pidió el equipo de testing.
    const esFormularioInvalido = !destinatario || !asunto.trim() || !cuerpo.trim();

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-2xl font-serif italic mb-6">Nuevo Mensaje Global</h2>
            
            <div className="grid grid-cols-1 gap-6 mb-6">
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium w-20 text-gray-700 shrink-0">Para:</label>
                    <select
                        value={destinatario}
                        onChange={(e) => setDestinatario(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none ${!destinatario ? 'border-orange-300' : 'border-gray-300'}`}
                    >
                         {destinatariosOpciones.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                
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

            <div className="mb-6">
                <textarea
                    value={cuerpo}
                    onChange={(e) => setCuerpo(e.target.value)}
                    rows={10}
                    placeholder="Escriba aquí el cuerpo del mensaje..."
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button variant="secondary" onClick={onClose} type="button">
                    Cancelar
                </Button>
                
                {/* 🚨 SOLUCIÓN AL TESTING: Se agrega !destinatario a la propiedad disabled */}
                <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={enviando || esFormularioInvalido}
                >
                    <Send size={18} className="mr-2" />
                    {enviando ? 'Enviando...' : 'Enviar'}
                </Button>
            </div>
        </form>
    );
};


// =================================================================================
// PANTALLA PRINCIPAL DEL ADMINISTRADOR (Sin cambios necesarios aquí)
// =================================================================================

const AdminMensajesPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-serif italic text-gray-800 mb-2">
                    Centro de Mensajes
                </h1>
                <p className="text-gray-600 text-sm">
                    Administración y envío de comunicados globales
                </p>
            </header>

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
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Bandeja de Resumen</h2>
                <p className="text-gray-500">Aquí se mostraría la lista de mensajes enviados o recibidos (implementación futura).</p>
            </div>
            
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Redactar Mensaje"
                size="lg"
                hideHeader
            >
                <ComposicionMensajeForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default AdminMensajesPage;