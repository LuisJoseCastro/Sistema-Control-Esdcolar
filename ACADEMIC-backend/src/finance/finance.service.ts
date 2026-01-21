import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionCatalog } from './entities/transaction-catalog.entity';
import { StudentPayment } from './entities/student-payment.entity';
import { School } from '../tenants/entities/school.entity';
import { PaymentStatus } from '../shared/enums/payment-status.enum';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(TransactionCatalog)
    private readonly catalogRepo: Repository<TransactionCatalog>,

    @InjectRepository(StudentPayment)
    private readonly paymentRepo: Repository<StudentPayment>,
  ) { }

  async createConcept(data: any, schoolId: string) {
    const newConcept = this.catalogRepo.create({
      ...data,
      school: { id: schoolId } as School
    });
    return this.catalogRepo.save(newConcept);
  }

  async findAll(schoolId: string) {
    return this.catalogRepo.find({
      where: { school: { id: schoolId } }
    });
  }


  async getStudentPaymentHistory(studentId: string) {
    const payments = await this.paymentRepo.find({
      where: {
        student: { id: studentId },
        estado: PaymentStatus.APROBADO
      },
      order: { fechaPago: 'DESC' }
    });

    return payments.map(p => ({
      fecha: p.fechaPago.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      concepto: p.concepto,
      monto: p.monto,
      estado: 'Pagado'
    }));
  }

  async getStudentPendingPayments(studentId: string) {
    const pending = await this.paymentRepo.find({
      where: {
        student: { id: studentId },
        estado: PaymentStatus.PENDIENTE
      },
      order: { fechaPago: 'DESC' }
    });

    return pending.map(p => ({
      fecha: p.fechaPago.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      concepto: p.concepto,
      pago: p.monto
    }));
  }

  async getCatalogNames(schoolId: string) {
    const items = await this.catalogRepo.find({
      where: { school: { id: schoolId } },
      select: ['nombreTramite']
    });
    return items.map(i => i.nombreTramite);
  }
}