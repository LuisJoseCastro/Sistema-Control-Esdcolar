import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-06-20' as any,
    });
  }

  async createCustomer(email: string, name: string, tokenPago: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email: email,
        name: name,
        source: tokenPago, 
        description: 'Cliente registrado desde Academic SaaS',
      });
      return customer;
    } catch (error) {
      console.error('Error creando cliente Stripe:', error);
      throw new InternalServerErrorException(`Error Stripe Customer: ${error.message}`);
    }
  }

  async createSubscription(customerId: string, priceId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }], 
        expand: ['latest_invoice.payment_intent'], 
      });
      return subscription;
    } catch (error) {
      console.error('Error creando suscripción Stripe:', error);
      throw new InternalServerErrorException(`Error Stripe Subscription: ${error.message}`);
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.cancel(subscriptionId);
    } catch (error) {
      console.error('Error Cancelando Suscripción:', error);
      throw new InternalServerErrorException(error.message);
    }
  }
  
  get stripeClient() {
    return this.stripe;
  }
}