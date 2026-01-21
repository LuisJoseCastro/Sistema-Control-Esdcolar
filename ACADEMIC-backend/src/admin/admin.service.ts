import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Group } from '../academic/entities/group.entity';
import { Enrollment } from '../academic/entities/enrollment.entity';
import { StudentProfile } from '../student/entities/student-profile.entity';
import { TeacherProfile } from '../teacher/entities/teacher-profile.entity';
import { AcademicPeriod } from '../academic/entities/academic-period.entity';
import { School } from '../tenants/entities/school.entity'; 
import { InternalMessage } from '../communications/entities/internal-message.entity'; 
import { Subject } from '../academic/entities/subject.entity';
import { UserRole } from '../shared/enums/user-role.enum';
import { EnrollmentStatus } from '../shared/enums/enrollment-status.enum'; 
import { AddStudentDto } from './dtos/add-student-to-group.dto';
import { CreateGroupDto } from './dtos/create-group.dto';
import { CreateDocenteDto } from './dtos/create-docente.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(Enrollment) private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(StudentProfile) private profileRepo: Repository<StudentProfile>,
    @InjectRepository(TeacherProfile) private teacherProfileRepo: Repository<TeacherProfile>,
    @InjectRepository(AcademicPeriod) private periodRepo: Repository<AcademicPeriod>,
    @InjectRepository(School) private schoolRepo: Repository<School>, 
    @InjectRepository(InternalMessage) private messageRepo: Repository<InternalMessage>,
    @InjectRepository(Subject) private subjectRepo: Repository<Subject>,
  ) {}

  async getGroups(schoolId: string) {
    try {
      const grupos = await this.groupRepo.createQueryBuilder('g')
        .leftJoinAndSelect('g.period', 'p')
        .where('p.id_escuela = :schoolId', { schoolId })
        .getMany();

      return await Promise.all(grupos.map(async (g) => ({
        ...g,
        totalAlumnos: await this.enrollmentRepo.count({ where: { group: { id: g.id } } })
      })));
    } catch (error) {
      return [];
    }
  }

  async getStudentsByGroup(idOrNombre: string) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrNombre);
    const query = this.enrollmentRepo.createQueryBuilder('e')
      .leftJoinAndSelect('e.student', 's')
      .leftJoin('e.group', 'g');

    if (isUUID) {
      query.where('g.id = :id', { id: idOrNombre });
    } else {
      query.where('g.nombre = :nombre', { nombre: idOrNombre });
    }

    const list = await query.getMany();
    return list.map(i => ({ 
      id: i.student?.id, 
      matricula: i.student?.matricula, 
      nombre: i.student?.nombreCompleto 
    }));
  }

  async saveGroup(dto: CreateGroupDto, schoolId: string) {
    const periodo = await this.periodRepo.createQueryBuilder('p')
      .where('p.id_escuela = :schoolId', { schoolId })
      .getOne();
    if (!periodo) throw new BadRequestException('No hay ciclo escolar');

    const nuevoGrupo = this.groupRepo.create({
      nombre: dto.nombre,
      semestre: dto.semestre ? Number(dto.semestre) : 1,
      limiteAlumnos: dto.limiteAlumnos ? Number(dto.limiteAlumnos) : 40,
      period: { id: periodo.id } as any
    });
    return await this.groupRepo.save(nuevoGrupo);
  }

  async updateGroup(id: string, dto: any) {
    const g = await this.groupRepo.findOne({ where: { id } });
    if (!g) throw new NotFoundException('Grupo no encontrado');
    if (dto.nombre) g.nombre = dto.nombre;
    if (dto.semestre) g.semestre = Number(dto.semestre);
    return await this.groupRepo.save(g);
  }

  async deleteGroup(id: string) {
    await this.enrollmentRepo.delete({ group: { id } });
    return await this.groupRepo.delete(id);
  }

  async addStudentToGroup(dto: AddStudentDto, schoolId: string) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dto.grupoId);
    const targetGroup = await this.groupRepo.findOne({ where: isUUID ? { id: dto.grupoId } : { nombre: dto.grupoId } });
    if (!targetGroup) throw new NotFoundException('Grupo no encontrado');

    let profile = await this.profileRepo.findOne({ where: { matricula: dto.matricula }, relations: ['user'] });
    
    if (!profile) {
      const school = await this.schoolRepo.findOne({ where: { id: schoolId } });
      const email = `${dto.matricula.toLowerCase()}@escuela.com`;
      const hashedPassword = await bcrypt.hash(dto.matricula.trim(), 10);
      
      const newUser = await this.userRepo.save(this.userRepo.create({ 
        email, password: hashedPassword, fullName: dto.nombre, rol: UserRole.ALUMNO, school: school 
      } as any));
      
      const savedProfile = await this.profileRepo.save(this.profileRepo.create({ 
        matricula: dto.matricula, user: newUser, nombreCompleto: dto.nombre, gradoActual: "1" 
      } as any));
      profile = (savedProfile as any) as StudentProfile;
    }

    return await this.enrollmentRepo.save(this.enrollmentRepo.create({ 
      student: profile, group: targetGroup, estado: EnrollmentStatus.ACTIVO 
    } as any));
  }

  async updateStudentProfile(profileId: string, dto: any) {
    const profile = await this.profileRepo.findOne({ where: { id: profileId }, relations: ['user'] });
    if (!profile) throw new NotFoundException('Perfil no encontrado');
    
    if (profile.user) {
        if (dto.nombre) profile.user.fullName = dto.nombre;
        if (dto.email) profile.user.email = dto.email;
        await this.userRepo.save(profile.user);
    }
    Object.assign(profile, dto);
    return await this.profileRepo.save(profile);
  }

  async getAlumnoFullProfile(id: string) {
    const s = await this.profileRepo.findOne({ where: { id }, relations: ['user'] });
    if (!s) throw new NotFoundException('Alumno no encontrado');
    return s;
  }

  async deleteStudent(studentId: string) {
    const p = await this.profileRepo.findOne({ where: { id: studentId }, relations: ['user'] });
    if (!p) throw new NotFoundException('No encontrado');
    await this.enrollmentRepo.delete({ student: { id: studentId } });
    await this.profileRepo.delete(studentId);
    if(p.user) await this.userRepo.delete(p.user.id);
    return { message: 'Alumno eliminado' };
  }

  async getTeachers(schoolId: string) {
    const p = await this.teacherProfileRepo.find({ where: { user: { school: { id: schoolId } } }, relations: ['user'] });
    return p.map(i => ({ 
      id: i.id, 
      nombre: i.user?.fullName, 
      email: i.user?.email, 
      clave: i.claveEmpleado || i.id.toString().substring(0, 8).toUpperCase() 
    }));
  }

  async createTeacher(dto: CreateDocenteDto, schoolId: string) {
    const school = await this.schoolRepo.findOne({ where: { id: schoolId } });
    const hashedPassword = await bcrypt.hash(dto.clave, 10);
    const newUser = await this.userRepo.save(this.userRepo.create({
      email: dto.email.toLowerCase(), 
      password: hashedPassword, 
      fullName: dto.nombre, 
      rol: UserRole.DOCENTE, 
      school: school
    } as any));

    const savedTeacher = await this.teacherProfileRepo.save(this.teacherProfileRepo.create({
      user: newUser, 
      especialidad: dto.especialidad, 
      telefono: dto.telefono,
      claveEmpleado: dto.clave
    } as any));
    
    const newProfile = (savedTeacher as any) as TeacherProfile;

    return { message: 'Docente registrado', id: newProfile.id };
  }

  async getTeacherProfile(id: string) {
    const profile = await this.teacherProfileRepo.findOne({ 
        where: { id }, 
        relations: ['user'] 
    });
    
    if (!profile) throw new NotFoundException('Perfil de docente no encontrado');

    return {
      ...profile,
      id: profile.id, 
      nombre: profile.user?.fullName || 'Sin nombre',
      email: profile.user?.email || 'Sin correo',
      clave: profile.claveEmpleado || 'S/C'
    };
  }

  async updateTeacherProfile(id: string, dto: any) {
    const profile = await this.teacherProfileRepo.findOne({ where: { id }, relations: ['user'] });
    if (!profile) throw new NotFoundException('No encontrado');
    if (profile.user && dto.nombre) {
      profile.user.fullName = dto.nombre;
      await this.userRepo.save(profile.user);
    }
    Object.assign(profile, dto);
    await this.teacherProfileRepo.save(profile);
    return { message: 'Perfil actualizado' };
  }

  async deleteTeacher(id: string) {
    const profile = await this.teacherProfileRepo.findOne({ where: { id }, relations: ['user'] });
    if (!profile) throw new NotFoundException('Docente no encontrado');
    
    const userId = profile.user?.id;
    await this.teacherProfileRepo.delete(id);
    if (userId) await this.userRepo.delete(userId);
    return { message: 'Eliminado' };
  }

  async getSubjects(schoolId: string) {
    return await this.subjectRepo.find({
      where: { school: { id: schoolId } },
      order: { nombre: 'ASC' }
    });
  }

  async createSubject(dto: any, schoolId: string) {
    const nuevaMateria = this.subjectRepo.create({
      nombre: dto.materia,
      codigoMateria: dto.codigo,
      creditos: 10,
      school: { id: schoolId } as any
    });
    return await this.subjectRepo.save(nuevaMateria);
  }

  async deleteSubject(id: string) {
    return await this.subjectRepo.delete(id);
  }

  async searchAllUsers(query: string, schoolId: string) {
    if (!query || query.length < 2) return [];
    return await this.userRepo.find({
      where: { fullName: Like(`%${query}%`), school: { id: schoolId } },
      select: ['id', 'fullName', 'email', 'rol'],
      take: 10
    });
  }

  async broadcastMessage(adminId: string, dto: any) {
    const { tipo, targetId, asunto, cuerpo } = dto;
    let destinatarios: User[] = [];

    if (tipo === 'docentes') {
      destinatarios = await this.userRepo.find({ where: { rol: UserRole.DOCENTE } });
    } else if (tipo === 'alumnos') {
      destinatarios = await this.userRepo.find({ where: { rol: UserRole.ALUMNO } });
    } else if (tipo === 'grupo' && targetId) {
      const inscripciones = await this.enrollmentRepo.find({
        where: { group: { id: targetId } },
        relations: ['student', 'student.user']
      });
      destinatarios = inscripciones.map(ins => ins.student.user).filter((u): u is User => !!u);
    } else if (tipo === 'usuario' && targetId) {
      const user = await this.userRepo.findOne({ where: { id: targetId } });
      if (user) destinatarios = [user];
    }

    if (destinatarios.length > 0) {
      const messagesToInsert = destinatarios.map(dest => ({
        remitente: { id: adminId } as any,
        destinatario: { id: dest.id } as any,
        asunto: asunto,
        cuerpoMensaje: cuerpo,
        leido: false,
        fechaEnvio: new Date()
      }));
      await this.messageRepo.insert(messagesToInsert);
    }
    return { success: true, total: destinatarios.length };
  }

  async getMensajesEnviados(adminId: string) {
    return await this.messageRepo.find({
      where: { remitente: { id: adminId } as any },
      relations: ['destinatario'],
      order: { fechaEnvio: 'DESC' }
    });
  }
}