// src/types/models.ts - CÓDIGO FINAL CORREGIDO Y COMPLETO

// =========================================================
// 1. Tipos de Roles y Configuración del Sistema (SaaS)
// =========================================================

// Tipos de Roles para la autenticación
export type Role = 'ADMIN' | 'DOCENTE' | 'ALUMNO';

// Configuración mínima y dinámica de un Tenant (Escuela)
export interface TenantConfig {
  id: string; 
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
  tenantId: string; 
}


// =========================================================
// 2. Tipos para Módulos Específicos
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
  // Usamos la interfaz exportada arriba
  rendimientoMateria: RendimientoMateria[];
  
  // Métricas Clave del dashboard
  totalEstudiantes?: number;
  estudiantesBajoRendimiento?: number;
  materiasImpartidas?: number;
  gruposAsignados?: number;
  estudiantesAsistenciaCritica?: number;
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

// 1. Tipo para la sección superior de resumen
export interface StudentProfileSummary {
    name: string;
    id: string; 
    career: string;
    semester: string;
    average: number;
    profileImageUrl: string;
}

// 2. Tipo para la información personal
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

// 3. Tipo para la información académica
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

// 4. Tipo de Datos de Pago
export interface PaymentInfo {
    balanceDue: number;
    lastPaymentDate: string;
}

// 5. Tipo principal que junta todos los datos del perfil
export interface AlumnoProfileData {
    resumen: StudentProfileSummary;
    personal: PersonalInfoType;
    academic: AcademicInfoType;
    payment: PaymentInfo;
}


// --- Tipos para la Página de Documentos y Pagos (AlumnoDocumentosPage) ---

// 1. Historial de documentos YA PAGADOS y finalizados
export interface DocumentoPagado {
    fecha: string; 
    concepto: string; 
    monto: number;
    estado: 'Pagado' | 'Pendiente' | 'Cancelado'; 
}

// 2. Documentos actualmente SOLICITADOS
export interface DocumentoSolicitado {
    fecha: string; 
    concepto: string;
    pago: number | '---';
}