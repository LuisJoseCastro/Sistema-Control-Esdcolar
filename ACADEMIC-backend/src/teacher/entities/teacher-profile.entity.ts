import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../academic/entities/course.entity';

@Entity('perfiles_docente')
export class TeacherProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.teacherProfile)
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @Column({ name: 'clave_empleado', unique: true, nullable: true }) 
  claveEmpleado: string;

  @Column({ nullable: true })
  especialidad: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ name: 'titulo_academico', nullable: true })
  tituloAcademico: string;

  @Column({ nullable: true })
  ciudad: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ type: 'text', nullable: true })
  habilidades: string;

  @Column({ type: 'json', nullable: true })
  materiasAsignadas: any;

  @Column({ type: 'json', nullable: true })
  horario: any;

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];
}