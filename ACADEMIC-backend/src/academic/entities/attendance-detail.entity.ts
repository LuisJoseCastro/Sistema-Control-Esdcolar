import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { Course } from './course.entity';
import { AttendanceStatus } from '../../shared/enums/attendance-status.enum';

@Entity('detalles_asistencia')
export class AttendanceDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Enrollment)
  @JoinColumn({ name: 'id_inscripcion' })
  enrollment: Enrollment;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'id_curso' })
  course: Course;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.ASISTENCIA
  })
  estado: AttendanceStatus;
}