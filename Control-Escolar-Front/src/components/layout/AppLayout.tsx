import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../contexts/TenantContext';
import { useSidebar, SidebarProvider } from '../../contexts/SidebarContext';
import type { User } from '../../types/models'; 

import { SidebarAdmin } from './SidebarAdmin';
import { SidebarDocente } from './SidebarDocente';
import { SidebarAlumno } from './SidebarAlumno';

const Navbar: React.FC = () => {
    const { config } = useTenant();
    
    if (!config) return null;

    return (
        <header 
            className="h-16 w-full text-white flex items-center justify-between p-4 shadow-md transition-colors duration-300"
            style={{ backgroundColor: config.colorPrimario }} 
        >
            <div className="text-xl font-semibold">
                {config.nombre}
            </div>
            <div className="text-sm">
                Bienvenido
            </div>
        </header>
    );
};

interface SidebarProps {
    user: User | null; 
    onLogout: () => void;
}

const AppLayoutContent: React.FC = () => {
    const { user, role, logout } = useAuth();
    useSidebar();

    let SidebarComponent: React.FC<SidebarProps>;

    switch (role) {
        case 'ADMIN':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            SidebarComponent = SidebarAdmin as React.FC<any>;
            break;
        case 'DOCENTE':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            SidebarComponent = SidebarDocente as React.FC<any>;
            break;
        case 'ALUMNO':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            SidebarComponent = SidebarAlumno as React.FC<any>;
            break;
        default:
            logout();
            return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <SidebarComponent user={user} onLogout={logout} />
            <div className="flex flex-col flex-1 overflow-y-auto bg-gray-50">
                <Navbar />
                <main className="p-6 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export const AppLayout: React.FC = () => {
    const { user, isLoading: authLoading } = useAuth();
    const { loading: tenantLoading } = useTenant(); 

    if (authLoading || tenantLoading) {
        return (
            <div className="flex items-center justify-center h-screen text-2xl text-blue-600 animate-pulse">
                Cargando sistema...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <SidebarProvider>
            <AppLayoutContent />
        </SidebarProvider>
    );
};