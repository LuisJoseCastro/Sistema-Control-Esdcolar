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

// --- Nuevos tipos para Historial Académico ---

export interface CalificacionHistorial {
    asignatura: string;
    promedio: number;
    periodo: string; // Ejemplo: '2025-1'
}

export interface DocumentoAcademico {
    nombre: string;
    url: string; // URL simulada de descarga
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
    fecha: string; // Opcional: para mostrar la fecha de la notificación
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
    id: string; // ID del estudiante (no el ID de usuario del sistema)
    career: string;
    semester: string;
    average: number;
}

// 2. Tipo para la información personal
export interface PersonalInfoType {
    fullName: string;
    id: string; // ID del estudiante (no editable)
    birthDate: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
}

// 3. Tipo para la información académica
export interface AcademicInfoType {
    semester: string;
    average: number;
    status: string;
    approvedSubjects: number;
    admissionDate: string;
}

// 4. Tipo de Datos de Pago (para el mock)
export interface PaymentInfo {
    balanceDue: number;
    lastPaymentDate: string;
}


// src/types/models.ts - (AÑADIR AL FINAL)

// 1. Tipo para la sección superior de resumen
export interface StudentProfileSummary {
    name: string;
    id: string; // ID del estudiante (no el ID de usuario del sistema)
    career: string;
    semester: string;
    average: number;
    profileImageUrl: string;
}

// 2. Tipo para la información personal
export interface PersonalInfoType {
    fullName: string;
    id: string; // ID del estudiante (no editable)
    birthDate: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    // Detalle adicional
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
    // Detalle adicional
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



// src/types/models.ts (Añadir al final)

// --- Tipos para la Página de Documentos y Pagos (AlumnoDocumentosPage) ---

// 1. Historial de documentos YA PAGADOS y finalizados
export interface DocumentoPagado {
    fecha: string; // Fecha de pago o finalización
    concepto: string; // Nombre del documento
    monto: number;
    estado: 'Pagado' | 'Pendiente' | 'Cancelado'; // Aquí siempre será Pagado
}

// 2. Documentos actualmente SOLICITADOS
export interface DocumentoSolicitado {
    fecha: string; // Fecha de solicitud
    concepto: string;
    pago: number | '---'; // Monto o '---' si aún no se genera el adeudo
}