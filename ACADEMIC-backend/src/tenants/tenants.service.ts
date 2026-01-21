import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm'; 
import { RegisterTenantDto } from './dtos/register-tenant.dto';
import { School } from './entities/school.entity';
import { BillingInfo } from './entities/billing-info.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../shared/enums/user-role.enum';
import { StripeService } from './stripe.service'; 
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class TenantsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly stripeService: StripeService 
  ) {}

  async registerSchool(data: RegisterTenantDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newSchool = new School();
      newSchool.nombreEscuela = data.nombreEscuela;
      newSchool.dominioEscuela = data.dominioEscuela;
      newSchool.correoContacto = data.emailAdmin;
      newSchool.planSuscripcion = data.plan as any; 
      newSchool.isActive = true; 

      let stripeCustomerId: string | null = null;
      let stripeSubscriptionId: string | null = null;

      if (data.plan === 'PRO') {
        
        if (!data.tokenPago || !data.tarjetaUltimos4 || !data.nombreTitular) {
          throw new BadRequestException('El Plan PRO requiere datos de pago completos.');
        }

        const customer = await this.stripeService.createCustomer(
          data.emailAdmin,
          data.nombreEscuela,
          data.tokenPago 
        );
        stripeCustomerId = customer.id;

        const priceId = process.env.STRIPE_PRICE_ID_PRO;
        if (!priceId) throw new BadRequestException('Configuración interna: Falta STRIPE_PRICE_ID_PRO');

        const subscription = await this.stripeService.createSubscription(
            stripeCustomerId,
            priceId
        );
        stripeSubscriptionId = subscription.id;

        newSchool.stripeCustomerId = stripeCustomerId;
        newSchool.stripeSubscriptionId = stripeSubscriptionId;
      } 

      const savedSchool = await queryRunner.manager.save(newSchool);

      if (data.plan === 'PRO') {
         const billing = new BillingInfo();
         billing.nombreTitular = data.nombreTitular || '';
         billing.ultimosDigitosTarjeta = data.tarjetaUltimos4 || '';
         billing.tokenPago = data.tokenPago || ''; 
         billing.fechaVencimiento = new Date();
         billing.direccionFiscal = 'Sin dirección registrada (MVP)';
         billing.school = savedSchool;
         
         await queryRunner.manager.save(billing);
      }

      const newUser = new User();
      newUser.fullName = data.nombreAdmin || 'Administrador'; 
      newUser.email = data.emailAdmin;
      newUser.rol = UserRole.ADMIN;
      newUser.school = savedSchool;
      
      if (!data.passwordAdmin) throw new BadRequestException('Falta password');

      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(data.passwordAdmin, salt);

      await queryRunner.manager.save(newUser);

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: data.plan === 'PRO' ? 'Suscripción PRO Activa' : 'Registro Básico Exitoso',
        schoolId: savedSchool.id,
        stripeCustomerId: stripeCustomerId, 
        stripeSubscriptionId: stripeSubscriptionId
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Error registro:", error);
      throw new BadRequestException(error.message); 
    } finally {
      await queryRunner.release();
    }
  }

  async cancelTenantSubscription(schoolId: string) {
    const school = await this.dataSource.getRepository(School).findOne({ where: { id: schoolId } });
    
    if (!school) throw new NotFoundException('Escuela no encontrada');

    if (!school.stripeSubscriptionId) {
      throw new BadRequestException('Esta escuela no tiene una suscripción activa o es Plan Básico.');
    }

    try {
      await this.stripeService.cancelSubscription(school.stripeSubscriptionId);

      school.isActive = false; 
      await this.dataSource.getRepository(School).save(school);

      return { 
        success: true, 
        message: 'Suscripción cancelada correctamente. El acceso se ha revocado.' 
      };

    } catch (error) {
      throw new BadRequestException('Error al cancelar en Stripe: ' + error.message);
    }
  }
}