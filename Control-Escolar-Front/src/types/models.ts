// src/types/models.ts - CÓDIGO ACTUALIZADO Y COMPLETO

// =========================================================
// 1. Tipos de Roles y Configuración del Sistema (SaaS)
// =========================================================

export type Role = 'ADMIN' | 'DOCENTE' | 'ALUMNO';

export interface TenantConfig {
    id: string; // ID interno del Tenant (Ej: T-123)
    nombre: string;
    logoUrl?: string;
    colorPrimario?: string;
}

// Interfaz del usuario logueado
export interface User {
    id: string;
    nombre: string;
    email: string;
    rol: Role; 
    tenantId: string; // A qué escuela pertenece
}


// =========================================================
// 2. Tipos para Módulo de Docente (Perfil Admin/Docente)
// =========================================================

// Tipos base para el perfil del docente
export interface MateriaAsignada {
    id: string;
    nombre: string;
    grupo: string;
}

export type HorarioType = Record<'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes', Record<string, string>>;

// Interfaz que extiende User para el perfil detallado del Docente
export interface DocenteProfile extends User {
    clave: string; // Clave institucional del docente (DOC-1001)
    especialidad: string;
    telefono: string;
    materiasAsignadas: MateriaAsignada[];
    horario: HorarioType;
}


// =========================================================
// 3. Tipos para Módulos Específicos (Resto de tus tipos)
// =========================================================

// 🚨 CORRECCIÓN CLAVE: Interfaz RendimientoMateria extraída y exportada
export interface RendimientoMateria {
    materia: string;
    promedio: number;
}

// Tipos para el Módulo de Docente (Reportes y Calificaciones)
export interface ReporteSummary {
    promedioFinalGrupo: number;
    asistenciaPromedio: number;
    tasaAprobacion: number;
    rendimientoMateria: { materia: string; promedio: number; }[];
}

export interface CalificacionDetalle {
    alumnoId: string;
    nombre: string;
    parcial1: number | 'NA';
    parcial2: number | 'NA';
    final: number | 'NA';
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

// --- Nuevos tipos para Historial Académico ---

export interface CalificacionHistorial {
    asignatura: string;
    promedio: number;
    periodo: string; 
}

export interface DocumentoAcademico {
    nombre: string;
    url: string; 
}

export interface HistorialAcademico {
    promedioGeneral: number;
    asignaturasAprobadas: number;
    calificacionesDetalle: CalificacionHistorial[];
    documentosDisponibles: DocumentoAcademico[];
}

// --- Tipos para el AlumnoDashboardPage ---
export interface NotificacionDashboard {
    id: string;
    mensaje: string;
    leida: boolean;
    fecha: string; 
}

export interface AlumnoDashboardSummary {
    promedioGeneral: number;
    asistenciaPorcentaje: number;
    notificaciones: NotificacionDashboard[];
}

// --- Tipos para la Página de Perfil (AlumnoPerfilPage) ---

export interface StudentProfileSummary {
    name: string;
    id: string; 
    career: string;
    semester: string;
    average: number;
    profileImageUrl: string;
}

export interface PersonalInfoType {
    fullName: string;
    id: string;
    birthDate: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    nationality: string;
    civilStatus: string;
    bloodType: string;
    disability: string;
    curp: string;
    nss: string;
}

export interface AcademicInfoType {
    semester: string;
    average: number;
    status: string;
    approvedSubjects: number;
    admissionDate: string;
    faculty: string;
    studyPlan: string;
    modality: string;
    turn: string;
    period: string;
    credits: number;
}

export interface PaymentInfo {
    balanceDue: number;
    lastPaymentDate: string;
}

export interface AlumnoProfileData {
    resumen: StudentProfileSummary;
    personal: PersonalInfoType;
    academic: AcademicInfoType;
    payment: PaymentInfo;
}

// --- Tipos para la Página de Documentos y Pagos ---

export interface DocumentoPagado {
    fecha: string; 
    concepto: string; 
    monto: number;
    estado: 'Pagado' | 'Pendiente' | 'Cancelado'; 
}

export interface DocumentoSolicitado {
    fecha: string; 
    concepto: string;
    pago: number | '---'; 
}