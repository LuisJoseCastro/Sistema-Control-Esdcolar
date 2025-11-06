// src/services/admin.service.ts

import type { User } from '../types/models'; 

// MOCK: Lista de usuarios de diferentes roles
// NOTA: Asegúrate de que los tenantId coincidan con tu MOCK_TENANTS
const MOCK_USERS: User[] = [
    // --- Admin ---
    { id: 'a1', nombre: 'Admin Master', email: 'admin@escuela.com', rol: 'ADMIN', tenantId: 'T-123' },
    
    // --- Docentes (Para la gestión) ---
    { id: 'd1', nombre: 'Rodolfo Docente', email: 'docente@escuela.com', rol: 'DOCENTE', tenantId: 'T-123' },
    { id: 'd2', nombre: 'Marta Ríos', email: 'marta@escuela.com', rol: 'DOCENTE', tenantId: 'T-123' },
    
    // --- Alumnos (Para la gestión) ---
    { id: 'l1', nombre: 'Laura Alumna', email: 'alumno@escuela.com', rol: 'ALUMNO', tenantId: 'T-123' },
    { id: 'l2', nombre: 'Carlos Soto', email: 'carlos@escuela.com', rol: 'ALUMNO', tenantId: 'T-123' },
];

/**
 * 1. Simula la obtención de todos los usuarios de un tenant (para la gestión de usuarios).
 * @param tenantId El ID de la escuela actual.
 * @returns Promesa que resuelve a una lista de usuarios.
 */
export const getAllUsersByTenant = async (tenantId: string): Promise<User[]> => {
    // Retraso para simular una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filtra los usuarios que pertenecen al tenant actual
    return MOCK_USERS.filter(user => user.tenantId === tenantId);
};


/**
 * 2. Simula la adición de un nuevo usuario (Docente o Alumno)
 * @param newUser Objeto de usuario a agregar.
 * @returns Promesa de éxito o error.
 */
export const addNewUser = async (newUser: Omit<User, 'id'>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Simular que la operación fue exitosa
    console.log(`Usuario ${newUser.email} de rol ${newUser.rol} agregado al tenant ${newUser.tenantId}.`);

    // En un sistema real, aquí se llamaría a la API
    return true; 
};

// Puedes añadir más funciones aquí, como: 
// - deleteUser(userId: string)
// - updateUserRole(userId: string, newRole: Role)