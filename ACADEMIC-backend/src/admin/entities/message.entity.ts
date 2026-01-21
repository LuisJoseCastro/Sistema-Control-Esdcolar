import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { School } from '../../tenants/entities/school.entity';
import { User } from '../../users/entities/user.entity';

@Entity('mensajes_globales')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  destinatario: string; 

  @Column()
  asunto: string;

  @Column('text')
  cuerpo: string;

  @CreateDateColumn()
  fechaEnvio: Date;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'schoolId' })
  school: School;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;
}