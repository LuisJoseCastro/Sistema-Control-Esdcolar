import api from './api'; 
import type { User, DocenteProfile } from '../types/models'; 

export const adminService = {
    // === SECCIÓN DOCENTES ===
    getTeachers: async () => {
        const { data } = await api.get('/admin/docentes');
        return data;
    },

    getAllUsersByTenant: async (): Promise<User[]> => {
        const { data } = await api.get('/admin/docentes');
        return data.map((doc: any) => ({
            id: doc.id,
            nombre: doc.nombre,
            email: doc.email,
            rol: 'DOCENTE',
            clave: doc.clave,
            tenantId: doc.tenantId
        }));
    },

    registrarDocente: async (docenteData: any) => {
        const { data } = await api.post('/admin/docentes/registrar', docenteData);
        return data;
    },

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

    // ✅ Esta es la función que corregí/agregué para que coincida con tu backend
    getTeacherProfile: async (docenteId: string): Promise<DocenteProfile | null> => {
        const { data } = await api.get(`/admin/docentes/${docenteId}/perfil`);
        return data;
    },

    getDocenteProfileById: async (docenteId: string): Promise<DocenteProfile | null> => {
        const { data } = await api.get(`/admin/docentes/${docenteId}/perfil`);
        return data;
    },

    updateDocenteProfile: async (updatedProfile: DocenteProfile): Promise<DocenteProfile> => {
        const { data } = await api.patch(`/admin/docentes/${updatedProfile.id}/perfil`, updatedProfile);
        return data;
    },

    deleteDocente: async (id: string) => {
        const { data } = await api.delete(`/admin/docentes/${id}`);
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

    // === SECCIÓN ALUMNOS ===
    registrarAlumno: async (alumnoData: { matricula: string; nombre: string; grupoId: string }) => {
        const { data } = await api.post('/admin/alumnos', alumnoData);
        return data;
    },

    getAlumnoFullProfile: async (alumnoId: string) => {
        const { data } = await api.get(`/admin/alumnos/${alumnoId}/perfil-completo`);
        return data;
    },

    updateAlumnoPerfil: async (alumnoId: string, datos: any) => {
        const { data } = await api.patch(`/admin/alumnos/${alumnoId}`, datos);
        return data;
    },

    updateStudentProfile: async (alumnoId: string, datos: any) => {
        const { data } = await api.patch(`/admin/alumnos/${alumnoId}`, datos);
        return data;
    },

    eliminarAlumno: async (id: string) => {
        const { data } = await api.delete(`/admin/alumnos/${id}`);
        return data;
    },

    getHistorialAlumno: async (alumnoId: string) => {
        const { data } = await api.get(`/admin/alumnos/${alumnoId}/historial`);
        return data;
    },

    // === SECCIÓN GESTIÓN ACADÉMICA (NUEVO AGREGADO) ===
    getPlanes: async () => {
        const { data } = await api.get('/admin/planes-estudio'); 
        return data;
    },

    getAsignaturas: async () => {
        const { data } = await api.get('/admin/materias');
        return data;
    },

    crearPlan: async (planData: any) => {
        const { data } = await api.post('/admin/planes-estudio', planData);
        return data;
    },

    actualizarPlan: async (id: string | number, data: any) => {
        const { data: res } = await api.patch(`/admin/grupos/${id}`, data);
        return res;
    },

    crearAsignatura: async (asigData: any) => {
        const { data } = await api.post('/admin/materias', asigData);
        return data;
    },

    actualizarAsignatura: async (id: string | number, data: any) => {
        const { data: res } = await api.patch(`/admin/materias/${id}`, data);
        return res;
    },

    eliminarMateria: async (id: string | number) => {
        const { data } = await api.delete(`/admin/materias/${id}`);
        return data;
    },

    // === SECCIÓN MENSAJES ===
    enviarMensaje: async (payload: { tipo: string, targetId?: string, asunto: string, cuerpo: string }) => {
        const { data } = await api.post('/admin/mensajes/enviar', payload);
        return data;
    },

    getHistorialMensajes: async () => {
        const { data } = await api.get('/admin/mensajes/historial');
        return data;
    },

    // === REPORTES Y AUXILIARES ===
    getStats: async () => {
        const { data } = await api.get('/admin/stats');
        return data;
    },

    exportarReporte: async (payload: any, formato: 'pdf' | 'xlsx') => {
        const { data } = await api.post(`/admin/reportes/exportar/${formato}`, payload, {
            responseType: 'blob'
        });
        return data;
    },

    forgotPassword: async (email: string) => {
        const { data } = await api.post('/auth/forgot-password', { email });
        return data; 
    },

    resetPassword: async (token: string, password: string) => {
        const { data } = await api.post('/auth/reset-password', { token, password });
        return data;
    },
};

// Exportaciones individuales requeridas por tus otros componentes
export const getDocenteProfileById = adminService.getDocenteProfileById;
export const updateDocenteProfile = adminService.updateDocenteProfile;
export const updateStudentProfile = adminService.updateStudentProfile;
export const enviarMensaje = adminService.enviarMensaje;
export const getHistorialMensajes = adminService.getHistorialMensajes;