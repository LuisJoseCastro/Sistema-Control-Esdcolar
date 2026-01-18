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
// 🔌 CONFIGURACIÓN DE CONEXIÓN (NUEVO)
// =========================================================

const API_URL = 'http://localhost:3000'; // Asegúrate que coincida con tu backend

const getAuthHeaders = () => {
  // Asumimos que guardaste el token con la clave 'access_token' al hacer login
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Utilidad para simular tiempo de espera (para los mocks restantes)
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// =========================================================
// 1. ASIGNATURAS (Actualizado con Horarios)
// =========================================================

export interface AsignaturaConHorario {
  id: number | string;
  materia: string;
  profesor: string;
  horarios: { dia: string; hora: string }[];
}

export const getMisAsignaturas = async (alumnoId: string): Promise<AsignaturaConHorario[]> => {
  console.log(`[MOCK] Solicitando asignaturas con horario para: ${alumnoId}`);
  await wait(600);

  return [
    {
      id: 1,
      materia: 'Matemáticas',
      profesor: 'Ing. Pérez',
      horarios: [
        { dia: 'Lunes', hora: '08:00 - 10:00' },
        { dia: 'Miércoles', hora: '10:00 - 12:00' }
      ]
    },
    {
      id: 2,
      materia: 'Programación Web',
      profesor: 'Lic. García',
      horarios: [
        { dia: 'Martes', hora: '07:00 - 09:00' },
        { dia: 'Jueves', hora: '07:00 - 09:00' },
        { dia: 'Viernes', hora: '08:00 - 10:00' }
      ]
    },
    {
      id: 3,
      materia: 'Base de Datos',
      profesor: 'Ing. López',
      horarios: [
        { dia: 'Viernes', hora: '12:00 - 14:00' }
      ]
    },
  ];
};

// =========================================================
// 2. CALIFICACIONES (Nuevo: Boleta Parcial)
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
  console.log(`[MOCK] Solicitando boleta parcial para: ${alumnoId} en el periodo: ${periodo}`);
  await wait(500);

  if (periodo === '2025-1') {
    return [
      { materia: "Matemáticas", u1: "10", u2: "9", u3: "10", u4: "---", u5: "---", final: "---" },
      { materia: "Física", u1: "8", u2: "8", u3: "9", u4: "---", u5: "---", final: "---" },
      { materia: "Química", u1: "9", u2: "9", u3: "9", u4: "---", u5: "---", final: "---" },
      { materia: "Programación", u1: "10", u2: "10", u3: "10", u4: "---", u5: "---", final: "---" },
    ];
  } else if (periodo === '2024-2') {
    return [
      { materia: "Cálculo I", u1: "7", u2: "8", u3: "8", u4: "7", u5: "8", final: "7.8" },
      { materia: "Introducción a la Ing.", u1: "10", u2: "10", u3: "9", u4: "9", u5: "9", final: "9.6" },
      { materia: "Álgebra Lineal", u1: "9", u2: "7", u3: "8", u4: "9", u5: "9", final: "8.6" },
      { materia: "Comunicación", u1: "10", u2: "9", u3: "10", u4: "10", u5: "10", final: "9.8" },
      { materia: "Dibujo Técnico", u1: "8", u2: "9", u3: "8", u4: "9", u5: "8", final: "8.4" },
      { materia: "Electrónica Básica", u1: "9", u2: "10", u3: "10", u4: "9", u5: "9", final: "9.4" },
    ];
  } else {
    return [];
  }
};

// =========================================================
// 3. ASISTENCIA (Nuevo: Calendario y Estadísticas)
// =========================================================

export interface AsistenciaData {
  estadisticas: { asistencia: number; faltas: number; retardos: number };
  fechas: { fecha: string; tipo: 'Falta' | 'Retardo' }[];
  recordatorios: string[];
}

export const getAsistenciaData = async (alumnoId: string): Promise<AsistenciaData> => {
  console.log(`[MOCK] Solicitando asistencia para: ${alumnoId}`);
  await wait(700);

  return {
    estadisticas: { asistencia: 90, faltas: 1, retardos: 2 },
    fechas: [
      { fecha: '2025-08-17', tipo: 'Falta' },
      { fecha: '2025-08-05', tipo: 'Retardo' }
    ],
    recordatorios: [
      "Entrega de proyecto de Física el viernes.",
      "Examen de Matemáticas el lunes 15.",
    ]
  };
};

// =========================================================
// 4. HISTORIAL ACADÉMICO (Existente)
// =========================================================

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
      { asignatura: 'Redes de Computadoras', promedio: 8.2, periodo: '2024-2' },
      { asignatura: 'Cálculo Vectorial', promedio: 7.5, periodo: '2024-2' },
      { asignatura: 'Inglés I', promedio: 10.0, periodo: '2024-1' },
    ],
    documentosDisponibles: [
      { nombre: 'Boleta de Calificaciones', url: '/api/docs/boleta' },
      { nombre: 'Constancia de Estudios', url: '/api/docs/constancia' },
    ],
  };
};

// =========================================================
// 5. NOTIFICACIONES (✅ CONECTADO AL BACKEND)
// =========================================================

export const getNotificaciones = async (alumnoId: string): Promise<NotificacionDashboard[]> => {
  try {
    // Llamada al endpoint: GET /communications/notifications/:userId
    const response = await fetch(`${API_URL}/communications/notifications/${alumnoId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al cargar notificaciones: ${response.statusText}`);
    }

    const data = await response.json();

    // El backend ya devuelve la estructura exacta: [{ id, mensaje, leida, fecha }, ...]
    // No hace falta mapear nada extra si el backend usa el formato correcto.
    return data;

  } catch (error) {
    console.error("Error en getNotificaciones:", error);
    // Retornamos array vacío para que la UI no se rompa si falla la conexión
    return [];
  }
};

// OPCIONAL: Si deseas agregar la función para marcar como leída (ya que tu backend lo soporta)
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
    // A) Hacemos la petición real al Backend
    // IMPORTANTE: alumnoId debe ser el UUID del Usuario (User ID) que obtienes al hacer login
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

    // B) TRANSFORMACIÓN DE DATOS (Mapeo Backend -> Frontend)
    // Convertimos la respuesta plana del backend a la estructura anidada que usa tu vista.
    // Usamos '---' o valores por defecto para lo que aún no viene del backend.

    return {
      resumen: {
        name: data.nombre || 'Sin Nombre',
        id: data.matricula || 'S/M',
        career: 'Ingeniería en Sistemas', // 🚧 Dato hardcoded (pendiente en BD)
        semester: data.gradoActual || 'Indefinido',
        average: 0.0, // 🚧 Pendiente conectar con módulo Academic real
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
        nationality: 'Mexicana', // 🚧 Dato hardcoded
        civilStatus: 'Soltero/a', // 🚧 Dato hardcoded
        bloodType: data.tipoSangre || 'N/A',
        disability: 'Ninguna',
        curp: data.curp || 'No registrada',
        nss: 'No registrado',
      },
      academic: {
        semester: data.gradoActual,
        average: 8.5, // 🚧 Mock temporal
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
        balanceDue: 0.00, // 🚧 Mock temporal
        lastPaymentDate: '---',
      }
    };

  } catch (error) {
    console.error("Error en getAlumnoProfileData:", error);
    throw error;
  }
};

// =========================================================
// 7. PAGOS Y DOCUMENTOS (Existente)
// =========================================================

export const getHistorialPagos = async (alumnoId: string): Promise<DocumentoPagado[]> => {
  console.log(`[MOCK] Solicitando historial de pagos para alumno: ${alumnoId}`);
  await wait(500);

  return [
    { fecha: '10/01/2022', concepto: 'Historial Académico', monto: 150.00, estado: 'Pagado' },
    { fecha: '15/08/2022', concepto: 'Constancia de Estudios', monto: 100.00, estado: 'Pagado' },
    { fecha: '20/09/2022', concepto: 'Boleta de Calificaciones', monto: 120.00, estado: 'Pagado' },
  ];
};

export const getDocumentosSolicitados = async (alumnoId: string): Promise<DocumentoSolicitado[]> => {
  console.log(`[MOCK] Solicitando documentos pendientes para alumno: ${alumnoId}`);
  await wait(400);

  return [
    { fecha: '10/02/2024', concepto: 'Historial Académico', pago: 150.00 },
    { fecha: '15/02/2024', concepto: 'Constancia de Estudios', pago: 100.00 },
    { fecha: '---', concepto: '---', pago: '---' },
  ];
};
// =========================================================
// 8. DASHBOARD (✅ CONECTADO AL BACKEND)
// =========================================================

export const getAlumnoDashboardSummary = async (alumnoId: string): Promise<AlumnoDashboardSummary> => {
  try {
    // Llamada al endpoint: GET /student/dashboard/summary/:userId
    const response = await fetch(`${API_URL}/student/dashboard/summary/${alumnoId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener resumen del dashboard: ${response.statusText}`);
    }

    const data = await response.json();

    // El backend devuelve: { promedioGeneral, asistenciaPorcentaje, notificaciones: [] }
    // Mapeamos para asegurar tipos, por si acaso.
    return {
      promedioGeneral: Number(data.promedioGeneral) || 0,
      asistenciaPorcentaje: Number(data.asistenciaPorcentaje) || 0,
      notificaciones: data.notificaciones || [],
    };

  } catch (error) {
    console.error("Error en getAlumnoDashboardSummary:", error);
    // Retornamos estructura vacía/segura en caso de error para que no truene la pantalla
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

// Función para obtener la lista
export const getDetalleAsistencias = async (alumnoId: string): Promise<AsistenciaDetalleItem[]> => {
  console.log(`[MOCK] Solicitando detalle de asistencias para: ${alumnoId}`);
  await wait(500);

  return [
    { fecha: "2025-11-01", materia: "Matemáticas", estado: "Falta" },
    { fecha: "2025-11-02", materia: "Física", estado: "Retardo" },
    { fecha: "2025-11-03", materia: "Historia", estado: "Falta" },
    { fecha: "2025-11-04", materia: "Inglés", estado: "Retardo" },
    { fecha: "2025-11-05", materia: "Química", estado: "Retardo" },
    { fecha: "2025-11-08", materia: "Programación", estado: "Falta" },
  ];
};

// Simula el catálogo de documentos que la escuela ofrece
export const getCatalogoDocumentos = async (): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    'Historial Académico',
    'Constancia de Estudios',
    'Certificado de Terminación',
    'Boleta de Calificaciones',
    'Credencial de Biblioteca (Reposición)'
  ];
};