import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { StudentProfile } from '../../student/entities/student-profile.entity';
import { Group } from './group.entity';
import { EnrollmentStatus } from '../../shared/enums/enrollment-status.enum';

@Entity('inscripciones')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StudentProfile)
  @JoinColumn({ name: 'id_alumno' })
  student: StudentProfile;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'id_grupo' })
  group: Group;

  @CreateDateColumn({ name: 'fecha_inscripcion' })
  fechaInscripcion: Date;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVO
  })
  estado: EnrollmentStatus;
}