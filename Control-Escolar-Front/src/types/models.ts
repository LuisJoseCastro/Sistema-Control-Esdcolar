// src/types/models.ts
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

// ✅ Agregamos export a estas interfaces para que AdminDocenteProfilePage las reconozca
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