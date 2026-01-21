// --- LO TUYO (Autenticación y Materias) ---
export interface AuthResponse {
    token: string;
    user: User;
}

export interface MateriaAsignada {
    id: string;
    nombre: string;
    grupo: string;
}

export interface TenantConfig {
    id: string;
    nombre: string;
}

// --- COMÚN / EQUIPO (Roles y Usuario Base) ---
export type UserRole = 'ADMIN' | 'DOCENTE' | 'ALUMNO';

export interface User {
    id: string;
    email: string;
    fullName: string;
    rol: UserRole;
    tenantId?: string; // Agregado para soportar tu lógica multitenant
    schoolId?: string;
}

// --- EQUIPO (Perfil Alumno y Grupos) ---
export interface StudentProfile {
    id: string;
    matricula: string;
    nombreCompleto: string;
    gradoActual: string;
    grupoId?: string;
    user?: User;
}

export interface Grupo {
    id: string;
    nombre: string;
    semestre: number;
    totalAlumnos?: number;
}

// --- EQUIPO (Definición de Horario) ---
export type HorarioType = Record<'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes', Record<string, string>>;

// --- FUSIÓN CRÍTICA (Perfil Docente) ---
// Aquí juntamos los campos que usa tu equipo (especialidad, telefono)
// con los que usas tú (horario, materiasAsignadas, clave)
export interface DocenteProfile extends User {
    // Campos tuyos necesarios para el Frontend
    clave: string;           
    nombre?: string;         
    
    // Campos del equipo / Base de datos
    claveEmpleado?: string;  
    especialidad?: string;
    telefono?: string;

    // Relaciones complejas (Fusión)
    materiasAsignadas?: MateriaAsignada[]; 
    horario?: HorarioType;   
}