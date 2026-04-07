import { Controller, Post, Body, UseGuards, Get, Query, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private ordersService: OrdersService,
  ) {}

@Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  async createCheckoutSession(
    @Body()
    body: {
      orderId: string;
      amount: number;
      carName: string;
      userEmail: string;
      currency?: string;
    },
  ) {
    const {
      orderId,
      amount,
      carName,
      userEmail,
      currency = 'vnd',
    } = body;

    if (!orderId || !amount || !carName || !userEmail) {
      throw new Error('orderId, amount, carName, and userEmail are required');
    }

    return await this.paymentsService.createCheckoutSession(
      orderId,
      amount,
      carName,
      userEmail,
      currency,
    );
  }

  @Get('session-status')
  @UseGuards(JwtAuthGuard)
  async getSessionStatus(@Query('sessionId') sessionId: string) {
    if (!sessionId) {
      throw new Error('sessionId is required');
    }

    return await this.paymentsService.getSessionPaymentStatus(sessionId);
  }

  @Post('verify-payment')
  @UseGuards(JwtAuthGuard)
  async verifyPayment(
    @Body() body: { sessionId: string; orderId: string },
  ) {
    const { sessionId, orderId } = body;
    if (!sessionId || !orderId) {
      throw new Error('sessionId and orderId are required');
    }

    const sessionStatus = await this.paymentsService.getSessionPaymentStatus(sessionId);
    
    if (sessionStatus.status === 'paid') {
      const order = await this.ordersService.findById(orderId);
      if (order && order.status !== 'deposited') {
        await this.ordersService.handlePaymentCompleted(orderId, sessionStatus.amount);
        return { success: true, message: 'Payment verified and order updated', amount: sessionStatus.amount };
      }
      return { success: true, message: 'Payment verified, order already deposited' };
    }
    
    throw new BadRequestException('Payment not completed');
  }
}
