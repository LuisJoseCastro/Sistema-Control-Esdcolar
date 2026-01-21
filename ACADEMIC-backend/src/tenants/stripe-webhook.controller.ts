import { Controller, Post, Headers, Req, BadRequestException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './entities/school.entity';
import type { Request } from 'express';
import type { RawBodyRequest } from '@nestjs/common';

interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

@Controller('webhook')
export class StripeWebhookController {
  constructor(
    private readonly stripeService: StripeService,
    @InjectRepository(School)
    private readonly schoolRepo: Repository<School>,
  ) {}

  @Post()
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody
  ) {
    if (!signature) {
      throw new BadRequestException('Falta la firma de Stripe');
    }

    const rawBody = request.rawBody;
    if (!rawBody) {
      throw new BadRequestException('Error interno: rawBody no disponible. Revisa main.ts');
    }

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      throw new BadRequestException('Error configuración: Falta STRIPE_WEBHOOK_SECRET en .env');
    }

    let event;

    try {
      event = this.stripeService.stripeClient.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.error(` Webhook Error: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Si pasamos aquí, el evento es 100% real y viene de Stripe
    console.log(' Evento VERIFICADO de Stripe:', event.type);

    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          const invoice = event.data.object;
          // Validamos que exista subscription antes de llamar a la función
          if (invoice.subscription) {
              await this.updateSchoolStatus(invoice.subscription as string, true);
              console.log(` Pago exitoso. Escuela Activa.`);
          }
          break;

        case 'invoice.payment_failed':
          const invoiceFailed = event.data.object;
          if (invoiceFailed.subscription) {
              await this.updateSchoolStatus(invoiceFailed.subscription as string, false);
              console.log(` Pago falló. Escuela DESACTIVADA.`);
          }
          break;

        case 'customer.subscription.deleted':
          const sub = event.data.object;
          await this.updateSchoolStatus(sub.id, false);
          console.log(` Suscripción cancelada. Escuela DESACTIVADA.`);
          break;
      }
    } catch (error) {
      console.error('Error procesando lógica del webhook:', error);
    }

    return { received: true };
  }

  private async updateSchoolStatus(stripeSubscriptionId: string, isActive: boolean) {
    if (!stripeSubscriptionId) return;
    
    const school = await this.schoolRepo.findOne({ where: { stripeSubscriptionId } });
    if (school) {
      school.isActive = isActive;
      await this.schoolRepo.save(school);
    } else {
      console.log(' Webhook: No se encontró escuela vinculada a esta suscripción.');
    }
  }
}