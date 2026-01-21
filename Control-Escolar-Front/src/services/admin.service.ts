import api from './api'; 
import type { User, DocenteProfile } from '../types/models'; 

export const adminService = {
    // === SECCIÓN DOCENTES ===
    getTeachers: async () => {
        const { data } = await api.get('/admin/docentes');
        return data.map((doc: any) => ({
            ...doc,
            clave: doc.claveEmpleado || (doc.id ? doc.id.substring(0, 8).toUpperCase() : 'S/C')
        }));
    },

    getAllUsersByTenant: async (): Promise<User[]> => {
        const { data } = await api.get('/admin/docentes');
        return data.map((doc: any) => ({
            id: doc.id,
            nombre: doc.nombre || doc.user?.fullName,
            email: doc.email,
            rol: 'DOCENTE',
            clave: doc.claveEmpleado || (doc.id ? doc.id.substring(0, 8).toUpperCase() : 'S/C'),
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

    getTeacherProfile: async (docenteId: string): Promise<DocenteProfile | null> => {
        const { data } = await api.get(`/admin/docentes/${docenteId}/perfil`);
        if (!data) return null;
        const idCorta = data.id ? data.id.substring(0, 8).toUpperCase() : 'S/C';
        return {
            ...data,
            clave: data.claveEmpleado || data.clave || idCorta,
            nombre: data.nombre || data.user?.fullName || 'Docente',
            email: data.email || data.user?.email
        };
    },

    getDocenteProfileById: async (docenteId: string): Promise<DocenteProfile | null> => {
        const { data } = await api.get(`/admin/docentes/${docenteId}/perfil`);
        if (!data) return null;
        const idCorta = data.id ? data.id.substring(0, 8).toUpperCase() : 'S/C';
        return {
            ...data,
            clave: data.claveEmpleado || data.clave || idCorta,
            nombre: data.nombre || data.user?.fullName || 'Docente',
            email: data.email || data.user?.email
        };
    },

    // ✅ CORREGIDO PARA GUARDAR EN BASE DE DATOS REAL (TABLA HORARIOS)
    updateDocenteProfile: async (updatedProfile: DocenteProfile): Promise<DocenteProfile> => {
        const payload = {
            ...updatedProfile,
            claveEmpleado: updatedProfile.clave 
        };
        // Cambiamos a PUT y a la ruta de academic para que el backend 
        // procese el desglose de materias y horas en la tabla 'horarios'
        const { data } = await api.put(`/academic/profile/${updatedProfile.id}`, payload);
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
        return data.map((alu: any) => ({
            ...alu,
            clave: alu.matricula || (alu.id ? alu.id.substring(0, 8).toUpperCase() : 'S/M')
        }));
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

    // === SECCIÓN GESTIÓN ACADÉMICA ===
    getPlanes: async () => {
        const { data } = await api.get('/admin/planes-estudio'); 
        return data;
    },

    getAsignaturas: async () => {
        const { data } = await api.get('/admin/materias');
        return data;
    },

    crearPlan: async (planData: { nombre: string; id_docente: string }) => {
        const { data } = await api.post('/admin/planes-estudio', planData);
        return data;
    },

    actualizarPlan: async (id: string | number, planData: any) => {
        const { data: res } = await api.patch(`/admin/planes-estudio/${id}`, planData);
        return res;
    },

    crearAsignatura: async (asigData: { materia: string; codigo: string; creditos: number }) => {
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

export const getDocenteProfileById = adminService.getDocenteProfileById;
export const updateDocenteProfile = adminService.updateDocenteProfile;
export const updateStudentProfile = adminService.updateStudentProfile;
export const enviarMensaje = adminService.enviarMensaje;
export const getHistorialMensajes = adminService.getHistorialMensajes;