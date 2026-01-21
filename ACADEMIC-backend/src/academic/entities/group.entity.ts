import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AcademicPeriod } from './academic-period.entity';

@Entity('grupos')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AcademicPeriod, (period) => period.groups)
  @JoinColumn({ name: 'id_ciclo' })
  period: AcademicPeriod;

  @Column()
  nombre: string; 

  @Column({ type: 'int' })
  semestre: number;

  @Column({ name: 'limite_alumnos', type: 'int' })
  limiteAlumnos: number;
}