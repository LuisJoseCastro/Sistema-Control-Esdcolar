import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { School } from '../../tenants/entities/school.entity';
import { Group } from './group.entity';

@Entity('ciclos_escolares')
export class AcademicPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'id_escuela' })
  school: School;

  @Column()
  nombre: string; 

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: Date;

  @Column({ name: 'es_actual', default: false })
  esActual: boolean;

  @OneToMany(() => Group, (group) => group.period)
  groups: Group[];
}