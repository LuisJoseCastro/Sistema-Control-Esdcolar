// src/pages/alumno/AlumnoDashboardPage.tsx

import React, { useState, useEffect } from 'react';
// Importamos Componentes UI
// Card se mantiene como importación nombrada si Card.tsx exporta de forma nombrada (export const Card...)
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';
// Importamos Iconos
import { Bell } from 'lucide-react';
// Importamos Hooks y Servicios (Lógica separada)
import { useAuth } from '../../hooks/useAuth';
import { getAlumnoDashboardSummary } from '../../services/alumno.service'; // <--- ¡Importamos del servicio!
import type { AlumnoDashboardSummary } from '../../types/models';

export const AlumnoDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<AlumnoDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Efecto para cargar datos al montar el componente
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      try {
        // Llamamos al servicio externo (Clean Code)
        const data = await getAlumnoDashboardSummary(user.id);
        setDashboardData(data);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Calculamos notificaciones no leídas para el icono de la campana
  const unreadCount = dashboardData?.notificaciones.filter(n => !n.leida).length || 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <LoadingSpinner text="Cargando panel de inicio..." />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-8 text-center text-red-500">
        Error al cargar los datos. Intenta recargar la página.
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-full">

      {/* ENCABEZADO */}
      <header className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-8">
        <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
          Bienvenido
        </h1>
        <UserHeaderIcons unreadCount={unreadCount} />
      </header>

      {/* TARJETAS DE RESUMEN (KPIs) */}
      <div className="flex flex-wrap gap-8 mb-12">

        {/* Promedio General */}
        {/* 🛑 CORRECCIÓN: Añadir bg-white ya que la nueva Card no tiene fondo fijo */}
        <Card className="bg-gray-100! p-10 text-center shadow-xl w-72 border-t-4 ">
          <p className="text-2xl text-gray-600 font-semibold mb-2">Promedio</p>
          <span className="text-7xl font-extrabold text-gray-900 leading-none">
            {dashboardData.promedioGeneral.toFixed(1)}
          </span>
        </Card>

        {/* Porcentaje de Asistencia */}
        {/* 🛑 CORRECCIÓN: Añadir bg-white ya que la nueva Card no tiene fondo fijo */}
        <Card className="bg-gray-100! p-10 text-center shadow-xl w-72 border-t-4 ">
          <p className="text-2xl text-gray-600 font-semibold mb-2">Asistencia</p>
          <span className="text-7xl font-extrabold text-gray-900 leading-none">
            {dashboardData.asistenciaPorcentaje}%
          </span>
        </Card>
      </div>

      {/* SECCIÓN DE NOTIFICACIONES */}
      {/* Este contenedor no usa Card, pero se ve afectado por la Card del Docente si se cambia a la versión "flat" */}
      <div className="bg-gray-100! rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Bell className="text-blue-600" /> Últimas Notificaciones
        </h2>

        <div className="space-y-4">
          {dashboardData.notificaciones.length > 0 ? (
            dashboardData.notificaciones.map(notif => (
              <div
                key={notif.id}
                // Este DIV debe ser blanco si no está leído.
                className={`p-4 rounded-lg flex items-start gap-4 transition-all
                  ${notif.leida
                    ? 'bg-gray-50 text-gray-500'
                    : 'bg-white text-blue-900 border-l-4 border-blue-500 shadow-sm'
                  }`}
              >
                <div className="mt-1">
                  {/* Punto indicador de estado */}
                  <div className={`h-3 w-3 rounded-full ${notif.leida ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium">{notif.mensaje}</p>
                  <p className="text-xs opacity-70 mt-1">{notif.fecha}</p>
                </div>
                {!notif.leida && (
                  <span className="text-xs font-bold bg-blue-200 text-blue-800 px-2 py-1 rounded">
                    NUEVA
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No tienes notificaciones nuevas.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default AlumnoDashboardPage;
