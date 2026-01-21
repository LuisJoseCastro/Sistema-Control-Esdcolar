import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../shared/enums/user-role.enum';
import { CreateGroupDto } from './dtos/create-group.dto';
import { AddStudentDto } from './dtos/add-student-to-group.dto';
import { CreateDocenteDto } from './dtos/create-docente.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get('docentes')
  async getTeachers(@Request() req) {
    return await this.adminService.getTeachers(req.user.schoolId);
  }

  @Post('docentes/registrar')
  async registerTeacher(@Body() dto: CreateDocenteDto, @Request() req) {
    return await this.adminService.createTeacher(dto, req.user.schoolId);
  }

  @Get('docentes/:id/perfil')
  async getTeacherProfile(@Param('id') id: string) {
    return await this.adminService.getTeacherProfile(id);
  }

  @Patch('docentes/:id/perfil')
  async updateTeacherProfile(@Param('id') id: string, @Body() dto: any) {
    return await this.adminService.updateTeacherProfile(id, dto);
  }

  @Delete('docentes/:id')
  async deleteTeacher(@Param('id') id: string) {
    return await this.adminService.deleteTeacher(id);
  }

  @Post('alumnos')
  async regAlum(@Body() dto: AddStudentDto, @Request() req) { 
    return await this.adminService.addStudentToGroup(dto, req.user.schoolId); 
  }

  @Get('alumnos/:id/perfil-completo')
  async getPerf(@Param('id') id: string) { 
    return await this.adminService.getAlumnoFullProfile(id); 
  }
  
  @Patch('alumnos/:id')
  async updateAlum(@Param('id') id: string, @Body() dto: any) { 
    return await this.adminService.updateStudentProfile(id, dto); 
  }

  @Delete('alumnos/:id')
  async deleteAlum(@Param('id') id: string) { 
    return await this.adminService.deleteStudent(id); 
  }

  @Get('grupos')
  async getGroups(@Request() req) { 
    return await this.adminService.getGroups(req.user.schoolId); 
  }
  
  @Post('grupos')
  async saveGrp(@Body() dto: CreateGroupDto, @Request() req) { 
    return await this.adminService.saveGroup(dto, req.user.schoolId); 
  }

  @Patch('grupos/:id')
  async updateGrp(@Param('id') id: string, @Body() dto: any) { 
    return await this.adminService.updateGroup(id, dto); 
  }
  
  @Get('grupos/:id/alumnos')
  async getAlums(@Param('id') id: string) { 
    return await this.adminService.getStudentsByGroup(id); 
  }

  @Delete('grupos/:id')
  async deleteGroup(@Param('id') id: string) { 
    return await this.adminService.deleteGroup(id); 
  }

  @Get('materias')
  async getSubjects(@Request() req) {
    return await this.adminService.getSubjects(req.user.schoolId);
  }

  @Post('materias')
  async createSubject(@Body() dto: any, @Request() req) {
    return await this.adminService.createSubject(dto, req.user.schoolId);
  }

  @Delete('materias/:id')
  async deleteSubject(@Param('id') id: string) {
    return await this.adminService.deleteSubject(id);
  }

  @Get('usuarios/buscar')
  async searchUsers(@Query('q') query: string, @Request() req) {
    return await this.adminService.searchAllUsers(query, req.user.schoolId);
  }
  
  @Post('mensajes/enviar')
  async sendMessage(@Body() body: any, @Request() req) {
    return await this.adminService.broadcastMessage(req.user.id, body);
  }

  @Get('mensajes/historial')
  async getHistory(@Request() req) {
    return await this.adminService.getMensajesEnviados(req.user.id);
  }
}