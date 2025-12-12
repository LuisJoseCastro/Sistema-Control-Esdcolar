// src/components/admin/DocenteFormModal.tsx

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

// Interfaz para los datos del nuevo docente (Asumiendo que es la misma que la última vez)
interface NewDocenteData {
    clave: string;
    nombre: string;
    email: string;
    telefono: string;
    especialidad: string;
}

interface DocenteFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: NewDocenteData) => void;
}

const EMPTY_FORM: NewDocenteData = {
    clave: '',
    nombre: '',
    email: '',
    telefono: '',
    especialidad: ''
};

export const DocenteFormModal: React.FC<DocenteFormModalProps> = ({ isOpen, onClose, onSave }) => {
    
    const [formData, setFormData] = useState<NewDocenteData>(EMPTY_FORM);
    const [isSaving, setIsSaving] = useState(false);

    // 🛑 CORRECCIÓN: Usamos useEffect para resetear el formulario SOLO cuando isOpen cambia a true
    useEffect(() => {
        if (isOpen) {
            setFormData(EMPTY_FORM);
        }
    }, [isOpen]); // Depende únicamente de 'isOpen'

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validación básica
        if (!formData.clave || !formData.nombre || !formData.email) {
            alert('Asegúrese de llenar al menos Clave, Nombre y Email.');
            return;
        }

        setIsSaving(true);
        // Simulación de delay de API
        await new Promise(resolve => setTimeout(resolve, 800));

        // Llamar a la función onSave del componente padre
        onSave(formData);
        
        setIsSaving(false);
        // Nota: setFormData(EMPTY_FORM) ya no es necesario aquí, lo hace el useEffect al cerrar
        onClose(); 
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Registrar Nuevo Docente"
            size="sm"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Clave Institucional */}
                <Input
                    label="Clave Institucional"
                    name="clave"
                    value={formData.clave}
                    onChange={handleChange}
                    placeholder="Ej: DOC-200"
                    required
                    disabled={isSaving}
                />
                
                {/* Nombre Completo */}
                <Input
                    label="Nombre Completo"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez Díaz"
                    required
                    disabled={isSaving}
                />
                
                {/* Correo Electrónico */}
                <Input
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@institucion.com"
                    required
                    disabled={isSaving}
                />
                
                {/* Teléfono */}
                <Input
                    label="Teléfono (Opcional)"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="55-1234-5678"
                    disabled={isSaving}
                />
                
                {/* Especialidad */}
                <Input
                    label="Especialidad (Opcional)"
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleChange}
                    placeholder="Ej: Ingeniería de Software"
                    disabled={isSaving}
                />

                {/* Botones de acción */}
                <div className="flex justify-end pt-4 border-t gap-3">
                    <Button variant="secondary" onClick={onClose} type="button" disabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSaving} disabled={isSaving}>
                        <Save size={18} className="mr-2" />
                        Registrar Docente
                    </Button>
                </div>
            </form>
        </Modal>
    );
};