// src/services/onboarding.service.ts - MOCK

interface RegistroResultado {
    tenantId: string;
    claveUnica: string;
}

/**
 * Simula el registro de una nueva escuela en el Backend.
 * @param nombrePlantel El nombre de la escuela.
 * @param dominio El dominio elegido (ej: 'tesji').
 */
export const registrarNuevaEscuela = async (_nombrePlantel: string, dominio: string): Promise<RegistroResultado> => {
    // Simula un retraso de la API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validaciones básicas de MOCK
    if (dominio.toLowerCase().includes('global')) {
        throw new Error("El dominio 'global' ya está en uso.");
    }
    
    // Generación de datos MOCK de respuesta
    const nuevoTenantId = 'T-' + Math.floor(Math.random() * 900 + 100);
    const claveUnica = `CLAVE_${dominio.toUpperCase().substring(0, 4)}_${Math.floor(Math.random() * 100)}`;

    // La clave real se guarda en la base de datos del Tenant
    // nota: _nombrePlantel se acepta pero en este mock no se usa directamente

    return {
        tenantId: nuevoTenantId,
        claveUnica: claveUnica
    };
};