// src/components/ui/ExportFormatModal.tsx

import React from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react'; 
// Importamos el Modal de tu UI Componentes
import Modal from './Modal'; 
import { Card } from './Card';
import Button from './Button'; // 🛑 CORRECCIÓN: IMPORTACIÓN DE BUTTON

// Definimos los tipos de formato permitidos
type ExportFormat = 'PDF' | 'EXCEL';

interface ExportFormatModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Función que se llama cuando el usuario selecciona un formato
    onSelectFormat: (format: ExportFormat) => void;
    title?: string; // Título opcional para personalizar (ej: "Exportar Reporte de Asistencia")
}

// Componente para el botón de selección de formato
const FormatSelectorCard: React.FC<{ format: ExportFormat; icon: React.ReactNode; label: string; onSelect: (format: ExportFormat) => void; }> = ({ format, icon, label, onSelect }) => {
    return (
        <Card 
            variant="default"
            className="text-center p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-blue-400 border-2"
            onClick={() => onSelect(format)}
        >
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center text-blue-600">
                {icon}
            </div>
            <p className="text-xl font-semibold text-gray-800">{label}</p>
        </Card>
    );
};


export const ExportFormatModal: React.FC<ExportFormatModalProps> = ({ 
    isOpen, 
    onClose, 
    onSelectFormat,
    title = "Exportación de Datos" // Título por defecto
}) => {

    // Handler para seleccionar y cerrar el modal
    const handleSelect = (format: ExportFormat) => {
        onSelectFormat(format);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="md" // Usamos tamaño medio para el contenido
        >
            <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Formato de exportación
                </h3>
                <p className="text-gray-600 mb-8">
                    Seleccione el formato en que desea exportar.
                </p>

                {/* Contenedor de las dos opciones (Diseño de la imagen) */}
                <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
                    
                    {/* Opción PDF */}
                    <FormatSelectorCard
                        format="PDF"
                        label="PDF"
                        icon={<FileText size={80} />}
                        onSelect={handleSelect}
                    />
                    
                    {/* Opción Excel */}
                    <FormatSelectorCard
                        format="EXCEL"
                        label="EXCEL"
                        icon={<FileSpreadsheet size={80} />}
                        onSelect={handleSelect}
                    />
                </div>
            </div>

            {/* Botón de cierre opcional en el pie */}
            <div className="pt-4 text-right">
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
            </div>
        </Modal>
    );
};