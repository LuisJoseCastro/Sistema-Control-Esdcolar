import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PlanSuscripcion } from '../../shared/enums/subscription-plan.enum';
import { User } from '../../users/entities/user.entity';

@Entity('escuelas') 
export class School {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nombre_escuela', type: 'text' })
  nombreEscuela: string;

  @Column({ name: 'dominio_escuela', type: 'text', unique: true })
  dominioEscuela: string;

  @Column({ name: 'correo_contacto', type: 'text' })
  correoContacto: string;
    
  @Column({
    name: 'plan_suscripcion',
    type: 'enum',
    enum: PlanSuscripcion,
    default: PlanSuscripcion.BASIC
  })
  planSuscripcion: PlanSuscripcion;

  @Column({ name: 'esta_activa', type: 'boolean', default: true })
  estaActiva: boolean;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', select: false })
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  stripeSubscriptionId: string; 

  @Column({ default: true }) 
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  stripeCustomerId: string | null;

  @OneToMany(() => User, (user) => user.school)
  users: User[];
}