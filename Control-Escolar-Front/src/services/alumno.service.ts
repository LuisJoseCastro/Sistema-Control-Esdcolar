import type {
  HistorialAcademico,
  NotificacionDashboard,
  AlumnoProfileData,
  DocumentoSolicitado,
  DocumentoPagado,
  AlumnoDashboardSummary
} from '../types/models';
import api from './api';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    const url = `/academic/my-grades/${alumnoId}${periodo ? `?periodo=${periodo}` : ''}`;
    const response = await api.get<BoletaCalificacion[]>(url);
    return response.data;
  } catch (error) {
    console.error("Error getCalificacionesBoleta:", error);
    return [];
  }
};
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

export const getHistorialAcademico = async (alumnoId: string): Promise<HistorialAcademico> => {
  try {
    const response = await api.get<HistorialAcademico>(`/academic/my-academic-history/${alumnoId}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo historial académico:", error);
    return {
      promedioGeneral: 0,
      asignaturasAprobadas: 0,
      calificacionesDetalle: [],
      documentosDisponibles: []
    };
  }
};

export const getNotificaciones = async (alumnoId: string): Promise<NotificacionDashboard[]> => {
  try {
    const response = await api.get<any[]>(`/academic/messages/inbox`);

    return response.data.map((msg) => ({
      id: msg.id,
      titulo: msg.asunto,
      mensaje: msg.cuerpoMensaje,
      fecha: msg.fechaEnvio,
      leida: msg.leido,
      tipo: 'info'
    }));
  } catch (error) {
    console.error("Error en getNotificaciones:", error);
    return [];
  }
};

export const marcarNotificacionComoLeida = async (notificacionId: string): Promise<void> => {
  try {
    await api.patch(`/academic/messages/read/${notificacionId}`);
  } catch (error) {
    console.error("Error al marcar notificación:", error);
  }
};

export const getAlumnoProfileData = async (alumnoId: string): Promise<AlumnoProfileData> => {
  const response = await api.get(`/academic/student-profile/${alumnoId}`);
  return response.data;
};

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

export const getAlumnoDashboardSummary = async (alumnoId: string): Promise<AlumnoDashboardSummary> => {
  try {
    const response = await api.get<any>(`/academic/dashboard/summary/${alumnoId}`);
    const data = response.data;

    return {
      promedioGeneral: data.promedioGeneral || 0,
      asistenciaPorcentaje: data.asistenciaPorcentaje || 0,

      notificaciones: Array.isArray(data.notificaciones)
        ? data.notificaciones.map((msg: any) => ({
          id: msg.id,
          titulo: msg.asunto,
          mensaje: msg.cuerpoMensaje,
          fecha: msg.fechaEnvio,
          leida: msg.leido,
          tipo: 'info'
        }))
        : []
    };
  } catch (error) {
    console.error("Error cargando dashboard:", error);
    return {
      promedioGeneral: 0,
      asistenciaPorcentaje: 0,
      notificaciones: [],
    };
  }
};

export interface AsistenciaDetalleItem {
  fecha: string;
  materia: string;
  estado: 'Falta' | 'Retardo' | 'Asistencia';
}

export const getDetalleAsistencias = async (alumnoId: string): Promise<AsistenciaDetalleItem[]> => {
  try {
    const response = await api.get<AsistenciaData>(`/academic/my-attendance/${alumnoId}`);
    const data = response.data;
    return data.fechas.map((item) => ({
      fecha: item.fecha,
      materia: item.materia,
      estado: item.tipo
    }));

  } catch (error) {
    console.error("Error en getDetalleAsistencias:", error);
    return [];
  }
};