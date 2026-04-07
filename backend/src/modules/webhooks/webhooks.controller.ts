import { Controller, Post, Body, HttpException, HttpStatus, Headers } from '@nestjs/common';
import Stripe from 'stripe';
import { OrdersService } from '../orders/orders.service';

@Controller('api/webhooks')
export class WebhooksController {
  private stripe: Stripe;

  constructor(private ordersService: OrdersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
  }

  @Post('stripe')
  async stripeWebhook(@Body() body: any, @Headers('stripe-signature') signature: string) {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
      const event = this.stripe.webhooks.constructEvent(body, signature, webhookSecret);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        const amountTotal = session.amount_total || 0;
        const amount = session.currency === 'vnd' ? amountTotal : amountTotal / 100;
        if (orderId) {
          try {
            const existing = await this.ordersService.findById(orderId as string);
            if (existing && existing.status !== 'deposited') {
              await this.ordersService.handlePaymentCompleted(orderId as string, amount);
              console.log(`Order ${orderId} depositAmount set to ${amount} via webhook`);
            } else {
              console.log(`Order ${orderId} already deposited, skipping webhook`);
            }
          } catch (e: any) {
            console.log(`Webhook order ${orderId} not found:`, e.message);
          }
        }
      }

      return { received: true };
    } catch (err: any) {
      console.error('Webhook error:', err.message);
      throw new HttpException('Webhook error', HttpStatus.BAD_REQUEST);
    }
  }
}

