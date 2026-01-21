import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import {
  AcademicService,
  GradeInput,
  UpdateProfileDto,
} from '../service/academic.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/roles.guard';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse
} from '@nestjs/swagger';

interface RequestWithUser {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@ApiTags('Módulo Académico')
@ApiBearerAuth()
@Controller('academic')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AcademicController {
  constructor(private readonly academicService: AcademicService) { }

  @ApiOperation({ summary: 'Obtener cursos de un estudiante', description: 'Devuelve la lista de materias inscritas.' })
  @ApiParam({ name: 'studentId', description: 'UUID del estudiante' })
  @Get('my-courses/:studentId')
  getMyCourses(@Param('studentId') studentId: string) {
    return this.academicService.getStudentCourses(studentId);
  }

  @ApiOperation({ summary: 'Obtener calificaciones por periodo' })
  @ApiParam({ name: 'studentId', description: 'UUID del estudiante' })
  @ApiQuery({ name: 'periodo', required: false, example: '2025-1', description: 'Filtrar por ciclo escolar' })
  @Get('my-grades/:studentId')
  getMyGrades(@Param('studentId') studentId: string, @Query('periodo') periodo: string) {
    return this.academicService.getStudentGradesByPeriod(studentId, periodo || '2025-1');
  }

  @ApiOperation({ summary: 'Consultar historial de asistencias' })

  @Get('my-academic-history/:studentId')
  getAcademicHistory(@Param('studentId') studentId: string) {
    return this.academicService.getAcademicHistory(studentId);
  }

  @Get('my-attendance/:studentId')
  getMyAttendance(@Param('studentId') studentId: string) {
    return this.academicService.getStudentAttendance(studentId);
  }

  @ApiOperation({ summary: 'Carga Académica del Profesor', description: 'Materias asignadas al profesor logueado.' })
  @Get('teacher-load')
  getTeacherLoad(@Request() req: RequestWithUser) {
    return this.academicService.getTeacherLoad(req.user.userId);
  }

  @ApiOperation({ summary: 'Estadísticas del Profesor' })
  @Get('stats')
  getStats(@Request() req: RequestWithUser) {
    return this.academicService.getTeacherStats(req.user.userId);
  }
  @ApiOperation({ summary: 'Grupos asignados al Profesor' })
  @Get('groups')
  getGroups(@Request() req: RequestWithUser) {
    return this.academicService.getTeacherGroups(req.user.userId);
  }

  @ApiOperation({ summary: 'Obtener lista de alumnos para calificar' })
  @ApiParam({ name: 'courseId', description: 'ID del curso/materia' })
  @Get('grades/list/:courseId')
  getGradesList(@Param('courseId') courseId: string) {
    return this.academicService.getStudentsForGrading(courseId);
  }

  @ApiOperation({ summary: 'Guardar calificaciones (Captura)' })
  @ApiBody({
    description: 'Array de calificaciones',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          studentId: { type: 'string' },
          grade: { type: 'number' },
          feedback: { type: 'string' }
        }
      }
    }
  })
  @Post('grades/capture/:courseId')
  saveGrades(@Param('courseId') courseId: string, @Body() grades: any[]) {
    return this.academicService.saveGrades(courseId, grades as GradeInput[]);
  }

  @ApiOperation({ summary: 'Obtener alumnos para pase de lista' })
  @Get('attendance/students/:groupId')
  getStudentsForAttendance(@Param('groupId') groupId: string) {
    return this.academicService.getStudentsForAttendance(groupId);
  }

  @ApiOperation({ summary: 'Guardar asistencia en lote' })
  @ApiBody({ schema: { type: 'object', properties: { groupId: { type: 'string' }, date: { type: 'string' }, students: { type: 'array' } } } })
  @Post('attendance')
  saveAttendance(@Body() body: any) {
    return this.academicService.saveAttendanceBatch(body);
  }

  @ApiOperation({ summary: 'Obtener perfil del usuario logueado' })
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return this.academicService.getProfile(req.user.userId);
  }

  @ApiOperation({ summary: 'Actualizar perfil' })
  @ApiBody({ description: 'Datos actualizables del perfil', schema: { example: { phone: '555-1234', address: 'Calle Falsa 123' } } })
  @Put('profile')
  updateProfile(@Request() req: RequestWithUser, @Body() body: any) {
    return this.academicService.updateProfile(
      req.user.userId,
      body as UpdateProfileDto,
    );
  }

  @ApiOperation({ summary: 'Bandeja de entrada (Mensajes)' })
  @Get('messages/inbox')
  getInbox(@Request() req: RequestWithUser) {
    return this.academicService.getInbox(req.user.userId);
  }

  @ApiOperation({ summary: 'Mensajes enviados' })
  @Get('messages/sent')
  getSent(@Request() req: RequestWithUser) {
    return this.academicService.getSent(req.user.userId);
  }

  @ApiOperation({ summary: 'Enviar mensaje nuevo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'ID del destinatario' },
        subject: { type: 'string' },
        message: { type: 'string' }
      }
    }
  })
  @Post('messages/send')
  sendMessage(
    @Request() req: RequestWithUser,
    @Body() body: { to: string; subject: string; message: string },
  ) {
    return this.academicService.sendMessage(
      req.user.userId,
      body.to,
      body.subject,
      body.message,
    );
  }

  @ApiOperation({ summary: 'Marcar mensaje como leído' })
  @Patch('messages/read/:id')
  readMessage(@Param('id') id: string) {
    return this.academicService.markMessageRead(id);
  }

  @Get('dashboard/summary/:studentId')
  getDashboardSummary(@Param('studentId') studentId: string) {
    return this.academicService.getStudentDashboardSummary(studentId);
  }

  @Get('student-profile/:userId')
  getStudentProfileData(@Param('userId') userId: string) {
    return this.academicService.getStudentProfile(userId);
  }
}