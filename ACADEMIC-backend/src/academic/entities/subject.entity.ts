import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { School } from '../../tenants/entities/school.entity';

@Entity('materias')
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'id_escuela' })
  school: School;

  @Column()
  nombre: string; 

  @Column({ name: 'codigo_materia' })
  codigoMateria: string; 

  @Column({ type: 'int' })
  creditos: number;
}