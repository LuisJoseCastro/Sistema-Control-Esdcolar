// src/components/layout/AppLayout.tsx

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../contexts/TenantContext';

// Importación de las tres Sidebars
import { SidebarAdmin } from './SidebarAdmin';
import { SidebarDocente } from './SidebarDocente';
import { SidebarAlumno } from './SidebarAlumno';

// Placeholder para la Navbar (si decides agregar una barra superior)
const Navbar: React.FC = () => {
    const { config } = useTenant();
    if (!config) return null;
    
    // El color de fondo de la Navbar es dinámico según la escuela (SaaS)
    return (
        <header className={`h-16 w-full ${config.colorPrimario} text-white flex items-center justify-between p-4 shadow-md`}>
            <div className="text-xl font-semibold">
                {config.nombre} 
            </div>
            <div className="text-sm">
                Bienvenido
            </div>
        </header>
    );
};


export const AppLayout: React.FC = () => {
    const { user, role, logout } = useAuth();
    const { config, loading: loadingTenant } = useTenant();

    if (!user) {
        // Esto no debería pasar si se usa dentro de PrivateRoute, pero es un guard
        return <Navigate to="/login" replace />;
    }

    if (loadingTenant || !config) {
        // Muestra una pantalla de carga mientras se obtiene la configuración de la escuela
        return (
            <div className="flex items-center justify-center h-screen text-2xl text-blue-600">
                Cargando configuración de la Escuela...
            </div>
        );
    }
    
    // 1. Selecciona el componente de Sidebar basado en el rol del usuario
    let SidebarComponent: React.FC<any>;
    
    switch (role) {
        case 'ADMIN':
            SidebarComponent = SidebarAdmin;
            break;
        case 'DOCENTE':
            SidebarComponent = SidebarDocente;
            break;
        case 'ALUMNO':
            SidebarComponent = SidebarAlumno;
            break;
        default:
            // Si el rol es desconocido, forzar logout
            logout();
            return <Navigate to="/login" replace />;
    }

    // 2. Renderiza el Layout completo (Sidebar + Navbar + Contenido)
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Área 1: Sidebar (fija a la izquierda) */}
            <SidebarComponent user={user} onLogout={logout} />
            
            {/* Área 2: Contenido Principal (scrollable) */}
            <div className="flex flex-col flex-1 overflow-y-auto bg-gray-50">
                
                {/* Navbar (Barra superior dinámica) */}
                <Navbar />
                
                {/* Contenido de la Página (Dashboard, Calificaciones, etc.) */}
                <main className="p-6 flex-1">
                    {/* Outlet renderiza el componente de la ruta activa (ej: AdminDashboardPage) */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};