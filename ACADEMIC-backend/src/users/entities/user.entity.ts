import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { School } from '../../tenants/entities/school.entity';
import { UserRole } from '../../shared/enums/user-role.enum';
import { StudentProfile } from '../../student/entities/student-profile.entity';
import { TeacherProfile } from '../../teacher/entities/teacher-profile.entity';
import { AdminProfile } from '../../admin/entities/admin-profile.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => School, (school) => school.users)
  @JoinColumn({ name: 'id_escuela' })
  school: School;

  @Column({ name: 'correo_electronico', unique: true })
  email: string;

  @Column({ name: 'contrasena', select: false }) 
  password: string;

  @Column({ name: 'nombre_completo' })
  fullName: string;

  @Column({ type: 'enum', enum: UserRole })
  rol: UserRole;

  @Column({ name: 'es_activo', default: true })
  isActive: boolean;
  
  @CreateDateColumn({ name: 'fecha_registro' })
  createdAt: Date;

  @OneToOne(() => StudentProfile, (profile) => profile.user, { cascade: true })
  studentProfile: StudentProfile;

  @OneToOne(() => TeacherProfile, (profile) => profile.user, { cascade: true })
  teacherProfile: TeacherProfile;

  @OneToOne(() => AdminProfile, (profile) => profile.user, { cascade: true })
  adminProfile: AdminProfile;
}