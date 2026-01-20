import type {
  HistorialAcademico,
  NotificacionDashboard,
  AlumnoProfileData,
  DocumentoSolicitado,
  DocumentoPagado,
  AlumnoDashboardSummary
} from '../types/models';
import api from './api';

// Utilidad para simular tiempo de espera
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// =========================================================
// 1. ASIGNATURAS (✅ CONECTADO Y VERIFICADO)
// =========================================================
export interface AsignaturaConHorario {
  id: number | string;
  materia: string;
  profesor: string;
  horarios: { dia: string; hora: string }[];
}

export const getMisAsignaturas = async (alumnoId: string): Promise<AsignaturaConHorario[]> => {
  try {
    // Coincide con: @Get('my-courses/:studentId')
    const response = await api.get<AsignaturaConHorario[]>(`/academic/my-courses/${alumnoId}`);
    return response.data;
  } catch (error) {
    console.error("Error getMisAsignaturas:", error);
    return [];
  }
};

// =========================================================
// 2. CALIFICACIONES (✅ CONECTADO Y VERIFICADO)
// =========================================================
export interface BoletaCalificacion {
  materia: string;
  u1: string;
  u2: string;
  u3: string;
  u4: string;
  u5: string;
  final: string;
}

export const getCalificacionesBoleta = async (alumnoId: string, periodo: string): Promise<BoletaCalificacion[]> => {
  try {
    // Coincide con: @Get('my-grades/:studentId')
    // El backend espera el query param ?periodo=...
    const url = `/academic/my-grades/${alumnoId}${periodo ? `?periodo=${periodo}` : ''}`;
    const response = await api.get<BoletaCalificacion[]>(url);
    return response.data;
  } catch (error) {
    console.error("Error getCalificacionesBoleta:", error);
    return [];
  }
};

// =========================================================
// 3. ASISTENCIA (✅ CONECTADO Y VERIFICADO)
// =========================================================
export interface AsistenciaData {
  estadisticas: { asistencia: number; faltas: number; retardos: number };
  fechas: { id: string; fecha: string; materia: string; tipo: 'Falta' | 'Retardo' }[];
  recordatorios: string[];
}

export const getAsistenciaData = async (alumnoId: string): Promise<AsistenciaData> => {
  try {
    // Coincide con: @Get('my-attendance/:studentId')
    const response = await api.get<AsistenciaData>(`/academic/my-attendance/${alumnoId}`);
    return response.data;
  } catch (error) {
    console.error("Error getAsistenciaData:", error);
    return {
      estadisticas: { asistencia: 0, faltas: 0, retardos: 0 },
      fechas: [],
      recordatorios: ["No se pudo cargar la información de asistencia."]
    };
  }
};

// =========================================================
// 4. HISTORIAL ACADÉMICO (⚠️ MOCK - NO HAY ENDPOINT EN BACK)
// =========================================================
// Tu AcademicController no tiene un endpoint para historial completo, 
// solo para calificaciones por periodo. Se mantiene simulado.
export const getHistorialAcademico = async (alumnoId: string): Promise<HistorialAcademico> => {
  try {
    // LLAMADA REAL AL BACKEND
    const response = await api.get<HistorialAcademico>(`/academic/my-academic-history/${alumnoId}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo historial académico:", error);
    // Retornamos un objeto vacío seguro en caso de error para no romper la pantalla
    return {
      promedioGeneral: 0,
      asignaturasAprobadas: 0,
      calificacionesDetalle: [],
      documentosDisponibles: []
    };
  }
};

// =========================================================
// 5. NOTIFICACIONES / MENSAJES (🔄 ADAPTADO AL BACKEND)
// =========================================================

export const getNotificaciones = async (alumnoId: string): Promise<NotificacionDashboard[]> => {
  try {
    // CAMBIO: Tu backend usa /academic/messages/inbox y obtiene el ID del token (req.user),
    // no de la URL. Asumimos que 'api' envía el token Bearer.
    const response = await api.get<any[]>(`/academic/messages/inbox`);

    // Mapeamos la respuesta del backend (InternalMessage) al formato del frontend
    return response.data.map((msg) => ({
      id: msg.id,
      titulo: msg.asunto, // Backend: asunto -> Frontend: titulo
      mensaje: msg.cuerpoMensaje, // Backend: cuerpoMensaje -> Frontend: mensaje
      fecha: msg.fechaEnvio,
      leida: msg.leido,
      tipo: 'info' // Valor por defecto
    }));
  } catch (error) {
    console.error("Error en getNotificaciones:", error);
    return [];
  }
};

export const marcarNotificacionComoLeida = async (notificacionId: string): Promise<void> => {
  try {
    // CAMBIO: Ajustado a la ruta de tu controlador: @Patch('messages/read/:id')
    await api.patch(`/academic/messages/read/${notificacionId}`);
  } catch (error) {
    console.error("Error al marcar notificación:", error);
  }
};

// =========================================================
// 6. PERFIL DEL ALUMNO (⚠️ OJO: RUTA FALTANTE EN BACK)
// =========================================================
// Tu AcademicController tiene 'getProfile' pero devuelve TeacherProfile.
// No veo un endpoint para StudentProfile en los archivos que subiste.
// Se mantiene apuntando a /student/profile por si tienes otro controlador no adjuntado.

export const getAlumnoProfileData = async (alumnoId: string): Promise<AlumnoProfileData> => {
  try {
    // Si no tienes un 'StudentController', necesitarás crear uno o agregar 
    // el endpoint getStudentProfile en AcademicController.
    const response = await api.get<any>(`/student/profile/${alumnoId}`);
    const data = response.data;

    const promedioGlobal = 8.5;

    return {
      resumen: {
        name: data.nombre || 'Sin Nombre',
        id: data.matricula || 'S/M',
        career: 'Ingeniería en Sistemas', // Hardcode o venir de BD
        semester: data.gradoActual || 'Indefinido',
        average: promedioGlobal,
        profileImageUrl: '/images/profile-placeholder.png',
      },
      personal: {
        fullName: data.nombre,
        id: data.matricula,
        birthDate: data.fechaNacimiento,
        gender: data.genero,
        email: data.email,
        phone: data.telefono,
        address: data.direccion,
        nationality: 'Mexicana',
        civilStatus: 'Soltero/a',
        bloodType: data.tipoSangre || 'N/A',
        disability: 'Ninguna',
        curp: data.curp || 'No registrada',
        nss: 'No registrado',
      },
      academic: {
        semester: data.gradoActual,
        average: promedioGlobal,
        status: 'Activo',
        approvedSubjects: 0,
        admissionDate: '2024-01-01',
        faculty: 'Ingeniería',
        studyPlan: '2020',
        modality: 'Escolarizada',
        turn: 'Matutino',
        period: 'Semestral',
        credits: 0,
      },
      payment: {
        balanceDue: 0.00,
        lastPaymentDate: '---',
      }
    };
  } catch (error: any) {
    console.error("Error en getAlumnoProfileData:", error);
    throw error;
  }
};

// =========================================================
// 7. PAGOS Y DOCUMENTOS (SIN CAMBIOS - ENDPOINTS NO ADJUNTADOS)
// =========================================================
// Asumo que tienes un FinanceController que no subiste.
export const getHistorialPagos = async (alumnoId: string): Promise<DocumentoPagado[]> => {
  try {
    const response = await api.get<DocumentoPagado[]>(`/finance/student-history/${alumnoId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getDocumentosSolicitados = async (alumnoId: string): Promise<DocumentoSolicitado[]> => {
  try {
    const response = await api.get<DocumentoSolicitado[]>(`/finance/student-pending/${alumnoId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getCatalogoDocumentos = async (): Promise<string[]> => {
  try {
    const response = await api.get<string[]>(`/finance/student-catalog-list`);
    return response.data;
  } catch (error) {
    return [];
  }
};

// =========================================================
// 8. DASHBOARD (⚠️ OJO: RUTA FALTANTE EN BACK)
// =========================================================

export const getAlumnoDashboardSummary = async (alumnoId: string): Promise<AlumnoDashboardSummary> => {
  try {
    // Llamada al nuevo endpoint consolidado
    const response = await api.get<any>(`/academic/dashboard/summary/${alumnoId}`);
    const data = response.data;

    return {
      promedioGeneral: data.promedioGeneral || 0,
      asistenciaPorcentaje: data.asistenciaPorcentaje || 0,

      // Mapeamos las notificaciones al formato del frontend
      // NOTA: Aquí resolvemos la diferencia de nombres (asunto -> titulo, leido -> leida)
      notificaciones: Array.isArray(data.notificaciones)
        ? data.notificaciones.map((msg: any) => ({
          id: msg.id,
          titulo: msg.asunto,          // Backend: asunto
          mensaje: msg.cuerpoMensaje,  // Backend: cuerpoMensaje
          fecha: msg.fechaEnvio,
          leida: msg.leido,            // Backend: leido -> Frontend: leida (¡Importante!)
          tipo: 'info'
        }))
        : []
    };
  } catch (error) {
    console.error("Error cargando dashboard:", error);
    // Retorno seguro en caso de error
    return {
      promedioGeneral: 0,
      asistenciaPorcentaje: 0,
      notificaciones: [],
    };
  }
};

// =========================================================
// 9. DETALLE ASISTENCIAS (✅ CONECTADO Y VERIFICADO)
// =========================================================

export interface AsistenciaDetalleItem {
  fecha: string;
  materia: string;
  estado: 'Falta' | 'Retardo' | 'Asistencia';
}

export const getDetalleAsistencias = async (alumnoId: string): Promise<AsistenciaDetalleItem[]> => {
  try {
    const response = await api.get<AsistenciaData>(`/academic/my-attendance/${alumnoId}`);
    const data = response.data; // TypeScript ya sabe que es AsistenciaData

    // La respuesta del back ya trae "materia" y "tipo" mapeados
    return data.fechas.map((item) => ({
      fecha: item.fecha,
      materia: item.materia,
      estado: item.tipo // El backend devuelve "Falta" o "Retardo"
    }));

  } catch (error) {
    console.error("Error en getDetalleAsistencias:", error);
    return [];
  }
};