//src/pages/alumno/AlumnoMensajesPage.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Bell } from 'lucide-react'; 
import { useAuth } from '../../hooks/useAuth'; 
import { getNotificaciones } from '../../services/alumno.service'; // Importado
import type { NotificacionDashboard } from '../../types/models'; // Importado
// Usamos el componente que centraliza los íconos del encabezado
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons'; 

/**
 * Página: AlumnoMensajesPage
 * Descripción: Muestra la lista completa de notificaciones y mensajes del alumno.
 */
export const AlumnoMensajesPage: React.FC = () => {
    const { user } = useAuth();
    const [notificaciones, setNotificaciones] = useState<NotificacionDashboard[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Efecto para cargar los datos
    useEffect(() => {
        const fetchNotificaciones = async () => {
            if (!user?.id) return;
            try {
                const data = await getNotificaciones(user.id);
                // Ordenamos para que las no leídas aparezcan primero
                const sortedData = data.sort((a, b) => (a.leida === b.leida ? 0 : a.leida ? 1 : -1));
                setNotificaciones(sortedData);
            } catch (error) {
                console.error("Error al cargar notificaciones:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotificaciones();
    }, [user]);
    
    // Contar las no leídas para pasarlo al header
    const unreadCount = notificaciones.filter(n => !n.leida).length;


    if (loading) {
        return (
            <div className="flex justify-center items-center h-[500px]">
                <LoadingSpinner text="Cargando mensajes..." />
            </div>
        );
    }
    
    return (
        <div className="p-8 bg-white min-h-full">
            
            {/* Encabezado con título e íconos */}
            <header className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-8">
                <h1 className="text-4xl font-[Kaushan Script] text-gray-800">
                    Notificaciones/Mensajes
                </h1>
                {/* Reutilizamos el componente de íconos */}
                <UserHeaderIcons unreadCount={unreadCount} />
            </header>

            {/* Contenido de la lista de mensajes */}
            <div className="max-w-4xl mx-auto space-y-4">
                {notificaciones.length > 0 ? (
                    notificaciones.map((notif) => (
                        <Card 
                            key={notif.id}
                            className={`p-4 flex items-center justify-between cursor-pointer transition-shadow 
                                ${notif.leida ? 'bg-gray-100 text-gray-600 hover:shadow-md' : 'bg-white text-gray-800 hover:shadow-lg border-l-4 border-blue-600'}`}
                        >
                            <div className="flex items-center space-x-4 flex-1">
                                <Bell size={24} className={notif.leida ? 'text-gray-400' : 'text-blue-600'} />
                                <span className={`flex-1 whitespace-nowrap overflow-hidden text-ellipsis ${notif.leida ? 'font-normal' : 'font-semibold'}`}>
                                    {notif.mensaje}
                                </span>
                            </div>
                            <span className="text-sm text-gray-400 ml-4 shrink-0">
                                {notif.fecha}
                            </span>
                        </Card>
                    ))
                ) : (
                    <Card className="p-6 text-center text-gray-500">
                        No hay mensajes ni notificaciones recientes.
                    </Card>
                )}
            </div>
        </div>
    );
};