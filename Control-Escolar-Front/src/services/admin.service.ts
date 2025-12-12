// src/services/admin.service.ts

// 🛑 Importamos todos los tipos de models.ts
import type { User, DocenteProfile, HorarioType } from '../types/models'; 

// --- MOCK DE LISTA DE USUARIOS (Para la tabla de Docentes/Alumnos) ---
// Nota: Usamos el tipo DocenteProfile para Docentes para asegurar que la propiedad 'clave' exista.
const MOCK_USERS: (User & { clave?: string })[] = [
    // --- Admin ---
    { id: 'a1', nombre: 'Admin Master', email: 'admin@escuela.com', rol: 'ADMIN', tenantId: 'T-123', clave: 'ADM-001' },
    
    // --- Docentes (Para la gestión) ---
    { id: 'd1', nombre: 'Rodolfo Docente', email: 'drodolfo@tesji.com', rol: 'DOCENTE', tenantId: 'T-123', clave: 'DOC-1001' }, 
    { id: 'd2', nombre: 'Marta Ríos', email: 'marta@tesji.com', rol: 'DOCENTE', tenantId: 'T-123', clave: 'DOC-1002' },
    { id: 'd3', nombre: 'Pedro Ramírez', email: 'pedror@tesji.com', rol: 'DOCENTE', tenantId: 'T-123', clave: 'DOC-1003' },
    
    // --- Alumnos (Para la gestión) ---
    { id: 'l1', nombre: 'Laura Alumna', email: 'alumno@escuela.com', rol: 'ALUMNO', tenantId: 'T-123', clave: 'ALU-2001' },
    { id: 'l2', nombre: 'Carlos Soto', email: 'carlos@escuela.com', rol: 'ALUMNO', tenantId: 'T-123', clave: 'ALU-2002' },
];

/**
 * 1. Simula la obtención de todos los usuarios de un tenant (para la gestión de usuarios).
 */
export const getAllUsersByTenant = async (tenantId: string): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_USERS.filter(user => user.tenantId === tenantId) as User[];
};

/**
 * 2. Simula la adición de un nuevo usuario (Docente o Alumno).
 */
export const addNewUser = async (newUser: Omit<User, 'id'>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Usuario ${newUser.email} de rol ${newUser.rol} agregado al tenant ${newUser.tenantId}.`);
    return true; 
};

// --- MOCK DE PERFIL DE DOCENTE (Consolidado aquí) ---

const MOCK_DOCENTE_PROFILES: Record<string, DocenteProfile> = {
    'd1': { 
        id: 'd1', 
        nombre: 'Rodolfo Docente', 
        email: 'drodolfo@tesji.com', 
        rol: 'DOCENTE', 
        tenantId: 'T-123',
        clave: 'DOC-1001',
        especialidad: 'Ingeniería de Software',
        telefono: '55-1234-5678',
        materiasAsignadas: [
            { id: 'm1', nombre: 'Desarrollo Web', grupo: '101' },
            { id: 'm2', nombre: 'Bases de Datos', grupo: '102' },
        ],
        horario: {
            Lunes: { '08:00': 'Desarrollo Web (101)', '10:00': 'Descanso' },
            Martes: { '09:00': 'Bases de Datos (102)' },
            Miercoles: { '11:00': 'Desarrollo Web (101)' },
            Jueves: { '13:00': 'Tutoría' },
            Viernes: { '08:00': 'Bases de Datos (102)' },
        } as HorarioType // Casteo explícito del mock
    },
    'd2': {
        id: 'd2',
        nombre: 'Marta Ríos',
        email: 'marta@tesji.com',
        rol: 'DOCENTE',
        tenantId: 'T-123',
        clave: 'DOC-1002',
        especialidad: 'Matemáticas Avanzadas',
        telefono: '55-9876-5432',
        materiasAsignadas: [
            { id: 'm3', nombre: 'Cálculo Diferencial', grupo: '201' },
        ],
        horario: {
            Lunes: {},
            Martes: { '15:00': 'Cálculo Diferencial (201)' },
            Miercoles: {},
            Jueves: { '15:00': 'Cálculo Diferencial (201)' },
            Viernes: {},
        } as HorarioType
    }
};

/**
 * 3. Simula la obtención del perfil completo de un docente por ID.
 * Esta función toma la lógica del antiguo docente.service.ts
 */
export const getDocenteProfileById = async (docenteId: string): Promise<DocenteProfile | null> => {
    await new Promise(resolve => setTimeout(resolve, 400)); // Simular API delay
    
    return MOCK_DOCENTE_PROFILES[docenteId] || null;
};