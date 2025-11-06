// src/types/models.ts - CÓDIGO CORREGIDO Y OPTIMIZADO

// =========================================================
// 1. Tipos de Roles y Configuración del Sistema (SaaS)
// =========================================================

// Tipos de Roles para la autenticación
export type Role = 'ADMIN' | 'DOCENTE' | 'ALUMNO';

// Configuración mínima y dinámica de un Tenant (Escuela)
export interface TenantConfig {
  id: string; // ID interno del Tenant (Ej: T-123)
  nombre: string;
  logoUrl?: string;
  colorPrimario?: string; // Para branding dinámico (ej: bg-blue-800)
}

// Interfaz del usuario logueado (CLAVE SAAS: tenantId es OBLIGATORIO)
export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: Role; // Clave para la redirección y permisos
  tenantId: string; // <-- OBLIGATORIO: Define a qué escuela pertenece
}


// =========================================================
// 2. Tipos para Módulos Específicos
// =========================================================

// Tipos para el Módulo de Docente (Reportes y Calificaciones)
export interface ReporteSummary {
  promedioFinalGrupo: number;
  asistenciaPromedio: number;
  tasaAprobacion: number;
  rendimientoMateria: { materia: string; promedio: number; }[];
  // Añade aquí todas las métricas que viste en tu pantalla de Figma.
}

export interface CalificacionDetalle {
  alumnoId: string;
  nombre: string;
  parcial1: number | 'NA';
  parcial2: number | 'NA';
  final: number | 'NA';
  // Incluye los campos extra que aparecen en la tabla de Docente:
  parcial3?: number | 'NA';
  extraordinario?: string | 'NA'; 
}

// Tipos para el Módulo de Alumno
export interface Asignatura {
  id: string;
  nombre: string;
  docente: string;
  promedio: number;
}