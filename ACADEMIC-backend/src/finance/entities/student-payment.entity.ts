import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { StudentProfile } from '../../student/entities/student-profile.entity';
import { TransactionCatalog } from './transaction-catalog.entity'; 
import { PaymentStatus } from '../../shared/enums/payment-status.enum';

@Entity('pagos_alumno')
export class StudentPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StudentProfile)
  @JoinColumn({ name: 'id_alumno' })
  student: StudentProfile;

  @ManyToOne(() => TransactionCatalog, { nullable: true })
  @JoinColumn({ name: 'id_tramite' })
  transactionCatalog?: TransactionCatalog; 

  @Column()
  concepto: string; 

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @CreateDateColumn({ name: 'fecha_pago' })
  fechaPago: Date;

  @Column({ name: 'url_comprobante', nullable: true })
  urlComprobante: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDIENTE
  })
  estado: PaymentStatus;
}