// src/services/alumno.service.ts
import type { Asignatura, HistorialAcademico, NotificacionDashboard, AlumnoProfileData, DocumentoSolicitado, DocumentoPagado } from '../types/models';
import type { AlumnoDashboardSummary } from '../types/models';
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// MOCK para la vista de Mis Asignaturas del Alumno
export const getMisAsignaturas = async (alumnoId: string): Promise<Asignatura[]> => {
  console.log(`[MOCK] Solicitando asignaturas para alumno: ${alumnoId}`);
  await wait(400);

  return [
    { id: 'm1', nombre: 'Matemáticas I', docente: 'Rodolfo Docente', promedio: 8.5 },
    { id: 'm2', nombre: 'Física', docente: 'Ana García', promedio: 9.0 },
  ];
};

/**
 * 2. MOCK: Simula la obtención del historial académico completo del alumno.
 * @param alumnoId El ID del alumno actual.
 * @returns Promesa que resuelve al objeto HistorialAcademico.
 */
export const getHistorialAcademico = async (alumnoId: string): Promise<HistorialAcademico> => {
    console.log(`[MOCK] Solicitando historial académico para alumno: ${alumnoId}`);
    await wait(800); // Simular una carga de red (800ms)

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

/**
 * 3. MOCK: Simula la obtención de la lista completa de notificaciones/mensajes.
 * @param alumnoId El ID del alumno actual.
 * @returns Promesa que resuelve a una lista de notificaciones.
 */
export const getNotificaciones = async (alumnoId: string): Promise<NotificacionDashboard[]> => {
    console.log(`[MOCK] Solicitando notificaciones para alumno: ${alumnoId}`);
    await wait(600); // Simular una carga de red

    return [
        { id: 'm1', mensaje: 'Tu calificación final de Matemáticas I es 9.5.', leida: false, fecha: '03/09/24' },
        { id: 'm2', mensaje: 'Se ha creado una nueva tarea en Programación Web.', leida: false, fecha: '03/09/24' },
        { id: 'm3', mensaje: 'El horario de la clase de Física ha sido modificado.', leida: true, fecha: '03/09/24' },
        { id: 'm4', mensaje: 'Recordatorio de pago: Último día el 15 de septiembre.', leida: true, fecha: '03/08/24' },
        { id: 'm5', mensaje: 'La Mtra. Ana García ha enviado un nuevo mensaje.', leida: false, fecha: '03/07/24' },
        { id: 'm6', mensaje: 'Tu solicitud de constancia ha sido aprobada.', leida: true, fecha: '03/06/24' },
    ];
};



/**
 * 4. MOCK: Simula la obtención de los datos completos del perfil del alumno.
 * @param alumnoId El ID del alumno actual.
 * @returns Promesa que resuelve al objeto AlumnoProfileData.
 */
export const getAlumnoProfileData = async (alumnoId: string): Promise<AlumnoProfileData> => {
    console.log(`[MOCK] Solicitando datos de perfil para alumno: ${alumnoId}`);
    await wait(800); // Simular una carga de red

    // Datos basados en tus imágenes de Figma
    return {
        // Datos del resumen superior
        resumen: {
            name: 'Sofia Rodriguez',
            id: '12345678910',
            career: 'Ingeniería en Sistemas Computacionales',
            semester: 'Quinto Semestre',
            average: 8.5,
            profileImageUrl: '/images/profile-placeholder.png', // URL de imagen mock
        },
        // Información Personal (Editable/Detalles)
        personal: {
            fullName: 'Sofia Rodriguez',
            id: '12345678910',
            birthDate: '2000-03-15',
            gender: 'Femenino',
            email: 'sofia.rodriguez@email.com',
            phone: '+52 55 1234 5678',
            address: 'Calle Principal #123, Colonia Centro, Ciudad de México, CP 06000',
            // Información Adicional (del modal de detalles)
            nationality: 'Mexicana',
            civilStatus: 'Soltera',
            bloodType: 'O+',
            disability: 'Ninguna',
            curp: 'RORS000315MDDFDFAS',
            nss: '123456789Y1',
        },
        // Datos Académicos (Detalles)
        academic: {
            semester: 'Quinto Semestre',
            average: 8.5,
            status: 'Activo',
            approvedSubjects: 42,
            admissionDate: 'Agosto 2021',
            // Información Adicional (del modal de detalles)
            faculty: 'Ingeniería',
            studyPlan: 'ISC 2010',
            modality: 'Escolarizada',
            turn: 'Matutino',
            period: 'Semestral',
            credits: 210,
        },
        // Datos de Pago (Solo visibles en el área de pagos)
        payment: {
            balanceDue: 1092.00,
            lastPaymentDate: '2025-11-18', // Fecha actual
        }
    };
};

/**
 * 5. MOCK: Simula la obtención del historial de documentos pagados y entregados.
 */
export const getHistorialPagos = async (alumnoId: string): Promise<DocumentoPagado[]> => {
    console.log(`[MOCK] Solicitando historial de pagos para alumno: ${alumnoId}`);
    await wait(500);

    return [
        { fecha: '10/01/2022', concepto: 'Historial Académico', monto: 150.00, estado: 'Pagado' },
        { fecha: '15/08/2022', concepto: 'Constancia de Estudios', monto: 100.00, estado: 'Pagado' },
        { fecha: '20/09/2022', concepto: 'Boleta de Calificaciones', monto: 120.00, estado: 'Pagado' },
    ];
};

/**
 * 6. MOCK: Simula la obtención de documentos actualmente solicitados.
 */
export const getDocumentosSolicitados = async (alumnoId: string): Promise<DocumentoSolicitado[]> => {
    console.log(`[MOCK] Solicitando documentos pendientes para alumno: ${alumnoId}`);
    await wait(400);

    return [
        { fecha: '10/02/2024', concepto: 'Historial Académico', pago: 150.00 },
        { fecha: '15/02/2024', concepto: 'Constancia de Estudios', pago: 100.00 },
        { fecha: '---', concepto: '---', pago: '---' },
    ];
};

/**
 * MOCK: Obtiene el resumen general para el Dashboard del Alumno.
 * (Promedio, Asistencia y Notificaciones recientes)
 */
export const getAlumnoDashboardSummary = async (alumnoId: string): Promise<AlumnoDashboardSummary> => {
  console.log(`[MOCK] Obteniendo resumen de dashboard para alumno: ${alumnoId}`);
  await wait(700); // Simulamos carga de red

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