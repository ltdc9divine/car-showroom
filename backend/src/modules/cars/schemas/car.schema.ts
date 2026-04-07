import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Brand } from '../../brands/schemas/brand.schema';

export type CarDocument = Car & Document;

@Schema({ timestamps: true })
export class Car {
  @Prop({ required: true })
  name!: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Brand',
    required: true,
  })
  brand!: Brand;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  year!: number;

  @Prop({ required: true })
  mileage!: number;

  @Prop({
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    required: true,
  })
  fuel!: string;

  @Prop([String])
  images!: string[];

  @Prop({ type: [String], default: [] })
  interiorImages!: string[];

  @Prop({ type: [String], default: [] })
  angleImages!: string[];

  @Prop()
  description?: string;

  @Prop({ default: '#d4af37' })
  color?: string;

  @Prop({ default: 0 })
  rating?: number;

  @Prop({ default: 0 })
  reviews?: number;

  @Prop({ default: true })
  isAvailable!: boolean;
}

export const CarSchema = SchemaFactory.createForClass(Car);

// Index for search optimization
CarSchema.index({ name: 'text', description: 'text' });
CarSchema.index({ brand: 1, price: 1, year: 1, fuel: 1 });
