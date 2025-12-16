// src/pages/admin/AdminDashboardPage.tsx (CÓDIGO FINAL CORREGIDO)

import React from 'react';
import { useNavigate } from 'react-router-dom';
// 🛑 Importamos los íconos necesarios (eliminamos User para quitar el warning)
import { GraduationCap, Briefcase, Bell } from 'lucide-react'; 
// 🛑 Importamos el componente Card
import { Card } from '../../components/ui/Card'; 

// Componente individual para cada tarjeta de rol
const RoleCard: React.FC<{ title: string; target: string; largeIcon: React.ReactNode }> = ({ title, target, largeIcon }) => {
    const navigate = useNavigate();
    
    // Convertimos la clase rounded-[2rem] a la canónica rounded-4xl
    const cardBaseClasses = "w-full max-w-sm h-[450px] flex flex-col items-center justify-center p-8 text-center cursor-pointer ";

    return (
        // Sin bordes de colores - solo sombra y diseño limpio
        <Card
            className={`${cardBaseClasses} 
                        hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] 
                        bg-white rounded-4xl shadow-[0_15px_35px_rgba(0,0,0,0.1)]`}
            onClick={() => navigate(target)}
            variant="default" 
        >
            {/* 🛑 Contenedor del espacio del ícono/imagen (Mock visual) */}
            <div className="w-40 h-64 bg-gray-100 flex items-center justify-center mb-6 rounded-lg border border-gray-300">
                {/* 🛑 Renderizamos el ícono grande directamente, sin clonarlo */}
                {largeIcon}
            </div>
            
            {/* Título */}
            <h2 className="text-4xl font-[Kaushan Script] text-gray-800">
                {title}
            </h2>
        </Card>
    );
};

// 🛑 Componente para mostrar solo la notificación en el Header
const AdminHeaderIcons: React.FC = () => (
    <div className="flex gap-4 mb-2">
        <div className="relative text-gray-500 hover:text-gray-700 cursor-pointer">
            <Bell size={28} />
             <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                9+
            </span>
        </div>
    </div>
);


/**
 * Página: AdminDashboardPage
 * Descripción: Selector de Rol (Alumnos o Docentes) para la administración.
 */
export const AdminDashboardPage: React.FC = () => {
    return (
        <div className="p-8 bg-white min-h-full font-sans">
            
            {/* HEADER */}
            <header className="flex justify-between items-end border-b-2 border-gray-400 pb-2 mb-16">
                <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
                    Panel de Administración
                </h1>
                <AdminHeaderIcons /> {/* 🛑 Usamos el componente simplificado */}
            </header>

            <div className="max-w-6xl mx-auto flex justify-center items-center h-[calc(100vh-200px)]">
                
                {/* Contenedor Flex para las dos tarjetas */}
                <div className="flex gap-16 justify-center w-full">
                    
                    {/* Tarjeta 1: Alumnos */}
                    <RoleCard 
                        title="Alumnos" 
                        target="/admin/alumnos" 
                        // 🛑 Pasamos el JSX del ícono grande con su color
                        largeIcon={<GraduationCap size={100} className="text-blue-500" />} 
                    />

                    {/* Tarjeta 2: Docentes */}
                    <RoleCard 
                        title="Docentes" 
                        target="/admin/docentes" 
                        // 🛑 Pasamos el JSX del ícono grande con su color
                        largeIcon={<Briefcase size={100} className="text-purple-500" />} 
                    />

                </div>
            </div>
        </div>
    );
};