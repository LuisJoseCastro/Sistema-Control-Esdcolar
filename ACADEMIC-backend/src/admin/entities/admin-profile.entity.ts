import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('perfiles_admin')
export class AdminProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @Column({ default: 'Dirección General' }) 
  departamento: string; 

  @Column({ default: 'Director' })
  puesto: string;
}