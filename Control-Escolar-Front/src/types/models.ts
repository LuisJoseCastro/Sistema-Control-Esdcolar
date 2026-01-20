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

export interface MateriaAsignada {
    id: string;
    nombre: string;
    grupo: string;
}

export type HorarioType = Record<'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes', Record<string, string>>;


export interface DocenteProfile extends User {
    clave: string;
    especialidad: string;
    telefono: string;
    materiasAsignadas: MateriaAsignada[];
    horario: HorarioType;
}

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
    curp: string;
}

export interface AcademicInfoType {
    semester: string;
    average: number;
    status: string;
    approvedSubjects: number;
}

export interface PaymentInfo {
    balanceDue: number;
}

export interface AlumnoProfileData {
    resumen: {
        name: string;
        id: string;
        career: string;
        semester: string;
        average: number;
    };
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