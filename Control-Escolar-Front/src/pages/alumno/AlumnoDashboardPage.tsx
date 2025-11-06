// src/pages/alumno/AlumnoDashboardPage.tsx

import React from 'react';
import { Card } from '../../components/ui/Card'; 

export const AlumnoDashboardPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Mi Inicio (Alumno)</h1>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Basado en el diseño del dashboard del Alumno */}
        <Card className="p-10 text-center">
          <p className="text-2xl">Promedio General</p>
          <span className="text-7xl font-extrabold mt-2">8.5</span>
        </Card>
        <Card className="p-10 text-center">
          <p className="text-2xl">Asistencia</p>
          <span className="text-7xl font-extrabold mt-2">90%</span>
        </Card>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Notificaciones</h2>
        <p>Lista de notificaciones pendientes (Aquí irán los componentes de Notificación).</p>
      </div>
    </div>
  );
};