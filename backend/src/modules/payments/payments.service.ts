import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(
    orderId: string,
    amount: number,
    carName: string,
    userEmail: string,
    currency: string = 'vnd',
  ) {
    try {
      const unitAmount = currency.toLowerCase() === 'vnd' ? Math.round(amount) : Math.round(amount * 100);

const frontendUrl = process.env.FRONTEND_URL || 'https://car-showroom-frontend-one.vercel.app';

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: `Đặt cọc xe: ${carName}`,
                description: `Tiền đặt cọc 0.01% - Đơn hàng: ${orderId}`,
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${frontendUrl}/orders?payment=success&sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/orders?payment=cancelled`,
        customer_email: userEmail,
        metadata: {
          orderId: orderId,
          type: 'deposit',
          depositPercent: '0.01%',
        },
      });

      return {
        checkoutUrl: session.url,
        sessionId: session.id,
        amount: amount,
        status: session.payment_status,
      };
    } catch (error: any) {
      throw new BadRequestException(
        `Failed to create checkout session: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  async retrieveSession(sessionId: string) {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch (error: any) {
      throw new BadRequestException(
        `Failed to retrieve session: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  async getSessionPaymentStatus(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      return {
        status: session.payment_status,
        paymentIntent: session.payment_intent,
        amount: session.amount_total ? (session.currency === 'vnd' ? session.amount_total : session.amount_total / 100) : 0,
        currency: session.currency,
        orderId: session.metadata?.orderId,
        sessionId: session.id,
      };
    } catch (error: any) {
      throw new BadRequestException(
        `Failed to get session status: ${error?.message || 'Unknown error'}`,
      );
    }
  }
}
