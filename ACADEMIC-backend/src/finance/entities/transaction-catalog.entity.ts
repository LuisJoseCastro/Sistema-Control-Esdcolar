import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { School } from '../../tenants/entities/school.entity';

@Entity('catalogo_tramites')
export class TransactionCatalog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'id_escuela' })
  school: School;

  @Column({ name: 'nombre_tramite' })
  nombreTramite: string; 

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'costo' })
  costo: number; 
}