import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Enrollment } from '../../academic/entities/enrollment.entity';

@Entity('perfiles_alumno')
export class StudentProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.studentProfile)
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @Column({ unique: true })
  matricula: string;

  @Column({ name: 'nombre_completo', length: 150, nullable: true })
  nombreCompleto: string;

  @Column({ nullable: true })
  curp: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fechaNacimiento: Date;

  @Column({ length: 20, nullable: true })
  genero: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ name: 'nombre_tutor', length: 150, nullable: true })
  tutor: string;

  @Column({ name: 'telefono_tutor', length: 20, nullable: true })
  telefonoTutor: string;

  @Column({ name: 'grado_actual', nullable: true })
  gradoActual: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];
}