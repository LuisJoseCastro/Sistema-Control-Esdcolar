// src/components/layout/AppLayout.tsx

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../contexts/TenantContext';
import { useSidebar, SidebarProvider } from '../../contexts/SidebarContext'; // Ya corregido

// Importación de las tres Sidebars
import { SidebarAdmin } from './SidebarAdmin';
import { SidebarDocente } from './SidebarDocente';
import { SidebarAlumno } from './SidebarAlumno';

// Placeholder para la Navbar
const Navbar: React.FC = () => {
    // ✅ Config se sigue usando aquí, por lo que se desestructura correctamente.
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

// Nuevo componente Wrapper para usar el hook useSidebar
const AppLayoutContent: React.FC = () => {
    // ✅ La desestructuración y uso de user, role, y logout se queda aquí
    const { user, role, logout } = useAuth();
    //const { config } = useTenant(); // Aunque config no se usa directamente, lo mantenemos por claridad si fuera necesario.

    // OBTENER ESTADO DEL SIDEBAR (se usa en SidebarComponent)
    // ✅ isCollapsed, collapsedWidth, expandedWidth se desestructuran, pero como no se usan 
    // directamente en AppLayoutContent, los marcamos con _ si tu linter es estricto, o simplemente 
    // eliminamos la desestructuración si no se necesitan aquí.
    useSidebar();

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
            logout();
            return <Navigate to="/login" replace />;
    }

    // 2. Renderiza el Layout completo (Sidebar + Navbar + Contenido)
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Área 1: Sidebar */}
            <SidebarComponent user={user} onLogout={logout} />

            {/* Área 2: Contenido Principal (Scrollable) */}
            <div className="flex flex-col flex-1 overflow-y-auto bg-gray-50">

                {/* Navbar (Barra superior dinámica) */}
                <Navbar />

                {/* Contenido de la Página */}
                <main className="p-6 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};


// Componente principal AppLayout (que envuelve en el SidebarProvider)
export const AppLayout: React.FC = () => {
    // ✅ Solo desestructuramos lo que necesitamos para el guard
    const { user } = useAuth();
    const { config, loading: loadingTenant } = useTenant();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (loadingTenant || !config) {
        return (
            <div className="flex items-center justify-center h-screen text-2xl text-blue-600">
                Cargando configuración de la Escuela...
            </div>
        );
    }

    // Envolvemos AppLayoutContent con SidebarProvider para compartir el estado.
    return (
        <SidebarProvider>
            <AppLayoutContent />
        </SidebarProvider>
    );
};