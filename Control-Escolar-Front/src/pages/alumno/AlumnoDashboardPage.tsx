//src/pages/alumno/AlumnoDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
// Eliminamos la importación directa de Bell y UserIcon ya que vienen de UserHeaderIcons
import { useAuth } from '../../hooks/useAuth';
import type { AlumnoDashboardSummary } from '../../types/models';
// ✅ Importamos el componente reutilizable
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';
// Eliminamos la importación directa de Bell, UserIcon
import { Bell } from 'lucide-react'; // Bell es necesario para renderizar en las notificaciones

// --- MOCK SERVICE (Normalmente iría en src/services/alumno.service.ts) ---
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAlumnoDashboardSummary = async (alumnoId: string): Promise<AlumnoDashboardSummary> => {
  console.log(`[MOCK] Obteniendo resumen de dashboard para alumno: ${alumnoId}`);
  await wait(700); // Simular carga

  return {
    promedioGeneral: 8.5,
    asistenciaPorcentaje: 90,
    notificaciones: [
      { id: 'n1', mensaje: 'Nueva tarea en Matemáticas I', leida: false, fecha: '04/10/24' },
      { id: 'n2', mensaje: 'Recordatorio: Pago de colegiatura vence pronto', leida: false, fecha: '04/09/24' },
      { id: 'n3', mensaje: 'Tu calificación de Física ya está disponible', leida: true, fecha: '03/10/24' },
    ],
  };
};
// --- FIN MOCK SERVICE ---


export const AlumnoDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<AlumnoDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      try {
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

  // Calculamos el conteo de notificaciones no leídas
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
      <div className="p-8">
        <h1 className="text-4xl font-light text-gray-800 mb-6">Mi Inicio</h1>
        <p className="text-red-500">No se pudieron cargar los datos del panel. Intenta de nuevo.</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-full">

      {/* Encabezado con título e íconos */}
      <header className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-8">
        <h1 className="text-4xl font-[Kaushan Script] text-gray-800">
          Mi Inicio
        </h1>
        {/* ✅ REEMPLAZADO por el componente reutilizable */}
        <UserHeaderIcons unreadCount={unreadCount} />
      </header>

      {/* Tarjetas de Resumen */}
      <div className="flex flex-wrap gap-8 mb-12 justify-start">
        {/* Promedio General */}
        <Card className="p-10 text-center shadow-xl w-72">
          <p className="text-2xl text-gray-700 font-semibold mb-2">Promedio General</p>
          <span className="text-7xl font-extrabold text-gray-900 leading-none">
            {dashboardData.promedioGeneral.toFixed(1)}
          </span>
        </Card>

        {/* Porcentaje de Asistencia */}
        <Card className="p-10 text-center shadow-xl w-72"> {/* Se mantuvo el borde morado */}
          <p className="text-2xl text-gray-700 font-semibold mb-2">Asistencia</p>
          <span className="text-7xl font-extrabold text-gray-900 leading-none">
            {dashboardData.asistenciaPorcentaje}%
          </span>
        </Card>
      </div>

      {/* Sección de Notificaciones */}
      <div className="bg-white rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Notificaciones</h2>
        <div className="space-y-4">
          {dashboardData.notificaciones.length > 0 ? (
            dashboardData.notificaciones.map(notif => (
              <Card
                key={notif.id}
                className={`p-5 flex items-center shadow-sm ${notif.leida ? 'bg-gray-50 text-gray-500' : 'bg-blue-50 text-blue-800 font-medium'}`}
              >
                <Bell size={20} className="mr-3 shrink-0" />
                <p className="text-base grow">{notif.mensaje}</p>
                {!notif.leida && (
                  <span className="ml-4 text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded-full">Nueva</span>
                )}
              </Card>
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