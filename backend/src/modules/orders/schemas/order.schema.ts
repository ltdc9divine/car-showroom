import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Car } from '../../cars/schemas/car.schema';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DEPOSITED = 'deposited',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
  car!: Types.ObjectId;

  @Prop({ required: true })
  price!: number;

  @Prop({ default: 1 })
  quantity?: number;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user!: Types.ObjectId;

  @Prop([{ type: OrderItem, required: true }])
  items!: OrderItem[];

  @Prop({ required: true })
  total!: number;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Prop({ default: null })
  notes?: string;

  @Prop({ default: null })
  deliveryDate?: Date;

  @Prop({ default: null })
  shippingAddress?: string;

  @Prop({ 
    type: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      date: { type: Date, required: true }
    }, 
    default: null 
  })
  scheduleVisit?: {
    name: string;
    phone: string;
    date: Date;
  };

}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ user: 1, createdAt: -1 });
