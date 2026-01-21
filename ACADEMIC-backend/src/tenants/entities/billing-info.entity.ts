import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { School } from './school.entity';

@Entity('datos_facturacion_saas')
export class BillingInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => School)
  @JoinColumn({ name: 'id_escuela' }) 
  school: School;

  @Column({ name: 'nombre_titular' })
  nombreTitular: string;

  @Column({ name: 'ultimos_digitos_tarjeta', length: 4 })
  ultimosDigitosTarjeta: string;

  @Column({ name: 'token_pago' }) 
  tokenPago: string;

  @Column({ name: 'fecha_vencimiento', type: 'date' })
  fechaVencimiento: Date;

  @Column({ name: 'direccion_fiscal', type: 'text' })
  direccionFiscal: string;
}