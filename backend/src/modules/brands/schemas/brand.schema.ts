import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ default: null })
  logo?: string;

  @Prop({ default: null })
  description?: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
