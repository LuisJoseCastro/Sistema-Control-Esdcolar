import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { TeacherProfile } from '../../teacher/entities/teacher-profile.entity';
import { Course } from '../entities/course.entity';
import { GradeCard } from '../entities/grade-card.entity';
import { Enrollment } from '../entities/enrollment.entity';
import { Group } from '../entities/group.entity';
import { AttendanceDetail } from '../entities/attendance-detail.entity';
import { AttendanceStatus } from '../../shared/enums/attendance-status.enum';
import { InternalMessage } from '../../communications/entities/internal-message.entity';
import { User } from '../../users/entities/user.entity';
import { StudentProfile } from '../../student/entities/student-profile.entity';

export interface GradeInput {
  id: string;
  parcial1: string | number;
  parcial2: string | number;
  parcial3: string | number;
  final: string | number;
  extraordinario?: string | number | null;
}

export interface UpdateProfileDto {
  tituloAcademico?: string;
  especialidad?: string;
  habilidades?: string;
  telefono?: string;
  ciudad?: string;
  direccion?: string;
  claveEmpleado?: string;
}

@Injectable()
export class AcademicService {
  constructor(
    @InjectRepository(TeacherProfile)
    private readonly teacherRepo: Repository<TeacherProfile>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(GradeCard)
    private readonly gradeRepo: Repository<GradeCard>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
    @InjectRepository(AttendanceDetail)
    private readonly attendanceRepo: Repository<AttendanceDetail>,
    @InjectRepository(InternalMessage)
    private readonly msgRepo: Repository<InternalMessage>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }


  async getStudentCourses(userId: string) {
    const enrollments = await this.enrollmentRepo.find({
      where: { student: { user: { id: userId } } },
      relations: ['group'],
    });

    if (!enrollments.length) return [];

    const groupIds = enrollments.map((e) => e.group.id);

    const courses = await this.courseRepo.find({
      where: { group: { id: In(groupIds) } },
      relations: ['subject', 'teacher', 'teacher.user', 'schedules'],
    });

    return courses.map((c) => ({
      id: c.id,
      materia: c.subject?.nombre || 'Sin Nombre',
      profesor: c.teacher?.user?.fullName || 'Por asignar',
      horarios: c.schedules.map((s) => ({
        dia: s.diaSemana,
        hora: `${s.horaInicio.toString().slice(0, 5)} - ${s.horaFin.toString().slice(0, 5)}`,
      })),
    }));
  }

  async getStudentGradesByPeriod(userId: string, periodoNombre: string) {
    const grades = await this.gradeRepo.find({
      where: {
        enrollment: { student: { user: { id: userId } } },
        course: { group: { period: { nombre: periodoNombre } } },
      },
      relations: ['course', 'course.subject'],
    });

    return grades.map((g) => ({
      materia: g.course?.subject?.nombre || 'Desconocida',
      u1: g.parcial1?.toString() || '---',
      u2: g.parcial2?.toString() || '---',
      u3: g.parcial3?.toString() || '---',
      u4: '---',
      u5: '---',
      final: g.promedioFinal?.toString() || '---',
    }));
  }

  async getStudentAttendance(userId: string) {
    const asistencias = await this.attendanceRepo.find({
      where: { enrollment: { student: { user: { id: userId } } } },
      relations: ['course', 'course.subject'],
      order: { fecha: 'DESC' },
    });

    const faltas = asistencias.filter((a) => a.estado === AttendanceStatus.FALTA).length;
    const retardos = asistencias.filter((a) => a.estado === AttendanceStatus.RETARDO).length;
    const total = asistencias.length;

    const porcentaje = total > 0 ? Math.round(((total - faltas) / total) * 100) : 100;

    return {
      estadisticas: {
        asistencia: porcentaje,
        faltas: faltas,
        retardos: retardos,
      },

      fechas: asistencias
        .filter((a) => a.estado !== AttendanceStatus.ASISTENCIA)
        .map((a) => ({
          id: a.id,
          fecha: new Date(a.fecha).toISOString().split('T')[0],
          materia: a.course?.subject?.nombre || 'Materia Desconocida',
          tipo: a.estado === AttendanceStatus.FALTA ? 'Falta' : 'Retardo',
        })),
      recordatorios: [
        'Recuerda justificar tus faltas en Servicios Escolares.',
        'Mantén tu asistencia arriba del 80%.',
      ],
    };
  }

  async getTeacherLoad(teacherId: string) {
    return this.courseRepo.find({
      where: { teacher: { user: { id: teacherId } } },
      relations: ['subject', 'group', 'schedules'],
      order: { id: 'DESC' },
    });
  }

  async getTeacherGroups(teacherId: string) {
    const groups = await this.courseRepo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.group', 'group')
      .leftJoin('course.teacher', 'teacher')
      .leftJoin('teacher.user', 'user')
      .where('user.id = :teacherId', { teacherId })
      .select(['group.id', 'group.nombre'])
      .distinct(true)
      .getRawMany();

    return groups.map((g: { group_id: string; group_nombre: string }) => ({
      id: g.group_id,
      nombre: g.group_nombre,
    }));
  }

  async getStudentsForGrading(courseId: string) {
    const grades = await this.gradeRepo.find({
      where: { course: { id: courseId } },
      relations: [
        'enrollment',
        'enrollment.student',
        'enrollment.student.user',
      ],
      order: { enrollment: { student: { user: { fullName: 'ASC' } } } },
    });

    return grades.map((g) => ({
      id: g.id,
      nombre: g.enrollment?.student?.user?.fullName || 'Alumno Sin Nombre',
      matricula: g.enrollment?.student?.matricula || 'S/M',
      parcial1: g.parcial1?.toString() ?? '',
      parcial2: g.parcial2?.toString() ?? '',
      parcial3: g.parcial3?.toString() ?? '',
      final: g.promedioFinal?.toString() ?? '',
      extraordinario: g.extraordinario?.toString() ?? '',
    }));
  }

  async saveGrades(courseId: string, gradesData: GradeInput[]) {
    const promises = gradesData.map(async (item) => {
      return this.gradeRepo.update(item.id, {
        parcial1: Number(item.parcial1 || 0),
        parcial2: Number(item.parcial2 || 0),
        parcial3: Number(item.parcial3 || 0),
        promedioFinal: Number(item.final || 0),
        extraordinario:
          item.extraordinario && item.extraordinario !== 'NA'
            ? Number(item.extraordinario)
            : null,
      });
    });

    await Promise.all(promises);
    return { message: 'Calificaciones guardadas', count: gradesData.length };
  }

  async getStudentsForAttendance(groupId: string) {
    return this.enrollmentRepo.find({
      where: { group: { id: groupId } },
      relations: ['student', 'student.user'],
      order: { student: { user: { fullName: 'ASC' } } },
    });
  }

  async saveAttendanceBatch(data: {
    grupoId: string;
    fecha: string;
    asistencias: { studentId: string; status: string }[];
  }) {
    const course = await this.courseRepo.findOne({
      where: { group: { id: data.grupoId } },
      select: ['id'],
    });

    if (!course) {
      throw new NotFoundException(
        `No se encontró un curso activo para el grupo ${data.grupoId}`,
      );
    }

    const registros = data.asistencias.map((item) =>
      this.attendanceRepo.create({
        fecha: new Date(data.fecha),
        estado: item.status as AttendanceStatus,
        enrollment: { id: item.studentId } as Enrollment,
        course: { id: course.id } as Course,
      }),
    );

    await this.attendanceRepo.save(registros);
    return { success: true, count: registros.length };
  }

  async getProfile(userId: string) {
    return this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const result = await this.teacherRepo.update(
      { user: { id: userId } },
      data,
    );
    if (result.affected === 0)
      throw new NotFoundException('Perfil no encontrado');
    return { success: true };
  }

  async getInbox(userId: string) {
    return this.msgRepo.find({
      where: { destinatario: { id: userId } },
      relations: ['remitente'],
      order: { fechaEnvio: 'DESC' },
      take: 50,
    });
  }

  async getSent(userId: string) {
    return this.msgRepo.find({
      where: { remitente: { id: userId } },
      relations: ['destinatario'],
      order: { fechaEnvio: 'DESC' },
      take: 50,
    });
  }

  async sendMessage(
    senderId: string,
    destEmail: string,
    subject: string,
    body: string,
  ) {
    const receiver = await this.userRepo.findOne({
      where: { email: destEmail },
      select: ['id'],
    });
    if (!receiver) throw new NotFoundException('Destinatario no encontrado');

    const msg = this.msgRepo.create({
      asunto: subject,
      cuerpoMensaje: body,
      remitente: { id: senderId },
      destinatario: { id: receiver.id },
      leido: false,
    });
    return this.msgRepo.save(msg);
  }

  async markMessageRead(msgId: string) {
    return this.msgRepo.update(msgId, { leido: true });
  }

  async getTeacherStats(userId: string) {
    const courses = await this.courseRepo.find({
      where: { teacher: { user: { id: userId } } },
      relations: ['gradeCards', 'subject'],
    });

    if (courses.length === 0) return this.getEmptyStats();

    const courseIds = courses.map((c) => c.id);

    let totalAlumnos = 0;
    let sumaPromedios = 0;
    let aprobados = 0;
    const rendimientoMateria: { materia: string; promedio: number }[] = [];

    for (const course of courses) {
      const boletas = course.gradeCards ?? [];
      totalAlumnos += boletas.length;
      let promMateria = 0;

      if (boletas.length > 0) {
        const suma = boletas.reduce(
          (acc, b) => acc + Number(b.promedioFinal ?? 0),
          0,
        );
        promMateria = suma / boletas.length;
        aprobados += boletas.filter(
          (b) => Number(b.promedioFinal ?? 0) >= 70,
        ).length;
      }
      rendimientoMateria.push({
        materia: course.subject?.nombre ?? 'Sin Asignar',
        promedio: Number(promMateria.toFixed(1)),
      });
      sumaPromedios += promMateria;
    }

    const asistencias = await this.attendanceRepo.find({
      where: { course: { id: In(courseIds) } },
      select: ['estado', 'enrollment'],
      relations: ['enrollment'],
    });

    let asistenciaPromedio = 0;
    let estudiantesAsistenciaCritica = 0;

    if (asistencias.length > 0) {
      const presentes = asistencias.filter(
        (a) =>
          a.estado === AttendanceStatus.ASISTENCIA ||
          a.estado === AttendanceStatus.RETARDO,
      ).length;
      asistenciaPromedio = (presentes / asistencias.length) * 100;

      const asistenciaPorAlumno = new Map<
        string,
        { total: number; presentes: number }
      >();

      for (const a of asistencias) {
        const enrollmentId = a.enrollment?.id || 'unknown';
        if (!asistenciaPorAlumno.has(enrollmentId)) {
          asistenciaPorAlumno.set(enrollmentId, { total: 0, presentes: 0 });
        }
        const curr = asistenciaPorAlumno.get(enrollmentId)!;
        curr.total++;
        if (
          a.estado === AttendanceStatus.ASISTENCIA ||
          a.estado === AttendanceStatus.RETARDO
        ) {
          curr.presentes++;
        }
      }

      for (const val of asistenciaPorAlumno.values()) {
        if ((val.presentes / val.total) * 100 < 80) {
          estudiantesAsistenciaCritica++;
        }
      }
    }

    const promedioGlobal =
      courses.length > 0 ? sumaPromedios / courses.length : 0;
    const tasaAprobacion =
      totalAlumnos > 0 ? (aprobados / totalAlumnos) * 100 : 0;

    return {
      promedioFinalGrupo: Number(promedioGlobal.toFixed(1)),
      asistenciaPromedio: Number(asistenciaPromedio.toFixed(1)),
      tasaAprobacion: Number(tasaAprobacion.toFixed(1)),
      rendimientoMateria,
      totalEstudiantes: totalAlumnos,
      estudiantesBajoRendimiento: totalAlumnos - aprobados,
      materiasImpartidas: courses.length,
      gruposAsignados: courses.length,
      estudiantesAsistenciaCritica,
    };
  }

  private getEmptyStats() {
    return {
      promedioFinalGrupo: 0,
      asistenciaPromedio: 0,
      tasaAprobacion: 0,
      rendimientoMateria: [],
      totalEstudiantes: 0,
      estudiantesBajoRendimiento: 0,
      materiasImpartidas: 0,
      gruposAsignados: 0,
      estudiantesAsistenciaCritica: 0,
    };
  }

  async getAcademicHistory(userId: string) {
    const grades = await this.gradeRepo.find({
      where: { enrollment: { student: { user: { id: userId } } } },
      relations: ['course', 'course.subject', 'course.group', 'course.group.period'],
      order: { course: { group: { period: { fechaInicio: 'DESC' } } } } // Ordenar por fecha
    });

    const materiasCursadas = grades.filter(g => g.promedioFinal !== null);

    const sumaPromedios = materiasCursadas.reduce((acc, curr) => acc + Number(curr.promedioFinal || 0), 0);

    const promedioGeneral = materiasCursadas.length > 0 ? (sumaPromedios / materiasCursadas.length) : 0;

    const asignaturasAprobadas = materiasCursadas.filter(g => Number(g.promedioFinal || 0) >= 70).length;

    const calificacionesDetalle = grades.map(g => ({
      asignatura: g.course?.subject?.nombre || 'Materia Desconocida',
      promedio: Number(g.promedioFinal || 0),
      periodo: g.course?.group?.period?.nombre || 'Indefinido'
    }));

    return {
      promedioGeneral: Number(promedioGeneral.toFixed(1)),
      asignaturasAprobadas,
      calificacionesDetalle,
      documentosDisponibles: []
    };
  }

  async getStudentDashboardSummary(userId: string) {
    const boletas = await this.gradeRepo.find({
      where: { enrollment: { student: { user: { id: userId } } } },
      select: ['promedioFinal'],
    });

    const validGrades = boletas.filter(b => b.promedioFinal !== null && Number(b.promedioFinal) > 0);
    const suma = validGrades.reduce((acc, curr) => acc + Number(curr.promedioFinal), 0);
    const promedioGeneral = validGrades.length > 0 ? (suma / validGrades.length) : 0;

    const asistencias = await this.attendanceRepo.find({
      where: { enrollment: { student: { user: { id: userId } } } },
    });

    const totalClases = asistencias.length;
    const faltas = asistencias.filter(a => a.estado === AttendanceStatus.FALTA).length;
    const asistenciaPorcentaje = totalClases > 0
      ? Math.round(((totalClases - faltas) / totalClases) * 100)
      : 100;

    const mensajes = await this.msgRepo.find({
      where: { destinatario: { id: userId } },
      order: { fechaEnvio: 'DESC' },
      take: 5,
    });

    return {
      promedioGeneral: Number(promedioGeneral.toFixed(1)),
      asistenciaPorcentaje,
      notificaciones: mensajes.map(msg => ({
        id: msg.id,
        asunto: msg.asunto,
        cuerpoMensaje: msg.cuerpoMensaje,
        fechaEnvio: msg.fechaEnvio,
        leido: msg.leido
      }))
    };
  }

  async getStudentProfile(userId: string) {
    const student = await this.enrollmentRepo.manager.getRepository(StudentProfile).findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!student) throw new NotFoundException('Perfil de estudiante no encontrado');
    const grades = await this.gradeRepo.find({
      where: { enrollment: { student: { id: student.id } } },
      select: ['promedioFinal'],
    });

    const aprobadas = grades.filter(g => Number(g.promedioFinal) >= 70).length;
    const validGrades = grades.filter(g => Number(g.promedioFinal) > 0);
    const suma = validGrades.reduce((acc, curr) => acc + Number(curr.promedioFinal), 0);
    const promedio = validGrades.length > 0 ? suma / validGrades.length : 0;

    return {
      resumen: {
        name: student.user.fullName,
        id: student.matricula || 'S/M',
        career: 'Ingeniería en Sistemas',
        semester: student.gradoActual || 'N/A',
        average: Number(promedio.toFixed(1)),
      },
      personal: {
        fullName: student.nombreCompleto || student.user.fullName,
        id: student.matricula,
        birthDate: student.fechaNacimiento ? student.fechaNacimiento.toString() : '---',
        gender: student.genero || '---',
        email: student.user.email,
        phone: student.telefono || '---',
        address: student.direccion || '---',
        curp: student.curp || '---',
      },
      academic: {
        semester: student.gradoActual || '---',
        average: Number(promedio.toFixed(1)),
        status: student.user.isActive ? 'Activo' : 'Inactivo',
        approvedSubjects: aprobadas,
      },
      payment: {
        balanceDue: 0.00,
      }
    };
  }
}