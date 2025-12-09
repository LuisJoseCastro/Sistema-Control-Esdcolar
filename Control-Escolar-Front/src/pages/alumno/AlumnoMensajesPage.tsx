// src/pages/alumno/AlumnoMensajesPage.tsx

import React, { useState, useEffect } from 'react';
// 🛑 IMPORTACIONES DE UI UNIFICADA
import { Card } from '../../components/ui/Card'; // Nombrada
import Input from '../../components/ui/Input'; // Por defecto
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getNotificaciones } from '../../services/alumno.service';
import type { NotificacionDashboard } from '../../types/models';
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';

/**
 * Página: AlumnoMensajesPage
 * Descripción: Muestra la lista completa de notificaciones y mensajes del alumno.
 */
export const AlumnoMensajesPage: React.FC = () => {
    const { user } = useAuth();
    const [notificaciones, setNotificaciones] = useState<NotificacionDashboard[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // Añadimos estado para el buscador

    // 1. Efecto para cargar los datos
    useEffect(() => {
        const fetchNotificaciones = async () => {
            if (!user?.id) return;
            try {
                const data = await getNotificaciones(user.id);
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

    // Filtramos mensajes (para integrar el searchTerm)
    const filteredNotificaciones = notificaciones.filter(n =>
        n.mensaje.toLowerCase().includes(searchTerm.toLowerCase())
    );


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

            {/* Contenedor Principal: Búsqueda y Lista */}
            {/* 🛑 REFACTORIZADO: Usamos Card para el contenedor principal */}
            <Card className="max-w-4xl mx-auto p-6 space-y-4" variant="elevated">

                {/* Barra de Búsqueda */}
                <div className="relative mb-6">
                    {/* 🛑 REFACTORIZADO: Usamos el componente Input unificado */}
                    <Input
                        type="text"
                        placeholder="Buscar mensajes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        // Estilo del Input Docente (bg-gray-100)
                        className="w-full pl-10 py-3 rounded-lg bg-gray-100 border-gray-300"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>

                {/* Lista de Mensajes */}
                <div className="space-y-4">
                    {filteredNotificaciones.length > 0 ? (
                        filteredNotificaciones.map((notif) => (
                            <Card
                                key={notif.id}
                                // Aplicamos estilo 'flat' para un mejor contraste sobre la Card contenedora.
                                variant="flat"
                                className={`p-4 flex items-center justify-between cursor-pointer transition-shadow border-2
                                    ${notif.leida ? 'bg-gray-100 text-gray-600 hover:shadow-md' : 'bg-white text-gray-800 border-blue-600 shadow-sm'}`}
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
                        <Card className="p-6 text-center text-gray-500" variant="default">
                            No hay mensajes ni notificaciones recientes.
                        </Card>
                    )}
                </div>
            </Card>
        </div>
    );
};