// src/services/alumno.service.ts

import type {
  HistorialAcademico,
  NotificacionDashboard,
  AlumnoProfileData,
  DocumentoSolicitado,
  DocumentoPagado,
  AlumnoDashboardSummary
} from '../types/models';

// =========================================================
// 🔌 CONFIGURACIÓN DE CONEXIÓN
// =========================================================

const API_URL = 'http://localhost:3000'; // Asegúrate que coincida con tu backend

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Utilidad para simular tiempo de espera (para los mocks que quedan)
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// =========================================================
// 1. ASIGNATURAS (✅ CONECTADO AL BACKEND)
// =========================================================

export interface AsignaturaConHorario {
  id: number | string;
  materia: string;
  profesor: string;
  horarios: { dia: string; hora: string }[];
}

export const getMisAsignaturas = async (alumnoId: string): Promise<AsignaturaConHorario[]> => {
  try {
    const response = await fetch(`${API_URL}/academic/my-courses/${alumnoId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Error al cargar asignaturas: ${response.statusText}`);
    return await response.json();

  } catch (error) {
    console.error("Error getMisAsignaturas:", error);
    return [];
  }
};

// =========================================================
// 2. CALIFICACIONES (✅ CONECTADO AL BACKEND)
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
    const url = `${API_URL}/academic/my-grades/${alumnoId}${periodo ? `?periodo=${periodo}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Error al cargar calificaciones: ${response.statusText}`);
    return await response.json();

  } catch (error) {
    console.error("Error getCalificacionesBoleta:", error);
    return [];
  }
};

// =========================================================
// 3. ASISTENCIA (✅ CONECTADO AL BACKEND)
// =========================================================

export interface AsistenciaData {
  estadisticas: { asistencia: number; faltas: number; retardos: number };
  fechas: { fecha: string; tipo: 'Falta' | 'Retardo' }[];
  recordatorios: string[];
}

export const getAsistenciaData = async (alumnoId: string): Promise<AsistenciaData> => {
  try {
    const response = await fetch(`${API_URL}/academic/my-attendance/${alumnoId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Error al cargar asistencia: ${response.statusText}`);
    return await response.json();

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
// 4. HISTORIAL ACADÉMICO (MOCK TEMPORAL)
// =========================================================
// Se mantiene simulado hasta definir el endpoint de historial completo

export const getHistorialAcademico = async (alumnoId: string): Promise<HistorialAcademico> => {
  console.log(`[MOCK] Solicitando historial académico para alumno: ${alumnoId}`);
  await wait(800);

  return {
    promedioGeneral: 8.5,
    asignaturasAprobadas: 8,
    calificacionesDetalle: [
      { asignatura: 'Matemáticas Avanzadas', promedio: 8.8, periodo: '2025-1' },
      { asignatura: 'Programación Orientada a Objetos', promedio: 9.5, periodo: '2025-1' },
      { asignatura: 'Bases de Datos', promedio: 7.9, periodo: '2025-1' },
    ],
    documentosDisponibles: [
      { nombre: 'Boleta de Calificaciones', url: '#' },
      { nombre: 'Constancia de Estudios', url: '#' },
    ],
  };
};

// =========================================================
// 5. NOTIFICACIONES (✅ CONECTADO AL BACKEND)
// =========================================================

export const getNotificaciones = async (alumnoId: string): Promise<NotificacionDashboard[]> => {
  try {
    const response = await fetch(`${API_URL}/communications/notifications/${alumnoId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Error notificaciones: ${response.statusText}`);
    return await response.json();

  } catch (error) {
    console.error("Error en getNotificaciones:", error);
    return [];
  }
};

export const marcarNotificacionComoLeida = async (notificacionId: string): Promise<void> => {
  try {
    await fetch(`${API_URL}/communications/notifications/${notificacionId}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error al marcar notificación:", error);
  }
};

// =========================================================
// 6. PERFIL DEL ALUMNO (✅ CONECTADO AL BACKEND)
// =========================================================

export const getAlumnoProfileData = async (alumnoId: string): Promise<AlumnoProfileData> => {
  try {
    const response = await fetch(`${API_URL}/student/profile/${alumnoId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('Sesión expirada o no autorizada');
      if (response.status === 404) throw new Error('Perfil de alumno no encontrado');
      throw new Error(`Error del servidor: ${response.statusText}`);
    }

    const data = await response.json();

    // 💡 TRUCO: Definimos el promedio global aquí para usarlo en ambos lugares
    // (Idealmente esto vendría del backend en el futuro)
    const promedioGlobal = 8.5;

    return {
      resumen: {
        name: data.nombre || 'Sin Nombre',
        id: data.matricula || 'S/M',
        career: 'Ingeniería en Sistemas',
        semester: data.gradoActual || 'Indefinido',

        // 👇 AQUÍ ESTABA EL 0.0, LO CAMBIAMOS:
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

        // 👇 AQUÍ TAMBIÉN USAMOS LA VARIABLE:
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

  } catch (error) {
    console.error("Error en getAlumnoProfileData:", error);
    throw error;
  }
};
// =========================================================
// 7. PAGOS Y DOCUMENTOS (✅ CONECTADO AL BACKEND)
// =========================================================

// A) HISTORIAL DE PAGOS (Lo que ya está aprobado)
export const getHistorialPagos = async (alumnoId: string): Promise<DocumentoPagado[]> => {
  try {
    // GET /finance/student-history/:studentId
    const response = await fetch(`${API_URL}/finance/student-history/${alumnoId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Error historial pagos: ${response.statusText}`);
    return await response.json();

  } catch (error) {
    console.error("Error getHistorialPagos:", error);
    return [];
  }
};

// B) DOCUMENTOS SOLICITADOS (Lo que está pendiente de pago o aprobación)
export const getDocumentosSolicitados = async (alumnoId: string): Promise<DocumentoSolicitado[]> => {
  try {
    // GET /finance/student-pending/:studentId
    const response = await fetch(`${API_URL}/finance/student-pending/${alumnoId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Error documentos solicitados: ${response.statusText}`);
    return await response.json();

  } catch (error) {
    console.error("Error getDocumentosSolicitados:", error);
    return [];
  }
};

// C) CATÁLOGO (Lista de trámites disponibles para solicitar)
export const getCatalogoDocumentos = async (): Promise<string[]> => {
  try {
    // GET /finance/student-catalog-list
    const response = await fetch(`${API_URL}/finance/student-catalog-list`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Error catálogo: ${response.statusText}`);
    return await response.json();

  } catch (error) {
    console.error("Error getCatalogoDocumentos:", error);
    return [];
  }
};

// =========================================================
// 8. DASHBOARD (✅ CONECTADO AL BACKEND)
// =========================================================

export const getAlumnoDashboardSummary = async (alumnoId: string): Promise<AlumnoDashboardSummary> => {
  try {
    const response = await fetch(`${API_URL}/student/dashboard/summary/${alumnoId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener resumen del dashboard: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      promedioGeneral: Number(data.promedioGeneral) || 0,
      asistenciaPorcentaje: Number(data.asistenciaPorcentaje) || 0,
      notificaciones: data.notificaciones || [],
    };

  } catch (error) {
    console.error("Error en getAlumnoDashboardSummary:", error);
    return {
      promedioGeneral: 0,
      asistenciaPorcentaje: 0,
      notificaciones: [],
    };
  }
};

// Interfaz para la tabla de detalles
export interface AsistenciaDetalleItem {
  fecha: string;
  materia: string;
  estado: 'Falta' | 'Retardo' | 'Asistencia';
}

// Función para obtener la lista (✅ CONECTADA AL BACKEND)
export const getDetalleAsistencias = async (alumnoId: string): Promise<AsistenciaDetalleItem[]> => {
  try {
    // Reutilizamos el endpoint de asistencia que ya trae la lista de fechas
    const response = await fetch(`${API_URL}/academic/my-attendance/${alumnoId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Error al cargar detalles de asistencia: ${response.statusText}`);

    const data = await response.json();

    // El backend nos devuelve 'fechas' con los campos: { fecha, materia, tipo }
    // Mapeamos 'tipo' (Backend) a 'estado' (Frontend)
    return data.fechas.map((item: any) => ({
      fecha: item.fecha,
      materia: item.materia,
      estado: item.tipo // El backend devuelve "Falta" o "Retardo", que coincide con la interfaz
    }));

  } catch (error) {
    console.error("Error en getDetalleAsistencias:", error);
    return [];
  }
};