import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { Course } from './course.entity';
import { EstadoCalificacion } from '../../shared/enums/grade-status.enum';

@Entity('boletas_calificaciones')
export class GradeCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Enrollment)
  @JoinColumn({ name: 'id_inscripcion' })
  enrollment: Enrollment;

  @ManyToOne(() => Course, (course) => course.gradeCards)
  @JoinColumn({ name: 'id_curso' })
  course: Course;

  @Column({ name: 'parcial_1', type: 'decimal', precision: 4, scale: 2, default: 0 })
  parcial1: number;

  @Column({ name: 'parcial_2', type: 'decimal', precision: 4, scale: 2, default: 0 })
  parcial2: number;

  @Column({ name: 'parcial_3', type: 'decimal', precision: 4, scale: 2, default: 0 })
  parcial3: number;

  @Column({ name: 'promedio_final', type: 'decimal', precision: 4, scale: 2, default: 0 })
  promedioFinal: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  extraordinario: number | null;

  @Column({ name: 'porcentaje_asistencia_global', type: 'int', default: 0 })
  porcentajeAsistenciaGlobal: number;

  @Column({
    type: 'enum',
    enum: EstadoCalificacion,
    default: EstadoCalificacion.NA
  })
  estado: EstadoCalificacion;

  @Column({ type: 'text', nullable: true })
  observaciones: string;
}