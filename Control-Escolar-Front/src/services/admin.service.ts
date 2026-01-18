// src/services/admin.service.ts
import api from './api'; // Asegúrate de que esta ruta apunte a tu configuración de axios
import type { User, DocenteProfile } from '../types/models'; 

export const adminService = {
    // === SECCIÓN DOCENTES ===

    /**
     * 1. Obtención real de todos los docentes de la escuela
     */
    getAllUsersByTenant: async (): Promise<User[]> => {
        const { data } = await api.get('/admin/docentes');
        return data.map((doc: any) => ({
            id: doc.id,
            nombre: doc.user?.fullName || doc.nombre,
            email: doc.user?.email || doc.email,
            rol: 'DOCENTE',
            clave: doc.claveEmpleado || doc.clave,
            tenantId: doc.user?.school?.id
        }));
    },

    /**
     * 2. Registro real de un nuevo docente
     */
    addNewUser: async (newUser: any): Promise<boolean> => {
        try {
            await api.post('/admin/docentes/registrar', {
                email: newUser.email,
                clave: newUser.clave,
                nombre: newUser.nombre,
                especialidad: newUser.especialidad || 'General',
                telefono: newUser.telefono || '0000000000'
            });
            return true;
        } catch (error) {
            console.error("Error al registrar docente:", error);
            return false;
        }
    },

    /**
     * 3. Obtener el perfil real de un docente por ID
     */
    getDocenteProfileById: async (docenteId: string): Promise<DocenteProfile | null> => {
        const { data } = await api.get(`/admin/docentes/${docenteId}/perfil`);
        return data;
    },

    /**
     * 4. Actualizar perfil en el Backend real (PATCH)
     */
    updateDocenteProfile: async (updatedProfile: DocenteProfile): Promise<DocenteProfile> => {
        const { data } = await api.patch(`/admin/docentes/${updatedProfile.id}/perfil`, updatedProfile);
        console.log("✅ Perfil actualizado en el servidor");
        return data;
    },

    // === SECCIÓN GRUPOS ===

    getGrupos: async () => {
        const { data } = await api.get('/admin/grupos'); 
        return data;
    },

    getAlumnosPorGrupo: async (grupoId: string) => {
        const { data } = await api.get(`/admin/grupos/${grupoId}/alumnos`);
        return data;
    },

    crearGrupo: async (grupoData: any) => {
        const { data } = await api.post('/admin/grupos', grupoData);
        return data;
    },

    actualizarGrupo: async (id: number | string, grupoData: any) => {
        const { data } = await api.patch(`/admin/grupos/${id}`, grupoData);
        return data;
    },

    eliminarGrupo: async (id: number | string) => {
        const { data } = await api.delete(`/admin/grupos/${id}`);
        return data;
    },

    // === SECCIÓN ESTADÍSTICAS ===

    getStats: async () => {
        const { data } = await api.get('/admin/stats');
        return data;
    },

    // === GESTIÓN ACADÉMICA (PLANES Y MATERIAS) ===

    getPlanes: async () => {
        const { data } = await api.get('/admin/planes');
        return data;
    },

    crearPlan: async (planData: any) => {
        const { data } = await api.post('/admin/planes', planData);
        return data;
    },

    actualizarPlan: async (id: string | number, planData: any) => {
        const { data } = await api.patch(`/admin/planes/${id}`, planData);
        return data;
    },

    getAsignaturas: async () => {
        const { data } = await api.get('/admin/asignaturas');
        return data;
    },

    crearAsignatura: async (asigData: any) => {
        const { data } = await api.post('/admin/asignaturas', asigData);
        return data;
    },

    actualizarAsignatura: async (id: string | number, asigData: any) => {
        const { data } = await api.patch(`/admin/asignaturas/${id}`, asigData);
        return data;
    },

    // === GESTIÓN DE ALUMNOS (Corrección aquí) ===

    /**
     * Obtener el historial académico real de un alumno
     */
    getHistorialAlumno: async (alumnoId: string) => {
        const { data } = await api.get(`/admin/alumnos/${alumnoId}/historial`);
        return data;
    },

    /**
     * Registrar un alumno nuevo en un grupo
     */
    registrarAlumno: async (alumnoData: { matricula: string; nombre: string; grupoId: string }) => {
        const { data } = await api.post('/admin/alumnos', alumnoData);
        return data;
    },

    /**
     * ✅ ELIMINAR ALUMNO (ESTA ES LA QUE FALTABA)
     */
    eliminarAlumno: async (id: string) => {
        const { data } = await api.delete(`/admin/alumnos/${id}`);
        return data;
    },

    /**
     * Obtener perfil completo del alumno (incluye pagos y solicitudes)
     */
    getAlumnoFullProfile: async (alumnoId: string) => {
        const { data } = await api.get(`/admin/alumnos/${alumnoId}/perfil-completo`);
        return data;
    },

    /**
     * Actualizar datos del alumno
     */
    updateAlumnoPerfil: async (alumnoId: string, datos: any) => {
        const { data } = await api.patch(`/admin/alumnos/${alumnoId}`, datos);
        return data;
    },

    // === COMUNICACIÓN Y REPORTES ===

    /**
     * Enviar un comunicado global o específico desde administración
     */
    enviarMensaje: async (mensajeData: { destinatario: string; asunto: string; cuerpo: string }) => {
        const { data } = await api.post('/admin/mensajes/enviar', mensajeData);
        return data;
    },

    /**
     * Obtener los filtros disponibles para la página de reportes
     */
    getReportFilters: async () => {
        const { data } = await api.get('/admin/reportes/filtros');
        return data; 
    },

    /**
     * Generar la data del reporte basado en los filtros
     */
    generarReporteAcademico: async (payload: any) => {
        const { data } = await api.post('/admin/reportes/generar', payload);
        return data;
    },

    /**
     * Descargar el reporte en formato PDF o Excel
     */
    exportarReporte: async (payload: any, formato: 'pdf' | 'xlsx') => {
        const { data } = await api.post(`/admin/reportes/exportar/${formato}`, payload, {
            responseType: 'blob'
        });
        return data;
    },

    // === RECUPERACIÓN DE CONTRASEÑA ===

    forgotPassword: async (email: string) => {
        const { data } = await api.post('/auth/forgot-password', { email });
        return data; 
    },

    resetPassword: async (token: string, password: string) => {
        const { data } = await api.post('/auth/reset-password', { token, password });
        return data;
    },
};

// Exportamos también las funciones individuales para no romper los componentes que las usan así
export const getDocenteProfileById = adminService.getDocenteProfileById;
export const updateDocenteProfile = adminService.updateDocenteProfile;