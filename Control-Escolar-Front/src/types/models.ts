// src/types/models.ts

// =========================================================
// 1. Tipos de Autenticación y Usuarios
// =========================================================

export type Role = 'ADMIN' | 'DOCENTE' | 'ALUMNO';

export interface User {
    id: string;
    nombre: string;
    email: string;
    rol: Role;
    tenantId: string;
    school?: {
        id: string;
        nombreEscuela: string;
    };
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

// =========================================================
// 2. Módulo de Gestión Docente (Perfil y Horarios)
// =========================================================

export interface MateriaAsignada {
    id: string;
    nombre: string;
    grupo: string;
}

/**
 * Representa la estructura del horario semanal del docente.
 * Ejemplo: horario['Lunes']['08:00'] = "Matemáticas (Grupo A)"
 */
export type HorarioType = Record<'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes', Record<string, string>>;

/**
 * Perfil completo del Docente. 
 * Extiende de User para incluir nombre y email en el primer nivel.
 */
export interface DocenteProfile extends User {
    clave: string;           // Clave institucional (claveEmpleado)
    especialidad: string;
    telefono: string;
    materiasAsignadas: MateriaAsignada[];
    horario: HorarioType;
}

// =========================================================
// 3. Gestión Institucional y Académica
// =========================================================

export interface TenantConfig {
    id: string;
    nombre: string;
    logoUrl?: string;
    colorPrimario?: string;
}

export interface RendimientoMateria {
    materia: string;
    promedio: number;
}

export interface ReporteSummary {
    promedioFinalGrupo: number;
    asistenciaPromedio: number;
    tasaAprobacion: number;
    rendimientoMateria: RendimientoMateria[];
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

// =========================================================
// 4. Módulo de Alumno y Expediente Académico
// =========================================================

export interface Asignatura {
    id: string;
    nombre: string;
    docente: string;
    promedio: number;
}

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

// --- Dashboard Alumno ---

export interface NotificacionDashboard {
    id: string;
    mensaje: string;
    leida: boolean;
    fecha: string;

    titulo?: string;
    tipo?: string;
}

export interface AlumnoDashboardSummary {
    promedioGeneral: number;
    asistenciaPorcentaje: number;
    notificaciones: NotificacionDashboard[];
}

// =========================================================
// 5. Datos Personales y Financieros del Estudiante
// =========================================================

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