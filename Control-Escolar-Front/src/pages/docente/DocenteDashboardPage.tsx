// src/pages/docente/DocenteDashboardPage.tsx

import React from 'react';
import { Card } from '../../components/ui/Card'; // Asegúrate de haber creado Card.tsx
// Podrías usar el mock de service aquí más adelante: 
// import { getReporteSummary } from '../../services/docente.service'; 

export const DocenteDashboardPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Docente</h1>
      <p className="text-xl mb-8">Resumen del Rendimiento Académico</p>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Basado en el diseño de Reportes */}
        <Card className="p-6 text-center text-xl">
          <p className="text-sm">Promedio Final Grupo</p>
          <span className="text-5xl font-extrabold">8.5</span>
        </Card>
        <Card className="p-6 text-center text-xl">
          <p className="text-sm">Asistencia Promedio</p>
          <span className="text-5xl font-extrabold">92 %</span>
        </Card>
        <Card className="p-6 text-center text-xl">
          <p className="text-sm">Tasa Aprobación</p>
          <span className="text-5xl font-extrabold">78 %</span>
        </Card>
      </div>
      
      <div className="mt-8 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold">Análisis Detallado</h2>
        <p>Aquí se renderizarán los gráficos de rendimiento y asistencia.</p>
      </div>
    </div>
  );
};