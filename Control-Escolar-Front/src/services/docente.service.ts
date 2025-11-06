// src/services/docente.service.ts
import type { ReporteSummary, CalificacionDetalle } from '../types/models';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// MOCK de Reportes (para la vista de Docente)
export const getReporteSummary = async (docenteId: string): Promise<ReporteSummary> => {
  console.log(`[MOCK] Solicitando resumen de reportes para: ${docenteId}`);
  await wait(500); // Simulación de latencia de red

  return {
    promedioFinalGrupo: 8.5,
    asistenciaPromedio: 92,
    tasaAprobacion: 78,
    rendimientoMateria: [
      { materia: 'Matemáticas', promedio: 8.8 },
      { materia: 'Física', promedio: 8.2 },
    ],
    // ... datos que alimentan las tarjetas y gráficos
  };
};

// MOCK de Calificaciones (para la pantalla de tu compañero)
export const getCalificacionesDetalle = async (grupoId: string): Promise<CalificacionDetalle[]> => {
  console.log(`[MOCK] Solicitando detalle de calificaciones para grupo: ${grupoId}`);
  await wait(600);
  
  return [
    { alumnoId: 'a1', nombre: 'Juan Pablo', parcial1: 85, parcial2: 90, final: 88 },
    { alumnoId: 'a2', nombre: 'María José', parcial1: 75, parcial2: 79, final: 75 },
    // ... más filas de la tabla de calificaciones
  ];
};