// src/services/alumno.service.ts

import type { HistorialAcademico, NotificacionDashboard, AlumnoProfileData, DocumentoSolicitado, DocumentoPagado, AlumnoDashboardSummary } from '../types/models';

// Utilidad para simular tiempo de espera
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// =========================================================
// 1. ASIGNATURAS (Actualizado con Horarios)
// =========================================================

// Interfaz específica para el detalle de la página de asignaturas
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

export const getCalificacionesBoleta = async (alumnoId: string): Promise<BoletaCalificacion[]> => {
  console.log(`[MOCK] Solicitando boleta parcial para: ${alumnoId}`);
  await wait(500);

  return [
    { materia: "Matemáticas", u1: "10", u2: "9", u3: "10", u4: "---", u5: "---", final: "---" },
    { materia: "Física", u1: "8", u2: "8", u3: "9", u4: "---", u5: "---", final: "---" },
    { materia: "Química", u1: "9", u2: "9", u3: "9", u4: "---", u5: "---", final: "---" },
    { materia: "Programación", u1: "10", u2: "10", u3: "10", u4: "---", u5: "---", final: "---" },
  ];
};

// =========================================================
// 3. ASISTENCIA (Nuevo: Calendario y Estadísticas)
// =========================================================

export interface AsistenciaData {
  estadisticas: { asistencia: number; faltas: number; retardos: number };
  fechas: { fecha: string; tipo: 'Falta' | 'Retardo' }[]; // Ej: '2025-08-17'
  recordatorios: string[];
}

export const getAsistenciaData = async (alumnoId: string): Promise<AsistenciaData> => {
  console.log(`[MOCK] Solicitando asistencia para: ${alumnoId}`);
  await wait(700);

  // NOTA: Para pruebas, asegúrate que las fechas coincidan con el mes que visualizas en el calendario
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
// 5. NOTIFICACIONES (Existente)
// =========================================================

export const getNotificaciones = async (alumnoId: string): Promise<NotificacionDashboard[]> => {
    console.log(`[MOCK] Solicitando notificaciones para alumno: ${alumnoId}`);
    await wait(600); 

    return [
        { id: 'm1', mensaje: 'Tu calificación final de Matemáticas I es 9.5.', leida: false, fecha: '03/09/24' },
        { id: 'm2', mensaje: 'Se ha creado una nueva tarea en Programación Web.', leida: false, fecha: '03/09/24' },
        { id: 'm3', mensaje: 'El horario de la clase de Física ha sido modificado.', leida: true, fecha: '03/09/24' },
        { id: 'm4', mensaje: 'Recordatorio de pago: Último día el 15 de septiembre.', leida: true, fecha: '03/08/24' },
        { id: 'm5', mensaje: 'La Mtra. Ana García ha enviado un nuevo mensaje.', leida: false, fecha: '03/07/24' },
        { id: 'm6', mensaje: 'Tu solicitud de constancia ha sido aprobada.', leida: true, fecha: '03/06/24' },
    ];
};

// =========================================================
// 6. PERFIL DEL ALUMNO (Existente)
// =========================================================

export const getAlumnoProfileData = async (alumnoId: string): Promise<AlumnoProfileData> => {
    console.log(`[MOCK] Solicitando datos de perfil para alumno: ${alumnoId}`);
    await wait(800); 

    return {
        resumen: {
            name: 'Sofia Rodriguez',
            id: '12345678910',
            career: 'Ingeniería en Sistemas Computacionales',
            semester: 'Quinto Semestre',
            average: 8.5,
            profileImageUrl: '/images/profile-placeholder.png', 
        },
        personal: {
            fullName: 'Sofia Rodriguez',
            id: '12345678910',
            birthDate: '2000-03-15',
            gender: 'Femenino',
            email: 'sofia.rodriguez@email.com',
            phone: '+52 55 1234 5678',
            address: 'Calle Principal #123, Colonia Centro, Ciudad de México, CP 06000',
            nationality: 'Mexicana',
            civilStatus: 'Soltera',
            bloodType: 'O+',
            disability: 'Ninguna',
            curp: 'RORS000315MDDFDFAS',
            nss: '123456789Y1',
        },
        academic: {
            semester: 'Quinto Semestre',
            average: 8.5,
            status: 'Activo',
            approvedSubjects: 42,
            admissionDate: 'Agosto 2021',
            faculty: 'Ingeniería',
            studyPlan: 'ISC 2010',
            modality: 'Escolarizada',
            turn: 'Matutino',
            period: 'Semestral',
            credits: 210,
        },
        payment: {
            balanceDue: 1092.00,
            lastPaymentDate: '2025-11-18', 
        }
    };
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
// 8. DASHBOARD (Existente)
// =========================================================

export const getAlumnoDashboardSummary = async (alumnoId: string): Promise<AlumnoDashboardSummary> => {
  console.log(`[MOCK] Obteniendo resumen de dashboard para alumno: ${alumnoId}`);
  await wait(700); 

  return {
    promedioGeneral: 8.5,
    asistenciaPorcentaje: 90,
    notificaciones: [
      { id: 'n1', mensaje: 'Nueva tarea en Matemáticas I', leida: false, fecha: '04/10/24' },
      { id: 'n2', mensaje: 'Recordatorio: Pago de colegiatura vence pronto', leida: false, fecha: '04/09/24' },
      { id: 'n3', mensaje: 'Tu calificación de Física ya está disponible', leida: true, fecha: '03/10/24' },
    ],
  };
};


// --- EN alumno.service.ts ---

// Interfaz para la tabla de detalles
export interface AsistenciaDetalleItem {
  fecha: string;
  materia: string;
  estado: 'Falta' | 'Retardo' | 'Asistencia';
}

// Función para obtener la lista
export const getDetalleAsistencias = async (alumnoId: string): Promise<AsistenciaDetalleItem[]> => {
  console.log(`[MOCK] Solicitando detalle de asistencias para: ${alumnoId}`);
  // Simulamos un pequeño tiempo de carga
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    { fecha: "2025-11-01", materia: "Matemáticas", estado: "Falta" },
    { fecha: "2025-11-02", materia: "Física", estado: "Retardo" },
    { fecha: "2025-11-03", materia: "Historia", estado: "Falta" },
    { fecha: "2025-11-04", materia: "Inglés", estado: "Retardo" },
    { fecha: "2025-11-05", materia: "Química", estado: "Retardo" },
    { fecha: "2025-11-08", materia: "Programación", estado: "Falta" },
  ];
};


// --- EN alumno.service.ts ---

// Simula el catálogo de documentos que la escuela ofrece
export const getCatalogoDocumentos = async (): Promise<string[]> => {
    // No necesitamos ID de alumno aquí, es un catálogo general
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
        'Historial Académico',
        'Constancia de Estudios',
        'Certificado de Terminación',
        'Boleta de Calificaciones',
        'Credencial de Biblioteca (Reposición)' // Agregué uno nuevo de ejemplo
    ];
};