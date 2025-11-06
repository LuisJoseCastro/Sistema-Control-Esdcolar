// src/services/alumno.service.ts
import type { Asignatura } from '../types/models';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// MOCK para la vista de Mis Asignaturas del Alumno
export const getMisAsignaturas = async (alumnoId: string): Promise<Asignatura[]> => {
  console.log(`[MOCK] Solicitando asignaturas para alumno: ${alumnoId}`);
  await wait(400);

  return [
    { id: 'm1', nombre: 'Matemáticas I', docente: 'Rodolfo Docente', promedio: 8.5 },
    { id: 'm2', nombre: 'Física', docente: 'Ana García', promedio: 9.0 },
  ];
};
// ... (Aquí iría getMisCalificaciones, getMiHorario, etc.)