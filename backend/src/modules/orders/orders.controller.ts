import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { OrderStatus } from './schemas/order.schema';

@Controller('api/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req: ExpressRequest, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create((req as any).user.sub, createOrderDto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@Request() req: ExpressRequest) {
    return this.ordersService.findByUserId((req as any).user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getStats() {
    return this.ordersService.getOrderStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    console.log('UPDATE order', id, updateOrderDto);
    // Auto set status to deposited when depositAmount is set
    const updateData = { ...updateOrderDto };
    if ((updateOrderDto as any).depositAmount && (updateOrderDto as any).depositAmount > 0) {
      updateData.status = OrderStatus.DEPOSITED;
      console.log('Auto set deposited');
    }
    const result = await this.ordersService.update(id, updateData);
    console.log('UPDATE result', result);
    return result;
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  @Post(':id/schedule-visit')
  @UseGuards(JwtAuthGuard)
  async scheduleVisit(
    @Param('id') id: string,
    @Body() body: { name: string, phone: string, date: string },
    @Request() req: ExpressRequest,
  ) {
    const visitData = {
      name: body.name,
      phone: body.phone,
      date: new Date(body.date),
    };
    return this.ordersService.scheduleVisit(id, visitData, (req as any).user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }
}

