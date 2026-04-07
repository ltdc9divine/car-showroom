import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  private isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;
  }

  async create(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderDocument> {
    // Validate userId
    if (!this.isValidObjectId(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    // Convert car IDs in items to ObjectIds
    const items = createOrderDto.items.map(item => ({
      car: new Types.ObjectId(item.car),
      price: item.price,
      quantity: item.quantity || 1,
    }));

    const order = new this.orderModel({
      ...createOrderDto,
      user: new Types.ObjectId(userId),
      items,
    });
    return order.save();
  }

  async findAll(): Promise<OrderDocument[]> {
    return this.orderModel
      .find()
      .populate('user')
      .populate('items.car')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByUserId(userId: string): Promise<OrderDocument[]> {
    if (!this.isValidObjectId(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }
    
    return this.orderModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('user')
      .populate('items.car')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<OrderDocument | null> {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid order ID format');
    }
    
    const order = await this.orderModel
      .findById(id)
      .populate('user')
      .populate('items.car')
      .exec();
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderDocument | null> {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid order ID format');
    }

    const order = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .populate('user')
      .populate('items.car')
      .exec();
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
  ): Promise<OrderDocument | null> {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid order ID format');
    }

    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    )
    .populate('user')
    .populate('items.car')
    .exec();
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async delete(id: string): Promise<OrderDocument | null> {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid order ID format');
    }

    const order = await this.orderModel.findByIdAndDelete(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async getOrderStats() {
    const total = await this.orderModel.countDocuments();
    const pending = await this.orderModel.countDocuments({
      status: OrderStatus.PENDING,
    });
    const confirmed = await this.orderModel.countDocuments({
      status: OrderStatus.CONFIRMED,
    });
    const deposited = await this.orderModel.countDocuments({
      status: OrderStatus.DEPOSITED,
    });
    const completed = await this.orderModel.countDocuments({
      status: OrderStatus.COMPLETED,
    });
    const cancelled = await this.orderModel.countDocuments({
      status: OrderStatus.CANCELLED,
    });

    return { total, pending, confirmed, deposited, completed, cancelled };
  }

async scheduleVisit(id: string, visitData: {name: string, phone: string, date: Date}, userId: string): Promise<OrderDocument> {
    console.log('=== DEBUG scheduleVisit ===');
    console.log('Order ID:', id);
    console.log('UserId from token:', userId);
    
    const order = await this.findById(id);
    console.log('Found order:', !!order);
    if (order) {
      console.log('Order.user:', order.user?.toString());
      console.log('order.user.toString() === userId?', order.user?.toString() === userId);
    }
    
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    if (order.user._id.toString() !== userId) {
      console.log('AUTH FAIL: Not authorized (userId:', userId, 'vs order.user._id:', order.user._id.toString(), ')');
      throw new BadRequestException('Not authorized for this order');
    }
    if (order.status !== OrderStatus.DEPOSITED) throw new BadRequestException('Only for deposited orders');
    
    console.log('Updating scheduleVisit...');
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id, 
      { $set: { scheduleVisit: visitData } },
      { new: true }
    ).populate('user', 'items.car').exec();
    
    if (!updatedOrder) throw new NotFoundException(`Order ${id} not found`);
    console.log('Schedule visit success');
    return updatedOrder;
  }

  async handlePaymentCompleted(orderId: string, amount: number): Promise<OrderDocument | null> {
    return this.orderModel.findByIdAndUpdate(
      orderId,
      { status: OrderStatus.DEPOSITED, depositAmount: amount },
      { new: true }
    ).populate('user', 'items.car').exec();
  }
}

