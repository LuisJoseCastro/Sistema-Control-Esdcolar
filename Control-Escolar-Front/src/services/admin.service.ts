// src/services/admin.service.ts

import type { User, DocenteProfile, HorarioType } from '../types/models'; 

// --- MOCK DE LISTA DE USUARIOS ---
const MOCK_USERS: (User & { clave?: string })[] = [
    { id: 'a1', nombre: 'Admin Master', email: 'admin@escuela.com', rol: 'ADMIN', tenantId: 'T-123', clave: 'ADM-001' },
    { id: 'd1', nombre: 'Rodolfo Docente', email: 'drodolfo@tesji.com', rol: 'DOCENTE', tenantId: 'T-123', clave: 'DOC-1001' }, 
    { id: 'd2', nombre: 'Marta Ríos', email: 'marta@tesji.com', rol: 'DOCENTE', tenantId: 'T-123', clave: 'DOC-1002' },
    { id: 'd3', nombre: 'Pedro Ramírez', email: 'pedror@tesji.com', rol: 'DOCENTE', tenantId: 'T-123', clave: 'DOC-1003' },
    { id: 'l1', nombre: 'Laura Alumna', email: 'alumno@escuela.com', rol: 'ALUMNO', tenantId: 'T-123', clave: 'ALU-2001' },
    { id: 'l2', nombre: 'Carlos Soto', email: 'carlos@escuela.com', rol: 'ALUMNO', tenantId: 'T-123', clave: 'ALU-2002' },
];

// 🛑 HACEMOS EL MOCK DE PERFILES MUTABLE (usando let)
let MOCK_DOCENTE_PROFILES: Record<string, DocenteProfile> = {
    'd1': { 
        id: 'd1', nombre: 'Rodolfo Docente', email: 'drodolfo@tesji.com', rol: 'DOCENTE', tenantId: 'T-123',
        clave: 'DOC-1001', especialidad: 'Ingeniería de Software', telefono: '55-1234-5678',
        materiasAsignadas: [ { id: 'm1', nombre: 'Desarrollo Web', grupo: '101' } ],
        horario: { Lunes: { '08:00': 'Desarrollo Web (101)' }, Martes: {}, Miercoles: {}, Jueves: {}, Viernes: {} } as HorarioType
    },
    'd2': {
        id: 'd2', nombre: 'Marta Ríos', email: 'marta@tesji.com', rol: 'DOCENTE', tenantId: 'T-123',
        clave: 'DOC-1002', especialidad: 'Matemáticas Avanzadas', telefono: '55-9876-5432',
        materiasAsignadas: [ { id: 'm3', nombre: 'Cálculo Diferencial', grupo: '201' } ],
        horario: { Lunes: {}, Martes: { '15:00': 'Cálculo Diferencial (201)' }, Miercoles: {}, Jueves: { '15:00': 'Cálculo Diferencial (201)' }, Viernes: {} } as HorarioType
    }
};

/**
 * 1. Simula la obtención de todos los usuarios de un tenant (incluyendo los inyectados).
 */
export const getAllUsersByTenant = async (tenantId: string): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Combinamos la lista estática (MOCK_USERS) con los perfiles dinámicos
    const allDocenteProfiles = Object.values(MOCK_DOCENTE_PROFILES);
    const combinedUsers = MOCK_USERS.filter(u => u.rol !== 'DOCENTE').concat(allDocenteProfiles as (User & { clave?: string })[]);

    return combinedUsers.filter(user => user.tenantId === tenantId) as User[];
};

/**
 * 2. Simula la adición de un nuevo usuario (Placeholder).
 */
export const addNewUser = async (newUser: Omit<User, 'id'>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Usuario ${newUser.email} de rol ${newUser.rol} agregado al tenant ${newUser.tenantId}.`);
    return true; 
};

/**
 * 3. Simula la obtención del perfil completo de un docente por ID.
 */
export const getDocenteProfileById = async (docenteId: string): Promise<DocenteProfile | null> => {
    await new Promise(resolve => setTimeout(resolve, 400)); // Simular API delay
    
    // 🛑 BUSCA EN EL MOCK MUTABLE
    return MOCK_DOCENTE_PROFILES[docenteId] || null;
};


// 🛑 NUEVA FUNCIÓN: Permite que el frontend inyecte el perfil completo recién creado.
export const injectNewDocenteProfile = (profile: DocenteProfile): void => {
    MOCK_DOCENTE_PROFILES[profile.id] = profile;
    console.log(`[MOCK] Perfil de ${profile.nombre} inyectado al servicio de perfiles.`);
};